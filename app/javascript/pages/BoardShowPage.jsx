import React, { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useBoardStore } from "../stores/boardStore"
import { useCardStore } from "../stores/cardStore"
import { useUiStore } from "../stores/uiStore"
import DndBoard from "../components/DndBoard"
import EmailLayout from "../components/EmailLayout"
import CardDetailModal from "../components/CardDetailModal"
import MembersList from "../components/MembersList"
import BoardForm from "../components/BoardForm"
import CardFilter from "../components/CardFilter"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import { useAuthStore } from "../stores/authStore"
import useBoardChannel from "../hooks/useBoardChannel"
import useKeyboardNavigation from "../hooks/useKeyboardNavigation"
import KeyboardLegend from "../components/KeyboardLegend"

const COLUMNS = ["todo", "doing", "done"]

export default function BoardShowPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const board = useBoardStore((s) => s.currentBoard)
  const fetchBoard = useBoardStore((s) => s.fetchBoard)
  const deleteBoard = useBoardStore((s) => s.deleteBoard)
  const setCurrentBoard = useBoardStore((s) => s.setCurrentBoard)
  const cards = useCardStore((s) => s.cards)
  const setCards = useCardStore((s) => s.setCards)
  const selectedCard = useCardStore((s) => s.selectedCard)
  const clearSelectedCard = useCardStore((s) => s.clearSelectedCard)
  const layout = useUiStore((s) => s.layout)
  const filterLabels = useUiStore((s) => s.filterLabels)
  const filterParticipants = useUiStore((s) => s.filterParticipants)
  const clearFilters = useUiStore((s) => s.clearFilters)
  const user = useAuthStore((s) => s.user)
  const [showEdit, setShowEdit] = useState(false)
  const [showMembers, setShowMembers] = useState(false)

  useBoardChannel(board?.id)
  const kbdEnabled = layout === "email"
    ? !showEdit && !showMembers
    : !selectedCard && !showEdit && !showMembers
  useKeyboardNavigation(kbdEnabled, { onEscapeEmpty: () => navigate("/boards") })

  useEffect(() => {
    fetchBoard(id)
    return () => {
      setCurrentBoard(null)
      clearFilters()
    }
  }, [id])

  useEffect(() => {
    if (board?.cards) setCards(board.cards)
  }, [board?.cards])

  // Close open card when switching from email to kanban
  useEffect(() => {
    if (layout === "kanban" && selectedCard) clearSelectedCard()
  }, [layout])

  const applyFilters = useCallback((cardsList) => {
    let filtered = cardsList
    if (filterLabels.length > 0) {
      filtered = filtered.filter((c) =>
        c.labels?.some((l) => filterLabels.includes(l.id))
      )
    }
    if (filterParticipants.length > 0) {
      filtered = filtered.filter((c) =>
        c.participants?.some((p) => filterParticipants.includes(p.id))
      )
    }
    return filtered
  }, [filterLabels, filterParticipants])

  const columnCards = useCallback((col) => {
    const colCards = cards.filter((c) => c.column === col).sort((a, b) => a.position - b.position)
    return applyFilters(colCards)
  }, [cards, applyFilters])

  if (!board) {
    return <div className="p-8 text-[var(--color-text-secondary)]">Loading board...</div>
  }

  const isCreator = board.creator_id === user?.id

  const handleDelete = async () => {
    if (confirm("Delete this board?")) {
      await deleteBoard(board.id)
      navigate("/boards")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[var(--color-text)] leading-tight">{board.name}</h1>
            <CardFilter board={board} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowMembers(true)}>
              Members ({board.members?.length || 0})
            </Button>
            {isCreator && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setShowEdit(true)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {layout === "kanban" ? (
        <DndBoard columns={COLUMNS} columnCards={columnCards} board={board} />
      ) : (
        <EmailLayout columns={COLUMNS} columnCards={columnCards} board={board} />
      )}

      {layout === "kanban" && selectedCard && (
        <CardDetailModal card={selectedCard} board={board} onClose={clearSelectedCard} />
      )}

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit board">
        <BoardForm board={board} onSuccess={() => setShowEdit(false)} />
      </Modal>

      <Modal isOpen={showMembers} onClose={() => setShowMembers(false)} title="Members">
        <MembersList board={board} isCreator={isCreator} />
      </Modal>

      <KeyboardLegend />
    </div>
  )
}
