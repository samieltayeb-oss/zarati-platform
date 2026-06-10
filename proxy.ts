import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './lib/i18n/config'

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => { headers[key] = value })
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, [...locales], defaultLocale)
  } catch {
    return defaultLocale
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  )
  if (hasLocale) return NextResponse.next()
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|icons|manifest\\.webmanifest|favicon\\.ico|.*\\.svg).*)'],
}
