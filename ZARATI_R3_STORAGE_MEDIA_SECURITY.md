# ZARATI R3 STORAGE & MEDIA SECURITY

## Bucket Configuration
*   **Bucket Name:** `listing-media`

## Visibility Architecture
*   Draft or private listing media MUST NOT be publicly discoverable.
*   RLS Storage Policies explicitly enforce that `SELECT` is only permitted for images attached to active/approved listings, or to the media owner.
*   Public visibility is granted strictly via secure joined policies.

## Security Policies (RLS on Storage)
*   **Upload (INSERT):** Authenticated users only.
*   **File Size Limit:** 5MB max per image.
*   **MIME Allowlist:** `image/jpeg`, `image/png`, `image/webp`. SVG is strictly prohibited.
*   **Randomized Paths:** Files must be uploaded to UUID-based paths to prevent enumeration.

## EXIF / Metadata Stripping
*   Client-side EXIF stripping is implemented for UX but is NOT trusted as a security boundary.
*   **Residual Risk / Next Steps:** If server-side image processing (e.g., Next.js sharp integration or Supabase Storage image transformations) is not fully viable in R3-A, the residual risk of GPS exposure via raw EXIF must be documented, and server-side processing prioritized.
