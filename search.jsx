// search.jsx — Global Cmd+K search overlay across apps, albums, tracks, case studies
const { useState: __useS_sr, useEffect: __useE_sr, useRef: __useR_sr, useMemo: __useM_sr } = React;

function SearchOverlay({ lang, onClose, onPlay }) {
  const [query, setQuery] = __useS_sr('');
  const [activeIdx, setActiveIdx] = __useS_sr(0);
  const inputRef = __useR_sr(null);

  __useE_sr(() => { inputRef.current?.focus(); }, []);

  // Build index once per overlay open
  const index = __useM_sr(() => {
    const apps = (window.APPS_DATA || []).map(a => ({
      type: 'app',
      id: `app-${a.id}`,
      title: a.name,
      sub: lang === 'cs' ? a.cs : a.en,
      tag: a.platform,
      color: a.color,
      hay: `${a.name} ${a.cs} ${a.en} ${a.platform}`.toLowerCase(),
      action: () => {
        if (window.CASE_STUDIES?.[a.id]) { window.location.href = window.CASE_STUDIES[a.id]; }
        else if (a.link && a.link !== '#') { window.location.href = a.link; }
        else { history.replaceState(null, '', '#apps'); window.scrollTo({ top: document.getElementById('apps').offsetTop - 60, behavior: 'smooth' }); }
      },
    }));
    const albums = (window.ALBUMS || []).map(al => ({
      type: 'album',
      id: `album-${al.id}`,
      title: al.title,
      sub: al.genre,
      tag: `${al.tracks} tracks · ${al.year}`,
      hay: `${al.title} ${al.genre} ${al.cs} ${al.en}`.toLowerCase(),
      g1: al.g1, g2: al.g2,
      action: () => { window.location.hash = `album=${al.id}`; },
    }));
    const tracks = (window.TRACKS_DATA || []).map(t => {
      const al = (window.ALBUMS || []).find(a => a.id === t.album);
      return {
        type: 'track',
        id: `track-${t.id}`,
        title: t.title,
        sub: al?.title || '',
        tag: t.duration,
        hay: `${t.title} ${al?.title || ''} ${al?.genre || ''}`.toLowerCase(),
        g1: al?.g1, g2: al?.g2,
        action: () => {
          if (onPlay) onPlay(t, window.TRACKS_DATA || []);
          history.replaceState(null, '', `#track=${t.id}`);
        },
      };
    });
    const cs = Object.entries(window.CASE_STUDIES || {}).map(([appId, url]) => {
      const a = (window.APPS_DATA || []).find(x => x.id === Number(appId));
      if (!a) return null;
      return {
        type: 'case-study',
        id: `cs-${appId}`,
        title: a.name,
        sub: tx(lang, 'cs_label'),
        tag: '★',
        color: a.color,
        hay: `${a.name} case study ${a.cs} ${a.en}`.toLowerCase(),
        action: () => { window.location.href = url; },
      };
    }).filter(Boolean);
    return [...apps, ...cs, ...albums, ...tracks];
  }, [lang]);

  const results = __useM_sr(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 10);
    const matches = index.filter(item => item.hay.includes(q));
    // Score by: prefix match in title > substring in title > else
    matches.sort((a, b) => {
      const at = a.title.toLowerCase();
      const bt = b.title.toLowerCase();
      const ap = at.startsWith(q) ? 0 : at.includes(q) ? 1 : 2;
      const bp = bt.startsWith(q) ? 0 : bt.includes(q) ? 1 : 2;
      return ap - bp;
    });
    return matches.slice(0, 12);
  }, [query, index]);

  __useE_sr(() => { setActiveIdx(0); }, [query]);

  __useE_sr(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(results.length - 1, i + 1)); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const r = results[activeIdx];
        if (r) { r.action(); onClose(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [results, activeIdx, onClose]);

  const typeLabel = {
    app: lang === 'cs' ? 'Aplikace' : 'App',
    album: lang === 'cs' ? 'Album' : 'Album',
    track: lang === 'cs' ? 'Skladba' : 'Track',
    'case-study': lang === 'cs' ? 'Případová studie' : 'Case study',
  };
  const typeColor = {
    app: 'var(--a1)',
    album: 'var(--a2)',
    track: 'var(--a1)',
    'case-study': 'var(--a2)',
  };

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label="Search"
      style={{
        position:'fixed', inset:0, zIndex:400,
        background:'color-mix(in srgb, var(--bg) 60%, rgba(0,0,0,0.6))', backdropFilter:'blur(10px)',
        display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'15vh',
        animation:'overlayIn 0.16s ease',
      }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'var(--r)',
        width:'100%', maxWidth:560, margin:'0 20px',
        boxShadow:'0 30px 80px rgba(0,0,0,0.6)',
        animation:'overlayPop 0.2s ease',
        overflow:'hidden', display:'flex', flexDirection:'column',
      }}>
        {/* Input row */}
        <div style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'18px 22px', borderBottom:'1px solid var(--border)',
        }}>
          <SearchIco />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'cs' ? 'Hledat aplikace, alba, skladby…' : 'Search apps, albums, tracks…'}
            aria-label="Search"
            style={{
              flex:1, border:'none', outline:'none', background:'transparent',
              color:'var(--text)', fontSize:16, fontFamily:'inherit',
            }}
          />
          <kbd>Esc</kbd>
        </div>

        {/* Results */}
        <div style={{ overflowY:'auto', maxHeight:'min(60vh, 480px)', padding:'8px' }}>
          {results.length === 0 ? (
            <div style={{ padding:'40px 20px', textAlign:'center', color:'var(--muted)', fontSize:14 }}>
              {lang === 'cs' ? 'Nic nenalezeno.' : 'No results.'}
            </div>
          ) : results.map((r, i) => (
            <button key={r.id}
              onClick={() => { r.action(); onClose(); }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                width:'100%', display:'flex', alignItems:'center', gap:12,
                padding:'10px 14px', borderRadius:8, textAlign:'left',
                background: i === activeIdx ? 'color-mix(in srgb, var(--a1) 12%, transparent)' : 'transparent',
                border:`1px solid ${i === activeIdx ? 'color-mix(in srgb, var(--a1) 30%, transparent)' : 'transparent'}`,
                transition:'all 0.1s', marginBottom:2,
              }}>
              {/* Avatar */}
              <div style={{
                width:34, height:34, borderRadius:7, flexShrink:0,
                background: r.type === 'track'
                  ? `url("${(window.trackArt || (()=>'')) (Number((r.id||'').split('-')[1]) || 1, {g1:r.g1, g2:r.g2})}") center/cover`
                  : r.g1 ? `linear-gradient(135deg, ${r.g1}, ${r.g2})`
                  : r.color ? `linear-gradient(135deg, ${r.color}28, ${r.color}50)`
                  : 'var(--card)',
                border: r.color ? `1px solid ${r.color}40` : '1px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13,
                color: r.color || 'var(--muted)',
              }}>{r.type === 'track' ? '' : r.title[0]}</div>
              {/* Title + sub */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.title}</div>
                <div style={{ fontSize:12, color:'var(--muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.sub}</div>
              </div>
              {/* Type pill */}
              <span style={{
                fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                padding:'3px 8px', borderRadius:20,
                background: `color-mix(in srgb, ${typeColor[r.type]} 12%, transparent)`,
                color: typeColor[r.type],
                border: `1px solid color-mix(in srgb, ${typeColor[r.type]} 30%, transparent)`,
                flexShrink:0,
              }}>{typeLabel[r.type]}</span>
              {r.tag && r.type === 'track' && (
                <span style={{ fontSize:11, color:'var(--muted)', flexShrink:0, fontVariantNumeric:'tabular-nums' }}>{r.tag}</span>
              )}
            </button>
          ))}
        </div>

        {/* Hint footer */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'10px 16px', borderTop:'1px solid var(--border)',
          fontSize:11, color:'var(--muted)', opacity:0.7,
        }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <span style={{ display:'flex', gap:5, alignItems:'center' }}><kbd>↑↓</kbd> navigate</span>
            <span style={{ display:'flex', gap:5, alignItems:'center' }}><kbd>↵</kbd> open</span>
          </div>
          <span>{results.length} {results.length === 1 ? 'result' : 'results'}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SearchOverlay });
