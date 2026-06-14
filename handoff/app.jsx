// app.jsx — Jenda personal website
// Requires: React 18, ReactDOM, Babel, tweaks-panel.jsx, data.js

const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ── Themes ─────────────────────────────────────────────────────────────
const THEMES = {
  ember:  { bg:'#0d0805', bg2:'#160d07', a1:'#f97316', a2:'#fbbf24', glow:'rgba(249,115,22,0.25)' },
  velvet: { bg:'#0e0508', bg2:'#180a0f', a1:'#e11d48', a2:'#f59e0b', glow:'rgba(225,29,72,0.22)' },
  desert: { bg:'#0c0905', bg2:'#150e07', a1:'#d97706', a2:'#f97316', glow:'rgba(217,119,6,0.25)' },
};

function applyTheme(key) {
  const th = THEMES[key] || THEMES.cosmos;
  const r = document.documentElement;
  r.style.setProperty('--bg',   th.bg);
  r.style.setProperty('--bg2',  th.bg2);
  r.style.setProperty('--a1',   th.a1);
  r.style.setProperty('--a2',   th.a2);
  r.style.setProperty('--glow', th.glow);
}

// ── Translation helper ─────────────────────────────────────────────────
const tx = (lang, key) => (window.STRINGS?.[lang]?.[key]) ?? key;

// ── useInView hook ─────────────────────────────────────────────────────
function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Icons ──────────────────────────────────────────────────────────────
const PlayIco  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const PauseIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const NextIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>;
const PrevIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>;
const DlIco    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const CloseIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const VolIco   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>;

function SocialIco({ id, size = 22 }) {
  const svgProps = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor" };
  if (id === 'github')
    return <svg {...svgProps}><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
  if (id === 'youtube')
    return <svg {...svgProps}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (id === 'soundcloud')
    return <svg {...svgProps} viewBox="0 0 32 32"><path d="M0 20.25c0 2.07 1.564 3.75 3.5 3.75.26 0 .516-.03.76-.083L4.27 24H28.5C30.43 24 32 22.43 32 20.5c0-1.77-1.328-3.228-3.047-3.46A8.499 8.499 0 0022 10a8.48 8.48 0 00-5.86 2.34A5.5 5.5 0 0011 11a5.49 5.49 0 00-4.898 3.013A4.003 4.003 0 000 17.75v2.5z"/></svg>;
  if (id === 'instagram')
    return <svg {...svgProps}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (id === 'bandcamp')
    return <svg {...svgProps}><path d="M0 18.75l7.437-13.5H24l-7.438 13.5z"/></svg>;
  return <span style={{ fontSize: size * 0.55, fontWeight: 700 }}>{id[0].toUpperCase()}</span>;
}

