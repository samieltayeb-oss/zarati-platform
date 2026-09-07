import { PosterModal } from '@/components/brand/poster-modal'
import { SudanBadge } from '@/components/brand/sudan-badge'
import type { Locale } from '@/lib/i18n/config'

export default async function IntelligencePreviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isAr = lang === 'ar'
  const locale = lang as Locale

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-16 md:py-24 max-w-6xl space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <SudanBadge lang={locale} variant="header" className="text-[11px]" />
          <span className="bg-primary/10 text-primary border-2 border-primary px-3 py-1 text-xs font-bold uppercase tracking-wider font-mono">
            PLANNED ARCHITECTURE // R4+
          </span>
        </div>
        <h1 className="text-display-md font-bold font-cairo">
          {isAr ? 'استخبارات البيانات والتسعير القومي' : 'National Data Intelligence & Commodity Pricing'}
        </h1>
        <p className="text-lg text-muted max-w-3xl font-medium leading-relaxed">
          {isAr
            ? 'بنية تحتية رقمية متكاملة تربط أسواق المحاصيل في 18 ولاية سودانية، وتوفر مؤشرات أسعار لحظية، وتحليلات المناخ والاستشعار الفضائي لدعم القرار الزراعي.'
            : 'An integrated digital data infrastructure connecting crop exchanges across Sudan’s 18 states, delivering real-time pricing indices, satellite agro-climate telemetry, and sovereign situation room analytics.'}
        </p>
      </div>

      {/* Featured Architecture Poster 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#07170e] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-white">
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary-light text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            <span>{isAr ? 'خريطة الـ 18 ولاية والمنصات الذكية' : '18-STATE SPATIAL & PLATFORM SUITE'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-cairo text-white leading-snug">
            {isAr ? 'بيانات اليوم .. لحصاد أفضل غداً' : 'Data Today .. A Better Harvest Tomorrow'}
          </h2>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'تغطي المنصة سلسلة القيمة الزراعية السودانية بدءاً من حقول الجزيرة والقضارف وسنار وصولاً إلى الموانئ والأسواق الدولية، مدعومة بمؤشرات لحظية للسمسم، الذرة، والفول السوداني.'
              : "Bridging Sudan's agricultural value chain from farmgates in Gezira, Gedaref, and Sennar to terminals and international markets with live market trend telemetry."}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="text-primary-light block font-bold text-lg font-cairo">18 ولاية</span>
              <span className="text-white/60">{isAr ? 'تغطية جغرافية كاملة' : 'Full Spatial Scope'}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
              <span className="text-primary-light block font-bold text-lg font-cairo">+250 سوق</span>
              <span className="text-white/60">{isAr ? 'بورصات ومجمعات تجميع' : 'Exchanges & Hubs'}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <PosterModal
            src="/images/zarati/posters/poster-2-data-today.png"
            alt={isAr ? 'بوستر زرعتي: بيانات اليوم لحصاد أفضل غدًا' : 'ZARATI Poster: Data Today .. A Better Harvest Tomorrow'}
            title={isAr ? 'بيانات اليوم لحصاد أفضل غدًا — استخبارات الـ 18 ولاية' : 'Data Today .. Better Harvest Tomorrow — 18-State Intelligence'}
            priority
            className="border-white/20 shadow-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-canvas border-2 border-border-strong p-8 opacity-90 rounded-2xl">
          <h3 className="font-bold text-xl font-cairo mb-3 text-text">{isAr ? 'مؤشر أسعار المحاصيل' : 'Crop Price Index'}</h3>
          <p className="text-muted text-sm font-medium">
            {isAr ? 'البنية التحتية المخططة لتتبع أسعار السمسم، الذرة، الفول السوداني والصمغ العربي في أسواق القضارف والأبيض.' : 'Planned infrastructure for tracking prices of Sesame, Sorghum, Groundnuts, and Gum Arabic across Gedaref and El Obeid markets.'}
          </p>
          <div className="mt-6 border-t-2 border-dashed border-border-strong pt-6">
            <div className="h-4 bg-border-strong rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-border-strong rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-border-strong rounded w-5/6"></div>
          </div>
        </div>

        <div className="bg-surface-canvas border-2 border-border-strong p-8 opacity-90 rounded-2xl">
          <h3 className="font-bold text-xl font-cairo mb-3 text-text">{isAr ? 'تحليلات المناخ والأمطار' : 'Climate & Rainfall Analytics'}</h3>
          <p className="text-muted text-sm font-medium">
            {isAr ? 'بيانات الطقس المخططة وتوقعات هطول الأمطار للمناطق الزراعية المطرية والمروية.' : 'Planned weather data and precipitation forecasting for rainfed and irrigated agricultural zones.'}
          </p>
          <div className="mt-6 border-t-2 border-dashed border-border-strong pt-6 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-border-strong"></div>
            <div className="flex-1">
              <div className="h-4 bg-border-strong rounded w-full mb-2"></div>
              <div className="h-4 bg-border-strong rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
