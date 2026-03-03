import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useBoardStore } from "../stores/boardStore"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import BoardForm from "../components/BoardForm"

export default function BoardsIndexPage() {
  const boards = useBoardStore((s) => s.boards)
  const loading = useBoardStore((s) => s.loading)
  const fetchBoards = useBoardStore((s) => s.fetchBoards)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    fetchBoards()
  }, [])

  if (loading && boards.length === 0) {
    return <div className="p-6 text-[var(--color-text-secondary)]">Loading boards...</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Your boards</h1>
        <Button onClick={() => setShowCreate(true)}>New board</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            className="block p-4 rounded-lg border border-[var(--color-border)]
              bg-[var(--color-card-bg)] hover:border-[var(--color-primary)] transition-colors"
          >
            <h2 className="font-semibold text-[var(--color-text)] mb-1">{board.name}</h2>
            {board.description && (
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">{board.description}</p>
            )}
            <div className="flex gap-3 text-xs text-[var(--color-text-muted)]">
              <span>{board.members_count} members</span>
              <span>{board.cards_count} cards</span>
            </div>
          </Link>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create board">
        <BoardForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
