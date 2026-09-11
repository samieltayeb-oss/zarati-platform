import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { getProfileById } from './profile-service';

export async function isAuthorizedOperator(): Promise<boolean> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const profile = await getProfileById(user.id);
  if (!profile) return false;
  
  // Only admin and government/NGO might have operation oversight, but strictly admin for operations
  return profile.role === 'admin';
}

export interface FeedExecution {
  id: string;
  feed_type: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  records_fetched: number;
  records_valid: number;
  records_inserted: number;
  records_existing: number;
  records_rejected: number;
  records_quarantined: number;
  error_category: string | null;
}

export async function getFeedExecutions(limit = 50): Promise<FeedExecution[]> {
  const isAuth = await isAuthorizedOperator();
  if (!isAuth) throw new Error("Unauthorized");

  const adminClient = await createAdminClient();
  const { data, error } = await adminClient
    .from('external_feed_executions')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching feed executions:', error);
    return [];
  }
  return data as FeedExecution[];
}

export async function getQuarantinedRecords() {
  const isAuth = await isAuthorizedOperator();
  if (!isAuth) throw new Error("Unauthorized");

  const adminClient = await createAdminClient();
  const { data, error } = await adminClient
    .from('market_price_observations')
    .select(`
      id, 
      observed_at, 
      raw_price_text, 
      raw_currency_text, 
      raw_unit_text, 
      publication_status, 
      source_provenance, 
      created_at
    `)
    .eq('publication_status', 'QUARANTINED')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching quarantined records:', error);
    return [];
  }
  return data;
}

export async function getMarketObservationsLineage() {
  const isAuth = await isAuthorizedOperator();
  if (!isAuth) throw new Error("Unauthorized");

  const adminClient = await createAdminClient();
  const { data, error } = await adminClient
    .from('normalized_market_values')
    .select(`
      id,
      source_observation_id,
      sdg_per_kg,
      sdg_per_mt,
      calculation_version,
      created_at
    `)
    .limit(50)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data;
}
