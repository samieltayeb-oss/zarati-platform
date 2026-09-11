import type { Locale } from '@/lib/i18n/config'
import { dict } from '@/lib/i18n/intelligence-dict'
import { getMarketObservations, getIntelligenceOverview, getMetNorwayWeather } from '@/lib/services/intelligence'
import { IntelligenceOverviewComponent } from './components/IntelligenceOverview'
import { MarketExplorer } from './components/MarketExplorer'
import { WeatherIntelligence } from './components/WeatherIntelligence'
import { DataTrust } from './components/DataTrust'

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
    <div dir={isAr ? 'rtl' : 'ltr'} className={`container py-12 md:py-20 max-w-7xl space-y-16 ${isAr ? 'font-cairo' : ''}`}>
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-display-lg font-bold text-text">
          {t.sudanAgriIntel}
        </h1>
        <p className="text-xl text-muted max-w-4xl font-medium leading-relaxed">
          {t.sudanAgriIntelDesc}
        </p>
      </div>

      {/* High-level Overview */}
      <IntelligenceOverviewComponent t={t} overview={overview!} isAr={isAr} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          {/* Market Intelligence Table */}
          <MarketExplorer t={t} observations={observations!} isAr={isAr} />
          
          {/* Data Trust Layer */}
          <DataTrust t={t} isAr={isAr} />
        </div>
        
        <div className="lg:col-span-4 space-y-8">
          {/* Weather Panel */}
          <WeatherIntelligence t={t} weather={weather} isAr={isAr} />
        </div>
      </div>
    </div>
  )
}
