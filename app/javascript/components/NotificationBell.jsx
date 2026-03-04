import React, { useState, useEffect, useCallback } from "react"
import { useNotificationStore } from "../stores/notificationStore"
import useClickOutside from "../hooks/useClickOutside"

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export default function NotificationBell() {
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const notifications = useNotificationStore((s) => s.notifications)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(useCallback(() => setOpen(false), []))

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)} className="relative px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer leading-none flex items-center">
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-md shadow-lg z-50 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
            <span className="text-sm font-semibold text-[var(--color-text)]">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[var(--color-primary)] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="p-3 text-sm text-[var(--color-text-muted)]">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => { if (!n.read) markAsRead(n.id) }}
                className={`px-3 py-2 text-sm border-b border-[var(--color-border-subtle)] cursor-pointer
                  hover:bg-[var(--color-bg-secondary)]
                  ${n.read ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)] bg-[var(--color-bg-secondary)]"}`}
              >
                <span className="font-medium">{n.actor_username}</span>{" "}
                {n.notification_type === "mention" && "mentioned you"}
                {n.notification_type === "participant_added" && "added you to a card"}
                {n.notification_type === "comment" && "commented on a card"}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
