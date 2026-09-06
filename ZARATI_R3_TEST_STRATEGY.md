# ZARATI R3 TEST STRATEGY

## 1. Unit Tests
*   **Target:** Zod validation (Price nullability, Quantity limits), State machine transition logic.

## 2. Integration Tests
*   **Target:** Server Actions.
*   **Flows:** Full lifecycle of Farmer listing creation to Trader RFQ submission and acceptance.

## 3. Adversarial / Security Tests (Critical)
*   **IDOR Check:** Trader A gets 403 when querying Trader B's RFQs.
*   **Privacy Check:** Ensure anonymous `SELECT` on base `listings` table fails, and `public_listings_view` strips PII.
*   **Mass Assignment Check:** Verify `seller_id` and `moderation_status` cannot be injected in Server Action payloads.

## 4. Concurrency & Duplication
*   **Duplicate RFQ Policy:** Verify `idx_unique_open_rfq` allows a Trader to submit a new RFQ if the previous one is `rejected` or `withdrawn`, but blocks duplicates while `pending` or `accepted`.
