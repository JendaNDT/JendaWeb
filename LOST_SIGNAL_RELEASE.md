# Lost Signal web preview

Public entry: `/lost-signal/`. Versioned assets: `/lost-signal/releases/0.3.0-web.1/`.
The game is exported with Godot 4.7.1 Compatibility, single threaded, from the current
Lost Signal preview.9 source plus touch/browser integration. All 37 campaign missions,
story and six prototypes remain available. The game text is Czech; the launcher and
catalog provide Czech and English copy.

`node tests/lost-signal.cjs` verifies the complete PCK hash, every 20 MiB chunk,
compressed WebAssembly, stable entry page and the MIME/encoding route. The Vercel Git
integration deploys these static files; no CLI upload, paid service, tariff change,
server function or cross-origin isolation is required. Wasm uses precompressed gzip;
PCK assets are already compressed by Godot and are served as eight chunks.

First-load payload: 167,577,326 bytes (about 168 MB), plus this page and catalog image.
The runtime pack is 157,087,252 bytes; Wasm expands to 39,513,091 bytes. Chunks are read
sequentially into one pack buffer to limit transient memory. Immutable URLs retain
browser HTTP caches; the stable launcher revalidates. Portfolio `sw.js` excludes this
scope and never places the game data in its offline cache. This preview needs a
connection at launch and is not advertised as an offline PWA.

Progress uses Godot's existing IndexedDB user filesystem, under the same origin and
game name across releases. A regular browser window and retained site data are needed.
A new release must use a new assets directory; keep old directories and downloads.
Regenerate with Lost Signal's `tools/export_web.py --base-url /lost-signal/releases/VERSION/`,
copy the exported files into that directory and its HTML to `lost-signal/index.html`,
and update the stable rewrite plus catalog versioned images. Never modify immutable
production assets in place.

Local evidence: Chromium desktop and touch emulation, WebKit 26.6 at 844×390, real
menu/story/mission input, pause, reload and checkpoint resume, IndexedDB files and
running audio contexts. Chromium also covers simultaneous joystick and jump touches.
WebKit rendered the inspected frames but emitted two WebGL INVALID_OPERATION messages;
this is a remaining compatibility limit. A physical iPhone has not been tested.
Catalog fallback was tested in Czech/English, light/dark at 390 and 1280 px with real
launch clicks. Public production verification is recorded after deployment.

Existing Android distribution and all other catalog rows/download counters are retained.
The new database record is defined in `lost-signal/catalog.json`; publish it only after
the game URL is live. The same row is present in `data.js` for offline/API-failure fallback.
