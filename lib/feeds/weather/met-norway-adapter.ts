import 'server-only';
import { ExternalFeedAdapter, FeedError, LIMITS, type FeedDB } from '../ExternalFeedAdapter';
import { MET_URL, MET_USER_AGENT } from './met-norway-contract';
import { parseMetNorway } from './met-norway-parser';

export interface MetCache {
    resource: string; payload: string | null; fetched_at: string | null; checked_at: string;
    last_modified: string | null; expires_at: string; next_request_at: string;
}
export interface MetCacheStore { read(): Promise<MetCache | null>; write(value: MetCache): Promise<void> }
export function metCacheStore(db: FeedDB): MetCacheStore {
    return {
        async read() { const { data, error } = await db.from('met_norway_http_cache').select('*').eq('resource', MET_URL).maybeSingle(); if (error) throw new FeedError('MET_CACHE_READ'); return data; },
        async write(value) { const { error } = await db.from('met_norway_http_cache').upsert(value, { onConflict: 'resource' }); if (error) throw new FeedError('MET_CACHE_WRITE'); },
    };
}
async function pause(ms: number, signal: AbortSignal) {
    signal.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
        const aborted = () => { clearTimeout(timer); reject(new FeedError('DEADLINE')); };
        const timer = setTimeout(() => { signal.removeEventListener('abort', aborted); resolve(); }, ms);
        signal.addEventListener('abort', aborted, { once: true });
    });
}
async function body(response: Response): Promise<string> {
    if (!['application/json', 'application/geo+json'].includes(response.headers.get('content-type')?.split(';')[0].trim() ?? '')) { await response.body?.cancel(); throw new FeedError('MET_CONTENT_TYPE'); }
    const reader = response.body?.getReader(); if (!reader) throw new FeedError('MET_EMPTY');
    const chunks: Uint8Array[] = []; let bytes = 0;
    try { for (;;) { const p = await reader.read(); if (p.done) break; bytes += p.value.byteLength; if (bytes > LIMITS.bytes) throw new FeedError('PAYLOAD_CAP'); chunks.push(p.value); } }
    finally { await reader.cancel(); }
    try { return new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)); } catch { throw new FeedError('INVALID_UTF8'); }
}
function dateHeader(response: Response, name: string, fallback?: string | null): string {
    const value = response.headers.get(name) ?? fallback;
    if (!value || !Number.isFinite(Date.parse(value))) throw new FeedError('MET_CACHE_HEADERS');
    return value;
}
export async function fetchMetNorway(store: MetCacheStore, signal: AbortSignal, options: {
    fetcher?: typeof fetch; now?: () => number; jitterMs?: number; requestMs?: number; backoffMs?: number;
} = {}): Promise<{ raw: string; retrieved: string; transport: 'CACHE' | 'NOT_MODIFIED' | 'FETCHED' }> {
    const now = options.now ?? Date.now, fetcher = options.fetcher ?? fetch;
    const cached = await store.read();
    signal.throwIfAborted();
    if (cached && Date.parse(cached.next_request_at) > now()) throw new FeedError('MET_RETRY_AFTER');
    if (cached?.payload && cached.fetched_at && Date.parse(cached.expires_at) > now()) return { raw: cached.payload, retrieved: cached.fetched_at, transport: 'CACHE' };
    // Spread server cron traffic. This is inside the existing bounded execution deadline.
    await pause(options.jitterMs ?? 5000 + Math.floor(Math.random() * 60000), signal);
    const defer = async (until: number) => {
        const stamp = new Date(now()).toISOString();
        await store.write({ resource: MET_URL, payload: cached?.payload ?? null, fetched_at: cached?.fetched_at ?? null,
            last_modified: cached?.last_modified ?? null, checked_at: stamp, expires_at: cached?.expires_at ?? stamp, next_request_at: new Date(until).toISOString() });
    };
    for (let attempt = 0; attempt < LIMITS.attempts; attempt++) {
        try {
            const headers: Record<string, string> = { 'User-Agent': MET_USER_AGENT, 'Accept': 'application/json', 'Accept-Encoding': 'gzip, deflate' };
            if (cached?.last_modified && cached.payload && Date.parse(cached.last_modified) <= now()) headers['If-Modified-Since'] = cached.last_modified;
            const deadline = AbortSignal.any([signal, AbortSignal.timeout(options.requestMs ?? LIMITS.requestMs)]);
            let target = MET_URL, response: Response;
            for (let hop = 0;; hop++) {
                response = await fetcher(target, { headers, signal: deadline, cache: 'no-store', redirect: 'manual' });
                if (![301, 302, 303, 307, 308].includes(response.status)) break;
                const location = response.headers.get('location'); await response.body?.cancel();
                if (!location || hop >= 2) throw new FeedError('REDIRECT_LIMIT');
                const next = new URL(location, target);
                if (next.origin !== 'https://api.met.no') throw new FeedError('REDIRECT_ORIGIN');
                target = next.href;
            }
            if (response.status === 203) { await response.body?.cancel(); console.warn('MET Norway Locationforecast endpoint deprecated (HTTP 203)'); throw new FeedError('MET_DEPRECATED'); }
            if (response.status === 429 || (response.status >= 500 && response.headers.has('retry-after'))) {
                const retry = response.headers.get('retry-after'); await response.body?.cancel();
                const value = retry && /^\d+$/.test(retry) ? now() + Number(retry) * 1000 : Date.parse(retry ?? '');
                await defer(Math.max(now() + 60000, Number.isFinite(value) ? value : now() + 3600000));
                throw new FeedError('MET_RETRY_AFTER');
            }
            if (response.status >= 500) { await response.body?.cancel(); throw new FeedError('MET_RETRYABLE'); }
            if (response.status !== 200 && response.status !== 304) { await response.body?.cancel(); throw new FeedError('MET_HTTP'); }
            const stamp = new Date(now()).toISOString();
            const expires = dateHeader(response, 'expires');
            const modified = dateHeader(response, 'last-modified', response.status === 304 ? cached?.last_modified : undefined);
            // Small origin/client clock skew is possible; never send a future conditional timestamp.
            if (Date.parse(modified) > now() + 15 * 60000) throw new FeedError('MET_CACHE_HEADERS');
            if (response.status === 304) {
                await response.body?.cancel();
                if (!cached?.payload || !cached.fetched_at) throw new FeedError('MET_304_WITHOUT_CACHE');
                await store.write({ ...cached, checked_at: stamp, last_modified: modified, expires_at: new Date(Date.parse(expires)).toISOString(), next_request_at: stamp });
                return { raw: cached.payload, retrieved: cached.fetched_at, transport: 'NOT_MODIFIED' };
            }
            const raw = await body(response);
            parseMetNorway(raw, stamp); // Never cache malformed provider content as accepted data.
            await store.write({ resource: MET_URL, payload: raw, fetched_at: stamp, checked_at: stamp, last_modified: modified,
                expires_at: new Date(Date.parse(expires)).toISOString(), next_request_at: stamp });
            return { raw, retrieved: stamp, transport: 'FETCHED' };
        } catch (error) {
            if (signal.aborted) throw new FeedError('DEADLINE');
            if (error instanceof FeedError && error.category !== 'MET_RETRYABLE') throw error;
            if (attempt === LIMITS.attempts - 1) {
                await defer(now() + 60000);
                throw new FeedError(error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name) ? 'TIMEOUT' : 'UPSTREAM_FAILURE');
            }
            await pause((options.backoffMs ?? 1000) * 2 ** attempt, signal);
        }
    }
    throw new FeedError('UPSTREAM_FAILURE');
}
export class MetNorwayAdapter extends ExternalFeedAdapter {
    async run() {
        const result = await fetchMetNorway(metCacheStore(this.db), this.signal);
        await this.ingest(result.raw, result.retrieved);
    }
    async ingest(raw: string, retrieved: string) {
        try { const rows = parseMetNorway(raw, retrieved); await this.stage(raw, MET_URL, retrieved, rows.length, rows); }
        catch (error) { await this.rejectedArtifact(raw, MET_URL, retrieved); throw error; }
    }
}
