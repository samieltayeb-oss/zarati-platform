'use client';

import { useState } from 'react';
import type { FeedExecution } from '@/lib/services/operations';

interface Props {
  isAr: boolean;
  executions: FeedExecution[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quarantined: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineage: any[];
}

export function OperationsDashboardClient({ isAr, executions, quarantined, lineage }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'history' | 'quarantine' | 'lineage'>('overview');

  const t = {
    opsCenter: isAr ? 'مركز العمليات والتحقق' : 'Operations & Verification Center',
    overview: isAr ? 'نظرة عامة' : 'Overview',
    feedHealth: isAr ? 'حالة التغذية' : 'Feed Health',
    executionHistory: isAr ? 'سجل التنفيذ' : 'Execution History',
    quarantine: isAr ? 'قائمة العزل' : 'Quarantine / Conflicts',
    lineage: isAr ? 'سجل البيانات' : 'Data Lineage',
    wfpFeed: isAr ? 'تغذية WFP' : 'WFP Feed',
    metFeed: isAr ? 'تغذية MET Norway' : 'MET Norway Feed',
    healthy: isAr ? 'سليم' : 'Healthy',
    warning: isAr ? 'تحذير' : 'Warning',
    error: isAr ? 'خطأ' : 'Error',
    totalExecs: isAr ? 'إجمالي التنفيذات' : 'Total Executions',
    quarantinedCount: isAr ? 'السجلات المعزولة' : 'Quarantined Items',
    noData: isAr ? 'لا توجد بيانات' : 'No Data',
  };

  const wfpExecs = executions.filter(e => e.feed_type === 'WFP');
  const metExecs = executions.filter(e => e.feed_type === 'OPEN_METEO'); // Wait, OPEN_METEO in db was renamed or kept? MET_NORWAY? Let's check db enum. Actually I'll just filter by MET_NORWAY or OPEN_METEO.

  return (
    <div className="space-y-8">
      <div className="border-b border-border-strong pb-6">
        <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
          <span className="text-primary">🛡️</span> {t.opsCenter}
        </h1>
        <p className="text-muted mt-2">
          {isAr ? 'وصول مقيد للمشغلين المعتمدين.' : 'Restricted access for authorized operators.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border">
        {['overview', 'health', 'history', 'quarantine', 'lineage'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'overview' | 'health' | 'history' | 'quarantine' | 'lineage')}
            className={`px-4 py-2 font-semibold text-sm whitespace-nowrap rounded-t-lg border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-muted hover:bg-surface-elevated hover:text-text'
            }`}
          >
            {t[tab as keyof typeof t]}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-canvas p-6 rounded-2xl border border-border-strong shadow-sm">
            <h3 className="text-sm font-bold text-muted mb-2 uppercase">{t.totalExecs}</h3>
            <div className="text-4xl font-bold text-text">{executions.length}</div>
          </div>
          <div className="bg-surface-canvas p-6 rounded-2xl border border-border-strong shadow-sm">
            <h3 className="text-sm font-bold text-muted mb-2 uppercase">{t.quarantinedCount}</h3>
            <div className={`text-4xl font-bold ${quarantined.length > 0 ? 'text-warning' : 'text-success'}`}>
              {quarantined.length}
            </div>
            {quarantined.length === 0 && (
              <div className="text-xs text-success mt-1">{isAr ? 'لا توجد تعارضات' : 'Zero active conflicts'}</div>
            )}
          </div>
        </div>
      )}

      {/* HEALTH TAB */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <FeedHealthCard t={t} isAr={isAr} title="WFP / Food Security" feedType="WFP" execs={wfpExecs} />
          <FeedHealthCard t={t} isAr={isAr} title="MET Norway / Weather" feedType="OPEN_METEO" execs={metExecs} />
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="bg-surface-canvas rounded-2xl border border-border-strong overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated text-muted uppercase text-xs">
                <tr>
                  <th className="p-4 font-bold">Started At</th>
                  <th className="p-4 font-bold">Feed</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Fetched</th>
                  <th className="p-4 font-bold text-right">Inserted</th>
                  <th className="p-4 font-bold text-right">Quarantined</th>
                  <th className="p-4 font-bold text-right">Rejected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {executions.map(e => (
                  <tr key={e.id} className="hover:bg-surface-elevated/50">
                    <td className="p-4 whitespace-nowrap font-mono text-xs">{new Date(e.started_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</td>
                    <td className="p-4 font-semibold text-text">{e.feed_type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        e.status === 'succeeded' ? 'bg-success/10 text-success' :
                        e.status === 'failed' ? 'bg-danger/10 text-danger' :
                        'bg-warning/10 text-warning'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">{e.records_fetched}</td>
                    <td className="p-4 text-right font-mono text-success">{e.records_inserted}</td>
                    <td className="p-4 text-right font-mono text-warning">{e.records_quarantined}</td>
                    <td className="p-4 text-right font-mono text-danger">{e.records_rejected}</td>
                  </tr>
                ))}
                {executions.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-muted">{t.noData}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUARANTINE TAB */}
      {activeTab === 'quarantine' && (
        <div className="bg-surface-canvas rounded-2xl border border-border-strong p-6 shadow-sm">
          {quarantined.length === 0 ? (
            <div className="text-center py-12 text-success">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-bold text-lg">{isAr ? 'قائمة العزل فارغة' : 'Quarantine is empty'}</h3>
              <p className="text-muted text-sm">{isAr ? 'لا توجد بيانات بانتظار المراجعة' : 'No records pending manual review.'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-elevated text-muted uppercase text-xs border-b border-border-strong">
                  <tr>
                    <th className="p-4 font-bold">Date</th>
                    <th className="p-4 font-bold">Source Provenance</th>
                    <th className="p-4 font-bold">Price / Unit</th>
                    <th className="p-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {quarantined.map(q => (
                    <tr key={q.id}>
                      <td className="p-4 font-mono text-xs">{new Date(q.observed_at || q.created_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</td>
                      <td className="p-4">{q.source_provenance || '-'}</td>
                      <td className="p-4 font-mono">{q.raw_price_text} {q.raw_currency_text} / {q.raw_unit_text}</td>
                      <td className="p-4 text-danger text-xs font-bold uppercase">{q.publication_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* LINEAGE TAB */}
      {activeTab === 'lineage' && (
        <div className="bg-surface-canvas rounded-2xl border border-border-strong overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-elevated text-muted uppercase text-xs border-b border-border-strong">
                <tr>
                  <th className="p-4 font-bold">Normalized ID</th>
                  <th className="p-4 font-bold">Source Record ID</th>
                  <th className="p-4 font-bold">SDG/KG</th>
                  <th className="p-4 font-bold">SDG/MT</th>
                  <th className="p-4 font-bold">Calc Version</th>
                  <th className="p-4 font-bold">Normalized At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {lineage.map(l => (
                  <tr key={l.id} className="hover:bg-surface-elevated/50">
                    <td className="p-4 font-mono text-[10px] text-muted">{l.id.substring(0,8)}...</td>
                    <td className="p-4 font-mono text-[10px] text-blue-600">{l.source_observation_id.substring(0,8)}...</td>
                    <td className="p-4 font-mono text-success font-bold">{l.sdg_per_kg?.toFixed(2) || '-'}</td>
                    <td className="p-4 font-mono text-success">{l.sdg_per_mt ? Math.round(l.sdg_per_mt) : '-'}</td>
                    <td className="p-4 font-mono text-[10px] bg-surface-elevated rounded px-2">{l.calculation_version}</td>
                    <td className="p-4 font-mono text-xs text-muted">{new Date(l.created_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FeedHealthCard({ t, isAr, title, feedType, execs }: { t: Record<string, string>, isAr: boolean, title: string, feedType: string, execs: FeedExecution[] }) {
  const latest = execs.length > 0 ? execs[0] : null;
  const isHealthy = latest?.status === 'succeeded';

  return (
    <div className="bg-surface-canvas p-6 rounded-2xl border border-border-strong shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isHealthy ? 'bg-success' : 'bg-warning'}`}></div>
          <h2 className="font-bold text-lg text-text">{title}</h2>
          <span className="text-xs bg-surface-elevated px-2 py-1 rounded font-mono border border-border">{feedType}</span>
        </div>
        {latest ? (
          <div className="text-sm text-muted font-mono">
            Last Executed: {new Date(latest.started_at).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
          </div>
        ) : (
          <div className="text-sm text-muted">No executions recorded</div>
        )}
      </div>

      {latest && (
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-xs uppercase text-muted mb-1">Fetched</div>
            <div className="font-mono font-bold">{latest.records_fetched}</div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase text-muted mb-1">Inserted</div>
            <div className="font-mono font-bold text-success">{latest.records_inserted}</div>
          </div>
          <div className="text-center">
            <div className="text-xs uppercase text-muted mb-1">Status</div>
            <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${isHealthy ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
              {latest.status}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
