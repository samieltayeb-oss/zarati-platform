# ZARATI R3 OBSERVABILITY & RATE LIMIT SPEC

## Authoritative Rate Limits (Upstash Redis)
Authenticated limits take precedence over IP limits.

*   **Listing Creation:** 10 per user per rolling 24 hours.
*   **RFQ Submission:** 5 per user per minute, AND 50 per user per rolling 24 hours.
*   **Image Uploads:** 20 per user per hour.

## Observability
*   Server Actions log failures to Vercel without exposing passwords or PII.
*   Monitor Upstash rate limit triggers.
*   Monitor scheduled Cron expiration job success.
