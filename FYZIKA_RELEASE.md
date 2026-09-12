# Fyzika pastelkou — 2026-09-13

Version 0.1.3-android.5 (code 5) delivers the D65 tablet interface and teacher
editor. It adds a full-screen mission picker, larger controls, gesture help,
resumable work, local task libraries and authoring of mechanical and electrical
scenes. It remains an **alpha**: all 67 existing winning recordings replay,
but 85 of the 152 mission definitions still await gameplay verification.
Content completeness gates remain open. Physical tablet, Windows and sessions
with children/teachers have not been certified by the emulator tests.

The signed ARM64 APK requires Android 9+ and Vulkan. It uses the original
signing certificate and can update the previous release without uninstalling.
The exact size and SHA-256 are recorded in the versioned SHA256SUMS.txt.
The folder also includes installation notes, third-party notices and the
unchanged MPL-2.0 source archive for generational-arena 0.2.9. The app source
and macOS installer remain private.

Only the Fyzika record (Supabase apps.id = 29), its fallback data, and its
versioned public artifacts/screenshots are updated. Existing app and download
counters are preserved. The CMS is switched only after deployment and a full
public download matches the locally signed APK.

The four screenshots show the current Android interface, captured on an API 35
ARM64 emulator. They are not evidence of physical tablet performance.

The supported build regenerates the catalog fingerprint and matching HTML and
service-worker cache version. A version-specific APK MIME/attachment/cache
rule is added. APKs stay outside the PWA precache; old downloads remain available.
GitHub Actions for the private app remain disabled; validation and signing
were performed locally through the supported project entry points.
