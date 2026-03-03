import { create } from "zustand"

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light"
  return localStorage.getItem("taskello-theme") || "light"
}

export const useUiStore = create((set, get) => ({
  theme: getInitialTheme(),
  layout: "kanban",
  toasts: [],
  keyboardLegendVisible: false,
  cursor: { columnIndex: 0, cardIndex: 0 },

  setTheme: (theme) => {
    localStorage.setItem("taskello-theme", theme)
    document.documentElement.setAttribute("data-theme", theme === "light" ? "" : theme)
    set({ theme })
  },

  setLayout: (layout) => set({ layout }),

  toggleLayout: () => set((s) => ({ layout: s.layout === "kanban" ? "email" : "kanban" })),

  addToast: (message, type = "info") => {
    const id = Date.now()
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },

  toggleKeyboardLegend: () => set((s) => ({ keyboardLegendVisible: !s.keyboardLegendVisible })),

  setCursor: (cursor) => set({ cursor }),
}))
