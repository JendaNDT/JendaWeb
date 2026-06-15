# Implementační plán — Nahrávací rozhraní (Admin) pro JendaWeb

*Vytvořeno 14. 06. 2026. Tohle je kompletní spec pro samostatné vlákno, kde se to bude stavět. Čte to jak Jenda (přehled + co udělat on), tak AI (technické detaily).*

> ✅ **STAV: HOTOVO a NASAZENO (15. 06. 2026).** Všech 7 fází je implementováno a živé na https://jenda-web.vercel.app + `/admin`. Tento dokument je **původní plán (historie)**; aktuální technické detaily jsou v **`SUPABASE_BACKEND.md`**, stav projektu v **`PROJECT_STATUS.md`**.
>
> **Hlavní odchylka od plánu:** web ani admin **nepoužívají `supabase-js`** — místo něj prostý `fetch` na Supabase REST / GoTrue / Storage (web jen čte přes `supabase-data.js`, admin píše s admin JWT), aby se do offline shellu nevendorovala velká knihovna. RLS zápis je navíc **zamčen na konkrétní admin `uid`** (ne „kdokoliv authenticated"). **Nad rámec plánu** přibylo: dashboard „Přehled" (+ SQL funkce `storage_usage`), návštěvnost přes **GoatCounter**, **počty přehrání** (`tracks.plays` + RPC `increment_play`), editor hlavních textů/build-logu/srovnání, obálky alb, a celostránkové **audio-reaktivní + paralaxní** pozadí.

---

## 1) Cíl

Jenda (netechnický, jediný správce) chce **přidávat a upravovat obsah webu přes přihlášené rozhraní s nahráváním souborů** — místo editace `data.js` a pushování na GitHub.

**Zadání (potvrzeno 14. 06. 2026):**
- **Hudba:** nahrávat **audio soubory (mp3)** — web je hostuje.
- **Obrázky:** nahrávat **vlastní obrázky** (ikony aplikací, obálky).
- **Spravovat:** skladby, alba, aplikace, texty a odkazy webu.
- Pokud možno **zdarma**; je v pořádku přidat backend.
- Veřejný web zůstává na GitHub → Vercel; **obsah se přesune do databáze**. Offline se zmírní cachováním posledního obsahu.

---

## 2) Zvolená architektura

**Supabase** jako backend (vše v jednom, free tarif):
- **Postgres databáze** — veškerý obsah (místo `data.js`).
- **Auth** — přihlášení správce (jen Jenda).
- **Storage** — úložiště na mp3 a obrázky.

**Tři části:**
1. **Veřejný web** (stávající React/Babel statický web) — při načtení **stáhne obsah ze Supabase**, uloží do cache (offline), vykreslí stávajícími komponentami.
2. **Admin** na `/admin` (nový `admin.html` + `admin.jsx`) — přihlášení + formuláře + nahrávání souborů.
3. **Supabase** — databáze + auth + storage.

**Proč Supabase a ne git-based CMS:** Jenda chce nahrávat **soubory** (mp3, obrázky) a mít **přihlášení** — to git-based editor (např. Decap) neřeší dobře (soubory v gitu jsou špatně, auth na Vercelu je krkolomné). Supabase dá úložiště, auth i DB najednou a jde nastavit přes připojený Supabase konektor (MCP).

**Bez vlastního serveru:** supabase-js klient zvládne auth + DB + storage přímo z prohlížeče (bezpečně přes RLS). Nepotřebujeme serverless funkce.

---

## 3) Datový model (tabulky v Supabase)

Zrcadlí strukturu `data.js`:

- **albums** — `id` (text PK, slug, např. `sahara`), `title`, `genre`, `year` (int), `g1`, `g2` (hex barvy), `cs`, `en` (popisy), `sort` (int), `created_at`
- **tracks** — `id` (bigint PK), `title`, `album_id` (FK → albums.id), `duration` (text), `audio_url` (text), `download_url` (text), `lyrics_cs` (text), `lyrics_en` (text), `sort`, `created_at`
- **apps** — `id` (bigint PK), `name`, `platform` (`'PWA'` | `'Android'`), `color` (hex), `cs`, `en`, `link`, `icon_url` (text), `case_study_url` (text), `sort`, `created_at`
- **socials** — `id` (text PK, např. `github`), `label`, `url`, `sort`
- **site_config** — `key` (text PK), `value` (jsonb) — pro `CONTACT_EMAIL`, endpointy, `KOFI_USERNAME`, `PUBLIC_STATS`, `BUILD_LOG` apod.
- **site_strings** — `key` (text PK), `cs`, `en` — editovatelné UI texty (volitelně; jinak nechat napevno v `data.js`)

**Storage buckety:**
- `audio` (veřejné čtení) — mp3/wav. Cesta např. `tracks/{trackId}.mp3`
- `images` (veřejné čtení) — ikony, obálky. Cesta např. `apps/{appId}.png`, `covers/{trackId}.jpg`

---

## 4) Zabezpečení (Auth + RLS)

- **Auth:** Supabase email + heslo. Vytvořit **jednoho** admin uživatele (Jendův e-mail). Vypnout veřejnou registraci.
- **RLS (Row Level Security) na tabulkách:**
  - `SELECT` (čtení): povoleno všem (anon) → veřejný web čte.
  - `INSERT/UPDATE/DELETE`: jen přihlášený (`auth.role() = 'authenticated'`) — případně omezit na konkrétní user id.
- **Storage policies:** veřejné čtení; zápis jen přihlášený.
- **Klíče:** ve frontendu (web i admin) se používá **anon public key** (read přes RLS; write jen po přihlášení). **`service_role` klíč NIKDY do frontendu.**

---

## 5) Změny na veřejném webu

- Přidat **supabase-js** (vendorovat do `vendor/` kvůli offline konzistenci).
- Při načtení: stáhnout `albums`, `tracks`, `apps`, `socials`, `site_config` (+ strings) → naplnit stejné `window.*` globály, které appka už používá (`APPS_DATA`, `ALBUMS`, `TRACKS_DATA`, `SOCIALS`, `STRINGS`, konfig). **Komponenty se nemusí přepisovat** — jen zdroj dat.
- **Cache (stale-while-revalidate):** uložit stažený obsah do `localStorage`; při startu vykreslit z cache hned, pak obnovit ze sítě. Offline → běží z cache.
- **Audio:** `audio_url` ukazuje na veřejnou URL ze Supabase Storage; přehrávač hraje odtud. Volitelně SW-cachovat audio při přehrání.
- `data.js` během přechodu nechat jako fallback/seed; po cutoveru retirovat.

---

## 6) Admin rozhraní (`/admin`)

- Nový `admin.html` (vlastní shell, načte supabase-js + `admin.jsx`). **Přihlašovací obrazovka** (e-mail + heslo) → po přihlášení dashboard.
- **Záložky:** Skladby · Alba · Aplikace · Texty & odkazy.
- Každá záložka: seznam položek + „Přidat" + úprava/smazání. Formuláře:
  - **Skladby:** název, album (výběr), délka, **nahrání mp3** (drag-drop, progress), volitelně obálka, text cs/en. Při uložení: nahrát soubor do Storage → URL → zapsat řádek.
  - **Alba:** název, žánr, rok, barvy gradientu (color picker g1/g2), cs/en.
  - **Aplikace:** název, platforma, barva, cs/en, odkaz, **nahrání ikony**, odkaz na case study.
  - **Texty & odkazy:** sociální sítě, kontaktní e-mail, endpointy, statistiky, build log.
- **UX pro netechnika:** české popisky, drag-drop s progress barem, potvrzení mazání, success hlášky, náhled kde to jde, mobilní použitelnost.
- Postaveno stejným React+Babel inline přístupem (konzistence se zbytkem webu).

---

## 7) Migrace / naplnění daty

- Naplnit Supabase stávajícím obsahem z `data.js` (apps, albums, tracks placeholdery, socials, config) jednorázovými SQL inserty.
- Audio je zatím `null` → Jenda nahraje reálné mp3 přes admin.

---

## 8) Fáze implementace (pořadí pro nové vlákno)

1. **Supabase setup** — založit projekt, tabulky + RLS, storage buckety + policies, admin uživatel. (Supabase MCP: `create_project`, `apply_migration` / `execute_sql`, `get_project_url`, `get_publishable_keys`.) Poznamenat project URL + anon key.
2. **Seed obsahu** — vložit stávající `data.js` obsah do tabulek.
3. **Čtení na webu** — přidat supabase-js, stáhnout + naplnit `window.*` globály + cache; ověřit, že živý web vykresluje ze Supabase (data.js zatím jako fallback).
4. **Admin auth + shell** — `/admin` přihlášení přes Supabase Auth.
5. **Admin CRUD + nahrávání** — formuláře pro skladby/alba/aplikace/texty se Storage uploadem.
6. **Doladění a testy** — validace, chybové stavy, offline chování, bezpečnostní review (RLS, žádný service key ve frontendu), mobil.
7. **Cutover** — Supabase jako jediný zdroj pravdy; `data.js` retirovat (nebo nechat jako záložní seed).

---

## 9) Co bude potřeba od Jendy

- **Supabase účet** (zdarma) — registrace na supabase.com. Autorizovat Supabase konektor / dát přístup, ať můžu založit projekt (nebo ho založím pod připojeným účtem).
- Zvolit **přihlašovací e-mail + heslo** do adminu.
- (Později) mít připravené **mp3 soubory + obrázky** k nahrání.

---

## 10) Náklady / limity (free tarif — OVĚŘIT aktuální!)

> ⚠️ Konkrétní limity a ceny se mění — **při stavbě ověřit na supabase.com/pricing**. Orientačně (k ověření):
- Free tarif: Postgres DB (řádově stovky MB), Storage (řádově ~1 GB), Auth (pro 1 uživatele bohatě), limity přenosu.
- Audio: ~3–8 MB / mp3 → orientačně ~150–300 skladeb do ~1 GB. Při růstu přejít na placený (Pro).

---

## 11) Rizika / co potvrdit

- **Offline:** obsah potřebuje síť; zmírněno cachováním posledního obsahu. Potvrdit, že je to OK (potvrzeno Jendou — ano).
- **supabase-js** přidává závislost + síťová volání; vendorovat kvůli offline shellu.
- **Bezpečnost:** ve frontendu jen anon key (ne service_role) + správné RLS.
- **Storage/přenos** na free tarifu při popularitě audia — sledovat.
- Zachovat funkční **PWA/offline shell** (cachovat obsah).

---

## 12) Reference pro nové vlákno

- **Supabase MCP** je připojené (`create_project`, `execute_sql`, `apply_migration`, `get_project_url`, `get_publishable_keys`, `get_advisors` na bezpečnostní kontrolu, …).
- **`HANDOFF.md`** — aktuální architektura webu (window globály, pořadí skriptů, deploy).
- **`data.js`** — současný tvar obsahu, který se zrcadlí do DB.
- **`PROJECT_STATUS.md`** — stav projektu; „Příští krok" ukazuje sem.

---

### Jak začít v novém vlákně
Otevři nové vlákno, přilož `PROJECT_STATUS.md` (nebo řekni „pokračujeme na JendaWeb — upload rozhraní"). Pak jedeme fázi 1 (Supabase setup). Než cokoliv založím, projdeme spolu, co musíš odkliknout (Supabase účet, přihlašovací údaje).
