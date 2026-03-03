import React, { useState, useRef, useEffect } from "react"
import api from "../lib/api"

export default function LabelPicker({ card, board, onRefresh }) {
  const [query, setQuery] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef(null)

  const cardLabelIds = card.labels?.map((l) => l.id) || []
  const allLabels = board?.labels || []

  const filtered = allLabels.filter(
    (l) => l.name.toLowerCase().includes(query.toLowerCase())
  )

  const canCreate = query.trim() && !allLabels.some(
    (l) => l.name.toLowerCase() === query.trim().toLowerCase()
  )

  // Combined list: matching labels + create option
  const options = [
    ...filtered.map((l) => ({ type: "label", label: l, active: cardLabelIds.includes(l.id) })),
    ...(canCreate ? [{ type: "create", name: query.trim() }] : []),
  ]

  useEffect(() => {
    setHighlightIndex(0)
  }, [query])

  useEffect(() => {
    if (showInput) inputRef.current?.focus()
  }, [showInput])

  const toggleLabel = async (label) => {
    if (cardLabelIds.includes(label.id)) {
      await api.delete(`/cards/${card.id}/card_labels/${label.id}`)
    } else {
      await api.post(`/cards/${card.id}/card_labels`, { label_id: label.id })
    }
    onRefresh()
  }

  const createAndAdd = async (name) => {
    const label = await api.post(`/boards/${board.id}/labels`, { label: { name } })
    await api.post(`/cards/${card.id}/card_labels`, { label_id: label.id })
    setQuery("")
    onRefresh()
  }

  const selectOption = (option) => {
    if (option.type === "label") {
      toggleLabel(option.label)
    } else if (option.type === "create") {
      createAndAdd(option.name)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault()
      if (options[highlightIndex]) {
        selectOption(options[highlightIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Escape") {
      setShowInput(false)
      setQuery("")
    }
  }

  const removeLabel = async (labelId) => {
    await api.delete(`/cards/${card.id}/card_labels/${labelId}`)
    onRefresh()
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Labels</h3>
      </div>

      <div className="flex gap-1 flex-wrap mb-2">
        {card.labels?.map((label) => (
          <span key={label.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: label.color }}>
            {label.name}
            <button
              onClick={() => removeLabel(label.id)}
              className="hover:opacity-70 cursor-pointer"
            >&times;</button>
          </span>
        ))}
        {(!card.labels || card.labels.length === 0) && (
          <span className="text-xs text-[var(--color-text-muted)]">No labels</span>
        )}
      </div>

      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
        >
          + Add label
        </button>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => { setShowInput(false); setQuery("") }, 150)}
            placeholder="Search or create label..."
            className="w-full px-2 py-1 text-sm bg-[var(--color-input-bg)] text-[var(--color-text)]
              border border-[var(--color-input-border)] rounded-md"
          />
          {options.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 border border-[var(--color-border)]
              rounded-md bg-[var(--color-bg-overlay)] shadow-lg z-10 max-h-40 overflow-y-auto">
              {options.map((opt, i) => (
                <button
                  key={opt.type === "label" ? opt.label.id : "create"}
                  onMouseDown={(e) => { e.preventDefault(); selectOption(opt) }}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm cursor-pointer
                    ${i === highlightIndex ? "bg-[var(--color-bg-tertiary)]" : "hover:bg-[var(--color-bg-tertiary)]"}`}
                >
                  {opt.type === "label" ? (
                    <>
                      <span className="w-3 h-3 rounded shrink-0" style={{ backgroundColor: opt.label.color }} />
                      <span className="text-[var(--color-text)]">{opt.label.name}</span>
                      {opt.active && <span className="ml-auto text-[var(--color-primary)]">&check;</span>}
                    </>
                  ) : (
                    <span className="text-[var(--color-primary)]">Create &ldquo;{opt.name}&rdquo;</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
