// ── GESTIONE BENE: modal scheda dispositivo ──



let gestioneCodice = null;
let gbEditMode     = false;
let gbIsNew        = false;
let gbCurrentTab   = 'dati';
let gbFullDev      = null;

async function openGestioneBene(codice) {
  if (!codice) return;
  gestioneCodice = codice;
  gbEditMode   = false;
  gbIsNew      = false;
  gbCurrentTab = 'dati';
  gbFullDev    = null;

  const existing = document.getElementById('gb-modal');
  if (existing) existing.remove();

  const nome = DB[codice]?.n || codice;
  document.body.insertAdjacentHTML('beforeend', _gbModalHTML(codice, nome));
  await _gbLoadDevice(codice);
}

// ── HTML del modal ──────────────────────────────────────────
function _gbModalHTML(codice, nome) {
  const canEdit = can('anagrafica_write');
  return `
<div id="gb-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">
  <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:700px">
    <!-- Header -->
    <div style="padding:16px 20px 0">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px">
        <div style="min-width:0">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3);margin-bottom:2px">Gestione Bene</div>
          <div style="font-size:16px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_esc(nome.toLowerCase())}</div>
          <div style="font-size:12px;color:var(--text3);margin-top:1px">${_esc(codice)}${!canEdit ? '&ensp;<span style="color:var(--warn);font-size:11px">sola lettura</span>' : ''}</div>
        </div>
        <div style="display:flex;gap:6px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end;align-items:flex-start">
          ${canEdit ? `
            <button id="gb-btn-modifica" onclick="gbEnterEditMode()" style="padding:5px 12px;font-size:12px;font-weight:600;border:1px solid var(--info);border-radius:var(--rad);background:var(--bg);color:var(--info);cursor:pointer">✎ Modifica</button>
            <button id="gb-btn-salva"    onclick="gbSave()"         style="display:none;padding:5px 12px;font-size:12px;font-weight:600;border:none;border-radius:var(--rad);background:var(--ok);color:#fff;cursor:pointer">Salva</button>
            <button id="gb-btn-annulla"  onclick="gbCancelEdit()"   style="display:none;padding:5px 12px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text2);cursor:pointer">Annulla</button>
            <button id="gb-btn-copia"    onclick="gbCopia()"        style="padding:5px 12px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text2);cursor:pointer">Copia</button>
            <button id="gb-btn-elimina"  onclick="gbElimina()"      style="padding:5px 12px;font-size:12px;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">Elimina</button>
          ` : ''}
          <button onclick="document.getElementById('gb-modal').remove()" style="padding:5px 10px;font-size:12px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);cursor:pointer">✕</button>
        </div>
      </div>
      <!-- Tab bar -->
      <div style="display:flex;border-bottom:1px solid var(--border)">
        <button id="gb-tab-dati"     onclick="gbSwitchTab('dati')"     class="gb-tab-btn" style="padding:8px 16px;font-size:13px;font-weight:600;border:none;border-bottom:2px solid var(--info);background:none;color:var(--info);cursor:pointer">Dati</button>
        <button id="gb-tab-storico"  onclick="gbSwitchTab('storico')"  class="gb-tab-btn" style="padding:8px 16px;font-size:13px;font-weight:500;border:none;border-bottom:2px solid transparent;background:none;color:var(--text2);cursor:pointer">Storico</button>
        <button id="gb-tab-scadenze" onclick="gbSwitchTab('scadenze')" class="gb-tab-btn" style="padding:8px 16px;font-size:13px;font-weight:500;border:none;border-bottom:2px solid transparent;background:none;color:var(--text2);cursor:pointer">Scadenze</button>
      </div>
    </div>
    <!-- Contenuto tab -->
    <div id="gb-tab-content" style="padding:16px 20px;max-height:62vh;overflow-y:auto">
      <div style="padding:32px;text-align:center;color:var(--text3)">Caricamento...</div>
    </div>
    <div id="gb-msg" style="display:none;margin:0 20px 14px;padding:8px 12px;border-radius:var(--rad);font-size:13px"></div>
  </div>
</div>`;
}

