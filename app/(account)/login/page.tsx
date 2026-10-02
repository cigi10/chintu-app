import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'
import { NOINDEX } from '@/lib/seo'

export const metadata = {
  title: 'Studyloaf: Log in',
  description: 'Sign in to sync your study progress across devices.',
  robots: NOINDEX,
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
