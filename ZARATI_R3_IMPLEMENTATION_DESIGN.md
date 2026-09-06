# ZARATI R3 IMPLEMENTATION DESIGN

## Overview
R3 is the Marketplace Discovery and Matching System. It provides the digital infrastructure for Farmers to signal supply and Traders to discover it. R3 relies heavily on the R2 security and authentication foundation.

## Core Tenets (Non-Goals)
*   **NO Payments or Escrow:** Zarati does not hold funds.
*   **NO Bankak Integration:** Off-platform settlement only.
*   **NO Logistics Management:** Zarati does not move physical goods.
*   **NO R4 Intelligence:** No automated FX or complex market APIs.

## Architecture
*   **Framework:** Next.js App Router.
*   **Database:** Supabase PostgreSQL.
*   **Mutations:** Next.js Server Actions with strict Zod validation and Supabase RLS enforcement.
*   **Views:** Safe public database views projection over base tables to prevent PII leakage. Anonymous raw-table SELECT on `listings` is entirely revoked.
*   **Styling:** Tailwind CSS (Arabic RTL native).

## Reusability Analysis
Based on forensic repository review, the following R1/R2 structures will be reused:
*   `listings`: Core schema exists. Will require minor ALTERs for R3 fields.
*   `listing_media`: Exists and is ready for use.
*   `inquiries`: Exists and maps perfectly to the RFQ (Request for Quote) requirement.
*   `moderation_events`: Exists and can track listing approvals/rejections.

By reusing these tables, we avoid schema duplication and technical debt.
