# JendaWeb — Handoff Document

Personal portfolio site for "Jenda — Vibe Coder & AI Music". A React SPA built with inline Babel + JSX, **no build step**. Installable, **fully offline-capable** PWA, bilingual (CZ / EN), dark/light mode with accent themes.

Content is now managed through a **Supabase-backed CMS** (login-protected `/admin`): the site reads apps/albums/tracks/socials/texts from the database with an offline localStorage cache (`data.js` is the fallback seed). A full-page **audio-reactive + parallax** particle background (`BackgroundFX`) runs behind all content. Backend specifics live in **`SUPABASE_BACKEND.md`**; current state + decisions in **`PROJECT_STATUS.md`**.

- **Live:** https://jenda-web.vercel.app · **Admin:** https://jenda-web.vercel.app/admin
- **Repo:** https://github.com/JendaNDT/JendaWeb — push to `main` → Vercel auto-deploys.
- **Backend:** Supabase project `jendaweb` (ref `semdgbaearwhkhulkyts`, eu-central-1, free). Frontend uses the public anon/publishable key; writes are protected by RLS (locked to the admin uid). See `SUPABASE_BACKEND.md`.

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
- After changing any cached asset, **bump `VERSION` in `sw.js`** (currently `jw-v47`) so clients pick up new content.
- `/admin` is routed via `vercel.json` (rewrite `/admin` → `/admin.html`) and served **online-only** (SW bypasses cache for it) with `Cache-Control: no-store` headers so it's never stale.
- **Pushing from the sandbox:** the mounted working copy's `.git` can't take git writes (lock files), so deploys go via a fresh `git clone` in `/tmp`, copy the changed files in, commit, and `git push https://<token>@github.com/JendaNDT/JendaWeb.git HEAD:main`. Token is provided per-session (in `Token/`, gitignored), never stored. Verify the deploy actually landed (Vercel occasionally misses the webhook) and that no caches serve stale files.

## File map

```
.
├── index.html              # HTML shell, CSS tokens, script load order, mesh background + noise, GoatCounter
├── data.js                 # Content seed (apps, albums, tracks, socials, strings, stats, config) — OFFLINE FALLBACK
├── supabase-data.js        # Plain JS: fetches content from Supabase REST → overrides window.* globals + localStorage cache
├── admin.html · admin.jsx  # /admin: login (Supabase Auth) + full CRUD + mp3/image upload + dashboard + analytics
├── vercel.json             # Rewrite /admin → /admin.html + no-store headers for admin/sw
├── app.jsx                 # Root App, lang/mode state, hash routing, keyboard shortcuts, <BackgroundFX/>
├── shared.jsx              # Themes, hooks (useInView, useCountUp), icons, base components, art generators
├── nav-hero.jsx            # Nav + Hero + BackgroundFX (full-page audio-reactive + parallax particle canvas)
├── apps-music.jsx          # AppCard, AppsSection, AlbumCard, TrackRow (▶ play counts), MusicSection
├── player-contact.jsx      # AudioPlayer (mini, exposes window.__jwAnalyser + increments plays), Shortcuts, Contact, Footer
├── player-expand.jsx       # ExpandMode full-screen player + AnalyzerOverlay
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
├── sw.js                   # Service worker (jw-v47; precache shell + latin-ext fonts, network-first HTML, /admin online-only)
├── manifest.webmanifest    # PWA manifest (icons point to icons/*.png)
├── og-image.svg            # 1200×630 social card
├── robots.txt · sitemap.xml · feed.xml · 404.html · embed.html
├── PROJECT_STATUS.md       # Living project status (vibecoding tracker) — READ FIRST
├── HANDOFF.md              # This file
├── SUPABASE_BACKEND.md     # Backend: project ref, keys, schema, RLS, storage, RPC functions
├── UPLOAD_INTERFACE_PLAN.md# Original admin/Supabase spec (now implemented)
├── case-studies/           # meditapp / beatcraft / chordlens + shared style.css (+ GoatCounter)
├── Token/                  # GitHub token drop (gitignored — never committed)
└── handoff/                # ⚠️ Frozen backup of the OLD 4-file version — NOT current, do not use
```

## Architecture — IMPORTANT

Because each `<script type="text/babel">` gets its own scope when transpiled by in-browser Babel, **inter-file communication uses `window` globals**. At the end of each `.jsx` file:
```js
Object.assign(window, { ComponentA, ComponentB, helperFn, ... });
```
In other files those identifiers resolve via the global scope.

### Script load order in `index.html`
```html
<!-- in <head>: local libs, must load before the babel scripts -->
<script src="vendor/react.production.min.js"></script>
<script src="vendor/react-dom.production.min.js"></script>
<script src="vendor/babel.min.js"></script>
<!-- ...at end of <body>: -->
<script type="text/babel" src="tweaks-panel.jsx"></script>
<script src="data.js"></script>                       <!-- plain JS, sets window.APPS_DATA etc. (offline fallback seed) -->
<script src="supabase-data.js"></script>              <!-- plain JS, overrides window.* globals from Supabase + cache -->
<script type="text/babel" src="shared.jsx"></script>
<script type="text/babel" src="nav-hero.jsx"></script>
<script type="text/babel" src="apps-music.jsx"></script>
<script type="text/babel" src="player-contact.jsx"></script>
<script type="text/babel" src="player-expand.jsx"></script>
<script type="text/babel" src="queue.jsx"></script>
<script type="text/babel" src="extras.jsx"></script>
<script type="text/babel" src="search.jsx"></script>
<script type="text/babel" src="app.jsx"></script>     <!-- App root, renders ReactDOM -->
```
**Do not change this order.** Files depend on globals defined earlier.

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

Analytics are already wired — **GoatCounter** (`data-goatcounter` script in `index.html` + the case-study pages), shown in the admin **Návštěvnost** tab. (This replaced the earlier Plausible plan.) Still TODO in `index.html`: set OG meta tags to absolute URLs (`https://jenda-web.vercel.app/...`).
In **`sw.js`**: bump `VERSION` on any cached-asset change.
In **case study HTML**: uncomment giscus block + fill `data-repo` etc.

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
- **Audio-reactive + parallax background** — `BackgroundFX`, see the Background section above.

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
5. **Bump `sw.js` `VERSION`** after any cached-asset change.
6. Avoid `scrollIntoView` (project convention) — use `window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80 })`.
7. **Deploy = `git push` to `main`** (Vercel auto-deploys). No manual build.
8. `handoff/` is a frozen old-version backup — ignore it for current work.

> **Done (was "next phase"):** the content **upload interface** (login-protected `/admin`) backed by **Supabase** (database + auth + file storage) is **built and live** — music, apps, images and texts are managed via forms with file upload instead of editing `data.js`. Original spec: **`UPLOAD_INTERFACE_PLAN.md`**; backend details: **`SUPABASE_BACKEND.md`**; current state: **`PROJECT_STATUS.md`**.

— Maintained for the Cowork + GitHub/Vercel workflow. Last updated 15 Jun 2026.
