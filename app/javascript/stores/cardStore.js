import { create } from "zustand"
import api from "../lib/api"

function reorderCards(cards, movedId, newColumn, newPosition) {
  const result = cards.map((c) => ({ ...c }))
  const card = result.find((c) => c.id === movedId)
  if (!card) return result

  const oldColumn = card.column
  const oldPosition = card.position

  if (oldColumn === newColumn) {
    // Within same column: shift siblings between old and new position
    result.forEach((c) => {
      if (c.id === movedId || c.column !== newColumn) return
      if (newPosition > oldPosition) {
        if (c.position > oldPosition && c.position <= newPosition) c.position--
      } else if (newPosition < oldPosition) {
        if (c.position >= newPosition && c.position < oldPosition) c.position++
      }
    })
  } else {
    // Cross column: close gap in old column, open gap in new column
    result.forEach((c) => {
      if (c.id === movedId) return
      if (c.column === oldColumn && c.position > oldPosition) c.position--
      if (c.column === newColumn && c.position >= newPosition) c.position++
    })
  }

  card.column = newColumn
  card.position = newPosition
  return result
}

export const useCardStore = create((set, get) => ({
  cards: [],
  selectedCard: null,
  loading: false,
  _moving: false,

  setCards: (cards) => set({ cards }),

  fetchCards: async (boardId) => {
    set({ loading: true })
    const cards = await api.get(`/boards/${boardId}`)
    set({ loading: false })
  },

  createCard: async (data) => {
    const card = await api.post("/cards", { card: data })
    set((s) => ({ cards: [...s.cards, card] }))
    return card
  },

  updateCard: async (id, data) => {
    const card = await api.patch(`/cards/${id}`, { card: data })
    set((s) => ({
      cards: s.cards.map((c) => (c.id === id ? card : c)),
      selectedCard: s.selectedCard?.id === id ? card : s.selectedCard,
    }))
    return card
  },

  moveCard: async (id, column, position) => {
    if (get()._moving) return
    const prevCards = get().cards
    set({ _moving: true, cards: reorderCards(prevCards, id, column, position) })
    try {
      const card = await api.patch(`/cards/${id}/move`, { card: { column, position } })
      set((s) => ({
        _moving: false,
        cards: s.cards.map((c) => (c.id === card.id ? card : c)),
        selectedCard: s.selectedCard?.id === card.id ? card : s.selectedCard,
      }))
      return card
    } catch {
      set({ _moving: false, cards: prevCards })
    }
  },

  deleteCard: async (id) => {
    await api.delete(`/cards/${id}`)
    set((s) => ({
      cards: s.cards.filter((c) => c.id !== id),
      selectedCard: s.selectedCard?.id === id ? null : s.selectedCard,
    }))
  },

  selectCard: (card) => set({ selectedCard: card }),
  clearSelectedCard: () => set({ selectedCard: null }),
}))
