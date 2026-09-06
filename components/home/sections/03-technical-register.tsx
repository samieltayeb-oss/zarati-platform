import type { Locale } from '@/lib/i18n/config'
export function TechnicalRegister({ locale, dict }: { locale: Locale; dict: any }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 border-b border-border bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-lg font-bold font-cairo mb-4 text-text">
          {isAr ? 'سجل القدرات التقنية' : 'Technical Reality Register'}
        </h2>
        <p className="text-muted text-lg max-w-3xl font-sans">
          {isAr ? 'القدرات النشطة، والمخطط لها، والرؤية المستقبلية.' : '10-Phase Capabilities Matrix (Live, Planned, Vision).'}
        </p>
      </div>
    </section>
  )
}
