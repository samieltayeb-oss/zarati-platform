# ZARATI_R3_STORAGE_SECURITY_VERIFICATION

## Storage Bucket Verification
- **Upload Types:** Restricted to `image/jpeg`, `image/png`, `image/webp`. SVG successfully blocked.
- **Size Limit:** Enforced at 5MB per object.
- **Cross-User Delete:** Attempt by User B to delete User A's media returned 403 Forbidden.
- **Draft Visibility:** Unapproved media correctly blocks public `anon` read access via storage RLS.
- **EXIF Handling:** Server-side EXIF stripping fully implemented. 
  - `lib/actions/upload.ts` uses `sharp` to decode, resize, and re-encode incoming bytes as metadata-free JPEG BEFORE pushing to the public `listing-media` bucket.
  - Test result: A valid JPEG containing GPS EXIF was uploaded. The resulting file retrieved from Supabase Storage had 100% of EXIF/GPS metadata successfully removed.
  - Original unsanitized files are never stored in the public bucket.

**Status:** Verified and Hardened in Staging.
