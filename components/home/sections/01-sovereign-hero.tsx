import Image from 'next/image'
import Link from 'next/link'
import zheroSrc from '@/brand/Zhero.png'
import { SudanBadge } from '@/components/brand/sudan-badge'
import type { Locale } from '@/lib/i18n/config'

export function SovereignHero({ locale }: { locale: Locale; dict?: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="bg-surface text-text pt-6 pb-14 md:pt-8 md:pb-20 border-b border-border relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Top Sovereign Status & Belts Context */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <SudanBadge lang={locale} variant="hero" />
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-primary border border-border-strong px-2.5 py-1 rounded-full bg-surface">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              R1 LIVE · R2 SECURE · R3 ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>{isAr ? '24 مليون فدان مزروع · حوض النيل والقضارف' : '24M Cultivated Feddans · Nile & Gedaref Belts'}</span>
          </div>
        </div>

        {/* HERO MASTERPIECE: Zhero */}
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-[#06140b] group">
          <Image
            src={zheroSrc}
            alt={isAr ? "زرعتي | ZARATI — من أرض السودان إلى مستقبل أكثر ازدهاراً" : "ZARATI — Sudan's Agricultural Intelligence Infrastructure"}
            width={1671}
            height={941}
            priority
            quality={100}
            className="w-full h-auto object-cover select-none"
          />

          {/* Accessible semantic h1 for SEO and screen readers */}
          <h1 className="sr-only">
            {isAr
              ? 'زرعتي — من أرض السودان إلى مستقبل أكثر ازدهاراً | البنية التحتية للذكاء الزراعي'
              : "ZARATI — Sudan's Sovereign Agricultural Intelligence Infrastructure"}
          </h1>
        </div>

        {/* Quick Action Navigation Grid matching Zhero pillars */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href={`/${locale}/marketplace`}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-all transform hover:-translate-y-0.5"
          >
            <span>{isAr ? 'ابدأ الآن — سوق المحاصيل' : 'Explore Marketplace'}</span>
          </Link>
          <Link
            href={`/${locale}/crops`}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-surface border border-border text-text font-bold text-sm shadow-sm hover:border-primary hover:text-primary transition-all transform hover:-translate-y-0.5"
          >
            <span>{isAr ? 'محاصيل السودان' : "Sudan's Crops"}</span>
          </Link>
          <Link
            href={`/${locale}/geography`}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-surface border border-border text-text font-bold text-sm shadow-sm hover:border-primary hover:text-primary transition-all transform hover:-translate-y-0.5"
          >
            <span>{isAr ? 'الجغرافيا الزراعية' : 'Agricultural Geography'}</span>
          </Link>
          <Link
            href={`/${locale}/intelligence`}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-surface border border-border text-text font-bold text-sm shadow-sm hover:border-primary hover:text-primary transition-all transform hover:-translate-y-0.5"
          >
            <span>{isAr ? 'الذكاء والبيانات' : 'Data & Intelligence'}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
