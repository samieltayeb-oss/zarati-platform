import { IntelligenceOverview } from '@/lib/services/intelligence'

export function IntelligenceOverviewComponent({ t, overview, isAr }: { t: Record<string, string>, overview: IntelligenceOverview, isAr: boolean }) {
  const stats = [
    { label: t.publishedObs, value: overview.totalPublished.toLocaleString() },
    { label: t.trackedComms, value: overview.commoditiesCount.toLocaleString() },
    { label: t.marketsRep, value: overview.marketsCount.toLocaleString() },
    { label: t.latestObs, value: overview.latestObservationDate ? new Date(overview.latestObservationDate).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : '-' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-surface-canvas border border-border-strong rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <span className="text-muted text-sm font-semibold mb-2">{stat.label}</span>
          <span className="text-3xl font-bold text-text">{stat.value}</span>
        </div>
      ))}
    </div>
  )
}
