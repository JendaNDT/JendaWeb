// Fullscreen app screenshots with keyboard, swipe, pinch and bounded panning.
function ScreenshotGallery({ images, initialIndex, title, lang, onClose }) {
  const [index, setIndex] = React.useState(initialIndex);
  const [view, setView] = React.useState({ scale:1, x:0, y:0 });
  const [interacting, setInteracting] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const dialog = React.useRef(null), stage = React.useRef(null), picture = React.useRef(null);
  const points = React.useRef(new Map()), gesture = React.useRef(null), viewRef = React.useRef(view);
  const actions = React.useRef(null);
  const cs = lang === 'cs';
  const constrain = React.useCallback(next => {
    const scale = Math.max(1, Math.min(4, next.scale));
    const xMax = Math.max(0, ((picture.current?.offsetWidth || 0) * scale - (stage.current?.clientWidth || 0)) / 2);
    const yMax = Math.max(0, ((picture.current?.offsetHeight || 0) * scale - (stage.current?.clientHeight || 0)) / 2);
    const bounded = { scale, x:Math.max(-xMax, Math.min(xMax, next.x)), y:Math.max(-yMax, Math.min(yMax, next.y)) };
    viewRef.current = bounded; setView(bounded);
  }, []);
  const go = delta => {
    if (images.length < 2) return;
    setIndex(i => (i + delta + images.length) % images.length);
    setFailed(false); constrain({ scale:1, x:0, y:0 });
  };
  const zoom = scale => constrain({ ...viewRef.current, scale });
  actions.current = { go, zoom };

  React.useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.focus({ preventScroll:true });
    const onKey = e => {
      // Consume keys before player/global shortcuts behind the gallery see them.
      e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); actions.current.go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); actions.current.go(-1); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); actions.current.zoom(viewRef.current.scale + .5); }
      else if (e.key === '-') { e.preventDefault(); actions.current.zoom(viewRef.current.scale - .5); }
      else if (e.key === '0') { e.preventDefault(); actions.current.zoom(1); }
      else if (e.key === 'Tab') {
        const controls = [...dialog.current.querySelectorAll('button:not(:disabled), a[href]')];
        const first = controls[0], last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
          e.preventDefault(); last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', onKey, true);
    const resize = () => constrain({ scale:1, x:0, y:0 });
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('resize', resize);
      previous?.isConnected && previous.focus({ preventScroll:true });
    };
  }, [onClose, constrain]);
  React.useEffect(() => {
    for (const delta of [-1, 1]) { const img = new Image(); img.src = images[(index + delta + images.length) % images.length]; }
  }, [index, images]);

  const begin = () => {
    const p = [...points.current.values()];
    if (!p.length) { gesture.current = null; return; }
    gesture.current = { start:p[0], view:{ ...viewRef.current }, multi:p.length > 1,
      distance:p.length > 1 ? Math.hypot(p[1].x-p[0].x, p[1].y-p[0].y) : 0,
      center:p.length > 1 ? { x:(p[0].x+p[1].x)/2, y:(p[0].y+p[1].y)/2 } : p[0] };
  };
  const down = e => {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    points.current.set(e.pointerId, { x:e.clientX, y:e.clientY });
    setInteracting(true); begin();
  };
  const move = e => {
    if (!points.current.has(e.pointerId) || !gesture.current) return;
    points.current.set(e.pointerId, { x:e.clientX, y:e.clientY });
    const p = [...points.current.values()], g = gesture.current;
    if (p.length > 1 && g.distance > 0) {
      const scale = Math.max(1, Math.min(4, g.view.scale * Math.hypot(p[1].x-p[0].x, p[1].y-p[0].y) / g.distance));
      const rect = stage.current.getBoundingClientRect();
      const anchor = { x:g.center.x-rect.left-rect.width/2, y:g.center.y-rect.top-rect.height/2 }, ratio = scale/g.view.scale;
      constrain({ scale, x:g.view.x*ratio + anchor.x*(1-ratio) + (p[0].x+p[1].x)/2-g.center.x,
        y:g.view.y*ratio + anchor.y*(1-ratio) + (p[0].y+p[1].y)/2-g.center.y });
    } else if (g.view.scale > 1) constrain({ ...g.view, x:g.view.x+p[0].x-g.start.x, y:g.view.y+p[0].y-g.start.y });
  };
  const up = e => {
    const g = gesture.current;
    if (!points.current.has(e.pointerId)) return;
    if (e.type === 'pointerup' && points.current.size === 1 && g && !g.multi && g.view.scale === 1) {
      const dx=e.clientX-g.start.x, dy=e.clientY-g.start.y;
      if (Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.25) go(dx<0 ? 1 : -1);
    }
    points.current.delete(e.pointerId);
    e.currentTarget.hasPointerCapture(e.pointerId) && e.currentTarget.releasePointerCapture(e.pointerId);
    if (!points.current.size) { setInteracting(false); gesture.current=null; }
    else { begin(); gesture.current.multi=true; }
  };

  return ReactDOM.createPortal(
    <div ref={dialog} className="screenshot-gallery" role="dialog" aria-modal="true" aria-labelledby="gallery-title" tabIndex={-1} data-gallery-dialog>
      <header className="gallery-toolbar">
        <div className="gallery-heading"><span>{cs ? 'UKÁZKY APLIKACE' : 'APP SCREENSHOTS'}</span><h2 id="gallery-title">{title}</h2></div>
        <div className="gallery-zoom">
          <button type="button" disabled={view.scale<=1} onClick={() => zoom(view.scale-.5)} aria-label={cs ? 'Oddálit' : 'Zoom out'}>−</button>
          <button type="button" onClick={() => zoom(1)} aria-label={cs ? 'Obnovit velikost' : 'Reset zoom'}>{Math.round(view.scale*100)} %</button>
          <button type="button" disabled={view.scale>=4} onClick={() => zoom(view.scale+.5)} aria-label={cs ? 'Přiblížit' : 'Zoom in'}>+</button>
        </div>
        <button type="button" className="gallery-close" onClick={onClose} aria-label={cs ? 'Zavřít galerii' : 'Close gallery'}>×</button>
      </header>
      <div className="gallery-viewer">
        <div ref={stage} className={`gallery-stage${interacting ? ' is-interacting' : ''}${view.scale>1 ? ' is-zoomed' : ''}`}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up}
          onDoubleClick={() => zoom(viewRef.current.scale>1 ? 1 : 2)}>
          {failed ? <p>{cs ? 'Náhled se nepodařilo načíst.' : 'The screenshot could not be loaded.'}</p>
            : <img key={index} ref={picture} src={images[index]} alt={`${title} — ${cs ? 'ukázka' : 'screenshot'} ${index+1}`}
              draggable={false} onError={() => setFailed(true)} style={{ transform:`translate(${view.x}px, ${view.y}px) scale(${view.scale})` }} />}
        </div>
        {images.length>1 && <>
          <button type="button" className="gallery-arrow gallery-prev" onClick={() => go(-1)} aria-label={cs ? 'Předchozí ukázka' : 'Previous screenshot'}>‹</button>
          <button type="button" className="gallery-arrow gallery-next" onClick={() => go(1)} aria-label={cs ? 'Další ukázka' : 'Next screenshot'}>›</button>
        </>}
      </div>
      <footer className="gallery-footer">
        <div className="gallery-caption"><span aria-live="polite" aria-atomic="true">{index+1} / {images.length}</span><span className="gallery-hint">{cs ? 'Přejetím listuj · Přibliž tlačítkem nebo dvěma prsty' : 'Swipe to browse · Zoom with buttons or two fingers'}</span><a href={images[index]} target="_blank" rel="noopener">{cs ? 'Originál ↗' : 'Original ↗'}</a></div>
        {images.length>1 && <div className="gallery-thumbnails">
          {images.map((src,i) => <button type="button" key={src+i} aria-label={`${cs ? 'Ukázka' : 'Screenshot'} ${i+1}`} aria-current={i===index ? 'true' : undefined}
            onClick={() => { setIndex(i); setFailed(false); constrain({ scale:1,x:0,y:0 }); }}><img src={src} alt="" loading="lazy" /></button>)}
        </div>}
      </footer>
    </div>, document.body
  );
}
