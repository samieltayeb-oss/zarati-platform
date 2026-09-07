import type { Locale } from '@/lib/i18n/config'

export function AgriculturalGeography({ locale, dict }: { locale: Locale; dict: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-24 md:py-32 border-b border-border bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted mb-4 block">04 / {isAr ? 'الجغرافيا' : 'Geography'}</span>
            <h2 className="text-[40px] md:text-[52px] font-bold font-cairo leading-tight text-text mb-6">
              {isAr ? 'أحزمة الإنتاج الزراعي' : 'Agricultural Production Belts'}
            </h2>
            <p className="text-muted text-lg font-sans mb-8 leading-relaxed">
              {isAr 
                ? 'استكشاف التوزيع المكاني للمحاصيل عبر المناطق المناخية في السودان، مع التركيز على مراكز الجملة.'
                : 'Exploring the spatial distribution of commodities across Sudan’s climatic zones, focusing on primary wholesale nodes.'}
            </p>
            <a href={`/${locale}/geography`} className="inline-flex items-center justify-center border border-border-strong px-6 py-2.5 rounded-sm text-sm font-bold bg-surface hover:border-primary hover:text-primary transition-colors">
              {isAr ? 'عرض الجغرافيا الزراعية' : 'View Agricultural Geography'}
            </a>
          </div>
          <div className="md:w-1/2 w-full">
            {/* Subtle Data Viz / Node Concept */}
            <div className="aspect-video bg-surface border border-border-strong rounded-md p-6 relative overflow-hidden flex items-center justify-center shadow-sm">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              <div className="relative z-10 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/20 rounded-full animate-[ping_4s_ease-in-out_infinite] opacity-50"></div>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-success rounded-full shadow-[0_0_15px_rgba(46,125,50,0.6)]"></div>
                
                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-warning rounded-full transform rotate-45 shadow-[0_0_15px_rgba(230,81,0,0.6)]"></div>
                
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  <path d="M 30% 30% L 66% 66%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-primary/30" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
