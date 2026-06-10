'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { WaitlistRecord } from '@/lib/supabase/admin'

type Lang = 'en' | 'ar'
type RoleKey = 'farmer' | 'trader' | 'ngo' | 'government' | 'investor'

interface Dict {
  title: string
  totalSignups: string
  farmers: string
  traders: string
  ngos: string
  government: string
  investors: string
  searchPlaceholder: string
  allRoles: string
  exportCsv: string
  showing: (n: number, total: number) => string
  columns: { name: string; email: string; role: string; language: string; joinedAt: string }
  noResults: string
  roles: Record<RoleKey, string>
  langToggle: string
}

const DICT: Record<Lang, Dict> = {
  en: {
    title: 'Waitlist Admin',
    totalSignups: 'Total Signups',
    farmers: 'Farmers',
    traders: 'Traders',
    ngos: 'NGOs',
    government: 'Government',
    investors: 'Investors',
    searchPlaceholder: 'Search by name or email…',
    allRoles: 'All Roles',
    exportCsv: 'Export CSV',
    showing: (n, total) => `Showing ${n} of ${total}`,
    columns: { name: 'Name', email: 'Email', role: 'Role', language: 'Lang', joinedAt: 'Joined' },
    noResults: 'No matching records',
    roles: { farmer: 'Farmer', trader: 'Trader', ngo: 'NGO', government: 'Government', investor: 'Investor' },
    langToggle: 'العربية',
  },
  ar: {
    title: 'لوحة قائمة الانتظار',
    totalSignups: 'إجمالي التسجيلات',
    farmers: 'المزارعون',
    traders: 'التجار',
    ngos: 'المنظمات',
    government: 'الحكومة',
    investors: 'المستثمرون',
    searchPlaceholder: 'بحث بالاسم أو البريد…',
    allRoles: 'جميع الأدوار',
    exportCsv: 'تصدير CSV',
    showing: (n, total) => `عرض ${n} من ${total}`,
    columns: { name: 'الاسم', email: 'البريد', role: 'الدور', language: 'اللغة', joinedAt: 'تاريخ الانضمام' },
    noResults: 'لا توجد نتائج',
    roles: { farmer: 'مزارع', trader: 'تاجر', ngo: 'منظمة', government: 'جهة حكومية', investor: 'مستثمر' },
    langToggle: 'English',
  },
}

const ROLE_STYLES: Record<string, string> = {
  farmer:     'bg-primary/10 text-primary',
  trader:     'bg-teal/10 text-teal',
  ngo:        'bg-blue/10 text-blue',
  government: 'bg-navy/10 text-navy',
  investor:   'bg-gold/10 text-gold',
}

function exportCSV(entries: WaitlistRecord[]) {
  const headers = ['Name', 'Email', 'Role', 'Language', 'Joined At']
  const rows = entries.map(e => [
    `"${e.name.replace(/"/g, '""')}"`,
    `"${e.email}"`,
    `"${e.role}"`,
    `"${e.language}"`,
    `"${new Date(e.created_at).toISOString()}"`,
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `zarati-waitlist-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatJoinDate(iso: string, lang: Lang): string {
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 10)
  }
}

interface AdminDashboardProps {
  entries: WaitlistRecord[]
  error: string | null
}

export function AdminDashboard({ entries, error }: AdminDashboardProps) {
  const [lang, setLang] = useState<Lang>('en')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const t = DICT[lang]
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const stats = useMemo(() => ({
    total:      entries.length,
    farmer:     entries.filter(e => e.role === 'farmer').length,
    trader:     entries.filter(e => e.role === 'trader').length,
    ngo:        entries.filter(e => e.role === 'ngo').length,
    government: entries.filter(e => e.role === 'government').length,
    investor:   entries.filter(e => e.role === 'investor').length,
  }), [entries])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return entries.filter(e => {
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
      const matchRole = !roleFilter || e.role === roleFilter
      return matchSearch && matchRole
    })
  }, [entries, search, roleFilter])

  const statsCards = [
    { label: t.totalSignups, value: stats.total,      highlight: true },
    { label: t.farmers,      value: stats.farmer,     highlight: false },
    { label: t.traders,      value: stats.trader,     highlight: false },
    { label: t.ngos,         value: stats.ngo,        highlight: false },
    { label: t.government,   value: stats.government, highlight: false },
    { label: t.investors,    value: stats.investor,   highlight: false },
  ]

  const roleOptions = [
    { value: '',           label: t.allRoles },
    { value: 'farmer',     label: t.roles.farmer },
    { value: 'trader',     label: t.roles.trader },
    { value: 'ngo',        label: t.roles.ngo },
    { value: 'government', label: t.roles.government },
    { value: 'investor',   label: t.roles.investor },
  ]

  return (
    <div dir={dir} className={cn('min-h-screen bg-bg', lang === 'ar' ? 'font-arabic' : 'font-latin')}>
      {/* Admin header */}
      <header className="bg-primary text-white px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-base tracking-tight">Zarati</span>
            <span className="text-white/30 select-none">|</span>
            <span className="text-sm text-white/75">{t.title}</span>
          </div>
          <button
            onClick={() => setLang(l => (l === 'en' ? 'ar' : 'en'))}
            className="text-xs border border-white/30 rounded px-2.5 py-1 hover:bg-white/10"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Error banner */}
        {error && (
          <Card className="p-4 border-danger/30 bg-danger/5">
            <p className="text-sm text-danger font-medium">{error}</p>
          </Card>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statsCards.map(({ label, value, highlight }) => (
            <Card
              key={label}
              className={cn('p-4 text-center', highlight && 'border-primary/30 bg-primary/5')}
            >
              <div className={cn('text-3xl font-bold tabular-nums', highlight ? 'text-primary' : 'text-text')}>
                {value}
              </div>
              <div className="text-xs text-muted mt-1 leading-tight">{label}</div>
            </Card>
          ))}
        </div>

        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className={cn(
                'h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text',
                'focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer sm:w-44'
              )}
            >
              {roleOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <Button
              variant="outline"
              onClick={() => exportCSV(filtered)}
              className="whitespace-nowrap"
            >
              ↓ {t.exportCsv}
            </Button>
          </div>
          <p className="text-xs text-muted mt-3">{t.showing(filtered.length, entries.length)}</p>
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-bg">
                  <th className="px-4 py-3 text-start font-medium text-muted">{t.columns.name}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted">{t.columns.email}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted">{t.columns.role}</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-start font-medium text-muted">{t.columns.language}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted whitespace-nowrap">{t.columns.joinedAt}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted">
                      {t.noResults}
                    </td>
                  </tr>
                ) : (
                  filtered.map(entry => (
                    <tr
                      key={entry.id}
                      className="border-b border-border last:border-0 hover:bg-bg"
                    >
                      <td className="px-4 py-3 font-medium text-text">{entry.name}</td>
                      {/* Email is always LTR regardless of page direction */}
                      <td className="px-4 py-3 text-muted" dir="ltr">{entry.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            ROLE_STYLES[entry.role] ?? 'bg-border text-muted'
                          )}
                        >
                          {t.roles[entry.role] ?? entry.role}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-muted uppercase text-xs">
                        {entry.language}
                      </td>
                      <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">
                        {formatJoinDate(entry.created_at, lang)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
