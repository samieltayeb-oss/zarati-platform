import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Use a mock fallback if environment variables are missing during local development
const hasRedisConfig = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

if (!hasRedisConfig) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL: Upstash Redis is not configured in production. Rate limiting would fail open.');
  } else {
    console.warn('WARN: Using mock Redis for rate limiting in local development.');
  }
}

const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : ({
      sadd: async () => 1,
      eval: async () => [0, 1],
      pipeline: () => ({
        sadd: () => {},
        eval: () => {},
        exec: async () => [[null, 1], [null, [0, 1]]],
      }),
    } as unknown as Redis);

// Allow 5 requests per 15 minutes for sign in / sign up
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

// Stricter rate limiter for password reset endpoints
export const resetPasswordRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  analytics: true,
  prefix: '@upstash/ratelimit:reset-pwd',
});
