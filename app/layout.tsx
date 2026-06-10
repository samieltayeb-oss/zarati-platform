import './globals.css'
import type { ReactNode } from 'react'

// Minimal root layout — lang/dir/fonts handled in app/[lang]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
