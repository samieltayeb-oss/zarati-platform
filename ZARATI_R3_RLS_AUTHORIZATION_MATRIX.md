# ZARATI R3 RLS AUTHORIZATION MATRIX

## 1. `listings` Table
*   **ANONYMOUS:** No direct access. Revoke raw-table SELECT entirely. Queries must hit `public_listings_view`.
*   **FARMER (Seller):** `SELECT` all own listings (`user_id = auth.uid()`). `INSERT` allowed if `user_id = auth.uid()`. `UPDATE` allowed only on own listings.
*   **TRADER (Buyer):** No direct access.

## 2. `listing_media` Table
*   **ANONYMOUS:** `SELECT` linked to active/approved listings only. Draft/private media must not be discoverable.
*   **FARMER:** `INSERT`/`DELETE` for media tied to their own listings.

## 3. `inquiries` (RFQs) Table
*   **ANONYMOUS:** No access.
*   **TRADER (Buyer):** `SELECT` where `buyer_id = auth.uid()`. `INSERT` allowed with own `buyer_id`. `UPDATE` allowed to change status to `withdrawn` or `closed`.
*   **FARMER (Seller):** `SELECT` where `seller_id = auth.uid()`. `UPDATE` allowed to change status to `accepted`, `rejected`, or `closed`.

## 4. `moderation_events` Table
*   **ADMIN/SERVICE ROLE:** Full access.
*   **ALL OTHERS:** No access.

## Column-Level & Mass Assignment Protection
*   RLS row predicates are insufficient alone.
*   **Farmer constraints:** Server Actions + Database Triggers prevent modification of `user_id`, `moderation_status`, `published_at`, system expirations, view counters.
*   **Trader constraints:** Cannot modify `buyer_id`, `seller_id`, server timestamps. Identity derived strictly from `auth.getUser()`.
