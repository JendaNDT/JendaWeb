// player-contact.jsx — Audio player, shortcuts overlay, contact form, footer
const { useState: __useS_pc, useEffect: __useE_pc, useRef: __useR_pc, useMemo: __useM_pc } = React;

function AudioPlayer({ track, playlist, isPlaying, setIsPlaying, onPrev, onNext, onClose, initialPosition, restoring, shuffle, setShuffle, repeat, setRepeat, onShare, lang }) {
  const audioRef = __useR_pc(null);
  const audioCtxRef = __useR_pc(null);
  const analyserRef = __useR_pc(null);
  const sourceRef = __useR_pc(null);
  // Mobil/iOS: přehrávej přímo z <audio> (ne přes Web Audio), ať hudba běží i při
  // zhasnuté obrazovce. iOS uspí AudioContext při zamčení → jinak by se zvuk zastavil.
  const isMobile = __useM_pc(() => {
    try {
      const ua = navigator.userAgent || '';
      const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      return iOS || /Android/.test(ua) || (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches);
    } catch { return false; }
  }, []);
  const [fft, setFft] = __useS_pc(null);
  const [currentTime, setCurrentTime] = __useS_pc(initialPosition || 0);
  const [duration, setDuration] = __useS_pc(0);
  const [vol, setVol] = __useS_pc(() => {
    try { const v = parseFloat(localStorage.getItem(VOL_STORAGE_KEY)); return isFinite(v) ? v : 0.8; }
    catch { return 0.8; }
  });
  const [muted, setMuted] = __useS_pc(false);
  const [hovBar, setHovBar] = __useS_pc(null);
  const [expanded, setExpanded] = __useS_pc(false);
  const [speed, setSpeed] = __useS_pc(() => {
    try { const v = parseFloat(localStorage.getItem('jw_speed')); return [0.75,1,1.25,1.5,2].includes(v) ? v : 1; }
    catch { return 1; }
  });
  const [sleepMins, setSleepMins] = __useS_pc(0);
  const [sleepRemaining, setSleepRemaining] = __useS_pc(0);
  const [showSleepMenu, setShowSleepMenu] = __useS_pc(false);
  const [vizMode, setVizMode] = __useS_pc(() => {
    try { const v = localStorage.getItem('jw_viz'); return ['bars','radial','mirror'].includes(v) ? v : 'bars'; }
    catch { return 'bars'; }
  });
  const [showAnalyzer, setShowAnalyzer] = __useS_pc(false);
  const [showLyrics, setShowLyrics] = __useS_pc(false);
  const [loopA, setLoopA] = __useS_pc(null);
  const [loopB, setLoopB] = __useS_pc(null);
  const sleepTimerRef = __useR_pc(null);
  const restoredRef = __useR_pc(false);
  const albums = window.ALBUMS || [];
  const album = albums.find(a => a.id === track?.album);

  const bars = __useM_pc(() => seededBars(track?.id || 1), [track?.id]);
  const progress = duration > 0 ? currentTime / duration : 0;

  __useE_pc(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.volume = vol;
    return () => { if (audioRef.current) audioRef.current.pause(); };
  }, []);

  // Web Audio FFT setup (lazy — only on first play; MediaElementSource can only be created once)
  const setupAudioContext = () => {
    if (audioCtxRef.current || !audioRef.current || isMobile) return;
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const source = ctx.createMediaElementSource(audioRef.current);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.78;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      sourceRef.current = source;
      analyserRef.current = analyser;
      window.__jwAnalyser = analyser; // sdílené pro hero vizuál (audio-reaktivita)
    } catch { /* CORS or unsupported — fall back to seededBars */ }
  };

  // FFT animation loop while playing
  __useE_pc(() => {
    if (!isPlaying || isMobile) { setFft(null); return; }
    setupAudioContext();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    const N = 72;
    let frameId;
    const out = new Uint8Array(N);
    const loop = () => {
      const an = analyserRef.current;
      if (an) {
        const bin = new Uint8Array(an.frequencyBinCount);
        an.getByteFrequencyData(bin);
        // Skip top frequencies (mostly noise), log-ish bucket
        const usable = Math.floor(bin.length * 0.85);
        const step = usable / N;
        for (let i = 0; i < N; i++) {
          const start = Math.floor(i * step);
          const end = Math.floor((i + 1) * step);
          let sum = 0, c = 0;
          for (let j = start; j < end; j++) { sum += bin[j]; c++; }
          out[i] = c ? sum / c : 0;
        }
        setFft(new Uint8Array(out));
      }
      frameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  __useE_pc(() => {
    const a = audioRef.current; if (!a || !track) return;
    restoredRef.current = false;
    setCurrentTime(initialPosition || 0);
    setDuration(0);
    if (track.audioUrl) { a.src = track.audioUrl; a.load(); }
    else { a.removeAttribute('src'); }
  }, [track?.id]);

  __useE_pc(() => {
    const a = audioRef.current; if (!a) return;
    if (isPlaying && track?.audioUrl) a.play().catch(() => setIsPlaying(false));
    else a.pause();
    if ('mediaSession' in navigator) {
      try { navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused'; } catch {}
    }
  }, [isPlaying, track?.audioUrl, setIsPlaying]);

  __useE_pc(() => {
    const a = audioRef.current; if (!a) return;
    const onTime  = () => {
      setCurrentTime(a.currentTime);
      if ('mediaSession' in navigator && a.duration && isFinite(a.duration)) {
        try { navigator.mediaSession.setPositionState({ duration: a.duration, position: Math.min(a.currentTime, a.duration), playbackRate: a.playbackRate || 1 }); } catch {}
      }
    };
    const onMeta  = () => {
      setDuration(a.duration || 0);
      if (!restoredRef.current && initialPosition && a.duration > initialPosition) {
        try { a.currentTime = initialPosition; } catch {}
        restoredRef.current = true;
      }
    };
    const onEnded = () => {
      if (repeat === 'one') {
        try { a.currentTime = 0; a.play().catch(() => {}); } catch {}
      } else {
        onNext();
      }
    };
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('ended', onEnded);
    };
  }, [initialPosition, onNext, repeat]);

  __useE_pc(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = muted ? 0 : vol;
    try { localStorage.setItem(VOL_STORAGE_KEY, String(vol)); } catch {}
  }, [vol, muted]);

  // Speed: update playbackRate + persist
  __useE_pc(() => {
    const a = audioRef.current; if (!a) return;
    a.playbackRate = speed;
    try { localStorage.setItem('jw_speed', String(speed)); } catch {}
  }, [speed]);

  // Sleep timer countdown
  __useE_pc(() => {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    if (sleepMins <= 0) { setSleepRemaining(0); return; }
    setSleepRemaining(sleepMins * 60);
    sleepTimerRef.current = setInterval(() => {
      setSleepRemaining(r => {
        if (r <= 1) {
          clearInterval(sleepTimerRef.current);
          setIsPlaying(false);
          setSleepMins(0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(sleepTimerRef.current);
  }, [sleepMins, setIsPlaying]);

  // Listening stats — increment counter on track change while playing
  __useE_pc(() => {
    if (!track || !isPlaying) return;
    try {
      const raw = localStorage.getItem('jw_plays');
      const m = raw ? JSON.parse(raw) : {};
      m[track.id] = (m[track.id] || 0) + 1;
      localStorage.setItem('jw_plays', JSON.stringify(m));
    } catch {}
    // Globální počítadlo (Supabase) — jednou na skladbu za návštěvu
    try {
      const seen = window.__jwCounted || (window.__jwCounted = new Set());
      if (!seen.has(track.id)) {
        seen.add(track.id);
        track.plays = (track.plays || 0) + 1; // optimisticky → "Nejvíce poslouchané" reaguje hned
        const sb = window.__jwSupa;
        if (sb) {
          fetch(sb.url + '/rest/v1/rpc/increment_play', {
            method: 'POST',
            headers: { apikey: sb.key, authorization: 'Bearer ' + sb.key, 'content-type': 'application/json' },
            body: JSON.stringify({ track_id: track.id }),
            keepalive: true,
          }).catch(() => {});
        }
      }
    } catch {}
  }, [track?.id, isPlaying]);

  __useE_pc(() => {
    if (!track) return;
    const save = () => {
      try {
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify({
          trackId: track.id,
          position: audioRef.current?.currentTime || 0,
        }));
      } catch {}
    };
    save();
    const id = isPlaying ? setInterval(save, 5000) : null;
    return () => { if (id) clearInterval(id); save(); };
  }, [track?.id, isPlaying]);

  __useE_pc(() => {
    if (!('mediaSession' in navigator) || !track) return;
    try {
      const artUrl = album && album.cover_url ? album.cover_url : '';
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: track.title,
        artist: 'Jenda',
        album: album?.title || '',
        artwork: artUrl ? [{ src: artUrl, sizes: '512x512' }] : [],
      });
      navigator.mediaSession.setActionHandler('play',          () => setIsPlaying(true));
      navigator.mediaSession.setActionHandler('pause',         () => setIsPlaying(false));
      navigator.mediaSession.setActionHandler('previoustrack', () => onPrev());
      navigator.mediaSession.setActionHandler('nexttrack',     () => onNext());
      try {
        navigator.mediaSession.setActionHandler('seekto', (d) => {
          const a = audioRef.current; if (!a) return;
          if (d.seekTime != null) { try { a.currentTime = d.seekTime; } catch {} }
        });
      } catch {}
    } catch {}
  }, [track?.id, album?.id, setIsPlaying, onPrev, onNext]);

  __useE_pc(() => {
    try { localStorage.setItem('jw_viz', vizMode); } catch {}
  }, [vizMode]);

  // A/B loop enforcement
  __useE_pc(() => {
    const a = audioRef.current; if (!a) return;
    if (loopA != null && loopB != null && currentTime > loopB) {
      try { a.currentTime = loopA; } catch {}
    }
  }, [currentTime, loopA, loopB]);

  // Reset A/B loop on track change
  __useE_pc(() => { setLoopA(null); setLoopB(null); }, [track?.id]);

  __useE_pc(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      const a = audioRef.current;
      if (e.code === 'Space')           { e.preventDefault(); setIsPlaying(p => !p); }
      else if (e.key === 'ArrowRight')  { if (e.shiftKey && a) a.currentTime = Math.min((a.duration||0), a.currentTime + 5); else onNext(); }
      else if (e.key === 'ArrowLeft')   { if (e.shiftKey && a) a.currentTime = Math.max(0, a.currentTime - 5); else onPrev(); }
      else if (e.key.toLowerCase() === 'm') setMuted(m => !m);
      else if (e.key === 'Escape' && !expanded) onClose();
      else if (e.key === 'e' || e.key === 'E') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        setExpanded(x => !x);
      }
      else if (e.key === 'a' || e.key === 'A') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        setLoopA(currentTime);
      }
      else if (e.key === 'b' || e.key === 'B') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (currentTime > (loopA ?? 0)) setLoopB(currentTime);
      }
      else if (e.key === 'z' || e.key === 'Z') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        setLoopA(null); setLoopB(null);
      }
      else if (e.key === 'v' || e.key === 'V') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        setVizMode(v => ({ bars:'radial', radial:'mirror', mirror:'bars' })[v] || 'bars');
      }
      else if (e.key === 'd' || e.key === 'D') {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        setShowAnalyzer(x => !x);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsPlaying, onNext, onPrev, onClose, expanded, currentTime, loopA]);

  const seekFromEvent = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const a = audioRef.current;
    if (a && a.duration) a.currentTime = p * a.duration;
    else setCurrentTime(p * (duration || 0));
  };

  return (
    <>
    <div className="player-grid" style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:200,
      background:'color-mix(in srgb, var(--bg) 92%, transparent)', backdropFilter:'blur(28px)',
      borderTop:'1px solid var(--border)',
      padding:'10px 28px',
      display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:20,
      animation:'slideUp 0.35s ease',
    }}>
      <div className="player-info" onClick={() => setExpanded(true)} style={{ display:'flex', alignItems:'center', gap:12, minWidth:0, cursor:'pointer' }} role="button" tabIndex={0} aria-label={`${track ? `${track.title} - ${album?.title || ''}. ` : ''}Expand player (E)`} title="Expand (E)"
        onKeyDown={(e) => { if (e.key === 'Enter') setExpanded(true); }}>
        <div className={restoring ? 'shimmer-fx' : ''} style={{ position:'relative', width:42, height:42, borderRadius:8, flexShrink:0, overflow:'hidden', backgroundImage: track ? `url("${trackArt(track.id, album)}")` : '', backgroundSize:'cover', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {isPlaying && <EqBars color="#fff" />}
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track?.title}</div>
          <div style={{ fontSize:12, color:'var(--muted)' }}>{album?.title || ''}</div>
        </div>
      </div>

      <div className="player-controls" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={() => setShuffle(s => !s)} aria-label="Shuffle" title="Shuffle" style={{ color: shuffle ? 'var(--a1)' : 'var(--muted)', display:'flex', padding:6 }}><ShuffleIco /></button>
          <button onClick={onPrev} aria-label="Previous (←)" title="Previous (←)" style={{ color:'var(--muted)', display:'flex', padding:6, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><PrevIco /></button>
          <button onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause (Space)' : 'Play (Space)'} title={isPlaying ? 'Pause (Space)' : 'Play (Space)'} style={{
            width:48, height:48, borderRadius:'50%', background:'var(--a1)', color:'#fff',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 20px var(--glow)', transition:'transform 0.1s',
          }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
            {isPlaying ? <PauseIco /> : <PlayIco />}
          </button>
          <button onClick={onNext} aria-label="Next (→)" title="Next (→)" style={{ color:'var(--muted)', display:'flex', padding:6, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><NextIco /></button>
          <button onClick={() => setRepeat(r => r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')} aria-label={`Repeat: ${repeat}`} title={`Repeat: ${repeat}`} style={{ color: repeat !== 'off' ? 'var(--a1)' : 'var(--muted)', display:'flex', padding:6 }}>
            {repeat === 'one' ? <RepeatOneIco /> : <RepeatIco />}
          </button>
          <button className="player-mute-mobile" onClick={() => setMuted(m => !m)} aria-label="Mute" style={{ color: muted ? 'var(--a1)' : 'var(--muted)', padding:6 }}>
            <VolIco />
          </button>
          <button className="player-mute-mobile" onClick={onClose} aria-label="Close" style={{ color:'var(--muted)', padding:6 }}>
            <CloseIco />
          </button>
        </div>
        <div className="player-wave" style={{ display:'flex', alignItems:'center', gap:10, width:380 }}>
          <span style={{ fontSize:11, color:'var(--muted)', minWidth:34, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{fmtTime(currentTime)}</span>
          <div
            onClick={seekFromEvent}
            onMouseMove={e => { const r=e.currentTarget.getBoundingClientRect(); setHovBar(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))); }}
            onMouseLeave={() => setHovBar(null)}
            role="slider" aria-label="Seek"
            aria-valuemin={0} aria-valuemax={duration || 0} aria-valuenow={currentTime}
            style={{ flex:1, height:28, display:'flex', alignItems:'center', justifyContent:'space-between', gap:1, cursor:'pointer', position:'relative' }}
          >
            {bars.map((h, i) => {
              const p = (i + 0.5) / bars.length;
              const played = p <= progress;
              const hovered = hovBar != null && p <= hovBar && p > progress;
              const liveH = fft && fft[i] ? Math.max(0.12, (fft[i] / 255) * 1.15) : h;
              return (
                <span key={i} style={{
                  flex:1, height:`${Math.min(1, liveH)*100}%`, minHeight:2, borderRadius:1.5,
                  background: played ? 'var(--a1)' : hovered ? 'color-mix(in srgb, var(--a1) 50%, var(--muted))' : 'color-mix(in srgb, var(--text) 18%, transparent)',
                  transition: fft ? 'none' : 'background 0.08s',
                }} />
              );
            })}
          </div>
          <span style={{ fontSize:11, color:'var(--muted)', minWidth:34, fontVariantNumeric:'tabular-nums' }}>{fmtTime(duration || parseDur(track?.duration))}</span>
        </div>
      </div>

      <div className="player-right" style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'flex-end', position:'relative' }}>
        <button onClick={() => setSpeed(s => ({ 0.75:1, 1:1.25, 1.25:1.5, 1.5:2, 2:0.75 })[s] || 1)}
          aria-label={`Speed ${speed}×`} title={`Playback speed ${speed}×`} style={{
            color: speed === 1 ? 'var(--muted)' : 'var(--a1)',
            display:'flex', padding:'4px 8px', borderRadius:6,
            fontSize:11, fontWeight:700, fontVariantNumeric:'tabular-nums',
          }}>{speed}×</button>
        <button onClick={() => setShowSleepMenu(v => !v)}
          aria-label="Sleep timer" title="Sleep timer" style={{
            color: sleepMins > 0 ? 'var(--a1)' : 'var(--muted)',
            display:'flex', padding:'4px 6px', alignItems:'center', gap:5, fontSize:11, fontWeight:600, fontVariantNumeric:'tabular-nums',
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          {sleepRemaining > 0 && <span>{Math.floor(sleepRemaining/60)}:{String(sleepRemaining%60).padStart(2,'0')}</span>}
        </button>
        {showSleepMenu && (
          <div onMouseLeave={() => setShowSleepMenu(false)} style={{
            position:'absolute', bottom:'calc(100% + 6px)', right:60,
            background:'var(--bg2)', border:'1px solid var(--border)',
            borderRadius:10, padding:6, minWidth:140,
            boxShadow:'0 14px 40px rgba(0,0,0,0.5)', zIndex:5,
          }}>
            {[0, 15, 30, 45, 60].map(m => (
              <button key={m} onClick={() => { setSleepMins(m); setShowSleepMenu(false); }} style={{
                width:'100%', textAlign:'left', padding:'8px 12px', borderRadius:6,
                fontSize:13, color: sleepMins === m ? 'var(--a1)' : 'var(--text)',
                background: sleepMins === m ? 'color-mix(in srgb, var(--a1) 12%, transparent)' : 'transparent',
                transition:'background 0.1s',
              }}>
                {m === 0 ? 'Off' : `${m} min`}
              </button>
            ))}
          </div>
        )}
        {onShare && (
          <button onClick={(e) => onShare && onShare(e.shiftKey)} aria-label="Share" title="Share (Shift+click for timestamp)"
            onContextMenu={(e) => { e.preventDefault(); onShare && onShare(true); }}
            style={{ color:'var(--muted)', display:'flex', padding:6, transition:'color 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--a1)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><ShareIco /></button>
        )}
        <button onClick={() => setMuted(m => !m)} aria-label="Mute (M)" title="Mute (M)" style={{ color: muted ? 'var(--a1)' : 'var(--muted)', display:'flex', padding:4 }}>
          {muted ? <MuteIco /> : <VolIco />}
        </button>
        <input type="range" min="0" max="1" step="0.01" value={muted ? 0 : vol} onChange={e => { setVol(+e.target.value); setMuted(false); }} style={{ width:80 }} aria-label="Volume" />
        <button onClick={onClose} aria-label="Close player" title="Close" style={{ color:'var(--muted)', display:'flex', padding:6, marginLeft:8, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><CloseIco /></button>
      </div>
    </div>

    {expanded && (
      <ExpandMode
        track={track} album={album}
        currentTime={currentTime} duration={duration} progress={progress}
        bars={bars} fft={fft}
        seekFromEvent={seekFromEvent}
        hovBar={hovBar} setHovBar={setHovBar}
        isPlaying={isPlaying} setIsPlaying={setIsPlaying}
        onPrev={onPrev} onNext={onNext}
        onClose={() => setExpanded(false)}
        shuffle={shuffle} setShuffle={setShuffle}
        repeat={repeat} setRepeat={setRepeat}
        vol={vol} setVol={setVol} muted={muted} setMuted={setMuted}
        onShare={onShare}
        lang={lang || 'cs'}
        vizMode={vizMode} setVizMode={setVizMode}
        showAnalyzer={showAnalyzer} setShowAnalyzer={setShowAnalyzer}
        showLyrics={showLyrics} setShowLyrics={setShowLyrics}
        loopA={loopA} loopB={loopB}
        setLoopA={setLoopA} setLoopB={setLoopB}
        analyser={analyserRef.current}
      />
    )}
    </>
  );
}

function ShortcutsOverlay({ lang, onClose }) {
  const rows = [
    { keys:['⌘','K'],           lbl: tx(lang,'shortcuts_search') },
    { keys:['Space'],          lbl: tx(lang,'shortcuts_play') },
    { keys:['←'],               lbl: tx(lang,'shortcuts_prev') },
    { keys:['→'],               lbl: tx(lang,'shortcuts_next') },
    { keys:['Shift','← / →'],   lbl: tx(lang,'shortcuts_seek') },
    { keys:['M'],               lbl: tx(lang,'shortcuts_mute') },
    { keys:['E'],               lbl: tx(lang,'shortcuts_expand') },
    { keys:['Q'],               lbl: tx(lang,'shortcuts_queue') },
    { keys:['V'],               lbl: tx(lang,'shortcuts_viz') },
    { keys:['D'],               lbl: tx(lang,'shortcuts_analyzer') },
    { keys:['A'],               lbl: tx(lang,'shortcuts_loop_a') },
    { keys:['B'],               lbl: tx(lang,'shortcuts_loop_b') },
    { keys:['Z'],               lbl: tx(lang,'shortcuts_loop_clear') },
    { keys:['L'],               lbl: tx(lang,'shortcuts_lang') },
    { keys:['Esc'],             lbl: tx(lang,'shortcuts_close') },
    { keys:['?'],               lbl: tx(lang,'shortcuts_help') },
  ];
  return (
    <div role="dialog" aria-modal="true" aria-label={tx(lang,'shortcuts_title')}
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:300,
        background:'color-mix(in srgb, var(--bg) 60%, rgba(0,0,0,0.6))', backdropFilter:'blur(8px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        animation:'overlayIn 0.18s ease',
      }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'var(--bg2)', border:'1px solid var(--border)',
        borderRadius:'var(--r)', padding:'28px 30px',
        width:'100%', maxWidth:420, maxHeight:'85vh', overflowY:'auto',
        boxShadow:'0 30px 80px rgba(0,0,0,0.6)',
        animation:'overlayPop 0.22s ease',
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, letterSpacing:'-0.02em' }}>
            {tx(lang,'shortcuts_title')}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ color:'var(--muted)', padding:6 }}><CloseIco /></button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14 }}>
              <span style={{ fontSize:14, color:'var(--text)' }}>{r.lbl}</span>
              <span style={{ display:'flex', gap:5 }}>
                {r.keys.map((k, j) => <kbd key={j}>{k}</kbd>)}
              </span>
            </div>
          ))}
        </div>
        <p style={{ marginTop:20, fontSize:12, color:'var(--muted)', opacity:0.7, textAlign:'center' }}>
          {tx(lang,'shortcuts_hint')} <kbd>?</kbd> {tx(lang,'shortcuts_hint2')}
        </p>
      </div>
    </div>
  );
}

