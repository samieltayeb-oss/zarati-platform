import 'server-only';
import { parse } from 'csv-parse/sync';
import { ExternalFeedAdapter, FeedError, fetchPayload, LIMITS, type FeedRow } from '../ExternalFeedAdapter';
export const WFP_URL = 'https://data.humdata.org/dataset/369e003b-f0af-4e48-99d7-34fc85b44635/resource/8fea18b2-615f-4af5-9bd5-85cc31a25ffd/download/wfp_food_prices_sdn.csv';
// Frozen raw IDs verified against the pinned R4-A artifact. Label changes require review.
const commoditiesById: Record<string, {
    label: string;
    crop: string;
}> = {
    "65": {
        "label": "Sorghum",
        "crop": "sorghum"
    },
    "73": {
        "label": "Millet",
        "crop": "millet"
    },
    "84": {
        "label": "Wheat",
        "crop": "wheat"
    },
    "135": {
        "label": "Sorghum (white)",
        "crop": "sorghum"
    },
    "249": {
        "label": "Sorghum (food aid)",
        "crop": "sorghum"
    }
};
const marketsById: Record<string, {
    label: string;
    market: string;
}> = {
    "1026": {
        "label": "Damazin",
        "market": "Ad-Damazin Crops Market"
    },
    "1029": {
        "label": "El Obeid",
        "market": "El Obeid Crops Exchange"
    },
    "1031": {
        "label": "Kassala",
        "market": "Kassala Central Market"
    },
    "1032": {
        "label": "Kosti",
        "market": "Kosti Crops Market"
    },
    "1034": {
        "label": "Port Sudan",
        "market": "Port Sudan Terminal Market"
    },
    "2580": {
        "label": "El Gedarif",
        "market": "Gedaref Crops Market"
    },
    "2588": {
        "label": "Khartoum",
        "market": "Khartoum Central Market"
    }
};
const HEADERS = 'date,admin1,admin2,market,market_id,latitude,longitude,category,commodity,commodity_id,unit,priceflag,pricetype,currency,price,usdprice'.split(',');
export type WFPRecord = Record<string, string> & {
    cropCode: string;
    dbMarket: string;
    rawRow: string;
};
export function wfpIdentity(r: Record<string, string>): string { return ['WFP_SDN_V2', r.date, r.market_id, r.commodity_id, r.pricetype, r.unit].join('_'); }
export function parseWFP(raw: string, rowCap = LIMITS.rows): {
    fetched: number;
    records: WFPRecord[];
} {
    if (Buffer.byteLength(raw) > LIMITS.bytes)
        throw new FeedError('PAYLOAD_CAP');
    if (!raw.endsWith('\n'))
        throw new FeedError('TRUNCATED_CSV');
    let rows: {
        record: Record<string, string>;
        raw: string;
    }[];
    try {
        rows = parse(raw, { bom: true, columns: (header: string[]) => { if (header.join(',') !== HEADERS.join(','))
                throw new Error('schema'); return header; }, raw: true, skip_empty_lines: false, max_record_size: 8192 });
    }
    catch {
        throw new FeedError('CSV_SCHEMA');
    }
    if (!rows.length || rows.length > rowCap)
        throw new FeedError('ROW_CAP');
    const records: WFPRecord[] = [];
    const keys = new Set<string>();
    for (const { record: r, raw: line } of rows) {
        const date = new Date(r.date + 'T00:00:00Z');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== r.date || date.getUTCFullYear() < 1900 || date.getTime() > Date.now() + 86400000)
            throw new FeedError('INVALID_DATE');
        if (!/^\d+(\.\d+)?$/.test(r.price) || !Number.isFinite(Number(r.price)) || Number(r.price) <= 0)
            throw new FeedError('INVALID_PRICE');
        if (!['SDG', 'USD', 'SSP'].includes(r.currency))
            throw new FeedError('INVALID_CURRENCY');
        if (!/^\d+$/.test(r.market_id) || !/^\d+$/.test(r.commodity_id) || !r.market || !r.commodity || !['90 KG', '3.5 KG', '3 KG', 'KG', 'L', 'USD/LCU'].includes(r.unit) || !['Retail', 'Wholesale'].includes(r.pricetype) || r.priceflag !== 'actual')
            throw new FeedError('INVALID_IDENTITY');
        if (!r.latitude || !r.longitude || !Number.isFinite(Number(r.latitude)) || Math.abs(Number(r.latitude)) > 90 || !Number.isFinite(Number(r.longitude)) || Math.abs(Number(r.longitude)) > 180)
            throw new FeedError('INVALID_COORDINATES');
        const cropCode = commoditiesById[r.commodity_id]?.crop, dbMarket = marketsById[r.market_id]?.market;
        if (!cropCode || !dbMarket)
            continue;
        const key = wfpIdentity(r);
        if (keys.has(key))
            throw new FeedError('SEMANTIC_COLLISION');
        keys.add(key);
        records.push({ ...r, cropCode, dbMarket, rawRow: line.trimEnd() });
    }
    if (!records.length)
        throw new FeedError('EMPTY_MAPPED_ARTIFACT');
    return { fetched: rows.length, records };
}
export class WFPAdapter extends ExternalFeedAdapter {
    async run() { const raw = await fetchPayload(WFP_URL, 'csv', this.signal); await this.ingest(raw, new Date().toISOString()); }
    async ingest(raw: string, retrieved: string) {
        try {
            await this.ingestValidated(raw, retrieved);
        }
        catch (error) {
            const dataset = await this.db.from('canonical_datasets').select('id').eq('dataset_identifier', 'DS_WFP_SUDAN_FOOD_PRICES').single();
            if (!dataset.error && dataset.data)
                await this.rejectedArtifact(raw, WFP_URL, retrieved, dataset.data.id);
            throw error;
        }
    }
    private async ingestValidated(raw: string, retrieved: string) {
        const parsed = parseWFP(raw);
        const [source, dataset, markets, crops, commodities, currencies] = await Promise.all([
            this.db.from('canonical_sources').select('id').eq('code', 'SRC_WFP_VAM').single(),
            this.db.from('canonical_datasets').select('id,source_id').eq('dataset_identifier', 'DS_WFP_SUDAN_FOOD_PRICES').single(),
            this.db.from('markets').select('id,name_en'), this.db.from('crops').select('id,code'),
            this.db.from('canonical_commodities').select('id,crop_id,code'), this.db.from('canonical_currencies').select('code')
        ]);
        if ([source, dataset, markets, crops, commodities, currencies].some(r => r.error) || !source.data || !dataset.data || dataset.data.source_id !== source.data.id)
            throw new FeedError('REFERENCE_DATA');
        const rows: FeedRow[] = parsed.records.map(r => {
            const market = markets.data?.find(m => m.name_en === r.dbMarket), crop = crops.data?.find(c => c.code === r.cropCode);
            const commodity = commodities.data?.find(c => c.crop_id === crop?.id && c.code === r.cropCode + '_standard');
            if (!market || !commodity || !currencies.data?.some(c => c.code === r.currency))
                throw new FeedError('REFERENCE_MAPPING');
            return { source_record_key: wfpIdentity(r), mapping_review: commoditiesById[r.commodity_id].label !== r.commodity || marketsById[r.market_id].label !== r.market, source_id: source.data!.id, dataset_id: dataset.data!.id, market_id: market.id, commodity_id: commodity.id,
                source_record_raw: JSON.stringify({ row: r.rawRow }), raw_price_text: r.price, parsed_price_numeric: Number(r.price), raw_currency_text: r.currency, raw_unit_text: r.unit,
                price_type: r.pricetype.toLowerCase(), observed_at: r.date + 'T00:00:00Z', stale_after_at: new Date(Date.parse(r.date + 'T00:00:00Z') + 30 * 86400000).toISOString() };
        });
        await this.stage(raw, WFP_URL, retrieved, parsed.fetched, rows, dataset.data.id);
    }
}
