import { parseExplicitMetric } from '../../lib/normalization/units';
import { describe, it, expect } from 'vitest';
import { normalizeObservation } from '../../lib/normalization/engine';
import { createAdminClient } from '../../lib/supabase/server';

describe('Explicit Metric Unit Parser', () => {
  it('parses valid metric strings', () => {
    expect(parseExplicitMetric('90 KG')).toBe(90);
    expect(parseExplicitMetric('90 kg')).toBe(90);
    expect(parseExplicitMetric('3 KG')).toBe(3);
    expect(parseExplicitMetric('3 kg')).toBe(3);
    expect(parseExplicitMetric('3.5 KG')).toBe(3.5);
    expect(parseExplicitMetric('3.5 kg')).toBe(3.5);
    expect(parseExplicitMetric(' 90  KG ')).toBe(90);
    expect(parseExplicitMetric('90 kilogram')).toBe(90);
    expect(parseExplicitMetric('90 kilograms')).toBe(90);
  });

  it('rejects invalid or ambiguous strings', () => {
    expect(parseExplicitMetric('KG')).toBeNull();
    expect(parseExplicitMetric('Sack')).toBeNull();
    expect(parseExplicitMetric('Bag')).toBeNull();
    expect(parseExplicitMetric('90 Sack')).toBeNull();
    expect(parseExplicitMetric('3.5')).toBeNull();
    expect(parseExplicitMetric('0 KG')).toBeNull();
    expect(parseExplicitMetric('-1 KG')).toBeNull();
    expect(parseExplicitMetric('NaN KG')).toBeNull();
    expect(parseExplicitMetric('Infinity KG')).toBeNull();
    expect(parseExplicitMetric('3 KG Sack')).toBeNull();
    expect(parseExplicitMetric('3.5KGjunk')).toBeNull();
    expect(parseExplicitMetric('90KGUSD')).toBeNull();
    expect(parseExplicitMetric('~90 KG')).toBeNull();
    expect(parseExplicitMetric('approximately 90 KG')).toBeNull();
  });
});
