# ZARATI | زرعتي — R4-A.6 UPSTASH PRODUCTION GATE

**Target:** Upstash Redis Rate Limiter Configuration  
**Status:** BLOCKED ON FOUNDER ACTION

## 1. RATE LIMIT IMPLEMENTATION
* **SDK:** `@upstash/ratelimit` and `@upstash/redis`
* **Variables Required:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
* **Namespaces:** `@upstash/ratelimit` (auth), `@upstash/ratelimit:reset-pwd` (password resets)
* **Behavior:** 
  * Auth: Sliding window of 5 requests per 15 minutes.
  * Reset Password: Sliding window of 3 requests per 1 hour.
  * Production fail-closed logic is confirmed active. If variables are missing, the system throws a CRITICAL error and refuses to fail open.

## 2. EXISTING UPSTASH RESOURCES
* Vercel project `zarati-platform` was inspected using `npx vercel env ls`.
* The environment variables `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` DO exist in the Vercel project list (created 2 days ago for Production).
* However, pulling these variables results in empty strings (`""`), indicating they are either placeholders, improperly configured, or inaccessible to the CLI due to security settings. No actual connection string could be retrieved or verified.
* **RESOURCE FOUND:** NO (Valid connection details not found)
* **RESOURCE STATUS:** NOT ACTIVE

## 3. PROVISIONING & FOUNDER ACTION
As an automated agent, I am restricted from creating accounts, accepting billing authorization, or performing OAuth logins on your behalf. Since no valid Upstash integration could be automatically invoked without login/billing, you must perform the following actions:

**Minimal Founder Action Required:**
1. Log in to your [Upstash Console](https://console.upstash.com/) or Vercel Integrations.
2. Create a production Redis database (Preferred name: `zarati-production-rate-limit`, Region: North America/Canada if available).
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Navigate to your Vercel Dashboard -> `zarati-platform` -> Settings -> Environment Variables.
5. Update the existing `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` values for the **Production** environment.
6. Trigger a Vercel Production Redeploy to make the variables available to serverless functions.

## 4. SECURITY CHECK
* **Secrets Exposed:** NO. `git diff` and `git status` confirm no secrets were committed. No URLs or tokens are present in client bundles, logs, or `.env` files tracked by Git.

## 5. REDEPLOYMENT STATUS
* **ENV CONFIGURED:** NO (Valid values absent)
* **CURRENT LIVE DEPLOYMENT HAS NEW ENV:** REDEPLOY_REQUIRED (Once Founder updates the values, a manual redeploy in Vercel is mandatory).

## 6. FINAL VERDICT
⚠️ **UPSTASH PROVISIONING REQUIRES FOUNDER ACTION — MIGRATION 024 REMAINS BLOCKED**
