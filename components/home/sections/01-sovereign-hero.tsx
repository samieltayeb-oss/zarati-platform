import { SudanMap } from '@/components/maps/SudanMap'
import type { Locale } from '@/lib/i18n/config'

export function SovereignHero({ locale, dict }: { locale: Locale; dict: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="bg-surface text-text pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border-strong relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full min-h-[75vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          {/* LEFT: Typography & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 mt-8 lg:mt-0">
            {/* Status Rail */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-primary border border-border-strong px-2.5 py-1 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                R1 DATA LIVE
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-primary border border-border-strong px-2.5 py-1 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                R2 SECURE
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-widest text-primary border border-border-strong px-2.5 py-1 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                R3 ACTIVE
              </span>
            </div>

            <h1 className="text-[44px] md:text-[56px] lg:text-[72px] font-bold font-cairo mb-6 leading-[1.1] tracking-tight">
              {isAr 
                ? 'البنية التحتية للذكاء الزراعي في السودان' 
                : "SUDAN'S AGRICULTURAL INTELLIGENCE INFRASTRUCTURE"}
            </h1>
            <p className="text-lg md:text-xl max-w-lg text-muted mb-10 font-sans leading-relaxed">
              {isAr 
                ? 'نظام تشغيل سيادي يربط المزارعين والمراكز الإقليمية والأسواق العالمية.' 
                : 'A sovereign operating system connecting farmers, regional hubs, and global markets.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`/${locale}/marketplace`} className="bg-primary text-white px-8 py-3.5 rounded-sm font-bold shadow-sm hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 text-sm md:text-base">
                {isAr ? 'استكشف السوق الزراعي' : 'Explore Marketplace'}
              </a>
              <a href="#architecture" className="border border-border-strong text-text px-8 py-3.5 rounded-sm font-bold shadow-sm hover:border-primary hover:text-primary transition-colors text-sm md:text-base">
                {isAr ? 'الهيكلية التقنية' : 'Platform Architecture'}
              </a>
            </div>
          </div>
          
          {/* RIGHT: Map */}
          <div className="lg:col-span-6 relative h-[350px] md:h-[500px] lg:h-[700px] w-full flex items-center justify-center order-1 lg:order-2">
            <SudanMap lang={locale} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}
