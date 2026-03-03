import React, { useState } from "react"
import api from "../lib/api"
import Avatar from "./ui/Avatar"
import Button from "./ui/Button"

export default function ParticipantsList({ card, board, onRefresh }) {
  const [showAdd, setShowAdd] = useState(false)

  const participantIds = card.participants?.map((p) => p.id) || []
  const availableMembers = board.members?.filter((m) => !participantIds.includes(m.id)) || []

  const addParticipant = async (userId) => {
    await api.post(`/cards/${card.id}/participants`, { user_id: userId })
    onRefresh()
  }

  const removeParticipant = async (userId) => {
    await api.delete(`/cards/${card.id}/participants/${userId}`)
    onRefresh()
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Participants</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Close" : "Add"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {card.participants?.map((p) => (
          <div key={p.id} className="flex items-center gap-1 px-2 py-1 rounded-full
            bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
            <Avatar user={p} size="sm" />
            <span className="text-xs text-[var(--color-text)]">{p.username}</span>
            <button onClick={() => removeParticipant(p.id)}
              className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-danger)] cursor-pointer ml-1">
              &times;
            </button>
          </div>
        ))}
      </div>

      {showAdd && availableMembers.length > 0 && (
        <div className="border border-[var(--color-border)] rounded-md p-2 bg-[var(--color-bg-secondary)]">
          {availableMembers.map((m) => (
            <button key={m.id} onClick={() => addParticipant(m.id)}
              className="flex items-center gap-2 w-full px-2 py-1 rounded text-sm cursor-pointer
                hover:bg-[var(--color-bg-tertiary)]">
              <Avatar user={m} size="sm" />
              <span className="text-[var(--color-text)]">{m.username}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
