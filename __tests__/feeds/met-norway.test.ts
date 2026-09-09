// @vitest-environment node
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { beforeAll, afterAll, it, expect, vi } from 'vitest';
import { parseMetNorway } from '@/lib/feeds/weather/met-norway-parser';
import { fetchMetNorway, MetNorwayAdapter, metCacheStore, type MetCache, type MetCacheStore } from '@/lib/feeds/weather/met-norway-adapter';
import { MET_URL, MET_USER_AGENT, MET_ATTRIBUTION } from '@/lib/feeds/weather/met-norway-contract';
import { OpenMeteoAdapter } from '@/lib/feeds/weather/open-meteo-adapter';
import { handleFeedCron } from '@/lib/feeds/cron';
import { GET } from '@/app/api/cron/weather/route';
import { sql, db, anon, clearFeeds, ready, finish } from './local-db';

const raw = readFileSync('__tests__/fixtures/met-norway-gedaref.json', 'utf8');
const evidence = JSON.parse(readFileSync('__tests__/fixtures/met-norway-gedaref.metadata.json', 'utf8'));
const fixture = () => JSON.parse(raw);
const retrieved = evidence.retrieved_at as string;
const now = Date.parse('2026-09-09T16:10:00Z');
const headers = { 'Content-Type': 'application/json', 'Expires': 'Wed, 09 Sep 2026 16:40:01 GMT', 'Last-Modified': 'Wed, 09 Sep 2026 16:08:15 GMT' };
const response = () => new Response(raw, { headers });
function memory() {
    let value: MetCache | null = null;
    const store: MetCacheStore = { async read() { return value; }, async write(v) { value = v; } };
    return { store, value: () => value };
}
const options = { now: () => now, jitterMs: 0, backoffMs: 0 };
beforeAll(async () => { await sql.connect(); });
afterAll(async () => { vi.unstubAllEnvs(); await sql.end(); });

