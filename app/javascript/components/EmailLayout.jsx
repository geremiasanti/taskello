import React from "react"
import { useCardStore } from "../stores/cardStore"
import { useUiStore } from "../stores/uiStore"
import CardPreview from "./CardPreview"
import CardDetailPanel from "./CardDetailPanel"
import CardForm from "./CardForm"

const COLUMN_LABELS = { todo: "To Do", doing: "In Progress", done: "Done" }

const ChevronIcon = ({ open }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform ${open ? "rotate-90" : ""}`}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
)

function CountBadge({ count }) {
  return (
    <span className="ml-1.5 inline-flex items-center justify-center px-1.5 min-w-[20px] h-5 text-[11px] font-medium rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]">
      {count}
    </span>
  )
}

export default function EmailLayout({ columns, columnCards, board }) {
  const selectedCard = useCardStore((s) => s.selectedCard)
  const newCardColumn = useUiStore((s) => s.newCardColumn)
  const clearNewCardColumn = useUiStore((s) => s.clearNewCardColumn)
  const collapsed = useUiStore((s) => s.collapsedColumns)
  const toggleCollapsed = useUiStore((s) => s.toggleCollapsedColumn)

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="w-80 border-r border-[var(--color-border)] overflow-y-auto bg-[var(--color-bg-secondary)]">
        {columns.map((col) => (
          <div key={col} className="border-b border-[var(--color-border)]">
            <button
              onClick={() => toggleCollapsed(col)}
              data-col-header={col}
              className="w-full flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
            >
              <ChevronIcon open={!collapsed[col]} />
              {COLUMN_LABELS[col]}
              <CountBadge count={columnCards(col).length} />
            </button>
            {!collapsed[col] && (
              <>
                {newCardColumn === col && (
                  <div className="px-2 pb-2">
                    <CardForm boardId={board.id} column={col} onSuccess={clearNewCardColumn} onCancel={clearNewCardColumn} />
                  </div>
                )}
                <div className="px-2 pb-2 space-y-1">
                  {columnCards(col).map((card) => (
                    <CardPreview key={card.id} card={card} />
                  ))}
                </div>
              </>
            )}
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
