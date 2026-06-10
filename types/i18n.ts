import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/getDictionary'

export type { Locale, Dictionary }

export interface PageProps {
  params: Promise<{ lang: Locale }>
  searchParams?: Promise<Record<string, string | string[]>>
}
