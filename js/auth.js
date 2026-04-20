// ─────────────────────────────────────────────────────────────
// auth.js — Login/Logout, sessione, token Supabase
//
// Estratto da core.js (Step B2 piano qualità).
// Caricato in index.html DOPO db.js, così può usare la facade db.auth.*
// senza il workaround introdotto al Step 4c (vedi commit 20b5573).
//
// Dipendenze runtime (globali da core.js + db.js):
//   - supa, SUPA_KEY (core.js)
//   - db.auth, db.profiles (db.js)
//   - store (store.js)
//   - showApp() (core.js) — invocata dopo profilo caricato
//   - toast (core.js)
// ─────────────────────────────────────────────────────────────

// Enter sul campo password → submit login
document.getElementById('l-pass').addEventListener('keydown', e => {
  if (e.key === 'Enter') doLogin();
});

async function doLogin() {
  const email = document.getElementById('l-email').value.trim();
  const pass = document.getElementById('l-pass').value;
  const btn = document.getElementById('l-btn');
  const err = document.getElementById('l-err');
  err.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Accesso...';
  try {
    const data = await db.auth.signIn(email, pass);
    await onLogin(data.user);
  } catch(e) {
    err.textContent = 'Email o password errati.';
    err.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Accedi';
  }
}

async function onLogin(user) {
  let profile = null;
  try { profile = await db.profiles.get(user.id); } catch(e) { /* profile resta null */ }
  if (!profile) {
    const err = document.getElementById('login-err');
    if (err) { err.textContent = 'Profilo utente non trovato. Contatta un amministratore.'; err.style.display = 'block'; }
    return;
  }
  store.set('user.current', { ...user, profile });
  localStorage.setItem('aw_session', JSON.stringify({ user, profile }));
  await showApp();
}

async function doLogout() {
  await db.auth.signOut();
  localStorage.removeItem('aw_session');
  store.set('user.current', null);
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('user-bar').style.display = 'none';
  document.body.classList.remove('logged-in');
  const lBtn = document.getElementById('l-btn');
  if (lBtn) { lBtn.disabled = false; lBtn.textContent = 'Accedi'; }
  const lErr = document.getElementById('l-err');
  if (lErr) lErr.style.display = 'none';
  // Nascondi bottoni sidebar ruolo-dipendenti
  ['sb-btn-admin','sb-btn-gestione-db','sb-btn-liste','btn-data-ultima','btn-data-ultima-m'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  // Nascondi home e tutte le sezioni
  ['home-section','verifica-section','anag-section','tabella-section'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
}

async function checkSession() {
  // Ora possiamo usare db.auth direttamente: auth.js è caricato DOPO db.js.
  // (Il workaround supa.auth.getSession() di Step 4c non serve più.)
  const session = await db.auth.getSession();
  if (session) {
    await onLogin(session.user);
    return;
  }
  const saved = localStorage.getItem('aw_session');
  if (saved) {
    try {
      const { user, profile } = JSON.parse(saved);
      if (user && profile) {
        store.set('user.current', { ...user, profile });
        await showApp();
        return;
      }
    } catch(e) {}
  }
}

// ── Helpers token (usati da fetch REST in db.js) ─────────────
async function supaToken() {
  const { data: { session } } = await supa.auth.getSession();
  return session?.access_token;
}

function supaHdrs(token) {
  return {
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

// Boot: ripristina sessione esistente se presente
checkSession();
