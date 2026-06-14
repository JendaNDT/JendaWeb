# JendaWeb — Handoff Document

Personal portfolio site for "Jenda — Vibe Coder & AI Music". A React SPA built with inline Babel + JSX, no build step. Installable PWA, bilingual (CZ / EN), dark/light mode with multiple accent themes.

## Tech stack

- React 18 + ReactDOM via UMD scripts
- @babel/standalone (in-browser JSX transformation, no bundler)
- Plain CSS in `<style>` block + inline-style JSX
- Service Worker for offline PWA cache
- No npm, no build, no node_modules — open `index.html` and it runs.

## File map

```
.
├── index.html                  # HTML shell, CSS tokens, script load order, mesh background
├── data.js                     # All content: apps, albums, tracks, socials, strings, stats, config keys
├── app.jsx                     # Root App component, lang/mode state, hash routing, keyboard shortcuts
├── shared.jsx                  # Themes, hooks (useInView, useCountUp), icons, base components, art generators
├── nav-hero.jsx                # Nav + Hero sections
├── apps-music.jsx              # AppCard, AppsSection, AlbumCard, TrackRow, MusicSection
├── player-contact.jsx          # AudioPlayer (mini), ShortcutsOverlay, ContactForm, ContactSection, Footer
├── player-expand.jsx           # ExpandMode full-screen player + AnalyzerOverlay
├── search.jsx                  # Cmd+K SearchOverlay (cross-content search)
├── queue.jsx                   # QueueDrawer (Q to open)
├── extras.jsx                  # NewsletterSection, StatsSection, ComparisonSection, MostPlayedSection, DonationButton
├── tweaks-panel.jsx            # Reusable Tweaks panel scaffold (omelette starter)
├── sw.js                       # Service worker (cache shell + network-first HTML)
├── manifest.webmanifest        # PWA manifest
├── og-image.svg                # 1200×630 social card
├── robots.txt
├── sitemap.xml
├── feed.xml                    # RSS feed for music releases
├── 404.html                    # Themed 404 page
├── embed.html                  # Embeddable mini-player (?id=trackId)
└── case-studies/
    ├── style.css               # Shared case study styles (matches main site tokens)
    ├── meditapp.html           # MeditApp case study
    ├── beatcraft.html          # BeatCraft case study
    └── chordlens.html          # ChordLens case study
```

## Architecture — IMPORTANT

Because each `<script type="text/babel">` gets its own scope when transpiled by in-browser Babel, **inter-file communication uses `window` globals**.

At the end of each `.jsx` file:
```js
Object.assign(window, { ComponentA, ComponentB, helperFn, ... });
```

In other files, those identifiers resolve via the global scope (`window.ComponentA` looks the same as bare `ComponentA`).

### Script load order in `index.html`

```html
<script type="text/babel" src="tweaks-panel.jsx"></script>
<script src="data.js"></script>                       <!-- plain JS, sets window.APPS_DATA etc. -->
<script type="text/babel" src="shared.jsx"></script>  <!-- themes, hooks, icons, helpers -->
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

To avoid Babel scope collisions, each file does its own destructure with unique names:
```js
const { useState: __useS_app, useEffect: __useE_app, ... } = React;
```
This is intentional. If you add a new file, follow the same pattern (`__useS_xxx` etc.).

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
| `jw_plays`         | { trackId: count } — listening stats    |

Tweaks state (theme, mode) also persists via the tweaks-panel scaffold's own storage.

## URL hash routing

- `#track=N` — loads track ID N into player (paused)
- `#album=ID` — loads first track of album, sets playlist to album tracks
- `#track=N&t=84` — also seeks to 84 seconds (used by share-with-timestamp)

## Keyboard shortcuts (global)

| Key             | Action                       |
|-----------------|------------------------------|
| `Cmd/Ctrl+K`    | Search overlay               |
| `?`             | Shortcuts overlay            |
| `Space`         | Play / pause                 |
| `← / →`         | Prev / next track            |
| `Shift+← / →`   | Seek 5s back / forward       |
| `M`             | Mute                         |
| `E`             | Expand player                |
| `Q`             | Queue drawer                 |
| `V`             | Cycle visualizer mode        |
| `D`             | Audio analyzer overlay       |
| `A`             | Set loop start               |
| `B`             | Set loop end                 |
| `Z`             | Clear loop                   |
| `L`             | Toggle language              |
| `Esc`           | Close current overlay        |

