'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/lib/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LoginForm({ dict }: { dict: any }) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await loginAction(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{dict.email || 'Email'}</label>
        <Input type="email" name="email" required placeholder="email@example.com" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">{dict.password || 'Password'}</label>
        <Input type="password" name="password" required />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '...' : (dict.submit || 'Sign In')}
      </Button>
    </form>
  )
}
