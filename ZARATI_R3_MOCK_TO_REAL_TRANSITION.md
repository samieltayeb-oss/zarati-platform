# ZARATI R3 MOCK TO REAL TRANSITION

## Objective
Remove frontend mock arrays and replace with real Supabase queries. Production starts clean.

## Transition Steps
1.  **Deprecate Mocks:** Remove static `mockListings` arrays from the UI components.
2.  **Integrate Client:** Bind UI components to `public_listings_view`.
3.  **Zero-State UI:** Implement high-quality empty states.

## Test Seed Data (Non-Production)
*   Test seeds (fake farmers, RFQs, listings) must NEVER enter the production migration history.
*   Seed scripts must live in `supabase/test_seeds/` (e.g., `test_seed.sql`) and are only executed manually in local/staging environments.
