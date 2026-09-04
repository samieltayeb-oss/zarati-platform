# ZARATI | زرعتي — Production Data Architecture & Security Design (Phase R1-A)
**Version:** 1.0.0-draft  
**Date:** September 4, 2026  
**Status:** ARCHITECTURE & PLANNING ONLY (Zero migrations executed, zero production data modified)  
**Target Platform:** Supabase PostgreSQL 15+ / Next.js 16.2.9 (App Router)  
**Author / Lead Architect:** Gemini 3.8 Flash (via Antigravity Pairing Assistant)  
**Project Path:** `C:\Users\mcreg\Desktop\zarati`

---

## 1. Architectural Philosophy & Principles

Zarati's production data layer must bridge the gap between high-level institutional pitch deck aspirations (Vision 2035) and the operational reality of smallholder farmers and grain traders in Sudan. The architecture is guided by six non-negotiable principles:

1. **Identity Ground Truth in `auth.users`:**  
   Supabase Auth is the single identity provider. No separate password hashes, salt columns, or credentials exist in application schemas. Application state lives in a strictly linked 1:1 `profiles` table.
2. **Defensive Privacy by Default:**  
   Sudanese smallholder farmers operate in fragile economic and security conditions. Private contact information (phone number, email, GPS parcel boundaries) must never be visible to anonymous visitors or unauthenticated scrapers. The platform enforces an asynchronous inquiry gateway rather than exposing raw contact lists.
3. **Bilingual & Localization Native:**  
   Sudan is bilingual (Arabic default, English institutional). Master records for crops, states, markets, and categories store parallel strings (`name_ar`, `name_en`). Codes and units use stable ISO/canonical representations (`SD-GD`, `SDG`, `feddan`, `ton`).
4. **Sudan Agricultural Reality:**  
   Land measurements in eastern and central Sudan primarily use the **Feddan** (فدان ≈ 4,200 m² / 0.42 hectares). Storing only metric hectares forces cognitive translation onto farmers. The schema supports canonical multi-unit area inputs while normalizing calculations.
5. **Zero-Trust Row Level Security (RLS):**  
   Every table is secured with PostgreSQL RLS. The web application client connects using the user's JWT. The server service role key is reserved strictly for background tasks and never trusted in client code.
6. **Strict MVP Boundaries:**  
   Speculative schemas for satellite NDVI, microloans, trucking logistics, and automated AI agents are strictly deferred. The data layer powers only the core MVP actors: **Farmer**, **Trader**, **Admin**, and **Public Visitor**.

---

## 2. Core Entity Relationship Model

```
                    ┌────────────────────────────────┐
                    │      auth.users (Supabase)     │
                    └────────────────────────────────┘
                                    │ 1:1
                                    ▼
                    ┌────────────────────────────────┐
                    │            profiles            │
                    │  (role: farmer, trader, admin) │
                    └────────────────────────────────┘
                         │ 1:N                     │ 1:1
                         │                         ▼
                         │               ┌──────────────────┐
                         │               │ trader_profiles  │
                         │               └──────────────────┘
                         ▼
               ┌──────────────────┐
               │      farms       │
               └──────────────────┘
                    │ 1:N     │ 1:N
                    │         │
                    │         ▼
                    │    ┌───────────┐
                    │    │farm_crops │
                    │    └───────────┘
                    ▼          ▲
          ┌──────────────────┐ │ (crop_id)
          │     listings     │─┤
          └──────────────────┘ │
               │ 1:N      │ 1:N│
               │          │    │
               ▼          ▼    │
      ┌────────────┐ ┌─────────┴───┐       ┌──────────────┐
      │listing_media inquiries     │       │    states    │
      └────────────┘ └─────────────┘       └──────────────┘
                           │ 1:N                  │ 1:N
                           ▼                      ▼
                     ┌───────────────┐     ┌──────────────┐
                     │inquiry_msgs   │     │   markets    │
                     │  (deferred)   │     └──────────────┘
                     └───────────────┘            │ 1:N
                                                  ▼
                                           ┌──────────────┐
                                           │ crop_prices  │
                                           └──────────────┘
                                                  ▲
                                                  │ (crop_id)
                                           ┌──────┴───────┐
                                           │    crops     │
                                           └──────────────┘
```

---

## 3. Actor Roles & Permissions Strategy

### Role Implementation Strategy
We evaluated three approaches for actor roles:
1. **PostgreSQL ENUM (`CREATE TYPE user_role AS ENUM (...)`)**:
   - *Drawback:* Modifying enums in PostgreSQL requires `ALTER TYPE ... ADD VALUE`, which cannot run inside transaction blocks and creates deployment locking risks.
2. **Normalized Roles Table (`roles` + `user_roles`)**:
   - *Drawback:* Adds an extra join to every single RLS query evaluation and increases latency without practical benefit for a 3-role MVP.
