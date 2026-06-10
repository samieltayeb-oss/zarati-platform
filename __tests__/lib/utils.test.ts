import { describe, it, expect } from 'vitest'
import { cn, formatNumber, formatPercent, formatCurrency } from '@/lib/utils'

describe('cn', () => {
  it('combines class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })
  it('filters falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })
  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('p-4', 'p-6')).toBe('p-6')
  })
})

describe('formatPercent', () => {
  it('prefixes positive values with +', () => {
    expect(formatPercent(5, 'en-US')).toContain('+')
  })
  it('shows minus for negative values', () => {
    expect(formatPercent(-3.5, 'en-US')).toContain('-')
  })
  it('handles zero', () => {
    const result = formatPercent(0, 'en-US')
    expect(result).toBeTruthy()
  })
})

describe('formatNumber', () => {
  it('formats numbers without throwing', () => {
    expect(() => formatNumber(82500, 'en-US')).not.toThrow()
  })
  it('returns non-empty string', () => {
    expect(formatNumber(1000, 'en-US').length).toBeGreaterThan(0)
  })
})

describe('formatCurrency', () => {
  it('returns a non-empty string for valid amounts', () => {
    const result = formatCurrency(82500, 'en-US', 'USD')
    expect(result.length).toBeGreaterThan(0)
  })
  it('falls back gracefully for unknown currency codes', () => {
    const result = formatCurrency(100, 'en-US', 'XYZ')
    expect(result.length).toBeGreaterThan(0)
  })
})
