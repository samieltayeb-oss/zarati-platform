import type { Locale } from '@/lib/i18n/config'
export function NationalReality({ locale, dict }: { locale: Locale; dict: any }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 border-b border-border bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-lg font-bold font-cairo mb-4 text-text">
          {isAr ? 'الواقع الزراعي الوطني' : 'National Ground Reality'}
        </h2>
        <p className="text-muted text-lg max-w-3xl font-sans">
          {isAr ? 'حقائق وأرقام مؤكدة عن الزراعة في السودان: 24 مليون فدان، واعتماد كبير على الزراعة.' : "Verified context on Sudan's agro-economy: 24M cultivated feddans, 60-80% dependency."}
        </p>
      </div>
    </section>
  )
}
