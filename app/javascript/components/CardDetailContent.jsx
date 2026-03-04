import React, { useState, useRef, useCallback } from "react"
import Button from "./ui/Button"
import RichTextEditor from "./ui/RichTextEditor"
import CommentSection from "./CommentSection"
import AttachmentSection from "./AttachmentSection"
import LabelPicker from "./LabelPicker"
import ParticipantsList from "./ParticipantsList"

const PencilIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
)

const TrashIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
)

const COLUMN_LABELS = { todo: "To Do", doing: "Doing", done: "Done" }

export default function CardDetailContent({ card, board, onUpdate, onDelete, onRefresh }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [title, setTitle] = useState(card.title)
  const [description, setDescription] = useState(card.description || "")
  const titleClickTimer = useRef(null)
  const descClickTimer = useRef(null)

  const handleSaveTitle = async () => {
    await onUpdate({ title })
    setEditingTitle(false)
    onRefresh()
  }

  const handleSaveDesc = async () => {
    await onUpdate({ description })
    setEditingDesc(false)
    onRefresh()
  }

  // Click-to-edit: delay to allow text selection (mousedown+drag)
  // If user clicks without selecting text, enter edit mode
  const handleTextClick = useCallback((editFn, timerRef) => {
    return (e) => {
      // Don't trigger on link clicks
      if (e.target.tagName === "A") return
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        const selection = window.getSelection()
        if (!selection || selection.isCollapsed) {
          editFn(true)
        }
      }, 200)
    }
  }, [])

  return (
    <div>
      {/* Header with colored background */}
      <div className="bg-[var(--color-bg-secondary)] rounded-t-md px-4 py-3 -mx-4 -mt-4 mb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between gap-2">
          {editingTitle ? (
            <div className="flex-1 flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveTitle(); if (e.key === "Escape") setEditingTitle(false) }}
                className="flex-1 px-2 py-1 text-base font-semibold bg-[var(--color-input-bg)]
                  text-[var(--color-text)] border border-[var(--color-input-border)] rounded-md"
              />
              <Button size="sm" onClick={handleSaveTitle}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingTitle(false)}>Cancel</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h3
                  className="text-base font-semibold text-[var(--color-text)] truncate cursor-text"
                  onClick={handleTextClick(setEditingTitle, titleClickTimer)}
                >
                  {card.title}
                </h3>
                <span className="text-xs text-[var(--color-text-muted)] shrink-0">
                  in <span className="font-medium">{COLUMN_LABELS[card.column] || card.column}</span>
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditingTitle(true)}
                  className="p-1 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                  title="Edit title"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={onDelete}
                  className="p-1 rounded hover:bg-red-100 text-[var(--color-text-muted)] hover:text-red-600 cursor-pointer dark:hover:bg-red-900/30"
                  title="Delete card"
                >
                  <TrashIcon />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Two-column layout: details left, comments right (when space allows) */}
      <div className="flex flex-col xl:flex-row xl:gap-6">
        {/* Left: card details */}
        <div className="flex-1 min-w-0">
          {/* Description */}
          <div className="mb-4">
            {editingDesc ? (
              <div className="space-y-2">
                <RichTextEditor
                  content={description}
                  onChange={setDescription}
                  placeholder="Add a description..."
                  members={board?.members}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveDesc}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingDesc(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Description</span>
                  <button
                    onClick={() => setEditingDesc(true)}
                    className="p-0.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit description"
                  >
                    <PencilIcon size={12} />
                  </button>
                </div>
                {card.description ? (
                  <div
                    className="rendered-html text-sm text-[var(--color-text)] cursor-text"
                    dangerouslySetInnerHTML={{ __html: card.description }}
                    onClick={handleTextClick(setEditingDesc, descClickTimer)}
                  />
                ) : (
                  <p
                    className="text-sm text-[var(--color-text-muted)] italic cursor-pointer hover:text-[var(--color-text)]"
                    onClick={() => setEditingDesc(true)}
                  >
                    Add a description...
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-[var(--color-border)] pt-3">
            <LabelPicker card={card} board={board} onRefresh={onRefresh} />
          </div>

          <div className="border-t border-[var(--color-border)] pt-3 mt-3">
            <ParticipantsList card={card} board={board} onRefresh={onRefresh} />
          </div>

          <div className="border-t border-[var(--color-border)] pt-3 mt-3">
            <AttachmentSection card={card} onRefresh={onRefresh} />
          </div>

          {/* Comments below on small screens */}
          <div className="xl:hidden border-t border-[var(--color-border)] pt-3 mt-3">
            <CommentSection card={card} board={board} onRefresh={onRefresh} />
          </div>
        </div>

        {/* Right: comments column (only on wide screens) */}
        <div className="hidden xl:block xl:w-80 xl:shrink-0 xl:border-l xl:border-[var(--color-border)] xl:pl-6">
          <CommentSection card={card} board={board} onRefresh={onRefresh} />
        </div>
      </div>
    </div>
  )
}
