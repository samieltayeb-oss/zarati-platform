import 'server-only';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { FeedError, type FeedRow } from '../ExternalFeedAdapter';
import { MET_LOCATION, MET_ATTRIBUTION } from './met-norway-contract';

const period = z.object({ details: z.object({ precipitation_amount: z.number().finite().min(0).max(3000) }), summary: z.object({ symbol_code: z.string().min(1).max(100) }).optional() });
const schema = z.object({
    type: z.literal('Feature'),
    geometry: z.object({ type: z.literal('Point'), coordinates: z.tuple([z.number().finite().min(-180).max(180), z.number().finite().min(-90).max(90), z.number().finite()]) }),
    properties: z.object({
        meta: z.object({ updated_at: z.string(), units: z.object({ air_temperature: z.literal('celsius'), relative_humidity: z.literal('%'), precipitation_amount: z.literal('mm'), wind_speed: z.literal('m/s') }) }),
        timeseries: z.array(z.object({ time: z.string(), data: z.object({
            instant: z.object({ details: z.object({ air_temperature: z.number().finite().min(-100).max(70), relative_humidity: z.number().finite().min(0).max(100), wind_speed: z.number().finite().min(0).max(138) }) }),
            next_1_hours: period.optional(), next_6_hours: period.optional(),
        }) })).min(2).max(300),
    }),
});
function utc(value: string): number {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) throw new FeedError('MET_TIME');
    const time = Date.parse(value);
    if (!Number.isFinite(time) || new Date(time).toISOString() !== value.replace('Z', '.000Z')) throw new FeedError('MET_TIME');
    return time;
}
export function parseMetNorway(raw: string, retrieved: string): FeedRow[] {
    let input: unknown;
    try { input = JSON.parse(raw); } catch { throw new FeedError('MET_JSON'); }
    const result = schema.safeParse(input);
    if (!result.success) throw new FeedError('MET_SCHEMA');
    const d = result.data, meta = d.properties.meta, issued = utc(meta.updated_at), fetched = Date.parse(retrieved);
    if (!Number.isFinite(fetched) || issued > fetched + 15 * 60000) throw new FeedError('MET_TIME');
    const [longitude, latitude, elevation] = d.geometry.coordinates;
    // Locationforecast's point is the requested location, not an Open-Meteo grid point.
    if (Math.abs(latitude - MET_LOCATION.latitude) > 0.0001 || Math.abs(longitude - MET_LOCATION.longitude) > 0.0001) throw new FeedError('MET_LOCATION');
    const rows: FeedRow[] = [];
    let previous = -Infinity;
    for (const entry of d.properties.timeseries) {
        const valid = utc(entry.time);
        if (valid <= previous) throw new FeedError('MET_ORDER');
        previous = valid;
        // An issuance-relative window is stable on cached/revalidated replay, unlike a retrieval-relative filter.
        if (valid < issued - 3600000 || valid > issued + 48 * 3600000) continue;
        const interval = entry.data.next_1_hours ? 3600 : entry.data.next_6_hours ? 21600 : null;
        // The documented last point has no aggregate. Never fabricate precipitation as zero.
        if (!interval) {
            if (entry !== d.properties.timeseries.at(-1)) throw new FeedError('MET_PRECIPITATION_MISSING');
            continue;
        }
        const aggregate = (interval === 3600 ? entry.data.next_1_hours : entry.data.next_6_hours)!;
        const v = entry.data.instant.details;
        const validTime = new Date(valid).toISOString(), end = new Date(valid + interval * 1000).toISOString();
        // This product is forecast/model output, including expired forecast slots. No station/current claim.
        const key = ['MET_NORWAY', MET_LOCATION.reference, latitude, longitude, validTime, 'FORECAST', interval].join('_');
        const truth = { valid_time: validTime, updated_at: meta.updated_at, temperature_celsius: v.air_temperature,
            relative_humidity_percent: v.relative_humidity, precipitation_mm: aggregate.details.precipitation_amount,
            wind_speed_ms: v.wind_speed, wind_speed_kmh: Number((v.wind_speed * 3.6).toFixed(6)),
            precipitation_period_start: validTime, precipitation_period_end: end, interval_seconds: interval,
            symbol_code: aggregate.summary?.symbol_code ?? null, elevation_m: elevation,
            model_provenance: 'MET Norway Locationforecast 2.0; global ECMWF model forecast; terrain-adjusted point',
            provider_units: meta.units, temporal_class: 'FORECAST', ...MET_ATTRIBUTION };
        rows.push({ provider: 'MET_NORWAY', source_record_key: key, revision_hash: createHash('sha256').update(JSON.stringify(truth)).digest('hex'),
            provider_observation_time: validTime, retrieved_at: retrieved, latitude, longitude,
            requested_latitude: MET_LOCATION.latitude, requested_longitude: MET_LOCATION.longitude, geographic_reference: MET_LOCATION.reference,
            model_provenance: truth.model_provenance, timezone: 'UTC', interval_seconds: interval,
            forecast_horizon_seconds: Math.max(0, Math.floor((valid - fetched) / 1000)),
            temperature_celsius: truth.temperature_celsius, relative_humidity_percent: truth.relative_humidity_percent,
            precipitation_mm: truth.precipitation_mm, wind_speed_kmh: truth.wind_speed_kmh,
            temporal_class: 'FORECAST', stale_after_at: validTime, source_record_raw: truth });
    }
    if (!rows.length) throw new FeedError('MET_EMPTY');
    return rows;
}
