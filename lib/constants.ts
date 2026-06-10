import { locales } from './i18n/config'

export { locales }

export const ROUTES = {
  home: '/',
  marketplace: '/marketplace',
  weather: '/weather',
  dashboard: '/overview',
  about: '/about',
  login: '/login',
  register: '/register',
} as const

export const SUDAN_STATES = [
  'khartoum', 'kassala', 'gedaref', 'sennar', 'blue-nile',
  'white-nile', 'north-kordofan', 'south-kordofan', 'northern',
  'river-nile', 'red-sea', 'gezira',
] as const

export const USE_MOCK = true
