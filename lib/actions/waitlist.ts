'use server'

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

// v0.1: Mock submission — no persistence.
// Replace with Supabase / Prisma insert in v1.0.
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

  // Simulate network latency
  await new Promise<void>((resolve) => setTimeout(resolve, 700))

  if (process.env.NODE_ENV !== 'production') {
    console.log('[Zarati Waitlist]', {
      name: entry.name.trim(),
      email: entry.email.trim().toLowerCase(),
      userType: entry.userType,
      locale: entry.locale,
      submittedAt: new Date().toISOString(),
    })
  }

  return { ok: true }
}
