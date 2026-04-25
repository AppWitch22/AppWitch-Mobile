// ── ADMIN: pannello admin, gestione DB ──

const PERM_LABELS = {
  verifica:              'Verifica dispositivi',
  sessioni:              'Sessioni proprie',
  sessioni_altrui:       'Sessioni di altri',
  export_excel:          'Esporta Excel',
  archivio_cloud:        'Archivio cloud',
  preset_use:            'Usa preset',
  preset_edit_personal:  'Preset personali',
  preset_edit_default:   'Preset di default',
  anagrafica_read:       'Anagrafica (lettura)',
  anagrafica_write:      'Anagrafica (scrittura)',
  dispositivo_nuovo:     'Nuovo dispositivo',
  dispositivo_elimina:   'Elimina dispositivo',
  aggiornamento_massivo: 'Aggiornamento massivo',
  import_excel:          'Importa da Excel',
  lookup_write:          'Gestione liste lookup',
};

const DEFAULT_PERMISSIONS = {
  tecnico:        { verifica:true,  sessioni:true,  sessioni_altrui:false, export_excel:true,  archivio_cloud:true,  preset_use:true,  preset_edit_personal:true,  preset_edit_default:false, anagrafica_read:true,  anagrafica_write:false, dispositivo_nuovo:false, dispositivo_elimina:false, aggiornamento_massivo:false, import_excel:false, lookup_write:false },
  responsabile:   { verifica:true,  sessioni:true,  sessioni_altrui:true,  export_excel:true,  archivio_cloud:true,  preset_use:true,  preset_edit_personal:false, preset_edit_default:true,  anagrafica_read:true,  anagrafica_write:true,  dispositivo_nuovo:true,  dispositivo_elimina:true,  aggiornamento_massivo:true,  import_excel:true,  lookup_write:true  },
  amministrativo: { verifica:false, sessioni:false, sessioni_altrui:false, export_excel:false, archivio_cloud:false, preset_use:false, preset_edit_personal:false, preset_edit_default:false, anagrafica_read:true,  anagrafica_write:true,  dispositivo_nuovo:true,  dispositivo_elimina:true,  aggiornamento_massivo:true,  import_excel:true,  lookup_write:false },
  admin:          { verifica:true,  sessioni:true,  sessioni_altrui:true,  export_excel:true,  archivio_cloud:true,  preset_use:true,  preset_edit_personal:true,  preset_edit_default:true,  anagrafica_read:true,  anagrafica_write:true,  dispositivo_nuovo:true,  dispositivo_elimina:true,  aggiornamento_massivo:true,  import_excel:true,  lookup_write:true  },
};

function renderPermGrid(perms, idPrefix, disabled) {
  const p = perms || {};
  return Object.entries(PERM_LABELS).map(([key, label]) => `
    <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:${disabled?'default':'pointer'};color:var(--text);user-select:none">
      <input type="checkbox" id="${idPrefix}_${key}" ${p[key]===true?'checked':''} ${disabled?'disabled':''}>
      ${label}
    </label>`).join('');
}

function readPermGrid(idPrefix) {
  const perms = {};
  Object.keys(PERM_LABELS).forEach(key => {
    const el = document.getElementById(`${idPrefix}_${key}`);
    perms[key] = el ? el.checked : false;
  });
  return perms;
}

async function adminSavePermissions(userId, permissions) {
  const { error } = await supa.rpc('admin_update_permissions', {
    p_user_id: userId,
    p_permissions: permissions
  });
  if (error) console.error('[adminSavePermissions] RPC error:', error);
  return !error;
}

async function openAdmin() {
  if (!currentUser || currentUser.profile?.role !== 'admin') return;
  let modal = document.getElementById('admin-modal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', `
    <div id="admin-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">
      <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:600px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div style="font-size:16px;font-weight:600">Gestione Utenti</div>
          <button onclick="document.getElementById('admin-modal').remove()" style="padding:4px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);cursor:pointer">✕</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
          <input id="adm-email" type="email" placeholder="Email" style="flex:1;min-width:160px;padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
          <input id="adm-name" type="text" placeholder="Nome completo" style="flex:1;min-width:160px;padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
          <input id="adm-pass" type="password" placeholder="Password" style="flex:1;min-width:140px;padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
          <select id="adm-role" onchange="adminRoleChanged()" style="padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
            <option value="tecnico">Tecnico</option>
            <option value="responsabile">Responsabile</option>
            <option value="amministrativo">Amministrativo</option>
            <option value="admin">Admin</option>
          </select>
          <select id="adm-asl" style="padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
  <option value="ASL Benevento">ASL Benevento</option>
  <option value="ASL Avellino">ASL Avellino</option>
  <option value="ASL Strega">ASL Strega</option>
</select>
          <button onclick="adminCreate()" style="padding:8px 14px;font-size:13px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">+ Crea</button>
        </div>
        <div style="margin-bottom:12px;padding:10px 12px;background:var(--bg3);border:1px solid var(--border);border-radius:var(--rad)">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);margin-bottom:8px;display:flex;justify-content:space-between">
            Permessi <span style="font-weight:400">Pre-compilati dal ruolo — modificabili</span>
          </div>
          <div id="adm-perm-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:5px 16px"></div>
        </div>
        <div id="adm-msg" style="display:none;padding:8px 12px;border-radius:var(--rad);font-size:13px;margin-bottom:12px"></div>
        <div id="adm-list" style="font-size:13px;color:var(--text2)">Caricamento...</div>
      </div>
    </div>`);
    setTimeout(adminRoleChanged, 0);
  } else {
    modal.style.display = 'flex';
  }
  adminLoadUsers();
}

async function adminCall(payload) {
  try { return await db.admin.manageUsers(payload); }
  catch (e) { console.error('adminCall error:', e); return { error: e.message }; }
}

async function adminLoadUsers() {
  const list = document.getElementById('adm-list');
  if (!list) return;
  list.innerHTML = 'Caricamento...';
  const users = await adminCall({ action: 'list' });
  if (!Array.isArray(users)) { list.innerHTML = 'Errore caricamento utenti.'; return; }
  if (users.length === 0) { list.innerHTML = 'Nessun utente.'; return; }
  list.innerHTML = users.map(u => {
    const role = u.profile?.role || 'tecnico';
    const isAdmin = role === 'admin';
    const perms = (u.profile?.permissions && Object.keys(u.profile.permissions).length)
      ? u.profile.permissions
      : (DEFAULT_PERMISSIONS[role] || {});
    return `
    <div style="border:1px solid var(--border);border-radius:var(--rad);margin-bottom:6px;overflow:hidden">
      <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;flex-wrap:wrap">
        <div style="flex:1;min-width:160px">
          <div style="font-weight:500;color:var(--text)">${u.profile?.full_name || '—'}</div>
          <div style="font-size:11px;color:var(--text3)">${u.email}</div>
        </div>
        <select onchange="adminUpdateRole('${u.id}', this.value)" style="padding:4px 8px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:12px">
          <option value="tecnico"        ${role==='tecnico'?'selected':''}>Tecnico</option>
          <option value="responsabile"   ${role==='responsabile'?'selected':''}>Responsabile</option>
          <option value="amministrativo" ${role==='amministrativo'?'selected':''}>Amministrativo</option>
          <option value="admin"          ${role==='admin'?'selected':''}>Admin</option>
        </select>
        <button onclick="adminTogglePermissions('${u.id}')" style="padding:4px 10px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text2);cursor:pointer">⚙ Permessi</button>
        <button onclick="adminBan('${u.id}', ${u.banned})" style="padding:4px 10px;font-size:12px;border:1px solid ${u.banned ? 'var(--ok)' : 'var(--warn)'};border-radius:var(--rad);background:var(--bg);color:${u.banned ? 'var(--ok)' : 'var(--warn)'};cursor:pointer">
          ${u.banned ? 'Riabilita' : 'Disabilita'}
        </button>
        <button onclick="adminDelete('${u.id}', '${u.email}')" style="padding:4px 10px;font-size:12px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">Elimina</button>
      </div>
      <div id="adm-perms-${u.id}" style="display:none;padding:10px 12px;border-top:1px solid var(--border);background:var(--bg3)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px 16px;margin-bottom:10px">
          ${renderPermGrid(perms, 'adm-up-' + u.id, isAdmin)}
        </div>
        ${isAdmin ? '<div style="font-size:11px;color:var(--text3)">L\'admin ha sempre tutti i permessi attivi.</div>' : `<button onclick="adminSaveUserPermissions('${u.id}')" style="padding:5px 14px;font-size:12px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">Salva permessi</button>`}
      </div>
    </div>`;
  }).join('');
}

