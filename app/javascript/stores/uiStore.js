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
  cursorActive: false,
  newCardColumn: null,
  filterLabels: [],
  filterParticipants: [],

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

  setCursor: (cursor) => set({ cursor, cursorActive: true }),
  activateCursor: () => set({ cursorActive: true }),
  deactivateCursor: () => set({ cursorActive: false }),
  setNewCardColumn: (col) => set({ newCardColumn: col }),
  clearNewCardColumn: () => set({ newCardColumn: null }),
  toggleFilterLabel: (labelId) => set((s) => ({
    filterLabels: s.filterLabels.includes(labelId)
      ? s.filterLabels.filter((id) => id !== labelId)
      : [...s.filterLabels, labelId]
  })),
  toggleFilterParticipant: (userId) => set((s) => ({
    filterParticipants: s.filterParticipants.includes(userId)
      ? s.filterParticipants.filter((id) => id !== userId)
      : [...s.filterParticipants, userId]
  })),
  clearFilters: () => set({ filterLabels: [], filterParticipants: [] }),
}))