it('parses exact identified real Sudan response and all requested measurements', () => {
    expect(createHash('sha256').update(raw).digest('hex')).toBe(evidence.sha256);
    const rows = parseMetNorway(raw, retrieved), data = fixture();
    expect(rows.length).toBeGreaterThan(24);
    for (const row of rows) {
        const point = data.properties.timeseries.find((p: { time: string }) => Date.parse(p.time) === Date.parse(String(row.provider_observation_time)));
        const values = point.data.instant.details;
        expect(row.temperature_celsius).toBe(values.air_temperature);
        expect(row.relative_humidity_percent).toBe(values.relative_humidity);
        expect(row.wind_speed_kmh).toBeCloseTo(values.wind_speed * 3.6, 6);
        expect(row.precipitation_mm).toBe((point.data.next_1_hours ?? point.data.next_6_hours).details.precipitation_amount);
        expect(row.temporal_class).toBe('FORECAST'); expect(row.timezone).toBe('UTC');
        expect(row.latitude).toBe(14.04); expect(row.longitude).toBe(35.38);
        expect(row.requested_latitude).toBe(14.04); expect(row.requested_longitude).toBe(35.38);
        expect(row.retrieved_at).toBe(retrieved); expect(row.stale_after_at).toBe(row.provider_observation_time);
        expect(row.source_record_raw).toMatchObject({ ...MET_ATTRIBUTION, wind_speed_ms: values.wind_speed,
            precipitation_period_start: row.provider_observation_time,
            precipitation_period_end: new Date(Date.parse(String(row.provider_observation_time)) + Number(row.interval_seconds) * 1000).toISOString() });
    }
});
it('retains six-hour totals without turning them into hourly values', () => {
    const d = fixture(); delete d.properties.timeseries[0].data.next_1_hours;
    const row = parseMetNorway(JSON.stringify(d), retrieved)[0];
    expect(row.interval_seconds).toBe(21600); expect(row.precipitation_mm).toBe(4.8);
});
it('issuance-relative selection and identities stay stable as retrieval time advances', () => {
    const first = parseMetNorway(raw, retrieved), later = parseMetNorway(raw, '2026-09-10T16:10:00Z');
    expect(later.map(r => [r.source_record_key, r.revision_hash])).toEqual(first.map(r => [r.source_record_key, r.revision_hash]));
    expect(later.every(r => r.temporal_class === 'FORECAST')).toBe(true);
    expect(later[0].forecast_horizon_seconds).toBe(0);
});
it('a new provider issuance is an immutable revision and terminal missing totals are not fabricated', () => {
    const d = fixture(), first = parseMetNorway(raw, retrieved);
    d.properties.meta.updated_at = '2026-09-09T13:29:06Z';
    const revised = parseMetNorway(JSON.stringify(d), retrieved);
    expect(revised.map(r => r.source_record_key)).toEqual(first.map(r => r.source_record_key));
    expect(revised[0].revision_hash).not.toBe(first[0].revision_hash);
    const last = fixture(); last.properties.timeseries = last.properties.timeseries.slice(0, 2);
    delete last.properties.timeseries[1].data.next_1_hours; delete last.properties.timeseries[1].data.next_6_hours;
    expect(parseMetNorway(JSON.stringify(last), retrieved)).toHaveLength(1);
});
it.each(['json', 'unit', 'null', 'location', 'utc', 'calendar', 'order', 'precipitation', 'future_issue'])('rejects malformed %s', kind => {
    const d = fixture();
    if (kind === 'unit') d.properties.meta.units.wind_speed = 'km/h';
    if (kind === 'null') d.properties.timeseries[0].data.instant.details.air_temperature = null;
    if (kind === 'location') d.geometry.coordinates = [14.04, 35.38, 608];
    if (kind === 'utc') d.properties.timeseries[0].time = '2026-09-09T16:00:00+02:00';
    if (kind === 'calendar') d.properties.timeseries[0].time = '2026-02-30T16:00:00Z';
    if (kind === 'order') d.properties.timeseries.reverse();
    if (kind === 'precipitation') { delete d.properties.timeseries[0].data.next_1_hours; delete d.properties.timeseries[0].data.next_6_hours; }
    if (kind === 'future_issue') d.properties.meta.updated_at = '2030-01-01T00:00:00Z';
    expect(() => parseMetNorway(kind === 'json' ? '<html>' : JSON.stringify(d), retrieved)).toThrow();
});
it('identifies every request, honors Expires across instances, and revalidates with exact Last-Modified', async () => {
    const m = memory(), fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(response());
    const a = await fetchMetNorway(m.store, AbortSignal.timeout(10000), { ...options, fetcher });
    expect(a.transport).toBe('FETCHED'); expect(fetcher.mock.calls[0][0]).toBe(MET_URL);
    expect(fetcher.mock.calls[0][1]?.headers).toMatchObject({ 'User-Agent': MET_USER_AGENT, 'Accept-Encoding': 'gzip, deflate' });
    expect(MET_USER_AGENT).toContain('https://github.com/samieltayeb-oss/zarati-platform');
    expect((await fetchMetNorway(m.store, AbortSignal.timeout(10000), { ...options, fetcher })).transport).toBe('CACHE'); expect(fetcher).toHaveBeenCalledTimes(1);
    fetcher.mockResolvedValueOnce(new Response(null, { status: 304, headers: { Expires: 'Wed, 09 Sep 2026 18:00:00 GMT' } }));
    const b = await fetchMetNorway(m.store, AbortSignal.timeout(10000), { ...options, now: () => now + 3600000, fetcher });
    expect(b).toEqual({ ...a, transport: 'NOT_MODIFIED' });
    expect(fetcher.mock.calls[1][1]?.headers).toMatchObject({ 'If-Modified-Since': headers['Last-Modified'] });
    expect(m.value()?.checked_at).not.toBe(m.value()?.fetched_at);
});
it('bounds retry count for transient HTTP failures and handles timeout', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(null, { status: 503 })).mockResolvedValueOnce(response());
    await fetchMetNorway(memory().store, AbortSignal.timeout(10000), { ...options, fetcher }); expect(fetcher).toHaveBeenCalledTimes(2);
    const timeout = vi.fn<typeof fetch>().mockImplementation((_input, init) => new Promise((_resolve, reject) => { init!.signal!.addEventListener('abort', () => reject(init!.signal!.reason), { once: true }); }));
    await expect(fetchMetNorway(memory().store, AbortSignal.timeout(10000), { ...options, fetcher: timeout, requestMs: 5 })).rejects.toThrow('TIMEOUT'); expect(timeout).toHaveBeenCalledTimes(3);
});
it.each([403, 404])('does not retry HTTP %i', async status => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status }));
    await expect(fetchMetNorway(memory().store, AbortSignal.timeout(10000), { ...options, fetcher })).rejects.toThrow('MET_HTTP'); expect(fetcher).toHaveBeenCalledTimes(1);
});
it('persists throttling and makes no request before Retry-After', async () => {
    const m = memory(), fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 429, headers: { 'Retry-After': '7200' } }));
    await expect(fetchMetNorway(m.store, AbortSignal.timeout(10000), { ...options, fetcher })).rejects.toThrow('MET_RETRY_AFTER');
    await expect(fetchMetNorway(m.store, AbortSignal.timeout(10000), { ...options, fetcher })).rejects.toThrow('MET_RETRY_AFTER');
    expect(fetcher).toHaveBeenCalledTimes(1); expect(Date.parse(m.value()!.next_request_at)).toBe(now + 7200000);
});
it('rejects malformed responses, untrusted redirects, 304 without cache, and missing cache headers', async () => {
    for (const [res, error] of [[new Response('{}', { headers }), 'MET_SCHEMA'], [new Response(null, { status: 302, headers: { location: 'https://example.com' } }), 'REDIRECT_ORIGIN'], [new Response(null, { status: 304, headers }), 'MET_304_WITHOUT_CACHE'], [new Response(raw, { headers: { 'content-type': 'application/json' } }), 'MET_CACHE_HEADERS']] as const) {
        const m = memory(); await expect(fetchMetNorway(m.store, AbortSignal.timeout(10000), { ...options, fetcher: vi.fn<typeof fetch>().mockResolvedValue(res) })).rejects.toThrow(error); expect(m.value()).toBeNull();
    }
});
it('same-origin redirect retains identification; deprecated endpoints fail visibly', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(new Response(null, { status: 307, headers: { location: '/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38' } })).mockResolvedValueOnce(response());
    await fetchMetNorway(memory().store, AbortSignal.timeout(10000), { ...options, fetcher }); expect(fetcher.mock.calls[1][1]?.headers).toMatchObject({ 'User-Agent': MET_USER_AGENT });
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(fetchMetNorway(memory().store, AbortSignal.timeout(10000), { ...options, fetcher: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 203 })) })).rejects.toThrow('MET_DEPRECATED'); expect(warning).toHaveBeenCalled(); warning.mockRestore();
});
it('real DB preserves 49 Open-Meteo rows while MET replay and revision stay immutable and public-safe', async () => {
    await clearFeeds(); await sql.query('TRUNCATE public.met_norway_http_cache');
    const oldRaw = readFileSync('__tests__/fixtures/open-meteo-canary.json', 'utf8');
    const oldLease = await ready('OPEN_METEO'); await new OpenMeteoAdapter(db, oldLease, AbortSignal.timeout(20000)).ingest(oldRaw, '2026-09-09T14:50:20.963Z'); expect((await finish(oldLease)).records_inserted).toBe(49);
    const before = (await sql.query("SELECT * FROM public.weather_observations WHERE provider='OPEN_METEO' ORDER BY id")).rows;
    const count = parseMetNorway(raw, retrieved).length;
    for (let i = 0; i < 3; i++) {
        const d = fixture(); if (i === 2) d.properties.timeseries[0].data.instant.details.air_temperature += 1;
        const lease = await ready('MET_NORWAY'); await new MetNorwayAdapter(db, lease, AbortSignal.timeout(20000)).ingest(JSON.stringify(d), retrieved);
        const e = await finish(lease); expect(e.status).toBe('succeeded'); expect(e.records_inserted).toBe([count, 0, 1][i]); expect(e.records_existing).toBe([0, count, count - 1][i]);
    }
    expect((await sql.query("SELECT * FROM public.weather_observations WHERE provider='OPEN_METEO' ORDER BY id")).rows).toEqual(before);
    expect((await sql.query("SELECT count(*)::int n FROM public.weather_observations WHERE provider='MET_NORWAY'")).rows[0].n).toBe(count + 1);
    const publicRows = await anon.from('v_public_weather').select('*'); expect(publicRows.error).toBeNull(); expect(publicRows.data).toHaveLength(49 + count);
    const met = publicRows.data!.filter(r => r.provider === 'MET_NORWAY');
    expect(met.every(r => r.attribution === 'Data from MET Norway' && r.license_url === MET_ATTRIBUTION.license_url && r.source_url === MET_URL && r.processing_note?.includes('m/s to km/h'))).toBe(true);
    for (const r of met) {
        expect(r.temporal_class).toBe('FORECAST'); expect(r.is_stale).toBe(Date.now() > Date.parse(r.valid_time!));
        for (const key of ['source_record_raw', 'artifact_id', 'error_category', 'owner_token', 'payload', 'validation_metadata']) expect(r).not.toHaveProperty(key);
        expect(Date.parse(r.precipitation_period_end!) - Date.parse(r.precipitation_period_start!)).toBe(r.interval_seconds! * 1000);
    }
    expect((await anon.from('weather_observations').select('*')).error).not.toBeNull();
    expect((await anon.from('met_norway_http_cache').select('*')).error).not.toBeNull();
    await expect(sql.query("UPDATE public.weather_observations SET temperature_celsius=0 WHERE provider='MET_NORWAY'")).rejects.toThrow('IMMUTABLE');
    await expect(sql.query("DELETE FROM public.weather_observations WHERE provider='OPEN_METEO'")).rejects.toThrow('IMMUTABLE');
    expect((await sql.query('SELECT count(*)::int n FROM public.feed_leases WHERE owner_token IS NOT NULL')).rows[0].n).toBe(0);
    // Database enforcement, including a caller trying to attach MET truth to an Open-Meteo artifact.
    await expect(sql.query("INSERT INTO public.weather_observations SELECT (jsonb_populate_record(NULL::public.weather_observations,to_jsonb(w)||jsonb_build_object('id',gen_random_uuid(),'artifact_id',$1::uuid))).* FROM public.weather_observations w WHERE provider='MET_NORWAY' LIMIT 1", [before[0].artifact_id])).rejects.toThrow('WEATHER_PROVIDER_ARTIFACT_MISMATCH');
    const store = metCacheStore(db); await store.write({ resource: MET_URL, payload: raw, fetched_at: retrieved, checked_at: retrieved, last_modified: headers['Last-Modified'], expires_at: '2026-09-09T16:40:01Z', next_request_at: retrieved });
    expect((await metCacheStore(db).read())?.payload).toBe(raw);
});
it('weather cron defaults OFF; old Open-Meteo cannot be revived by the weather flag', async () => {
    vi.stubEnv('CRON_SECRET', 'local-test-secret'); vi.stubEnv('R4B_WEATHER_FEED_ENABLED', undefined);
    const request = new Request('http://localhost/api/cron/weather', { headers: { authorization: 'Bearer local-test-secret' } });
    expect((await GET(request)).status).toBe(503);
    vi.stubEnv('R4B_WEATHER_FEED_ENABLED', 'true'); const factory = vi.fn(() => db);
    expect((await handleFeedCron(request, 'OPEN_METEO', { db: factory })).status).toBe(503); expect(factory).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
});
it('authenticated MET cron uses the existing ledger and cleans up after parser failure', async () => {
    vi.stubEnv('CRON_SECRET', 'local-test-secret'); vi.stubEnv('R4B_WEATHER_FEED_ENABLED', 'true');
    await sql.query("UPDATE public.feed_leases SET next_allowed_at='-infinity' WHERE feed_type='MET_NORWAY'");
    const before = (await sql.query("SELECT * FROM public.external_feed_executions WHERE feed_type='OPEN_METEO' ORDER BY id")).rows;
    const request = new Request('http://localhost/api/cron/weather', { headers: { authorization: 'Bearer local-test-secret' } });
    const res = await handleFeedCron(request, 'MET_NORWAY', { db: () => db, run: async (lease, signal) => { await new MetNorwayAdapter(db, lease, signal).ingest('{bad', retrieved); } });
    expect(res.status).toBe(502); const result = await res.json();
    const row = (await sql.query('SELECT * FROM public.external_feed_executions WHERE id=$1', [result.execution_id])).rows[0];
    expect(row.feed_type).toBe('MET_NORWAY'); expect(row.status).toBe('failed'); expect(row.error_category).toBe('MET_JSON'); expect(row.completed_at).not.toBeNull();
    expect((await sql.query('SELECT count(*)::int n FROM public.feed_leases WHERE owner_token IS NOT NULL')).rows[0].n).toBe(0);
    expect((await sql.query("SELECT * FROM public.external_feed_executions WHERE feed_type='OPEN_METEO' ORDER BY id")).rows).toEqual(before);
    vi.unstubAllEnvs();
});
it('never sends a future conditional header and honors cancellation before the provider request', async () => {
    const m = memory(); await m.store.write({ resource: MET_URL, payload: raw, fetched_at: retrieved, checked_at: retrieved,
        last_modified: 'Wed, 09 Sep 2026 16:10:02 GMT', expires_at: '2026-09-09T16:09:00Z', next_request_at: retrieved });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response());
    await fetchMetNorway(m.store, AbortSignal.timeout(10000), { ...options, fetcher });
    expect(fetcher.mock.calls[0][1]?.headers).not.toHaveProperty('If-Modified-Since');
    const cancelled = new AbortController(); cancelled.abort(); const untouched = vi.fn<typeof fetch>();
    await expect(fetchMetNorway(memory().store, cancelled.signal, { ...options, fetcher: untouched })).rejects.toThrow(); expect(untouched).not.toHaveBeenCalled();
});
