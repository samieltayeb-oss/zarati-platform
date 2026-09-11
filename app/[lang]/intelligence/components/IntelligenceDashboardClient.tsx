'use client';
import { useState, useMemo } from 'react';
import { MarketObservation, IntelligenceOverview, WeatherObservation } from '@/lib/services/intelligence';
import { HistoricalCharts } from './HistoricalCharts';

export function IntelligenceDashboardClient({ 
  t, 
  overview, 
  observations, 
  weather, 
  isAr 
}: { 
  t: Record<string, string>, 
  overview: IntelligenceOverview, 
  observations: MarketObservation[], 
  weather: WeatherObservation | null, 
  isAr: boolean 
}) {
  const [selectedComm, setSelectedComm] = useState<string>('ALL');
  const [selectedMarket, setSelectedMarket] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('ALL');

  const commodities = useMemo(() => Array.from(new Set(observations.map(o => o.crop_name_en))), [observations]);
  const markets = useMemo(() => Array.from(new Set(observations.map(o => o.market_name_en))), [observations]);

  const filtered = useMemo(() => {
    return observations.filter(o => {
      const commMatch = selectedComm === 'ALL' || o.crop_name_en === selectedComm;
      const marketMatch = selectedMarket === 'ALL' || o.market_name_en === selectedMarket;
      
      let dateMatch = true;
      if (dateRange !== 'ALL') {
        const obsDate = new Date(o.source_observation_date).getTime();
        const now = Date.now();
        const yearMs = 365.25 * 24 * 60 * 60 * 1000;
        if (dateRange === '1Y') dateMatch = now - obsDate <= yearMs;
        if (dateRange === '3Y') dateMatch = now - obsDate <= 3 * yearMs;
        if (dateRange === '5Y') dateMatch = now - obsDate <= 5 * yearMs;
      }
      
      return commMatch && marketMatch && dateMatch;
    });
  }, [observations, selectedComm, selectedMarket, dateRange]);

  const latestFilteredObs = filtered.length > 0 ? filtered[0] : null;

  const translateCommodity = (enName: string) => {
    if (!isAr) return enName;
    const lower = enName.toLowerCase();
    if (lower.includes('millet')) return t.millet || enName;
    if (lower.includes('sorghum')) return t.sorghum || enName;
    if (lower.includes('wheat')) return t.wheat || enName;
    return enName;
  };

  return (
    <div className="space-y-12">
      {/* 1. Masthead & Command Bar */}
      <div className="space-y-6">
        <div className="border-b border-border-strong pb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            ZARATI <span className="font-light">{t.intelligence?.toUpperCase()}</span>
          </h1>
          <p className="mt-3 text-lg text-muted max-w-2xl font-medium">
            {t.sudanAgriIntelDesc}
          </p>
        </div>
        
        {/* Command Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-surface-canvas p-2 rounded-xl border border-border-strong shadow-sm overflow-x-auto">
          <div className="flex-1 flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedComm('ALL')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${selectedComm === 'ALL' ? 'bg-primary text-white shadow-md' : 'bg-transparent text-muted hover:bg-surface-elevated hover:text-text'}`}
            >
              {t.overview}
            </button>
            {commodities.map(c => (
              <button
                key={c}
                onClick={() => setSelectedComm(c)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${selectedComm === c ? 'bg-primary text-white shadow-md' : 'bg-transparent text-muted hover:bg-surface-elevated hover:text-text'}`}
              >
                {translateCommodity(c)}
              </button>
            ))}
          </div>
          
          <div className="h-px w-full md:h-10 md:w-px bg-border-strong mx-2 hidden md:block"></div>
          
          <div className="flex gap-2">
             <select 
               value={selectedMarket}
               onChange={(e) => setSelectedMarket(e.target.value)}
               className="bg-surface-elevated border border-border-strong rounded-lg px-4 py-2 text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
             >
               <option value="ALL">{isAr ? 'جميع الأسواق' : 'All Markets'}</option>
               {markets.map(m => (
                 <option key={m} value={m}>{m}</option>
               ))}
             </select>

             <select 
               value={dateRange}
               onChange={(e) => setDateRange(e.target.value)}
               className="bg-surface-elevated border border-border-strong rounded-lg px-4 py-2 text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
             >
               <option value="ALL">{isAr ? 'جميع الأوقات' : 'All Time'}</option>
               <option value="5Y">{isAr ? '5 سنوات' : '5Y'}</option>
               <option value="3Y">{isAr ? '3 سنوات' : '3Y'}</option>
               <option value="1Y">{isAr ? 'سنة واحدة' : '1Y'}</option>
             </select>
          </div>
        </div>
      </div>

      {/* 2. Intelligence Pulse */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: t.publishedObs, value: overview.totalPublished.toLocaleString(), icon: '📊' },
          { label: t.trackedComms, value: overview.commoditiesCount.toLocaleString(), icon: '🌾' },
          { label: t.marketsRep, value: overview.marketsCount.toLocaleString(), icon: '📍' },
          { label: t.latestObs, value: overview.latestObservationDate ? new Date(overview.latestObservationDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : '-', icon: '⏱️' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-canvas border border-border-strong rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-5 text-8xl group-hover:opacity-10 transition-opacity">
              {stat.icon}
            </div>
            <span className="flex items-center gap-2 text-muted text-sm font-semibold mb-3 uppercase tracking-wider relative z-10">
              <span className="text-primary">{stat.icon}</span> {stat.label}
            </span>
            <span className="text-3xl md:text-4xl font-bold text-text relative z-10">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* 3. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN - MARKET INTELLIGENCE */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-surface-canvas border border-border-strong rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text mb-2">{t.marketIntel}</h2>
                <div className="text-muted font-medium flex flex-wrap gap-2 items-center">
                   <span className="bg-surface-elevated px-3 py-1 rounded-full text-xs text-text border border-border">
                     {selectedComm === 'ALL' ? t.overview : translateCommodity(selectedComm)}
                   </span>
                   <span className="bg-surface-elevated px-3 py-1 rounded-full text-xs text-text border border-border">
                     {selectedMarket === 'ALL' ? (isAr ? 'الأسواق' : 'Markets') : selectedMarket}
                   </span>
                </div>
              </div>
              
              {latestFilteredObs && (
                <div className="text-left md:text-right p-4 bg-surface-elevated rounded-xl border border-border-strong w-full md:w-auto">
                  <div className="text-xs text-muted uppercase font-bold mb-1">{t.latestObs}</div>
                  <div className="text-2xl font-bold text-text font-mono">
                    {latestFilteredObs.normalized_sdg_per_kg ? latestFilteredObs.normalized_sdg_per_kg.toFixed(2) : '-'} <span className="text-base font-normal text-muted">{t.sdgKg}</span>
                  </div>
                  <div className="text-xs text-muted mt-1 font-mono">
                    {new Date(latestFilteredObs.source_observation_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-10 min-h-[300px]">
               <HistoricalCharts t={t} data={filtered} isAr={isAr} />
            </div>

            {/* Intelligence Table */}
            <div className="overflow-x-auto rounded-xl border border-border-strong shadow-inner bg-surface">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-elevated border-b border-border-strong text-muted text-xs uppercase tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-bold">{t.obsDate}</th>
                    <th className="p-4 font-bold">{t.commodity}</th>
                    <th className="p-4 font-bold">{t.market}</th>
                    <th className="p-4 font-bold text-right bg-blue-50/50 dark:bg-blue-900/10">{t.originalPrice}</th>
                    <th className="p-4 font-bold text-right bg-green-50/50 dark:bg-green-900/10 border-l border-border">{t.normalizedPrice} ({t.sdgKg})</th>
                    <th className="p-4 font-bold text-right bg-green-50/50 dark:bg-green-900/10">({t.sdgMt})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-sm">
                  {filtered.map(o => (
                    <tr key={o.normalized_id} className="hover:bg-surface-elevated transition-colors group">
                      <td className="p-4 whitespace-nowrap text-muted font-mono text-xs">{new Date(o.source_observation_date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}</td>
                      <td className="p-4 font-semibold text-text">{translateCommodity(o.crop_name_en)}</td>
                      <td className="p-4 text-muted">{o.market_name_en}</td>
                      <td className="p-4 text-right bg-blue-50/30 group-hover:bg-blue-50/50 transition-colors">
                        <div className="font-mono text-xs font-semibold text-text">{o.raw_price_text} {o.raw_currency_text}</div>
                        <div className="text-[10px] text-muted">{o.raw_unit_text}</div>
                      </td>
                      <td className="p-4 text-right font-mono text-text bg-green-50/30 group-hover:bg-green-50/50 transition-colors font-bold border-l border-border-subtle text-success">
                        {o.normalized_sdg_per_kg ? o.normalized_sdg_per_kg.toFixed(2) : '-'}
                      </td>
                      <td className="p-4 text-right font-mono text-muted bg-green-50/30 group-hover:bg-green-50/50 transition-colors text-xs">
                        {o.normalized_sdg_per_mt ? o.normalized_sdg_per_mt.toLocaleString(isAr ? 'ar-EG' : 'en-US', { maximumFractionDigits: 0 }) : '-'}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-4xl mb-4 opacity-50">🔍</span>
                          <span className="font-semibold">{t.noDataSelected}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - WEATHER & TRUST */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Premium Weather Module */}
          <div className="bg-gradient-to-br from-navy to-navy-dark text-white rounded-3xl p-6 md:p-8 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold uppercase tracking-widest text-xs text-blue-200">{t.weatherLoc}</h3>
                <span className="bg-blue-900/50 px-2 py-1 rounded text-[10px] font-mono border border-blue-800/50 uppercase">{t.metNorway || 'MET Norway'}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-8">
                {isAr ? 'القضارف' : 'GEDAREF'}
              </h2>

              {weather ? (
                <div className="space-y-6">
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-bold tracking-tighter" dir="ltr">{weather.temperature_celsius}°</span>
                    <span className="text-blue-200 pb-2 font-medium">C</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div>
                      <div className="text-xs text-blue-200 mb-1">{t.humidity}</div>
                      <div className="font-mono font-semibold" dir="ltr">{weather.relative_humidity_percent}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-blue-200 mb-1">{t.precip}</div>
                      <div className="font-mono font-semibold" dir="ltr">{weather.precipitation_mm} mm</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-blue-200 mb-1">{t.wind}</div>
                      <div className="font-mono font-semibold" dir="ltr">{weather.wind_speed_kmh} km/h</div>
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-blue-300 pt-4 opacity-70 flex justify-between font-mono">
                    <span>{t.forecast}</span>
                    <span>{new Date(weather.valid_time).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-blue-200">
                  <div className="mb-4 text-4xl opacity-50">☁️</div>
                  <div className="text-sm font-semibold">{t.weatherDataUnavailable}</div>
                </div>
              )}
            </div>
          </div>

          {/* Data Trust Module */}
          <div className="bg-surface-canvas border border-border-strong rounded-3xl p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
              <span className="text-primary">🛡️</span> {t.dataTrust || 'Data Trust'}
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">WFP</div>
                  <h4 className="font-semibold text-text text-sm">{t.wfp}</h4>
                </div>
                <p className="text-xs text-muted">{t.wfpDesc}</p>
              </div>

              <div className="p-4 rounded-xl bg-green-50/50 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">ZA</div>
                  <h4 className="font-semibold text-text text-sm">{t.zaratiEngine}</h4>
                </div>
                <p className="text-xs text-muted mb-3">{t.zaratiDesc}</p>
                <div className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">{t.sourceVsDerived}</div>
                <div className="text-xs text-muted leading-relaxed border-l-2 border-primary/30 pl-3">
                  {isAr ? 'زراعتي تستقبل الأسعار من المصدر بوحدات غير معيارية (مثل "جوال" أو "كيلة") وتوحدها بدقة رياضية إلى ج.س/كجم وطن متري.' : 'ZARATI ingests raw non-standard source units (e.g. "Jawal", "Kila") and mathematically normalizes them to precise SDG/kg and MT.'}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
