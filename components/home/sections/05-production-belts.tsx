import type { Locale } from '@/lib/i18n/config'
export function ProductionBelts({ locale, dict }: { locale: Locale; dict: any }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 border-b border-border bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-lg font-bold font-cairo mb-4 text-text">
          {isAr ? 'أحزمة الإنتاج الزراعي الثلاثة' : 'The 3 Production Belts'}
        </h2>
        <p className="text-muted text-lg max-w-3xl font-sans">
          {isAr ? 'المروي، المطري الآلي، والمطري التقليدي.' : 'Irrigated Schemes vs Semi-Mechanized Rainfed vs Traditional Qoz.'}
        </p>
      </div>
    </section>
  )
}
