import { createServerClient } from '@/lib/supabase/server'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { MarketplaceClient } from '@/components/marketplace/marketplace-client'

export default async function MarketplacePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = lang as string

  const supabase = await createServerClient()

  // Query public_listings_view — never raw listings table
  const { data: listings } = await supabase
    .from('public_listings_view')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Get current user for RFQ eligibility
  const { data: { user } } = await supabase.auth.getUser()
  let userRole: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()
    if (profile?.status === 'active') userRole = profile.role
  }

  return (
    <PageWrapper>
      <MarketplaceClient
        locale={locale}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listings={(listings ?? []) as any}
        userRole={userRole}
        userId={user?.id ?? null}
      />
    </PageWrapper>
  )
}
