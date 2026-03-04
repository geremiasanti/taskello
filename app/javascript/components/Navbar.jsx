import React, { useState, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import { useBoardStore } from "../stores/boardStore"
import { useUiStore } from "../stores/uiStore"
import Avatar from "./ui/Avatar"
import NotificationBell from "./NotificationBell"
import ThemeSwitcher from "./ThemeSwitcher"
import useClickOutside from "../hooks/useClickOutside"

// Trello-style board icon (3 columns)
const TrelloIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="5.5" height="18" rx="1" />
    <rect x="9.25" y="3" width="5.5" height="13" rx="1" />
    <rect x="16.5" y="3" width="5.5" height="9" rx="1" />
  </svg>
)

// Inbox / email icon
const InboxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8l10 6 10-6" />
  </svg>
)

function LayoutToggle() {
  const layout = useUiStore((s) => s.layout)
  const toggleLayout = useUiStore((s) => s.toggleLayout)
  const board = useBoardStore((s) => s.currentBoard)

  if (!board) return null

  return (
    <button
      onClick={toggleLayout}
      className="px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer flex items-center"
      title={layout === "kanban" ? "Switch to email layout" : "Switch to kanban layout"}
    >
      {layout === "kanban" ? <InboxIcon /> : <TrelloIcon />}
    </button>
  )
}

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const board = useBoardStore((s) => s.currentBoard)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useClickOutside(useCallback(() => setMenuOpen(false), []))

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="bg-[var(--color-nav-bg)] text-[var(--color-nav-text)] h-12 px-4 flex items-center justify-between">
      <div className="flex items-center gap-1.5 min-w-0">
        <Link to="/boards" className="text-sm opacity-70 hover:opacity-100 shrink-0">
          Taskello
        </Link>
        {board && (
          <>
            <span className="text-sm opacity-40">/</span>
            <span className="text-sm font-semibold truncate">{board.name}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <LayoutToggle />
        <ThemeSwitcher />
        <NotificationBell />
        <div className="relative ml-2.5" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer
              border border-[var(--color-border)] hover:shadow-md hover:bg-white/10 transition-shadow"
          >
            <Avatar user={user} size="sm" />
            <span className="text-sm hidden sm:inline">{user?.username}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-md shadow-lg py-1 z-50 min-w-[150px]">
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)] cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
