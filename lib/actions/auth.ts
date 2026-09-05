'use server'

import { createServerClient } from '@/lib/supabase/server'
import { authRateLimit } from '@/lib/auth/rate-limit'
import { headers } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const forwarded = (await headers()).get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
  const { success } = await authRateLimit.limit(`${ip}:${email.toLowerCase()}`)
  if (!success) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[Auth] Login Error:', error.code, error.message)
    return { error: 'Invalid email or password.' }
  }
  
  return { success: true }
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const role = formData.get('role') as string
  const businessName = formData.get('businessName') as string
  const stateId = formData.get('stateId') as string
  const phone = formData.get('phone') as string

  const forwarded = (await headers()).get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
  const { success } = await authRateLimit.limit(`${ip}:${email.toLowerCase()}`)
  if (!success) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  if (role !== 'farmer' && role !== 'trader') {
    return { error: 'Invalid role selected.' }
  }

  if (role === 'farmer' && stateId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(stateId)) {
    return { error: 'Invalid state selection.' }
  }

  const supabase = await createServerClient()
  
  const userMetadata: Record<string, string> = {
    full_name: fullName,
    role,
  }
  
  if (role === 'trader' && businessName) {
    userMetadata.business_name = businessName
    userMetadata.trader_type = 'wholesaler'
  }
  
  if (phone) {
    userMetadata.phone = phone
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userMetadata,
    },
  })

  if (error) {
    console.error('[Auth] Registration Error:', error.code, error.message)
    return { error: 'Registration failed. Please try again.' }
  }
  
  // Update location if farmer and state provided
  if (role === 'farmer' && stateId && data.user) {
    await supabase.from('profiles').update({ state_id: stateId }).eq('id', data.user.id)
  }

  return { success: true }
}

export async function signOutAction() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
}
import { resetPasswordRateLimit } from '@/lib/auth/rate-limit'

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return { error: 'Email is required.' }

  const forwarded = (await headers()).get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
  const { success } = await resetPasswordRateLimit.limit(`${ip}:${email.toLowerCase()}`)
  if (!success) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password/confirm`,
  })

  if (error) {
    console.error('[Auth] Reset Password Error:', error.code, error.message)
    // Avoid revealing whether the email exists
    return { success: true }
  }

  return { success: true }
}

export async function confirmPasswordResetAction(formData: FormData) {
  const password = formData.get('password') as string
  if (!password || password.length < 8) return { error: 'Password must be at least 8 characters.' }

  const forwarded = (await headers()).get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
  const { success } = await authRateLimit.limit(ip)
  if (!success) {
    return { error: 'Too many attempts. Please try again later.' }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    console.error('[Auth] Update Password Error:', error.code, error.message)
    return { error: 'Failed to reset password. Please try again or request a new link.' }
  }

  return { success: true }
}
