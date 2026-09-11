'use client';
import { useMemo } from 'react';
import { MarketObservation } from '@/lib/services/intelligence';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function HistoricalCharts({ t, data, isAr }: { t: Record<string, string>, data: MarketObservation[], isAr: boolean }) {
  // Group by date and calculate average SDG/MT for simplicity if multiple markets exist
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
    
    return Object.keys(byDate).map(date => ({
      date: new Date(date).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      value: Math.round(byDate[date].total / byDate[date].count),
      rawDate: date
    }));
  }, [data, isAr]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 bg-surface-elevated border border-border-strong rounded-2xl flex items-center justify-center text-muted italic">
        {t.noDataSelected}
      </div>
    );
  }

  return (
    <div className="bg-surface-canvas border border-border-strong rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-text mb-6">{t.histPrices} ({t.sdgMt})</h3>
      <div className="h-72 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff1a" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#888" 
              fontSize={12} 
              tickMargin={10} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#888" 
              fontSize={12} 
              tickFormatter={(v) => v.toLocaleString()}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1c1c', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#10b981' }}
              labelStyle={{ color: '#888', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              name={t.sdgMt}
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#1c1c1c', strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
