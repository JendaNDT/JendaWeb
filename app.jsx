// app.jsx — App root. Wires sections + global state.
// Depends on shared.jsx, nav-hero.jsx, apps-music.jsx, player-contact.jsx (window globals).
const { useState: __useS_app, useEffect: __useE_app, useCallback: __useC_app, useMemo: __useM_app, useRef: __useR_app } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ theme:'ember', mode:'auto' }/*EDITMODE-END*/;

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
  }, [showShortcuts]);

  const handlePlay = __useC_app((track, pl) => {
    if (playerTrack) historyRef.current = [...historyRef.current, playerTrack].slice(-30);
    setPlayerTrack(track); setPlaylist(pl || []); setPlaying(true); setInitialPos(0);
  }, [playerTrack]);

  const currentIdx = __useM_app(() => playlist.findIndex(t => t.id === playerTrack?.id), [playerTrack, playlist]);
  const handleNext = __useC_app(() => {
    if (!playlist.length) return;
    if (playerTrack) historyRef.current = [...historyRef.current, playerTrack].slice(-30);
    if (shuffle && playlist.length > 1) {
      let next; do { next = Math.floor(Math.random() * playlist.length); } while (next === currentIdx);
      setPlayerTrack(playlist[next]); setPlaying(true); setInitialPos(0); return;
    }
    if (currentIdx >= 0 && currentIdx < playlist.length - 1) {
      setPlayerTrack(playlist[currentIdx + 1]); setPlaying(true); setInitialPos(0);
    } else if (repeat === 'all') {
      setPlayerTrack(playlist[0]); setPlaying(true); setInitialPos(0);
    }
  }, [currentIdx, playlist, shuffle, repeat, playerTrack]);
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

  // Handle URL hash for sharing: #track=<id> / #album=<id> / &t=<seconds>
  __useE_app(() => {
    const applyHash = () => {
      const h = window.location.hash || '';
      const trackMatch = h.match(/track=(\d+)/);
      const albumMatch = h.match(/album=([\w-]+)/);
      const tMatch = h.match(/t=(\d+(?:\.\d+)?)/);
      const startAt = tMatch ? parseFloat(tMatch[1]) : 0;
      const tracks = window.TRACKS_DATA || [];
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
    const audio = document.querySelector('audio') || null; // not always present; we read from raw <audio>
    const t = withTime && audio ? Math.floor(audio.currentTime) : 0;
    const url = `${location.origin}${location.pathname}#track=${playerTrack.id}${t > 1 ? `&t=${t}` : ''}`;
    const album = (window.ALBUMS || []).find(a => a.id === playerTrack.album);
    const shareData = { title: playerTrack.title, text: `${playerTrack.title} — ${album?.title || ''}${t > 1 ? ` @ ${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}` : ''}`, url };
    try {
      if (navigator.share) { await navigator.share(shareData); }
      else { await navigator.clipboard.writeText(url); setToast(withTime ? 'Link with timestamp copied' : 'Link copied'); setTimeout(() => setToast(null), 2200); }
    } catch {}
  }, [playerTrack]);

  const handleClose = __useC_app(() => {
    setPlayerTrack(null); setPlaying(false);
    try { localStorage.removeItem(PLAYER_STORAGE_KEY); } catch {}
    if (location.hash.match(/track=|album=/)) history.replaceState(null, '', location.pathname);
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
          onPrev={handlePrev} onNext={handleNext}
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
