# ZARATI R6/R7 PRODUCTION CLOSURE

## Overview
ZARATI Phases R6 and R7 (Institutional Intelligence and Ministerial Command Experience) have been successfully implemented, tested, and deployed to production. This marks the completion of the ZARATI V1 functional scope.

## Interfaces & Features
- **Institutional Dashboard** (`/[lang]/institutional`): A high-level, public-safe executive overview displaying verified market observations, tracked commodities, and regions. Integrates weather context without inferring unverified causation.
- **Ministerial Presentation Mode** (`/[lang]/institutional/presentation`): A distraction-free, large-screen optimized briefing tool that summarizes the current state of ZARATI, highlighting data trust and Gedaref pilot readiness.
- **Public-Safe Export**: Institutional users can export normalized market intelligence to CSV, strictly respecting the 102-observation public boundary while keeping the 5000+ quarantined internal rows safe.

## Print & Reporting Readiness
- The institutional dashboard is fully print-ready via responsive browser CSS (`print:hidden`, `print:break-inside-avoid`). This enables immediate physical briefing generation without fragile PDF middleware.

## Data Trust & Reality
- **No Mock Data**: Every metric, market, commodity, and weather datapoint is derived natively from the production database. "Unavailable" or "No Verified Data" states are prominently and transparently displayed where data is absent.
- **Operational Health Exposure**: High-level WFP and MET Norway feed health is exposed to institutional users to build data trust, but sensitive internal IDs and operator-only workflows remain restricted to R5.

## Security & Authorization
- **Access**: Strictly gated to users with institutional roles (`admin`, `government`, `ngo`, `investor`) via server-side checks. 
- **Roles**: Anonymous users are forcefully redirected to `/login`.

## Conclusion
With the deployment of R6 and R7, ZARATI V1 is functionally COMPLETE. R8, R9, and R10 remain firmly in the Vision roadmap for V2.
