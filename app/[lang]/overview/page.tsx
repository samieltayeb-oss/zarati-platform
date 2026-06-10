import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/getDictionary'
import { getTopCrops } from '@/lib/services/crop-service'
import { getListings } from '@/lib/services/marketplace-service'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'

type Props = { params: Promise<{ lang: string }> }

export default async function DashboardPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const isAr = locale === 'ar'
  const numLocale = isAr ? 'ar-SD' : 'en-US'

  const [dict, crops, listings] = await Promise.all([
    getDictionary(locale),
    getTopCrops(5),
    getListings(),
  ])
  const t = dict.dashboard

  const stats = [
    { label: t.myListings,    value: listings.length,  icon: '📋', color: 'text-primary' },
    { label: t.activeCrops,   value: crops.length,     icon: '🌾', color: 'text-success' },
    { label: t.priceAlerts,   value: 3,                icon: '🔔', color: 'text-warning' },
    { label: t.messages,      value: 2,                icon: '💬', color: 'text-primary' },
  ]

  const quickActions = [
    { label: t.addListing,   href: `/${locale}/marketplace`, icon: '➕' },
    { label: t.setPriceAlert, href: `/${locale}/crops`,      icon: '🔔' },
    { label: t.viewMarket,   href: `/${locale}/marketplace`, icon: '🛒' },
  ]

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-8">
        <p className="text-muted text-sm mb-1">{t.welcome}</p>
        <h1 className="text-3xl font-bold text-text">{t.title}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-surface rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{icon}</span>
              <span className={`text-2xl font-bold ${color}`}>{value}</span>
            </div>
            <p className="text-sm font-medium text-text">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-surface rounded-xl border border-border p-5 mb-8">
        <h2 className="text-lg font-semibold text-text mb-4">
          {isAr ? 'إجراءات سريعة' : 'Quick Actions'}
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, href, icon }) => (
            <Link key={label} href={href}>
              <Button variant="outline" size="sm">
                <span className="me-2">{icon}</span>{label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent price movements */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm mb-8">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text">{t.recentPrices}</h2>
          <Link href={`/${locale}/crops`}>
            <Button variant="ghost" size="sm">{dict.common.viewAll}</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {crops.map((crop, i) => {
                const up = crop.currentPrice.changePercent >= 0
                return (
                  <tr
                    key={crop.id}
                    className={`hover:bg-bg/40 transition-colors ${i < crops.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <td className="px-5 py-3.5 font-medium text-text">
                      {isAr ? crop.nameAr : crop.name}
                    </td>
                    <td className="px-5 py-3.5 text-end font-mono tabular-nums">
                      {formatCurrency(crop.currentPrice.price, numLocale)}
                    </td>
                    <td className="px-5 py-3.5 text-end">
                      <span className={`font-medium ${up ? 'text-success' : 'text-danger'}`}>
                        {formatPercent(crop.currentPrice.changePercent, numLocale)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-end text-muted hidden sm:table-cell">
                      {isAr ? crop.currentPrice.marketAr : crop.currentPrice.market}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* My listings */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-text">{t.myListings}</h2>
          <Badge variant="outline">{dict.common.demoData}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {listings.slice(0, 4).map((listing, i) => (
                <tr
                  key={listing.id}
                  className={`hover:bg-bg/40 transition-colors ${i < 3 ? 'border-b border-border' : ''}`}
                >
                  <td className="px-5 py-3.5 font-medium text-text">
                    {isAr ? listing.titleAr : listing.title}
                  </td>
                  <td className="px-5 py-3.5 text-muted hidden sm:table-cell">
                    {isAr ? listing.locationAr : listing.location}
                  </td>
                  <td className="px-5 py-3.5 text-end font-semibold text-primary">
                    {formatCurrency(listing.price, numLocale)}
                  </td>
                  <td className="px-5 py-3.5 text-end">
                    <Badge variant="primary">
                      {isAr ? 'نشط' : 'Active'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  )
}
