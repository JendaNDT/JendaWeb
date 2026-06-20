# JendaWeb — Handoff Document

Personal portfolio site for "Jenda — Vibe Coder & AI Music". A React SPA built with inline Babel + JSX, **no build step**. Installable, **fully offline-capable** PWA, bilingual (CZ / EN), dark/light mode with accent themes.

Content is now managed through a **Supabase-backed CMS** (login-protected `/admin`): the site reads apps/albums/tracks/socials/texts from the database with an offline localStorage cache (`data.js` is the fallback seed). A full-page **audio-reactive + parallax** particle background (`BackgroundFX`) runs behind all content, and the full-screen player has its own audio-reactive geometric visualization (`GeoViz`). Backend specifics live in **`SUPABASE_BACKEND.md`**; current state + decisions in **`PROJECT_STATUS.md`**.

- **Live:** https://jenda.cool (primary custom domain; `jenda-web.vercel.app` 307-redirects to it) · **Admin:** https://jenda.cool/admin
- **Repo:** https://github.com/JendaNDT/JendaWeb — push to `main` → Vercel auto-deploys.
- **Backend:** Supabase project `jendaweb` (ref `semdgbaearwhkhulkyts`, eu-central-1, free). Frontend uses the public anon/publishable key; writes are protected by RLS (locked to the admin uid). See `SUPABASE_BACKEND.md`.

## Recent updates (20 Jun 2026)

- **Hidden admin entry + back-to-site link (`jw-v82`, `admin.jsx?v=20`, commit `d2547ba`):** The public site opens `/admin` via **5 quick clicks/taps on the "jenda.cool" logo** in the nav (within 1.2 s) → redirects to `/admin.html` (`onLogoTap` in `nav-hero.jsx`; works on mobile + desktop, undiscoverable by accident, and the admin is login-protected anyway). Reverse direction: the admin header gained an **"↗ Web"** link and the login screen a subtle **"↗ Zpět na web"** (`admin.jsx`). This is convenience, **not security** — hiding the entry gates nothing; the Supabase Auth login does. `combined.jsx` rebuilt, SW bumped `jw-v81 → jw-v82` (in `sw.js` + `index.html`). Verified via Babel transpile of `combined.jsx` + `admin.jsx`.
- **Admin double file-dialog fix (`admin.jsx?v=19`, commit `e5198d0`):** In `/admin`, clicking a `FileDrop` upload area (app installer, icon, track audio/cover, album cover) opened the OS file picker **twice**. Root cause: `FileDrop` renders inside a `Field`, whose wrapper element is a `<label class="fld">`, and the hidden `<input type=file>` is that label's first labelable descendant (`label.control === input`) — so a real click fires the input **natively via label activation** *and* the div's `onClick` also calls `inp.current.click()` = two dialogs. Fix: `onClick={(e)=>{ e.preventDefault(); if(inp.current) inp.current.click(); }}` on both `.drop` handlers (`FileDrop` + `BulkUpload`); `preventDefault` cancels the label's native activation, leaving the single explicit open. Verified live via Claude-in-Chrome (pre-fix = 2 input click-events on a trusted click; post-fix = `defaultPrevented` + exactly 1). An earlier `stopPropagation` attempt (`v=18`, `211e58d`) targeted a non-existent click-bubbling cause and did not help. Admin is online-only → no SW bump.
- **Large App Hosting via Git/Vercel:** Enabled hosting for large native Android applications (like Vandrák, 51 MB) that exceed the Supabase free tier file size limit (50 MB).
  - Saved the APK file directly to the project at `/binaries/vandrak.apk` and copied the icon to `/icons/vandrak.png`.
  - Added the app to the Supabase database using relative links (`/binaries/vandrak.apk` and `/icons/vandrak.png`), enabling users to download directly from the `jenda.cool` domain.
  - Added the new app entries to the offline fallback seed in `data.js`.
