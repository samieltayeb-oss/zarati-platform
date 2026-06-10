import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// Minimal root layout — lang/dir/fonts handled in app/[lang]/layout.tsx
export const metadata: Metadata = {
  icons: { icon: '/icon.svg', apple: '/logo.png' },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
