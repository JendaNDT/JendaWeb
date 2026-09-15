# Fyzika pastelkou — 2026-09-15

Version **0.1.10-android.12 (code 12)** includes the M1–M4 drawing update:
six crayons with consistent colours and symbols, stroke-based water and oil,
separate liquid allowances, Undo/erase/retry, and liquid authoring in the
teacher editor. Shared tool names, keyboard commands, help and TalkBack
explanations use the same availability rules. Saved work and custom tasks can
be transferred between compatible devices.

It retains the 0.1.9 physics fixes and the D65 tablet interface and teacher
workflow. It remains an **alpha**: 152 mission definitions in 12 chapters,
77 recorded winning solutions and 75 definitions still awaiting gameplay
verification. This release does not close those content gates. Native Windows,
physical tablet, pen/palm and sessions with children/teachers remain pending.

The signed ARM64 APK requires Android 9+ and Vulkan. It is 12,822,239 bytes;
SHA-256: `9f4cc62711eef78bfdfae0308c398990e1a8364ea5347d9eef1fce5f7d73b926`.
Its original signing certificate supports an update without uninstalling.
Signature, package identity, non-debuggable release status and 16 KB alignment
were checked locally. The exact code 11 → code 12 upgrade was run on an
isolated API 35 ARM64 emulator: all eight original data files remained byte
identical after the first launch, and the existing drawing remained visible.
The exact release also passed native task import from Mac, drawing water and
oil (24 particles of each), restoration of all 29,881 workspace bytes after
force-stop/relaunch, and the task's actual success result. Logcat contained no
app crash, ANR or panic. The release checks included 68 targeted tests, Clippy
with warnings denied and formatting. An emulator does not certify physical
hardware.

The versioned folder contains the APK, installation notes, third-party notices,
SHA256SUMS.txt and the unchanged MPL-2.0 source archive for generational-arena
0.2.9. The app source, signing material and macOS installer remain private.
GitHub Actions in the private app repository remain disabled; this is a locally
built and verified release.

Only the Fyzika catalog record (Supabase apps.id = 29), its fallback data,
versioned public release files and screenshot are updated. Counters and other app records are
preserved. The CMS switches after deployment and a full public download that
matches the locally signed APK. The supported site build regenerates the
catalog fingerprint and matching HTML/service-worker cache version. A specific
APK MIME/attachment/cache rule covers the new URL; APKs stay outside the PWA
precache and older downloads remain available.

The lead screenshot is an unedited native capture from this exact release
on the API 35 ARM64 emulator: the six crayons and a custom task with drawn
water and oil before simulation. The older screenshots retain the D65 interface: mission, play and editor
views from 0.1.3 and a circuit win from 0.1.4, captured on an API 35 ARM64
emulator. They are not evidence of physical tablet performance.
