'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Companion from '@/components/Companion'
import "@/styles/login.css"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (!error) setSent(true)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  if (sent) {
    return (
      <div className="login-page">
        <Header />
        <div className="login-card">
          <div className="login-card__companion">
            <Companion mood="happy" />
          </div>
          <p>Check your email for a login link</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <Header />
      <div className="login-card">
        <div className="login-card__companion">
          <Companion mood="curious" />
        </div>
        <h1>Welcome back</h1>
        <button onClick={handleGoogle} className="btn-google">
          Continue with Google
        </button>
        <div className="divider">or</div>
        <form onSubmit={handleMagicLink}>
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send magic link'}
          </button>
        </form>
      </div>
    </div>
  )
}