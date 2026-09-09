// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { WFPAdapter, parseWFP, wfpIdentity } from '@/lib/feeds/wfp/wfp-adapter';
import { sql, db, anon, fixture, seed, clearFeeds, ready, finish } from './local-db';

const repair = readFileSync('ops/data-repairs/R4-B9-wfp-three-row-supersession.sql', 'utf8');
const raw = fixture();
const ids = ['5ac20cfc-4ced-4a27-8edf-0733c1b89e4c', 'e61a4f16-0ee5-4888-8d0d-f5ed91ea8dca', '6a21aef2-c247-4c83-b425-5a8e6682e214'];
const companions = ['98e94afb-d006-4fa1-9164-64e59635100d', '68abe4de-73c9-4890-8dd1-25da5b6b0df5', 'dee3fefe-f22b-4d45-939e-17d43cbf06f8'];
const keys = ['WFP_SDN_V2_2023-12-15_1031_65_Retail_3 KG', 'WFP_SDN_V2_2024-07-15_1029_65_Retail_3 KG', 'WFP_SDN_V2_2024-10-15_1029_65_Retail_3 KG'];
let oldTruth: unknown[], companionTruth: unknown[], conflicts: unknown[], publicTruth: unknown[];

async function replay() {
  const lease = await ready('WFP');
  await new WFPAdapter(db, lease, AbortSignal.timeout(120000)).ingest(raw, new Date().toISOString());
  return finish(lease);
}
async function denied(query: string, role = 'postgres') {
  await sql.query('BEGIN');
  try {
    await sql.query(`SET LOCAL ROLE ${role}`);
    await expect(sql.query(query)).rejects.toMatchObject({ code: expect.stringMatching(/^(P0001|42501|23505|23514)$/) });
  } finally { await sql.query('ROLLBACK'); }
}
beforeAll(async () => {
  await sql.connect(); await clearFeeds(); await seed();
  await sql.query('TRUNCATE public.market_price_observations CASCADE');
  expect((await replay()).records_inserted).toBe(5663);
  // Build the precise historical defects BEFORE insertion; never disable immutable triggers.
  const all = (await sql.query('SELECT * FROM public.market_price_observations')).rows;
  const snap = (await sql.query('SELECT * FROM public.raw_ingestion_snapshots WHERE id=$1', [all[0].raw_snapshot_id])).rows[0];
  snap.id = '230e36ca-d31e-44c9-b000-ed63943ea375'; snap.record_count = 20; snap.payload_sha256 = '8fea18b2615f4af59bd585cc31a25ffd'; snap.storage_uri = 'hdx://wfp_food_prices_sdn.csv';
  await sql.query('INSERT INTO public.raw_ingestion_snapshots SELECT (jsonb_populate_record(NULL::public.raw_ingestion_snapshots,$1::jsonb)).* ON CONFLICT(id) DO NOTHING', [JSON.stringify(snap)]);
  for (let i = 0; i < 3; i++) {
    const old = all.find(o => o.source_record_key === keys[i])!;
    const companion = all.find(o => o.source_record_key === keys[i].replace('_65_', '_249_'))!;
    old.id = ids[i]; old.source_record_raw = companion.source_record_raw; old.raw_snapshot_id = snap.id; old.ingestion_method = 'batch_import';
    companion.id = companions[i]; companion.raw_snapshot_id = snap.id; companion.ingestion_method = 'batch_import';
  }
  await sql.query('TRUNCATE public.market_price_observations CASCADE');
  await sql.query('INSERT INTO public.market_price_observations SELECT * FROM jsonb_populate_recordset(NULL::public.market_price_observations,$1::jsonb)', [JSON.stringify(all)]);
  const published = all.filter(o => !ids.includes(o.id) && !companions.includes(o.id)).slice(0, 102).map(o => o.id);
  for (const status of ['UNDER_REVIEW', 'APPROVED', 'PUBLISHED']) await sql.query('UPDATE public.market_price_observations SET publication_status=$1 WHERE id=ANY($2)', [status, published]);
  oldTruth = (await sql.query('SELECT to_jsonb(o) truth FROM public.market_price_observations o WHERE id=ANY($1) ORDER BY id', [ids])).rows;
  companionTruth = (await sql.query('SELECT to_jsonb(o) truth FROM public.market_price_observations o WHERE id=ANY($1) ORDER BY id', [companions])).rows;
  publicTruth = (await sql.query('SELECT * FROM public.v_approved_market_prices ORDER BY observation_id')).rows;
  const e = await replay(); expect(e.status).toBe('partial'); expect(e.records_existing).toBe(5660); expect(e.records_quarantined).toBe(3);
  conflicts = (await sql.query('SELECT * FROM public.feed_source_changes ORDER BY id')).rows;
  expect(conflicts).toHaveLength(3);
});
afterAll(() => sql.end());

