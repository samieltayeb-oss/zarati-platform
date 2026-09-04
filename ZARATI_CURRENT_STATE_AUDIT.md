# ZARATI | زرعتي — Forensic Technical Audit & Current State Truth
**Date of Audit:** September 4, 2026  
**Auditor:** Gemini 3.8 Flash (via Antigravity Pairing Assistant)  
**Project Path:** `C:\Users\mcreg\Desktop\zarati`  
**Repository Remote:** `https://github.com/samieltayeb-oss/zarati-platform.git`  
**Founder:** Sami Suliman Eltayeb (Calgary, Alberta, Canada / Sudan)  
**Mode:** FORENSIC READ-ONLY AUDIT (Zero code modified, zero dependencies installed, zero refactoring performed)

---

## Executive Summary: Establishing the Ground Truth

This forensic audit was conducted to establish the exact, unvarnished reality of the Zarati platform after several months of inactivity. Every claim in previous documentation and pitch decks was tested empirically against the code, tests, database connections, and build outputs.

### The Core Reality
1. **The Visual Shell & Brand Identity are Enterprise-Grade:**  
   The UI presentation, brand assets (`brand/logo2-transparent.png`), color tokens, bilingual layout (Arabic RTL / English LTR), typography, custom SVG Sudan map with post-2011 borders, and presentation deck (`product-vision-deck-v2.html`) are executed with exceptional quality and attention to detail.
2. **The Platform is a Prototype / Marketing Shell with Mock Data:**  
   The website is **not an operating AgriTech platform yet**. It is an elegant, high-fidelity Next.js web application running primarily on hardcoded in-memory arrays. With the exception of a single Supabase waitlist form, **no operational database exists, no user accounts exist, no farmer or trader authentication exists, no real listings can be created, and all commodity prices and weather forecasts are static numbers from June 2026**.
3. **The Codebase is Structurally Sound and Healthy:**  
   - `npm run lint` passed with **0 errors and 0 warnings**.
   - `npm run test:run` passed with **37 / 37 tests green** across 4 test suites.
   - `npm run build` compiled successfully in 6.0s using **Next.js 16.2.9 with Turbopack**, generating 18 clean static/dynamic routes.
4. **The Only Connected Backend is the Waitlist:**  
   The only Supabase integration in the codebase is inserting waitlist leads into a table named `waitlist` and sending emails via Resend. The admin portal (`/admin`) is strictly a waitlist signup viewer and CSV exporter.

---

## Forensic Classification Key
Throughout this report, every component is rigorously classified under one of five labels:
- **[VERIFIED FACT]:** Confirmed directly by code execution, file inspection, or test output.
- **[INFERENCE]:** Logical conclusion drawn from observed code patterns and configurations.
- **[MOCK]:** Hardcoded, simulated, or in-memory data presented through UI components.
- **[PLANNED]:** Documented in roadmaps, slides, or configs, but no execution code exists.
- **[MISSING]:** Expected feature or architectural layer completely absent from the repository.

---

## Phase 1 — Repository Inventory

| Item | Verified Value | Classification |
|---|---|---|
| **Framework** | Next.js 16.2.9 (App Router, Turbopack) | [VERIFIED FACT] |
| **React Version** | React 19.2.4 / React-DOM 19.2.4 | [VERIFIED FACT] |
| **TypeScript Version** | TypeScript 5.9.3 (`target: ES2017`, `strict: true`) | [VERIFIED FACT] |
| **Tailwind Version** | Tailwind CSS 4.3.0 (`@tailwindcss/postcss: 4.3.0`, CSS-first configuration) | [VERIFIED FACT] |
| **Package Manager** | `npm` (`package-lock.json` present, lockfile version 3) | [VERIFIED FACT] |
| **Dependencies** | `@supabase/supabase-js` (^2.108.1), `resend` (^6.12.4), `recharts` (3.8.1), `clsx` (2.1.1), `tailwind-merge` (3.6.0), `@formatjs/intl-localematcher` (0.8.10), `negotiator` (1.0.0) | [VERIFIED FACT] |
| **Test Framework** | Vitest 4.1.8 + `@testing-library/react` 16.3.2 + `jsdom` 29.1.1 | [VERIFIED FACT] |
| **Lint Framework** | ESLint 9.39.4 (`eslint-config-next: 16.2.9`, flat config `eslint.config.mjs`) | [VERIFIED FACT] |
| **Proxy / Middleware** | Next.js 16 Proxy convention (`proxy.ts` in root level) | [VERIFIED FACT] |
| **Environment Files** | `.env.local.example` present. **No `.env` or `.env.local` present in repo.** | [VERIFIED FACT] |
| **Git Status** | Branch `main`, clean working tree (minor unstaged edits in `.gitignore` and `.claude/settings.local.json`). 11 commits total, all by Sami El-Tayeb between 2026-06-09 and 2026-06-10. | [VERIFIED FACT] |
| **Deployment Config** | `.vercel/project.json` linked to `projectId: prj_LZAHjdiRGeH0JuuCvmcjBjeV6KUZ`, `orgId: team_F08GAb9Fc81V3oeSy6zHebRL`, project `zarati`. | [VERIFIED FACT] |

