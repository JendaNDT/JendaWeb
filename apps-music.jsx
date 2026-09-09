// apps-music.jsx — Apps + Music sections
const { useState: __useS, useEffect: __useE, useLayoutEffect: __useL, useMemo: __useM, useCallback: __useC, useRef: __useR } = React;

const APP_VISUALS = {
  rocker: { src:'/screenshots/rocker/metronome-desktop-v1.jpg', kind:'desktop', cs:'Metronom pro tvoje cvičení.', en:'A metronome for your practice.' },
  bomberman: { src:'/screenshots/bomberman-2.0.5/gameplay.png', kind:'desktop', cs:'Bomby, bludiště a arkádová akce.', en:'Bombs, mazes and arcade action.' },
  'fyzika-pastelkou': { src:'/screenshots/fyzika-pastelkou/android-water.png', kind:'landscape', cs:'Kresli. Zkoušej. Objevuj.', en:'Draw. Try. Discover.' },
  georeminder: { src:'/screenshots/showcase/georeminder-dark-v1.png', kind:'phone', cs:'Připomínka na správném místě.', en:'A reminder in the right place.' },
  engitab: { src:'/screenshots/showcase/engitab-dark-v1.png', kind:'phone', cs:'Celá dílna v kapse.', en:'Your workshop, in your pocket.' },
  nekourim: { src:'/screenshots/showcase/nekourim-dark-v1.png', kind:'phone', cs:'Každý den bez cigarety se počítá.', en:'Every smoke-free day counts.' },
  ballista: { src:'/screenshots/showcase/ballista-dark-v1.png', kind:'phone', cs:'Nástroje pro sportovní střelbu.', en:'Tools for sport shooting.' },
  vandrak: { src:'/screenshots/showcase/vandrak-dark-v1.png', kind:'phone', cs:'Výbava na každou výpravu.', en:'Tools for every outdoor trip.' },
  'rt-asistent': { src:'/screenshots/showcase/rt-asistent-v1.jpg', kind:'desktop', cs:'Radiografické výpočty přehledně.', en:'Radiography calculations, clearly.' },
};

