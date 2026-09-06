import Link from 'next/link'
import Image from 'next/image'
import logoSrc from '@/brand/logo2-transparent.png'
import type { Locale } from '@/lib/i18n/config'

interface FooterNav {
  overview: string
  marketplace: string
  intelligence: string
  geography: string
  command: string
  institutional: string
  workspace: string
}

interface FooterProps {
  lang: Locale
  nav: FooterNav
}

export function Footer({ lang, nav }: FooterProps) {
  const links = [
    { href: `/${lang}`,             label: nav.overview },
    { href: `/${lang}/marketplace`, label: nav.marketplace },
    { href: `/${lang}/intelligence`, label: nav.intelligence },
    { href: `/${lang}/geography`,   label: nav.geography },
    { href: `/${lang}/about`,       label: nav.institutional },
  ]

  const isAr = lang === 'ar'

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src={logoSrc}
                alt="زرعتي | ZARATI"
                height={72}
                width={108}
                className="h-[64px] w-auto object-contain"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              {isAr
                ? 'منصة السودان الزراعية الذكية — تمكين المزارعين بالتقنية.'
                : "Sudan's Smart Agriculture Platform — empowering farmers with technology."}
            </p>
            <p className="text-muted/60 text-xs mt-1 max-w-xs">
              {isAr
                ? 'الزراعة الذكية لمستقبل السودان'
                : "Smart Agriculture for Sudan's Future"}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted/70">
              <span className="w-1.5 h-1.5 rounded-full bg-border-strong inline-block" />
              {isAr ? 'بيانات تجريبية' : 'Demo Data Active'}
            </span>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">
              {isAr ? 'الروابط' : 'Links'}
            </h3>
            <ul className="space-y-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-text mb-4">
              {isAr ? 'تواصل معنا' : 'Contact'}
            </h3>
            <a href="mailto:sam@nexorayyc.io" className="text-sm text-muted hover:text-primary transition-colors">
              sam@nexorayyc.io
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>
            © 2026 Zarati · زرعتي.{' '}
            {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </span>
          <div className="flex items-center gap-4">
            <Link href={`/${lang}/privacy`} className="hover:text-primary transition-colors">
              {isAr ? 'الخصوصية' : 'Privacy'}
            </Link>
            <Link href={`/${lang}/terms`} className="hover:text-primary transition-colors">
              {isAr ? 'الشروط' : 'Terms'}
            </Link>
            <Link href={`/${lang}/contact`} className="hover:text-primary transition-colors">
              {isAr ? 'تواصل معنا' : 'Contact'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
