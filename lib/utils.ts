import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, locale = 'ar-SD', currency = 'SDG') {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)}`
  }
}

export function formatNumber(num: number, locale = 'ar-SD') {
  return new Intl.NumberFormat(locale).format(num)
}

export function formatDate(date: Date | string, locale = 'ar-SD') {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(date))
}

export function formatPercent(value: number, locale = 'ar-SD') {
  const sign = value > 0 ? '+' : ''
  return `${sign}${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}%`
}
