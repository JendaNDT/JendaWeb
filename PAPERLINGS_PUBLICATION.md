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