function ContactForm({ lang }) {
  const [name, setName] = __useS_pc('');
  const [email, setEmail] = __useS_pc('');
  const [msg, setMsg] = __useS_pc('');
  const [touched, setTouched] = __useS_pc({ name:false, email:false, msg:false });
  const [status, setStatus] = __useS_pc('idle');
  const endpoint = window.CONTACT_ENDPOINT;
  const mailto = window.CONTACT_EMAIL || 'jenda@example.com';

  const errors = {
    name:  name.trim().length === 0 ? tx(lang,'err_name') : null,
    email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ? null : tx(lang,'err_email'),
    msg:   msg.trim().length < 4   ? tx(lang,'err_msg')  : null,
  };
  const hasError = Object.values(errors).some(Boolean);

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name:true, email:true, msg:true });
    if (hasError) return;
    if (!endpoint) {
      const subject = encodeURIComponent(`Zpráva od ${name}`);
      const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
      setStatus('ok');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(endpoint, {
        method:'POST',
        headers:{ 'Accept':'application/json', 'Content-Type':'application/json' },
        body: JSON.stringify({ name, email, message: msg }),
      });
      if (res.ok) { setStatus('ok'); setName(''); setEmail(''); setMsg(''); }
      else { setStatus('err'); }
    } catch { setStatus('err'); }
  };

  const fieldStyle = (hasErr) => ({
    width:'100%', padding:'13px 16px', borderRadius:10,
    background:'var(--card)',
    border:`1px solid ${hasErr ? '#f87171' : 'var(--border)'}`,
    color:'var(--text)', fontFamily:'inherit', fontSize:14,
    outline:'none', resize:'vertical', transition:'border-color 0.2s, background 0.2s',
  });
  const onFocus = e => { e.currentTarget.style.borderColor='var(--a1)'; e.currentTarget.style.background='color-mix(in srgb, var(--text) 6%, transparent)'; };
  const onBlurField = (key) => (e) => {
    setTouched(t => ({ ...t, [key]: true }));
    const hasErr = !!errors[key];
    e.currentTarget.style.borderColor = hasErr ? '#f87171' : 'var(--border)';
    e.currentTarget.style.background = 'var(--card)';
  };

  if (status === 'ok') {
    return (
      <div style={{
        padding:'40px 24px', textAlign:'center',
        border:'1px solid color-mix(in srgb, var(--a1) 40%, transparent)',
        background:'color-mix(in srgb, var(--a1) 8%, transparent)',
        borderRadius:'var(--r)', color:'var(--a1)',
      }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:14 }}>
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
        </svg>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:'var(--text)' }}>
          {tx(lang,'contact_ok')}
        </div>
      </div>
    );
  }

  const errStyle = { fontSize:12, color:'#f87171', margin:'4px 2px 0', minHeight:14, textAlign:'left' };

  return (
    <form onSubmit={onSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:14, textAlign:'left' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div>
          <div className={`field${touched.name && errors.name ? ' err' : ''}`}>
            <input id="cf-name" name="name" type="text" placeholder=" " value={name}
              onChange={e=>setName(e.target.value)} onBlur={() => setTouched(t => ({ ...t, name:true }))}
              aria-invalid={!!(touched.name && errors.name)} />
            <label htmlFor="cf-name">{tx(lang,'contact_name')}</label>
          </div>
          <div className="field-err">{touched.name && errors.name}</div>
        </div>
        <div>
          <div className={`field${touched.email && errors.email ? ' err' : ''}`}>
            <input id="cf-email" name="email" type="email" placeholder=" " value={email}
              onChange={e=>setEmail(e.target.value)} onBlur={() => setTouched(t => ({ ...t, email:true }))}
              aria-invalid={!!(touched.email && errors.email)} />
            <label htmlFor="cf-email">{tx(lang,'contact_email_lbl')}</label>
          </div>
          <div className="field-err">{touched.email && errors.email}</div>
        </div>
      </div>
      <div>
        <div className={`field${touched.msg && errors.msg ? ' err' : ''}`}>
          <textarea id="cf-msg" name="message" placeholder=" " value={msg} rows={5}
            onChange={e=>setMsg(e.target.value)} onBlur={() => setTouched(t => ({ ...t, msg:true }))}
            aria-invalid={!!(touched.msg && errors.msg)} />
          <label htmlFor="cf-msg">{tx(lang,'contact_msg')}</label>
        </div>
        <div className="field-err">{touched.msg && errors.msg}</div>
      </div>
      {status === 'err' && (
        <div style={{ fontSize:13, color:'#f87171', padding:'4px 2px' }}>{tx(lang,'contact_err')}</div>
      )}
      <button type="submit" disabled={status==='sending'} style={{
        padding:'13px 30px', borderRadius:50, marginTop:8,
        background: status==='sending' ? 'var(--border)' : 'var(--a1)',
        color: status==='sending' ? 'var(--muted)' : 'var(--bg)', fontWeight:600, fontSize:15, fontFamily:'inherit',
        border:'1px solid var(--a1)', cursor: status==='sending' ? 'wait' : 'pointer',
        boxShadow:'var(--shadow-glow)', transition:'all 0.2s', alignSelf:'flex-start',
      }}>
        {status==='sending' ? tx(lang,'contact_sending') : tx(lang,'contact_send')}
      </button>
    </form>
  );
}