### Repository Directory Architecture
```
c:\Users\mcreg\Desktop\zarati
├── .claude/                     # Local IDE / Claude configuration
├── .env.local.example           # Environment template (Supabase, Resend, Admin password)
├── .git/                        # Git version control (11 commits)
├── .next/                       # Next.js build cache and output
├── .vercel/                     # Vercel project linkage
├── __tests__/                   # 4 Vitest test suites (37 unit tests)
│   └── lib/
│       ├── services/            # crop-service, marketplace-service, weather-service tests
│       └── utils.test.ts        # formatCurrency, formatPercent, cn tests
├── app/                         # Next.js 16 App Router
│   ├── [lang]/                  # Bilingual locale routes (ar, en)
│   │   ├── about/               # About page
│   │   ├── contact/             # Contact information page
│   │   ├── crops/               # Crop Price Index page
│   │   ├── login/               # Launching-soon placeholder page
│   │   ├── marketplace/         # Marketplace catalog (client-side mock)
│   │   ├── overview/            # Farm Dashboard (simulated public view)
│   │   ├── privacy/             # Privacy Policy page
│   │   ├── register/            # Waitlist onboarding form
│   │   ├── terms/               # Terms of Service page
│   │   ├── weather/             # Weather Intelligence page
│   │   ├── layout.tsx           # Locale layout (HTML lang, dir, Cairo/Geist fonts, Header, Footer)
│   │   ├── not-found.tsx        # Bilingual 404 handler
│   │   └── page.tsx             # Home landing page (9 sections)
│   ├── admin/                   # Admin portal (isolated from [lang])
│   │   ├── login/               # Password entry form
│   │   ├── layout.tsx           # Admin layout (English, noindex)
│   │   └── page.tsx             # Waitlist records viewer + CSV export
│   ├── favicon.ico, icon.svg    # Brand icons
│   ├── globals.css              # Global styles, Tailwind v4 @theme, font assignments
│   ├── layout.tsx               # Root layout wrapper
│   ├── page.tsx                 # Root redirect to /ar
│   ├── robots.ts                # SEO robots.txt generator
│   └── sitemap.ts               # XML sitemap generator
├── brand/                       # Brand graphics, approved logos, references
├── brand-guidelines/            # 5 comprehensive brand strategy & design markdown specs
├── components/                  # React components
│   ├── admin/                   # AdminDashboard, AdminLoginForm
│   ├── home/                    # 9 homepage section components
│   ├── layout/                  # Header, Footer, PageWrapper
│   ├── maps/                    # SudanMap (geoBoundaries SVG post-2011)
│   ├── ui/                      # Button, Card, Badge, Input, Select, Skeleton
│   └── waitlist/                # WaitlistForm (client form + server action)
├── config/                      # Feature modules (`modules.ts`) and SEO metadata (`seo.ts`)
├── design-system/               # Master tokens (`tokens.css`) and UI specs (`components.md`)
├── government-kit/              # Corporate stationery and proposal templates
├── investor-kit/                # Investor pitch formatting guidelines
├── lib/                         # Application logic
│   ├── actions/                 # Server actions (`waitlist.ts`)
│   ├── admin/                   # Admin authentication & session helpers (`actions.ts`, `auth.ts`)
│   ├── auth/                    # Conceptual permissions (`permissions.ts`)
│   ├── email/                   # Resend transactional email templates (`send.ts`)
│   ├── fonts.ts                 # next/font Google loaders (Cairo, Geist)
│   ├── i18n/                    # Dictionaries (ar.json, en.json), getDictionary, config
│   ├── mock-data/               # In-memory arrays (crops, marketplace, statistics, weather)
│   ├── services/                # Read-only service wrappers over mock data
│   ├── supabase/                # Supabase server client and waitlist admin queries
│   └── utils.ts                 # Styling and localization formatters
├── marketing-kit/               # Social banners and collateral specs
├── public/                      # Static assets (logo.png, manifest.json, sudan-outline.svg)
├── types/                       # TypeScript definitions (crop, marketplace, roles, user, weather)
├── product-vision-deck-v2.html  # 24-slide standalone pitch deck (Current)
├── product-vision-deck.html     # Superseded v1 deck
├── proxy.ts                     # Next.js 16 request proxy (locale redirect & admin auth guard)
└── tsconfig.json, vitest.config.ts, eslint.config.mjs
```

---

## Phase 2 — Route Inventory

Every route was discovered programmatically from the file tree and confirmed by the Next.js build output.

