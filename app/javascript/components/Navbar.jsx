import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import { useUiStore } from "../stores/uiStore"
import { useNotificationStore } from "../stores/notificationStore"
import Avatar from "./ui/Avatar"
import NotificationBell from "./NotificationBell"
import ThemeSwitcher from "./ThemeSwitcher"

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="bg-[var(--color-nav-bg)] text-[var(--color-nav-text)] h-12 px-4 flex items-center justify-between">
      <Link to="/boards" className="font-semibold text-base hover:opacity-80">
        Taskello
      </Link>

      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <NotificationBell />
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 cursor-pointer">
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
