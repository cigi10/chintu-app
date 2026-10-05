import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')

  if (errorParam) {
    console.error('OAuth error param:', errorParam, searchParams.get('error_description'))
    return NextResponse.redirect(`${origin}/login?error=${errorParam}`)
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('exchangeCodeForSession failed:', error.message)
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
    }

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('profile select error:', profileError.message)
      }

      if (!profile) {
        const { error: insertError } = await supabase.from('profiles').insert({ id: data.user.id })
        if (insertError) console.error('profile insert error:', insertError.message)
        // A first Google login has no profile yet, so this is the sign-up.
        // GA runs in the browser, so the flag rides along to onboarding,
        // where SignupTracker fires sign_up once and strips it. Email
        // sign-ups also land here (confirming the address) but were
        // already counted when the form was submitted, so they get no flag.
        const isGoogleSignup = data.user.app_metadata?.provider === 'google'
        return NextResponse.redirect(`${origin}/onboarding${isGoogleSignup ? '?signup=google' : ''}`)
      }
      if (!profile.onboarded) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}