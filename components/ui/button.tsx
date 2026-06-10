'use client'

import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'navy'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary'   && 'bg-primary text-white hover:bg-primary-dark',
        variant === 'secondary' && 'bg-secondary text-primary hover:bg-secondary-dark hover:text-white',
        variant === 'navy'      && 'bg-navy text-white hover:bg-navy-dark',
        variant === 'ghost'     && 'text-text hover:bg-black/5',
        variant === 'outline'   && 'border border-primary text-primary hover:bg-primary/10',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3.5 text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
