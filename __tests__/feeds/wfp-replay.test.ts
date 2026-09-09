import { readFileSync } from 'node:fs';
import { parse as parseCSV } from 'csv-parse/sync';
// @vitest-environment node
import { beforeAll, afterAll, it, expect } from 'vitest';
import { parseWFP, wfpIdentity, WFPAdapter } from '@/lib/feeds/wfp/wfp-adapter';
import { sql, db, anon, fixture, clearFeeds, ready, finish, seed, attest, dbWithFetch } from './local-db';
const raw = fixture();
beforeAll(async () => { await sql.connect(); await clearFeeds(); await seed(); await sql.query('TRUNCATE public.market_price_observations CASCADE'); });
afterAll(() => sql.end());
it('counts source rows and exact V2 semantic identities independently', () => {
    const p = parseWFP(raw);
    expect(p.fetched).toBe(23225);
    expect(p.records).toHaveLength(5663);
    expect(new Set(p.records.map(wfpIdentity)).size).toBe(5663);
    const repair=readFileSync('ops/data-repairs/R4-A-wfp-identity-v2-repair.sql','utf8');
    const prior=new Set([...repair.matchAll(/WFP_SDN_V2_[^']+/g)].map(m=>m[0]));
    expect(new Set(p.records.map(wfpIdentity))).toEqual(prior);
    const variants = p.records.filter(r => r.cropCode === 'sorghum');
    expect(new Set(variants.map(r => r.commodity_id)).size).toBeGreaterThan(1);
});
it('failed first validation preserves raw bytes and recovers the same artifact with a fresh manifest', async()=>{
 const broken=dbWithFetch(async(input,init)=>{if(String(input).includes('/rest/v1/markets')){return new Response(JSON.stringify({message:'simulated reference lookup failure'}),{status:400});}return fetch(input,init);});
 const first=await ready('WFP');await expect(new WFPAdapter(broken,first,AbortSignal.timeout(120000)).ingest(raw,'2026-09-08T00:00:00Z')).rejects.toThrow('REFERENCE_DATA');
 const failed=await finish(first,'REFERENCE_DATA');expect(failed.status).toBe('failed');
 const archived=await db.from('feed_artifacts').select('payload').eq('id',failed.artifact_id!).single();expect(archived.data?.payload).toBe(raw);
 const next=await ready('WFP');await new WFPAdapter(db,next,AbortSignal.timeout(120000)).ingest(raw,'2026-09-08T00:01:00Z');const ok=await finish(next);expect(ok.records_inserted).toBe(5663);expect(ok.artifact_id).toBe(failed.artifact_id);
 const third=await ready('WFP');await new WFPAdapter(db,third,AbortSignal.timeout(120000)).ingest(raw,'2026-09-08T00:02:00Z');expect((await finish(third)).records_inserted).toBe(0);
 const manifests=await sql.query('SELECT status,jsonb_array_length(record_keys) n FROM public.feed_validation_manifests WHERE artifact_id=$1 ORDER BY created_at',[ok.artifact_id]);expect(manifests.rows).toEqual([{status:'REJECTED',n:0},{status:'VALIDATED',n:5663},{status:'VALIDATED',n:5663}]);
 // Preserve this audit; reset observations only so the original first-stage assertion remains independent.
 await sql.query('TRUNCATE public.market_price_observations CASCADE');
});
it('stages 5663 into DB, replays zero, preserves publication and exact artifact', async () => {
    for (let i = 0; i < 2; i++) {
        const l = await ready('WFP');
        await new WFPAdapter(db, l, AbortSignal.timeout(120000)).ingest(raw, '2026-09-08T00:00:00Z');
        const e = await finish(l);
        expect(e.status).toBe('succeeded');
        expect(e.records_inserted).toBe(i === 0 ? 5663 : 0);
        expect(e.records_existing).toBe(i === 0 ? 0 : 5663);
    }
    const count = await sql.query("SELECT count(*)::int AS n FROM public.market_price_observations WHERE publication_status='INGESTED'");
    expect(count.rows[0].n).toBe(5663);
    const mismatch = await sql.query("SELECT count(*)::int n FROM public.market_price_observations o JOIN public.feed_artifacts a ON a.snapshot_id=o.raw_snapshot_id WHERE a.content_sha256<>encode(extensions.digest(a.payload,'sha256'),'hex')");
    expect(mismatch.rows[0].n).toBe(0);
    expect((await anon.from('v_approved_market_prices').select('*')).data).toEqual([]);
});
it('incremental, price/currency correction and removal evidence preserve old truth', async () => {
 const lines = raw.trimEnd().split(/\r?\n/);
 const first = lines[1].split(','); const newRow=[...first]; newRow[0]='2000-01-15';
 let lease=await ready('WFP');
 await new WFPAdapter(db,lease,AbortSignal.timeout(120000)).ingest(raw+newRow.join(',')+'\n','2026-09-08T01:00:00Z');
 expect((await finish(lease)).records_inserted).toBe(1);
 const correction=[...first]; correction[14]=String(Number(first[14])+1); correction[13]='USD'; lines[1]=correction.join(',');
 const reviewed=lines.join('\n')+'\n'; const profile=parseWFP(reviewed); await attest(reviewed,profile.records.map(wfpIdentity),profile.fetched);
 lease=await ready('WFP');
 await new WFPAdapter(db,lease,AbortSignal.timeout(120000)).ingest(lines.join('\n')+'\n','2026-09-08T02:00:00Z');
 const result=await finish(lease);expect(result.status).toBe('partial');expect(result.records_quarantined).toBe(1);
 const changes=await sql.query('SELECT kind FROM public.feed_source_changes');expect(changes.rows.map(r=>r.kind)).toEqual(expect.arrayContaining(['CORRECTION','REMOVAL']));
 const old=await sql.query('SELECT raw_currency_text,raw_price_text FROM public.market_price_observations WHERE source_record_key=$1',[wfpIdentity(parseWFP(raw).records[0])]);
 expect(old.rows[0]).toEqual({raw_currency_text:first[13],raw_price_text:first[14]});
});
it('all corrections becomes quarantined, not succeeded',async()=>{
 const changed=(parseCSV(raw) as string[][]).map((row,i)=>{if(i)row[14]='999999';return row.map(value=>/[",\n]/.test(value)?'"'+value.replaceAll('"','""')+'"':value).join(',');}).join('\n')+'\n';
 const lease=await ready('WFP');await new WFPAdapter(db,lease,AbortSignal.timeout(120000)).ingest(changed,'2026-09-08T03:00:00Z');
 expect((await finish(lease)).status).toBe('quarantined');
});
it.each(['html', 'truncated', 'header', 'date', 'negative', 'currency', 'infinity', 'identity'])('rejects %s before staging', kind => {
    const lines = raw.trimEnd().split(/\r?\n/);
    let sample = lines[0] + '\n' + lines[1] + '\n';
    const r = lines[1].split(',');
    if (kind === 'html')
        sample = '<html>oops</html>\n';
    if (kind === 'truncated')
        sample = sample.slice(0, -4);
    if (kind === 'header')
        sample = sample.replace('date,', 'wrong,');
    if (kind === 'date')
        r[0] = '2001-02-30';
    if (kind === 'negative')
        r[14] = '-1';
    if (kind === 'currency')
        r[13] = '';
    if (kind === 'infinity')
        r[14] = 'Infinity';
    if (kind === 'identity')
        r[4] = '';
    if (['date', 'negative', 'currency', 'infinity', 'identity'].includes(kind))
        sample = lines[0] + '\n' + r.join(',') + '\n';
    expect(() => parseWFP(sample)).toThrow();
});
it('caps rows and rejects malformed quotes', () => { expect(() => parseWFP(raw, 10)).toThrow('ROW_CAP'); expect(() => parseWFP(raw.replace('2001-01-15', '"2001-01-15'))).toThrow('CSV_SCHEMA'); });
it('changed label is durably quarantined even though raw IDs are unchanged', async () => { const lines = raw.trimEnd().split(/\r?\n/); const row = lines[1].split(','); row[8] = 'Renamed sorghum'; lines[1] = row.join(','); const l = await ready('WFP'); await new WFPAdapter(db, l, AbortSignal.timeout(120000)).ingest(lines.join('\n') + '\n', '2026-09-08T04:00:00Z'); expect((await finish(l)).records_quarantined).toBe(1); const evidence = await sql.query('SELECT incoming_truth FROM public.feed_source_changes WHERE artifact_id=(SELECT artifact_id FROM public.external_feed_executions WHERE id=$1)', [l.id]); expect(evidence.rows.some(r => r.incoming_truth?.mapping_review === true)).toBe(true); });
it('complete-row truncated artifact is rejected and retained as failed evidence', async () => { const l = await ready('WFP'); const prefix = raw.split('\n').slice(0, 20).join('\n') + '\n'; await expect(new WFPAdapter(db, l, AbortSignal.timeout(20000)).ingest(prefix, '2026-09-08T05:00:00Z')).rejects.toThrow('SUSPICIOUS_SOURCE_REDUCTION'); const e = await finish(l, 'SUSPICIOUS_SOURCE_REDUCTION'); expect(e.status).toBe('failed'); const a = await db.from('feed_artifacts').select('payload').eq('id', e.artifact_id!).single(); expect(a.data?.payload).toBe(prefix); });

it('21,000 complete rows and missing 175 identities are rejected without removal inference',async()=>{
 const prefix=raw.split('\n').slice(0,21001).join('\n')+'\n';
 const mapped=new Set(parseWFP(raw).records.slice(-175).map(wfpIdentity));
 const csv=parseCSV(raw,{columns:true}) as Record<string,string>[];
 const lines=raw.trimEnd().split(/\r?\n/);const missing=[lines[0],...lines.slice(1).filter((_r,i)=>!mapped.has(wfpIdentity(csv[i])))].join('\n')+'\n';
 for(const payload of [prefix,missing]){const l=await ready('WFP');await expect(new WFPAdapter(db,l,AbortSignal.timeout(120000)).ingest(payload,'2026-09-08T06:00:00Z')).rejects.toThrow('SUSPICIOUS_SOURCE_REDUCTION');const e=await finish(l,'SUSPICIOUS_SOURCE_REDUCTION');expect(e.status).toBe('failed');expect((await sql.query("SELECT count(*)::int n FROM public.feed_source_changes WHERE artifact_id=$1 AND kind='REMOVAL'",[e.artifact_id])).rows[0].n).toBe(0);}
 const profile=parseWFP(missing);await attest(missing,profile.records.map(wfpIdentity),profile.fetched);
 const approved=await ready('WFP');await new WFPAdapter(db,approved,AbortSignal.timeout(120000)).ingest(missing,'2026-09-08T06:01:00Z');const e=await finish(approved);expect(e.status).toBe('succeeded');
 expect((await sql.query("SELECT count(*)::int n FROM public.feed_source_changes WHERE artifact_id=$1 AND kind='REMOVAL'",[e.artifact_id])).rows[0].n).toBe(175);
 expect((await sql.query("SELECT count(*)::int n FROM public.feed_validation_manifests WHERE artifact_id=$1 AND status='REJECTED'",[e.artifact_id])).rows[0].n).toBe(1);
});
it('same raw bytes cannot silently replace a validated manifest',async()=>{const l=await ready('WFP');const ds=await db.from('canonical_datasets').select('id').eq('dataset_identifier','DS_WFP_SUDAN_FOOD_PRICES').single();const keys=parseWFP(raw).records.map(wfpIdentity).slice(1);const prepared=await db.rpc('prepare_feed_artifact',{p_id:l.id,p_token:l.token,p_resource:(await import('@/lib/feeds/wfp/wfp-adapter')).WFP_URL,p_payload:raw,p_retrieved:'2026-09-08T07:00:00Z',p_fetched:23225,p_keys:keys,p_dataset:ds.data!.id});expect(prepared.error).toBeNull();const m=await db.from('feed_validation_manifests').select('*').eq('execution_id',l.id).single();expect(m.data?.error_category).toBe('MANIFEST_CONFLICT');expect((await finish(l)).status).toBe('failed');});
