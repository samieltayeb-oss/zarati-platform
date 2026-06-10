'use client'

import { cn } from '@/lib/utils'
import type { SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer',
        className
      )}
      {...props}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  )
}
