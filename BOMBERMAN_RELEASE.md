# BomberMan 2.3.2 — visible difficulty selection

Catalog update for https://jenda.cool/#app=bomberman. The four verified desktop packages use the existing multipart download format. The [game release](https://github.com/JendaNDT/BomberMan/releases/tag/v2.3.2) is published in the private game repository.

## Co je nového

Obtížnost nové hry vybereš přímo nad seznamem místních herních režimů. Šipkami ←/→ přepneš mezi Snadná, Normální a Těžká; krátký popis ti pomůže s první volbou. Načtené hry si zachovají svou obtížnost a Denní výzva zůstává na normální.

## What's new

Choose the difficulty for a new game directly above the local game modes. Use ←/→ to switch between Easy, Normal and Hard; a short description helps you choose before your first game. Loaded games keep their own difficulty, and the Daily Challenge stays on Normal.

The setup screen shares the same selection. Enemy behavior from 2.3.1, both bosses, enemy counts and speeds, accumulating portal reinforcements, battle CPU players and LAN rules are unchanged. Five manual save slots, overwrite confirmation, separate per-mode autosaves and durable desktop saves from 2.3.0 remain included. Existing save descriptions, five screenshots and earlier versioned downloads are preserved; the new menu screenshot is added only to BomberMan.

## Packages

The four final binaries are stored as 20 MiB parts in `binaries/bomberman-2.3.2/`, following the existing admin uploader format. Download controls fetch every part in order, check the complete byte size and save one correctly named installer or archive. `manifest.json` records the published game commit/tag, tested commit, network identity, part order and whole-file hashes; `SHA256SUMS.txt` is directly available. Private game source is not included.

| File | Bytes | SHA-256 |
|---|---:|---|
| BomberMan-Setup-2.3.2.exe | 105202394 | `6542ac70cfa4a0458743ee9ea3b562b2768eff35620188e5e3fec63f8a7e32be` |
| BomberMan-2.3.2-portable.exe | 104772033 | `45bb85bb5e818633906950cd0677612d1b706210b4dda650e5caeb0c16d24622` |
| BomberMan-2.3.2-mac-arm64.dmg | 111388919 | `34958bf5890f91ce5af480ce7f2ca3d3da18c4f461096fe5f7854feef214a5ad` |
| BomberMan-2.3.2-mac-arm64.zip | 122623023 | `1819ae7fca11653768a67d5beb2fd67a2185f9a37379fe13c587285a5ecfcb6b` |

## Provenance and verification

Game main and tag `v2.3.2` point to `fea93f307821602d31a946612fa4276eba8e5c66`, whose tree matches tested commit `a0f37b5b0a5b61871dde39f3becf46abea207fc0`. LAN identity uses protocol 4 and build `295f386b292ed056b3f42fb2a3a45c8f`; use the same version and build on all players.

The game handoff confirms all eight local macOS arm64 release stages passed, including native window/focus checks, packaged saves across restart and networking between two packaged Mac copies. It also confirms strict Mac signature verification, both Windows EXE container checks, and a repeated packaged menu check. All five GitHub release assets were downloaded in full and verified against the final originals. Native Windows execution and physical Windows–Mac crossplay were not tested. PR and main GitHub Actions were blocked by account billing/spending limits before any steps; these are not passed CI runs. Windows binaries are unsigned; Mac has an ad-hoc signature without notarization.

The website retains catalog record 31 and its counters. `data.js` is the fallback; production Supabase receives matching descriptions, screenshots, links and complete download sizes after assets and deployment are live. No schema or permissions change is required. The build produces matching fingerprinted catalog assets, HTML and service worker. Other applications, music and existing URLs remain intact.

`tests/multipart-downloads.cjs` resolves the release manifest from the current catalog version and checks complete artifact hashes, order, sizes, filenames, all four primary/secondary controls, progress/errors, repeat-click handling and retry in an isolated simulated environment. Production verification must separately download every part anonymously from jenda.cool and compare the reconstructed files against the final originals. A simulated check is not visual browser QA.
