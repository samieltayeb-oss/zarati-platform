import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Crop } from '@/types'
import type { Locale } from '@/lib/i18n/config'

interface CropSnapshotDict {
  title: string
  subtitle: string
  crop: string
  price: string
  change: string
  market: string
}

interface Props {
  lang: Locale
  crops: Crop[]
  dict: CropSnapshotDict
  viewAllLabel: string
}

export function CropSnapshot({ lang, crops, dict, viewAllLabel }: Props) {
  const isAr = lang === 'ar'
  const numLocale = isAr ? 'ar-SD' : 'en-US'

  return (
    <section className="py-16 sm:py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-1">{dict.title}</h2>
            <p className="text-muted text-sm">{dict.subtitle}</p>
          </div>
          <Link href={`/${lang}/crops`}>
            <Button variant="outline" size="sm">{viewAllLabel}</Button>
          </Link>
        </div>

        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg/50">
                  <th className="px-4 py-3 text-start text-muted font-medium">{dict.crop}</th>
                  <th className="px-4 py-3 text-end text-muted font-medium">{dict.price}</th>
                  <th className="px-4 py-3 text-end text-muted font-medium">{dict.change}</th>
                  <th className="px-4 py-3 text-end text-muted font-medium hidden sm:table-cell">{dict.market}</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop, i) => {
                  const up = crop.currentPrice.changePercent >= 0
                  return (
                    <tr key={crop.id} className={i < crops.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-4 py-3.5 font-medium text-text">
                        {isAr ? crop.nameAr : crop.name}
                      </td>
                      <td className="px-4 py-3.5 text-end font-mono tabular-nums">
                        {formatCurrency(crop.currentPrice.price, numLocale)}
                      </td>
                      <td className="px-4 py-3.5 text-end">
                        <Badge variant={up ? 'primary' : 'danger'}>
                          {formatPercent(crop.currentPrice.changePercent, numLocale)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-end text-muted hidden sm:table-cell">
                        {isAr ? crop.currentPrice.marketAr : crop.currentPrice.market}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
