// app.jsx — App root. Wires sections + global state.
// Depends on shared.jsx, nav-hero.jsx, apps-music.jsx, player-contact.jsx (window globals).
const { useState: __useS_app, useEffect: __useE_app, useCallback: __useC_app, useMemo: __useM_app, useRef: __useR_app } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ theme:'ember', mode:'auto' }/*EDITMODE-END*/;

// Výzva k instalaci PWA. Chrome/Android/desktop přes zachycený `beforeinstallprompt`
// (stashnutý early v index.html do window.__jwBIP); iOS Safari dostane manuální hint
// (tam beforeinstallprompt neexistuje). Skryje se, když appka už běží standalone,
// a po zavření se 14 dní neukáže.
function InstallPrompt({ lang, hasPlayer }) {
  const [show, setShow] = __useS_app(false);
  const [ios, setIos]   = __useS_app(false);

  __useE_app(() => {
    let standalone = false;
    try { standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true; } catch {}
    if (standalone) return;
    try {
      const d = localStorage.getItem('jw_install_dismissed');
      if (d && Date.now() - Number(d) < 1209600000) return; // 14 dní
    } catch {}

    const ua = navigator.userAgent || '';
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /safari/i.test(ua) && !/(crios|fxios|edgios|chrome|android)/i.test(ua);
    if (isIOS && isSafari) {
      const t = setTimeout(() => setIos(true), 2500);
      return () => clearTimeout(t);
    }

    if (window.__jwBIP) setShow(true);
    const onBip  = () => setShow(true);
    const onInst = () => { setShow(false); setIos(false); };
    window.addEventListener('jw-bip', onBip);
    window.addEventListener('jw-appinstalled', onInst);
    window.addEventListener('appinstalled', onInst);
    return () => {
      window.removeEventListener('jw-bip', onBip);
      window.removeEventListener('jw-appinstalled', onInst);
      window.removeEventListener('appinstalled', onInst);
    };
  }, []);

  const dismiss = () => {
    setShow(false); setIos(false);
    try { localStorage.setItem('jw_install_dismissed', String(Date.now())); } catch {}
  };
  const install = async () => {
    const e = window.__jwBIP;
    if (!e) { setShow(false); return; }
    try { e.prompt(); await e.userChoice; } catch {}
    window.__jwBIP = null; setShow(false);
  };

  if (!show && !ios) return null;
  const en = lang === 'en';
  const card = {
    position:'fixed', bottom: hasPlayer ? 150 : 24, left:'50%', transform:'translateX(-50%)',
    zIndex:240, width:'min(440px, calc(100vw - 28px))',
    display:'flex', alignItems:'center', gap:13, padding:'12px 14px',
    background:'color-mix(in srgb, var(--bg) 90%, transparent)',
    backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
    border:'1px solid var(--border)', borderRadius:18,
    boxShadow:'0 14px 50px rgba(0,0,0,0.5)', animation:'overlayPop 0.25s ease',
  };
  return (
    <div role="region" aria-label={en ? 'Install app' : 'Instalace aplikace'} style={card}>
      <img src="/icons/icon-192.png" alt="" width="46" height="46" style={{ borderRadius:11, flexShrink:0 }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:15, color:'var(--text)', letterSpacing:'-0.01em' }}>
          {en ? 'Install the app' : 'Nainstaluj si appku'}
        </div>
        {ios ? (
          <div style={{ fontSize:12.5, color:'var(--muted)', display:'flex', alignItems:'center', gap:5, flexWrap:'wrap', marginTop:2 }}>
            <span>{en ? 'Tap' : 'Ťukni na'}</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--a1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>
            </svg>
            <span>{en ? 'and “Add to Home Screen”.' : 'a zvol „Přidat na plochu".'}</span>
          </div>
        ) : (
          <div style={{ fontSize:12.5, color:'var(--muted)', marginTop:2 }}>
            {en ? 'Home-screen access, works offline.' : 'Přístup z plochy, funguje i offline.'}
          </div>
        )}
      </div>
      {!ios && (
        <button onClick={install} style={{ padding:'9px 16px', background:'var(--a1)', color:'var(--bg)', border:'none', borderRadius:50, fontWeight:700, fontSize:13.5, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
          {en ? 'Install' : 'Instalovat'}
        </button>
      )}
      <button onClick={dismiss} aria-label={en ? 'Dismiss' : 'Zavřít'} style={{ background:'none', border:'none', color:'var(--muted)', fontSize:18, lineHeight:1, cursor:'pointer', padding:'2px 4px', flexShrink:0, alignSelf:'flex-start' }}>✕</button>
    </div>
  );
}

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = __useS_app(() => {
    try {
      const saved = localStorage.getItem('jw_lang');
      if (saved === 'cs' || saved === 'en') return saved;
    } catch {}
    try {
      return navigator.language?.toLowerCase().startsWith('cs') ? 'cs' : 'en';
    } catch { return 'cs'; }
  });
  const [playerTrack, setPlayerTrack] = __useS_app(null);
  const [playlist, setPlaylist] = __useS_app([]);
  const [playing, setPlaying] = __useS_app(false);
  const [initialPos, setInitialPos] = __useS_app(0);
  const [restoring, setRestoring] = __useS_app(false);
  const [selectedApp, setSelectedApp] = __useS_app(null);
  const [showShortcuts, setShowShortcuts] = __useS_app(false);
  const [showSearch, setShowSearch] = __useS_app(false);
  const [shuffle, setShuffle] = __useS_app(() => {
    try { return localStorage.getItem('jw_shuffle') === '1'; } catch { return false; }
  });
  const [repeat, setRepeat] = __useS_app(() => {
    try { const v = localStorage.getItem('jw_repeat'); return (v === 'all' || v === 'one') ? v : 'off'; } catch { return 'off'; }
  });
  const [toast, setToast] = __useS_app(null);
  const [showQueue, setShowQueue] = __useS_app(false);
  const historyRef = __useR_app([]);

  __useE_app(() => { try { localStorage.setItem('jw_shuffle', shuffle ? '1' : '0'); } catch {} }, [shuffle]);
  __useE_app(() => { try { localStorage.setItem('jw_repeat', repeat); } catch {} }, [repeat]);

  // Theme + mode (sync to localStorage so case-study pages can read it)
  __useE_app(() => {
    applyMode(tw.mode);
    applyTheme(tw.theme, resolveMode(tw.mode));
    try { localStorage.setItem('jw_mode', tw.mode || 'auto'); } catch {}
  }, [tw.theme, tw.mode]);

  // Live-react to OS scheme changes when mode is 'auto'
  __useE_app(() => {
    if (tw.mode !== 'auto') return;
    let mql;
    try {
      mql = window.matchMedia('(prefers-color-scheme: light)');
      const fn = () => { applyMode('auto'); applyTheme(tw.theme, resolveMode('auto')); };
      mql.addEventListener?.('change', fn);
      return () => mql.removeEventListener?.('change', fn);
    } catch {}
  }, [tw.mode, tw.theme]);

  // Persist language + sync <html lang>
  __useE_app(() => {
    try { localStorage.setItem('jw_lang', lang); } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  // Restore last-played track (paused) on mount
  __useE_app(() => {
    try {
      const raw = localStorage.getItem(PLAYER_STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      const tracks = window.TRACKS_DATA || [];
      const t = tracks.find(x => x.id === s.trackId);
      if (t) {
        setPlayerTrack(t);
        setPlaylist(tracks);
        setInitialPos(s.position || 0);
        setRestoring(true);
        setTimeout(() => setRestoring(false), 2800);
      }
    } catch {}
  }, []);

  // Global '?' to toggle shortcuts overlay; 'L' to toggle language; Cmd/Ctrl+K to open search
  __useE_app(() => {
    const onKey = (e) => {
      // Cmd+K / Ctrl+K is intercepted globally (works even in inputs)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); setShowSearch(s => !s); return;
      }
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) { e.preventDefault(); setShowShortcuts(s => !s); }
      else if (e.key === 'Escape' && showShortcuts) setShowShortcuts(false);
      else if (e.key === 'l' || e.key === 'L') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        setLang(l => l === 'cs' ? 'en' : 'cs');
      }
      else if (e.key === 'q' || e.key === 'Q') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (playlist.length || playerTrack) setShowQueue(s => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showShortcuts, playlist, playerTrack]);

  const handlePlay = __useC_app((track, pl) => {
    if (playerTrack) historyRef.current = [...historyRef.current, playerTrack].slice(-30);
    setPlayerTrack(track); setPlaylist(pl || []); setPlaying(true); setInitialPos(0);
  }, [playerTrack]);

  const currentIdx = __useM_app(() => playlist.findIndex(t => t.id === playerTrack?.id), [playerTrack, playlist]);
  // Čistě spočítá další skladbu (bez vedlejších efektů). Sdílené mezi tlačítkem
  // „další", zámkovou obrazovkou a automatickým přechodem v přehrávači, ať se
  // všichni shodnou na téže skladbě (důležité hlavně u shuffle).
  const pickNextTrack = __useC_app(() => {
    if (!playlist.length) return null;
    if (shuffle && playlist.length > 1) {
      let next; do { next = Math.floor(Math.random() * playlist.length); } while (next === currentIdx);
      return playlist[next];
    }
    if (currentIdx >= 0 && currentIdx < playlist.length - 1) return playlist[currentIdx + 1];
    if (repeat === 'all') return playlist[0];
    return null;
  }, [currentIdx, playlist, shuffle, repeat]);
  const handleNext = __useC_app((explicit) => {
    // `explicit` = skladbu už vybral přehrávač (auto-přechod) → použij ji, ať se
    // UI shoduje s tím, co reálně začalo hrát. Jinak vyber standardně.
    const t = (explicit && explicit.id != null) ? explicit : pickNextTrack();
    if (!t) return;
    if (playerTrack) historyRef.current = [...historyRef.current, playerTrack].slice(-30);
    setPlayerTrack(t); setPlaying(true); setInitialPos(0);
  }, [pickNextTrack, playerTrack]);
  const handlePrev = __useC_app(() => {
    if (!playlist.length) return;
    // First try going back in history (especially important in shuffle mode)
    if (historyRef.current.length > 0) {
      const prev = historyRef.current[historyRef.current.length - 1];
      historyRef.current = historyRef.current.slice(0, -1);
      setPlayerTrack(prev); setPlaying(true); setInitialPos(0);
      return;
    }
    if (currentIdx > 0) { setPlayerTrack(playlist[currentIdx - 1]); setPlaying(true); setInitialPos(0); }
  }, [currentIdx, playlist]);

  // Handle URL hash for sharing: #track=<id> / #album=<id> / &t=<seconds> / #app=<slug>
  __useE_app(() => {
    const applyHash = () => {
      const h = window.location.hash || '';
      const trackMatch = h.match(/track=(\d+)/);
      const albumMatch = h.match(/album=([\w-]+)/);
      const tMatch = h.match(/t=(\d+(?:\.\d+)?)/);
      const appMatch = h.match(/app=([\w-]+)/);
      const startAt = tMatch ? parseFloat(tMatch[1]) : 0;
      const tracks = window.TRACKS_DATA || [];
      const apps = window.APPS_DATA || [];
      
      if (appMatch) {
        const a = apps.find(x => String(x.id) === appMatch[1] || slugify(x.name) === appMatch[1]);
        if (a) {
          setSelectedApp(a);
        } else {
          setSelectedApp(null);
        }
      } else {
        setSelectedApp(null);
      }

      if (trackMatch) {
        const t = tracks.find(x => x.id === Number(trackMatch[1]));
        if (t) { setPlayerTrack(t); setPlaylist(tracks); setPlaying(false); setInitialPos(startAt); }
      } else if (albumMatch) {
        const filtered = tracks.filter(t => t.album === albumMatch[1]);
        if (filtered.length) { setPlayerTrack(filtered[0]); setPlaylist(filtered); setPlaying(false); setInitialPos(startAt); }
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const handleShare = __useC_app(async (withTime) => {
    if (!playerTrack) return;
    const audio = document.querySelector('audio') || null;
    const t = withTime && audio ? Math.floor(audio.currentTime) : 0;
    const url = `${location.origin}${location.pathname}#track=${playerTrack.id}${t > 1 ? `&t=${t}` : ''}`;
    const album = (window.ALBUMS || []).find(a => a.id === playerTrack.album);
    const shareData = { title: playerTrack.title, text: `${playerTrack.title} — ${album?.title || ''}${t > 1 ? ` @ ${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}` : ''}`, url };
    try {
      if (navigator.share) { await navigator.share(shareData); }
      else { await navigator.clipboard.writeText(url); setToast(withTime ? 'Link with timestamp copied' : 'Link copied'); setTimeout(() => setToast(null), 2200); }
    } catch {}
  }, [playerTrack]);

  const handleShareApp = __useC_app(async (app) => {
    const url = `${location.origin}${location.pathname}#app=${slugify(app.name)}`;
    const shareData = {
      title: app.name,
      text: lang === 'cs' ? app.cs : app.en,
      url
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setToast(lang === 'cs' ? 'Odkaz zkopírován do schránky' : 'Link copied to clipboard');
        setTimeout(() => setToast(null), 2200);
      }
    } catch (e) {}
  }, [lang]);

  const handleClose = __useC_app(() => {
    setPlayerTrack(null); setPlaying(false);
    try { localStorage.removeItem(PLAYER_STORAGE_KEY); } catch {}
    if (location.hash.match(/track=|album=/)) history.replaceState(null, '', location.pathname);
  }, []);
  const handleCloseAppModal = __useC_app(() => {
    setSelectedApp(null);
    if (location.hash.match(/app=/)) history.replaceState(null, '', location.pathname);
  }, []);

  return (
    <div style={{ minHeight:'100vh', paddingBottom: playerTrack ? 130 : 0, position:'relative', animation:'jwFade 0.25s ease' }}>
      <BackgroundFX />
      <Nav lang={lang} setLang={setLang} mode={tw.mode || 'auto'} setMode={(v) => setTweak('mode', v)} />
      <main>
        <Hero lang={lang} onPlay={handlePlay} />
        <MusicSection lang={lang} onPlay={handlePlay} currentTrack={playerTrack} playing={playing} />
        <MostPlayedSection lang={lang} onPlay={handlePlay} currentTrack={playerTrack} playing={playing} />
        <AppsSection lang={lang} />
        <ComparisonSection lang={lang} />
        <StatsSection lang={lang} />
        <NewsletterSection lang={lang} />
        <ContactSection lang={lang} />
      </main>
      <Footer lang={lang} />

      {playerTrack && (
        <AudioPlayer
          track={playerTrack} playlist={playlist}
          isPlaying={playing} setIsPlaying={setPlaying}
          onPrev={handlePrev} onNext={handleNext} getNext={pickNextTrack}
          onClose={handleClose}
          initialPosition={initialPos}
          restoring={restoring}
          shuffle={shuffle} setShuffle={setShuffle}
          repeat={repeat} setRepeat={setRepeat}
          onShare={handleShare}
          lang={lang}
        />
      )}

      {toast && (
        <div role="status" aria-live="polite" style={{
          position:'fixed', bottom: playerTrack ? 145 : 32, left:'50%', transform:'translateX(-50%)',
          zIndex:250, padding:'10px 18px',
          background:'color-mix(in srgb, var(--bg) 92%, transparent)',
          backdropFilter:'blur(20px)',
          border:'1px solid var(--border)',
          borderRadius:50, fontSize:13, color:'var(--text)', fontWeight:500,
          boxShadow:'0 10px 40px rgba(0,0,0,0.4)',
          animation:'overlayPop 0.2s ease',
        }}>{toast}</div>
      )}

      <button className="kbd-hint" aria-label="Klávesové zkratky" title="Klávesové zkratky (?)"
        style={{ bottom: playerTrack ? 145 : 24 }} onClick={() => setShowShortcuts(true)}>?</button>

      <InstallPrompt lang={lang} hasPlayer={!!playerTrack} />

      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          lang={lang}
          onClose={handleCloseAppModal}
          onShare={() => handleShareApp(selectedApp)}
        />
      )}

      {showShortcuts && <ShortcutsOverlay lang={lang} onClose={() => setShowShortcuts(false)} />}
      {showSearch    && <SearchOverlay    lang={lang} onClose={() => setShowSearch(false)} onPlay={handlePlay} />}
      {showQueue     && <QueueDrawer      lang={lang} onClose={() => setShowQueue(false)} playlist={playlist} currentTrack={playerTrack} history={historyRef.current} onPlay={(t) => { handlePlay(t, playlist); setShowQueue(false); }} />}

      <TweaksPanel>
        <TweakSection label="Vzhled" />
        <TweakRadio label="Režim" value={tw.mode || 'auto'}
          options={['auto','light','dark']}
          onChange={v => setTweak('mode', v)} />
        <TweakRadio label="Téma" value={tw.theme}
          options={['ember','velvet','desert']}
          onChange={v => setTweak('theme', v)} />
      </TweaksPanel>
    </div>
  );
}

// Root wrapper — když supabase-data.js načte čerstvý obsah ze sítě, přerenderuje
// celý strom (změna `key`), takže komponenty znovu přečtou aktualizované window globály.
function Root() {
  const [v, setV] = __useS_app(() => window.__jwContentVersion || 0);
  __useE_app(() => {
    const onUpd = () => setV(window.__jwContentVersion || 0);
    window.addEventListener('jw-data-updated', onUpd);
    // Pojistka: data mohla dorazit mezi prvním renderem a připojením listeneru.
    if ((window.__jwContentVersion || 0) !== v) setV(window.__jwContentVersion || 0);
    return () => window.removeEventListener('jw-data-updated', onUpd);
  }, []);
  return <App key={v} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
