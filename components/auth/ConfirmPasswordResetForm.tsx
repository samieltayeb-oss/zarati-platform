'use client'

import { useState } from 'react'
import { confirmPasswordResetAction } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export function ConfirmPasswordResetForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = await confirmPasswordResetAction(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setSuccess(true)
    }

    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="text-center space-y-6 py-4">
        <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
          <span className="text-green-500 text-2xl">✓</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Password Updated</h3>
          <p className="text-muted text-sm">
            Your password has been successfully reset.
          </p>
        </div>
        <Button className="w-full">
          <Link href="/login" className="w-full h-full flex items-center justify-center">Continue to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          New Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          disabled={isLoading}
          dir="ltr"
        />
        <p className="text-xs text-muted">Must be at least 8 characters long.</p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  )
}
