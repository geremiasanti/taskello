import React from "react"
import { useUiStore } from "../../stores/uiStore"

const typeStyles = {
  info: "bg-[var(--color-primary)] text-white",
  success: "bg-[var(--color-success)] text-white",
  error: "bg-[var(--color-danger)] text-white",
  warning: "bg-[var(--color-warning)] text-white",
}

export default function ToastContainer() {
  const toasts = useUiStore((s) => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-md text-sm shadow-lg animate-slide-in ${typeStyles[toast.type] || typeStyles.info}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
