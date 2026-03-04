import React, { useEffect, useState, useCallback } from "react"
import Modal from "./ui/Modal"
import api from "../lib/api"
import { useCardStore } from "../stores/cardStore"
import CardDetailContent from "./CardDetailContent"

export default function CardDetailModal({ card, board, onClose }) {
  const [fullCard, setFullCard] = useState(null)
  const updateCard = useCardStore((s) => s.updateCard)
  const deleteCard = useCardStore((s) => s.deleteCard)

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
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="" wide>
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
    </Modal>
  )
}
