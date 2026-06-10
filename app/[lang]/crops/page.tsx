import { getDictionary } from '@/lib/i18n/getDictionary'
import { getCrops } from '@/lib/services/crop-service'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatPercent } from '@/lib/utils'
import type { Locale } from '@/lib/i18n/config'

type Props = { params: Promise<{ lang: string }> }

export default async function CropsPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const isAr = locale === 'ar'
  const numLocale = isAr ? 'ar-SD' : 'en-US'

  const [dict, crops] = await Promise.all([getDictionary(locale), getCrops()])
  const t = dict.home.cropSnapshot
  const { common } = dict

  const CATEGORY_LABEL: Record<string, { ar: string; en: string }> = {
    grain:    { ar: 'حبوب',    en: 'Grain' },
    oilseed:  { ar: 'زيتية',   en: 'Oilseed' },
    cash:     { ar: 'نقدية',   en: 'Cash Crop' },
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-text">{t.title}</h1>
          <Badge variant="outline">{common.demoData}</Badge>
        </div>
        <p className="text-muted">{t.subtitle}</p>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="px-4 py-3 text-start text-muted font-medium">{t.crop}</th>
                <th className="px-4 py-3 text-start text-muted font-medium hidden sm:table-cell">
                  {isAr ? 'الفئة' : 'Category'}
                </th>
                <th className="px-4 py-3 text-end text-muted font-medium">{t.price}</th>
                <th className="px-4 py-3 text-end text-muted font-medium">{t.change}</th>
                <th className="px-4 py-3 text-end text-muted font-medium hidden md:table-cell">{t.market}</th>
                <th className="px-4 py-3 text-end text-muted font-medium hidden lg:table-cell">
                  {isAr ? 'آخر تحديث' : common.lastUpdated}
                </th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop, i) => {
                const up = crop.currentPrice.changePercent >= 0
                const cat = CATEGORY_LABEL[crop.category]
                const updatedAt = new Date(crop.currentPrice.fetchedAt).toLocaleTimeString(
                  isAr ? 'ar-SD' : 'en-US',
                  { hour: '2-digit', minute: '2-digit' }
                )
                return (
                  <tr
                    key={crop.id}
                    className={`hover:bg-bg/40 transition-colors ${i < crops.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <td className="px-4 py-4 font-semibold text-text">
                      {isAr ? crop.nameAr : crop.name}
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <Badge variant="default">
                        {isAr ? cat?.ar : cat?.en}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-end font-mono tabular-nums font-semibold text-text">
                      {formatCurrency(crop.currentPrice.price, numLocale)}
                    </td>
                    <td className="px-4 py-4 text-end">
                      <span className={`font-medium ${up ? 'text-success' : 'text-danger'}`}>
                        {formatPercent(crop.currentPrice.changePercent, numLocale)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-end text-muted hidden md:table-cell">
                      {isAr ? crop.currentPrice.marketAr : crop.currentPrice.market}
                    </td>
                    <td className="px-4 py-4 text-end text-muted text-xs hidden lg:table-cell">
                      {updatedAt}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted text-center mt-4">{common.demoData} — {isAr ? 'أسعار تجريبية لأغراض العرض فقط' : 'Prices are demo data for display purposes only'}</p>
    </PageWrapper>
  )
}
