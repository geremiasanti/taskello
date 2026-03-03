import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useBoardStore } from "../stores/boardStore"
import Button from "./ui/Button"
import Input from "./ui/Input"

export default function BoardForm({ board, onSuccess }) {
  const [name, setName] = useState(board?.name || "")
  const [description, setDescription] = useState(board?.description || "")
  const [submitting, setSubmitting] = useState(false)
  const createBoard = useBoardStore((s) => s.createBoard)
  const updateBoard = useBoardStore((s) => s.updateBoard)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (board) {
        await updateBoard(board.id, { name, description })
      } else {
        const created = await createBoard({ name, description })
        navigate(`/boards/${created.id}`)
      }
      onSuccess?.()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Board name" value={name} onChange={(e) => setName(e.target.value)} className="mb-3" required />
      <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-1.5 text-sm rounded-md border bg-[var(--color-input-bg)]
            text-[var(--color-text)] border-[var(--color-input-border)]
            focus:border-[var(--color-focus-ring)] focus:ring-1 focus:ring-[var(--color-focus-ring)]"
        />
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Saving..." : board ? "Update" : "Create board"}
      </Button>
    </form>
  )
}
