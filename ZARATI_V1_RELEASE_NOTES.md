# ZARATI V1.0.0 RELEASE NOTES

## Core Delivery
ZARATI V1.0.0 constitutes the complete functional foundation of the Sovereign Agricultural Intelligence Platform. All planned functional phases (R1 through R7) have been implemented, tested, and deployed to production.

## R1: Data Foundation [LIVE]
- Robust Supabase PostgreSQL schema with 30+ tables.
- Bitemporal tracking and immutable audit logging.
- Deterministic ingestion staging (`raw_ingestion_snapshots`).

## R2: Identity & Security [LIVE]
- Role-Based Access Control (RBAC) via Supabase Auth.
- Strict Row Level Security (RLS) policies.
- Six verified roles: farmer, trader, admin, government, ngo, investor.

## R3: Marketplace & RFQ [LIVE]
- Commercial listings for strategic crops.
- Bilateral reveal mechanisms for verified buyers.
- Contact disclosure tracking.

## R4: Market Intelligence [LIVE]
- WFP Sudan Market Monitor automated ingestion.
- Deterministic SDG/MT and SDG/KG normalization via verifiable calculation versions.
- MET Norway Gedaref weather integration.
- Public safe-views filtering 5,663 raw observations down to 102 verified public records.

## R5: Operations & Verification [LIVE]
- Operator command center for telemetry and ingestion health.
- Data quarantine and conflict resolution ledger visibility.
- Cryptographic provenance tracking for all records.

## R6 & R7: Institutional Intelligence & Ministerial Command [LIVE]
- Executive dashboard summarizing verified market data.
- Print-ready and exportable (CSV) public-safe datasets.
- Ministerial Presentation Mode for zero-friction demonstrations of Pilot capability.

## Deprecations & Blockers
- None. V1 deployment is clean. R8, R9, and R10 are deferred to V2 as planned.
