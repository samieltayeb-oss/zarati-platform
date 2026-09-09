// @vitest-environment node
import { beforeAll, afterAll, it, expect } from 'vitest';
import { parseWeather, OpenMeteoAdapter } from '@/lib/feeds/weather/open-meteo-adapter';
import { sql, db, anon, clearFeeds, ready, finish, dbWithFetch } from './local-db';
const units = { time: 'iso8601', temperature_2m: '\u00b0C', relative_humidity_2m: '%', precipitation: 'mm', wind_speed_10m: 'km/h' };
export const weatherFixture = () => ({ latitude: 14.04, longitude: 35.38, timezone: 'GMT', utc_offset_seconds: 0, current_units: { ...units, interval: 'seconds' }, hourly_units: units,
    current: { time: '2026-09-08T12:00', interval: 900, temperature_2m: 30, relative_humidity_2m: 40, precipitation: 0, wind_speed_10m: 10 },
    hourly: { time: ['2026-09-08T12:00', '2026-09-08T13:00'], temperature_2m: [30, 31], relative_humidity_2m: [40, 40], precipitation: [0, 0], wind_speed_10m: [10, 12] } });
const retrieved = '2026-09-08T12:00:00Z';
beforeAll(async () => { await sql.connect(); await clearFeeds(); });
afterAll(() => sql.end());
it('current model estimate, actual forecast, UTC and historical taxonomy', () => { const r = parseWeather(JSON.stringify(weatherFixture()), retrieved); expect(r[0].temporal_class).toBe('CURRENT_MODEL_ESTIMATE'); expect(r[1].temporal_class).toBe('FORECAST'); expect(r[0].provider_observation_time).toBe(new Date(retrieved).toISOString()); const old = weatherFixture(); old.current.time = '2001-01-01T00:00'; expect(parseWeather(JSON.stringify(old), retrieved)[0].temporal_class).toBe('HISTORICAL'); });
it.each(['latitude', 'null', 'units', 'time', 'arrays', 'json'])('rejects %s', kind => { const data: Record<string, unknown> = weatherFixture(); if (kind === 'latitude')
    data.latitude = 999; if (kind === 'null')
    data.current = { ...weatherFixture().current, temperature_2m: null }; if (kind === 'units')
    data.current_units = { ...weatherFixture().current_units, temperature_2m: '\u00b0F' }; if (kind === 'time')
    data.current = { ...weatherFixture().current, time: '2026-02-30T12:00' }; if (kind === 'arrays')
    data.hourly = { ...weatherFixture().hourly, temperature_2m: [] }; expect(() => parseWeather(kind === 'json' ? 'bad' : JSON.stringify(data), retrieved)).toThrow(); });
it('real DB replay inserts zero, changed revision retained, safe public freshness', async () => {
    for (let i = 0; i < 3; i++) {
        const payload = weatherFixture();
        if (i === 2)
            payload.current.temperature_2m = 32;
        const l = await ready('OPEN_METEO');
        await new OpenMeteoAdapter(db, l, AbortSignal.timeout(20000)).ingest(JSON.stringify(payload), retrieved);
        const e = await finish(l);
        expect(e.status).toBe('succeeded');
        expect(e.records_inserted).toBe([3, 0, 1][i]);
    }
    expect((await sql.query('SELECT count(*)::int n FROM public.weather_observations')).rows[0].n).toBe(4);
    expect((await anon.from('weather_observations').select('*')).error).not.toBeNull();
    const safe = await anon.from('v_public_weather').select('*');
    expect(safe.error).toBeNull();
    expect(safe.data?.length).toBe(3);
    expect(safe.data?.every(r => !('source_record_raw' in r))).toBe(true);
    await expect(sql.query("UPDATE public.weather_observations SET temperature_celsius=0")).rejects.toThrow('IMMUTABLE_FEED_TRUTH');
    await expect(sql.query('DELETE FROM public.weather_observations')).rejects.toThrow('IMMUTABLE_FEED_TRUTH');
});
it('old provider time stays stale after a new retrieval', async () => { const payload = weatherFixture(); payload.current.time = '2001-01-01T00:00'; const l = await ready('OPEN_METEO'); await new OpenMeteoAdapter(db, l, AbortSignal.timeout(20000)).ingest(JSON.stringify(payload), retrieved); await finish(l); const view = await anon.from('v_public_weather').select('*'); const old = view.data?.find(r => r.valid_time?.startsWith('2001-01-01')); expect(old?.is_stale).toBe(true); expect(old?.temporal_class).toBe('HISTORICAL'); });
it('lost batch acknowledgement retries without duplicate rows or counters', async () => { let lost = false; const lossy = dbWithFetch(async (input, init) => { const response = await fetch(input, init); if (String(input).includes('/rpc/stage_feed_batch') && response.ok && !lost) {
    lost = true;
    throw new Error('simulated lost acknowledgement');
} return response; }); const payload = weatherFixture(); payload.current.temperature_2m = 33; const l = await ready('OPEN_METEO'); await new OpenMeteoAdapter(lossy, l, AbortSignal.timeout(20000)).ingest(JSON.stringify(payload), retrieved); const e = await finish(l); expect(lost).toBe(true); expect(e.status).toBe('succeeded'); expect(e.records_inserted).toBe(1); expect(e.records_existing).toBe(2); });

it('a return to an earlier provider revision reuses truth but becomes the latest public value',async()=>{const payload={...weatherFixture(),generationtime_ms:9.99};const l=await ready('OPEN_METEO');await new OpenMeteoAdapter(db,l,AbortSignal.timeout(20000)).ingest(JSON.stringify(payload),retrieved);expect((await finish(l)).records_inserted).toBe(0);const view=await anon.from('v_public_weather').select('*');expect(view.data?.find(r=>r.temporal_class==='CURRENT_MODEL_ESTIMATE')?.temperature_celsius).toBe(30);});
