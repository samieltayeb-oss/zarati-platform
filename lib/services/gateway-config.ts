/**
 * Dual-Mode Data Gateway Configuration
 * Determines whether services read from local mock files or live Supabase database.
 */
export function shouldUseMockData(): boolean {
  // 1. Explicit environment variable override
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return true
  }

  // 2. Fallback to mock if Supabase credentials are not configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return true
  }

  return false
}
