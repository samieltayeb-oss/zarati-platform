import type { Locale } from '@/lib/i18n/config'
export function B2bMarketplace({ locale, dict }: { locale: Locale; dict: any }) {
  const isAr = locale === 'ar'
  return (
    <section className="py-20 border-b border-border bg-surface-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-lg font-bold font-cairo mb-4 text-text">
          {isAr ? 'سوق الجملة للشركات' : 'B2B Marketplace Discovery'}
        </h2>
        <p className="text-muted text-lg max-w-3xl font-sans mb-8">
          {isAr ? 'عروض موثقة بأسعار حقيقية للكميات التجارية.' : 'Live feed of verified bulk commodity listings.'}
        </p>
        <a href={`/${locale}/marketplace`} className="inline-block border border-border-strong px-4 py-2 rounded text-sm font-bold">
          {isAr ? 'تصفح السوق' : 'Browse Marketplace'}
        </a>
      </div>
    </section>
  )
}
