// ─────────────────────────────────────────────────────────────
// sync.js — Auto-save e stato di sincronizzazione
//
// Estratto da core.js (Step B3 piano qualità).
// Caricato in index.html DOPO db.js e auth.js: può usare
// db.schede.*, db.sessioni.* direttamente.
//
// Dipendenze runtime (globali da store.js / core.js / db.js):
//   - store (store.js)
//   - db.schede, db.sessioni (db.js)
//   - currentSessionId, currentSessionTitle, saved, currentUser (core.js)
//     ← verranno spostati in store.session.* allo Step B4
//   - attesiSet(), canEditSession() (core.js)
// ─────────────────────────────────────────────────────────────

let syncPending = false;        // ci sono modifiche da sincronizzare
let syncTimer   = null;         // timer auto-save

// ── Helpers raccolta payload per tipo ────────────────────────
function collectVSEFromRec(rec) {
  const keys = ['data','note','ten','tdp','frq','fdp','pot','pdp','mar','fud','fur',
    'cls','cdp','pat','pad','fnz','def','spi','smo','msp','cav','icv','isp','int',
    'pdc','icn','prc','icd','mus','mse','nag','clm','tms','cor','trl','trm','pnl',
    'pnm','pil','pim','pbl','pbm','ibl','ibm','pcl','pcm','icl','icm','giu','vt',
    'vd','mot','str','nrs','ver','vrc','sct','ris_inv','ris_pa'];
  return Object.fromEntries(keys.filter(k => rec[k] != null && rec[k] !== '').map(k => [k, rec[k]]));
}
function collectMPFromRec(rec) {
  const keys = ['mp_data','mp_note','mp_tecnico','mp_data2'];
  for (let i=1;i<=19;i++) keys.push('mp'+i);
  return Object.fromEntries(keys.filter(k => rec[k] != null && rec[k] !== '').map(k => [k, rec[k]]));
}
function collectVSPFromRec(rec) {
  return Object.fromEntries(
    Object.entries(rec).filter(([k,v]) => k.startsWith('vsp_') && v != null && v !== '')
  );
}
function collectCQFromRec(rec) {
  return Object.fromEntries(
    Object.entries(rec).filter(([k,v]) => k.startsWith('cq_') && v != null && v !== '')
  );
}

// ── Sync una scheda su Supabase ───────────────────────────────
async function syncScheda(codice) {
  if (!currentSessionId) return;
  const rec = saved[codice];
  if (!rec) return;

  const payload = {
    sessione_id: currentSessionId,
    codice:      codice,
    dati_vse:    rec.vse_saved ? collectVSEFromRec(rec) : null,
    dati_mp:     rec.mp_saved  ? collectMPFromRec(rec)  : null,
    dati_vsp:    rec.vsp_saved ? collectVSPFromRec(rec) : null,
    dati_cq:     rec.cq_saved  ? collectCQFromRec(rec)  : null,
    vsp_type:    rec.vsp_type || null,
    cq_type:     rec.cq_type  || null,
  };
  try { await db.schede.upsert(payload); }
  catch(e) { console.error('syncScheda fallita:', e); }
}

// ── Sync completa della sessione ─────────────────────────────
async function syncSessionNow() {
  if (!currentSessionId) return;
  syncPending = false;
  store.set('ui.syncStatus', 'syncing');
  const codici = Object.keys(saved);
  for (const cod of codici) {
    await syncScheda(cod);
  }
  // Aggiorna data_aggiornamento della sessione
  try { await db.sessioni.touchAggiornamento(currentSessionId); } catch(e) { console.error('touchAggiornamento:', e); }
  // Salva lista attesi come scheda speciale __attesi__
  if (attesiSet().size > 0) {
    try { await db.schede.upsertAttesi(currentSessionId, [...attesiSet()]); }
    catch(e) { console.error('upsertAttesi:', e); }
  }
  store.set('ui.syncStatus', 'synced');
}

// ── Barra sync ───────────────────────────────────────────────
// Legge lo stato sync dallo store (ui.syncStatus, session.title).
// Chi vuole cambiare lo stato sync usa store.patch('ui', {...}).
function updateSyncBar() {
  const bar   = document.getElementById('sess-sync-bar');
  const dot   = document.getElementById('sync-dot');
  const dotM  = document.getElementById('sync-dot-mobile');
  const label = document.getElementById('sync-label');
  if (!bar) return;
  bar.style.display = 'block';
  const syncStatus  = store.get('ui.syncStatus');
  const storeTitolo = store.get('session.title');
  let cls;
  if (!currentSessionId) {
    cls = 'sess-sync-dot offline';
    if (label) label.textContent = 'Nessuna sessione attiva';
  } else if (syncStatus === 'syncing') {
    cls = 'sess-sync-dot pending';
    if (label) label.textContent = 'Sincronizzazione...';
  } else if (syncStatus === 'synced') {
    cls = 'sess-sync-dot synced';
    const t = storeTitolo || currentSessionTitle || 'Sessione attiva';
    if (label) label.textContent = canEditSession() ? 'Sincronizzato' : t + ' · Sincronizzato';
  } else {
    // 'dirty' | 'idle' con sessione attiva
    cls = 'sess-sync-dot pending';
    const t = storeTitolo || currentSessionTitle || 'Sessione attiva';
    if (label) label.textContent = canEditSession() ? 'Modifiche in attesa' : t + ' · Modifiche in attesa';
  }
  if (dot) dot.className = cls;
  if (dotM) dotM.className = cls;
  // Inline edit row
  const inlineEdit = document.getElementById('sess-inline-edit');
  const canEdit = canEditSession();
  if (inlineEdit) inlineEdit.style.display = canEdit ? 'flex' : 'none';
  // Bottone Salva
  ['btn-salva-sess','btn-salva-sess-m'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=canEdit?'':'none'; });
  // Bottone Chiudi
  const hasSession = !!currentSessionId;
  ['btn-chiudi-sess','btn-chiudi-sess-m'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=hasSession?'':'none'; });
  // Bottoni Aggiorna Anagrafica / Straordinaria
  const hasSaved = hasSession && Object.keys(saved).length > 0;
  ['btn-sync-prog','btn-sync-straord'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=hasSaved?'':'none'; });
  ['btn-sync-prog-m','btn-sync-straord-m'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=hasSaved?'':'none'; });
}

// ── Auto-save: schedula sync 3s dopo l'ultima modifica ────────
function scheduleSync() {
  if (!currentSessionId) return;
  syncPending = true;
  store.set('ui.syncStatus', 'dirty');
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncSessionNow(), 3000);
}

// Iscrive la sync bar allo store — qualunque cambio a ui.* re-renderizza
store.subscribe('ui', () => updateSyncBar());
