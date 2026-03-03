import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "./stores/authStore"
import { useUiStore } from "./stores/uiStore"
import ToastContainer from "./components/ui/Toast"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import BoardsIndexPage from "./pages/BoardsIndexPage"
import BoardShowPage from "./pages/BoardShowPage"
import Navbar from "./components/Navbar"
import useNotificationChannel from "./hooks/useNotificationChannel"

function AuthGuard() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  useNotificationChannel(user?.id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <p className="text-[var(--color-text-secondary)]">Loading...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <Outlet />
    </div>
  )
}

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const theme = useUiStore((s) => s.theme)

  useEffect(() => {
    fetchMe()
  }, [])

  useEffect(() => {
    if (theme && theme !== "light") {
      document.documentElement.setAttribute("data-theme", theme)
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/boards" element={<BoardsIndexPage />} />
          <Route path="/boards/:id" element={<BoardShowPage />} />
          <Route path="/" element={<Navigate to="/boards" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/boards" replace />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}
