import { getDictionary } from '@/lib/i18n/getDictionary'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { WaitlistForm } from '@/components/waitlist/WaitlistForm'
import logoSrc from '@/brand/logo2-transparent.png'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const t = (await getDictionary(lang as Locale)).register
  return { title: t.pageTitle }
}

export default async function RegisterPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const t = (await getDictionary(locale)).register

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">

        {/* Logo */}
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-block">
            <Image
              src={logoSrc}
              alt="زرعتي | ZARATI"
              height={80}
              width={120}
              className="h-[64px] w-auto object-contain mx-auto"
              priority
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">{t.heading}</h1>
            <p className="text-muted leading-relaxed">{t.subheading}</p>
          </div>

          <WaitlistForm dict={t} lang={locale} />
        </div>
      </div>
    </div>
  )
}
