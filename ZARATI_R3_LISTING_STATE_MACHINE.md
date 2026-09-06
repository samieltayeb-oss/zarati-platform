# ZARATI R3 LISTING STATE MACHINE

## Canonical Statuses
`draft`, `pending_review`, `active`, `paused`, `sold`, `expired`, `archived`.

## Explicit Allowed Transitions

**Farmer:**
*   `draft` ➡️ `pending_review`
*   `draft` ➡️ `archived`
*   `active` ➡️ `paused`
*   `paused` ➡️ `active`
*   `active` ➡️ `sold`
*   `active` ➡️ `archived`
*   `paused` ➡️ `archived`

**Moderator / System:**
*   `pending_review` ➡️ `active`
*   `pending_review` ➡️ `draft` (with `moderation_status` = `rejected`)

**System Expiration (Cron/Scheduler):**
*   `active` ➡️ `expired` (When `expires_at` is reached)
*   `paused` ➡️ `expired`

## Invariants & Defense-in-Depth
*   No arbitrary state jumps.
*   A listing with `status = active` CANNOT have `moderation_status = rejected`.
*   **Expiration Mechanism:** A scheduled cron/server process explicitly transitions listings to `expired`. As defense-in-depth, `public_listings_view` statically enforces `expires_at > NOW()`. No claims of "passive database triggers executing automatically on time" are made.