// ── Caricamento device da Supabase ───────────────────────────
async function _gbLoadDevice(codice) {
  const content = document.getElementById('gb-tab-content');
  if (!content) return;
  const aslKey = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
  const token  = await supaToken();
  const r = await fetch(
    `${SUPA_URL}/rest/v1/dispositivi_${aslKey}?codice=eq.${encodeURIComponent(codice)}&limit=1`,
    { headers: supaHdrs(token) }
  );
  if (!r.ok) { content.innerHTML = '<div style="padding:32px;text-align:center;color:var(--ko)">Errore caricamento dispositivo</div>'; return; }
  const rows = await r.json();
  if (!rows.length) { content.innerHTML = '<div style="padding:32px;text-align:center;color:var(--text3)">Dispositivo non trovato</div>'; return; }
  gbFullDev = rows[0];
  content.innerHTML = gbRenderDati(gbFullDev, false);
}

// ── Switch tab ───────────────────────────────────────────────
function gbSwitchTab(tab) {
  gbCurrentTab = tab;
  ['dati', 'storico', 'scadenze'].forEach(t => {
    const btn = document.getElementById('gb-tab-' + t);
    if (!btn) return;
    const active = t === tab;
    btn.style.borderBottomColor = active ? 'var(--info)' : 'transparent';
    btn.style.color      = active ? 'var(--info)' : 'var(--text2)';
    btn.style.fontWeight = active ? '600' : '500';
  });
  const content = document.getElementById('gb-tab-content');
  if (!content) return;
  if (tab === 'dati')     { content.innerHTML = gbRenderDati(gbFullDev, gbEditMode); }
  if (tab === 'storico')  { content.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text3)">Caricamento...</div>'; gbLoadStorico(); }
  if (tab === 'scadenze') { content.innerHTML = gbRenderScadenze(gbFullDev); }
}

