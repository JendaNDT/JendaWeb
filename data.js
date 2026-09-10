// data.js — Jenda website placeholder data
// TODO: Replace all link / audioUrl / downloadUrl values with real URLs

window.APPS_DATA = [
  {"id":32,"name":"Rocker","platform":"PWA","color":"#b88a44","cs":"Kytarový asistent pro rock a metal: ladička, metronom, lekce, riffy, tabulatury a nahrávání. Cvič na počítači i telefonu přímo v prohlížeči, bez registrace.\n\nZákladní nástroje fungují bez API klíče. Volitelný AI tutor vyžaduje vlastní Gemini API klíč. Pro ladičku a nahrávání povol mikrofon nebo připoj zvukovou kartu.\n\nAplikace je v češtině a lze ji přidat na plochu jako PWA. Zvuk a odezva aparátu a looperu se mohou lišit podle zařízení; tyto pokročilé funkce se dál ověřují.","en":"A guitar companion for rock and metal: tuner, metronome, lessons, riffs, tablature and recording. Practice on your computer or phone directly in the browser, without an account.\n\nThe core tools work without an API key. The optional AI tutor requires your own Gemini API key. Allow microphone access or connect an audio interface for tuning and recording.\n\nThe app interface is in Czech and can be installed as a PWA. Amplifier and looper sound and latency may vary by device; these advanced features are still being tested.","link":"https://rocker-rust.vercel.app/","icon_url":"https://rocker-rust.vercel.app/icons/icon-192.png","sort":0,"screenshots":["/screenshots/rocker/metronome-desktop-v1.jpg"]},
  {"cs":"Retro bombová arkáda s příběhem, místní kooperací a souboji v aréně. Pokládej bomby, sbírej bonusy a hraj s přáteli v místní síti (LAN). Zdarma, česky i anglicky.\n\nVerze 2.2.1 · Windows 10/11 x64 a Mac s Apple Silicon (M1 a novější). Pro Windows je k dispozici instalátor i portable EXE, pro Mac DMG i ZIP.\n\nOprava ve verzi 2.2.1: nepřátelský plamen nebo ohnivá salva Hnízda, která naváže na hráčův výbuch u čerstvě odkrytého portálu, už neprodlouží hráčův zásah a nesprávně nepřivolá další potvory. Skutečný nový zásah hráčovou bombou dál funguje podle pravidel.\n\nVe hře zůstávají: týmový souboj 2 proti 2 se společným skóre, desetisekundové hlasování hráčů o prostředí další mapy a přehled, kolik ještě chybí do splnění úspěchu. Najdeš ho v nabídce Statistiky a úspěchy. Zůstává LAN, vyhledávání místností, vlastní turnajová pravidla i všechny dosavadní opravy.\n\nPro společnou hru připoj počítače do stejné místní sítě a na všech používej verzi 2.2.1. Příběh a místní hra fungují offline. Pohyb šipkami nebo WASD, bomba mezerníkem, pauza Esc, celá obrazovka F11.\n\nWindows: spusť instalátor, nebo stáhni a spusť portable EXE. Mac: otevři DMG a přetáhni BomberMan do Aplikací; ZIP obsahuje stejnou aplikaci. Mac balíčky jsou pro Apple Silicon.\n\nWindows vydání není digitálně podepsané a Mac není notarizovaný; systém může při spuštění zobrazit upozornění nebo aplikaci zablokovat. Běh na Windows a společná hra Windows–Mac na dvou fyzických počítačích zatím čekají na ověření.","en":"A retro bomb arcade game with a story, local co-op and arena battles. Place bombs, collect power-ups and play with friends on a local network (LAN). Free, in Czech and English.\n\nVersion 2.2.1 · Windows 10/11 x64 and Apple Silicon Mac (M1 or newer). Windows installer and portable EXE; Mac DMG and ZIP.\n\nFixed in 2.2.1: enemy fire or a Nest fire volley that continues a player blast at a newly revealed portal no longer extends the player hit or wrongly summons extra enemies. A genuine new hit from a player bomb still works according to the rules.\n\nAlso included: 2v2 team battles with shared scoring, a ten-second player vote for the next arena theme, and achievement progress with the remaining goal. Open Statistics and Achievements to see your progress. LAN multiplayer, room discovery, custom tournament rules and all previous fixes are included.\n\nFor multiplayer, connect the computers to the same local network and use version 2.2.1 on all of them. Story and local play work offline. Move with arrows or WASD, place bombs with Space, pause with Esc and enter fullscreen with F11.\n\nWindows: run the installer, or download and run the portable EXE. Mac: open the DMG and drag BomberMan into Applications; the ZIP contains the same app. Mac packages require Apple Silicon.\n\nThe Windows release is unsigned and the Mac app is not notarized; the system may warn or block it at launch. Native Windows operation and Windows–Mac play on two physical computers still await verification.","id":31,"link":"/binaries/bomberman-2.2.1/BomberMan-Setup-2.2.1.exe","name":"BomberMan","sort":-2,"color":"#ffb52e","icon_url":"/icons/bomberman-2.0.5.png","platform":"Windows / macOS","screenshots":["/screenshots/bomberman-2.2.0/team-battle.png","/screenshots/bomberman-2.2.0/map-vote.png","/screenshots/bomberman-2.2.0/achievement-progress-cs.png"],"downloads":[{"url":"/binaries/bomberman-2.2.1/BomberMan-Setup-2.2.1.exe","primary":true,"label_cs":"Pro Windows","label_en":"For Windows","note_cs":"Instalátor · 105,2 MB","note_en":"Installer · 105.2 MB","version":"2.2.1"},{"url":"/binaries/bomberman-2.2.1/BomberMan-2.2.1-mac-arm64.dmg","primary":true,"label_cs":"Pro Mac","label_en":"For Mac","note_cs":"Apple Silicon · 111,4 MB","note_en":"Apple Silicon · 111.4 MB","version":"2.2.1"},{"url":"/binaries/bomberman-2.2.1/BomberMan-2.2.1-portable.exe","primary":false,"label_cs":"Windows portable · 104,8 MB","label_en":"Windows portable · 104.8 MB","version":"2.2.1"},{"url":"/binaries/bomberman-2.2.1/BomberMan-2.2.1-mac-arm64.zip","primary":false,"label_cs":"Mac ZIP · 122,6 MB","label_en":"Mac ZIP · 122.6 MB","version":"2.2.1"}]},
  {"id":30,"name":"GeoReminder","platform":"Android","color":"#1778e8","cs":"Připomínky podle místa a času, odložení upozornění a hlasové přečtení. Oblíbená místa, mapa a přehled oprávnění na jednom místě. Česky i anglicky.\n\nVerze 2.7 · APK 4,5 MB · Android 8.0 a novější. Nejnovější stabilizační vydání se všemi dosavadními opravami.\n\nMapy v tomto vydání ještě vyžadují ověření na telefonu. Pokud Android odmítne aktualizaci starší verze, může být potřeba přeinstalace; před ní exportuj důležitá data.","en":"Reminders based on place and time, notification snoozing and spoken reminders. Favorite places, a map and permission diagnostics in one app. Available in Czech and English.\n\nVersion 2.7 · 4.5 MB APK · Android 8.0 or newer. The latest stabilization release with all fixes to date.\n\nMaps in this release still need verification on a phone. If Android rejects an update over an older version, reinstallation may be necessary; export important data first.","link":"/binaries/georeminder-2.7-ci196-777d743/GeoReminder-2.7-ci196.apk","icon_url":"/icons/georeminder-ci196.png","screenshots":[],"sort":-1},
  {"id": 28, "name": "RT Asistent", "platform": "PWA", "color": "#255bce", "cs": "Radiografické výpočty: počet expozic, geometrická neostrost, expoziční časy a CR měření. Zakázky a zálohy zůstávají v zařízení. Po prvním stažení funguje offline, bez účtu a synchronizace.", "en": "Radiography calculations: exposure count, geometric unsharpness, exposure times and CR measurements. Jobs and backups stay on your device. Works offline after the initial download, without an account or synchronization.", "link": "/rt-asistent/", "icon_url": "/rt-asistent/icons/rt-192.png", "sort": 0},
  { id:1,  name:'MeditApp',    platform:'PWA',     color:'#7c5cfc', cs:'Průvodce meditací s řízeným dýcháním a ambientními zvuky', en:'Meditation guide with breathing exercises and ambient sounds', link:'#' },
  { id:2,  name:'BeatCraft',   platform:'Android', color:'#f59e0b', cs:'AI generátor beatů – skládej rytmy jedním kliknutím', en:'AI beat generator – compose rhythms with one tap', link:'#' },
  { id:3,  name:'NoteFlow',    platform:'PWA',     color:'#06d6a0', cs:'Chytrý poznámkový blok s tagy a fulltextovým hledáním', en:'Smart notepad with tags and full-text search', link:'#' },
  { id:4,  name:'TrailGPS',    platform:'Android', color:'#3b82f6', cs:'Offline GPS navigace pro turisty bez mobilního signálu', en:'Offline GPS for hikers without cell signal', link:'#' },
  { id:5,  name:'ChordLens',   platform:'PWA',     color:'#ec4899', cs:'Rozpoznávání kytarových akordů pomocí mikrofonu', en:'Guitar chord recognition via microphone', link:'#' },
  { id:6,  name:'DreamLog',    platform:'Android', color:'#8b5cf6', cs:'Deník snů s hlasovými záznamy a analýzou vzorů', en:'Dream journal with voice recording and pattern analysis', link:'#' },
  { id:7,  name:'PolyGlot',    platform:'PWA',     color:'#f97316', cs:'Flashkarty pro jazyky s metodou opakovaného učení', en:'Language flashcards using spaced repetition', link:'#' },
  { id:8,  name:'SoundSleep',  platform:'Android', color:'#06b6d4', cs:'Generátor relaxačních zvuků pro lepší spánek', en:'Relaxing sounds generator for better sleep', link:'#' },
  { id:9,  name:'MoodTrack',   platform:'PWA',     color:'#84cc16', cs:'Sledovač nálady a emocí s grafy a vizualizacemi', en:'Mood and emotion tracker with charts and visualizations', link:'#' },
  { id:10, name:'PixelCam',    platform:'Android', color:'#f43f5e', cs:'Retro filmový filtr s lo-fi estetikou pro fotoaparát', en:'Retro film filter with lo-fi aesthetics for camera', link:'#' },
  { id:11, name:'BudgetZen',   platform:'PWA',     color:'#14b8a6', cs:'Minimalistický správce financí bez zbytečností', en:'Minimalist finance manager without clutter', link:'#' },
  { id:12, name:'TaskFlow',    platform:'PWA',     color:'#6366f1', cs:'Kanban tabule pro osobní projekty a každodenní úkoly', en:'Kanban board for personal projects and daily tasks', link:'#' },
  { id:13, name:'SkyWatch',    platform:'Android', color:'#0ea5e9', cs:'Minimální počasí – jen co opravdu potřebuješ vědět', en:'Minimal weather – only what you actually need to know', link:'#' },
  { id:14, name:'VocaLoop',    platform:'PWA',     color:'#d946ef', cs:'Rozšiřuj slovník poslechem v přirozeném kontextu', en:'Expand vocabulary by listening in natural context', link:'#' },
  { id:15, name:'HeartBeat',   platform:'Android', color:'#ef4444', cs:'Detektor BPM pro hudebníky, sportovce a tanečníky', en:'BPM detector for musicians, athletes, and dancers', link:'#' },
  { id:16, name:'SpaceTyper',  platform:'PWA',     color:'#a3e635', cs:'Sci-fi psací trenér pro rychlost a přesnost', en:'Sci-fi typing trainer for speed and accuracy', link:'#' },
  { id:17, name:'ColorMood',   platform:'PWA',     color:'#fb923c', cs:'Generátor barevných palet podle nálady a emocí', en:'Color palette generator based on mood and emotion', link:'#' },
  { id:18, name:'StepSaga',    platform:'Android', color:'#22c55e', cs:'Krokoměr s RPG příběhem – každý krok posouvá děj', en:'Pedometer with RPG story – every step advances the plot', link:'#' },
  { id:19, name:'FocusWave',   platform:'PWA',     color:'#a78bfa', cs:'Pomodoro časovač s adaptivní ambientní hudbou', en:'Pomodoro timer with adaptive ambient music', link:'#' },
  { id:20, name:'LangBridge',  platform:'Android', color:'#38bdf8', cs:'Překladač s hlasovým vstupem optimalizovaný pro cestování', en:'Voice translator optimized for travel', link:'#' },
  { id:21, name:'KeepMind',    platform:'Android', color:'#a915f9', cs:'Připomínky vázané na lidi a místa. Upozorní vás, když dorazíte do cíle.', en:'Location-based reminders tied to your contacts. Never miss a task on the go.', link:'https://semdgbaearwhkhulkyts.supabase.co/storage/v1/object/public/binaries/apps/1781897532900_app-release.apk', icon_url:'https://semdgbaearwhkhulkyts.supabase.co/storage/v1/object/public/images/apps/1781887221914_ic_launcher_abyss.png', screenshots:['https://semdgbaearwhkhulkyts.supabase.co/storage/v1/object/public/images/apps/1781897534427_Screenshot_1781896990.png','https://semdgbaearwhkhulkyts.supabase.co/storage/v1/object/public/images/apps/1781897534836_Screenshot_1781896983.png'] },
  { id:22, name:'Vandrák',     platform:'Android', color:'#E83A4A', cs:'Plánování a vedení outdoorových vandrů po ČR s offline mapami a AI asistentem.', en:'Outdoor hike planning and tracking across the Czech Republic with offline maps and AI assistant.', link:'/binaries/vandrak-v2.apk', icon_url:'/icons/vandrak.png' },
  { id:26, name:'Ballista',    platform:'Android', color:'#E8A33D', cs:'Balistický kalkulátor pro přesnou střelbu na dlouhé vzdálenosti — G1/G7, vítr, Coriolis, chronograf a PRS karty. Offline.', en:'Ballistic calculator for precision long-range shooting — G1/G7, wind, Coriolis, chronograph and PRS cards. Offline.', link:'/binaries/ballista.apk', icon_url:'/icons/ballista.png' },
  { id:27, name:'EngiTab',     platform:'Android', color:'#2ED3B7', cs:'Offline strojnické tabulky a dílenské kalkulačky v jednom — lícování ISO, závity, materiály, řezné podmínky, tolerance a přes 30 dalších nástrojů. Oblíbené, hledání, OCR výkresů i export do PDF. Plně offline, dvojjazyčně CZ/EN.', en:'Offline engineering tables and workshop calculators in one — ISO fits, threads, materials, cutting data, tolerances and 30+ more tools. Favorites, search, drawing OCR and PDF export. Fully offline, bilingual CZ/EN.', link:'["/binaries/engitab-51f260bc/engitab.apk.part0","/binaries/engitab-51f260bc/engitab.apk.part1","/binaries/engitab-51f260bc/engitab.apk.part2","/binaries/engitab-51f260bc/engitab.apk.part3","/binaries/engitab-51f260bc/engitab.apk.part4","/binaries/engitab-51f260bc/engitab.apk.part5"]', icon_url:'/icons/engitab.png' },
  {"id":29,"name":"Fyzika pastelkou","platform":"Android","color":"#527dc4","cs":"Kresli a objevuj fyziku v 65 misích: mechanika, elektrické obvody, voda a olej. Nově také smajlík, jablíčko a koš. Vlastní pokusy, editor úloh, galerie a ukládání. Aplikace je česky, funguje offline, bez účtu a reklam.\n\nVerze 0.1.1-android.3 · APK 11,2 MB · Android 9+, ARM64 a Vulkan. Editor nově nabízí vlastní obrysy a kotvy, materiály, raketový pohon a založení kapitoly. V povolených úlohách a vlastních pokusech lze kreslit lano. Další atlasové mise se připravují.\n\nAPK nainstaluj přes stávající verzi bez odinstalování; tvoje data zůstanou zachována. Při první instalaci otevři APK ve správci souborů a na výzvu povol instalaci. Panel lze přesunout přes Nabídka → Umístění panelu.","en":"Draw and explore physics in 65 missions: mechanics, electrical circuits, water and oil, now including a smiley, apple and basket. Create your own experiments with a mission editor, gallery and saved progress. The app is in Czech and works offline, without accounts or ads.\n\nVersion 0.1.1-android.3 · 11.2 MB APK · Android 9+, ARM64 and Vulkan. The editor now supports custom outlines and anchors, materials, rocket propulsion and creating chapters. Draw ropes in enabled missions and your own experiments. More Atlas missions are in preparation.\n\nInstall the APK over the existing version without uninstalling to keep your data. For a first installation, open the APK in your file manager and allow installation when prompted. Move the toolbar via Nabídka → Umístění panelu.","link":"/binaries/fyzika-pastelkou-0.1.1-android.3/Fyzika-pastelkou-0.1.1-android.3.apk","icon_url":"/icons/fyzika-pastelkou.png","screenshots":["/screenshots/fyzika-pastelkou/android-panel-bottom.png","/screenshots/fyzika-pastelkou/android-panel-top.png","/screenshots/fyzika-pastelkou/android-water.png","/screenshots/fyzika-pastelkou/android-chapter.png"],"sort":21,"release_stage":"alpha"},
];

