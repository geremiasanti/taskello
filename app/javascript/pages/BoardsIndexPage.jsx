import React, { useEffect, useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useBoardStore } from "../stores/boardStore"
import Button from "../components/ui/Button"
import Modal from "../components/ui/Modal"
import BoardForm from "../components/BoardForm"

const MOTION_KEYS = new Set(["j", "k", "h", "l", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"])

export default function BoardsIndexPage() {
  const boards = useBoardStore((s) => s.boards)
  const loading = useBoardStore((s) => s.loading)
  const fetchBoards = useBoardStore((s) => s.fetchBoards)
  const [showCreate, setShowCreate] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const navigate = useNavigate()
  const boardRefs = useRef([])

  useEffect(() => {
    fetchBoards()
  }, [])

  // Scroll focused board into view
  useEffect(() => {
    if (focusedIndex >= 0 && boardRefs.current[focusedIndex]) {
      boardRefs.current[focusedIndex].scrollIntoView?.({ block: "nearest" })
    }
  }, [focusedIndex])

  // Detect grid columns from DOM layout
  const getCols = () => {
    if (boardRefs.current.length < 2) return 1
    const first = boardRefs.current[0]
    if (!first) return 1
    const top = first.getBoundingClientRect().top
    let cols = 1
    for (let i = 1; i < boardRefs.current.length; i++) {
      if (Math.abs(boardRefs.current[i]?.getBoundingClientRect().top - top) < 2) cols++
      else break
    }
    return cols
  }

  useEffect(() => {
    if (showCreate) return

    const handleKeydown = (e) => {
      const tag = e.target.tagName.toLowerCase()
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) return

      // First motion key activates on index 0
      if (focusedIndex === -1 && MOTION_KEYS.has(e.key)) {
        e.preventDefault()
        setFocusedIndex(0)
        return
      }

      const cols = getCols()

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault()
          setFocusedIndex((i) => Math.min(i + cols, boards.length - 1))
          break
        case "k":
        case "ArrowUp":
          e.preventDefault()
          setFocusedIndex((i) => Math.max(i - cols, 0))
          break
        case "l":
        case "ArrowRight":
          e.preventDefault()
          setFocusedIndex((i) => Math.min(i + 1, boards.length - 1))
          break
        case "h":
        case "ArrowLeft":
          e.preventDefault()
          setFocusedIndex((i) => Math.max(i - 1, 0))
          break
        case "Tab":
          e.preventDefault()
          if (e.shiftKey) {
            setFocusedIndex((i) => Math.max(i - 1, 0))
          } else {
            setFocusedIndex((i) => Math.min(i + 1, boards.length - 1))
          }
          break
        case "Enter":
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < boards.length) {
            navigate(`/boards/${boards[focusedIndex].id}`)
          }
          break
        case "n":
          e.preventDefault()
          setShowCreate(true)
          break
        case "Escape":
          e.preventDefault()
          if (focusedIndex >= 0) {
            setFocusedIndex(-1)
          }
          break
      }
    }

    document.addEventListener("keydown", handleKeydown)
    return () => document.removeEventListener("keydown", handleKeydown)
  }, [boards, focusedIndex, showCreate, navigate])

  if (loading && boards.length === 0) {
    return <div className="p-6 text-[var(--color-text-secondary)]">Loading boards...</div>
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Your boards</h1>
        <Button onClick={() => setShowCreate(true)}>New board</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board, index) => (
          <Link
            key={board.id}
            to={`/boards/${board.id}`}
            ref={(el) => (boardRefs.current[index] = el)}
            className={`block p-4 rounded-lg border bg-[var(--color-card-bg)] transition-all duration-200 outline-none
              ${index === focusedIndex
                ? "border-[var(--color-focus-ring)]"
                : "border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-xl hover:-translate-y-1"
              }`}
            style={index === focusedIndex ? { boxShadow: "0 0 0 2px var(--color-focus-ring)" } : undefined}
          >
            <h2 className="font-semibold text-[var(--color-text)] mb-1">{board.name}</h2>
            {board.description && (
              <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">{board.description}</p>
            )}
            <div className="flex gap-3 text-xs text-[var(--color-text-muted)]">
              <span>{board.members_count} members</span>
              <span>{board.cards_count} cards</span>
            </div>
          </Link>
        ))}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create board">
        <BoardForm onSuccess={() => setShowCreate(false)} />
      </Modal>
    </div>
  )
}
