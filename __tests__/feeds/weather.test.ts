import { describe, it, expect, beforeAll } from 'vitest';
import { OpenMeteoAdapter } from '@/lib/feeds/weather/open-meteo-adapter';

describe('OpenMeteo Weather Adapter', () => {
  let adapter: any;

  beforeAll(() => {
    adapter = new (class extends OpenMeteoAdapter {
      constructor() { super('test-weather'); }
      public async testParse(data: any) { return this.parse(data); }
      public testDeriveIdentity(record: any) { return this.deriveSourceIdentity(record); }
      public async testValidate(record: any) { return this.validate(record); }
    })();
  });

  it('correctly parses and derives identity', async () => {
    const rawMock = {
      latitude: 14.0323,
      longitude: 33.9859,
      current: {
        time: '2026-09-08T21:00',
        temperature_2m: 32.6,
        relative_humidity_2m: 34,
        precipitation: 0,
        wind_speed_10m: 4.8
      }
    };

    const parsed = await adapter.testParse(rawMock);
    expect(parsed.length).toBe(1);
    
    const record = parsed[0];
    expect(record.temporalClass).toBe('CURRENT_OBSERVED');
    expect(record.temperature).toBe(32.6);

    const isValid = await adapter.testValidate(record);
    expect(isValid).toBe(true);

    const identity = adapter.testDeriveIdentity(record);
    expect(identity).toBe('OPEN_METEO_14.0323_33.9859_2026-09-08T21:00_CURRENT_OBSERVED');
  });
});
