
// ==========================================
// FILE: tweaks-panel.jsx
// ==========================================
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});

// ==========================================
// FILE: shared.jsx
// ==========================================
// shared.jsx — themes, hooks, icons, helpers, base components
// Loaded BEFORE sections; all exports are attached to window so other Babel scripts can use them.
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ── Themes ─────────────────────────────────────────────────────────────
const THEMES = {
  ember:  { bg:'#0d0805', bg2:'#160d07', a1:'#f97316', a2:'#fbbf24', glow:'rgba(249,115,22,0.25)' },
  velvet: { bg:'#0e0508', bg2:'#180a0f', a1:'#e11d48', a2:'#f59e0b', glow:'rgba(225,29,72,0.22)' },
  desert: { bg:'#0c0905', bg2:'#150e07', a1:'#d97706', a2:'#f97316', glow:'rgba(217,119,6,0.25)' },
};

function applyTheme(key, mode) {
  const th = THEMES[key] || THEMES.ember;
  const r = document.documentElement;
  r.style.setProperty('--a1',   th.a1);
  r.style.setProperty('--a2',   th.a2);
  r.style.setProperty('--glow', th.glow);
  if (mode === 'light') {
    r.style.removeProperty('--bg');
    r.style.removeProperty('--bg2');
  } else {
    r.style.setProperty('--bg',  th.bg);
    r.style.setProperty('--bg2', th.bg2);
  }
}

function resolveMode(modePref) {
  if (modePref === 'light' || modePref === 'dark') return modePref;
  try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; }
  catch { return 'dark'; }
}

function applyMode(modePref) {
  const actual = resolveMode(modePref);
  document.documentElement.dataset.mode = actual;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', actual === 'light' ? '#fbf7f2' : '#0d0805');
  return actual;
}

const tx = (lang, key) => {
  const custom = window.STRINGS?.[lang]?.[key];
  if (custom !== undefined && custom !== null) return custom;
  const fallbacks = {
    cs: {
      apps_live_title: 'Spustitelné aplikace & PWA',
      apps_studies_title: 'Případové studie & Koncepty',
      apps_read_study: 'Číst studii'
    },
    en: {
      apps_live_title: 'Runnable Apps & PWAs',
      apps_studies_title: 'Case Studies & Concepts',
      apps_read_study: 'Read study'
    }
  };
  return fallbacks[lang]?.[key] ?? key;
};
const slugify = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');


// ── Storage keys ────────────────────────────────────────────────────────
const PLAYER_STORAGE_KEY = 'jw_player_state';
const VOL_STORAGE_KEY    = 'jw_player_volume';
const LIKES_TRACKS_KEY   = 'jw_liked_tracks';
const LIKES_APPS_KEY     = 'jw_liked_apps';

const getLikedItems = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
};

const isItemLiked = (key, id) => getLikedItems(key).includes(id);

const toggleLikedItem = (key, id) => {
  try {
    const list = getLikedItems(key);
    const idx = list.indexOf(id);
    const isLike = idx === -1;
    let next;
    if (isLike) next = list.concat(id);
    else next = list.filter(x => x !== id);
    localStorage.setItem(key, JSON.stringify(next));
    return isLike;
  } catch (e) { return false; }
};

