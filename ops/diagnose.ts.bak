import { createAdminClient } from '../lib/supabase/server';
import { normalizeObservation } from '../lib/normalization/engine';

async function diagnose() {
  const supabase = createAdminClient();
  
  // 1. Verify rules
  const { data: rules } = await supabase.from('unit_conversion_rules').select('*');
  console.log(`PRODUCTION VERIFIED ARDEB RULES: ${rules?.filter(r => r.source_unit_alias === 'ardeb').length || 0}`);
  console.log(`PRODUCTION VERIFIED QINTAR RULES: ${rules?.filter(r => r.source_unit_alias === 'qintar').length || 0}`);
  
  // 2. Unit string distribution
  const { data: obs } = await supabase.from('market_price_observations').select('raw_unit_text, id');
  const counts: any = {};
  for(const o of obs || []) {
    counts[o.raw_unit_text] = (counts[o.raw_unit_text] || 0) + 1;
  }
  console.log('Top raw unit values:');
  console.log(counts);
}

diagnose().catch(console.error);