function ContactSection({ lang }) {
  const [ref, vis] = useInView();
  const socials = window.SOCIALS || [];
  return (
    <section id="contact" style={{ padding:'110px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:660, margin:'0 auto', textAlign:'center' }}>
        <SectionLabel color="a1" num="04">{tx(lang,'contact_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:18, lineHeight:1.65, marginBottom:36 }}>
          {tx(lang,'contact_desc')}
        </p>

        <ContactForm lang={lang} />

        {(window.CONTACT_EMAIL && window.CONTACT_EMAIL !== 'jenda@example.com') && (<React.Fragment>
        <div style={{ display:'flex', alignItems:'center', gap:14, margin:'32px 0 24px', color:'var(--muted)', fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', opacity:0.6 }}>
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
          {tx(lang,'contact_or')}
          <div style={{ flex:1, height:1, background:'var(--border)' }} />
        </div>

        <a href={`mailto:${window.CONTACT_EMAIL}`} style={{
          fontFamily:"'Syne',sans-serif", fontWeight:600, fontSize:17,
          color:'var(--a2)', borderBottom:'1px dashed color-mix(in srgb, var(--a2) 50%, transparent)',
        }}>
          {window.CONTACT_EMAIL}
        </a>
        </React.Fragment>)}

        {/* Donation widget */}
        <div style={{ marginTop:28 }}>
          <DonationButton lang={lang} />
        </div>

        <div style={{ marginTop:54 }}>
          <p style={{ fontSize:11, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:22, opacity:0.7 }}>
            {tx(lang,'contact_follow')}
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            {socials.map(s => (
              <a key={s.id} href={s.url} title={s.label} aria-label={s.label} style={{
                width:48, height:48, borderRadius:12,
                background:'var(--card)', border:'1px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'var(--muted)', transition:'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--a1)'; e.currentTarget.style.color='var(--a1)'; e.currentTarget.style.background='color-mix(in srgb, var(--a1) 10%, transparent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.background='var(--card)'; }}>
                <SocialIco id={s.id} size={21} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }) {
  return (
    <footer style={{ padding:'28px 24px', textAlign:'center', borderTop:'1px solid var(--border)', color:'var(--muted)', fontSize:13 }}>
      © 2026 Jenda &nbsp;·&nbsp; <span style={{ opacity:0.6 }}>{tx(lang,'footer')}</span>
    </footer>
  );
}

Object.assign(window, { AudioPlayer, ShortcutsOverlay, ContactForm, ContactSection, Footer });
