// nav-hero.jsx — Top navigation + hero section
// Depends on shared.jsx (window globals).
const { useState: __useState_nh, useEffect: __useEffect_nh, useRef: __useRef_nh } = React;

// HeroCanvas — generativní "souhvězdí" částic za nadpisem.
// Samo jemně plyne; když hraje hudba, reaguje na ni přes sdílený analyser
// (window.__jwAnalyser z přehrávače): basy nafouknou/rozzáří částice,
// výšky přidají rychlost a propojení. Respektuje prefers-reduced-motion,
// pauzuje mimo obrazovku i na skryté kartě, ladí barvy dle motivu webu.
function HeroCanvas() {
  const ref = __useRef_nh(null);
  __useEffect_nh(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, particles = [], raf = null, running = false, t = 0, frame = 0;
    const col = { a1:[249,115,22], a2:[251,191,36], dark:true };

    function parseColor(str, fb) {
      str = (str || '').trim();
      let m = str.match(/^#([0-9a-fA-F]{6})$/);
      if (m) { const n = parseInt(m[1],16); return [(n>>16)&255,(n>>8)&255,n&255]; }
      m = str.match(/rgba?\(([^)]+)\)/);
      if (m) { const p = m[1].split(',').map(s=>parseFloat(s)); return [p[0]||0,p[1]||0,p[2]||0]; }
      return fb;
    }
    function sampleTheme() {
      try {
        const cs = getComputedStyle(document.documentElement);
        col.a1 = parseColor(cs.getPropertyValue('--a1'), [249,115,22]);
        col.a2 = parseColor(cs.getPropertyValue('--a2'), [251,191,36]);
        const bg = parseColor(cs.getPropertyValue('--bg'), [0,0,0]);
        col.dark = (0.2126*bg[0] + 0.7152*bg[1] + 0.0722*bg[2]) / 255 < 0.5;
      } catch (e) {}
    }
    function mk() {
      return { x:Math.random()*W, y:Math.random()*H, r:1+Math.random()*2.4,
        vx:(Math.random()-0.5)*0.18, vy:-(0.06+Math.random()*0.22),
        ph:Math.random()*Math.PI*2, warm:Math.random() };
    }
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W*dpr));
      canvas.height = Math.max(1, Math.floor(H*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const target = Math.round(Math.min(86, Math.max(34, W/16)));
      if (particles.length !== target) { particles = []; for (let i=0;i<target;i++) particles.push(mk()); }
    }
    function audioLevels() {
      const an = window.__jwAnalyser; if (!an) return null;
      try {
        const bins = new Uint8Array(an.frequencyBinCount);
        an.getByteFrequencyData(bins);
        const avg = (a,b) => { let s=0; for (let i=a;i<b;i++) s+=bins[i]; return s/((b-a)*255); };
        const bass = avg(1,8), mid = avg(8,40), treble = avg(40,90);
        if (bass+mid+treble < 0.02) return null; // ticho / pauza → generativní režim
        return { bass, mid, treble };
      } catch (e) { return null; }
    }
    function draw() {
      t += 0.016; frame++;
      if (frame % 45 === 0) sampleTheme();
      ctx.clearRect(0,0,W,H);
      const a = audioLevels();
      const playing = !!a;
      const bass = a ? a.bass : 0, treble = a ? a.treble : 0;
      const idle = 0.5 + 0.5*Math.sin(t*0.6);
      const amp = playing ? Math.min(1, bass*1.4) : 0.12*idle;
      const speedM = playing ? (1 + treble*2.2) : 1;
      const linkDist = (playing ? 130 : 108) + amp*60;

      ctx.globalCompositeOperation = col.dark ? 'lighter' : 'source-over';
      for (const p of particles) {
        p.x += p.vx*speedM; p.y += p.vy*speedM; p.ph += 0.02 + treble*0.06;
        if (p.y < -10) { p.y = H+10; p.x = Math.random()*W; }
        if (p.x < -10) p.x = W+10; else if (p.x > W+10) p.x = -10;
        const rr = Math.max(0.4, p.r*(1+amp*1.7) + Math.sin(p.ph)*0.4);
        const c = p.warm < 0.5 ? col.a1 : col.a2;
        const al = Math.min(0.85, (col.dark ? 0.16 : 0.22) + amp*0.5);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${al})`;
        ctx.arc(p.x, p.y, rr, 0, Math.PI*2); ctx.fill();
      }
      for (let i=0;i<particles.length;i++) {
        for (let j=i+1;j<particles.length;j++) {
          const A = particles[i], B = particles[j];
          const dx = A.x-B.x, dy = A.y-B.y, d = Math.hypot(dx,dy);
          if (d < linkDist) {
            const o = (1 - d/linkDist) * (col.dark ? 0.10 : 0.14) * (0.5 + amp);
            ctx.strokeStyle = `rgba(${col.a1[0]},${col.a1[1]},${col.a1[2]},${o})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke();
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      if (running) raf = requestAnimationFrame(draw);
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    sampleTheme(); resize();
    const ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas); else window.addEventListener('resize', resize);

    let io = null, onVis = null;
    if (reduce) { draw(); } // jediný statický snímek
    else {
      io = ('IntersectionObserver' in window) ? new IntersectionObserver(es => {
        if (es[0].isIntersecting) start(); else stop();
      }, { threshold:0.01 }) : null;
      if (io) io.observe(canvas); else start();
      onVis = () => { if (document.hidden) stop(); else start(); };
      document.addEventListener('visibilitychange', onVis);
      start();
    }
    return () => {
      stop();
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      if (io) io.disconnect();
      if (onVis) document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" style={{
    position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none',
  }} />;
}

