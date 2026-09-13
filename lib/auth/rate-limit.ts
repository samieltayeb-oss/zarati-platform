import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Determine if Upstash Redis credentials are provided
const hasRedisConfig = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// In-memory sliding window rate limiter fallback when Redis is unconfigured
const memoryStore = new Map<string, { count: number; resetAt: number }>();

function createFallbackLimiter(max: number, windowMs: number) {
  return {
    limit: async (key: string) => {
      const now = Date.now();
      const record = memoryStore.get(key);
      if (!record || now > record.resetAt) {
        memoryStore.set(key, { count: 1, resetAt: now + windowMs });
        return { success: true, limit: max, remaining: max - 1, reset: now + windowMs, pending: Promise.resolve() };
      }
      if (record.count >= max) {
        return { success: false, limit: max, remaining: 0, reset: record.resetAt, pending: Promise.resolve() };
      }
      record.count += 1;
      return { success: true, limit: max, remaining: max - record.count, reset: record.resetAt, pending: Promise.resolve() };
    }
  };
}

// Allow 5 requests per 15 minutes for sign in / sign up
export const authRateLimit = hasRedisConfig
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      analytics: true,
      prefix: '@upstash/ratelimit',
    })
  : createFallbackLimiter(5, 15 * 60 * 1000);

// Stricter rate limiter for password reset endpoints (3 requests per hour)
export const resetPasswordRateLimit = hasRedisConfig
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
      prefix: '@upstash/ratelimit:reset-pwd',
    })
  : createFallbackLimiter(3, 60 * 60 * 1000);