// ── Tab Dati ─────────────────────────────────────────────────
function gbRenderDati(dev, editMode) {
  if (!dev) return '<div style="padding:24px;text-align:center;color:var(--text3)">Nessun dato</div>';

  const jmeta = getJollyMeta();
  const _fmtDate = v => { const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : v || ''; };

  // Jolly con etichetta, raggruppati per sezione
  const jollyBySection = {};
  jmeta.forEach((m, idx) => {
    // Jolly senza etichetta o con etichetta di default ("Jolly N") = fantasma, non mostrare
    if (!m.label || /^Jolly\s+\d+$/i.test(m.label.trim())) return;
    const sec = m.section || 'jolly';
    if (!jollyBySection[sec]) jollyBySection[sec] = [];
    jollyBySection[sec].push({ label: m.label, key: `jolly_${idx + 1}`, idx: idx + 1 });
  });

  const _inputStyle = 'font-size:14px;padding:8px 10px;border:1.5px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text);width:100%;-webkit-appearance:none;box-sizing:border-box';

  const _field = (k, label, opts = {}) => {
    const raw     = dev[k];
    const cls     = 'anag-field' + (opts.full ? ' full' : '');
    const roFinal = opts.ro && !(gbIsNew && k === 'codice');
    const reqMark = opts.req ? ' <span style="color:var(--ko)">*</span>' : '';

    // Sola lettura o fuori edit mode
    if (!editMode || roFinal) {
      const displayVal = DATE_KEYS.has(k) ? _fmtDate(raw) : (raw != null ? String(raw) : '');
      return `<div class="${cls}"><label>${_esc(label)}</label><div class="gb-field-val">${_esc(displayVal)}</div></div>`;
    }

    // Textarea
    if (opts.ta) {
      const val = raw != null ? String(raw) : '';
      return `<div class="${cls}"><label>${_esc(label)}</label><textarea id="gb-f-${k}" data-k="${k}" style="font-size:14px;padding:8px 10px;border:1.5px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text);width:100%;min-height:58px;resize:vertical;font-family:inherit;box-sizing:border-box">${_esc(val)}</textarea></div>`;
    }

    // Campo data
    if (DATE_KEYS.has(k)) {
      const dateVal = raw ? String(raw).substring(0, 10) : '';
      return `<div class="${cls}"><label>${_esc(label)}</label><input type="date" id="gb-f-${k}" data-k="${k}" value="${dateVal}" style="${_inputStyle}"></div>`;
    }

    // Campo codice con auto-pad
    if (k === 'codice' || k === 'codice_padre') {
      const val = raw != null ? String(raw) : '';
      return `<div class="${cls}"><label>${_esc(label)}${reqMark}</label><input type="text" id="gb-f-${k}" data-k="${k}" value="${_esc(val)}" onblur="const v=this.value.replace(/\\D/g,'');this.value=v?v.padStart(7,'0').slice(0,7):'';" style="${_inputStyle}"></div>`;
    }

    // Campo lookup bloccato
    if (LOOKUP_KEYS.has(k)) {
      const val     = raw != null ? String(raw) : '';
      const dlId    = FIELD_DL[k] || '';
      const listAttr = dlId ? ` list="${dlId}"` : '';
      const onInput  = k === 'costruttore' ? ` oninput="updateModelloDatalist(this.value)"` : '';
      const addBtn   = can('lookup_write')
        ? `<button type="button" onclick="gbAddLookupValue('${k}','${_esc(label)}')" title="Aggiungi nuovo valore alla lista" style="flex-shrink:0;padding:0 10px;height:38px;font-size:18px;font-weight:600;border:1.5px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--info);cursor:pointer;line-height:1">+</button>`
        : '';
      return `<div class="${cls}"><label>${_esc(label)}${reqMark}</label><div style="display:flex;gap:4px"><input type="text" id="gb-f-${k}" data-k="${k}" value="${_esc(val)}"${listAttr}${onInput} style="${_inputStyle};flex:1;min-width:0">${addBtn}</div></div>`;
    }

    // Testo libero
    const val = raw != null ? String(raw) : '';
    return `<div class="${cls}"><label>${_esc(label)}${reqMark}</label><input type="text" id="gb-f-${k}" data-k="${k}" value="${_esc(val)}" style="${_inputStyle}"></div>`;
  };

  const _jollyField = jf => {
    const m          = jmeta[jf.idx - 1];
    const isBloccata = m?.type === 'bloccata';
    const val        = dev[jf.key] != null ? String(dev[jf.key]) : '';
    const cls        = 'anag-field';
    if (!editMode) return `<div class="${cls}"><label>${_esc(jf.label)}</label><div class="gb-field-val">${_esc(val)}</div></div>`;
    if (isBloccata) {
      const dlId   = `dl-jolly-${jf.idx}`;
      const addBtn = can('lookup_write')
        ? `<button type="button" onclick="gbAddLookupValue('${jf.key}','${_esc(jf.label)}')" title="Aggiungi nuovo valore" style="flex-shrink:0;padding:0 10px;height:38px;font-size:18px;font-weight:600;border:1.5px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--info);cursor:pointer;line-height:1">+</button>`
        : '';
      return `<div class="${cls}"><label>${_esc(jf.label)}</label><div style="display:flex;gap:4px"><input type="text" id="gb-f-${jf.key}" data-k="${jf.key}" data-jolly-bloccata="1" value="${_esc(val)}" list="${dlId}" style="${_inputStyle};flex:1;min-width:0">${addBtn}</div></div>`;
    }
    return `<div class="${cls}"><label>${_esc(jf.label)}</label><input type="text" id="gb-f-${jf.key}" data-k="${jf.key}" value="${_esc(val)}" style="${_inputStyle}"></div>`;
  };

  let html = '';
  for (const grp of ANAG_GROUPS) {
    const bodyCls = 'anag-grp-body' + (grp.cols4 ? ' cols4' : '');
    let inner = grp.fields.map(f => _field(f.k, f.l, { full: f.full, ro: f.ro, req: f.req, ta: f.ta })).join('');
    (jollyBySection[grp.id] || []).forEach(jf => { inner += _jollyField(jf); });
    html += `
      <div class="anag-grp">
        <div class="anag-grp-hdr" onclick="toggleAnagGrp('gb-${grp.id}')"><span>${grp.label}</span><span id="anag-tog-gb-${grp.id}">▾</span></div>
        <div class="${bodyCls}" id="anag-grp-gb-${grp.id}">${inner}</div>
      </div>`;
  }

  // Jolly non assegnati a nessun gruppo specifico
  const remaining = jollyBySection['jolly'] || [];
  if (remaining.length) {
    const inner = remaining.map(jf => _jollyField(jf)).join('');
    html += `
      <div class="anag-grp">
        <div class="anag-grp-hdr" onclick="toggleAnagGrp('gb-jolly')"><span>Campi Jolly</span><span id="anag-tog-gb-jolly">▾</span></div>
        <div class="anag-grp-body" id="anag-grp-gb-jolly">${inner}</div>
      </div>`;
  }

  return html || '<div style="padding:24px;text-align:center;color:var(--text3)">Nessun campo disponibile</div>';
}

