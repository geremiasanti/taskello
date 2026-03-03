import React, { useState } from "react"
import { useBoardStore } from "../stores/boardStore"
import Avatar from "./ui/Avatar"
import Button from "./ui/Button"
import Input from "./ui/Input"

export default function MembersList({ board, isCreator }) {
  const [username, setUsername] = useState("")
  const [adding, setAdding] = useState(false)
  const addMember = useBoardStore((s) => s.addMember)
  const removeMember = useBoardStore((s) => s.removeMember)

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!username.trim()) return
    setAdding(true)
    try {
      await addMember(board.id, username)
      setUsername("")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      <div className="space-y-2 mb-4">
        {board.members?.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar user={member} size="sm" />
              <span className="text-sm text-[var(--color-text)]">{member.username}</span>
              {member.id === board.creator_id && (
                <span className="text-xs text-[var(--color-text-muted)]">(owner)</span>
              )}
            </div>
            {isCreator && member.id !== board.creator_id && (
              <Button variant="ghost" size="sm" onClick={() => removeMember(board.id, member.id)}>
                Remove
              </Button>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username to invite..."
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={adding}>Add</Button>
      </form>
    </div>
  )
}
