# ZARATI V1 AUTHORITATIVE PHASE MAP

## R1: Data Foundation
- **Mission**: Establish core schema, row-level security, and session management.
- **Status**: **LIVE**
- **Existing Capabilities**: Core schema, RLS policies, extensions, standard structures.
- **Missing Capabilities**: None required for V1.
- **Dependencies**: None.
- **Exit Criteria**: Secured database accessible via API. (Met)
- **Production Gate**: Database provisioned. (Passed)
- **Risk**: Low.

## R2: Identity & Security
- **Mission**: Robust authentication, profile management, trader provisioning.
- **Status**: **LIVE**
- **Existing Capabilities**: Supabase Auth, JWT verification, profile tracking.
- **Missing Capabilities**: None required for V1.
- **Dependencies**: R1.
- **Exit Criteria**: Secure sign-in and user states. (Met)
- **Production Gate**: Auth flows active. (Passed)
- **Risk**: Low.

## R3: Marketplace & RFQ
- **Mission**: Farmer-Trader listings, bidirectional matching, secure bilateral reveal.
- **Status**: **LIVE**
- **Existing Capabilities**: Listings, inquiries, state management, contact reveal.
- **Missing Capabilities**: None required for V1 core loop.
- **Dependencies**: R2.
- **Exit Criteria**: End-to-end commercial interaction possible. (Met)
- **Production Gate**: Production traffic enabled. (Passed)
- **Risk**: Low.

## R4: Market Intelligence
- **Mission**: Historical data ingestion, public feeds, metric normalization, pricing telemetry.
- **Status**: **LIVE**
- **Existing Capabilities**: WFP feed, MET Norway weather, normalization to SDG/kg and SDG/MT, full frontend Intelligence Experience (EN/AR). 5,663 observations processed.
- **Missing Capabilities**: None required for V1.
- **Dependencies**: R1.
- **Exit Criteria**: Accurate normalized price UI accessible by public. (Met)
- **Production Gate**: Frontend deployment successful. (Passed)
- **Risk**: Low.

## R5: Operations & Verification
- **Mission**: System administration, feed health tracking, manual data QA, operator consoles.
- **Status**: **ACTIVE** (Infrastructure complete, UI missing)
- **Existing Capabilities**: Feed execution ledger, leases, conflict quarantine, immutability, audit lineage (all implemented in R4-B).
- **Missing Capabilities**: Operator UI console, data review/correction queue workflow, manual approval workflow.
- **Dependencies**: R4 for feeds.
- **Exit Criteria**: Internal admins can view and resolve quarantine conflicts without raw SQL.
- **Production Gate**: Operator access secured by role.
- **Risk**: Medium.

## R6 & R7: Institutional Intelligence
- **Mission**: Secure, high-level dashboards for executive / ministerial monitoring and reporting.
- **Status**: **PLANNED**
- **Existing Capabilities**: None distinct from R4.
- **Missing Capabilities**: Federal/state aggregated views, commodity supply analytics, food-security indicators, secure export tools.
- **Dependencies**: R4.
- **Exit Criteria**: Aggregated dashboard deployable for institutional demo.
- **Production Gate**: Strict role separation from public data.
- **Risk**: Medium.

## R8: Agronomic Intelligence
- **Mission**: Actionable planting, weather, and yield advisory for farmers.
- **Status**: **VISION**
- **Existing Capabilities**: MET Norway weather foundational data.
- **Missing Capabilities**: Crop calendars, risk indicators, verifiable advisory content.
- **Dependencies**: R4 (Weather).
- **Exit Criteria**: Not required for V1 core.
- **Production Gate**: N/A for V1.
- **Risk**: High (Content verification).

## R9: Low-Bandwidth Access
- **Mission**: Offline-first or ultra-lightweight access for extreme rural environments.
- **Status**: **VISION**
- **Existing Capabilities**: Basic responsive web app.
- **Missing Capabilities**: PWA shell, queued synchronization, robust offline caching.
- **Dependencies**: Core UX completion.
- **Exit Criteria**: Not required for initial V1 deployment, though highly desired for full rural penetration.
- **Production Gate**: N/A for V1.
- **Risk**: High (Technical complexity on 2G).

## R10: Geospatial Intelligence
- **Mission**: Map-based analytics, visual commodity distribution.
- **Status**: **VISION**
- **Existing Capabilities**: None.
- **Missing Capabilities**: GIS overlays, map integrations, coordinate-based rendering.
- **Dependencies**: Significant frontend work.
- **Exit Criteria**: Not required for V1.
- **Production Gate**: N/A for V1.
- **Risk**: Medium.