- **Hardened large-file upload in `/admin` (`admin.jsx`):** The >30 MB upload path (chunked 20 MB via the GitHub Contents API, reassembled client-side in `apps-music.jsx`) was reworked for reliability — exponential-backoff retry on GitHub rate-limits (403/429), 5xx and network errors (honoring `Retry-After`/`X-RateLimit-Reset`); cleanup of already-committed `.partN` chunks when an upload fails (no orphan files left in the repo); a truthful success flow that reports "deploying…" then "live" only once the file is actually downloadable (waits for Vercel); and one-time GitHub-token validation with a **Připojit GitHub / GitHub ✓** control in the admin header (no more repeated prompts). Admin is online-only (not in the SW), so this shipped **without an SW bump**, via a single Contents-API commit (`b6fce46`). Ruled out (measured): pure-browser GitHub **Releases** upload is impossible (`uploads.github.com` sends no CORS headers); Supabase Free is hard-capped at 50 MB/file. A Supabase Edge Function proxy could do Releases if ever wanted.
- **Code review (5 parallel agents) + fixes, batches A/B/C** — full findings in `REVIZE_KODU_2026-06-20.md` (in outputs), summary in `PROJECT_STATUS.md`. Verdict: healthy — `combined.jsx` byte-identical to source, data contract clean, no secret keys in the repo.
  - **Batch A (SEO):** `robots.txt` repointed `jenda.dev`→`jenda.cool`; `sitemap.xml` expanded from 3 to **all 20 case studies** (+ `lastmod`); social card converted **SVG→PNG** (`og-image.png`, 1200×630, rendered from the brand Syne/DM Sans fonts), `og:image`/`twitter:image` repointed to it.
  - **Batch B (robustness):** `AudioPlayer` now closes its `AudioContext` on unmount (was leaking on desktop after ~6 open/close cycles, killing the visualizer); the `q` (queue) shortcut stale-closure fixed (`app.jsx` effect deps); `embed.html` escapes track/album titles (was raw `innerHTML`) + sanitizes gradient colors; **security headers** added in `vercel.json` (`X-Content-Type-Options: nosniff`, `Referrer-Policy` globally; **`X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` for `/admin`** — anti-clickjacking; `embed.html` stays framable); the app download button guards against double-click (in-flight lock + "Stahuji…") and single-file download uses `target=_blank`.
  - **Batch C (a11y / SEO / leaks):** all 20 case studies got `rel=canonical` + OG/Twitter tags; the unfinished giscus placeholder was removed from the 3 that had it; `index.html` got `rel=canonical`; `feed.xml` trimmed of empty albums; `aria-label` added to like/share buttons; `useCountUp` now cancels its `requestAnimationFrame`; the `Nav` scroll handler is rAF-throttled; admin screenshot object-URL revoke fixed (was revoking on every change).
  - **Deliberately deferred** (risk / needs Jenda's input): seek-slider keyboard, light/dark persistence + anti-flash via the tweak system, full modal focus-trap, JSON-LD `sameAs` (needs his profile URLs), analytics choice (GoatCounter vs Vercel), dropping the unused `site_strings` table, splash screens in the SW precache.
- **SW is now `jw-v81`.** Matches SW version in `index.html`. (This session's chain: `jw-v79` = admin-only upload hardening (no bump needed, admin is online-only) → `jw-v80` = batch B → `jw-v81` = batch C.)

## Recent updates (19 Jun 2026)

- **Anonymous Likes/Voting System:** Integrated heart buttons for both apps and music tracks, with like counts stored in the database.
  - **Supabase Backend:** Created new integer columns `likes` for `apps` and `tracks` tables, and safe PL/pgSQL RPC functions `toggle_track_like` and `toggle_app_like` to handle atomic increments/decrements.
  - **Storage & Double-Voting Protection:** Client-side states are tracked via `localStorage` arrays (`jw_liked_tracks` and `jw_liked_apps`) to prevent double-voting from the same browser.
  - **Interactive Hearts:** Hearts added in the main track listings (`TrackRow`), `AppDetailModal`, mini player (`AudioPlayer`), and full-screen visualizer (`ExpandMode`), with active states and counts synced in real-time across the app using custom events (`jw-track-like-toggled`).
  - **CMS Dashboard Stats:** Overview tab in `/admin` displays total track likes, top-liked track, total app likes, and top-liked app. Track and App lists now display like counts inside their description rows (e.g. `· ❤️ 12`).
- **Deník Buildu Stats Correction:** Corrected `appsCount` calculation inside `StatsSection` (in `extras.jsx`) to filter out apps without active runnable links (`x.link && x.link !== '#'` instead of total database count). This fixes the incorrect listing of 21 apps running when most are static concepts or case studies.
- **SW is now `jw-v77`.** Matches SW version in `index.html`.

## Recent updates (16 Jun 2026)

- **Full-screen player visualization (`GeoViz`):** New canvas component in `player-expand.jsx`, behind the expanded "now playing" content — a morphing geometric figure of dots + links (4 layers, ~3–6-fold symmetry) in theme colors (`--a1/--a2`), centered on the cover (`#jw-expand-cover`) and filling the screen. **Desktop:** reacts to the real spectrum via the shared `window.__jwAnalyser` (bass bloom, treble speeds rotation, beat → flash + ring, per-node frequency bin). **Mobile (no FFT, direct `<audio>`):** smooth time-driven motion (lives but doesn't read real frequencies, by design — see jw-v39). Respects `prefers-reduced-motion`, pauses on hidden tab. Always-on ambient layer, separate from the small `V` waveform. Shipped `jw-v61`.
- **JSX cache-staleness fix (`combined.jsx?v=<VERSION>`):** The localStorage compiled-JSX cache could get stamped with the new version while the fetched `combined.jsx` was still the stale one (served cache-first by the old SW mid-update) → the site ran old code under the new version tag (symptom: a correct deploy "looked unchanged"). Fix: `index.html` now fetches `combined.jsx?v=<VERSION>` (version in the URL) and the SW precaches that same versioned URL, so a stale cache can't serve old content for a new version. **`VERSION` must now match in BOTH `sw.js` and `index.html`.** Quick unstick for a stuck client: clear `jw_jsx_*` in localStorage + reload. Shipped `jw-v62`.
- **Console Warning Cleanup:** Added missing `autoComplete` attributes (name, email) and `id` and `name` attributes for form controls, search fields, and range sliders across all components (`extras.jsx`, `player-contact.jsx`, `player-expand.jsx`, `search.jsx`, `apps-music.jsx`).
- **Preload Optimization:** Removed preloads for `babel.min.js` and `combined.jsx` in `index.html` to prevent redundant 3+ MB downloads on repeat visits (which use compiled cache).
- **Absolute Social Cards:** Set `og:image` and `twitter:image` tags to absolute URL paths (`https://jenda-web.vercel.app/og-image.svg`) and added `og:url` for correct preview rendering on social platforms.
- **Lighthouse Performance Score (100/100):** Postponed layout-thrashing DOM operations (`ResizeObserver` and `offsetTop` checks) in `nav-hero.jsx` by 150-250ms after mounting, and inlined font definitions in `index.html` to eliminate the last render-blocking stylesheet.
- **In-Browser JSX Compilation Cache:** Consolidated all 10 JSX scripts into `combined.jsx` (compiled via `python3 build_jsx.py`) and implemented a caching loader in `index.html` that saves compiled scripts to `localStorage` under the Service Worker version tag (`jw-v60`). Bypasses Babel compilation entirely on repeat visits.
- **Mobile Play Button Centered:** Adjusted button layouts in the audio player to position the Play button perfectly centered on mobile viewports.
- **Touch-Friendly Seek Bar:** Migrated the player seek bar controls to Pointer Events (`setPointerCapture` and `touch-action: none`) for smooth touch dragging/scrubbing on mobile devices.
- **SW is now `jw-v62`.** Full chronological detail lives in `PROJECT_STATUS.md`.

## Recent updates (15 Jun 2026, evening)

- **Music is the primary section now.** Page + nav order is Music → Apps. The hero's main CTA "Poslechnout hudbu" (primary button) starts playback of the first track that has audio and smooth-scrolls to `#music`; the scroll cue also points to `#music`. Hero headline/identity unchanged.
- **Mobile background playback.** On mobile (iOS/Android) the player plays the raw `<audio>` element directly and does **not** route through Web Audio — `setupAudioContext()` early-returns when `isMobile`. iOS suspends `AudioContext` on screen lock, which would stop audio; bypassing it keeps music playing with the screen off. Desktop still gets the real FFT visualizer; mobile falls back to `seededBars` + idle `BackgroundFX`.
- **Media Session** (lock-screen controls): metadata + artwork (album cover), `playbackState`, `setPositionState` (scrubber), and play/pause/prev/next/seek handlers — see the `mediaSession` effect in `player-contact.jsx`.
- **Contact → Formspree.** `site_config.contact_endpoint` is set (`/f/xjgdllrd`); the form POSTs JSON and emails Jenda (verified end-to-end). Direct-email link is hidden unless a real `contact_email` is configured.
- **Background tuned for OLED.** Pure-black base; cold orbs dimmed then brought back slightly, plus `.mesh-orb` now has `saturate(1.25)`; warm accent leads. Final orb opacities: teal `0.07`, indigo `0.105`, amber `0.17`, purple `0.11`; noise `0.04`.
- **Other UX:** hero counters animate reliably (`useCountUp` starts when in viewport, threshold `0.15`), gentle `jwFade` on content (re)render, hero subtitle reworded music-first (`data.js`), floating "?" shortcut hint (desktop, hidden ≤768px).
- **Security:** public sign-ups disabled in Supabase Auth; admin password changed; GitHub token kept (local only, gitignored — see `PROJECT_STATUS.md` decisions).
- **Czech fonts (latin-ext):** Syne and DM Sans were self-hosted as the **latin subset only**, which lacks the Czech glyphs `č ď ě ň ř š ť ů ž` → they fell back to a system font (mismatched in big headings). Added the **latin-ext** subset of the *same* fonts (`@fontsource`, woff2+woff) with `unicode-range`; the latin files are unchanged, latin-ext only draws the accented glyphs. See `vendor/fonts.css`; added to the SW precache.
- Contact heading renamed "Pojďme si říct" → **"Napiš mi"** (informal "ty" to match the subtitle; EN "Write to me"), in `data.js`.
- SW is now `jw-v47`. Full chronological detail lives in `PROJECT_STATUS.md`.

## Tech stack

- **React 18 + ReactDOM** — vendored locally in `vendor/` (production UMD builds), **not from CDN**.
- **@babel/standalone** — vendored locally (`vendor/babel.min.js`); transpiles JSX in the browser, no bundler.
- **Fonts (Syne, DM Sans)** — self-hosted in `vendor/fonts/` + `vendor/fonts.css` (no Google Fonts), **latin + latin-ext** subsets (latin-ext covers Czech `č ď ě ň ř š ť ů ž`; per-glyph via `unicode-range`).
- Plain CSS in `<style>` block + inline-style JSX.
- Service Worker for offline PWA cache (precaches the whole boot).
- No npm, no build, no node_modules. Must be served over **http(s)** (or localhost) — `file://` won't run the SW.

### Offline-capable (important)
Everything needed to boot — React, ReactDOM, Babel, fonts — is **local, same-origin, and precached** by `sw.js`. There are **no external CDN dependencies**, so the installed PWA works offline. (Earlier these came from unpkg/Google CDN, which broke offline boot; fixed by vendoring on 14 Jun 2026.)

## Hosting & deploy

- **GitHub:** `JendaNDT/JendaWeb`, branch `main`.
- **Vercel:** connected to the repo. **Push to `main` auto-deploys.** Framework preset "Other" (pure static, no build).
- The site assumes deployment at the **domain root** — `sw.js` and the manifest use absolute paths (`/...`). A subpath deploy would need path tweaks.
- After changing any cached asset, **bump `VERSION` in both `sw.js` and `index.html`** (currently `jw-v82`) so clients pick up new content. (`index.html` loads `combined.jsx?v=<VERSION>`, so the two must stay in sync.)
- `/admin` is routed via `vercel.json` (rewrite `/admin` → `/admin.html`) and served **online-only** (SW bypasses cache for it) with `Cache-Control: no-store` headers so it's never stale.
- **Pushing from the sandbox:** the mounted working copy's `.git` can't take git writes (lock files). **Fast path (used since 20 Jun 2026):** push directly via the GitHub REST API with the `ghp_` PAT in `Token/Token .rtf` — a single text file via the Contents API (`GET …/contents/<path>?ref=main` for its `sha` → `PUT` with base64 `content` + `sha`), or **many files in one commit** via the Git Data API (create blobs for binaries → `POST /git/trees` with `base_tree` → `POST /git/commits` → `PATCH /git/refs/heads/main`). No clone needed. (Older path: fresh `git clone` in `/tmp`, copy files, commit, `git push https://<token>@github.com/...`.) Token is gitignored, never committed. Always verify the deploy landed (Vercel occasionally misses the webhook; the PNG/asset URL can briefly 404 from CDN negative-cache — re-request with a cache-bust) and that no caches serve stale files.

## File map

```
.
├── index.html              # HTML shell, CSS tokens, script load order, mesh background + noise, GoatCounter
├── data.js                 # Content seed (apps, albums, tracks, socials, strings, stats, config) — OFFLINE FALLBACK
├── supabase-data.js        # Plain JS: fetches content from Supabase REST → overrides window.* globals + localStorage cache
├── admin.html · admin.jsx  # /admin: login (Supabase Auth) + full CRUD + mp3/image upload + dashboard + analytics
├── vercel.json             # Rewrite /admin → /admin.html; no-store for admin/sw; nosniff+Referrer-Policy global; X-Frame-Options DENY + CSP frame-ancestors for /admin
├── app.jsx                 # Root App, lang/mode state, hash routing, keyboard shortcuts, <BackgroundFX/>
├── shared.jsx              # Themes, hooks (useInView, useCountUp), icons, base components, art generators
├── nav-hero.jsx            # Nav + Hero + BackgroundFX (full-page audio-reactive + parallax particle canvas)
├── apps-music.jsx          # AppCard, AppsSection, AlbumCard, TrackRow (▶ play counts), MusicSection
├── player-contact.jsx      # AudioPlayer (mini, exposes window.__jwAnalyser + increments plays), Shortcuts, Contact, Footer
├── player-expand.jsx       # ExpandMode full-screen player + AnalyzerOverlay + GeoViz (geometric audio-reactive viz)
├── search.jsx              # Cmd+K SearchOverlay
├── queue.jsx               # QueueDrawer (Q)
├── extras.jsx              # Newsletter, Stats, Comparison, MostPlayed (global plays), DonationButton
├── tweaks-panel.jsx        # Reusable Tweaks panel scaffold
├── vendor/                 # LOCAL deps (offline)
│   ├── react.production.min.js
│   ├── react-dom.production.min.js
│   ├── babel.min.js
│   ├── fonts.css           # @font-face for self-hosted fonts
│   └── fonts/              # Syne + DM Sans (woff2/woff, latin + latin-ext subset)
├── icons/                  # PNG app icons 180/192/512 (iOS apple-touch + maskable)
├── sw.js                   # Service worker (jw-v82; precache shell + latin-ext fonts, network-first HTML, /admin online-only)
├── manifest.webmanifest    # PWA manifest (icons point to icons/*.png)
├── og-image.png            # 1200×630 social card (PNG — what og:image/twitter:image point to); og-image.svg kept as source
├── robots.txt · sitemap.xml · feed.xml · 404.html · embed.html
├── PROJECT_STATUS.md       # Living project status (vibecoding tracker) — READ FIRST
├── HANDOFF.md              # This file
├── SUPABASE_BACKEND.md     # Backend: project ref, keys, schema, RLS, storage, RPC functions
├── UPLOAD_INTERFACE_PLAN.md# Original admin/Supabase spec (now implemented)
├── case-studies/           # 20 case studies (.html) + shared style.css; each has rel=canonical + OG/Twitter + GoatCounter
├── Token/                  # GitHub token drop (gitignored — never committed)
└── handoff/                # ⚠️ Frozen backup of the OLD 4-file version — NOT current, do not use
```

## Architecture — IMPORTANT

Because each `<script type="text/babel">` gets its own scope when transpiled by in-browser Babel, **inter-file communication uses `window` globals**. At the end of each `.jsx` file:
```js
Object.assign(window, { ComponentA, ComponentB, helperFn, ... });
```
In other files those identifiers resolve via the global scope.

### Compilation & Script Load Order (since `jw-v59`)

To optimize mobile performance (bypassing the heavy 3.1 MB Babel Standalone compiler on repeat visits), all 10 JSX components are merged into a single file: `combined.jsx`.

- **To compile changes:** Whenever you modify any `.jsx` file, run the helper script:
  ```bash
  python3 build_jsx.py
  ```
  This combines the component files into `combined.jsx` in the correct execution order.

- **Script Loading in `index.html`:**
  React, React-DOM, `data.js` and `supabase-data.js` are loaded in `<head>` using the `defer` attribute.
  At the end of `<body>`, a custom caching loader runs inside a `DOMContentLoaded` event listener:
  1. It checks if `localStorage` contains compiled scripts for the current version tag (`jw-v82`; `VERSION` is defined in **both** `sw.js` and `index.html` and the two must match).
  2. **Cache Hit:** Executes the compiled JS directly from `localStorage`, cutting Babel compile time to 0 ms.
  3. **Cache Miss / Version Mismatch:** Clears old cache keys, dynamically appends `<script src="vendor/babel.min.js">`, fetches **`combined.jsx?v=<VERSION>`** (version in the URL so a stale SW cache can't serve old content for a new version), transpiles it in-browser, saves the compiled output to `localStorage`, and executes it.

**Component order in `build_jsx.py`:**
1. `tweaks-panel.jsx`
2. `shared.jsx`
3. `nav-hero.jsx`
4. `apps-music.jsx`
5. `player-contact.jsx`
6. `player-expand.jsx`
7. `queue.jsx`
8. `extras.jsx`
9. `search.jsx`
10. `app.jsx` (Renders React DOM)

### React hooks aliased per file
To avoid Babel scope collisions each file destructures with unique names: `const { useState: __useS_app, ... } = React;`. Follow the same pattern (`__useS_xxx`) in any new file.

## State persistence (localStorage)

| Key                | What                                    |
|--------------------|-----------------------------------------|
| `jw_lang`          | 'cs' or 'en'                            |
| `jw_mode`          | 'auto' \| 'light' \| 'dark'             |
| `jw_player_state`  | { trackId, position } — restore on load |
| `jw_player_volume` | float 0..1                              |
| `jw_speed`         | playback speed (0.75, 1, 1.25, 1.5, 2)  |
| `jw_shuffle`       | '1' or '0'                              |
| `jw_repeat`        | 'off' \| 'all' \| 'one'                 |
| `jw_viz`           | 'bars' \| 'radial' \| 'mirror'          |
| `jw_plays`         | { trackId: count } — per-browser stats (global counts now live in `tracks.plays`) |
| `jw_content_v1`    | cached Supabase content (set by `supabase-data.js`) |
| `jw_admin_session` | admin auth session (only on `/admin`)   |
| `jw_liked_tracks`  | array of liked track IDs                |
| `jw_liked_apps`    | array of liked app IDs                  |

## URL hash routing

- `#track=N` — loads track ID N (paused)
- `#album=ID` — loads first track of album, sets playlist to album tracks
- `#track=N&t=84` — also seeks to 84 seconds (share-with-timestamp)
- `#apps` / `#music` / `#contact` — scroll to section

## Keyboard shortcuts (global)

`Cmd/Ctrl+K` search · `?` shortcuts · `Space` play/pause · `← / →` prev/next · `Shift+← / →` seek 5s · `M` mute · `E` expand · `Q` queue · `V` visualizer · `D` analyzer · `A`/`B`/`Z` loop start/end/clear · `L` language · `Esc` close overlay.

## Content & configurable values

**Primary content now lives in Supabase and is edited via `/admin`** (no code edits needed): tracks (incl. mp3 upload), albums (+ covers), apps (+ icons), socials, main site texts (CZ/EN), build log, comparison, and config keys (contact email/endpoint, newsletter, Ko-fi, giscus, public stats). `supabase-data.js` maps the DB onto the same `window.*` globals the components already use, so components didn't change. `data.js` remains the **offline fallback seed** (and documents the shape). The table below is what still needs real values — set them in `/admin` (or `data.js` for the fallback):

| Constant | What to set it to |
|----------|-------------------|
| `window.TRACKS_DATA` | Real mp3 URLs (upload in `/admin` → Supabase Storage). **First track is live (CelticSing); add the rest.** Tracks without audio are skipped by the hero CTA (it plays the first track that has `audioUrl`) |
| `window.APPS_DATA` | Replace placeholder `link:'#'` with real app URLs |
| `window.SOCIALS` | Replace `url:'#'` with real social profiles |
| `window.CONTACT_ENDPOINT` | ✅ Set to Formspree (`/f/xjgdllrd`) in `site_config` — form POSTs JSON and emails Jenda (verified). Falls back to `mailto:` only if unset |
| `window.CONTACT_EMAIL` | Still placeholder (`jenda@example.com`) → the direct-email link under the form is **hidden** unless a real email is set (form-only by design) |
| `window.NEWSLETTER_ENDPOINT` | Buttondown embed URL; degrades to a "thanks" message if null |
| `window.KOFI_USERNAME` | Ko-fi username — activates donation button |
| `window.GISCUS_CONFIG` | `{ repo, repoId, category, categoryId }` from giscus.app |
| `window.CASE_STUDIES` | Map of `appId -> case study URL` (3 entries) |
| `window.PUBLIC_STATS` / `window.BUILD_LOG` | Replace placeholder numbers/entries |

Analytics are already wired — **GoatCounter** (`data-goatcounter` script in `index.html` + the case-study pages), shown in the admin **Návštěvnost** tab. (This replaced the earlier Plausible plan.) **Note:** MEMORY mentions Vercel Web Analytics was enabled on the dashboard but its script is **not** on the site — pick one (GoatCounter vs Vercel) if you want Vercel's numbers to register. OG/canonical are done: `og:image`/`twitter:image` → `https://jenda.cool/og-image.png`, `rel=canonical` on the home page and all 20 case studies.
In **`sw.js`** (and matching **`index.html`**): bump `VERSION` on any cached-asset change.
The giscus comments block was an unfinished placeholder and has been **removed** from the case studies — re-add + configure (`data-repo`, ids from giscus.app) only if you actually want comments.

## Theming

- **Themes** (accents): `ember` (default), `velvet`, `desert` — `THEMES` in `shared.jsx`.
- **Mode**: `auto` / `light` / `dark`. CSS tokens in `index.html` `:root` and `html[data-mode="light"]`.
- **(Removed)** The page no longer tints to the playing album's colors. The old per-album "ambient wash" overlay (`app.jsx`, `mix-blend-mode: screen`) was deleted — it lightened + tinted the page while music played and fought the dark look. Background is now consistent regardless of the player. `--ambient1`/`--ambient2` are no longer used.

## Background (mesh) — how it works + rules

- **One fixed ambient layer:** `.mesh-bg` (`position:fixed; inset:0; z-index:-1`) holds 4 blurred radial orbs (mesh-1 teal, mesh-2 indigo, mesh-3 amber, mesh-4 purple) + a fine noise overlay `.mesh-noise`.
- **OLED base:** `--bg` is pure black `#000000`; the orbs + warm glow are color accents against it. Keep blacks deep — the noise overlay opacity is kept very low so it doesn't lift the black (matters on OLED). Teal is toned down, amber leads (warm brand).
- **Spans the whole page:** all page sections use `background:transparent`, so the fixed mesh shows continuously top-to-bottom. Don't give a section an opaque background unless you intend to hide the mesh there.
- **RULE — orbs must NOT animate `opacity` (only `transform`).** Animating opacity + big `scale` makes the background progressively brighten / wash out over time (4 orbs with different periods drift into phase). Keep opacity constant on each orb, scale ≤ ~1.06, gentle drift. `prefers-reduced-motion` disables animation.
- **Warm-balanced:** amber (mesh-3) is the larger/central warm orb; teal (mesh-1) is toned down — matches the warm brand and keeps orange present.
- **Noise (`.mesh-noise`)** dithers gradient banding. Note: faint "stripes" some displays show on huge soft gradients are **Mach bands / display-side**, not in the pixel data — noise can't fully remove them, don't chase it.
- The hero has **no local orbs** (removed) and no separate noise — it shares the global mesh, so there's no seam at the hero boundary.
- **Particle layer above the mesh:** `BackgroundFX` (in `nav-hero.jsx`, rendered once at the App root) is a `position:fixed; inset:0; z-index:-1; pointer-events:none` `<canvas>` drawing an orange particle "constellation" **above** `.mesh-bg` (it comes later in the DOM, inside `#root`) and **below** content (sections are transparent). It's **audio-reactive** (reads the player's shared `window.__jwAnalyser`: beat detection → flash + bass "bloom" + expanding rings, plus per-frequency size/brightness pulse) and has a **depth parallax** on scroll (each particle has a `depth`; nearer ones shift more and are a bit bigger/brighter). It reads `scrollY` inside its rAF loop (no scroll listener), re-samples theme colors, pauses when the tab is hidden, and respects `prefers-reduced-motion` (single static frame). Tuning lives at the top of its draw loop — particle size, density (`(W*H)/16000`), brightness decay (0.92), treble low-pass (`env.treble … *0.15`), beat threshold, and parallax strength (`pf = 0.02 + depth*0.10`). NOTE: scroll-/audio-linked motion only runs when the tab is the visible foreground tab (rAF pauses otherwise), so verify this logic with a Node check of the math, not a background browser tab.

## Notable features (so you don't reinvent them)

- **Procedural artwork** — `trackArt(seed, album)` / `albumArt(album)` in `shared.jsx` (deterministic SVG data URIs).
- **Floating-label form fields** — `.field` CSS class, `placeholder=" "` trick.
- **Animated number counters** — `useCountUp(target)` hook, intersection-triggered.
- **A/B loop** — A/B/Z keys, markers in ExpandMode bars-mode waveform.
- **Audio analyzer overlay** — D key, real-time peakHz / rms / range from AnalyserNode.
- **Visualizer modes** — V cycles bars / radial / mirror.
- **Play counts (global)** — each time a track starts, the player calls the Supabase `increment_play(track_id)` RPC (once per track per visit) which bumps `tracks.plays`. Shown as "▶ N×" on tracks, in the **Most Played** section, and "přehrání celkem" in admin Přehled. The old per-browser `localStorage.jw_plays` still updates but the site reads the global DB value (`window.TRACKS_DATA[].plays`).
- **Most Played section** — reads global `tracks.plays` (via `window.TRACKS_DATA`), hidden if all zero.
- **Hidden admin entry** — clicking the nav "jenda.cool" logo **5× within 1.2 s** navigates to `/admin` (`onLogoTap` in `nav-hero.jsx`); the admin header has a **"↗ Web"** link and the login screen a **"↗ Zpět na web"** link back. Obscurity only — the real gate is the Supabase Auth login.
- **Audio-reactive + parallax background** — `BackgroundFX`, see the Background section above.
- **Full-screen player visualization** — `GeoViz` (`player-expand.jsx`): morphing geometric dots+links behind the expanded player, centered on the cover, filling the screen. Desktop reacts to the real spectrum (`window.__jwAnalyser`); mobile is time-driven (no FFT). Always-on ambient layer, distinct from the `V` waveform modes. Like `BackgroundFX`, its rAF pauses in a hidden tab — verify the math via a Node check, not a background browser tab.

## Things deliberately not done

- **Crossfade** — needs a dual-audio engine; skipped (complexity + no real audio to test).
- **Pre-cache next track** — meaningless until `audioUrl` is real.
- **Quality switcher** — Suno doesn't expose multiple bitrate URLs publicly.
- **Smart skip ML signal** — needs real listening data first.

## Recommended next steps for a fresh agent

1. Read **`PROJECT_STATUS.md`** first — current state, next step, known decisions.
2. Open the live site, hit `?` and `Cmd+K` to see the feature surface.
3. Read `shared.jsx` (shared helpers), then `app.jsx` (root + state), then the section you need.
4. New component: define in a `.jsx`, alias React hooks (`__useS_xxx`), `Object.assign(window, {...})` at the end, add a `<script type="text/babel">` to `index.html` in the right load order.
5. **Bump `VERSION` in both `sw.js` and `index.html`** after any cached-asset change (they must match; `index.html` fetches `combined.jsx?v=<VERSION>`).
6. Avoid `scrollIntoView` (project convention) — use `window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80 })`.
7. **Deploy = `git push` to `main`** (Vercel auto-deploys). No manual build.
8. `handoff/` is a frozen old-version backup — ignore it for current work.

> **Done (was "next phase"):** the content **upload interface** (login-protected `/admin`) backed by **Supabase** (database + auth + file storage) is **built and live** — music, apps, images and texts are managed via forms with file upload instead of editing `data.js`. Original spec: **`UPLOAD_INTERFACE_PLAN.md`**; backend details: **`SUPABASE_BACKEND.md`**; current state: **`PROJECT_STATUS.md`**.

— Maintained for the Cowork + GitHub/Vercel workflow. Last updated 20 Jun 2026 (SW `jw-v82`; admin `admin.jsx?v=20`).
