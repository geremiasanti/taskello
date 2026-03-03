import React, { useState, useEffect } from "react"
import { useNotificationStore } from "../stores/notificationStore"

export default function NotificationBell() {
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const notifications = useNotificationStore((s) => s.notifications)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative text-sm px-2 py-1 rounded hover:bg-white/10 cursor-pointer">
        {"\u{1F514}"}
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
