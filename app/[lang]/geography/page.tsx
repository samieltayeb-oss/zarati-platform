import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/config'
import { getGeographyData } from '@/lib/services/geography'
import { AgriculturalGeographyExplorer } from '@/components/geography/AgriculturalGeographyExplorer'

export const revalidate = 0 // Real-time verified market data

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isAr = lang === 'ar'
  return {
    title: isAr
      ? 'الجغرافيا الزراعية السيادية — منصة زاراتي'
      : 'Agricultural Geography Explorer — ZARATI Sovereign Platform',
    description: isAr
      ? 'استكشف الأسواق الزراعية الموثقة، السلع، والتغطية البيانية الفعلية في السودان.'
      : 'Explore verified agricultural markets, commodities, and data coverage across Sudan.'
  }
}

export default async function GeographyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isAr = lang === 'ar'
  const locale = lang as Locale

  let data = null
  let hasError = false

  try {
    data = await getGeographyData()
  } catch (err) {
    console.error('[GeographyPage] Error fetching geography data:', err)
    hasError = true
  }

  if (hasError || !data) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className={`container py-16 max-w-5xl mx-auto px-4 ${isAr ? 'font-cairo' : ''}`}>
        <div className="bg-surface-canvas border-2 border-danger/30 rounded-2xl p-8 text-center space-y-3">
          <div className="text-3xl">⚠️</div>
          <h1 className="text-xl font-bold text-text">
            {isAr ? 'بيانات الجغرافيا الزراعية غير متاحة مؤقتاً' : 'Agricultural Geography Temporarily Unavailable'}
          </h1>
          <p className="text-muted text-sm max-w-md mx-auto">
            {isAr
              ? 'يرجى المحاولة مرة أخرى لاحقاً بعد استقرار اتصال قاعدة البيانات.'
              : 'Please try again momentarily while the connection to the production registry is re-established.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`container py-8 md:py-12 max-w-[1440px] px-4 md:px-8 mx-auto ${isAr ? 'font-cairo' : ''}`}
    >
      <AgriculturalGeographyExplorer lang={locale} data={data} />
    </div>
  )
}