const apiToggleLike = async (type, id, isLike) => {
  const supa = window.__jwSupa;
  if (!supa) return;
  const functionName = type === 'track' ? 'toggle_track_like' : 'toggle_app_like';
  const argName = type === 'track' ? 'track_id' : 'app_id';
  try {
    await fetch(`${supa.url}/rest/v1/rpc/${functionName}`, {
      method: 'POST',
      headers: {
        'apikey': supa.key,
        'Authorization': `Bearer ${supa.key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [argName]: id, is_like: isLike })
    });
  } catch (e) {
    console.error('[jw] Like failed:', e);
  }
};

// ── useInView ───────────────────────────────────────────────────────────
function useInView() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Icons ───────────────────────────────────────────────────────────────
const PlayIco  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const PauseIco = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const NextIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>;
const PrevIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>;
const DlIco    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
const CloseIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const VolIco   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>;
const MuteIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>;
const ShuffleIco    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>;
const RepeatIco     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
const RepeatOneIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/><path d="M11 10h1v4" strokeWidth="2.2"/></svg>;
const ShareIco      = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const SearchIco     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
const SunIco   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
const MoonIco  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const AutoIco  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 010 18" fill="currentColor"/></svg>;

function SocialIco({ id, size = 22 }) {
  const svgProps = { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor" };
  if (id === 'github')
    return <svg {...svgProps}><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
  if (id === 'youtube')
    return <svg {...svgProps}><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;
  if (id === 'soundcloud')
    return <svg {...svgProps} viewBox="0 0 32 32"><path d="M0 20.25c0 2.07 1.564 3.75 3.5 3.75.26 0 .516-.03.76-.083L4.27 24H28.5C30.43 24 32 22.43 32 20.5c0-1.77-1.328-3.228-3.047-3.46A8.499 8.499 0 0022 10a8.48 8.48 0 00-5.86 2.34A5.5 5.5 0 0011 11a5.49 5.49 0 00-4.898 3.013A4.003 4.003 0 000 17.75v2.5z"/></svg>;
  if (id === 'instagram')
    return <svg {...svgProps}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (id === 'bandcamp')
    return <svg {...svgProps}><path d="M0 18.75l7.437-13.5H24l-7.438 13.5z"/></svg>;
  return <span style={{ fontSize: size * 0.55, fontWeight: 700 }}>{id[0].toUpperCase()}</span>;
}

// Now-playing equalizer
function EqBars({ color = 'var(--a1)', delays = [0, 0.18, 0.36] }) {
  return (
    <div className="eq-bars" style={{ display:'flex', alignItems:'flex-end', gap:2, height:15 }}>
      {delays.map((d, i) => <span key={i} style={{ background:color, animationDelay:`${d}s` }} />)}
    </div>
  );
}

// Deterministic pseudo-random bar heights from a track id
function seededBars(seed, n = 72) {
  let s = (seed * 9301 + 49297) >>> 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    const env = 0.55 + 0.45 * Math.abs(Math.sin(i / n * Math.PI * 2.4 + seed * 0.3));
    out.push(Math.max(0.18, Math.min(1, r * 0.9 * env + 0.18)));
  }
  return out;
}

const fmtTime = (s) => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60), x = Math.floor(s % 60);
  return `${m}:${x < 10 ? '0' : ''}${x}`;
};

// Larger procedural cover for albums — mesh gradient + noise + faint geometric overlay.
function albumArt(album) {
  if (!album) return '';
  let h = 0;
  for (let i = 0; i < album.id.length; i++) h = ((h << 5) - h + album.id.charCodeAt(i)) | 0;
  const seed = Math.abs(h);
  const sid = (seed * 9301 + 49297) >>> 0;
  const rand = (n) => {
    let s = (sid + n * 1117) >>> 0;
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const g1 = album.g1, g2 = album.g2;
  const blobs = [
    { x: Math.floor(rand(1)*100),  y: Math.floor(rand(2)*100),  r: 55+Math.floor(rand(3)*35),  c: g1,        o: 0.95 },
    { x: Math.floor(rand(4)*100),  y: Math.floor(rand(5)*100),  r: 42+Math.floor(rand(6)*35),  c: g2,        o: 0.82 },
    { x: Math.floor(rand(7)*100),  y: Math.floor(rand(8)*100),  r: 30+Math.floor(rand(9)*30),  c: g1,        o: 0.4 },
    { x: Math.floor(rand(10)*100), y: Math.floor(rand(11)*100), r: 28+Math.floor(rand(12)*30), c: '#ffffff', o: 0.18 },
    { x: Math.floor(rand(13)*100), y: Math.floor(rand(14)*100), r: 22+Math.floor(rand(15)*22), c: '#000000', o: 0.25 },
  ];
  const shapeKind = Math.floor(rand(16) * 3);
  let shape = '';
  if (shapeKind === 0) {
    shape = `<circle cx='${20+Math.floor(rand(17)*60)}%' cy='${20+Math.floor(rand(18)*60)}%' r='18%' fill='none' stroke='#ffffff' stroke-opacity='0.12' stroke-width='0.7'/>`;
  } else if (shapeKind === 1) {
    shape = `<line x1='10%' y1='${40+Math.floor(rand(17)*20)}%' x2='90%' y2='${40+Math.floor(rand(18)*20)}%' stroke='#ffffff' stroke-opacity='0.1' stroke-width='0.6'/>`;
  } else {
    shape = `<rect x='${15+Math.floor(rand(17)*30)}%' y='${15+Math.floor(rand(18)*30)}%' width='40%' height='40%' fill='none' stroke='#ffffff' stroke-opacity='0.08' stroke-width='0.6' transform='rotate(${Math.floor(rand(19)*45)} 128 128)'/>`;
  }
  const defs = blobs.map((b, i) => `<radialGradient id='ab${i}' cx='${b.x}%' cy='${b.y}%' r='${b.r}%'><stop offset='0' stop-color='${b.c}' stop-opacity='${b.o}'/><stop offset='1' stop-color='${b.c}' stop-opacity='0'/></radialGradient>`).join('');
  const noiseFilter = `<filter id='abn'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.05 0'/></filter>`;
  const layers = blobs.map((_, i) => `<rect width='256' height='256' fill='url(#ab${i})'/>`).join('');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'><defs>${defs}${noiseFilter}</defs><rect width='256' height='256' fill='${g1}'/>${layers}${shape}<rect width='256' height='256' filter='url(#abn)'/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Parse LRC-style timed lyrics → [{t: seconds, text}] sorted by time, or null if no timestamps.
function parseLRC(text) {
  if (!text || typeof text !== 'string') return null;
  const re = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
  const out = [];
  text.split('\n').forEach((line) => {
    re.lastIndex = 0; const stamps = []; let m, lastEnd = 0;
    while ((m = re.exec(line)) !== null) {
      const frac = m[3] != null ? parseInt(m[3], 10) / Math.pow(10, m[3].length) : 0;
      stamps.push(parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + frac);
      lastEnd = re.lastIndex;
    }
    if (stamps.length) { const txt = line.slice(lastEnd).trim(); stamps.forEach((t) => out.push({ t, text: txt })); }
  });
  if (!out.length) return null;
  out.sort((a, b) => a.t - b.t);
  return out;
}

// Deterministic procedural artwork for a track. Returns a data: URI SVG.
function trackArt(track, album) {
  if (track && typeof track === 'object' && track.cover) return track.cover;
  const seed = (track && typeof track === 'object') ? track.id : track;
  const sid = (Number(seed) || 1) * 9301 + 49297;
  const rand = (n) => {
    let s = (sid + n * 1009) >>> 0;
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const g1 = album?.g1 || '#555';
  const g2 = album?.g2 || '#333';
  const accent = album?.g1 ? album.g2 : '#ffffff';
  const blobs = [
    { x: Math.floor(rand(1)*100), y: Math.floor(rand(2)*100), r: 38+Math.floor(rand(3)*42), c: g1,     o: 0.95 },
    { x: Math.floor(rand(4)*100), y: Math.floor(rand(5)*100), r: 30+Math.floor(rand(6)*40), c: g2,     o: 0.78 },
    { x: Math.floor(rand(7)*100), y: Math.floor(rand(8)*100), r: 22+Math.floor(rand(9)*30), c: accent, o: 0.35 },
    { x: Math.floor(rand(10)*100), y: Math.floor(rand(11)*100), r: 18+Math.floor(rand(12)*28), c: '#ffffff', o: 0.18 },
  ];
  const angle = Math.floor(rand(13) * 360);
  const defs = blobs.map((b, i) => `<radialGradient id='b${i}' cx='${b.x}%' cy='${b.y}%' r='${b.r}%'><stop offset='0' stop-color='${b.c}' stop-opacity='${b.o}'/><stop offset='1' stop-color='${b.c}' stop-opacity='0'/></radialGradient>`).join('');
  const layers = blobs.map((_, i) => `<rect width='64' height='64' fill='url(%23b${i})'/>`).join('').replace(/%23/g, '#');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs>${defs}</defs><rect width='64' height='64' fill='${g1}' transform='rotate(${angle} 32 32)'/>${layers}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function parseDur(s) {
  if (!s) return 0;
  const [m, x] = s.split(':').map(Number);
  return (m || 0) * 60 + (x || 0);
}

// Shared button
function Btn({ href, children, primary, outline, onClick, small }) {
  const [hov, setHov] = useState(false);
  const base = {
    display:'inline-flex', alignItems:'center', gap:7,
    padding: small ? '8px 18px' : '13px 30px',
    borderRadius:50, fontWeight:600,
    fontSize: small ? 13 : 15,
    transition:'all 0.2s', cursor:'pointer',
  };
  const style = primary
    ? { ...base, background:'var(--a1)', color:'var(--bg)', border:'1px solid var(--a1)', boxShadow: hov ? '0 8px 40px var(--glow)' : '0 0 24px var(--glow)', transform: hov ? 'translateY(-2px)' : 'none' }
    : outline
    ? { ...base, background:'transparent', color: hov ? 'var(--a2)' : 'var(--text)', border:`1px solid ${hov ? 'var(--a2)' : 'var(--border)'}`, transform: hov ? 'translateY(-2px)' : 'none' }
    : { ...base, background: hov ? 'var(--card)' : 'transparent', color:'var(--muted)', border:'1px solid var(--border)' };
  if (href) return <a href={href} style={style} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</a>;
  return <button style={style} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{children}</button>;
}

function SectionLabel({ children, color = 'a1', num }) {
  return (
    <div style={{ marginBottom:14 }}>
      {num && (
        <div style={{
          fontFamily:'ui-monospace, SF Mono, Consolas, monospace',
          fontSize:11, fontWeight:600, color:'var(--muted)',
          letterSpacing:'0.18em', textTransform:'uppercase',
          marginBottom:10, opacity:0.65,
        }}>
          {num} — {typeof children === 'string' ? children : ''}
        </div>
      )}
      <h2 style={{
        fontFamily:"'Syne',sans-serif",
        fontSize:'clamp(36px, 5.5vw, 58px)',
        fontWeight:800, letterSpacing:'-0.04em', lineHeight:1,
      }}>
        {children}<span style={{ color:`var(--${color})` }}>.</span>
      </h2>
    </div>
  );
}

function SubLabel({ children }) {
  return (
    <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:18, opacity:0.75 }}>
      {children}
    </p>
  );
}

// Animated number counter (when visible)
function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  const elRef = useRef(null);
  useEffect(() => {
    const el = elRef.current; if (!el) return;
    const startAnim = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
        setVal(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 0) && r.bottom > 0) { startAnim(); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      startAnim();
      obs.disconnect();
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return [elRef, val];
}

// Decorative divider between sections
function SectionDivider() {
  return (
    <div aria-hidden style={{ height:1, margin:'0 auto', maxWidth:1100, background:'linear-gradient(90deg, transparent, var(--border), transparent)' }} />
  );
}

Object.assign(window, {
  THEMES, applyTheme, resolveMode, applyMode, tx,
  PLAYER_STORAGE_KEY, VOL_STORAGE_KEY,
  LIKES_TRACKS_KEY, LIKES_APPS_KEY,
  getLikedItems, isItemLiked, toggleLikedItem, apiToggleLike,
  useInView,
  PlayIco, PauseIco, NextIco, PrevIco, DlIco, CloseIco, VolIco, MuteIco,
  ShuffleIco, RepeatIco, RepeatOneIco, ShareIco, SearchIco,
  SunIco, MoonIco, AutoIco, SocialIco,
  EqBars, seededBars, fmtTime, parseDur, trackArt, albumArt, parseLRC,
  Btn, SectionLabel, SubLabel, SectionDivider, useCountUp,
});

// ==========================================
// FILE: nav-hero.jsx
// ==========================================
// nav-hero.jsx — Top navigation + hero section
// Depends on shared.jsx (window globals).
const { useState: __useState_nh, useEffect: __useEffect_nh, useRef: __useRef_nh } = React;

// BackgroundFX — generativní "souhvězdí" částic přes CELOU stránku (fixní vrstva
// nad mesh-bg, pod obsahem). Samo jemně plyne; když hraje hudba, reaguje na ni
// přes sdílený analyser (window.__jwAnalyser z přehrávače): basy nafouknou/rozzáří
// částice a „nadechnou" celé pole, výšky přidají rychlost a propojení, nárazy
// vyšlou prstenec. Respektuje prefers-reduced-motion, pauzuje mimo obrazovku
// i na skryté kartě, ladí barvy dle motivu webu.
function BackgroundFX() {
  const ref = __useRef_nh(null);
  const [active, setActive] = __useState_nh(false);

  __useEffect_nh(() => {
    // Delay particles initialization to allow the page to mount and settle first
    const handle = setTimeout(() => setActive(true), 250);
    return () => clearTimeout(handle);
  }, []);

  __useEffect_nh(() => {
    if (!active) return;
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, particles = [], raf = null, running = false, t = 0, frame = 0;
    const col = { a1:[249,115,22], a2:[251,191,36], dark:true };
    // reaktivní stav: obálky (rychlý náběh / pomalé doznívání), spektrum, beat, prstence
    const env = { bass:0, level:0, surge:0, flash:0, treble:0 };
    let binEnv = new Float32Array(128), bassHist = [], beatCool = 0, rings = [];

    function parseColor(str, fb) {
      str = (str || '').trim();
      let m = str.match(/^#([0-9a-fA-F]{6})$/);
      if (m) { const n = parseInt(m[1],16); return [(n>>16)&255,(n>>8)&255,n&255]; }
      m = str.match(/rgba?\(([^)]+)\)/);
      if (m) { const p = m[1].split(',').map(s=>parseFloat(s)); return [p[0]||0,p[1]||0,p[2]||0]; }
      return fb;
    }
    function sampleTheme() {
      try {
        const cs = getComputedStyle(document.documentElement);
        col.a1 = parseColor(cs.getPropertyValue('--a1'), [249,115,22]);
        col.a2 = parseColor(cs.getPropertyValue('--a2'), [251,191,36]);
        const bg = parseColor(cs.getPropertyValue('--bg'), [0,0,0]);
        col.dark = (0.2126*bg[0] + 0.7152*bg[1] + 0.0722*bg[2]) / 255 < 0.5;
      } catch (e) {}
    }
    function mk() {
      return { x:Math.random()*W, y:Math.random()*H, r:0.6+Math.random()*1.5,
        vx:(Math.random()-0.5)*0.16, vy:-(0.05+Math.random()*0.2),
        ph:Math.random()*Math.PI*2, warm:Math.random(),
        bin: 2 + Math.floor(Math.random()*86),   // „svoje" frekvenční pásmo
        react: 0.7 + Math.random()*0.7,           // jak silně reaguje
        depth: Math.random(),                     // hloubka 0=daleko … 1=blízko (paralaxa)
        _x:0, _y:0 };
    }
    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W*dpr));
      canvas.height = Math.max(1, Math.floor(H*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
      // hustota dle plochy viewportu (canvas je fixní = velikost okna)
      const target = Math.round(Math.min(120, Math.max(45, (W*H)/16000)));
      if (particles.length !== target) {
        if (target < particles.length) particles.length = target;
        else while (particles.length < target) particles.push(mk());
      }
    }
    function audioLevels() {
      const an = window.__jwAnalyser; if (!an) return null;
      try {
        const n = an.frequencyBinCount;
        const bins = new Uint8Array(n);
        an.getByteFrequencyData(bins);
        const avg = (a,b) => { a=Math.min(a,n); b=Math.min(b,n); let s=0; for (let i=a;i<b;i++) s+=bins[i]; return s/Math.max(1,(b-a)*255); };
        const bass = avg(1,7), lowmid = avg(7,18), mid = avg(18,42), treble = avg(42,96);
        if (bass+lowmid+mid+treble < 0.02) return null; // ticho / pauza → generativní režim
        const level = bass*0.5 + lowmid*0.25 + mid*0.15 + treble*0.10;
        return { bass, lowmid, mid, treble, level, bins };
      } catch (e) { return null; }
    }
    function draw() {
      t += 0.016; frame++;
      if (frame % 45 === 0) sampleTheme();
      ctx.clearRect(0,0,W,H);
      const a = audioLevels();
      const playing = !!a;
      const treble = a ? a.treble : 0;

      // --- obálky: rychlý náběh, pomalé doznívání = úderná reakce na beat ---
      if (playing) {
        const bins = a.bins;
        for (let i=0;i<binEnv.length;i++) {
          const v = i < bins.length ? bins[i]/255 : 0;
          binEnv[i] = v > binEnv[i] ? v : binEnv[i]*0.92;
        }
        env.bass  = a.bass  > env.bass  ? a.bass  : env.bass*0.90;
        env.level = a.level > env.level ? a.level : env.level*0.92;
        // detekce beatu: aktuální basy výrazně nad krátkodobým průměrem
        bassHist.push(a.bass); if (bassHist.length > 43) bassHist.shift();
        let m=0; for (const b of bassHist) m+=b; m/=bassHist.length;
        beatCool--;
        if (a.bass > 0.11 && a.bass > m*1.38 && beatCool <= 0) {
          env.flash = 1; env.surge = 1; beatCool = 7;
          rings.push({ r: Math.min(W,H)*0.05, a: 0.9, w: 1 + a.bass*2 });
        }
      } else {
        for (let i=0;i<binEnv.length;i++) binEnv[i] *= 0.90;
        env.bass *= 0.90; env.level *= 0.90;
      }
      env.flash *= 0.90; env.surge *= 0.90;
      env.treble += (treble - env.treble) * 0.15;  // dolnopropust na výšky → klidnější, ne tak roztřesené

      const idle = playing ? 0 : 0.10*(0.5 + 0.5*Math.sin(t*0.6)); // jemné dýchání v klidu
      const drive = Math.max(env.bass, idle);
      const lvl   = Math.max(env.level, idle);
      const cx = W/2, cy = H*0.5;
      const scroll = window.scrollY || window.pageYOffset || 0; // paralaxa: posun pozadí dle scrollu
      const bloom = drive*0.13;                       // basy „nadechnou" celé pole
      const speedM = 1 + env.surge*1.8 + env.treble*0.5;  // beat mírně zrychlí pohyb
      const linkDist = (playing ? 116 : 96) + lvl*64;

      ctx.globalCompositeOperation = col.dark ? 'lighter' : 'source-over';

      // expandující prstence vyslané na beat
      for (let i=rings.length-1;i>=0;i--) {
        const rg = rings[i];
        rg.r += 7 + env.level*10; rg.a *= 0.93;
        if (rg.a < 0.03) { rings.splice(i,1); continue; }
        ctx.strokeStyle = `rgba(${col.a1[0]},${col.a1[1]},${col.a1[2]},${rg.a*0.22})`;
        ctx.lineWidth = rg.w;
        ctx.beginPath(); ctx.arc(cx, cy, rg.r, 0, Math.PI*2); ctx.stroke();
      }

      // částice — každá svítí/roste podle „své" frekvence
      for (const p of particles) {
        p.x += p.vx*speedM; p.y += p.vy*speedM; p.ph += 0.018 + env.treble*0.05;
        if (p.y < -12) { p.y = H+12; p.x = Math.random()*W; }
        if (p.x < -12) p.x = W+12; else if (p.x > W+12) p.x = -12;
        const be = binEnv[p.bin] * p.react;          // 0..~1 dle spektra
        const pf = 0.02 + p.depth*0.10;              // hloubka → rychlost paralaxy
        const py = ((p.y - scroll*pf) % H + H) % H;  // posun dle scrollu, zabalený do výšky
        const dx = p.x + (p.x-cx)*bloom, dy = py + (py-cy)*bloom;
        p._x = dx; p._y = dy;
        const sizeD = 0.6 + p.depth*0.55, alphaD = 0.62 + p.depth*0.38; // blízké větší/jasnější
        const rr = Math.max(0.3, p.r*sizeD*(1 + drive*0.6 + be*2.1 + env.flash*0.6) + Math.sin(p.ph)*0.3);
        const c = p.warm < 0.5 ? col.a1 : col.a2;
        const al = Math.min(0.9, ((col.dark ? 0.13 : 0.18) + be*0.6 + env.flash*0.22) * alphaD);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${al})`;
        ctx.arc(dx, dy, rr, 0, Math.PI*2); ctx.fill();
      }

      // propojení — jas roste s hlasitostí a problikne na beat
      for (let i=0;i<particles.length;i++) {
        for (let j=i+1;j<particles.length;j++) {
          const A = particles[i], B = particles[j];
          const dx = A._x-B._x, dy = A._y-B._y, d = Math.hypot(dx,dy);
          if (d < linkDist) {
            const o = (1 - d/linkDist) * (col.dark ? 0.10 : 0.14) * (0.45 + lvl*1.4 + env.flash*0.5);
            ctx.strokeStyle = `rgba(${col.a1[0]},${col.a1[1]},${col.a1[2]},${Math.min(0.5,o)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(A._x,A._y); ctx.lineTo(B._x,B._y); ctx.stroke();
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over';
      if (running) raf = requestAnimationFrame(draw);
    }
    function start() { if (!running) { running = true; raf = requestAnimationFrame(draw); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    sampleTheme(); resize();
    const ro = ('ResizeObserver' in window) ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas); else window.addEventListener('resize', resize);

    let io = null, onVis = null;
    if (reduce) { draw(); } // jediný statický snímek
    else {
      io = ('IntersectionObserver' in window) ? new IntersectionObserver(es => {
        if (es[0].isIntersecting) start(); else stop();
      }, { threshold:0.01 }) : null;
      if (io) io.observe(canvas); else start();
      onVis = () => { if (document.hidden) stop(); else start(); };
      document.addEventListener('visibilitychange', onVis);
      start();
    }
    return () => {
      stop();
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      if (io) io.disconnect();
      if (onVis) document.removeEventListener('visibilitychange', onVis);
    };
  }, [active]);
  return <canvas ref={ref} aria-hidden="true" style={{
    position:'fixed', inset:0, width:'100%', height:'100%', zIndex:-1, pointerEvents:'none',
  }} />;
}

function Nav({ lang, setLang, mode, setMode }) {
  const [scrolled, setScrolled] = __useState_nh(false);
  const [active, setActive]     = __useState_nh('hero');
  __useEffect_nh(() => {
    const ids = ['apps', 'music', 'contact'];
    const fn = () => {
      setScrolled(window.scrollY > 50);
      const y = window.scrollY + window.innerHeight * 0.35;
      let cur = 'hero';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    // Defer the initial check to avoid forced reflow during React mount
    const handle = setTimeout(fn, 150);
    window.addEventListener('scroll', fn, { passive: true });
    return () => {
      clearTimeout(handle);
      window.removeEventListener('scroll', fn);
    };
  }, []);

  const s = {
    nav: {
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      height:64, padding:'0 32px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background: scrolled ? 'color-mix(in srgb, var(--bg) 88%, transparent)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition:'all 0.3s ease',
    },
    logo: {
      fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20,
      letterSpacing:'-0.04em',
      background:'linear-gradient(135deg, var(--a1), var(--a2))',
      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
    },
    link: { fontSize:15, fontWeight:500, color:'var(--muted)', transition:'color 0.2s', padding:'4px 0' },
    langBtn: (active) => ({
      padding:'4px 11px', borderRadius:6, fontSize:13, fontWeight:700, letterSpacing:'0.04em',
      background: active ? 'var(--a1)' : 'transparent',
      color: active ? 'var(--bg)' : 'var(--muted)',
      border:`1px solid ${active ? 'var(--a1)' : 'var(--border)'}`,
      transition:'all 0.2s',
    }),
  };

  const links = [
    { href:'#music',   lbl: tx(lang, 'nav_music') },
    { href:'#apps',    lbl: tx(lang, 'nav_apps') },
    { href:'#contact', lbl: tx(lang, 'nav_contact') },
  ];

  return (
    <nav style={s.nav}>
      <a href="#hero" style={s.logo}>jenda.cool</a>
      <div className="nav-desktop" style={{ display:'flex', gap:36, alignItems:'center' }}>
        {links.map(l => {
          const on = active === l.href.slice(1);
          return (
            <a key={l.href} href={l.href} className="nav-link"
               style={{ ...s.link, color: on ? 'var(--a1)' : 'var(--muted)' }}
               onMouseEnter={e => e.currentTarget.style.color='var(--text)'}
               onMouseLeave={e => e.currentTarget.style.color = on ? 'var(--a1)' : 'var(--muted)'}>
              {l.lbl}
            </a>
          );
        })}
      </div>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        <button
          onClick={() => setMode(mode === 'auto' ? 'light' : mode === 'light' ? 'dark' : 'auto')}
          title={tx(lang,'mode_'+mode)}
          aria-label={`Mode: ${tx(lang,'mode_'+mode)}`}
          style={{
            width:32, height:32, borderRadius:6,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--muted)', border:'1px solid var(--border)',
            transition:'all 0.2s', marginRight:4,
          }}
          onMouseEnter={e => { e.currentTarget.style.color='var(--a1)'; e.currentTarget.style.borderColor='var(--a1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.borderColor='var(--border)'; }}
        >
          {mode === 'light' ? <SunIco /> : mode === 'dark' ? <MoonIco /> : <AutoIco />}
        </button>
        <button style={s.langBtn(lang === 'cs')} onClick={() => setLang('cs')}>CZ</button>
        <button style={s.langBtn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
      </div>
    </nav>
  );
}

function Hero({ lang, onPlay }) {
  const playFeatured = () => {
    const tracks = window.TRACKS_DATA || [];
    const featured = tracks.find(t => t.audioUrl) || tracks[0];
    if (featured && onPlay) onPlay(featured, tracks);
    const el = document.getElementById('music');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
  };
  return (
    <section id="hero" style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', padding:'90px 24px 80px',
      position:'relative', overflow:'hidden',
    }}>
      <div style={{ position:'relative', zIndex:1, maxWidth:820 }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          fontSize:12, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
          color:'var(--a1)', padding:'7px 18px', borderRadius:30,
          border:'1px solid color-mix(in srgb, var(--a1) 40%, transparent)',
          background:'color-mix(in srgb, var(--a1) 8%, transparent)',
          marginBottom:36,
        }}>
          {tx(lang, 'hero_tag')}
        </div>

        <h1 style={{
          fontFamily:"'Syne', sans-serif",
          fontSize:'clamp(80px, 16vw, 160px)',
          fontWeight:800, lineHeight:0.88,
          letterSpacing:'-0.05em',
          background:'linear-gradient(135deg, var(--text) 20%, var(--a1) 55%, var(--a2) 85%)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
          backgroundSize:'200% 200%',
          animation:'gradShift 9s ease-in-out infinite',
          marginBottom:32,
        }}>
          Jenda
        </h1>

        <p style={{
          fontSize:'clamp(16px, 2.2vw, 20px)', color:'var(--muted)',
          maxWidth:500, margin:'0 auto 52px', lineHeight:1.65, fontWeight:300,
        }}>
          {tx(lang, 'hero_desc')}
        </p>

        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Btn primary onClick={playFeatured}>{tx(lang, 'cta_music')}</Btn>
          <Btn href="#apps" outline>{tx(lang, 'cta_apps')}</Btn>
        </div>

        <div style={{ display:'flex', gap:56, justifyContent:'center', marginTop:80, flexWrap:'wrap' }}>
          {[
            { num:(window.APPS_DATA||[]).length,   suffix:'', lbl: tx(lang,'stat_apps'),   href:'#apps' },
            { num:(window.TRACKS_DATA||[]).length, suffix:'', lbl: tx(lang,'stat_tracks'), href:'#music' },
            { num:(window.ALBUMS||[]).length,      suffix:'', lbl: tx(lang,'stat_albums'), href:'#music' },
          ].map(({ num, suffix, lbl, href }) => {
            const [r, v] = useCountUp(num);
            return (
              <a key={lbl} ref={r} href={href} style={{ textAlign:'center', display:'block', transition:'transform 0.2s', cursor:'pointer' }}
                 onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                 onMouseLeave={e => e.currentTarget.style.transform='none'}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:38, fontWeight:800, color:'var(--a1)', lineHeight:1, fontVariantNumeric:'tabular-nums' }}>
                  {Math.round(v)}{suffix}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.12em', marginTop:6 }}>{lbl}</div>
              </a>
            );
          })}
        </div>
      </div>

      <a href="#music" className="scroll-cue" aria-label="Scroll" style={{
        position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)',
        zIndex:1, color:'var(--muted)', display:'flex',
        animation:'scrollBob 2.2s ease-in-out infinite',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10l5 5 5-5"/></svg>
      </a>
    </section>
  );
}

Object.assign(window, { Nav, Hero, BackgroundFX });

// ==========================================
// FILE: apps-music.jsx
// ==========================================
// apps-music.jsx — Apps + Music sections
const { useState: __useS, useEffect: __useE, useMemo: __useM, useCallback: __useC, useRef: __useR } = React;function AppCard({ app, lang, mode = 'live' }) {
  const [hov, setHov] = __useS(false);
  const isPWA = app.platform === 'PWA';
  const caseStudyUrl = window.CASE_STUDIES?.[app.id] || app.case_study_url;
  
  return (
    <a href={'#app=' + slugify(app.name)} style={{
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
          {lang === 'cs' ? app.cs : app.en}
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

  const { liveApps, studyApps } = __useM(() => {
    const live = [];
    const study = [];
    filtered.forEach(a => {
      const isLive = a.link && a.link !== '#';
      const isStudy = !!(window.CASE_STUDIES?.[a.id] || a.case_study_url);
      if (isLive) live.push(a);
      if (isStudy) study.push(a);
    });
    return { liveApps: live, studyApps: study };
  }, [filtered]);

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
          <div style={{ display:'flex', flexDirection:'column', gap:44 }}>
            {liveApps.length > 0 && (
              <div>
                <h3 style={{
                  fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18,
                  marginBottom:18, color:'var(--text)', display:'flex', alignItems:'center', gap:8
                }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--a1)' }}></span>
                  {tx(lang, 'apps_live_title')}
                  <span style={{ fontSize:12, fontWeight:500, color:'var(--muted)', opacity:0.75 }}>({liveApps.length})</span>
                </h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:18 }}>
                  {liveApps.map((app, i) => (
                    <div key={'live-' + app.id} className="card-animate" style={{ animationDelay:`${Math.min(i,8)*35}ms` }}>
                      <AppCard app={app} lang={lang} mode="live" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {studyApps.length > 0 && (
              <div>
                <h3 style={{
                  fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18,
                  marginBottom:18, color:'var(--text)', display:'flex', alignItems:'center', gap:8,
                  marginTop: liveApps.length > 0 ? 10 : 0
                }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--a2)' }}></span>
                  {tx(lang, 'apps_studies_title')}
                  <span style={{ fontSize:12, fontWeight:500, color:'var(--muted)', opacity:0.75 }}>({studyApps.length})</span>
                </h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:18 }}>
                  {studyApps.map((app, i) => (
                    <div key={'study-' + app.id} className="card-animate" style={{ animationDelay:`${Math.min(i,8)*35}ms` }}>
                      <AppCard app={app} lang={lang} mode="study" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function AppDetailModal({ app, lang, onClose, onShare }) {
  const isPWA = app.platform === 'PWA';
  const caseStudyUrl = window.CASE_STUDIES?.[app.id] || app.case_study_url;
  const isDownload = app.link && (app.link.includes('/storage/v1/object/public/binaries/') || app.link.startsWith('[') || /\.(apk|zip|dmg|exe|tar\.gz|ipa|pkg)(?:\?.*)?$/i.test(app.link));
  
  const [liked, setLiked] = __useS(() => window.isItemLiked(window.LIKES_APPS_KEY, app.id));
  const [likeCount, setLikeCount] = __useS(app.likes || 0);
  const [downloading, setDownloading] = __useS(false);

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
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
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
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20,
        width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
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
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0, color: 'var(--text)' }}>{app.name}</h2>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: isPWA ? 'color-mix(in srgb, var(--a1) 14%, transparent)' : 'rgba(34,197,94,0.15)',
                  color: isPWA ? 'var(--a1)' : '#4ade80',
                  border: `1px solid ${isPWA ? 'color-mix(in srgb, var(--a1) 35%, transparent)' : 'rgba(34,197,94,0.3)'}`,
                }}>{app.platform}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {isPWA ? (lang === 'cs' ? 'Webová PWA aplikace' : 'Web PWA App') : (lang === 'cs' ? 'Nativní Android aplikace' : 'Native Android App')}
              </div>
            </div>
          </div>
          <button onClick={onClose} aria-label={lang === 'cs' ? 'Zavřít' : 'Close'} style={{
            background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20,
            cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s', outline: 'none'
          }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}>✕</button>
        </div>

        {app.screenshots && app.screenshots.length > 0 && (
          <div style={{ position: 'relative', width: '100%' }}>
            <div className="ss-carousel" style={{
              display: 'flex', gap: 12, overflowX: 'auto',
              scrollSnapType: 'x mandatory', webkitOverflowScrolling: 'touch',
              borderRadius: 14, padding: '4px 0',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent'
            }}>
              {app.screenshots.map((src, idx) => (
                <div key={idx} style={{
                  scrollSnapAlign: 'center', flex: '0 0 100%',
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  background: '#070504', borderRadius: 10, overflow: 'hidden',
                  border: '1px solid var(--border)', height: 260
                }}>
                  <img src={src} alt={`${app.name} screen ${idx + 1}`} style={{
                    width: '100%', height: '100%', objectFit: 'contain'
                  }} />
                </div>
              ))}
            </div>
            {app.screenshots.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
                {app.screenshots.map((_, idx) => (
                  <span key={idx} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: app.color, opacity: 0.4
                  }} />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 14, color: 'var(--text)', lineHeight: 1.6, margin: 0,
            textWrap: 'pretty', whiteSpace: 'pre-line'
          }}>
            {lang === 'cs' ? app.cs : app.en}
          </p>
        </div>

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
          }} title={lang === 'cs' ? 'Líbí se mi' : 'Like'}
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
          }} title={lang === 'cs' ? 'Sdílet aplikaci' : 'Share app'}
             onMouseEnter={(e) => { e.target.style.color = 'var(--text)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
             onMouseLeave={(e) => { e.target.style.color = 'var(--muted)'; e.target.style.background = 'transparent'; }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
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
          {tx(lang,'music_sub')}
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

// ==========================================
// FILE: player-contact.jsx
// ==========================================
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

  const [liked, setLiked] = __useS_pc(() => track ? window.isItemLiked(window.LIKES_TRACKS_KEY, track.id) : false);
  const [likeCount, setLikeCount] = __useS_pc(() => track ? (track.likes || 0) : 0);

  __useE_pc(() => {
    if (!track) return;
    setLiked(window.isItemLiked(window.LIKES_TRACKS_KEY, track.id));
    setLikeCount(track.likes || 0);
  }, [track?.id]);

  __useE_pc(() => {
    const handleSync = (e) => {
      if (track && e.detail && e.detail.trackId === track.id) {
        setLiked(e.detail.liked);
        setLikeCount(e.detail.likes);
      }
    };
    window.addEventListener('jw-track-like-toggled', handleSync);
    return () => window.removeEventListener('jw-track-like-toggled', handleSync);
  }, [track?.id]);

  const handleLike = (e) => {
    if (!track) return;
    e.stopPropagation();
    const nextLiked = window.toggleLikedItem(window.LIKES_TRACKS_KEY, track.id);
    setLiked(nextLiked);
    setLikeCount(prev => Math.max(0, prev + (nextLiked ? 1 : -1)));
    window.apiToggleLike('track', track.id, nextLiked);
    const globalTrack = (window.TRACKS_DATA || []).find(t => t.id === track.id);
    if (globalTrack) {
      globalTrack.likes = Math.max(0, (globalTrack.likes || 0) + (nextLiked ? 1 : -1));
    }
    try { window.dispatchEvent(new CustomEvent('jw-track-like-toggled', { detail: { trackId: track.id, liked: nextLiked, likes: globalTrack?.likes || 0 } })); } catch (err) {}
  };

  const bars = __useM_pc(() => seededBars(track?.id || 1), [track?.id]);
  const progress = duration > 0 ? currentTime / duration : 0;

  __useE_pc(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.volume = vol;
    return () => {
      try { if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; } } catch (e) {}
      try { if (sourceRef.current) sourceRef.current.disconnect(); } catch (e) {}
      try { if (analyserRef.current) analyserRef.current.disconnect(); } catch (e) {}
      try { if (audioCtxRef.current) audioCtxRef.current.close(); } catch (e) {}
      if (window.__jwAnalyser === analyserRef.current) window.__jwAnalyser = null;
      audioCtxRef.current = null; analyserRef.current = null; sourceRef.current = null;
    };
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
  const seekTo = (sec) => {
    if (!isFinite(sec)) return;
    const s = Math.max(0, sec);
    const a = audioRef.current;
    if (a) { try { a.currentTime = s; } catch (e) {} }
    setCurrentTime(s);
  };

  const isDraggingRef = __useR_pc(false);

  const handlePointerDown = (e) => {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    isDraggingRef.current = true;
    seekFromEvent(e);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    seekFromEvent(e);
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
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
      <div style={{ display:'flex', alignItems:'center', gap:14, minWidth:0 }}>
        <div className="player-info" onClick={() => setExpanded(true)} style={{ display:'flex', alignItems:'center', gap:12, minWidth:0, cursor:'pointer' }} role="button" tabIndex={0} aria-label={`${track ? `${track.title} - ${album?.title || ''}. ` : ''}Expand player (E)`} title="Expand (E)"
          onKeyDown={(e) => { if (e.key === 'Enter') setExpanded(true); }}>
          <div className={restoring ? 'shimmer-fx' : ''} style={{ position:'relative', width:42, height:42, borderRadius:8, flexShrink:0, overflow:'hidden', backgroundImage: track ? `url("${trackArt(track, album)}")` : '', backgroundSize:'cover', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {isPlaying && <EqBars color="#fff" />}
          </div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{track?.title}</div>
            <div style={{ fontSize:12, color:'var(--muted)' }}>{album?.title || ''}</div>
          </div>
        </div>
        {track && (
          <button onClick={handleLike} style={{
            background: 'none', border: 'none',
            color: liked ? 'var(--a1)' : 'var(--muted)',
            opacity: liked ? 1 : 0.6,
            display: 'flex', alignItems: 'center', gap: 4,
            cursor: 'pointer', padding: '6px 8px', borderRadius: 8,
            fontSize: 13, transition: 'all 0.15s', outline: 'none', flexShrink: 0
          }} title={lang === 'cs' ? 'Líbí se mi' : 'Like'}
             onMouseEnter={(e) => { if (!liked) e.currentTarget.style.color = 'var(--text)'; }}
             onMouseLeave={(e) => { if (!liked) e.currentTarget.style.color = 'var(--muted)'; }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.15s', transform: liked ? 'scale(1.2)' : 'none' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {likeCount > 0 && <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{likeCount}</span>}
          </button>
        )}
      </div>

      <div className="player-controls" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button className="player-mute-mobile" onClick={() => setMuted(m => !m)} aria-label="Mute" style={{ color: muted ? 'var(--a1)' : 'var(--muted)', padding:6 }}>
            <VolIco />
          </button>
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
          <button className="player-mute-mobile" onClick={onClose} aria-label="Close" style={{ color:'var(--muted)', padding:6 }}>
            <CloseIco />
          </button>
        </div>
        <div className="player-wave" style={{ display:'flex', alignItems:'center', gap:10, width:380 }}>
          <span style={{ fontSize:11, color:'var(--muted)', minWidth:34, textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{fmtTime(currentTime)}</span>
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={e => {
              if (isDraggingRef.current) {
                seekFromEvent(e);
              } else {
                const r=e.currentTarget.getBoundingClientRect();
                setHovBar(Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)));
              }
            }}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={() => { if (!isDraggingRef.current) setHovBar(null); }}
            role="slider" aria-label="Seek"
            aria-valuemin={0} aria-valuemax={duration || 0} aria-valuenow={currentTime}
            style={{ flex:1, height:28, display:'flex', alignItems:'center', justifyContent:'space-between', gap:1, cursor:'pointer', position:'relative', touchAction:'none' }}
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
        <input id="player-volume" name="volume" type="range" min="0" max="1" step="0.01" value={muted ? 0 : vol} onChange={e => { setVol(+e.target.value); setMuted(false); }} style={{ width:80 }} aria-label="Volume" />
        <button onClick={onClose} aria-label="Close player" title="Close" style={{ color:'var(--muted)', display:'flex', padding:6, marginLeft:8, transition:'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='var(--text)'} onMouseLeave={e=>e.currentTarget.style.color='var(--muted)'}><CloseIco /></button>
      </div>
    </div>

    {expanded && (
      <ExpandMode
        track={track} album={album}
        liked={liked} likeCount={likeCount} onLike={handleLike}
        currentTime={currentTime} duration={duration} progress={progress}
        bars={bars} fft={fft}
        seekFromEvent={seekFromEvent} onSeekTo={seekTo}
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
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
        isDraggingRef={isDraggingRef}
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
            <input id="cf-name" name="name" type="text" autoComplete="name" placeholder=" " value={name}
              onChange={e=>setName(e.target.value)} onBlur={() => setTouched(t => ({ ...t, name:true }))}
              aria-invalid={!!(touched.name && errors.name)} />
            <label htmlFor="cf-name">{tx(lang,'contact_name')}</label>
          </div>
          <div className="field-err">{touched.name && errors.name}</div>
        </div>
        <div>
          <div className={`field${touched.email && errors.email ? ' err' : ''}`}>
            <input id="cf-email" name="email" type="email" autoComplete="email" placeholder=" " value={email}
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

// ==========================================
// FILE: player-expand.jsx
// ==========================================
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
  liked, likeCount, onLike,
  currentTime, duration, progress, bars, fft, seekFromEvent, onSeekTo, hovBar, setHovBar,
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

  const lyricsBoxRef = __useR_xp(null);
  const activeLineRef = __useR_xp(null);
  const lyricsText = (track && track.lyrics) ? (lang === 'cs' ? track.lyrics.cs : track.lyrics.en) : '';
  const synced = parseLRC(lyricsText);
  let activeIdx = -1;
  if (synced) { for (let i = 0; i < synced.length; i++) { if (synced[i].t <= currentTime + 0.15) activeIdx = i; else break; } }
  __useE_xp(() => {
    if (synced && showLyrics && lyricsBoxRef.current && activeLineRef.current) {
      const box = lyricsBoxRef.current, el = activeLineRef.current;
      box.scrollTo({ top: Math.max(0, el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2), behavior: 'smooth' });
    }
  }, [activeIdx, showLyrics]);

  if (!track) return null;
  const art = trackArt(track, album);
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
          <div style={{ fontSize:'clamp(14px, 2vw, 17px)', color:'rgba(255,255,255,0.72)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span>{album?.title}{album?.year && ` · ${album.year}`}</span>
            <button onClick={onLike} style={{
              background: 'none', border: 'none',
              color: liked ? 'var(--a1)' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', gap: 4,
              cursor: 'pointer', padding: '4px 8px', borderRadius: 8,
              fontSize: 13, transition: 'all 0.15s', outline: 'none'
            }} title={lang === 'cs' ? 'Líbí se mi' : 'Like'}
               onMouseEnter={(e) => { if (!liked) e.currentTarget.style.color = '#fff'; }}
               onMouseLeave={(e) => { if (!liked) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.15s', transform: liked ? 'scale(1.2)' : 'none' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {likeCount > 0 && <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{likeCount}</span>}
            </button>
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
          <div ref={lyricsBoxRef} style={{
            flex:1, overflowY:'auto', padding:'24px 32px',
            fontSize:16, lineHeight:1.85, color:'rgba(255,255,255,0.88)',
            fontFamily:"'Syne',sans-serif", fontWeight:500,
            textAlign:'center', textWrap:'pretty',
          }}>
            {synced ? synced.map((l, i) => (
              <div key={i} ref={i === activeIdx ? activeLineRef : null}
                onClick={() => onSeekTo && onSeekTo(l.t)}
                title={lang === 'cs' ? 'Skočit sem' : 'Jump here'}
                style={{
                  padding:'7px 4px', cursor:'pointer',
                  transition:'color 0.25s ease, font-size 0.25s ease, text-shadow 0.25s ease',
                  fontSize: i === activeIdx ? 20 : 16,
                  fontWeight: i === activeIdx ? 800 : 500,
                  color: i === activeIdx ? '#fff' : (i < activeIdx ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)'),
                  textShadow: i === activeIdx ? '0 0 26px rgba(249,115,22,0.5)' : 'none',
                }}>
                {l.text || '♪'}
              </div>
            )) : <div style={{ whiteSpace:'pre-line' }}>{lang === 'cs' ? track.lyrics.cs : track.lyrics.en}</div>}
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

// ==========================================
// FILE: queue.jsx
// ==========================================
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
        <div style={{ width:32, height:32, borderRadius:6, flexShrink:0, backgroundImage:`url("${trackArt(t, al)}")`, backgroundSize:'cover' }} />
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

// ==========================================
// FILE: extras.jsx
// ==========================================
// extras.jsx — Newsletter, public stats, comparison playground, donation widget
const { useState: __useS_ex, useEffect: __useE_ex, useMemo: __useM_ex } = React;

// ── Newsletter ──────────────────────────────────────────────────────────
function NewsletterSection({ lang }) {
  const [ref, vis] = useInView();
  const [email, setEmail] = __useS_ex('');
  const [status, setStatus] = __useS_ex('idle'); // idle | sending | ok | err
  const endpoint = window.NEWSLETTER_ENDPOINT;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) { setStatus('err'); return; }
    if (!endpoint) { setStatus('ok'); return; } // friendly fallback
    setStatus('sending');
    try {
      const form = new FormData();
      form.append('email', email);
      await fetch(endpoint, { method:'POST', body: form, mode:'no-cors' });
      setStatus('ok'); setEmail('');
    } catch { setStatus('err'); }
  };

  return (
    <section style={{ padding:'80px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{
        maxWidth:680, margin:'0 auto',
        padding:'44px 36px',
        border:'1px solid var(--border)',
        borderRadius:'var(--r)',
        background:'color-mix(in srgb, var(--a1) 4%, var(--card))',
        textAlign:'center',
        position:'relative', overflow:'hidden',
      }}>
        <div aria-hidden style={{
          position:'absolute', top:'-30%', right:'-10%', width:280, height:280,
          borderRadius:'50%',
          background:'radial-gradient(circle, var(--a1), transparent 70%)',
          opacity:0.12, filter:'blur(50px)', pointerEvents:'none',
        }} />

        <div style={{
          display:'inline-flex', alignItems:'center', gap:7,
          fontSize:11, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase',
          color:'var(--a1)', marginBottom:16, position:'relative',
        }}>
          ⌁ {tx(lang,'newsletter_title')}
        </div>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:22, position:'relative' }}>
          {tx(lang,'newsletter_desc')}
        </p>

        {status === 'ok' ? (
          <p style={{ color:'var(--a1)', fontWeight:600, fontSize:15, position:'relative' }}>
            ✓ {tx(lang,'newsletter_ok')}
          </p>
        ) : (
          <form onSubmit={onSubmit} style={{
            display:'flex', gap:8, maxWidth:420, margin:'0 auto',
            flexWrap:'wrap', position:'relative',
          }}>
            <input
              id="nl-email"
              name="email"
              type="email" required
              autoComplete="email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (status === 'err') setStatus('idle'); }}
              placeholder={tx(lang,'newsletter_email')}
              aria-label={tx(lang,'newsletter_email')}
              style={{
                flex:'1 1 220px', minWidth:0, padding:'12px 16px',
                background:'var(--card)',
                border:`1px solid ${status==='err' ? '#f87171' : 'var(--border)'}`,
                borderRadius:50,
                color:'var(--text)', fontFamily:'inherit', fontSize:14,
                outline:'none', transition:'border-color 0.2s',
              }}
            />
            <button type="submit" disabled={status === 'sending'} style={{
              padding:'12px 26px', borderRadius:50,
              background:'var(--a1)', color: status === 'sending' ? 'var(--muted)' : 'var(--bg)',
              fontWeight:600, fontSize:14, fontFamily:'inherit',
              border:'1px solid var(--a1)', cursor: status === 'sending' ? 'wait' : 'pointer',
              boxShadow:'0 0 20px var(--glow)',
              transition:'transform 0.15s',
            }}>
              {tx(lang,'newsletter_sub')}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ── Public stats / build log ────────────────────────────────────────────
function StatsSection({ lang }) {
  const [ref, vis] = useInView();
  const s = window.PUBLIC_STATS || {};
  const log = window.BUILD_LOG || [];

  const albumsCount = (window.ALBUMS || []).length;
  const appsCount = (window.APPS_DATA || []).filter(x => x.link && x.link !== '#').length;
  const tracksCount = (window.TRACKS_DATA || []).length;
  const studiesCount = Object.keys(window.CASE_STUDIES || {}).length;

  return (
    <section style={{ padding:'90px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1100, margin:'0 auto' }}>
        <SubLabel>{tx(lang,'stats_title')}</SubLabel>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:14, marginBottom:42 }}>
          {[
            { num: albumsCount,  lbl: tx(lang,'stats_albums') },
            { num: appsCount,    lbl: tx(lang,'stats_apps') },
            { num: tracksCount,  lbl: tx(lang,'stats_tracks') },
            { num: studiesCount, lbl: tx(lang,'stats_studies') },
          ].map((m, i) => {
            const [r, v] = useCountUp(m.num || 0);
            return (
              <div key={i} ref={r} style={{
                padding:'24px 22px',
                background:'var(--card)',
                border:'1px solid var(--border)',
                borderRadius:'var(--r)',
                boxShadow:'var(--shadow-1)',
              }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:38, fontWeight:800, color:'var(--a1)', lineHeight:1, marginBottom:8, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>
                  {Math.round(v)}
                </div>
                <div style={{ fontSize:12, color:'var(--muted)', letterSpacing:'0.04em' }}>{m.lbl}</div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)', marginBottom:14, opacity:0.7 }}>
          {tx(lang,'stats_recent')}
        </p>
        <div style={{
          background:'var(--card)',
          border:'1px solid var(--border)',
          borderRadius:'var(--r)',
          padding:'4px 0',
        }}>
          {log.map((e, i) => (
            <div key={i} style={{
              display:'flex', alignItems:'baseline', gap:18,
              padding:'12px 22px',
              borderBottom: i < log.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                fontFamily:'ui-monospace, SF Mono, Consolas, monospace',
                fontSize:12, color:'var(--a1)',
                minWidth:70, fontVariantNumeric:'tabular-nums',
              }}>{e.date}</span>
              <span style={{ fontSize:14, color:'var(--text)', flex:1, lineHeight:1.5 }}>
                {lang === 'cs' ? e.cs : e.en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Comparison playground ───────────────────────────────────────────────
function ComparisonSection({ lang }) {
  const [ref, vis] = useInView();
  const cfg = window.COMPARISON || { apps:[], rows:[], data:{} };
  const apps = __useM_ex(() => {
    const all = window.APPS_DATA || [];
    return cfg.apps.map(id => all.find(a => a.id === id)).filter(Boolean);
  }, []);

  if (!apps.length) return null;

  const renderCell = (val) => {
    if (val === true)  return <span style={{ color:'#4ade80', fontWeight:700 }}>✓</span>;
    if (val === false) return <span style={{ color:'var(--muted)', opacity:0.5 }}>—</span>;
    if (val && typeof val === 'object' && (val.cs || val.en)) return <span style={{ color:'var(--text)' }}>{lang==='cs'?val.cs:val.en}</span>;
    return <span style={{ color:'var(--text)' }}>{val}</span>;
  };

  return (
    <section style={{ padding:'90px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:1000, margin:'0 auto' }}>
        <SectionLabel color="a2" num="03">{tx(lang,'compare_title')}</SectionLabel>
        <p style={{ color:'var(--muted)', fontSize:16, marginBottom:36 }}>
          {tx(lang,'compare_desc')}
        </p>

        <div style={{ overflowX:'auto', border:'1px solid var(--border)', borderRadius:'var(--r)', background:'var(--card)' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:520 }}>
            <thead>
              <tr>
                <th style={{ padding:'18px 20px', textAlign:'left', fontSize:11, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--muted)', opacity:0.7, borderBottom:'1px solid var(--border)' }}>
                  {/* spacer */}
                </th>
                {apps.map(a => (
                  <th key={a.id} style={{ padding:'16px 20px', textAlign:'left', borderBottom:'1px solid var(--border)', verticalAlign:'top' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:32, height:32, borderRadius:8, flexShrink:0,
                        background:`linear-gradient(135deg, ${a.color}28, ${a.color}50)`,
                        border:`1px solid ${a.color}40`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:a.color,
                      }}>{a.name[0]}</div>
                      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:'var(--text)' }}>{a.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cfg.rows.map((r, ri) => (
                <tr key={r.key}>
                  <th scope="row" style={{
                    padding:'14px 20px', fontSize:13, color:'var(--muted)',
                    borderBottom: ri < cfg.rows.length - 1 ? '1px solid var(--border)' : 'none',
                    width:'30%',
                    textAlign:'left', fontWeight:'normal',
                  }}>{lang === 'cs' ? r.cs : r.en}</th>
                  {apps.map(a => (
                    <td key={a.id} style={{
                      padding:'14px 20px', fontSize:14,
                      borderBottom: ri < cfg.rows.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      {renderCell(cfg.data[a.id]?.[r.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── Donation widget (inline button) ────────────────────────────────────
function DonationButton({ lang }) {
  const u = window.KOFI_USERNAME;
  if (!u) {
    // Placeholder card when no Ko-fi configured yet
    return (
      <div style={{
        display:'inline-flex', alignItems:'center', gap:10,
        padding:'10px 20px', borderRadius:50,
        border:'1px dashed var(--border)', color:'var(--muted)',
        fontSize:13, opacity:0.6,
      }}>
        ☕ {tx(lang,'donate_label')} <span style={{ fontSize:10, fontFamily:'ui-monospace,monospace', opacity:0.7 }}>(soon)</span>
      </div>
    );
  }
  return (
    <a href={`https://ko-fi.com/${u}`} target="_blank" rel="noopener noreferrer" style={{
      display:'inline-flex', alignItems:'center', gap:10,
      padding:'12px 24px', borderRadius:50,
      background:'#29abe0', color:'#fff',
      fontWeight:600, fontSize:14, fontFamily:'inherit',
      boxShadow:'0 4px 20px rgba(41,171,224,0.3)',
      transition:'transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform='none'}>
      ☕ {tx(lang,'donate_label')}
    </a>
  );
}

// ── Most Played (reads localStorage.jw_plays counter) ───────────────────
function MostPlayedSection({ lang, onPlay, currentTrack, playing }) {
  const [ref, vis] = useInView();
  const [tick, setTick] = __useS_ex(0);

  __useE_ex(() => {
    const id = setInterval(() => setTick(t => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  const top = __useM_ex(() => {
    // Reálná globální čísla z DB (window.TRACKS_DATA[].plays), průběžně i optimisticky.
    const tracks = window.TRACKS_DATA || [];
    return tracks
      .map(t => ({ track: t, count: t.plays || 0 }))
      .filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [tick]);

  if (top.length === 0) return null;
  const albums = window.ALBUMS || [];
  const albumMap = Object.fromEntries(albums.map(a => [a.id, a]));
  const max = top[0].count;

  return (
    <section style={{ padding:'80px 24px', background:'transparent' }}>
      <div ref={ref} className={`fade-up${vis?' in-view':''}`} style={{ maxWidth:760, margin:'0 auto' }}>
        <SubLabel>{lang === 'cs' ? 'Nejvíce poslouchané' : 'Most played'}</SubLabel>
        <div style={{
          background:'var(--card)', border:'1px solid var(--border)',
          borderRadius:'var(--r)', padding:'6px',
        }}>
          {top.map((row, i) => {
            const al = albumMap[row.track.album];
            const active = currentTrack?.id === row.track.id;
            return (
              <button key={row.track.id} onClick={() => onPlay(row.track, top.map(r => r.track))}
                style={{
                  width:'100%', display:'flex', alignItems:'center', gap:14,
                  padding:'12px 16px', borderRadius:10, textAlign:'left',
                  background: active ? 'color-mix(in srgb, var(--a1) 12%, transparent)' : 'transparent',
                  border: `1px solid ${active ? 'color-mix(in srgb, var(--a1) 40%, transparent)' : 'transparent'}`,
                  cursor:'pointer', transition:'background 0.12s',
                }}>
                <div style={{ width:24, fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:800, color:'var(--a1)', textAlign:'center' }}>
                  {active && playing ? <EqBars /> : `#${i + 1}`}
                </div>
                <div style={{ width:38, height:38, borderRadius:7, flexShrink:0, backgroundImage:`url("${trackArt(row.track, al)}")`, backgroundSize:'cover' }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color: active ? 'var(--a1)' : 'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{row.track.title}</div>
                  <div style={{ fontSize:12, color:'var(--muted)' }}>{al?.title || ''}</div>
                </div>
                <div style={{ minWidth:80, textAlign:'right' }}>
                  <div style={{ fontSize:12, color:'var(--muted)', fontVariantNumeric:'tabular-nums' }}>
                    {row.count}×
                  </div>
                  <div style={{ height:3, width:'100%', maxWidth:80, marginTop:5, marginLeft:'auto', background:'var(--border)', borderRadius:2, overflow:'hidden' }}>
                    <div style={{ width:`${(row.count / max) * 100}%`, height:'100%', background:'var(--a1)' }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { NewsletterSection, StatsSection, ComparisonSection, DonationButton, MostPlayedSection });

// ==========================================
// FILE: search.jsx
// ==========================================
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
            id="search-input"
            name="search"
            type="text"
            autoComplete="off"
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

// ==========================================
// FILE: app.jsx
// ==========================================
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
