import type { Locale } from '@/lib/i18n/config'
export function TrustProvenance({ locale, dict }: { locale: Locale; dict: any }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 border-b border-border bg-surface-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-lg font-bold font-cairo mb-4 text-text">
          {isAr ? 'الثقة ومصادر البيانات' : 'Trust & Data Provenance Engine'}
        </h2>
        <p className="text-muted text-lg max-w-3xl font-sans">
          {isAr ? 'شارات المصادر (SSMO، ESA Sentinel-2، WFP VAM) وبروتوكول الإفصاح المتبادل.' : 'Data Source Badges, Privacy-preserving RFQ bilateral release protocol, security audit logs.'}
        </p>
      </div>
    </section>
  )
}
