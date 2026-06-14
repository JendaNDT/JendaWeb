# JendaWeb – Project Status
*Naposled aktualizováno: 14. 06. 2026*

## 🎯 Co to je
Osobní portfolio web „Jenda — vibe-coder & AI hudebník". Prezentuje appky + AI hudbu, vč. plnohodnotného hudebního přehrávače.
**Živě: https://jenda-web.vercel.app**
Stack: React 18 + ReactDOM, Babel Standalone (JSX se transpiluje přímo v prohlížeči), čisté CSS + inline styly. **Žádný build, žádné npm.** Plně offline-capable (knihovny i fonty hostované lokálně). Instalovatelná PWA, dvojjazyčné CZ/EN, dark/light + 3 barevné motivy.

## ⏭️ Příští krok
**Doplnit reálná audio URL skladeb ze Suno.**
V `data.js` má všech 15 skladeb `audioUrl: null`, takže přehrávač zatím nehraje. Nahraď `audioUrl` / `downloadUrl` v poli `TRACKS_DATA` (data.js) reálnými odkazy ze Suno.

## ✅ Hotovo
- **Nasazeno živě na Vercel** (`jenda-web.vercel.app`) přes GitHub auto-deploy — push do `main` = automatický deploy
- **Offline soběstačnost:** React/ReactDOM/Babel + fonty Syne/DM Sans hostované lokálně (`vendor/`), service worker precachuje celý boot (`jw-v26`). Web nepotřebuje žádné CDN.
- **PNG ikony pro iOS** (`icons/` 180/192/512, „J" v Syne, full-bleed = maskable i apple-touch)
- **Hudební přehrávač s plnou výbavou:** mini, fullscreen expand (E), fronta (Q), vizualizér (V), audio analyzér (D), A/B loop, rychlost, shuffle, repeat
- **Cmd+K vyhledávání** + bohaté klávesové zkratky (`?`)
- **Obsah:** 20 aplikací, 5 alb / 15 skladeb (3 mají texty), 3 case studies
- **Procedurální artwork**, dvojjazyčnost CZ/EN, motivy ember/velvet/desert + dark/light/auto
- **PWA infrastruktura:** SW, manifest, sitemap, robots.txt, RSS, 404, embed přehrávač
- **Extra sekce:** newsletter, build log, srovnání aplikací, kontaktní formulář, Ko-fi
- **Drobné opravy (14. 06. 2026):** 3 překlepy v CZ textech, gramatika „5 alb", odstraněn brandový vodoznak „J" z levého dolního rohu
- **Vyladěné pozadí (14. 06. 2026):** mesh přes celou stránku (průhledné sekce), warm-balanced barvy (méně tyrkysové), konstantní opacity (v čase nesvětlá), noise dither proti bandingu, hero bez švu

## 🔄 Rozjeté (nedodělané)
- **Reálný obsah** – web je živý, ale data jsou zatím placeholder (viz Příští krok + TODO)

## 📝 TODO
### MVP (nutné pro plné spuštění)
- Audio URL skladeb (`audioUrl` / `downloadUrl` v `TRACKS_DATA`) — ze Suno
- Reálné odkazy aplikací (`link:'#'` v `APPS_DATA`)
- Reálné odkazy sociálních sítí (`url:'#'` v `SOCIALS`)
- Reálný e-mail (teď `jenda@example.com`) + kontaktní endpoint (Formspree)
- Newsletter endpoint (Buttondown) a Ko-fi username
- Vlastní doména + absolutní OG meta tagy, zapnout Plausible analytics

### Backlog (později)
- Rozhodnout o staré záloze `handoff/` (zastaralá 4souborová verze) — nechat / smazat (vše je už na GitHubu s historií)
- Pozn.: audio ze Suno CDN → offline nepojede, dokud ho nepřidáme do cache
- Záměrně neuděláno (vyžaduje reálné audio): crossfade, pre-cache další skladby, přepínač kvality, smart-skip

## 🐛 Známé bugy
- *(Žádný aktuálně známý.)*
- ~~Offline appka nenaběhla (CDN deps)~~ → vyřešeno 14. 06. 2026
- ~~3 překlepy + „5 alba" + brandový vodoznak~~ → opraveno 14. 06. 2026

## 🏗️ Klíčová rozhodnutí
*(Aby ses k tomu zase zbytečně nevracel.)*
- **Hosting: GitHub `JendaNDT/JendaWeb` → Vercel.** Push do `main` se nasadí sám. Push z mé strany potřebuje GitHub token (Jenda dodá při potřebě; neukládá se).
- **Mesh pozadí — jemné „pruhy" jsou Machovy pruhy / věc displeje, ne dat.** Ověřeno měřením (gradient ~18 úrovní jasu na 1434 px; po roztažení kontrastu jsou pixely hladké + ditherované, žádné tvrdé schody). Šum (`.mesh-noise`) to neopraví, protože v datech není co opravit. Po dohodě s Jendou **ponecháno beze změny** (14. 06. 2026) — nevracet se k tomu.
- **Mesh orby NESMÍ animovat `opacity` (jen `transform`).** Když orby pulzují krytím + velkým `scale`, čtyři různě rychlé orby (72/94/116/84 s) se časem sejdou ve fázi → pozadí v čase „světlá" a vymývá barvy. Originál v `handoff/` to dělal správně: konstantní opacity, jen jemný drift (`float1/2`, scale ≤1.12). Opraveno 14. 06. 2026 (jw-v23) — opacity konstantní, scale ≤1.06.
- **Pozadí přes celou stránku:** všechny sekce mají `background:transparent`, takže fixní mesh prosvítá nepřetržitě. Hero nemá lokální orby (odebrány) — sdílí globální mesh, takže není šev na hranici hero/obsah.
- **Knihovny i fonty lokálně (ne CDN):** kvůli skutečnému offline běhu. Vše v `vendor/`, precache v `sw.js`.
- **Produkční buildy React/ReactDOM** — menší a rychlejší; API stejné.
- **PNG ikony místo SVG** — iOS spolehlivě nepodporuje SVG ikonu na ploše. Full-bleed = maskable i apple-touch.
- **Bez build stepu:** JSX transpiluje Babel v prohlížeči. Nutný http server / hosting (`file://` nefunguje).
- **Komunikace mezi soubory přes `window` globály** — pořadí skriptů v `index.html` se nesmí měnit.
- **Web předpokládá nasazení v kořeni domény** — `sw.js`/manifest mají absolutní cesty (`/...`).
- **Po změně cachovaného souboru bumpni `VERSION` v `sw.js`** (teď `jw-v26`).
- **Nepoužívat `scrollIntoView`** — místo toho `window.scrollTo({...})`.
- **`handoff/` je starší 4souborová záloha**, ne aktuální verze.

## 📁 Stav souborů
- `index.html` – HTML shell, CSS tokeny, pořadí skriptů, mesh pozadí
- `data.js` – veškerý obsah (appky, alba, skladby, texty, konfig)
- `app.jsx` – root App, stav jazyk/mode, hash routing, zkratky
- `shared.jsx` – motivy, hooky, ikony, base komponenty, artwork
- `nav-hero.jsx` · `apps-music.jsx` · `player-contact.jsx` · `player-expand.jsx` · `search.jsx` · `queue.jsx` · `extras.jsx` – sekce/komponenty
- `tweaks-panel.jsx` – panel nastavení
- `vendor/` – lokální React/ReactDOM/Babel + fonty (offline) · `vendor/fonts.css`
- `icons/` – PNG ikony 180/192/512
- `sw.js` – service worker (`jw-v26`) · `manifest.webmanifest`
- `case-studies/` – 3 case studies + styly
- `embed.html` · `feed.xml` · `og-image.svg` · `404.html` · `sitemap.xml` · `robots.txt`
- `HANDOFF.md` – technický handoff
