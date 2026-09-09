import { createHash } from 'node:crypto';
import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/types/database.types';
export type FeedDB = SupabaseClient<Database>;
export type Lease = {
    id: string;
    token: string;
};
export type FeedRow = {
    source_record_key: string;
    [key: string]: Json | undefined;
};
export class FeedError extends Error {
    constructor(public readonly category: string) { super(category); }
}
export const LIMITS = { bytes: 8 * 1024 * 1024, rows: 50000, batch: 250, attempts: 3, requestMs: 15000, runMs: 240000, cleanupMs: 30000 };
// Read a bounded stream; timeout covers body consumption as well as response headers.
export async function fetchPayload(url: string, format: 'csv' | 'json', signal: AbortSignal, options: {
    requestMs?: number;
    bytes?: number;
    backoffMs?: number;
} = {}): Promise<string> {
    for (let attempt = 0; attempt < LIMITS.attempts; attempt++) {
        try {
            const requestSignal=AbortSignal.any([signal,AbortSignal.timeout(options.requestMs??LIMITS.requestMs)]);
            let target=url;let response:Response;
            for(let hop=0;;hop++){
              response=await fetch(target,{cache:'no-store',redirect:'manual',signal:requestSignal});
              if(![301,302,303,307,308].includes(response.status))break;
              const location=response.headers.get('location');await response.body?.cancel();
              if(!location || hop>=2)throw new FeedError('REDIRECT_LIMIT');
              const next=new URL(location,target),original=new URL(url);
              const hdx=original.hostname==='data.humdata.org' && next.origin==='https://s3.us-east-1.amazonaws.com' && next.pathname==='/hdx-production-filestore/resources/8fea18b2-615f-4af5-9bd5-85cc31a25ffd/wfp_food_prices_sdn.csv';
              if(next.origin!==original.origin && !hdx)throw new FeedError('REDIRECT_ORIGIN');
              target=next.href;
            }
            if (!response.ok)
                throw new FeedError(response.status === 429 || response.status >= 500 ? 'UPSTREAM_RETRYABLE' : 'UPSTREAM_HTTP');
            const type = response.headers.get('content-type')?.split(';')[0].trim();
            if (type && !(format === 'json' ? ['application/json'] : ['text/csv', 'application/csv', 'text/plain', 'application/octet-stream']).includes(type))
                throw new FeedError('CONTENT_TYPE');
            const cap = options.bytes ?? LIMITS.bytes;
            const length = response.headers.get('content-length');
            if (length && Number(length) > cap)
                throw new FeedError('PAYLOAD_CAP');
            const reader = response.body?.getReader();
            if (!reader)
                throw new FeedError('EMPTY_PAYLOAD');
            const chunks: Uint8Array[] = [];
            let bytes = 0;
            try {
                for (;;) {
                    const part = await reader.read();
                    if (part.done)
                        break;
                    bytes += part.value.byteLength;
                    if (bytes > cap)
                        throw new FeedError('PAYLOAD_CAP');
                    chunks.push(part.value);
                }
            }
            finally {
                await reader.cancel();
            }
            // Content-Length can describe compressed transfer bytes. Compare only identity encoding.
            if (length && !response.headers.get('content-encoding') && bytes !== Number(length))
                throw new FeedError('TRUNCATED_PAYLOAD');
            const body=Buffer.concat(chunks);
            const expected=response.headers.get('x-checksum-sha256');
            const digest=response.headers.get('content-digest') ?? response.headers.get('digest');
            const provided=digest?.match(/sha-256=:(.+?):/i)?.[1] ?? digest?.match(/sha-256=([^, ]+)/i)?.[1];
            if(expected && createHash('sha256').update(body).digest('hex')!==expected.toLowerCase())throw new FeedError('CHECKSUM_MISMATCH');
            if(provided && createHash('sha256').update(body).digest('base64')!==provided)throw new FeedError('CHECKSUM_MISMATCH');
            let raw: string;
            try {
                raw = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(Buffer.concat(chunks));
            }
            catch {
                throw new FeedError('INVALID_UTF8');
            }
            if (!raw.trim() || raw.trimStart().startsWith('<'))
                throw new FeedError('INVALID_PAYLOAD');
            return raw;
        }
        catch (error) {
            if (signal.aborted)
                throw new FeedError('DEADLINE');
            if (error instanceof FeedError && error.category !== 'UPSTREAM_RETRYABLE')
                throw error;
            if (attempt === LIMITS.attempts - 1)
                throw new FeedError(error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name) ? 'TIMEOUT' : 'UPSTREAM_FAILURE');
            await new Promise<void>((resolve, reject) => {
                const abort = () => { clearTimeout(timer); reject(new FeedError('DEADLINE')); };
                const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, (options.backoffMs ?? 250) * 2 ** attempt);
                signal.addEventListener('abort', abort, { once: true });
            });
        }
    }
    throw new FeedError('UPSTREAM_FAILURE');
}
export abstract class ExternalFeedAdapter {
    constructor(protected db: FeedDB, protected lease: Lease, protected signal: AbortSignal) { }
    abstract run(): Promise<void>;
    protected async rejectedArtifact(raw: string, resource: string, retrieved: string, dataset?: string) {
        if (Buffer.byteLength(raw) > LIMITS.bytes)
            return;
        const current = await this.db.from('external_feed_executions').select('artifact_id').eq('id', this.lease.id).single();
        if (current.error)
            throw new FeedError('ARTIFACT_VERIFY');
        if (current.data.artifact_id)
            return;
        const result = await this.db.rpc('prepare_feed_artifact', { p_id: this.lease.id, p_token: this.lease.token, p_payload: raw, p_resource: resource, p_retrieved: retrieved, p_fetched: 0, p_keys: [], ...(dataset ? { p_dataset: dataset } : {}) });
        if (result.error)
            throw new FeedError('ARTIFACT_WRITE');
    }
    protected async stage(raw: string, resource: string, retrieved: string, fetched: number, rows: FeedRow[], dataset?: string) {
        if (this.signal.aborted)
            throw new FeedError('DEADLINE');
        const prepared = await this.db.rpc('prepare_feed_artifact', { p_id: this.lease.id, p_token: this.lease.token, p_payload: raw, p_resource: resource, p_retrieved: retrieved, p_fetched: fetched, p_keys: rows.map(r => r.source_record_key), ...(dataset ? { p_dataset: dataset } : {}) });
        if (prepared.error)
            throw new FeedError('ARTIFACT_WRITE');
        const manifest = await this.db.from('feed_validation_manifests').select('status,error_category').eq('execution_id', this.lease.id).single();
        if (manifest.error || !manifest.data) throw new FeedError('MANIFEST_READ');
        if (manifest.data.status !== 'VALIDATED') throw new FeedError(manifest.data.error_category ?? 'MANIFEST_NOT_VALIDATED');
        for (let offset = 0; offset < rows.length; offset += LIMITS.batch) {
            if (this.signal.aborted)
                throw new FeedError('DEADLINE');
            for (let attempt = 0; attempt < LIMITS.attempts; attempt++) {
                const result = await this.db.rpc('stage_feed_batch', { p_id: this.lease.id, p_token: this.lease.token, p_rows: rows.slice(offset, offset + LIMITS.batch), p_batch: offset / LIMITS.batch });
                if (!result.error)
                    break;
                if (attempt === LIMITS.attempts - 1)
                    throw new FeedError('STAGE_WRITE');
                await new Promise(resolve => setTimeout(resolve, 250 * 2 ** attempt));
            }
        }
    }
}
