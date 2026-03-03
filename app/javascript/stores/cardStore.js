import { create } from "zustand"
import api from "../lib/api"

export const useCardStore = create((set, get) => ({
  cards: [],
  selectedCard: null,
  loading: false,

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
    const prevCards = get().cards
    // Optimistic update
    set((s) => ({
      cards: s.cards.map((c) => (c.id === id ? { ...c, column, position } : c)),
    }))
    try {
      const card = await api.patch(`/cards/${id}/move`, { card: { column, position } })
      set((s) => ({
        cards: s.cards.map((c) => (c.id === card.id ? card : c)),
        selectedCard: s.selectedCard?.id === card.id ? card : s.selectedCard,
      }))
      return card
    } catch {
      set({ cards: prevCards })
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
