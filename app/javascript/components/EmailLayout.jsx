import React from "react"
import { useCardStore } from "../stores/cardStore"
import CardPreview from "./CardPreview"
import CardDetailPanel from "./CardDetailPanel"

const COLUMN_LABELS = { todo: "To Do", doing: "In Progress", done: "Done" }

export default function EmailLayout({ columns, columnCards, board }) {
  const selectedCard = useCardStore((s) => s.selectedCard)

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-80 border-r border-[var(--color-border)] overflow-y-auto bg-[var(--color-bg-secondary)]">
        {columns.map((col) => (
          <div key={col} className="border-b border-[var(--color-border)]">
            <div className="px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
              {COLUMN_LABELS[col]} ({columnCards(col).length})
            </div>
            <div className="px-2 pb-2 space-y-1">
              {columnCards(col).map((card) => (
                <CardPreview key={card.id} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedCard ? (
          <CardDetailPanel card={selectedCard} board={board} />
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--color-text-muted)]">
            Select a card to view details
          </div>
        )}
      </div>
    </div>
  )
}
