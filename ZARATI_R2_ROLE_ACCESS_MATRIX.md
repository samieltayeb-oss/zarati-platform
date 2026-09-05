# ZARATI R2 ROLE ACCESS MATRIX

| Actor / Identity | `/dashboard/farmer` | `/dashboard/trader` | `/admin` | `/login` & `/register` | `/waitlist` |
|-----------------|---------------------|---------------------|----------|------------------------|-------------|
| **Anonymous**   | ❌ DENY (Redirect)  | ❌ DENY (Redirect)  | ❌ DENY  | ✅ ALLOW               | ✅ ALLOW    |
| **Farmer**      | ✅ ALLOW            | ❌ DENY (Redirect)  | ❌ DENY  | ✅ ALLOW               | ✅ ALLOW    |
| **Trader**      | ❌ DENY (Redirect)  | ✅ ALLOW            | ❌ DENY  | ✅ ALLOW               | ✅ ALLOW    |
| **Suspended**   | ❌ DENY (Auth err)  | ❌ DENY (Auth err)  | ❌ DENY  | ✅ ALLOW               | ✅ ALLOW    |
| **Legacy Admin**| ❌ DENY (Redirect)  | ❌ DENY (Redirect)  | ✅ ALLOW | ✅ ALLOW               | ✅ ALLOW    |

## Data Ownership
- **Farmer A**: Can exclusively read/write `farms` where `farmer_id = auth.uid()`.
- **Trader A**: Can read public `farms` and `profiles`, but cannot modify them. Can access their own `trader_profiles`.
- **Admin**: Can access all data via the Service Role key (to be fully migrated to Supabase Auth roles in the future).

The Next.js `proxy.ts` middleware natively interprets and enforces this matrix by validating the identity payload signed by Supabase Auth against the request path.
