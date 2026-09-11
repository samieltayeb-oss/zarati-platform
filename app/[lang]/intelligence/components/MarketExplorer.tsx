'use client';
import { useState, useMemo } from 'react';
import { MarketObservation } from '@/lib/services/intelligence';
import { HistoricalCharts } from './HistoricalCharts';

export function MarketExplorer({ t, observations, isAr }: { t: Record<string, string>, observations: MarketObservation[], isAr: boolean }) {
  const [selectedComm, setSelectedComm] = useState<string>('ALL');
  
  const commodities = useMemo(() => Array.from(new Set(observations.map(o => o.crop_name_en))), [observations]);
  
  const filtered = useMemo(() => {
    if (selectedComm === 'ALL') return observations;
    return observations.filter(o => o.crop_name_en === selectedComm);
  }, [observations, selectedComm]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text mb-6">{t.marketIntel}</h2>
        
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedComm('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedComm === 'ALL' ? 'bg-primary text-primary-inverse' : 'bg-surface-elevated text-muted hover:bg-border-subtle'}`}
          >
            {t.overview}
          </button>
          {commodities.map(c => (
            <button
              key={c}
              onClick={() => setSelectedComm(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedComm === c ? 'bg-primary text-primary-inverse' : 'bg-surface-elevated text-muted hover:bg-border-subtle'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Charts */}
        <HistoricalCharts t={t} data={filtered} isAr={isAr} />

        {/* Table */}
        <div className="mt-8 bg-surface-canvas border border-border-strong rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-elevated border-b border-border-strong text-muted text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">{t.obsDate}</th>
                  <th className="p-4 font-semibold">{t.market}</th>
                  <th className="p-4 font-semibold">{t.commodity}</th>
                  <th className="p-4 font-semibold text-right">{t.originalPrice}</th>
                  <th className="p-4 font-semibold text-right">{t.sdgKg}</th>
                  <th className="p-4 font-semibold text-right">{t.sdgMt}</th>
                  <th className="p-4 font-semibold text-right">USD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-sm">
                {filtered.map(o => (
                  <tr key={o.normalized_id} className="hover:bg-surface-elevated/50 transition-colors">
                    <td className="p-4 whitespace-nowrap">{new Date(o.source_observation_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</td>
                    <td className="p-4 font-medium text-text">{o.market_name_en}</td>
                    <td className="p-4 text-text">{o.crop_name_en}</td>
                    <td className="p-4 text-right text-muted">{o.raw_price_text} {o.raw_currency_text} / {o.raw_unit_text}</td>
                    <td className="p-4 text-right font-mono text-text">
                      {o.normalized_sdg_per_kg ? o.normalized_sdg_per_kg.toFixed(2) : '-'}
                    </td>
                    <td className="p-4 text-right font-mono text-text">
                      {o.normalized_sdg_per_mt ? o.normalized_sdg_per_mt.toLocaleString(isAr ? 'ar-EG' : 'en-US', { maximumFractionDigits: 0 }) : '-'}
                    </td>
                    <td className="p-4 text-right">
                      {o.normalized_usd_per_kg !== null ? (
                        <span className="font-mono text-text">${o.normalized_usd_per_kg.toFixed(2)}</span>
                      ) : (
                        <span className="text-xs text-muted italic bg-surface-elevated px-2 py-1 rounded-md" title={t.verifiedFxRequired}>
                          {t.unavailable}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted italic">
                      {t.noDataSelected}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