window.ALBUMS = [
  { id:'sahara', title:'Sahara Circuit',  genre:'Ethnic Electronic', tracks:8,  year:2024, g1:'#f59e0b', g2:'#b45309', cs:'Setkání severoafrických rytmů s modulárním syntetizátorem', en:'North African rhythms meet modular synthesis' },
  { id:'balkan', title:'Balkan Bass',     genre:'Balkan Fusion',     tracks:7,  year:2024, g1:'#ef4444', g2:'#7c3aed', cs:'Živé mosazné nástroje, elektronické basy a balkánský oheň', en:'Live brass, electronic bass, and Balkan fire' },
  { id:'mantra', title:'Mantra Machine',  genre:'Indian Techno',     tracks:6,  year:2025, g1:'#ec4899', g2:'#f97316', cs:'Sitar, tabla a těžké techno beaty v jednom', en:'Sitar, tabla, and heavy techno beats as one' },
  { id:'nordic', title:'Northern Lights', genre:'Nordic Ambient',    tracks:9,  year:2025, g1:'#06d6a0', g2:'#3b82f6', cs:'Severská lidová hudba transformovaná do digitálního světa', en:'Nordic folk music transformed into the digital realm' },
  { id:'celtic', title:'Celtic Code',     genre:'Celtic Electronic', tracks:6,  year:2026, g1:'#22c55e', g2:'#0891b2', cs:'Keltské melodie v moderním elektronickém hávu', en:'Celtic melodies in a modern electronic garb' },
];

