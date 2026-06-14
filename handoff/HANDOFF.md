# Jenda Personal Website — Handoff pro Google Antigravity

> Tento dokument je primárně určen pro AI agenta v Google Antigravity.
> Začni každou novou konverzaci vložením sekce **„Kontext pro agenta"** z `AGENT_CONTEXT.md`.

---

## 1. O projektu

Osobní web **Jenda** — vibecoder & AI hudebník. Jednostránkový web (SPA) se sekcemi:

| Sekce | ID | Popis |
|---|---|---|
| Hero | `#hero` | Uvítací sekce, jméno, stats, CTA |
| Aplikace | `#apps` | Grid 20 appek s filtrem PWA/Android |
| Hudba | `#music` | 5 alb + seznam 15 tracků + sticky player |
| Kontakt | `#contact` | Email + 5 sociálních ikonek |
| Footer | — | Copyright |

---

## 2. Struktura souborů

```
/
├── index.html          ← Shell: meta, fonty, CSS proměnné, <div id="root">
├── data.js             ← Veškerá data (plain JS, window.APPS_DATA atd.)
├── app.jsx             ← Všechny React komponenty (Babel transpile)
├── tweaks-panel.jsx    ← Sdílená knihovna Tweaks ovládacích prvků
└── handoff/
    ├── HANDOFF.md      ← Tento dokument
    └── AGENT_CONTEXT.md← Připravené prompty pro Antigravity
```

### Pořadí načítání skriptů (důležité!)

```html
<!-- v index.html -->
<script src="tweaks-panel.jsx" type="text/babel">  <!-- 1. exportuje do window -->
<script src="data.js">                              <!-- 2. plain JS, window.APPS_DATA... -->
<script src="app.jsx" type="text/babel">            <!-- 3. používá vše výše -->
```

---

## 3. Tech stack

| Technologie | Verze | Poznámka |
|---|---|---|
| React | 18.3.1 | UMD build (CDN, žádný npm) |
| ReactDOM | 18.3.1 | CDN |
| Babel Standalone | 7.29.0 | Transpiluje JSX v prohlížeči |
| Google Fonts | — | Syne (nadpisy) + DM Sans (tělo) |
| Web Audio API | nativní | HTML5 `<Audio>` v AudioPlayer |
| IntersectionObserver | nativní | Scroll animace sekcí |

> ⚠️ **Žádný bundler, žádný npm.** Projekt běží přímo jako statické HTML soubory.
> Stačí `python3 -m http.server 8000` nebo jakýkoliv statický server.

---

## 4. Architektura komponent

```
App
├── Nav                    — fixní navigace, scroll efekt, CZ/EN přepínač
├── Hero                   — fullscreen úvod, gradient animace
├── AppsSection            — grid appek + filtrování
│   └── AppCard × 20       — karta aplikace
├── MusicSection           — hudební sekce
│   ├── AlbumCard × 5      — karta alba s hover-play
│   └── TrackRow × 15      — řádek skladby
├── ContactSection         — email + sociální ikony
├── Footer
└── AudioPlayer            — sticky bottom bar (zobrazí se po kliknutí Play)
    └── (HTML5 Audio ref)
```

### Sdílené helper komponenty

| Komponenta | Účel |
|---|---|
| `Btn` | Univerzální tlačítko (primary / outline / ghost) |
| `SectionLabel` | Velký nadpis sekce s tečkou v barvě akcentu |
| `SubLabel` | Malý uppercase titulek podsekce |
| `SocialIco` | SVG ikony pro GitHub, YouTube, SoundCloud, Instagram, Bandcamp |
| `useInView()` | Hook: vrátí `[ref, visible]` pro scroll fade-in |

---

## 5. Stav aplikace (React state v `App`)

| Stav | Typ | Popis |
|---|---|---|
| `lang` | `'cs' \| 'en'` | Aktuální jazyk |
| `tw.theme` | `'ember' \| 'velvet' \| 'desert'` | Aktivní barevné téma |
| `playerTrack` | `Track \| null` | Aktuálně vybraná skladba |
| `playlist` | `Track[]` | Aktuální playlist (pro prev/next) |
| `playing` | `boolean` | Stav přehrávání |

