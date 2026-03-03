import React, { useEffect, useState } from "react"
import Modal from "./ui/Modal"
import api from "../lib/api"
import { useCardStore } from "../stores/cardStore"
import CardDetailContent from "./CardDetailContent"

export default function CardDetailModal({ card, board, onClose }) {
  const [fullCard, setFullCard] = useState(null)
  const updateCard = useCardStore((s) => s.updateCard)
  const deleteCard = useCardStore((s) => s.deleteCard)

  useEffect(() => {
    api.get(`/cards/${card.id}`).then(setFullCard)
  }, [card.id])

  const handleDelete = async () => {
    await deleteCard(card.id)
    onClose()
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={card.title} wide>
      {fullCard ? (
        <CardDetailContent
          card={fullCard}
          board={board}
          onUpdate={(data) => updateCard(card.id, data)}
          onDelete={handleDelete}
          onRefresh={() => api.get(`/cards/${card.id}`).then(setFullCard)}
        />
      ) : (
        <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
      )}
    </Modal>
  )
}
