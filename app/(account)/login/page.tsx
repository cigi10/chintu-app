'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Companion from '@/components/Companion'
import "@/styles/login.css"

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Google sign-in was cancelled.',
  exchange_failed: "Couldn't complete sign-in. Please try again.",
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSent, setSignupSent] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const oauthError = searchParams.get('error')
    if (oauthError) {
      setError(OAUTH_ERROR_MESSAGES[oauthError] || "Couldn't sign in. Please try again.")
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        // routes the confirmation-link click through the same profile
        // creation + onboarding check the OAuth flow already gets
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      setLoading(false)
      if (error) { setError(error.message); return }
      if (data.user && !data.session) {
        // email confirmation required before they can log in
        setSignupSent(true)
      }
      // if data.session exists, Supabase confirmed instantly and the
      // middleware/session cookie is already set — just send them onward
      if (data.session) window.location.href = '/onboarding'
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setLoading(false); setError(error.message); return }

      // new users (or accounts created outside this form) may not have a
      // profile row yet, and existing users who never finished onboarding
      // shouldn't skip straight to the dashboard — mirror the check
      // app/auth/callback/route.ts does for the OAuth path
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        await supabase.from('profiles').insert({ id: data.user.id })
      }

      setLoading(false)
      window.location.href = profile?.onboarded ? '/dashboard' : '/onboarding'
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  if (signupSent) {
    return (
      <div className="login-page">
        <Header />
        <div className="login-card">
          <div className="login-card__companion">
            <Companion mood="happy" />
          </div>
          <h1>Almost there</h1>
          <p>Check {email} for a confirmation link, then come back and log in.</p>
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

        <div className="login-tabs">
          <button
            className={`login-tab${mode === 'login' ? ' login-tab--active' : ''}`}
            onClick={() => { setMode('login'); setError('') }}
            type="button"
          >
            Log in
          </button>
          <button
            className={`login-tab${mode === 'signup' ? ' login-tab--active' : ''}`}
            onClick={() => { setMode('signup'); setError('') }}
            type="button"
          >
            Sign up
          </button>
        </div>

        <button onClick={handleGoogle} className="btn-google" type="button">
          Continue with Google
        </button>
        <div className="divider">or</div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder={mode === 'signup' ? 'Create a password (6+ characters)' : 'Password'}
            minLength={6}
            required
          />

          {error && <p className="login-error">{error}</p>}

          {mode === 'login' && (
            <Link href="/forgot-password" className="login-forgot-link">
              Forgot password?
            </Link>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}