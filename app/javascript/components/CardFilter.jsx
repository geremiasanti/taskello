import React, { useState, useCallback } from "react"
import { useUiStore } from "../stores/uiStore"
import Avatar from "./ui/Avatar"
import useClickOutside from "../hooks/useClickOutside"

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

export default function CardFilter({ board }) {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(useCallback(() => setOpen(false), []))
  const filterLabels = useUiStore((s) => s.filterLabels)
  const filterParticipants = useUiStore((s) => s.filterParticipants)
  const toggleFilterLabel = useUiStore((s) => s.toggleFilterLabel)
  const toggleFilterParticipant = useUiStore((s) => s.toggleFilterParticipant)
  const clearFilters = useUiStore((s) => s.clearFilters)

  const hasFilters = filterLabels.length > 0 || filterParticipants.length > 0

  if (!board) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md cursor-pointer border
          ${hasFilters
            ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10"
            : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)]"
          }`}
      >
        <FilterIcon />
        Filter
        {hasFilters && (
          <span className="ml-0.5 px-1 min-w-[16px] h-4 inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-[10px]">
            {filterLabels.length + filterParticipants.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-md shadow-lg z-50 w-64 max-h-80 overflow-y-auto">
          {hasFilters && (
            <div className="px-3 py-1.5 border-b border-[var(--color-border)]">
              <button
                onClick={clearFilters}
                className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {board.labels && board.labels.length > 0 && (
            <div className="px-3 py-2">
              <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">Labels</p>
              <div className="space-y-1">
                {board.labels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => toggleFilterLabel(label.id)}
                    className="flex items-center gap-2 w-full px-1.5 py-1 rounded text-left text-xs cursor-pointer hover:bg-[var(--color-bg-tertiary)]"
                  >
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="flex-1 text-[var(--color-text)] truncate">{label.name}</span>
                    {filterLabels.includes(label.id) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {board.members && board.members.length > 0 && (
            <div className="px-3 py-2 border-t border-[var(--color-border)]">
              <p className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-1.5">Members</p>
              <div className="space-y-1">
                {board.members.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => toggleFilterParticipant(member.id)}
                    className="flex items-center gap-2 w-full px-1.5 py-1 rounded text-left text-xs cursor-pointer hover:bg-[var(--color-bg-tertiary)]"
                  >
                    <Avatar user={member} size="sm" className="!w-5 !h-5 !text-[10px]" />
                    <span className="flex-1 text-[var(--color-text)] truncate">{member.username}</span>
                    {filterParticipants.includes(member.id) && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
