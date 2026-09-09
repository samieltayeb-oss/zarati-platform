import { describe, it, expect, beforeAll } from 'vitest';
import { WFPAdapter } from '@/lib/feeds/wfp/wfp-adapter';
import fs from 'fs';
import path from 'path';

describe('WFP Feed Adapter - Historical Replay', () => {
  let adapter: any;
  let rawData: string;

  beforeAll(() => {
    adapter = new (class extends WFPAdapter {
      constructor() { super('test-exec-id'); }
      // Expose protected methods for testing
      public async testParse(data: any) { return this.parse(data); }
      public testDeriveIdentity(record: any) { return this.deriveSourceIdentity(record); }
    })();
    
    // Load the actual CSV for replay testing
    const csvPath = path.join(process.cwd(), 'scratch', 'wfp_food_prices_sdn.csv');
    rawData = fs.readFileSync(csvPath, 'utf-8');
  });

  it('exactly reproduces 5663 mapped observations and identities with 0 collisions', async () => {
    const parsedRecords = await adapter.testParse(rawData);
    
    // Original rows logic from repair script
    // Original rows logic from repair script

    expect(parsedRecords.length).toBe(5663);

    const identities = new Set<string>();
    let collisions = 0;

    for (const record of parsedRecords) {
      const identity = adapter.testDeriveIdentity(record);
      if (identities.has(identity)) {
        collisions++;
      }
      identities.add(identity);
    }

    expect(identities.size).toBe(5663);
    expect(collisions).toBe(0);
  });
});