window.TRACKS_DATA = [
  { id:1,  title:'Desert Protocol',  album:'sahara', duration:'4:12', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:2,  title:'Dune Synthesizer', album:'sahara', duration:'5:03', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:3,  title:'Kočovník',         album:'balkan', duration:'3:47', audioUrl:null, downloadUrl:null,
    lyrics:{
      cs:`Hojím srdce na pražné zemi
kočujeme tisíc dní,
město spí za zdmi a my
známe jen kde začíná svít.

Hora! Hora! Bije bubínek,
v plném měsíci hrajeme.
Hora! Hora! Země se otevře,
v ně sebe v družbě najdeme.`,
      en:`Healing my heart on burned earth
we wander a thousand days,
the city sleeps behind walls and we
only know where dawn starts.

Hora! Hora! The drum beats,
in the full moon we play.
Hora! Hora! The earth opens up,
and in it we find ourselves.`
    }
  },
  { id:4,  title:'Brass & Bass',     album:'balkan', duration:'4:28', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:5,  title:'Om Circuit',       album:'mantra', duration:'6:01', audioUrl:null, downloadUrl:null,
    lyrics:{
      cs:`Om mani padme hum
Om mani padme hum
v okruhu zvuku se vracíme domů,
elektrony tančí v mlze míru.

Om namah shivaya
Om namah shivaya
když mlčím, mluví se ke mně
v pulsůch sirky a tónu.`,
      en:`Om mani padme hum
Om mani padme hum
in the circuit of sound we return home,
electrons dance in the mist of peace.

Om namah shivaya
Om namah shivaya
when I'm silent, it speaks to me
in pulses of strike and tone.`
    }
  },
  { id:6,  title:'Ganges Flow',      album:'mantra', duration:'5:15', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:7,  title:'Fjord Pulse',      album:'nordic', duration:'4:44', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:8,  title:'Aurora Data',      album:'nordic', duration:'7:20', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:9,  title:'Silk Road 404',    album:'sahara', duration:'4:55', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:10, title:'Tambura Loop',     album:'mantra', duration:'5:38', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:11, title:'Hora Bassline',    album:'balkan', duration:'3:59', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:12, title:'Midnight Runes',   album:'nordic', duration:'6:10', audioUrl:null, downloadUrl:null,
    lyrics:{
      cs:`Pod Čumavou se otevírá
brána, která nemá zámek.
Runy tepou jako tóny—
starší než píseň, ještě řeč.`,
      en:`Beneath the dark sky opens
a gate that has no lock.
Runes pulse like tones—
older than song, before speech.`
    }
  },
  { id:13, title:'Stonehenge Beat',  album:'celtic', duration:'4:22', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:14, title:'Emerald Code',     album:'celtic', duration:'3:48', audioUrl:null, downloadUrl:null, lyrics:null },
  { id:15, title:'Oasis Protocol',   album:'sahara', duration:'5:12', audioUrl:null, downloadUrl:null, lyrics:null },
];

