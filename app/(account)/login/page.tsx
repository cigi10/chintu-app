import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'
import { NOINDEX } from '@/lib/seo'

// Rendered per request rather than prerendered: the form reads the URL
// (useSearchParams), and on a prerendered page that pushes everything inside
// the Suspense boundary to the browser, leaving the server HTML empty. A
// dynamic render lets the whole form render on the server.
export const dynamic = 'force-dynamic'

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
