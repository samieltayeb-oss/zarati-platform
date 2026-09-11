import { createClient } from '@/lib/supabase/server';

export interface MarketObservation {
  normalized_id: string;
  source_observation_id: string;
  source_observation_date: string;
  commodity_code: string;
  crop_name_en: string;
  market_name_en: string;
  raw_price_text: string;
  raw_currency_text: string;
  raw_unit_text: string;
  normalized_sdg_per_kg: number | null;
  normalized_sdg_per_mt: number | null;
  normalized_usd_per_kg: number | null;
  normalized_usd_per_mt: number | null;
  calculation_version: string;
  unit_resolution_method: string;
  source_explicit_quantity: number | null;
  source_canonical_unit: string | null;
}

export interface IntelligenceOverview {
  totalPublished: number;
  commoditiesCount: number;
  marketsCount: number;
  latestObservationDate: string | null;
}

export interface WeatherObservation {
  id: string;
  provider?: string;
  valid_time: string;
  temperature_celsius: number;
  precipitation_mm: number;
  relative_humidity_percent: number;
  wind_speed_kmh: number;
}

export async function getMarketObservations(): Promise<MarketObservation[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('v_public_normalized_market_prices')
      .select('*')
      .order('source_observation_date', { ascending: false });

    if (error) {
      console.error('Error fetching market observations:', error);
      throw error;
    }
    return data as unknown as MarketObservation[];
  } catch (err) {
    console.error('getMarketObservations exception:', err);
    throw err;
  }
}

export async function getIntelligenceOverview(): Promise<IntelligenceOverview> {
  const observations = await getMarketObservations();
  
  const commodities = new Set(observations.map(o => o.commodity_code));
  const markets = new Set(observations.map(o => o.market_name_en));
  
  let latestDate: string | null = null;
  if (observations.length > 0) {
    latestDate = observations[0].source_observation_date;
  }
  
  return {
    totalPublished: observations.length,
    commoditiesCount: commodities.size,
    marketsCount: markets.size,
    latestObservationDate: latestDate,
  };
}

export async function getMetNorwayWeather(): Promise<WeatherObservation | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('v_public_weather')
      .select('*')
      // Note: provider might not exist on the view or might be filtered by the view.
      // If the view only surfaces approved weather, we can just grab the latest.
      // We will order by valid_time instead of provider_observation_time
      .order('valid_time', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }
    return data as WeatherObservation;
  } catch (err) {
    console.error('getMetNorwayWeather exception:', err);
    return null;
  }
}
