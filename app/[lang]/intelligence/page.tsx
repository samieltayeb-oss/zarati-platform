import { SudanBadge } from '@/components/brand/sudan-badge'
import type { Locale } from '@/lib/i18n/config'

export default async function IntelligencePreviewPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isAr = lang === 'ar'
  const locale = lang as Locale

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="container py-24 max-w-5xl space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <SudanBadge lang={locale} variant="header" className="text-[11px]" />
          <span className="bg-primary/10 text-primary border-2 border-primary px-3 py-1 text-xs font-bold uppercase tracking-wider font-mono">
            PLANNED ARCHITECTURE
          </span>
        </div>
        <h1 className="text-display-md font-bold font-cairo">
          {isAr ? 'الاستخبارات الزراعية والتسعير' : 'Agricultural Intelligence & Pricing'}
        </h1>
        <p className="text-lg text-muted max-w-2xl font-medium leading-relaxed">
          {isAr
            ? 'هذه الوحدة مخطط تطويرها مستقبلاً لتوفير بنية بيانات منظمة لأسعار المحاصيل، بيانات المناخ، وتحليلات العرض والطلب الاستراتيجية.'
            : 'This module is planned for future development. It will provide a structured data infrastructure for crop pricing, climate data, and strategic supply/demand intelligence.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-canvas border-2 border-border-strong p-8 opacity-75">
          <h3 className="font-bold text-xl font-cairo mb-3 text-muted">{isAr ? 'مؤشر أسعار المحاصيل' : 'Crop Price Index'}</h3>
          <p className="text-muted text-sm font-medium">
            {isAr ? 'البنية التحتية المخططة لتتبع أسعار السمسم، الذرة، الفول السوداني والصمغ العربي في أسواق القضارف والأبيض.' : 'Planned infrastructure for tracking prices of Sesame, Sorghum, Groundnuts, and Gum Arabic across Gedaref and El Obeid markets.'}
          </p>
          <div className="mt-6 border-t-2 border-dashed border-border-strong pt-6">
            <div className="h-4 bg-border-strong rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-border-strong rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-border-strong rounded w-5/6"></div>
          </div>
        </div>

        <div className="bg-surface-canvas border-2 border-border-strong p-8 opacity-75">
          <h3 className="font-bold text-xl font-cairo mb-3 text-muted">{isAr ? 'تحليلات المناخ والأمطار' : 'Climate & Rainfall Analytics'}</h3>
          <p className="text-muted text-sm font-medium">
            {isAr ? 'بيانات الطقس المخططة وتوقعات هطول الأمطار للمناطق الزراعية المطرية.' : 'Planned weather data and precipitation forecasting for rainfed agricultural zones.'}
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