window.SOCIALS = [
  { id:'github',     label:'GitHub',     url:'#' },
  { id:'youtube',    label:'YouTube',    url:'#' },
  { id:'soundcloud', label:'SoundCloud', url:'#' },
  { id:'instagram',  label:'Instagram',  url:'#' },
  { id:'bandcamp',   label:'Bandcamp',   url:'#' },
];

// Case studies — keyed by app id; render link on AppCard when present
window.CASE_STUDIES = {
  1:  'case-studies/meditapp.html',  // MeditApp
  2:  'case-studies/beatcraft.html', // BeatCraft
  5:  'case-studies/chordlens.html', // ChordLens
};

// Newsletter endpoint. Sign up at https://buttondown.com and replace with your form id.
// If missing, signup is shown as unavailable; acceptance is confirmed by Buttondown.
window.NEWSLETTER_ENDPOINT = 'https://buttondown.com/api/emails/embed-subscribe/svatos';

// Ko-fi / Buy Me a Coffee username. Set to display a tip widget in Contact section.
window.KOFI_USERNAME = null; // e.g. 'jenda'

// giscus comments config (per case study). Configure repo + category id at https://giscus.app
window.GISCUS_CONFIG = {
  // repo: 'username/repo',
  // repoId: 'R_xxxx',
  // category: 'Comments',
  // categoryId: 'DIC_xxxx',
};

