# Supabase Backend — JendaWeb

*Všech 5 fází hotové a NASAZENÉ (poslední aktualizace 20. 06. 2026, SW `jw-v81`): schéma + RLS + storage + seed + web čte z DB + `/admin` login + plný CRUD/upload. (Revize A/B/C 20. 06. 2026 byla čistě frontend/SEO/bezpečnostní hlavičky — žádná změna DB schématu.) Pozdější přírůstky: `albums.cover_url`, `site_config.strings`, `tracks.plays`, `tracks.likes`, `apps.likes` + RPC `increment_play`, `storage_usage`, `toggle_track_like`, `toggle_app_like`. (Plán: `UPLOAD_INTERFACE_PLAN.md` · stav: `PROJECT_STATUS.md`.)*

## Projekt
- **Název:** jendaweb
- **Ref / Project ID:** `semdgbaearwhkhulkyts`
- **API URL:** `https://semdgbaearwhkhulkyts.supabase.co`
- **Region:** eu-central-1 · **Org:** JendaNDT's Org (`pdwknxyhadusatlsulzt`)
- **Tarif:** Free. ⚠️ Free = max 2 aktivní projekty. Kvůli tomu **pauznut `humanfit`** (15. 06. 2026, ref `dzqgrtlorckvhfwxtxbd`) — data zůstávají, obnova přes `restore_project`.

