'use client'

import { useState } from 'react'
import { FOUNDER_METRICS, VALUATION_ESTIMATES, TOP_TARGETS, PIPELINE_STAGES } from '@/data/founder-data'

export default function FounderCommandCenter() {
  const [activeTab, setActiveTab] = useState('Overview')

  const tabs = [
    'Overview', 'Pipeline', 'Target Accounts', 'Top 20 Targets', 'MSG Campaign',
    'Gedaref Pilot', 'Government', 'Investors', 'Acquirers', 'Valuation',
    'Market Research', 'Competitors', 'TAM / SAM / SOM', '100 Days', 'Tasks',
    'Notes', 'Document Vault', 'Outreach Library'
  ]

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0">
        <nav className="flex flex-col gap-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-2 text-sm rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 bg-[#0f172a] border border-slate-800 rounded-xl p-6 shadow-xl">
        
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-2">Command Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs mb-1">ZARATI STATUS</div>
                <div className="text-emerald-400 font-medium">{FOUNDER_METRICS.status}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs mb-1">COMMERCIAL READINESS</div>
                <div className="text-blue-400 font-medium">{FOUNDER_METRICS.readiness} / 100</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs mb-1">PRIMARY COMMERCIAL LANE</div>
                <div className="text-white font-medium">{FOUNDER_METRICS.primaryLane}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs mb-1">BEST FIRST CUSTOMER</div>
                <div className="text-amber-400 font-medium">{FOUNDER_METRICS.bestCustomer}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs mb-1">BEST PILOT STATE</div>
                <div className="text-white font-medium">{FOUNDER_METRICS.pilotState}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs mb-1">FUNDRAISING ANCHOR</div>
                <div className="text-purple-400 font-medium">{FOUNDER_METRICS.fundraisingAnchor}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                <div className="text-slate-500 text-xs mb-1">RECOMMENDED STRATEGY</div>
                <div className="text-white font-medium">{FOUNDER_METRICS.strategy}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 border-l-4 border-l-emerald-500">
                <div className="text-slate-500 text-xs mb-1">TOP MILESTONE</div>
                <div className="text-emerald-400 font-bold">{FOUNDER_METRICS.milestone}</div>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-950/20 border border-blue-900/50 rounded-lg p-5">
              <h3 className="text-blue-400 font-medium mb-2">HOME DASHBOARD BRIEFING</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><strong className="text-white">TOP PRIORITY:</strong> Get first paid pilot</li>
                <li><strong className="text-white">ACTIVE TARGET:</strong> Mahgoub Sons Group</li>
                <li><strong className="text-white">NEXT ACTION:</strong> Send commercial validation outreach</li>
                <li><strong className="text-white">PIPELINE VALUE:</strong> $0 (Awaiting real Founder-entered opportunities)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'MSG Campaign' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-2">MSG Command Module</h2>
            
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-lg text-white mb-3">Account Intelligence</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Target:</span> <span className="text-slate-200">MSG Procurement / Commercial Leadership</span></div>
                <div><span className="text-slate-500">Commercial Objective:</span> <span className="text-slate-200">Secure a Commercial Validation Pilot</span></div>
                <div><span className="text-slate-500">Pilot Objective:</span> <span className="text-white font-bold">10 RFQs</span></div>
                <div><span className="text-slate-500">Target Commodity:</span> <span className="text-slate-200">Sesame or Sorghum</span></div>
                <div><span className="text-slate-500">Duration:</span> <span className="text-slate-200">30–60 days</span></div>
                <div><span className="text-slate-500">Validation Fee:</span> <span className="text-emerald-400 font-bold">$3,500</span></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
              <h3 className="text-lg text-white mb-3">Outreach Center</h3>
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded border border-slate-800">
                  <div className="flex justify-between mb-2">
                    <h4 className="text-blue-400 font-medium">Initial Email</h4>
                    <button className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300">Copy</button>
                  </div>
                  <pre className="text-xs text-slate-400 whitespace-pre-wrap font-sans">
{`Subject: Sourcing Gedaref sesame & sorghum (ZARATI digital channel)

Dear [Name],
I am reaching out regarding MSG’s position as the leading exporter of Sudanese cash crops.
We have built ZARATI—a digital agricultural intelligence and sourcing platform...
We are looking for a forward-thinking partner to run a tightly controlled Commercial Validation Pilot: executing 10 RFQs through our marketplace over 30 to 60 days.
Do you have 10 minutes on Tuesday to discuss?`}
                  </pre>
                  <div className="mt-3 flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 cursor-pointer hover:text-white">NOT SENT</span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 cursor-pointer hover:text-white">SENT</span>
                    <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 cursor-pointer hover:text-white">REPLIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Top 20 Targets' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-2">Top 20 Targets</h2>
            <div className="grid gap-4">
              {TOP_TARGETS.map((t, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg text-white font-medium">{t.org}</h3>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{t.status}</span>
                  </div>
                  <div className="text-sm text-slate-400 mb-4">{t.fit}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    <div><span className="text-slate-500">Role:</span> <span className="text-slate-300">{t.role}</span></div>
                    <div><span className="text-slate-500">Decision Maker:</span> <span className="text-slate-300">{t.decisionMaker}</span></div>
                    <div><span className="text-slate-500">Contact:</span> <span className="text-blue-400">{t.contact}</span></div>
                    <div><span className="text-slate-500">Commercial Potential:</span> <span className="text-emerald-400">{t.potential}</span></div>
                    <div className="col-span-1 md:col-span-2 mt-2"><span className="text-slate-500">Pitch Angle:</span> <span className="text-slate-200 italic">&quot;{t.pitch}&quot;</span></div>
                    <div className="col-span-1 md:col-span-2"><span className="text-slate-500">First Meeting Obj:</span> <span className="text-amber-400 font-medium">{t.objective}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Valuation' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-2">Valuation Center</h2>
            <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-3 mb-6">
              <span className="text-amber-500 text-sm font-bold">STRATEGIC ESTIMATES • NOT FORMAL APPRAISAL</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">FUNDRAISING ANCHOR</div>
                <div className="text-3xl text-purple-400 font-bold">{VALUATION_ESTIMATES.fundraisingAnchor}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">TARGET CLOSE</div>
                <div className="text-3xl text-emerald-400 font-bold">{VALUATION_ESTIMATES.targetClose}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">OUTRIGHT SALE ASK</div>
                <div className="text-xl text-white font-medium">{VALUATION_ESTIMATES.outrightAsk}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">WALK-AWAY FLOOR</div>
                <div className="text-xl text-red-400 font-medium">{VALUATION_ESTIMATES.floor}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                <div className="text-slate-500 text-xs mb-1">ENTERPRISE REPLACEMENT COST</div>
                <div className="text-xl text-slate-300 font-medium">{VALUATION_ESTIMATES.enterpriseReplacement}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Pipeline' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-2">Commercial Pipeline</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {PIPELINE_STAGES.map(stage => (
                <div key={stage} className="w-64 shrink-0 bg-slate-900 border border-slate-800 rounded-lg p-3 min-h-[300px]">
                  <h4 className="text-xs font-bold text-slate-500 mb-3">{stage}</h4>
                  {stage === 'RESEARCHED' && (
                    <div className="bg-slate-800 p-3 rounded shadow-sm border border-slate-700 text-sm mb-2">
                      <div className="text-white font-medium">DAL Agriculture</div>
                      <div className="text-slate-400 text-xs mt-1">Enterprise Feed Procurement</div>
                    </div>
                  )}
                  {stage === 'CONTACT READY' && (
                    <div className="bg-slate-800 p-3 rounded shadow-sm border border-slate-700 text-sm mb-2 border-l-2 border-l-amber-500">
                      <div className="text-white font-medium">Mahgoub Sons Group</div>
                      <div className="text-slate-400 text-xs mt-1">10-RFQ Validation Pilot</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Fallback for unbuilt tabs */}
        {!['Overview', 'MSG Campaign', 'Top 20 Targets', 'Valuation', 'Pipeline'].includes(activeTab) && (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-lg">
            <div className="text-slate-500 text-center">
              <p className="text-lg mb-2">{activeTab} Module</p>
              <p className="text-sm">Available in Founder Command Center</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
