import { getDictionary } from '@/lib/i18n/getDictionary'
import { getTopCrops } from '@/lib/services/crop-service'
import { getAllCitiesWeather } from '@/lib/services/weather-service'
import { getFeaturedListings } from '@/lib/services/marketplace-service'
import type { Locale } from '@/lib/i18n/config'
import { HeroSection } from '@/components/home/hero-section'
import { MissionSection } from '@/components/home/mission-section'
import { StatsSection } from '@/components/home/stats-section'
import { CropSnapshot } from '@/components/home/crop-snapshot'
import { WeatherSnapshot } from '@/components/home/weather-snapshot'
import { AiPreview } from '@/components/home/ai-preview'
import { MarketplacePreview } from '@/components/home/marketplace-preview'
import { FutureVision } from '@/components/home/future-vision'
import { CtaSection } from '@/components/home/cta-section'

type Props = { params: Promise<{ lang: string }> }

export default async function Page({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale

  const [dict, crops, weather, listings] = await Promise.all([
    getDictionary(locale),
    getTopCrops(6),
    getAllCitiesWeather(),
    getFeaturedListings(4),
  ])

  const { home, common } = dict

  return (
    <>
      <HeroSection lang={locale} dict={home.hero} />
      <MissionSection dict={home.mission} />
      <StatsSection dict={home.stats} />
      <CropSnapshot
        lang={locale}
        crops={crops}
        dict={home.cropSnapshot}
        viewAllLabel={common.viewAll}
      />
      <WeatherSnapshot
        lang={locale}
        weather={weather}
        dict={{ ...home.weatherSnapshot, ...dict.weather }}
      />
      <AiPreview dict={home.aiPreview} />
      <MarketplacePreview
        lang={locale}
        listings={listings}
        dict={home.marketplacePreview}
        demoLabel={common.demoData}
        sellerLabel={dict.marketplace.seller}
        locationLabel={dict.marketplace.location}
        quantityLabel={dict.marketplace.quantity}
      />
      <FutureVision lang={locale} dict={home.futureVision} />
      <CtaSection lang={locale} dict={home.cta} />
    </>
  )
}
