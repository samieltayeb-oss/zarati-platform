import { createAdminClient } from '@/lib/supabase/server';

export type RateClass = 'OFFICIAL' | 'PARALLEL_MARKET' | 'INSTITUTIONAL_REFERENCE' | 'OTHER_APPROVED_REFERENCE';

export async function getFXRate(
  baseCurrency: string,
  quoteCurrency: string,
  observationDate: string,
  rateClass: RateClass
): Promise<{ id: string; rate: number; observed_date: string } | null> {
  const supabase = createAdminClient();
  
  // 1. Exact match
  const { data: exactMatch } = await supabase
    .from('fx_rate_observations')
    .select('id, rate, observed_date')
    .eq('base_currency', baseCurrency)
    .eq('quote_currency', quoteCurrency)
    .eq('rate_class', rateClass)
    .eq('observed_date', observationDate)
    .single();

  if (exactMatch) {
    return exactMatch;
  }

  // 2. Nearest preceding match within 7 days
  const dateObj = new Date(observationDate);
  const sevenDaysAgo = new Date(dateObj);
  sevenDaysAgo.setDate(dateObj.getDate() - 7);

  const { data: precedingMatch } = await supabase
    .from('fx_rate_observations')
    .select('id, rate, observed_date')
    .eq('base_currency', baseCurrency)
    .eq('quote_currency', quoteCurrency)
    .eq('rate_class', rateClass)
    .lte('observed_date', observationDate)
    .gte('observed_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('observed_date', { ascending: false })
    .limit(1)
    .single();

  if (precedingMatch) {
    return precedingMatch;
  }

  // 3. Otherwise unavailable
  return null;
}
