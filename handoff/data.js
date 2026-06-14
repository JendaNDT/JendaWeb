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
  { id:1,  title:'Desert Protocol',  album:'sahara', duration:'4:12', audioUrl:null, downloadUrl:null },
  { id:2,  title:'Dune Synthesizer', album:'sahara', duration:'5:03', audioUrl:null, downloadUrl:null },
  { id:3,  title:'Kočovník',         album:'balkan', duration:'3:47', audioUrl:null, downloadUrl:null },
  { id:4,  title:'Brass & Bass',     album:'balkan', duration:'4:28', audioUrl:null, downloadUrl:null },
  { id:5,  title:'Om Circuit',       album:'mantra', duration:'6:01', audioUrl:null, downloadUrl:null },
  { id:6,  title:'Ganges Flow',      album:'mantra', duration:'5:15', audioUrl:null, downloadUrl:null },
  { id:7,  title:'Fjord Pulse',      album:'nordic', duration:'4:44', audioUrl:null, downloadUrl:null },
  { id:8,  title:'Aurora Data',      album:'nordic', duration:'7:20', audioUrl:null, downloadUrl:null },
  { id:9,  title:'Silk Road 404',    album:'sahara', duration:'4:55', audioUrl:null, downloadUrl:null },
  { id:10, title:'Tambura Loop',     album:'mantra', duration:'5:38', audioUrl:null, downloadUrl:null },
  { id:11, title:'Hora Bassline',    album:'balkan', duration:'3:59', audioUrl:null, downloadUrl:null },
  { id:12, title:'Midnight Runes',   album:'nordic', duration:'6:10', audioUrl:null, downloadUrl:null },
  { id:13, title:'Stonehenge Beat',  album:'celtic', duration:'4:22', audioUrl:null, downloadUrl:null },
  { id:14, title:'Emerald Code',     album:'celtic', duration:'3:48', audioUrl:null, downloadUrl:null },
  { id:15, title:'Oasis Protocol',   album:'sahara', duration:'5:12', audioUrl:null, downloadUrl:null },
];

window.SOCIALS = [
  { id:'github',     label:'GitHub',     url:'#' },
  { id:'youtube',    label:'YouTube',    url:'#' },
  { id:'soundcloud', label:'SoundCloud', url:'#' },
  { id:'instagram',  label:'Instagram',  url:'#' },
  { id:'bandcamp',   label:'Bandcamp',   url:'#' },
];

window.STRINGS = {
  cs: {
    nav_apps:'Aplikace', nav_music:'Hudba', nav_contact:'Kontakt',
    hero_tag:'Vibe coder & AI hudebník',
    hero_desc:'Tvořím mobilní aplikace a experimentální elektronickou hudbu pomocí AI.',
    cta_apps:'Prozkoumat aplikace', cta_music:'Poslechnout hudbu',
    stat_apps:'aplikací', stat_tracks:'skladeb', stat_albums:'alba',
    apps_title:'Aplikace', apps_all:'Vše',
    apps_open:'Otevřít', apps_dl:'Stáhnout',
    apps_sub_pwa:'PWA aplikace', apps_sub_android:'Android',
    music_title:'Hudba', music_albums:'Alba', music_tracks:'Skladby',
    music_sub:'fúze etnické a elektronické hudby',
    music_dl:'Stáhnout', music_play:'Přehrát',
    music_note:'Audio URL bude doplněno — nahraď audioUrl v data.js za odkaz ze Suno.',
    tracks_label:'skladeb',
    contact_title:'Pojďme si říct',
    contact_desc:'Máš zájem o spolupráci, projekt nebo jen chceš říct ahoj?',
    contact_email:'Napsat email',
    contact_follow:'Sleduj mě',
    footer:'Vytvořeno s vibecoding & Suno AI',
  },
  en: {
    nav_apps:'Apps', nav_music:'Music', nav_contact:'Contact',
    hero_tag:'Vibe coder & AI musician',
    hero_desc:'I build mobile apps and experimental electronic music with AI.',
    cta_apps:'Explore Apps', cta_music:'Listen to Music',
    stat_apps:'apps', stat_tracks:'tracks', stat_albums:'albums',
    apps_title:'Apps', apps_all:'All',
    apps_open:'Open', apps_dl:'Download',
    apps_sub_pwa:'PWA app', apps_sub_android:'Android',
    music_title:'Music', music_albums:'Albums', music_tracks:'Tracks',
    music_sub:'fusion of ethnic & electronic music',
    music_dl:'Download', music_play:'Play',
    music_note:'Audio URL to be added — replace audioUrl in data.js with your Suno link.',
    tracks_label:'tracks',
    contact_title:"Let's talk",
    contact_desc:'Interested in collaboration, a project, or just want to say hi?',
    contact_email:'Send Email',
    contact_follow:'Follow me',
    footer:'Made with vibecoding & Suno AI',
  }
};
