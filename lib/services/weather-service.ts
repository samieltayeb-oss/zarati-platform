import type { WeatherData } from '@/types'
import { weatherData } from '@/lib/mock-data'

export async function getAllCitiesWeather(): Promise<WeatherData[]> {
  return weatherData
}

export async function getWeatherByCity(city: string): Promise<WeatherData | null> {
  const normalized = city.toLowerCase()
  return (
    weatherData.find(
      (w) => w.city.toLowerCase() === normalized || w.cityAr === city
    ) ?? null
  )
}
