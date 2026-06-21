// sw.js — Service worker for offline-first PWA
const VERSION = 'jw-v83';
const SHELL = [
  '/',
  '/index.html',
  '/data.js',
  '/supabase-data.js',
  `/combined.jsx?v=${VERSION}`,
  // Lokální knihovny (dříve CDN) — nutné pro offline boot
  '/vendor/react.production.min.js',
  '/vendor/react-dom.production.min.js',
  '/vendor/babel.min.js',
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
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
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
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((m) => m || caches.match('/index.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached))
    );
  }
});