// ── Nav ────────────────────────────────────────────────────────────────
function Nav({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const s = {
    nav: {
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      height:64, padding:'0 32px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background: scrolled ? 'rgba(8,8,14,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition:'all 0.3s ease',
    },
    logo: {
      fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20,
      letterSpacing:'-0.04em',
      background:'linear-gradient(135deg, var(--a1), var(--a2))',
      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
    },
    link: { fontSize:15, fontWeight:500, color:'var(--muted)', transition:'color 0.2s', padding:'4px 0' },
    langBtn: (active) => ({
      padding:'4px 11px', borderRadius:6, fontSize:13, fontWeight:700, letterSpacing:'0.04em',
      background: active ? 'var(--a1)' : 'transparent',
      color: active ? '#fff' : 'var(--muted)',
      border:`1px solid ${active ? 'var(--a1)' : 'var(--border)'}`,
      transition:'all 0.2s',
    }),
  };

  const links = [
    { href:'#apps',    lbl: tx(lang, 'nav_apps') },
    { href:'#music',   lbl: tx(lang, 'nav_music') },
    { href:'#contact', lbl: tx(lang, 'nav_contact') },
  ];

  return (
    <nav style={s.nav}>
      <a href="#hero" style={s.logo}>jenda.dev</a>
      <div className="nav-desktop" style={{ display:'flex', gap:36, alignItems:'center' }}>
        {links.map(l => (
          <a key={l.href} href={l.href} style={s.link}
             onMouseEnter={e => e.target.style.color='var(--text)'}
             onMouseLeave={e => e.target.style.color='var(--muted)'}>
            {l.lbl}
          </a>
        ))}
      </div>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <button style={s.langBtn(lang === 'cs')} onClick={() => setLang('cs')}>CZ</button>
        <button style={s.langBtn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────
function Hero({ lang }) {
  return (
    <section id="hero" className="hero-noise" style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'90px 24px 80px',
      position:'relative', overflow:'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:'-15%', right:'-8%', width:580, height:580, borderRadius:'50%', background:'radial-gradient(circle, var(--a1), transparent 70%)', opacity:0.13, filter:'blur(90px)', pointerEvents:'none', animation:'float1 22s ease-in-out infinite alternate' }} />
      <div style={{ position:'absolute', bottom:'-15%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, var(--a2), transparent 70%)', opacity:0.11, filter:'blur(90px)', pointerEvents:'none', animation:'float2 28s ease-in-out infinite alternate' }} />
      <div style={{ position:'absolute', top:'40%', left:'20%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, var(--a1), transparent 70%)', opacity:0.06, filter:'blur(60px)', pointerEvents:'none', animation:'float2 18s ease-in-out infinite alternate-reverse' }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:820 }}>
        {/* Tag pill */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          fontSize:12, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
          color:'var(--a1)', padding:'7px 18px', borderRadius:30,
          border:'1px solid color-mix(in srgb, var(--a1) 40%, transparent)',
          background:'color-mix(in srgb, var(--a1) 8%, transparent)',
          marginBottom:36,
        }}>
          {tx(lang, 'hero_tag')}
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily:"'Syne', sans-serif",
          fontSize:'clamp(80px, 16vw, 160px)',
          fontWeight:800, lineHeight:0.88,
          letterSpacing:'-0.05em',
          background:'linear-gradient(135deg, var(--text) 20%, var(--a1) 55%, var(--a2) 85%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          backgroundSize:'200% 200%',
          animation:'gradShift 9s ease-in-out infinite',
          marginBottom:32,
        }}>
          Jenda
        </h1>

        {/* Description */}
        <p style={{
          fontSize:'clamp(16px, 2.2vw, 20px)', color:'var(--muted)',
          maxWidth:500, margin:'0 auto 52px', lineHeight:1.65, fontWeight:300,
        }}>
          {tx(lang, 'hero_desc')}
        </p>

        {/* CTAs */}
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Btn href="#apps" primary>{tx(lang, 'cta_apps')}</Btn>
          <Btn href="#music" outline>{tx(lang, 'cta_music')}</Btn>
        </div>

        {/* Stats */}
        <div style={{ display:'flex', gap:56, justifyContent:'center', marginTop:80, flexWrap:'wrap' }}>
          {[['20+', tx(lang,'stat_apps')], ['200+', tx(lang,'stat_tracks')], ['5', tx(lang,'stat_albums')]].map(([num, lbl]) => (
            <div key={lbl} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:38, fontWeight:800, color:'var(--a1)', lineHeight:1 }}>{num}</div>
              <div style={{ fontSize:12, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.12em', marginTop:6 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Shared Button ──────────────────────────────────────────────────────
function Btn({ href, children, primary, outline, onClick, small }) {
  const [hov, setHov] = useState(false);
  const base = {
    display:'inline-flex', alignItems:'center', gap:7,
    padding: small ? '8px 18px' : '13px 30px',
    borderRadius:50, fontWeight:600,
    fontSize: small ? 13 : 15,
    transition:'all 0.2s',
    cursor:'pointer',
  };
  const style = primary
    ? { ...base, background:'var(--a1)', color:'#fff', border:'1px solid var(--a1)', boxShadow: hov ? '0 8px 40px var(--glow)' : '0 0 24px var(--glow)', transform: hov ? 'translateY(-2px)' : 'none' }
    : outline
    ? { ...base, background:'transparent', color: hov ? 'var(--a2)' : 'var(--text)', border:`1px solid ${hov ? 'var(--a2)' : 'var(--border)'}`, transform: hov ? 'translateY(-2px)' : 'none' }
    : { ...base, background: hov ? 'var(--card)' : 'transparent', color:'var(--muted)', border:'1px solid var(--border)' };

  if (href) return <a href={href} style={style} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</a>;
  return <button style={style} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</button>;
}

// ── App Card ───────────────────────────────────────────────────────────
function AppCard({ app, lang }) {
  const [hov, setHov] = useState(false);
  const isPWA = app.platform === 'PWA';
  return (
    <div style={{
      background: hov ? 'rgba(255,255,255,0.065)' : 'var(--card)',
      border:`1px solid ${hov ? 'color-mix(in srgb, var(--border) 100%, ' + app.color + ' 30%)' : 'var(--border)'}`,
      borderRadius:'var(--r)', padding:'22px',
      transition:'all 0.25s',
      transform: hov ? 'translateY(-5px)' : 'none',
      boxShadow: hov ? `0 14px 44px ${app.color}1a` : 'none',
      display:'flex', flexDirection:'column', gap:14,
    }}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {/* Icon */}
      <div style={{
        width:52, height:52, borderRadius:13,
        background:`linear-gradient(135deg, ${app.color}28, ${app.color}50)`,
        border:`1px solid ${app.color}40`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:app.color,
      }}>{app.name[0]}</div>
      {/* Meta */}
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15 }}>{app.name}</span>
          <span style={{
            fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:20,
            textTransform:'uppercase', letterSpacing:'0.06em',
            background: isPWA ? 'color-mix(in srgb, var(--a1) 14%, transparent)' : 'rgba(34,197,94,0.15)',
            color: isPWA ? 'var(--a1)' : '#4ade80',
            border: `1px solid ${isPWA ? 'color-mix(in srgb, var(--a1) 35%, transparent)' : 'rgba(34,197,94,0.3)'}`,
          }}>{app.platform}</span>
        </div>
        <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.5, textWrap:'pretty' }}>
          {lang === 'cs' ? app.cs : app.en}
        </p>
      </div>
      {/* Action */}
      <a href={app.link} style={{
        display:'flex', alignItems:'center', justifyContent:'center', gap:7,
        padding:'9px 0', borderRadius:8,
        background: hov ? app.color : 'transparent',
        color: hov ? '#fff' : app.color,
        border:`1px solid ${app.color}55`,
        fontSize:13, fontWeight:600, transition:'all 0.2s',
      }}>
        <DlIco />
        {isPWA ? tx(lang, 'apps_open') : tx(lang, 'apps_dl')}
      </a>
    </div>
  );
}

// ── Apps Section ───────────────────────────────────────────────────────
function AppsSection({ lang }) {
  const [filter, setFilter] = useState('all');
  const [ref, vis] = useInView();
  const apps = window.APPS_DATA || [];
  const filtered = useMemo(() => filter === 'all' ? apps : apps.filter(a => a.platform === filter), [filter, apps]);

  const pills = [
    { k:'all',     lbl: tx(lang,'apps_all') },
    { k:'PWA',     lbl: 'PWA',     count: apps.filter(a=>a.platform==='PWA').length },
    { k:'Android', lbl: 'Android', count: apps.filter(a=>a.platform==='Android').length },
  ];

  return (
    <section id="apps" style={{ padding:'110px 24px', background:'var(--bg2)' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionLabel color="a1">{tx(lang,'apps_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:40 }}>
          {lang==='cs' ? `${apps.length} aplikací · PWA & nativní Android` : `${apps.length} apps · PWA & native Android`}
        </p>
        {/* Filter */}
        <div style={{ display:'flex', gap:9, marginBottom:44, flexWrap:'wrap' }}>
          {pills.map(p => (
            <button key={p.k} onClick={() => setFilter(p.k)} style={{
              padding:'7px 18px', borderRadius:50, fontSize:13, fontWeight:600,
              background: filter===p.k ? 'var(--a1)' : 'transparent',
              color: filter===p.k ? '#fff' : 'var(--muted)',
              border:`1px solid ${filter===p.k ? 'var(--a1)' : 'var(--border)'}`,
              transition:'all 0.2s', display:'flex', alignItems:'center', gap:6,
            }}>
              {p.lbl}
              {p.count && <span style={{ opacity:0.65, fontSize:11 }}>{p.count}</span>}
            </button>
          ))}
        </div>
        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:18 }}>
          {filtered.map((app, i) => (
            <div key={app.id} className="card-animate" style={{ animationDelay:`${i*35}ms` }}>
              <AppCard app={app} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Album Card ─────────────────────────────────────────────────────────
function AlbumCard({ album, lang, onPlay }) {
  const [hov, setHov] = useState(false);
  const tracks = (window.TRACKS_DATA || []).filter(t => t.album === album.id);
  return (
    <div style={{
      borderRadius:'var(--r)', overflow:'hidden',
      border:'1px solid var(--border)',
      transition:'all 0.25s',
      transform: hov ? 'translateY(-5px)' : 'none',
      boxShadow: hov ? '0 16px 50px rgba(0,0,0,0.45)' : 'none',
    }}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {/* Cover art */}
      <div style={{ height:175, position:'relative', background:`linear-gradient(135deg, ${album.g1}, ${album.g2})`, overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.18), transparent 60%)' }} />
        <div style={{ position:'absolute', bottom:14, left:16, right:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#fff', textShadow:'0 2px 10px rgba(0,0,0,0.5)', lineHeight:1.15 }}>{album.title}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.75)', marginTop:3, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>{album.genre}</div>
        </div>
        {/* Hover play */}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.38)', opacity: hov?1:0, transition:'opacity 0.2s' }}>
          <button onClick={() => tracks.length && onPlay(tracks[0], tracks)} style={{
            width:50, height:50, borderRadius:'50%', background:'rgba(255,255,255,0.95)',
            color:'#0a0a14', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            transform: hov ? 'scale(1)' : 'scale(0.75)', transition:'transform 0.25s',
            boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <PlayIco />
          </button>
        </div>
      </div>
      {/* Info */}
      <div style={{ background:'var(--card)', borderTop:'1px solid var(--border)', padding:'14px 16px' }}>
        <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.45 }}>{lang==='cs' ? album.cs : album.en}</p>
        <div style={{ fontSize:11, color:'var(--muted)', marginTop:8, opacity:0.55 }}>
          {album.tracks} {tx(lang,'tracks_label')} · {album.year}
        </div>
      </div>
    </div>
  );
}

// ── Track Row ──────────────────────────────────────────────────────────
function TrackRow({ track, album, idx, active, onPlay }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:14,
      padding:'10px 14px', borderRadius:10,
      background: active ? 'color-mix(in srgb, var(--a1) 12%, transparent)' : hov ? 'var(--card)' : 'transparent',
      border:`1px solid ${active ? 'color-mix(in srgb, var(--a1) 40%, transparent)' : 'transparent'}`,
      transition:'all 0.15s', cursor:'pointer',
    }}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    onClick={() => onPlay(track, window.TRACKS_DATA || [])}>
      {/* Number / play */}
      <div style={{ width:28, textAlign:'center', color: active ? 'var(--a1)' : 'var(--muted)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {hov || active ? <PlayIco /> : <span style={{ fontSize:13 }}>{idx + 1}</span>}
      </div>
      {/* Thumb */}
      <div style={{ width:38, height:38, borderRadius:7, flexShrink:0, background:`linear-gradient(135deg, ${album?.g1||'#555'}, ${album?.g2||'#333'})` }} />
      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:600, color: active?'var(--a1)':'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track.title}</div>
        <div style={{ fontSize:12, color:'var(--muted)', marginTop:1 }}>{album?.title || ''}</div>
      </div>
      {/* Duration + dl */}
      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        {track.downloadUrl && (
          <a href={track.downloadUrl} onClick={e => e.stopPropagation()} style={{ color:'var(--muted)', opacity:0.6, display:'flex' }}><DlIco /></a>
        )}
        <span style={{ fontSize:13, color:'var(--muted)' }}>{track.duration}</span>
      </div>
    </div>
  );
}

// ── Music Section ──────────────────────────────────────────────────────
function MusicSection({ lang, onPlay, currentTrack }) {
  const [ref, vis] = useInView();
  const albums = window.ALBUMS || [];
  const tracks = window.TRACKS_DATA || [];
  const albumMap = useMemo(() => Object.fromEntries(albums.map(a => [a.id, a])), []);

  return (
    <section id="music" style={{ padding:'110px 24px' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionLabel color="a2">{tx(lang,'music_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:52 }}>
          200+ {tx(lang,'music_sub')}
        </p>

        {/* Albums */}
        <SubLabel>{tx(lang,'music_albums')}</SubLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:18, marginBottom:64 }}>
          {albums.map(a => <AlbumCard key={a.id} album={a} lang={lang} onPlay={onPlay} />)}
        </div>

        {/* Track list */}
        <SubLabel>{tx(lang,'music_tracks')}</SubLabel>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          {tracks.map((tr, i) => (
            <TrackRow key={tr.id} track={tr} album={albumMap[tr.album]} idx={i} active={currentTrack?.id === tr.id} onPlay={onPlay} />
          ))}
        </div>

        <p style={{ marginTop:22, fontSize:12, color:'var(--muted)', opacity:0.5, fontStyle:'italic' }}>
          {tx(lang,'music_note')}
        </p>
      </div>
    </section>
  );
}

// ── Audio Player (sticky) ──────────────────────────────────────────────
function AudioPlayer({ track, playlist, isPlaying, setIsPlaying, onPrev, onNext, onClose }) {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [vol, setVol] = useState(0.8);
  const albums = window.ALBUMS || [];
  const album = albums.find(a => a.id === track?.album);

  // Initialise audio element once
  useEffect(() => { audioRef.current = new Audio(); audioRef.current.volume = 0.8; return () => { if (audioRef.current) audioRef.current.pause(); }; }, []);

  // Src / play state
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    if (track?.audioUrl) { a.src = track.audioUrl; }
    if (isPlaying && track?.audioUrl) a.play().catch(() => {});
    else a.pause();
  }, [track, isPlaying]);

  // Progress
  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const fn = () => a.duration && setProgress(a.currentTime / a.duration);
    a.addEventListener('timeupdate', fn);
    return () => a.removeEventListener('timeupdate', fn);
  }, []);

  const scrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current?.duration) audioRef.current.currentTime = p * audioRef.current.duration;
    setProgress(p);
  };

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:200,
      background:'rgba(7,7,12,0.96)', backdropFilter:'blur(28px)',
      borderTop:'1px solid var(--border)',
      padding:'10px 28px',
      display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:20,
      animation:'slideUp 0.35s ease',
    }}>
      {/* Track info (left) */}
      <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
        <div style={{ width:42, height:42, borderRadius:8, flexShrink:0, background:`linear-gradient(135deg, ${album?.g1||'#555'}, ${album?.g2||'#333'})` }} />
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track?.title}</div>
          <div style={{ fontSize:12, color:'var(--muted)' }}>{album?.title || ''}</div>
        </div>
      </div>

      {/* Controls (center) */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <button onClick={onPrev} style={{ color:'var(--muted)', display:'flex', padding:6, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><PrevIco /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{
            width:44, height:44, borderRadius:'50%', background:'var(--a1)', color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 20px var(--glow)', transition:'transform 0.1s',
          }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            {isPlaying ? <PauseIco /> : <PlayIco />}
          </button>
          <button onClick={onNext} style={{ color:'var(--muted)', display:'flex', padding:6, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><NextIco /></button>
        </div>
        {/* Progress bar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, width:300 }}>
          <div onClick={scrub} style={{ flex:1, height:3, borderRadius:2, background:'var(--border)', cursor:'pointer', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${progress*100}%`, borderRadius:2, background:'linear-gradient(90deg, var(--a1), var(--a2))' }} />
          </div>
          <span style={{ fontSize:11, color:'var(--muted)', flexShrink:0, minWidth:32 }}>{track?.duration || '0:00'}</span>
        </div>
      </div>

      {/* Volume + close (right) */}
      <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'flex-end' }}>
        <VolIco />
        <input type="range" min="0" max="1" step="0.01" value={vol} onChange={e => { setVol(+e.target.value); if (audioRef.current) audioRef.current.volume = +e.target.value; }} style={{ width:80 }} />
        <button onClick={onClose} style={{ color:'var(--muted)', display:'flex', padding:6, marginLeft:8, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><CloseIco /></button>
      </div>
    </div>
  );
}

// ── Contact Section ────────────────────────────────────────────────────
function ContactSection({ lang }) {
  const [ref, vis] = useInView();
  const socials = window.SOCIALS || [];
  return (
    <section id="contact" style={{ padding:'110px 24px', background:'var(--bg2)' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:660, margin:'0 auto', textAlign:'center' }}>
        <SectionLabel color="a1">{tx(lang,'contact_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:18, lineHeight:1.65, marginBottom:44 }}>
          {tx(lang,'contact_desc')}
        </p>
        <Btn href="mailto:jenda@example.com" primary>{tx(lang,'contact_email')}</Btn>

        <div style={{ marginTop:60 }}>
          <p style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:22, opacity:0.7 }}>
            {tx(lang,'contact_follow')}
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            {socials.map(s => (
              <a key={s.id} href={s.url} title={s.label} style={{
                width:48, height:48, borderRadius:12,
                background:'var(--card)', border:'1px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--muted)', transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--a1)'; e.currentTarget.style.color='var(--a1)'; e.currentTarget.style.background='color-mix(in srgb, var(--a1) 10%, transparent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.background='var(--card)'; }}>
                <SocialIco id={s.id} size={21} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────
function Footer({ lang }) {
  return (
    <footer style={{ padding:'28px 24px', textAlign:'center', borderTop:'1px solid var(--border)', color:'var(--muted)', fontSize:13 }}>
      © 2026 Jenda &nbsp;·&nbsp; <span style={{ opacity:0.5 }}>{tx(lang,'footer')}</span>
    </footer>
  );
}

// ── Typography helpers ─────────────────────────────────────────────────
function SectionLabel({ children, color = 'a1' }) {
  return (
    <h2 style={{
      fontFamily:"'Syne',sans-serif",
      fontSize:'clamp(36px, 5.5vw, 58px)',
      fontWeight:800, marginBottom:14, letterSpacing:'-0.04em', lineHeight:1,
    }}>
      {children}<span style={{ color:`var(--${color})` }}>.</span>
    </h2>
  );
}
function SubLabel({ children }) {
  return (
    <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:18, opacity:0.75 }}>
      {children}
    </p>
  );
}

// ── App root ───────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ theme:'ember' }/*EDITMODE-END*/;

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState('cs');
  const [playerTrack, setPlayerTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { applyTheme(tw.theme); }, [tw.theme]);

  const handlePlay = useCallback((track, pl) => {
    setPlayerTrack(track); setPlaylist(pl || []); setPlaying(true);
  }, []);

  const currentIdx = useMemo(() => playlist.findIndex(t => t.id === playerTrack?.id), [playerTrack, playlist]);
  const handleNext = useCallback(() => { if (currentIdx >= 0 && currentIdx < playlist.length - 1) { setPlayerTrack(playlist[currentIdx + 1]); setPlaying(true); } }, [currentIdx, playlist]);
  const handlePrev = useCallback(() => { if (currentIdx > 0) { setPlayerTrack(playlist[currentIdx - 1]); setPlaying(true); } }, [currentIdx, playlist]);

  return (
    <div style={{ minHeight:'100vh', paddingBottom: playerTrack ? 82 : 0 }}>
      <Nav lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <AppsSection lang={lang} />
      <MusicSection lang={lang} onPlay={handlePlay} currentTrack={playerTrack} />
      <ContactSection lang={lang} />
      <Footer lang={lang} />

      {playerTrack && (
        <AudioPlayer
          track={playerTrack} playlist={playlist}
          isPlaying={playing} setIsPlaying={setPlaying}
          onPrev={handlePrev} onNext={handleNext}
          onClose={() => { setPlayerTrack(null); setPlaying(false); }}
        />
      )}

      <TweaksPanel>
        <TweakSection label="Barevné téma" />
        <TweakRadio label="Téma" value={tw.theme}
          options={['ember','velvet','desert']}
          onChange={v => setTweak('theme', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
