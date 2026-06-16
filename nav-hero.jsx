// nav-hero.jsx — Top navigation + hero section
// Depends on shared.jsx (window globals).
const { useState: __useState_nh, useEffect: __useEffect_nh, useRef: __useRef_nh } = React;

// BackgroundFX — generativní "souhvězdí" částic přes CELOU stránku (fixní vrstva
// nad mesh-bg, pod obsahem). Samo jemně plyne; když hraje hudba, reaguje na ni
// přes sdílený analyser (window.__jwAnalyser z přehrávače): basy nafouknou/rozzáří
// částice a „nadechnou" celé pole, výšky přidají rychlost a propojení, nárazy
// vyšlou prstenec. Respektuje prefers-reduced-motion, pauzuje mimo obrazovku
// i na skryté kartě, ladí barvy dle motivu webu.
function BackgroundFX() {
  const ref = __useRef_nh(null);
  const [active, setActive] = __useState_nh(false);

  __useEffect_nh(() => {
    // Delay particles initialization to allow the page to mount and settle first
    const handle = setTimeout(() => setActive(true), 250);
    return () => clearTimeout(handle);
  }, []);

  __useEffect_nh(() => {
    if (!active) return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, particles = [], raf = null, running = false, t = 0, frame = 0;
    const col = { a1:[249,115,22], a2:[251,191,36], dark:true };
    // reaktivní stav: obálky (rychlý náběh / pomalé doznívání), spektrum, beat, prstence
    const env = { bass:0, level:0, surge:0, flash:0, treble:0 };
    let binEnv = new Float32Array(128), bassHist = [], beatCool = 0, rings = [];

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
      return { x:Math.random()*W, y:Math.random()*H, r:0.6+Math.random()*1.5,
        vx:(Math.random()-0.5)*0.16, vy:-(0.05+Math.random()*0.2),
        ph:Math.random()*Math.PI*2, warm:Math.random(),
        bin: 2 + Math.floor(Math.random()*86),   // „svoje" frekvenční pásmo
        react: 0.7 + Math.random()*0.7,           // jak silně reaguje
        depth: Math.random(),                     // hloubka 0=daleko … 1=blízko (paralaxa)
        _x:0, _y:0 };
    }
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W*dpr));
      canvas.height = Math.max(1, Math.floor(H*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
      // hustota dle plochy viewportu (canvas je fixní = velikost okna)
      const target = Math.round(Math.min(120, Math.max(45, (W*H)/16000)));
      if (particles.length !== target) {
        if (target < particles.length) particles.length = target;
        else while (particles.length < target) particles.push(mk());
      }
    }
    function audioLevels() {
      const an = window.__jwAnalyser; if (!an) return null;
      try {
        const n = an.frequencyBinCount;
        const bins = new Uint8Array(n);
        an.getByteFrequencyData(bins);
        const avg = (a,b) => { a=Math.min(a,n); b=Math.min(b,n); let s=0; for (let i=a;i<b;i++) s+=bins[i]; return s/Math.max(1,(b-a)*255); };
        const bass = avg(1,7), lowmid = avg(7,18), mid = avg(18,42), treble = avg(42,96);
        if (bass+lowmid+mid+treble < 0.02) return null; // ticho / pauza → generativní režim
        const level = bass*0.5 + lowmid*0.25 + mid*0.15 + treble*0.10;
        return { bass, lowmid, mid, treble, level, bins };
      } catch (e) { return null; }
    }
    function draw() {
      t += 0.016; frame++;
      if (frame % 45 === 0) sampleTheme();
      ctx.clearRect(0,0,W,H);
      const a = audioLevels();
      const playing = !!a;
      const treble = a ? a.treble : 0;

      // --- obálky: rychlý náběh, pomalé doznívání = úderná reakce na beat ---
      if (playing) {
        const bins = a.bins;
        for (let i=0;i<binEnv.length;i++) {
          const v = i < bins.length ? bins[i]/255 : 0;
          binEnv[i] = v > binEnv[i] ? v : binEnv[i]*0.92;
        }
        env.bass  = a.bass  > env.bass  ? a.bass  : env.bass*0.90;
        env.level = a.level > env.level ? a.level : env.level*0.92;
        // detekce beatu: aktuální basy výrazně nad krátkodobým průměrem
        bassHist.push(a.bass); if (bassHist.length > 43) bassHist.shift();
        let m=0; for (const b of bassHist) m+=b; m/=bassHist.length;
        beatCool--;
        if (a.bass > 0.11 && a.bass > m*1.38 && beatCool <= 0) {
          env.flash = 1; env.surge = 1; beatCool = 7;
          rings.push({ r: Math.min(W,H)*0.05, a: 0.9, w: 1 + a.bass*2 });
        }
      } else {
        for (let i=0;i<binEnv.length;i++) binEnv[i] *= 0.90;
        env.bass *= 0.90; env.level *= 0.90;
      }
      env.flash *= 0.90; env.surge *= 0.90;
      env.treble += (treble - env.treble) * 0.15;  // dolnopropust na výšky → klidnější, ne tak roztřesené

      const idle = playing ? 0 : 0.10*(0.5 + 0.5*Math.sin(t*0.6)); // jemné dýchání v klidu
      const drive = Math.max(env.bass, idle);
      const lvl   = Math.max(env.level, idle);
      const cx = W/2, cy = H*0.5;
      const scroll = window.scrollY || window.pageYOffset || 0; // paralaxa: posun pozadí dle scrollu
      const bloom = drive*0.13;                       // basy „nadechnou" celé pole
      const speedM = 1 + env.surge*1.8 + env.treble*0.5;  // beat mírně zrychlí pohyb
      const linkDist = (playing ? 116 : 96) + lvl*64;

      ctx.globalCompositeOperation = col.dark ? 'lighter' : 'source-over';

      // expandující prstence vyslané na beat
      for (let i=rings.length-1;i>=0;i--) {
        const rg = rings[i];
        rg.r += 7 + env.level*10; rg.a *= 0.93;
        if (rg.a < 0.03) { rings.splice(i,1); continue; }
        ctx.strokeStyle = `rgba(${col.a1[0]},${col.a1[1]},${col.a1[2]},${rg.a*0.22})`;
        ctx.lineWidth = rg.w;
        ctx.beginPath(); ctx.arc(cx, cy, rg.r, 0, Math.PI*2); ctx.stroke();
      }

      // částice — každá svítí/roste podle „své" frekvence
      for (const p of particles) {
        p.x += p.vx*speedM; p.y += p.vy*speedM; p.ph += 0.018 + env.treble*0.05;
        if (p.y < -12) { p.y = H+12; p.x = Math.random()*W; }
        if (p.x < -12) p.x = W+12; else if (p.x > W+12) p.x = -12;
        const be = binEnv[p.bin] * p.react;          // 0..~1 dle spektra
        const pf = 0.02 + p.depth*0.10;              // hloubka → rychlost paralaxy
        const py = ((p.y - scroll*pf) % H + H) % H;  // posun dle scrollu, zabalený do výšky
        const dx = p.x + (p.x-cx)*bloom, dy = py + (py-cy)*bloom;
        p._x = dx; p._y = dy;
        const sizeD = 0.6 + p.depth*0.55, alphaD = 0.62 + p.depth*0.38; // blízké větší/jasnější
        const rr = Math.max(0.3, p.r*sizeD*(1 + drive*0.6 + be*2.1 + env.flash*0.6) + Math.sin(p.ph)*0.3);
        const c = p.warm < 0.5 ? col.a1 : col.a2;
        const al = Math.min(0.9, ((col.dark ? 0.13 : 0.18) + be*0.6 + env.flash*0.22) * alphaD);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${al})`;
        ctx.arc(dx, dy, rr, 0, Math.PI*2); ctx.fill();
      }

      // propojení — jas roste s hlasitostí a problikne na beat
      for (let i=0;i<particles.length;i++) {
        for (let j=i+1;j<particles.length;j++) {
          const A = particles[i], B = particles[j];
          const dx = A._x-B._x, dy = A._y-B._y, d = Math.hypot(dx,dy);
          if (d < linkDist) {
            const o = (1 - d/linkDist) * (col.dark ? 0.10 : 0.14) * (0.45 + lvl*1.4 + env.flash*0.5);
            ctx.strokeStyle = `rgba(${col.a1[0]},${col.a1[1]},${col.a1[2]},${Math.min(0.5,o)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(A._x,A._y); ctx.lineTo(B._x,B._y); ctx.stroke();
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
  }, [active]);
  return <canvas ref={ref} aria-hidden="true" style={{
    position:'fixed', inset:0, width:'100%', height:'100%', zIndex:-1, pointerEvents:'none',
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
    // Defer the initial check to avoid forced reflow during React mount
    const handle = setTimeout(fn, 150);
    window.addEventListener('scroll', fn, { passive: true });
    return () => {
      clearTimeout(handle);
      window.removeEventListener('scroll', fn);
    };
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
      color: active ? 'var(--bg)' : 'var(--muted)',
      border:`1px solid ${active ? 'var(--a1)' : 'var(--border)'}`,
      transition:'all 0.2s',
    }),
  };

  const links = [
    { href:'#music',   lbl: tx(lang, 'nav_music') },
    { href:'#apps',    lbl: tx(lang, 'nav_apps') },
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

function Hero({ lang, onPlay }) {
  const playFeatured = () => {
    const tracks = window.TRACKS_DATA || [];
    const featured = tracks.find(t => t.audioUrl) || tracks[0];
    if (featured && onPlay) onPlay(featured, tracks);
    const el = document.getElementById('music');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
  };
  return (
    <section id="hero" style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'90px 24px 80px',
      position:'relative', overflow:'hidden',
    }}>
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
          <Btn primary onClick={playFeatured}>{tx(lang, 'cta_music')}</Btn>
          <Btn href="#apps" outline>{tx(lang, 'cta_apps')}</Btn>
        </div>

        <div style={{ display:'flex', gap:56, justifyContent:'center', marginTop:80, flexWrap:'wrap' }}>
          {[
            { num:(window.APPS_DATA||[]).length,   suffix:'', lbl: tx(lang,'stat_apps'),   href:'#apps' },
            { num:(window.TRACKS_DATA||[]).length, suffix:'', lbl: tx(lang,'stat_tracks'), href:'#music' },
            { num:(window.ALBUMS||[]).length,      suffix:'', lbl: tx(lang,'stat_albums'), href:'#music' },
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

      <a href="#music" className="scroll-cue" aria-label="Scroll" style={{
        position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)',
        zIndex:1, color:'var(--muted)', display:'flex',
        animation:'scrollBob 2.2s ease-in-out infinite',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10l5 5 5-5"/></svg>
      </a>
    </section>
  );
}

Object.assign(window, { Nav, Hero, BackgroundFX });
