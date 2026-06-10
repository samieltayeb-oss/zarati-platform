import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'danger' | 'outline'
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default'   && 'bg-border text-muted',
        variant === 'primary'   && 'bg-primary/10 text-primary',
        variant === 'secondary' && 'bg-secondary/15 text-primary',
        variant === 'danger'    && 'bg-danger/10 text-danger',
        variant === 'outline'   && 'border border-border text-muted',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
