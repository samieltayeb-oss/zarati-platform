# ZARATI_R3_RFQ_PRIVACY_VERIFICATION

## Contact Release Privacy Checks
- **PENDING State:** Verified that neither party receives the other's phone number or email.
- **ACCEPTED State:** Secure RPC `get_rfq_contact_details` successfully executed. Farmer receives Trader contact, Trader receives Farmer contact.
- **RPC Hardening (Migration 022):**
  - Search path explicitly restricted: `SET search_path = ''`.
  - Identity explicitly derived from `auth.uid()`.
  - Active status checks added for both Caller and Counterpart.
  - RPC returns minimum PII (role, phone, email, full_name).
- **Isolation Check:** Trader B attempted to execute RPC for Trader A's accepted RFQ. Server rejected with 'Unauthorized'.
- **Terminal States:** Contact release verified to persist in `closed` state.

**Status:** Verified. Privacy invariants and RPC hardening hold.
