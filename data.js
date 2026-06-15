// data.js — Jenda website placeholder data
// TODO: Replace all link / audioUrl / downloadUrl values with real URLs

window.APPS_DATA = [
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
// If left null, the form gracefully degrades to a static "thanks" message.
window.NEWSLETTER_ENDPOINT = null; // e.g. 'https://buttondown.com/api/emails/embed-subscribe/jenda'

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
    music_title:'Hudba', music_albums:'Alba', music_tracks:'Skladby',
    music_sub:'fúze etnické a elektronické hudby',
    music_dl:'Stáhnout', music_play:'Přehrát',
    music_play_album:'Přehrát album',
    music_filter_all:'Všechna alba',
    music_note:'Audio URL bude doplněno — nahraď audioUrl v data.js za odkaz ze Suno.',
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
    contact_title:'Pojďme si říct',
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
    stats_commits:'commitů tento měsíc',
    stats_apps:'aplikací v provozu',
    stats_tracks:'skladeb vydaných',
    stats_shipped:'projektů tento rok',
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
    music_title:'Music', music_albums:'Albums', music_tracks:'Tracks',
    music_sub:'fusion of ethnic & electronic music',
    music_dl:'Download', music_play:'Play',
    music_play_album:'Play album',
    music_filter_all:'All albums',
    music_note:'Audio URL to be added — replace audioUrl in data.js with your Suno link.',
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
    contact_title:"Let's talk",
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
    stats_commits:'commits this month',
    stats_apps:'apps shipped',
    stats_tracks:'tracks released',
    stats_shipped:'projects this year',
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