async function adminCreate() {
  const email = document.getElementById('adm-email').value.trim();
  const fullName = document.getElementById('adm-name').value.trim();
  const password = document.getElementById('adm-pass').value;
 const role = document.getElementById('adm-role').value;
const asl = document.getElementById('adm-asl').value;
  const msg = document.getElementById('adm-msg');
  if (!email || !fullName || !password) {
    adminMsg('Compila tutti i campi.', false); return;
  }
  const res = await adminCall({ action: 'create', email, fullName, password, role, asl });
  if (res.error) { adminMsg('Errore: ' + res.error, false); return; }
  // Salva permessi personalizzati sull'utente appena creato
  const permissions = readPermGrid('adm-perm');
  const users = await adminCall({ action: 'list' });
  const newUser = Array.isArray(users) ? users.find(u => u.email === email) : null;
  if (newUser) await adminSavePermissions(newUser.id, permissions);
  adminMsg('Utente creato con successo!', true);
  document.getElementById('adm-email').value = '';
  document.getElementById('adm-name').value = '';
  document.getElementById('adm-pass').value = '';
  adminLoadUsers();
}

async function adminUpdateRole(userId, role) {
  await adminCall({ action: 'update_role', userId, role });
  adminMsg('Ruolo aggiornato.', true);
}

async function adminBan(userId, isBanned) {
  await adminCall({ action: isBanned ? 'unban' : 'ban', userId });
  adminMsg(isBanned ? 'Utente riabilitato.' : 'Utente disabilitato.', true);
  adminLoadUsers();
}

async function adminDelete(userId, email) {
  if (!confirm('Eliminare definitivamente ' + email + '?')) return;
  await adminCall({ action: 'delete', userId });
  adminMsg('Utente eliminato.', true);
  adminLoadUsers();
}

