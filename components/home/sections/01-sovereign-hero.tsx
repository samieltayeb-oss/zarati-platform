import Image from 'next/image'
import { SudanMap } from '@/components/maps/SudanMap'
import { SudanBadge } from '@/components/brand/sudan-badge'
import type { Locale } from '@/lib/i18n/config'

export function SovereignHero({ locale }: { locale: Locale; dict?: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="bg-surface text-text pt-20 pb-16 md:pt-28 md:pb-24 border-b border-border-strong relative overflow-hidden">
      {/* Subtle sovereign geometric background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full min-h-[72vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">

          {/* LEFT: Typography & Sovereign CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 mt-6 lg:mt-0">
            {/* Status Rail with Built for Sudan Badge */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <SudanBadge lang={locale} variant="hero" />

              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-primary border border-border-strong px-2 py-1 rounded-sm bg-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                R1 LIVE
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-primary border border-border-strong px-2 py-1 rounded-sm bg-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                R2 SECURE
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-primary border border-border-strong px-2 py-1 rounded-sm bg-surface">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                R3 ACTIVE
              </span>
            </div>

            {/* National Headline */}
            <h1 className="text-[40px] md:text-[54px] lg:text-[68px] font-bold font-cairo mb-6 leading-[1.12] tracking-tight text-text">
              {isAr 
                ? 'البنية التحتية للذكاء الزراعي في السودان' 
                : "SUDAN'S AGRICULTURAL INTELLIGENCE INFRASTRUCTURE"}
            </h1>

            <p className="text-base md:text-lg lg:text-xl max-w-xl text-muted mb-8 font-sans leading-relaxed">
              {isAr 
                ? 'نظام تشغيل سيادي يربط المزارعين والمراكز الإقليمية والأسواق عبر حوض النيل وسهول القضارف والجزيرة.' 
                : 'A sovereign operating system connecting producers, regional trading hubs, and national commodity markets across Sudan.'}
            </p>

            {/* Sovereign Context Ticker */}
            <div className="flex items-center gap-4 text-xs font-mono text-muted mb-8 pb-6 border-b border-border/80">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                {isAr ? '٢٤ مليون فدان مزروع' : '24M Cultivated Feddans'}
              </span>
              <span className="text-muted/40">·</span>
              <span>{isAr ? 'حوض النيل والقضارف' : 'Nile & Gedaref Belts'}</span>
              <span className="text-muted/40">·</span>
              <span>15.5007° N</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <a
                href={`/${locale}/marketplace`}
                className="bg-primary text-white px-7 py-3.5 rounded-sm font-bold shadow-sm hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 text-sm md:text-base inline-flex items-center gap-2"
              >
                <span>{isAr ? 'استكشف السوق الزراعي' : 'Explore Marketplace'}</span>
              </a>
              <a
                href={`/${locale}/geography`}
                className="border border-border-strong text-text px-7 py-3.5 rounded-sm font-bold shadow-sm hover:border-primary hover:text-primary transition-colors text-sm md:text-base inline-flex items-center gap-2 bg-surface"
              >
                <span>{isAr ? 'الجغرافيا الزراعية' : 'Agricultural Geography'}</span>
              </a>
            </div>
          </div>
          
          {/* RIGHT: Map & Environmental Lens */}
          <div className="lg:col-span-6 relative h-[380px] md:h-[500px] lg:h-[680px] w-full flex items-center justify-center order-1 lg:order-2">
            <SudanMap lang={locale} className="w-full h-full object-contain" />
            
            {/* Environmental Corridor Provenance Card */}
            <div className="absolute bottom-2 start-2 md:bottom-6 md:start-6 bg-surface/95 backdrop-blur-md border border-border-strong rounded-md p-3 shadow-lg flex items-center gap-3.5 max-w-sm pointer-events-auto">
              <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 border border-border">
                <Image
                  src="/images/zarati/hero/sudan-nile-agricultural-corridor.jpg"
                  alt={isAr ? 'حوض النيل الزراعي بالسودان' : 'Sudan Nile Agricultural Corridor'}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="text-xs overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <p className="font-bold font-cairo text-text truncate">
                    {isAr ? 'حوض النيل وسهول القضارف' : 'Nile Basin & Gedaref Plains'}
                  </p>
                </div>
                <p className="text-[10px] font-mono text-muted tracking-tight mt-0.5">
                  {isAr ? 'مروي + مطري آلي · ٢٤ مليون فدان' : 'Irrigated + Mechanized · 24M Feddans'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
