import Link from 'next/link'
import { ZaratiLogo } from '@/components/brand/zarati-logo'
import { SudanBadge, SudanFlag } from '@/components/brand/sudan-badge'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Col 1: Brand & National Context (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href={`/${lang}`} className="inline-block">
              <ZaratiLogo lang={lang} variant="footer" showTagline={false} />
            </Link>

            <p className="text-text/80 text-sm leading-relaxed max-w-sm font-sans">
              {isAr
                ? 'البنية التحتية للذكاء الزراعي في السودان — منصة سيادية تربط المنتجين والأسواق والمراكز الإقليمية بنظام بيانات دقيق.'
                : "Sudan's Sovereign Agricultural Intelligence Infrastructure — connecting producers, regional hubs, and commodity markets."}
            </p>

            <p className="text-muted text-xs font-mono tracking-wide">
              {isAr
                ? 'الزراعة الذكية لمستقبل السودان'
                : "SMART AGRICULTURE FOR SUDAN'S FUTURE"}
            </p>

            {/* Sudan Sovereign Identity Badge */}
            <div className="pt-2">
              <SudanBadge lang={lang} variant="hero" className="text-[11px] py-1 px-2.5" />
            </div>

            {/* Regional Hubs & Coordinates */}
            <div className="pt-3 border-t border-border-strong/60 space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-mono text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  {isAr
                    ? 'المحاور: القضارف · الجزيرة · كردفان · بورتسودان'
                    : 'Corridors: Gedaref · Gezira · Kordofan · Port Sudan'}
                </span>
              </div>
              <p className="text-[10px] font-mono text-muted/70">
                15.5007° N, 32.5599° E · {isAr ? 'مقرن النيلين، الخرطوم' : 'Nile Confluence, Khartoum'}
              </p>
            </div>
          </div>

          {/* Col 2: Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-text uppercase">
              {isAr ? 'منظومة المنصة' : 'Platform Modules'}
            </h3>
            <ul className="space-y-2.5">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Institutional & Sovereign Focus (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-widest text-text uppercase">
              {isAr ? 'المعايير والبيانات' : 'Standards & Verification'}
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              {isAr
                ? 'منصة تقنية مستقلة مخصصة للاقتصاد الزراعي السوداني. مصممة وفق معايير التتبع المؤسسي ومواءمة مواصفات هيئة المواصفات والمقاييس (SSMO).'
                : "An independent sovereign agritech infrastructure built for Sudan's agricultural reality, aligning with national quality benchmarks and traceability standards."}
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs font-mono text-text">
                <span className="text-muted">{isAr ? 'التواصل المؤسسي:' : 'Institutional Contact:'}</span>
                <a href="mailto:sam@nexorayyc.io" className="text-primary hover:underline">
                  sam@nexorayyc.io
                </a>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-muted/70 font-mono pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              <span>{isAr ? 'النظام البيئي نشط' : 'Sovereign Core Active'}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2">
            <SudanFlag className="w-4 h-2.5" />
            <span>
              © 2026 Zarati · زرعتي.{' '}
              {isAr ? 'جميع الحقوق محفوظة — صُمم للسودان.' : 'All rights reserved — Built for Sudan.'}
            </span>
          </div>
          <div className="flex items-center gap-5">
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
