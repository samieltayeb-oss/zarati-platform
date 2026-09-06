# ZARATI R3 SECURITY THREAT MODEL

## 1. Mass Assignment (Spoofing)
**Threat:** Malicious client modifies `seller_id` or `published_at` during API requests.
**Mitigation:** Server Actions derive identity strictly from `auth.getUser()`. Column-level database triggers and strict Server Action schemas enforce immutability of protected fields.

## 2. RFQ Spam (Denial of Service)
**Threat:** Bot creates thousands of RFQs.
**Mitigation:** Authenticated Upstash Redis rate limiting. (Max 5 RFQs per minute per user, 50 per rolling 24h). IP-based limits are secondary.

## 3. IDOR / Data Leakage
**Threat:** Trader guesses `inquiry_id` to read private negotiation, or Anonymous user queries raw `listings` table for GPS.
**Mitigation:** RLS explicitly blocks raw-table SELECT for anonymous. `public_listings_view` safely projects data. RLS on `inquiries` restricts access to counterparties only.

## 4. XSS via Descriptions
**Threat:** Malicious script in `description_ar`.
**Mitigation:** React/Next.js native escaping. No `dangerouslySetInnerHTML`.

## 5. Storage Metadata Leaks
**Threat:** EXIF data exposing farmer home locations.
**Mitigation:** Draft images secured by RLS. Client-side stripping combined with server-side validation/processing where practical.