| Route | AR Equivalent | EN Equivalent | Protection | Status | Type | Data Source | Main Purpose |
|---|---|---|---|---|---|---|---|
| `/` | Redirects to `/ar` | Redirects to `/en` | Public | [VERIFIED FACT] Implemented | Static | Local config | Root redirect to default locale (`/ar`) |
| `/[lang]` | `/ar` | `/en` | Public | [VERIFIED FACT] Implemented | SSG (Static) | In-memory mocks (`crops`, `weatherData`, `listings`) | Main landing page: 9 sections (Hero, Mission, Stats, Crop Snapshot, Weather, AI Preview, Marketplace Preview, Future Vision, CTA) |
| `/[lang]/about` | `/ar/about` | `/en/about` | Public | [VERIFIED FACT] Implemented | SSG (Static) | Dictionary (`ar.json`, `en.json`) | Mission, company values, founder contact |
| `/[lang]/contact` | `/ar/contact` | `/en/contact` | Public | [VERIFIED FACT] Implemented | SSG (Static) | Dictionary (`ar.json`, `en.json`) | Contact channels, email `sam@nexorayyc.io`, support info |
| `/[lang]/crops` | `/ar/crops` | `/en/crops` | Public | [VERIFIED FACT] Implemented | SSG (Static) | Mock array (`lib/mock-data/crops.ts`) | Crop Price Index table for 8 commodities |
| `/[lang]/login` | `/ar/login` | `/en/login` | Public | [MOCK] Placeholder | SSG (Static) | Dictionary | "Platform Launching Soon" placeholder page. Has CTA linking to `/register`. |
| `/[lang]/marketplace` | `/ar/marketplace` | `/en/marketplace` | Public | [MOCK] Partial Demo | SSG (Static) | Mock array (`lib/mock-data/marketplace.ts`) | Catalog of 8 mock items. Client-side search and category filtering. Contact button has no action. |
| `/[lang]/overview` | `/ar/overview` | `/en/overview` | Public | [MOCK] Simulated | SSG (Static) | Mock arrays (`crops.ts`, `marketplace.ts`) | "Farm Dashboard". Publicly visible, no user login. Slices mock listings, shows hardcoded KPI counts (3 alerts, 2 messages). |
| `/[lang]/privacy` | `/ar/privacy` | `/en/privacy` | Public | [VERIFIED FACT] Implemented | SSG (Static) | Dictionary (`ar.json`, `en.json`) | Legal Privacy Policy (describes waitlist data collection and Supabase storage) |
| `/[lang]/register` | `/ar/register` | `/en/register` | Public | [VERIFIED FACT] Implemented | SSG (Static) | Supabase `waitlist` table + Resend | Waitlist signup form (Name, Email, Role selector: Farmer, Trader, NGO, Government, Investor). |
| `/[lang]/terms` | `/ar/terms` | `/en/terms` | Public | [VERIFIED FACT] Implemented | SSG (Static) | Dictionary (`ar.json`, `en.json`) | Terms of Service (explicit pre-launch demo disclaimer, governing law: Sudan) |
| `/[lang]/weather` | `/ar/weather` | `/en/weather` | Public | [VERIFIED FACT] Implemented | SSG (Static) | Mock array (`lib/mock-data/weather.ts`) | Weather Intelligence page for 5 cities, 7-day static forecast |
| `/admin` | N/A (English only) | `/admin` | Protected (Cookie `za_admin`) | [VERIFIED FACT] Implemented | Dynamic (`force-dynamic`) | Supabase `waitlist` table | Waitlist viewer dashboard: filter by role, search, CSV export |
| `/admin/login` | N/A (English only) | `/admin/login` | Public | [VERIFIED FACT] Implemented | Static | Server action (`adminLogin`) | Single-password entry form for admin dashboard |
| `/robots.txt` | N/A | `/robots.txt` | Public | [VERIFIED FACT] Implemented | Static | `app/robots.ts` | Allows all public paths, disallows `/admin`, points to sitemap |
| `/sitemap.xml` | N/A | `/sitemap.xml` | Public | [VERIFIED FACT] Implemented | Static | `app/sitemap.ts` | Generates 16 URLs (ar + en for 8 routes). Missing `/crops`, `/overview`, `/login`. |

### Specific Route Checks (User-Requested)
- `/`: Exists. Redirects to `/ar`. [VERIFIED FACT]
- `/ar` and `/en`: Exist and render full home landing page. [VERIFIED FACT]
- `marketplace`: Exists at `/[lang]/marketplace`. [VERIFIED FACT]
- `weather`: Exists at `/[lang]/weather`. [VERIFIED FACT]
- `about`: Exists at `/[lang]/about`. [VERIFIED FACT]
- `platform`: **DOES NOT EXIST** (returns 404). [MISSING]
- `solutions`: **DOES NOT EXIST** (returns 404). [MISSING]
- `government`: **DOES NOT EXIST** (marked `coming-soon` in config, returns 404). [MISSING]
- `ngo` / `ngos`: **DOES NOT EXIST** (marked `coming-soon` in config, returns 404). [MISSING]
- `investors`: **DOES NOT EXIST as a web route** (exists only as standalone HTML deck `product-vision-deck-v2.html`). [MISSING]
- `resources`: **DOES NOT EXIST** (returns 404). [MISSING]
- `contact`: Exists at `/[lang]/contact`. [VERIFIED FACT]
- `login`: Exists at `/[lang]/login` as a "Launching Soon" placeholder. [MOCK]
- `register`: Exists at `/[lang]/register` as a Waitlist form. [VERIFIED FACT]
- `dashboard`: Conceptual alias in `constants.ts` pointing to `/overview`. [MOCK]
- `farmer dashboard`: Does not exist as a dedicated role-authenticated page; simulated in `/overview`. [MOCK]
- `trader dashboard`: **DOES NOT EXIST**. [MISSING]
- `admin`: Exists at `/admin` (waitlist viewer only). [VERIFIED FACT]
- `ai-advisor`: **DOES NOT EXIST** (homepage card only, returns 404). [MISSING]
- `privacy`: Exists at `/[lang]/privacy`. [VERIFIED FACT]
- `terms`: Exists at `/[lang]/terms`. [VERIFIED FACT]

