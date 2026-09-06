# ZARATI CAPABILITY STATUS REGISTER

This document serves as the definitive source of truth for the technical status of all Zarati platform capabilities as of the R2.6 freeze.

## 1. Authentication & Identity
*   **Capability:** Multi-Role User Registration (Farmer, Trader, Admin)
*   **Status:** `LIVE`
*   **Evidence:** Supabase Auth configured. `app/(auth)` routes operational.
*   **Constraint:** Admin registration is disabled in production environments.

*   **Capability:** Enforced Email Verification
*   **Status:** `LIVE`
*   **Evidence:** Supabase project settings verified. Verification flow tested on Vercel.

*   **Capability:** Role-Based Access Control (RBAC)
*   **Status:** `LIVE`
*   **Evidence:** Middleware (`proxy.ts`) enforces path restrictions based on user role metadata.

## 2. Security & Data Protection
*   **Capability:** Rate Limiting
*   **Status:** `LIVE`
*   **Evidence:** Upstash Redis configured via `rate-limiter.ts`.

*   **Capability:** Row Level Security (RLS)
*   **Status:** `LIVE`
*   **Evidence:** Migrations up to `020` applied. Direct table access blocked for anonymous users.

*   **Capability:** Safe Public Data Exposure
*   **Status:** `LIVE`
*   **Evidence:** `public_traders` view implemented and utilized in API endpoints.

## 3. UI/UX Foundation
*   **Capability:** Internationalization (Arabic/English)
*   **Status:** `BUILT`
*   **Evidence:** `next-intl` integrated. Static strings localized.

*   **Capability:** Responsive Design (Mobile First)
*   **Status:** `BUILT`
*   **Evidence:** Tailwind CSS implemented across all existing views.

## 4. Unimplemented Capabilities (Deflation Target)
*The following capabilities were heavily referenced in R2.5 strategy documents but currently lack technical implementation.*

*   **Marketplace Core (Listings, Bidding, RFQ):** Status is `PLANNED` (R3 Scope). Existing UI is purely mock data and static components.
*   **Live Market Data Integration:** Status is `PLANNED` (R4 Scope). Current charts/tables use static JSON arrays.
*   **Basic Weather API Integration:** Status is `PLANNED` (R4-B Scope). Examples: basic forecast, rainfall, temperature.
*   **Advanced/Hyper-local Agronomic Weather Intelligence:** Status is `VISION`. Examples: field-specific predictive agronomy, weather-risk AI.
*   **AI/LLM Features:** Status is `VISION`.
*   **Financial Transactions/Escrow:** Status is `NOT OFFERED`.
