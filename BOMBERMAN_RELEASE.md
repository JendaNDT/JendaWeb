# BomberMan 2.3.0 — five save slots and durable desktop saves

Catalog update for https://jenda.cool/#app=bomberman. The four verified desktop packages are distributed directly by the website using its existing multipart binary format. GitHub Release publication is separate and still pending.

Five manual positions are available for saving and loading, with overwrite confirmation and separate per-mode autosaves. The desktop app acknowledges saves after writing them to a stable user-data file with a backup. Existing manual saves become slot one. Manual saves remain available after loading and game over. The portable EXE stores saves in user data on that computer, not alongside the executable.

## Packages

The four final binaries are stored as 20 MiB parts in `binaries/bomberman-2.3.0/`, following the existing admin uploader format. The download buttons fetch every part in order, verify the total byte size and save one correctly named installer or archive. `manifest.json` records the part order and whole-file hashes; `SHA256SUMS.txt` is also directly available. Earlier versioned downloads stay available. Private game source is not included.

| File | Bytes | SHA-256 |
|---|---:|---|
| BomberMan-2.3.0-mac-arm64.dmg | 111388764 | `7de02418d8a9082e1f2cfc31e47653c500a1c12d1f9cc97c30fd863cbbcccb22` |
| BomberMan-2.3.0-mac-arm64.zip | 122622530 | `65e422816c82ea7f49f5a182619e7746ebc2eb30b6b61c9519387de209eacda6` |
| BomberMan-Setup-2.3.0.exe | 105202108 | `5e70a329a017ad403d587db3b7cb062f716dbfc29b946bf307143f56faf38b0b` |
| BomberMan-2.3.0-portable.exe | 104771766 | `c269d14380a53d73e303eed9a103c205039f695a265c80a720c2c9ddff31a900` |

## Verification

The complete local macOS arm64 release gate passed all eight stages, including native packaged save/restart/selected-load tests, LAN tests and both DMG/ZIP container checks. Windows x64 Setup and portable were cross-built and both containers checked. Native Windows execution, physical Windows–Mac crossplay and a physical power cut have not been tested. Windows binaries are unsigned; Mac has an ad-hoc signature without notarization.

The website retains catalog record 31 and its counters. `data.js` is the fallback; the production Supabase row must receive matching descriptions, links, screenshots and download sizes after the assets and website deployment are live. Multipart primary and secondary download controls are covered by isolated handler tests, including failure and repeat-click behavior. No schema or permissions change is required. The production build generates matching fingerprinted catalog assets, HTML and service worker.
