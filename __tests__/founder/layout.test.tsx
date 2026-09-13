import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import FounderLayout from '@/app/[lang]/founder/layout'
import { redirect, notFound } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  notFound: vi.fn()
}))

// Mock Supabase
const mockGetUser = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: async () => ({
    auth: {
      getUser: mockGetUser
    }
  })
}))

describe('FounderLayout Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to login if user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error('Not logged in') })
    
    // Call the async Server Component
    await FounderLayout({ children: <div>Test</div>, params: Promise.resolve({ lang: 'en' }) })
    
    expect(redirect).toHaveBeenCalledWith('/en/login?next=/en/founder')
  })

  it('returns notFound if authenticated user is not the founder', async () => {
    mockGetUser.mockResolvedValue({ 
      data: { user: { email: 'hacker@example.com' } }, 
      error: null 
    })
    
    await FounderLayout({ children: <div>Test</div>, params: Promise.resolve({ lang: 'en' }) })
    
    expect(notFound).toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalled()
  })

  it('renders the dashboard if the user is the founder', async () => {
    mockGetUser.mockResolvedValue({ 
      data: { user: { email: 'sam@nexorayyc.io' } }, 
      error: null 
    })
    
    const JSX = await FounderLayout({ children: <div data-testid="dashboard-content">Dashboard</div>, params: Promise.resolve({ lang: 'en' }) })
    const { container } = render(JSX)
    
    expect(notFound).not.toHaveBeenCalled()
    expect(redirect).not.toHaveBeenCalled()
    expect(container.textContent).toContain('ZARATI FOUNDER COMMAND CENTER')
  })
})
