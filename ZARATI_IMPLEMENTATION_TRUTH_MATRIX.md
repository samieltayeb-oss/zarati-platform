# ZARATI IMPLEMENTATION TRUTH MATRIX

## Purpose
To provide an uncompromising, code-level assessment of every capability discussed in R2.5, mapping them strictly to their current technical reality to eliminate status inflation.

## Status Definitions

*   **LIVE**: Deployed to production and production verified.
*   **BUILT**: Implementation complete in repository/main, appropriate tests pass, but capability is not necessarily deployed or production-active.
*   **PARTIAL**: Some code/scaffolding/mock UI exists, but complete workflow is not functional.
*   **PLANNED**: Approved defined future phase/scope, with no complete implementation yet.
*   **VISION**: Longer-term strategic capability without immediate committed implementation.
*   **NOT OFFERED**: Intentionally excluded from current and near-term product scope.

## The Matrix

| Capability Category | Specific Feature | Claimed Status (R2.5) | Implementation Truth (R2.6) | Justification / Reality Check |
| :--- | :--- | :--- | :--- | :--- |
| **Infrastructure** | Vercel Hosting | LIVE | **LIVE** | Actively hosting the production application. |
| | Supabase Database | LIVE | **LIVE** | Provisioned, migrations run through 020. |
| | Upstash Redis | LIVE | **LIVE** | Active for rate limiting on auth endpoints. |
| **Security & Auth** | Multi-Role Auth | BUILT | **LIVE** | Registration, login, password reset functional in production. |
| | Email Confirmation | PLANNED | **LIVE** | Enforced in production; unverified users blocked. |
| | Row Level Security | BUILT | **LIVE** | Active on Profiles, protected by views. |
| **Marketplace (R3)** | Crop Listings | BUILT (Mock) | **PARTIAL** | UI mockups exist, but database schema/RLS for R3 not yet implemented. |
| | RFQ System | PLANNED | **PLANNED** | Zero code exists. Slated for R3. |
| | Escrow / Payments | PLANNED | **NOT OFFERED** | Explicitly excluded from R3/R4 scopes. |
| | Bankak Integration | PLANNED | **NOT OFFERED** | Explicitly excluded from near-term scope. |
| | Logistics Management | VISION | **NOT OFFERED** | Zarati does not own logistics. |
| **Intelligence (R4)** | Market Prices | BUILT (Mock) | **PLANNED** | Current UI uses hardcoded mock data. Real integration slated for R4. |
| | Basic Weather API Integration | PLANNED | **PLANNED** | Basic forecast, rainfall, temp ingestion with caching. Slated for R4-B. |
| | Advanced Hyper-local Agronomic Weather | PLANNED | **VISION** | Predictive agronomy, risk AI. Significant integration required. Not in immediate scope. |
| | AI Advisor | VISION | **VISION** | Requires substantial LLM infrastructure and verified agricultural data; no code exists. |
| | National Command Center | BUILT (Mock) | **VISION** | Complex analytical dashboard requires real data pipelines not yet built. |
| **Localization** | Arabic Translation (UI) | BUILT | **BUILT** | Static UI elements translated. User-generated content translation not implemented. |
| | Locale Routing | BUILT | **LIVE** | Middleware correctly routes `en` and `ar` paths. |
