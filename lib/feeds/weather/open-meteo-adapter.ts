import 'server-only';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { ExternalFeedAdapter, FeedError, fetchPayload, type FeedRow } from '../ExternalFeedAdapter';
// WFP/HDX Sudan artifact SHA256 3c00925b7c04192e7170dc5bce13cfaca898b0c1499e9f939540fec19f6cbee4:
// source market 2580 (El Gedarif), mapped to MKT-GD-01 in migration 016.
export const WEATHER_LOCATION = { latitude: 14.04, longitude: 35.38, reference: 'MKT-GD-01 / WFP market 2580' };
const fields = 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m';
export const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=14.04&longitude=35.38&current=' + fields + '&hourly=' + fields + '&forecast_days=2&timezone=UTC&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm&models=best_match';
const values = { temperature_2m: z.number().finite().min(-100).max(70), relative_humidity_2m: z.number().finite().min(0).max(100), precipitation: z.number().finite().min(0).max(3000), wind_speed_10m: z.number().finite().min(0).max(500) };
const units = z.object({ time: z.literal('iso8601'), temperature_2m: z.literal('\u00b0C'), relative_humidity_2m: z.literal('%'), precipitation: z.literal('mm'), wind_speed_10m: z.literal('km/h') });
const schema = z.object({ latitude: z.number().finite().min(-90).max(90), longitude: z.number().finite().min(-180).max(180), utc_offset_seconds: z.literal(0), timezone: z.enum(['GMT', 'UTC']),
    current_units: units.extend({ interval: z.literal('seconds') }), hourly_units: units,
    current: z.object({ time: z.string(), interval: z.number().int().min(1).max(86400), ...values }),
    hourly: z.object({ time: z.array(z.string()).min(1).max(72), temperature_2m: z.array(values.temperature_2m), relative_humidity_2m: z.array(values.relative_humidity_2m), precipitation: z.array(values.precipitation), wind_speed_10m: z.array(values.wind_speed_10m) }) });
function utc(time: string) {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?Z?$/.test(time))
        throw new FeedError('WEATHER_TIME');
    const normalized = time.replace(/Z$/, '');
    const d = new Date(normalized + 'Z');
    if (!Number.isFinite(d.getTime()) || !d.toISOString().startsWith(normalized))
        throw new FeedError('WEATHER_TIME');
    return d;
}
export function parseWeather(raw: string, retrieved: string): FeedRow[] {
    let input: unknown;
    try {
        input = JSON.parse(raw);
    }
    catch {
        throw new FeedError('WEATHER_JSON');
    }
    const result = schema.safeParse(input);
    if (!result.success)
        throw new FeedError('WEATHER_SCHEMA');
    const d = result.data;
    if (Math.abs(d.latitude - WEATHER_LOCATION.latitude) > 0.5 || Math.abs(d.longitude - WEATHER_LOCATION.longitude) > 0.5)
        throw new FeedError('WEATHER_GRID');
    const now = Date.parse(retrieved);
    if (!Number.isFinite(now))
        throw new FeedError('WEATHER_TIME');
    for (const array of [d.hourly.temperature_2m, d.hourly.relative_humidity_2m, d.hourly.precipitation, d.hourly.wind_speed_10m])
        if (array.length !== d.hourly.time.length)
            throw new FeedError('WEATHER_ARRAYS');
    const make = (time: string, v: z.infer<typeof schema>['current'], channel: 'CURRENT' | 'HOURLY'): FeedRow => {
        const date = utc(time), valid = date.getTime();
        if (valid > now + 48 * 3600000 || (channel === 'CURRENT' && valid > now + 15 * 60000))
            throw new FeedError('WEATHER_HORIZON');
        const temporal = channel === 'CURRENT' ? (valid < now - 3600000 ? 'HISTORICAL' : 'CURRENT_MODEL_ESTIMATE') : (valid < now ? 'HISTORICAL' : 'FORECAST');
        const key = ['OPEN_METEO', WEATHER_LOCATION.reference, d.latitude, d.longitude, date.toISOString(), channel].join('_');
        const truth = { valid_time: date.toISOString(), temperature_celsius: v.temperature_2m, precipitation_mm: v.precipitation, relative_humidity_percent: v.relative_humidity_2m, wind_speed_kmh: v.wind_speed_10m, interval_seconds: v.interval, model_provenance: 'Open-Meteo best_match weather model blend', channel };
        return { provider: 'OPEN_METEO', source_record_key: key, revision_hash: createHash('sha256').update(JSON.stringify(truth)).digest('hex'),
            provider_observation_time: date.toISOString(), retrieved_at: retrieved, latitude: d.latitude, longitude: d.longitude, requested_latitude: WEATHER_LOCATION.latitude, requested_longitude: WEATHER_LOCATION.longitude, geographic_reference: WEATHER_LOCATION.reference,
            model_provenance: truth.model_provenance, timezone: 'UTC', interval_seconds: v.interval, forecast_horizon_seconds: Math.max(0, Math.floor((valid - now) / 1000)),
            temperature_celsius: v.temperature_2m, precipitation_mm: v.precipitation, relative_humidity_percent: v.relative_humidity_2m, wind_speed_kmh: v.wind_speed_10m, temporal_class: temporal,
            stale_after_at: new Date(valid + (channel === 'CURRENT' ? 3600000 : 0)).toISOString(), source_record_raw: truth };
    };
    const rows = [make(d.current.time, d.current, 'CURRENT')];
    let previous = -Infinity;
    d.hourly.time.forEach((time, i) => { const t = utc(time).getTime(); if (t <= previous || (i > 0 && t - previous !== 3600000))
        throw new FeedError('WEATHER_ORDER'); previous = t; rows.push(make(time, { time, interval: 3600, temperature_2m: d.hourly.temperature_2m[i], relative_humidity_2m: d.hourly.relative_humidity_2m[i], precipitation: d.hourly.precipitation[i], wind_speed_10m: d.hourly.wind_speed_10m[i] }, 'HOURLY')); });
    return rows;
}
export class OpenMeteoAdapter extends ExternalFeedAdapter {
    async run() { const raw = await fetchPayload(WEATHER_URL, 'json', this.signal); await this.ingest(raw, new Date().toISOString()); }
    async ingest(raw: string, retrieved: string) { try {
        const rows = parseWeather(raw, retrieved);
        await this.stage(raw, WEATHER_URL, retrieved, rows.length, rows);
    }
    catch (error) {
        await this.rejectedArtifact(raw, WEATHER_URL, retrieved);
        throw error;
    } }
}
