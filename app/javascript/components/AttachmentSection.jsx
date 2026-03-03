import React, { useState, useRef } from "react"
import api from "../lib/api"
import Button from "./ui/Button"

export default function AttachmentSection({ card, onRefresh }) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [showLinkForm, setShowLinkForm] = useState(false)
  const fileRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append("attachment[file]", file)
    formData.append("attachment[attachment_type]", "file")
    await api.upload(`/cards/${card.id}/attachments`, formData)
    onRefresh()
  }

  const handleAddLink = async (e) => {
    e.preventDefault()
    if (!linkUrl.trim()) return
    await api.post(`/cards/${card.id}/attachments`, {
      attachment: { attachment_type: "link", url: linkUrl, link_text: linkText || linkUrl },
    })
    setLinkUrl("")
    setLinkText("")
    setShowLinkForm(false)
    onRefresh()
  }

  const handleDelete = async (id) => {
    await api.delete(`/cards/${card.id}/attachments/${id}`)
    onRefresh()
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">Attachments</h3>

      <div className="space-y-2 mb-3">
        {card.attachments?.map((att) => (
          <div key={att.id} className="flex items-center justify-between text-sm p-2 rounded
            bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
            <div>
              {att.attachment_type === "link" ? (
                <a href={att.url} target="_blank" rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline">
                  {att.link_text || att.url}
                </a>
              ) : (
                <a href={att.url} target="_blank" rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:underline">
                  {att.filename || "File"}
                </a>
              )}
              <span className="text-xs text-[var(--color-text-muted)] ml-2">by {att.user.username}</span>
            </div>
            <button onClick={() => handleDelete(att.id)}
              className="text-xs text-[var(--color-danger)] hover:underline cursor-pointer">
              remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input ref={fileRef} type="file" className="hidden" onChange={handleFileUpload} />
        <Button size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>Upload file</Button>
        <Button size="sm" variant="secondary" onClick={() => setShowLinkForm(!showLinkForm)}>Add link</Button>
      </div>

      {showLinkForm && (
        <form onSubmit={handleAddLink} className="mt-2 flex gap-2">
          <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="URL"
            className="flex-1 px-2 py-1 text-sm bg-[var(--color-input-bg)] text-[var(--color-text)]
              border border-[var(--color-input-border)] rounded-md" required />
          <input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Label (optional)"
            className="w-32 px-2 py-1 text-sm bg-[var(--color-input-bg)] text-[var(--color-text)]
              border border-[var(--color-input-border)] rounded-md" />
          <Button type="submit" size="sm">Add</Button>
        </form>
      )}
    </div>
  )
}
