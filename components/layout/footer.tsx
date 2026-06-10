import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'

interface FooterNav {
  home: string
  marketplace: string
  weather: string
  about: string
}

interface FooterProps {
  lang: Locale
  nav: FooterNav
}

export function Footer({ lang, nav }: FooterProps) {
  const links = [
    { href: `/${lang}`,             label: nav.home },
    { href: `/${lang}/marketplace`, label: nav.marketplace },
    { href: `/${lang}/weather`,     label: nav.weather },
    { href: `/${lang}/about`,       label: nav.about },
  ]

  const isAr = lang === 'ar'

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-primary font-bold text-xl">زرعتي</span>
              <span className="text-muted text-sm">| Zarati</span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              {isAr
                ? 'منصة السودان الزراعية الذكية — تمكين المزارعين بالتقنية.'
                : "Sudan's Smart Agriculture Platform — empowering farmers with technology."}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted/70">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
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
            <a href="mailto:hello@zarati.sd" className="text-sm text-muted hover:text-primary transition-colors">
              hello@zarati.sd
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted">
          © 2026 Zarati · زرعتي.{' '}
          {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  )
}
