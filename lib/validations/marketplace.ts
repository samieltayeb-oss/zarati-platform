import { z } from 'zod'

export const listingSchema = z.object({
  category: z.enum(['crops', 'equipment', 'seeds', 'fertilizer']),
  crop_id: z.string().uuid().optional().nullable(),
  state_id: z.string().uuid().optional().nullable(),
  title_en: z.string().min(3).max(100),
  title_ar: z.string().min(3).max(100),
  description_en: z.string().max(1000).optional().nullable(),
  description_ar: z.string().max(1000).optional().nullable(),
  quantity: z.coerce.number().positive(),
  unit: z.string().min(1).max(20),
  price: z.coerce.number().positive().optional().nullable(),
  currency: z.string().default('SDG'),
  location_name_en: z.string().max(100).optional().nullable(),
  location_name_ar: z.string().max(100).optional().nullable(),
  available_from: z.string().optional().nullable(),
  available_until: z.string().optional().nullable(),
  farm_id: z.string().uuid().optional().nullable(),
})

export type ListingInput = z.infer<typeof listingSchema>

export const rfqSchema = z.object({
  listing_id: z.string().uuid(),
  // seller_id intentionally NOT accepted from client — resolved server-side from listing record
  message: z.string().max(1000).optional().nullable(),
  requested_quantity: z.coerce.number().positive().optional().nullable(),
  offered_price: z.coerce.number().positive().optional().nullable(),
})

export type RFQInput = z.infer<typeof rfqSchema>

export const updateListingStatusSchema = z.object({
  listingId: z.string().uuid(),
  status: z.enum(['pending_review', 'active', 'paused', 'sold', 'archived']),
})

export const updateRFQStatusSchema = z.object({
  inquiryId: z.string().uuid(),
  status: z.enum(['withdrawn', 'accepted', 'rejected', 'closed']),
})
