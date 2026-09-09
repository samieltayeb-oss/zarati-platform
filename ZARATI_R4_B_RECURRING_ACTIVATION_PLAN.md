# R4-B.11 controlled recurring activation

Preflight 2026-09-09: canonical main and production were `01400a8517982953725e67172f261bf18dcc5b7b`. Ledger 001–016, 018–029; migration 029 tracked and applied exactly once. WFP and weather gates initially OFF. This release reconciles the previously local R4-B production/canary evidence and B.10 replay-admission SQL into main before activation.

Schedules use UTC. WFP `0 3 * * *` (daily 03:00–03:59 UTC on Hobby); weather `0 5 * * *` (daily 05:00–05:59 UTC). Existing expire schedule stays 02:00 UTC. No timing-window overlap between feed schedules. [Vercel Hobby constraints](https://vercel.com/docs/cron-jobs/usage-and-pricing) permit once-daily runs with one-hour timing uncertainty.

Fresh [HDX dataset metadata](https://data.humdata.org/api/3/action/package_show?id=369e003b-f0af-4e48-99d7-34fc85b44635) reports data_update_frequency `30`, latest resource modification 2026-09-06T17:36:34.579114 and observation coverage through 2026-08-15. Daily synchronization is conservative for this monthly institutional dataset and detects released updates without hourly polling. It does not make these real-time, today's, or government prices, and implies no WFP partnership.

Daily weather is the useful forecast-oriented cadence available on the existing Hobby plan. The existing two-calendar-day forecast covers the next daily refresh; the current estimate expires after one hour and is stale for much of the day. Do not promise continuously current weather. Keep 14.04,35.38 only and the validated request/temporal model unchanged. [Open-Meteo pricing](https://open-meteo.com/en/pricing) restricts the free endpoint to non-commercial use; recurring weather awaits confirmation of evaluation status or appropriate subscription. No paid plan purchase or new credentials are authorized by this plan.

Enable WFP alone first, deploy canonical main, then use Vercel's managed Run mechanism once, explicitly distinguishing a managed manual trigger from an unattended wall-clock event. If it fails, disable WFP and stop. Only after WFP PASS may weather be enabled and separately verified. No cooldown bypass is planned. Feed locks and ledgers remain keyed separately by WFP/OPEN_METEO. No automatic publication, R4-C, or Gedaref pilot activation.

FAO FPMA remains DEFERRED/BLOCKED pending an approved official automated source. Final production evidence belongs in `ZARATI_R4_B_FINAL_PRODUCTION_CLOSURE.md`.
