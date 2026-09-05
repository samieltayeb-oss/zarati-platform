import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import logoSrc from '@/brand/logo2-transparent.png'
import { ConfirmPasswordResetForm } from '@/components/auth/ConfirmPasswordResetForm'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Set New Password' }
}

export default async function ConfirmPasswordResetPage({ params }: Props) {
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
            <h1 className="text-2xl sm:text-3xl font-bold text-text">Set New Password</h1>
            <p className="text-muted leading-relaxed">Enter your new password below.</p>
          </div>

          <ConfirmPasswordResetForm />

        </div>
      </div>
    </div>
  )
}
