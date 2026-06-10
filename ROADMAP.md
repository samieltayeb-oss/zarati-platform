# Zarati Roadmap | خارطة طريق زرعتي

## Current State — Phase D Complete (June 2026)

The MVP foundation is live. All core pages are built, tested, and bilingual. All data is mocked and ready for real API integration.

---

## Phase A — Foundation ✅
- [x] Next.js 16.2.9 + TypeScript + Tailwind CSS v4
- [x] Pinned dependencies (no `^` versions)
- [x] Self-hosted Cairo + Geist fonts
- [x] Locale routing (`[lang]` — Arabic default)
- [x] RTL support via Tailwind logical properties
- [x] Design tokens in CSS `@theme`
- [x] Type system (Crop, Weather, Listing, User, Roles)
- [x] Feature flag config (`config/modules.ts`)
- [x] SEO metadata factory (bilingual)
- [x] Vitest testing setup

## Phase B — Data & Components ✅
- [x] Mock data: 8 crops, 5 cities weather, 8 marketplace listings
- [x] Service layer: crop-service, weather-service, marketplace-service
- [x] UI components: Button, Badge, Card, Input, Select, Skeleton
- [x] Layout: Header (sticky, bilingual nav, locale switcher), Footer, PageWrapper
- [x] i18n dictionaries (Arabic + English)
- [x] 18 tests passing

## Phase C — Pages ✅
- [x] Homepage: 9 sections (Hero, Mission, Stats, Crops, Weather, AI Preview, Marketplace, Future Vision, CTA)
- [x] Crop Price Index page (full table, category badges, change indicators)
- [x] Marketplace page (client-side search + category filter)
- [x] Weather Intelligence page (5 cities, 7-day forecast)
- [x] Farmer Dashboard (stats cards, price table, listings table)
- [x] About page (hero, mission, values, contact)
- [x] 16 SSG routes (ar + en for each page)
- [x] Arabic typography, RTL layout, natural Sudanese Arabic wording

## Phase D — Quality ✅
- [x] Service tests: weather (10), marketplace (11) — total 37 tests
- [x] README with full setup instructions
- [x] ROADMAP, CONTRIBUTING, MOCK_DATA_REGISTRY documentation
- [x] Lint clean, all tests green, build passes

---

## Phase E — Real APIs (Month 3)
- [ ] Sudan commodity exchange price API integration
- [ ] OpenWeatherMap / Meteomatics weather API
- [ ] Replace `USE_MOCK` flag with env-based toggle
- [ ] Implement `lib/api/` HTTP client layer
- [ ] Add loading skeletons (already built in UI)
- [ ] Error boundary pages (`not-found.tsx`, `error.tsx`)

## Phase F — Authentication (Month 4)
- [ ] NextAuth.js integration with credentials provider
- [ ] Role-based access: farmer, trader, ngo, government, admin
- [ ] Protected routes for `/overview` and dashboard pages
- [ ] User registration flow (farmer onboarding)
- [ ] JWT / session management
- [ ] Password reset via SMS (Sudani / MTN / Zain)

## Phase G — Marketplace Upgrade (Month 4–5)
- [ ] Listing creation form (with photo upload)
- [ ] Real-time listing status updates
- [ ] Seller profile pages
- [ ] In-platform messaging / contact flow
- [ ] Listing verification (admin approval queue)
- [ ] Search with backend filtering + pagination

## Phase H — AI Advisor (Month 6)
- [ ] Planting calendar by crop × region × season
- [ ] Pest and disease alert system (by crop × location)
- [ ] Market timing recommendations
- [ ] Integration with weather data for risk alerts
- [ ] SMS-based AI advisory for low-connectivity users

## Phase I — Financing Portal (Month 7–8)
- [ ] Partner bank/MFI API integration
- [ ] Loan eligibility calculator
- [ ] Digital loan application flow
- [ ] Repayment tracking
- [ ] Mobile money integration (MTN Mobile Money / Aman)

## Phase J — NGO & Government Portals (Month 9+)
- [ ] NGO dashboard: beneficiary tracking, distribution reporting
- [ ] Government portal: national crop production data, policy tools
- [ ] FAO/WFP data export formats (ODK-compatible)
- [ ] Satellite NDVI integration (Copernicus open data)
- [ ] State-level agricultural statistics

## Phase K — Mobile & Offline (Month 10+)
- [ ] PWA: installable, offline-capable
- [ ] Service worker for offline price cache
- [ ] USSD / SMS interface for feature-phone users
- [ ] React Native app (iOS + Android)

---

## Non-Goals (Explicitly Out of Scope for MVP)
- Real-time commodity exchange trading
- Physical logistics / trucking management
- Cross-border trade
- Livestock (Phase 2 consideration)
