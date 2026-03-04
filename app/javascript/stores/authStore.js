import { create } from "zustand"
import api from "../lib/api"
import { resetConsumer } from "../lib/consumer"

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchMe: async () => {
    try {
      const user = await api.get("/me")
      set({ user, loading: false })
    } catch {
      set({ user: null, loading: false })
    }
  },

  login: async (email, password) => {
    const user = await api.post("/login", { session: { email, password } })
    set({ user })
    return user
  },

  signup: async (username, email, password) => {
    const user = await api.post("/signup", { user: { username, email, password } })
    set({ user })
    return user
  },

  logout: async () => {
    await api.delete("/logout")
    resetConsumer()
    set({ user: null })
  },
}))
