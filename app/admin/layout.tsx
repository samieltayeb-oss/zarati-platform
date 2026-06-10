import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { cairo, geist } from '@/lib/fonts'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Waitlist Admin — Zarati',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cairo.variable} ${geist.variable}`}>
      <body className="min-h-screen bg-bg text-text">
        {children}
      </body>
    </html>
  )
}
