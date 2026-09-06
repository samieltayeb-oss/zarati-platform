import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SignOutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  redirect(`/${lang}/login`)
}
