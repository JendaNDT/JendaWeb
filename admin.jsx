// admin.jsx — JendaWeb admin (fáze 5): přihlášení + správa obsahu + nahrávání souborů.
// Vše plain fetch na Supabase REST/Storage/GoTrue (konzistentní se zbytkem webu).
const { useState, useEffect, useRef, useCallback } = React;

const SUPABASE_URL = 'https://semdgbaearwhkhulkyts.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbWRnYmFlYXJ3aGtodWxreXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUzNzAsImV4cCI6MjA5NzA2MTM3MH0.5X4X-FVXlwukKWOlx3kIqazaBBeJJMCNMiEmdNPM8lk';
const SESSION_KEY = 'jw_admin_session';
const REST = SUPABASE_URL + '/rest/v1/';

/* ---------------- session + auth ---------------- */
function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (s && s.access_token) return s;
  } catch (e) {}
  return null;
}
function saveSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {} }
function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }

async function ensureToken() {
  const s = loadSession();
  if (!s) return null;
  if (s.expires_at && s.expires_at * 1000 - Date.now() > 60000) return s;
  try {
    const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: s.refresh_token }),
    });
    if (r.ok) { const ns = await r.json(); saveSession(ns); return ns; }
  } catch (e) {}
  return s;
}

async function apiLogin(email, password) {
  const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST', headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error_description || data.msg || data.error || ('Přihlášení selhalo (' + r.status + ')'));
  return data;
}
async function apiLogout() {
  const s = loadSession();
  if (s && s.access_token) {
    try { await fetch(SUPABASE_URL + '/auth/v1/logout', { method: 'POST', headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + s.access_token } }); } catch (e) {}
  }
}
async function updatePassword(newPw) {
  const s = await ensureToken();
  const r = await fetch(SUPABASE_URL + '/auth/v1/user', {
    method: 'PUT', headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: newPw }),
  });
  if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.msg || d.error_description || d.error || ('Chyba ' + r.status)); }
}

/* ---------------- data API (REST + Storage) ---------------- */
async function sbReq(method, path, body) {
  const s = await ensureToken();
  const r = await fetch(REST + path, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: 'Bearer ' + (s ? s.access_token : SUPABASE_KEY),
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const txt = await r.text();
  const data = txt ? JSON.parse(txt) : null;
  if (!r.ok) throw new Error((data && (data.message || data.details || data.hint)) || ('Chyba ' + r.status));
  return data;
}
const sbList = (table, qs) => sbReq('GET', table + '?' + (qs || 'select=*'));
const sbInsert = (table, row) => sbReq('POST', table, row);
const sbUpdate = (table, col, id, patch) => sbReq('PATCH', table + '?' + col + '=eq.' + encodeURIComponent(id), patch);
const sbDelete = (table, col, id) => sbReq('DELETE', table + '?' + col + '=eq.' + encodeURIComponent(id));

function safeName(n) { return String(n || 'file').replace(/[^a-zA-Z0-9._-]/g, '_'); }
function uploadFile(bucket, folder, file, onProgress) {
  return new Promise((resolve, reject) => {
    ensureToken().then((s) => {
      if (!s) { reject(new Error('Nepřihlášeno')); return; }
      const path = folder + '/' + Date.now() + '_' + safeName(file.name);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', SUPABASE_URL + '/storage/v1/object/' + bucket + '/' + path);
      xhr.setRequestHeader('apikey', SUPABASE_KEY);
      xhr.setRequestHeader('Authorization', 'Bearer ' + s.access_token);
      xhr.setRequestHeader('x-upsert', 'true');
      if (file.type) xhr.setRequestHeader('Content-Type', file.type);
      xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round(e.loaded / e.total * 100)); };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(SUPABASE_URL + '/storage/v1/object/public/' + bucket + '/' + path);
        else reject(new Error('Nahrání selhalo (' + xhr.status + ')'));
      };
      xhr.onerror = () => reject(new Error('Síťová chyba při nahrávání'));
      xhr.send(file);
    }, reject);
  });
}

