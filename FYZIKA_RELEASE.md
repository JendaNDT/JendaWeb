# Fyzika pastelkou — 2026-09-17, teacher editor completion

Release **0.1.14-android.16 (code 16)** completes the agreed teacher editor
features. Teachers draw fixed lines and free bodies into their tasks, refine
them with an explicit comparison preview, and retain the original samples.
Laboratory setup values are independent of child permissions; controls and
sound panels can be added or removed. Optical editing adds a screen, blocking
obstacles and direct settings groups. Validated undo/redo history survives
restarting. Drawn lessons and drafts with history need this version or newer
on the receiving device; older files remain readable.

Signed APK: **14,161,631 bytes**, SHA-256
`3914526ef159602a9f24659c70f890130a87cdf83278785d78e931c1a6245639`.
Original release signature, package identity, non-debuggable manifest, licence
assets and 16 KB ZIP/ELF alignment are verified. Updating the exact public
code 15 APK to code 16 preserved all eleven files, including preferences,
after installation and first launch. Signed-app drawing, comparison preview, cancellation, confirmation and
undo/redo across two restarts passed. All 32 selected ARM64 core tests,
20 instrumentation tests and release lint passed; one fixture generator was
intentionally ignored and lint retained five existing warnings. The test
assertion was updated for draft format 4; the signed artifact is unchanged.
Production publication is pending its separate receipt.

The app is still an alpha. Atlas counts remain 152 definitions, 77 recorded
solutions and 75 awaiting gameplay verification. Physical tablet, pen/palm,
Windows and child acceptance remain deferred. Application source and signing
material stay private. Only Fyzika's descriptions, APK link and screenshot list
change; other applications and counters are preserved. The lead screenshot is an unedited native capture from this signed APK.
The five versioned
release files include installation instructions and upstream licence material.
GitHub Actions remain disabled by the author; local tests are not CI.

# Previous release — 2026-09-17, general stroke refinement

Release **0.1.13-android.15 (code 15)** adds manual refinement of a general
mechanical stroke. Menu → Nástroje → Zpřesnit tah shows the original and
proposed path before confirmation; undo restores the original. The helper
reduces small wobble, straightens nearly straight segments and smooths curves
while preserving distinct corners and endpoints. It does not recognize named
shape templates. Fixed and movable crayon strokes are supported during
preparation and teacher trials; attached strokes, wires, ropes and liquids
are left unchanged. Confirmed paths are saved alongside original samples;
older apps reject the new construction format, including nested transfers.

The release also includes named editor choices, angles shown in degrees and
specific explanations when a task cannot be shared. Existing laboratories,
custom lesson transfer and optical composition remain included. The regular
Atlas still has 152 definitions, 77 recorded winning solutions and 75 awaiting
gameplay verification; the new demonstration is outside that catalog.

Signed APK: **14,087,903 bytes**, SHA-256
`d88f8d52b5a6487d146f44a56481a5f128d8fd8cb7203b4dca096e815456f8c2`.
Original certificate, release identity, non-debuggable manifest, embedded
notices and 16 KB ZIP/ELF alignment verified. The exact public code 14 → 15
upgrade preserved all nine local files after installation and first launch.
The new screenshot is an unedited capture from this signed release on an
API 35 ARM64 emulator. Other screenshots retain their versioned paths.

Validation includes 1342 opt-in core tests, 18 new tests in the default build,
58 integration checks, nine GPU captures, 39 checks executed as ARM64 Android binaries (18 new refinement checks), release lint and 20 instrumentation tests. Signed-app preview,
confirm/cancel, undo/redo and restart were also checked. Exact evidence and
intentional ignored reports are recorded in the private D84 protocol. GitHub Actions remain disabled; local results are
not CI. Physical tablet, pen/palm, native Windows and child acceptance remain
open. Application source and signing material stay private. Only Fyzika's
catalog descriptions, APK link and screenshots change; other rows and
counters are preserved. Production publication succeeded: all five public files
match their local hashes, and the primary catalog matches the fallback. Other
28 rows and all unrelated fields were preserved. The existing browser session
updated its PWA cache on ordinary reload; the new screenshot and expanded notes
loaded. One actual Stáhnout click downloaded the exact APK and increased the
initiated-download count from 16 to 17 (not an installation count). No page
errors were recorded. The private D84 receipt contains the full evidence.

## Previous release — 0.1.12

Release **0.1.12-android.14 (code 14)** adds verified transfer of
custom laboratory lessons and free optical composition in the teacher editor.
Mirrors, thin and physical lenses share add/copy/remove, controls and undo.
The transfer preserves the original child task and verifies the solution again
on import, including timed piston heating. New laboratory packs require this
version at the receiving end; older files remain readable.

The signed APK is **14,038,751 bytes**, SHA-256
`0a05bc1fd792a0767471e470c859f18d5fdc153bbd61cf8aa83cde4fa1f49a7d`.
Signature, package identity, non-debuggable manifest, embedded licences and
16 KB ZIP/ELF alignment passed. Updating the exact public code 13 preserved
all nine files; first launch migrated only workspace version 1 to 2 and kept
the pre-migration workspace as its recovery backup. The installed APK matches.

Validation: 1318 opt-in and 1296 default core tests, 31 integration tests,
29 selected tests executed on ARM64 Android, release lint, 20 Android
instrumentation tests, Clippy and formatting. Intentional ignored reports are
listed in the private D82 evidence. Native signed-app checks cover optical
add/copy/remove, undo/redo, numeric editing, restart, a winning horizon trial
and local publication to children. This is not a full manual teacher audit.
The leading screenshot is an unedited capture of this signed version's new
optical editor; older captures retain their versioned paths.

Release scope remains alpha, private application source and public Android APK.
Physical tablet, pen/palm, native Windows and child sessions remain open.
D81 shape refinement stays a separate plan. GitHub Actions remain disabled;
these are local checks. Primary catalog switches only after public downloads
match; only Fyzika descriptions, link and screenshots may change. Counters
and unrelated catalog rows are preserved. Matching fallback/PWA assets are
generated by `build_site.cjs`. Production deployment succeeded. All five public downloads and the static
assets match the release commit. The primary catalog changed only the four
authorized Fyzika fields; other rows and counters were preserved. The existing
browser session moved to the new PWA cache on ordinary reload. Two actual QA
download clicks incremented the initiated-download counter from 14 to 16; the
complete named APK matches the SHA-256 above. Expanded release notes, new
screenshot and page-error checks passed. The private D82 publication receipt
contains exact commits, hashes and screenshots.

## Previous release — 2026-09-16

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