---

## Phase 3 — UI & Design System

### Design Token Architecture
1. **`design-system/tokens.css`**: Complete enterprise brand token definition covering `--za-green-*`, `--za-navy-*`, `--za-sand-*`, `--za-earth-*`, `--za-gold-*`, `--za-teal-*`, neutral grayscale, semantic states, border radii, shadows, and spacing.
2. **`app/globals.css`**: Correctly imports `@import "../design-system/tokens.css";` and maps tokens into Tailwind CSS v4's `@theme` directive (`--color-primary: #0D3B1E;`, `--color-secondary: #4CAF50;`, `--color-navy: #0F2D5E;`, etc.).
3. **No Competing Design Systems Detected**: There is only one unified design token source. Legacy or conflicting CSS frameworks are not present.

### Typography System Divergence
- **Brand Guidelines Spec (`03-typography-system.md`):**  
  - English: `Inter Variable` (fallback: Arial)  
  - Arabic: `IBM Plex Arabic` (fallback: Noto Sans Arabic)
- **Actual Code Implementation (`lib/fonts.ts` & `globals.css`):**  
  - English: `Geist` (Google font via `next/font/google`)  
  - Arabic: `Cairo` (Google font via `next/font/google`)  
  - *Code Annotation in `globals.css`:* `/* Typography (v0.1 — IBM Plex Arabic / Inter deferred to v0.2) */`
  - *Evaluation:* Cairo is well-suited for Arabic web interfaces and displays properly, but it deviates from the formal Brand Guidelines. In contrast, `product-vision-deck-v2.html` correctly uses Inter and IBM Plex Arabic.

### Global CSS Anomalies
- **`app/globals.css` lines 61–63:**
  ```css
  * {
    transition: none;
  }
  ```
  [VERIFIED FACT] All CSS transitions and animations across the entire application are globally disabled. Hover states on buttons, cards, and links snap immediately rather than transitioning smoothly.

### Component Verification
- **Header (`components/layout/header.tsx`):** Sticky, responsive, contains official transparent logo, desktop links (Home, Marketplace, Weather, About), locale switcher, and CTA buttons (Login, Register). Mobile hamburger drawer works.
- **Footer (`components/layout/footer.tsx`):** 3-column responsive layout, official logo, brand positioning statements, navigation links, contact email (`sam@nexorayyc.io`), demo badge, and copyright notice.
- **Hero Section (`components/home/hero-section.tsx`):** Implements the split-screen design from `brand/ref.png`. Content side has transparent logo (`logo2-transparent.png`), headline, supporting text, 4 KPI stats, and 2 CTA buttons. The dark side hosts the interactive SVG Sudan map.
- **Sudan Map (`components/maps/SudanMap.tsx`):** High-precision SVG path based on geoBoundaries SDN ADM0 post-2011 boundaries (South Sudan excluded). Accurately traces the Main Nile, Blue Nile, White Nile, and Atbara rivers, with coordinates for 7 key agricultural hubs.

---

## Phase 4 — Internationalization (i18n)

### Core Mechanics
- **Default Locale:** Arabic (`ar`). Configured in `lib/i18n/config.ts`. [VERIFIED FACT]
- **Supported Locales:** `['ar', 'en']`. [VERIFIED FACT]
- **RTL / LTR Handling:** Handled in `app/[lang]/layout.tsx` via `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`. Tailwind logical properties (`start-`, `end-`, `ps-`, `pe-`, `text-start`, `text-end`) are used throughout components. [VERIFIED FACT]
- **Language Switcher:** In Header, cleanly switches pathname between `/ar/...` and `/en/...`. [VERIFIED FACT]
- **Dictionary Architecture:** JSON files `lib/i18n/dictionaries/ar.json` (252 lines) and `en.json` (252 lines), loaded asynchronously via dynamic imports in `lib/i18n/getDictionary.ts`. [VERIFIED FACT]

### String & Glyph Integrity
- **Reversed Strings:** No reversed Arabic characters or corrupted bidirectional strings were found. Words such as `زرعتي`, `القضارف`, `كسلا`, `البحر الأحمر`, `الذرة`, `السمسم` are stored in correct logical Unicode order. [VERIFIED FACT]

### i18n Technical Debt & Flaws Found
1. **Extensive Hardcoded Strings Bypassing Dictionary:**
   - In `app/[lang]/crops/page.tsx`: Category labels (`حبوب`, `Grain`, `زيتية`, `Oilseed`), table headers (`الفئة`, `آخر تحديث`), and footer notice (`أسعار تجريبية لأغراض العرض فقط`) are hardcoded ternary expressions rather than dictionary references.
   - In `app/[lang]/marketplace/page.tsx`: Almost the entire UI ignores `dict.marketplace`. The page title, subtitle, search placeholder, category tabs (`الكل`, `المحاصيل`, etc.), empty state message, card labels (`البائع`, `الموقع`, `الكمية`), and the "Contact" button (`تواصل` / `Contact`) are all hardcoded ternaries inside the component.
   - In `components/layout/footer.tsx`: Brand descriptions, section headings (`الروابط`, `Links`), and legal links are hardcoded ternaries.
   - In `components/home/hero-section.tsx`: Map legend items (`النيل`, `مدن زراعية`, `الجزيرة`) are hardcoded in the component.