## Klíče (do frontendu)
- **Publishable key (doporučeno):** `sb_publishable_1ySD8Hf_M7o5Xq3QqfvJLQ_xeVvfvVj`
- **Legacy anon key (JWT):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbWRnYmFlYXJ3aGtodWxreXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUzNzAsImV4cCI6MjA5NzA2MTM3MH0.5X4X-FVXlwukKWOlx3kIqazaBBeJJMCNMiEmdNPM8lk`
- Anon/publishable klíč je **veřejný záměrně** (patří do frontend kódu) — bezpečný i v gitu. Zápis chrání RLS + přihlášení.
- **`service_role` klíč NIKDY do frontendu / do repa.**

## Tabulky (schema `public`)
| Tabulka | Klíč | Řádků | Pozn. |
|---|---|---|---|
| `albums` | `id` text | 5 | id, title, genre, year, g1, g2, tracks, cs, en, **cover_url**, sort, created_at |
| `apps` | `id` bigint | 20 | name, platform (`PWA`/`Android`), color, cs, en, link, icon_url, case_study_url, **likes** (bigint, počet lajků), sort |
| `tracks` | `id` bigint | 15 | title, album_id→albums, duration, audio_url, download_url, lyrics_cs, lyrics_en, **plays** (bigint, počty přehrání), **likes** (bigint, počet lajků), sort (3 mají texty) |
| `socials` | `id` text | 5 | label, url, sort |
| `site_config` | `key` text | 10 | value jsonb: contact_email, contact_endpoint, newsletter_endpoint, kofi_username, giscus_config, public_stats, build_log, comparison, case_studies, **strings** (editovatelné UI texty CZ/EN jako override) |
| `site_strings` | `key` text | 0 | **NEPOUŽÍVÁ se** — editovatelné UI texty se nakonec ukládají do `site_config.strings` (override nad defaulty z `data.js`) |

Identity sekvence `apps`/`tracks` nastaveny za seed (apps→20, tracks→15), nové vkládání nekoliduje.

## Storage buckety
- **`audio`** (veřejné čtení) — mp3/wav. Admin nahrává s cestou `tracks/{timestamp}_{název}` (XHR + progress).
- **`images`** (veřejné čtení) — ikony aplikací + obálky alb, cesta `apps/{timestamp}_{název}`.
- **`binaries`** (veřejné čtení) — instalační soubory aplikací (APK, ZIP atd.) **do 30 MB**. Admin nahrává s cestou `apps/{timestamp}_{název}`. ⚠️ Větší soubory (Free tarif = max 50 MB/soubor) jdou **mimo Supabase** — admin je chunkovaně commitne přes GitHub Contents API do `/binaries/` v repu a web je při stažení slepí (viz „Zpevněné nahrávání velkých APK" v `PROJECT_STATUS.md` / `HANDOFF.md`).
- Zápis jen `authenticated` (přes admin JWT). Pozn.: staré soubory se při přepsání zatím nemažou (viz TODO v `PROJECT_STATUS.md`).

## RLS (zabezpečení)
- Každá tabulka: **veřejné čtení** (anon SELECT) · **zápis (ALL) zamčen na konkrétní admin `uid`** (policies `*_admin_write`, `auth.uid() = '5a7c34fb-…'`). Anon ani jiný přihlášený nezapíše.
- ✅ **Advisor čistý** — dřívějších 6× „RLS Policy Always True" zmizelo zúžením na admin uid (zbývalo `authenticated using(true)`). „Leaked password protection" (HIBP) je u Supabase **jen na Pro tarifu**, takže na Free se nezapíná (kosmetické).
- 🔒 **Veřejná registrace vypnuta** (15. 06. 2026, Authentication → Sign In / Providers → „Allow new users to sign up" OFF) → jediný účet je Jendův. Přihlášení stávajícího účtu tím není dotčeno.
- **Výjimka — anonymní zápis přes RPC:** počítadlo přehrání zvyšuje `security definer` funkce `increment_play` (viz níže), takže anon zápis do `tracks.plays` jde jen přes ni (ne přímým UPDATE).

## Funkce / RPC (Postgres)
- **`public.increment_play(track_id bigint)`** — `security definer`, `set search_path = public`, grant `anon` + `authenticated`. Zvýší `tracks.plays` o 1 pro dané `id`. Web ji volá **anonymně** (`POST /rest/v1/rpc/increment_play`, anon klíč) při spuštění skladby — jednou na skladbu za návštěvu. Bezpečné: jen inkrementuje počítadlo, RLS obchází řízeně přes definer.
- **`public.storage_usage()`** — `security definer`, grant **jen `authenticated`**. Sečte velikost objektů v bucketech (z `storage.objects` pro `audio`, `images` a `binaries`) a vrátí řádky `{bucket, bytes, files}`. Admin „Přehled" z toho ukazuje využité úložiště proti ~1 GB free.
- **`public.toggle_track_like(track_id bigint, is_like boolean)`** — `security definer`, `set search_path = public`, grant `anon` + `authenticated`. Zvýší nebo sníží `tracks.likes` o 1 pro danou skladbu. Volá se anonymně z webu.
- **`public.toggle_app_like(app_id bigint, is_like boolean)`** — `security definer`, `set search_path = public`, grant `anon` + `authenticated`. Zvýší nebo sníží `apps.likes` o 1 pro danou aplikaci. Volá se anonymně z webu.

## Pozdější přírůstky (po fázi 5, vše nasazené 15. 06. 2026)
- **Plný CMS:** `albums.cover_url` (upload obálky) + `site_config.strings` (editovatelné hlavní texty CZ/EN, web je merguje do `window.STRINGS`). `CASE_STUDIES` web staví z `apps.case_study_url`.
- **Dashboard „Přehled":** statistiky obsahu + úložiště přes `storage_usage()`.
- **Počty přehrání:** `tracks.plays` + `increment_play` (viz výše); web ukazuje „Nejvíce poslouchané" a „▶ N×" z reálných dat, admin má kartu „přehrání celkem".
- **Mimo Supabase (web-only, detaily v `PROJECT_STATUS.md`):** návštěvnost přes **GoatCounter** (admin záložka Návštěvnost) a celostránkové **audio-reaktivní + paralaxní** částicové pozadí `BackgroundFX`.

## Aktualizace (15. 06. 2026, večer)
- **Kontaktní formulář → Formspree:** `site_config.contact_endpoint = https://formspree.io/f/xjgdllrd` (dřív `null`). Web POSTuje JSON `{name,email,message}` → zpráva chodí Jendovi (ověřeno reálným testem). `contact_email` zůstává placeholder, takže přímý e-mailový odkaz na webu je skrytý (kontakt jen přes formulář).
- **První reálná mp3 ve Storage:** `tracks` id 16 „CelticSing" má `audio_url` v bucketu `audio` (`audio/mpeg`, podporuje range, CORS OK — ověřeno živě). Ostatní skladby Jenda nahraje postupně přes `/admin`.

