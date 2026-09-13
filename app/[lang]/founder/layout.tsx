import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import type { ReactNode } from 'react'

export default async function FounderLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const supabase = await createServerClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect(`/${lang}/login`)
    return null
  }
  
  if (user.email !== 'sam@nexorayyc.io') {
    notFound()
    return null
  }

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10 border-b border-slate-800 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif text-white tracking-tight">ZARATI FOUNDER COMMAND CENTER</h1>
              <p className="text-slate-500 text-xs tracking-[0.2em] uppercase mt-2">Commercial Strategy • Sales • Partnerships • Capital</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">Authorized: sam@nexorayyc.io</span>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
