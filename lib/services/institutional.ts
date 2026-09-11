import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { getProfileById } from './profile-service';

export async function isInstitutionalUser(): Promise<boolean> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const profile = await getProfileById(user.id);
  if (!profile) return false;
  
  // R6/R7 users are typically government, ngo, admin, or investor
  return ['admin', 'government', 'ngo', 'investor'].includes(profile.role);
}

export interface PublicFeedHealth {
  feedType: string;
  isHealthy: boolean;
  lastExecution: string | null;
}

export async function getPublicFeedHealth(): Promise<PublicFeedHealth[]> {
  const adminClient = await createAdminClient();
  const feeds: ('WFP' | 'OPEN_METEO')[] = ['WFP', 'OPEN_METEO'];
  const health: PublicFeedHealth[] = [];

  for (const feed of feeds) {
    const { data } = await adminClient
      .from('external_feed_executions')
      .select('status, started_at')
      .eq('feed_type', feed)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      health.push({
        feedType: feed,
        isHealthy: data.status === 'succeeded',
        lastExecution: data.started_at
      });
    } else {
      health.push({
        feedType: feed,
        isHealthy: false,
        lastExecution: null
      });
    }
  }

  return health;
}
