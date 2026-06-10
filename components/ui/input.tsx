'use client'

import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text',
        'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30',
        className
      )}
      {...props}
    />
  )
}
