import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login(email, password)
      navigate("/boards")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-[var(--color-text)] mb-6">Sign in to Taskello</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-lg p-4"
        >
          {error && <p className="text-sm text-[var(--color-danger)] mb-3">{error}</p>}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3" required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" required />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-lg p-4">
          New to Taskello?{" "}
          <Link to="/signup" className="text-[var(--color-primary)] hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
