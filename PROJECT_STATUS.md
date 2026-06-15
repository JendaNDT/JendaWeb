# JendaWeb – Project Status
*Naposled aktualizováno: 15. 06. 2026*

## 🎯 Co to je
Osobní portfolio web „Jenda — vibe-coder & AI hudebník". Prezentuje appky + AI hudbu, vč. plnohodnotného hudebního přehrávače.
**Živě: https://jenda-web.vercel.app**
Stack: React 18 + ReactDOM, Babel Standalone (JSX se transpiluje přímo v prohlížeči), čisté CSS + inline styly. **Žádný build, žádné npm.** Plně offline-capable (knihovny i fonty hostované lokálně). Instalovatelná PWA, dvojjazyčné CZ/EN, dark/light + 3 barevné motivy.

## ⏭️ Příští krok
**Nasadit fázi 3** — kód hotový a otestovaný lokálně, čeká na dostání do GitHubu (`JendaNDT/JendaWeb`) → Vercel pak nasadí sám. ⚠️ Tahle pracovní kopie má v gitu jen 1 commit a **žádný remote** (větev `master`) + leží v ní i necommitnuté úpravy z 14. 6. → nasazení projít s Jendou (token / jeho workflow), nepushovat naslepo.
Potom **fáze 4** (admin přihlášení přes Supabase Auth, vypnout veřejnou registraci) a **fáze 5** (formuláře + upload mp3/obrázků).
**Backend (fáze 1–2) i čtení na webu (fáze 3) hotové** — detaily v **`SUPABASE_BACKEND.md`**, celý plán v `UPLOAD_INTERFACE_PLAN.md`.

