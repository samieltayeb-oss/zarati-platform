'use server'

import { createServerClient } from '@/lib/supabase/server'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
const MAX_IMAGES_PER_LISTING = 5

function getImageRatelimiter() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: Upstash Redis is not configured in production. Rate limiting failing closed.');
    }
    return null
  }
  const redis = new Redis({ url, token })
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '1 h') })
}

export async function uploadListingMediaServerAction(formData: FormData): Promise<
  { success: true; path: string; publicUrl: string } | { success: false; error: string }
> {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()
  if (!profile || profile.status !== 'active') return { success: false, error: 'Account suspended' }

  // Rate limit
  const rl = getImageRatelimiter()
  if (rl) {
    const { success: allowed } = await rl.limit(`upload-image:${user.id}`)
    if (!allowed) return { success: false, error: 'Upload rate limit exceeded (20/hour)' }
  }

  const listingId = formData.get('listing_id') as string | null
  const file = formData.get('file') as File | null

  if (!file) return { success: false, error: 'No file provided' }
  if (!listingId) return { success: false, error: 'Listing ID required' }

  // Verify listing ownership
  const { data: listing } = await supabase
    .from('listings')
    .select('user_id, status')
    .eq('id', listingId)
    .single()

  if (!listing) return { success: false, error: 'Listing not found' }
  if (listing.user_id !== user.id) return { success: false, error: 'Unauthorized' }
  if (!['draft', 'pending_review', 'active', 'paused'].includes(listing.status)) {
    return { success: false, error: 'Cannot add media to this listing in its current state' }
  }

  // Check image count
  const { count } = await supabase
    .from('listing_media')
    .select('id', { count: 'exact', head: true })
    .eq('listing_id', listingId)

  if ((count ?? 0) >= MAX_IMAGES_PER_LISTING) {
    return { success: false, error: `Maximum ${MAX_IMAGES_PER_LISTING} images per listing` }
  }

  // Size check
  if (file.size > MAX_SIZE_BYTES) return { success: false, error: 'File exceeds 5MB limit' }

  // Read bytes
  const arrayBuffer = await file.arrayBuffer()
  const inputBuffer = Buffer.from(arrayBuffer)

  // Detect and validate actual image content via sharp (rejects non-images / SVGs)
  let sanitizedBuffer: Buffer
  try {
    const img = sharp(inputBuffer)
    const metadata = await img.metadata()

    if (!metadata.format || !ALLOWED_MIME_TYPES.has(`image/${metadata.format}`)) {
      return { success: false, error: 'Unsupported image format. Use JPEG, PNG, or WebP.' }
    }

    // Re-encode to JPEG — this strips all EXIF/GPS metadata
    sanitizedBuffer = await img
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer()
  } catch {
    return { success: false, error: 'Invalid or corrupted image file' }
  }

  // Upload sanitized image — randomized path prevents enumeration
  const storagePath = `${user.id}/${listingId}/${uuidv4()}.jpeg`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('listing-media')
    .upload(storagePath, sanitizedBuffer, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return { success: false, error: 'Upload failed' }
  }

  // Record in listing_media table
  const { error: dbError } = await supabase
    .from('listing_media')
    .insert({
      listing_id: listingId,
      storage_path: uploadData.path,
      media_type: 'image/jpeg',
    })

  if (dbError) {
    // Clean up orphaned storage object
    await supabase.storage.from('listing-media').remove([uploadData.path])
    return { success: false, error: 'Failed to record media' }
  }

  const { data: publicUrlData } = supabase.storage
    .from('listing-media')
    .getPublicUrl(uploadData.path)

  return { success: true, path: uploadData.path, publicUrl: publicUrlData.publicUrl }
}
