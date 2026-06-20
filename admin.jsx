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
  let data = null;
  if (txt) { try { data = JSON.parse(txt); } catch (e) {} }
  if (!r.ok) {
    if (r.status === 401 && loadSession()) { clearSession(); try { location.reload(); } catch (e) {} }
    throw new Error((data && (data.message || data.details || data.hint)) || ('Chyba ' + r.status));
  }
  return data;
}
const sbList = (table, qs) => sbReq('GET', table + '?' + (qs || 'select=*'));
const sbInsert = (table, row) => sbReq('POST', table, row);
const sbUpdate = (table, col, id, patch) => sbReq('PATCH', table + '?' + col + '=eq.' + encodeURIComponent(id), patch);
const sbDelete = (table, col, id) => sbReq('DELETE', table + '?' + col + '=eq.' + encodeURIComponent(id));

function safeName(n) { return String(n || 'file').replace(/[^a-zA-Z0-9._-]/g, '_'); }
async function uploadFileToGithub(file, onProgress) {
  while (true) {
    let token = localStorage.getItem('jw_github_token');
    if (!token) {
      token = prompt('Zadej svůj klasický GitHub token pro nahrávání souborů nad 50 MB (bude uložen pouze lokálně ve tvém prohlížeči):');
      if (!token) throw new Error('Pro nahrání souboru nad 50 MB je vyžadován GitHub token.');
      token = token.trim();
      localStorage.setItem('jw_github_token', token);
    }

    const owner = 'JendaNDT';
    const repo = 'JendaWeb';
    const tag = 'binaries';

    async function ghReq(method, url, body, isUpload = false) {
      const headers = {
        'Authorization': 'token ' + token,
        'Accept': 'application/vnd.github.v3+json'
      };
      if (!isUpload && body) {
        headers['Content-Type'] = 'application/json';
      }
      const res = await fetch(url, {
        method,
        headers,
        body: isUpload ? body : (body ? JSON.stringify(body) : undefined)
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('jw_github_token');
          throw { status: 401, message: 'Unauthorized' };
        }
        const errText = await res.text();
        throw new Error(`Chyba GitHub API (${res.status}): ${errText}`);
      }
      return res.json();
    }

    try {
      // 1. Získat nebo vytvořit Release pro binárky
      let release = null;
      try {
        release = await ghReq('GET', `https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`);
      } catch (e) {
        if (e.status === 401) throw e;
        if (e.message && e.message.includes('404')) {
          release = await ghReq('POST', `https://api.github.com/repos/${owner}/${repo}/releases`, {
            tag_name: tag,
            name: 'App Binaries',
            body: 'Binaries and installation files for portfolio apps.',
            draft: false,
            prerelease: false
          });
        } else {
          throw e;
        }
      }

      // 2. Nahrát soubor přes XHR pro podporu progress baru
      const filename = Date.now() + '_' + safeName(file.name);
      const uploadUrl = `https://uploads.github.com/repos/${owner}/${repo}/releases/${release.id}/assets?name=${encodeURIComponent(filename)}`;

      const downloadUrl = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('Authorization', 'token ' + token);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');

        if (xhr.upload && onProgress) {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              onProgress(Math.round((e.loaded / e.total) * 100));
            }
          };
        }

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data.browser_download_url);
            } catch (err) {
              reject(new Error('Chyba při čtení odpovědi z GitHubu: ' + err.message));
            }
          } else {
            if (xhr.status === 401) {
              localStorage.removeItem('jw_github_token');
              reject({ status: 401, message: 'Unauthorized' });
            } else {
              reject(new Error(`Nahrávání na GitHub selhalo (${xhr.status}): ${xhr.responseText}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Chyba sítě při nahrávání na GitHub.'));
        xhr.send(file);
      });

      return downloadUrl;

    } catch (e) {
      if (e.status === 401) {
        localStorage.removeItem('jw_github_token');
        alert('Neplatný nebo vypršelý GitHub token. Zadejte jej prosím znovu.');
        continue;
      }
      throw e;
    }
  }
}

function uploadFile(bucket, folder, file, onProgress) {
  if (file.size > 50 * 1024 * 1024) {
    return uploadFileToGithub(file, onProgress);
  }
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
function downloadBackup(data) {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jendaweb-obsah-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  } catch (e) {}
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
    sort: initial.sort != null ? initial.sort : 0, audio_url: initial.audio_url || '', download_url: initial.download_url || '', cover_url: initial.cover_url || '',
  } : { title: '', album_id: (albums[0] && albums[0].id) || '', duration: '', lyrics_cs: '', lyrics_en: '', sort: 0, audio_url: '', download_url: '', cover_url: '' });
  const [file, setFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(initial && initial.cover_url ? initial.cover_url : '');
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(-1);
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));
  const onPickAudio = (fl) => { setFile(fl); readAudioDuration(fl).then((d) => { if (d) set('duration', d); }); };
  const onPickCover = (fl) => { setCoverFile(fl); try { setCoverPreview(URL.createObjectURL(fl)); } catch (e) {} };

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
      let cover_url = f.cover_url;
      if (coverFile) { setProg(0); cover_url = await uploadFile('images', 'covers', coverFile, setProg); setProg(-1); }
      const row = {
        title: f.title.trim(), album_id: f.album_id || null, duration: f.duration.trim() || null,
        audio_url: audio_url || null, download_url: download_url || null,
        lyrics_cs: f.lyrics_cs.trim() || null, lyrics_en: f.lyrics_en.trim() || null,
        cover_url: cover_url || null,
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
      <Field label={'Obrázek skladby' + (f.cover_url ? ' — nahráno ✓' : ' (nepovinné, jinak procedurální art)')}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {coverPreview && <img className="thumb" src={coverPreview} alt="" />}
          <div style={{ flex: 1 }}><FileDrop accept="image/*" file={coverFile} onFile={onPickCover} label="Přetáhni obrázek, nebo klikni" /></div>
        </div>
      </Field>
      <div style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 6px', lineHeight: 1.5 }}>
        Tip: pro synchronizovaný (rolovací) text vlož řádky s časovými značkami ve formátu <code style={{ background: 'rgba(255,255,255,.08)', padding: '1px 5px', borderRadius: 4 }}>[mm:ss.xx] text</code> — přehrávač je pak během přehrávání sám zvýrazňuje. Bez značek se text ukáže jako obyčejný blok.
      </div>
      <Field label="Text / LRC (CZ)"><textarea value={f.lyrics_cs} onChange={(e) => set('lyrics_cs', e.target.value)} placeholder={'[00:00.00] první řádek\n[00:12.34] druhý řádek'} /></Field>
      <Field label="Text / LRC (EN)"><textarea value={f.lyrics_en} onChange={(e) => set('lyrics_en', e.target.value)} placeholder={'[00:00.00] first line\n[00:12.34] second line'} /></Field>
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
    g1: initial.g1 || '#f59e0b', g2: initial.g2 || '#b45309',
    cs: initial.cs || '', en: initial.en || '', sort: initial.sort != null ? initial.sort : 0, cover_url: initial.cover_url || '',
  } : { id: '', title: '', genre: '', year: new Date().getFullYear(), g1: '#f59e0b', g2: '#b45309', cs: '', en: '', sort: 0, cover_url: '' });
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(-1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial && initial.cover_url ? initial.cover_url : '');
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));
  const onPickCover = (fl) => { setFile(fl); try { setPreview(URL.createObjectURL(fl)); } catch (e) {} };

  const submit = async () => {
    const id = initial ? initial.id : (f.id.trim() || slugify(f.title));
    if (!id) { notify('Zadej ID alba (slug) nebo název', 'err'); return; }
    if (!f.title.trim()) { notify('Zadej název alba', 'err'); return; }
    setBusy(true);
    try {
      let cover_url = f.cover_url;
      if (file) { setProg(0); cover_url = await uploadFile('images', 'covers', file, setProg); setProg(-1); }
      const row = {
        title: f.title.trim(), genre: f.genre.trim() || null, year: Number(f.year) || null,
        g1: f.g1, g2: f.g2,
        cs: f.cs.trim() || null, en: f.en.trim() || null, sort: Number(f.sort) || 0, cover_url: cover_url || null,
      };
      if (initial) await sbUpdate('albums', 'id', initial.id, row);
      else await sbInsert('albums', Object.assign({ id: id }, row));
      notify('Album uloženo', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba při ukládání', 'err'); }
    finally { setBusy(false); setProg(-1); }
  };

  return (
    <Modal title={initial ? 'Upravit album' : 'Nové album'} onClose={onClose}>
      {!initial && <Field label="ID / slug (krátké, bez mezer — např. sahara)"><input value={f.id} onChange={(e) => set('id', e.target.value)} placeholder={slugify(f.title) || 'sahara'} /></Field>}
      <Field label="Název"><input value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Žánr"><input value={f.genre} onChange={(e) => set('genre', e.target.value)} /></Field>
      <Field label="Rok"><input type="number" value={f.year} onChange={(e) => set('year', e.target.value)} /></Field>
      <Field label={'Obálka alba' + (f.cover_url ? ' — nahráno ✓' : ' (jinak se použijí barvy)')}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {preview && <img className="thumb" src={preview} alt="" />}
          <div style={{ flex: 1 }}><FileDrop accept="image/*" file={file} onFile={onPickCover} label="Přetáhni obálku, nebo klikni" /></div>
        </div>
      </Field>
      <div style={{ display: 'flex', gap: 12 }}>
        <Field label="Barva 1"><input type="color" value={f.g1} onChange={(e) => set('g1', e.target.value)} style={{ height: 44, padding: 4 }} /></Field>
        <Field label="Barva 2"><input type="color" value={f.g2} onChange={(e) => set('g2', e.target.value)} style={{ height: 44, padding: 4 }} /></Field>
      </div>
      <Field label="Popis CZ"><textarea value={f.cs} onChange={(e) => set('cs', e.target.value)} /></Field>
      <Field label="Popis EN"><textarea value={f.en} onChange={(e) => set('en', e.target.value)} /></Field>
      <Field label="Pořadí"><input type="number" value={f.sort} onChange={(e) => set('sort', e.target.value)} /></Field>
      <FormActions busy={busy} progress={prog} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- APPS ---------------- */
function AppForm({ initial, onClose, onSaved, notify }) {
  const [f, setF] = useState(() => initial ? {
    name: initial.name || '', platform: initial.platform || 'PWA', color: initial.color || '#f97316',
    cs: initial.cs || '', en: initial.en || '', link: initial.link || '', case_study_url: initial.case_study_url || '',
    icon_url: initial.icon_url || '', sort: initial.sort != null ? initial.sort : 0,
    screenshots: initial.screenshots || [],
  } : { name: '', platform: 'PWA', color: '#f97316', cs: '', en: '', link: '', case_study_url: '', icon_url: '', sort: 0, screenshots: [] });
  const [file, setFile] = useState(null); // Icon file
  const [appFile, setAppFile] = useState(null); // Binary file
  const [newScreenshots, setNewScreenshots] = useState([]); // Array of { file, preview }
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(-1);
  const set = (k, v) => setF((o) => Object.assign({}, o, { [k]: v }));
  const [preview, setPreview] = useState(initial && initial.icon_url ? initial.icon_url : '');
  const onPickIcon = (fl) => { setFile(fl); try { setPreview(URL.createObjectURL(fl)); } catch (e) {} };

  useEffect(() => {
    return () => {
      newScreenshots.forEach(s => { if (s.preview) URL.revokeObjectURL(s.preview); });
    };
  }, [newScreenshots]);

  const addNewScreenshots = (filesList) => {
    const files = Array.from(filesList);
    const added = files.map(fl => ({
      file: fl,
      preview: URL.createObjectURL(fl)
    }));
    setNewScreenshots(o => o.concat(added));
  };

  const removeNewScreenshot = (idx) => {
    setNewScreenshots(o => {
      const target = o[idx];
      if (target && target.preview) URL.revokeObjectURL(target.preview);
      return o.filter((_, i) => i !== idx);
    });
  };

  const removeScreenshot = (idx) => {
    set('screenshots', f.screenshots.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (!f.name.trim()) { notify('Zadej název aplikace', 'err'); return; }
    setBusy(true);
    try {
      let icon_url = f.icon_url;
      if (file) {
        setProg(0);
        icon_url = await uploadFile('images', 'apps', file, (p) => setProg(Math.round(p * (appFile ? 0.3 : 0.5))));
      }
      let link = f.link.trim() || '#';
      if (appFile) {
        const startProg = file ? 30 : 0;
        link = await uploadFile('binaries', 'apps', appFile, (p) => setProg(startProg + Math.round(p * (file ? 0.3 : 0.5))));
      }

      // Upload screenshots
      let screenshots = f.screenshots.slice();
      if (newScreenshots.length > 0) {
        const startProg = (file ? 30 : 0) + (appFile ? 30 : 0);
        const remainingScale = 100 - startProg;
        for (let i = 0; i < newScreenshots.length; i++) {
          const item = newScreenshots[i];
          const uploadProgressHandler = (p) => {
            const overallP = startProg + Math.round(((i + p / 100) / newScreenshots.length) * remainingScale);
            setProg(overallP);
          };
          const uploadedUrl = await uploadFile('images', 'apps', item.file, uploadProgressHandler);
          screenshots.push(uploadedUrl);
        }
      }

      setProg(-1);

      const row = {
        name: f.name.trim(), platform: f.platform, color: f.color,
        cs: f.cs.trim() || null, en: f.en.trim() || null, link: link,
        case_study_url: f.case_study_url.trim() || null, icon_url: icon_url || null, sort: Number(f.sort) || 0,
        screenshots: screenshots,
      };
      if (initial) await sbUpdate('apps', 'id', initial.id, row);
      else await sbInsert('apps', row);
      notify('Aplikace uložena', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba při ukládání', 'err'); }
    finally { setBusy(false); setProg(-1); }
  };

  const hasUploadedBin = f.link && f.link.includes('/storage/v1/object/public/binaries/');
  const uploadedBinName = hasUploadedBin ? decodeURIComponent(f.link.split('/').pop().replace(/^\d+_/, '')) : '';

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
      <Field label="Odkaz (URL aplikace, např. Google Play nebo externí web)"><input value={f.link} onChange={(e) => set('link', e.target.value)} placeholder="https://…" /></Field>
      
      <Field label={appFile ? 'Nový instalační soubor k nahrání' : (hasUploadedBin ? `Nahraný instalační soubor: ${uploadedBinName}` : 'Instalační soubor (nepovinné, nahraje se na jenda.cool)')}>
        <FileDrop accept=".apk,.zip,.dmg,.exe,.tar.gz,.ipa,.pkg" file={appFile} onFile={setAppFile} label="Přetáhni instalační soubor, nebo klikni" />
        {hasUploadedBin && !appFile && (
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Uložený soubor: <a href={f.link} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{uploadedBinName}</a></span>
            <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => set('link', '#')}>Odebrat soubor</button>
          </div>
        )}
      </Field>

      <Field label="Odkaz na case study (nepovinné)"><input value={f.case_study_url} onChange={(e) => set('case_study_url', e.target.value)} placeholder="case-studies/…html" /></Field>
      
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>Náhledy obrazovek (screenshoty)</div>
        
        {((f.screenshots && f.screenshots.length > 0) || (newScreenshots.length > 0)) && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
            {f.screenshots && f.screenshots.map((url, idx) => (
              <div key={'old-ss-' + idx} style={{ position: 'relative', width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => removeScreenshot(idx)} style={{
                  position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: '#fff',
                  border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>✕</button>
              </div>
            ))}
            {newScreenshots.map((item, idx) => (
              <div key={'new-ss-' + idx} style={{ position: 'relative', width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px dashed var(--a1)' }}>
                <img src={item.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                <span style={{ position: 'absolute', bottom: 2, left: 2, fontSize: 8, background: 'var(--a1)', color: '#fff', padding: '1px 3px', borderRadius: 3 }}>NOVÝ</span>
                <button type="button" onClick={() => removeNewScreenshot(idx)} style={{
                  position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', color: '#fff',
                  border: 'none', borderRadius: '50%', width: 18, height: 18, fontSize: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>✕</button>
              </div>
            ))}
          </div>
        )}
        
        <FileDrop accept="image/*" file={null} onFile={(fl) => addNewScreenshots([fl])} label="Přetáhni screenshot, nebo klikni" />
        <input type="file" accept="image/*" multiple style={{ display: 'none' }} id="screenshot-multiple-input"
          onChange={(e) => { if (e.target.files.length) addNewScreenshots(e.target.files); }} />
        <div style={{ textAlign: 'right', marginTop: 4 }}>
          <button type="button" className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: 11 }}
            onClick={() => document.getElementById('screenshot-multiple-input').click()}>
            + Přidat více souborů naráz
          </button>
        </div>
      </div>

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
  const [f, setF] = useState({
    contact_email: config.contact_email || '', contact_endpoint: config.contact_endpoint || '',
    newsletter_endpoint: config.newsletter_endpoint || '', kofi_username: config.kofi_username || '',
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
      ];
      await Promise.all(saves);
      notify('Uloženo', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Kontakt a odkazy" onClose={onClose}>
      <Field label="Kontaktní e-mail"><input value={f.contact_email} onChange={(e) => set('contact_email', e.target.value)} /></Field>
      <Field label="Kontaktní formulář endpoint (Formspree, nepovinné)"><input value={f.contact_endpoint} onChange={(e) => set('contact_endpoint', e.target.value)} /></Field>
      <Field label="Newsletter endpoint (Buttondown, nepovinné)"><input value={f.newsletter_endpoint} onChange={(e) => set('newsletter_endpoint', e.target.value)} /></Field>
      <Field label="Ko-fi username (nepovinné)"><input value={f.kofi_username} onChange={(e) => set('kofi_username', e.target.value)} /></Field>
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- site texts (STRINGS overrides) ---------------- */
const STRING_KEYS = [
  ['hero_tag', 'Hero – podtitul (pod jménem)'],
  ['hero_desc', 'Hero – popis'],
  ['cta_apps', 'Tlačítko: aplikace'],
  ['cta_music', 'Tlačítko: hudba'],
  ['music_sub', 'Hudba – podtitul'],
  ['contact_title', 'Kontakt – nadpis'],
  ['contact_desc', 'Kontakt – popis'],
  ['newsletter_title', 'Newsletter – nadpis'],
  ['newsletter_desc', 'Newsletter – popis'],
  ['compare_title', 'Srovnání – nadpis'],
  ['compare_desc', 'Srovnání – popis'],
  ['donate_desc', 'Ko-fi – popis'],
  ['apps_live_title', 'Aplikace – nadpis aktivních'],
  ['apps_studies_title', 'Aplikace – nadpis případových studií'],
  ['apps_read_study', 'Aplikace – tlačítko studie'],
  ['footer', 'Patička'],
];
function StringsEditor({ config, onClose, onSaved, notify }) {
  const defs = window.STRINGS || { cs: {}, en: {} };
  const ov = config.strings || { cs: {}, en: {} };
  const eff = (l, k) => (ov[l] && ov[l][k] != null ? ov[l][k] : ((defs[l] && defs[l][k]) || ''));
  const [vals, setVals] = useState(() => {
    const o = { cs: {}, en: {} };
    STRING_KEYS.forEach(function (p) { o.cs[p[0]] = eff('cs', p[0]); o.en[p[0]] = eff('en', p[0]); });
    return o;
  });
  const [busy, setBusy] = useState(false);
  const set = (l, k, v) => setVals((o) => { var n = { cs: Object.assign({}, o.cs), en: Object.assign({}, o.en) }; n[l][k] = v; return n; });
  const submit = async () => {
    setBusy(true);
    try {
      const out = { cs: {}, en: {} };
      STRING_KEYS.forEach(function (p) {
        ['cs', 'en'].forEach(function (l) {
          const v = (vals[l][p[0]] || '').trim();
          const def = (defs[l] && defs[l][p[0]]) || '';
          if (v && v !== def) out[l][p[0]] = v;
        });
      });
      await sbUpdate('site_config', 'key', 'strings', { value: out });
      notify('Texty uloženy', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Hlavní texty webu" onClose={onClose}>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>Prázdné pole = použije se výchozí text z webu.</div>
      {STRING_KEYS.map(function (p) {
        return (
          <div key={p[0]} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--a2)', marginBottom: 6 }}>{p[1]}</div>
            <input value={vals.cs[p[0]]} onChange={(e) => set('cs', p[0], e.target.value)} placeholder="Česky" style={{ marginBottom: 6 }} />
            <input value={vals.en[p[0]]} onChange={(e) => set('en', p[0], e.target.value)} placeholder="English" />
          </div>
        );
      })}
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- build log ---------------- */
function BuildLogEditor({ config, onClose, onSaved, notify }) {
  const [rows, setRows] = useState(() => (config.build_log || []).map((r) => Object.assign({}, r)));
  const [busy, setBusy] = useState(false);
  const upd = (i, k, v) => setRows((rs) => rs.map((r, j) => j === i ? Object.assign({}, r, { [k]: v }) : r));
  const add = () => setRows((rs) => [{ date: '', cs: '', en: '' }].concat(rs));
  const remove = (i) => setRows((rs) => rs.filter((_, j) => j !== i));
  const submit = async () => {
    setBusy(true);
    try {
      const clean = rows.filter((r) => (r.date || r.cs || r.en)).map((r) => ({ date: (r.date || '').trim(), cs: (r.cs || '').trim(), en: (r.en || '').trim() }));
      await sbUpdate('site_config', 'key', 'build_log', { value: clean });
      notify('Deník buildu uložen', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Deník buildu" onClose={onClose}>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={add}>+ Přidat záznam</button>
      {rows.map((r, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, marginBottom: 10 }}>
          <input value={r.date} onChange={(e) => upd(i, 'date', e.target.value)} placeholder="2026-06" style={{ marginBottom: 6 }} />
          <input value={r.cs} onChange={(e) => upd(i, 'cs', e.target.value)} placeholder="Text CZ" style={{ marginBottom: 6 }} />
          <input value={r.en} onChange={(e) => upd(i, 'en', e.target.value)} placeholder="Text EN" style={{ marginBottom: 8 }} />
          <button className="btn btn-danger btn-sm" onClick={() => remove(i)}>Odebrat</button>
        </div>
      ))}
      {rows.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Žádné záznamy. Přidej první.</div>}
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} />
    </Modal>
  );
}

/* ---------------- comparison ---------------- */
const DEFAULT_COMPARE_ROWS = [
  { key: 'platform', cs: 'Platforma', en: 'Platform' },
  { key: 'price', cs: 'Cena', en: 'Price' },
  { key: 'offline', cs: 'Offline režim', en: 'Offline mode' },
  { key: 'account', cs: 'Vyžaduje účet', en: 'Requires account' },
  { key: 'open_src', cs: 'Open source', en: 'Open source' },
  { key: 'best_for', cs: 'Nejlépe pro…', en: 'Best for…' },
];
function ComparisonEditor({ config, apps, onClose, onSaved, notify }) {
  const cmp = config.comparison || { apps: [], rows: [], data: {} };
  const appById = {}; apps.forEach((a) => { appById[a.id] = a; });
  const init = (id) => {
    const d = (cmp.data && cmp.data[id]) || {};
    return { price: d.price || 'Free', offline: !!d.offline, account: !!d.account, open_src: !!d.open_src,
             best_for_cs: (d.best_for && d.best_for.cs) || '', best_for_en: (d.best_for && d.best_for.en) || '' };
  };
  const [ids, setIds] = useState(() => {
    const base = (cmp.apps || []).slice(0, 3).map(Number);
    let n = 0;
    while (base.length < 3) { base.push(apps[n] ? apps[n].id : ''); n++; }
    return base;
  });
  const [vals, setVals] = useState(() => { const o = {}; ids.forEach((id) => { o[id] = init(id); }); return o; });
  const [busy, setBusy] = useState(false);
  const setId = (slot, id) => { const n = Number(id); setIds((a) => a.map((x, i) => i === slot ? n : x)); setVals((o) => o[n] ? o : Object.assign({}, o, { [n]: init(n) })); };
  const setV = (id, k, v) => setVals((o) => Object.assign({}, o, { [id]: Object.assign({}, o[id] || init(id), { [k]: v }) }));
  const submit = async () => {
    setBusy(true);
    try {
      const data = {};
      ids.forEach((id) => {
        const v = vals[id] || init(id);
        const app = appById[id];
        data[id] = { platform: app ? app.platform : '', price: v.price, offline: !!v.offline, account: !!v.account,
                     open_src: !!v.open_src, best_for: { cs: v.best_for_cs, en: v.best_for_en } };
      });
      const out = { apps: ids.map(Number), rows: (cmp.rows && cmp.rows.length) ? cmp.rows : DEFAULT_COMPARE_ROWS, data: data };
      await sbUpdate('site_config', 'key', 'comparison', { value: out });
      notify('Srovnání uloženo', 'ok'); onSaved();
    } catch (e) { notify(e.message || 'Chyba', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Srovnání aplikací (3)" onClose={onClose}>
      {ids.map((id, slot) => {
        const v = vals[id] || init(id);
        return (
          <div key={slot} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: 12, marginBottom: 10 }}>
            <Field label={'Aplikace ' + (slot + 1)}>
              <select value={id} onChange={(e) => setId(slot, e.target.value)}>
                {apps.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="Cena"><input value={v.price} onChange={(e) => setV(id, 'price', e.target.value)} /></Field>
            <div style={{ display: 'flex', gap: 16, margin: '4px 0 12px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: 13 }}><input type="checkbox" checked={v.offline} onChange={(e) => setV(id, 'offline', e.target.checked)} />Offline</label>
              <label style={{ fontSize: 13 }}><input type="checkbox" checked={v.account} onChange={(e) => setV(id, 'account', e.target.checked)} />Vyžaduje účet</label>
              <label style={{ fontSize: 13 }}><input type="checkbox" checked={v.open_src} onChange={(e) => setV(id, 'open_src', e.target.checked)} />Open source</label>
            </div>
            <Field label="Nejlépe pro… (CZ)"><input value={v.best_for_cs} onChange={(e) => setV(id, 'best_for_cs', e.target.value)} /></Field>
            <Field label="Nejlépe pro… (EN)"><input value={v.best_for_en} onChange={(e) => setV(id, 'best_for_en', e.target.value)} /></Field>
          </div>
        );
      })}
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

/* ---------------- bulk mp3 upload ---------------- */
function BulkUpload({ albums, notify, onClose, onDone }) {
  const [albumId, setAlbumId] = useState((albums[0] && albums[0].id) || '');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const inp = useRef(null);
  const isAudio = (x) => (x.type && x.type.indexOf('audio') === 0) || /\.(mp3|wav|m4a|ogg|flac)$/i.test(x.name);
  const add = (list) => setFiles((f) => f.concat([].slice.call(list).filter(isAudio)));
  const submit = async () => {
    if (!files.length) { notify('Vyber aspoň jeden soubor', 'err'); return; }
    setBusy(true); setDone(0);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const title = file.name.replace(/\.[^.]+$/, '');
        const duration = await readAudioDuration(file);
        const url = await uploadFile('audio', 'tracks', file);
        await sbInsert('tracks', { title: title, album_id: albumId || null, duration: duration || null, audio_url: url, download_url: url, sort: 1000 + i });
        setDone(i + 1);
      }
      notify('Nahráno ' + files.length + ' skladeb', 'ok');
      onDone();
    } catch (e) { notify(e.message || 'Chyba při nahrávání', 'err'); }
    finally { setBusy(false); }
  };
  return (
    <Modal title="Hromadné nahrání mp3" onClose={busy ? () => {} : onClose}>
      <Field label="Přidat do alba">
        <select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
          {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </Field>
      <div className="drop" onClick={() => inp.current && inp.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}>
        <input ref={inp} type="file" accept="audio/*" multiple style={{ display: 'none' }} onChange={(e) => add(e.target.files)} />
        Přetáhni sem víc mp3, nebo klikni (název skladby = název souboru)
      </div>
      {files.length > 0 && <div className="filelist">{files.map((f, i) => <div key={i}>{f.name}</div>)}</div>}
      {busy && files.length > 0 && <div className="prog" style={{ marginTop: 12 }}><i style={{ width: Math.round(done / files.length * 100) + '%' }} /></div>}
      {busy && <div style={{ fontSize: 13, marginTop: 6, color: 'var(--muted)' }}>Nahrávám {done}/{files.length}…</div>}
      <FormActions busy={busy} onCancel={onClose} onSubmit={submit} submitLabel={'Nahrát' + (files.length ? ' (' + files.length + ')' : '')} />
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
  const [bulk, setBulk] = useState(false);
  const [q, setQ] = useState('');
  const noAudioCount = data.tracks.filter((t) => !t.audio_url).length;
  const qq = q.trim().toLowerCase();
  let tracks = data.tracks;
  if (onlyNoAudio) tracks = tracks.filter((t) => !t.audio_url);
  if (qq) tracks = tracks.filter((t) => (t.title || '').toLowerCase().indexOf(qq) >= 0 || (albMap[t.album_id] || '').toLowerCase().indexOf(qq) >= 0);
  const filtered = onlyNoAudio || !!qq;
  const row = (t, i, drag) => (
    <ItemRow key={t.id} drag={filtered ? null : drag}
      leading={t.audio_url ? <PlayBtn url={t.audio_url} /> : null}
      title={t.title}
      sub={(albMap[t.album_id] || '—') + (t.duration ? ' · ' + t.duration : '') + (t.likes ? ' · ❤️ ' + t.likes : '')}
      badge={!t.audio_url ? <span className="badge warn">bez audia</span> : null}
      webUrl={SITE + '/#track=' + t.id}
      onEdit={() => setEdit(t)} onDelete={() => del(t)} />
  );
  return (
    <div>
      <div className="toolbar">
        <AddBtn onClick={() => setEdit(null)} label="Nová skladba" />
        <button className="btn btn-ghost" onClick={() => setBulk(true)}>⇪ Hromadně mp3</button>
        <button className={'toggle' + (onlyNoAudio ? ' on' : '')} onClick={() => setOnlyNoAudio((v) => !v)}>
          Jen bez audia{noAudioCount ? ' (' + noAudioCount + ')' : ''}
        </button>
        <input className="search" placeholder="Hledat skladbu…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {filtered
        ? <div className="list">{tracks.map((t) => row(t))}</div>
        : <DragList items={tracks} getKey={(t) => t.id} renderRow={row}
            onReorder={(next) => persistOrder('tracks', next, notify).then(reload)} />}
      {tracks.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{onlyNoAudio ? 'Všechny skladby mají audio 🎉' : 'Nic nenalezeno.'}</div>}
      {edit !== undefined && <TrackForm initial={edit} albums={albums} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
      {bulk && <BulkUpload albums={albums} notify={notify}
        onClose={() => setBulk(false)} onDone={() => { setBulk(false); reload(); }} />}
    </div>
  );
}
function AlbumsTab({ data, reload, notify }) {
  const [edit, setEdit] = useState(undefined);
  const [q, setQ] = useState('');
  const del = async (a) => {
    if (!window.confirm('Smazat album „' + a.title + '"? Skladby zůstanou, jen ztratí album.')) return;
    try { await sbDelete('albums', 'id', a.id); notify('Smazáno', 'ok'); reload(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
  };
  const qq = q.trim().toLowerCase();
  const albums = qq ? data.albums.filter((a) => (a.title || '').toLowerCase().indexOf(qq) >= 0 || (a.genre || '').toLowerCase().indexOf(qq) >= 0) : data.albums;
  const row = (a, i, drag) => (
    <ItemRow key={a.id} drag={qq ? null : drag}
      title={a.title} sub={(a.genre || '') + (a.year ? ' · ' + a.year : '')}
      swatch={'linear-gradient(135deg,' + (a.g1 || '#888') + ',' + (a.g2 || '#444') + ')'}
      webUrl={SITE + '/#album=' + a.id}
      onEdit={() => setEdit(a)} onDelete={() => del(a)} />
  );
  return (
    <div>
      <div className="toolbar">
        <AddBtn onClick={() => setEdit(null)} label="Nové album" />
        <input className="search" placeholder="Hledat album…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {qq
        ? <div className="list">{albums.map((a) => row(a))}</div>
        : <DragList items={albums} getKey={(a) => a.id} renderRow={row}
            onReorder={(next) => persistOrder('albums', next, notify).then(reload)} />}
      {edit !== undefined && <AlbumForm initial={edit} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
    </div>
  );
}
function AppsTab({ data, reload, notify }) {
  const [edit, setEdit] = useState(undefined);
  const [onlyNoLink, setOnlyNoLink] = useState(false);
  const [q, setQ] = useState('');
  const del = async (a) => {
    if (!window.confirm('Smazat aplikaci „' + a.name + '"?')) return;
    try { await sbDelete('apps', 'id', a.id); notify('Smazáno', 'ok'); reload(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
  };
  const noLink = (a) => !a.link || a.link === '#';
  const noLinkCount = data.apps.filter(noLink).length;
  const qq = q.trim().toLowerCase();
  let apps = data.apps;
  if (onlyNoLink) apps = apps.filter(noLink);
  if (qq) apps = apps.filter((a) => (a.name || '').toLowerCase().indexOf(qq) >= 0);
  const filtered = onlyNoLink || !!qq;
  const row = (a, i, drag) => (
    <ItemRow key={a.id} drag={filtered ? null : drag}
      title={a.name} sub={a.platform + (a.link && a.link !== '#' ? ' · ' + a.link : '') + (a.likes ? ' · ❤️ ' + a.likes : '')}
      swatch={a.color}
      badge={noLink(a) ? <span className="badge warn">chybí odkaz</span> : null}
      webUrl={(a.link && a.link !== '#') ? a.link : SITE}
      onEdit={() => setEdit(a)} onDelete={() => del(a)} />
  );
  return (
    <div>
      <div className="toolbar">
        <AddBtn onClick={() => setEdit(null)} label="Nová aplikace" />
        <button className={'toggle' + (onlyNoLink ? ' on' : '')} onClick={() => setOnlyNoLink((v) => !v)}>
          Jen bez odkazu{noLinkCount ? ' (' + noLinkCount + ')' : ''}
        </button>
        <input className="search" placeholder="Hledat aplikaci…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {filtered
        ? <div className="list">{apps.map((a) => row(a))}</div>
        : <DragList items={apps} getKey={(a) => a.id} renderRow={row}
            onReorder={(next) => persistOrder('apps', next, notify).then(reload)} />}
      {edit !== undefined && <AppForm initial={edit} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
    </div>
  );
}
function TextsTab({ data, reload, notify }) {
  const [edit, setEdit] = useState(undefined); // social edit
  const [cfg, setCfg] = useState(false);
  const [strings, setStrings] = useState(false);
  const [blog, setBlog] = useState(false);
  const [cmp, setCmp] = useState(false);
  const [q, setQ] = useState('');
  const del = async (s) => {
    if (!window.confirm('Smazat síť „' + s.label + '"?')) return;
    try { await sbDelete('socials', 'id', s.id); notify('Smazáno', 'ok'); reload(); }
    catch (e) { notify(e.message || 'Chyba', 'err'); }
  };
  const noLink = (s) => !s.url || s.url === '#';
  const qq = q.trim().toLowerCase();
  const socials = qq ? data.socials.filter((s) => (s.label || '').toLowerCase().indexOf(qq) >= 0) : data.socials;
  const row = (s, i, drag) => (
    <ItemRow key={s.id} drag={qq ? null : drag} title={s.label} sub={s.url}
      badge={noLink(s) ? <span className="badge warn">chybí odkaz</span> : null}
      webUrl={(s.url && s.url !== '#') ? s.url : null}
      onEdit={() => setEdit(s)} onDelete={() => del(s)} />
  );
  return (
    <div>
      <div className="syne" style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Obsah webu</div>
      <div className="toolbar" style={{ marginBottom: 20 }}>
        <button className="btn btn-ghost" onClick={() => setCfg(true)}>⚙️ Kontakt & statistiky</button>
        <button className="btn btn-ghost" onClick={() => setStrings(true)}>📝 Hlavní texty</button>
        <button className="btn btn-ghost" onClick={() => setBlog(true)}>🗓 Deník buildu</button>
        <button className="btn btn-ghost" onClick={() => setCmp(true)}>⚖️ Srovnání appek</button>
      </div>
      <div className="syne" style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 10px' }}>Sociální sítě</div>
      <div className="toolbar">
        <AddBtn onClick={() => setEdit(null)} label="Nová síť" />
        <input className="search" placeholder="Hledat síť…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {qq
        ? <div className="list">{socials.map((s) => row(s))}</div>
        : <DragList items={socials} getKey={(s) => s.id} renderRow={row}
            onReorder={(next) => persistOrder('socials', next, notify).then(reload)} />}
      {edit !== undefined && <SocialForm initial={edit} notify={notify}
        onClose={() => setEdit(undefined)} onSaved={() => { setEdit(undefined); reload(); }} />}
      {cfg && <ConfigForm config={data.config} notify={notify}
        onClose={() => setCfg(false)} onSaved={() => { setCfg(false); reload(); }} />}
      {strings && <StringsEditor config={data.config} notify={notify}
        onClose={() => setStrings(false)} onSaved={() => { setStrings(false); reload(); }} />}
      {blog && <BuildLogEditor config={data.config} notify={notify}
        onClose={() => setBlog(false)} onSaved={() => { setBlog(false); reload(); }} />}
      {cmp && <ComparisonEditor config={data.config} apps={data.apps} notify={notify}
        onClose={() => setCmp(false)} onSaved={() => { setCmp(false); reload(); }} />}
    </div>
  );
}

/* ---------------- overview / stats ---------------- */
function fmtBytes(b) {
  if (!b) return '0 MB';
  var mb = b / 1048576;
  return (mb >= 100 ? Math.round(mb) : mb.toFixed(1)) + ' MB';
}
function totalDurationStr(tracks) {
  var s = 0;
  tracks.forEach(function (t) {
    if (t.duration) { var p = String(t.duration).split(':'); if (p.length === 2) { s += (parseInt(p[0], 10) || 0) * 60 + (parseInt(p[1], 10) || 0); } }
  });
  var h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
  return s ? (h ? (h + ' h ' + m + ' min') : (m + ' min')) : '0 min';
}
function StatCard({ num, lbl, sub }) {
  return <div className="stat"><div className="num">{num}</div><div className="lbl">{lbl}</div>{sub ? <div className="sub2">{sub}</div> : null}</div>;
}
function OverviewTab({ data, goTab }) {
  const [storage, setStorage] = useState(null);
  useEffect(() => {
    sbReq('POST', 'rpc/storage_usage').then(function (rows) {
      var bytes = 0, files = 0, audio = 0, images = 0, binaries = 0;
      (rows || []).forEach(function (r) {
        var b = Number(r.bytes) || 0; bytes += b; files += Number(r.files) || 0;
        if (r.bucket === 'audio') audio = b;
        if (r.bucket === 'images') images = b;
        if (r.bucket === 'binaries') binaries = b;
      });
      setStorage({ bytes: bytes, files: files, audio: audio, images: images, binaries: binaries });
    }).catch(function () { setStorage({ err: true }); });
  }, []);
  const t = data.tracks, al = data.albums, ap = data.apps, so = data.socials;
  const withAudio = t.filter(function (x) { return x.audio_url; }).length;
  const noAudio = t.length - withAudio;
  const withLyrics = t.filter(function (x) { return x.lyrics_cs || x.lyrics_en; }).length;
  const totalPlays = t.reduce(function (s, x) { return s + (Number(x.plays) || 0); }, 0);
  const topTrack = t.reduce(function (best, x) { return (Number(x.plays) || 0) > (Number(best && best.plays) || 0) ? x : best; }, null);
  const totalTrackLikes = t.reduce(function (s, x) { return s + (Number(x.likes) || 0); }, 0);
  const topLikedTrack = t.reduce(function (best, x) { return (Number(x.likes) || 0) > (Number(best && best.likes) || 0) ? x : best; }, null);
  const pwa = ap.filter(function (x) { return x.platform === 'PWA'; }).length;
  const android = ap.length - pwa;
  const appNoLink = ap.filter(function (x) { return !x.link || x.link === '#'; }).length;
  const socNoLink = so.filter(function (x) { return !x.url || x.url === '#'; }).length;
  const totalAppLikes = ap.reduce(function (s, x) { return s + (Number(x.likes) || 0); }, 0);
  const topLikedApp = ap.reduce(function (best, x) { return (Number(x.likes) || 0) > (Number(best && best.likes) || 0) ? x : best; }, null);
  const FREE = 1024 * 1048576;
  const pct = storage && !storage.err ? Math.min(100, Math.round(storage.bytes / FREE * 100)) : 0;
  return (
    <div>
      <div className="sectionlabel">Hudba</div>
      <div className="statgrid">
        <StatCard num={t.length} lbl="skladeb" sub={withAudio + ' s audiem · ' + noAudio + ' bez'} />
        <StatCard num={totalDurationStr(t)} lbl="celková délka" />
        <StatCard num={al.length} lbl="alb" />
        <StatCard num={withLyrics} lbl="skladeb s textem" />
        <StatCard num={totalPlays.toLocaleString('cs')} lbl="přehrání celkem" sub={topTrack && totalPlays > 0 ? ('nejvíc: ' + topTrack.title + ' (' + topTrack.plays + '×)') : 'zatím žádná'} />
        <StatCard num={totalTrackLikes.toLocaleString('cs')} lbl="lajků celkem" sub={topLikedTrack && totalTrackLikes > 0 ? ('nejvíc: ' + topLikedTrack.title + ' (' + topLikedTrack.likes + '❤️)') : 'zatím žádné'} />
      </div>
      <div className="sectionlabel">Aplikace & sítě</div>
      <div className="statgrid">
        <StatCard num={ap.length} lbl="aplikací" sub={pwa + '× PWA · ' + android + '× Android'} />
        <StatCard num={ap.length - appNoLink} lbl="appek s odkazem" sub={appNoLink ? (appNoLink + ' bez odkazu') : 'všechny s odkazem'} />
        <StatCard num={so.length} lbl="sociálních sítí" sub={socNoLink ? (socNoLink + ' bez odkazu') : 'všechny s odkazem'} />
        <StatCard num={totalAppLikes.toLocaleString('cs')} lbl="lajků celkem" sub={topLikedApp && totalAppLikes > 0 ? ('nejvíc: ' + topLikedApp.name + ' (' + topLikedApp.likes + '❤️)') : 'zatím žádné'} />
      </div>
      <div className="sectionlabel">Úložiště (free ~1 GB)</div>
      <div className="stat" style={{ marginBottom: 20 }}>
        <div className="num">{storage ? (storage.err ? '—' : fmtBytes(storage.bytes)) : '…'}</div>
        <div className="lbl">{storage && !storage.err ? (storage.files + ' souborů · mp3 ' + fmtBytes(storage.audio) + ' · obrázky ' + fmtBytes(storage.images) + (storage.binaries ? (' · soubory ' + fmtBytes(storage.binaries)) : '')) : 'využité místo'}</div>
        {storage && !storage.err && <div className="bar"><i style={{ width: Math.max(2, pct) + '%' }} /></div>}
        {storage && !storage.err && <div className="sub2" style={{ marginTop: 6 }}>{pct}% z ~1 GB</div>}
      </div>
      <div className="sectionlabel">K dokončení</div>
      {noAudio > 0
        ? <div className="todo" onClick={() => goTab('tracks')}>🎵 {noAudio} skladeb ještě nemá audio →</div>
        : <div className="todo done">✅ Všechny skladby mají audio</div>}
      {appNoLink > 0
        ? <div className="todo" onClick={() => goTab('apps')}>🔗 {appNoLink} aplikací nemá reálný odkaz →</div>
        : <div className="todo done">✅ Všechny aplikace mají odkaz</div>}
      {socNoLink > 0
        ? <div className="todo" onClick={() => goTab('texts')}>🔗 {socNoLink} sociálních sítí nemá odkaz →</div>
        : <div className="todo done">✅ Všechny sítě mají odkaz</div>}
    </div>
  );
}

/* ---------------- analytics (GoatCounter) ---------------- */
const GOATCOUNTER = 'https://jendaweb.goatcounter.com';
function AnalyticsTab() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Živá návštěvnost z GoatCounter — soukromí-friendly, bez cookies. Data se sbírají od nasazení měření.</div>
        <a className="btn btn-ghost btn-sm" href={GOATCOUNTER} target="_blank" rel="noopener">Otevřít plný dashboard ↗</a>
      </div>
      <iframe src={GOATCOUNTER} title="Návštěvnost" loading="lazy"
        style={{ width: '100%', height: 1600, border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: 'var(--bg2)' }} />
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
        Když je rámeček prázdný / přihlašovací: v GoatCounter → Settings nastav „Dashboard viewable by" na public a do „Sites that can embed GoatCounter" přidej doménu webu.
      </div>
    </div>
  );
}

/* ---------------- admin shell ---------------- */
const TABS = [['overview', 'Přehled'], ['tracks', 'Skladby'], ['albums', 'Alba'], ['apps', 'Aplikace'], ['texts', 'Texty & odkazy'], ['analytics', 'Návštěvnost']];

function AdminApp({ session, onLogout }) {
  const [tab, setTab] = useState('overview');
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
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => downloadBackup(data)} disabled={!data} title="Stáhnout zálohu obsahu (JSON)">⬇ Záloha</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setPw(true)}>Změnit heslo</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}>Odhlásit</button>
        </div>
      </div>

      <div className="tabs">
        {TABS.map(([k, label]) => {
          const n = data ? { tracks: data.tracks.length, albums: data.albums.length, apps: data.apps.length, texts: data.socials.length }[k] : null;
          return <button key={k} className={'tab' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{label}{n != null ? <span className="tabcount"> {n}</span> : ''}</button>;
        })}
      </div>

      {err && <div className="toast err" style={{ position: 'static', transform: 'none', marginBottom: 14 }}>{err} <button className="btn btn-ghost btn-sm" onClick={load} style={{ marginLeft: 8 }}>Zkusit znovu</button></div>}
      {!data && !err && <div style={{ color: 'var(--muted)' }}><span className="spin" style={{ borderTopColor: 'var(--a1)' }} /> Načítám…</div>}

      {data && tab === 'overview' && <OverviewTab data={data} goTab={setTab} />}
      {data && tab === 'tracks' && <TracksTab data={data} reload={load} notify={notify} />}
      {data && tab === 'albums' && <AlbumsTab data={data} reload={load} notify={notify} />}
      {data && tab === 'apps' && <AppsTab data={data} reload={load} notify={notify} />}
      {data && tab === 'texts' && <TextsTab data={data} reload={load} notify={notify} />}
      {tab === 'analytics' && <AnalyticsTab />}

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
