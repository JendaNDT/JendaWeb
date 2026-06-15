# Supabase Backend — JendaWeb

*Fáze 1–2 hotové: 15. 06. 2026. Schéma + RLS + storage + seed. (Plán: `UPLOAD_INTERFACE_PLAN.md`.)*

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
| `albums` | `id` text | 5 | id, title, genre, year, g1, g2, tracks, cs, en, sort, created_at |
| `apps` | `id` bigint | 20 | name, platform (`PWA`/`Android`), color, cs, en, link, icon_url, case_study_url, sort |
| `tracks` | `id` bigint | 15 | title, album_id→albums, duration, audio_url, download_url, lyrics_cs, lyrics_en, sort (3 mají texty) |
| `socials` | `id` text | 5 | label, url, sort |
| `site_config` | `key` text | 9 | value jsonb: contact_email, contact_endpoint, newsletter_endpoint, kofi_username, giscus_config, public_stats, build_log, comparison, case_studies |
| `site_strings` | `key` text | 0 | UI texty zatím napevno v `data.js`; tabulka připravená pro fázi 4 |

Identity sekvence `apps`/`tracks` nastaveny za seed (apps→20, tracks→15), nové vkládání nekoliduje.

## Storage buckety
- **`audio`** (veřejné čtení) — mp3/wav, cesta `tracks/{id}.mp3`
- **`images`** (veřejné čtení) — ikony/obálky, `apps/{id}.png`, `covers/{id}.jpg`
- Zápis jen `authenticated`.

## RLS (zabezpečení)
- Každá tabulka: **veřejné čtení** (anon SELECT) · **zápis (ALL) jen `authenticated`**. Anon nemůže zapisovat.
- ⚠️ **Advisor: 6× „RLS Policy Always True" (WARN).** Write policy je `authenticated using(true)`, tj. *jakýkoliv přihlášený* může zapisovat všude. Pro single-admin CMS je to **záměr**. Reálná pojistka pro fázi 4:
  1. **Vypnout veřejnou registraci** (Supabase → Authentication → Providers → Email → zakázat signupy), ať jediný účet je Jendův.
  2. Volitelně zúžit write policy na konkrétní `auth.uid()` admina.

## Co dál

**Fáze 3 — web čte ze Supabase: HOTOVO a NASAZENO (15. 06. 2026, commit `e8306ee`, live na jenda-web.vercel.app).**
- Místo supabase-js použit **prostý `fetch` na REST** (`/rest/v1/<table>?select=*&order=sort.asc`) s anon klíčem — web jen čte, není proč vendorovat knihovnu.
- Nový soubor **`supabase-data.js`** (plain `<script>` hned po `data.js` v `index.html`): synchronně načte localStorage cache → `window.*` globály, pak async stáhne z REST, uloží cache (`jw_content_v1`) a při změně přerenderuje (`Root` wrapper bumpne `key` na `<App>` přes událost `jw-data-updated`).
- Mapování snake_case→tvar webu: `audio_url→audioUrl`, `album_id→album`, `lyrics_cs/en→lyrics{cs,en}`, `site_config` řádky → `window.CONTACT_EMAIL`, `PUBLIC_STATS`, `BUILD_LOG`, `COMPARISON`, `CASE_STUDIES`, … `data.js` zůstává jako offline/fallback seed.
- SW bumpnut na `jw-v30` (+ `/supabase-data.js` do precache).
- Ověřeno: anon RLS čtení, mapování (unit test), transpilace všech JSX.
- **Nasazení: hotovo** (commit `e8306ee` v `JendaNDT/JendaWeb` na `main` → Vercel deploy). Pozn.: mountovaná kopie neumí git zápis (lock soubory) — pushovalo se z čerstvého klonu repa v sandboxu, do něj zkopírovány změněné soubory.

**Fáze 4 — admin auth: POSTAVENO (15. 06. 2026, čeká na deploy `/admin` + test loginu).** `admin.html` + `admin.jsx` — login přes GoTrue (`POST /auth/v1/token?grant_type=password`, anon key, session v localStorage). Admin user `mcnegr@gmail.com` vytvořen (uid `5a7c34fb-4c84-4786-8c2e-7f5efdb0ccf6`, potvrzený). **RLS zápis zúžen na tento uid** (policies `*_admin_write`) → vyřešilo 6 advisor warningů (zbývá jen volitelná „leaked password protection"). Pozn.: veřejný signup už není kritický (zápis je vázán na uid).

**Fáze 5 — admin CRUD + upload: POSTAVENO (15. 06. 2026).** `admin.jsx` plný CRUD přes REST (admin JWT, `Prefer: return=representation`) + Storage upload (mp3→`audio`, ikony→`images`, XHR s progress barem) + změna hesla (`PUT /auth/v1/user`) + auto-refresh tokenu (`grant_type=refresh_token`). Zápis chrání RLS `*_admin_write` (jen admin uid) — ověřeno serverovým RLS testem (insert/update/delete pod admin JWT). Storage cesty: `tracks/{ts}_{name}`, `apps/{ts}_{name}`. Zatím bez editoru build-logu/comparison.
