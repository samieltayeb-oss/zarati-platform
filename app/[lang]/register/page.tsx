import { getDictionary } from '@/lib/i18n/getDictionary'
import type { Locale } from '@/lib/i18n/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { ZaratiLogo } from '@/components/brand/zarati-logo'
import { SudanBadge } from '@/components/brand/sudan-badge'

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
  const isAr = locale === 'ar'

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      <div className={`w-full md:w-1/2 flex items-center justify-center p-4 py-12 lg:p-12 ${isAr ? 'md:order-2' : ''}`}>
        <div className="w-full max-w-md text-center space-y-7">
          <div className="flex flex-col items-center gap-2.5">
            <Link href={`/${locale}`} className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
              <ZaratiLogo lang={locale} variant="auth" />
            </Link>
            <SudanBadge lang={locale} variant="header" className="text-[10px] py-0.5 px-2.5" />
          </div>

          <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-left">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-text">{t.heading || 'Create Account'}</h1>
              <p className="text-muted leading-relaxed">{t.subheading || 'Join the Zarati platform'}</p>
            </div>

            <RegisterForm />

            <div className="text-center mt-4 text-sm text-muted">
              Already have an account?{' '}
              <Link href={`/${locale}/login`} className="text-primary hover:underline font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`hidden md:block w-full md:w-1/2 relative bg-surface ${isAr ? 'md:order-1' : ''}`}>
        <Image 
          src="/images/register_hero.jpg" 
          alt="Zarati Agriculture Landscape"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
    </div>
  )
}
