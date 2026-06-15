# JendaWeb – Project Status
*Naposled aktualizováno: 15. 06. 2026*

## 🎯 Co to je
Osobní portfolio web „Jenda — vibe-coder & AI hudebník". Prezentuje appky + AI hudbu, vč. plnohodnotného hudebního přehrávače.
**Živě: https://jenda-web.vercel.app**
Stack: React 18 + ReactDOM, Babel Standalone (JSX se transpiluje přímo v prohlížeči), čisté CSS + inline styly. **Žádný build, žádné npm.** Plně offline-capable (knihovny i fonty hostované lokálně). Instalovatelná PWA, dvojjazyčné CZ/EN, dark/light + 3 barevné motivy. Celostránkové **audio-reaktivní + paralaxní** částicové pozadí. Obsah spravuje **Supabase CMS** přes přihlášený `/admin`.

## ⏭️ Příští krok
**Celá administrace je hotová a živá — teď ji naplnit reálným obsahem.** Přihlas se na `/admin` a postupně doplň: reálná **mp3** ke skladbám (klidně hromadně přes „⇪ Hromadně mp3"), **obálky alb** + **ikony aplikací**, **reálné odkazy** aplikací a sociálních sítí (admin je hlídá štítkem „chybí odkaz"), případně hlavní texty webu. Vodítko je v záložce **Přehled** → sekce „k dokončení".

