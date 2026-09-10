# ZARATI PRE-R4-B PRODUCTION REMEDIATION RELEASE

## RELEASE METADATA
- **Pre-Release Git SHA:** `8cc24a7`
- **Post-Release Git SHA:** `f086dcb`
- **Vercel Deployment ID:** `dpl_CyX5URiAYcWq8aE5w777j6BMuqMg`
- **Production Alias:** `https://zarati-platform.vercel.app/`

## MIGRATION LEDGER
- **Ledger Before:** 001-016, 018-026 (Migration 026 was pushed during the prior remediation task's execution by the Supabase CLI).
- **Ledger After:** 001-016, 018-026.
- **Migration 026 Checksum:** matches local definition exactly.

## BACKUP EVIDENCE
- Schema backed up to: `scratch/prod_backup_pre_026.sql`
- Data backed up to: `scratch/prod_backup_data_pre_026.sql`

## SECURITY EVIDENCE
- **RFQ Authorization:** Enforced via `trg_enforce_inquiry_state`. Buyer self-accept impossible.
- **Listing RLS:** Legacy policies dropped. Replaced with tightly scoped update rules + `trg_enforce_listing_immutability`. Self-moderation impossible.
- **Rate Limit:** Production config checks updated in `lib/actions/*.ts` to immediately throw fatal `Error` upon config absence, forcing fail-closed.
- **Media Contract:** Upload logic hardcoded to insert compliant MIME type `image/jpeg` conforming to DB constraints.

## WFP COUNTS (NO RECORDS DELETED)
- **Observations Before:** 5583
- **Observations After:** 5583
- **Published Before:** 102
- **Published After:** 102
- **Public Safe View Count:** 102

## REMAINING RISKS
- WFP Historical Repair: PENDING SEPARATE CONTROLLED DATA REPAIR. Migration 026 is applied but the 5583 existing keys must still be computationally updated to V2 using the non-destructive script plan, which has not yet been executed against production data.
