import React, { useState } from "react"
import { useCardStore } from "../stores/cardStore"
import CardPreview from "./CardPreview"
import CardForm from "./CardForm"
import Button from "./ui/Button"

export default function KanbanColumn({ column, label, cards, board }) {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="flex-shrink-0 w-80 flex flex-col bg-[var(--color-column-bg)] rounded-lg">
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {label} <span className="text-[var(--color-text-muted)] font-normal ml-1">{cards.length}</span>
        </h3>
        <Button variant="ghost" size="sm" onClick={() => setShowForm(!showForm)}>+</Button>
      </div>

      {showForm && (
        <div className="px-2 pb-2">
          <CardForm boardId={board.id} column={column} onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
        {cards.map((card) => (
          <CardPreview key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