// Build log — monthly highlights for the public stats section
window.BUILD_LOG = [
  { date:'2026-06', cs:'Vydal jsem Celtic Code (album, 6 skladeb)',     en:'Released Celtic Code (album, 6 tracks)' },
  { date:'2026-05', cs:'Vývoj redesignu jenda.dev a nových case study', en:'Redesign of jenda.dev and new case studies' },
  { date:'2026-04', cs:'Spuštění BetaBudgetZen + 280 commitů',         en:'Launched BetaBudgetZen + 280 commits' },
  { date:'2026-03', cs:'Experiment: hudební AI vizualizace v real-time',  en:'Experiment: real-time music AI visualization' },
  { date:'2026-02', cs:'PolyGlot 2.0 — spaced repetition na 4 jazyky',   en:'PolyGlot 2.0 — spaced repetition for 4 languages' },
  { date:'2026-01', cs:'Nový rok, nový setup — 18 commitů denně',       en:'New year, new setup — 18 commits per day' },
];

// Public stats — displayed in PublicStats section
window.PUBLIC_STATS = {
  commits_month:   187,
  apps_built:      20,
  tracks_released: 211,
  shipped_this_year: 8,
};

// Comparison data — ChordLens vs BeatCraft vs MeditApp
window.COMPARISON = {
  apps: [1, 2, 5], // MeditApp, BeatCraft, ChordLens (by data.js id)
  rows: [
    { key:'platform',  cs:'Platforma',          en:'Platform' },
    { key:'price',     cs:'Cena',               en:'Price' },
    { key:'offline',   cs:'Offline režim',      en:'Offline mode' },
    { key:'account',   cs:'Vyžaduje účet',      en:'Requires account' },
    { key:'open_src',  cs:'Open source',        en:'Open source' },
    { key:'best_for',  cs:'Nejlépe pro…',       en:'Best for…' },
  ],
  data: {
    1: { platform:'PWA', price:'Free', offline:true, account:false, open_src:true, best_for:{cs:'Klid mysli', en:'Calm of mind'} },
    2: { platform:'Android', price:'Free', offline:true, account:false, open_src:false, best_for:{cs:'Výrobu beatů', en:'Beat-making'} },
    5: { platform:'PWA', price:'Free', offline:true, account:false, open_src:true, best_for:{cs:'Výuku kytary', en:'Guitar practice'} },
  },
};

