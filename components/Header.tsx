'use client'
import Link from 'next/link'

const SITE_NAME = 'Studyloaf'

export default function Header() {
  return (
    <header className="site-header">
      <Link href="/dashboard" className="site-header__logo">
        {SITE_NAME}
      </Link>
    </header>
  )
}