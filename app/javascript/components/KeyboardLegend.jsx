import React from "react"
import { useUiStore } from "../stores/uiStore"

const shortcuts = [
  { key: "h/l", desc: "Columns" },
  { key: "j/k", desc: "Cards" },
  { key: "Tab/S-Tab", desc: "Sequential" },
  { key: "Enter", desc: "Open" },
  { key: "Esc", desc: "Close / Back" },
  { key: "n", desc: "New card" },
  { key: "d", desc: "Delete" },
  { key: "m/M", desc: "Move right/left" },
  { key: "Ctrl+hjkl", desc: "Move card" },
  { key: "Shift+Tab", desc: "Toggle layout" },
  { key: "?", desc: "Legend" },
]

export default function KeyboardLegend() {
  const visible = useUiStore((s) => s.keyboardLegendVisible)
  const toggle = useUiStore((s) => s.toggleKeyboardLegend)

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-nav-bg)] text-[var(--color-nav-text)]
      border-t border-[var(--color-border)] px-4 py-2 z-40 hidden md:block">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {shortcuts.map((s) => (
            <span key={s.key} className="text-xs">
              <kbd className="px-1 py-0.5 rounded text-[10px] font-mono bg-[var(--color-kbd-bg)] text-[var(--color-text)]
                border border-[var(--color-kbd-border)]">{s.key}</kbd>
              <span className="ml-1 text-[var(--color-text-muted)]">{s.desc}</span>
            </span>
          ))}
        </div>
        <button onClick={toggle} className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-nav-text)] cursor-pointer">
          Hide
        </button>
      </div>
    </div>
  )
}
