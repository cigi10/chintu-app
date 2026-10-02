import { Suspense } from 'react'
import ResetPasswordForm from '@/components/ResetPasswordForm'
import { NOINDEX } from '@/lib/seo'

// Rendered per request rather than prerendered: the form reads the URL
// (useSearchParams), and on a prerendered page that pushes everything inside
// the Suspense boundary to the browser, leaving the server HTML empty. A
// dynamic render lets the whole form render on the server.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Studyloaf: Set new password',
  description: 'Finish resetting your account password.',
  robots: NOINDEX,
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