**Budoucí vylepšení (nepovinné):** vlastní doména (máš otevřený Subreg) + absolutní OG meta tagy; mazání starých souborů ze Storage při přepsání; oranžové barvy v grafu návštěvnosti (přes vlastní tmavé karty místo GoatCounter embedu).
**Bezpečnost:** zrušit/rotovat použitý GitHub token; admin heslo si změnit přímo v adminu („Změnit heslo"). Složka `Token/` je v `.gitignore`.

**Vše hotové a NASAZENÉ** — backend (1–2), web čte z DB (3), `/admin` login (4), správa obsahu (5), plnohodnotný CMS, dashboard Přehled, návštěvnost (GoatCounter). Detaily níž a v `SUPABASE_BACKEND.md`.

## ✅ Hotovo
- **Vizuál — jemná hloubková paralaxa (15. 06. 2026, NASAZENO, commit `b695be8`, SW `jw-v38`):** každá částice má `depth` (daleko↔blízko); při scrollu se posouvá podle hloubky (bližší výrazně víc — ~3,7× než vzdálené), bližší jsou i o něco větší a jasnější → decentní 3D dojem přes celou stránku. `scrollY` se čte přímo ve vykreslovací smyčce (žádný scroll listener = nic navíc na výkon), posun je zabalený do výšky okna (pole zůstává plné). Respektuje `prefers-reduced-motion`. Ověřeno Node testem (různé hloubky = různý posun, vše v mezích) + nasazení.
- **Vizuál — zklidnění reaktivity (15. 06. 2026, NASAZENO, commit `29e5403`, SW `jw-v37`):** při hudbě se pozadí „třáslo" moc rychle (rychlé výšky/hi-haty). Zklidněno: výšky jdou přes **dolnopropust** (`env.treble`, plynulé), **doznívání jasu** zpomaleno (0.86→0.92), nárazové **zrychlení** uhlazeno (surge 0.86→0.90) a menší koeficienty rychlosti/třpytu. Bass „nádech", záblesk na beat, prstence i pulzování velikosti podle spektra **zůstaly** → pořád viditelně reaktivní, jen ne roztřesené. Ověřeno Node testem (vyhlazený signál kolísá ~0.065 místo 0.80; velikost dál pulzuje ~3× a plynule doznívá) + potvrzeno nasazení.
- **Vizuál přes celou stránku + menší tečky (15. 06. 2026, NASAZENO, commit `ca3fec1`, SW `jw-v36`):** reaktivní „souhvězdí" se přejmenovalo na `BackgroundFX` a je teď **fixní vrstva přes celý web** (z-index −1, nad `mesh-bg`, pod obsahem — vykreslené jednou v kořeni `App`), takže prosvítá za všemi sekcemi, ne jen v hero. **Tečky jsou nepatrně drobnější**, hustota se řídí plochou okna a spoje jsou jemnější (kvůli vyšší hustotě). Ověřeno živě (částice za sekcí Hudba uprostřed stránky, za obsahem, čitelnost nerušená, bez chyb v konzoli).
- **Hero vizuál — silnější audio-reaktivita (15. 06. 2026, NASAZENO, commit `f49f76c`, SW `jw-v35`):** pozadí teď reaguje na hudbu výrazně líp — **detekce beatu** z basů (na náraz problikne jas, „nadechne" se celé souhvězdí a vyšle rozbíhavý prstenec), **částice navázané na konkrétní frekvence** (pole viditelně „tančí" napříč spektrem) a **úderný náběh / pomalé doznívání** (envelope). Ověřeno deterministicky v Node: poloměr částice silent→loud ≈ 4×, jas ≈ 5× (pak doznívá), beat vystřelí přesně na nárazy (4/4 kopáky). Pozn.: animace běží jen když je hero na obrazovce a karta aktivní (na pozadí se pauzuje kvůli baterii — proto „živý" test reaktivity nelze přes background-kartu změřit, proto Node).
- **Reálné počty přehrání + audio-reaktivní hero (15. 06. 2026, NASAZENO, commit `4188e89`, SW `jw-v34`):** (1) **Počty přehrání** napojené na Supabase — sloupec `tracks.plays` + RPC `increment_play` (security definer, grant `anon`); web zvýší počítadlo při spuštění skladby (jednou na skladbu za návštěvu, optimisticky hned + zápis do DB). Sekce **„Nejvíce poslouchané"** a štítek **„▶ N×"** u skladby teď ukazují reálná globální čísla; admin **Přehled** má kartu **„přehrání celkem"** (+ nejhranější). (2) **Audio-reaktivní hero vizuál** — generativní „souhvězdí" částic na `<canvas>` za nadpisem; když hraje hudba, reaguje na ni přes sdílený analyser přehrávače (`window.__jwAnalyser` — basy nafouknou/rozzáří částice, výšky přidají rychlost a propojení), v klidu samo jemně pluje. Respektuje `prefers-reduced-motion`, pauzuje mimo obrazovku i na skryté kartě, ladí barvy dle motivu webu. Ověřeno živě přes Claude-in-Chrome (klik na přehrát → `plays` v DB +1, testovací hodnota vrácena na 0, žádné chyby v konzoli).
- **Nasazeno živě na Vercel** (`jenda-web.vercel.app`) přes GitHub auto-deploy — push do `main` = automatický deploy
- **Offline soběstačnost:** React/ReactDOM/Babel + fonty Syne/DM Sans hostované lokálně (`vendor/`), service worker precachuje celý boot (aktuálně `jw-v38`). Web nepotřebuje žádné CDN.
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
- **Admin: záložka Přehled / statistiky (15. 06. 2026):** dashboard z dat — počet skladeb (s/bez audia), celková délka hudby, alba, skladby s textem, aplikace (PWA/Android), sítě, **využité úložiště** (SQL funkce `public.storage_usage()` security definer, ukazatel z ~1 GB free), sekce „k dokončení" s prokliky na záložky. Výchozí záložka. Ověřeno živě.
- **Návštěvnost / analytika (15. 06. 2026):** vyřešena přes **GoatCounter** (zdarma, soukromí-friendly, bez cookies) — site code `jendaweb`. Měřicí skript na webu i case-study stránkách (SW `jw-v33`), v adminu záložka **Návštěvnost** s embedem živého dashboardu (sladěný do tmava přes GoatCounter Theme=Dark; `?hideui=1` se NEpoužívá, protože stripoval pozadí → bílý pruh) + odkaz na plný dashboard. Jenda v GoatCounteru povolil public dashboard + přidal doménu do „embed". Ověřeno živě (zaznamenalo první návštěvu). Pozn.: Vercel občas nenasadí commit (webhook proklouzne) — kontrolovat přes Vercel MCP a kopnout prázdným commitem.
- **Admin = plnohodnotný CMS (15. 06. 2026):** editor **hlavních textů webu** (hero podtitul/popis, tlačítka, sekce, kontakt, newsletter, srovnání, Ko-fi, patička — CZ/EN, ukládá se jako override nad defaulty z `data.js`), editor **Deníku buildu**, editor **Srovnání aplikací** (3 appky + hodnoty), **obálky alb** (upload obrázku, jinak gradient). Web: `supabase-data.js` merguje `config.strings` do `window.STRINGS`, `CASE_STUDIES` staví z `apps.case_study_url` (sjednoceno s adminem — pole v adminu se teď fakt projeví), mapuje `albums.cover_url`; `apps-music.jsx` vykreslí obálku alba. DB: `albums.cover_url` + `site_config.strings`. SW `jw-v32`. Ověřeno živě (web i admin). Záměrně mimo admin: drobné UI popisky (tlačítka „Přehrát"…) a celé case-study HTML stránky.
- **Admin vychytávky v2 (15. 06. 2026):** hromadné nahrání mp3 (drop víc souborů → skladby z názvů + auto-upload do vybraného alba, průběh X/Y), štítek + filtr „chybí odkaz" u aplikací i sítí (placeholder `#`), počty na záložkách (Skladby 15…) + vyhledávací pole v každé záložce, záloha obsahu jedním klikem (JSON export). Ověřeno živě v prohlížeči.
- **Admin UX vylepšení (15. 06. 2026):** přehrání mp3 u skladeb (jeden přehrávač naráz) + auto-vyplnění délky z metadat souboru, štítek „bez audia" + filtr „jen bez audia", **drag-reorder** karet (ukládá `sort` do DB → web řadí dle sort.asc), náhled ikony v aplikacích, odkaz ↗ na živý web (`#track=`/`#album=`/link). Layout adminu na 2 sloupce, název se zkracuje. Ověřeno živě přes Claude-in-Chrome. Mobilní fallback pořadí = pole „Pořadí" ve formuláři.
- **Admin správa obsahu — fáze 5 (15. 06. 2026):** `admin.jsx` rozšířen na plný CRUD (skladby / alba / aplikace / sociální sítě / konfig) přes Supabase REST s admin JWT, **nahrávání mp3** (bucket `audio`) a **ikon** (bucket `images`) do Storage s progress barem, **změna hesla** (GoTrue). Auto-refresh tokenu. Ověřeno: transpilace + serverový RLS test zápisu pod admin JWT (insert/update/delete prošly). SW `jw-v31`, admin online-only. Záměrně zatím bez editoru build-logu/comparison.
- **Admin přihlášení — fáze 4 (15. 06. 2026, NASAZENO + login ověřen, commit `adffca2`):** `admin.html` + `admin.jsx` — login přes Supabase Auth (plain-fetch GoTrue), session v localStorage, dashboard placeholder. `/admin` přes `vercel.json` rewrite. Admin účet `mcnegr@gmail.com` (uid `5a7c34fb-…`). RLS zápis **zamčen na admin uid** → 6 „always true" warningů pryč. Pozn.: SQL-vytvořený auth user měl token sloupce NULL → GoTrue login 500 „Database error querying schema"; opraveno přepsáním na `''`.
- **Web čte ze Supabase — fáze 3 (15. 06. 2026, NASAZENO, commit `e8306ee`):** nová vrstva `supabase-data.js` stáhne obsah z DB přes REST a přepíše `window.*` globály (cache-first přes localStorage + revalidace, offline/chyba → fallback na `data.js`). Komponenty beze změny. SW bumpnut na `jw-v30`. Ověřeno: anon RLS čtení, mapování DB→tvar webu (unit test), transpilace všech JSX. Pozn.: obsah v DB se teď rovná placeholderu, takže web vypadá identicky — jde o plumbing pro pozdější admin.

## 🔄 Rozjeté (nedodělané)
- **Reálný obsah** – web je živý, ale data jsou zatím placeholder (viz Příští krok + TODO)

## 📝 TODO
### MVP (nutné pro plné spuštění)
- Audio URL skladeb (`audioUrl` / `downloadUrl` v `TRACKS_DATA`) — ze Suno
- Reálné odkazy aplikací (`link:'#'` v `APPS_DATA`)
- Reálné odkazy sociálních sítí (`url:'#'` v `SOCIALS`)
- Reálný e-mail (teď `jenda@example.com`) + kontaktní endpoint (Formspree)
- Newsletter endpoint (Buttondown) a Ko-fi username
- Vlastní doména + absolutní OG meta tagy (návštěvnost už řeší GoatCounter — hotovo)

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
- **Admin auth (fáze 4): plain fetch na GoTrue + RLS zamčená na uid.** Login přes `POST /auth/v1/token?grant_type=password` (anon key), session v localStorage — konzistentní s fází 3, žádná knihovna. Admin user vytvořen SQL insertem do `auth.users` + `auth.identities` (mountovaná složka neumí git zápis, ale DB ano). Zápis do obsahových tabulek omezen na konkrétní admin `uid` (`auth.uid() = '5a7c34fb-…'`) místo „kdokoliv authenticated" → bezpečnější + čistý advisor. Heslo dočasné (ke změně).
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
- **Po změně cachovaného souboru bumpni `VERSION` v `sw.js`** (teď `jw-v38`).
- **Nepoužívat `scrollIntoView`** — místo toho `window.scrollTo({...})`.
- **`handoff/` je starší 4souborová záloha**, ne aktuální verze.

## 📁 Stav souborů
- `index.html` – HTML shell, CSS tokeny, pořadí skriptů, mesh pozadí
- `data.js` – veškerý obsah (appky, alba, skladby, texty, konfig) — teď slouží jako offline/fallback seed
- `supabase-data.js` – fáze 3: stáhne obsah ze Supabase → přepíše `window.*` globály + localStorage cache
- `admin.html` · `admin.jsx` – admin: přihlášení + CRUD obsahu + upload mp3/obrázků (fáze 4–5)
- `vercel.json` – rewrite `/admin` → `/admin.html`
- `app.jsx` – root App, stav jazyk/mode, hash routing, zkratky
- `shared.jsx` – motivy, hooky, ikony, base komponenty, artwork
- `nav-hero.jsx` · `apps-music.jsx` · `player-contact.jsx` · `player-expand.jsx` · `search.jsx` · `queue.jsx` · `extras.jsx` – sekce/komponenty
- `nav-hero.jsx` → `BackgroundFX` – celostránkové částicové pozadí (canvas, fixní, z-index −1, nad mesh, pod obsahem): audio-reaktivní (sdílený `window.__jwAnalyser`) + hloubková paralaxa; vykreslené jednou v kořeni `App`
- `tweaks-panel.jsx` – panel nastavení
- `vendor/` – lokální React/ReactDOM/Babel + fonty (offline) · `vendor/fonts.css`
- `icons/` – PNG ikony 180/192/512
- `sw.js` – service worker (`jw-v38`) · `manifest.webmanifest`
- `case-studies/` – 3 case studies + styly
- `embed.html` · `feed.xml` · `og-image.svg` · `404.html` · `sitemap.xml` · `robots.txt`
- `HANDOFF.md` – technický handoff
- `SUPABASE_BACKEND.md` – backend (project ref, klíče, schéma, RLS, storage, co dál)
- `UPLOAD_INTERFACE_PLAN.md` – celý plán admin rozhraní (fáze 1–7)
