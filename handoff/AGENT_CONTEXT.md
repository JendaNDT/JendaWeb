# AGENT CONTEXT — Jenda Personal Website
# Zkopíruj a vlož na začátek každé nové konverzace v Antigravity

---

## ► ÚVODNÍ KONTEXT (vložit vždy na začátek)

```
Pracuješ na osobním webu jménem "Jenda" — vibecoder a AI hudebník.

ARCHITEKTURA:
- Čistě statický web (žádný npm, žádný bundler)
- React 18 přes CDN + Babel Standalone (JSX transpilace v prohlížeči)
- 4 soubory: index.html (shell+CSS), data.js (plain JS data), app.jsx (React komponenty), tweaks-panel.jsx (sdílená UI knihovna)
- Pořadí načítání: tweaks-panel.jsx → data.js → app.jsx

DATOVÝ MODEL (v data.js, přístupný přes window.*):
- window.APPS_DATA  — pole 20 aplikací {id, name, platform:'PWA'|'Android', color, cs, en, link}
- window.ALBUMS     — pole 5 alb {id, title, genre, tracks, year, g1, g2, cs, en}
- window.TRACKS_DATA— pole 15 skladeb {id, title, album, duration, audioUrl, downloadUrl}
- window.SOCIALS    — pole 5 sociálních sítí {id, label, url}
- window.STRINGS    — překlady {cs:{...}, en:{...}}

TÉMATA (v app.jsx, funkce applyTheme()):
- 'ember'  → oranžová #f97316 / zlatá #fbbf24
- 'velvet' → růžová #e11d48 / jantarová #f59e0b
- 'desert' → terracotta #d97706 / oranžová #f97316
- Přepínání přes CSS custom properties na :root

STAV APLIKACE (App komponenta):
- lang: 'cs'|'en' — jazyk webu
- tw.theme: téma z Tweaks panelu
- playerTrack: aktuálně přehrávaná skladba (null = player skryt)
- playlist: pole skladeb pro prev/next
- playing: boolean stav přehrávání

SPUŠTĚNÍ: python3 -m http.server 8000 (nelze otevřít jako file://)
```

---

## ► PŘIPRAVENÉ PROMPTY

Zkopíruj a vlož příslušný prompt do chatu Antigravity.

---

### 🎵 Přidat reálné audio URL ze Suno

```
V souboru data.js najdi pole TRACKS_DATA. Pro skladbu s id:[ČÍSLO] nastav:
- audioUrl: '[VLOŽ_SUNO_URL]'
- downloadUrl: '[VLOŽ_DOWNLOAD_URL]'

Neměň žádná jiná pole. Po změně ověř, že JSON struktura zůstala validní.
```

---

### 📱 Přidat novou aplikaci

```
V souboru data.js přidej na konec pole APPS_DATA nový objekt:
{
  id: [DALŠÍ_ČÍSLO],
  name: '[NÁZEV]',
  platform: '[PWA nebo Android]',
  color: '[HEX_BARVA]',
  cs: '[POPIS_ČESKY]',
  en: '[POPIS_ANGLICKY]',
  link: '[URL]'
}
Neměň žádné jiné soubory.
```

---

### 🖼️ Přidat ikonu aplikace (obrázek místo písmene)

```
V app.jsx najdi komponentu AppCard. Aktuálně zobrazuje první písmeno názvu (app.name[0]) 
jako placeholder ikonu. Uprav ji tak, aby:
1. Pokud app.iconUrl existuje (není null/undefined), zobrazila <img src={app.iconUrl}> 
   s rozměry 52×52px, border-radius 13px a object-fit:cover
2. Pokud app.iconUrl neexistuje, zachovala stávající chování (písmeno)

Pak přidej volitelné pole iconUrl do datové struktury v data.js (výchozí hodnota null).
```

---

### 📸 Přidat fotografii do Hero sekce

```
V app.jsx najdi komponentu Hero. Za element s textem (div s position:relative, zIndex:1)
přidej kruhovou fotografii:
- Umísti ji vpravo od textu na desktopu (flex row), pod textem na mobilu (flex column)
- Velikost: 200×200px kruh (border-radius:50%)
- Zdroj: props.photoUrl (předej z App komponenty, kde je to nový useState)
- Pokud photoUrl je null, element nezobrazuj
- Jemný border: 2px solid var(--a1) s 20% opacity
- Lehký glow efekt: box-shadow: 0 0 40px var(--glow)

Přidej photoUrl do App state a předej do Hero jako prop.
```

---

### 🌍 Přidat nový jazyk (slovenčina)

