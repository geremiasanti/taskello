import React, { useState, useRef, useEffect } from "react"
import api from "../lib/api"
import Avatar from "./ui/Avatar"

export default function ParticipantsList({ card, board, onRefresh }) {
  const [query, setQuery] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef(null)

  const participantIds = card.participants?.map((p) => p.id) || []
  const available = (board?.members || []).filter(
    (m) => !participantIds.includes(m.id) && m.username.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    setHighlightIndex(0)
  }, [query])

  useEffect(() => {
    if (showInput) inputRef.current?.focus()
  }, [showInput])

  const addParticipant = async (userId) => {
    try {
      await api.post(`/cards/${card.id}/participants`, { user_id: userId })
      setQuery("")
      onRefresh()
    } catch { /* already participant */ }
  }

  const removeParticipant = async (userId) => {
    await api.delete(`/cards/${card.id}/participants/${userId}`)
    onRefresh()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault()
      if (available[highlightIndex]) {
        addParticipant(available[highlightIndex].id)
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((i) => Math.min(i + 1, available.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Escape") {
      setShowInput(false)
      setQuery("")
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Participants</h3>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-2">
        {card.participants?.map((p) => (
          <div key={p.id} className="flex items-center gap-1 px-2 py-0.5 rounded-full
            bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
            <Avatar user={p} size="sm" />
            <span className="text-xs text-[var(--color-text)]">{p.username}</span>
            <button onClick={() => removeParticipant(p.id)}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] cursor-pointer ml-0.5">
              &times;
            </button>
          </div>
        ))}
      </div>

      {!showInput ? (
        <button
          onClick={() => setShowInput(true)}
          className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
        >
          + Add participant
        </button>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => { setShowInput(false); setQuery("") }, 150)}
            placeholder="Type username..."
            className="w-full px-2 py-1 text-sm bg-[var(--color-input-bg)] text-[var(--color-text)]
              border border-[var(--color-input-border)] rounded-md"
          />
          {available.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 border border-[var(--color-border)]
              rounded-md bg-[var(--color-bg-overlay)] shadow-lg z-10 max-h-40 overflow-y-auto">
              {available.map((m, i) => (
                <button
                  key={m.id}
                  onMouseDown={(e) => { e.preventDefault(); addParticipant(m.id) }}
                  className={`flex items-center gap-2 w-full px-2 py-1.5 text-sm cursor-pointer
                    ${i === highlightIndex ? "bg-[var(--color-bg-tertiary)]" : "hover:bg-[var(--color-bg-tertiary)]"}`}
                >
                  <Avatar user={m} size="sm" />
                  <span className="text-[var(--color-text)]">{m.username}</span>
                </button>
              ))}
            </div>
          )}
          {query && available.length === 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 px-2 py-1.5 text-xs text-[var(--color-text-muted)]
              border border-[var(--color-border)] rounded-md bg-[var(--color-bg-overlay)]">
              No matching members
            </div>
          )}
        </div>
      )}
    </div>
  )
}