// ── Edit mode ────────────────────────────────────────────────
function gbEnterEditMode() {
  if (!gbFullDev) return;
  gbEditMode = true;
  document.getElementById('gb-btn-modifica').style.display = 'none';
  document.getElementById('gb-btn-salva').style.display    = '';
  document.getElementById('gb-btn-annulla').style.display  = '';
  const bcopia = document.getElementById('gb-btn-copia');    if (bcopia)   bcopia.style.display   = 'none';
  const belim  = document.getElementById('gb-btn-elimina');  if (belim)    belim.style.display    = 'none';
  if (gbCurrentTab === 'dati') document.getElementById('gb-tab-content').innerHTML = gbRenderDati(gbFullDev, true);
}

function gbCancelEdit() {
  if (gbIsNew) { document.getElementById('gb-modal')?.remove(); return; }
  gbEditMode = false;
  document.getElementById('gb-btn-modifica').style.display = '';
  document.getElementById('gb-btn-salva').style.display    = 'none';
  document.getElementById('gb-btn-annulla').style.display  = 'none';
  const bcopia = document.getElementById('gb-btn-copia');   if (bcopia)  bcopia.style.display  = '';
  const belim  = document.getElementById('gb-btn-elimina'); if (belim)   belim.style.display   = '';
  if (gbCurrentTab === 'dati') document.getElementById('gb-tab-content').innerHTML = gbRenderDati(gbFullDev, false);
}

// ── Salva (modifica o nuovo) ─────────────────────────────────
async function gbSave() {
  if (gbIsNew) { await _gbSaveNew(); return; }
  const errors = _gbValidateLookups();
  if (errors.length) {
    gbMsg('Valore non presente in lista: ' + errors.map(e => `${e.lbl} = "${e.val}"`).join(', ') + '. Usa + per aggiungerlo.', false);
    return;
  }
  const data = _gbReadFields();
  const required = ['descrizione_classe', 'costruttore', 'modello'];
  const missing  = required.filter(k => !data[k] && !gbFullDev[k]);
  if (missing.length) { gbMsg('Campi obbligatori mancanti: ' + missing.join(', '), false); return; }

  try {
    const aslKey = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
    const token  = await supaToken();
    const r = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}?codice=eq.${encodeURIComponent(gestioneCodice)}`, {
      method: 'PATCH',
      headers: { ...supaHdrs(token), 'Prefer': 'return=minimal' },
      body: JSON.stringify(data)
    });
    if (!r.ok) { gbMsg('Errore salvataggio: ' + r.status, false); return; }
    Object.assign(gbFullDev, data);
    _gbUpdateCache(gestioneCodice, data);
    _gbRefreshViews();
    gbCancelEdit();
    gbMsg('Modifiche salvate.', true);
  } catch(e) { gbMsg('Errore di rete: ' + e.message, false); }
}

async function _gbSaveNew() {
  const errors = _gbValidateLookups();
  if (errors.length) {
    gbMsg('Valore non presente in lista: ' + errors.map(e => `${e.lbl} = "${e.val}"`).join(', ') + '. Usa + per aggiungerlo.', false);
    return;
  }
  const data = _gbReadFields();
  // Auto-pad codice
  if (data.codice) data.codice = data.codice.replace(/\D/g, '').padStart(7, '0').slice(0, 7) || data.codice;
  if (data.codice_padre) data.codice_padre = data.codice_padre.replace(/\D/g, '').padStart(7, '0').slice(0, 7) || null;
  const required = ['codice', 'descrizione_classe', 'costruttore', 'modello'];
  const missing  = required.filter(k => !data[k]);
  if (missing.length) { gbMsg('Campi obbligatori: ' + missing.join(', '), false); return; }

  data.cliente = (currentUser?.profile?.asl || 'ASL BENEVENTO').toUpperCase();
  Object.keys(data).forEach(k => { if (data[k] == null) delete data[k]; });

  try {
    const aslKey = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
    const token  = await supaToken();
    const r = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}`, {
      method: 'POST',
      headers: { ...supaHdrs(token), 'Prefer': 'return=minimal' },
      body: JSON.stringify(data)
    });
    if (!r.ok) {
      const txt = await r.text();
      gbMsg(txt.includes('duplicate') || txt.includes('unique') || txt.includes('23505')
        ? 'Codice già esistente nel DB' : 'Errore inserimento: ' + r.status, false);
      return;
    }
    const cod = data.codice;
    DB[cod] = { c: cod, n: data.descrizione_classe||'', b: data.costruttore||'', m: data.modello||'',
      mat: data.matricola||'', loc: data.presidio||'', rep: data.reparto||'',
      ss: data.sede_struttura||'', cp: data.codice_padre||'', na: data.nuova_area||'',
      pe: data.presenze_effettive||'', ds: data.dettagli_stato||'', fp: data.forma_presenza||'',
      man: data.manutentore||'', ver: data.verifiche||'', civ: data.civab||'' };
    gestioneCodice = cod;
    gbIsNew   = false;
    gbFullDev = { ...data };
    _gbRefreshViews();
    gbCancelEdit();
    gbMsg('Dispositivo inserito con successo!', true);
  } catch(e) { gbMsg('Errore di rete: ' + e.message, false); }
}