```
V data.js přidej do window.STRINGS nový klíč 'sk' se slovenskými překlady.
Zkopíruj strukturu z klíče 'cs' a přelož hodnoty do slovenštiny.

V app.jsx najdi:
1. Komponentu Nav — přidej tlačítko 'SK' vedle CZ/EN tlačítek
2. useState pro lang — přidej 'sk' jako validní hodnotu
3. Funkci tx() — ta již funguje genericky, žádná změna není potřeba

Zachovej stávající CZ/EN funkcionalitu.
```

---

### 🎨 Přidat nové barevné téma

```
V app.jsx najdi objekt THEMES. Přidej nové téma:
{
  [NÁZEV]: { 
    bg:'[DARK_BG]', 
    bg2:'[SLIGHTLY_LIGHTER_BG]', 
    a1:'[PRIMARY_ACCENT]', 
    a2:'[SECONDARY_ACCENT]', 
    glow:'rgba([R],[G],[B],0.22)' 
  }
}

Poté v JSX komponenty App najdi TweakRadio s label="Téma" a přidej nový název 
do pole options.

Doporučuji: pozadí by měla být tmavá (< #202020), akcenty kontrastní a čitelné na tmavém pozadí.
```

---

### 📋 Přidat nové album

```
V data.js přidej do pole ALBUMS nový objekt:
{
  id: '[SLUG]',        // krátký identifikátor bez mezer, např. 'arabic'
  title: '[NÁZEV ALBA]',
  genre: '[ŽÁNR]',
  tracks: [POČET],
  year: [ROK],
  g1: '[HEX_BARVA_1]', // barva gradientu obálky
  g2: '[HEX_BARVA_2]', // barva gradientu obálky
  cs: '[POPIS_ČESKY]',
  en: '[ENGLISH_DESCRIPTION]'
}

Nezapomeň přidat skladby s odpovídajícím album ID do TRACKS_DATA.
```

---

### 📤 Nasadit na GitHub Pages

```
Vytvoř soubor .github/workflows/deploy.yml s GitHub Actions workflow, 
který při push do větve 'main':
1. Zkopíruje soubory index.html, data.js, app.jsx, tweaks-panel.jsx do gh-pages větve
2. Nasadí je na GitHub Pages

Web je čistě statický (žádný build krok není potřeba).
```

---

### 🔍 Debugovat přehrávač (audio nehraje)

```
V app.jsx najdi komponentu AudioPlayer. Problém je pravděpodobně v:
1. audioUrl je null v TRACKS_DATA — zkontroluj data.js
2. CORS blokuje přímé URL ze Suno — přidej error handling do audio.play().catch()
3. Autoplay policy prohlížeče — přidej user gesture requirement

Přidej do AudioPlayer console.log pro diagnostiku:
- Při změně track logguj track.audioUrl
- Při play() logguj výsledek nebo chybu
- Zobraz uživateli indikátor 'žádné audio URL' pokud audioUrl === null
```

---

### 📱 Opravit zobrazení na mobilu

```
Otevři index.html v Chrome DevTools na rozlišení 375×812px (iPhone).
Zkontroluj a oprav:
1. Nav — skryj desktop linky (třída .nav-desktop), zobraz pouze logo a CZ/EN přepínač
2. Hero — zmenš font na clamp(60px, 14vw, 100px), zmenš gap mezi stats
3. AppsSection grid — min 160px na kartu (místo 230px)
4. AudioPlayer — na mobilu skryj volume slider, zmenši padding na 8px 16px
5. AlbumCard grid — 2 sloupce na mobilu

Používej media queries v inline styles nebo přidej do <style> v index.html.
```

---

### ✉️ Přidat kontaktní formulář

```
V app.jsx v komponentě ContactSection přidej jednoduchý formulář pod email tlačítko:
- Pole: Jméno (text), Email (email), Zpráva (textarea, min 4 řádky)
- Styl: stejný jako ostatní karty (var(--card) background, var(--border) border, var(--r) radius)
- Submit: odešle na Formspree endpoint (použij akci https://formspree.io/f/[ID])
- Success state: zobraz potvrzovací zprávu místo formuláře
- Přidej překlady do window.STRINGS pro cs i en (klíče: form_name, form_email, form_message, form_send, form_success)
```

---

## ► TIPY PRO PRÁCI V ANTIGRAVITY

1. **Používej Planning Mode** — agent ti ukáže plán před každou akcí
2. **Změny dat** (URL, popis, texty) → vždy jen v `data.js`
3. **Změny vzhledu** → `app.jsx` nebo CSS proměnné v `index.html`
4. **Po každé změně** → nech agenta otevřít `localhost:8000` a ověřit vizuálně
5. **Záloha před větší změnou**: `cp app.jsx app.backup.jsx`
6. **Velké refaktory** (React → Next.js, přidání backendu) → začni novým projektem a importuj `data.js`
