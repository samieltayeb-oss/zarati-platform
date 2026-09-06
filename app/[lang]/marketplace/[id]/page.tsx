import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout/page-wrapper'
import { ListingDetailClient } from '@/components/marketplace/listing-detail-client'

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>
}) {
  const { lang, id } = await params
  const locale = lang as string

  const supabase = await createServerClient()
  
  // Verify auth for user role checks
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

  // Use public_listings_view to securely fetch listing detail
  const { data: listing } = await supabase
    .from('public_listings_view')
    .select('*')
    .eq('id', id)
    .single()

  if (!listing) notFound()

  // Fetch listing media securely
  const { data: media } = await supabase
    .from('listing_media')
    .select('id, storage_path, is_primary')
    .eq('listing_id', id)
    .order('sort_order', { ascending: true })

  // Since public_listings_view doesn't expose user_id, 
  // we must use the Admin client to securely look up the seller_id for the public seller profile
  const { createAdminClient } = await import('@/lib/supabase/server')
  const adminClient = createAdminClient()
  
  const { data: rawListing } = await adminClient
    .from('listings')
    .select('user_id')
    .eq('id', id)
    .single()

  let sellerProfile = null
  if (rawListing?.user_id) {
    // Only fetch safe public info
    const { data: seller } = await supabase
      .from('marketplace_seller_public')
      .select('full_name, full_name_ar, rating, total_deals_completed, is_verified')
      .eq('id', rawListing.user_id)
      .single()
      
    sellerProfile = seller
  }

  return (
    <PageWrapper>
      <ListingDetailClient
        locale={locale}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listing={listing as any}
        media={media ?? []}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        seller={sellerProfile as any}
        userRole={userRole}
        userId={user?.id ?? null}
      />
    </PageWrapper>
  )
}
