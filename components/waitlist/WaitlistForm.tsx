'use client'

import { useTransition, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { submitWaitlist, type WaitlistUserType } from '@/lib/actions/waitlist'
import type { Locale } from '@/lib/i18n/config'
import Link from 'next/link'

interface RegisterDict {
  heading: string
  subheading: string
  name: string
  namePlaceholder: string
  email: string
  emailPlaceholder: string
  role: string
  rolePrompt: string
  roles: Record<string, string>
  submit: string
  submitting: string
  successHeading: string
  successMessage: string
  successBack: string
  alreadyHave: string
  loginLink: string
  required: string
  invalidEmail: string
}

interface WaitlistFormProps {
  dict: RegisterDict
  lang: Locale
}

type FieldError = { field?: 'name' | 'email' | 'userType'; message: string } | null

export function WaitlistForm({ dict, lang }: WaitlistFormProps) {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [fieldError, setFieldError] = useState<FieldError>(null)

  const roleOptions: { value: WaitlistUserType; label: string }[] = [
    { value: 'farmer',     label: dict.roles.farmer },
    { value: 'trader',     label: dict.roles.trader },
    { value: 'ngo',        label: dict.roles.ngo },
    { value: 'government', label: dict.roles.government },
    { value: 'investor',   label: dict.roles.investor },
  ]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldError(null)

    const fd = new FormData(e.currentTarget)
    const name     = (fd.get('name')     as string) ?? ''
    const email    = (fd.get('email')    as string) ?? ''
    const userType = (fd.get('userType') as WaitlistUserType) ?? ''

    startTransition(async () => {
      const result = await submitWaitlist({ name, email, userType, locale: lang })
      if (result.ok) {
        setSuccess(true)
      } else {
        setFieldError({ field: result.field, message: result.message })
      }
    })
  }

  if (success) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-text">{dict.successHeading}</h2>
        <p className="text-muted leading-relaxed max-w-sm mx-auto">{dict.successMessage}</p>
        <Link href={`/${lang}`}>
          <Button variant="primary" className="mt-2">{dict.successBack}</Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-text">
          {dict.name}
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder={dict.namePlaceholder}
          autoComplete="name"
          disabled={isPending}
          className={fieldError?.field === 'name' ? 'border-red-400 focus:ring-red-400/30' : ''}
        />
        {fieldError?.field === 'name' && (
          <p className="text-xs text-red-500">{fieldError.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-text">
          {dict.email}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={dict.emailPlaceholder}
          autoComplete="email"
          inputMode="email"
          dir="ltr"
          disabled={isPending}
          className={fieldError?.field === 'email' ? 'border-red-400 focus:ring-red-400/30' : ''}
        />
        {fieldError?.field === 'email' && (
          <p className="text-xs text-red-500">{fieldError.message}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <label htmlFor="userType" className="block text-sm font-medium text-text">
          {dict.role}
        </label>
        <select
          id="userType"
          name="userType"
          defaultValue=""
          disabled={isPending}
          className={[
            'h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer',
            fieldError?.field === 'userType' ? 'border-red-400 focus:ring-red-400/30' : '',
          ].join(' ')}
        >
          <option value="" disabled>{dict.rolePrompt}</option>
          {roleOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {fieldError?.field === 'userType' && (
          <p className="text-xs text-red-500">{fieldError.message}</p>
        )}
      </div>

      {/* Generic error */}
      {fieldError && !fieldError.field && (
        <p className="text-sm text-red-500 text-center">{fieldError.message}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full h-11 text-base font-semibold"
        disabled={isPending}
      >
        {isPending ? dict.submitting : dict.submit}
      </Button>

      <p className="text-center text-sm text-muted">
        {dict.alreadyHave}{' '}
        <Link href={`/${lang}/login`} className="text-primary hover:underline font-medium">
          {dict.loginLink}
        </Link>
      </p>
    </form>
  )
}
