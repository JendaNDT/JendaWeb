# BomberMan 2.2.0 — teams, map voting and achievement progress

Catalog: https://jenda.cool/#app=bomberman

This update adds 2v2 team battles with shared scoring, ten-second voting for the next arena theme, and achievement progress. The existing BomberMan record (ID 31) and its download counter are retained. The small catalog card opens the detail; Windows Setup and Apple Silicon DMG are the main download choices there, with portable EXE and Mac ZIP as alternatives.

## Distribution

The public JendaWeb release `bomberman-v2.2.0` hosts the packages. Versioned `/binaries/bomberman-2.2.0/` redirects provide the website links. Existing versioned downloads remain available. The private game source repository is unchanged by this web publication; GitHub's automatic source archives in the public release contain JendaWeb, not the game.

The packages were built from `d63f5ad3f41b034e8b547f1f445c5577bcc3dcbd`, merged as `e2a7a91e83ec62e963b750bfa0064974298c9101`. The merged tree equals the tested source. Game version 2.2.0, network protocol 4, build identity `8bbbd497eea166c722bb78f534d49898`. All players in a LAN match need this matching version.

| File | Bytes | SHA-256 |
|---|---:|---|
| BomberMan-2.2.0-mac-arm64.dmg | 111404295 | `4e4b4d87dd7aeea2f43a0ba59beb9275d06f65a5507bc04006d0d8f8cb45eb7e` |
| BomberMan-2.2.0-mac-arm64.zip | 122618508 | `94e67527253be8771a6e5fab8c3cd1b6d63599474c5ec22fab39799a93d5be90` |
| BomberMan-Setup-2.2.0.exe | 105199002 | `08c83dd14642e81884c2e747b46fc8952b388ad1b250e0472535adc324c17eaa` |
| BomberMan-2.2.0-portable.exe | 104768676 | `8b98a5b330f23bd5935a2a1aaef5b941be20469ba96539ddd074b41897a98285` |
| SHA256SUMS.txt | 379 | `af0bdc2e7c8c6ce749e6cac02abfb16c16152b3f5960fc7c6d4455552dbb2dcd` |

## Catalog and deployment

Supabase `public.apps` is the primary catalog and `data.js` is its offline fallback. The update changes only BomberMan's descriptions, download URLs, file-size labels and screenshots. No schema or access-policy changes are needed.

The catalog script URLs, page loader and service worker share cache version `jw-v108`. Downloads bypass the offline cache. Deployment uses the existing main-to-Vercel integration. New screenshots show the team battle, map vote and achievement progress.

## Validation and limits

The seven-stage local Mac release check passed, including packaged LAN operation. All four package containers were inspected and their current bytes rehashed against that evidence. The source tree matches the merged GitHub main. The web update passes syntax and catalog checks; other fallback entries are unchanged.

Native Windows operation and physical two-computer Windows–Mac play have not been verified. GitHub game CI ended without executing test steps. Windows packages are unsigned; Mac packages have an ad-hoc signature without notarization. Multiplayer is LAN only.
