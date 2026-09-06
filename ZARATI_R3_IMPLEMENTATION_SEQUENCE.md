# ZARATI R3 IMPLEMENTATION SEQUENCE

Strict dependency order:

**R3.1: Database Schema & Views**
*   Create migration `021_r3_marketplace_foundation.sql`.
*   Alter `listings` and `inquiries`. Add Partial Unique Index.
*   Create `public_listings_view`. Revoke raw-table `anon` SELECT.

**R3.2: RLS Policies & Storage**
*   Apply RLS with strict column-level protection.
*   Configure `listing-media` visibility.

**R3.3: Server Actions & Zod Validation**
*   Implement strict NULL price and unit preservation.

**R3.4: Farmer UI (Listing Workflow)**
*   Progressive forms.

**R3.5: Trader UI (Discovery)**
*   Read from `public_listings_view`.

**R3.6: RFQ Interaction (Trader & Farmer)**
*   Mutual contact privacy release logic (Option C).

**R3.7: Security & Adversarial QA**
*   Run tests against IDOR, Rate Limits, and EXIF stripping.

**R3.8: Production Canary & Go-Live**
*   Rollout gates (Local -> Staging -> Canary -> Prod).
*   Await Founder Approval for Pilot Activation.
