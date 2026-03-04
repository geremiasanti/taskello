import React, { useEffect, useState, useCallback } from "react"
import api from "../lib/api"
import { useCardStore } from "../stores/cardStore"
import CardDetailContent from "./CardDetailContent"

export default function CardDetailPanel({ card, board }) {
  const [fullCard, setFullCard] = useState(null)
  const updateCard = useCardStore((s) => s.updateCard)
  const deleteCard = useCardStore((s) => s.deleteCard)
  const clearSelectedCard = useCardStore((s) => s.clearSelectedCard)

  const refresh = useCallback(() => {
    api.get(`/cards/${card.id}`).then(setFullCard)
  }, [card.id])

  useEffect(() => {
    refresh()
  }, [card.id])

  // Listen for real-time comment updates
  useEffect(() => {
    const handleComment = (e) => {
      if (e.detail.card_id === card.id) refresh()
    }
    const handleCommentDeleted = (e) => {
      if (e.detail.card_id === card.id) refresh()
    }
    window.addEventListener("cable:comment", handleComment)
    window.addEventListener("cable:comment_deleted", handleCommentDeleted)
    return () => {
      window.removeEventListener("cable:comment", handleComment)
      window.removeEventListener("cable:comment_deleted", handleCommentDeleted)
    }
  }, [card.id, refresh])

  const handleDelete = async () => {
    await deleteCard(card.id)
    clearSelectedCard()
  }

  return (
    <div className="p-6">
      {fullCard ? (
        <CardDetailContent
          card={fullCard}
          board={board}
          onUpdate={(data) => updateCard(card.id, data)}
          onDelete={handleDelete}
          onRefresh={refresh}
        />
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
      )}
    </div>
  )
}
