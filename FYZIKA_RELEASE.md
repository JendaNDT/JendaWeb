# Fyzika pastelkou — 2026-09-12

Version 0.1.2-android.4 (code 4) is an **unverified alpha** published with
the owner's explicit one-release exception from gameplay QA. It includes
152 mission definitions in 12 chapters. New missions may require fixes.
This is not a claim that the whole catalog or the current Android runtime
has been tested.

The signed ARM64 APK requires Android 9+ and Vulkan. It uses the same
signing certificate as the previous release. The complete archive is
11,986,429 bytes, SHA-256
`6c4f49f6beb6f8902e74db1765a069609f64e71fa835b03a92cad8a46ad6905b`.
The versioned folder includes installation notes and the checksum.

Only the Fyzika record (Supabase `apps.id = 29`) and its matching fallback
description/link change. Existing screenshots remain and are described
as showing the previous version. Other apps and music remain unchanged.
The primary CMS row is switched only after the new URL is deployed and
the complete public download matches the signed original.

`node build_site.cjs` regenerates the catalog fingerprint and matching
HTML/service-worker version; `--check` passes. One version-specific APK
MIME/attachment/immutable-cache rule is added to `vercel.json`. APKs are
not added to the PWA precache. Older downloads remain available.

Only the APK and public installation information are distributed here.
Application source, the macOS installer and signing credentials stay private.
