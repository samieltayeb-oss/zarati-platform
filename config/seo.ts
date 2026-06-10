import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/config'

const SEO: Record<Locale, { title: string; description: string; siteName: string }> = {
  ar: {
    title: 'زرعتي - منصة السودان الزراعية الذكية',
    description: 'منصة زرعتي الزراعية الذكية للسودان — أسعار المحاصيل الآنية، الطقس، السوق الزراعي، والمستشار الذكي.',
    siteName: 'زرعتي',
  },
  en: {
    title: 'Zarati - Sudan Smart Agriculture Platform',
    description: "Zarati is Sudan's smart agriculture platform — real-time crop prices, weather intelligence, marketplace, and AI advisor.",
    siteName: 'Zarati',
  },
}

export function generatePageMetadata(locale: Locale, overrides?: Partial<Metadata>): Metadata {
  const base = SEO[locale]
  return {
    title: { default: base.title, template: `%s | ${base.siteName}` },
    description: base.description,
    applicationName: base.siteName,
    metadataBase: new URL('https://zarati.sd'),
    alternates: {
      canonical: '/',
      languages: { ar: '/ar', en: '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: base.siteName,
      title: base.title,
      description: base.description,
      locale: locale === 'ar' ? 'ar_SD' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_SD',
    },
    twitter: {
      card: 'summary_large_image',
      title: base.title,
      description: base.description,
    },
    ...overrides,
  }
}