## Configurable values — TODO before going live

In **`data.js`**:

| Constant                | What to set it to                                                |
|-------------------------|------------------------------------------------------------------|
| `window.CONTACT_ENDPOINT` | Formspree URL like `'https://formspree.io/f/xxxxxxxx'`. Falls back to `mailto:` if null. |
| `window.CONTACT_EMAIL`   | Your real email                                                  |
| `window.NEWSLETTER_ENDPOINT` | Buttondown embed URL. Falls back to friendly "thanks" if null.   |
| `window.KOFI_USERNAME`   | Your Ko-fi username — donation button activates                  |
| `window.GISCUS_CONFIG`   | `{ repo, repoId, category, categoryId }` from giscus.app         |
| `window.APPS_DATA`       | Replace placeholder `link:'#'` with real app URLs                |
| `window.TRACKS_DATA`     | Replace `audioUrl: null` with real Suno URLs + `downloadUrl`     |
| `window.SOCIALS`         | Replace `url:'#'` with real social profiles                      |
| `window.CASE_STUDIES`    | Map of `appId -> case study URL` (currently 3 entries)           |
| `window.PUBLIC_STATS`    | Update with real numbers                                         |
| `window.BUILD_LOG`       | Replace placeholder monthly entries                              |

In **`index.html`**:
- Uncomment Plausible script + set `data-domain` for analytics
- Update OG meta tags to absolute URLs once you have a real domain

In **`sw.js`**:
- Bump `VERSION` constant whenever you change cached assets, to invalidate old SW cache

In **case study HTML files**:
- Uncomment the giscus `<script>` block at the bottom of each, fill in `data-repo` etc.

## Theming

- **Themes** (accent palettes): `ember` (default), `velvet`, `desert` — defined in `shared.jsx` `THEMES` object
- **Mode**: `auto` (follows OS) / `light` / `dark`
- Both selectable via Tweaks panel + nav button (mode only)
- CSS tokens in `index.html` `:root` and `html[data-mode="light"]`
- `--ambient1` / `--ambient2` are set dynamically from currently-playing album colors

## Notable features (so you don't reinvent them)

- **Procedural artwork** — `trackArt(seed, album)` and `albumArt(album)` in `shared.jsx`. Deterministic SVG data URIs, mesh gradients + noise.
- **Drifting mesh background** — 4 animated orbs in `index.html` body (mesh-1 teal, mesh-2 indigo, mesh-3 amber, mesh-4 plum). `prefers-reduced-motion` aware.
- **Brand watermark** — fixed "J" in bottom-left, 22vw, very low opacity.
- **Floating-label form fields** — `.field` CSS class, placeholder=" " trick.
- **Animated number counters** — `useCountUp(target)` hook, intersection-triggered, easeOutQuart.
- **A/B loop** — A/B/Z keys, markers shown in ExpandMode bars-mode waveform.
- **Audio analyzer overlay** — D key in ExpandMode, real-time peakHz / rms / range from AnalyserNode.
- **Visualizer modes** — V cycles bars / radial / mirror.
- **Most Played section** — reads `localStorage.jw_plays`, hidden if empty.

## Things deliberately not done

- **Crossfade** — would require dual-audio engine (two `<audio>` elements with overlapping fade-in/out). Skipped because of complexity and lack of real audio to test against.
- **Pre-cache next track** — meaningless until `audioUrl` is real.
- **Quality switcher** — Suno doesn't expose multiple bitrate URLs in a public way.
- **Smart skip ML signal** — needs real listening data first.

## Recommended next steps for a fresh agent

1. Open the site, hit `?` and `Cmd+K` to see the feature surface.
2. Read `shared.jsx` first (helpers everyone uses), then `app.jsx` (root + state shape), then any specific section you need to touch.
3. When adding a new component, follow the established pattern: define in a `.jsx` file, alias React hooks with file-specific suffixes, `Object.assign(window, {...})` at the end, add `<script type="text/babel">` to `index.html` in the right load order.
4. Bump `sw.js` `VERSION` after any change to cached assets.
5. Avoid `scrollIntoView` (per project convention) — use `window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80 })` instead.
6. Each Babel script gets its own scope; never assume an identifier from another file is visible without going through `window`.

— Generated handoff for Cowork import.
