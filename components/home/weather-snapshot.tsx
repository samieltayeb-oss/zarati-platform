import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { WeatherData } from '@/types'
import type { Locale } from '@/lib/i18n/config'

const CONDITION_ICON: Record<string, string> = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  dusty: '🌪️',
}

interface WeatherSnapshotDict {
  title: string
  subtitle: string
  viewForecast: string
  [key: string]: string
}

interface Props {
  lang: Locale
  weather: WeatherData[]
  dict: WeatherSnapshotDict
}

export function WeatherSnapshot({ lang, weather, dict }: Props) {
  const isAr = lang === 'ar'

  return (
    <section className="py-16 sm:py-20 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-1">{dict.title}</h2>
            <p className="text-muted text-sm">{dict.subtitle}</p>
          </div>
          <Link href={`/${lang}/weather`}>
            <Button variant="outline" size="sm">{dict.viewForecast}</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {weather.map((w) => (
            <div
              key={w.city}
              className="bg-bg rounded-xl border border-border p-4 text-center hover:border-primary/30 transition-colors"
            >
              <div className="text-3xl mb-2">{CONDITION_ICON[w.condition] ?? '🌤️'}</div>
              <div className="font-semibold text-text text-sm mb-1">
                {isAr ? w.cityAr : w.city}
              </div>
              <div className="text-2xl font-bold text-primary">{w.temp}°</div>
              <div className="text-xs text-muted mt-1">
                {isAr ? dict[w.condition] || w.condition : w.condition.replace('-', ' ')}
              </div>
              <div className="text-xs text-muted mt-1">
                {isAr ? `رطوبة ${w.humidity}٪` : `${w.humidity}% humidity`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