2. **Admin Portal Is Not Localized:**
   `app/admin/layout.tsx` hardcodes `<html lang="en">`. The login page is English-only. The dashboard has an internal dictionary object `DICT` with Arabic translations, but it is entirely independent of the `lib/i18n` dictionary system.
3. **Spelling Inconsistency in Port Sudan:**
   - In `lib/mock-data/weather.ts`: `cityAr: 'بور سودان'` (two words with 'و').
   - In `components/maps/SudanMap.tsx`: `labelAr: 'بورتسودان'` (standard Sudanese single-word spelling).

---

## Phase 5 — Data Layer

Every data entity in the project was audited for its origin:

| Entity | Classification | Storage / Origin | Notes |
|---|---|---|---|
| **Farmers** | [MOCK] / [PLANNED] | `lib/mock-data/marketplace.ts` | 4 hardcoded sellers: Ahmed Mohammed, Hassan Ibrahim, Fatima Ahmed, Omar Salih. Fake phone numbers (`+249912345678`). |
| **Traders** | [MISSING] | None | No trader records, accounts, or profiles exist anywhere in code. |
| **Farms** | [MISSING] | None | Farm size, parcel coordinates, and soil data exist only as conceptual TypeScript types in `types/user.ts`. |
| **Crops** | [MOCK] | `lib/mock-data/crops.ts` | 8 static commodities: Sorghum, Millet, Sesame, Groundnuts, Cotton, Wheat, Gum Arabic, Sunflower. |
| **Crop Prices** | [MOCK] | `lib/mock-data/crops.ts` | Static SDG prices per ton. 7-day history generated by synthetic formula: `Math.round(base * (1 + (i - 3) * 0.005))`. |
| **Weather** | [MOCK] | `lib/mock-data/weather.ts` | 5 cities. Static temperatures, humidity, wind, and 7-day forecast with timestamps fixed to June 9–15, 2026. |
| **Marketplace Listings** | [MOCK] | `lib/mock-data/marketplace.ts` | 8 static listings (2 crops, 2 equipment, 2 seeds, 2 fertilizer). |
| **Messages / Inquiries** | [MISSING] | Static number in UI | `/overview` displays hardcoded number `2` for messages with no backing data. |
| **Government Statistics** | [MOCK] | `lib/mock-data/statistics.ts` | 5 hardcoded KPIs: 15M farmers, 45M hectares, 35% GDP, $2.8B exports, #1 sesame ranking. |
| **NGO Data** | [MISSING] | None | Zero records, zero schemas. |
| **Waitlist Signups** | [VERIFIED FACT] Real | Supabase `waitlist` table | Name, email, role, language, created_at. |

---

## Phase 6 — Database & Supabase

### Findings
- **Database Engine:** Supabase PostgreSQL via `@supabase/supabase-js`.
- **Client Configuration:**
  - `lib/supabase/server.ts`: Initializes `createServerClient()` using `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY` with `auth: { persistSession: false }`.
- **Tables Referenced in Code:**
  - Exactly **ONE** table exists across the entire project: `'waitlist'`.
  - Queried in `lib/supabase/admin.ts` (`.select('*').order('created_at', { ascending: false })`).
  - Inserted into in `lib/actions/waitlist.ts` (`.insert({ name, email, role, language })`).
- **Database Schema Files:**
  - **Zero SQL files or migration scripts exist in the repository.**
  - Schema must be inferred from TypeScript:
    ```sql
    CREATE TABLE waitlist (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      language TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    ```
- **RLS & Security Assumptions:**
  The server client uses `SUPABASE_SERVICE_ROLE_KEY`. This bypasses Row Level Security (RLS) entirely on the server side.
- **Database Overall Status:**
  **CONFIGURED BUT UNPROVISIONED LOCALLY**. The code is written for the waitlist, but no local `.env.local` is present in the repository to run live database queries during development. All other platform domains have no database backing whatsoever.

---

## Phase 7 — Authentication & Authorization

| Capability | Status | Implementation Details |
|---|---|---|
| **User Registration** | [MOCK] / Waitlist only | `/[lang]/register` collects waitlist interest. No user password, no account record created, no auth user in Supabase. |
| **User Login** | [MISSING] | `/[lang]/login` is a static placeholder page with no input fields. |
| **User Logout** | [MISSING] | No user session exists to log out from. |
| **Session Management** | [MISSING] | No JWT, cookies, or session tokens for standard users. |
| **Password Reset** | [MISSING] | Completely absent. |
| **Email Verification** | [MISSING] | Completely absent. |
| **Admin Login** | [VERIFIED FACT] Implemented | Single shared password (`ADMIN_PASSWORD`). Authenticates via server action `adminLogin()` with timing-safe HMAC check. Sets cookie `za_admin`. |
| **Admin Route Guard** | [VERIFIED FACT] Implemented | In `proxy.ts`: intercepts all `/admin` routes (except `/admin/login`). Checks cookie `za_admin` against HMAC hash. |
| **Role-Based Access (RBAC)** | [PLANNED] / Unused | `lib/auth/permissions.ts` defines `ROLE_PERMISSIONS` for Farmer, Trader, NGO, Government, Admin, and function `hasPermission()`. **Neither is imported or called anywhere in the application.** |

