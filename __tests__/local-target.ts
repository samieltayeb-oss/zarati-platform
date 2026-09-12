import { createHmac } from 'node:crypto';

export function assertLocalTarget(value: string, port: string): string {
    const url = new URL(value);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || url.port !== port || (port === '54341' && url.protocol !== 'http:') || (port === '54342' && !['postgres:', 'postgresql:'].includes(url.protocol)))
        throw new Error('TEST_TARGET_MUST_BE_LOCAL_ZARATI');
    return value;
}

export function generateLocalToken(role: string) {
    const b = (v: unknown) => Buffer.from(JSON.stringify(v)).toString('base64url');
    const message = b({ alg: 'HS256', typ: 'JWT' }) + '.' + b({ iss: 'supabase-demo', role, exp: Math.floor(Date.now() / 1000) + 3600 });
    return message + '.' + createHmac('sha256', 'super-secret-jwt-token-with-at-least-32-characters-long').update(message).digest('base64url');
}

export function guardTestEnvironment() {
    for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL'])
        if (process.env[key])
            assertLocalTarget(process.env[key]!, '54341');
    for (const key of ['DATABASE_URL', 'TEST_DATABASE_URL'])
        if (process.env[key])
            assertLocalTarget(process.env[key]!, '54342');
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://127.0.0.1:54341';
    process.env.SUPABASE_URL = 'http://127.0.0.1:54341';
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        process.env.SUPABASE_SERVICE_ROLE_KEY = generateLocalToken('service_role');
    }
}
