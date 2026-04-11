// ── ADMIN: pannello admin, gestione DB ──

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
          <select id="adm-role" style="padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
            <option value="verificatore">Verificatore</option>
            <option value="responsabile">Responsabile</option>
            <option value="admin">Admin</option>
          </select>
          <select id="adm-asl" style="padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
  <option value="ASL Benevento">ASL Benevento</option>
  <option value="ASL Avellino">ASL Avellino</option>
</select>
          <button onclick="adminCreate()" style="padding:8px 14px;font-size:13px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">+ Crea</button>
        </div>
        <div id="adm-msg" style="display:none;padding:8px 12px;border-radius:var(--rad);font-size:13px;margin-bottom:12px"></div>
        <div id="adm-list" style="font-size:13px;color:var(--text2)">Caricamento...</div>
      </div>
    </div>`);
  } else {
    modal.style.display = 'flex';
  }
  adminLoadUsers();
}

async function adminCall(payload) {
  const { data: { session } } = await supa.auth.getSession();
  const res = await fetch('https://ttgvuoiznybjdyhlshpt.supabase.co/functions/v1/manage-users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + session.access_token
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}

async function adminLoadUsers() {
  const list = document.getElementById('adm-list');
  if (!list) return;
  list.innerHTML = 'Caricamento...';
  const users = await adminCall({ action: 'list' });
  if (!Array.isArray(users)) { list.innerHTML = 'Errore caricamento utenti.'; return; }
  if (users.length === 0) { list.innerHTML = 'Nessun utente.'; return; }
  list.innerHTML = users.map(u => `
    <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--rad);margin-bottom:6px;flex-wrap:wrap">
      <div style="flex:1;min-width:160px">
        <div style="font-weight:500;color:var(--text)">${u.profile?.full_name || '—'}</div>
        <div style="font-size:11px;color:var(--text3)">${u.email}</div>
      </div>
      <select onchange="adminUpdateRole('${u.id}', this.value)" style="padding:4px 8px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:12px">
        <option value="verificatore" ${u.profile?.role==='verificatore'?'selected':''}>Verificatore</option>
        <option value="responsabile" ${u.profile?.role==='responsabile'?'selected':''}>Responsabile</option>
        <option value="admin" ${u.profile?.role==='admin'?'selected':''}>Admin</option>
      </select>
      <button onclick="adminBan('${u.id}', ${u.banned})" style="padding:4px 10px;font-size:12px;border:1px solid ${u.banned ? 'var(--ok)' : 'var(--warn)'};border-radius:var(--rad);background:var(--bg);color:${u.banned ? 'var(--ok)' : 'var(--warn)'};cursor:pointer">
        ${u.banned ? 'Riabilita' : 'Disabilita'}
      </button>
      <button onclick="adminDelete('${u.id}', '${u.email}')" style="padding:4px 10px;font-size:12px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">Elimina</button>
    </div>
  `).join('');
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
  const asl = currentUser.profile?.asl || 'ASL Benevento';
  const aslKey = asl.toLowerCase().replace('asl ', '');
  const token = await supaToken();
  const headers = { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + token };
  toast('Export in corso...', 'warn');

  let all = [], offset = 0, pageSize = 1000;
  while (true) {
    const res = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}?select=*&limit=${pageSize}&offset=${offset}`, { headers });
    if (!res.ok) { toast('Errore export: ' + res.status, 'ko'); return; }
    const rows = await res.json();
    all = all.concat(rows);
    if (rows.length < pageSize) break;
    offset += pageSize;
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
      out[jollyKeyToLabel[k] ?? k] = v;
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

  const asl = currentUser.profile?.asl || 'ASL Benevento';
  const aslKey = asl.toLowerCase().replace('asl ', '');
  const token = await supaToken();
  const headers = { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' };

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
        // Codici con zeri iniziali a 7 cifre
        if ((k === 'codice' || k === 'codice_padre') && /^\d+$/.test(s)) {
          obj[k] = s.padStart(7, '0'); continue;
        }
        obj[k] = s;
      }
      return obj;
    });

    // 2. Svuota tabella via RPC
    setProgress(10, 'Svuotamento tabella...', '');
    const rpcRes = await fetch(`${SUPA_URL}/rest/v1/rpc/truncate_dispositivi`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ asl_key: aslKey })
    });
    if (!rpcRes.ok) {
      const err = await rpcRes.text();
      throw new Error('Truncate fallita: ' + err);
    }

    // 3. Insert a batch
    const BATCH = 200;
    const total = clean.length;
    let inserted = 0, errors = 0;

    for (let i = 0; i < total; i += BATCH) {
      const batch = clean.slice(i, i + BATCH);
      const pct = Math.round(10 + (i / total) * 88);
      setProgress(pct, `Inserimento...`, `${Math.min(i + BATCH, total)} / ${total} record`);

      const res = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}`, {
        method: 'POST',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body: JSON.stringify(batch)
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error(`Batch ${i}-${i+BATCH} error:`, errText);
        // Tenta inserimento singolo per identificare il record problematico
        for (const rec of batch) {
          const r2 = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}`, {
            method: 'POST',
            headers: { ...headers, 'Prefer': 'return=minimal' },
            body: JSON.stringify(rec)
          });
          if (r2.ok) inserted++;
          else {
            const e2 = await r2.text();
            console.warn(`Record ${rec.codice} saltato:`, e2);
            errors++;
          }
        }
      } else {
        inserted += batch.length;
      }
    }

    setProgress(100, 'Import completato!', `${inserted} record inseriti${errors ? ', ' + errors + ' batch con errori' : ''}`);
    toast(`Import completato: ${inserted} dispositivi`, errors ? 'warn' : 'ok');

    // Ricarica DB in memoria
    await initDB();

  } catch (e) {
    console.error('Import error:', e);
    setProgress(0, 'Errore', e.message);
    toast('Errore import: ' + e.message, 'ko');
  }
}
