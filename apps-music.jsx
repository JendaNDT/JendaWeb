// apps-music.jsx — Apps + Music sections
const { useState: __useS, useEffect: __useE, useMemo: __useM, useCallback: __useC, useRef: __useR } = React;

function AppCard({ app, lang }) {
  const [hov, setHov] = __useS(false);
  const isPWA = app.platform === 'PWA';
  const caseStudyUrl = window.CASE_STUDIES?.[app.id];
  return (
    <a href={app.link} style={{
      background: hov ? 'rgba(255,255,255,0.065)' : 'var(--card)',
      border:`1px solid ${hov ? 'color-mix(in srgb, var(--border) 100%, ' + app.color + ' 30%)' : 'var(--border)'}`,
      borderRadius:'var(--r)', padding:'22px',
      transition:'all 0.25s',
      transform: hov ? 'translateY(-5px)' : 'none',
      boxShadow: hov ? `0 14px 44px ${app.color}1a` : 'none',
      display:'flex', flexDirection:'column', gap:14,
      color:'inherit', textDecoration:'none', position:'relative',
    }}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {caseStudyUrl && (
        <span style={{
          position:'absolute', top:14, right:14,
          fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:20,
          textTransform:'uppercase', letterSpacing:'0.08em',
          background:'color-mix(in srgb, var(--a2) 16%, transparent)',
          color:'var(--a2)',
          border:'1px solid color-mix(in srgb, var(--a2) 40%, transparent)',
        }}>★ {tx(lang,'cs_label')}</span>
      )}
      <div style={{
        width:52, height:52, borderRadius:13,
        background:`linear-gradient(135deg, ${app.color}28, ${app.color}50)`,
        border:`1px solid ${app.color}40`,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:app.color,
      }}>{app.name[0]}</div>
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
      <div style={{ display:'flex', gap:8 }}>
        {caseStudyUrl && (
          <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.location.href = caseStudyUrl; }} style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:5,
            padding:'9px 14px', borderRadius:8, flex:'0 0 auto',
            background: 'transparent', color:'var(--a2)',
            border:'1px solid color-mix(in srgb, var(--a2) 40%, transparent)',
            fontSize:12, fontWeight:600, transition:'all 0.2s', fontFamily:'inherit',
          }}>
            {tx(lang,'cs_label')} →
          </button>
        )}
        <span style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:7, flex:1,
          padding:'9px 0', borderRadius:8,
          background: hov ? app.color : 'transparent',
          color: hov ? '#fff' : app.color,
          border:`1px solid ${app.color}55`,
          fontSize:13, fontWeight:600, transition:'all 0.2s',
        }}>
          <DlIco />
          {isPWA ? tx(lang, 'apps_open') : tx(lang, 'apps_dl')}
        </span>
      </div>
    </a>
  );
}

