import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginAction } from '@/lib/actions/auth'

const mockSignIn = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: async () => ({
    auth: {
      signInWithPassword: mockSignIn,
    },
  }),
}))

vi.mock('next/headers', () => ({
  headers: async () => ({
    get: () => '127.0.0.1',
  }),
}))

describe('loginAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects empty credentials', async () => {
    const formData = new FormData()
    const result = await loginAction(formData)
    expect(result.error).toBe('Email and password are required.')
  })

  it('handles invalid login credentials', async () => {
    mockSignIn.mockResolvedValue({
      data: { user: null },
      error: { code: 'invalid_grant', message: 'Invalid login credentials' },
    })

    const formData = new FormData()
    formData.append('email', 'wrong@example.com')
    formData.append('password', 'wrongpassword')

    const result = await loginAction(formData)
    expect(result.error).toBe('Invalid email or password.')
    expect(result.success).toBeUndefined()
  })

  it('authenticates founder and returns isFounder flag', async () => {
    mockSignIn.mockResolvedValue({
      data: { user: { email: 'sam@nexorayyc.io', id: 'cbe31030-1ec4-4978-8d6f-b9a6324637b2' } },
      error: null,
    })

    const formData = new FormData()
    formData.append('email', 'sam@nexorayyc.io')
    formData.append('password', 'Eyad@1980')

    const result = await loginAction(formData)
    expect(result.success).toBe(true)
    expect(result.isFounder).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('authenticates non-founder user with isFounder=false', async () => {
    mockSignIn.mockResolvedValue({
      data: { user: { email: 'trader@example.com', id: 'some-id' } },
      error: null,
    })

    const formData = new FormData()
    formData.append('email', 'trader@example.com')
    formData.append('password', 'ValidPass123')

    const result = await loginAction(formData)
    expect(result.success).toBe(true)
    expect(result.isFounder).toBe(false)
  })
})
