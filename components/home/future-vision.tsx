import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { MODULES } from '@/config/modules'
import type { Locale } from '@/lib/i18n/config'

const MODULE_EMOJI: Record<string, string> = {
  marketplace: '🛒',
  weather: '🌤️',
  'ai-advisor': '🤖',
  financing: '💰',
  ngo: '🤝',
  government: '🏛️',
  satellite: '🛰️',
}

interface FutureVisionDict {
  title: string
  subtitle: string
}

interface Props {
  lang: Locale
  dict: FutureVisionDict
  comingSoonLabel: string
}

export function FutureVision({ lang, dict, comingSoonLabel }: Props) {
  const isAr = lang === 'ar'
  const modules = Object.values(MODULES).filter((m) => m.status !== 'disabled')

  return (
    <section className="py-16 sm:py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2">{dict.title}</h2>
          <p className="text-muted">{dict.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {modules.map((m) => {
            const isActive = m.status === 'active'
            const card = (
              <div
                className={`rounded-xl border p-4 text-center transition-all ${
                  isActive
                    ? 'border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer'
                    : 'border-border bg-surface opacity-70'
                }`}
              >
                <div className="text-2xl mb-2">{MODULE_EMOJI[m.id] ?? '📦'}</div>
                <div className="text-sm font-medium text-text mb-1">
                  {isAr ? m.labelAr : m.labelEn}
                </div>
                {!isActive && (
                  <Badge variant="outline" className="text-xs">{comingSoonLabel}</Badge>
                )}
              </div>
            )

            return isActive ? (
              <Link key={m.id} href={`/${lang}${m.path}`}>
                {card}
              </Link>
            ) : (
              <div key={m.id}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
