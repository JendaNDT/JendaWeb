# BomberMan 2.3.0 — five save slots and durable desktop saves

Prepared catalog update for https://jenda.cool/#app=bomberman. Publication is pending upload of the verified packages to the public JendaWeb release `bomberman-v2.3.0`. Do not merge this web update before the release assets are available.

Five manual positions are available for saving and loading, with overwrite confirmation and separate per-mode autosaves. The desktop app acknowledges saves after writing them to a stable user-data file with a backup. Existing manual saves become slot one. Manual saves remain available after loading and game over. The portable EXE stores saves in user data on that computer, not alongside the executable.

## Packages

Same four binaries as the private BomberMan release, without publishing private source to this repository. `/binaries/bomberman-2.3.0/` redirects point to the public release; earlier versioned downloads stay available.

| File | Bytes | SHA-256 |
|---|---:|---|
| BomberMan-2.3.0-mac-arm64.dmg | 111388764 | `7de02418d8a9082e1f2cfc31e47653c500a1c12d1f9cc97c30fd863cbbcccb22` |
| BomberMan-2.3.0-mac-arm64.zip | 122622530 | `65e422816c82ea7f49f5a182619e7746ebc2eb30b6b61c9519387de209eacda6` |
| BomberMan-Setup-2.3.0.exe | 105202108 | `5e70a329a017ad403d587db3b7cb062f716dbfc29b946bf307143f56faf38b0b` |
| BomberMan-2.3.0-portable.exe | 104771766 | `c269d14380a53d73e303eed9a103c205039f695a265c80a720c2c9ddff31a900` |

## Verification

The complete local macOS arm64 release gate passed all eight stages, including native packaged save/restart/selected-load tests, LAN tests and both DMG/ZIP container checks. Windows x64 Setup and portable were cross-built and both containers checked. Native Windows execution, physical Windows–Mac crossplay and a physical power cut have not been tested. Windows binaries are unsigned; Mac has an ad-hoc signature without notarization.

The website retains catalog record 31 and its counters. `data.js` is the fallback; the production Supabase row must receive matching descriptions, links, screenshots and download sizes after the assets and website deployment are live. No schema or permissions change is required. The production build generates matching fingerprinted catalog assets, HTML and service worker.
