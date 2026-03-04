import React, { useEffect } from "react"

export default function Modal({ isOpen, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className={`relative bg-[var(--color-bg-overlay)] rounded-lg border border-[var(--color-border)]
          shadow-lg ${wide ? "w-full max-w-2xl" : "w-full max-w-md"} max-h-[80vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] p-1 cursor-pointer"
            >
              &times;
            </button>
          </div>
        ) : (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-[var(--color-text-muted)] hover:text-[var(--color-text)] p-1 cursor-pointer text-lg leading-none"
          >
            &times;
          </button>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
