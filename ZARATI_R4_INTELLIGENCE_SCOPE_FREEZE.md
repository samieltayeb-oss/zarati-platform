# ZARATI R4: INTELLIGENCE SCOPE FREEZE

## Objective
To replace mock data with verified, real-world agricultural intelligence, transitioning Zarati from a discovery platform to a critical data resource. This phase is highly complex and must be executed in strictly bounded sub-phases.

## Phased Rollout Plan

### R4-A: Institutional / Historical Data Foundation
*   WFP/FAO/FEWS NET where licensed/verified.
*   Manual/semi-automated ingestion.
*   Provenance and historical reliability.

### R4-B: Weather & Automated External Feeds
*   Basic weather APIs (forecast, rainfall, temperature).
*   Scheduled ingestion and caching.
*   Source health/failure handling.

### R4-C: FX & Unit Normalization
*   Historical FX law: never apply today's FX rate to historical prices.
*   Original value preservation.
*   Units normalization and auditable transformation.

### R4-D: Sudan Market Reporter & Verification Foundation
*   Human-entered/local market observations.
*   Market/source identity, timestamp, provenance.
*   Verification status, duplicate detection, anomaly/outlier flagging, audit trail.
*   **Constraint:** Do NOT claim this reporter network currently exists. It remains PLANNED.

### R4-E: Trader & Institutional Analytics
*   Historical trends, comparisons, exports.
*   Verified source filtering.
*   Aggregated government/NGO reports.

## Explicitly Out-of-Scope (Deferred to Future Vision)
*   **Real-time High-Frequency Trading Data:** Sudanese agricultural markets do not support this latency.
*   **AI Predictive Yield Modeling:** Requires multi-year historical datasets not currently available.
*   **Complex Satellite GIS Processing:** Too expensive and computationally intensive for R4.
