import { create } from "zustand"
import api from "../lib/api"

export const useBoardStore = create((set) => ({
  boards: [],
  currentBoard: null,
  loading: false,

  fetchBoards: async () => {
    set({ loading: true })
    const boards = await api.get("/boards")
    set({ boards, loading: false })
  },

  fetchBoard: async (id) => {
    set({ loading: true })
    const board = await api.get(`/boards/${id}`)
    set({ currentBoard: board, loading: false })
  },

  createBoard: async (data) => {
    const board = await api.post("/boards", { board: data })
    set((s) => ({ boards: [...s.boards, board] }))
    return board
  },

  updateBoard: async (id, data) => {
    const board = await api.patch(`/boards/${id}`, { board: data })
    set((s) => ({
      boards: s.boards.map((b) => (b.id === id ? board : b)),
      currentBoard: s.currentBoard?.id === id ? board : s.currentBoard,
    }))
    return board
  },

  deleteBoard: async (id) => {
    await api.delete(`/boards/${id}`)
    set((s) => ({
      boards: s.boards.filter((b) => b.id !== id),
      currentBoard: s.currentBoard?.id === id ? null : s.currentBoard,
    }))
  },

  addMember: async (boardId, username) => {
    const member = await api.post(`/boards/${boardId}/members`, { username })
    set((s) => {
      if (s.currentBoard?.id !== boardId) return s
      return { currentBoard: { ...s.currentBoard, members: [...s.currentBoard.members, member] } }
    })
    return member
  },

  removeMember: async (boardId, memberId) => {
    await api.delete(`/boards/${boardId}/members/${memberId}`)
    set((s) => {
      if (s.currentBoard?.id !== boardId) return s
      return {
        currentBoard: {
          ...s.currentBoard,
          members: s.currentBoard.members.filter((m) => m.id !== memberId),
        },
      }
    })
  },

  setCurrentBoard: (board) => set({ currentBoard: board }),
}))
