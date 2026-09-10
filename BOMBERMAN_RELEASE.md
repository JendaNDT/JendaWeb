# BomberMan 2.1.1 — Windows and Apple Silicon Mac

Public catalog: https://jenda.cool/#app=bomberman

The existing BomberMan record (ID 31) is updated from 2.0.6. The card and detail offer two primary downloads: Windows Setup and Apple Silicon DMG. Portable EXE and Mac ZIP are secondary links in the detail. Czech and English copy, Windows/macOS filters and the offline fallback agree. No browser edition is published.

## Distribution

Packages are publicly hosted as assets of the JendaWeb release `bomberman-v2.1.1`, with versioned redirects from `/binaries/bomberman-2.1.1/`. This avoids the 100 MiB ordinary Git file limit and the existing Supabase Free upload limit. The game source repository remains private. The automatically attached source archives in this public release contain JendaWeb, not the game.

The bytes were built from game commit `d980bc1d78ff1e5af4653e381a80bf74665aec3b`, merged as `0c80b8966a253c171313bc2f5ac1146613250a60`. The merged tree matches the tested source. Game version 2.1.1, network protocol 3, build fingerprint `572938d2fed40f134b1617fd37945039`.

| File | Bytes | SHA-256 |
|---|---:|---|
| BomberMan-2.1.1-mac-arm64.dmg | 111434740 | `ab67e2d3a7b8c8c5df3b8f28b80e424fc0e8d920e7982e7ec0a1a2d7490d559e` |
| BomberMan-2.1.1-mac-arm64.zip | 122614189 | `51c34dbcc5bcab3c09becd9a1ab7031d31adcdcb55c11fb3df6c040ef8324d38` |
| BomberMan-2.1.1-portable.exe | 104765246 | `42f10843c07950a5ac2231120379f1afa106303c850fc30f49052541dc8a61db` |
| BomberMan-Setup-2.1.1.exe | 105195563 | `3c9bbb3c79a615f74196108b4fa71b23d1f478888704766f31e4e10d0176a16f` |
| SHA256SUMS.txt | 379 | `23b31ce871812d76731ee61901fb0e8be4c6cd0566d3f5ae626228c8f98784bf` |

## Catalog and deployment

The `desktop_download_choices` migration adds `apps.downloads` (an array of labeled download URLs, primary/secondary role, version and display notes) and allows macOS / Windows + macOS. Existing single-link apps retain their behavior. Admin editing preserves the new download metadata and offers the new platform values. RLS and permissions are unchanged. Only BomberMan's catalog content is replaced; likes and the record ID are retained.

`index.html` and `sw.js` use `jw-v105`; both catalog script URLs carry the same version so an older service worker cannot supply a mapper without download choices. Binary routes still bypass service-worker caching. Deployment follows the existing main → Vercel integration. The two screenshots are unmodified captures of the 2.1.1 game / packaged Mac LAN checks.

## Validation and limits

- The seven-stage local native Mac release verification passed, including packaged LAN operation. All four package contents were inspected. The current files were rehashed before upload.
- All public GitHub downloads returned HTTP 200, the expected bytes and matching SHA-256. EXE, ZIP and DMG container signatures were checked.
- Site and admin JSX compile; all other fallback app records are unchanged. Card and detail, both languages, Windows/macOS filtering, and 390 px layout were inspected in the browser. Download links are separate from the card's detail link, with no nested anchors.
- All four packages and the checksum file were also downloaded through the public jenda.cool redirects: HTTP 200, correct file signatures, lengths and matching SHA-256. The live catalog is checked after deployment.
- Windows is unsigned; the Mac is ad-hoc signed and not notarized. OS warnings or blocking remain possible.
- Native Windows runtime and physical Windows–Mac crossplay have not been verified. GitHub game CI did not start because of the account's billing/spending limit. The user accepted these known limits for this publication. Multiplayer is LAN only.
