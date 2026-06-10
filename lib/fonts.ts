import { Geist } from 'next/font/google'
import { Cairo } from 'next/font/google'

// Self-hosted at build time via next/font — no runtime CDN calls
export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
})

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})