function AppCard({ app, lang, mode = 'live', onOpen }) {
  const visual = mode === 'live' ? (APP_VISUALS[slugify(app.name)] || {
    src: app.screenshots?.[0] || app.icon_url,
    kind: app.screenshots?.[0] ? 'phone' : 'icon',
    cs: app.name, en: app.name,
  }) : null;
  return (
    <a href={'#app=' + slugify(app.name)} className={`app-card app-sheen ${visual ? 'app-showcase' : 'app-study'}`}
       style={{ '--app-accent': app.color }} onPointerMove={moveSurfaceLight}
       onClick={e => {
         if (!onOpen || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
         e.preventDefault();
         onOpen(app, e.currentTarget);
       }}>
      {visual && <div className={`app-stage app-stage-${visual.kind}`}>
        <span className="app-stage-caption">{lang === 'cs' ? visual.cs : visual.en}</span>
        {visual.src ? <img src={visual.src} alt={visual.kind === 'icon' ? '' : (lang === 'cs' ? `Ukázka aplikace ${app.name}` : `${app.name} screenshot`)}
          loading="lazy" decoding="async" width={visual.kind === 'icon' ? 192 : visual.kind === 'phone' ? 1080 : 1920} height={visual.kind === 'phone' ? 1920 : visual.kind === 'icon' ? 192 : 1080} />
          : <span className="app-stage-letter" aria-hidden="true">{app.name[0]}</span>}
      </div>}
      <div className="app-card-body">
        <div className="app-card-heading">
          {app.icon_url ? <img className="app-icon" src={app.icon_url} alt="" width="40" height="40" loading="lazy" />
            : <span className="app-icon app-letter" aria-hidden="true">{app.name[0]}</span>}
          <div><h3>{app.name}</h3><span className="app-platform">{app.platform}</span></div>
        </div>
        <p>{appCopy(app, lang).intro}</p>
        <div className="app-card-action"><span>{lang === 'cs' ? 'Prohlédnout aplikaci' : 'Explore the app'}</span><span aria-hidden="true">↗</span></div>
      </div>
    </a>
  );
}

function AppGrid({ items, mode = 'live', lang, onOpen }) {
  const gridRef = __useR(null);
  const previous = __useR(null);
  const order = items.map(app => app.id).join(',');

  __useL(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const nodes = [...grid.children];
    const positions = new Map(nodes.map(node => [node.dataset.appKey, {
      x: node.offsetLeft, y: node.offsetTop,
    }]));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = [];
    if (previous.current && !motion.matches) {
      nodes.forEach((node, index) => {
        if (!node.animate) return;
        const before = previous.current.get(node.dataset.appKey);
        const after = positions.get(node.dataset.appKey);
        const dx = before ? before.x - after.x : 0;
        const dy = before ? before.y - after.y : 0;
        if (before && !dx && !dy) return;
        // Nearby cards travel to their new slot; distant ones enter gently.
        const nearby = before && Math.hypot(dx, dy) < 650;
        animations.push(node.animate([
          { transform: nearby ? `translate(${dx}px, ${dy}px)` : 'translateY(18px) scale(.985)', opacity: nearby ? 1 : 0 },
          { transform: 'none', opacity: 1 },
        ], { duration: 360, delay: nearby ? 0 : Math.min(index * 25, 100), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
      });
    }
    previous.current = positions;
    const cancelMotion = () => { if (motion.matches) animations.forEach(a => a.cancel()); };
    motion.addEventListener?.('change', cancelMotion);
    // Update stored geometry after responsive layout changes, without animating resize.
    const resize = new ResizeObserver(() => {
      previous.current = new Map(nodes.map(node => [node.dataset.appKey, { x:node.offsetLeft, y:node.offsetTop }]));
    });
    resize.observe(grid);
    return () => {
      animations.forEach(a => a.cancel());
      motion.removeEventListener?.('change', cancelMotion);
      resize.disconnect();
    };
  }, [order, mode]);

  return <div ref={gridRef} className="apps-grid">
    {items.map(app => <div className="app-slot" data-app-key={app.id} key={app.id}>
      <AppCard app={app} lang={lang} mode={mode} onOpen={onOpen} />
    </div>)}
  </div>;
}

function AppsSection({ lang, onOpen }) {
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
  const orderedLive = [...featured, ...otherLive];
  const pills = [
    { key: 'all', label: lang === 'cs' ? 'Vše' : 'All', count: live.length },
    ...['PWA', 'Android', 'Windows'].map(key => ({ key, label: key, count: live.filter(a => a.platform === key).length })),
  ];
  const cards = (items, mode = 'live') => <AppGrid items={items} mode={mode} lang={lang} onOpen={onOpen} />;

  return (
    <section id="apps" className="studio-section">
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1200, margin:'0 auto' }}>
        <SectionLabel color="a1" num="02">{tx(lang,'apps_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:28 }}>
          {lang === 'cs' ? `${live.length} aplikací k vyzkoušení · Android, Windows a web` : `${live.length} apps to try · Android, Windows and web`}
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

        {orderedLive.length > 0 ? cards(orderedLive) : (
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
  const visual = APP_VISUALS[slugify(app.name)];
  if (!screenshots.length && visual) screenshots.push(visual.src);
  // Lead with the existing playable water scene instead of toolbar settings.
  const water = screenshots.findIndex(src => src.endsWith('/android-water.png'));
  if (slugify(app.name) === 'fyzika-pastelkou' && water > 0) screenshots.unshift(screenshots.splice(water, 1)[0]);
  const caseStudyUrl = window.CASE_STUDIES?.[app.id] || app.case_study_url;
  const isDownload = app.link && (app.link.includes('/storage/v1/object/public/binaries/') || app.link.startsWith('[') || /\.(apk|zip|dmg|exe|tar\.gz|ipa|pkg)(?:\?.*)?$/i.test(app.link));
  
  const [liked, setLiked] = __useS(() => window.isItemLiked(window.LIKES_APPS_KEY, app.id));
  const [likeCount, setLikeCount] = __useS(app.likes || 0);
  const [downloading, setDownloading] = __useS(false);
  const [galleryIndex, setGalleryIndex] = __useS(null);
  const closeGallery = __useC(() => setGalleryIndex(null), []);
  const dialogRef = __useR(null);
  // The shared transition replaces entrance animations for this entire mount.
  const [sharedEntry] = __useS(() => document.documentElement.classList.contains('app-detail-transition'));

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
    dialogRef.current?.focus({ preventScroll:true });
    const handleEsc = (e) => {
      if (e.defaultPrevented || document.querySelector('[data-gallery-dialog]')) return;
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
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
    return () => { window.removeEventListener('keydown', handleEsc); if (previousFocus?.isConnected) previousFocus.focus({ preventScroll:true }); };
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
    <><div className="modal-backdrop" inert={galleryIndex !== null ? '' : undefined} aria-hidden={galleryIndex !== null ? true : undefined} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(5, 3, 2, 0.75)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: sharedEntry ? 'none' : 'jwFade 0.2s ease-out'
    }}>
      <div ref={dialogRef} tabIndex={-1} className="app-detail panel-sheen" onPointerMove={moveSurfaceLight} role="dialog" aria-modal="true" aria-labelledby="app-detail-title" style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20,
        width: '100%', maxWidth: 760, maxHeight: '90vh', overflow: 'hidden',
        position: 'relative', boxShadow: `0 20px 60px ${app.color}15`,
        animation: sharedEntry ? 'none' : 'overlayPop 0.25s var(--ease-out)'
      }}>
        <div className="app-detail-scroll" style={{ maxHeight:'calc(90vh - 2px)', overflowY:'auto', display:'flex', flexDirection:'column', gap:20, padding:24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 14 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', minWidth:0 }}>
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
            <div style={{ minWidth:0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h2 id="app-detail-title" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0, color: 'var(--text)', overflowWrap:'anywhere' }}>{app.name}</h2>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: isPWA ? 'color-mix(in srgb, var(--a1) 14%, transparent)' : 'rgba(34,197,94,0.15)',
                  color: isPWA ? 'var(--a1)' : '#4ade80',
                  border: `1px solid ${isPWA ? 'color-mix(in srgb, var(--a1) 35%, transparent)' : 'rgba(34,197,94,0.3)'}`,
                }}>{app.platform}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {!isLiveApp(app) ? (lang === 'cs' ? 'Studie / koncept' : 'Study / concept') : isPWA ? (lang === 'cs' ? 'Webová aplikace' : 'Web app') : (lang === 'cs' ? `Aplikace pro ${app.platform}` : `${app.platform} app`)}
              </div>
            </div>
          </div>
          <button onClick={onClose} aria-label={lang === 'cs' ? 'Zavřít' : 'Close'} style={{
            background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, flexShrink:0,
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
                <button type="button" key={idx} onClick={() => setGalleryIndex(idx)} className="app-gallery-slide"
                  aria-label={`${lang === 'cs' ? 'Zvětšit ukázku' : 'Enlarge screenshot'} ${idx + 1}`} style={{
                  scrollSnapAlign: 'center', flex: '0 0 100%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  background: '#070504', borderRadius: 10, overflow: 'hidden',
                  border: '1px solid var(--border)', height: 'clamp(240px, 48vh, 420px)'
                }}>
                  <img src={src} alt={`${app.name} — ${lang === 'cs' ? 'ukázka' : 'screenshot'} ${idx + 1}`} loading="lazy" style={{
                    width: '100%', height: '100%', objectFit: 'contain'
                  }} />
                </button>
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
    </div>
    {galleryIndex !== null && <ScreenshotGallery images={screenshots} initialIndex={galleryIndex} title={app.name} lang={lang} onClose={closeGallery} />}</>
  );
}

function AlbumCard({ album, lang, onPlay, onOpenAlbum, onFilter, selected, nowPlaying }) {
  const tracks = (window.TRACKS_DATA || []).filter(t => t.album === album.id && isPlayableTrack(t));
  return (
    <article className={`album-card${selected ? ' album-selected' : ''}${nowPlaying ? ' album-playing' : ''}`}>
      <button className="album-cover-button" onClick={e => tracks.length && (onOpenAlbum ? onOpenAlbum(album, e.currentTarget) : onPlay(tracks[0], tracks))}
        aria-label={`${tx(lang,'music_play_album')}: ${album.title}`}>
        <img src={albumArt(album)} alt="" width="1024" height="1024" loading="lazy" decoding="async" />
        <span className="album-cover-mark" aria-hidden="true">J / {album.year}</span>
        <span className="album-play"><PlayIco /></span>
        {nowPlaying && <span className="album-now">{lang === 'cs' ? 'Právě hraje' : 'Now playing'} <EqBars /></span>}
      </button>
      <div className="album-info">
        <div className="album-heading"><h3>{album.title}</h3><span>{tracks.length} {lang === 'cs' ? (tracks.length === 1 ? 'skladba' : tracks.length < 5 ? 'skladby' : 'skladeb') : (tracks.length === 1 ? 'track' : 'tracks')}</span></div>
        <p className="album-genre">{album.genre}</p>
        <p className="album-description">{(lang === 'cs' ? album.cs : album.en) || (lang === 'cs' ? 'Na chvíli vypni okolní svět.' : 'Let the outside world fade away.')}</p>
        {onFilter && <button className="album-tracks-link" onClick={() => onFilter(album.id)}>{tx(lang,'music_tracks')} <span aria-hidden="true">↗</span></button>}
      </div>
    </article>
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

function MusicSection({ lang, onPlay, onOpenAlbum, currentTrack, playing }) {
  const [ref, vis] = useInView();
  const [tracksRef, tracksVis] = useInView();
  const [albumFilter, setAlbumFilter] = __useS('all');
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
      scrollToSection('tracks');
    }, 50);
  }, []);

  return (
    <section id="music" className="studio-section">
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div ref={ref} className={`fade-up${vis?' in-view':''}`}>
          <SectionLabel color="a2" num="01">{tx(lang,'music_title')}</SectionLabel>
          <p style={{ color:'var(--muted)', fontSize:16, marginBottom:32 }}>
            {tx(lang,'music_sub')}
          </p>

          {albums.length > 0 && <SubLabel>{tx(lang,'music_albums')}</SubLabel>}
          <div className="albums-grid">
            {albums.map(a => (
              <AlbumCard key={a.id} album={a} lang={lang} onPlay={onPlay} onOpenAlbum={onOpenAlbum} onFilter={filterByAlbum} selected={albumFilter === a.id} nowPlaying={!!(playing && currentTrack && currentTrack.album === a.id)} />
            ))}
          </div>
        </div>

        <div id="tracks" className="studio-track-list panel-sheen" onPointerMove={moveSurfaceLight}>
          <div ref={tracksRef} className={`fade-up${tracksVis?' in-view':''}`}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:12, flexWrap:'wrap' }}>
              <SubLabel>{tx(lang,'music_tracks')}</SubLabel>
              <span style={{ fontSize:12, color:'var(--muted)', opacity:0.6 }}>
                {filteredTracks.length} {lang === 'cs' ? (filteredTracks.length === 1 ? 'skladba' : filteredTracks.length >= 2 && filteredTracks.length < 5 ? 'skladby' : 'skladeb') : (filteredTracks.length === 1 ? 'track' : 'tracks')}
              </span>
            </div>

            <div style={{ display:'flex', gap:8, marginBottom:18, flexWrap:'wrap' }}>
              <button onClick={() => setAlbumFilter('all')} style={{
                padding:'6px 14px', borderRadius:50, fontSize:12, fontWeight:600,
                background: albumFilter === 'all' ? 'var(--a1)' : 'transparent',
                color: albumFilter === 'all' ? 'var(--bg)' : 'var(--muted)',
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
                    background: on ? 'var(--a1)' : 'transparent',
                    color: on ? 'var(--bg)' : 'var(--muted)',
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
      </div>
    </section>
  );
}

Object.assign(window, { AppCard, AppsSection, AlbumCard, TrackRow, MusicSection });
