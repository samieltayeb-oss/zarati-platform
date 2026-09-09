# R4-B.12 — MET Norway local implementation evidence

Date: 2026-09-09. Result: local adapter ready; production activation is not authorized by this gate.

Base repository commit: `e51e0a747635df021b0012ffa681de35442c0897`. This change is local and has not been deployed, pushed, or applied to production. WFP configuration and implementation are unchanged. R4-C has not started.

## Official source and licensing verification

The [official API overview](https://api.met.no/) identifies Locationforecast 2.0 as global and permits commercial use. The hosted public interface requires no API subscription or API key: $0 subscription cost, subject to its usage terms. Sudan is within global coverage. This does not promise an SLA or unlimited traffic.

The [MET Norway license](https://api.met.no/doc/License) offers CC BY 4.0 and NLOD 2.0. This implementation selects [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), which permits commercial reuse with attribution, a license reference, and identification of changes. Public metadata says **Data from MET Norway**, links the source and license, and describes the subset and wind conversion. It makes no partnership or physical-station claim.

The [terms](https://api.met.no/doc/TermsOfService) and [getting-started guidance](https://api.met.no/doc/GettingStarted) require identifiable clients, HTTPS, restrained traffic, and cache handling. The implementation supplies the real project reference:

`ZARATI/0.1 (https://github.com/samieltayeb-oss/zarati-platform)`

No invented contact or secret is used. Coordinates have two decimal places, below the four-decimal maximum. The client honors Expires, uses Last-Modified with conditional requests, accepts compression, and applies jitter and bounded retries. Requests above 20 per second require a separate agreement; this single-location client is far below that threshold. No schedule is enabled in this gate.

The [forecast format](https://api.met.no/doc/ForecastJSON), [data model](https://api.met.no/doc/locationforecast/datamodel), and [Locationforecast documentation](https://api.met.no/weatherapi/locationforecast/2.0/documentation) distinguish instantaneous model fields from forward precipitation intervals. Timestamps are UTC. Global forecasts use ECMWF at approximately 9 km resolution, with four model updates daily; these are numerical forecasts, not direct station measurements.

## Request and captured fixture

Endpoint: `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=14.04&lon=35.38`.

Approved location remains El Gedarif / Gedaref Crops Market, canonical reference `MKT-GD-01 / WFP market 2580`. Latitude 14.04 and longitude 35.38 are valid and retain the previously validated canary location. No administrative geography or additional location was created.

One identified public GET captured an actual JSON response; it did not call a production application route or write production data. The fixture and its metadata are under `__tests__/fixtures/met-norway-gedaref*`.

| Evidence | Value |
| --- | --- |
| Retrieved | 2026-09-09T16:08:13.958Z |
| Provider updated_at | 2026-09-09T13:28:06Z |
| Geometry: longitude, latitude, elevation | 35.38, 14.04, 608 m |
| Timeseries points | 90 |
| Bytes | 40039 |
| SHA-256 | `e3a8ebd625c4fe55c0b1d086bbebe787cc374f6c5b2bc562518717af5bbbfa37` |
| Expires | Wed, 09 Sep 2026 16:40:01 GMT |
| Last-Modified | Wed, 09 Sep 2026 16:08:15 GMT |

Last-Modified was approximately one second ahead of the local retrieval clock. The transport tolerates bounded clock skew but never sends a future If-Modified-Since value.

## Mapping and temporal truth

The parser validates GeoJSON, coordinates, units, finite values, sorted unique timestamps, and real UTC calendar dates. The selected issuance-relative window ends 48 hours after provider updated_at. This fixture produces 46 rows, from 2026-09-09T16:00Z through 2026-09-11T13:00Z. A terminal point without precipitation is omitted rather than inventing zero precipitation.

| Provider field | Stored meaning/unit |
| --- | --- |
| instant.details.air_temperature | Temperature, Celsius |
| instant.details.relative_humidity | Relative humidity, percent |
| instant.details.wind_speed | m/s converted explicitly to km/h; original m/s retained privately |
| next_1_hours.details.precipitation_amount | Following one-hour accumulation, mm |
| next_6_hours.details.precipitation_amount | Following six-hour accumulation when one-hour data is absent, mm; never divided into a fabricated hourly value |
| summary.symbol_code | Provider symbol retained in private provenance |
| timeseries.time | Provider valid_time, UTC |
| meta.updated_at | Forecast issuance/revision metadata |

For the first fixture point: 31 C, 54.3% humidity, 3.4 m/s = 12.24 km/h, and 1.3 mm over the next hour. Its six-hour total is 4.8 mm and is not substituted for the one-hour total.

Every MET Norway row is **FORECAST**. Retrieval does not turn a forecast into an observation or current estimate. Provider valid_time and original retrieved_at remain distinct. The public view computes freshness dynamically using stale_after_at = valid_time; past-valid forecasts become stale. Horizon is derived from valid time and retrieval, while issuance-relative selection keeps replay stable. UTC, requested coordinates, horizon, and precipitation interval boundaries are available safely in the public projection.

Point coordinates must match the approved request within 0.0001 degrees. Returned elevation is provider metadata; this does not assert that the model grid is a physical station at that point.

## Cache, identity, and preserved infrastructure

`met-norway-adapter.ts` uses a durable private HTTP cache. Fresh cached data avoids a request; expired data uses the exact eligible Last-Modified header. A 304 preserves payload and original retrieval time. Retry-After produces persisted backoff, including when no payload exists. Network errors, timeouts, and eligible server errors have at most three attempts; each request has a 15-second deadline. Ordinary retries use exponential delay. The adapter enforces a bounded body, JSON content type, same-origin redirects, and a 5–65 second initial jitter. Deprecated 203 responses fail with a sanitized warning.

The existing feed ledger, authentication, leases, staging, immutable observation handling, completion, and failure cleanup are reused. The weather route selects MET_NORWAY. The old OPEN_METEO adapter remains for historical fixture compatibility, but its cron gate cannot be enabled even when the generic weather flag is true. The weather flag remains default false.

Deterministic identity includes provider, canonical location, coordinates, valid time, FORECAST class, and interval. Revision hashes include issuance, normalized values, original wind, interval boundaries, validated units, symbol, elevation, and attribution/model metadata. Identical replay inserts zero observations. A legitimate changed forecast creates an immutable revision. Provider-specific feed locks and the database artifact/provider guard prevent attribution crossover.

## Migration 030

File: `supabase/migrations/20260909000030_030_met_norway_weather.sql`.

SHA-256: `199d171eaa6e52dd94a3f11183acf198587ac2ae4ed4ee9c6973929c8252f8a8`.

The forward migration adds MET_NORWAY to feed_type and the weather provider constraint; adds the private cache and provider guard; and appends attribution and temporal/location metadata to the safe public view. Cache access is restricted to service SELECT/INSERT/UPDATE with RLS enabled. Anon and authenticated clients cannot read it. The public view exposes no raw payload, source_record_raw, artifact identifier, lease, execution error, or validation internals.

Migrations 027–029 and all earlier tracked migrations are unchanged. No existing weather row is updated or deleted. The WFP staging function matches previously captured production evidence. Local generated database types include the new schema; production remains through 029.

## Validation results

| Check | Result |
| --- | --- |
| Lint | PASS |
| Typecheck | PASS |
| Tests | PASS — 180 tests, 12 files, no skips |
| Production build | PASS — Next.js 16.2.9 |
| Local Supabase reset | PASS — migrations 001–016 and 018–030 applied |
| Final schema verification | PASS — 29 ledger entries, final provider guard present |
| Prior migration/WFP staging comparison | PASS — unchanged |
| Diff whitespace check | PASS |

The initial reset exited successfully. A later redirected reset printed successful completion but its PowerShell wrapper returned exit 1; direct database verification confirmed the final 030 statements and guard were applied. This wrapper anomaly is not hidden as a clean command exit.

The 24 MET-specific tests cover real-response value mapping, interval semantics, malformed data, HTTP failures, timeout, retry/backoff, UTC/calendar validation, freshness, cache and 304 behavior, User-Agent, redirects, attribution, public minimization, provider isolation, default-off gating, and failure-ledger cleanup.

The local integration test reconstructs the exact retained 49-row Open-Meteo canary and snapshots every field. MET ingestion inserts 46 observations; the identical replay inserts zero; a changed first temperature inserts one immutable revision. All 49 Open-Meteo rows remain byte-for-byte equivalent at the database field level. Public results distinguish both providers and select 46 current MET revision identities from 47 physical MET rows. Anon access to raw/cache internals is denied, and direct weather UPDATE/DELETE is rejected.

## Production boundary and remaining limitations

No production mutation, deployment, environment change, cron activation, or production MET observation occurred. Preservation of production's 49 Open-Meteo rows follows from this no-write boundary and the prior production canary evidence; this turn did not perform a new production count query. Their OPEN_METEO attribution is preserved by the migration and tested locally.

WFP is unchanged. Open-Meteo recurring remains OFF; MET Norway production remains OFF. Migration 030 is local only. A separate authorized production migration/canary gate is required before activation; this report does not certify production scheduling. Global model resolution, terrain adjustment, and provider availability limit forecast precision. There is no MET Norway partnership, station-observation claim, or government endorsement. FAO remains deferred; R4-C and the Gedaref pilot are not activated.

**MET NORWAY WEATHER ADAPTER READY — FREE COMMERCIAL WEATHER PATH VERIFIED (local implementation).**