function _gbReadFields() {
  const data = {};
  document.querySelectorAll('#gb-tab-content [data-k]').forEach(el => {
    if (el.readOnly) return;
    data[el.dataset.k] = el.value.trim() || null;
  });
  return data;
}

function _gbUpdateCache(codice, data) {
  // Aggiorna DB (cache abbreviata)
  if (DB[codice]) {
    if (data.descrizione_classe !== undefined) DB[codice].n   = data.descrizione_classe || '';
    if (data.costruttore !== undefined)        DB[codice].b   = data.costruttore || '';
    if (data.modello !== undefined)            DB[codice].m   = data.modello || '';
    if (data.matricola !== undefined)          DB[codice].mat = data.matricola || '';
    if (data.presidio !== undefined)           DB[codice].loc = data.presidio || '';
    if (data.reparto !== undefined)            DB[codice].rep = data.reparto || '';
    if (data.sede_struttura !== undefined)     DB[codice].ss  = data.sede_struttura || '';
    if (data.nuova_area !== undefined)         DB[codice].na  = data.nuova_area || '';
    if (data.presenze_effettive !== undefined) DB[codice].pe  = data.presenze_effettive || '';
  }
  // Aggiorna tableData (array completo usato dalla Tabella)
  if (typeof tableData !== 'undefined' && tableData) {
    const row = tableData.find(r => r.codice === codice);
    if (row) Object.assign(row, data);
  }
}

// ── Copia ────────────────────────────────────────────────────
function gbCopia() {
  if (!gbFullDev) return;
  gbIsNew    = true;
  gbEditMode = true;
  const copy = { ...gbFullDev, codice: '' };
  gbFullDev  = copy;
  gestioneCodice = null;

  document.getElementById('gb-btn-modifica').style.display = 'none';
  document.getElementById('gb-btn-salva').style.display    = '';
  document.getElementById('gb-btn-annulla').style.display  = '';
  const bcopia = document.getElementById('gb-btn-copia');   if (bcopia)  bcopia.style.display  = 'none';
  const belim  = document.getElementById('gb-btn-elimina'); if (belim)   belim.style.display   = 'none';
  document.getElementById('gb-tab-content').innerHTML = gbRenderDati(gbFullDev, true);
  gbMsg('Nuovo dispositivo (copia) — inserisci il codice e salva', true);
  setTimeout(() => { const el = document.getElementById('gb-f-codice'); if (el) el.focus(); }, 80);
}

