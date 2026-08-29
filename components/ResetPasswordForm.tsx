'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Companion from '@/components/Companion'
import "@/styles/login.css"

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  // The recovery link exchange happens client-side (via detectSessionInUrl)
  // after this page mounts, so we can't call updateUser until a session
  // shows up — otherwise it fails with a raw "Auth session missing" error.
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>('checking')
  const [password, setPassword] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    // Supabase redirects back here with ?error=... when the link itself
    // is already invalid or expired, before any session exchange happens.
    if (searchParams.get('error')) {
      setStatus('invalid')
      return
    }

    let resolved = false

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        resolved = true
        setStatus('ready')
      }
    })

    // PASSWORD_RECOVERY only fires once, exactly when the client exchanges
    // the code in the URL. If that already happened before this listener
    // was attached, fall back to checking for a session directly.
    supabase.auth.getSession().then(({ data }) => {
      if (!resolved && data.session) {
        resolved = true
        setStatus('ready')
      }
    })

    const timeout = setTimeout(() => {
      if (!resolved) setStatus('invalid')
    }, 3000)

    return () => {
      sub.subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="login-page">
        <Header />
        <div className="login-card">
          <div className="login-card__companion">
            <Companion mood="happy" />
          </div>
          <p>Password updated. You&apos;re all set.</p>
          <a href="/dashboard" className="login-forgot-link">Go to dashboard</a>
        </div>
      </div>
    )
  }

  if (status === 'checking') {
    return (
      <div className="login-page">
        <Header />
        <div className="login-card">
          <div className="login-card__companion">
            <Companion mood="thoughtful" />
          </div>
          <p>Checking your reset link...</p>
        </div>
      </div>
    )
  }

  if (status === 'invalid') {
    return (
      <div className="login-page">
        <Header />
        <div className="login-card">
          <div className="login-card__companion">
            <Companion mood="worried" />
          </div>
          <p>This reset link is invalid or has expired.</p>
          <a href="/forgot-password" className="login-forgot-link">Request a new one</a>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <Header />
      <div className="login-card">
        <h1>Set a new password</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="New password (6+ characters)"
            minLength={6}
            required
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  )
}
