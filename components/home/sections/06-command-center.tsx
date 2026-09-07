import type { Locale } from '@/lib/i18n/config'
export function CommandCenterPreview({ locale, dict }: { locale: Locale; dict: unknown }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 border-b border-border bg-surface-dark-canvas text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="inline-block bg-blue-900/50 text-blue-200 px-3 py-1 text-xs font-bold rounded mb-4">
          {isAr ? 'مخطط للمرحلة 7 // للشركاء المؤسسيين فقط' : 'PLANNED FOR R7 // INSTITUTIONAL PARTNERS ONLY'}
        </div>
        <h2 className="text-display-lg font-bold font-cairo mb-4">
          {isAr ? 'غرفة العمليات القومية' : 'Sovereign Command Center Preview'}
        </h2>
        <p className="text-white/80 text-lg max-w-3xl font-sans">
          {isAr ? 'الميزان الغذائي الوطني ولوحة مراقبة صوامع الغلال.' : 'Architectural preview shell of the National Food Balance Situation Room.'}
        </p>
      </div>
    </section>
  )
}