---

## Phase 8 — Farmer Experience Audit

- **Profile & Account:** [MISSING] (No onboarding, no state/locality selection, no farm size tracking).
- **Market Prices:** [MOCK] (Can view the 8 static crop prices on `/crops` or home snapshot).
- **Weather Intelligence:** [MOCK] (Can view the 5 static cities on `/weather`).
- **Crop Listings Management:** [MOCK] (Farm dashboard `/overview` shows 4 mock listings; the "Add Listing" button merely redirects to `/marketplace` with no form).
- **Agricultural Guide / Advisory:** [MISSING] (No agronomy tips, no planting calendar).
- **AI Advice:** [MISSING] (Home section is a preview badge only).
- **SMS Alerts:** [MISSING] (No SMS gateway or phone number verification).
- **Overall Farmer Completion:** **10% (UI View Only)**

---

## Phase 9 — Trader Experience Audit

- **Trader Registration / Vetting:** [MISSING] (Waitlist dropdown role only).
- **Trader Profile:** [MISSING].
- **Search & Filter Crops:** [MOCK] (Can filter the 8 mock items by category on `/marketplace`).
- **Filter by State / Region:** [MISSING] (No location filter implemented in UI).
- **Seller Details:** [MOCK] (Displays hardcoded seller names and fake phone numbers).
- **Purchase Request / Order:** [MISSING] (Clicking "Contact" does nothing; no click handler).
- **In-Platform Messaging:** [MISSING].
- **Procurement & Logistics:** [MISSING].
- **Overall Trader Completion:** **5% (Read-only mock catalog)**

---

## Phase 10 — Marketplace Audit

- **Type:** Static UI Demo driven by in-memory mock data.
- **Create Listing:** [MISSING] (No form, no API, no database table).
- **Edit / Close Listing:** [MISSING].
- **Search:** Client-side substring match on listing title. [VERIFIED FACT]
- **Filtering:** 4 category tabs (`crops`, `equipment`, `seeds`, `fertilizer`). [VERIFIED FACT]
- **Location Filtering:** [MISSING].
- **Pricing & Units:** SDG per ton / unit / bag / day displayed correctly with formatting. [VERIFIED FACT]
- **Transaction Capability:** [MISSING] (No checkout, escrow, or payment gateway).
- **Inquiry / Farmer Response:** [MISSING] (Inert contact button).
- **Moderation & Disputes:** [MISSING].
- **Overall Marketplace Completion:** **15% (UI catalog shell only)**

---

## Phase 11 — Market Prices Audit

- **Source:** Hardcoded array `crops` in `lib/mock-data/crops.ts`. [MOCK]
- **Crop Coverage:** 8 crops (Sorghum, Millet, Sesame, Groundnuts, Cotton, Wheat, Gum Arabic, Sunflower).
- **Markets Covered:** Gedaref, El Obeid, Kassala, Gezira, Khartoum, Sennar.
- **History Generation:** Algorithmic approximation around base price.
- **External Integration:** None. (`MOCK_DATA_REGISTRY.md` notes Sudan Commodity Exchange / FAO AMIS as future targets).
- **Overall Price Module Completion:** **20% (Display component and types exist; data pipeline is 0%)**

---

## Phase 12 — Weather Audit

- **Source:** Hardcoded array `weatherData` in `lib/mock-data/weather.ts`. [MOCK]
- **Geographic Coverage:** 5 cities (Khartoum, Kassala, Gedaref, Port Sudan, El Obeid).
- **Forecast Period:** 7 days fixed to June 2026.
- **External Integration:** None. (`MOCK_DATA_REGISTRY.md` notes OpenWeatherMap / Meteomatics as future targets).
- **Overall Weather Module Completion:** **20% (Display component exists; data pipeline is 0%)**

---

## Phase 13 — AI Advisor Audit

- **AI Provider / LLM Integration:** [MISSING] (Zero SDKs installed; no OpenAI, Anthropic, or Google Gemini code).
- **Prompt Architecture:** [MISSING].
- **Context Injection (Farm / Weather / Soil):** [MISSING].
- **Image Upload / Pest & Disease Detection:** [MISSING].
- **Conversation History:** [MISSING].
- **Current Repo State:** Component `components/home/ai-preview.tsx` renders a marketing card with a "Coming Soon" (`قريباً`) badge.
- **Overall AI Module Completion:** **0% (Pure Marketing Concept)**

---

## Phase 14 — SMS / Offline Audit

