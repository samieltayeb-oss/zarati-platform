import type { Locale } from '@/lib/i18n/config'
import { dict } from '@/lib/i18n/intelligence-dict'
import { getMarketObservations, getIntelligenceOverview, getMetNorwayWeather } from '@/lib/services/intelligence'
import { IntelligenceDashboardClient } from './components/IntelligenceDashboardClient'

export const revalidate = 0; // Disable cache for the sake of the live experience

export default async function IntelligencePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isAr = lang === 'ar'
  const locale = lang as Locale
  const t = dict[locale as keyof typeof dict] || dict.en

  let overview = null;
  let observations = null;
  let weather = null;
  let hasError = false;

  try {
    // Fetch data on the server
    overview = await getIntelligenceOverview();
    observations = await getMarketObservations();
    weather = await getMetNorwayWeather();
  } catch (error) {
    console.error('[IntelligencePage] Error fetching intelligence data:', error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className={`container py-12 md:py-20 max-w-7xl space-y-16 ${isAr ? 'font-cairo' : ''}`}>
        <div className="space-y-4">
          <h1 className="text-display-lg font-bold text-text">
            {t.sudanAgriIntel}
          </h1>
          <div className="p-8 border border-red-200 bg-red-50 text-red-700 rounded-lg text-center">
            {isAr ? 'بيانات السوق غير متاحة مؤقتاً' : 'Market intelligence temporarily unavailable'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className={`container py-8 md:py-12 max-w-[1440px] px-4 md:px-8 mx-auto ${isAr ? 'font-cairo' : ''}`}>
      <IntelligenceDashboardClient 
        t={t}
        overview={overview!}
        observations={observations!}
        weather={weather}
        isAr={isAr}
      />
    </div>
  )
}
