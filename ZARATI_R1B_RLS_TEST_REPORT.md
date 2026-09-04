# ZARATI PHASE R1-B: ROW LEVEL SECURITY (RLS) ADVERSARIAL TEST REPORT

**Document Reference:** `ZARATI-R1B-RLS-001`  
**Execution Date:** September 2026  
**Target Database:** Local Supabase Docker (`http://127.0.0.1:54341`)  
**Test Suite Script:** `scripts/verify-db-and-rls.ts`  
**Founder:** Sami Suliman Eltayeb  
**Contact Email:** `sam@nexorayyc.io`  
**Overall RLS Status:** 19 / 19 SCENARIOS PASSED (100% SECURITY CONFORMANCE)  

---

## 1. Test Personas & Security Contexts

All RLS policies were evaluated by authenticating real Supabase JWT sessions for 5 discrete roles:

| Persona | Role in `profiles` | Auth Email | UUID | Intended Privilege Boundary |
|:---|:---|:---|:---|:---|
| **Admin** | `admin` | `sam@nexorayyc.io` | `00000000-0000-0000-0000-000000000001` | Superuser: Audit moderation, manage reference data, view waitlist |
| **Farmer A** | `farmer` | `sam+farmer_ahmed@nexorayyc.io` | `00000000-0000-0000-0000-000000000002` | Tenant Ahmed: Owns Gedaref Sorghum Scheme & listing |
| **Farmer B** | `farmer` | `sam+farmer_hassan@nexorayyc.io` | `00000000-0000-0000-0000-000000000003` | Tenant Hassan: Owns Kassala Sesame Scheme & listing |
| **Trader A** | `trader` | `sam+trader_fatima@nexorayyc.io` | `00000000-0000-0000-0000-000000000004` | Wholesale Trader Fatima: Submitted inquiry to Farmer A |
| **Trader B** | `trader` | `sam+trader_omar@nexorayyc.io` | `00000000-0000-0000-0000-000000000005` | Competing Wholesale Trader Omar: Must have zero access to Trader A inquiries |
| **Anonymous**| `anon` | *Unauthenticated Public* | `NULL` | Public Visitor: Read-only active listings, crops, prices; submit waitlist |

---

## 2. Adversarial Test Results Matrix

| # | Security Scenario Tested | Actor | Expected Outcome | Actual Database Response | Status |
|:---:|:---|:---|:---|:---|:---:|
| 1 | **Cross-Tenant Profile Read Isolation** | `Farmer A` | Cannot read Farmer B private profile | 0 rows returned | **PASS** |
| 2 | **Self-Profile Read Access** | `Farmer A` | CAN read own profile details | 1 row returned (Name: Ahmed Mohammed) | **PASS** |
| 3 | **Cross-Tenant Farm Mutation Block** | `Farmer A` | Cannot update or rename Farmer B farm | 0 rows updated; original name preserved | **PASS** |
| 4 | **Cross-Tenant Listing Tampering Block** | `Farmer A` | Cannot mutate Farmer B listing price | 0 rows updated; price remained unchanged | **PASS** |
| 5 | **Trader Listing Manipulation Block** | `Trader A` | Cannot mutate farmer listing status | 0 rows updated; listing status remained `active` | **PASS** |
| 6 | **Self-Privilege Escalation (Verification)** | `Trader A` | Cannot grant self verified badge / fake rating | Trigger exception: `Unauthorized: Only platform administrators can modify trader verification` | **PASS** |
| 7 | **Self-Privilege Escalation (Role Change)** | `Trader A` | Cannot alter own role from `trader` to `admin` | Trigger exception: `Unauthorized: Only platform administrators can change user roles` | **PASS** |
| 8 | **B2B Inquiry Isolation (Competitor)** | `Trader B` | Cannot read Trader A private inquiry | 0 rows returned | **PASS** |
| 9 | **B2B Inquiry Seller Visibility** | `Farmer A` | CAN read inquiry sent to own listing | 1 row returned (Message verified) | **PASS** |
| 10 | **Public Inquiry Isolation** | `Anonymous` | Cannot view private transaction inquiries | 0 rows returned | **PASS** |
| 11 | **Public Direct Profile Harvest Block** | `Anonymous` | Cannot query `profiles` table directly (PII leak) | 0 rows returned (Protected by RLS) | **PASS** |
| 12 | **Public Privacy View Access** | `Anonymous` | CAN view `marketplace_seller_public` (phone masked) | 5 seller rows returned (zero phone numbers exposed) | **PASS** |
| 13 | **Public Read of Catalog Tables** | `Anonymous` | CAN read active listings, crops, states, markets | Verified: 8 listings, 8 crops, 18 states, 10 markets | **PASS** |
| 14 | **Unauthorized Price Manipulation Block**| `Anonymous` | Cannot insert or update official crop prices | RLS policy violation error returned | **PASS** |
| 15 | **Admin Reference Data Authority** | `Admin` | CAN insert verified official crop prices | 1 row inserted successfully | **PASS** |
| 16 | **Admin Audit Logging Authority** | `Admin` | CAN insert moderation audit records | 1 audit row inserted successfully | **PASS** |
| 17 | **Public Waitlist Submission** | `Anonymous` | CAN insert valid waitlist entry | 1 row inserted successfully | **PASS** |
| 18 | **Public Waitlist Harvesting Block** | `Anonymous` | Cannot query or read waitlist email addresses | 0 rows returned | **PASS** |
| 19 | **Admin Waitlist Audit Access** | `Admin` | CAN read all waitlist submissions | Submissions returned successfully | **PASS** |

---

## 3. Key Architectural Security Protections Proven

1. **Anti-Harassment Phone Number Suppression:**
   - The base `profiles.phone` and `profiles.email` fields cannot be harvested by anonymous scrapers. Public consumers must query `marketplace_seller_public`, which exclusively exposes seller names, verification state, and aggregate rating. Direct communication is forced through authenticated `inquiries` until seller consent is granted.
2. **Defensive Privilege Escalation Triggers:**
   - In addition to standard RLS `USING` and `WITH CHECK` clauses, PostgreSQL triggers (`trg_protect_profile_privileges` and `trg_protect_trader_privileges`) enforce deep row-level immutability. Even if a user bypasses client filtering, direct SQL updates to `role`, `is_verified`, `reputation_score`, or `rating` are immediately aborted at the database engine level.
3. **B2B Commercial Isolation:**
   - Price negotiations and trade terms between a specific buyer and seller are strictly invisible to third-party traders. Competitors cannot inspect or undercut private bids.
