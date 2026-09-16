'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import BottomNav from '@/components/BottomNav'
import { claimGuestDataForAccount } from '@/lib/claimGuestData'

// Shared with components/Sidebar.jsx, which needs the same "which routes
// get site chrome" check but has to live earlier in the DOM (before page
// content) for its flex layout to place it on the left correctly.
export const CHROME_HIDDEN_ON = ['/login', '/landing', '/onboarding', '/forgot-password', '/reset-password']

export default function ConditionalNav() {
  const pathname = usePathname()

  // Runs once per full page load (this component lives in the root
  // layout, so it doesn't remount on client-side navigation). It no-ops
  // instantly unless there's a session AND local guest data hasn't been
  // claimed into it yet — see lib/claimGuestData.js. Living here rather
  // than in LoginForm means it also covers landing on /onboarding or
  // /dashboard via the OAuth/email-confirmation callback route, without
  // duplicating the call at every auth entry point.
  useEffect(() => {
    claimGuestDataForAccount()
  }, [])

  const shouldHide = CHROME_HIDDEN_ON.some((path) => pathname?.startsWith(path))
  if (shouldHide) return null
  return <BottomNav />
}