// ── Elimina ──────────────────────────────────────────────────
function gbElimina() {
  if (!gbFullDev) return;
  document.getElementById('gb-del-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div id="gb-del-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9500;display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:400px;padding:20px">
        <div style="font-size:15px;font-weight:600;margin-bottom:6px">Elimina dispositivo</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:16px">${_esc(gestioneCodice || '')} — ${_esc(gbFullDev.descrizione_classe || '')}</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button onclick="gbDoSoftDelete()" style="padding:10px 14px;font-size:13px;font-weight:600;text-align:left;border:1px solid var(--warn);border-radius:var(--rad);background:var(--bg);color:var(--warn);cursor:pointer">
            ⚠ Proposta dismissione<br><span style="font-size:11px;font-weight:400;color:var(--text3)">Imposta il flag — il dispositivo resta nel database</span>
          </button>
          <button onclick="gbDoHardDelete()" style="padding:10px 14px;font-size:13px;font-weight:600;text-align:left;border:1px solid var(--ko);border-radius:var(--rad);background:var(--bg);color:var(--ko);cursor:pointer">
            🗑 Elimina definitivamente<br><span style="font-size:11px;font-weight:400;color:var(--text3)">Rimuove il record dal database — irreversibile</span>
          </button>
          <button onclick="document.getElementById('gb-del-modal').remove()" style="padding:8px 14px;font-size:13px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text2);cursor:pointer">Annulla</button>
        </div>
      </div>
    </div>`);
}

async function gbDoSoftDelete() {
  document.getElementById('gb-del-modal')?.remove();
  const aslKey = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
  const token  = await supaToken();
  const today  = new Date().toISOString().split('T')[0];
  const r = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}?codice=eq.${encodeURIComponent(gestioneCodice)}`, {
    method: 'PATCH',
    headers: { ...supaHdrs(token), 'Prefer': 'return=minimal' },
    body: JSON.stringify({ proposta_dismissione: today })
  });
  if (r.ok) {
    gbFullDev.proposta_dismissione = today;
    if (gbCurrentTab === 'dati') document.getElementById('gb-tab-content').innerHTML = gbRenderDati(gbFullDev, false);
    gbMsg('Proposta di dismissione registrata.', true);
  } else {
    gbMsg('Errore: ' + r.status, false);
  }
}

async function gbDoHardDelete() {
  if (!confirm(`Eliminare definitivamente "${gestioneCodice}"? Questa operazione non può essere annullata.`)) return;
  document.getElementById('gb-del-modal')?.remove();
  const aslKey = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
  const token  = await supaToken();
  const r = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}?codice=eq.${encodeURIComponent(gestioneCodice)}`, {
    method: 'DELETE',
    headers: supaHdrs(token)
  });
  if (r.ok) {
    delete DB[gestioneCodice];
    document.getElementById('gb-modal')?.remove();
    toast('Dispositivo eliminato.', 'ok');
  } else {
    gbMsg('Errore eliminazione: ' + r.status, false);
  }
}

// ── Tab Storico ──────────────────────────────────────────────
async function gbLoadStorico() {
  const content = document.getElementById('gb-tab-content');
  if (!content) return;
  const token = await supaToken();
  const r = await fetch(
    `${SUPA_URL}/rest/v1/sessione_schede?codice=eq.${encodeURIComponent(gestioneCodice)}&select=sessione_id,dati_vse,dati_mp,dati_vsp,dati_cq,vsp_type,cq_type,sessioni(titolo,data_verifica)&order=sessione_id.desc&limit=50`,
    { headers: supaHdrs(token) }
  );
  if (!r.ok) { content.innerHTML = '<div style="padding:24px;text-align:center;color:var(--ko)">Errore caricamento storico</div>'; return; }
  const rows = await r.json();
  if (!rows.length) {
    content.innerHTML = '<div style="padding:32px;text-align:center;color:var(--text3);font-size:13px">Nessuna verifica registrata per questo dispositivo</div>';
    return;
  }
  const _fmt = v => v ? new Date(v).toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit', year:'numeric' }) : '—';
  const _badge = (ok, label) => {
    if (!label) return '<span style="color:var(--text3);font-size:12px">—</span>';
    const col = ok === true ? 'var(--ok)' : ok === false ? 'var(--ko)' : 'var(--info)';
    const bg  = ok === true ? 'var(--ok-bg)' : ok === false ? 'var(--ko-bg)' : 'var(--info-bg)';
    return `<span style="display:inline-block;padding:1px 7px;border-radius:10px;font-size:11px;font-weight:600;color:${col};background:${bg}">${_esc(label)}</span>`;
  };
  content.innerHTML = `
    <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:480px">
      <thead>
        <tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600;white-space:nowrap">Data</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Sessione</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Verificatore</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text3);font-weight:600">VSE</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text3);font-weight:600">MP</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text3);font-weight:600">VSP</th>
          <th style="text-align:center;padding:6px 8px;color:var(--text3);font-weight:600">CQ</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => {
          const sess  = row.sessioni || {};
          const data  = _fmt(sess.data_verifica);
          const nome  = '—';
          const titolo = sess.titolo || '—';
          // VSE: campo giu = POSITIVO / NEGATIVO / altro
          const giu = row.dati_vse?.giu;
          const vseOk = giu === 'POSITIVO' ? true : giu ? false : null;
          const vseLbl = giu || (row.dati_vse ? '✓' : null);
          // MP: solo presenza
          const mpLbl = row.dati_mp ? '✓' : null;
          // VSP: tipo abbreviato
          const vspTipo = (row.vsp_type || '').replace('VSP_', '');
          const vspLbl = row.dati_vsp ? (vspTipo || '✓') : null;
          // CQ: tipo abbreviato
          const cqTipo = (row.cq_type || '').replace('CQ_', '');
          const cqLbl = row.dati_cq ? (cqTipo || '✓') : null;
          return `<tr style="border-bottom:1px solid var(--border)">
            <td style="padding:8px 10px;white-space:nowrap;color:var(--text)">${data}</td>
            <td style="padding:8px 10px;color:var(--text2);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${_esc(titolo)}">${_esc(titolo)}</td>
            <td style="padding:8px 10px;color:var(--text3);font-size:12px;white-space:nowrap">${_esc(nome)}</td>
            <td style="padding:8px;text-align:center">${_badge(vseOk, vseLbl)}</td>
            <td style="padding:8px;text-align:center">${_badge(null, mpLbl)}</td>
            <td style="padding:8px;text-align:center">${_badge(null, vspLbl)}</td>
            <td style="padding:8px;text-align:center">${_badge(null, cqLbl)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
    </div>`;
}

