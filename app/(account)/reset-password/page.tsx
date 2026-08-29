import { Suspense } from 'react'
import ResetPasswordForm from '@/components/ResetPasswordForm'

export const metadata = {
  title: 'Studyloaf: Set new password',
  description: 'Finish resetting your account password.',
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
