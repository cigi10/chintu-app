import { Suspense } from 'react'
import ResetPasswordForm from '@/components/ResetPasswordForm'
import { NOINDEX } from '@/lib/seo'

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
