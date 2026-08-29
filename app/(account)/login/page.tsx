import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

export const metadata = {
  title: 'Studyloaf: Log in',
  description: 'Sign in to sync your study progress across devices.',
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
