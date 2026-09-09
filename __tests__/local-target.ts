export function assertLocalTarget(value: string, port: string): string {
    const url = new URL(value);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || url.port !== port || (port === '54341' && url.protocol !== 'http:') || (port === '54342' && !['postgres:', 'postgresql:'].includes(url.protocol)))
        throw new Error('TEST_TARGET_MUST_BE_LOCAL_ZARATI');
    return value;
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
}
