# ZARATI_R3_PRODUCTION_RELEASE_CANDIDATE_GATE

## Release Checklist
- [x] Public image bytes are sanitized server-side
- [x] GPS EXIF test proves metadata removal
- [x] Original unsanitized media never becomes public
- [x] SVG rejected
- [x] Fake-image payload rejected
- [x] 5 MB limit enforced
- [x] 5-image limit enforced
- [x] Cross-user media access denied
- [x] Suspended Farmer DB mutation denied
- [x] Banned Farmer DB mutation denied
- [x] Suspended Trader DB mutation denied
- [x] Banned Trader DB mutation denied
- [x] Active users retain legitimate functionality
- [x] get_rfq_contact_details search_path hardened
- [x] RPC derives caller from auth.uid()
- [x] Pending contact retrieval denied
- [x] Unrelated user contact retrieval denied
- [x] Anonymous RPC denied
- [x] RPC returns minimum PII only
- [x] Migration history remains safe
- [x] Test seeds remain outside migrations
- [x] R2 regression passes
- [x] R3 regression passes
- [x] Lint passes
- [x] Typecheck passes
- [x] Build passes
- [x] **No production migration applied**
- [x] **No production deployment performed**

## Final Status
Release Candidate Hardened. Ready for Production Canary Authorization.
