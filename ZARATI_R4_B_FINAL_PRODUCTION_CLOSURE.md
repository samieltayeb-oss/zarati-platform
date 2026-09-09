# R4-B.14 — recurring activation; final closure pending

Updated 2026-09-09 UTC. **WFP ON. MET Norway ON. Open-Meteo OFF. R4-B is NOT CLOSED: the first unattended MET Norway window is still in the future.** A manual invocation cannot substitute for scheduled-run proof.

This replaces the B.11 partial-activation report; its historical details remain in Git. The completed B.13 canary evidence is preserved in ZARATI_R4_B_MET_NORWAY_PRODUCTION_CANARY_EVIDENCE.md.

## Governance and activation

Verified canonical main/application SHA at activation: **cf0986bde47f62ed8781412f8f1b720cb0c5d683**. Production matched exact main before activation. The subsequent governance-only commit containing this report is recorded by Git and retains the same application and migrations.

Supabase project: **nelsijiczufflyqosvzi**. Fresh preflight confirms ledger **001–016, 018–030**, 29 entries, migration 030 exactly once. Migration 030 and MET implementation/canary evidence are tracked in main. Migration 030 SHA-256 remains **199d171eaa6e52dd94a3f11183acf198587ac2ae4ed4ee9c6973929c8252f8a8**. No production/Git drift was found. Unrelated local plans and untracked files were excluded.

Preflight: WFP **5666 physical / 5663 current valid / 102 public**, WFP ON; MET **48** rows, weather OFF; Open-Meteo **49** rows, retired cron provider; no running execution or active lease. The two prior MET executions are the B.13 canary and replay, not unattended schedule evidence.

Production R4B_WEATHER_FEED_ENABLED became **true at 2026-09-09T18:39:58.664Z**. WFP remained true; CRON_SECRET presence was verified without printing its value. The canonical weather route already selects **MET_NORWAY**; the cron handler refuses OPEN_METEO. No application, schema, provider, coordinate, or schedule change was needed.

Activation deployment: **dpl_BCpsxRYyt7VVHZVZB4tFer4bnC26**, READY on exact main **cf0986bde47f62ed8781412f8f1b720cb0c5d683**, owning **https://zarati-platform.vercel.app**. URL: https://zarati-platform-mrauoa2ms-samieltayeb-oss-projects.vercel.app. A subsequent evidence-only main push retains the same code and ON settings. Gate verification at 18:49:28 UTC reports WFP true, weather true, and cron secret present.

No manual Run control, cron-run CLI command, authenticated weather trigger, replay admission, or WFP invocation was used in B.14.

## Schedules

| Feed | Cron | Meaning on current Hobby plan | Configured state |
| --- | --- | --- | --- |
| WFP | `0 3 * * *` | Daily, 03:00–03:59 UTC | ON |
| MET Norway | `0 5 * * *` | Daily, 05:00–05:59 UTC | ON |
| Open-Meteo | No independently executable route | Historical canary provider only | OFF |

The expiry task remains `0 2 * * *`. Vercel's read-only cron listing confirmed all three unchanged paths/schedules. The current [Vercel documentation](https://vercel.com/docs/cron-jobs/usage-and-pricing) confirms daily jobs and a one-hour timing window on Hobby. No frequency increase or plan change occurred.

Rationale: one daily forecast refresh serves the limited current R4-B scope while minimizing provider/platform traffic. WFP remains a conservatively synchronized institutional historical dataset. Daily forecasts do not imply continuously fresh sensor observations.

**Next required unattended proof: 2026-09-10 05:00–05:59 UTC**, equivalent to **September 9, 23:00–23:59 MDT**. This event has not yet happened at the time of this report.

## Unattended evidence — pending

Actual invocation time, HTTP status, deployment, execution ID, provider/cache result, fetched/inserted/existing/rejected/quarantined counters, new identity/revision counts, completion, and post-run lease cleanup are **NOT YET AVAILABLE**. No zero counts or successful results are inferred for this future execution.

