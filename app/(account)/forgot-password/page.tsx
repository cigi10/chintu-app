import ForgotPasswordForm from '@/components/ForgotPasswordForm'
import { NOINDEX } from '@/lib/seo'

export const metadata = {
  title: 'Studyloaf: Reset password',
  description: 'Get a link to reset your account password.',
  robots: NOINDEX,
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