/* ---------------- helpers: audio preview, web links, drag reorder ---------------- */
const SITE = location.origin;
function fmtDur(sec) {
  if (!sec || !isFinite(sec)) return '';
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}
function readAudioDuration(file) {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement('audio');
      a.preload = 'metadata';
      a.onloadedmetadata = () => { const d = a.duration; URL.revokeObjectURL(url); resolve(fmtDur(d)); };
      a.onerror = () => { URL.revokeObjectURL(url); resolve(''); };
      a.src = url;
    } catch (e) { resolve(''); }
  });
}
let CURRENT_AUDIO = null;
function PlayBtn({ url }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);
  useEffect(() => () => { if (ref.current) { ref.current.pause(); if (CURRENT_AUDIO === ref.current) CURRENT_AUDIO = null; } }, []);
  const toggle = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!ref.current) {
      ref.current = new Audio(url);
      ref.current.onended = () => setPlaying(false);
      ref.current.onpause = () => setPlaying(false);
      ref.current.onplay = () => setPlaying(true);
    }
    if (!ref.current.paused) { ref.current.pause(); return; }
    if (CURRENT_AUDIO && CURRENT_AUDIO !== ref.current) { try { CURRENT_AUDIO.pause(); } catch (e) {} }
    CURRENT_AUDIO = ref.current;
    ref.current.play().catch(() => {});
  };
  return <button className={'iconbtn' + (playing ? ' playing' : '')} onClick={toggle} title="Přehrát / pauza">{playing ? '⏸' : '▶'}</button>;
}
function WebLink({ url }) {
  if (!url) return null;
  return <a className="iconbtn" href={url} target="_blank" rel="noopener" title="Otevřít na webu" onClick={(e) => e.stopPropagation()}>↗</a>;
}
async function persistOrder(table, items, notify) {
  try {
    await Promise.all(items.map((it, i) => sbUpdate(table, 'id', it.id, { sort: i })));
    if (notify) notify('Pořadí uloženo', 'ok');
  } catch (e) { if (notify) notify(e.message || 'Pořadí se nepodařilo uložit', 'err'); }
}
function DragList({ items, getKey, renderRow, onReorder }) {
  const [order, setOrder] = useState(items);
  useEffect(() => { setOrder(items); }, [items]);
  const from = useRef(null);
  const [over, setOver] = useState(null);
  const commit = () => {
    const f = from.current, t = over;
    from.current = null; setOver(null);
    if (f == null || t == null || f === t) return;
    const next = order.slice();
    const [m] = next.splice(f, 1);
    next.splice(t, 0, m);
    setOrder(next);
    onReorder(next);
  };
  return (
    <div className="list">
      {order.map((it, i) => renderRow(it, i, {
        draggable: true,
        onDragStart: () => { from.current = i; },
        onDragOver: (e) => { e.preventDefault(); if (over !== i) setOver(i); },
        onDragEnd: commit,
        onDrop: (e) => { e.preventDefault(); commit(); },
        highlight: over === i,
      }))}
    </div>
  );
}

/* ---------------- shared UI ---------------- */
const wrap = { width: '100%', maxWidth: 720, margin: '0 auto', padding: '0 18px' };

function Field({ label, children }) {
  return <label className="fld"><span>{label}</span>{children}</label>;
}
function FileDrop({ accept, file, onFile, label }) {
  const [over, setOver] = useState(false);
  const inp = useRef(null);
  return (
    <div className={'drop' + (over ? ' over' : '')}
      onClick={() => inp.current && inp.current.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]); }}>
      <input ref={inp} type="file" accept={accept} style={{ display: 'none' }}
        onChange={(e) => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
      {file ? ('📎 ' + file.name) : (label || 'Přetáhni sem soubor, nebo klikni')}
    </div>
  );
}
function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="syne" style={{ fontSize: 19, fontWeight: 800 }}>{title}</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Zavřít</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function FormActions({ busy, onCancel, onSubmit, submitLabel, progress }) {
  return (
    <div style={{ marginTop: 6 }}>
      {progress != null && progress >= 0 && (
        <div className="prog"><i style={{ width: progress + '%' }} /></div>
      )}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 14 }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>Zrušit</button>
        <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={busy}>
          {busy ? <span className="spin" /> : (submitLabel || 'Uložit')}
        </button>
      </div>
    </div>
  );
}

