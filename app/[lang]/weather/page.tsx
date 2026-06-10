import { getDictionary } from '@/lib/i18n/getDictionary'
import { getAllCitiesWeather } from '@/lib/services/weather-service'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { Badge } from '@/components/ui/badge'
import type { Locale } from '@/lib/i18n/config'

const CONDITION_ICON: Record<string, string> = {
  sunny: '☀️',
  'partly-cloudy': '⛅',
  cloudy: '☁️',
  rainy: '🌧️',
  stormy: '⛈️',
  dusty: '🌪️',
}

const WEEKDAY: Record<string, { ar: string; en: string }> = {
  '0': { ar: 'الأحد',    en: 'Sun' },
  '1': { ar: 'الاثنين',  en: 'Mon' },
  '2': { ar: 'الثلاثاء', en: 'Tue' },
  '3': { ar: 'الأربعاء', en: 'Wed' },
  '4': { ar: 'الخميس',   en: 'Thu' },
  '5': { ar: 'الجمعة',   en: 'Fri' },
  '6': { ar: 'السبت',    en: 'Sat' },
}

type Props = { params: Promise<{ lang: string }> }

export default async function WeatherPage({ params }: Props) {
  const { lang } = await params
  const locale = lang as Locale
  const isAr = locale === 'ar'

  const [dict, allWeather] = await Promise.all([getDictionary(locale), getAllCitiesWeather()])
  const t = dict.weather

  function getDayLabel(dateStr: string) {
    const day = new Date(dateStr).getDay().toString()
    return isAr ? WEEKDAY[day].ar : WEEKDAY[day].en
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">{t.title}</h1>
        <p className="text-muted">{t.subtitle}</p>
      </div>

      <div className="space-y-6">
        {allWeather.map((w) => (
          <div key={w.city} className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* City header */}
            <div className="bg-primary/5 border-b border-border px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{CONDITION_ICON[w.condition] ?? '🌤️'}</span>
                <div>
                  <h2 className="text-xl font-bold text-text">
                    {isAr ? w.cityAr : w.city}
                  </h2>
                  <p className="text-sm text-muted">
                    {isAr ? t[w.condition as keyof typeof t] || w.condition : w.condition.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <div className="sm:ms-auto flex flex-wrap gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{w.temp}°C</div>
                  <div className="text-xs text-muted">{isAr ? t.temperature : 'Temp'}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text">{w.feelsLike}°</div>
                  <div className="text-xs text-muted">{t.feelsLike}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text">{w.humidity}%</div>
                  <div className="text-xs text-muted">{t.humidity}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text">{w.windSpeed}</div>
                  <div className="text-xs text-muted">{isAr ? `${t.wind} كم/س` : `${t.wind} km/h`}</div>
                </div>
              </div>
            </div>

            {/* 7-day forecast */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-muted mb-3">{t.forecast}</h3>
              <div className="grid grid-cols-7 gap-2">
                {w.forecast.map((day) => (
                  <div key={day.date} className="text-center">
                    <div className="text-xs text-muted mb-1">{getDayLabel(day.date)}</div>
                    <div className="text-lg mb-1">{CONDITION_ICON[day.condition] ?? '🌤️'}</div>
                    <div className="text-sm font-semibold text-text">{day.high}°</div>
                    <div className="text-xs text-muted">{day.low}°</div>
                    {day.precipitation > 0 && (
                      <div className="text-xs text-primary mt-0.5">{day.precipitation}%</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Badge variant="outline">{dict.common.demoData}</Badge>
      </div>
    </PageWrapper>
  )
}
