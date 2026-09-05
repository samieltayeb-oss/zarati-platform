'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerAction } from '@/lib/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function RegisterForm() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'farmer' | 'trader' | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await registerAction(formData)
    
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
      
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Role</label>
            <div className="flex gap-4">
              <Button type="button" variant={role === 'farmer' ? 'primary' : 'outline'} onClick={() => setRole('farmer')} className="flex-1">Farmer</Button>
              <Button type="button" variant={role === 'trader' ? 'primary' : 'outline'} onClick={() => setRole('trader')} className="flex-1">Trader</Button>
            </div>
            <input type="hidden" name="role" value={role} required />
          </div>
          {role && (
            <Button type="button" onClick={() => setStep(2)} className="w-full">Next</Button>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input type="text" name="fullName" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" name="email" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone (Optional)</label>
            <Input type="tel" name="phone" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" name="password" required />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button type="button" onClick={() => setStep(3)} className="flex-1">Next</Button>
          </div>
        </div>
      )}

      {step === 3 && role === 'farmer' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">State/Locality (Optional)</label>
            <Input type="text" name="stateId" placeholder="State ID" />
          </div>
          <p className="text-sm text-muted">You can add your farm details later.</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? '...' : 'Complete Registration'}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && role === 'trader' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <Input type="text" name="businessName" required />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? '...' : 'Complete Registration'}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
