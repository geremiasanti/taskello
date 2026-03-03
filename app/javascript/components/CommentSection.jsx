import React, { useState, useRef } from "react"
import api from "../lib/api"
import Button from "./ui/Button"
import Avatar from "./ui/Avatar"
import RichTextEditor from "./ui/RichTextEditor"
import { useAuthStore } from "../stores/authStore"

export default function CommentSection({ card, board, onRefresh }) {
  const [body, setBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const user = useAuthStore((s) => s.user)
  const editorRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = body.replace(/<p><\/p>/g, "").trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      await api.post(`/cards/${card.id}/comments`, { comment: { body } })
      setBody("")
      editorRef.current?.clear()
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
              <div
                className="rendered-html text-sm text-[var(--color-text)] mt-0.5"
                dangerouslySetInnerHTML={{ __html: comment.body }}
              />
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <RichTextEditor
          ref={editorRef}
          content=""
          onChange={setBody}
          placeholder="Write a comment... (type @ to mention)"
          members={board?.members}
          toolbar={false}
          minHeight="40px"
        />
        <div className="mt-1 flex justify-end">
          <Button type="submit" size="sm" disabled={submitting}>Comment</Button>
        </div>
      </form>
    </div>
  )
}
