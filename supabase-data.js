// supabase-data.js — Fáze 3: web čte obsah ze Supabase, s offline cache.
// Obyčejný <script> (běží PŘED Babel app skripty). Přepíše window.* globály,
// které naplnil data.js, takže komponenty vykreslí obsah z DB beze změny kódu.
// data.js zůstává načtený jako fallback pro první návštěvu / offline bez cache.
(function () {
  'use strict';

  var SUPABASE_URL = 'https://semdgbaearwhkhulkyts.supabase.co';
  // Veřejný anon klíč — patří do frontendu; zápis blokuje RLS (tady jen čteme).
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbWRnYmFlYXJ3aGtodWxreXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUzNzAsImV4cCI6MjA5NzA2MTM3MH0.5X4X-FVXlwukKWOlx3kIqazaBBeJJMCNMiEmdNPM8lk';
  var REST = SUPABASE_URL + '/rest/v1/';
  var CACHE_KEY = 'jw_content_v1';

  window.__jwContentVersion = window.__jwContentVersion || 0;
  // Vystavit přístup k Supabase i pro ostatní skripty (počítání přehrání atd.)
  window.__jwSupa = { url: SUPABASE_URL, key: SUPABASE_KEY };

  // --- mapování: DB řádek (snake_case) -> tvar globálu (shodný s data.js) ---
  function mapApps(rows) {
    return rows.map(function (a) {
      return { id: a.id, name: a.name, platform: a.platform, color: a.color,
               cs: a.cs, en: a.en, link: a.link || '#', case_study_url: a.case_study_url || null,
               screenshots: a.screenshots || [] };
    });
  }
  function mapAlbums(rows) {
    return rows.map(function (a) {
      return { id: a.id, title: a.title, genre: a.genre, tracks: a.tracks,
               year: a.year, g1: a.g1, g2: a.g2, cs: a.cs, en: a.en, cover_url: a.cover_url || null };
    });
  }
  function mapTracks(rows) {
    return rows.map(function (t) {
      var hasLyrics = (t.lyrics_cs != null) || (t.lyrics_en != null);
      return { id: t.id, title: t.title, album: t.album_id, duration: t.duration,
               audioUrl: t.audio_url, downloadUrl: t.download_url, plays: t.plays || 0,
               cover: t.cover_url || null,
               lyrics: hasLyrics ? { cs: t.lyrics_cs, en: t.lyrics_en } : null };
    });
  }
  function mapSocials(rows) {
    return rows.map(function (s) { return { id: s.id, label: s.label, url: s.url }; });
  }

  // --- nasazení obsahu na window globály, které web čte ---
  function applyContent(c) {
    if (!c) return;
    if (c.apps)    window.APPS_DATA   = c.apps;
    if (c.albums)  window.ALBUMS      = c.albums;
    if (c.tracks)  window.TRACKS_DATA = c.tracks;
    if (c.socials) window.SOCIALS     = c.socials;
    var cfg = c.config || {};
    if ('contact_email'       in cfg) window.CONTACT_EMAIL       = cfg.contact_email;
    if ('contact_endpoint'    in cfg) window.CONTACT_ENDPOINT    = cfg.contact_endpoint;
    if ('newsletter_endpoint' in cfg) window.NEWSLETTER_ENDPOINT = cfg.newsletter_endpoint;
    if ('kofi_username'       in cfg) window.KOFI_USERNAME       = cfg.kofi_username;
    if ('giscus_config'       in cfg) window.GISCUS_CONFIG       = cfg.giscus_config;
    if ('public_stats'        in cfg) window.PUBLIC_STATS        = cfg.public_stats;
    if ('build_log'          in cfg) window.BUILD_LOG           = cfg.build_log;
    if ('comparison'          in cfg) window.COMPARISON          = cfg.comparison;
    // case studies: postavit z apps.case_study_url (sjednoceno s adminem)
    if (c.apps) {
      var csm = {};
      c.apps.forEach(function (a) { if (a.case_study_url) csm[a.id] = a.case_study_url; });
      window.CASE_STUDIES = csm;
    }
    // editovatelné texty webu: merge override hodnot na window.STRINGS (defaulty z data.js)
    if (cfg.strings && window.STRINGS) {
      ['cs', 'en'].forEach(function (l) {
        var ov = cfg.strings[l];
        if (window.STRINGS[l] && ov) { for (var k in ov) { if (ov[k]) window.STRINGS[l][k] = ov[k]; } }
      });
    }
  }

  // 1) SYNC: vykreslit poslední známý obsah z cache JEŠTĚ než se app mountne.
  var cachedRaw = null;
  try { cachedRaw = localStorage.getItem(CACHE_KEY); } catch (e) {}
  if (cachedRaw) { try { applyContent(JSON.parse(cachedRaw)); } catch (e) {} }

  // 2) ASYNC: stáhnout čerstvý obsah, aktualizovat globály + cache, přerenderovat při změně.
  function get(path) {
    return fetch(REST + path, {
      headers: { apikey: SUPABASE_KEY, authorization: 'Bearer ' + SUPABASE_KEY },
      cache: 'no-store'
    }).then(function (r) {
      if (!r.ok) throw new Error(path + ' -> ' + r.status);
      return r.json();
    });
  }

  Promise.all([
    get('apps?select=*&order=sort.asc'),
    get('albums?select=*&order=sort.asc'),
    get('tracks?select=*&order=sort.asc'),
    get('socials?select=*&order=sort.asc'),
    get('site_config?select=key,value&order=key.asc')
  ]).then(function (res) {
    var cfg = {};
    (res[4] || []).forEach(function (row) { cfg[row.key] = row.value; });
    var content = {
      apps:    mapApps(res[0] || []),
      albums:  mapAlbums(res[1] || []),
      tracks:  mapTracks(res[2] || []),
      socials: mapSocials(res[3] || []),
      config:  cfg
    };
    var json = JSON.stringify(content);
    applyContent(content);
    try { localStorage.setItem(CACHE_KEY, json); } catch (e) {}
    // Přerenderuj jen když se obsah opravdu změnil (ať nerušíme přehrávač zbytečně).
    if (json !== cachedRaw) {
      window.__jwContentVersion++;
      try { window.dispatchEvent(new Event('jw-data-updated')); } catch (e) {}
    }
  }).catch(function (e) {
    // Offline nebo nedostupné: tiše ponech cache/fallback obsah.
    if (window.console && console.info) console.info('[jw] Supabase offline, používám uložený obsah.', e && e.message);
  });
})();
