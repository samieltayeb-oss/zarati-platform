import { createAdminClient } from '../lib/supabase/server';
async function test() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('market_price_observations').select('*').limit(1);
  console.log(data);
}
test().catch(console.error);
