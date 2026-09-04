# ZARATI | زرعتي — Comprehensive Product Gap Analysis
**Date:** September 4, 2026  
**Auditor:** Gemini 3.8 Flash (via Antigravity Pairing Assistant)  
**Project Path:** `C:\Users\mcreg\Desktop\zarati`  
**Classification:** READ-ONLY FORENSIC GAP ANALYSIS

---

## 1. Priority Definitions

- **P0 — Critical Blocker:** Completely blocks production deployment of any functional platform feature. Must be resolved before live user interaction.
- **P1 — Core MVP Requirement:** Required for the minimal viable product (Farmer, Trader, Admin, Public) to function end-to-end.
- **P2 — Pilot Readiness Requirement:** Required for field pilot deployments in target states (Gedaref, Kassala, Red Sea State).
- **P3 — Future Enhancement:** High-value post-pilot additions (satellite NDVI, SMS gateway, institutional API integrations, full AI reasoning).

---

## 2. Master Feature & Gap Matrix

| Feature / Domain | Current Status | Real / Mock / Missing | Architecture & Quality | Blocker Level | Priority | Recommended Action |
|---|---|---|---|---|---|---|
| **Waitlist Lead Capture** | Operational | **REAL** | Clean server action with Supabase insert & Resend email trigger. | None | Complete | Keep as is; add rate limiting and honeypot. |
| **Waitlist Admin Viewer** | Operational | **REAL** | Clean client dashboard with search, role filters, and CSV export. | None | Complete | Keep as is; merge into broader admin portal. |
| **Public Landing Page** | Operational | **REAL (Shell)** / **MOCK (Data)** | High quality, responsive, split hero with SVG map, bilingual. | P1 | P1 | Replace static data counters with real aggregates once DB exists. |
| **Brand Identity & Theme** | Complete | **REAL** | Complete tokens in `tokens.css`, Tailwind v4 `@theme`, official logos. | None | Complete | Retain master design system; remove `* { transition: none; }`. |
| **Database Schema (Core)** | Missing | **MISSING** | No schemas, no migrations, no tables for users, crops, or listings. | **P0** | **P0** | Write initial Supabase migration for `profiles`, `crops`, `crop_prices`, `listings`, `inquiries`. |
| **Local Environment (.env)** | Missing | **MISSING** | No local `.env.local` file; developers cannot test live DB/email actions locally. | **P0** | **P0** | Create `.env.local` template with development Supabase keys. |
| **Farmer Registration** | Simulated | **MOCK** | Role option in waitlist only. No password, no farm details recorded. | **P0** | **P0** | Implement Supabase Auth (or NextAuth) with phone/email and farm onboarding profile. |
| **Trader Registration** | Simulated | **MOCK** | Role option in waitlist only. No commercial verification. | **P0** | **P0** | Implement trader registration with business name, state, and phone. |
| **User Authentication** | Missing | **MISSING** | `/[lang]/login` is a static placeholder page. No session handling. | **P0** | **P0** | Build real login screen supporting credentials and session cookies. |
| **Role-Based Guards (RBAC)**| Dead Code | **MISSING** | `ROLE_PERMISSIONS` exists in `lib/auth/permissions.ts` but is never called. | **P0** | **P0** | Wire RBAC into `proxy.ts` and server actions to guard farmer/trader/admin routes. |
| **Farmer Dashboard** | Simulated | **MOCK** | Public route `/[lang]/overview` slices static listings, hardcodes KPI counters. | **P1** | **P1** | Convert `/[lang]/overview` into protected route bound to authenticated user's data. |
| **Marketplace Catalog** | Prototype | **MOCK** | Client-side filter over 8 in-memory items. Fast and clean UI. | P1 | P1 | Refactor service to fetch from Supabase `listings` table. |
| **Listing Creation** | Missing | **MISSING** | "Add Listing" button merely redirects to `/marketplace`. No input form. | **P0** | **P0** | Build listing creation modal/page with crop category, quantity, unit, price, and location. |
| **Trader Inquiries / Contact**| Inert UI | **MISSING** | "Contact" button on listing card has no `onClick` handler. | **P1** | **P1** | Implement contact inquiry modal storing inquiry in DB and triggering notification. |
| **Commodity Price Index** | Hardcoded | **MOCK** | 8 crops with static June 2026 prices and synthetic mathematical history. | **P1** | **P1** | Create `crop_prices` table; build admin price bulletin entry screen for manual updates. |
| **Weather Intelligence** | Hardcoded | **MOCK** | 5 cities with static June 2026 forecast data. | **P1** | **P1** | Integrate free weather API (Open-Meteo or OpenWeatherMap) with caching. |
| **Admin Platform Moderation**| Missing | **MISSING** | Admin can only view waitlist; cannot manage users, listings, or prices. | **P1** | **P1** | Expand `/admin` to include tabs for Listings Moderation, Price Entry, and User Directory. |
| **Security: Rate Limiting** | Missing | **MISSING** | `/admin/login` and `submitWaitlist` can be brute-forced without limit. | **P0** | **P0** | Add IP/token rate limiting on server actions (Upstash or in-memory limiter). |
| **Security: Headers & CSP** | Partial | **PARTIAL** | Basic nosniff/xframe headers present; CSP and HSTS missing. | P1 | P1 | Add CSP, HSTS, and Permissions-Policy in `next.config.ts`. |
| **i18n Hardcoded Text** | Technical Debt | **PARTIAL** | Marketplace, crops, and footer bypass dictionary files with hardcoded ternaries. | P2 | P2 | Move all inline English/Arabic ternaries into `ar.json` and `en.json`. |
| **Font Consistency** | Divergence | **PARTIAL** | Uses Cairo / Geist instead of Brand spec IBM Plex Arabic / Inter. | P2 | P2 | Align font loaders with Brand Guidelines or formally amend Brand Guidelines. |
| **Sitemap Completeness** | Defect | **PARTIAL** | `app/sitemap.ts` omits `/crops`, `/overview`, and `/login`. | P2 | P2 | Update sitemap array with all canonical public indexable pages. |
| **AI Advisor Module** | Concept Only | **MISSING** | Only a marketing teaser card on the home page. | P3 | P3 | Build agricultural advisory prompt pipeline backed by Gemini API with agronomy context. |
| **SMS Gateway / Offline** | Concept Only | **MISSING** | No SMS provider, no USSD handler, no offline cache. | P3 | P3 | Integrate SMS provider (Africa's Talking / Twilio) for price broadcasts and alerts. |
| **Government Dashboard** | Concept Only | **MISSING** | Slide concept only. | P3 | P3 | Build aggregated state production and food security analytical dashboard. |
| **NGO Portal** | Concept Only | **MISSING** | Slide concept only. | P3 | P3 | Build beneficiary and distribution tracking portal. |
| **Satellite NDVI Monitoring** | Concept Only | **MISSING** | Disabled in modules config. | P3 | P3 | Partner with Sentinel/Copernicus API for field vegetation health indexing. |

---

## 3. Analysis of Critical Blockers (P0)

### Blocker 0.1: No Core Database Schema or Tables
- **Current Truth:** The Supabase database contains only the `waitlist` table. There are no tables for `profiles`, `crops`, `crop_prices`, `listings`, or `inquiries`.
- **Impact:** Any attempt to implement real user registration, listing creation, or price management will fail because there is nowhere to persist data.
- **Remedy:** Create a clean SQL migration defining the relational schema with UUID primary keys, foreign keys, timestamps, and RLS policies.

### Blocker 0.2: Absence of User Authentication & Sessions
- **Current Truth:** Users cannot create accounts, log in, or maintain sessions. `/[lang]/login` is a static "Coming Soon" marketing page.
- **Impact:** Farmers cannot manage their own listings; traders cannot have authenticated communication; permissions cannot be enforced.
- **Remedy:** Configure Supabase Auth or NextAuth.js. Support email/password and phone authentication (vital for Sudanese context).

### Blocker 0.3: Zero Write Capability in Marketplace (Read-Only Mock)
- **Current Truth:** `marketplace-service.ts` only reads an in-memory array. There is no `createListing`, `updateListing`, or `deleteListing` function or UI.
- **Impact:** The core value proposition of the platform ("Digital Operating System for Agriculture") cannot be demonstrated or piloted.
- **Remedy:** Build a listing submission server action and form modal with image upload, location picker, and pricing fields.

### Blocker 0.4: Lack of Rate Limiting & Abuse Prevention
- **Current Truth:** The admin login form and waitlist submission endpoint have zero throttling or rate limiting.
- **Impact:** Exposure to password brute-force on `/admin/login` and database spam / Resend quota exhaustion on `submitWaitlist`.
- **Remedy:** Implement sliding-window rate limiting on all public server action endpoints.

---

## 4. Analysis of MVP Requirements (P1)

### Requirement 1.1: Live Crop Price Data Pipeline
- **Current Truth:** All prices are hardcoded from June 2026.
- **Remedy:** Allow designated admins/enumerators in key markets (Gedaref, Kassala, Port Sudan) to enter daily commodity prices via a simple web dashboard.

### Requirement 1.2: Free Weather API Integration
- **Current Truth:** Fixed 5-city forecast for June 2026.
- **Remedy:** Connect Open-Meteo or OpenWeatherMap with coordinates for Sudan's key agricultural states. Cache results in Supabase or Next.js fetch cache for 3 hours.

### Requirement 1.3: Trader Inquiry / Contact Flow
- **Current Truth:** Clicking "Contact" on any listing does nothing.
- **Remedy:** Open a modal allowing the trader to input their phone/message, creating an inquiry record and notifying the seller via email or SMS.

### Requirement 1.4: Protected Farmer Dashboard
- **Current Truth:** `/overview` is public and displays hardcoded numbers.
- **Remedy:** Restrict `/overview` to logged-in users; fetch only listings created by the logged-in user.

### Requirement 1.5: Basic Admin Moderation Portal
- **Current Truth:** `/admin` only manages the waitlist.
- **Remedy:** Add listing approval and rejection buttons to prevent spam or inappropriate postings before they appear on the public marketplace.

---

## 5. Technical Debt & UI Cleanliness (P2)

1. **Re-enable CSS Transitions:**  
   Remove `* { transition: none; }` from `app/globals.css`. Restore smooth micro-interactions on buttons, links, and cards.
2. **Dictionary Centralization:**  
   Replace all hardcoded Arabic/English ternaries in `marketplace/page.tsx`, `crops/page.tsx`, and `footer.tsx` with unified references in `ar.json` and `en.json`.
3. **Port Sudan Spelling Standardization:**  
   Standardize Arabic spelling to `بورتسودان` across `weather.ts`, `SudanMap.tsx`, and dictionaries.
4. **Prune Unused Code & Assets:**  
   - Remove `product-vision-deck.html` (superseded by v2).
   - Clean up unused map files (`sudan-outline.svg`, `sudan-path.txt`).
   - Remove or implement `components/ui/select.tsx` and `components/ui/skeleton.tsx`.

---

## 6. Future Capabilities (P3)

1. **AI Agronomy Advisor:**  
   Deploy Google Gemini API with system instructions tuned for Sudanese soil, planting seasons, and crop pest diagnostics.
2. **SMS Fallback Gateway:**  
   Integrate Africa's Talking or local telco APIs to allow feature-phone farmers to receive price bulletins and submit harvest availability via SMS.
3. **Institutional Dashboards:**  
   Develop the dedicated Government and NGO portals featured in Slides 13 and 14 of the vision deck.