function Nav({ lang, setLang, mode, setMode }) {
  const [scrolled, setScrolled] = __useState_nh(false);
  const [active, setActive]     = __useState_nh('hero');
  __useEffect_nh(() => {
    const ids = ['apps', 'music', 'contact'];
    const fn = () => {
      setScrolled(window.scrollY > 50);
      const y = window.scrollY + window.innerHeight * 0.35;
      let cur = 'hero';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const s = {
    nav: {
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      height:64, padding:'0 32px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background: scrolled ? 'color-mix(in srgb, var(--bg) 88%, transparent)' : 'transparent',
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
        {links.map(l => {
          const on = active === l.href.slice(1);
          return (
            <a key={l.href} href={l.href} className="nav-link"
               style={{ ...s.link, color: on ? 'var(--a1)' : 'var(--muted)' }}
               onMouseEnter={e => e.currentTarget.style.color='var(--text)'}
               onMouseLeave={e => e.currentTarget.style.color = on ? 'var(--a1)' : 'var(--muted)'}>
              {l.lbl}
            </a>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <button
          onClick={() => setMode(mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto')}
          title={tx(lang,'mode_'+mode)}
          aria-label={`Mode: ${tx(lang,'mode_'+mode)}`}
          style={{
            width:32, height:32, borderRadius:6,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--muted)', border:'1px solid var(--border)',
            transition:'all 0.2s', marginRight:4,
          }}
          onMouseEnter={e => { e.currentTarget.style.color='var(--a1)'; e.currentTarget.style.borderColor='var(--a1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.borderColor='var(--border)'; }}
        >
          {mode === 'light' ? <SunIco /> : mode === 'dark' ? <MoonIco /> : <AutoIco />}
        </button>
        <button style={s.langBtn(lang === 'cs')} onClick={() => setLang('cs')}>CZ</button>
        <button style={s.langBtn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
      </div>
    </nav>
  );
}

function Hero({ lang }) {
  return (
    <section id="hero" style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'90px 24px 80px',
      position:'relative', overflow:'hidden',
    }}>
      <HeroCanvas />
      <div style={{ position:'relative', zIndex:1, maxWidth:820 }}>
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

        <p style={{
          fontSize:'clamp(16px, 2.2vw, 20px)', color:'var(--muted)',
          maxWidth:500, margin:'0 auto 52px', lineHeight:1.65, fontWeight:300,
        }}>
          {tx(lang, 'hero_desc')}
        </p>

        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Btn href="#apps" primary>{tx(lang, 'cta_apps')}</Btn>
          <Btn href="#music" outline>{tx(lang, 'cta_music')}</Btn>
        </div>

        <div style={{ display:'flex', gap:56, justifyContent:'center', marginTop:80, flexWrap:'wrap' }}>
          {[
            { num:20,  suffix:'+', lbl: tx(lang,'stat_apps'),   href:'#apps' },
            { num:200, suffix:'+', lbl: tx(lang,'stat_tracks'), href:'#music' },
            { num:5,   suffix:'',  lbl: tx(lang,'stat_albums'), href:'#music' },
          ].map(({ num, suffix, lbl, href }) => {
            const [r, v] = useCountUp(num);
            return (
              <a key={lbl} ref={r} href={href} style={{ textAlign:'center', display:'block', transition:'transform 0.2s', cursor:'pointer' }}
                 onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                 onMouseLeave={e => e.currentTarget.style.transform='none'}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:38, fontWeight:800, color:'var(--a1)', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                  {Math.round(v)}{suffix}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.12em', marginTop:6 }}>{lbl}</div>
              </a>
            );
          })}
        </div>
      </div>

      <a href="#apps" className="scroll-cue" aria-label="Scroll" style={{
        position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)',
        zIndex:1, color:'var(--muted)', display:'flex',
        animation:'scrollBob 2.2s ease-in-out infinite',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10l5 5 5-5"/></svg>
      </a>
    </section>
  );
}

Object.assign(window, { Nav, Hero });
