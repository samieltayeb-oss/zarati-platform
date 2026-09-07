import type { Locale } from '@/lib/i18n/config'
export function FieldExperience({ locale }: { locale: Locale; dict?: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 border-b border-border bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-lg font-bold font-cairo mb-4 text-text">
          {isAr ? 'هندسة تجربة الحقل' : 'Field Experience Architecture'}
        </h2>
        <p className="text-muted text-lg max-w-3xl font-sans">
          {isAr ? 'واجهة بسيطة من 3 خطوات للمزارعين، واكتشاف متقدم للتجار.' : '3-Tap vernacular flow for Farmers; Bloomberg-grade discovery for Traders.'}
        </p>
      </div>
    </section>
  )
}
