'use client';
import { useMemo } from 'react';
import { MarketObservation } from '@/lib/services/intelligence';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter, ComposedChart } from 'recharts';

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    if (payload[0].payload.isGap) return null;
    return (
      <div className="bg-surface-elevated border border-border-strong p-3 shadow-lg rounded-xl z-50">
        <p className="text-muted text-xs mb-1 font-bold">{label}</p>
        <p className="text-primary font-mono font-bold text-lg">
          {Number(payload[0].value).toLocaleString()} <span className="text-xs text-muted font-sans font-normal">{t.sdgMt}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function HistoricalCharts({ t, data, isAr }: { t: Record<string, string>, data: MarketObservation[], isAr: boolean }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Sort ascending for chronological chart
    const sorted = [...data].sort((a, b) => new Date(a.source_observation_date).getTime() - new Date(b.source_observation_date).getTime());
    
    // Group by date
    const byDate: Record<string, { total: number, count: number }> = {};
    
    sorted.forEach(o => {
      if (o.normalized_sdg_per_mt === null) return;
      const d = new Date(o.source_observation_date).toLocaleDateString('en-CA'); // YYYY-MM-DD
      if (!byDate[d]) byDate[d] = { total: 0, count: 0 };
      byDate[d].total += o.normalized_sdg_per_mt;
      byDate[d].count += 1;
    });
    
    const dates = Object.keys(byDate).sort();
    const result = [];
    
    // Threshold for a gap to break the line (e.g., 60 days)
    const GAP_THRESHOLD_MS = 60 * 24 * 60 * 60 * 1000; 

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const prevDate = i > 0 ? dates[i - 1] : null;
      
      if (prevDate) {
        const diffMs = new Date(date).getTime() - new Date(prevDate).getTime();
        if (diffMs > GAP_THRESHOLD_MS) {
          // Insert a null point exactly in the middle to break the line
          const midMs = new Date(prevDate).getTime() + (diffMs / 2);
          result.push({
            date: new Date(midMs).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            value: null,
            rawDate: new Date(midMs).toLocaleDateString('en-CA'),
            isGap: true
          });
        }
      }
      
      result.push({
        date: new Date(date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        value: Math.round(byDate[date].total / byDate[date].count),
        rawDate: date,
        isGap: false
      });
    }
    
    return result;
  }, [data, isAr]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 bg-surface flex items-center justify-center text-muted italic">
        {t.noDataSelected}
      </div>
    );
  }

  // Calculate min and max for adaptive domain padding
  const values = chartData.filter(d => d.value !== null).map(d => d.value as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.1;

  return (
    <div className="h-72 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} opacity={0.5} />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af" 
            fontSize={11} 
            tickMargin={12} 
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={11} 
            tickFormatter={(v) => {
              if (v >= 1000000) return (v/1000000).toFixed(1) + 'M';
              if (v >= 1000) return (v/1000).toFixed(0) + 'k';
              return v;
            }}
            tickLine={false}
            axisLine={false}
            domain={[Math.max(0, min - padding), max + padding]}
            width={60}
          />
          <Tooltip content={<CustomTooltip t={t} />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            name={t.sdgMt}
            stroke="var(--color-primary, #0D3B1E)" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: "var(--color-primary, #0D3B1E)" }}
            activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-secondary, #4CAF50)" }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
