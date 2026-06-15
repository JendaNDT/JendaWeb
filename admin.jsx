// admin.jsx — JendaWeb admin: přihlášení přes Supabase Auth (plain fetch, konzistentní s fází 3).
// Fáze 4 = login shell + dashboard placeholder. Formuláře a upload přijdou ve fázi 5.
const { useState, useEffect } = React;

const SUPABASE_URL = 'https://semdgbaearwhkhulkyts.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlbWRnYmFlYXJ3aGtodWxreXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0ODUzNzAsImV4cCI6MjA5NzA2MTM3MH0.5X4X-FVXlwukKWOlx3kIqazaBBeJJMCNMiEmdNPM8lk';
const SESSION_KEY = 'jw_admin_session';

// ---- session helpers ----
function loadSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (s && s.expires_at && s.expires_at * 1000 > Date.now()) return s;
  } catch (e) {}
  return null;
}
function saveSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {} }
function clearSession() { try { localStorage.removeItem(SESSION_KEY); } catch (e) {} }

async function apiLogin(email, password) {
  const r = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: password }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = data.error_description || data.msg || data.error || ('Přihlášení selhalo (' + r.status + ')');
    throw new Error(msg);
  }
  return data; // { access_token, refresh_token, expires_in, expires_at, user, ... }
}
async function apiLogout(token) {
  try {
    await fetch(SUPABASE_URL + '/auth/v1/logout', {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + token },
    });
  } catch (e) {}
}

// ---- UI ----
const wrap = { width: '100%', maxWidth: 420, margin: '0 auto', padding: '0 20px' };

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const s = await apiLogin(email.trim(), password);
      saveSession(s);
      onLogin(s);
    } catch (ex) {
      setErr(ex.message || 'Něco se pokazilo.');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ ...wrap, marginTop: '16vh' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div className="syne" style={{ fontSize: 30, fontWeight: 800,
          background: 'linear-gradient(120deg, var(--a1), var(--a2))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>JendaWeb</div>
        <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Administrace obsahu</div>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12,
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 22 }}>
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>E-mail
          <input type="email" autoComplete="username" required value={email}
            onChange={e => setEmail(e.target.value)} style={{ marginTop: 6 }} placeholder="ty@email.cz" />
        </label>
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>Heslo
          <input type="password" autoComplete="current-password" required value={password}
            onChange={e => setPassword(e.target.value)} style={{ marginTop: 6 }} placeholder="••••••••" />
        </label>
        {err && <div style={{ color: 'var(--err)', fontSize: 13 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{
          marginTop: 4, padding: '13px 16px', borderRadius: 'var(--r-sm)', fontWeight: 700, fontSize: 15,
          color: '#1a1008', background: busy ? 'var(--muted)' : 'linear-gradient(120deg, var(--a1), var(--a2))',
          opacity: busy ? 0.7 : 1 }}>
          {busy ? 'Přihlašuji…' : 'Přihlásit se'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 18 }}>
        <a href="/" style={{ fontSize: 13, color: 'var(--muted)' }}>← zpět na web</a>
      </div>
    </div>
  );
}

function Dashboard({ session, onLogout }) {
  const email = (session.user && session.user.email) || 'admin';
  const sections = [
    ['Skladby', 'Přidat / upravit skladby, nahrát mp3, texty'],
    ['Alba', 'Názvy, žánry, roky, barvy gradientu'],
    ['Aplikace', 'Názvy, platforma, odkazy, ikony'],
    ['Texty & odkazy', 'Sociální sítě, kontakt, statistiky'],
  ];
  return (
    <div style={{ ...wrap, maxWidth: 560, marginTop: '8vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div className="syne" style={{ fontSize: 22, fontWeight: 800 }}>Administrace</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>Přihlášen: {email}</div>
        </div>
        <button onClick={onLogout} style={{ padding: '9px 14px', borderRadius: 'var(--r-sm)',
          border: '1px solid var(--border)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Odhlásit</button>
      </div>

      <div style={{ padding: '12px 14px', borderRadius: 'var(--r-sm)', fontSize: 13.5,
        background: 'color-mix(in srgb, var(--ok) 10%, transparent)',
        border: '1px solid color-mix(in srgb, var(--ok) 35%, transparent)', color: 'var(--text)', marginBottom: 20 }}>
        ✅ Přihlášení funguje. Formuláře a nahrávání souborů přibydou v další fázi.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {sections.map(([title, desc]) => (
          <div key={title} style={{ padding: 16, borderRadius: 'var(--r-md)', background: 'var(--card)',
            border: '1px solid var(--border)', opacity: 0.85 }}>
            <div className="syne" style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{desc}</div>
            <div style={{ marginTop: 10, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: 'var(--a2)' }}>brzy</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(loadSession);

  const handleLogout = async () => {
    if (session && session.access_token) await apiLogout(session.access_token);
    clearSession();
    setSession(null);
  };

  return session
    ? <Dashboard session={session} onLogout={handleLogout} />
    : <LoginView onLogin={setSession} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
