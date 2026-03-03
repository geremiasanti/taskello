import React, { useEffect, useState } from "react"
import api from "../lib/api"
import { useCardStore } from "../stores/cardStore"
import CardDetailContent from "./CardDetailContent"

export default function CardDetailPanel({ card, board }) {
  const [fullCard, setFullCard] = useState(null)
  const updateCard = useCardStore((s) => s.updateCard)
  const deleteCard = useCardStore((s) => s.deleteCard)
  const clearSelectedCard = useCardStore((s) => s.clearSelectedCard)

  useEffect(() => {
    api.get(`/cards/${card.id}`).then(setFullCard)
  }, [card.id])

  const handleDelete = async () => {
    await deleteCard(card.id)
    clearSelectedCard()
  }

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">{card.title}</h2>
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
    </div>
  )
}
