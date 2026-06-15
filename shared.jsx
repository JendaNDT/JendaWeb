// shared.jsx — themes, hooks, icons, helpers, base components
// Loaded BEFORE sections; all exports are attached to window so other Babel scripts can use them.
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ── Themes ─────────────────────────────────────────────────────────────
const THEMES = {
  ember:  { bg:'#0d0805', bg2:'#160d07', a1:'#f97316', a2:'#fbbf24', glow:'rgba(249,115,22,0.25)' },
  velvet: { bg:'#0e0508', bg2:'#180a0f', a1:'#e11d48', a2:'#f59e0b', glow:'rgba(225,29,72,0.22)' },
  desert: { bg:'#0c0905', bg2:'#150e07', a1:'#d97706', a2:'#f97316', glow:'rgba(217,119,6,0.25)' },
};

function applyTheme(key, mode) {
  const th = THEMES[key] || THEMES.ember;
  const r = document.documentElement;
  r.style.setProperty('--a1',   th.a1);
  r.style.setProperty('--a2',   th.a2);
  r.style.setProperty('--glow', th.glow);
  if (mode === 'light') {
    r.style.removeProperty('--bg');
    r.style.removeProperty('--bg2');
  } else {
    r.style.setProperty('--bg',  th.bg);
    r.style.setProperty('--bg2', th.bg2);
  }
}

function resolveMode(modePref) {
  if (modePref === 'light' || modePref === 'dark') return modePref;
  try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
  catch { return 'dark'; }
}

function applyMode(modePref) {
  const actual = resolveMode(modePref);
  document.documentElement.dataset.mode = actual;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', actual === 'light' ? '#fbf7f2' : '#0d0805');
  return actual;
}

// ── Translation ─────────────────────────────────────────────────────────
const tx = (lang, key) => (window.STRINGS?.[lang]?.[key]) ?? key;

// ── Storage keys ────────────────────────────────────────────────────────
const PLAYER_STORAGE_KEY = 'jw_player_state';
const VOL_STORAGE_KEY    = 'jw_player_volume';

// ── useInView ───────────────────────────────────────────────────────────
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

// ── Icons ───────────────────────────────────────────────────────────────
const PlayIco  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const PauseIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const NextIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>;
const PrevIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>;
const DlIco    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const CloseIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const VolIco   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>;
const MuteIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>;
const ShuffleIco    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>;
const RepeatIco     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
const RepeatOneIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/><path d="M11 10h1v4" strokeWidth="2.2"/></svg>;
const ShareIco      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const SearchIco     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
const SunIco   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
const MoonIco  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const AutoIco  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 010 18" fill="currentColor"/></svg>;

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

// Now-playing equalizer
function EqBars({ color = 'var(--a1)', delays = [0, 0.18, 0.36] }) {
  return (
    <div className="eq-bars" style={{ display:'flex', alignItems:'flex-end', gap:2, height:15 }}>
      {delays.map((d, i) => <span key={i} style={{ background:color, animationDelay:`${d}s` }} />)}
    </div>
  );
}

// Deterministic pseudo-random bar heights from a track id
function seededBars(seed, n = 72) {
  let s = (seed * 9301 + 49297) >>> 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const env = 0.55 + 0.45 * Math.abs(Math.sin(i / n * Math.PI * 2.4 + seed * 0.3));
    out.push(Math.max(0.18, Math.min(1, r * 0.9 * env + 0.18)));
  }
  return out;
}

const fmtTime = (s) => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60), x = Math.floor(s % 60);
  return `${m}:${x < 10 ? '0' : ''}${x}`;
};

