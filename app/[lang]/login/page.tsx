import { getDictionary } from '@/lib/i18n/getDictionary'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'
import { ZaratiLogo } from '@/components/brand/zarati-logo'
import { SudanBadge } from '@/components/brand/sudan-badge'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const t = (await getDictionary(lang as Locale)).login
  return { title: t.pageTitle }
}

export default async function LoginPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const t = (await getDictionary(locale)).login

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center space-y-7">
        <div className="flex flex-col items-center gap-2.5">
          <Link href={`/${locale}`} className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
            <ZaratiLogo lang={locale} variant="auth" />
          </Link>
          <SudanBadge lang={locale} variant="header" className="text-[10px] py-0.5 px-2.5" />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-left">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">{t.heading}</h1>
            <p className="text-muted leading-relaxed">{t.subheading}</p>
          </div>

          <LoginForm dict={t} />

          <div className="text-center mt-4 space-y-2">
            <Link href={`/${locale}/reset-password`} className="block text-sm text-primary hover:underline">
              {t.forgotPassword || 'Forgot Password?'}
            </Link>
            <div className="text-sm text-muted">
              {t.noAccount || "Don't have an account?"}{' '}
              <Link href={`/${locale}/register`} className="text-primary hover:underline font-semibold">
                {t.joinCta || 'Register'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
