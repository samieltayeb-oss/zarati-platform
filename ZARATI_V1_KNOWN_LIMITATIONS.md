# ZARATI V1 KNOWN LIMITATIONS

This document enumerates the deliberate boundaries and known limitations present in ZARATI V1.0.0.

## 1. Forex & Currency
- **Verified Historical FX Coverage Incomplete**: The system lacks an automated ingestor for sovereign/black-market FX rates.
- **USD Intelligence Unavailable**: Normalized USD price views are explicitly suppressed and render as "Unavailable" due to the missing FX link.

## 2. Institutional Pilot
- **Gedaref Status**: Gedaref is the "Proposed Pilot", not a "Government-Authorized Pilot". The software makes no claim of active government partnership.
- **Regional Coverage**: Coverage implies data presence, not necessarily boots on the ground or comprehensive national mapping.

## 3. Data Ingestion Operations
- **Conflict Resolution UI**: Conflicts and quarantines are visible to administrators, but the web UI for *resolving* these conflicts (overriding precedence) relies on backend administration; interactive "Click to Resolve" is deferred to prevent accidental data corruption.

## 4. Deferred V2 Scope (Vision)
- **R8 Agronomic Intelligence**: Deep crop modeling and agricultural AI remain Vision.
- **R9 Low-Bandwidth**: PWA offline-first syncing protocols remain Vision.
- **R10 Geospatial**: Advanced satellite integrations remain Vision.
