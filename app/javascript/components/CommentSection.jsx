import React, { useState } from "react"
import api from "../lib/api"
import Button from "./ui/Button"
import Avatar from "./ui/Avatar"
import { useAuthStore } from "../stores/authStore"

export default function CommentSection({ card, onRefresh }) {
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const user = useAuthStore((s) => s.user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    try {
      await api.post(`/cards/${card.id}/comments`, { comment: { body } })
      setBody("")
      onRefresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    await api.delete(`/cards/${card.id}/comments/${commentId}`)
    onRefresh()
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Comments</h3>

      <div className="space-y-3 mb-3">
        {card.comments?.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <Avatar user={comment.user} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-text)]">{comment.user.username}</span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
                {comment.user.id === user?.id && (
                  <button onClick={() => handleDelete(comment.id)} className="text-xs text-[var(--color-danger)] hover:underline cursor-pointer">
                    delete
                  </button>
                )}
              </div>
              <p className="text-sm text-[var(--color-text)] mt-0.5 whitespace-pre-wrap">{comment.body}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment... (use @username to mention)"
          className="flex-1 px-2 py-1 text-sm bg-[var(--color-input-bg)] text-[var(--color-text)]
            border border-[var(--color-input-border)] rounded-md"
        />
        <Button type="submit" size="sm" disabled={submitting}>Comment</Button>
      </form>
    </div>
  )
}
