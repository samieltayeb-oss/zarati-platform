# زرعتي | Zarati

**Sudan's National Smart Agriculture Platform**

Zarati connects Sudan's 15 million farmers to real-time crop prices, weather intelligence, and an agricultural marketplace — built Arabic-first, bilingual Arabic/English, RTL-native.

> بوابة الزراعة الذكية في السودان — أسعار آنية، طقس زراعي، سوق رقمي

---

## What it does

| Feature | Status |
|---------|--------|
| Homepage with live crop prices & weather | Live |
| Crop Price Index (8 crops, SDG prices) | Live (mock data) |
| Agricultural Marketplace | Live (mock data) |
| Weather Intelligence — 5 major cities | Live (mock data) |
| Farmer Dashboard | Live (mock data) |
| AI Advisor | Coming Soon |
| Microfinancing Portal | Coming Soon |
| NGO Dashboard | Coming Soon |
| Government Portal | Coming Soon |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 |
| UI | Custom design system (no external UI library) |
| Fonts | Cairo (Arabic) + Geist (Latin) — self-hosted via `next/font` |
| i18n | Manual `[lang]` routing — Arabic default, English supported |
| Testing | Vitest + jsdom |
| Data | Mock data layer (swap-ready for real APIs) |

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
git clone https://github.com/your-org/zarati.git
cd zarati
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/ar` (Arabic) by default.

Switch to English: [http://localhost:3000/en](http://localhost:3000/en)

### Available Scripts

```bash
npm run dev        # Start dev server (Turbopack)
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run test       # Vitest (watch mode)
npm run test:run   # Vitest (single run, for CI)
```

---

## Project Structure

```
zarati/
├── app/
│   ├── layout.tsx              # Root pass-through (imports globals.css)
│   ├── page.tsx                # Redirects / → /ar
│   └── [lang]/
│       ├── layout.tsx          # Locale layout: <html lang dir>, Header, Footer
│       ├── page.tsx            # Homepage (9 sections)
│       ├── crops/page.tsx      # Crop Price Index
│       ├── marketplace/page.tsx # Agricultural Marketplace
│       ├── weather/page.tsx    # Weather Intelligence
│       ├── overview/page.tsx   # Farmer Dashboard
│       └── about/page.tsx      # About Zarati
│
├── components/
│   ├── home/                   # Homepage section components
│   ├── layout/                 # Header, Footer, PageWrapper
│   └── ui/                     # Button, Badge, Card, Input, Select, Skeleton
│
├── lib/
│   ├── fonts.ts                # Cairo + Geist (self-hosted)
│   ├── utils.ts                # cn, formatCurrency, formatNumber, formatPercent
│   ├── constants.ts            # ROUTES, SUDAN_STATES, USE_MOCK
│   ├── i18n/                   # Locale config, getDictionary, ar.json, en.json
│   ├── mock-data/              # Crops, weather, marketplace, statistics
│   ├── services/               # Service layer (thin async wrappers over mock data)
│   └── auth/                   # Auth architecture (permissions matrix)
│
├── config/
│   ├── modules.ts              # Feature flags for all 7 platform modules
│   └── seo.ts                  # Bilingual metadata factory
│
├── types/                      # TypeScript types: Crop, Weather, Listing, User, Roles
├── proxy.ts                    # Locale detection middleware (Next.js 16 convention)
└── __tests__/                  # Vitest test suite (37 tests)
```

---

## Localization

- **Default locale:** Arabic (`/ar`) — redirected to automatically
- **English:** accessible at `/en`
- **RTL:** handled via `dir="rtl"` on `<html>` — Tailwind logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) used throughout
- **Fonts:** Cairo (Arabic subsets) and Geist (Latin) self-hosted at build time — zero CDN calls
- **Dictionaries:** `lib/i18n/dictionaries/ar.json` and `en.json`

---

## Design Tokens

Defined in `app/globals.css` using Tailwind v4's `@theme` block:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#1E7A46` | Brand green |
| `--color-secondary` | `#D4A017` | Gold accent |
| `--color-bg` | `#F8F8F8` | Page background |
| `--color-surface` | `#FFFFFF` | Card surface |
| `--color-text` | `#111827` | Body text |
| `--color-muted` | `#6B7280` | Secondary text |

---

## Mock Data

All data is mocked in `lib/mock-data/`. See [MOCK_DATA_REGISTRY.md](./MOCK_DATA_REGISTRY.md) for the full registry and swap schedule.

To toggle mock data: set `USE_MOCK` in `lib/constants.ts` (or `NEXT_PUBLIC_USE_MOCK` env var when env support is added).

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

Private — All rights reserved. © 2026 Zarati زرعتي
