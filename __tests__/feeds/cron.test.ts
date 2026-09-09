// @vitest-environment node
import { beforeAll, afterAll, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { authorizeCron, handleFeedCron } from '@/lib/feeds/cron';
import { fetchPayload, FeedError } from '@/lib/feeds/ExternalFeedAdapter';
import { assertLocalTarget } from '../local-target';
import { sql, db, clearFeeds, ready, finish, dbWithFetch } from './local-db';
const req = (auth?: string) => new Request('http://localhost/api/cron/wfp', { headers: auth ? { authorization: auth } : {} });
beforeAll(() => sql.connect());
afterAll(() => sql.end());
beforeEach(async () => { await clearFeeds(); vi.stubEnv('CRON_SECRET', 'local-test-secret'); vi.stubEnv('R4B_WFP_FEED_ENABLED', 'true'); vi.stubEnv('R4B_WEATHER_FEED_ENABLED', 'true'); });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
it('auth matrix denies absent/empty config, forged missing secret and malformed headers', () => { for (const secret of ['', undefined]) {
    if (secret === undefined)
        delete process.env.CRON_SECRET;
    expect(authorizeCron(req('Bearer undefined'), secret)).toBe(false);
} for (const value of [undefined, 'local-test-secret', 'Bearer wrong', 'Basic local-test-secret'])
    expect(authorizeCron(req(value), 'local-test-secret')).toBe(false); expect(authorizeCron(req('Bearer local-test-secret'), 'local-test-secret')).toBe(true); });
it('default-off blocks DB access even with correct auth', async () => { delete process.env.R4B_WFP_FEED_ENABLED; const factory = vi.fn(() => db); expect((await handleFeedCron(req('Bearer local-test-secret'), 'WFP', { db: factory })).status).toBe(503); expect(factory).not.toHaveBeenCalled(); });
it.each(['WFP', 'OPEN_METEO'] as const)('two %s calls have exactly one winner; other feed independently acquires', async (feed) => { const results = await Promise.all([db.rpc('acquire_feed', { p_feed: feed }), db.rpc('acquire_feed', { p_feed: feed })]); expect(results.filter(r => r.data && typeof r.data === 'object' && 'id' in r.data)).toHaveLength(1); const other = await db.rpc('acquire_feed', { p_feed: feed === 'WFP' ? 'OPEN_METEO' : 'WFP' }); expect(other.error).toBeNull(); expect(other.data).toHaveProperty('id'); });
it('expired lease takeover fences old token, and cooldown blocks repeated calls', async () => { const l = await ready('WFP'); await sql.query("UPDATE public.feed_leases SET acquired_at=now()-interval '11 minutes',expires_at=now()-interval '1 minute',next_allowed_at='-infinity'"); const newer = await ready('WFP'); expect(newer.token).not.toBe(l.token); expect((await db.rpc('finish_feed', { p_id: l.id, p_token: l.token })).error).not.toBeNull(); await finish(newer, 'TEST_FAILURE'); const denied = await db.rpc('acquire_feed', { p_feed: 'WFP' }); expect(denied.data).toEqual({ denied: 'COOLDOWN' }); });
it('DB lock errors fail closed', async () => { await sql.query("CREATE FUNCTION public.test_lock_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test'; END $$; CREATE TRIGGER test_lock_failure BEFORE INSERT ON public.feed_leases FOR EACH ROW EXECUTE FUNCTION public.test_lock_failure()"); try {
    const run = vi.fn();
    const r = await handleFeedCron(req('Bearer local-test-secret'), 'WFP', { db: () => db, run });
    expect(r.status).toBe(503);
    expect(run).not.toHaveBeenCalled();
}
finally {
    await sql.query('DROP TRIGGER test_lock_failure ON public.feed_leases; DROP FUNCTION public.test_lock_failure()');
} });
it('terminal-write failure returns 503 and leaves recoverable lease', async () => { await sql.query("CREATE FUNCTION public.test_terminal_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.status<>'running' THEN RAISE EXCEPTION 'test'; END IF; RETURN NEW; END $$; CREATE TRIGGER test_terminal_failure BEFORE UPDATE ON public.external_feed_executions FOR EACH ROW EXECUTE FUNCTION public.test_terminal_failure()"); try {
    const r = await handleFeedCron(req('Bearer local-test-secret'), 'WFP', { db: () => db, run: async () => { throw new FeedError('TEST_FAILURE'); } });
    expect(r.status).toBe(503);
    expect((await sql.query('SELECT status FROM public.external_feed_executions')).rows[0].status).toBe('running');
}
finally {
    await sql.query('DROP TRIGGER test_terminal_failure ON public.external_feed_executions; DROP FUNCTION public.test_terminal_failure()');
} });
it('WFP failure does not poison weather and incomplete zero-row execution cannot succeed', async () => { const a = await ready('WFP'), b = await ready('OPEN_METEO'); expect((await finish(a, 'UPSTREAM_FAILURE')).status).toBe('failed'); expect((await finish(b)).status).toBe('failed'); });
it('test guard rejects every nonlocal target', () => { for (const value of ['https://example.supabase.co', 'http://127.0.0.1:54321', 'http://127.0.0.1.evil:54341'])
    expect(() => assertLocalTarget(value, '54341')).toThrow(); });
it('bounded HTTP retries then fail, with no database writes', async () => { const mock = vi.fn(async () => new Response('error', { status: 500 })); vi.stubGlobal('fetch', mock); await expect(fetchPayload('https://test.invalid', 'csv', AbortSignal.timeout(1000), { backoffMs: 1 })).rejects.toThrow('UPSTREAM_FAILURE'); expect(mock).toHaveBeenCalledTimes(3); });
it('request timeout retries finitely', async () => { const mock = vi.fn((_url: string, init: RequestInit) => new Promise<Response>((_resolve, reject) => { init.signal?.addEventListener('abort', () => reject(new DOMException('timeout', 'TimeoutError')), { once: true }); })); vi.stubGlobal('fetch', mock); await expect(fetchPayload('https://test.invalid', 'json', AbortSignal.timeout(1000), { requestMs: 5, backoffMs: 1 })).rejects.toThrow('TIMEOUT'); expect(mock).toHaveBeenCalledTimes(3); });
it.each(['cap', 'html', 'length'])('fetch rejects %s', async (kind) => { vi.stubGlobal('fetch', vi.fn(async () => new Response(kind === 'html' ? '<html>bad</html>' : '123456', { headers: kind === 'html' ? { 'content-type': 'text/html' } : kind === 'length' ? { 'content-length': '100' } : {} }))); await expect(fetchPayload('https://test.invalid', 'csv', AbortSignal.timeout(1000), { bytes: kind === 'cap' ? 2 : 1000 })).rejects.toThrow(); });
it('constraints reject invalid counters and terminal state changes', async () => { const l = await ready('WFP'); await expect(sql.query('UPDATE public.external_feed_executions SET records_inserted=-1 WHERE id=$1', [l.id])).rejects.toThrow(); await expect(sql.query("UPDATE public.external_feed_executions SET status='succeeded' WHERE id=$1", [l.id])).rejects.toThrow(); await finish(l, 'TEST_DONE'); });

it('checksum mismatch fails before any stage',async()=>{vi.stubGlobal('fetch',vi.fn(async()=>new Response('body',{headers:{'x-checksum-sha256':'0'.repeat(64)}})));await expect(fetchPayload('https://test.invalid','csv',AbortSignal.timeout(1000))).rejects.toThrow('CHECKSUM_MISMATCH');});
it('unauthorized handlers return 401 before database acquisition',async()=>{const factory=vi.fn(()=>db);for(const auth of [undefined,'Bearer undefined','Basic local-test-secret','Bearer wrong']){expect((await handleFeedCron(req(auth),'WFP',{db:factory})).status).toBe(401);}expect(factory).not.toHaveBeenCalled();});

it('follows only the verified HDX filestore redirect and rejects arbitrary origins',async()=>{const url='https://data.humdata.org/resource';let count=0;vi.stubGlobal('fetch',vi.fn(async()=>++count===1?new Response(null,{status:302,headers:{location:'https://s3.us-east-1.amazonaws.com/hdx-production-filestore/resources/8fea18b2-615f-4af5-9bd5-85cc31a25ffd/wfp_food_prices_sdn.csv?signature=test'}}):new Response('csv',{headers:{'content-type':'text/csv'}})));expect(await fetchPayload(url,'csv',AbortSignal.timeout(1000))).toBe('csv');expect(count).toBe(2);vi.stubGlobal('fetch',vi.fn(async()=>new Response(null,{status:302,headers:{location:'http://127.0.0.1/private'}})));await expect(fetchPayload(url,'csv',AbortSignal.timeout(1000))).rejects.toThrow('REDIRECT_ORIGIN');});

it('preserves a UTF-8 BOM in the archived payload byte identity',async()=>{const raw='\ufeffheader\n';vi.stubGlobal('fetch',vi.fn(async()=>new Response(raw,{headers:{'content-type':'text/csv'}})));expect(await fetchPayload('https://test.invalid','csv',AbortSignal.timeout(1000))).toBe(raw);});

it('work deadline finalizes FAILED with independent cleanup and releases the lease',async()=>{
 const r=await handleFeedCron(req('Bearer local-test-secret'),'WFP',{db:f=>dbWithFetch(f!),workMs:100,run:async(_lease,signal)=>{await new Promise(resolve=>signal.addEventListener('abort',resolve,{once:true}));throw new FeedError('DEADLINE');}});
 expect(r.status).toBe(502);const e=(await sql.query('SELECT * FROM public.external_feed_executions')).rows[0];expect(e.status).toBe('failed');expect(e.error_category).toBe('DEADLINE_EXCEEDED');expect(e.completed_at).not.toBeNull();expect((await sql.query('SELECT owner_token FROM public.feed_leases')).rows[0].owner_token).toBeNull();
});
it('temporary cleanup failure retries finitely then finalizes',async()=>{let attempts=0;const r=await handleFeedCron(req('Bearer local-test-secret'),'WFP',{db:f=>dbWithFetch(async(input,init)=>{if(String(input).includes('/rpc/finish_feed')&&++attempts===1)return new Response('{}',{status:503});return f!(input,init);}),run:async()=>{throw new FeedError('TEST_TIMEOUT');}});expect(r.status).toBe(502);expect(attempts).toBe(2);expect((await sql.query('SELECT status FROM public.external_feed_executions')).rows[0].status).toBe('failed');});

it('cleanup has a bounded independent deadline and expired recovery remains possible',async()=>{
 const network=fetch;let terminalCalls=0;
 vi.stubGlobal('fetch',async(input: RequestInfo | URL,init?:RequestInit)=>{if(String(input).includes('/rpc/finish_feed')){terminalCalls++;return new Promise<Response>((_resolve,reject)=>{const fail=()=>reject(new DOMException('timeout','AbortError'));if(init?.signal?.aborted)fail();else init?.signal?.addEventListener('abort',fail,{once:true});});}return network(input,init);});
 const r=await handleFeedCron(req('Bearer local-test-secret'),'WFP',{db:f=>dbWithFetch(f!),cleanupMs:100,run:async()=>{throw new FeedError('TEST_FAILURE');}});
 expect(r.status).toBe(503);expect(terminalCalls).toBeGreaterThan(0);expect(terminalCalls).toBeLessThanOrEqual(3);expect((await sql.query('SELECT status FROM public.external_feed_executions')).rows[0].status).toBe('running');
 vi.unstubAllGlobals();await sql.query("UPDATE public.feed_leases SET acquired_at=now()-interval '11 minutes',expires_at=now()-interval '1 minute',next_allowed_at='-infinity'");const recovered=await ready('WFP');await finish(recovered,'TEST_RECOVERED');expect((await sql.query("SELECT count(*)::int n FROM public.external_feed_executions WHERE status='running'")).rows[0].n).toBe(0);
});
