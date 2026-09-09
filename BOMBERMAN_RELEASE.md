# BomberMan 2.0.5 for Windows — 2026-09-09

The user requested a Windows application download on jenda.cool. The catalog detail is `/#app=bomberman`; no browser edition is being published.

- Artifact: `/binaries/bomberman-2.0.5/BomberMan-2.0.5-portable.exe`
- Size: 104158434 bytes (104.2 MB / 99.33 MiB), below GitHub's 100 MiB file limit.
- SHA-256: `9f9e91ddd07f15e7f86059aa29b1ed3016c8ab5b0b8b8d8e2969ec9413e7c052`
- Source: JendaNDT/BomberMan commit `a8b7a4d75a6f11107118784c61d445b85864928a`; existing Windows portable build, unchanged.
- Requirements: Windows 10/11 x64. Portable, no installation. Unsigned; the catalog explicitly notes that Windows may warn or block it.
- Supabase `apps`: reserved ID 31, platform Windows, sort -2. The identity sequence was behind the existing manually inserted ID 30; advancing it reserved the next free ID without changing existing rows.
- Database migration adds Windows to the platform check; RLS and permissions stay intact. The admin form and counters support Windows.
- Offline fallback matches the catalog. `index.html` and `sw.js`: `jw-v100`.
- Binary downloads bypass the portfolio service worker. Existing RT Asistent worker isolation is preserved.
- Versioned download has attachment, octet-stream and immutable caching headers.

## Screenshots

`screenshots/bomberman-2.0.5/gameplay.png` is an unmodified Chromium capture of version 2.0.5 running the story mode, Czech, default scanlines off. `menu.png` is the earlier real Electron menu capture with the Quit option. The icon comes from the game's own build assets. No generated marketing mockups.

## Validation before publication

- Combined JSX and admin JSX compile with the site's bundled Babel; diff whitespace check passes.
- Czech detail, installation notes, Windows filter and English detail verified in the local browser.
- At 390 px, the detail has no horizontal overflow; icon and both screenshots load. No captured browser console errors in the local preview.
- The local preview uses data.js rather than changing the live catalog before the assets are available.
- Game runtime had already passed its Windows checks. Capture run also passed all 48 QHD/4K emulation checks; physical QHD/4K monitors were not tested. This does not assert that the unsigned packaged EXE passes Windows application control.

## Publication order

Push site assets and catalog support through the existing main → Vercel integration, verify the entire deployed EXE against SHA-256, then add the live Supabase row. Verify the public catalog and its download button afterward.
