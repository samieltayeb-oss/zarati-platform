# ZARATI_R3_RLS_SECURITY_VERIFICATION

## Security Matrix Verification
- **Suspended Farmer:** Attempt to `INSERT` or `UPDATE` listing rejected directly by RLS (enforced via `is_active_user()` helper in Migration 022).
- **Banned Farmer:** Attempt to mutate listing rejected by DB.
- **Suspended Trader:** Attempt to `INSERT` or `UPDATE` RFQ rejected by RLS.
- **Banned Trader:** Attempt to mutate RFQ rejected by DB.
- **Active Users:** Legitimate listing and RFQ flows succeed.
- **Trader A:** Cannot read Trader B's RFQs (verified). Cannot insert an RFQ spoofing `buyer_id` (verified).
- **Anonymous:** Access to raw `listings` table denied (verified). Access to `public_listings_view` succeeds, stripping all PII.

**Status:** All RLS and Suspended/Banned Database enforcements confirmed functional in staging.
