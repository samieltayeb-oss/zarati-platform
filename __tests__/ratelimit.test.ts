/* eslint-disable */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitRFQ } from '../lib/actions/rfq'
import { Ratelimit } from '@upstash/ratelimit'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    getAll: vi.fn(() => []),
  }),
}))

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { status: 'active', role: 'trader', id: 'mock-id' },
      }),
    })),
  })),
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { user_id: 'seller-id', status: 'active' },
      }),
    })),
  }))
}))

// Mock Upstash Limiter
let mockLimitCount = 0
vi.mock('@upstash/ratelimit', () => {
  class MockRatelimit {
    static slidingWindow() {}
    async limit() {
      mockLimitCount++
      return { success: mockLimitCount <= 5 }
    }
  }
  return { Ratelimit: MockRatelimit }
})

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(),
}))

describe('submitRFQ Rate Limiting', () => {
  beforeEach(() => {
    mockLimitCount = 0
    process.env.UPSTASH_REDIS_REST_URL = 'http://test'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test'
  })

  it('fails closed when production rate-limit configuration is absent', async () => {
    const previous=process.env.NODE_ENV;
    Object.assign(process.env,{NODE_ENV:'production'});
    delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try {await expect(submitRFQ({listing_id:'123e4567-e89b-12d3-a456-426614174000',message:'test'})).rejects.toThrow('failing closed');}
    finally {Object.assign(process.env,{NODE_ENV:previous});}
  })
  it('allows 5 requests and blocks the 6th', async () => {
    const payload = {
      listing_id: '123e4567-e89b-12d3-a456-426614174000',
      message: 'test',
      requested_quantity: 1,
    }

    // Requests 1 to 5 should not fail with rate limit
    for (let i = 0; i < 5; i++) {
      const res = await submitRFQ(payload)
      // It might fail on DB insert because we didn't mock insert, but it shouldn't hit rate limit
      expect((res as any).error).not.toBe('Rate limit exceeded. Maximum 5 RFQs per minute.')
    }

    // 6th request should fail due to rate limit
    const res6 = await submitRFQ(payload)
    expect(res6.success).toBe(false)
    if (!res6.success) {
      expect(res6.error).toBe('Rate limit exceeded. Maximum 5 RFQs per minute.')
    }
  })
})
