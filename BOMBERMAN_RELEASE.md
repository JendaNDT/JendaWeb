# BomberMan 2.3.1 — easier bomb hits on Easy and Normal

Catalog update for https://jenda.cool/#app=bomberman. The four verified desktop packages are distributed directly by the website using its existing multipart binary format. The [game release](https://github.com/JendaNDT/BomberMan/releases/tag/v2.3.1) is published in the private game repository.

## Changes

Enemies on Easy and Normal are easier to hit with bombs because they react to bombs placed by others later: 0.35 seconds before detonation on Easy and 0.55 seconds on Normal. Hard difficulty keeps its existing behavior. Enemy counts, speeds and accumulating portal reinforcements are unchanged, as are both bosses and battle CPU players.

Five manual save slots, overwrite confirmation, separate per-mode autosaves and durable desktop saves from 2.3.0 remain included. Existing save descriptions, screenshots and earlier versioned downloads are preserved.

## Packages

The four final binaries are stored as 20 MiB parts in `binaries/bomberman-2.3.1/`, following the existing admin uploader format. The download controls fetch every part in order, verify the total byte size and save one correctly named installer or archive. `manifest.json` records the published game commit/tag, tested commit, network identity, part order and whole-file hashes; `SHA256SUMS.txt` is directly available. Private game source is not included.

| File | Bytes | SHA-256 |
|---|---:|---|
| BomberMan-2.3.1-mac-arm64.dmg | 111388948 | `c64210ab01d6013beeb1277d07fb298d9cef189879bd2f4730f3baeed8acacac` |
| BomberMan-2.3.1-mac-arm64.zip | 122622975 | `5977ab3a436982d4772c5643a40228d72df9cc10e8c1a7b12c5852ab5f552002` |
| BomberMan-Setup-2.3.1.exe | 105202459 | `307b6699ccefd0f246ae143c5f68097dd3ffdd0af2764bf2c4173453985bab82` |
| BomberMan-2.3.1-portable.exe | 104772113 | `0ff0d2465dd432f86e0e477a78260a3c541c7164a3afa2b2f6e54060d9fa089d` |

## Provenance and verification

Game main and tag `v2.3.1` point to `f4e297c0b13e93311067aaf42bac3ae1bf33bf2d`, whose tree matches tested commit `2a21d890cff33323956ff2fd265be39dff5b5c47`. LAN identity uses protocol 4 and build `96f3a0a175883a5c99ac2bba6caa8c6e`; use the same version and build on all players.

The complete local macOS arm64 release gate passed all eight stages, including native packaged save/restart tests and networking between two packaged copies. Strict code signature verification passed. Both Windows x64 EXE containers were unpacked and their contents, identities and notices verified. Native Windows execution and physical Windows–Mac crossplay were not tested. GitHub Actions was blocked by the account billing/spending limit before jobs started; this is not a passed CI run. Windows binaries are unsigned; Mac has an ad-hoc signature without notarization.

The website retains catalog record 31 and its counters. `data.js` is the fallback; production Supabase receives matching descriptions, links and download sizes after assets and deployment are live. No schema or permissions change is required. The build produces matching fingerprinted catalog assets, HTML and service worker.

`tests/multipart-downloads.cjs` resolves the release manifest from the current catalog version and checks complete artifact hashes, order, total sizes, filenames, all four primary/secondary controls, progress/errors, repeat-click handling and retry in an isolated simulated environment. Production verification must separately download every part anonymously from jenda.cool and compare the reconstructed files against the release manifest. A simulated check is not visual browser QA.
