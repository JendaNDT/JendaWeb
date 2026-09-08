// apps-music.jsx — Apps + Music sections
const { useState: __useS, useEffect: __useE, useMemo: __useM, useCallback: __useC, useRef: __useR } = React;

function AppCard({ app, lang, mode = 'live' }) {
  const [hov, setHov] = __useS(false);
  const isPWA = app.platform === 'PWA';
  const caseStudyUrl = window.CASE_STUDIES?.[app.id] || app.case_study_url;
  
  return (
    <a href={'#app=' + slugify(app.name)} className="app-card" style={{
      background: hov ? 'rgba(255,255,255,0.065)' : 'var(--card)',
      border:`1px solid ${hov ? 'color-mix(in srgb, var(--border) 100%, ' + app.color + ' 30%)' : 'var(--border)'}`,
      borderRadius:'var(--r)', padding:'22px',
      transition:'all 0.25s',
      transform: hov ? 'translateY(-5px)' : 'none',
      boxShadow: hov ? `0 14px 44px ${app.color}1a` : 'none',
      display:'flex', flexDirection:'column', gap:14,
      color:'inherit', textDecoration:'none', position:'relative',
      height: '100%',
    }}
    onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {mode === 'live' && caseStudyUrl && (
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
        overflow:'hidden'
      }}>
        {app.icon_url ? (
          <img src={app.icon_url} alt={app.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          app.name[0]
        )}
      </div>
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
          {appCopy(app, lang).intro}
        </p>
      </div>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontSize:12, fontWeight:600, color: app.color, marginTop: 'auto',
        borderTop: '1px solid var(--border)', paddingTop: 12, opacity: hov ? 1 : 0.8,
        transition: 'opacity 0.2s'
      }}>
        <span>{lang === 'cs' ? 'Zobrazit detail' : 'View detail'}</span>
        <span>→</span>
      </div>
    </a>
  );
}

