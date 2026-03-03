import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useBoardStore } from "../stores/boardStore"
import { useCardStore } from "../stores/cardStore"
import { useUiStore } from "../stores/uiStore"
import DndBoard from "../components/DndBoard"
import EmailLayout from "../components/EmailLayout"
import CardDetailModal from "../components/CardDetailModal"
import MembersList from "../components/MembersList"
import BoardForm from "../components/BoardForm"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import { useAuthStore } from "../stores/authStore"

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
  const toggleLayout = useUiStore((s) => s.toggleLayout)
  const user = useAuthStore((s) => s.user)
  const [showEdit, setShowEdit] = useState(false)
  const [showMembers, setShowMembers] = useState(false)

  useEffect(() => {
    fetchBoard(id)
    return () => setCurrentBoard(null)
  }, [id])

  useEffect(() => {
    if (board?.cards) setCards(board.cards)
  }, [board?.cards])

  if (!board) {
    return <div className="p-6 text-[var(--color-text-secondary)]">Loading board...</div>
  }

  const isCreator = board.creator_id === user?.id

  const handleDelete = async () => {
    if (confirm("Delete this board?")) {
      await deleteBoard(board.id)
      navigate("/boards")
    }
  }

  const columnCards = (col) => cards.filter((c) => c.column === col).sort((a, b) => a.position - b.position)

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-[var(--color-text)]">{board.name}</h1>
          <Button variant="ghost" size="sm" onClick={() => setShowMembers(true)}>
            Members ({board.members?.length || 0})
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLayout}>
            {layout === "kanban" ? "Email layout" : "Kanban layout"}
          </Button>
          {isCreator && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowEdit(true)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={handleDelete}>Delete</Button>
            </>
          )}
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
    </div>
  )
}
