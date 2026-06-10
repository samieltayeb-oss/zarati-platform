'use client'

import { useState, useTransition } from 'react'
import { adminLogin } from '@/lib/admin/actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AdminLoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const password = (new FormData(e.currentTarget).get('password') as string) ?? ''

    startTransition(async () => {
      const result = await adminLogin(password)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-text">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter admin password"
          autoComplete="current-password"
          autoFocus
          disabled={isPending}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        className="w-full h-10"
        disabled={isPending}
      >
        {isPending ? 'Verifying…' : 'Sign In'}
      </Button>
    </form>
  )
}
