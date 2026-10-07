# Paperlings publication

The author requested publishing both music builds among the applications on jenda.cool.
Version 1.0.0-rc2 is a prerelease. Native Windows and Android device testing remains pending.

- Catalog record: public.apps id 34; matching fallback seed in data.js.
- Detail: https://jenda.cool/#app=paperlings
- Installation page: https://jenda.cool/paperlings/
- Assets: binaries/paperlings-1.0.0-rc2/ with manifest, checksums, licenses and instructions.
- Android installs independently as cool.jenda.paperlings and does not import old progress.
- Both installers were recovered from Lemmings-2026 commit 223105d47a0996e6783085868701b8c6d8068b1b and match the manifest checksums.

## Publication state

Published and verified on 2026-10-05.

- Production deployment dpl_DBY4d8MMiJCD31L7uGU3cALydcLG for commit 5bd2403113e0c3067ae53f042c5d057e485f36a7 reached READY.
- Full downloads from jenda.cool returned HTTP 200 with correct MIME types, attachment filenames, byte counts and SHA-256 values: Android 80,456,862 bytes / 2c47ab0597cb16cc639ecc9955673daa45bd9f086d3b244d0e2d65d86028b064; Windows 65,356,247 bytes / df3e23b0911cec585e81101732284ced0cbfe16a90e755f07b9d5879e2f4945e.
- Only after download verification, Supabase public.apps id 34 was inserted. Its public REST response matches every field in the fallback seed, with both primary download controls.
- Build/check and 19 startup/cache checks passed; download-count and gallery checks passed; 9 contact and 21 music/newsletter checks passed.
- Browser QA: real image loading, Czech/English detail and Windows filter, 390 px layout without horizontal overflow. Live catalog loaded the CMS record and both download links; no captured browser errors.
- Native Windows/Android device tests remain pending; this is a prerelease.

## Recovery

The source distribution is in JendaNDT/Lemmings-2026 branch downloads/android-1.0.0-rc2.
It holds both installers and web/JendaWeb-Paperlings-rc2.patch. The patch provides the original
installation page and metadata. This publication additionally integrates the normal catalog card.

## Android rc3 update — 2026-10-07

The owner requested the newest available version. Source distribution commit be8180c299cb2d9e0d1a96a3e1746cdef9bb4e09 contains Android 1.0.0-rc3 only; Windows stays at rc2 as specified by its README.

- APK: 80,460,958 bytes, SHA-256 e13db4f4ac01f2b619ff743d34b948c741da8b973a90566d7f886968cb69a0aa.
- Install over rc2 without uninstalling to retain progress. The package and signing identity are unchanged.
- Catalog id 34 and /paperlings/ updated with platform-specific versions and installation instructions. Likes and download totals are retained.
- Published and verified on 2026-10-07. Production deployment dpl_3Bn5TB385LTTWrA1wXytgXqgKiVQ for commit 57c0228008ac5ed4c2fda588931ccc65e783f578 reached READY.
- Full public Android rc3 and Windows rc2 downloads returned HTTP 200 with correct attachment headers, MIME, sizes and original SHA-256 hashes.
- Existing CMS id 34 was updated only after public downloads passed verification; its public response matches the fallback metadata. Likes and download totals were retained.
- The website build, 19 startup/cache checks and download-count checks passed. Live browser verification confirmed both platform versions, the new Android link, and the Czech installation instructions on /paperlings/.
- The Android performance improvement has not been measured on the owner's physical tablet during this publication task.
