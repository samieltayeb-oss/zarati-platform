# ZARATI R2.6: FOUNDER ARCHITECTURE FREEZE

## Executive Summary

Phase R2.6 executes the Founder Architecture Freeze, establishing the absolute ground truth of the Zarati platform's current implementation state. This phase corrects the strategic "status inflation" from the R2.5 Master Strategy dossiers, rigorously distinguishing between what is currently executing in production code and what is planned for future phases.

Zarati's architecture is now frozen at the **R2 Baseline**. All future development (R3, R4) will strictly adhere to the defined scopes outlined in this freeze, with zero assumptions of pre-existing functionality beyond the R2 verified state.

## The Principle of Implementation Truth (Universal Status Taxonomy)

To eliminate speculative or hyped terminology, all internal planning and external claims must adhere strictly to this universal taxonomy:

*   **LIVE**: Deployed to production and production verified.
*   **BUILT**: Implementation complete in repository/main, appropriate tests pass, but capability is not necessarily deployed or production-active.
*   **PARTIAL**: Some code/scaffolding/mock UI exists, but complete workflow is not functional.
*   **PLANNED**: Approved defined future phase/scope, with no complete implementation yet.
*   **VISION**: Longer-term strategic capability without immediate committed implementation.
*   **NOT OFFERED**: Intentionally excluded from current and near-term product scope.

## Current Verified Baseline (R2 Complete)

The following core infrastructure is VERIFIED LIVE in Production:

1.  **Vercel Production Environment:** Configured and active.
2.  **Supabase Production Database:** Fully provisioned and secured.
3.  **Database Migrations:** Schema initialized up to `020_r2_final_production_hardening.sql`.
4.  **Authentication (Multi-Role):** Registration, Email Confirmation (Enforced), Password Recovery, and Login for Farmers, Traders, and Admins.
5.  **Row Level Security (RLS):** Enforced across core tables (Profiles, Traders).
6.  **Public Views:** Safe abstraction layer (`public_traders`) deployed to prevent anonymous PII leakage.
7.  **Rate Limiting:** Upstash Redis rate limiting active on critical authentication endpoints.
8.  **Locale Management:** Next.js middleware and `proxy.ts` enforcing i18n routing and protected route access.

## Scope Locks

1.  **R3 (Marketplace Foundation):** Locked to a strictly lean scope (Discovery, Listings, RFQ). Explicitly excludes Escrow, Bankak integration, and Logistics.
2.  **R4 (Market Intelligence):** Locked to a phased rollout (R4-A through R4-E).
3.  **Gedaref Pilot:** Locked to a phased scaling model, prioritizing operational learning over guaranteed economic outcomes.

## Required Reading

This freeze is governed by the accompanying matrix and register documents, which mandate the allowed terminology and technical baseline for all future work.
