import { createHmac, timingSafeEqual } from 'crypto'

const HMAC_DATA = 'za-admin-session-v1'

export function computeAdminToken(password: string): string {
  return createHmac('sha256', password).update(HMAC_DATA).digest('hex')
}

export function verifyAdminToken(token: string, password: string): boolean {
  try {
    const expected = Buffer.from(computeAdminToken(password))
    const actual = Buffer.from(token)
    if (actual.length !== expected.length) return false
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
