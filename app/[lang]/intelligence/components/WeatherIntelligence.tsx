import { WeatherObservation } from '@/lib/services/intelligence';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

export function WeatherIntelligence({ t, weather, isAr }: { t: Record<string, string>, weather: WeatherObservation | null, isAr: boolean }) {
  return (
    <div className="bg-surface-canvas border border-border-strong rounded-2xl p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-bold text-text mb-4">{t.weather}</h2>
      
      {!weather ? (
        <div className="bg-surface-elevated border border-border-subtle rounded-xl p-6 text-center space-y-4">
          <Cloud className="w-12 h-12 text-muted mx-auto opacity-50" />
          <div>
            <h3 className="font-semibold text-text">{t.weatherDataUnavailable}</h3>
            <p className="text-sm text-muted mt-2">{t.weatherDataUnavailableDesc}</p>
          </div>
          <div className="text-xs text-muted/60 mt-4 border-t border-border-subtle pt-4">
            {t.pilotLoc}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted">{t.pilotLoc}</div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-5xl font-light text-text font-mono">
              {weather.temperature_celsius.toFixed(1)}°
            </div>
            <div className="space-y-1">
              <div className="text-sm font-semibold text-text uppercase tracking-wider">{t.forecast}</div>
              <div className="text-xs text-muted">
                {t.updated}: {new Date(weather.provider_observation_time).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-elevated rounded-xl p-4 flex items-center gap-3 border border-border-subtle">
              <Thermometer className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted mb-1">{t.temp}</div>
                <div className="font-semibold text-text font-mono">{weather.temperature_celsius}°C</div>
              </div>
            </div>
            <div className="bg-surface-elevated rounded-xl p-4 flex items-center gap-3 border border-border-subtle">
              <Droplets className="w-5 h-5 text-info" />
              <div>
                <div className="text-xs text-muted mb-1">{t.precip}</div>
                <div className="font-semibold text-text font-mono">{weather.precipitation_mm} mm</div>
              </div>
            </div>
            <div className="bg-surface-elevated rounded-xl p-4 flex items-center gap-3 border border-border-subtle">
              <Cloud className="w-5 h-5 text-muted" />
              <div>
                <div className="text-xs text-muted mb-1">{t.humidity}</div>
                <div className="font-semibold text-text font-mono">{weather.relative_humidity_percent}%</div>
              </div>
            </div>
            <div className="bg-surface-elevated rounded-xl p-4 flex items-center gap-3 border border-border-subtle">
              <Wind className="w-5 h-5 text-muted" />
              <div>
                <div className="text-xs text-muted mb-1">{t.wind}</div>
                <div className="font-semibold text-text font-mono">{weather.wind_speed_kmh} km/h</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border-subtle text-xs text-muted text-center">
            {t.metDesc}
          </div>
        </div>
      )}
    </div>
  )
}
