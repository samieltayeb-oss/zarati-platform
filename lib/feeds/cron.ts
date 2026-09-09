import 'server-only';
import { timingSafeEqual } from 'node:crypto';
import { createAdminClient } from '@/lib/supabase/server';
import { WFPAdapter } from './wfp/wfp-adapter';
import { MetNorwayAdapter } from './weather/met-norway-adapter';
import { FeedError, LIMITS, type FeedDB, type Lease } from './ExternalFeedAdapter';
export function authorizeCron(request: Request, secret = process.env.CRON_SECRET): boolean {
    if (!secret || !secret.trim())
        return false;
    const actual = request.headers.get('authorization');
    if (!actual || !actual.startsWith('Bearer '))
        return false;
    const expected = Buffer.from('Bearer ' + secret), received = Buffer.from(actual);
    return expected.length === received.length && timingSafeEqual(expected, received);
}
export async function handleFeedCron(request: Request, feed: 'WFP' | 'OPEN_METEO' | 'MET_NORWAY', dependencies?: {
    db: (fetcher?: typeof fetch) => FeedDB;
    workMs?: number;
    cleanupMs?: number;
    run?: (lease: Lease, signal: AbortSignal) => Promise<void>;
}) {
    if (!authorizeCron(request))
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // OPEN_METEO is retained as evidence only; no production route can reactivate it.
    const enabled = feed !== 'OPEN_METEO' && process.env[feed === 'WFP' ? 'R4B_WFP_FEED_ENABLED' : 'R4B_WEATHER_FEED_ENABLED'] === 'true';
    if (!enabled)
        return Response.json({ status: 'disabled' }, { status: 503 });
    const signal = AbortSignal.timeout(Math.min(dependencies?.workMs ?? LIMITS.runMs, LIMITS.runMs));
    const client = (deadline: AbortSignal) => {
        const fetcher: typeof fetch = (input, init) => fetch(input, { ...init, signal: AbortSignal.any([deadline, AbortSignal.timeout(LIMITS.requestMs), ...(init?.signal ? [init.signal] : [])]) });
        return dependencies?.db(fetcher) ?? createAdminClient(fetcher);
    };
    let db: FeedDB;
    let lease: Lease;
    try {
        db = client(signal);
        const acquired = await db.rpc('acquire_feed', { p_feed: feed });
        if (acquired.error)
            throw new FeedError('LOCK_ERROR');
        const value = acquired.data as {
            id?: string;
            token?: string;
            denied?: string;
        };
        if (value?.denied)
            return Response.json({ status: value.denied }, { status: 409 });
        if (!value?.id || !value.token)
            throw new FeedError('LOCK_ERROR');
        lease = { id: value.id, token: value.token };
    }
    catch {
        return Response.json({ error: 'LOCK_ERROR' }, { status: 503 });
    }
    let category: string | undefined;
    let onAbort: (() => void) | undefined;
    try {
        if (signal.aborted) throw new FeedError('DEADLINE_EXCEEDED');
        const deadline = new Promise<never>((_resolve, reject) => {
            onAbort = () => reject(new FeedError('DEADLINE_EXCEEDED'));
            signal.addEventListener('abort', onAbort, { once: true });
        });
        const work = dependencies?.run ? dependencies.run(lease, signal)
            : (feed === 'WFP' ? new WFPAdapter(db, lease, signal) : new MetNorwayAdapter(db, lease, signal)).run();
        await Promise.race([work, deadline]);
    }
    catch (error) {
        category = error instanceof FeedError ? error.category : 'FEED_FAILURE';
    }
    finally {
        if (onAbort) signal.removeEventListener('abort', onAbort);
    }
    if (signal.aborted) category = 'DEADLINE_EXCEEDED';
    const cleanup = AbortSignal.timeout(Math.min(dependencies?.cleanupMs ?? LIMITS.cleanupMs, LIMITS.cleanupMs));
    const finalDb = client(cleanup);
    try {
        let finished;
        for (let attempt = 0; attempt < LIMITS.attempts; attempt++) {
        finished = await finalDb.rpc('finish_feed', { p_id: lease.id, p_token: lease.token, ...(category ? { p_error: category } : {}) });
        if (!finished.error && finished.data) break;
        if (cleanup.aborted || attempt === LIMITS.attempts - 1) break;
        // Resolve a lost successful acknowledgement before retrying the terminal RPC.
        const terminal = await finalDb.from('external_feed_executions').select('*').eq('id', lease.id).single();
        if (terminal.data && terminal.data.status !== 'running') { finished = { data: terminal.data, error: null }; break; }
        await new Promise(resolve => setTimeout(resolve, 100 * 2 ** attempt));
        }
        if (!finished || finished.error || !finished.data)
            throw new FeedError('LEDGER_WRITE');
        return Response.json({ execution_id: lease.id, status: finished.data.status }, { status: finished.data.status === 'succeeded' ? 200 : 502 });
    }
    catch {
        return Response.json({ error: 'LEDGER_WRITE', execution_id: lease.id }, { status: 503 });
    }
}