// Larger procedural cover for albums — mesh gradient + noise + faint geometric overlay.
function albumArt(album) {
  if (!album) return '';
  let h = 0;
  for (let i = 0; i < album.id.length; i++) h = ((h << 5) - h + album.id.charCodeAt(i)) | 0;
  const seed = Math.abs(h);
  const sid = (seed * 9301 + 49297) >>> 0;
  const rand = (n) => {
    let s = (sid + n * 1117) >>> 0;
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const g1 = album.g1, g2 = album.g2;
  const blobs = [
    { x: Math.floor(rand(1)*100),  y: Math.floor(rand(2)*100),  r: 55+Math.floor(rand(3)*35),  c: g1,        o: 0.95 },
    { x: Math.floor(rand(4)*100),  y: Math.floor(rand(5)*100),  r: 42+Math.floor(rand(6)*35),  c: g2,        o: 0.82 },
    { x: Math.floor(rand(7)*100),  y: Math.floor(rand(8)*100),  r: 30+Math.floor(rand(9)*30),  c: g1,        o: 0.4 },
    { x: Math.floor(rand(10)*100), y: Math.floor(rand(11)*100), r: 28+Math.floor(rand(12)*30), c: '#ffffff', o: 0.18 },
    { x: Math.floor(rand(13)*100), y: Math.floor(rand(14)*100), r: 22+Math.floor(rand(15)*22), c: '#000000', o: 0.25 },
  ];
  const shapeKind = Math.floor(rand(16) * 3);
  let shape = '';
  if (shapeKind === 0) {
    shape = `<circle cx='${20+Math.floor(rand(17)*60)}%' cy='${20+Math.floor(rand(18)*60)}%' r='18%' fill='none' stroke='#ffffff' stroke-opacity='0.12' stroke-width='0.7'/>`;
  } else if (shapeKind === 1) {
    shape = `<line x1='10%' y1='${40+Math.floor(rand(17)*20)}%' x2='90%' y2='${40+Math.floor(rand(18)*20)}%' stroke='#ffffff' stroke-opacity='0.1' stroke-width='0.6'/>`;
  } else {
    shape = `<rect x='${15+Math.floor(rand(17)*30)}%' y='${15+Math.floor(rand(18)*30)}%' width='40%' height='40%' fill='none' stroke='#ffffff' stroke-opacity='0.08' stroke-width='0.6' transform='rotate(${Math.floor(rand(19)*45)} 128 128)'/>`;
  }
  const defs = blobs.map((b, i) => `<radialGradient id='ab${i}' cx='${b.x}%' cy='${b.y}%' r='${b.r}%'><stop offset='0' stop-color='${b.c}' stop-opacity='${b.o}'/><stop offset='1' stop-color='${b.c}' stop-opacity='0'/></radialGradient>`).join('');
  const noiseFilter = `<filter id='abn'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0'/></filter>`;
  const layers = blobs.map((_, i) => `<rect width='256' height='256' fill='url(#ab${i})'/>`).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><defs>${defs}${noiseFilter}</defs><rect width='256' height='256' fill='${g1}'/>${layers}${shape}<rect width='256' height='256' filter='url(#abn)'/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Deterministic procedural artwork for a track. Returns a data: URI SVG.
function trackArt(seed, album) {
  const sid = (Number(seed) || 1) * 9301 + 49297;
  const rand = (n) => {
    let s = (sid + n * 1009) >>> 0;
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const g1 = album?.g1 || '#555';
  const g2 = album?.g2 || '#333';
  const accent = album?.g1 ? album.g2 : '#ffffff';
  const blobs = [
    { x: Math.floor(rand(1)*100), y: Math.floor(rand(2)*100), r: 38+Math.floor(rand(3)*42), c: g1,     o: 0.95 },
    { x: Math.floor(rand(4)*100), y: Math.floor(rand(5)*100), r: 30+Math.floor(rand(6)*40), c: g2,     o: 0.78 },
    { x: Math.floor(rand(7)*100), y: Math.floor(rand(8)*100), r: 22+Math.floor(rand(9)*30), c: accent, o: 0.35 },
    { x: Math.floor(rand(10)*100), y: Math.floor(rand(11)*100), r: 18+Math.floor(rand(12)*28), c: '#ffffff', o: 0.18 },
  ];
  const angle = Math.floor(rand(13) * 360);
  const defs = blobs.map((b, i) => `<radialGradient id='b${i}' cx='${b.x}%' cy='${b.y}%' r='${b.r}%'><stop offset='0' stop-color='${b.c}' stop-opacity='${b.o}'/><stop offset='1' stop-color='${b.c}' stop-opacity='0'/></radialGradient>`).join('');
  const layers = blobs.map((_, i) => `<rect width='64' height='64' fill='url(%23b${i})'/>`).join('').replace(/%23/g, '#');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs>${defs}</defs><rect width='64' height='64' fill='${g1}' transform='rotate(${angle} 32 32)'/>${layers}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function parseDur(s) {
  if (!s) return 0;
  const [m, x] = s.split(':').map(Number);
  return (m || 0) * 60 + (x || 0);
}

// Shared button
function Btn({ href, children, primary, outline, onClick, small }) {
  const [hov, setHov] = useState(false);
  const base = {
    display:'inline-flex', alignItems:'center', gap:7,
    padding: small ? '8px 18px' : '13px 30px',
    borderRadius:50, fontWeight:600,
    fontSize: small ? 13 : 15,
    transition:'all 0.2s', cursor:'pointer',
  };
  const style = primary
    ? { ...base, background:'var(--a1)', color:'var(--bg)', border:'1px solid var(--a1)', boxShadow: hov ? '0 8px 40px var(--glow)' : '0 0 24px var(--glow)', transform: hov ? 'translateY(-2px)' : 'none' }
    : outline
    ? { ...base, background:'transparent', color: hov ? 'var(--a2)' : 'var(--text)', border:`1px solid ${hov ? 'var(--a2)' : 'var(--border)'}`, transform: hov ? 'translateY(-2px)' : 'none' }
    : { ...base, background: hov ? 'var(--card)' : 'transparent', color:'var(--muted)', border:'1px solid var(--border)' };
  if (href) return <a href={href} style={style} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</a>;
  return <button style={style} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</button>;
}

function SectionLabel({ children, color = 'a1', num }) {
  return (
    <div style={{ marginBottom:14 }}>
      {num && (
        <div style={{
          fontFamily:'ui-monospace, SF Mono, Consolas, monospace',
          fontSize:11, fontWeight:600, color:'var(--muted)',
          letterSpacing:'0.18em', textTransform:'uppercase',
          marginBottom:10, opacity:0.65,
        }}>
          {num} — {typeof children === 'string' ? children : ''}
        </div>
      )}
      <h2 style={{
        fontFamily:"'Syne',sans-serif",
        fontSize:'clamp(36px, 5.5vw, 58px)',
        fontWeight:800, letterSpacing:'-0.04em', lineHeight:1,
      }}>
        {children}<span style={{ color:`var(--${color})` }}>.</span>
      </h2>
    </div>
  );
}

function SubLabel({ children }) {
  return (
    <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:18, opacity:0.75 }}>
      {children}
    </p>
  );
}

// Animated number counter (when visible)
function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef(null);
  useEffect(() => {
    const el = elRef.current; if (!el) return;
    const startAnim = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
        setVal(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 0) && r.bottom > 0) { startAnim(); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      startAnim();
      obs.disconnect();
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return [elRef, val];
}

// Decorative divider between sections
function SectionDivider() {
  return (
    <div aria-hidden style={{ height:1, margin:'0 auto', maxWidth:1100, background:'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
  );
}

Object.assign(window, {
  THEMES, applyTheme, resolveMode, applyMode, tx,
  PLAYER_STORAGE_KEY, VOL_STORAGE_KEY,
  useInView,
  PlayIco, PauseIco, NextIco, PrevIco, DlIco, CloseIco, VolIco, MuteIco,
  ShuffleIco, RepeatIco, RepeatOneIco, ShareIco, SearchIco,
  SunIco, MoonIco, AutoIco, SocialIco,
  EqBars, seededBars, fmtTime, parseDur, trackArt, albumArt,
  Btn, SectionLabel, SubLabel, SectionDivider, useCountUp,
});
