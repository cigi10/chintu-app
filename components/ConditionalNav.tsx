'use client'
import { usePathname } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

const HIDDEN_ON = ['/login', '/landing', '/onboarding']

export default function ConditionalNav() {
  const pathname = usePathname()
  const shouldHide = HIDDEN_ON.some((path) => pathname?.startsWith(path))
  if (shouldHide) return null
  return <BottomNav />
}