## Co dál

**Fáze 3 — web čte ze Supabase: HOTOVO a NASAZENO (15. 06. 2026, commit `e8306ee`, live na jenda-web.vercel.app).**
- Místo supabase-js použit **prostý `fetch` na REST** (`/rest/v1/<table>?select=*&order=sort.asc`) s anon klíčem — web jen čte, není proč vendorovat knihovnu.
- Nový soubor **`supabase-data.js`** (plain `<script>` hned po `data.js` v `index.html`): synchronně načte localStorage cache → `window.*` globály, pak async stáhne z REST, uloží cache (`jw_content_v1`) a při změně přerenderuje (`Root` wrapper bumpne `key` na `<App>` přes událost `jw-data-updated`).
- Mapování snake_case→tvar webu: `audio_url→audioUrl`, `album_id→album`, `lyrics_cs/en→lyrics{cs,en}`, `site_config` řádky → `window.CONTACT_EMAIL`, `PUBLIC_STATS`, `BUILD_LOG`, `COMPARISON`, `CASE_STUDIES`, … `data.js` zůstává jako offline/fallback seed.
- SW bumpnut na `jw-v30` (+ `/supabase-data.js` do precache).
- Ověřeno: anon RLS čtení, mapování (unit test), transpilace všech JSX.
- **Nasazení: hotovo** (commit `e8306ee` v `JendaNDT/JendaWeb` na `main` → Vercel deploy). Pozn.: mountovaná kopie neumí git zápis (lock soubory) — pushovalo se z čerstvého klonu repa v sandboxu, do něj zkopírovány změněné soubory.

**Fáze 4 — admin auth: HOTOVO a NASAZENO (15. 06. 2026, login ověřen).** `admin.html` + `admin.jsx` — login přes GoTrue (`POST /auth/v1/token?grant_type=password`, anon key, session v localStorage). Admin user `mcnegr@gmail.com` vytvořen (uid `5a7c34fb-4c84-4786-8c2e-7f5efdb0ccf6`, potvrzený). **RLS zápis zúžen na tento uid** (policies `*_admin_write`) → vyřešilo 6 advisor warningů. **Heslo Jenda změnil** z dočasného (15. 06. 2026). **Veřejná registrace vypnuta** (viz RLS sekce) → jediný účet je Jendův.

**Fáze 5 — admin CRUD + upload: POSTAVENO (15. 06. 2026).** `admin.jsx` plný CRUD přes REST (admin JWT, `Prefer: return=representation`) + Storage upload (mp3→`audio`, ikony→`images`, XHR s progress barem) + změna hesla (`PUT /auth/v1/user`) + auto-refresh tokenu (`grant_type=refresh_token`). Zápis chrání RLS `*_admin_write` (jen admin uid) — ověřeno serverovým RLS testem (insert/update/delete pod admin JWT). Storage cesty: `tracks/{ts}_{name}`, `apps/{ts}_{name}`. Zatím bez editoru build-logu/comparison.

## Aktualizace (19. 06. 2026)
- **Nahrávání instalačních souborů:** Přidán veřejný (Public) bucket **`binaries`** v Supabase Storage.
- **Pravidla (RLS) pro binaries:** V SQL Editoru nastaveny politiky pro přístup (veřejné čtení pro všechny přes `select`, zápis/úprava/mazání pro roli `authenticated` přes `insert/update/delete`).
- **Nahrávání z adminu:** Úspěšně otestováno nahrávání souborů (APK, ZIP atd.) přímo přes `/admin` do cesty `apps/{timestamp}_{name}` v bucketu `binaries`. URL adresa se ukládá do sloupce `apps.link`.
- **Hlasování (lajkování se srdíčky) pro hudbu a aplikace:**
  - Vytvořeny sloupce `likes` (bigint DEFAULT 0) v tabulkách `tracks` a `apps`.
  - Vytvořeny RPC funkce `toggle_track_like` a `toggle_app_like` pro bezpečné zvyšování/snižování počtu lajků na pozadí, obcházející přímé RLS aktualizace.
