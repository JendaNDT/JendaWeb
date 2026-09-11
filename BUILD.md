# Production build

The portfolio stays a static React site. Visitors receive compiled JavaScript;
Babel is used only during the build. The versioned compiler in `vendor/` is the
only build dependency, so no package installation or new framework is needed.

With Node.js available, run from the repository root:

```sh
node build_site.cjs
node build_site.cjs --check
node tests/music-newsletter.cjs
node tests/contact.cjs
node tests/startup-build.cjs
node tests/gallery-input.cjs
node tests/download-counts.cjs
node tests/multipart-downloads.cjs
```

`python3 build_jsx.py` remains a compatibility entry point and invokes the same
complete build (Node.js is still required).

Edit the individual JSX modules, `data.js`, `supabase-data.js`, `boot.js`, or the
parts of `index.html` / `sw.js` outside their `site-runtime` markers. The build
regenerates `combined.jsx`, three fingerprinted files in `site-assets/`, and the
marked HTML / worker blocks. Commit all those outputs together with the sources.
Never edit generated assets by hand. `--check` fails if committed outputs are
stale. A missing module or compile error aborts the build.

`vercel.json` runs `node build_site.cjs` before deployment and serves the existing
repository root. Redirects, installer files, admin and RT Asistent stay in their
existing locations. Hashed assets can be cached for a year; HTML revalidates and
the service worker is not cached by HTTP. Admin's existing JSX setup is separate
and is not migrated here; do not remove its vendored compiler.

The worker cache name combines the release family and a fingerprint of compiled
code, catalog scripts, startup code, HTML and worker source. Installation must
finish precaching before activation. Old portfolio caches are removed only on
successful activation; RT Asistent and other caches are preserved. There is no
forced page reload that would interrupt currently playing music. After a
successful new React mount, only `jw_jsx_version` and `jw_jsx_cache_*` localStorage
entries are removed. Preferences, likes and saved content remain intact.

The startup message and retry button are outside the React root. Script failures
and a React error boundary show a readable message; a slow start offers retry
without preventing later success. Successful mounting hides it. Retry reloads
the current address without clearing storage or changing the fragment.

The test scripts use isolated Node environments and simulated browser events,
network replies and caches. They do not send mail, play production audio, alter
statistics, or prove behavior on a physical phone. Before publishing, also verify
real keyboard input, both color modes, 320–430 px layouts, script-failure/retry,
and an existing installed PWA update in a permitted browser test environment.
