// extras.jsx — Newsletter, public stats, comparison playground, donation widget
const { useState: __useS_ex, useEffect: __useE_ex, useMemo: __useM_ex } = React;

// ── Newsletter ──────────────────────────────────────────────────────────
function NewsletterSection({ lang }) {
  const [ref, vis] = useInView();
  const [email, setEmail] = __useS_ex('');
  const [status, setStatus] = __useS_ex('idle'); // idle | sending | ok | err
  const endpoint = window.NEWSLETTER_ENDPOINT;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setStatus('err'); return; }
    if (!endpoint) { setStatus('ok'); return; } // friendly fallback
    setStatus('sending');
    try {
      const form = new FormData();
      form.append('email', email);
      await fetch(endpoint, { method:'POST', body: form, mode:'no-cors' });
      setStatus('ok'); setEmail('');
    } catch { setStatus('err'); }
  };

  return (
    <section style={{ padding:'80px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{
        maxWidth:680, margin:'0 auto',
        padding:'44px 36px',
        border:'1px solid var(--border)',
        borderRadius:'var(--r)',
        background:'color-mix(in srgb, var(--a1) 4%, var(--card))',
        textAlign:'center',
        position:'relative', overflow:'hidden',
      }}>
        <div aria-hidden style={{
          position:'absolute', top:'-30%', right:'-10%', width:280, height:280,
          borderRadius:'50%',
          background:'radial-gradient(circle, var(--a1), transparent 70%)',
          opacity:0.12, filter:'blur(50px)', pointerEvents:'none',
        }} />

        <div style={{
          display:'inline-flex', alignItems:'center', gap:7,
          fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase',
          color:'var(--a1)', marginBottom:16, position:'relative',
        }}>
          ⌁ {tx(lang,'newsletter_title')}
        </div>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:22, position:'relative' }}>
          {tx(lang,'newsletter_desc')}
        </p>

        {status === 'ok' ? (
          <p style={{ color:'var(--a1)', fontWeight:600, fontSize:15, position:'relative' }}>
            ✓ {tx(lang,'newsletter_ok')}
          </p>
        ) : (
          <form onSubmit={onSubmit} style={{
            display:'flex', gap:8, maxWidth:420, margin:'0 auto',
            flexWrap:'wrap', position:'relative',
          }}>
            <input
              id="nl-email"
              name="email"
              type="email" required
              autoComplete="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === 'err') setStatus('idle'); }}
              placeholder={tx(lang,'newsletter_email')}
              aria-label={tx(lang,'newsletter_email')}
              style={{
                flex:'1 1 220px', minWidth:0, padding:'12px 16px',
                background:'var(--card)',
                border:`1px solid ${status==='err' ? '#f87171' : 'var(--border)'}`,
                borderRadius:50,
                color:'var(--text)', fontFamily:'inherit', fontSize:14,
                outline:'none', transition:'border-color 0.2s',
              }}
            />
            <button type="submit" disabled={status === 'sending'} style={{
              padding:'12px 26px', borderRadius:50,
              background:'var(--a1)', color: status === 'sending' ? 'var(--muted)' : 'var(--bg)',
              fontWeight:600, fontSize:14, fontFamily:'inherit',
              border:'1px solid var(--a1)', cursor: status === 'sending' ? 'wait' : 'pointer',
              boxShadow:'0 0 20px var(--glow)',
              transition:'transform 0.15s',
            }}>
              {tx(lang,'newsletter_sub')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Public stats / build log ────────────────────────────────────────────
function StatsSection({ lang }) {
  const [ref, vis] = useInView();
  const s = window.PUBLIC_STATS || {};
  const log = window.BUILD_LOG || [];

  const albumsCount = (window.ALBUMS || []).length;
  const appsCount = (window.APPS_DATA || []).length;
  const tracksCount = (window.TRACKS_DATA || []).length;
  const studiesCount = Object.keys(window.CASE_STUDIES || {}).length;

  return (
    <section style={{ padding:'90px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1100, margin:'0 auto' }}>
        <SubLabel>{tx(lang,'stats_title')}</SubLabel>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14, marginBottom:42 }}>
          {[
            { num: albumsCount,  lbl: tx(lang,'stats_albums') },
            { num: appsCount,    lbl: tx(lang,'stats_apps') },
            { num: tracksCount,  lbl: tx(lang,'stats_tracks') },
            { num: studiesCount, lbl: tx(lang,'stats_studies') },
          ].map((m, i) => {
            const [r, v] = useCountUp(m.num || 0);
            return (
              <div key={i} ref={r} style={{
                padding:'24px 22px',
                background:'var(--card)',
                border:'1px solid var(--border)',
                borderRadius:'var(--r)',
                boxShadow:'var(--shadow-1)',
              }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:38, fontWeight:800, color:'var(--a1)', lineHeight:1, marginBottom:8, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>
                  {Math.round(v)}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:'0.04em' }}>{m.lbl}</div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:14, opacity:0.7 }}>
          {tx(lang,'stats_recent')}
        </p>
        <div style={{
          background:'var(--card)',
          border:'1px solid var(--border)',
          borderRadius:'var(--r)',
          padding:'4px 0',
        }}>
          {log.map((e, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'baseline', gap:18,
              padding:'12px 22px',
              borderBottom: i < log.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                fontFamily:'ui-monospace, SF Mono, Consolas, monospace',
                fontSize:12, color:'var(--a1)',
                minWidth:70, fontVariantNumeric:'tabular-nums',
              }}>{e.date}</span>
              <span style={{ fontSize:14, color:'var(--text)', flex:1, lineHeight:1.5 }}>
                {lang === 'cs' ? e.cs : e.en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Comparison playground ───────────────────────────────────────────────
function ComparisonSection({ lang }) {
  const [ref, vis] = useInView();
  const cfg = window.COMPARISON || { apps:[], rows:[], data:{} };
  const apps = __useM_ex(() => {
    const all = window.APPS_DATA || [];
    return cfg.apps.map(id => all.find(a => a.id === id)).filter(Boolean);
  }, []);

  if (!apps.length) return null;

  const renderCell = (val) => {
    if (val === true)  return <span style={{ color:'#4ade80', fontWeight:700 }}>✓</span>;
    if (val === false) return <span style={{ color:'var(--muted)', opacity:0.5 }}>—</span>;
    if (val && typeof val === 'object' && (val.cs || val.en)) return <span style={{ color:'var(--text)' }}>{lang==='cs'?val.cs:val.en}</span>;
    return <span style={{ color:'var(--text)' }}>{val}</span>;
  };

  return (
    <section style={{ padding:'90px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1000, margin:'0 auto' }}>
        <SectionLabel color="a2" num="03">{tx(lang,'compare_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:36 }}>
          {tx(lang,'compare_desc')}
        </p>

        <div style={{ overflowX:'auto', border:'1px solid var(--border)', borderRadius:'var(--r)', background:'var(--card)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:520 }}>
            <thead>
              <tr>
                <th style={{ padding:'18px 20px', textAlign:'left', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', opacity:0.7, borderBottom:'1px solid var(--border)' }}>
                  {/* spacer */}
                </th>
                {apps.map(a => (
                  <th key={a.id} style={{ padding:'16px 20px', textAlign:'left', borderBottom:'1px solid var(--border)', verticalAlign:'top' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:32, height:32, borderRadius:8, flexShrink:0,
                        background:`linear-gradient(135deg, ${a.color}28, ${a.color}50)`,
                        border:`1px solid ${a.color}40`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:a.color,
                      }}>{a.name[0]}</div>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'var(--text)' }}>{a.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cfg.rows.map((r, ri) => (
                <tr key={r.key}>
                  <th scope="row" style={{
                    padding:'14px 20px', fontSize:13, color:'var(--muted)',
                    borderBottom: ri < cfg.rows.length - 1 ? '1px solid var(--border)' : 'none',
                    width:'30%',
                    textAlign:'left', fontWeight:'normal',
                  }}>{lang === 'cs' ? r.cs : r.en}</th>
                  {apps.map(a => (
                    <td key={a.id} style={{
                      padding:'14px 20px', fontSize:14,
                      borderBottom: ri < cfg.rows.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      {renderCell(cfg.data[a.id]?.[r.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── Donation widget (inline button) ────────────────────────────────────
function DonationButton({ lang }) {
  const u = window.KOFI_USERNAME;
  if (!u) {
    // Placeholder card when no Ko-fi configured yet
    return (
      <div style={{
        display:'inline-flex', alignItems:'center', gap:10,
        padding:'10px 20px', borderRadius:50,
        border:'1px dashed var(--border)', color:'var(--muted)',
        fontSize:13, opacity:0.6,
      }}>
        ☕ {tx(lang,'donate_label')} <span style={{ fontSize:10, fontFamily:'ui-monospace,monospace', opacity:0.7 }}>(soon)</span>
      </div>
    );
  }
  return (
    <a href={`https://ko-fi.com/${u}`} target="_blank" rel="noopener noreferrer" style={{
      display:'inline-flex', alignItems:'center', gap:10,
      padding:'12px 24px', borderRadius:50,
      background:'#29abe0', color:'#fff',
      fontWeight:600, fontSize:14, fontFamily:'inherit',
      boxShadow:'0 4px 20px rgba(41,171,224,0.3)',
      transition:'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform='none'}>
      ☕ {tx(lang,'donate_label')}
    </a>
  );
}

// ── Most Played (reads localStorage.jw_plays counter) ───────────────────
function MostPlayedSection({ lang, onPlay, currentTrack, playing }) {
  const [ref, vis] = useInView();
  const [tick, setTick] = __useS_ex(0);

  __useE_ex(() => {
    const id = setInterval(() => setTick(t => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const top = __useM_ex(() => {
    // Reálná globální čísla z DB (window.TRACKS_DATA[].plays), průběžně i optimisticky.
    const tracks = window.TRACKS_DATA || [];
    return tracks
      .map(t => ({ track: t, count: t.plays || 0 }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [tick]);

  if (top.length === 0) return null;
  const albums = window.ALBUMS || [];
  const albumMap = Object.fromEntries(albums.map(a => [a.id, a]));
  const max = top[0].count;

  return (
    <section style={{ padding:'80px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:760, margin:'0 auto' }}>
        <SubLabel>{lang === 'cs' ? 'Nejvíce poslouchané' : 'Most played'}</SubLabel>
        <div style={{
          background:'var(--card)', border:'1px solid var(--border)',
          borderRadius:'var(--r)', padding:'6px',
        }}>
          {top.map((row, i) => {
            const al = albumMap[row.track.album];
            const active = currentTrack?.id === row.track.id;
            return (
              <button key={row.track.id} onClick={() => onPlay(row.track, top.map(r => r.track))}
                style={{
                  width:'100%', display:'flex', alignItems:'center', gap:14,
                  padding:'12px 16px', borderRadius:10, textAlign:'left',
                  background: active ? 'color-mix(in srgb, var(--a1) 12%, transparent)' : 'transparent',
                  border: `1px solid ${active ? 'color-mix(in srgb, var(--a1) 40%, transparent)' : 'transparent'}`,
                  cursor:'pointer', transition:'background 0.12s',
                }}>
                <div style={{ width:24, fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:'var(--a1)', textAlign:'center' }}>
                  {active && playing ? <EqBars /> : `#${i + 1}`}
                </div>
                <div style={{ width:38, height:38, borderRadius:7, flexShrink:0, backgroundImage:`url("${trackArt(row.track, al)}")`, backgroundSize:'cover' }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color: active ? 'var(--a1)' : 'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{row.track.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{al?.title || ''}</div>
                </div>
                <div style={{ minWidth:80, textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--muted)', fontVariantNumeric:'tabular-nums' }}>
                    {row.count}×
                  </div>
                  <div style={{ height:3, width:'100%', maxWidth:80, marginTop:5, marginLeft:'auto', background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ width:`${(row.count / max) * 100}%`, height:'100%', background:'var(--a1)' }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { NewsletterSection, StatsSection, ComparisonSection, DonationButton, MostPlayedSection });
