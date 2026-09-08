import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { cairo, geist, ibmPlexArabic } from '@/lib/fonts'
import { locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { generatePageMetadata } from '@/config/seo'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

type Props = {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return generatePageMetadata(lang as Locale)
}

export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const dict = await getDictionary(locale)

  const isAr = locale === 'ar'

  return (
    <html 
      lang={locale} 
      dir={dir} 
      className={`${cairo.variable} ${geist.variable} ${ibmPlexArabic.variable}`}
      style={{
        '--font-arabic': cairo.style.fontFamily,
        '--font-cairo': cairo.style.fontFamily,
        '--font-latin': geist.style.fontFamily,
      } as React.CSSProperties}
    >
      <body className="flex flex-col min-h-screen font-sans overflow-x-clip">
        <Header lang={locale} nav={dict.nav} />
        <main className="flex-1">{children}</main>
        <Footer lang={locale} nav={dict.nav} />
      </body>
    </html>
  )
}
