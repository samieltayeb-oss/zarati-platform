// @vitest-environment node
import { it, expect, vi, afterEach } from 'vitest';
import sharp from 'sharp';
const capture = vi.hoisted(() => ({ bytes: Buffer.alloc(0) as Buffer, mime: '', path: '', record: '' }));
vi.mock('@/lib/supabase/server', () => ({ createServerClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'owner' } } }) }, from: (table: string) => { const q = { select: () => q, eq: () => q, single: async () => ({ data: table === 'profiles' ? { status: 'active' } : { user_id: 'owner', status: 'active' } }), then: (resolve: (v: unknown) => unknown) => Promise.resolve({ count: 0 }).then(resolve), insert: async (row: {
                media_type: string;
            }) => { capture.record = row.media_type; return { error: null }; } }; return q; }, storage: { from: () => ({ upload: async (path: string, bytes: Buffer, options: {
                    contentType: string;
                }) => { capture.bytes = bytes; capture.mime = options.contentType; capture.path = path; return { data: { path }, error: null }; }, getPublicUrl: () => ({ data: { publicUrl: 'http://localhost/image.jpeg' } }) }) } }) }));
import { uploadListingMediaServerAction } from '@/lib/actions/upload';
afterEach(() => vi.unstubAllEnvs());
it('actual PNG bytes become JPEG bytes, extension, storage MIME and database MIME', async () => { vi.stubEnv('NODE_ENV', 'test'); vi.stubEnv('UPSTASH_REDIS_REST_URL', ''); vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', ''); const png = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'red' } }).png().toBuffer(); const form = new FormData(); form.set('listing_id', 'listing'); form.set('file', new File([new Uint8Array(png)], 'image.png', { type: 'image/png' })); expect((await uploadListingMediaServerAction(form)).success).toBe(true); expect((await sharp(capture.bytes).metadata()).format).toBe('jpeg'); expect(capture.path).toMatch(/\.jpeg$/); expect(capture.mime).toBe('image/jpeg'); expect(capture.record).toBe('image/jpeg'); });
