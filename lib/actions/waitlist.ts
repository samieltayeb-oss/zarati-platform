'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { sendWelcomeEmail, sendAdminNotification } from '@/lib/email/send'

export type WaitlistUserType = 'farmer' | 'trader' | 'ngo' | 'government' | 'investor'

export interface WaitlistEntry {
  name: string
  email: string
  userType: WaitlistUserType
  locale: string
}

export type WaitlistResult =
  | { ok: true }
  | { ok: false; field?: 'name' | 'email' | 'userType'; message: string }

export async function submitWaitlist(entry: WaitlistEntry): Promise<WaitlistResult> {
  if (!entry.name.trim()) {
    return { ok: false, field: 'name', message: 'Name is required.' }
  }
  if (!entry.email.trim()) {
    return { ok: false, field: 'email', message: 'Email is required.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email.trim())) {
    return { ok: false, field: 'email', message: 'Invalid email address.' }
  }
  if (!entry.userType) {
    return { ok: false, field: 'userType', message: 'Please select your role.' }
  }

  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('waitlist').insert({
      name: entry.name.trim(),
      email: entry.email.trim().toLowerCase(),
      role: entry.userType,
      language: entry.locale,
    })

    if (error) {
      // Postgres unique_violation — duplicate email
      if (error.code === '23505') {
        return { ok: false, field: 'email', message: 'This email is already on the waitlist.' }
      }
      console.error('[Zarati Waitlist] Insert error:', error.message)
      return { ok: false, message: 'Something went wrong. Please try again.' }
    }
  } catch (err) {
    console.error('[Zarati Waitlist] Unexpected error:', err)
    return { ok: false, message: 'Something went wrong. Please try again.' }
  }

  // Send emails in parallel — failures are logged but never fail the signup
  await Promise.allSettled([
    sendWelcomeEmail(entry),
    sendAdminNotification(entry),
  ])

  return { ok: true }
}
