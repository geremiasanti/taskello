import React, { useState } from "react"
import { useCardStore } from "../stores/cardStore"
import { fireConfetti } from "../hooks/useKeyboardNavigation"
import Button from "./ui/Button"

export default function CardForm({ boardId, column, card, onSuccess, onCancel }) {
  const [title, setTitle] = useState(card?.title || "")
  const [submitting, setSubmitting] = useState(false)
  const createCard = useCardStore((s) => s.createCard)
  const updateCard = useCardStore((s) => s.updateCard)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      if (card) {
        await updateCard(card.id, { title })
      } else {
        await createCard({ title, board_id: boardId, column })
        fireConfetti()
      }
      setTitle("")
      onSuccess?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-card-bg)] rounded-md border border-[var(--color-border)] p-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Card title..."
        className="w-full px-2 py-1 text-sm bg-transparent text-[var(--color-text)] border-none outline-none placeholder:text-[var(--color-text-muted)]"
        autoFocus
      />
      <div className="flex gap-2 mt-2">
        <Button type="submit" size="sm" disabled={submitting}>
          {card ? "Update" : "Add card"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </form>
  )
}