- **SMS Provider:** [MISSING] (No Twilio, Africa's Talking, or local Sudanese telco APIs like Zain, MTN, or Sudani).
- **SMS Queue / Templates / Mock Sender:** [MISSING].
- **Service Worker / Offline Web:** [MISSING] (`public/manifest.json` exists, but no service worker is registered).
- **Overall SMS / Offline Completion:** **0% (Pitch Deck Concept Only)**

---

## Phase 15 & 16 — Government & NGO Experience Audit

- **Government Dashboard:** [MISSING] (No route, no backend, returns 404).
- **Food Security & State Production Analytics:** [MISSING].
- **NGO Dashboard & Beneficiary Tracking:** [MISSING] (No route, no backend, returns 404).
- **Gender-Disaggregated Metrics / SDG Reporting:** [MISSING].
- **Report Export (ODK, PDF, Excel):** [MISSING].
- **Overall Government & NGO Completion:** **0% (Slide 13 & 14 in pitch deck only)**

---

## Phase 17 — Investor Experience Audit

- **Investor Webpage:** [MISSING] (No `/[lang]/investors` page on the website).
- **Product Vision Deck (`product-vision-deck-v2.html`):**  
  - [VERIFIED FACT] 24 interactive HTML slides with presentation scaling, keyboard controls, Chart.js graphs, and bilingual design.
  - Covers: Problem, crisis context, ground reality, dual-government political reality (SAF vs RSF), market size ($420M TAM), product roadmap, stakeholder architecture, unit economics ($3.5M Seed ask, 72% SaaS margin, 22:1 LTV:CAC), Gedaref/Kassala/Red Sea rollout plan, founder profile, and Vision 2035.
- **Founder Information:**
  - Founder: Sami Suliman Eltayeb.
  - Slide 11 & Slide 23 detail 20+ years of logistics, enterprise procurement, and technology sales experience.
- **Contact Email Verification:**
  - [VERIFIED FACT] Verified across all 22 occurrences in the project (decks, footer, contact page, privacy policy, terms, email senders): `sam@nexorayyc.io`.
  - **Zero outdated email addresses detected.**

---

## Phase 18 — Admin Portal Audit

- **Location:** `/admin` (protected) and `/admin/login` (public).
- **Capabilities Implemented:**
  - Single-password access protected by HTTP-only secure cookie `za_admin`.
  - Fetches waitlist signups in real time from Supabase.
  - KPI summary tiles (Total Signups, Farmers, Traders, NGOs, Government, Investors).
  - Search by name or email.
  - Filter by role.
  - One-click CSV export with UTF-8 BOM encoding.
- **Capabilities Missing:**
  - User and account management.
  - Farmer / trader credential verification and document approval.
  - Marketplace listing moderation (flagging, approving, removing).
  - Price bulletin input / manual market price updates.
  - Audit logging.
- **Overall Admin Completion:** **25% (Waitlist management only; zero platform administration)**

---

## Phase 19 — Security Audit

1. **Secrets Exposure:** [PASS] No secrets, private keys, or passwords committed to Git. All credentials read via `process.env`.
2. **Timing-Attack Resistance:** [PASS] Admin password comparison in `lib/admin/actions.ts` and `lib/admin/auth.ts` uses `crypto.timingSafeEqual()`.
3. **Session Cookie Security:** [PASS] Cookie `za_admin` is set with `httpOnly: true`, `sameSite: 'strict'`, `path: '/'`, and `secure: true` in production.
4. **Brute Force & Rate Limiting:** [FAIL - P0] No rate limiting exists on `/admin/login` or the `submitWaitlist` server action. Both are susceptible to brute-force or spamming.
5. **Bot Protection:** [FAIL - P1] `WaitlistForm` has no CAPTCHA or honeypot field.
6. **HTTP Security Headers (`next.config.ts`):**
   - Implemented: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.
   - Missing: `Content-Security-Policy` (CSP), `Strict-Transport-Security` (HSTS), `Permissions-Policy`.
7. **Database Access & RLS:**
   - Server client uses `SUPABASE_SERVICE_ROLE_KEY`. This is acceptable for server actions, but it completely bypasses Supabase RLS. If public client queries are introduced later, proper RLS policies will be critical.

---

## Phase 20 — Legal & Privacy

- **Privacy Page (`/[lang]/privacy`):** Fully bilingual, professional draft disclosing waitlist data collection, Supabase hosting, GDPR compliance intent, data retention, and rights contact (`sam@nexorayyc.io`). [VERIFIED FACT]
- **Terms Page (`/[lang]/terms`):** Fully bilingual, explicitly establishes that the platform is in pre-launch demo status, all commodity prices and listings are simulations, and disclaims financial liability. Specifies Sudanese governing law. [VERIFIED FACT]
- **Disclaimers:** Demo badges (`بيانات تجريبية` / `Demo Data`) are consistently attached to tables and cards on all mock pages. [VERIFIED FACT]

---

## Phase 21 — SEO & Web Quality

- **Metadata Factory (`config/seo.ts`):** Properly defines default and template titles, OpenGraph (`ar_SD` / `en_US`), Twitter cards, and `metadataBase: new URL('https://zarati.sd')`. [VERIFIED FACT]
- **Robots (`app/robots.ts`):** Allows public routes, blocks `/admin`, references sitemap. [VERIFIED FACT]
- **Sitemap (`app/sitemap.ts`):** Generates 16 bilingual URLs.  
  *Defect:* Does not include `/crops`, `/overview`, or `/login`.
- **Accessibility:** Alt text is present on images; SVG maps include `role="img"` and `aria-label`. Contrast on dark green `#0D3B1E` and leaf green `#4CAF50` complies with WCAG AA.
- **Image Optimization:** Uses `next/image` for logo and brand assets with explicit width/height.

---

## Phase 22 — Deployment Configuration

- **Platform:** Vercel (linked via `.vercel/project.json`).
- **Build Command:** `npm run build` (`next build`).
- **Production URL in Config:** `https://zarati-platform.vercel.app` (email templates) and `https://zarati.sd` (SEO metadata).
- **Required Production Environment Variables:**
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_PASSWORD`
  - `SITE_URL`
  - `RESEND_API_KEY`
  - `RESEND_FROM`
  - `ADMIN_EMAIL`
- **Deployment Status:** **READY FOR DEPLOYMENT AS A WAITLIST / MARKETING SITE**. Will fail runtime database operations if environment variables are omitted on Vercel.

---

## Phase 23 — Testing Verification

The validation suite was run directly on the live repository:

```bash
# 1. ESLint Check
$ npm run lint
> zarati@0.1.0 lint
> eslint
# Result: Exit code 0 (0 errors, 0 warnings)

# 2. Vitest Test Suite
$ npm run test:run
> zarati@0.1.0 test:run
> vitest run
 Test Files  4 passed (4)
      Tests  37 passed (37)
   Duration  27.69s
# Result: Exit code 0 (All 37 tests green)
# Breakdown:
#   - crop-service.test.ts: 7 tests passed
#   - marketplace-service.test.ts: 9 tests passed
#   - weather-service.test.ts: 10 tests passed
#   - utils.test.ts: 11 tests passed

# 3. Production Build
$ npm run build
> zarati@0.1.0 build
> next build
▲ Next.js 16.2.9 (Turbopack)
✓ Compiled successfully in 6.0s
  Finished TypeScript in 4.9s ...
✓ Generating static pages using 15 workers (30/30) in 550ms
# Result: Exit code 0 (Clean SSG build)
```

---

## Phase 24 — Technical Debt & Dead Code Inventory

1. **Unused UI Components:**
   - `components/ui/select.tsx`: Exported from `components/ui/index.ts`, but never used in any page (the waitlist form uses a native `<select>`).
   - `components/ui/skeleton.tsx`: Exported, but never imported or rendered.
2. **Dead Auth Definitions:**
   - `lib/auth/permissions.ts`: `ROLE_PERMISSIONS` and `hasPermission` are never imported or invoked.
   - `types/user.ts`: Detailed interfaces (`FarmerUser`, `TraderUser`, `GovUser`, `NGOUser`) are completely disconnected from the actual application.
3. **Unused Asset Files:**
   - `public/maps/sudan-outline.svg` and `public/maps/sudan-path.txt`: Superseded by `components/maps/SudanMap.tsx`.
   - `brand/logo1.png`, `brand/1.png`, `brand/logo-ts.png`: Intermediate assets superseded by `brand/logo2-transparent.png`.
   - `product-vision-deck.html`: v1 deck (110KB) superseded by `product-vision-deck-v2.html` (153KB).
4. **Disabled Transitions Quirk:**
   - `app/globals.css`: `* { transition: none; }` blocks all smooth UI interactions.
5. **Hardcoded Module Flags:**
   - `config/modules.ts`: `MODULES` array defines statuses, but `isModuleActive()` is never queried by the navigation bar or router.

---

## Summary Scorecard & Completion Metrics

| Module / Layer | Completion % | Truth Status |
|---|---|---|
| **Website & Brand Shell** | **85%** | Highly polished UI, fully responsive, bilingual, passes all builds. |
| **Marketplace** | **15%** | Static UI demo with in-memory filter. Zero CRUD, zero transactions. |
| **Market Prices Module** | **20%** | Display table complete; data is in-memory mock with static June 2026 prices. |
| **Weather Intelligence Module** | **20%** | Display component complete; data is in-memory mock for 5 cities. |
| **Authentication & RBAC** | **15%** | Admin password gate works; user authentication is 0% (placeholder login page). |
| **Backend & Database** | **10%** | Supabase connected for waitlist table only. Zero business schemas or migrations. |
| **Farmer Dashboard & Management** | **10%** | Public simulated dashboard (`/overview`); zero profile/farm capabilities. |
| **Trader Experience** | **5%** | Read-only catalog viewing; contact button inert. |
| **Government Portal** | **0%** | Pure pitch deck / marketing concept. |
| **NGO Portal** | **0%** | Pure pitch deck / marketing concept. |
| **AI Advisor** | **0%** | Pure pitch deck / marketing concept. |
| **SMS / Offline Fallback** | **0%** | Pure pitch deck / marketing concept. |
| **Deployment Readiness** | **85%** | Can deploy immediately as a high-converting waitlist & marketing site. |
| **MVP Completion (Functional)** | **20%** | Core AgriTech workflows (auth, listings, live prices, contact) do not yet exist. |
| **Overall Project Completion** | **28%** | World-class foundation and brand shell; functional backend needs to be built. |

- **Number of P0 Blockers (Blocks deployment as real MVP):** **4** (No user auth, no real database tables, no listings CRUD, no rate limiting).
- **Number of P1 Blockers (Required for production pilot):** **7** (Live weather API, live price data pipeline, trader contact flow, admin moderation, bot protection, sitemap completeness, CSP headers).
- **Recommended Immediate Next Phase:** **Phase R0 (Stabilization & Local Env Parity) followed immediately by Phase R1 (Database Schema Creation in Supabase).**
