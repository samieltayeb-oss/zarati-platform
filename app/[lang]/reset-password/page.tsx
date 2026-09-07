import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ZaratiLogo } from '@/components/brand/zarati-logo'
import { SudanBadge } from '@/components/brand/sudan-badge'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Reset Password | ZARATI' }
}

export default async function ResetPasswordPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale

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
            <h1 className="text-2xl sm:text-3xl font-bold text-text">Reset Password</h1>
            <p className="text-muted leading-relaxed">Enter your email address and we&apos;ll send you a link to reset your password.</p>
          </div>

          <ResetPasswordForm />

          <div className="text-center mt-4">
            <Link href={`/${locale}/login`} className="text-sm text-muted hover:text-primary transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
