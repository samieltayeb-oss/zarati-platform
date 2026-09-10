# PRE-R4-B REMEDIATION EVIDENCE

## ROOT CAUSES
1. **RFQ Authorization:** Missing trigger to enforce role-based transitions on `inquiries`. RLS policies were too permissive, allowing users to update their own inquiries without column-level restrictions.
2. **Listing RLS Conflicts:** Older permissive `DELETE`/`UPDATE` policies were not cleanly dropped and remained active via PostgreSQL's `OR` combinator, effectively bypassing the newer restrictive RLS policies intended for R3.
3. **Rate Limit Fail-Open:** Rate limiter factories silently returned `null` and bypassed the `rl.limit()` check when environment variables were missing, failing OPEN.
4. **Media Contract:** Database `CHECK` constraint explicitly restricted `media_type` to `image/jpeg`, `image/png`, and `image/webp`. However, `upload.ts` attempted to blindly insert the generic string `'image'`, crashing on every upload.
5. **WFP Source Identity Collisions:** The old `source_record_key` omitted `commodity_id` entirely. Distinct commodities (e.g. `Sorghum (white)` and `Sorghum (food aid)`) mapped to the same generic `sorghum` crop code, causing 100 silent data drops in the DB due to `ON CONFLICT DO NOTHING`. Furthermore, a parallel canary pipeline mapped 20 rows differently, creating 20 unpublished semantic duplicates.

## FILES CHANGED
- `supabase/migrations/20260908000026_026_pre_r4b_remediation.sql` (NEW)
- `lib/actions/listings.ts`
- `lib/actions/rfq.ts`
- `lib/actions/upload.ts`

## MIGRATION 026 CONTENTS & PURPOSE
- **Purpose:** Strict enforcement of Listing lifecycle and RFQ state machine rules.
- **Contents:**
  - Drops ALL 8 legacy conflicting `listings` RLS policies.
  - Recreates tightly scoped RLS policies for `listings`.
  - Creates `trg_enforce_listing_immutability` trigger to prevent owners from mutating `user_id` or `moderation_status`.
  - Creates `trg_enforce_inquiry_state` trigger to lock down the RFQ state machine (buyers cannot self-accept; sellers cannot modify price/volume).

## WFP IDENTITY V2 SPECIFICATION
**Identity Format:** `WFP_SDN_V2_${date}_${market_id}_${commodity_id}_${pricetype}_${unit}`
**Why it works:** It preserves the fundamental primary keys of the original dataset (`market_id`, `commodity_id`) without prematurely collapsing them into R4-C canonical representations, making it mathematically collision-resistant.

## WFP NON-DESTRUCTIVE REPAIR DESIGN
1. **Source Truth:** 5,663 unique observation rows in the raw CSV.
2. **Database Current Truth:** 5,583 rows. Composed of 5,563 bulk keys + 20 distinct canary keys. The 20 canary rows correspond to the exact same CSV data as 20 of the bulk rows.
3. **Execution Plan:** 
   - Translate all 5,583 DB rows to their corresponding V2 keys.
   - For the 20 colliding Canary vs Bulk pairs: retain the Canary row (to preserve publication status) and discard the unpublished duplicate Bulk row.
   - Insert the 100 historical source rows that were previously discarded.
4. **Final Math:** 20 (Canary) + 5,543 (Bulk) + 100 (Missing) = 5,663 distinct V2 rows, identical to the source count. No existing UUIDs are indiscriminately discarded.

## ADVERSARIAL RESULTS
- **RFQ:** Buyer self-accept DENIED.
- **Listings:** Active listing delete DENIED. Owner self-moderation DENIED.
- **Rate Limits:** Fails closed locally when Upstash env variables are stripped.
- **Media:** Application natively inserts `image/jpeg` conforming to DB constraints.

## GIT STATE
- Migration `025` has been explicitly staged.
- Migration `026` has been created.
- No production database mutations have been made.
