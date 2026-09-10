import { createAdminClient } from '@/lib/supabase/server';

export type RateClass = 'OFFICIAL' | 'PARALLEL_MARKET' | 'INSTITUTIONAL_REFERENCE' | 'OTHER_APPROVED_REFERENCE';

export async function getFXRate(
  baseCurrency: string,
  quoteCurrency: string,
  observationDate: string,
  rateClass: RateClass
): Promise<{ id: string; rate: number; observed_date: string } | null> {
  const supabase = createAdminClient();
  
  const dateString = observationDate.split('T')[0];
  
  const { data: exactMatches, error: exactErr } = await supabase
    .from('fx_rate_observations')
    .select('id, rate, observed_date')
    .eq('base_currency', baseCurrency)
    .eq('quote_currency', quoteCurrency)
    .eq('rate_class', rateClass)
    .eq('observed_date', dateString)
    .eq('verification_status', 'VERIFIED');

  if (exactErr) throw new Error(exactErr.message);

  if (exactMatches && exactMatches.length === 1) {
    return exactMatches[0];
  }
  if (exactMatches && exactMatches.length > 1) {
    throw new Error('FX_RATE_CONFLICT');
  }

  const matchDate = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matchDate) throw new Error('Invalid date format');
  const d = new Date(Date.UTC(parseInt(matchDate[1]), parseInt(matchDate[2]) - 1, parseInt(matchDate[3])));
  d.setUTCDate(d.getUTCDate() - 7);
  const sevenDaysAgo = d.toISOString().split('T')[0];

  const { data: precedingCandidates, error: precErr } = await supabase
    .from('fx_rate_observations')
    .select('id, rate, observed_date')
    .eq('base_currency', baseCurrency)
    .eq('quote_currency', quoteCurrency)
    .eq('rate_class', rateClass)
    .eq('verification_status', 'VERIFIED')
    .lt('observed_date', dateString)
    .gte('observed_date', sevenDaysAgo)
    .order('observed_date', { ascending: false });

  if (precErr) throw new Error(precErr.message);

  if (precedingCandidates && precedingCandidates.length > 0) {
    const nearestDate = precedingCandidates[0].observed_date;
    const sameDateMatches = precedingCandidates.filter(c => c.observed_date === nearestDate);
    
    if (sameDateMatches.length === 1) {
      return sameDateMatches[0];
    }
    if (sameDateMatches.length > 1) {
      throw new Error('FX_RATE_CONFLICT');
    }
  }

  return null;
}