function AppsSection({ lang }) {
  const [filter, setFilter] = __useS('all');
  const [query, setQuery] = __useS('');
  const [ref, vis] = useInView();
  const apps = window.APPS_DATA || [];
  const filtered = __useM(() => {
    const q = query.trim().toLowerCase();
    return apps.filter(a => {
      if (filter !== 'all' && a.platform !== filter) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.cs.toLowerCase().includes(q) || a.en.toLowerCase().includes(q);
    });
  }, [filter, query, apps]);

  const pills = [
    { k:'all',     lbl: tx(lang,'apps_all') },
    { k:'PWA',     lbl: 'PWA',     count: apps.filter(a=>a.platform==='PWA').length },
    { k:'Android', lbl: 'Android', count: apps.filter(a=>a.platform==='Android').length },
  ];

  return (
    <section id="apps" style={{ padding:'110px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionLabel color="a1" num="01">{tx(lang,'apps_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:28 }}>
          {lang==='cs' ? `${apps.length} aplikací · PWA & nativní Android` : `${apps.length} apps · PWA & native Android`}
        </p>
        <div style={{ display:'flex', gap:14, marginBottom:38, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
            {pills.map(p => (
              <button key={p.k} onClick={() => setFilter(p.k)} style={{
                padding:'7px 18px', borderRadius:50, fontSize:13, fontWeight:600,
                background: filter===p.k ? 'var(--a1)' : 'transparent',
                color: filter===p.k ? '#fff' : 'var(--muted)',
                border:`1px solid ${filter===p.k ? 'var(--a1)' : 'var(--border)'}`,
                transition:'all 0.2s', display:'flex', alignItems:'center', gap:6,
              }}>
                {p.lbl}
                {p.count !== undefined && <span style={{ opacity:0.65, fontSize:11 }}>{p.count}</span>}
              </button>
            ))}
          </div>
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            padding:'7px 14px', borderRadius:50,
            background:'var(--card)', border:'1px solid var(--border)',
            minWidth:200, flex:'0 1 280px',
            transition:'border-color 0.2s',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color:'var(--muted)', flexShrink:0 }}>
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              id="apps-search-input"
              name="search"
              type="text"
              autoComplete="off"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tx(lang,'apps_search')}
              aria-label={tx(lang,'apps_search')}
              style={{
                flex:1, minWidth:0, border:'none', outline:'none', background:'transparent',
                color:'var(--text)', fontSize:13, fontFamily:'inherit',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color:'var(--muted)', display:'flex', padding:2 }} aria-label="Clear">
                <CloseIco />
              </button>
            )}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div style={{
            padding:'60px 24px', textAlign:'center',
            border:'1px dashed var(--border)', borderRadius:'var(--r)',
            color:'var(--muted)', fontSize:14,
          }}>
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none" style={{ marginBottom:14, opacity:0.45 }}>
              <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="2"/>
              <line x1="40" y1="40" x2="54" y2="54" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="22" y1="28" x2="34" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <div style={{ marginBottom:16 }}>{tx(lang,'apps_empty')}</div>
            {(query || filter !== 'all') && (
              <button onClick={() => { setQuery(''); setFilter('all'); }} style={{
                padding:'8px 18px', borderRadius:50, fontSize:12, fontWeight:600,
                background:'transparent', color:'var(--a1)',
                border:'1px solid color-mix(in srgb, var(--a1) 40%, transparent)',
              }}>
                {lang === 'cs' ? 'Vymazat filtr' : 'Clear filter'}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:18 }}>
            {filtered.map((app, i) => (
              <div key={app.id} className="card-animate" style={{ animationDelay:`${Math.min(i,8)*35}ms` }}>
                <AppCard app={app} lang={lang} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AlbumCard({ album, lang, onPlay, onFilter, selected, nowPlaying }) {
  const [hov, setHov] = __useS(false);
  const tracks = (window.TRACKS_DATA || []).filter(t => t.album === album.id);
  const playAlbum = (e) => { e?.stopPropagation?.(); if (tracks.length) onPlay(tracks[0], tracks); };
  const showAlbum = (e) => { e?.stopPropagation?.(); onFilter && onFilter(album.id); };
  return (
    <div role="button" tabIndex={0}
      onClick={playAlbum}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playAlbum(e); } }}
      aria-label={`${tx(lang,'music_play_album')}: ${album.title}`}
      className={nowPlaying ? 'album-playing' : ''}
      style={{
        borderRadius:'var(--r)', overflow:'hidden',
        border:`1px solid ${selected ? 'color-mix(in srgb, var(--a1) 60%, transparent)' : 'var(--border)'}`,
        transition:'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out), border-color var(--dur) var(--ease-out)',
        transform: hov ? 'translateY(-6px) rotate(-0.6deg) scale(1.012)' : 'none',
        boxShadow: hov ? 'var(--shadow-3)' : selected ? '0 0 0 1px var(--a1) inset, var(--shadow-1)' : 'var(--shadow-1)',
        cursor:'pointer',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ height:175, position:'relative', backgroundImage:`url("${album.cover_url || albumArt(album)}")`, backgroundSize:'cover', backgroundPosition:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 28% 28%, rgba(255,255,255,0.12), transparent 60%), linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45))' }} />
        <div style={{ position:'absolute', bottom:14, left:16, right:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, color:'#fff', textShadow:'0 2px 10px rgba(0,0,0,0.6)', lineHeight:1.15 }}>{album.title}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.78)', marginTop:3, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>{album.genre}</div>
        </div>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.38)', opacity: hov?1:0, transition:'opacity 0.2s', pointerEvents:'none' }}>
          <div style={{
            width:50, height:50, borderRadius:'50%', background:'rgba(255,255,255,0.95)',
            color:'#0a0a14',
            display:'flex', alignItems:'center', justifyContent:'center',
            transform: hov ? 'scale(1)' : 'scale(0.75)', transition:'transform 0.25s',
            boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <PlayIco />
          </div>
        </div>
      </div>
      <div style={{ background:'var(--card)', borderTop:'1px solid var(--border)', padding:'14px 16px' }}>
        <p style={{ fontSize:12, color:'var(--muted)', lineHeight:1.45 }}>{lang==='cs' ? album.cs : album.en}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, gap:8 }}>
          <span style={{ fontSize:11, color:'var(--muted)', opacity:0.55 }}>
            {album.tracks} {tx(lang,'tracks_label')} · {album.year}
          </span>
          {onFilter && (
            <button onClick={showAlbum} style={{
              fontSize:11, fontWeight:600, color:'var(--a2)',
              padding:'2px 0', borderBottom:'1px dashed color-mix(in srgb, var(--a2) 40%, transparent)',
              borderRadius:0,
            }}>
              {tx(lang,'music_tracks')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TrackRow({ track, album, idx, active, playing, onPlay }) {
  const [hov, setHov] = __useS(false);
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
      <div style={{ width:28, textAlign:'center', color: active ? 'var(--a1)' : 'var(--muted)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {active && playing ? <EqBars /> : (hov || active) ? <PlayIco /> : <span style={{ fontSize:13 }}>{idx + 1}</span>}
      </div>
      <div style={{ width:38, height:38, borderRadius:7, flexShrink:0, backgroundImage:`url("${trackArt(track.id, album)}")`, backgroundSize:'cover' }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:600, color: active?'var(--a1)':'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track.title}</div>
        <div style={{ fontSize:12, color:'var(--muted)', marginTop:1 }}>{album?.title || ''}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
        {track.plays > 0 && (
          <span title={`${track.plays}× přehráno`} style={{ fontSize:12, color:'var(--muted)', opacity:0.7, fontVariantNumeric:'tabular-nums', display:'flex', alignItems:'center', gap:3 }}>
            <span style={{ fontSize:8 }}>▶</span>{track.plays >= 1000 ? (track.plays/1000).toFixed(1).replace('.0','')+'k' : track.plays}
          </span>
        )}
        {track.downloadUrl && (
          <a href={track.downloadUrl} onClick={e => e.stopPropagation()} aria-label="Download" style={{ color:'var(--muted)', opacity:0.6, display:'flex' }}><DlIco /></a>
        )}
        <span style={{ fontSize:13, color:'var(--muted)' }}>{track.duration}</span>
      </div>
    </div>
  );
}

function MusicSection({ lang, onPlay, currentTrack, playing }) {
  const [ref, vis] = useInView();
  const [albumFilter, setAlbumFilter] = __useS('all');
  const trackListRef = __useR(null);
  const albums = window.ALBUMS || [];
  const tracks = window.TRACKS_DATA || [];
  const albumMap = __useM(() => Object.fromEntries(albums.map(a => [a.id, a])), []);
  const filteredTracks = __useM(
    () => albumFilter === 'all' ? tracks : tracks.filter(t => t.album === albumFilter),
    [albumFilter, tracks]
  );

  const filterByAlbum = __useC((id) => {
    setAlbumFilter(id);
    setTimeout(() => {
      const el = trackListRef.current;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }, 50);
  }, []);

  return (
    <section id="music" style={{ padding:'110px 24px' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionLabel color="a2" num="02">{tx(lang,'music_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:52 }}>
          200+ {tx(lang,'music_sub')}
        </p>

        <SubLabel>{tx(lang,'music_albums')}</SubLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:18, marginBottom:64 }}>
          {albums.map(a => (
            <AlbumCard key={a.id} album={a} lang={lang} onPlay={onPlay} onFilter={filterByAlbum} selected={albumFilter === a.id} nowPlaying={!!(playing && currentTrack && currentTrack.album === a.id)} />
          ))}
        </div>

        <div ref={trackListRef}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:12, flexWrap:'wrap' }}>
            <SubLabel>{tx(lang,'music_tracks')}</SubLabel>
            <span style={{ fontSize:12, color:'var(--muted)', opacity:0.6 }}>
              {filteredTracks.length} {tx(lang,'tracks_label')}
            </span>
          </div>

          <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
            <button onClick={() => setAlbumFilter('all')} style={{
              padding:'6px 14px', borderRadius:50, fontSize:12, fontWeight:600,
              background: albumFilter === 'all' ? 'var(--a1)' : 'transparent',
              color: albumFilter === 'all' ? '#fff' : 'var(--muted)',
              border: `1px solid ${albumFilter === 'all' ? 'var(--a1)' : 'var(--border)'}`,
              transition:'all 0.2s',
            }}>
              {tx(lang,'music_filter_all')}
            </button>
            {albums.map(a => {
              const on = albumFilter === a.id;
              return (
                <button key={a.id} onClick={() => setAlbumFilter(a.id)} style={{
                  padding:'6px 14px', borderRadius:50, fontSize:12, fontWeight:600,
                  background: on ? `linear-gradient(135deg, ${a.g1}, ${a.g2})` : 'transparent',
                  color: on ? '#fff' : 'var(--muted)',
                  border: `1px solid ${on ? 'transparent' : 'var(--border)'}`,
                  transition:'all 0.2s',
                }}>
                  {a.title}
                </button>
              );
            })}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {filteredTracks.map((tr, i) => (
              <TrackRow key={tr.id} track={tr} album={albumMap[tr.album]} idx={i} active={currentTrack?.id === tr.id} playing={playing} onPlay={(t) => onPlay(t, filteredTracks)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { AppCard, AppsSection, AlbumCard, TrackRow, MusicSection });
