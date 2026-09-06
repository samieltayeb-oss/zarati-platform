# ZARATI_R3_DATABASE_MIGRATION_REPORT

## Migration 021 Architecture
- **Filename:** `20260905000021_021_r3_marketplace_foundation.sql`
- **Destructive Changes:** None. R1/R2 tables extended gracefully.
- **Public View:** `public_listings_view` established. Raw `anon` SELECT revoked on `listings`.

## Migration 022 Security Hardening Architecture
- **Filename:** `20260905000022_022_r3_rc_security_hardening.sql`
- **Account State Checks:** Explicit `public.is_active_user()` checks added to all `INSERT`, `UPDATE`, and `DELETE` RLS policies for `listings` and `inquiries`.
- **RPC Hardening:** `get_rfq_contact_details` modified to include `SET search_path = ''`, enforce caller identity from `auth.uid()`, and verify active account status of both caller and counterparty.
- **Migration Policy:** Historical migration 021 remained immutable; all fixes successfully rolled forward into 022.

**Status:** Validated in Staging environment.