3. **TEXT with CHECK Constraint (RECOMMENDED)**:
   ```sql
   role TEXT NOT NULL DEFAULT 'farmer' 
     CHECK (role IN ('farmer', 'trader', 'admin', 'government', 'ngo', 'institution'))
   ```
   - *Advantage:* Highly performant, easily queryable, seamlessly typed in TypeScript as `'farmer' | 'trader' | 'admin'`, and allows adding future roles (`government`, `ngo`) without database locks or migration breakage.

### MVP Actors vs Future Compatibility

| Role | MVP Scope | Permissions Matrix |
|---|---|---|
| **`farmer`** | Core MVP | Create/edit/view own profile; create/view own farms & farm crops; create/edit/pause/close own listings; receive and respond to inquiries; view public prices & weather. |
| **`trader`** | Core MVP | Create/edit own trader profile; browse active approved listings; filter by crop and state; submit inquiries to sellers; view own inquiry threads. |
| **`admin`** | Core MVP | Superuser oversight; moderate/approve/reject listings; manage market price bulletins; view/filter waitlist; inspect user accounts. |
| **`government`** | Future (Deferred) | Read-only access to aggregated regional statistics, yield forecasts, and price trend indices. |
| **`ngo`** | Future (Deferred) | Read-only beneficiary reporting and food vulnerability mapping. |

---

## 4. Master Data Architecture

### 4.1 Location Hierarchy: States & Markets
Sudan possesses 18 states. Rather than relying on free-form text entry (which introduces typographical drift like `بور سودان` vs `بورتسودان`), location master data is normalized:

1. **`states` Table:**
   - Primary key: `code` (`CHAR(5)` or `TEXT`, e.g., `SD-GD` for Gedaref, `SD-KA` for Kassala, `SD-RS` for Red Sea, `SD-KH` for Khartoum).
   - Fields: `code`, `name_en`, `name_ar`, `capital_en`, `capital_ar`, `sort_order`, `is_active`.
   - Populated with all 18 states at initialization, ensuring future national rollout requires zero schema changes.
2. **`markets` Table:**
   - Physical commodity trading hubs tied to states.
   - Primary key: `id UUID`.
   - Fields: `state_code REFERENCES states(code)`, `code TEXT UNIQUE` (e.g. `MKT-GEDAREF-EXCHANGE`), `name_en`, `name_ar`, `locality`, `is_active`.
   - Initial Phase 1 Focus:
     - **Gedaref:** Gedaref Crop Exchange (سوق القضارف للمحاصيل) — the primary sorghum and sesame hub.
     - **Kassala:** Kassala Central Market (سوق كسلا المركزي) — eastern horticultural and oilseed hub.
     - **Port Sudan:** Port Sudan Wholesale & Export Terminal (سوق بورتسودان للصادر) — Red Sea logistics hub.

### 4.2 Crops Master Table
Crops are core reference entities managed via `crops`:
- `id TEXT PK`: Stable lowercase slug (e.g., `sorghum`, `sesame`, `groundnuts`, `gum-arabic`, `wheat`, `millet`, `cotton`, `sunflower`).
- `name_en` / `name_ar`: Bilingual labels.
- `category`: `grain` | `oilseed` | `cash` | `pulse` | `vegetable` | `fruit`.
- `default_unit`: `ton` | `sack` | `kg`.
- `is_active`: Boolean flag allowing seasonal or discontinued crops to be hidden.

---

## 5. Land Measurement & Canonical Units

### The Sudan Land Dilemma: Feddan vs Hectare
In Sudan, virtually all agricultural land transactions and farmer interviews are conducted in **Feddans** (فدان):
$$\text{1 Feddan} = 4,200 \text{ m}^2 = 0.42 \text{ Hectares}$$
$$\text{1 Hectare} = 10,000 \text{ m}^2 \approx 2.38 \text{ Feddans}$$

### Canonical Storage Strategy
To avoid confusing farmers while maintaining mathematical comparability across platform aggregations:
1. The `farms` table stores:
   - `area_value NUMERIC(12,2) NOT NULL CHECK (area_value > 0)`
   - `area_unit TEXT NOT NULL CHECK (area_unit IN ('feddan', 'hectare', 'acre'))`
   - `area_hectares NUMERIC(12,2) GENERATED ALWAYS AS (...) STORED`
   ```sql
   area_hectares NUMERIC(12,2) GENERATED ALWAYS AS (
     CASE 
       WHEN area_unit = 'hectare' THEN area_value
       WHEN area_unit = 'feddan'  THEN ROUND(area_value * 0.4200, 2)
       WHEN area_unit = 'acre'    THEN ROUND(area_value * 0.4047, 2)
       ELSE area_value
     END
   ) STORED
   ```
