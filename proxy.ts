import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from './lib/i18n/config'
import { verifyAdminToken } from './lib/admin/auth'
import { updateSession } from './lib/supabase/middleware'

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Static assets — never locale-redirect ──────────────────────────
  if (
    /\.(?:png|jpe?g|gif|webp|svg|ico|webmanifest|json|txt|xml|woff2?)$/i.test(pathname) ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/maps/')
  ) {
    return NextResponse.next()
  }

  // ── Admin auth guard ────────────────────────────────────────────────
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // Login page is always accessible
    if (pathname === '/admin/login') return NextResponse.next()

    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return new NextResponse('ADMIN_PASSWORD is not set.', { status: 500 })
    }

    const token = request.cookies.get('za_admin')?.value
    if (!token || !verifyAdminToken(token, adminPassword)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next()
  }

  // ── Supabase Auth & Route Protection ──────────────────────────────
  // We must await updateSession to ensure SSR cookies are refreshed properly.
  const { supabaseResponse, user, profile } = await updateSession(request)

  const localeMatch = locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
  const locale = localeMatch || getLocale(request)

  const pathWithoutLocale = localeMatch ? pathname.replace(new RegExp(`^/${locale}`), '') || '/' : pathname

  // Protected Dashboard Routes
  if (pathWithoutLocale === '/dashboard' || pathWithoutLocale.startsWith('/dashboard/')) {
    if (!user || !profile) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }

    if (profile.status !== 'active') {
      return NextResponse.redirect(new URL(`/${locale}/login?error=account_suspended`, request.url))
    }

    if ((pathWithoutLocale === '/dashboard/farmer' || pathWithoutLocale.startsWith('/dashboard/farmer/')) && profile.role !== 'farmer') {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
    
    if ((pathWithoutLocale === '/dashboard/trader' || pathWithoutLocale.startsWith('/dashboard/trader/')) && profile.role !== 'trader') {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  // ── Locale redirect for public routes ──────────────────────────────
  if (localeMatch) {
    return supabaseResponse
  }

  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!_next|api|icons|images|maps|favicon\\.ico|logo\\.png|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.svg|.*\\.webmanifest).*)',
  ],
}