it('requires complete exact preconditions and rolls back a wrong target', async () => {
  await expect(sql.query(repair.replace(ids[2], '00000000-0000-0000-0000-000000000001'))).rejects.toMatchObject({ code: 'P0002' });
  await sql.query('ROLLBACK');
  expect((await sql.query('SELECT count(*)::int n FROM public.observation_supersessions')).rows[0].n).toBe(0);
});
it('rejects a contradictory replacement at deferred validation and rolls back all three rows', async () => {
  const altered = repair.replace("o.source_record_key,r->>'source_record_raw',t.price", "o.source_record_key,'{}',t.price");
  expect(altered).not.toBe(repair);
  await expect(sql.query(altered)).rejects.toThrow('SUPERSESSION_LINEAGE_MISMATCH'); await sql.query('ROLLBACK');
  expect((await sql.query('SELECT count(*)::int n FROM public.observation_supersessions')).rows[0].n).toBe(0);
});
it('executes the exact three-row repair artifact with all triggers active', async () => {
  await sql.query(repair);
  const counts = (await sql.query('SELECT count(*)::int physical,count(*) FILTER(WHERE superseded_by IS NULL)::int current FROM public.market_price_observations')).rows[0];
  expect(counts).toEqual({ physical: 5666, current: 5663 });
  const audit = (await sql.query('SELECT old_truth FROM public.observation_supersessions ORDER BY old_observation_id')).rows;
  expect(audit.map(r => ({ truth: r.old_truth }))).toEqual(oldTruth);
  expect((await sql.query('SELECT to_jsonb(o) truth FROM public.market_price_observations o WHERE id=ANY($1) ORDER BY id', [companions])).rows).toEqual(companionTruth);
  expect((await sql.query('SELECT * FROM public.feed_source_changes ORDER BY id')).rows).toEqual(conflicts);
  expect((await sql.query('SELECT * FROM public.v_approved_market_prices ORDER BY observation_id')).rows).toEqual(publicTruth);
});
it('preserves source identity completeness and succeeds twice with 5663 existing, zero insert/quarantine', async () => {
  const parsed = parseWFP(raw); expect(parsed.fetched).toBe(23225); expect(parsed.records).toHaveLength(5663);
  expect(new Set(parsed.records.map(wfpIdentity)).size).toBe(5663);
  for (let i = 0; i < 2; i++) {
    const e = await replay(); expect(e.status).toBe('succeeded'); expect(e.records_existing).toBe(5663);
    expect(e.records_inserted).toBe(0); expect(e.records_quarantined).toBe(0);
  }
  expect((await sql.query('SELECT * FROM public.feed_source_changes ORDER BY id')).rows).toEqual(conflicts);
  expect((await sql.query('SELECT * FROM public.v_approved_market_prices ORDER BY observation_id')).rows).toEqual(publicTruth);
});
it('refuses repair reapplication without writes', async () => {
  await expect(sql.query(repair)).rejects.toThrow('R4B9_BASELINE_MISMATCH_OR_ALREADY_APPLIED'); await sql.query('ROLLBACK');
});
it.each(['anon', 'authenticated', 'service_role'])('%s cannot create or replace supersession authority', async role => {
  await denied('INSERT INTO public.observation_supersessions SELECT * FROM public.observation_supersessions', role);
  await denied(`UPDATE public.market_price_observations SET superseded_by='${ids[0]}' WHERE id='${companions[0]}'`, role);
});
it('protects superseded history, raw replacements and immutable resolution evidence', async () => {
  await denied(`UPDATE public.market_price_observations SET source_record_raw='{}' WHERE id='${ids[0]}'`);
  await denied(`UPDATE public.market_price_observations SET superseded_by=NULL WHERE id='${ids[0]}'`);
  await denied(`UPDATE public.market_price_observations SET publication_status='UNDER_REVIEW' WHERE id='${ids[0]}'`);
  await denied('UPDATE public.market_price_observations SET source_record_raw=\'{}\' WHERE id=(SELECT replacement_observation_id FROM public.observation_supersessions LIMIT 1)');
  await denied('DELETE FROM public.observation_supersessions');
  await denied('UPDATE public.observation_supersessions SET reason=\'replacement evidence cannot be rewritten\'');
});
it('keeps audit private and the safe public view unchanged', async () => {
  await denied('SELECT * FROM public.observation_supersessions', 'anon');
  await denied('SELECT * FROM public.observation_supersessions', 'authenticated');
  const published = await anon.from('v_approved_market_prices').select('observation_id');
  expect(published.error).toBeNull(); expect(published.data).toHaveLength(102);
});
it('has exactly one current representation for every source key, including both 65 and 249', async () => {
  const current = (await sql.query('SELECT source_record_key,source_record_raw FROM public.market_price_observations WHERE superseded_by IS NULL')).rows;
  expect(new Set(current.map(r => r.source_record_key))).toEqual(new Set(parseWFP(raw).records.map(wfpIdentity)));
  for (const key of keys) {
    expect(current.filter(r => r.source_record_key === key)).toHaveLength(1);
    expect(current.filter(r => r.source_record_key === key.replace('_65_', '_249_'))).toHaveLength(1);
    expect(JSON.parse(current.find(r => r.source_record_key === key)!.source_record_raw).row.split(',')[9]).toBe('65');
  }
  await denied('INSERT INTO public.market_price_observations SELECT (jsonb_populate_record(NULL::public.market_price_observations,to_jsonb(o)||jsonb_build_object(\'id\',gen_random_uuid()))).* FROM public.market_price_observations o WHERE id=(SELECT replacement_observation_id FROM public.observation_supersessions LIMIT 1)');
});
it('changes only the current-row predicate in feed staging, keeping quarantine and identity checks', () => {
  const original = readFileSync('supabase/migrations/20260909000027_027_r4_b_infrastructure.sql', 'utf8');
  const expected = original.slice(original.indexOf('CREATE FUNCTION public.stage_feed_batch('), original.indexOf('CREATE FUNCTION public.finish_feed('))
    .replace('CREATE FUNCTION', 'CREATE OR REPLACE FUNCTION').replace("AND source_record_key=r->>'source_record_key';", "AND source_record_key=r->>'source_record_key' AND superseded_by IS NULL;").trim();
  const migration = readFileSync('supabase/migrations/20260909000029_029_wfp_auditable_supersession.sql', 'utf8');
  expect(migration.slice(migration.indexOf('CREATE OR REPLACE FUNCTION public.stage_feed_batch(')).trim().replaceAll('\r\n', '\n')).toBe(expected.replaceAll('\r\n', '\n'));
});
