// queue.jsx — Queue drawer (Q to open) showing upcoming tracks
const { useState: __useS_q, useEffect: __useE_q } = React;

function QueueDrawer({ playlist, currentTrack, history, onPlay, onClose, lang }) {
  __useE_q(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const albums = window.ALBUMS || [];
  const albumMap = Object.fromEntries(albums.map(a => [a.id, a]));
  const currentIdx = playlist.findIndex(t => t.id === currentTrack?.id);
  const upcoming = currentIdx >= 0 ? playlist.slice(currentIdx + 1) : [];
  const past = history.slice(-5).reverse(); // last 5 played

  const renderRow = (t, kind) => {
    const al = albumMap[t.album];
    return (
      <button key={`${kind}-${t.id}`} onClick={() => onPlay(t)} style={{
        width:'100%', display:'flex', alignItems:'center', gap:12,
        padding:'10px 14px', borderRadius:8, textAlign:'left',
        background: kind === 'current' ? 'color-mix(in srgb, var(--a1) 16%, transparent)' : 'transparent',
        border: kind === 'current' ? '1px solid color-mix(in srgb, var(--a1) 40%, transparent)' : '1px solid transparent',
        opacity: kind === 'past' ? 0.55 : 1,
        transition:'all 0.12s', cursor:'pointer', marginBottom:2,
      }}
      onMouseEnter={e => { if (kind !== 'current') e.currentTarget.style.background = 'var(--card)'; }}
      onMouseLeave={e => { if (kind !== 'current') e.currentTarget.style.background = 'transparent'; }}>
        <div style={{ width:32, height:32, borderRadius:6, flexShrink:0, backgroundImage:`url("${trackArt(t.id, al)}")`, backgroundSize:'cover' }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color: kind === 'current' ? 'var(--a1)' : 'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.title}</div>
          <div style={{ fontSize:11, color:'var(--muted)' }}>{al?.title || ''}</div>
        </div>
        <span style={{ fontSize:11, color:'var(--muted)', flexShrink:0, fontVariantNumeric:'tabular-nums' }}>{t.duration}</span>
      </button>
    );
  };

  const sectionLbl = (text) => (
    <p style={{
      fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase',
      color:'var(--muted)', opacity:0.7, margin:'18px 6px 8px',
    }}>{text}</p>
  );

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label="Queue"
      style={{
        position:'fixed', inset:0, zIndex:380,
        background:'color-mix(in srgb, var(--bg) 60%, rgba(0,0,0,0.5))',
        backdropFilter:'blur(8px)',
        display:'flex', justifyContent:'flex-end',
        animation:'overlayIn 0.18s ease',
      }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'var(--bg2)', borderLeft:'1px solid var(--border)',
        width:'100%', maxWidth:380,
        height:'100%',
        display:'flex', flexDirection:'column',
        animation:'drawerIn 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow:'-20px 0 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px', borderBottom:'1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, letterSpacing:'-0.02em' }}>
              {lang === 'cs' ? 'Fronta' : 'Queue'}
            </div>
            <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>
              {playlist.length} {lang === 'cs' ? 'skladeb' : 'tracks'}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ color:'var(--muted)', padding:6 }}><CloseIco /></button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'10px 16px' }}>
          {currentTrack && (
            <>
              {sectionLbl(lang === 'cs' ? 'Přehrává se' : 'Now playing')}
              {renderRow(currentTrack, 'current')}
            </>
          )}
          {upcoming.length > 0 && (
            <>
              {sectionLbl(lang === 'cs' ? 'Další v řadě' : 'Up next')}
              {upcoming.map(t => renderRow(t, 'upcoming'))}
            </>
          )}
          {past.length > 0 && (
            <>
              {sectionLbl(lang === 'cs' ? 'Nedávno přehráno' : 'Recently played')}
              {past.map(t => renderRow(t, 'past'))}
            </>
          )}
          {!currentTrack && upcoming.length === 0 && past.length === 0 && (
            <div style={{ padding:'60px 20px', textAlign:'center', color:'var(--muted)', fontSize:13 }}>
              {lang === 'cs' ? 'Žádná fronta. Vyber skladbu pro přehrání.' : 'Empty queue. Pick a track to start.'}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          padding:'12px 20px', borderTop:'1px solid var(--border)',
          fontSize:11, color:'var(--muted)', opacity:0.6,
          display:'flex', gap:14, alignItems:'center',
        }}>
          <span style={{ display:'flex', gap:6, alignItems:'center' }}><kbd>Q</kbd> {lang === 'cs' ? 'fronta' : 'queue'}</span>
          <span style={{ display:'flex', gap:6, alignItems:'center' }}><kbd>Esc</kbd> {lang === 'cs' ? 'zavřít' : 'close'}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { QueueDrawer });
