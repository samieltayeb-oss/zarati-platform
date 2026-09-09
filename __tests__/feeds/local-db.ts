import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import { createHmac, createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { assertLocalTarget, guardTestEnvironment } from '../local-target';
import type { Database } from '@/types/database.types';
import type { Lease } from '@/lib/feeds/ExternalFeedAdapter';
guardTestEnvironment();
export const sql = new Client({ connectionString: assertLocalTarget(process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54342/postgres', '54342') });
export function localToken(role: string) { const b = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url'); const message = b({ alg: 'HS256', typ: 'JWT' }) + '.' + b({ iss: 'supabase-demo', role, exp: Math.floor(Date.now() / 1000) + 3600 }); return message + '.' + createHmac('sha256', 'super-secret-jwt-token-with-at-least-32-characters-long').update(message).digest('base64url'); }
export const db = createClient<Database>('http://127.0.0.1:54341', localToken('service_role'), { auth: { persistSession: false, autoRefreshToken: false } });
export const anon = createClient<Database>('http://127.0.0.1:54341', localToken('anon'), { auth: { persistSession: false, autoRefreshToken: false } });
export function fixture() { const data = gunzipSync(readFileSync('__tests__/fixtures/wfp-sdn-public.csv.gz')); if (createHash('sha256').update(data).digest('hex') !== '3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4')
    throw Error('FIXTURE_SHA256'); return data.toString('utf8'); }
export async function clearFeeds() { const baseline=await sql.query("SELECT * FROM public.feed_completeness_approvals WHERE content_sha256='3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4'"); await sql.query('TRUNCATE public.feed_completeness_approvals,public.feed_record_receipts,public.feed_batch_receipts,public.feed_leases,public.feed_source_changes,public.weather_observations,public.external_feed_executions,public.feed_artifacts CASCADE'); await sql.query('INSERT INTO public.feed_completeness_approvals SELECT (jsonb_populate_record(NULL::public.feed_completeness_approvals,$1::jsonb)).*',[JSON.stringify(baseline.rows[0])]); }
export async function ready(feed: 'WFP' | 'OPEN_METEO'): Promise<Lease> { await sql.query("UPDATE public.feed_leases SET next_allowed_at='-infinity' WHERE feed_type=$1", [feed]); const r = await db.rpc('acquire_feed', { p_feed: feed }); if (r.error)
    throw r.error; const l = r.data as Lease; if (!l.id)
    throw Error(JSON.stringify(r.data)); return l; }
export async function finish(l: Lease, error?: string) { const r = await db.rpc('finish_feed', { p_id: l.id, p_token: l.token, ...(error ? { p_error: error } : {}) }); if (r.error)
    throw r.error; return r.data; }
export async function seed() {
    await sql.query("INSERT INTO public.canonical_sources(code,name_en,name_ar,authority,publisher,source_url,license_type,attribution_text_en,attribution_text_ar,access_method,update_frequency,tier) VALUES('SRC_WFP_VAM','WFP','WFP','WFP','WFP','https://data.humdata.org','TEST_FIXTURE','WFP','WFP','CSV_PULL','monthly','TIER_B_INSTITUTIONAL') ON CONFLICT DO NOTHING");
    await sql.query("INSERT INTO public.canonical_datasets(source_id,dataset_identifier,name_en,name_ar,format) SELECT id,'DS_WFP_SUDAN_FOOD_PRICES','WFP Sudan','WFP Sudan','CSV' FROM public.canonical_sources WHERE code='SRC_WFP_VAM' ON CONFLICT DO NOTHING");
    await sql.query("INSERT INTO public.canonical_commodities(crop_id,code,variety_en,variety_ar) SELECT id,code||'_standard','Standard','Standard' FROM public.crops ON CONFLICT DO NOTHING");
}
export function dbWithFetch(fetcher: typeof fetch) { return createClient<Database>("http://127.0.0.1:54341", localToken("service_role"), { auth: { persistSession: false }, global: { fetch: fetcher } }); }

// Explicit local owner attestation models a reviewed upstream version, never runtime inference.
export async function attest(raw: string, keys: string[], fetched: number) {
 const sha=createHash('sha256').update(raw).digest('hex');
 const manifest=createHash('sha256').update([...keys].sort().join('\n')).digest('hex');
 await sql.query('INSERT INTO public.feed_completeness_approvals(content_sha256,records_fetched,manifest_sha256,evidence) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[sha,fetched,manifest,'LOCAL TEST: explicitly reviewed complete upstream version']);
}
