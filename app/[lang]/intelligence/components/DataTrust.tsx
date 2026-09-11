import { Database, ShieldCheck, Activity } from 'lucide-react';

export function DataTrust({ t }: { t: Record<string, string>, isAr?: boolean }) {
  return (
    <div className="bg-surface-canvas border border-border-strong rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-text mb-6 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        {t.dataSources}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <Database className="w-4 h-4 text-muted" />
            WFP VAM
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {t.wfpDesc}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <Activity className="w-4 h-4 text-muted" />
            MET Norway
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {t.metDesc}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-text">
            <ShieldCheck className="w-4 h-4 text-primary" />
            ZARATI Engine
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {t.zaratiDesc}
          </p>
        </div>
      </div>
    </div>
  )
}
