import { createServerClient } from '@/lib/supabase/server'
import { getMarketObservations, getMetNorwayWeather, type MarketObservation, type WeatherObservation } from './intelligence'

export interface GeographicCoordinate {
  latitude: number
  longitude: number
  svgX: number
  svgY: number
  precision: 'EXACT' | 'LOCALITY_APPROXIMATION' | 'NO_VERIFIED_LOCATION'
  source: string
}

// Canonical coordinates verified against WFP VAM and MET Norway contracts
// Projecting: x = (longitude - 21.4) * 29.8, y = (23.5 - latitude) * 30.6 (matching SudanMap.tsx SVG viewBox 520x453)
export const CANONICAL_MARKET_COORDINATES: Record<string, GeographicCoordinate> = {
  'MKT-GD-01': {
    latitude: 14.04,
    longitude: 35.38,
    svgX: 415.0,
    svgY: 281.8,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'WFP VAM (Market 2580) / MET Norway'
  },
  'MKT-OB-01': {
    latitude: 13.19,
    longitude: 30.22,
    svgX: 260.5,
    svgY: 307.4,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'WFP VAM (Market 1029)'
  },
  'MKT-KT-01': {
    latitude: 13.17,
    longitude: 32.67,
    svgX: 335.6,
    svgY: 307.4,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'WFP VAM (Market 1032)'
  },
  'MKT-KH-01': {
    latitude: 15.51,
    longitude: 32.54,
    svgX: 329.6,
    svgY: 236.5,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'WFP VAM (Market 2588)'
  },
  'MKT-KS-01': {
    latitude: 15.46,
    longitude: 36.40,
    svgX: 444.8,
    svgY: 239.6,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'WFP VAM (Market 1031)'
  },
  'MKT-DM-01': {
    latitude: 11.79,
    longitude: 34.36,
    svgX: 385.0,
    svgY: 350.0,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'WFP VAM (Market 1026)'
  },
  'MKT-PS-01': {
    latitude: 19.62,
    longitude: 37.22,
    svgX: 469.2,
    svgY: 115.3,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'WFP VAM (Market 1034)'
  },
  'MKT-WM-01': {
    latitude: 14.40,
    longitude: 33.52,
    svgX: 358.1,
    svgY: 271.1,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'City Locality Coordinates (Gezira)'
  },
  'MKT-SN-01': {
    latitude: 13.55,
    longitude: 33.56,
    svgX: 360.0,
    svgY: 296.0,
    precision: 'LOCALITY_APPROXIMATION',
    source: 'City Locality Coordinates (Sennar)'
  },
  'MKT-NY-01': {
    latitude: 12.05,
    longitude: 24.88,
    svgX: 105.0,
    svgY: 345.0,
    precision: 'NO_VERIFIED_LOCATION',
    source: 'Unverified Locality Coordinates (Suppressed from Map)'
  }
}

export interface EnrichedMarket {
  id: string
  code: string
  name_en: string
  name_ar: string
  city_en: string
  city_ar: string
  market_type: string
  state_id: string
  state_name_en: string
  state_name_ar: string
  state_code: string
  coordinates: GeographicCoordinate | null
  hasVerifiedCoordinates: boolean
  observationCount: number
  commodities: {
    code: string
    name_en: string
    count: number
  }[]
  latestObservationDate: string | null
  latestNormalizedPrice: {
    sdg_per_kg: number | null
    sdg_per_mt: number | null
    raw_price_text: string
    raw_unit_text: string
    crop_name_en: string
    date: string
  } | null
  hasWeather: boolean
  coverageStatus: 'VERIFIED' | 'LIMITED' | 'NO_DATA'
}

export interface EnrichedState {
  id: string
  code: string
  name_en: string
  name_ar: string
  region: string
  capital_en: string
  capital_ar: string
  marketCount: number
  markets: {
    id: string
    code: string
    name_en: string
    name_ar: string
    observationCount: number
  }[]
  observationCount: number
  commodities: string[]
  latestObservationDate: string | null
  coverageStatus: 'VERIFIED' | 'LIMITED' | 'NO_DATA'
  hasWeather: boolean
}

