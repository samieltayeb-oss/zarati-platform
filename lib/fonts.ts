import { Geist, Cairo, IBM_Plex_Sans_Arabic } from 'next/font/google'

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
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})


export const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-ibm-plex',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})
