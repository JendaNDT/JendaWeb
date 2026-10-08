# Škoda Racer publication

The owner requested publication on jenda.cool for Android and Windows.

- Catalog: public.apps id 35, matching data.js fallback.
- Detail: https://jenda.cool/#app=skoda-racer
- Test release 1.16.0, source commit fb031160eecd0650ec786b4bd71e685a07154e14.
- Original GitHub release assets match manifest.json and SHA256SUMS.txt.
- Android APK is served directly; Windows EXE uses the existing six-part download control and is saved as SkodaRacer.exe.
- Original game icon is from the same source commit.
- Published and verified on 2026-10-07. Production deployment dpl_GhNjWtp2hYQPtTxppyophwKxQqw9 for commit 538aa6f5d33e8ee149a63eab2e3081a52faf5b1d reached READY on jenda.cool.
- Full public downloads returned HTTP 200 with the expected MIME types, attachment filenames, sizes and SHA-256 values. All six Windows parts were checked individually and their combined EXE hash matches the original.
- Supabase record 35 was inserted only after public download verification. Public REST fields match the fallback catalog.
- Website build and 19 startup/cache checks passed, along with download-count and gallery checks. A focused check of the actual Windows download control reconstructed the original EXE and verified the repeated-click guard.
- Live browser check confirmed the Czech detail, version, both download controls and original icon. No application-origin console errors were captured.
- Native game execution was not tested during this distribution task.

## Update 1.19.0 — 2026-10-08

- Source commit: 14c5b935f44cf6db3a291fb4e5a1639e4cd225f5.
- Release assets verified against the versioned manifest and original SHA256SUMS.txt.
- Android: 53,453,558 bytes; Windows: 110,194,776 bytes, delivered through six parts.
- Updated Czech and English descriptions include the balloon battle mode.
- Existing app record, icon and download counters are retained.
- Publication verification pending.
