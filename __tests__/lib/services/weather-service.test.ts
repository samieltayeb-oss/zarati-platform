import { describe, it, expect } from 'vitest'
import { getAllCitiesWeather, getWeatherByCity } from '@/lib/services/weather-service'

describe('getAllCitiesWeather', () => {
  it('returns all 5 cities', async () => {
    const data = await getAllCitiesWeather()
    expect(data).toHaveLength(5)
  })

  it('each city has required fields', async () => {
    const [city] = await getAllCitiesWeather()
    expect(city).toHaveProperty('city')
    expect(city).toHaveProperty('cityAr')
    expect(city).toHaveProperty('temp')
    expect(city).toHaveProperty('humidity')
    expect(city).toHaveProperty('condition')
    expect(city).toHaveProperty('forecast')
  })

  it('each city has a 7-day forecast', async () => {
    const cities = await getAllCitiesWeather()
    cities.forEach((c) => expect(c.forecast).toHaveLength(7))
  })

  it('includes Khartoum as first city', async () => {
    const [first] = await getAllCitiesWeather()
    expect(first.city).toBe('Khartoum')
    expect(first.cityAr).toBe('الخرطوم')
  })
})

describe('getWeatherByCity', () => {
  it('finds city by English name', async () => {
    const data = await getWeatherByCity('Gedaref')
    expect(data).not.toBeNull()
    expect(data?.cityAr).toBe('القضارف')
  })

  it('finds city by Arabic name', async () => {
    const data = await getWeatherByCity('كسلا')
    expect(data).not.toBeNull()
    expect(data?.city).toBe('Kassala')
  })

  it('is case-insensitive for English names', async () => {
    const data = await getWeatherByCity('gedaref')
    expect(data).not.toBeNull()
  })

  it('returns null for unknown city', async () => {
    expect(await getWeatherByCity('UnknownCity')).toBeNull()
  })
})
