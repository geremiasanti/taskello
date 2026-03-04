import React, { useState, useCallback } from "react"
import { useUiStore } from "../stores/uiStore"
import useClickOutside from "../hooks/useClickOutside"

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const PaletteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="10" cy="9" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="8" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="14" cy="15" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "gruvbox", label: "Gruvbox" },
]

export default function ThemeSwitcher() {
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(useCallback(() => setOpen(false), []))

  const icon = theme === "light" ? <SunIcon /> : theme === "dark" ? <MoonIcon /> : <PaletteIcon />

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1.5 rounded hover:bg-white/10 cursor-pointer leading-none flex items-center"
        title="Switch theme"
      >
        {icon}
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
