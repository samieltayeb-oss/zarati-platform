import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import logoSrc from '@/brand/logo2-transparent.png'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Reset Password' }
}

export default async function ResetPasswordPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center space-y-8">
        <Link href={`/${locale}`} className="inline-block">
          <Image
            src={logoSrc}
            alt="ZARATI"
            height={80}
            width={120}
            className="h-[64px] w-auto object-contain mx-auto"
            priority
          />
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-left">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-text">Reset Password</h1>
            <p className="text-muted leading-relaxed">Enter your email address and we&apos;ll send you a link to reset your password.</p>
          </div>

          <ResetPasswordForm />

          <div className="text-center mt-4">
            <Link href={`/${locale}/login`} className="text-sm text-primary hover:underline font-semibold">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
