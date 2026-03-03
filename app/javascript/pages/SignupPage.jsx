import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const signup = useAuthStore((s) => s.signup)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSubmitting(true)
    try {
      await signup(username, email, password)
      navigate("/boards")
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-[var(--color-text)] mb-6">Create your account</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-lg p-4"
        >
          {errors.general && <p className="text-sm text-[var(--color-danger)] mb-3">{errors.general}</p>}
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-3" required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3" required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" required minLength={6} />
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-overlay)] border border-[var(--color-border)] rounded-lg p-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