function adminMsg(text, ok) {
  const msg = document.getElementById('adm-msg');
  if (!msg) return;
  msg.textContent = text;
  msg.style.display = 'block';
  msg.style.background = ok ? 'var(--ok-bg)' : 'var(--ko-bg)';
  msg.style.color = ok ? 'var(--ok)' : 'var(--ko)';
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

function adminRoleChanged() {
  const role = document.getElementById('adm-role')?.value || 'tecnico';
  const grid = document.getElementById('adm-perm-grid');
  if (!grid) return;
  const isAdmin = role === 'admin';
  const perms = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.tecnico;
  grid.innerHTML = renderPermGrid(perms, 'adm-perm', isAdmin);
  if (isAdmin) {
    grid.insertAdjacentHTML('beforeend', '<div style="grid-column:1/-1;font-size:11px;color:var(--text3);margin-top:4px">L\'admin ha sempre tutti i permessi attivi.</div>');
  }
}

function adminTogglePermissions(userId) {
  const panel = document.getElementById('adm-perms-' + userId);
  if (!panel) return;
  panel.style.display = panel.style.display === 'none' ? '' : 'none';
}

async function adminSaveUserPermissions(userId) {
  const permissions = readPermGrid('adm-up-' + userId);
  const ok = await adminSavePermissions(userId, permissions);
  adminMsg(ok ? 'Permessi salvati.' : 'Errore salvataggio permessi.', ok);
}

// ── GESTIONE DB ──────────────────────────────────────────────
function openGestioneDB() {
  if (!currentUser || currentUser.profile?.role !== 'admin') return;
  const asl = currentUser.profile?.asl || 'ASL Benevento';
  let modal = document.getElementById('gdb-modal');
  if (modal) { modal.style.display = 'flex'; return; }
  document.body.insertAdjacentHTML('beforeend', `
  <div id="gdb-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">
    <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:560px;padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="font-size:16px;font-weight:600">Gestione Database — ${asl}</div>
        <button onclick="document.getElementById('gdb-modal').remove()" style="padding:4px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);cursor:pointer">✕</button>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        <!-- EXPORT -->
        <div style="border:1px solid var(--border);border-radius:var(--rad);padding:14px">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px;color:var(--text2)">📤 Export database</div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:10px">Scarica l'intero database dispositivi come file Excel.</div>
          <button onclick="exportDatabaseDispositivi()" style="padding:8px 16px;font-size:13px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">⬇ Scarica Excel</button>
        </div>

        <!-- IMPORT -->
        <div style="border:1px solid var(--border);border-radius:var(--rad);padding:14px">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px;color:var(--text2)">📥 Import database</div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:4px">Carica un file Excel per <strong>sostituire completamente</strong> il database.</div>
          <div style="font-size:11px;color:var(--ko);margin-bottom:10px">⚠️ Tutti i dati esistenti verranno eliminati e sostituiti.</div>
          <label style="display:inline-block;padding:8px 16px;font-size:13px;font-weight:600;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--rad);cursor:pointer;color:var(--text)">
            📂 Seleziona file Excel
            <input type="file" accept=".xlsx,.xls" onchange="importDatabaseDispositivi(this)" style="display:none">
          </label>
        </div>

        <!-- IMPORT STORICO -->
        <div style="border:1px solid var(--border);border-radius:var(--rad);padding:14px">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px;color:var(--text2)">📋 Import storico verifiche</div>
          <div style="font-size:12px;color:var(--text3);margin-bottom:10px">Carica il file Excel con lo storico verifiche 2021-2024. I record esistenti non vengono duplicati.</div>
          <label style="display:inline-block;padding:8px 16px;font-size:13px;font-weight:600;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--rad);cursor:pointer;color:var(--text)">
            📂 Seleziona file storico
            <input type="file" accept=".xlsx,.xls" onchange="importStorico(this)" style="display:none">
          </label>
        </div>

        <!-- PROGRESS -->
        <div id="gdb-progress" style="display:none;border:1px solid var(--border);border-radius:var(--rad);padding:14px">
          <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text2)" id="gdb-prog-label">In corso...</div>
          <div style="background:var(--bg3);border-radius:4px;height:8px;overflow:hidden;margin-bottom:8px">
            <div id="gdb-prog-bar" style="height:100%;background:var(--info);width:0%;transition:width .3s"></div>
          </div>
          <div style="font-size:12px;color:var(--text3)" id="gdb-prog-detail"></div>
        </div>
      </div>
    </div>
  </div>`);
}

async function exportDatabaseDispositivi() {
  if (typeof XLSX === 'undefined') {
    toast('Caricamento libreria Excel...', 'warn');
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = () => exportDatabaseDispositivi();
    document.head.appendChild(s); return;
  }
  const aslKey = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
  toast('Export in corso...', 'warn');

  let all;
  try {
    all = await db.dispositivi.listAll();
  } catch (e) {
    toast('Errore export: ' + (e.status || e.message), 'ko');
    return;
  }
  if (!all.length) { toast('Nessun dato da esportare', 'warn'); return; }

  // Colonne da escludere: auto-gestite da Supabase o legacy non usate dall'app
  const SKIP_EXPORT = new Set(['updated_at',
    'jolly_1_label','jolly_1_value','jolly_2_label','jolly_2_value',
    'jolly_3_label','jolly_3_value','jolly_4_label','jolly_4_value',
    'jolly_5_label','jolly_5_value','jolly_6_label','jolly_6_value',
    'jolly_7_label','jolly_7_value','jolly_8_label','jolly_8_value',
    'jolly_9_label','jolly_9_value','jolly_10_label','jolly_10_value']);
  // Mappa jolly_N → etichetta configurata (es. jolly_1 → "Numero Lotto")
  const jmeta = getJollyMeta();
  const jollyKeyToLabel = {};
  jmeta.forEach((m,i) => { jollyKeyToLabel[`jolly_${i+1}`] = m.label || `Jolly ${i+1}`; });
  const exportRows = all.map(r => {
    const out = {};
    for (const [k, v] of Object.entries(r)) {
      if (SKIP_EXPORT.has(k)) continue;
      const colName = jollyKeyToLabel[k] ?? k;
      // Converti date in formato leggibile "12-mar-2026"
      if (DATE_KEYS.has(k) && v) {
        const iso = _toISODate(String(v));
        out[colName] = iso ? _fmtDateIT(iso) : v;
      } else {
        out[colName] = v;
      }
    }
    return out;
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportRows);
  XLSX.utils.book_append_sheet(wb, ws, aslKey.charAt(0).toUpperCase() + aslKey.slice(1));
  const date = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `dispositivi_${aslKey}_${date}.xlsx`);
  toast(`Export completato: ${all.length} dispositivi`, 'ok');
}

async function importDatabaseDispositivi(input) {
  const file = input.files[0];
  if (!file) return;
  input.value = '';

  if (!confirm(`ATTENZIONE: questa operazione eliminerà tutti i dati esistenti e li sostituirà con il file selezionato.\n\nProcedere?`)) return;

  if (typeof XLSX === 'undefined') {
    toast('Caricamento libreria Excel...', 'warn');
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = () => { toast('Seleziona di nuovo il file', 'warn'); };
    document.head.appendChild(s); return;
  }

  // Mostra progress
  const prog = document.getElementById('gdb-progress');
  const progBar = document.getElementById('gdb-prog-bar');
  const progLabel = document.getElementById('gdb-prog-label');
  const progDetail = document.getElementById('gdb-prog-detail');
  if (prog) prog.style.display = 'block';

  const setProgress = (pct, label, detail) => {
    if (progBar) progBar.style.width = pct + '%';
    if (progLabel) progLabel.textContent = label;
    if (progDetail) progDetail.textContent = detail;
  };

  try {
    // 1. Leggi Excel
    setProgress(0, 'Lettura file...', '');
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array', cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: null, raw: false });
    if (!rows.length) { toast('File vuoto', 'warn'); return; }
    setProgress(5, `Letti ${rows.length} record`, 'Pulizia valori...');

    // Pre-processing date: sostituisce le stringhe formattate di sheet_to_json
    // con ISO YYYY-MM-DD letto direttamente dal valore raw della cella.
    // Risolve l'ambiguità D/M vs M/D (es. "2/8/26" era interpretato come 2-ago
    // invece di 8-feb se la cella era formattata m/d/yy US). Vedi _cellToISO
    // in core.js: usa il seriale numerico quando disponibile, quindi bypass totale
    // del formato di display.
    try {
      const date1904 = !!(wb.Workbook && wb.Workbook.WBProps && wb.Workbook.WBProps.date1904);
      const range = XLSX.utils.decode_range(ws['!ref']);
      // Mappa header testuale → lettera colonna, solo per DATE_KEYS
      const dateColLetters = {};
      for (let c = range.s.c; c <= range.e.c; c++) {
        const hdrAddr = XLSX.utils.encode_cell({ r: range.s.r, c });
        const hdrCell = ws[hdrAddr];
        if (!hdrCell || hdrCell.v == null) continue;
        const key = String(hdrCell.v).trim();
        if (DATE_KEYS.has(key)) dateColLetters[key] = XLSX.utils.encode_col(c);
      }
      // Sostituisci i valori in ogni riga con ISO letto dalla cella raw
      for (let i = 0; i < rows.length; i++) {
        for (const [key, colLetter] of Object.entries(dateColLetters)) {
          const addr = colLetter + (range.s.r + 2 + i);
          rows[i][key] = _cellToISO(ws[addr], date1904);
        }
      }
    } catch (e) {
      console.warn('[import] pre-processing date fallito, fallback al parser stringa:', e);
    }

    // Colonne gestite automaticamente da Supabase — da escludere
    const SKIP_COLS = new Set(['updated_at']);

    // Colonne tecniche valide della tabella dispositivi
    const DB_COLS = new Set([
      'codice','codice_padre','descrizione_classe','costruttore','modello','matricola',
      'presidio','reparto','nuova_area','sede_struttura','stanza','civab','verifiche',
      'proposta_dismissione','dismissione_effettiva','dettagli_stato','manutentore',
      'data_fine_garanzia','periodicita_vse','data_ultima_vse','esito_ultima_vse',
      'data_prossima_vse','periodicita_vsp','data_ultima_vsp','esito_ultima_vsp',
      'data_prossima_vsp','periodicita_cq','data_ultima_cq','esito_ultima_cq',
      'data_prossima_cq','note_programmate','note_inventario','presenze_effettive',
      'cliente','periodicita_mo','data_ultima_mo','esito_ultima_mo','data_prossima_mo',
      'proprieta','fine_service_comodato','forma_presenza','data_collaudo',
      ...Array.from({length:22},(_,i)=>`jolly_${i+1}`)
    ]);

    // Mappa inversa: etichetta jolly → nome colonna tecnico (jolly_N)
    // 1. label configurate nel localStorage
    const jollyLabelToKey = {};
    getJollyMeta().forEach((m,i) => {
      if (m.label) jollyLabelToKey[m.label.toLowerCase()] = `jolly_${i+1}`;
    });
    // 2. pattern default "Jolly N" (case-insensitive)
    const resolveCol = k => {
      if (DB_COLS.has(k)) return k;                          // già nome tecnico
      if (jollyLabelToKey[k.toLowerCase()]) return jollyLabelToKey[k.toLowerCase()]; // label localStorage
      const m = k.match(/^jolly?\s*_?\s*(\d+)$/i);          // jolly_N / Jolly N / jollyN
      if (m) return `jolly_${m[1]}`;
      return DB_COLS.has(k.toLowerCase()) ? k.toLowerCase() : null; // lowercase fallback, null = skip
    };

    // Converte seriale Excel → YYYY-MM-DD
    const xlsxDateToISO = n => {
      const d = new Date(Math.round((n - 25569) * 86400 * 1000));
      return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
    };

    // Pulisci valori: converti date in YYYY-MM-DD, tutto il resto in stringa o null
    const clean = rows.map(r => {
      const obj = {};
      for (let [k, v] of Object.entries(r)) {
        k = resolveCol(k);
        if (!k || SKIP_COLS.has(k)) continue; // colonna sconosciuta o da skippare
        if (v === null || v === undefined || v === '') { obj[k] = null; continue; }
        // Date object (cellDates:true)
        if (v instanceof Date) {
          obj[k] = isNaN(v.getTime()) ? null : v.toISOString().split('T')[0];
          continue;
        }
        const s = String(v).trim();
        if (!s) { obj[k] = null; continue; }
        // Seriale numerico Excel in range date (qualsiasi colonna)
        if (/^\d+$/.test(s)) {
          const n = parseInt(s, 10);
          if (n > 30000 && n < 70000) { obj[k] = xlsxDateToISO(n); continue; }
        }
        // Colonne data: normalizza qualsiasi formato (GG/MM/AAAA, DD-mmm-YYYY, ISO) → ISO
        if (DATE_KEYS.has(k)) {
          const iso = _toISODate(s);
          obj[k] = iso; continue;
        }
        // Codici con zeri iniziali a 7 cifre
        if ((k === 'codice' || k === 'codice_padre') && /^\d+$/.test(s)) {
          obj[k] = s.padStart(7, '0'); continue;
        }
        obj[k] = s;
      }
      return obj;
    });

    // Validazione semantica date: intercetta data_ultima_* future e coppie invertite
    // prima di TRUNCATE (altrimenti import silenzioso di dati corrotti, vedi bug 04-18).
    const _today = new Date(); _today.setHours(0,0,0,0);
    const _pad = n => String(n).padStart(2,'0');
    const _todayISO = `${_today.getFullYear()}-${_pad(_today.getMonth()+1)}-${_pad(_today.getDate())}`;
    const _ULTIMA = ['data_ultima_vse','data_ultima_mo','data_ultima_vsp','data_ultima_cq'];
    const _isoRx = /^\d{4}-\d{2}-\d{2}$/;
    const anomalie = [];
    for (const r of clean) {
      const cod = r.codice || '(senza codice)';
      for (const k of _ULTIMA) {
        const u = r[k];
        if (u && _isoRx.test(u) && u > _todayISO) {
          anomalie.push({ cod, info: `${k} = ${u}`, tipo: 'ultima_futura' });
        }
        const kp = k.replace('_ultima_', '_prossima_');
        const p = r[kp];
        if (u && p && _isoRx.test(u) && _isoRx.test(p) && u > p) {
          anomalie.push({ cod, info: `${k}(${u}) > ${kp}(${p})`, tipo: 'ordine_invertito' });
        }
      }
    }
    if (anomalie.length > 0) {
      const perTipo = anomalie.reduce((a,x) => (a[x.tipo] = (a[x.tipo]||0) + 1, a), {});
      const righe = anomalie.slice(0,8).map(a => `  • ${a.cod} · ${a.info}`).join('\n');
      const msg = [
        `Trovate ${anomalie.length} anomalie nelle date:`,
        ...Object.entries(perTipo).map(([t,n]) => `  - ${t}: ${n}`),
        '',
        'Esempi:',
        righe,
        anomalie.length > 8 ? `  ... e altre ${anomalie.length - 8}` : '',
        '',
        "Procedere comunque con l'import?",
        '(Annulla = raccomandato, correggi il file prima)'
      ].filter(Boolean).join('\n');
      if (!confirm(msg)) {
        setProgress(0, 'Import annullato', `${anomalie.length} anomalie rilevate`);
        toast('Import annullato — correggi il file', 'warn');
        return;
      }
    }

    // 2. Svuota tabella via RPC
    setProgress(10, 'Svuotamento tabella...', '');
    try { await db.dispositivi.truncate(); }
    catch (e) { throw new Error('Truncate fallita: ' + (e.body || e.message), { cause: e }); }

    // 3. Insert a batch (con fallback record-per-record sui chunk falliti)
    const total = clean.length;
    const { inserted, errors } = await db.dispositivi.insertBatch(clean, {
      chunk: 200,
      fallbackPerRecord: true,
      onProgress: (done) => {
        const pct = Math.round(10 + (done / total) * 88);
        setProgress(pct, 'Inserimento...', `${done} / ${total} record`);
      }
    });

    setProgress(98, 'Finalizzazione...', `${inserted} record inseriti${errors ? ', ' + errors + ' errori' : ''}`);

    // Ricarica DB in memoria
    await initDB();

    // Review valori nuovi non ancora in lookup_asl
    if (can('lookup_write')) {
      const diff = _computeImportDiff();
      const tot = Object.values(diff).reduce((s, a) => s + a.length, 0);
      if (tot > 0) {
        _showImportReview(diff, inserted, errors);
        return;
      }
    }

    setProgress(100, 'Import completato!', `${inserted} record inseriti${errors ? ', ' + errors + ' record con errori' : ''}`);
    toast(`Import completato: ${inserted} dispositivi`, errors ? 'warn' : 'ok');

  } catch (e) {
    console.error('Import error:', e);
    setProgress(0, 'Errore', e.message);
    toast('Errore import: ' + e.message, 'ko');
  }
}

// ── Post-import review ─────────────────────────────────────────

function _computeImportDiff() {
  const diff = {};
  for (const [campo, shortKey] of Object.entries(LOOKUP_DB_KEY)) {
    const stored = new Set(window._storedLookups?.[campo] || []);
    for (const d of Object.values(DB || {})) {
      const v = d[shortKey];
      if (v && !stored.has(String(v))) {
        if (!diff[campo]) diff[campo] = new Set();
        diff[campo].add(String(v));
      }
    }
  }
  return Object.fromEntries(Object.entries(diff).map(([k, s]) => [k, [...s].sort()]));
}

function _showImportReview(diff, inserted, errors) {
  document.getElementById('gdb-review')?.remove();
  const progBox = document.getElementById('gdb-progress');
  if (progBox) progBox.style.display = 'none';

  const rows = [];
  const allLabels = { ...LOOKUP_LABELS };
  for (const [campo, vals] of Object.entries(diff)) {
    const label = allLabels[campo] || campo;
    for (const v of vals) {
      rows.push({ campo, label, v });
    }
  }

  const rowsHtml = rows.map((r, i) => {
    const esistenti = [...(window._storedLookups?.[r.campo] || [])].filter(x => x !== r.v).sort();
    const sostOpts = esistenti.map(x => `<option value="${_esc(x)}">${_esc(x)}</option>`).join('');
    return `
    <tr data-ir="${i}" style="border-bottom:1px solid var(--border)">
      <td style="padding:6px 8px;font-size:12px;color:var(--text3);white-space:nowrap">${_esc(r.label)}</td>
      <td style="padding:6px 8px;font-size:13px;color:var(--text);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${_esc(r.v)}">${_esc(r.v)}</td>
      <td style="padding:4px 6px">
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;white-space:nowrap">
          <input type="radio" name="ir-${i}" value="aggiungi" checked onchange="_irToggle(${i})"> Aggiungi
        </label>
      </td>
      <td style="padding:4px 6px">
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;white-space:nowrap">
          <input type="radio" name="ir-${i}" value="ignora" onchange="_irToggle(${i})"> Ignora
        </label>
      </td>
      <td style="padding:4px 6px">
        <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;white-space:nowrap">
          <input type="radio" name="ir-${i}" value="sostituisci" onchange="_irToggle(${i})"> Sostituisci con
        </label>
        <select id="ir-sel-${i}" disabled style="margin-top:2px;width:100%;padding:3px 6px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);opacity:.4">
          <option value="">— scegli —</option>${sostOpts}
        </select>
      </td>
    </tr>`;
  }).join('');

  const panel = document.createElement('div');
  panel.id = 'gdb-review';
  panel.innerHTML = `
    <div style="margin-bottom:12px;font-size:14px;font-weight:600;color:var(--text)">
      Import completato${errors ? ` (${errors} errori)` : ''}.
      Trovati <strong>${rows.length}</strong> valori nuovi non presenti nelle liste.
    </div>
    <div style="margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <button onclick="_irSelectAll('aggiungi')"
        style="padding:5px 12px;font-size:12px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">
        ✓ Aggiungi tutti
      </button>
      <button onclick="_irSelectAll('ignora')"
        style="padding:5px 12px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text2);cursor:pointer">
        Ignora tutti
      </button>
    </div>
    <div style="overflow-x:auto;border:1px solid var(--border);border-radius:var(--rad);margin-bottom:12px;max-height:320px;overflow-y:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:var(--bg3);font-size:11px;color:var(--text3);text-transform:uppercase">
            <th style="padding:6px 8px;text-align:left;font-weight:500">Campo</th>
            <th style="padding:6px 8px;text-align:left;font-weight:500">Valore</th>
            <th colspan="3" style="padding:6px 8px;text-align:left;font-weight:500">Azione</th>
          </tr>
        </thead>
        <tbody id="ir-tbody">${rowsHtml}</tbody>
      </table>
    </div>
    <button id="gdb-review-apply"
      style="width:100%;padding:10px;font-size:14px;font-weight:600;background:var(--ok);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">
      Applica e chiudi
    </button>`;

  // Memorizza i dati delle righe per _applyImportReview
  window._irRows = rows;
  panel.querySelector('#gdb-review-apply').onclick = () => _applyImportReview();

  if (progBox) progBox.after(panel);
  else document.getElementById('gdb-modal')?.querySelector('div')?.appendChild(panel);
}

function _irToggle(i) {
  const sel = document.getElementById(`ir-sel-${i}`);
  if (!sel) return;
  const checked = document.querySelector(`input[name="ir-${i}"]:checked`)?.value;
  sel.disabled = checked !== 'sostituisci';
  sel.style.opacity = checked === 'sostituisci' ? '1' : '.4';
}

function _irSelectAll(azione) {
  const rows = window._irRows || [];
  rows.forEach((_, i) => {
    const radio = document.querySelector(`input[name="ir-${i}"][value="${azione}"]`);
    if (radio) { radio.checked = true; _irToggle(i); }
  });
}

async function _applyImportReview() {
  const rows = window._irRows || [];
  let aggiunti = 0, sostituiti = 0;
  for (let i = 0; i < rows.length; i++) {
    const { campo, v } = rows[i];
    const azione = document.querySelector(`input[name="ir-${i}"]:checked`)?.value || 'aggiungi';
    if (azione === 'aggiungi') {
      await saveLookupValue(campo, v);
      aggiunti++;
    } else if (azione === 'sostituisci') {
      const newV = document.getElementById(`ir-sel-${i}`)?.value;
      if (!newV) continue;
      const k = LOOKUP_DB_KEY[campo];
      if (k) {
        const codici = Object.entries(DB || {}).filter(([, d]) => d[k] === v).map(([c]) => c);
        if (codici.length) {
          try {
            await db.dispositivi.bulkPatch(codici, { [campo]: newV });
            for (const cod of codici) if (DB[cod]) DB[cod][k] = newV;
          } catch(e) { console.warn('[_applyImportReview] bulkPatch', e); }
        }
      }
      sostituiti++;
    }
    // 'ignora': nulla
  }
  window._irRows = null;
  document.getElementById('gdb-review')?.remove();
  document.getElementById('gdb-progress')?.style && (document.getElementById('gdb-progress').style.display = 'none');
  toast(`Liste aggiornate: ${aggiunti} aggiunti, ${sostituiti} sostituiti.`, 'ok');
}

// ── GESTIONE LISTE LOOKUP ──────────────────────────────────────

const LOOKUP_LABELS = {
  descrizione_classe: 'Descrizione',
  costruttore:        'Costruttore',
  modello:            'Modello',
  presidio:           'Presidio',
  reparto:            'Reparto',
  nuova_area:         'Nuova Area',
  sede_struttura:     'Sede Struttura',
  civab:              'CIVAB',
  verifiche:          'Verifiche',
  dettagli_stato:     'Stato',
  manutentore:        'Manutentore',
  periodicita_vse:    'Period. VSE',
  periodicita_vsp:    'Period. VSP',
  periodicita_mo:     'Period. MO',
  periodicita_cq:     'Period. CQ',
  esito_ultima_vse:   'Esito Ult. VSE',
  esito_ultima_vsp:   'Esito Ult. VSP',
  esito_ultima_mo:    'Esito Ult. MO',
  esito_ultima_cq:    'Esito Ult. CQ',
  presenze_effettive: 'Presenze',
  cliente:            'Cliente',
  proprieta:          'Proprietà',
  forma_presenza:     'Forma Pres.',
};

// ── Import Storico Verifiche ──────────────────────────────────
async function importStorico(input) {
  if (typeof XLSX === 'undefined') {
    toast('Caricamento libreria Excel...', 'warn');
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = () => importStorico(input);
    document.head.appendChild(s); return;
  }
  const file = input.files[0];
  if (!file) return;
  input.value = '';

  const setProgress = (pct, label, detail) => {
    const box = document.getElementById('gdb-progress');
    if (box) box.style.display = '';
    const bar = document.getElementById('gdb-prog-bar');
    if (bar) bar.style.width = pct + '%';
    const lbl = document.getElementById('gdb-prog-label');
    if (lbl) lbl.textContent = label;
    const det = document.getElementById('gdb-prog-detail');
    if (det) det.textContent = detail || '';
  };

  try {
    setProgress(5, 'Lettura file...', '');
    const buf  = await file.arrayBuffer();
    const wb   = XLSX.read(buf, { type: 'array', cellDates: true });
    const ws   = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    // Pre-processing cell-level della colonna `data`: bypassa il display format
    // ambiguo (m/d/yy vs d/m/yy) leggendo il seriale numerico raw, e usa
    // _dateObjToISO (componenti locali) invece di toISOString() per evitare
    // TZ shift di -1 giorno. Stesso pattern di importDatabaseDispositivi (commit ca832df).
    try {
      const date1904 = !!(wb.Workbook && wb.Workbook.WBProps && wb.Workbook.WBProps.date1904);
      const range = XLSX.utils.decode_range(ws['!ref']);
      let dataCol = null;
      for (let c = range.s.c; c <= range.e.c; c++) {
        const hdr = ws[XLSX.utils.encode_cell({ r: range.s.r, c })];
        if (hdr && String(hdr.v).trim().toLowerCase() === 'data') {
          dataCol = XLSX.utils.encode_col(c); break;
        }
      }
      if (dataCol) {
        for (let i = 0; i < rows.length; i++) {
          const addr = dataCol + (range.s.r + 2 + i);
          rows[i].data = _cellToISO(ws[addr], date1904);
        }
      }
    } catch (e) {
      console.warn('[importStorico] pre-processing date fallito, fallback al parser:', e);
    }

    // Normalizza ASL come fa syncProgrammazioneAnagrafica (core.js): lowercase
    // senza prefisso "asl ". Allinea le due convenzioni che storicamente
    // popolavano la tabella in modo incoerente ("ASL Benevento" vs "benevento").
    const asl = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');

    // Normalizzatori
    const normTipo = t => {
      const s = String(t).trim().toUpperCase();
      if (s === 'VS') return 'VSE';
      if (['VSE','VSP','MO','CQ'].includes(s)) return s;
      return null;
    };
    const normEsito = e => {
      const s = String(e).trim();
      if (!s || s === '-') return null;
      if (s.toLowerCase() === 'non eseguita') return 'Non Eseguita';
      return s;
    };
    // normData: fallback per file legacy con celle stringa.
    // Per le celle data (t='n' o t='d') la conversione è già avvenuta a monte
    // via _cellToISO (pre-processing cell-level), che restituisce ISO
    // YYYY-MM-DD direttamente. Questo branch gestisce solo i casi residui.
    const normData = v => {
      if (!v) return null;
      if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v; // ISO già normalizzato
      if (v instanceof Date) return _dateObjToISO(v);
      const s = String(v).trim();
      const m1 = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (m1) return `${m1[3]}-${m1[2].padStart(2,'0')}-${m1[1].padStart(2,'0')}`;
      return null;
    };
    const normCodice = v => {
      const s = String(v || '').replace(/\D/g,'');
      return s ? s.padStart(7,'0') : null;
    };

    // Pulisci e valida righe
    setProgress(15, 'Elaborazione righe...', '');
    const clean = [];
    let skipped = 0;
    rows.forEach(r => {
      const codice = normCodice(r.codice);
      const data   = normData(r.data);
      const tipo   = normTipo(r.tipo);
      if (!codice || !data || !tipo) { skipped++; return; }
      clean.push({
        asl,
        codice,
        data,
        tipo,
        esito:        normEsito(r.esito),
        verificatore: String(r.verificatore || '').trim() || null,
        note:         String(r.note || '').trim() || null,
      });
    });

    if (!clean.length) { toast('Nessuna riga valida trovata nel file', 'warn'); return; }

    // Deduplica per chiave naturale (asl, codice, data, tipo) — mantiene la prima
    // occorrenza. Necessario perché ignoreDuplicates (PostgREST ON CONFLICT
    // DO NOTHING) NON gestisce duplicati DENTRO lo stesso INSERT batch:
    // Postgres rifiuta con "cannot affect row a second time" e fa fallire
    // l'intero batch atomicamente, perdendo anche le righe valide.
    const dedupMap = new Map();
    let dups = 0;
    for (const r of clean) {
      const key = `${r.asl}|${r.codice}|${r.data}|${r.tipo}`;
      if (dedupMap.has(key)) { dups++; continue; }
      dedupMap.set(key, r);
    }
    const cleanDedup = Array.from(dedupMap.values());
    if (dups > 0) console.log(`[importStorico] deduplicati ${dups} record (chiave asl+codice+data+tipo)`);

    // Insert a batch (ON CONFLICT DO NOTHING via upsert ignoreSelf)
    const BATCH = 200;
    const total = cleanDedup.length;
    let inserted = 0, errors = 0;

    for (let i = 0; i < total; i += BATCH) {
      const batch = cleanDedup.slice(i, i + BATCH);
      const pct   = Math.round(15 + (i / total) * 83);
      setProgress(pct, 'Inserimento...', `${Math.min(i + BATCH, total)} / ${total} record`);
      try { await db.storico.insertMany(batch, { ignoreDuplicates: true }); inserted += batch.length; }
      catch(e) { console.error('Batch error', i, e); errors += batch.length; }
    }

    setProgress(100, 'Completato', `${inserted} record inseriti, ${skipped} righe saltate, ${dups} duplicati interni rimossi, ${errors} errori`);
    toast(`Storico importato: ${inserted} record (${dups} duplicati rimossi)`, 'ok');
  } catch (e) {
    console.error('importStorico error:', e);
    toast('Errore import storico: ' + e.message, 'warn');
  }
}

function openGestioneListe() {
  if (!can('lookup_write')) return;
  document.getElementById('gl-modal')?.remove();
  // Costruisce opzioni campo: standard + jolly bloccate
  const campi = { ...LOOKUP_LABELS };
  try {
    getJollyMeta().forEach((m, i) => {
      if (m.type === 'bloccata') campi[`jolly_${i + 1}`] = m.label || `Jolly ${i + 1}`;
    });
  } catch(e) {}
  const opts = Object.entries(campi).map(([k, lbl]) =>
    `<option value="${k}">${lbl}</option>`).join('');
  document.body.insertAdjacentHTML('beforeend', `
  <div id="gl-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">
    <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:520px;padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="font-size:16px;font-weight:600">Gestione Liste</div>
        <button onclick="document.getElementById('gl-modal').remove()" style="padding:4px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);cursor:pointer">✕</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;align-items:center">
        <select id="gl-campo" onchange="glLoadCampo()" style="flex:1;padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">${opts}</select>
        <button onclick="glSincronizzaDaDB()" title="Sincronizza questo campo dal database" style="padding:8px 12px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text2);cursor:pointer;white-space:nowrap">↻ Sync</button>
        <button onclick="glSincronizzaTutto()" title="Sincronizza tutte le colonne dal database" style="padding:8px 12px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text2);cursor:pointer;white-space:nowrap">↻ Sync tutto</button>
      </div>
      <div style="display:flex;gap:6px;margin-bottom:12px">
        <input id="gl-nuovo" type="text" placeholder="Nuovo valore..." style="flex:1;padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:13px">
        <button onclick="glAggiungi()" style="padding:8px 14px;font-size:13px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">+ Aggiungi</button>
      </div>
      <div id="gl-lista" style="max-height:340px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--rad);min-height:60px">
        <div style="padding:12px;text-align:center;color:var(--text3);font-size:13px">Seleziona un campo...</div>
      </div>
      <div id="gl-msg" style="display:none;margin-top:10px;padding:8px 12px;border-radius:var(--rad);font-size:13px"></div>
    </div>
  </div>`);
  glLoadCampo();
}

function glMsg(text, ok) {
  const el = document.getElementById('gl-msg');
  if (!el) return;
  el.textContent = text;
  el.style.display = 'block';
  el.style.background = ok ? 'var(--ok-bg)' : 'var(--ko-bg)';
  el.style.color = ok ? 'var(--ok)' : 'var(--ko)';
  setTimeout(() => { el.style.display = 'none'; }, 2500);
}

function glLoadCampo() {
  const campo = document.getElementById('gl-campo')?.value;
  if (!campo) return;
  const lista = document.getElementById('gl-lista');
  if (!lista) return;
  const vals = [...(window._storedLookups?.[campo] || [])].sort();
  if (!vals.length) {
    lista.innerHTML = '<div style="padding:12px;text-align:center;color:var(--text3);font-size:13px">Nessun valore configurato</div>';
    return;
  }
  lista.innerHTML = vals.map(v => `
    <div data-gl-row="${_esc(v)}" style="display:flex;align-items:center;justify-content:space-between;padding:7px 12px;border-bottom:1px solid var(--border);font-size:13px">
      <span style="color:var(--text);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_esc(v)}</span>
      <div style="display:flex;gap:6px;flex-shrink:0;margin-left:8px">
        <button onclick="glRinomina(${_esc(JSON.stringify(campo))}, ${_esc(JSON.stringify(v))})"
          style="padding:2px 8px;font-size:11px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text2);cursor:pointer">
          Rinomina
        </button>
        <button onclick="glElimina(${_esc(JSON.stringify(campo))}, ${_esc(JSON.stringify(v))})"
          style="padding:2px 8px;font-size:11px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">
          Elimina
        </button>
      </div>
    </div>`).join('');
}

async function glAggiungi() {
  const campo = document.getElementById('gl-campo')?.value;
  const input = document.getElementById('gl-nuovo');
  const valore = input?.value?.trim();
  if (!campo || !valore) return;
  const set = window._storedLookups?.[campo];
  if (Array.isArray(set) && set.includes(valore)) {
    glMsg('Valore già presente.', false); return;
  }
  await saveLookupValue(campo, valore);
  if (input) input.value = '';
  glLoadCampo();
  glMsg('Valore aggiunto.', true);
}

async function glElimina(campo, valore) {
  const count = await countLookupUsage(campo, valore);
  if (count === null) {
    // Campo senza chiave breve: avviso + conferma classica
    if (!confirm(`Attenzione: impossibile verificare quanti dispositivi usano "${valore}".\nEliminare comunque dalla lista?`)) return;
    const ok = await deleteLookupValue(campo, valore);
    glLoadCampo();
    if (ok) glMsg('Valore eliminato.', true);
    else glMsg('Eliminazione non riuscita — verifica policy RLS su lookup_asl.', false);
    return;
  }
  if (count === 0) {
    const ok = await deleteLookupValue(campo, valore);
    glLoadCampo();
    if (ok) glMsg('Valore eliminato.', true);
    else glMsg('Eliminazione non riuscita — verifica policy RLS su lookup_asl.', false);
    return;
  }
  // count > 0: mostra delete guard
  showGlDeleteGuard(campo, valore, count);
}

function showGlDeleteGuard(campo, valore, count) {
  const altri = [...(window._storedLookups?.[campo] || [])].filter(v => v !== valore).sort();
  const optsHtml = altri.map(v => `<option value="${_esc(v)}">${_esc(v)}</option>`).join('');
  const guard = document.getElementById('gl-guard');
  if (guard) guard.remove();

  const panel = document.createElement('div');
  panel.id = 'gl-guard';
  panel.style.cssText = 'margin-top:10px;padding:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);font-size:13px';
  panel.innerHTML = `
    <div style="margin-bottom:10px;color:var(--text)">
      <strong>${_esc(valore)}</strong> è usato da <strong>${count}</strong> dispositiv${count === 1 ? 'o' : 'i'}. Cosa vuoi fare?
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <div style="display:flex;gap:6px;align-items:center">
        <select id="gl-guard-sel" style="flex:1;padding:6px 8px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:13px">
          <option value="">— seleziona valore sostitutivo —</option>
          ${optsHtml}
        </select>
        <button onclick="glGuardSostituisci(${_esc(JSON.stringify(campo))}, ${_esc(JSON.stringify(valore))})"
          style="padding:6px 12px;font-size:12px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer;white-space:nowrap">
          Sostituisci
        </button>
      </div>
      <button onclick="glGuardLascia(${_esc(JSON.stringify(campo))}, ${_esc(JSON.stringify(valore))})"
        style="padding:6px 10px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text2);cursor:pointer;text-align:left">
        Lascia invariato — elimina solo dalla lista
      </button>
      <button onclick="document.getElementById('gl-guard')?.remove()"
        style="padding:4px 10px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text3);cursor:pointer">
        Annulla
      </button>
    </div>`;

  const msg = document.getElementById('gl-msg');
  if (msg) msg.after(panel); else document.getElementById('gl-lista')?.after(panel);
}

async function glGuardSostituisci(campo, valore) {
  const nuovoVal = document.getElementById('gl-guard-sel')?.value;
  if (!nuovoVal) { glMsg('Seleziona un valore sostitutivo.', false); return; }
  document.getElementById('gl-guard')?.remove();
  glMsg('Sostituzione in corso...', true);
  const { updated, ok } = await renameLookupValue(campo, valore, nuovoVal);
  glLoadCampo();
  if (ok) glMsg(`Sostituito in ${updated} dispositiv${updated === 1 ? 'o' : 'i'}.`, true);
  else glMsg('Operazione parziale — verifica log console.', false);
}

async function glGuardLascia(campo, valore) {
  document.getElementById('gl-guard')?.remove();
  const ok = await deleteLookupValue(campo, valore);
  glLoadCampo();
  if (ok) glMsg('Valore eliminato dalla lista. I dispositivi esistenti non sono stati modificati.', true);
  else glMsg('Eliminazione non riuscita — verifica policy RLS su lookup_asl.', false);
}

function glRinomina(campo, valore) {
  const lista = document.getElementById('gl-lista');
  if (!lista) return;
  const row = lista.querySelector(`[data-gl-row="${CSS.escape(valore)}"]`);
  if (!row) return;
  row.innerHTML = `
    <input id="gl-rin-input" type="text" value="${_esc(valore)}"
      style="flex:1;padding:5px 8px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:13px;min-width:0"
      onkeydown="if(event.key==='Enter')glConfirmRinomina(${_esc(JSON.stringify(campo))},${_esc(JSON.stringify(valore))});if(event.key==='Escape')glLoadCampo()">
    <div style="display:flex;gap:6px;flex-shrink:0;margin-left:8px">
      <button onclick="glConfirmRinomina(${_esc(JSON.stringify(campo))}, ${_esc(JSON.stringify(valore))})"
        style="padding:2px 10px;font-size:11px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">
        Conferma
      </button>
      <button onclick="glLoadCampo()"
        style="padding:2px 8px;font-size:11px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text3);cursor:pointer">
        Annulla
      </button>
    </div>`;
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  document.getElementById('gl-rin-input')?.focus();
}

async function glConfirmRinomina(campo, oldV) {
  const newV = document.getElementById('gl-rin-input')?.value?.trim();
  if (!newV) { glMsg('Il nome non può essere vuoto.', false); return; }
  if (newV === oldV) { glLoadCampo(); return; }
  const existing = window._storedLookups?.[campo];
  if (Array.isArray(existing) && existing.includes(newV)) {
    glMsg(`"${newV}" è già presente nella lista.`, false); return;
  }
  glMsg('Rinomina in corso...', true);
  const { updated, ok } = await renameLookupValue(campo, oldV, newV);
  glLoadCampo();
  if (ok) glMsg(`Rinominato. ${updated} dispositiv${updated === 1 ? 'o' : 'i'} aggiornati.`, true);
  else glMsg('Operazione parziale — verifica log console.', false);
}

async function glSincronizzaDaDB() {
  const campo = document.getElementById('gl-campo')?.value;
  if (!campo) return;
  const lista = document.getElementById('gl-lista');
  if (lista) lista.innerHTML = '<div style="padding:12px;text-align:center;color:var(--text3);font-size:13px">Sincronizzazione...</div>';

  // Raccoglie valori unici: prima prova dal DB in-memory (solo campi con chiave breve),
  // poi cade back su query Supabase per jolly e campi non caricati in memoria.
  const dbKey = LOOKUP_DB_KEY[campo];
  const inDB = new Set();
  if (dbKey) {
    for (const d of Object.values(DB || {})) {
      if (d[dbKey]) inDB.add(String(d[dbKey]).trim());
    }
  }
  if (!inDB.size) {
    // Fallback: query diretta a Supabase per questo campo
    try {
      const rows = await db.dispositivi.listAll({ select: campo });
      for (const r of (rows || [])) {
        const v = r[campo];
        if (v) inDB.add(String(v).trim());
      }
    } catch(e) {
      glMsg('Errore query database: ' + e.message, false);
      glLoadCampo();
      return;
    }
  }

  if (!inDB.size) { glMsg('Nessun valore trovato nel DB per questo campo.', false); glLoadCampo(); return; }

  // Aggiungi valori nuovi
  let added = 0;
  for (const v of inDB) {
    const existing = window._storedLookups?.[campo];
    if (!Array.isArray(existing) || !existing.includes(v)) {
      await saveLookupValue(campo, v);
      added++;
    }
  }
  // Trova orfani: in lista ma non usati da nessun dispositivo
  const orfani = (window._storedLookups?.[campo] || []).filter(v => !inDB.has(v));
  glLoadCampo();
  if (orfani.length) {
    glSyncOrfani(campo, orfani, added);
  } else {
    glMsg(added > 0 ? `Sincronizzati ${added} nuovi valori.` : 'Lista già aggiornata.', true);
  }
}

function glSyncOrfani(campo, orfani, added) {
  document.getElementById('gl-orfani')?.remove();
  const panel = document.createElement('div');
  panel.id = 'gl-orfani';
  panel.style.cssText = 'margin-top:10px;padding:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);font-size:13px';
  const righe = orfani.map(v => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border)">
      <span style="color:var(--text)">${_esc(v)}</span>
      <div style="display:flex;gap:6px">
        <button onclick="glSyncEliminaOrfano(${_esc(JSON.stringify(campo))}, ${_esc(JSON.stringify(v))})"
          style="padding:2px 8px;font-size:11px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">
          Elimina
        </button>
        <button onclick="glSyncMantieniOrfano(this)"
          style="padding:2px 8px;font-size:11px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text3);cursor:pointer">
          Mantieni
        </button>
      </div>
    </div>`).join('');
  panel.innerHTML = `
    <div style="margin-bottom:8px;font-weight:600;color:var(--text)">
      ${added > 0 ? `${added} valori aggiunti. ` : ''}${orfani.length} valor${orfani.length === 1 ? 'e non usato' : 'i non usati'} da nessun dispositivo:
    </div>
    ${righe}
    <div style="margin-top:8px;display:flex;gap:6px">
      <button onclick="glSyncEliminaTutti(${_esc(JSON.stringify(campo))}, ${_esc(JSON.stringify(orfani))})"
        style="padding:4px 10px;font-size:12px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">
        Elimina tutti
      </button>
      <button onclick="document.getElementById('gl-orfani')?.remove()"
        style="padding:4px 10px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text2);cursor:pointer">
        Mantieni tutti
      </button>
    </div>`;
  const msg = document.getElementById('gl-msg');
  if (msg) msg.after(panel); else document.getElementById('gl-lista')?.after(panel);
}

async function glSyncEliminaOrfano(campo, valore) {
  const ok = await deleteLookupValue(campo, valore);
  if (!ok) { glMsg('Eliminazione non riuscita.', false); return; }
  // Rimuovi la riga dal panel
  const panel = document.getElementById('gl-orfani');
  if (panel) {
    const righe = panel.querySelectorAll('div[style*="border-bottom"]');
    for (const r of righe) {
      if (r.querySelector('span')?.textContent === valore) { r.remove(); break; }
    }
    // Se non restano orfani, chiudi il panel
    if (!panel.querySelectorAll('div[style*="border-bottom"]').length) panel.remove();
  }
  glLoadCampo();
}

function glSyncMantieniOrfano(btn) {
  btn.closest('div[style*="border-bottom"]')?.remove();
  const panel = document.getElementById('gl-orfani');
  if (panel && !panel.querySelectorAll('div[style*="border-bottom"]').length) panel.remove();
}

async function glSyncEliminaTutti(campo, orfani) {
  document.getElementById('gl-orfani')?.remove();
  for (const v of orfani) await deleteLookupValue(campo, v);
  glLoadCampo();
  glMsg(`${orfani.length} valor${orfani.length === 1 ? 'e eliminato' : 'i eliminati'}.`, true);
}

async function glSincronizzaTutto() {
  const lista = document.getElementById('gl-lista');
  if (lista) lista.innerHTML = '<div style="padding:12px;text-align:center;color:var(--text3);font-size:13px">Sincronizzazione in corso...</div>';
  document.getElementById('gl-orfani')?.remove();
  document.getElementById('gl-sync-tutto-report')?.remove();

  // Costruisce la lista completa di campi (standard + jolly bloccate)
  const campi = { ...LOOKUP_LABELS };
  try {
    getJollyMeta().forEach((m, i) => {
      if (m.type === 'bloccata') campi[`jolly_${i + 1}`] = m.label || `Jolly ${i + 1}`;
    });
  } catch(e) {}

  let totalAdded = 0;
  const orfaniPerCampo = {};   // { campo: { label, valori[] } }

  for (const [campo, label] of Object.entries(campi)) {
    // Raccoglie valori dal DB (memoria → tableData → Supabase)
    const dbKey = LOOKUP_DB_KEY[campo];
    const inDB = new Set();
    if (dbKey) {
      for (const d of Object.values(DB || {})) if (d[dbKey]) inDB.add(String(d[dbKey]).trim());
    }
    if (!inDB.size) {
      if (Array.isArray(window.tableData)) {
        for (const r of window.tableData) { const v = r[campo]; if (v) inDB.add(String(v).trim()); }
      }
      if (!inDB.size) {
        try {
          const rows = await db.dispositivi.listAll({ select: campo });
          for (const r of (rows || [])) { const v = r[campo]; if (v) inDB.add(String(v).trim()); }
        } catch(e) {}
      }
    }

    // Aggiungi nuovi valori
    for (const v of inDB) {
      const existing = window._storedLookups?.[campo];
      if (!Array.isArray(existing) || !existing.includes(v)) {
        await saveLookupValue(campo, v);
        totalAdded++;
      }
    }

    // Rileva orfani (solo se abbiamo dati dal DB per questo campo)
    if (inDB.size) {
      const orfani = (window._storedLookups?.[campo] || []).filter(v => !inDB.has(v));
      if (orfani.length) orfaniPerCampo[campo] = { label, valori: orfani };
    }
  }

  glLoadCampo();
  const totOrfani = Object.values(orfaniPerCampo).reduce((s, x) => s + x.valori.length, 0);

  if (!totOrfani) {
    glMsg(totalAdded > 0 ? `Sync completato: ${totalAdded} valori aggiunti.` : 'Tutte le liste sono già aggiornate.', true);
    return;
  }

  // Mostra riepilogo orfani raggruppato per campo
  const sezioni = Object.entries(orfaniPerCampo).map(([campo, { label, valori }]) => {
    const righe = valori.map(v => `
      <div data-orf-campo="${_esc(campo)}" data-orf-val="${_esc(v)}"
           style="display:flex;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="font-size:13px;color:var(--text)">${_esc(v)}</span>
        <div style="display:flex;gap:5px">
          <button onclick="glTuttoEliminaOrfano(this,'${_esc(campo)}','${_esc(v)}')"
            style="padding:1px 7px;font-size:11px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">Elimina</button>
          <button onclick="this.closest('[data-orf-campo]').remove();glTuttoChiudiSeVuota('${_esc(campo)}')"
            style="padding:1px 7px;font-size:11px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text3);cursor:pointer">Mantieni</button>
        </div>
      </div>`).join('');
    return `
      <div style="margin-bottom:10px">
        <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">${_esc(label)}</div>
        <div id="gl-tutto-sezione-${_esc(campo)}">${righe}</div>
        <div style="display:flex;gap:6px;margin-top:5px">
          <button onclick="glTuttoEliminaCampo('${_esc(campo)}')"
            style="padding:2px 8px;font-size:11px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">Elimina tutti</button>
          <button onclick="glTuttoMantieniCampo('${_esc(campo)}')"
            style="padding:2px 8px;font-size:11px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text2);cursor:pointer">Mantieni tutti</button>
        </div>
      </div>`;
  }).join('');

  const panel = document.createElement('div');
  panel.id = 'gl-sync-tutto-report';
  panel.style.cssText = 'margin-top:10px;padding:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);font-size:13px;max-height:400px;overflow-y:auto';
  panel.innerHTML = `
    <div style="font-weight:600;color:var(--text);margin-bottom:10px">
      ${totalAdded > 0 ? `${totalAdded} valori aggiunti. ` : ''}${totOrfani} valor${totOrfani === 1 ? 'e non usato' : 'i non usati'} in ${Object.keys(orfaniPerCampo).length} camp${Object.keys(orfaniPerCampo).length === 1 ? 'o' : 'i'}:
    </div>
    ${sezioni}
    <div style="display:flex;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
      <button onclick="glTuttoEliminaTutti()"
        style="padding:5px 12px;font-size:12px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer;font-weight:600">
        Elimina tutti gli orfani
      </button>
      <button onclick="document.getElementById('gl-sync-tutto-report')?.remove()"
        style="padding:5px 12px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text2);cursor:pointer">
        Mantieni tutti
      </button>
    </div>`;

  // Salva mappa orfani per le azioni bulk
  window._glOrf = orfaniPerCampo;
  const msg = document.getElementById('gl-msg');
  if (msg) msg.after(panel); else document.getElementById('gl-lista')?.after(panel);
}

async function glTuttoEliminaOrfano(btn, campo, valore) {
  const ok = await deleteLookupValue(campo, valore);
  if (!ok) { glMsg('Eliminazione non riuscita.', false); return; }
  btn.closest('[data-orf-campo]')?.remove();
  glTuttoChiudiSeVuota(campo);
  glLoadCampo();
}

function glTuttoChiudiSeVuota(campo) {
  const sez = document.getElementById(`gl-tutto-sezione-${campo}`);
  if (sez && !sez.children.length) sez.closest('div[style*="margin-bottom:10px"]')?.remove();
  const report = document.getElementById('gl-sync-tutto-report');
  if (report && !report.querySelectorAll('[data-orf-campo]').length) report.remove();
}

async function glTuttoEliminaCampo(campo) {
  const sez = document.getElementById(`gl-tutto-sezione-${campo}`);
  const valori = [...(sez?.querySelectorAll('[data-orf-val]') || [])].map(el => el.dataset.orfVal);
  for (const v of valori) await deleteLookupValue(campo, v);
  sez?.closest('div[style*="margin-bottom:10px"]')?.remove();
  const report = document.getElementById('gl-sync-tutto-report');
  if (report && !report.querySelectorAll('[data-orf-campo]').length) report.remove();
  glLoadCampo();
}

function glTuttoMantieniCampo(campo) {
  const sez = document.getElementById(`gl-tutto-sezione-${campo}`);
  sez?.closest('div[style*="margin-bottom:10px"]')?.remove();
  const report = document.getElementById('gl-sync-tutto-report');
  if (report && !report.querySelectorAll('[data-orf-campo]').length) report.remove();
}

async function glTuttoEliminaTutti() {
  const orf = window._glOrf || {};
  for (const [campo, { valori }] of Object.entries(orf)) {
    for (const v of valori) await deleteLookupValue(campo, v);
  }
  window._glOrf = null;
  document.getElementById('gl-sync-tutto-report')?.remove();
  glLoadCampo();
  glMsg('Tutti gli orfani eliminati.', true);
}
