import React, { useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useCardStore } from "../stores/cardStore"
import { useUiStore } from "../stores/uiStore"
import { fireConfetti, showInsult } from "../hooks/useKeyboardNavigation"
import CardPreview from "./CardPreview"
import CardForm from "./CardForm"
import Button from "./ui/Button"

const COLUMN_LABELS = { todo: "To Do", doing: "In Progress", done: "Done" }
const COLUMN_COLORS = { todo: "#57ab5a", doing: "#d29922", done: "#539bf5" }

function SortableCard({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `card-${card.id}`,
    data: { type: "card", card },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardPreview card={card} />
    </div>
  )
}

function DroppableColumn({ column, label, cards, board }) {
  const newCardColumn = useUiStore((s) => s.newCardColumn)
  const clearNewCardColumn = useUiStore((s) => s.clearNewCardColumn)
  const showForm = newCardColumn === column
  const setShowForm = (val) => val ? useUiStore.getState().setNewCardColumn(column) : clearNewCardColumn()
  const cardIds = cards.map((c) => `card-${c.id}`)

  const { setNodeRef } = useSortable({
    id: `column-${column}`,
    data: { type: "column", column },
    disabled: true,
  })

  return (
    <div ref={setNodeRef} className="flex-1 min-w-[280px] max-w-[400px] flex flex-col bg-[var(--color-column-bg)] rounded-lg border border-[var(--color-border-subtle)] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[var(--color-border-subtle)] shrink-0">
        <h3 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLUMN_COLORS[column] }} />
          {label} <span className="text-[var(--color-text-muted)] font-normal">{cards.length}</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>+</Button>
      </div>

      {showForm && (
        <div className="px-3 py-2 border-b border-[var(--color-border-subtle)]">
          <CardForm boardId={board.id} column={column} onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto px-3 pt-3 pb-3 space-y-2 min-h-[80px]"
          data-column={column}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default function DndBoard({ columns, columnCards, board }) {
  const [activeCard, setActiveCard] = useState(null)
  const moveCard = useCardStore((s) => s.moveCard)
  const cards = useCardStore((s) => s.cards)
  const setCards = useCardStore((s) => s.setCards)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const findColumn = (id) => {
    if (typeof id === "string" && id.startsWith("column-")) return id.replace("column-", "")
    const cardId = typeof id === "string" ? parseInt(id.replace("card-", "")) : id
    const card = cards.find((c) => c.id === cardId)
    return card?.column
  }

  const [dragOriginColumn, setDragOriginColumn] = useState(null)

  const handleDragStart = (event) => {
    const { active } = event
    if (active.data.current?.type === "card") {
      setActiveCard(active.data.current.card)
      setDragOriginColumn(active.data.current.card.column)
    }
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    const activeCol = findColumn(active.id)
    let overCol = over.data.current?.type === "column"
      ? over.data.current.column
      : findColumn(over.id)

    if (!activeCol || !overCol || activeCol === overCol) return

    const cardId = parseInt(String(active.id).replace("card-", ""))
    const overCards = columnCards(overCol)
    const newPosition = overCards.length

    setCards(
      cards.map((c) => c.id === cardId ? { ...c, column: overCol, position: newPosition } : c)
    )
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveCard(null)
    if (!over) return

    const cardId = parseInt(String(active.id).replace("card-", ""))
    const card = cards.find((c) => c.id === cardId)
    if (!card) return

    let targetColumn = card.column
    let targetPosition = card.position

    if (over.data.current?.type === "column") {
      targetColumn = over.data.current.column
      targetPosition = columnCards(targetColumn).length
    } else if (over.data.current?.type === "card") {
      const overCard = over.data.current.card
      targetColumn = cards.find((c) => c.id === overCard.id)?.column || overCard.column
      const colCards = columnCards(targetColumn).filter((c) => c.id !== cardId)
      const overIndex = colCards.findIndex((c) => c.id === overCard.id)
      targetPosition = overIndex >= 0 ? overIndex : colCards.length
    }

    const COLS = ["todo", "doing", "done"]
    const originIdx = COLS.indexOf(dragOriginColumn)
    const targetIdx = COLS.indexOf(targetColumn)
    moveCard(cardId, targetColumn, targetPosition)
    if (dragOriginColumn && targetColumn !== dragOriginColumn) {
      if (targetIdx > originIdx) fireConfetti()
      else if (targetIdx < originIdx) setTimeout(() => showInsult(), 100)
    }
    setDragOriginColumn(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex justify-center gap-5 p-5 overflow-x-auto kanban-columns">
        {columns.map((col) => (
          <DroppableColumn
            key={col}
            column={col}
            label={COLUMN_LABELS[col]}
            cards={columnCards(col)}
            board={board}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-3 opacity-90">
            <CardPreview card={activeCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