### Tok přehrávání

```
Klik na AlbumCard nebo TrackRow
  → handlePlay(track, playlist)
    → setPlayerTrack(track)
    → setPlaylist(tracks)
    → setPlaying(true)
      → AudioPlayer se objeví (slideUp animace)
```

---

## 6. Systém témat (CSS proměnné)

Témata jsou definována v `app.jsx` jako JS objekt a aplikována přes `document.documentElement.style.setProperty()`.

```javascript
const THEMES = {
  ember:  { bg:'#0d0805', bg2:'#160d07', a1:'#f97316', a2:'#fbbf24', glow:'rgba(249,115,22,0.25)' },
  velvet: { bg:'#0e0508', bg2:'#180a0f', a1:'#e11d48', a2:'#f59e0b', glow:'rgba(225,29,72,0.22)' },
  desert: { bg:'#0c0905', bg2:'#150e07', a1:'#d97706', a2:'#f97316', glow:'rgba(217,119,6,0.25)' },
};
```

### Kompletní seznam CSS proměnných

| Proměnná | Výchozí (Ember) | Účel |
|---|---|---|
| `--bg` | `#0d0805` | Hlavní pozadí |
| `--bg2` | `#160d07` | Alternativní pozadí (střídání sekcí) |
| `--card` | `rgba(255,255,255,0.04)` | Pozadí karet |
| `--border` | `rgba(255,255,255,0.08)` | Barva ohraničení |
| `--text` | `#f5f0ea` | Hlavní text |
| `--muted` | `#8a7060` | Tlumený text |
| `--a1` | `#f97316` | Primární akcent |
| `--a2` | `#fbbf24` | Sekundární akcent |
| `--glow` | `rgba(249,115,22,0.25)` | Glow efekt (box-shadow) |
| `--r` | `14px` | Hlavní border-radius |
| `--r-sm` | `8px` | Malý border-radius |

---

## 7. Typografie

| Použití | Font | Váha | Velikost |
|---|---|---|---|
| Velká jména (hero, logo) | Syne | 800 | `clamp(80px, 16vw, 160px)` |
| Nadpisy sekcí | Syne | 800 | `clamp(36px, 5.5vw, 58px)` |
| Nadpisy karet | Syne | 700 | 15–16px |
| Tělo textu | DM Sans | 400 | 14–16px |
| Tlumený text | DM Sans | 300 | 12–13px |
| Štítky (uppercase) | DM Sans | 700 | 11–13px |

---

## 8. Datový model (`data.js`)

### `window.APPS_DATA` — pole 20 objektů
```typescript
{
  id:       number,
  name:     string,          // název aplikace
  platform: 'PWA' | 'Android',
  color:    string,          // hex barva pro ikonu a hover efekty
  cs:       string,          // popis česky
  en:       string,          // popis anglicky
  link:     string,          // URL ke stažení / PWA adresa — TODO: doplnit
}
```

### `window.ALBUMS` — pole 5 objektů
```typescript
{
  id:     string,            // slug ('sahara', 'balkan', ...)
  title:  string,
  genre:  string,
  tracks: number,            // počet skladeb v albu
  year:   number,
  g1:     string,            // hex barva pro gradient obálky (od)
  g2:     string,            // hex barva pro gradient obálky (do)
  cs:     string,            // popis česky
  en:     string,            // popis anglicky
}
```

### `window.TRACKS_DATA` — pole 15 objektů
```typescript
{
  id:          number,
  title:       string,
  album:       string,       // ID alba (odpovídá ALBUMS[n].id)
  duration:    string,       // formát 'M:SS'
  audioUrl:    string | null, // URL audio ze Suno — TODO: doplnit
  downloadUrl: string | null, // URL ke stažení MP3 — TODO: doplnit
}
```

### `window.SOCIALS` — pole 5 objektů
```typescript
{
  id:    'github' | 'youtube' | 'soundcloud' | 'instagram' | 'bandcamp',
  label: string,
  url:   string,             // TODO: doplnit reálné profily
}
```

