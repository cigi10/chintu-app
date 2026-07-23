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
        return NextResponse.redirect(`${origin}/onboarding`)
      }
      if (!profile.onboarded) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`)
}