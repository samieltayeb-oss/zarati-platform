# ZARATI R3 DATABASE SCHEMA DESIGN

## Forensic Finding
Existing migrations (`010`, `011`, `012`, `013`) already define robust tables for `listings`, `listing_media`, `inquiries`, and `moderation_events`.

## Schema Strategy: EXTEND, DON'T REPLACE
We will not create duplicate tables. Instead, we will extend the existing schema via migration `021_r3_marketplace_foundation.sql`.

### 1. `listings` (EXTEND)
**Updates Required in 021:**
*   `price` (NUMERIC, NULLABLE). NULL = "Contact for Price". 0 is rejected.
*   `available_from` (DATE)
*   `available_until` (DATE)
*   `farm_id` (UUID, nullable, references `farms`)
*   `moderation_status` (TEXT, default 'pending', check in ('pending', 'approved', 'rejected'))

### 2. `inquiries` -> RFQ (REUSE)
**Updates Required in 021:**
*   Update the `status` CHECK constraint to the canonical RFQ vocabulary: `pending`, `accepted`, `rejected`, `withdrawn`, `expired`, `closed`.
*   Partial Unique Index: `CREATE UNIQUE INDEX idx_unique_open_rfq ON inquiries (buyer_id, listing_id) WHERE status IN ('pending', 'accepted');` (Prevents duplicate active RFQs while allowing new interest after a terminal state).

### 3. `public_listings_view` (NEW)
Create a secure database view that exposes only `active` and `approved` listings to anonymous users.
*   **Excluded:** `user_id`, `auth_uuid`, private phone, private email, exact `GPS`, internal moderation notes, internal audit metadata.
*   **Included:** `id`, `category`, `title`, `description`, `price`, `currency`, `unit`, `quantity`, `state_id`, `created_at`.
*   Anonymous raw-table SELECT on `listings` is revoked entirely in favor of this view.

### Next Migration
**Number:** `202609xxxx_021_r3_marketplace_foundation.sql` (DO NOT APPLY YET).