// Contact form endpoint. Sign up at https://formspree.io and replace with your form id,
// e.g. 'https://formspree.io/f/xxxxxxxx'. If left null, the form falls back to mailto:.
window.CONTACT_ENDPOINT = null;
window.CONTACT_EMAIL = 'jenda@example.com';

window.STRINGS = {
  cs: {
    nav_apps:'Aplikace', nav_music:'Hudba', nav_contact:'Kontakt',
    hero_tag:'Vibe coder & AI hudebník',
    hero_desc:'Tvořím experimentální elektronickou hudbu pomocí AI — a k tomu vlastní appky.',
    cta_apps:'Prozkoumat aplikace', cta_music:'Poslechnout hudbu',
    stat_apps:'aplikací', stat_tracks:'skladeb', stat_albums:'alb',
    apps_title:'Aplikace', apps_all:'Vše',
    apps_open:'Otevřít', apps_dl:'Stáhnout',
    apps_search:'Hledat aplikaci…',
    apps_empty:'Žádná aplikace neodpovídá hledání.',
    apps_sub_pwa:'PWA aplikace', apps_sub_android:'Android',
    apps_live_title:'Spustitelné aplikace & PWA', apps_studies_title:'Případové studie & Koncepty',
    apps_read_study:'Číst studii',
    music_title:'Hudba', music_albums:'Alba', music_tracks:'Skladby',
    music_sub:'fúze etnické a elektronické hudby',
    music_dl:'Stáhnout', music_play:'Přehrát',
    music_play_album:'Přehrát album',
    music_filter_all:'Všechna alba',
    music_note:'',
    tracks_label:'skladeb',
    shortcuts_title:'Klávesové zkratky',
    shortcuts_play:'Přehrát / Pauza',
    shortcuts_next:'Další skladba',
    shortcuts_prev:'Předchozí skladba',
    shortcuts_seek:'Posun o 5 sekund',
    shortcuts_mute:'Ztlumit',
    shortcuts_close:'Zavřít přehrávač',
    shortcuts_help:'Otevřít zkratky',
    shortcuts_search:'Vyhledat…',
    shortcuts_lang:'Přepnout jazyk',
    shortcuts_expand:'Celá obrazovka',
    shortcuts_queue:'Fronta',
    shortcuts_viz:'Přepnout vizualizér',
    shortcuts_analyzer:'Audio analyzér',
    shortcuts_loop_a:'Loop start',
    shortcuts_loop_b:'Loop konec',
    shortcuts_loop_clear:'Zrušit loop',
    shortcuts_hint:'Stiskni',
    shortcuts_hint2:'kdykoliv pro zobrazení zkratek',
    contact_title:'Napiš mi',
    contact_desc:'Máš zájem o spolupráci, projekt nebo jen chceš říct ahoj?',
    contact_email:'Napsat email',
    contact_follow:'Sleduj mě',
    contact_name:'Jméno',
    contact_email_lbl:'E-mail',
    contact_msg:'Zpráva',
    contact_send:'Odeslat zprávu',
    contact_sending:'Odesílám…',
    contact_ok:'Hotovo! Ozvu se brzy.',
    contact_err:'Něco se pokazilo. Zkus to znovu nebo mě kontaktuj přes e-mail.',
    contact_or:'— nebo —',
    err_name:'Zadej své jméno',
    err_email:'Zadej platný e-mail',
    err_msg:'Napiš mi alespoň krátkou zprávu',
    mode_auto:'Auto', mode_light:'Světlý', mode_dark:'Tmavý',
    cs_label:'Případová studie',
    cs_back:'Zpět na hlavní stranu',
    cs_problem:'Problém',
    cs_approach:'Řešení',
    cs_result:'Výsledek',
    cs_stack:'Stack',
    newsletter_title:'Nové aplikace & hudba',
    newsletter_desc:'Jednou za měsíc — žádný spam, jen nové vydané projekty.',
    newsletter_email:'tvůj@email.com',
    newsletter_sub:'Přihlásit',
    newsletter_ok:'Díky! Brzy se ozvu.',
    stats_title:'Deník buildu',
    stats_albums:'vydaných alb',
    stats_apps:'aplikací v provozu',
    stats_tracks:'skladeb celkem',
    stats_studies:'případových studií',
    stats_recent:'Poslední měsíce',
    compare_title:'Kterou si vybrat?',
    compare_desc:'Srovnej moje 3 nejoblíbenější aplikace',
    compare_yes:'Ano',
    compare_no:'Ne',
    donate_label:'Poděkuj kafem',
    donate_desc:'Pokud tě můj vývoj baví, můžeš mě podpořit na Ko-fi.',
    footer:'Vytvořeno s vibecoding & Suno AI',
  },
  en: {
    nav_apps:'Apps', nav_music:'Music', nav_contact:'Contact',
    hero_tag:'Vibe coder & AI musician',
    hero_desc:'I make experimental electronic music with AI — and build my own apps too.',
    cta_apps:'Explore Apps', cta_music:'Listen to Music',
    stat_apps:'apps', stat_tracks:'tracks', stat_albums:'albums',
    apps_title:'Apps', apps_all:'All',
    apps_open:'Open', apps_dl:'Download',
    apps_search:'Search apps…',
    apps_empty:'No apps match your search.',
    apps_sub_pwa:'PWA app', apps_sub_android:'Android',
    apps_live_title:'Runnable Apps & PWAs', apps_studies_title:'Case Studies & Concepts',
    apps_read_study:'Read study',
    music_title:'Music', music_albums:'Albums', music_tracks:'Tracks',
    music_sub:'fusion of ethnic & electronic music',
    music_dl:'Download', music_play:'Play',
    music_play_album:'Play album',
    music_filter_all:'All albums',
    music_note:'',
    tracks_label:'tracks',
    shortcuts_title:'Keyboard shortcuts',
    shortcuts_play:'Play / Pause',
    shortcuts_next:'Next track',
    shortcuts_prev:'Previous track',
    shortcuts_seek:'Seek 5 seconds',
    shortcuts_mute:'Mute',
    shortcuts_close:'Close player',
    shortcuts_help:'Open shortcuts',
    shortcuts_search:'Search…',
    shortcuts_lang:'Toggle language',
    shortcuts_expand:'Full screen',
    shortcuts_queue:'Queue',
    shortcuts_viz:'Toggle visualizer',
    shortcuts_analyzer:'Audio analyzer',
    shortcuts_loop_a:'Loop start',
    shortcuts_loop_b:'Loop end',
    shortcuts_loop_clear:'Clear loop',
    shortcuts_hint:'Press',
    shortcuts_hint2:'anytime to show shortcuts',
    contact_title:'Write to me',
    contact_desc:'Interested in collaboration, a project, or just want to say hi?',
    contact_email:'Send Email',
    contact_follow:'Follow me',
    contact_name:'Name',
    contact_email_lbl:'Email',
    contact_msg:'Message',
    contact_send:'Send message',
    contact_sending:'Sending…',
    contact_ok:"Thanks! I'll be in touch soon.",
    contact_err:'Something went wrong. Try again or reach out via email.',
    contact_or:'— or —',
    err_name:'Please enter your name',
    err_email:'Please enter a valid email',
    err_msg:'Please write a short message',
    mode_auto:'Auto', mode_light:'Light', mode_dark:'Dark',
    cs_label:'Case study',
    cs_back:'Back to home',
    cs_problem:'Problem',
    cs_approach:'Approach',
    cs_result:'Result',
    cs_stack:'Stack',
    newsletter_title:'New apps & music',
    newsletter_desc:'Once a month — no spam, just new releases.',
    newsletter_email:'your@email.com',
    newsletter_sub:'Subscribe',
    newsletter_ok:"Thanks! I'll be in touch.",
    stats_title:'Build log',
    stats_albums:'albums released',
    stats_apps:'apps running',
    stats_tracks:'tracks total',
    stats_studies:'case studies',
    stats_recent:'Recent months',
    compare_title:'Which one to pick?',
    compare_desc:'Compare my 3 most popular apps',
    compare_yes:'Yes',
    compare_no:'No',
    donate_label:'Buy me a coffee',
    donate_desc:'If you enjoy my work, you can support me on Ko-fi.',
    footer:'Made with vibecoding & Suno AI',
  }
};

// Personal introduction; site_config.strings may override these alongside other copy.
Object.assign(window.STRINGS.cs, {
  about_title: 'O mně',
  about_text: 'Jsem Jenda a rád tvořím s AI. Vyvíjím aplikace pro počítače, telefony i web a experimentuji s vlastní hudbou. Tady sdílím, co z toho vzniká.'
});
Object.assign(window.STRINGS.en, {
  about_title: 'About me',
  about_text: 'I’m Jenda, and I enjoy creating with AI. I build apps for computers, phones and the web, and experiment with my own music. This is where I share what I make.'
});