function AppsSection({ lang }) {
  const [filter, setFilter] = __useS('all');
  const [query, setQuery] = __useS('');
  const [showStudies, setShowStudies] = __useS(false);
  const [ref, vis] = useInView();
  const apps = window.APPS_DATA || [];
  const live = apps.filter(isLiveApp);
  const studies = apps.filter(a => !isLiveApp(a));
  const q = query.trim().toLocaleLowerCase();
  const matches = a => (!q || [a.name, a.cs, a.en].some(t => String(t || '').toLocaleLowerCase().includes(q)))
    && (filter === 'all' || a.platform === filter);
  const matchingLive = live.filter(matches);
  const matchingStudies = studies.filter(matches);
  const featured = featuredAppSlugs.map(slug => matchingLive.find(a => slugify(a.name) === slug)).filter(Boolean);
  const otherLive = matchingLive.filter(a => !featured.includes(a));
  const browsing = !q && filter === 'all';
  const pills = [
    { key: 'all', label: lang === 'cs' ? 'Vše' : 'All', count: live.length },
    ...['PWA', 'Android'].map(key => ({ key, label: key, count: live.filter(a => a.platform === key).length })),
  ];
  const cards = (items, mode = 'live') => (
    <div className="apps-grid">
      {items.map(app => <AppCard key={app.id} app={app} lang={lang} mode={mode} />)}
    </div>
  );

  return (
    <section id="apps" style={{ padding:'90px 24px' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionLabel color="a1" num="02">{tx(lang,'apps_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:28 }}>
          {lang === 'cs' ? `${live.length} aplikací k vyzkoušení · Android a web` : `${live.length} apps to try · Android and web`}
        </p>
        <div className="apps-tools">
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {pills.map(p => (
              <button key={p.key} className="catalog-pill" aria-pressed={filter === p.key}
                onClick={() => setFilter(p.key)}>
                {p.label} <span style={{ opacity:0.7 }}>{p.count}</span>
              </button>
            ))}
          </div>
          <input id="apps-search-input" name="search" type="search" autoComplete="off"
            value={query} onChange={e => { setQuery(e.target.value); if (e.target.value.trim()) setShowStudies(true); }}
            placeholder={tx(lang,'apps_search')} aria-label={tx(lang,'apps_search')}
            className="catalog-search" />
        </div>

        {browsing && featured.length > 0 ? (
          <>
            <h3 className="catalog-heading">{lang === 'cs' ? 'Začni tady' : 'Start here'}</h3>
            {cards(featured)}
            {otherLive.length > 0 && (
              <details className="catalog-disclosure">
                <summary>{lang === 'cs' ? 'Další aplikace' : 'More apps'} ({otherLive.length})</summary>
                {cards(otherLive)}
              </details>
            )}
          </>
        ) : matchingLive.length > 0 ? cards(matchingLive) : (
          <p role="status" className="catalog-empty">
            {lang === 'cs' ? 'Tomuto hledání neodpovídá žádná dostupná aplikace.' : 'No available apps match your search.'}
          </p>
        )}

        {matchingStudies.length > 0 && (
          <div className="catalog-disclosure">
            <button className="studies-toggle" aria-expanded={showStudies} aria-controls="app-studies"
              onClick={() => setShowStudies(v => !v)}>
              {lang === 'cs' ? 'Studie a koncepty' : 'Studies and concepts'} ({matchingStudies.length})
              <span aria-hidden="true">{showStudies ? ' −' : ' +'}</span>
            </button>
            <div id="app-studies" hidden={!showStudies}>
                <p style={{ color:'var(--muted)', margin:'0 0 20px', lineHeight:1.6 }}>
                  {lang === 'cs' ? 'Návrhy a případové studie. Tyto projekty zde zatím nejsou ke spuštění ani ke stažení.'
                    : 'Designs and case studies. These projects are not currently available to launch or download here.'}
                </p>
                {cards(matchingStudies, 'study')}
              </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AppDetailModal({ app, lang, onClose, onShare }) {
  const isPWA = app.platform === 'PWA';
  const copy = appCopy(app, lang);
  const screenshots = [...(app.screenshots || [])];
  // Lead with the existing playable water scene instead of toolbar settings.
  const water = screenshots.findIndex(src => src.endsWith('/android-water.png'));
  if (slugify(app.name) === 'fyzika-pastelkou' && water > 0) screenshots.unshift(screenshots.splice(water, 1)[0]);
  const caseStudyUrl = window.CASE_STUDIES?.[app.id] || app.case_study_url;
  const isDownload = app.link && (app.link.includes('/storage/v1/object/public/binaries/') || app.link.startsWith('[') || /\.(apk|zip|dmg|exe|tar\.gz|ipa|pkg)(?:\?.*)?$/i.test(app.link));
  
  const [liked, setLiked] = __useS(() => window.isItemLiked(window.LIKES_APPS_KEY, app.id));
  const [likeCount, setLikeCount] = __useS(app.likes || 0);
  const [downloading, setDownloading] = __useS(false);
  const dialogRef = __useR(null);

  const handleLike = (e) => {
    e.stopPropagation();
    const nextLiked = window.toggleLikedItem(window.LIKES_APPS_KEY, app.id);
    setLiked(nextLiked);
    setLikeCount(prev => Math.max(0, prev + (nextLiked ? 1 : -1)));
    window.apiToggleLike('app', app.id, nextLiked);
    const globalApp = (window.APPS_DATA || []).find(a => a.id === app.id);
    if (globalApp) {
      globalApp.likes = Math.max(0, (globalApp.likes || 0) + (nextLiked ? 1 : -1));
    }
  };

  __useE(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;
      const controls = [...(dialogRef.current?.querySelectorAll('button, a[href], summary, [tabindex="0"]') || [])]
        .filter(el => !el.disabled && el.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (!first) { e.preventDefault(); return; }
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => { window.removeEventListener('keydown', handleEsc); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [onClose]);

  __useE(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleLaunch = async (e) => {
    e.stopPropagation();
    if (isDownload) {
      if (downloading) return;
      let urls = [];
      if (app.link.startsWith('[') && app.link.endsWith(']')) {
        try {
          urls = JSON.parse(app.link);
        } catch (err) {
          urls = [app.link];
        }
      } else {
        urls = [app.link];
      }

      if (urls.length > 1) {
        setDownloading(true);
        try {
          const blobs = [];
          for (const url of urls) {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Chyba při stahování části: ${res.statusText}`);
            blobs.push(await res.blob());
          }
          const combinedBlob = new Blob(blobs, { type: 'application/octet-stream' });
          const blobUrl = URL.createObjectURL(combinedBlob);
          const a = document.createElement('a');
          a.href = blobUrl;
          let originalName = urls[0].split('/').pop();
          originalName = originalName.replace(/^\d+_/g, '');
          originalName = originalName.replace(/\.part\d+/g, '');
          
          a.download = originalName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (err) {
          alert('Stažení aplikace selhalo: ' + err.message);
        } finally {
          setDownloading(false);
        }
      } else {
        const a = document.createElement('a');
        a.href = urls[0];
        a.download = '';
        a.target = '_blank';
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } else {
      window.open(app.link, '_blank');
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(5, 3, 2, 0.75)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'jwFade 0.2s ease-out'
    }}>
      <div ref={dialogRef} tabIndex={-1} className="app-detail" role="dialog" aria-modal="true" aria-labelledby="app-detail-title" style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20,
        width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 20, padding: 24,
        position: 'relative', boxShadow: `0 20px 60px ${app.color}15`,
        animation: 'overlayPop 0.25s var(--ease-out)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, flexShrink: 0,
              background: `linear-gradient(135deg, ${app.color}28, ${app.color}50)`,
              border: `1px solid ${app.color}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: app.color,
              overflow: 'hidden'
            }}>
              {app.icon_url ? (
                <img src={app.icon_url} alt={app.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                app.name[0]
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 id="app-detail-title" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0, color: 'var(--text)' }}>{app.name}</h2>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: isPWA ? 'color-mix(in srgb, var(--a1) 14%, transparent)' : 'rgba(34,197,94,0.15)',
                  color: isPWA ? 'var(--a1)' : '#4ade80',
                  border: `1px solid ${isPWA ? 'color-mix(in srgb, var(--a1) 35%, transparent)' : 'rgba(34,197,94,0.3)'}`,
                }}>{app.platform}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {!isLiveApp(app) ? (lang === 'cs' ? 'Studie / koncept' : 'Study / concept') : isPWA ? (lang === 'cs' ? 'Webová aplikace' : 'Web app') : (lang === 'cs' ? 'Aplikace pro Android' : 'Android app')}
              </div>
            </div>
          </div>
          <button onClick={onClose} aria-label={lang === 'cs' ? 'Zavřít' : 'Close'} style={{
            background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20,
            cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s', outline: 'none'
          }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>✕</button>
        </div>

        <p style={{ fontSize:16, color:'var(--text)', lineHeight:1.65, margin:0 }}>{copy.intro}</p>

        <div style={{
          display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10,
          borderTop: '1px solid var(--border)', paddingTop: 18
        }}>
          {app.link && app.link !== '#' && (
            <button onClick={handleLaunch} disabled={downloading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 22px', borderRadius: 10, flex: '1 0 160px',
              background: app.color, color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 700, transition: 'transform 0.2s, filter 0.2s',
              cursor: downloading ? 'wait' : 'pointer', opacity: downloading ? 0.7 : 1,
              boxShadow: `0 4px 14px ${app.color}40`, outline: 'none'
            }} onMouseEnter={(e) => e.target.style.filter = 'brightness(1.1)'} onMouseLeave={(e) => e.target.style.filter = ''}>
              <DlIco />
              {downloading ? (lang === 'cs' ? 'Stahuji…' : 'Downloading…') : (isPWA ? tx(lang, 'apps_open') : tx(lang, 'apps_dl'))}
            </button>
          )}

          {caseStudyUrl && (
            <button onClick={(e) => { e.stopPropagation(); window.location.href = caseStudyUrl; }} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '11px 20px', borderRadius: 10, flex: app.link && app.link !== '#' ? '0 1 auto' : '1 0 160px',
              background: 'transparent', color: 'var(--text)',
              border: '1px solid var(--border)',
              fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
              cursor: 'pointer', outline: 'none'
            }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}>
              {tx(lang, 'apps_read_study')} →
            </button>
          )}

          <button onClick={handleLike} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '0 16px', height: 44, borderRadius: 10,
            background: liked ? 'color-mix(in srgb, var(--a1) 14%, transparent)' : 'transparent',
            color: liked ? 'var(--a1)' : 'var(--muted)',
            border: `1px solid ${liked ? 'var(--a1)' : 'var(--border)'}`,
            fontSize: 14, fontWeight: 600, transition: 'all 0.2s', cursor: 'pointer', outline: 'none'
          }} aria-label={lang === 'cs' ? 'Líbí se mi' : 'Like'} title={lang === 'cs' ? 'Líbí se mi' : 'Like'}
             onMouseEnter={(e) => {
               if (!liked) {
                 e.currentTarget.style.color = 'var(--text)';
                 e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
               }
             }}
             onMouseLeave={(e) => {
               if (!liked) {
                 e.currentTarget.style.color = 'var(--muted)';
                 e.currentTarget.style.background = 'transparent';
               }
             }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: liked ? 'scale(1.15)' : 'none' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{likeCount}</span>
          </button>

          <button onClick={(e) => { e.stopPropagation(); onShare(); }} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: 10,
            background: 'transparent', color: 'var(--muted)',
            border: '1px solid var(--border)',
            fontSize: 16, transition: 'all 0.2s', cursor: 'pointer', outline: 'none'
          }} aria-label={lang === 'cs' ? 'Sdílet aplikaci' : 'Share app'} title={lang === 'cs' ? 'Sdílet aplikaci' : 'Share app'}
             onMouseEnter={(e) => { e.target.style.color = 'var(--text)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
             onMouseLeave={(e) => { e.target.style.color = 'var(--muted)'; e.target.style.background = 'transparent'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
        </div>
        {screenshots && screenshots.length > 0 && (
          <div style={{ position: 'relative', width: '100%' }}>
            <div className="ss-carousel" aria-label={lang === 'cs' ? 'Ukázky aplikace' : 'App screenshots'} tabIndex={0} style={{
              display: 'flex', gap: 12, overflowX: 'auto',
              scrollSnapType: 'x mandatory', webkitOverflowScrolling: 'touch',
              borderRadius: 14, padding: '4px 0',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent'
            }}>
              {screenshots.map((src, idx) => (
                <a key={idx} href={src} target="_blank" rel="noopener" className="app-gallery-slide"
                  aria-label={`${lang === 'cs' ? 'Zvětšit ukázku' : 'Enlarge screenshot'} ${idx + 1}`} style={{
                  scrollSnapAlign: 'center', flex: '0 0 100%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  background: '#070504', borderRadius: 10, overflow: 'hidden',
                  border: '1px solid var(--border)', height: 'clamp(240px, 48vh, 420px)'
                }}>
                  <img src={src} alt={`${app.name} — ${lang === 'cs' ? 'ukázka' : 'screenshot'} ${idx + 1}`} loading="lazy" style={{
                    width: '100%', height: '100%', objectFit: 'contain'
                  }} />
                </a>
              ))}
            </div>
            {screenshots.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
                {screenshots.map((_, idx) => (
                  <span key={idx} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: app.color, opacity: 0.4
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        {copy.details && (
          <details className="app-install-details">
            <summary>{lang === 'cs' ? 'Instalace, požadavky a novinky' : 'Installation, requirements and updates'}</summary>
            <p style={{ fontSize:15, lineHeight:1.7, whiteSpace:'pre-line', marginTop:16 }}>{copy.details}</p>
          </details>
        )}
      </div>
    </div>
  );
}

function AlbumCard({ album, lang, onPlay, onFilter, selected, nowPlaying }) {
  const [hov, setHov] = __useS(false);
  const tracks = (window.TRACKS_DATA || []).filter(t => t.album === album.id && isPlayableTrack(t));
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
            {tracks.length} {tx(lang,'tracks_label')} · {album.year}
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
  const [liked, setLiked] = __useS(() => window.isItemLiked(window.LIKES_TRACKS_KEY, track.id));
  const [likeCount, setLikeCount] = __useS(track.likes || 0);

  __useE(() => {
    setLiked(window.isItemLiked(window.LIKES_TRACKS_KEY, track.id));
    setLikeCount(track.likes || 0);
  }, [track.id, track.likes]);

  __useE(() => {
    const handleSync = (e) => {
      if (e.detail && e.detail.trackId === track.id) {
        setLiked(e.detail.liked);
        setLikeCount(e.detail.likes);
      }
    };
    window.addEventListener('jw-track-like-toggled', handleSync);
    return () => window.removeEventListener('jw-track-like-toggled', handleSync);
  }, [track.id]);

  const handleLike = (e) => {
    e.stopPropagation();
    const nextLiked = window.toggleLikedItem(window.LIKES_TRACKS_KEY, track.id);
    setLiked(nextLiked);
    setLikeCount(prev => Math.max(0, prev + (nextLiked ? 1 : -1)));
    window.apiToggleLike('track', track.id, nextLiked);
    const globalTrack = (window.TRACKS_DATA || []).find(t => t.id === track.id);
    if (globalTrack) {
      globalTrack.likes = Math.max(0, (globalTrack.likes || 0) + (nextLiked ? 1 : -1));
    }
    try { window.dispatchEvent(new CustomEvent('jw-track-like-toggled', { detail: { trackId: track.id, liked: nextLiked, likes: globalTrack?.likes || 0 } })); } catch (e) {}
  };

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
      <div style={{ width:38, height:38, borderRadius:7, flexShrink:0, backgroundImage:`url("${trackArt(track, album)}")`, backgroundSize:'cover' }} />
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
        <button onClick={handleLike} style={{
          background: 'none', border: 'none',
          color: liked ? 'var(--a1)' : 'var(--muted)',
          opacity: liked ? 1 : 0.6,
          display: 'flex', alignItems: 'center', gap: 4,
          cursor: 'pointer', padding: '4px 6px', borderRadius: 6,
          fontSize: 12, transition: 'all 0.15s', outline: 'none'
        }} onMouseEnter={(e) => { if (!liked) e.currentTarget.style.color = 'var(--text)'; }}
           onMouseLeave={(e) => { if (!liked) e.currentTarget.style.color = 'var(--muted)'; }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" style={{ transition: 'transform 0.15s', transform: liked ? 'scale(1.2)' : 'none' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likeCount > 0 && <span style={{ fontVariantNumeric: 'tabular-nums' }}>{likeCount}</span>}
        </button>
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
  const albums = publishedAlbums();
  const tracks = (window.TRACKS_DATA || []).filter(isPlayableTrack);
  const albumMap = __useM(() => Object.fromEntries(albums.map(a => [a.id, a])), [albums]);
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
        <SectionLabel color="a2" num="01">{tx(lang,'music_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:52 }}>
          {tx(lang,'music_sub')}
        </p>

        {albums.length > 0 && <SubLabel>{tx(lang,'music_albums')}</SubLabel>}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap:18, marginBottom:64 }}>
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
            {tracks.length === 0 && <p style={{ color:'var(--muted)', lineHeight:1.6 }}>{lang === 'cs' ? 'Skladby teď nejsou dostupné. Zkus se sem vrátit s připojením k internetu.' : 'Tracks are currently unavailable. Please return with an internet connection.'}</p>}
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