export interface GeographyDataBundle {
  markets: EnrichedMarket[]
  states: EnrichedState[]
  commodities: {
    code: string
    name_en: string
    observationCount: number
    marketCount: number
  }[]
  weather: WeatherObservation | null
  summary: {
    totalStates: number
    statesWithData: number
    marketsRepresented: number
    totalMarketsInRegistry: number
    marketsWithVerifiedCoordinates: number
    marketsWithoutVerifiedCoordinates: number
    totalPublishedObservations: number
    commoditiesCount: number
    weatherLocationsCount: number
    latestObservationDate: string | null
  }
}

export async function getGeographyData(): Promise<GeographyDataBundle> {
  const supabase = await createServerClient()

  // 1. Fetch public-safe market intelligence observations (102 rows)
  const observations: MarketObservation[] = await getMarketObservations()

  // 2. Fetch real weather (MET Norway Gedaref)
  const weather: WeatherObservation | null = await getMetNorwayWeather()

  // 3. Fetch canonical reference states (18 states)
  const { data: statesData, error: statesErr } = await supabase
    .from('states')
    .select('id, code, name_en, name_ar, region, capital_en, capital_ar')
    .order('name_en', { ascending: true })

  if (statesErr || !statesData) {
    throw new Error(`Failed to load states: ${statesErr?.message || 'Unknown error'}`)
  }

  // 4. Fetch canonical reference markets (10 markets)
  const { data: marketsData, error: marketsErr } = await supabase
    .from('markets')
    .select('id, code, name_en, name_ar, city_en, city_ar, market_type, state_id')
    .order('name_en', { ascending: true })

  if (marketsErr || !marketsData) {
    throw new Error(`Failed to load markets: ${marketsErr?.message || 'Unknown error'}`)
  }

  // Build state map for lookup
  const stateMap = new Map(statesData.map((s) => [s.id, s]))

  // Process observations by market
  const observationsByMarket = new Map<string, MarketObservation[]>()
  observations.forEach((obs) => {
    const list = observationsByMarket.get(obs.market_name_en) || []
    list.push(obs)
    observationsByMarket.set(obs.market_name_en, list)
  })

  // Build enriched markets
  const enrichedMarkets: EnrichedMarket[] = marketsData.map((m) => {
    const state = stateMap.get(m.state_id)
    const marketObs = observationsByMarket.get(m.name_en) || []
    const coord = CANONICAL_MARKET_COORDINATES[m.code] || null
    const hasVerifiedCoords = coord !== null && coord.precision !== 'NO_VERIFIED_LOCATION'

    // Commodities in this market
    const commodityCounts = new Map<string, { code: string; name_en: string; count: number }>()
    marketObs.forEach((o) => {
      const existing = commodityCounts.get(o.crop_name_en) || { code: o.commodity_code, name_en: o.crop_name_en, count: 0 }
      existing.count++
      commodityCounts.set(o.crop_name_en, existing)
    })

    // Latest observation
    let latestObservationDate: string | null = null
    let latestNormalizedPrice: EnrichedMarket['latestNormalizedPrice'] = null

    if (marketObs.length > 0) {
      const sorted = [...marketObs].sort(
        (a, b) => new Date(b.source_observation_date).getTime() - new Date(a.source_observation_date).getTime()
      )
      latestObservationDate = sorted[0].source_observation_date
      latestNormalizedPrice = {
        sdg_per_kg: sorted[0].normalized_sdg_per_kg,
        sdg_per_mt: sorted[0].normalized_sdg_per_mt,
        raw_price_text: sorted[0].raw_price_text,
        raw_unit_text: sorted[0].raw_unit_text,
        crop_name_en: sorted[0].crop_name_en,
        date: sorted[0].source_observation_date
      }
    }

    // Determine coverage status
    let coverageStatus: EnrichedMarket['coverageStatus'] = 'NO_DATA'
    if (marketObs.length >= 50) {
      coverageStatus = 'VERIFIED'
    } else if (marketObs.length > 0) {
      coverageStatus = 'LIMITED'
    }

    const hasWeather = m.code === 'MKT-GD-01' && weather !== null

    return {
      id: m.id,
      code: m.code,
      name_en: m.name_en,
      name_ar: m.name_ar,
      city_en: m.city_en,
      city_ar: m.city_ar,
      market_type: m.market_type,
      state_id: m.state_id,
      state_name_en: state?.name_en || '',
      state_name_ar: state?.name_ar || '',
      state_code: state?.code || '',
      coordinates: coord,
      hasVerifiedCoordinates: hasVerifiedCoords,
      observationCount: marketObs.length,
      commodities: Array.from(commodityCounts.values()),
      latestObservationDate,
      latestNormalizedPrice,
      hasWeather,
      coverageStatus
    }
  })

  // Build enriched states
  const enrichedStates: EnrichedState[] = statesData.map((s) => {
    const stateMarkets = enrichedMarkets.filter((m) => m.state_id === s.id)
    const totalObs = stateMarkets.reduce((sum, m) => sum + m.observationCount, 0)
    const commoditySet = new Set<string>()
    let latestDate: string | null = null

    stateMarkets.forEach((m) => {
      m.commodities.forEach((c) => commoditySet.add(c.name_en))
      if (m.latestObservationDate) {
        if (!latestDate || new Date(m.latestObservationDate).getTime() > new Date(latestDate).getTime()) {
          latestDate = m.latestObservationDate
        }
      }
    })

    let coverageStatus: EnrichedState['coverageStatus'] = 'NO_DATA'
    if (totalObs >= 50) {
      coverageStatus = 'VERIFIED'
    } else if (totalObs > 0) {
      coverageStatus = 'LIMITED'
    }

    const hasWeather = stateMarkets.some((m) => m.hasWeather)

    return {
      id: s.id,
      code: s.code,
      name_en: s.name_en,
      name_ar: s.name_ar,
      region: s.region,
      capital_en: s.capital_en,
      capital_ar: s.capital_ar,
      marketCount: stateMarkets.length,
      markets: stateMarkets.map((m) => ({
        id: m.id,
        code: m.code,
        name_en: m.name_en,
        name_ar: m.name_ar,
        observationCount: m.observationCount
      })),
      observationCount: totalObs,
      commodities: Array.from(commoditySet),
      latestObservationDate: latestDate,
      coverageStatus,
      hasWeather
    }
  })

  // Aggregated commodities present in public observations
  const commodityAgg = new Map<string, { code: string; name_en: string; count: number; markets: Set<string> }>()
  observations.forEach((o) => {
    const existing = commodityAgg.get(o.crop_name_en) || {
      code: o.commodity_code,
      name_en: o.crop_name_en,
      count: 0,
      markets: new Set<string>()
    }
    existing.count++
    existing.markets.add(o.market_name_en)
    commodityAgg.set(o.crop_name_en, existing)
  })

  const commodities = Array.from(commodityAgg.values()).map((c) => ({
    code: c.code,
    name_en: c.name_en,
    observationCount: c.count,
    marketCount: c.markets.size
  }))

  const statesWithData = enrichedStates.filter((s) => s.observationCount > 0).length
  const marketsRepresented = enrichedMarkets.filter((m) => m.observationCount > 0).length
  const marketsWithVerifiedCoords = enrichedMarkets.filter((m) => m.hasVerifiedCoordinates).length
  const marketsWithoutVerifiedCoords = enrichedMarkets.filter((m) => !m.hasVerifiedCoordinates).length

  let latestObsDate: string | null = null
  if (observations.length > 0) {
    latestObsDate = observations[0].source_observation_date
  }

  return {
    markets: enrichedMarkets,
    states: enrichedStates,
    commodities,
    weather,
    summary: {
      totalStates: enrichedStates.length,
      statesWithData,
      marketsRepresented,
      totalMarketsInRegistry: enrichedMarkets.length,
      marketsWithVerifiedCoordinates: marketsWithVerifiedCoords,
      marketsWithoutVerifiedCoordinates: marketsWithoutVerifiedCoords,
      totalPublishedObservations: observations.length,
      commoditiesCount: commodities.length,
      weatherLocationsCount: weather ? 1 : 0,
      latestObservationDate: latestObsDate
    }
  }
}
