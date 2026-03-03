import React, { useState } from "react"
import api from "../lib/api"
import Button from "./ui/Button"

export default function LabelPicker({ card, board, onRefresh }) {
  const [showPicker, setShowPicker] = useState(false)
  const [newLabelName, setNewLabelName] = useState("")
  const [creating, setCreating] = useState(false)

  const cardLabelIds = card.labels?.map((l) => l.id) || []

  const toggleLabel = async (label) => {
    if (cardLabelIds.includes(label.id)) {
      const cardLabel = card.labels.find((l) => l.id === label.id)
      await api.delete(`/cards/${card.id}/card_labels/${label.id}`)
    } else {
      await api.post(`/cards/${card.id}/card_labels`, { label_id: label.id })
    }
    onRefresh()
  }

  const createLabel = async (e) => {
    e.preventDefault()
    if (!newLabelName.trim()) return
    setCreating(true)
    try {
      const label = await api.post(`/boards/${board.id}/labels`, { label: { name: newLabelName } })
      await api.post(`/cards/${card.id}/card_labels`, { label_id: label.id })
      setNewLabelName("")
      onRefresh()
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Labels</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowPicker(!showPicker)}>
          {showPicker ? "Close" : "Edit"}
        </Button>
      </div>

      <div className="flex gap-1 flex-wrap mb-2">
        {card.labels?.map((label) => (
          <span key={label.id} className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: label.color }}>
            {label.name}
          </span>
        ))}
        {(!card.labels || card.labels.length === 0) && (
          <span className="text-xs text-[var(--color-text-muted)]">No labels</span>
        )}
      </div>

      {showPicker && (
        <div className="border border-[var(--color-border)] rounded-md p-2 bg-[var(--color-bg-secondary)]">
          <div className="space-y-1 mb-2">
            {board.labels?.map((label) => (
              <button key={label.id} onClick={() => toggleLabel(label)}
                className={`flex items-center gap-2 w-full px-2 py-1 rounded text-sm cursor-pointer
                  hover:bg-[var(--color-bg-tertiary)]
                  ${cardLabelIds.includes(label.id) ? "font-medium" : ""}`}>
                <span className="w-4 h-4 rounded" style={{ backgroundColor: label.color }} />
                <span className="text-[var(--color-text)]">{label.name}</span>
                {cardLabelIds.includes(label.id) && <span className="ml-auto text-[var(--color-primary)]">&check;</span>}
              </button>
            ))}
          </div>
          <form onSubmit={createLabel} className="flex gap-1">
            <input value={newLabelName} onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="New label..."
              className="flex-1 px-2 py-1 text-xs bg-[var(--color-input-bg)] text-[var(--color-text)]
                border border-[var(--color-input-border)] rounded" />
            <Button type="submit" size="sm" disabled={creating}>Create</Button>
          </form>
        </div>
      )}
    </div>
  )
}