/* ---------------- TRACKS ---------------- */
function TrackForm({ initial, albums, onClose, onSaved, notify }) {
  const [f, setF] = useState(() => initial ? {
    title: initial.title || '', album_id: initial.album_id || (albums[0] && albums[0].id) || '',
    duration: initial.duration || '', lyrics_cs: initial.lyrics_cs || '', lyrics_en: initial.lyrics_en || '',
    sort: initial.sort != null ? initial.sort : 0, audio_url: initial.audio_url || '', download_url: initial.download_url || '',
  } : { title: '', album_id: (albums[0] && albums[0].id) || '', duration: '', lyrics_cs: '', lyrics_en: '', sort: 0, audio_url: '', download_url: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(-1);
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));
  const onPickAudio = (fl) => { setFile(fl); readAudioDuration(fl).then((d) => { if (d) set('duration', d); }); };

  const submit = async () => {
    if (!f.title.trim()) { notify('Zadej název skladby', 'err'); return; }
    setBusy(true);
    try {
      let audio_url = f.audio_url, download_url = f.download_url;
      if (file) {
        setProg(0);
        const url = await uploadFile('audio', 'tracks', file, setProg);
        audio_url = url; download_url = url;
        setProg(-1);
      }
      const row = {
        title: f.title.trim(), album_id: f.album_id || null, duration: f.duration.trim() || null,
        audio_url: audio_url || null, download_url: download_url || null,
        lyrics_cs: f.lyrics_cs.trim() || null, lyrics_en: f.lyrics_en.trim() || null,
        sort: Number(f.sort) || 0,
      };
      if (initial) await sbUpdate('tracks', 'id', initial.id, row);
      else await sbInsert('tracks', row);
      notify('Skladba uložena', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba při ukládání', 'err'); }
    finally { setBusy(false); setProg(-1); }
  };

  return (
    <Modal title={initial ? 'Upravit skladbu' : 'Nová skladba'} onClose={onClose}>
      <Field label="Název"><input value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Album">
        <select value={f.album_id} onChange={(e) => set('album_id', e.target.value)}>
          {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </Field>
      <Field label="Délka (např. 4:12)"><input value={f.duration} onChange={(e) => set('duration', e.target.value)} placeholder="4:12" /></Field>
      <Field label={'Audio (mp3)' + (f.audio_url ? ' — nahráno ✓' : '')}>
        <FileDrop accept="audio/*" file={file} onFile={onPickAudio} label="Přetáhni mp3, nebo klikni (délka se vyplní sama)" />
        {f.audio_url && !file && <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}><PlayBtn url={f.audio_url} /><span style={{ fontSize: 12, color: 'var(--muted)' }}>přehrát nahrané audio</span></div>}
      </Field>
      <Field label="Text CZ (nepovinné)"><textarea value={f.lyrics_cs} onChange={(e) => set('lyrics_cs', e.target.value)} /></Field>
      <Field label="Text EN (nepovinné)"><textarea value={f.lyrics_en} onChange={(e) => set('lyrics_en', e.target.value)} /></Field>
      <Field label="Pořadí"><input type="number" value={f.sort} onChange={(e) => set('sort', e.target.value)} /></Field>
      <FormActions busy={busy} progress={prog} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- ALBUMS ---------------- */
function slugify(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function AlbumForm({ initial, onClose, onSaved, notify }) {
  const [f, setF] = useState(() => initial ? {
    id: initial.id, title: initial.title || '', genre: initial.genre || '', year: initial.year || '',
    g1: initial.g1 || '#f59e0b', g2: initial.g2 || '#b45309', tracks: initial.tracks != null ? initial.tracks : '',
    cs: initial.cs || '', en: initial.en || '', sort: initial.sort != null ? initial.sort : 0,
  } : { id: '', title: '', genre: '', year: new Date().getFullYear(), g1: '#f59e0b', g2: '#b45309', tracks: '', cs: '', en: '', sort: 0 });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));

  const submit = async () => {
    const id = initial ? initial.id : (f.id.trim() || slugify(f.title));
    if (!id) { notify('Zadej ID alba (slug) nebo název', 'err'); return; }
    if (!f.title.trim()) { notify('Zadej název alba', 'err'); return; }
    setBusy(true);
    try {
      const row = {
        title: f.title.trim(), genre: f.genre.trim() || null, year: Number(f.year) || null,
        g1: f.g1, g2: f.g2, tracks: f.tracks === '' ? null : Number(f.tracks),
        cs: f.cs.trim() || null, en: f.en.trim() || null, sort: Number(f.sort) || 0,
      };
      if (initial) await sbUpdate('albums', 'id', initial.id, row);
      else await sbInsert('albums', Object.assign({ id: id }, row));
      notify('Album uloženo', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba při ukládání', 'err'); }
    finally { setBusy(false); }
  };

  return (
    <Modal title={initial ? 'Upravit album' : 'Nové album'} onClose={onClose}>
      {!initial && <Field label="ID / slug (krátké, bez mezer — např. sahara)"><input value={f.id} onChange={(e) => set('id', e.target.value)} placeholder={slugify(f.title) || 'sahara'} /></Field>}
      <Field label="Název"><input value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Žánr"><input value={f.genre} onChange={(e) => set('genre', e.target.value)} /></Field>
      <Field label="Rok"><input type="number" value={f.year} onChange={(e) => set('year', e.target.value)} /></Field>
      <Field label="Počet skladeb (zobrazené číslo)"><input type="number" value={f.tracks} onChange={(e) => set('tracks', e.target.value)} /></Field>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Barva 1"><input type="color" value={f.g1} onChange={(e) => set('g1', e.target.value)} style={{ height: 44, padding: 4 }} /></Field>
        <Field label="Barva 2"><input type="color" value={f.g2} onChange={(e) => set('g2', e.target.value)} style={{ height: 44, padding: 4 }} /></Field>
      </div>
      <Field label="Popis CZ"><textarea value={f.cs} onChange={(e) => set('cs', e.target.value)} /></Field>
      <Field label="Popis EN"><textarea value={f.en} onChange={(e) => set('en', e.target.value)} /></Field>
      <Field label="Pořadí"><input type="number" value={f.sort} onChange={(e) => set('sort', e.target.value)} /></Field>
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- APPS ---------------- */
function AppForm({ initial, onClose, onSaved, notify }) {
  const [f, setF] = useState(() => initial ? {
    name: initial.name || '', platform: initial.platform || 'PWA', color: initial.color || '#f97316',
    cs: initial.cs || '', en: initial.en || '', link: initial.link || '', case_study_url: initial.case_study_url || '',
    icon_url: initial.icon_url || '', sort: initial.sort != null ? initial.sort : 0,
  } : { name: '', platform: 'PWA', color: '#f97316', cs: '', en: '', link: '', case_study_url: '', icon_url: '', sort: 0 });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(-1);
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));
  const [preview, setPreview] = useState(initial && initial.icon_url ? initial.icon_url : '');
  const onPickIcon = (fl) => { setFile(fl); try { setPreview(URL.createObjectURL(fl)); } catch (e) {} };

  const submit = async () => {
    if (!f.name.trim()) { notify('Zadej název aplikace', 'err'); return; }
    setBusy(true);
    try {
      let icon_url = f.icon_url;
      if (file) { setProg(0); icon_url = await uploadFile('images', 'apps', file, setProg); setProg(-1); }
      const row = {
        name: f.name.trim(), platform: f.platform, color: f.color,
        cs: f.cs.trim() || null, en: f.en.trim() || null, link: f.link.trim() || '#',
        case_study_url: f.case_study_url.trim() || null, icon_url: icon_url || null, sort: Number(f.sort) || 0,
      };
      if (initial) await sbUpdate('apps', 'id', initial.id, row);
      else await sbInsert('apps', row);
      notify('Aplikace uložena', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba při ukládání', 'err'); }
    finally { setBusy(false); setProg(-1); }
  };

  return (
    <Modal title={initial ? 'Upravit aplikaci' : 'Nová aplikace'} onClose={onClose}>
      <Field label="Název"><input value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Platforma">
          <select value={f.platform} onChange={(e) => set('platform', e.target.value)}>
            <option value="PWA">PWA</option><option value="Android">Android</option>
          </select>
        </Field>
        <Field label="Barva"><input type="color" value={f.color} onChange={(e) => set('color', e.target.value)} style={{ height: 44, padding: 4 }} /></Field>
      </div>
      <Field label="Popis CZ"><textarea value={f.cs} onChange={(e) => set('cs', e.target.value)} /></Field>
      <Field label="Popis EN"><textarea value={f.en} onChange={(e) => set('en', e.target.value)} /></Field>
      <Field label="Odkaz (URL aplikace)"><input value={f.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" /></Field>
      <Field label="Odkaz na case study (nepovinné)"><input value={f.case_study_url} onChange={(e) => set('case_study_url', e.target.value)} placeholder="case-studies/…html" /></Field>
      <Field label={'Ikona (obrázek)' + (f.icon_url ? ' — nahráno ✓' : '')}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {preview && <img className="thumb" src={preview} alt="" />}
          <div style={{ flex: 1 }}><FileDrop accept="image/*" file={file} onFile={onPickIcon} label="Přetáhni obrázek, nebo klikni" /></div>
        </div>
      </Field>
      <Field label="Pořadí"><input type="number" value={f.sort} onChange={(e) => set('sort', e.target.value)} /></Field>
      <FormActions busy={busy} progress={prog} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- SOCIALS ---------------- */
function SocialForm({ initial, onClose, onSaved, notify }) {
  const [f, setF] = useState(() => initial ? { id: initial.id, label: initial.label || '', url: initial.url || '', sort: initial.sort != null ? initial.sort : 0 }
    : { id: '', label: '', url: '', sort: 0 });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));
  const submit = async () => {
    const id = initial ? initial.id : (f.id.trim() || slugify(f.label));
    if (!id) { notify('Zadej ID (např. github)', 'err'); return; }
    setBusy(true);
    try {
      const row = { label: f.label.trim(), url: f.url.trim(), sort: Number(f.sort) || 0 };
      if (initial) await sbUpdate('socials', 'id', initial.id, row);
      else await sbInsert('socials', Object.assign({ id: id }, row));
      notify('Síť uložena', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title={initial ? 'Upravit síť' : 'Nová síť'} onClose={onClose}>
      {!initial && <Field label="ID (např. github, youtube)"><input value={f.id} onChange={(e) => set('id', e.target.value)} /></Field>}
      <Field label="Název"><input value={f.label} onChange={(e) => set('label', e.target.value)} /></Field>
      <Field label="URL"><input value={f.url} onChange={(e) => set('url', e.target.value)} placeholder="https://…" /></Field>
      <Field label="Pořadí"><input type="number" value={f.sort} onChange={(e) => set('sort', e.target.value)} /></Field>
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- CONFIG (texty & odkazy) ---------------- */
function ConfigForm({ config, onClose, onSaved, notify }) {
  const stats = config.public_stats || {};
  const [f, setF] = useState({
    contact_email: config.contact_email || '', contact_endpoint: config.contact_endpoint || '',
    newsletter_endpoint: config.newsletter_endpoint || '', kofi_username: config.kofi_username || '',
    commits_month: stats.commits_month || 0, apps_built: stats.apps_built || 0,
    tracks_released: stats.tracks_released || 0, shipped_this_year: stats.shipped_this_year || 0,
  });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));
  const submit = async () => {
    setBusy(true);
    try {
      const saves = [
        sbUpdate('site_config', 'key', 'contact_email', { value: f.contact_email.trim() || null }),
        sbUpdate('site_config', 'key', 'contact_endpoint', { value: f.contact_endpoint.trim() || null }),
        sbUpdate('site_config', 'key', 'newsletter_endpoint', { value: f.newsletter_endpoint.trim() || null }),
        sbUpdate('site_config', 'key', 'kofi_username', { value: f.kofi_username.trim() || null }),
        sbUpdate('site_config', 'key', 'public_stats', { value: {
          commits_month: Number(f.commits_month) || 0, apps_built: Number(f.apps_built) || 0,
          tracks_released: Number(f.tracks_released) || 0, shipped_this_year: Number(f.shipped_this_year) || 0,
        } }),
      ];
      await Promise.all(saves);
      notify('Uloženo', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Kontakt, odkazy & statistiky" onClose={onClose}>
      <Field label="Kontaktní e-mail"><input value={f.contact_email} onChange={(e) => set('contact_email', e.target.value)} /></Field>
      <Field label="Kontaktní formulář endpoint (Formspree, nepovinné)"><input value={f.contact_endpoint} onChange={(e) => set('contact_endpoint', e.target.value)} /></Field>
      <Field label="Newsletter endpoint (Buttondown, nepovinné)"><input value={f.newsletter_endpoint} onChange={(e) => set('newsletter_endpoint', e.target.value)} /></Field>
      <Field label="Ko-fi username (nepovinné)"><input value={f.kofi_username} onChange={(e) => set('kofi_username', e.target.value)} /></Field>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--a2)', textTransform: 'uppercase', letterSpacing: '.06em', margin: '8px 0 12px' }}>Statistiky (Deník buildu)</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Commitů/měsíc"><input type="number" value={f.commits_month} onChange={(e) => set('commits_month', e.target.value)} /></Field>
        <Field label="Aplikací"><input type="number" value={f.apps_built} onChange={(e) => set('apps_built', e.target.value)} /></Field>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Skladeb"><input type="number" value={f.tracks_released} onChange={(e) => set('tracks_released', e.target.value)} /></Field>
        <Field label="Projektů/rok"><input type="number" value={f.shipped_this_year} onChange={(e) => set('shipped_this_year', e.target.value)} /></Field>
      </div>
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- password ---------------- */
function PasswordModal({ onClose, notify }) {
  const [p1, setP1] = useState(''); const [p2, setP2] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (p1.length < 8) { notify('Heslo aspoň 8 znaků', 'err'); return; }
    if (p1 !== p2) { notify('Hesla se neshodují', 'err'); return; }
    setBusy(true);
    try { await updatePassword(p1); notify('Heslo změněno', 'ok'); onClose(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Změnit heslo" onClose={onClose}>
      <Field label="Nové heslo"><input type="password" value={p1} onChange={(e) => setP1(e.target.value)} /></Field>
      <Field label="Heslo znovu"><input type="password" value={p2} onChange={(e) => setP2(e.target.value)} /></Field>
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} submitLabel="Změnit" />
    </Modal>
  );
}

/* ---------------- list row ---------------- */
function ItemRow({ title, sub, swatch, leading, badge, webUrl, onEdit, onDelete, drag }) {
  const d = drag || {};
  return (
    <div className={'item' + (d.highlight ? ' dragover' : '')}
      draggable={d.draggable || undefined}
      onDragStart={d.onDragStart} onDragOver={d.onDragOver} onDragEnd={d.onDragEnd} onDrop={d.onDrop}>
      {drag && <span className="grip" title="Přetáhni pro změnu pořadí">⠿</span>}
      {leading}
      {swatch && <div className="swatch" style={{ background: swatch }} />}
      <div className="grow">
        <div className="t">{title}</div>
        {sub && <div className="s">{sub}</div>}
      </div>
      {badge}
      <WebLink url={webUrl} />
      <button className="btn btn-ghost btn-sm" onClick={onEdit}>Upravit</button>
      <button className="btn btn-danger btn-sm" onClick={onDelete}>Smazat</button>
    </div>
  );
}
function AddBtn({ onClick, label }) {
  return <button className="btn btn-primary" onClick={onClick}>+ {label}</button>;
}

/* ---------------- tabs ---------------- */
function TracksTab({ data, reload, notify }) {
  const [edit, setEdit] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [onlyNoAudio, setOnlyNoAudio] = useState(false);
  const albums = data.albums;
  const albMap = {}; albums.forEach((a) => { albMap[a.id] = a.title; });
  const del = async (t) => {
    if (!window.confirm('Smazat skladbu „' + t.title + '"?')) return;
    try { await sbDelete('tracks', 'id', t.id); notify('Smazáno', 'ok'); reload(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
  };
  const noAudioCount = data.tracks.filter((t) => !t.audio_url).length;
  const tracks = onlyNoAudio ? data.tracks.filter((t) => !t.audio_url) : data.tracks;
  const row = (t, i, drag) => (
    <ItemRow key={t.id} drag={onlyNoAudio ? null : drag}
      leading={t.audio_url ? <PlayBtn url={t.audio_url} /> : null}
      title={t.title}
      sub={(albMap[t.album_id] || '—') + (t.duration ? ' · ' + t.duration : '')}
      badge={!t.audio_url ? <span className="badge warn">bez audia</span> : null}
      webUrl={SITE + '/#track=' + t.id}
      onEdit={() => setEdit(t)} onDelete={() => del(t)} />
  );
  return (
    <div>
      <div className="toolbar">
        <AddBtn onClick={() => setEdit(null)} label="Nová skladba" />
        <button className={'toggle' + (onlyNoAudio ? ' on' : '')} onClick={() => setOnlyNoAudio((v) => !v)}>
          Jen bez audia{noAudioCount ? ' (' + noAudioCount + ')' : ''}
        </button>
      </div>
      {onlyNoAudio
        ? <div className="list">{tracks.map((t) => row(t))}</div>
        : <DragList items={tracks} getKey={(t) => t.id} renderRow={row}
            onReorder={(next) => persistOrder('tracks', next, notify).then(reload)} />}
      {tracks.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{onlyNoAudio ? 'Všechny skladby mají audio 🎉' : 'Zatím žádné skladby.'}</div>}
      {edit !== undefined && <TrackForm initial={edit} albums={albums} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
    </div>
  );
}
function AlbumsTab({ data, reload, notify }) {
  const [edit, setEdit] = useState(undefined);
  const del = async (a) => {
    if (!window.confirm('Smazat album „' + a.title + '"? Skladby zůstanou, jen ztratí album.')) return;
    try { await sbDelete('albums', 'id', a.id); notify('Smazáno', 'ok'); reload(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
  };
  return (
    <div>
      <div className="toolbar"><AddBtn onClick={() => setEdit(null)} label="Nové album" /></div>
      <DragList items={data.albums} getKey={(a) => a.id}
        onReorder={(next) => persistOrder('albums', next, notify).then(reload)}
        renderRow={(a, i, drag) => (
          <ItemRow key={a.id} drag={drag}
            title={a.title} sub={(a.genre || '') + (a.year ? ' · ' + a.year : '')}
            swatch={'linear-gradient(135deg,' + (a.g1 || '#888') + ',' + (a.g2 || '#444') + ')'}
            webUrl={SITE + '/#album=' + a.id}
            onEdit={() => setEdit(a)} onDelete={() => del(a)} />
        )} />
      {edit !== undefined && <AlbumForm initial={edit} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
    </div>
  );
}
function AppsTab({ data, reload, notify }) {
  const [edit, setEdit] = useState(undefined);
  const del = async (a) => {
    if (!window.confirm('Smazat aplikaci „' + a.name + '"?')) return;
    try { await sbDelete('apps', 'id', a.id); notify('Smazáno', 'ok'); reload(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
  };
  return (
    <div>
      <div className="toolbar"><AddBtn onClick={() => setEdit(null)} label="Nová aplikace" /></div>
      <DragList items={data.apps} getKey={(a) => a.id}
        onReorder={(next) => persistOrder('apps', next, notify).then(reload)}
        renderRow={(a, i, drag) => (
          <ItemRow key={a.id} drag={drag}
            title={a.name} sub={a.platform + (a.link && a.link !== '#' ? ' · ' + a.link : '')}
            swatch={a.color} webUrl={(a.link && a.link !== '#') ? a.link : SITE}
            onEdit={() => setEdit(a)} onDelete={() => del(a)} />
        )} />
      {edit !== undefined && <AppForm initial={edit} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
    </div>
  );
}
function TextsTab({ data, reload, notify }) {
  const [edit, setEdit] = useState(undefined); // social edit
  const [cfg, setCfg] = useState(false);
  const del = async (s) => {
    if (!window.confirm('Smazat síť „' + s.label + '"?')) return;
    try { await sbDelete('socials', 'id', s.id); notify('Smazáno', 'ok'); reload(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
  };
  return (
    <div>
      <button className="btn btn-ghost" style={{ marginBottom: 16 }} onClick={() => setCfg(true)}>⚙️ Kontakt, odkazy & statistiky</button>
      <div className="syne" style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 10px' }}>Sociální sítě</div>
      <div className="toolbar"><AddBtn onClick={() => setEdit(null)} label="Nová síť" /></div>
      <DragList items={data.socials} getKey={(s) => s.id}
        onReorder={(next) => persistOrder('socials', next, notify).then(reload)}
        renderRow={(s, i, drag) => (
          <ItemRow key={s.id} drag={drag} title={s.label} sub={s.url}
            webUrl={(s.url && s.url !== '#') ? s.url : null}
            onEdit={() => setEdit(s)} onDelete={() => del(s)} />
        )} />
      {edit !== undefined && <SocialForm initial={edit} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
      {cfg && <ConfigForm config={data.config} notify={notify}
        onClose={() => setCfg(false)} onSaved={() => { setCfg(false); reload(); }} />}
    </div>
  );
}

/* ---------------- admin shell ---------------- */
const TABS = [['tracks', 'Skladby'], ['albums', 'Alba'], ['apps', 'Aplikace'], ['texts', 'Texty & odkazy']];

function AdminApp({ session, onLogout }) {
  const [tab, setTab] = useState('tracks');
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [toast, setToast] = useState(null);
  const [pw, setPw] = useState(false);
  const notify = useCallback((msg, type) => { setToast({ msg, type: type || 'ok' }); }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);

  const load = useCallback(async () => {
    setErr('');
    try {
      const [albums, tracks, apps, socials, cfgRows] = await Promise.all([
        sbList('albums', 'select=*&order=sort.asc'),
        sbList('tracks', 'select=*&order=sort.asc'),
        sbList('apps', 'select=*&order=sort.asc'),
        sbList('socials', 'select=*&order=sort.asc'),
        sbList('site_config', 'select=key,value'),
      ]);
      const config = {}; (cfgRows || []).forEach((r) => { config[r.key] = r.value; });
      setData({ albums, tracks, apps, socials, config });
    } catch (e) { setErr(e.message || 'Načtení selhalo'); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const email = (session.user && session.user.email) || 'admin';
  return (
    <div style={Object.assign({}, wrap, { maxWidth: 1080, marginTop: 26, paddingBottom: 60 })}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Administrace</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>{email}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setPw(true)}>Změnit heslo</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Odhlásit</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(([k, label]) => (
          <button key={k} className={'tab' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {err && <div className="toast err" style={{ position: 'static', transform: 'none', marginBottom: 14 }}>{err} <button className="btn btn-ghost btn-sm" onClick={load} style={{ marginLeft: 8 }}>Zkusit znovu</button></div>}
      {!data && !err && <div style={{ color: 'var(--muted)' }}><span className="spin" style={{ borderTopColor: 'var(--a1)' }} /> Načítám…</div>}

      {data && tab === 'tracks' && <TracksTab data={data} reload={load} notify={notify} />}
      {data && tab === 'albums' && <AlbumsTab data={data} reload={load} notify={notify} />}
      {data && tab === 'apps' && <AppsTab data={data} reload={load} notify={notify} />}
      {data && tab === 'texts' && <TextsTab data={data} reload={load} notify={notify} />}

      {pw && <PasswordModal notify={notify} onClose={() => setPw(false)} />}
      {toast && <div className={'toast ' + toast.type}>{toast.msg}</div>}
    </div>
  );
}

/* ---------------- login ---------------- */
function LoginView({ onLogin }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { const s = await apiLogin(email.trim(), password); saveSession(s); onLogin(s); }
    catch (ex) { setErr(ex.message || 'Něco se pokazilo.'); }
    finally { setBusy(false); }
  };
  return (
    <div style={Object.assign({}, wrap, { maxWidth: 420, marginTop: '15vh' })}>
      <div style={{ textAlign: 'center', marginBottom: 26 }}>
        <div className="syne" style={{ fontSize: 30, fontWeight: 800, background: 'linear-gradient(120deg, var(--a1), var(--a2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JendaWeb</div>
        <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Administrace obsahu</div>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 22 }}>
        <Field label="E-mail"><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ty@email.cz" /></Field>
        <Field label="Heslo"><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></Field>
        {err && <div style={{ color: 'var(--err)', fontSize: 13 }}>{err}</div>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? <span className="spin" /> : 'Přihlásit se'}</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 18 }}><a href="/" style={{ fontSize: 13, color: 'var(--muted)' }}>← zpět na web</a></div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(loadSession);
  const handleLogout = async () => { await apiLogout(); clearSession(); setSession(null); };
  return session ? <AdminApp session={session} onLogout={handleLogout} /> : <LoginView onLogin={setSession} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
