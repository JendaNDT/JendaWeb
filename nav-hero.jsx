// nav-hero.jsx — Top navigation + hero section
// Depends on shared.jsx (window globals).
const { useState: __useState_nh, useEffect: __useEffect_nh } = React;

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
    <section id="hero" className="hero-noise" style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'90px 24px 80px',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:'-15%', right:'-8%', width:580, height:580, borderRadius:'50%', background:'radial-gradient(circle, var(--a1), transparent 70%)', opacity:0.13, filter:'blur(90px)', pointerEvents:'none', animation:'float1 22s ease-in-out infinite alternate' }} />
      <div style={{ position:'absolute', bottom:'-15%', left:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, var(--a2), transparent 70%)', opacity:0.11, filter:'blur(90px)', pointerEvents:'none', animation:'float2 28s ease-in-out infinite alternate' }} />
      <div style={{ position:'absolute', top:'40%', left:'20%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, var(--a1), transparent 70%)', opacity:0.06, filter:'blur(60px)', pointerEvents:'none', animation:'float2 18s ease-in-out infinite alternate-reverse' }} />

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
