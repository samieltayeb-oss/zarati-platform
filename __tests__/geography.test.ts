import { describe, it, expect } from 'vitest'
import { CANONICAL_MARKET_COORDINATES } from '@/lib/services/geography'
import { geographyDict } from '@/lib/i18n/geography-dict'

describe('Geography V2 Canonical Coordinates & Data Law', () => {
  it('strictly classifies Gedaref market coordinates as LOCALITY_APPROXIMATION', () => {
    const gedaref = CANONICAL_MARKET_COORDINATES['MKT-GD-01']
    expect(gedaref).toBeDefined()
    expect(gedaref.latitude).toBe(14.04)
    expect(gedaref.longitude).toBe(35.38)
    expect(gedaref.precision).toBe('LOCALITY_APPROXIMATION')
    expect(gedaref.source).toContain('WFP VAM')
  })

  it('strictly classifies El Obeid market coordinates as LOCALITY_APPROXIMATION', () => {
    const elobeid = CANONICAL_MARKET_COORDINATES['MKT-OB-01']
    expect(elobeid).toBeDefined()
    expect(elobeid.latitude).toBe(13.19)
    expect(elobeid.longitude).toBe(30.22)
    expect(elobeid.precision).toBe('LOCALITY_APPROXIMATION')
  })

  it('strictly classifies Kosti market coordinates as LOCALITY_APPROXIMATION', () => {
    const kosti = CANONICAL_MARKET_COORDINATES['MKT-KT-01']
    expect(kosti).toBeDefined()
    expect(kosti.latitude).toBe(13.17)
    expect(kosti.longitude).toBe(32.67)
    expect(kosti.precision).toBe('LOCALITY_APPROXIMATION')
  })

  it('suppresses arbitrary coordinate placement for unverified markets (Nyala)', () => {
    const nyala = CANONICAL_MARKET_COORDINATES['MKT-NY-01']
    expect(nyala).toBeDefined()
    expect(nyala.precision).toBe('NO_VERIFIED_LOCATION')
  })

  it('verifies bilingual dictionary completeness for EN and AR', () => {
    const enKeys = Object.keys(geographyDict.en)
    const arKeys = Object.keys(geographyDict.ar)
    expect(enKeys.length).toBeGreaterThan(30)
    expect(arKeys.length).toBe(enKeys.length)
    enKeys.forEach((k) => {
      expect(geographyDict.ar).toHaveProperty(k)
    })
  })

  it('verifies R10 vision disclaimer is explicitly maintained', () => {
    expect(geographyDict.en.visionDisclaimer).toContain('R10 Vision')
    expect(geographyDict.ar.visionDisclaimer).toContain('R10 Vision')
  })
})