2. Farmers input land in their preferred unit (Feddan).
3. The platform computes analytics, reporting, and spatial indexing uniformly on `area_hectares`.

---

## 6. Market Price Model & Time-Series History

### Audit & Append-Only Design
Commodity price discovery in Sudan is volatile due to seasonal harvests and macroeconomic fluctuations. Overwriting past prices destroys market transparency.
- **Append-Only Observation Log (`crop_prices`):**  
  Every daily bulletin entry creates a new immutable record.
- **Fast Latest Price Resolution:**  
  A composite index on `(crop_id, market_id, price_date DESC)` guarantees $O(1)$ index-scan access to the most recent spot price.
- **Verification Trail:**  
  Each price records `source_type` (`exchange`, `bulletin`, `enumerator`), `source_name` (e.g. "Gedaref Chamber of Commerce"), and `entered_by` (admin UUID).

---

## 7. Marketplace Listing Lifecycle & Governance

### Decoupling Seller State from Moderation State
A listing's availability depends on two independent concerns:
1. **Seller Lifecycle (`status`):**  
   `draft` → `active` ⇄ `paused` → `sold` | `closed` | `expired`
2. **Platform Governance (`moderation_status`):**  
   `pending_review` → `approved` | `rejected`

### State Transition Rules
- A listing is publicly visible on `/[lang]/marketplace` **ONLY IF**:
  ```sql
  status = 'active' AND moderation_status = 'approved' AND (expires_at IS NULL OR expires_at > now())
  ```
- If an approved active listing is edited by the seller, its `moderation_status` returns to `pending_review` (or remains approved if non-substantive based on admin configuration).
- Admins can reject listings with a mandatory `rejection_reason` visible only to the listing owner.

---

## 8. Inquiry Flow & Privacy Architecture

### The Contact Gateway Problem
In the current prototype, the "Contact" button is inert. In production, exposing the farmer's raw telephone number on the public internet creates significant harassment, spam, and predatory middleman arbitrage risks.

### Privacy-Preserving Lead Flow
1. **Public View:**  
   The listing displays only the seller's public alias (e.g., "Ahmed M. — Verified Farmer"), region ("Gedaref State"), crop specifications, and price. Phone and email are masked.
2. **Inquiry Submission:**  
   An authenticated trader clicks "Inquire", entering requested volume and a message.
3. **Record Creation:**  
   A record is created in `inquiries`. Both `buyer_id` and `seller_id` are stored directly on the inquiry record.
   - *Why denormalize `seller_id`?* RLS policies evaluating `auth.uid() = buyer_id OR auth.uid() = seller_id` run with zero joins, making inquiry inbox queries extraordinarily fast and mathematically preventing IDOR vulnerabilities.
4. **Notification & Handshake:**  
   The seller receives an email/SMS notification with the trader's credentials. Once the seller marks the inquiry `responded` or `closed`, direct contact channels open.

---

## 9. Compatibility with Existing Waitlist

The production Supabase instance currently hosts the active `waitlist` table:
```sql
TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```
- **Zero Impact Guarantee:**  
  Phase R1 migrations will **NOT alter, drop, or rename** `waitlist`.
- **Pre-Registration Transition:**  
  When an invited waitlist user signs up in Phase R2, a backend trigger or onboarding action will match `waitlist.email = auth.users.email`, carry over their pre-selected role into `profiles`, and mark their waitlist record converted.

---

## 10. Service Role Key & API Boundaries

```
┌────────────────────────────────────────────────────────┐
│                   BROWSER / CLIENT                     │
├────────────────────────────────────────────────────────┤
│ • Uses NEXT_PUBLIC_SUPABASE_URL                        │
│ • Uses NEXT_PUBLIC_SUPABASE_ANON_KEY                   │
│ • Passes user JWT with every request                   │
│ • RLS STRICTLY ENFORCED BY POSTGRESQL                  │
└────────────────────────────────────────────────────────┘
                           │
                           ▼ HTTPS / WebSocket
┌────────────────────────────────────────────────────────┐
│                   SUPABASE DATABASE                    │
├────────────────────────────────────────────────────────┤
│ • Evaluates auth.uid()                                 │
│ • Blocks unauthorized reads / writes                   │
└────────────────────────────────────────────────────────┘
                           ▲
                           │ Internal Only
┌────────────────────────────────────────────────────────┐
│             NEXT.JS SERVER ACTIONS (Node.js)           │
├────────────────────────────────────────────────────────┤
│ • Uses SUPABASE_SERVICE_ROLE_KEY                       │
│ • ONLY for admin tasks & transactional emails          │
│ • NEVER exported to client or browser bundle           │
└────────────────────────────────────────────────────────┘
```