### `window.STRINGS` — překlady `{ cs: {...}, en: {...} }`
Všechny UI texty jsou v tomto objektu. Funkce `tx(lang, 'klíč')` vrací překlad.

---

## 9. Klíčové CSS animace (v `index.html`)

| Animace | Použití | Popis |
|---|---|---|
| `float1` | Hero orb vlevo | Pomalé levitování (20s) |
| `float2` | Hero orb vpravo | Pomalé levitování (28s) |
| `gradShift` | Hero název | Pohyb gradientu (9s) |
| `slideUp` | AudioPlayer | Vysunutí zdola (0.35s) |
| `cardIn` | AppCard grid | Staggered fade-up (0.5s) |
| `.fade-up` + `.in-view` | Sekce | IntersectionObserver reveal |

---

## 10. TODO — nahradit placeholdery reálným obsahem

### Kritické (web nebude fungovat bez nich)
- [ ] **Email** v `ContactSection`: `jenda@example.com` → reálný email
- [ ] **App linky** v `data.js`: všechny `link:'#'` → reálné URL

### Důležité (pro plnou funkčnost přehrávače)
- [ ] **Audio URL** v `data.js`: `audioUrl: null` → odkaz na audio ze Suno  
  _(formát: přímý link na MP3/OGG nebo Suno share URL)_
- [ ] **Download URL** v `data.js`: `downloadUrl: null` → odkaz ke stažení

### Volitelné (vylepšení)
- [ ] **Sociální linky**: všechny `url:'#'` v `window.SOCIALS`
- [ ] **Ikony appek**: nahradit písmena v `AppCard` reálnými PNG ikonami
- [ ] **Fotografie**: přidat do Hero sekce
- [ ] **Více skladeb**: rozšířit `TRACKS_DATA` (aktuálně 15 z 200)
- [ ] **Reálná alb**: přidat skutečné obálky alb místo CSS gradientů

---

## 11. Lokální spuštění

```bash
# Přejdi do složky projektu
cd /cesta/k/projektu

# Spusť jednoduchý HTTP server (Python 3)
python3 -m http.server 8000

# Otevři v prohlížeči
open http://localhost:8000
```

> ⚠️ **Nelze otevřít jako `file://`** — CORS blokuje načítání `.jsx` souborů přes XHR.
> Vždy použij HTTP server.

---

## 12. Přidání nové appky

1. Otevři `data.js`
2. Přidej objekt do pole `window.APPS_DATA`:

```javascript
{ 
  id: 21,                          // unikátní číslo
  name: 'NázevAppky',
  platform: 'PWA',                 // nebo 'Android'
  color: '#hexbarva',              // libovolná hex barva
  cs: 'Popis česky',
  en: 'English description',
  link: 'https://...'              // URL ke stažení nebo otevření
}
```

---

## 13. Přidání nové skladby

1. Otevři `data.js`
2. Přidej objekt do `window.TRACKS_DATA`:

```javascript
{ 
  id: 16,
  title: 'Název skladby',
  album: 'sahara',                 // ID existujícího alba
  duration: '3:45',
  audioUrl: 'https://...',         // přímý odkaz na audio
  downloadUrl: 'https://...'       // odkaz ke stažení
}
```

---

## 14. Nasazení (deployment)

Web je čistě statický — funguje na jakémkoliv hostingu:

| Platforma | Příkaz / Postup |
|---|---|
| **GitHub Pages** | Push do `gh-pages` branch nebo `/docs` složky |
| **Netlify** | Drag & drop složky na netlify.com/drop |
| **Vercel** | `vercel --prod` ve složce projektu |
| **Vlastní hosting** | Nahraj všechny 4 soubory na FTP/SFTP |

> Nahraj vždy všechny 4 soubory: `index.html`, `data.js`, `app.jsx`, `tweaks-panel.jsx`

---

## 15. Bezpečnostní poznámky

- Tweaks panel je viditelný pouze v nástroji Orbit (přes `__activate_edit_mode` postMessage) — na produkčním webu se nezobrazí
- Žádné API klíče ani citlivé údaje v projektu nejsou
- Web je čistě client-side, bez backend závislostí