// ── Tab Scadenze ─────────────────────────────────────────────
function gbRenderScadenze(dev) {
  if (!dev) return '<div style="padding:24px;text-align:center;color:var(--text3)">Nessun dato</div>';
  const today = new Date();
  const _semaforo = prossima => {
    if (!prossima) return '<span style="color:var(--text3)">—</span>';
    const diff = (new Date(prossima) - today) / 86400000;
    if (diff < 0)  return '<span style="color:var(--ko)" title="Scaduto">● Scaduto</span>';
    if (diff < 30) return '<span style="color:var(--warn)" title="Entro 30 giorni">● &lt;30gg</span>';
    return '<span style="color:var(--ok)">●</span>';
  };
  const _fmt = v => { const m = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : '—'; };

  const tipi = [
    { tipo: 'VSE', per: 'periodicita_vse', ult: 'data_ultima_vse', esi: 'esito_ultima_vse', pro: 'data_prossima_vse' },
    { tipo: 'VSP', per: 'periodicita_vsp', ult: 'data_ultima_vsp', esi: 'esito_ultima_vsp', pro: 'data_prossima_vsp' },
    { tipo: 'MO',  per: 'periodicita_mo',  ult: 'data_ultima_mo',  esi: 'esito_ultima_mo',  pro: 'data_prossima_mo'  },
    { tipo: 'CQ',  per: 'periodicita_cq',  ult: 'data_ultima_cq',  esi: 'esito_ultima_cq',  pro: 'data_prossima_cq'  },
  ];
  return `
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="border-bottom:2px solid var(--border)">
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Tipo</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Periodicità</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Ultima verifica</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Esito ultima verifica</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Prossima verifica</th>
          <th style="text-align:left;padding:6px 10px;color:var(--text3);font-weight:600">Stato</th>
        </tr>
      </thead>
      <tbody>
        ${tipi.map(t => {
          const prossima = dev[t.pro] || _calcProssima(dev[t.ult], dev[t.per]);
          return `
          <tr style="border-bottom:1px solid var(--border)">
            <td style="padding:8px 10px;font-weight:600">${t.tipo}</td>
            <td style="padding:8px 10px;color:var(--text2)">${dev[t.per] || '—'}</td>
            <td style="padding:8px 10px">${_fmt(dev[t.ult])}</td>
            <td style="padding:8px 10px;color:var(--text2)">${dev[t.esi] || '—'}</td>
            <td style="padding:8px 10px">${_fmt(prossima)}</td>
            <td style="padding:8px 10px">${_semaforo(prossima)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ── Lookup: aggiunta valore ───────────────────────────────────
function gbAddLookupValue(campo, label) {
  const input = document.getElementById('gb-f-' + campo);
  const valore = input ? input.value.trim() : '';
  if (!valore) { gbMsg('Inserisci un valore nel campo prima di aggiungerlo alla lista.', false); return; }
  if (isValidLookup(campo, valore)) { gbMsg(`"${_esc(valore)}" è già presente nella lista.`, false); return; }

  document.getElementById('gb-add-lookup-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div id="gb-add-lookup-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:20000;display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:340px;padding:20px">
        <div style="font-size:14px;font-weight:600;margin-bottom:10px;color:var(--text)">Aggiungi alla lista</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:16px">
          Aggiungere <strong>${_esc(valore)}</strong> alla lista del campo <em>${_esc(label)}</em>?<br>
          <span style="font-size:11px;color:var(--text3)">Il valore sarà disponibile per tutti gli utenti dell'ASL.</span>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button onclick="document.getElementById('gb-add-lookup-modal').remove()"
            style="padding:7px 14px;font-size:13px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text);cursor:pointer">Annulla</button>
          <button onclick="gbConfirmAddLookup('${_esc(campo)}','${_esc(valore)}')"
            style="padding:7px 14px;font-size:13px;font-weight:600;border:none;border-radius:var(--rad);background:var(--info);color:#fff;cursor:pointer">Aggiungi</button>
        </div>
      </div>
    </div>`);
}

async function gbConfirmAddLookup(campo, valore) {
  document.getElementById('gb-add-lookup-modal')?.remove();
  await saveLookupValue(campo, valore);
  gbMsg(`"${valore}" aggiunto alla lista.`, true);
}

function _gbValidateLookups() {
  const errors = []; // [{k, val, label}]
  // Campi lookup standard
  LOOKUP_KEYS.forEach(k => {
    const el = document.getElementById('gb-f-' + k);
    if (!el) return;
    const val = el.value.trim();
    if (val && !isValidLookup(k, val)) {
      const lbl = el.closest('.anag-field')?.querySelector('label')?.textContent?.trim() || k;
      errors.push({ k, val, lbl });
      el.style.outline = '2px solid var(--ko)';
    } else {
      el.style.outline = '';
    }
  });
  // Jolly bloccate
  document.querySelectorAll('#gb-tab-content [data-jolly-bloccata]').forEach(el => {
    const k   = el.dataset.k;
    const val = el.value.trim();
    if (val && !isValidLookup(k, val)) {
      const lbl = el.closest('.anag-field')?.querySelector('label')?.textContent?.trim() || k;
      errors.push({ k, val, lbl });
      el.style.outline = '2px solid var(--ko)';
    } else {
      el.style.outline = '';
    }
  });
  return errors;
}

function _gbRefreshViews() {
  // Aggiorna ricerca principale (verifica)
  const q = document.getElementById('search-input')?.value?.trim();
  if (q && q.length >= 2) doSearch();
  // Aggiorna lista anagrafica e tabella
  if (typeof searchAnagrafica === 'function') searchAnagrafica();
  if (typeof tableData !== 'undefined' && tableData && typeof renderTableView === 'function') renderTableView();
}

// ── Messaggi ─────────────────────────────────────────────────
function gbMsg(text, ok) {
  // Toast sempre visibile (gb-msg può essere fuori dal viewport)
  toast(text, ok ? 'ok' : 'warn');
  const msg = document.getElementById('gb-msg');
  if (!msg) return;
  msg.textContent = text;
  msg.style.display    = 'block';
  msg.style.background = ok ? 'var(--ok-bg)' : 'var(--ko-bg)';
  msg.style.color      = ok ? 'var(--ok)'    : 'var(--ko)';
  setTimeout(() => { if (msg) msg.style.display = 'none'; }, 4000);
}
