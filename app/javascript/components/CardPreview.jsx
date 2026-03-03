import React from "react"
import { useCardStore } from "../stores/cardStore"
import { useUiStore } from "../stores/uiStore"

export default function CardPreview({ card }) {
  const selectCard = useCardStore((s) => s.selectCard)
  const cursor = useUiStore((s) => s.cursor)

  return (
    <div
      onClick={() => selectCard(card)}
      className="p-3 rounded-md border border-[var(--color-border)] bg-[var(--color-card-bg)]
        cursor-pointer hover:shadow-md transition-shadow
        shadow-sm"
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
            <span key={p.id} className="w-5 h-5 rounded-full bg-[var(--color-bg-tertiary)] text-[10px] flex items-center justify-center text-[var(--color-text-secondary)]">
              {p.username[0].toUpperCase()}
            </span>
          ))}
          {card.participants.length > 3 && (
            <span className="text-xs text-[var(--color-text-muted)]">+{card.participants.length - 3}</span>
          )}
        </div>
      )}
    </div>
  )
}
