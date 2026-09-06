import { describe, it, expect } from 'vitest'
import { listingSchema, rfqSchema, updateListingStatusSchema, updateRFQStatusSchema } from '../lib/validations/marketplace'

describe('Marketplace Validations', () => {
  it('rejects listing with negative quantity', () => {
    const result = listingSchema.safeParse({
      category: 'crops',
      title_en: 'Test',
      title_ar: 'Test',
      quantity: -5,
      unit: 'kg',
      price: 100,
      currency: 'SDG',
    })
    expect(result.success).toBe(false)
  })

  it('accepts listing with null price (Contact for price)', () => {
    const result = listingSchema.safeParse({
      category: 'crops',
      title_en: 'Test',
      title_ar: 'Test',
      quantity: 50,
      unit: 'ton',
      price: null,
      currency: 'SDG',
    })
    expect(result.success).toBe(true)
  })

  it('rejects listing with 0 price (must be positive or null)', () => {
    const result = listingSchema.safeParse({
      category: 'crops',
      title_en: 'Test',
      title_ar: 'Test',
      quantity: 50,
      unit: 'ton',
      price: 0,
      currency: 'SDG',
    })
    expect(result.success).toBe(false)
  })

  it('rejects RFQ with missing listing_id', () => {
    const result = rfqSchema.safeParse({
      message: 'Hello',
    })
    expect(result.success).toBe(false)
  })

  it('accepts valid RFQ', () => {
    const result = rfqSchema.safeParse({
      listing_id: '123e4567-e89b-12d3-a456-426614174000',
      message: 'Interested',
      requested_quantity: 10,
    })
    expect(result.success).toBe(true)
  })

  it('validates state transitions correctly', () => {
    expect(updateListingStatusSchema.safeParse({ listingId: '123e4567-e89b-12d3-a456-426614174000', status: 'paused' }).success).toBe(true)
    expect(updateListingStatusSchema.safeParse({ listingId: '123e4567-e89b-12d3-a456-426614174000', status: 'invalid' }).success).toBe(false)
    
    expect(updateRFQStatusSchema.safeParse({ inquiryId: '123e4567-e89b-12d3-a456-426614174000', status: 'accepted' }).success).toBe(true)
    expect(updateRFQStatusSchema.safeParse({ inquiryId: '123e4567-e89b-12d3-a456-426614174000', status: 'invalid' }).success).toBe(false)
  })
})
