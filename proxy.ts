import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isGatedPath } from '@/lib/routeAccess'

// Routes that require a real, signed-in session live in lib/routeAccess.js
// (shared with GuestModeBanner so both agree on the same list). Everything
// else is public — including guest/local-only use of the core study
// toolkit (dashboard, timer, timetable, tracker, todo, goals, stats,
// mocktests, quiz, revisions, digest, tutorial, onboarding) per the original
// design intent that account creation should never block first use.
// lib/storage.js's getData/setData already fall back to localStorage when
// there's no session, so those routes work fully logged-out — the data
// just doesn't sync anywhere until the visitor signs up (see
// lib/claimGuestData.js for how that local data gets folded into their
// account once they do).
//
// A separate set of routes (tools/timetable-generator, countdown,
// resources) are also public but, unlike the toolkit above, carry no
// account coupling at all, not even the localStorage fallback. They're
// standalone marketing/SEO pages with nothing to sync, ever.
//
// Kept gated, and why (see lib/routeAccess.js):
//   /rooms         — Study Rooms' live presence needs an identity, not
//                     just a browser's local storage.
//   /journal /mood — the crisis-signal notice (lib/crisisDetection.js)
//                     is deliberately kept behind a real account for now,
//                     so any flagged entry sits behind an identifiable
//                     user rather than a fully anonymous one.
//   /shop /achievements /profile — meaningfully tied to persistent
//                     account state (coin balance, reward history,
//                     profile fields) and not very useful without one.

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // this refreshes the session cookie if it's expiring — must be called
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (!user && isGatedPath(pathname)) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|companion/|shop-items/|bread-basket/|toast-nutella-banana-strawberry-blueberry/).*)'],
}
