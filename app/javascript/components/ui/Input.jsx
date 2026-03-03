import React from "react"

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">{label}</label>
      )}
      <input
        className={`w-full px-3 py-1.5 text-sm rounded-md border
          bg-[var(--color-input-bg)] text-[var(--color-text)]
          border-[var(--color-input-border)]
          focus:border-[var(--color-focus-ring)] focus:ring-1 focus:ring-[var(--color-focus-ring)]
          placeholder:text-[var(--color-text-muted)]
          ${error ? "border-[var(--color-danger)]" : ""}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}
