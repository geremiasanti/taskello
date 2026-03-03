import React, { useState } from "react"
import { useUiStore } from "../stores/uiStore"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "gruvbox", label: "Gruvbox" },
]

export default function ThemeSwitcher() {
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-base px-2 py-1 rounded hover:bg-white/10 cursor-pointer leading-none"
        title="Switch theme"
      >
        {theme === "light" ? "\u2600" : theme === "dark" ? "\u263E" : "\u25A3"}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-md shadow-lg py-1 z-50 min-w-[120px]">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTheme(t.value); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-sm cursor-pointer
                ${theme === t.value ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text)]"}
                hover:bg-[var(--color-bg-tertiary)]`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
