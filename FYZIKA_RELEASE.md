# Fyzika pastelkou — 2026-09-16

Version **0.1.11-android.13 (code 13)** includes the completed shared-core
laboratories: a heated piston, 27 magnetism and sound lessons, 15 optics
lessons (including physical lens shape/material, image, magnifier and telescope),
and 29 interactive physics explanations in “Jak to doopravdy funguje”.
These lessons have controls, measurements, goals, explanations, teacher variants
and saved preparation. They retain the M1–M4 crayons, drawn water/oil, undo,
teacher workflow, transfer of saved work and preceding physics fixes.

This is still an **alpha**. The regular Atlas remains 152 definitions in 12
chapters, with 77 recorded winning solutions and 75 awaiting gameplay
verification. The new laboratories are separate from that count. Neither
physical tablet/pen/palm testing, native Windows nor child/teacher sessions
are certified by this release. The separate shape-refinement proposal is
not implemented or included.

The signed ARM64 APK requires Android 9+ and Vulkan. It is **13,985,503 bytes**;
SHA-256: `e7339403674897d822848a8a140dabf7d5289d12b3b784b37188e9d64f094f74`.
The original signing certificate is retained; install over the existing app
without uninstalling. The exact public code 12 → code 13 update was checked
on an isolated API 35 ARM64 emulator: all nine original files remained byte
identical after installation and first launch. The installed APK matches this
artifact byte for byte. Package identity, non-debuggable status, absence of
permissions, signature, 16 KB zip/ELF alignment and embedded companion licences
were checked. Android lint and 20 instrumentation tests passed, as did 57
selected local core checks, Clippy with warnings denied and formatting.
All 64 selected core tests also passed directly on ARM64 Android. Native checks
confirmed the horizon goal and restored preparation, and changing the lens
material index moved the visible focus from 5.063 m to 4.507 m. Detailed
results and limitations are recorded in the private D80 report.
An emulator does not prove physical-device performance.

The versioned folder contains APK, installation notes, third-party notices,
SHA256SUMS.txt and the unchanged MPL-2.0 source archive for generational-arena
0.2.9. Application source, signing material and macOS installer stay private.
GitHub Actions in the app repository remain disabled by the author's decision;
these are local build and test results, not passing CI.

Only the Fyzika catalog record (Supabase apps.id = 29), its offline fallback,
versioned public files and screenshots change. Counters and other records are
preserved. The CMS link switches only after deployment and a complete public
APK download with matching hash. The supported build regenerates matching
catalog/HTML/service-worker cache fingerprints. The new APK has an explicit
MIME/attachment/immutable-cache rule and stays outside PWA precache; older
release folders remain available.

The new lead screenshot is an unedited native capture from this exact release
on the API 35 ARM64 emulator, showing the ship beyond the horizon after changing
distance. The retained water screenshot is from 0.1.10, and the regular mission,
play and editor screenshots are from 0.1.3. These are application captures,
not proof of physical tablet or child acceptance.
