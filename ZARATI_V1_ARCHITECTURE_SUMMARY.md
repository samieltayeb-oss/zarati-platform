# ZARATI V1 ARCHITECTURE SUMMARY

## Stack
- **Framework**: Next.js 16.2 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL 15+
- **Authentication**: Supabase Auth (GoTrue)
- **Deployment**: Vercel (Edge computing capable)

## Core Architectural Decisions
1. **Bilingual RTL First**: `isAr` triggers native RTL text flow (`dir="rtl"`) and Cairo typography natively without CSS hacks.
2. **Bitemporal Auditing**: The ingestion ledger uses `observation_supersessions` to allow non-destructive updates to data. Nothing is deleted, ensuring cryptographically verifiable data provenance.
3. **Public/Private Split**: Market intelligence is strictly split between `raw_market_observations` (Internal staging) and `v_public_normalized_market_prices` (Public safe-view).
4. **Server Actions & Middleware**: Route protection happens at the server layer. No privileged keys (`SUPABASE_SERVICE_ROLE_KEY`) are exposed to the browser. Client components (`"use client"`) only handle interaction.
