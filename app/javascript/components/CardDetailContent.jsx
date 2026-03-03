import React, { useState } from "react"
import Button from "./ui/Button"
import CommentSection from "./CommentSection"
import AttachmentSection from "./AttachmentSection"
import LabelPicker from "./LabelPicker"
import ParticipantsList from "./ParticipantsList"

export default function CardDetailContent({ card, board, onUpdate, onDelete, onRefresh }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || "")

  const handleSave = async () => {
    await onUpdate({ title, description })
    setEditing(false)
    onRefresh()
  }

  return (
    <div className="space-y-4">
      {editing ? (
        <div className="space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-2 py-1 text-base font-semibold bg-[var(--color-input-bg)]
              text-[var(--color-text)] border border-[var(--color-input-border)] rounded-md"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Add a description..."
            className="w-full px-2 py-1 text-sm bg-[var(--color-input-bg)]
              text-[var(--color-text)] border border-[var(--color-input-border)] rounded-md"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-muted)] mb-1">
                in <span className="font-medium">{card.column}</span>
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={onDelete}>Delete</Button>
            </div>
          </div>
          {card.description && (
            <p className="text-sm text-[var(--color-text)] mt-2 whitespace-pre-wrap">{card.description}</p>
          )}
        </div>
      )}

      <div className="border-t border-[var(--color-border)] pt-3">
        <LabelPicker card={card} board={board} onRefresh={onRefresh} />
      </div>

      <div className="border-t border-[var(--color-border)] pt-3">
        <ParticipantsList card={card} board={board} onRefresh={onRefresh} />
      </div>

      <div className="border-t border-[var(--color-border)] pt-3">
        <AttachmentSection card={card} onRefresh={onRefresh} />
      </div>

      <div className="border-t border-[var(--color-border)] pt-3">
        <CommentSection card={card} onRefresh={onRefresh} />
      </div>
    </div>
  )
}
