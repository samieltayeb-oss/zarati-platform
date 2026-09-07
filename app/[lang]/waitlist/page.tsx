import { getDictionary } from '@/lib/i18n/getDictionary'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { WaitlistForm } from '@/components/waitlist/WaitlistForm'
import { ZaratiLogo } from '@/components/brand/zarati-logo'
import { SudanBadge } from '@/components/brand/sudan-badge'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Waitlist | ZARATI' }
}

export default async function WaitlistPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const t = (await getDictionary(locale)).register

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-7">
        <div className="flex flex-col items-center gap-2.5">
          <Link href={`/${locale}`} className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
            <ZaratiLogo lang={locale} variant="auth" />
          </Link>
          <SudanBadge lang={locale} variant="header" className="text-[10px] py-0.5 px-2.5" />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">{t.heading}</h1>
            <p className="text-muted leading-relaxed">Partner with us or join our Waitlist.</p>
          </div>

          <WaitlistForm dict={t} lang={locale} />
        </div>
      </div>
    </div>
  )
}
