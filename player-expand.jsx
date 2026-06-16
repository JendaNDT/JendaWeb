// player-expand.jsx — Full-screen "now playing" view with viz modes, lyrics & analyzer
const { useState: __useS_xp, useEffect: __useE_xp, useRef: __useR_xp } = React;

// GeoViz — morfující geometrický útvar (tečky + spoje) za obsahem celoobrazovkového
// přehrávače. Desktop: reaguje na reálné spektrum (sdílený AnalyserNode). Mobil (bez
// analyseru): plynule žije přes čas (rotace + jemné dýchání), bez falešných beatů.
// Barvy bere z motivu webu (--a1/--a2). Respektuje prefers-reduced-motion.
function GeoViz({ analyser, isPlaying }) {
  const ref = __useR_xp(null);
  const playingRef = __useR_xp(isPlaying);
  playingRef.current = isPlaying;

  __useE_xp(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const N = 16, LAYERS = 4, TOT = N * LAYERS;
    const col = { a1:[249,115,22], a2:[251,191,36] };
    const env = { bass:0, level:0, surge:0, flash:0, treble:0 };
    const binEnv = new Float32Array(TOT);
    const seed = new Float32Array(TOT);
    const nodeBin = new Int16Array(TOT);
    for (let i=0;i<TOT;i++){ seed[i]=Math.random()*Math.PI*2; nodeBin[i]=2+Math.floor((i/TOT)*92); }
    const center = { cx:0, cy:0, R:60 };
    let raf=null, running=false, t=0, frame=0, W=0, H=0, bassHist=[], beatCool=0, rings=[];

    function parseColor(str, fb){
      str=(str||'').trim();
      let m=str.match(/^#([0-9a-fA-F]{6})$/);
      if(m){ const n=parseInt(m[1],16); return [(n>>16)&255,(n>>8)&255,n&255]; }
      m=str.match(/rgba?\(([^)]+)\)/);
      if(m){ const p=m[1].split(',').map(s=>parseFloat(s)); return [p[0]||0,p[1]||0,p[2]||0]; }
      return fb;
    }
    function sampleTheme(){
      try{ const cs=getComputedStyle(document.documentElement);
        col.a1=parseColor(cs.getPropertyValue('--a1'),[249,115,22]);
        col.a2=parseColor(cs.getPropertyValue('--a2'),[251,191,36]);
      }catch(e){}
    }
    function measure(){
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W*dpr));
      canvas.height = Math.max(1, Math.floor(H*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
      let cx=W/2, cy=H*0.42, R=Math.min(W,H)*0.20;
      try{ const el=document.getElementById('jw-expand-cover');
        if(el){ const r=el.getBoundingClientRect(); if(r.width>0){ cx=r.left+r.width/2; cy=r.top+r.height/2; R=r.width/2; } }
      }catch(e){}
      center.cx=cx; center.cy=cy; center.R=R;
    }
    function levels(){
      const an = analyser || window.__jwAnalyser; if(!an) return null;
      try{
        const n=an.frequencyBinCount, bins=new Uint8Array(n);
        an.getByteFrequencyData(bins);
        const avg=(a,b)=>{ a=Math.min(a,n); b=Math.min(b,n); let s=0; for(let i=a;i<b;i++) s+=bins[i]; return s/Math.max(1,(b-a)*255); };
        const bass=avg(1,7), lowmid=avg(7,18), mid=avg(18,42), treble=avg(42,96);
        if(bass+lowmid+mid+treble < 0.02) return null;
        return { bass, treble, level: bass*0.5+lowmid*0.25+mid*0.15+treble*0.10, bins };
      }catch(e){ return null; }
    }
    function draw(){
      t+=0.016; frame++;
      if(frame%45===0) sampleTheme();
      if(frame%20===0) measure();
      ctx.clearRect(0,0,W,H);
      const playing = !!playingRef.current;
      const a = playing ? levels() : null;
      const real = !!a;

      if(real){
        const bins=a.bins;
        for(let i=0;i<TOT;i++){ const v = nodeBin[i]<bins.length ? bins[nodeBin[i]]/255 : 0; binEnv[i] = v>binEnv[i] ? v : binEnv[i]*0.90; }
        env.bass  = a.bass  > env.bass  ? a.bass  : env.bass*0.90;
        env.level = a.level > env.level ? a.level : env.level*0.92;
        env.treble += (a.treble - env.treble) * 0.15;
        bassHist.push(a.bass); if(bassHist.length>43) bassHist.shift();
        let mavg=0; for(let i=0;i<bassHist.length;i++) mavg+=bassHist[i]; mavg/=bassHist.length;
        beatCool--;
        if(a.bass>0.11 && a.bass>mavg*1.38 && beatCool<=0){ env.flash=1; env.surge=1; beatCool=7; rings.push({ r:center.R*0.95, a:0.9, w:1+a.bass*2 }); }
      } else {
        for(let i=0;i<TOT;i++) binEnv[i]*=0.92;
        env.bass*=0.92; env.level*=0.92; env.treble*=0.92;
      }
      env.flash*=0.90; env.surge*=0.90;

      const synth = (!real && playing) ? 1 : 0;          // mobil/bez FFT: plynulý život, ne falešné beaty
      const breath = 0.10*(0.5+0.5*Math.sin(t*0.6));      // klidové dýchání
      const motion = synth ? (0.28 + 0.12*Math.sin(t*0.9)) : breath;
      const drive = Math.max(env.bass, motion);
      const lvl   = Math.max(env.level, motion*1.1);

      const cx=center.cx, cy=center.cy, R=center.R;
      ctx.globalCompositeOperation = 'lighter';

      for(let i=rings.length-1;i>=0;i--){ const rg=rings[i]; rg.r+=6+env.level*10; rg.a*=0.93; if(rg.a<0.03){ rings.splice(i,1); continue; }
        ctx.strokeStyle=`rgba(${col.a1[0]},${col.a1[1]},${col.a1[2]},${rg.a*0.22})`; ctx.lineWidth=rg.w; ctx.beginPath(); ctx.arc(cx,cy,rg.r,0,Math.PI*2); ctx.stroke(); }

      const m = 4 + 2*Math.sin(t*0.16);                   // symetrie morfuje mezi ~3 a ~6 cípy
      const ring0 = R*1.10, gap = Math.max(W,H)*0.085;     // 1. vrstva těsně za obalem, další roztažené přes obrazovku
      const baseRs = [ring0, ring0+gap, ring0+gap*2, ring0+gap*3];
      const rotDir = [1,-1,1,-1];
      const speed = 0.10 + env.treble*0.25 + synth*0.05;
      const pts = [];
      for(let l=0;l<LAYERS;l++){
        pts[l]=[];
        const rot = t*speed*rotDir[l] + l*0.4;
        const amp = 0.12 + env.bass*0.10 + synth*0.03 + (real?0:breath*0.3);
        for(let i=0;i<N;i++){
          const idx=l*N+i;
          const th = i/N*Math.PI*2 + rot;
          const lobe = 1 + amp*Math.sin(m*th + t*0.5 + l*1.3);
          const be = binEnv[idx];
          const r = baseRs[l]*lobe*(1+env.surge*0.08)*(1+be*0.18);
          pts[l][i] = { x:cx+Math.cos(th)*r, y:cy+Math.sin(th)*r, be };
        }
      }
      ctx.lineWidth=1;
      for(let l=0;l<LAYERS;l++){ for(let i=0;i<N;i++){
        const A=pts[l][i], B=pts[l][(i+1)%N];
        const o=0.05+lvl*0.16+env.flash*0.22;
        ctx.strokeStyle=`rgba(${col.a1[0]},${col.a1[1]},${col.a1[2]},${Math.min(0.5,o)})`;
        ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.stroke();
        if(l<LAYERS-1){ const C=pts[l+1][i]; const o2=0.035+lvl*0.11+env.flash*0.16;
          ctx.strokeStyle=`rgba(${col.a2[0]},${col.a2[1]},${col.a2[2]},${Math.min(0.4,o2)})`;
          ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(C.x,C.y); ctx.stroke(); }
      }}
      for(let l=0;l<LAYERS;l++){ for(let i=0;i<N;i++){
        const p=pts[l][i]; const c=(i%2===0)?col.a1:col.a2;
        const rr=1.4+drive*1.6+p.be*2.2+env.flash*0.8;
        const al=Math.min(0.95, 0.16+drive*0.42+p.be*0.6+env.flash*0.22);
        ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${al})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(0.6,rr),0,Math.PI*2); ctx.fill();
      }}
      ctx.globalCompositeOperation='source-over';
      if(running) raf=requestAnimationFrame(draw);
    }
    function start(){ if(!running){ running=true; raf=requestAnimationFrame(draw); } }
    function stop(){ running=false; if(raf) cancelAnimationFrame(raf); raf=null; }

    sampleTheme(); measure();
    const onResize=()=>measure();
    window.addEventListener('resize', onResize);
    const onVis=()=>{ if(document.hidden) stop(); else start(); };
    document.addEventListener('visibilitychange', onVis);
    if(reduce){ draw(); } else start();
    return ()=>{ stop(); window.removeEventListener('resize', onResize); document.removeEventListener('visibilitychange', onVis); };
  }, [analyser]);

  return <canvas ref={ref} aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }} />;
}

