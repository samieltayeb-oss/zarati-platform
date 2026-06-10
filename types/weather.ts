export type WeatherCondition =
  | 'sunny'
  | 'cloudy'
  | 'partly-cloudy'
  | 'rainy'
  | 'stormy'
  | 'dusty'

export interface DayForecast {
  date: string
  high: number
  low: number
  condition: WeatherCondition
  precipitation: number
}

export interface WeatherData {
  city: string
  cityAr: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  condition: WeatherCondition
  forecast: DayForecast[]
  fetchedAt: string
}
