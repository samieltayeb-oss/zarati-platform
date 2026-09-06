import { SudanMap } from '@/components/maps/SudanMap'
import type { Locale } from '@/lib/i18n/config'

export function SovereignHero({ locale, dict }: { locale: Locale; dict: any }) {
  const isAr = locale === 'ar'
  return (
    <section className="bg-surface-dark-canvas text-white py-20 border-b border-border-strong relative overflow-hidden min-h-[600px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-display-xl md:text-display-2xl font-bold font-cairo mb-6 leading-tight">
              {isAr ? 'زرعتي — البنية التحتية للذكاء الزراعي والسيادة الغذائية في السودان' : "ZARATI — Sudan's Agricultural Intelligence Infrastructure"}
            </h1>
            <p className="text-xl max-w-xl text-white/80 mb-8 font-sans leading-relaxed">
              {isAr ? 'نظام تشغيل سيادي يربط المزارعين والمراكز الإقليمية والأسواق العالمية.' : 'A sovereign operating system connecting farmers, regional hubs, and global markets.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`/${locale}/marketplace`} className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors">
                {isAr ? 'استكشف السوق الزراعي' : 'Explore Marketplace'}
              </a>
              <a href="#architecture" className="border border-white/20 px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors">
                {isAr ? 'الهيكلية التقنية' : 'Examine Architecture'}
              </a>
            </div>
          </div>
          
          <div className="relative h-[400px] lg:h-[550px] w-full flex items-center justify-center">
            {/* The signature map */}
            <SudanMap lang={locale} className="w-full h-full object-contain drop-shadow-2xl opacity-90 hover:opacity-100 transition-opacity duration-500" />
            
            {/* Subtle radial gradient overlay to blend map into the dark canvas */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-surface-dark-canvas/80 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
