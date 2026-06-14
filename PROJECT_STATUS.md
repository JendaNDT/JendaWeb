# JendaWeb – Project Status
*Naposled aktualizováno: 14. 06. 2026*

## 🎯 Co to je
Osobní portfolio web „Jenda — vibe coder & AI hudebník". Prezentuje appky + AI hudbu, vč. plnohodnotného hudebního přehrávače.
Stack: React 18 + ReactDOM, Babel Standalone (JSX se transpiluje přímo v prohlížeči), čisté CSS + inline styly. **Žádný build, žádné npm** — otevřeš `index.html` (přes http server) a běží. Od 14. 06. 2026 **plně offline-capable** (knihovny i fonty hostované lokálně). Instalovatelná PWA, dvojjazyčné CZ/EN, dark/light + 3 barevné motivy.

## ⏭️ Příští krok
**Nasadit na HTTPS (GitHub Pages / Netlify / Vercel) a otestovat instalaci na telefonu.**
PWA se nedá nainstalovat ani spustit service worker z `file://` — potřebuje běžet přes HTTPS (nebo localhost). Po nasazení ověřit: nainstaluje se na plochu, ikona sedí, a po zapnutí letového režimu appka naběhne offline.

## ✅ Hotovo
- **Kompletní UI a struktura webu** — Hero, sekce Aplikace, Hudba, Kontakt, Footer
- **Offline soběstačnost (14. 06. 2026):** React/ReactDOM/Babel staženy lokálně do `vendor/`, fonty Syne + DM Sans self-hostované (`vendor/fonts/`), service worker precachuje celý boot (verze `jw-v15`). Web už nepotřebuje žádné CDN.
- **PNG ikony pro iOS (14. 06. 2026):** `icons/` 180/192/512, „J" v brand fontu, full-bleed (funguje jako maskable i na iPhonu)
- **Hudební přehrávač s plnou výbavou:** mini přehrávač, fullscreen expand (E), fronta/queue (Q), vizualizér bars/radial/mirror (V), audio analyzér (D), A/B loop (A/B/Z), rychlost přehrávání, shuffle, repeat
- **Cmd+K vyhledávání** napříč obsahem + bohaté klávesové zkratky (`?` zobrazí seznam)
- **Obsah:** 20 aplikací, 5 alb / 15 skladeb (3 mají texty), 3 case studies (MeditApp, BeatCraft, ChordLens)
- **Procedurální artwork** — deterministické SVG obálky skladeb i alb
- **Dvojjazyčnost CZ/EN**, přepínání motivů (ember/velvet/desert) + dark/light/auto
- **PWA infrastruktura:** service worker (offline cache), manifest, sitemap, robots.txt, RSS feed, 404 stránka, embed přehrávač
- **Extra sekce:** newsletter, statistiky/build log, srovnání aplikací, kontaktní formulář, Ko-fi tlačítko
- **Oprava 3 překlepů v českých textech** (14. 06. 2026)

## 🔄 Rozjeté (nedodělané)
- **Reálný obsah** – kostra webu hotová, ale data jsou zatím placeholder (viz Příští krok + TODO níže)

## 📝 TODO
### MVP (nutné pro spuštění naživo)
- Nasadit na HTTPS + otestovat instalaci PWA na telefonu (viz Příští krok)
- Audio URL skladeb (`audioUrl` / `downloadUrl` v `TRACKS_DATA`) — ze Suno
- Reálné odkazy aplikací (`link:'#'` v `APPS_DATA`)
- Reálné odkazy sociálních sítí (`url:'#'` v `SOCIALS`)
- Reálný e-mail (teď `jenda@example.com`) + kontaktní endpoint (Formspree)
- Newsletter endpoint (Buttondown) a Ko-fi username
- Reálná doména + absolutní OG meta tagy v `index.html`, zapnout Plausible analytics

### Backlog (později)
- Vyřešit nekonzistenci dvou handoff dokumentů (root `HANDOFF.md` vs starší `handoff/`)
- Pozn.: audio skladby budou ze Suno CDN → offline nepojedou, dokud je nepřidáme do cache
- Záměrně neuděláno (vyžaduje reálné audio): crossfade, pre-cache další skladby, přepínač kvality, smart-skip

## 🐛 Známé bugy
- *(Žádný aktuálně známý.)*
- ~~Offline appka nenaběhla (React/Babel z CDN se necachovaly)~~ → **vyřešeno 14. 06. 2026** vendorováním knihoven + fontů
- ~~3 překlepy v `data.js`~~ → opraveno 14. 06. 2026

## 🏗️ Klíčová rozhodnutí
*(Aby ses k tomu zase zbytečně nevracel.)*
- **Knihovny i fonty hostované lokálně (ne CDN):** kvůli skutečnému offline běhu. React/ReactDOM/Babel v `vendor/`, fonty v `vendor/fonts/` + `vendor/fonts.css`. Vše precachované v `sw.js`.
- **Produkční buildy React/ReactDOM** (`*.production.min.js`) — menší a rychlejší než dev verze; API stejné.
- **PNG ikony místo SVG** — iOS spolehlivě nepodporuje SVG pro ikonu na ploše. Full-bleed design slouží zároveň jako maskable (Android) i apple-touch-icon (iOS).
- **Bez build stepu:** JSX se transpiluje Babelem v prohlížeči. Nutný http server (`file://` nefunguje).
- **Komunikace mezi soubory přes `window` globály:** každý `<script type="text/babel">` má vlastní scope → `Object.assign(window, {...})`. **Pořadí načítání skriptů v `index.html` se nesmí měnit.**
- **Web předpokládá nasazení v kořeni domény** — `sw.js` i manifest používají absolutní cesty (`/...`). Při nasazení do podsložky by se cesty musely upravit.
- **Po změně cachovaného souboru bumpni `VERSION` v `sw.js`** (teď `jw-v15`).
- **Nepoužívat `scrollIntoView`** — místo toho `window.scrollTo({...})` (konvence projektu).
- **`handoff/` je starší 4souborová záloha**, ne aktuální verze. Aktuální web je v rootu.

## 📁 Stav souborů
- `index.html` – HTML shell, CSS tokeny, pořadí načítání skriptů, mesh pozadí
- `data.js` – veškerý obsah (appky, alba, skladby, texty, konfig klíče)
- `app.jsx` – root App, stav jazyk/mode, hash routing, klávesové zkratky
- `shared.jsx` – motivy, hooky, ikony, base komponenty, generátory artworku
- `nav-hero.jsx` · `apps-music.jsx` · `player-contact.jsx` · `player-expand.jsx` · `search.jsx` · `queue.jsx` · `extras.jsx` – sekce/komponenty
- `tweaks-panel.jsx` – sdílený panel nastavení
- `vendor/` – **lokální React/ReactDOM/Babel + fonty** (offline) · `vendor/fonts.css`
- `icons/` – **PNG ikony** 180/192/512
- `sw.js` – service worker (`jw-v15`) · `manifest.webmanifest` – PWA manifest
- `case-studies/` – 3 case studies + sdílené styly
- `embed.html` · `feed.xml` · `og-image.svg` · `404.html` · `sitemap.xml` · `robots.txt`
- `HANDOFF.md` – detailní technický handoff
