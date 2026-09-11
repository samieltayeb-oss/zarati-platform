'use client';

import { useMemo, useState } from 'react';
import type { MarketObservation, WeatherObservation } from '@/lib/services/intelligence';
import type { PublicFeedHealth } from '@/lib/services/institutional';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function InstitutionalDashboardClient({ 
  isAr, 
  observations, 
  weather, 
  feedHealth,
  lang
}: { 
  isAr: boolean; 
  observations: MarketObservation[]; 
  weather: WeatherObservation | null;
  feedHealth: PublicFeedHealth[];
  lang: string;
}) {
  const [exporting, setExporting] = useState(false);

  const t = {
    title: isAr ? 'الاستخبارات المؤسسية' : 'Institutional Intelligence',
    subtitle: isAr ? 'دعم القرار التنفيذي' : 'Executive Decision Support',
    presentationMode: isAr ? 'وضع العرض الوزاري' : 'Ministerial Presentation Mode',
    overview: isAr ? 'نظرة عامة' : 'Executive Overview',
    export: isAr ? 'تصدير البيانات (CSV)' : 'Export Data (CSV)',
    metrics: {
      published: isAr ? 'الرصد المنشور' : 'Published Observations',
      commodities: isAr ? 'السلع الممثلة' : 'Tracked Commodities',
      markets: isAr ? 'الأسواق المغطاة' : 'Markets Represented',
    },
    health: isAr ? 'موثوقية البيانات' : 'Data Trust & Health',
    healthy: isAr ? 'سليم' : 'Healthy',
    unavailable: isAr ? 'غير متوفر' : 'Unavailable',
    commodities: isAr ? 'استخبارات السلع' : 'Commodity Intelligence',
    regional: isAr ? 'التغطية الإقليمية' : 'Regional Intelligence',
    weather: isAr ? 'السياق المناخي والأسواق' : 'Weather & Market Context',
    gedaref: isAr ? 'القضارف (مشروع تجريبي مقترح)' : 'Gedaref (Proposed Pilot)',
    noData: isAr ? 'لا توجد بيانات موثقة' : 'NO VERIFIED DATA',
    covered: isAr ? 'مغطى' : 'COVERED',
    limited: isAr ? 'بيانات محدودة' : 'LIMITED DATA',
    pilotReady: isAr ? 'جاهزية المشروع التجريبي' : 'Pilot Readiness',
    ready: isAr ? 'جاهز' : 'READY',
  };

  const overviewStats = useMemo(() => {
    const commodities = new Set(observations.map(o => o.crop_name_en));
    const markets = new Set(observations.map(o => o.market_name_en));
    return {
      published: observations.length,
      commoditiesCount: commodities.size,
      marketsCount: markets.size,
    };
  }, [observations]);

  const handleExport = () => {
    setExporting(true);
    try {
      const headers = ['Observation ID', 'Date', 'Commodity', 'Market', 'SDG/MT', 'Calculation Version', 'Freshness'];
      const rows = observations.map(o => [
        o.normalized_id,
        o.source_observation_date,
        o.crop_name_en,
        o.market_name_en,
        o.normalized_sdg_per_mt || '',
        o.calculation_version,
        new Date(o.source_observation_date).toISOString()
      ]);
      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `zarati_public_intelligence_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } finally {
      setExporting(false);
    }
  };

  const getMarketStatus = (market: string) => {
    const count = observations.filter(o => o.market_name_en === market).length;
    if (count > 50) return t.covered;
    if (count > 0) return t.limited;
    return t.noData;
  };

  const wfpHealth = feedHealth.find(f => f.feedType === 'WFP');
  const metHealth = feedHealth.find(f => f.feedType === 'OPEN_METEO');

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-strong pb-6 print:pb-2">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            <span className="text-primary">🏛️</span> {t.title}
          </h1>
          <p className="text-muted mt-2 font-mono text-sm uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <div className="flex gap-4 print:hidden">
          <button 
            onClick={handleExport}
            disabled={exporting || observations.length === 0}
            className="px-4 py-2 bg-surface-elevated border border-border-strong rounded font-bold text-sm hover:bg-border-subtle transition-colors disabled:opacity-50"
          >
            {t.export}
          </button>
          <Link href={`/${lang}/institutional/presentation`} className="px-4 py-2 bg-primary text-white rounded font-bold text-sm hover:bg-primary-dark transition-colors">
            {t.presentationMode}
          </Link>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t.metrics.published} value={overviewStats.published} />
        <StatCard title={t.metrics.commodities} value={overviewStats.commoditiesCount} />
        <StatCard title={t.metrics.markets} value={overviewStats.marketsCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional Intelligence */}
        <div className="bg-surface-canvas border border-border-strong p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-primary">🌍</span> {t.regional}</h2>
          <div className="space-y-4">
            <RegionStatus region={t.gedaref} status={getMarketStatus('Gedaref')} isAr={isAr} />
            <RegionStatus region={isAr ? 'الخرطوم' : 'Khartoum'} status={getMarketStatus('Khartoum')} isAr={isAr} />
            <RegionStatus region={isAr ? 'الأبيض' : 'El Obeid'} status={getMarketStatus('El Obeid')} isAr={isAr} />
            <RegionStatus region={isAr ? 'سنار' : 'Sennar'} status={getMarketStatus('Sennar')} isAr={isAr} />
          </div>
        </div>

        {/* Data Trust & Health */}
        <div className="bg-surface-canvas border border-border-strong p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-primary">🛡️</span> {t.health}</h2>
          <div className="space-y-4">
            <HealthIndicator name="WFP Market Feed" healthy={wfpHealth?.isHealthy} lastExecution={wfpHealth?.lastExecution ?? null} isAr={isAr} t={t} />
            <HealthIndicator name="MET Norway Weather" healthy={metHealth?.isHealthy} lastExecution={metHealth?.lastExecution ?? null} isAr={isAr} t={t} />
            <HealthIndicator name="SDG/MT Normalization" healthy={observations.length > 0} lastExecution={observations[0]?.source_observation_date ?? null} isAr={isAr} t={t} />
            <HealthIndicator name="Verified FX (USD)" healthy={false} lastExecution={null} isAr={isAr} t={t} />
          </div>
        </div>
      </div>

      {/* Commodity Intelligence (Simple Trend) */}
      <div className="bg-surface-canvas border border-border-strong p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-primary">🌾</span> {t.commodities}</h2>
        {observations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated text-muted uppercase text-xs">
                <tr>
                  <th className="p-4 font-bold">Commodity</th>
                  <th className="p-4 font-bold">Latest Date</th>
                  <th className="p-4 font-bold">Latest Price (SDG/MT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {Array.from(new Set(observations.map(o => o.crop_name_en))).map(commodity => {
                  const latest = observations.filter(o => o.crop_name_en === commodity).sort((a,b) => new Date(b.source_observation_date).getTime() - new Date(a.source_observation_date).getTime())[0];
                  return (
                    <tr key={commodity} className="hover:bg-surface-elevated/50">
                      <td className="p-4 font-bold">{commodity}</td>
                      <td className="p-4 font-mono text-xs">{latest.source_observation_date}</td>
                      <td className="p-4 font-mono text-success font-bold">{latest.normalized_sdg_per_mt ? Math.round(latest.normalized_sdg_per_mt).toLocaleString() : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted font-bold">{t.noData}</div>
        )}
      </div>

      {/* Weather & Market Context */}
      <div className="bg-surface-canvas border border-border-strong p-6 rounded-2xl shadow-sm print:break-inside-avoid">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-primary">🌦️</span> {t.weather}</h2>
        {weather ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-surface-elevated rounded-lg">
              <div className="text-xs text-muted uppercase">Gedaref Temp</div>
              <div className="text-2xl font-bold mt-1">{weather.temperature_celsius}°C</div>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg">
              <div className="text-xs text-muted uppercase">Rainfall</div>
              <div className="text-2xl font-bold mt-1">{weather.precipitation_mm} mm</div>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg">
              <div className="text-xs text-muted uppercase">Wind Speed</div>
              <div className="text-2xl font-bold mt-1">{weather.wind_speed_kmh} km/h</div>
            </div>
            <div className="p-4 bg-surface-elevated rounded-lg">
              <div className="text-xs text-muted uppercase">Soil Moisture</div>
              <div className="text-2xl font-bold mt-1 text-muted">{t.unavailable}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted font-bold">{t.noData}</div>
        )}
      </div>

      {/* Pilot Readiness */}
      <div className="bg-surface-canvas border border-border-strong p-6 rounded-2xl shadow-sm print:break-inside-avoid">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><span className="text-primary">🚀</span> {t.pilotReady}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <ReadinessBadge label="Infrastructure" status="READY" t={t} />
          <ReadinessBadge label="Market Intel" status="READY" t={t} />
          <ReadinessBadge label="Operations" status="READY" t={t} />
          <ReadinessBadge label="Government MOU" status="REQUIRES PARTNER" t={t} />
        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-surface-canvas border border-border-strong p-6 rounded-2xl shadow-sm">
      <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-2">{title}</h3>
      <div className="text-4xl font-bold text-navy">{value}</div>
    </div>
  );
}

function RegionStatus({ region, status, isAr }: { region: string; status: string; isAr: boolean }) {
  const isCovered = status.includes('COVERED') || status.includes('مغطى');
  const isLimited = status.includes('LIMITED') || status.includes('محدود');
  
  return (
    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
      <span className="font-bold">{region}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
        isCovered ? 'bg-success/10 text-success' :
        isLimited ? 'bg-warning/10 text-warning' :
        'bg-border-subtle text-muted'
      }`}>
        {status}
      </span>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function HealthIndicator({ name, healthy, lastExecution, isAr, t }: { name: string; healthy?: boolean; lastExecution: string | null; isAr: boolean; t: any }) {
  return (
    <div className="flex justify-between items-center p-3 border border-border rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${healthy ? 'bg-success' : 'bg-danger'}`}></div>
        <span className="font-bold text-sm">{name}</span>
      </div>
      <div className="text-right">
        <div className={`text-xs font-bold uppercase ${healthy ? 'text-success' : 'text-danger'}`}>
          {healthy ? t.healthy : t.unavailable}
        </div>
        {lastExecution && (
          <div className="text-[10px] text-muted font-mono mt-1">
            {new Date(lastExecution).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
          </div>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ReadinessBadge({ label, status, t }: { label: string; status: string; t: any }) {
  const isReady = status === 'READY';
  return (
    <div className={`p-4 rounded-xl border ${isReady ? 'border-success/30 bg-success/5' : 'border-warning/30 bg-warning/5'}`}>
      <div className="text-xs font-bold uppercase mb-2 text-muted">{label}</div>
      <div className={`font-bold text-sm ${isReady ? 'text-success' : 'text-warning'}`}>
        {isReady ? t.ready : status}
      </div>
    </div>
  );
}
