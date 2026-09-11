// sw.js — Service worker for offline-first PWA
// site-runtime:start
const VERSION = "jw-v109-9346c09a9c65e87f";
const RUNTIME = [
  "/site-assets/app.9098bc01cc268571.js",
  "/site-assets/data.d79f1dd75fcf401d.js",
  "/site-assets/supabase-data.4d8170e487cb9876.js"
];
// site-runtime:end
const SHELL = [
  '/',
  '/index.html',
  ...RUNTIME,
  // Lokální knihovny (dříve CDN) — nutné pro offline boot
  '/vendor/react.production.min.js',
  '/vendor/react-dom.production.min.js',
  // Self-hostované fonty
  '/vendor/fonts.css',
  '/vendor/fonts/syne-latin-400-normal.woff2',
  '/vendor/fonts/syne-latin-600-normal.woff2',
  '/vendor/fonts/syne-latin-700-normal.woff2',
  '/vendor/fonts/syne-latin-800-normal.woff2',
  '/vendor/fonts/dm-sans-latin-300-normal.woff2',
  '/vendor/fonts/dm-sans-latin-400-normal.woff2',
  '/vendor/fonts/dm-sans-latin-400-italic.woff2',
  '/vendor/fonts/dm-sans-latin-500-normal.woff2',
  // latin-ext (české znaky: č ď ě ň ř š ť ů ž …)
  '/vendor/fonts/syne-latin-ext-400-normal.woff2',
  '/vendor/fonts/syne-latin-ext-600-normal.woff2',
  '/vendor/fonts/syne-latin-ext-700-normal.woff2',
  '/vendor/fonts/syne-latin-ext-800-normal.woff2',
  '/vendor/fonts/dm-sans-latin-ext-300-normal.woff2',
  '/vendor/fonts/dm-sans-latin-ext-400-normal.woff2',
  '/vendor/fonts/dm-sans-latin-ext-400-italic.woff2',
  '/vendor/fonts/dm-sans-latin-ext-500-normal.woff2',
  // Manifest + ikony
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon-180.png',
  '/icons/fyzika-pastelkou.png',
  '/icons/georeminder-ci196.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('jw-v') && k !== VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Large app downloads belong to the browser, not the offline page cache.
  if (url.origin === location.origin && url.pathname.startsWith('/binaries/')) return;
  // RT Asistent owns its scoped worker and cache; portfolio updates must not touch it.
  if (url.origin === location.origin && (url.pathname === '/rt-asistent' || url.pathname.startsWith('/rt-asistent/'))) return;
  // Admin je online-only — nikdy neservíruj starou verzi z cache (vždy ze sítě)
  if (url.origin === location.origin && (url.pathname === '/admin' || url.pathname.startsWith('/admin.'))) {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }
  // network-first for HTML to pick up new content; cache-first for assets
  const isHTML = req.mode === 'navigate' || (req.headers.get('Accept') || '').includes('text/html');
  if (isHTML) {
    e.respondWith(
      fetch(req).then((res) => {
        if (!res.ok) throw new Error('HTML request failed');
        const copy = res.clone();
        e.waitUntil(caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {}));
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match('/index.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          e.waitUntil(caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {}));
        }
        return res;
      }).catch(() => cached))
    );
  }
});
