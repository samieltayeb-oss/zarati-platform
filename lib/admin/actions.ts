'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { timingSafeEqual } from 'crypto'
import { computeAdminToken } from '@/lib/admin/auth'

import { headers } from 'next/headers'
import { authRateLimit } from '@/lib/auth/rate-limit'

const COOKIE_NAME = 'za_admin'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
}

export type AdminLoginResult = { error: string } | null

export async function adminLogin(password: string): Promise<AdminLoginResult> {
  const forwarded = (await headers()).get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
  const { success } = await authRateLimit.limit(`admin:${ip}`)
  if (!success) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return { error: 'Admin password is not configured on this server.' }
  }

  // Timing-safe password comparison
  let isValid = false
  try {
    const a = Buffer.from(password)
    const b = Buffer.from(adminPassword)
    isValid = a.length === b.length && timingSafeEqual(a, b)
  } catch {
    isValid = false
  }

  if (!isValid) {
    return { error: 'Invalid password.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, computeAdminToken(adminPassword), COOKIE_OPTIONS)

  redirect('/admin')
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/admin/login')
}