A bounded local observer was started hidden, PID **58976**, status **WAITING_FOR_SCHEDULE** at 2026-09-09T18:49:18.113Z. Its ignored source is `scratch/r4b14-observe.cjs`; status is `scratch/r4b14-observer-status.json`. Syntax and read-only preconditions passed. It waits until the target window, then reads at bounded two-minute intervals, stopping after one terminal candidate or by 06:06 UTC. It cannot invoke feeds, change gates/leases, or write production. Captures go to ignored `scratch/r4b14-scheduled-*`.

The observer collects private weather artifacts, anon projection, WFP lineage, schema/cache metadata, and available Vercel logs. It checks preservation, values/units/timestamps, manifests, duplicates, new identities versus revisions, and WFP counts. Successful capture still requires schedule-origin review; it does not automatically declare closure.

This observer depends on the workstation staying awake and online and authorized CLI sessions remaining usable. Vercel scheduling is independent of the workstation. No unattended-result guarantee or automatic final-report delivery is claimed.

After the window, inspect the capture and platform logs, establish that the invocation was a genuine scheduled event, verify provider/data/security/lease truth, and commit completed closure evidence. If the observer could not run, collect durable ledger and available logs read-only. Do not trigger weather manually to manufacture proof.

## Current provider and data truth

Source: MET Norway Locationforecast 2.0 compact, https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38. Server User-Agent remains `ZARATI/0.1 (https://github.com/samieltayeb-oss/zarati-platform)`. The deployed code is the previously tested implementation. No API key, paid subscription, fake contact, or partnership was introduced.

Location remains **El Gedarif / Gedaref Crops Market**, canonical `MKT-GD-01 / WFP market 2580`, requested **14.04 / 35.38**. MET rows are FORECAST model output, retaining valid_time, original retrieved_at, UTC, forward precipitation intervals, and Celsius/%/mm/km/h semantics. Original wind m/s and issuance remain private provenance. Public attribution supplies Data from MET Norway, source/license links, and conversion/forecast notes.

Fresh read-only verification reconfirmed all retained 48 MET values against their exact artifact, all 49 unchanged OPEN_METEO rows, zero duplicate key/revision pairs, valid manifests, and clear leases. Anon view returns **97** safe rows. Freshness was checked at database capture time: expired forecasts become stale and historical data remain stale. No raw weather, artifact IDs, leases, internal errors, validation metadata, or secrets are public. These checks do not claim anything about tomorrow's scheduled output.

## Security and failure safety

| Regression | Current result and evidence |
| --- | --- |
| Migration 026 | PASS — fresh production security-definition equivalence |
| Migration 028 | PASS — unchanged listing policies/functions/triggers/grants/RLS/view |
| Migration 029 | PASS — preserved counts and verified repair lineage |
| Migration 030 | PASS — exact tracked migration, once in ledger, private cache grants and safe view |
| R4-A | PASS — WFP 5663 current / 102 public and preserved provenance |
| R4-B infrastructure and MET canary | PASS — exact previously verified 180-test application and successful production canary/replay |
| R4-B final recurring closure | PENDING — genuine unattended MET execution required |
| RFQ security | PASS — production helper/trigger equivalence and existing real-DB tests |
| Listing security | PASS — production policy equivalence and existing authorization tests |
| Rate limiting / media contract | PASS — unchanged tested implementation |

Failure handling retains separate provider leases, fenced execution IDs/tokens, truthful failed/partial status, bounded cleanup retries, expired lease recovery, and publication of successful receipts only. A weather failure cannot mark WFP failed. Last successful weather stays queryable with dynamic freshness. Existing tests cover parsing failure, work/cleanup deadlines, finalization, and recovery. No production fault was intentionally induced.

## Product truth and boundary

WFP: **automatically synchronized public-source historical market observations**, with actual source/observation dates. After unattended verification, weather may be described as **automatically refreshed forecast data from MET Norway**. Until then: daily refresh enabled, production canary verified, first unattended execution pending.

No real-time Sudan market price, WFP/MET Norway/government partnership, physical station network, live-sensor, or satellite-intelligence claim. FAO FPMA: **DEFERRED**. R4-C: **NOT STARTED**. Gedaref pilot: **NOT ACTIVATED**.

**R4-B ACTIVATION INCOMPLETE — awaiting the future unattended schedule window. Both approved feeds are enabled; no failure has been observed, and closure is not claimed.**
