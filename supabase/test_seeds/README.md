# Zarati Test Seeds (Local / Staging Parity Only)

**STRICT GOVERNANCE RULE**:
The files in this directory (`supabase/test_seeds/`) are strictly for local development and staging mock parity testing.

**THEY MUST NEVER BE APPLIED TO PRODUCTION.**

Production databases for ZARATI must contain:
1. Canonical reference data ONLY (18 Sudanese states, 10 primary markets, 8 major crops).
2. ZERO fake farmer profiles.
3. ZERO fake marketplace listings.
4. ZERO simulated price data or test inquiries.

Production mock parity is maintained via client/server fallback flags (`NEXT_PUBLIC_USE_MOCK_DATA="true"`) in the application layer, completely separated from the operational persistence layer.
