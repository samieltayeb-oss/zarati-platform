import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/layout/footer'

const dummyNav = {
  overview: 'Overview',
  marketplace: 'Marketplace',
  intelligence: 'Intelligence',
  geography: 'Geography',
  command: 'Command',
  institutional: 'Institutional',
  workspace: 'Workspace',
}

describe('Footer Founder Access Link', () => {
  it('renders English Founder Access link pointing to /en/founder', () => {
    render(<Footer lang="en" nav={dummyNav} />)
    const link = screen.getByRole('link', { name: /Founder Access/i })
    expect(link).toBeDefined()
    expect(link.getAttribute('href')).toBe('/en/founder')
    expect(link.className).toContain('hover:text-primary')
  })

  it('renders Arabic Founder Access link pointing to /ar/founder', () => {
    render(<Footer lang="ar" nav={dummyNav} />)
    const link = screen.getByRole('link', { name: /دخول المؤسس/i })
    expect(link).toBeDefined()
    expect(link.getAttribute('href')).toBe('/ar/founder')
    expect(link.className).toContain('hover:text-primary')
  })
})