function ExpandMode({
  track, album,
  currentTime, duration, progress, bars, fft, seekFromEvent, hovBar, setHovBar,
  isPlaying, setIsPlaying, onPrev, onNext, onClose,
  shuffle, setShuffle, repeat, setRepeat,
  vol, setVol, muted, setMuted,
  onShare, lang,
  vizMode, setVizMode,
  showAnalyzer, setShowAnalyzer,
  showLyrics, setShowLyrics,
  loopA, loopB, setLoopA, setLoopB,
  analyser,
  handlePointerDown, handlePointerMove, handlePointerUp, isDraggingRef,
}) {
  __useE_xp(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' || (e.key === 'ArrowDown' && !e.shiftKey && !showLyrics)) { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, showLyrics]);

  if (!track) return null;
  const art = trackArt(track.id, album);
  const hasLyrics = !!track.lyrics;

  // Render waveform based on vizMode
  const renderViz = () => {
    if (vizMode === 'radial') return renderRadial();
    if (vizMode === 'mirror') return renderMirror();
    return renderBars();
  };

  const barColor = (p, played, hovered) =>
    played ? '#fff' : hovered ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.22)';

  const renderBars = () => (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={e => {
        if (isDraggingRef?.current) {
          handlePointerMove(e);
        } else {
          const r=e.currentTarget.getBoundingClientRect();
          setHovBar?.(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)));
        }
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => { if (!isDraggingRef?.current) setHovBar?.(null); }}
      role="slider" aria-label="Seek"
      aria-valuemin={0} aria-valuemax={duration || 0} aria-valuenow={currentTime}
      style={{
        height:54, display:'flex', alignItems:'center', justifyContent:'space-between',
        gap:1, cursor:'pointer', position:'relative', touchAction:'none',
      }}>
      {bars.map((h, i) => {
        const p = (i + 0.5) / bars.length;
        const played = p <= progress;
        const hovered = hovBar != null && p <= hovBar && p > progress;
        const liveH = fft && fft[i] ? Math.max(0.12, (fft[i] / 255) * 1.15) : h;
        return (
          <span key={i} style={{
            flex:1, height:`${Math.min(1, liveH)*100}%`, minHeight:3, borderRadius:1.5,
            background: barColor(p, played, hovered),
            transition: fft ? 'none' : 'background 0.08s',
          }} />
        );
      })}
    </div>
  );

  const renderMirror = () => (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider" aria-label="Seek"
      style={{ height:72, position:'relative', cursor:'pointer', touchAction:'none' }}>
      {/* Top half */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', display:'flex', alignItems:'flex-end', gap:1 }}>
        {bars.map((h, i) => {
          const p = (i + 0.5) / bars.length;
          const played = p <= progress;
          const liveH = fft && fft[i] ? Math.max(0.12, (fft[i] / 255) * 1.15) : h;
          return <span key={i} style={{ flex:1, height:`${Math.min(1, liveH)*100}%`, minHeight:3, borderRadius:'1.5px 1.5px 0 0', background: barColor(p, played, false) }} />;
        })}
      </div>
      {/* Bottom half (mirrored) */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'50%', display:'flex', alignItems:'flex-start', gap:1 }}>
        {bars.map((h, i) => {
          const p = (i + 0.5) / bars.length;
          const played = p <= progress;
          const liveH = fft && fft[i] ? Math.max(0.12, (fft[i] / 255) * 1.15) : h;
          return <span key={i} style={{ flex:1, height:`${Math.min(1, liveH * 0.7)*100}%`, minHeight:2, borderRadius:'0 0 1.5px 1.5px', background: barColor(p, played, false), opacity:0.5 }} />;
        })}
      </div>
      <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'rgba(255,255,255,0.18)', transform:'translateY(-50%)' }} />
    </div>
  );

  const renderRadial = () => {
    const N = bars.length;
    const size = 200;
    const cx = size/2, cy = size/2;
    const inner = 36, maxOuter = 90;
    return (
      <div style={{ display:'flex', justifyContent:'center', height:size, position:'relative' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow:'visible' }}>
          {bars.map((h, i) => {
            const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
            const p = (i + 0.5) / N;
            const played = p <= progress;
            const liveH = fft && fft[i] ? Math.max(0.12, (fft[i] / 255) * 1.15) : h;
            const len = inner + Math.min(1, liveH) * (maxOuter - inner);
            const x1 = cx + Math.cos(angle) * inner;
            const y1 = cy + Math.sin(angle) * inner;
            const x2 = cx + Math.cos(angle) * len;
            const y2 = cy + Math.sin(angle) * len;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={played ? '#fff' : 'rgba(255,255,255,0.3)'}
                strokeWidth="2.5" strokeLinecap="round"
              />
            );
          })}
          <circle cx={cx} cy={cy} r="2" fill="#fff" />
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontVariantNumeric:'tabular-nums', letterSpacing:'0.06em' }}>
            {fmtTime(currentTime)}
          </div>
        </div>
      </div>
    );
  };

  const topBtn = (props, children) => (
    <button {...props} style={{
      width:40, height:40, borderRadius:'50%',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,0.35)', color:'#fff',
      backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.15)',
      ...props.style,
    }}>{children}</button>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label={track.title}
      style={{
        position:'fixed', inset:0, zIndex:350,
        background:'#000',
        animation:'expandIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
        overflow:'hidden',
      }}>
      {/* Blurred art background */}
      <div aria-hidden style={{
        position:'absolute', inset:0,
        backgroundImage:`url("${art}")`,
        backgroundSize:'cover', backgroundPosition:'center',
        filter:'blur(110px) brightness(0.45) saturate(1.5)',
        transform:'scale(1.35)',
      }} />
      <div aria-hidden style={{
        position:'absolute', inset:0,
        background:'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55))',
      }} />

      {/* Geometrická audio-reaktivní vizualizace — za obsahem, nad rozmazaným pozadím */}
      <GeoViz analyser={analyser} isPlaying={isPlaying} />

      {/* Top bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, zIndex:2,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'22px 28px',
      }}>
        <button onClick={onClose} aria-label="Collapse" title="Collapse (Esc)" style={{
          display:'flex', alignItems:'center', gap:8,
          padding:'10px 16px', borderRadius:50,
          background:'rgba(0,0,0,0.35)', color:'#fff',
          backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.15)',
          fontSize:13, fontWeight:500,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 14l5 5 5-5"/></svg>
          {lang === 'cs' ? 'Sbalit' : 'Collapse'}
        </button>
        <div style={{
          fontSize:11, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.7)',
        }}>
          {lang === 'cs' ? '♪ Přehrávám' : '♪ Now Playing'}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {topBtn({
            onClick: () => setVizMode(v => ({ bars:'radial', radial:'mirror', mirror:'bars' })[v] || 'bars'),
            'aria-label': `Visualizer (V)`, title: `Visualizer: ${vizMode} (V)`,
            style: { color: vizMode === 'bars' ? '#fff' : 'var(--a2)' },
          }, <span style={{ fontSize:11, fontWeight:700, fontFamily:'ui-monospace,monospace' }}>V</span>)}
          {hasLyrics && topBtn({
            onClick: () => setShowLyrics(s => !s),
            'aria-label': 'Lyrics', title: 'Lyrics',
            style: { color: showLyrics ? 'var(--a2)' : '#fff' },
          }, <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/></svg>)}
          {topBtn({
            onClick: () => setShowAnalyzer(s => !s),
            'aria-label': 'Audio analyzer (D)', title: 'Audio analyzer (D)',
            style: { color: showAnalyzer ? 'var(--a2)' : '#fff' },
          }, <span style={{ fontSize:11, fontWeight:700, fontFamily:'ui-monospace,monospace' }}>D</span>)}
          {onShare && topBtn({
            onClick: (e) => onShare(e.shiftKey),
            'aria-label': 'Share', title: 'Share (Shift+click for timestamp)',
          }, <ShareIco />)}
        </div>
      </div>

      {/* Audio analyzer overlay */}
      {showAnalyzer && (
        <AnalyzerOverlay analyser={analyser} fft={fft} currentTime={currentTime} duration={duration} speed={1} />
      )}

      {/* Centered content */}
      <div style={{
        position:'relative', zIndex:1, height:'100%',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'80px 24px 40px', gap:24,
        transform: showLyrics ? 'translateY(-15%)' : 'none',
        transition:'transform 0.4s ease',
      }}>
        {/* Cover */}
        <div id="jw-expand-cover" className={isPlaying ? 'vinyl-spin' : ''} style={{
          width:'min(48vh, 320px)', aspectRatio:'1 / 1',
          borderRadius:'50%', overflow:'hidden',
          backgroundImage:`url("${art}")`, backgroundSize:'cover',
          boxShadow:'0 30px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 4px rgba(0,0,0,0.35)',
          position:'relative',
        }}>
          {/* Vinyl center hole */}
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%, -50%)',
            width:'14%', height:'14%', borderRadius:'50%',
            background:'rgba(0,0,0,0.55)',
            boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.12)',
          }} />
        </div>

        {/* Title block */}
        <div style={{ textAlign:'center', color:'#fff', maxWidth:'min(700px, 92vw)' }}>
          <h2 style={{
            fontFamily:"'Syne',sans-serif",
            fontSize:'clamp(28px, 5vw, 46px)',
            fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.05,
            marginBottom:8, textWrap:'balance',
          }}>{track.title}</h2>
          <div style={{ fontSize:'clamp(14px, 2vw, 17px)', color:'rgba(255,255,255,0.72)' }}>
            {album?.title}{album?.year && ` · ${album.year}`}
          </div>
        </div>

        {/* Waveform */}
        <div style={{ width:'min(680px, 92vw)', position:'relative' }}>
          {renderViz()}
          {/* A/B markers on waveform (only in bars mode) */}
          {vizMode === 'bars' && (loopA != null || loopB != null) && duration > 0 && (
            <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
              {loopA != null && (
                <div style={{ position:'absolute', left:`${(loopA/duration)*100}%`, top:0, bottom:0, width:2, background:'var(--a2)', boxShadow:'0 0 8px var(--a2)' }}>
                  <span style={{ position:'absolute', top:-18, left:-8, fontSize:10, fontWeight:700, color:'var(--a2)', fontFamily:'ui-monospace,monospace' }}>A</span>
                </div>
              )}
              {loopB != null && (
                <div style={{ position:'absolute', left:`${(loopB/duration)*100}%`, top:0, bottom:0, width:2, background:'var(--a2)', boxShadow:'0 0 8px var(--a2)' }}>
                  <span style={{ position:'absolute', top:-18, left:-8, fontSize:10, fontWeight:700, color:'var(--a2)', fontFamily:'ui-monospace,monospace' }}>B</span>
                </div>
              )}
            </div>
          )}
          <div style={{
            display:'flex', justifyContent:'space-between',
            fontSize:12, color:'rgba(255,255,255,0.7)',
            fontVariantNumeric:'tabular-nums', marginTop:6,
          }}>
            <span>{fmtTime(currentTime)}</span>
            <span style={{ display:'flex', alignItems:'center', gap:10 }}>
              {(loopA != null || loopB != null) && (
                <span style={{ fontSize:10, color:'var(--a2)', fontWeight:700, fontFamily:'ui-monospace,monospace' }}>
                  A-B {loopA != null && loopB != null ? '🔁' : '·'}
                  <button onClick={() => { setLoopA(null); setLoopB(null); }} style={{ marginLeft:6, color:'var(--muted)', fontSize:10 }}>×</button>
                </span>
              )}
              <span>{fmtTime(duration || parseDur(track?.duration))}</span>
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display:'flex', alignItems:'center', gap:28 }}>
          <button onClick={() => setShuffle(s => !s)} aria-label="Shuffle" title="Shuffle"
            style={{ color: shuffle ? 'var(--a2)' : 'rgba(255,255,255,0.5)', display:'flex', padding:8 }}>
            <ShuffleIco />
          </button>
          <button onClick={onPrev} aria-label="Previous" title="Previous (←)"
            style={{ color:'rgba(255,255,255,0.85)', display:'flex', padding:8 }}>
            <PrevIco />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)} aria-label={isPlaying ? 'Pause' : 'Play'} title={isPlaying ? 'Pause' : 'Play'}
            style={{
              width:72, height:72, borderRadius:'50%',
              background:'#fff', color:'#000',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 8px 40px rgba(255,255,255,0.25)', transition:'transform 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
            <div style={{ transform: isPlaying ? 'none' : 'translateX(2px)' }}>
              {isPlaying ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </div>
          </button>
          <button onClick={onNext} aria-label="Next" title="Next (→)"
            style={{ color:'rgba(255,255,255,0.85)', display:'flex', padding:8 }}>
            <NextIco />
          </button>
          <button onClick={() => setRepeat(r => r === 'off' ? 'all' : r === 'all' ? 'one' : 'off')}
            aria-label={`Repeat: ${repeat}`} title={`Repeat: ${repeat}`}
            style={{ color: repeat !== 'off' ? 'var(--a2)' : 'rgba(255,255,255,0.5)', display:'flex', padding:8 }}>
            {repeat === 'one' ? <RepeatOneIco /> : <RepeatIco />}
          </button>
        </div>

        {/* Volume */}
        <div style={{ display:'flex', alignItems:'center', gap:12, width:'min(280px, 80vw)', color:'rgba(255,255,255,0.7)' }}>
          <button onClick={() => setMuted(m => !m)} aria-label="Mute" style={{ color: muted ? 'var(--a2)' : 'inherit', display:'flex' }}>
            {muted ? <MuteIco /> : <VolIco />}
          </button>
          <input id="expanded-player-volume" name="volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : vol}
            onChange={e => { setVol(+e.target.value); setMuted(false); }}
            style={{ flex:1 }} aria-label="Volume" />
        </div>
      </div>

      {/* Lyrics panel — slide-up from bottom */}
      {showLyrics && hasLyrics && (
        <div style={{
          position:'absolute', left:0, right:0, bottom:0,
          height:'48vh', zIndex:3,
          background:'rgba(8,5,3,0.92)', backdropFilter:'blur(20px)',
          borderTop:'1px solid rgba(255,255,255,0.1)',
          animation:'drawerIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display:'flex', flexDirection:'column',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 28px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.8)' }}>
              {lang === 'cs' ? 'Text skladby' : 'Lyrics'}
            </div>
            <button onClick={() => setShowLyrics(false)} aria-label="Close lyrics" style={{ color:'rgba(255,255,255,0.5)', padding:6 }}>
              <CloseIco />
            </button>
          </div>
          <div style={{
            flex:1, overflowY:'auto', padding:'24px 32px',
            fontSize:16, lineHeight:1.85, color:'rgba(255,255,255,0.88)',
            fontFamily:"'Syne',sans-serif", fontWeight:500,
            textAlign:'center', whiteSpace:'pre-line', textWrap:'pretty',
          }}>
            {lang === 'cs' ? track.lyrics.cs : track.lyrics.en}
          </div>
        </div>
      )}
    </div>
  );
}

// Audio analyzer overlay — monospace stats from AnalyserNode
function AnalyzerOverlay({ analyser, fft, currentTime, duration, speed }) {
  const [stats, setStats] = __useS_xp({ peakHz: 0, peakBin: 0, rms: 0, range: 0 });

  __useE_xp(() => {
    if (!analyser) return;
    let frameId;
    const loop = () => {
      try {
        const buf = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(buf);
        let max = 0, maxBin = 0, sum = 0, sqSum = 0;
        const sampleRate = analyser.context?.sampleRate || 48000;
        const binHz = sampleRate / 2 / buf.length;
        for (let i = 0; i < buf.length; i++) {
          const v = buf[i];
          if (v > max) { max = v; maxBin = i; }
          sum += v; sqSum += v * v;
        }
        const rms = Math.sqrt(sqSum / buf.length);
        const range = max - (sum / buf.length);
        setStats({ peakHz: Math.round(maxBin * binHz), peakBin: maxBin, rms: Math.round(rms), range: Math.round(range) });
      } catch {}
      frameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(frameId);
  }, [analyser]);

  return (
    <div style={{
      position:'absolute', top:90, left:28, zIndex:4,
      padding:'12px 14px',
      background:'rgba(0,0,0,0.55)', backdropFilter:'blur(20px)',
      border:'1px solid rgba(255,255,255,0.15)', borderRadius:8,
      fontFamily:'ui-monospace, SF Mono, Consolas, monospace',
      fontSize:11, color:'rgba(255,255,255,0.85)',
      display:'grid', gridTemplateColumns:'auto auto', gap:'4px 14px',
      letterSpacing:'0.02em', lineHeight:1.3,
      animation:'overlayPop 0.2s ease',
    }}>
      <span style={{ opacity:0.6 }}>peak.hz</span><span style={{ color:'var(--a2)' }}>{stats.peakHz}</span>
      <span style={{ opacity:0.6 }}>peak.bin</span><span>{stats.peakBin}</span>
      <span style={{ opacity:0.6 }}>rms</span><span>{stats.rms}</span>
      <span style={{ opacity:0.6 }}>range</span><span>{stats.range}</span>
      <span style={{ opacity:0.6 }}>time</span><span>{fmtTime(currentTime)} / {fmtTime(duration)}</span>
      <span style={{ opacity:0.6 }}>fft.n</span><span>{analyser?.frequencyBinCount || '—'}</span>
    </div>
  );
}

Object.assign(window, { ExpandMode, AnalyzerOverlay, GeoViz });
