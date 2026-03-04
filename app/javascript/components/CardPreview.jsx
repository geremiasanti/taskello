import React from "react"
import { useCardStore } from "../stores/cardStore"
import { useUiStore } from "../stores/uiStore"
import Avatar from "./ui/Avatar"

export default function CardPreview({ card }) {
  const selectCard = useCardStore((s) => s.selectCard)
  const cursor = useUiStore((s) => s.cursor)

  return (
    <div
      onClick={() => selectCard(card)}
      className="card-preview p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-card-bg)]
        cursor-pointer transition-shadow shadow-md hover:shadow-lg"
      data-card-id={card.id}
    >
      {card.labels && card.labels.length > 0 && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="inline-block w-8 h-2 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>
      )}
      <p className="text-sm text-[var(--color-text)]">{card.title}</p>
      {card.participants && card.participants.length > 0 && (
        <div className="flex gap-1 mt-2">
          {card.participants.slice(0, 3).map((p) => (
            <Avatar key={p.id} user={p} size="sm" className="!w-5 !h-5 !text-[10px]" />
          ))}
          {card.participants.length > 3 && (
            <span className="text-xs text-[var(--color-text-muted)]">+{card.participants.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}