## ✅ Hotovo
- **Nasazeno živě na Vercel** (`jenda-web.vercel.app`) přes GitHub auto-deploy — push do `main` = automatický deploy
- **Offline soběstačnost:** React/ReactDOM/Babel + fonty Syne/DM Sans hostované lokálně (`vendor/`), service worker precachuje celý boot (`jw-v29`). Web nepotřebuje žádné CDN.
- **PNG ikony pro iOS** (`icons/` 180/192/512, „J" v Syne, full-bleed = maskable i apple-touch)
- **Hudební přehrávač s plnou výbavou:** mini, fullscreen expand (E), fronta (Q), vizualizér (V), audio analyzér (D), A/B loop, rychlost, shuffle, repeat
- **Cmd+K vyhledávání** + bohaté klávesové zkratky (`?`)
- **Obsah:** 20 aplikací, 5 alb / 15 skladeb (3 mají texty), 3 case studies
- **Procedurální artwork**, dvojjazyčnost CZ/EN, motivy ember/velvet/desert + dark/light/auto
- **PWA infrastruktura:** SW, manifest, sitemap, robots.txt, RSS, 404, embed přehrávač
- **Extra sekce:** newsletter, build log, srovnání aplikací, kontaktní formulář, Ko-fi
- **Drobné opravy (14. 06. 2026):** 3 překlepy v CZ textech, gramatika „5 alb", odstraněn brandový vodoznak „J" z levého dolního rohu
- **Vyladěné pozadí (14. 06. 2026):** mesh přes celou stránku (průhledné sekce), warm-balanced barvy (méně tyrkysové), konstantní opacity (v čase nesvětlá), noise dither proti bandingu, hero bez švu
- **Supabase backend — fáze 1–2 (15. 06. 2026):** projekt `jendaweb` (ref `semdgbaearwhkhulkyts`), tabulky albums/apps/tracks/socials/site_config/site_strings + RLS (veřejné čtení, zápis jen přihlášený), storage buckety `audio`+`images`, naplněno obsahem z `data.js` (20 aplikací, 5 alb, 15 skladeb vč. 3 textů, 5 sítí, 9 konfig klíčů). Detaily v `SUPABASE_BACKEND.md`.
- **Web čte ze Supabase — fáze 3 (15. 06. 2026, lokálně hotovo + otestováno, čeká na nasazení):** nová vrstva `supabase-data.js` stáhne obsah z DB přes REST a přepíše `window.*` globály (cache-first přes localStorage + revalidace, offline/chyba → fallback na `data.js`). Komponenty beze změny. SW bumpnut na `jw-v30`. Ověřeno: anon RLS čtení, mapování DB→tvar webu (unit test), transpilace všech JSX. Pozn.: obsah v DB se teď rovná placeholderu, takže web vypadá identicky — jde o plumbing pro pozdější admin.

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
- **Backend: Supabase projekt `jendaweb`** (ref `semdgbaearwhkhulkyts`, eu-central-1, free). Frontend používá publishable/anon klíč (veřejný, OK v gitu), zápis chrání RLS + přihlášení; `service_role` nikdy do frontendu. Vše v `SUPABASE_BACKEND.md`.
- **Free tarif = max 2 aktivní Supabase projekty.** Kvůli založení `jendaweb` **pauznut `humanfit`** (15. 06. 2026, ref `dzqgrtlorckvhfwxtxbd`) — data zůstávají, obnova přes `restore_project`. Pozor: pauzou jde `humanfit` backend offline.
- **RLS warning (6× „always true"):** zápis povolen všem `authenticated`. Pro single-admin CMS záměr; ve fázi 4 **vypnout veřejnou registraci** v Supabase Auth (ať jediný účet je Jendův), případně zúžit na admin `uid`.
- **Fáze 3 čtení: prostý `fetch` na Supabase REST, ne supabase-js.** Web jen čte → není důvod vendorovat velkou knihovnu do offline shellu. `supabase-data.js` běží jako plain `<script>` hned po `data.js`: synchronně přepíše globály z localStorage cache (rychlé vykreslení), pak asynchronně stáhne z REST, uloží cache a **při změně** přerenderuje (bump `key` na `<App>` přes událost `jw-data-updated` v `Root` wrapperu). Offline/chyba → tiše zůstane cache nebo `data.js`. supabase-js si necháme až na admin auth (fáze 4). Mapování snake_case→camelCase je v `supabase-data.js`.
- **Mesh pozadí — jemné „pruhy" jsou Machovy pruhy / věc displeje, ne dat.** Ověřeno měřením (gradient ~18 úrovní jasu na 1434 px; po roztažení kontrastu jsou pixely hladké + ditherované, žádné tvrdé schody). Šum (`.mesh-noise`) to neopraví, protože v datech není co opravit. Po dohodě s Jendou **ponecháno beze změny** (14. 06. 2026) — nevracet se k tomu.
- **Mesh orby NESMÍ animovat `opacity` (jen `transform`).** Když orby pulzují krytím + velkým `scale`, čtyři různě rychlé orby (72/94/116/84 s) se časem sejdou ve fázi → pozadí v čase „světlá" a vymývá barvy. Originál v `handoff/` to dělal správně: konstantní opacity, jen jemný drift (`float1/2`, scale ≤1.12). Opraveno 14. 06. 2026 (jw-v23) — opacity konstantní, scale ≤1.06.
- **Pozadí přes celou stránku:** všechny sekce mají `background:transparent`, takže fixní mesh prosvítá nepřetržitě. Hero nemá lokální orby (odebrány) — sdílí globální mesh, takže není šev na hranici hero/obsah.
- **Odebrán „Ambient wash" (app.jsx):** pozadí se už nebarví podle hraného alba (overlay s `mix-blend-mode: screen`). Tohle byl hlavní zdroj dřívějšího „moc tyrkysové" + „vyblité" — hrálo album Northern Lights (teal+modré), které stránku barvilo a zesvětlovalo. Pozadí je teď konzistentní bez ohledu na přehrávač (jw-v29, 14. 06. 2026).
- **OLED základ:** `--bg` = čistá černá `#000000`; orby + teplá záře jsou barevné akcenty proti ní.
- **Knihovny i fonty lokálně (ne CDN):** kvůli skutečnému offline běhu. Vše v `vendor/`, precache v `sw.js`.
- **Produkční buildy React/ReactDOM** — menší a rychlejší; API stejné.
- **PNG ikony místo SVG** — iOS spolehlivě nepodporuje SVG ikonu na ploše. Full-bleed = maskable i apple-touch.
- **Bez build stepu:** JSX transpiluje Babel v prohlížeči. Nutný http server / hosting (`file://` nefunguje).
- **Komunikace mezi soubory přes `window` globály** — pořadí skriptů v `index.html` se nesmí měnit.
- **Web předpokládá nasazení v kořeni domény** — `sw.js`/manifest mají absolutní cesty (`/...`).
- **Po změně cachovaného souboru bumpni `VERSION` v `sw.js`** (teď `jw-v29`).
- **Nepoužívat `scrollIntoView`** — místo toho `window.scrollTo({...})`.
- **`handoff/` je starší 4souborová záloha**, ne aktuální verze.

## 📁 Stav souborů
- `index.html` – HTML shell, CSS tokeny, pořadí skriptů, mesh pozadí
- `data.js` – veškerý obsah (appky, alba, skladby, texty, konfig) — teď slouží jako offline/fallback seed
- `supabase-data.js` – fáze 3: stáhne obsah ze Supabase → přepíše `window.*` globály + localStorage cache
- `app.jsx` – root App, stav jazyk/mode, hash routing, zkratky
- `shared.jsx` – motivy, hooky, ikony, base komponenty, artwork
- `nav-hero.jsx` · `apps-music.jsx` · `player-contact.jsx` · `player-expand.jsx` · `search.jsx` · `queue.jsx` · `extras.jsx` – sekce/komponenty
- `tweaks-panel.jsx` – panel nastavení
- `vendor/` – lokální React/ReactDOM/Babel + fonty (offline) · `vendor/fonts.css`
- `icons/` – PNG ikony 180/192/512
- `sw.js` – service worker (`jw-v29`) · `manifest.webmanifest`
- `case-studies/` – 3 case studies + styly
- `embed.html` · `feed.xml` · `og-image.svg` · `404.html` · `sitemap.xml` · `robots.txt`
- `HANDOFF.md` – technický handoff
- `SUPABASE_BACKEND.md` – backend (project ref, klíče, schéma, RLS, storage, co dál)
- `UPLOAD_INTERFACE_PLAN.md` – celý plán admin rozhraní (fáze 1–7)
