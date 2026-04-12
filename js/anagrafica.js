// ── ANAGRAFICA: lista, filtri, dettaglio, tabella ──

const ANAG_GROUPS = [
  { id:'id', label:'Identificazione', fields:[
    {k:'codice',l:'Codice',ro:true,req:true},
    {k:'codice_padre',l:'Codice Padre'},
    {k:'descrizione_classe',l:'Descrizione Classe',full:true,req:true},
    {k:'costruttore',l:'Costruttore',req:true},
    {k:'modello',l:'Modello',req:true},
    {k:'matricola',l:'Matricola'},
    {k:'civab',l:'CIVAB'},
  ]},
  { id:'loc', label:'Collocazione', fields:[
    {k:'cliente',l:'Cliente'},
    {k:'presidio',l:'Presidio'},
    {k:'reparto',l:'Reparto'},
    {k:'nuova_area',l:'Nuova Area'},
    {k:'sede_struttura',l:'Sede Struttura'},
    {k:'stanza',l:'Stanza'},
  ]},
  { id:'stato', label:'Stato e Ciclo di Vita', fields:[
    {k:'dettagli_stato',l:'Stato'},
    {k:'presenze_effettive',l:'Presenze Effettive'},
    {k:'proprieta',l:'Proprietà'},
    {k:'forma_presenza',l:'Forma Presenza'},
    {k:'data_collaudo',l:'Data Collaudo'},
    {k:'data_fine_garanzia',l:'Fine Garanzia'},
    {k:'manutentore',l:'Manutentore'},
    {k:'fine_service_comodato',l:'Fine Comodato'},
    {k:'proposta_dismissione',l:'Proposta Dismissione'},
    {k:'dismissione_effettiva',l:'Dismissione Effettiva'},
  ]},
  { id:'verif', label:'Verifiche', cols4:true, fields:[
    {k:'verifiche',l:'Tipi Verifica',full:true},
    {k:'periodicita_vse',l:'Period. VSE'},{k:'data_ultima_vse',l:'Data Ultima VSE'},{k:'esito_ultima_vse',l:'Esito Ultima VSE'},{k:'data_prossima_vse',l:'Prossima VSE'},
    {k:'periodicita_vsp',l:'Period. VSP'},{k:'data_ultima_vsp',l:'Data Ultima VSP'},{k:'esito_ultima_vsp',l:'Esito Ultima VSP'},{k:'data_prossima_vsp',l:'Prossima VSP'},
    {k:'periodicita_mo',l:'Period. MO'},{k:'data_ultima_mo',l:'Data Ultima MO'},{k:'esito_ultima_mo',l:'Esito Ultima MO'},{k:'data_prossima_mo',l:'Prossima MO'},
    {k:'periodicita_cq',l:'Period. CQ'},{k:'data_ultima_cq',l:'Data Ultima CQ'},{k:'esito_ultima_cq',l:'Esito Ultima CQ'},{k:'data_prossima_cq',l:'Prossima CQ'},
  ]},
  { id:'note', label:'Note', fields:[
    {k:'note_programmate',l:'Note Programmate',full:true,ta:true},
    {k:'note_inventario',l:'Note Inventario',full:true,ta:true},
  ]},
];

let anagPage = 0;
const ANAG_PER_PAGE = 30;
let anagResults = [];
let anagCurDev = null;
let anagIsNew = false;
let showArchiviati = false;

function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
  const closeBtn = document.getElementById('sb-close-btn');
  if (closeBtn) closeBtn.style.display = document.body.classList.contains('sidebar-open') ? 'flex' : 'none';
}

function sbNav(key) {
  ['verifica','sessione','anagrafica','tabella','archivio','gestione'].forEach(k => {
    const sb = document.getElementById('sb-nav-' + k);
    if (sb) sb.classList.toggle('active', k === key);
    const bn = document.getElementById('bnav-' + k);
    if (bn) bn.classList.toggle('active', k === key);
  });
  // sezioni principali
  const homeSec = document.getElementById('home-section');
  if (homeSec) homeSec.style.display = 'none';
  const verifSec = document.getElementById('verifica-section');
  if (verifSec) verifSec.style.display = key === 'verifica' ? '' : 'none';
  if (key !== 'anagrafica') document.getElementById('anag-section').style.display = 'none';
  if (key !== 'tabella')    document.getElementById('tabella-section').style.display = 'none';
  const gbSec = document.getElementById('gestione-bene-section');
  if (gbSec) gbSec.style.display = key === 'gestione' ? '' : 'none';
  // chiudi sidebar su mobile dopo la navigazione
  if (window.innerWidth < 768 && document.body.classList.contains('sidebar-open')) {
    toggleSidebar();
  }
}

function toggleAnagrafica() { openAnagrafica(); }
function openAnagrafica() {
  document.getElementById('anag-section').style.display = 'block';
  if (!document.getElementById('af-item-loc')) { buildAnagFilterGrid(); initAfState(); updateAllAfBtns(); }
  searchAnagrafica();
  document.getElementById('anag-input').focus();
}
function closeAnagrafica() {
  document.getElementById('anag-section').style.display = 'none';
  document.getElementById('sb-nav-verifica').classList.add('active');
  document.getElementById('sb-nav-anagrafica').classList.remove('active');
}

function toggleAnagFilters() {
  const body = document.getElementById('anag-filter-body');
  const tog  = document.getElementById('anag-filter-toggle');
  const open = body.classList.toggle('open');
  tog.textContent = open ? '▴' : '▾';
}

// Definizione filtri multi-select
// fixedVals: valori fissi (non estratti dal DB); defaultSel: selezionati di default
const ANAG_FILTER_DEFS = [
  {key:'loc', label:'Presidio'},
  {key:'ss',  label:'Sede Struttura'},
  {key:'rep', label:'Reparto'},
  {key:'na',  label:'Nuova Area'},
  {key:'cp',  label:'Codice Padre'},
  {key:'b',   label:'Costruttore'},
  {key:'m',   label:'Modello'},
  {key:'pe',  label:'Presenze Eff.'},
];

// Stato filtri: key → Set di valori selezionati (Set vuoto = tutti)
let afState = {};

function initAfState() {
  ANAG_FILTER_DEFS.forEach(d => {
    afState[d.key] = d.defaultSel ? new Set(d.defaultSel) : new Set();
  });
}

function _anagDbVal(d, key) { return d[key] || ''; }

function _matchesQuery(d, q) {
  return d.c.includes(q) ||
    (d.n||'').toLowerCase().includes(q) ||
    (d.b||'').toLowerCase().includes(q) ||
    (d.m||'').toLowerCase().includes(q) ||
    (d.mat||'').toLowerCase().includes(q) ||
    (d.rep||'').toLowerCase().includes(q) ||
    (d.loc||'').toLowerCase().includes(q) ||
    (d.ss||'').toLowerCase().includes(q) ||
    (d.na||'').toLowerCase().includes(q) ||
    (d.cp||'').toLowerCase().includes(q);
}

function _deviceMatchesFilters(d, excludeKey) {
  for (const def of ANAG_FILTER_DEFS) {
    if (def.key === excludeKey) continue;
    const sel = afState[def.key];
    if (sel.size > 0 && !sel.has(_anagDbVal(d, def.key))) return false;
  }
  return true;
}

function buildAnagFilterGrid() {
  const grid = document.getElementById('anag-filter-grid');
  if (!grid) return;
  grid.innerHTML = ANAG_FILTER_DEFS.map(def => `
    <div class="af-item" id="af-item-${def.key}">
      <button class="af-btn" id="af-btn-${def.key}" onclick="toggleAfPanel('${def.key}')">
        <span class="af-btn-label">${def.label}</span>
        <span class="af-btn-val" id="af-bval-${def.key}">Tutti</span>
        <span>▾</span>
      </button>
      <div class="af-panel" id="af-panel-${def.key}">
        <div id="af-checks-${def.key}"></div>
        <div class="af-panel-footer">
          <button onclick="afSelectAll('${def.key}')">Tutti</button>
          <button onclick="afClearAll('${def.key}')">Nessuno</button>
        </div>
      </div>
    </div>`).join('');
  // Chiudi panel cliccando fuori
  document.addEventListener('click', e => {
    if (!e.target.closest('.af-item')) closeAllAfPanels();
  }, {capture:true});
}

function toggleAfPanel(key) {
  const panel = document.getElementById('af-panel-'+key);
  const isOpen = panel.classList.contains('open');
  closeAllAfPanels();
  if (!isOpen) { updateAfPanel(key); panel.classList.add('open'); }
}
function closeAllAfPanels() {
  document.querySelectorAll('.af-panel.open').forEach(p => p.classList.remove('open'));
}

function updateAfPanel(key) {
  const def = ANAG_FILTER_DEFS.find(d => d.key === key);
  const q = (document.getElementById('anag-input').value||'').trim().toLowerCase();
  const all = Object.values(DB);
  // Valori disponibili = subset che passa tutti gli ALTRI filtri
  const subset = all.filter(d => (q ? _matchesQuery(d, q) : true) && _deviceMatchesFilters(d, key));
  const available = def.fixedVals
    ? def.fixedVals.filter(v => subset.some(d => _anagDbVal(d, key) === v))
    : [...new Set(subset.map(d => _anagDbVal(d, key)).filter(Boolean))].sort();
  // Tutti i valori selezionati (anche non più disponibili) per mostrarli greyed
  const allVals = def.fixedVals ? def.fixedVals : available;
  const sel = afState[key];
  document.getElementById('af-checks-'+key).innerHTML = allVals.map(v => {
    const avail = available.includes(v);
    const checked = sel.has(v);
    const cnt = subset.filter(d => _anagDbVal(d, key) === v).length;
    return `<label class="af-check-item${avail?'':' disabled'}">
      <input type="checkbox" ${checked?'checked':''} onchange="afToggleVal('${key}','${_esc(v)}',this.checked)">
      <span>${_esc(v)}</span><span style="margin-left:auto;font-size:11px;color:var(--text3)">${avail?cnt:''}</span>
    </label>`;
  }).join('');
}

function afToggleVal(key, val, checked) {
  const sel = afState[key];
  checked ? sel.add(val) : sel.delete(val);
  updateAfBtn(key);
  searchAnagrafica();
  updateAfPanel(key); // aggiorna conteggi e disponibilità
}

function afSelectAll(key) {
  afState[key] = new Set();
  updateAfBtn(key); closeAllAfPanels(); searchAnagrafica();
}
function afClearAll(key) {
  const def = ANAG_FILTER_DEFS.find(d => d.key === key);
  afState[key] = def.defaultSel ? new Set(def.defaultSel) : new Set();
  updateAfBtn(key); closeAllAfPanels(); searchAnagrafica();
}

function updateAfBtn(key) {
  const sel = afState[key];
  const btn = document.getElementById('af-btn-'+key);
  const val = document.getElementById('af-bval-'+key);
  if (!btn||!val) return;
  if (sel.size === 0) {
    val.textContent = 'Tutti';
    btn.classList.remove('active');
  } else {
    const arr = [...sel];
    val.textContent = arr.length <= 2 ? arr.join(', ') : `${arr.length} selezionati`;
    btn.classList.add('active');
  }
}

function updateAllAfBtns() { ANAG_FILTER_DEFS.forEach(d => updateAfBtn(d.key)); }

function countActiveFilters() {
  return ANAG_FILTER_DEFS.filter(d => afState[d.key]?.size > 0).length;
}

function populateAnagFilters() {
  if (!document.getElementById('af-item-loc')) buildAnagFilterGrid();
  initAfState();
  updateAllAfBtns();
}

function resetAnagFilters() {
  initAfState();
  updateAllAfBtns();
  searchAnagrafica();
}

function toggleArchiviati() {
  showArchiviati = !showArchiviati;
  const label = showArchiviati ? 'Archiviati: ON' : 'Archiviati: OFF';
  ['btn-toggle-archiviati-anag','btn-toggle-archiviati-tbl'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = label; el.style.opacity = showArchiviati ? '1' : '0.6'; }
  });
  searchAnagrafica();
  if (tableData) renderTableView();
}

function searchAnagrafica() {
  if (!afState || !ANAG_FILTER_DEFS.length) return;
  const q = (document.getElementById('anag-input').value||'').trim().toLowerCase();
  anagPage = 0;
  anagResults = Object.values(DB).filter(d => {
    if (!showArchiviati && (d.pe||'').toLowerCase() === 'archiviato') return false;
    if (q && !_matchesQuery(d, q)) return false;
    return _deviceMatchesFilters(d, null);
  });
  const n = countActiveFilters();
  const countEl = document.getElementById('anag-filter-count');
  if (countEl) countEl.textContent = n ? `${n} attivo${n>1?'i':''}` : '';
  renderAnagList();
}

function renderAnagList() {
  const list = document.getElementById('anag-list');
  const pag  = document.getElementById('anag-pagination');
  const start = anagPage * ANAG_PER_PAGE;
  const page  = anagResults.slice(start, start + ANAG_PER_PAGE);
  if (!page.length) {
    list.innerHTML = '<div class="not-found">Nessun dispositivo trovato</div>';
    pag.style.display = 'none'; return;
  }
  list.innerHTML = page.map(d => `
    <div class="anag-item" onclick="openAnagDetail('${d.c}')">
      <span class="anag-cod">${d.c}</span>
      <div class="anag-info">
        <div class="anag-nome">${_esc(d.n||'—')}</div>
        <div class="anag-loc">${[d.b,d.m,d.rep].filter(Boolean).map(_esc).join(' · ')}</div>
      </div>
      <span class="anag-arrow">›</span>
    </div>`).join('');
  const tp = Math.ceil(anagResults.length / ANAG_PER_PAGE);
  if (tp > 1) {
    pag.style.display = 'flex';
    document.getElementById('anag-page-info').textContent = `Pag. ${anagPage+1}/${tp} — ${anagResults.length} disp.`;
    pag.querySelector('button:first-child').disabled = anagPage === 0;
    pag.querySelector('button:last-child').disabled  = anagPage >= tp-1;
  } else { pag.style.display = 'none'; }
}
function anagPrev(){ if(anagPage>0){anagPage--;renderAnagList();} }
function anagNext(){ const tp=Math.ceil(anagResults.length/ANAG_PER_PAGE); if(anagPage<tp-1){anagPage++;renderAnagList();} }

function _esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function getJollyMeta() {
  const aslKey = (currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  const _defaults = () => Array.from({length:22},(_,i)=>({label:`Jolly ${i+1}`,section:'jolly'}));
  const _normalize = v => typeof v==='string' ? {label:v,section:'jolly'} : (v&&v.label ? v : {label:`Jolly ?`,section:'jolly'});
  const _extend = arr => {
    if (!Array.isArray(arr)) return _defaults();
    arr = arr.map(_normalize);
    while (arr.length < 22) arr.push({label:`Jolly ${arr.length+1}`,section:'jolly'});
    return arr;
  };
  const s = localStorage.getItem('jolly_meta_'+aslKey);
  if (s) { try { return _extend(JSON.parse(s)); } catch(e) {} }
  // Backward compat: vecchio formato array di stringhe
  const old = localStorage.getItem('jolly_labels_'+aslKey);
  if (old) { try { return _extend(JSON.parse(old)); } catch(e) {} }
  return _defaults();
}
function saveJollyMeta(meta) {
  const aslKey = (currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  localStorage.setItem('jolly_meta_'+aslKey, JSON.stringify(meta));
  // Salva su Supabase in background (sync tra dispositivi)
  supaToken().then(token => {
    fetch(`${SUPA_URL}/rest/v1/config_asl`, {
      method: 'POST',
      headers: {...supaHdrs(token), 'Prefer': 'resolution=merge-duplicates'},
      body: JSON.stringify({asl: aslKey, jolly_labels: meta})
    }).catch(() => {});
  });
}
async function loadJollyMetaFromDB() {
  const aslKey = (currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  try {
    const token = await supaToken();
    const r = await fetch(`${SUPA_URL}/rest/v1/config_asl?asl=eq.${encodeURIComponent(aslKey)}&limit=1`,
      {headers: {'apikey': SUPA_KEY, 'Authorization': 'Bearer '+token}});
    if (!r.ok) return;
    const rows = await r.json();
    if (rows.length && rows[0].jolly_labels) {
      localStorage.setItem('jolly_meta_'+aslKey, JSON.stringify(rows[0].jolly_labels));
    }
  } catch(e) {}
}
function getJollyLabels() { return getJollyMeta().map(m=>m.label); }

async function openAnagDetail(codice) {
  const aslKey = (currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  const token = await supaToken();
  const r = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}?codice=eq.${codice}&limit=1`,
    {headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+token}});
  if (!r.ok) { toast('Errore caricamento dispositivo','warn'); return; }
  const rows = await r.json();
  if (!rows.length) { toast('Dispositivo non trovato','warn'); return; }
  anagCurDev = rows[0];
  renderAnagDetail();
  document.getElementById('anag-modal').classList.add('open');
}

function closeAnagModal() {
  document.getElementById('anag-modal').classList.remove('open');
  anagCurDev = null;
  anagIsNew = false;
}

function openNewDevice() {
  anagIsNew = true;
  anagCurDev = { cliente: (currentUser?.profile?.asl||'ASL BENEVENTO').toUpperCase() };
  renderAnagDetail();
  document.getElementById('anag-modal').classList.add('open');
}

function renderAnagDetail() {
  const d = anagCurDev;
  const jmeta = getJollyMeta();
  document.getElementById('anag-modal-title').textContent = anagIsNew
    ? 'Nuovo dispositivo'
    : `${d.codice} — ${d.descrizione_classe||''}`;

  // Raggruppa jolly per sezione
  const jollyBySection = {};
  jmeta.forEach((m,idx) => {
    const sec = m.section||'jolly';
    if (!jollyBySection[sec]) jollyBySection[sec]=[];
    jollyBySection[sec].push({...m,idx:idx+1});
  });

  // Converti data ISO → gg/mm/aaaa per la visualizzazione
  const _fmtDate = v => { const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})/); return m?`${m[3]}/${m[2]}/${m[1]}`:v||''; };

  const _jollyField = jf => {
    const k='jolly_'+jf.idx, v=_esc(d[k]||'');
    return `<div class="anag-field">
      <label><button class="jolly-lbl-btn" onclick="editJollyLabel(${jf.idx})" title="Clicca per configurare">${_esc(jf.label)} ✎</button></label>
      <input type="text" id="anag-f-${k}" data-k="${k}" value="${v}">
    </div>`;
  };

  let html = '';
  for (const grp of ANAG_GROUPS) {
    const bodyCls = 'anag-grp-body'+(grp.cols4?' cols4':'');
    html += `<div class="anag-grp">
      <div class="anag-grp-hdr" onclick="toggleAnagGrp('${grp.id}')"><span>${grp.label}</span><span id="anag-tog-${grp.id}">▾</span></div>
      <div class="${bodyCls}" id="anag-grp-${grp.id}">`;
    for (const f of grp.fields) {
      const raw = d[f.k]||'';
      const v = _esc(f.ta ? raw : _fmtDate(raw));
      const cls = 'anag-field'+(f.full?' full':'');
      const isRo = f.ro && !anagIsNew;
      if (f.ta) html += `<div class="${cls}"><label>${f.l}</label><textarea id="anag-f-${f.k}" data-k="${f.k}">${v}</textarea></div>`;
      else      html += `<div class="${cls}"><label>${f.l}${f.req?' <span style="color:var(--ko)">*</span>':''}</label><input type="text" id="anag-f-${f.k}" data-k="${f.k}" value="${v}"${isRo?' readonly':''}></div>`;
    }
    // Jolly assegnati a questa sezione
    (jollyBySection[grp.id]||[]).forEach(jf => { html += _jollyField(jf); });
    html += `</div></div>`;
  }

  // Jolly non assegnati (sezione 'jolly')
  const remaining = jollyBySection['jolly']||[];
  if (remaining.length) {
    html += `<div class="anag-grp">
      <div class="anag-grp-hdr" onclick="toggleAnagGrp('jolly')"><span>Campi Jolly</span><span id="anag-tog-jolly">▾</span></div>
      <div class="anag-grp-body" id="anag-grp-jolly">`;
    remaining.forEach(jf => { html += _jollyField(jf); });
    html += `</div></div>`;
  }
  document.getElementById('anag-modal-body').innerHTML = html;
  const lbl = anagIsNew ? 'Inserisci dispositivo' : 'Salva modifiche';
  const btn1 = document.getElementById('anag-modal-save-btn');
  const btn2 = document.getElementById('anag-modal-save-btn2');
  if (btn1) btn1.textContent = anagIsNew ? 'Inserisci' : 'Salva';
  if (btn2) btn2.textContent = lbl;
}

function toggleAnagGrp(id) {
  const body = document.getElementById('anag-grp-'+id);
  const tog  = document.getElementById('anag-tog-'+id);
  const h = body.classList.toggle('hidden');
  tog.textContent = h ? '▸' : '▾';
}

async function saveAnagDetail() {
  if (!anagCurDev) return;
  const data = {};
  document.querySelectorAll('#anag-modal-body [data-k]').forEach(el => {
    if (el.readOnly) return;
    data[el.dataset.k] = el.value.trim() || null;
  });

  // Validazione campi obbligatori
  const required = ['codice','descrizione_classe','costruttore','modello'];
  const missing = required.filter(k => !data[k] && !(anagCurDev[k]));
  if (missing.length) {
    toast('Campi obbligatori mancanti: ' + missing.join(', '), 'warn');
    return;
  }

  const aslKey = (currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  const token = await supaToken();

  if (anagIsNew) {
    // Unisci con i dati di default (es. cliente)
    const body = Object.assign({}, anagCurDev, data);
    // Rimuovi chiavi null/undefined per la INSERT
    Object.keys(body).forEach(k => { if (body[k]==null) delete body[k]; });
    const r = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}`, {
      method:'POST',
      headers:{...supaHdrs(token),'Prefer':'return=minimal'},
      body:JSON.stringify(body)
    });
    if (!r.ok) {
      const txt = await r.text();
      if (txt.includes('duplicate') || txt.includes('unique')) toast('Codice già esistente nel DB','warn');
      else toast('Errore inserimento: ' + r.status, 'warn');
      return;
    }
    // Aggiorna cache DB
    const cod = body.codice;
    DB[cod] = {
      c: cod,
      n: body.descrizione_classe||'',
      b: body.costruttore||'',
      m: body.modello||'',
      mat: body.matricola||'',
      loc: body.presidio||'',
      rep: body.reparto||'',
      ss: body.sede_struttura||'',
      cp: body.codice_padre||'',
      na: body.nuova_area||'',
      pe: body.presenze_effettive||''
    };
    anagIsNew = false;
    toast('Dispositivo inserito', 'ok');
    closeAnagModal();
    searchAnagrafica();
  } else {
    const r = await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}?codice=eq.${anagCurDev.codice}`, {
      method:'PATCH', headers:{...supaHdrs(token),'Prefer':'return=minimal'}, body:JSON.stringify(data)
    });
    if (!r.ok) { toast('Errore salvataggio','warn'); return; }
    const cod = anagCurDev.codice;
    Object.assign(anagCurDev, data);
    if (DB[cod]) {
      if (data.descrizione_classe!==undefined) DB[cod].n = data.descrizione_classe||'';
      if (data.costruttore!==undefined) DB[cod].b = data.costruttore||'';
      if (data.modello!==undefined) DB[cod].m = data.modello||'';
      if (data.matricola!==undefined) DB[cod].mat = data.matricola||'';
      if (data.presidio!==undefined) DB[cod].loc = data.presidio||'';
      if (data.reparto!==undefined) DB[cod].rep = data.reparto||'';
    }
    toast('Salvato','ok');
  }
}

function editJollyLabel(i) {
  const meta = getJollyMeta();
  const m = meta[i-1];
  const SECTIONS = [
    {id:'id',    label:'Identificazione'},
    {id:'loc',   label:'Collocazione'},
    {id:'stato', label:'Stato e Ciclo di Vita'},
    {id:'verif', label:'Verifiche'},
    {id:'note',  label:'Note'},
    {id:'jolly', label:'Campi Jolly'},
  ];
  document.getElementById('jolly-edit-modal')?.remove();
  const opts = SECTIONS.map(s=>`<option value="${s.id}"${(m.section||'jolly')===s.id?' selected':''}>${s.label}</option>`).join('');
  document.body.insertAdjacentHTML('beforeend',`
    <div id="jolly-edit-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:20000;display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:320px;padding:20px">
        <div style="font-size:14px;font-weight:600;margin-bottom:14px;color:var(--text)">Configura Jolly ${i}</div>
        <div style="margin-bottom:10px">
          <label style="font-size:12px;color:var(--text2);display:block;margin-bottom:4px">Etichetta</label>
          <input id="jolly-edit-label" type="text" value="${_esc(m.label)}"
            style="width:100%;padding:7px 10px;border:1px solid var(--border2);border-radius:var(--rad);font-size:13px;background:var(--bg2);color:var(--text);box-sizing:border-box">
        </div>
        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:var(--text2);display:block;margin-bottom:4px">Sezione</label>
          <select id="jolly-edit-section"
            style="width:100%;padding:7px 10px;border:1px solid var(--border2);border-radius:var(--rad);font-size:13px;background:var(--bg2);color:var(--text);box-sizing:border-box">
            ${opts}
          </select>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button onclick="document.getElementById('jolly-edit-modal').remove()"
            style="padding:7px 14px;font-size:13px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text);cursor:pointer">Annulla</button>
          <button onclick="saveJollyEdit(${i})"
            style="padding:7px 14px;font-size:13px;border:none;border-radius:var(--rad);background:var(--info);color:#fff;cursor:pointer;font-weight:600">Salva</button>
        </div>
      </div>
    </div>`);
  document.getElementById('jolly-edit-label').focus();
}
function saveJollyEdit(i) {
  const label = document.getElementById('jolly-edit-label').value.trim() || `Jolly ${i}`;
  const section = document.getElementById('jolly-edit-section').value;
  const meta = getJollyMeta();
  meta[i-1] = {label, section};
  saveJollyMeta(meta);
  document.getElementById('jolly-edit-modal').remove();
  renderAnagDetail();
}

async function importAnagraficaFromExcel(input) {
  const file = input.files[0]; if (!file) return;
  input.value = '';
  if (typeof XLSX === 'undefined') {
    toast('Caricamento libreria...','warn');
    await new Promise(res=>{ const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'; s.onload=res; document.head.appendChild(s); });
  }
  const wb = XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:true});
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) { toast('Foglio non trovato','warn'); return; }
  const COL_MAP = [
    ['Codice','codice'],['Codice padre','codice_padre'],['Descrizione Classe','descrizione_classe'],
    ['Costruttore','costruttore'],['Modello','modello'],['Matricola','matricola'],
    ['Cliente','cliente'],['Presidio','presidio'],['Reparto','reparto'],
    ['NUOVA AREA','nuova_area'],['Sede Struttura','sede_struttura'],['Stanza','stanza'],
    ['CIVAB','civab'],['Verifiche','verifiche'],
    ['Proposta dismissione','proposta_dismissione'],['Dismissione effettiva','dismissione_effettiva'],
    ['Dettagli Stato','dettagli_stato'],['Manutentore (ID_Assistenza)','manutentore'],
    ['Data fine Garanzia','data_fine_garanzia'],
    ["PERIODICITA' VSE",'periodicita_vse'],['VSE 23/24','jolly_11'],['VSE 24/25','data_ultima_vse'],['VSE 25/26','esito_ultima_vse'],['Data prossima VSE','data_prossima_vse'],
    ["PERIODICITA' VPS",'periodicita_vsp'],['VSP 23/24','jolly_12'],['VSP 24/25','data_ultima_vsp'],['VSP 25/26','esito_ultima_vsp'],['Data prossima VSP','data_prossima_vsp'],
    ["PERIODICITA' MO",'periodicita_mo'],['MO 23/24','mo_2324'],['MO 24/25','mo_2425'],['MO 25/26','mo_2526'],['Data prossima MO','data_prossima_mp'],
    ["PERIODICITA' CQ",'periodicita_cq'],['CQ  23/24','jolly_14'],['CQ  24/25','data_ultima_cq'],['CQ  25/26','esito_ultima_cq'],['Data prossimo CQ','data_prossima_cq'],
    ['NOTE PROGRAMMATE','note_programmate'],['NOTE INVENTARIO','note_inventario'],
    ['Presenze Effettive','presenze_effettive'],['Esito Verifica','jolly_16'],
    ['Esito Verifica anno precedente','jolly_17'],
    ['Proprietà','proprieta'],['Fine Service Comodato','fine_service_comodato'],
    ['Forma di Presenza8','forma_presenza'],['Data Collaudo','data_collaudo'],
  ];
  const NULL_PH = new Set(['-','/','n/a','n.a.','nd','n.d.','']);
  const toStr = v => {
    if (v==null) return null;
    if (v instanceof Date) {
      if (isNaN(v.getTime())) return null;
      return v.getDate().toString().padStart(2,'0')+'/'+(v.getMonth()+1).toString().padStart(2,'0')+'/'+v.getFullYear();
    }
    const s=String(v).trim();
    if (NULL_PH.has(s.toLowerCase())) return null;
    if (/^\d+$/.test(s)){const n=parseInt(s,10);if(n>=30000&&n<=60000){const d=new Date(Math.round((n-25569)*86400*1000));return d.getUTCDate().toString().padStart(2,'0')+'/'+(d.getUTCMonth()+1).toString().padStart(2,'0')+'/'+d.getUTCFullYear();}}
    return s||null;
  };
  const raw = XLSX.utils.sheet_to_json(ws,{raw:false,defval:null});
  const rows = raw.map(r=>{
    const obj={};
    COL_MAP.forEach(([ec,dc])=>{obj[dc]=toStr(r[ec]);});
    if(obj.codice) obj.codice=String(obj.codice).replace(/\D/g,'').padStart(7,'0');
    return obj;
  }).filter(r=>r.codice&&r.codice!=='0000000');
  const seen=new Map(); rows.forEach(r=>seen.set(r.codice,r));
  const deduped=[...seen.values()];
  const aslKey=(currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  const token=await supaToken();
  toast(`Import ${deduped.length} dispositivi...`,'warn');
  let total=0; const CHUNK=200;
  for(let i=0;i<deduped.length;i+=CHUNK){
    const chunk=deduped.slice(i,i+CHUNK);
    const r=await fetch(`${SUPA_URL}/rest/v1/dispositivi_${aslKey}`,{
      method:'POST',headers:{...supaHdrs(token),'Prefer':'return=minimal,resolution=merge-duplicates'},body:JSON.stringify(chunk)
    });
    if(!r.ok){const t=await r.text();toast(`Errore import: ${t.slice(0,80)}`,'warn');break;}
    total+=chunk.length;
  }
  await initDB();
  toast(total?`Importati ${total} dispositivi`:'Nessun dispositivo importato',total?'ok':'warn');
}

// ── VISTA TABELLA UFFICIO ─────────────────────────────────────

const TBL_COLS = [
  {k:'codice',l:'Codice',w:90},
  {k:'codice_padre',l:'Cod. Padre',w:90},
  {k:'descrizione_classe',l:'Descrizione',w:200},
  {k:'costruttore',l:'Costruttore',w:130},
  {k:'modello',l:'Modello',w:130},
  {k:'matricola',l:'Matricola',w:110},
  {k:'civab',l:'CIVAB',w:80},
  {k:'cliente',l:'Cliente',w:110},
  {k:'presidio',l:'Presidio',w:110},
  {k:'reparto',l:'Reparto',w:130},
  {k:'nuova_area',l:'Nuova Area',w:110},
  {k:'sede_struttura',l:'Sede Struttura',w:130},
  {k:'stanza',l:'Stanza',w:80},
  {k:'dettagli_stato',l:'Stato',w:100},
  {k:'presenze_effettive',l:'Presenze',w:80},
  {k:'proprieta',l:'Proprietà',w:90},
  {k:'forma_presenza',l:'Forma Pres.',w:110},
  {k:'data_collaudo',l:'Collaudo',w:90},
  {k:'data_fine_garanzia',l:'Fine Garanzia',w:100},
  {k:'manutentore',l:'Manutentore',w:110},
  {k:'fine_service_comodato',l:'Fine Comodato',w:110},
  {k:'proposta_dismissione',l:'Prop. Dismis.',w:110},
  {k:'dismissione_effettiva',l:'Dismis. Eff.',w:110},
  {k:'verifiche',l:'Verifiche',w:100},
  {k:'periodicita_vse',l:'Period. VSE',w:90},
  {k:'data_ultima_vse',l:'Data Ult. VSE',w:100},
  {k:'esito_ultima_vse',l:'Esito Ult. VSE',w:100},
  {k:'data_prossima_vse',l:'Prox. VSE',w:90},
  {k:'periodicita_vsp',l:'Period. VSP',w:90},
  {k:'data_ultima_vsp',l:'Data Ult. VSP',w:100},
  {k:'esito_ultima_vsp',l:'Esito Ult. VSP',w:100},
  {k:'data_prossima_vsp',l:'Prox. VSP',w:90},
  {k:'periodicita_mo',l:'Period. MO',w:90},
  {k:'data_ultima_mo',l:'Data Ult. MO',w:100},
  {k:'esito_ultima_mo',l:'Esito Ult. MO',w:100},
  {k:'data_prossima_mo',l:'Prox. MO',w:90},
  {k:'periodicita_cq',l:'Period. CQ',w:90},
  {k:'data_ultima_cq',l:'Data Ult. CQ',w:100},
  {k:'esito_ultima_cq',l:'Esito Ult. CQ',w:100},
  {k:'data_prossima_cq',l:'Prox. CQ',w:90},
  {k:'note_programmate',l:'Note Prog.',w:160},
  {k:'note_inventario',l:'Note Inv.',w:160},
];

let tableData       = null;   // null = non ancora caricato
let tableColFilters = {};     // {colKey: Set<string>}  Set vuoto = nessun filtro
let tableSortCol    = 'codice';
let tableSortDir    = 1;      // 1=asc, -1=desc
let tableHiddenCols = new Set();
let tableSelected   = new Set();
let tableViews      = [];     // [{name, hidden:[...]}]
let tableSearchQ    = '';
// virtual scroll
const TBL_ROW_H   = 28;      // px per riga — deve corrispondere al CSS
const TBL_BUFFER  = 60;      // righe extra sopra/sotto il viewport
let _tblRows      = [];      // righe filtrate/ordinate correnti (cache)
let _tblCols      = [];      // colonne visibili correnti (cache)
let _tblRaf       = null;    // requestAnimationFrame handle
let _tblSearchTm  = null;    // debounce handle per la ricerca

function _getTblCols() {
  const jl = getJollyLabels();
  const cols = [...TBL_COLS];
  for (let i=1;i<=22;i++) cols.push({k:'jolly_'+i, l:jl[i-1]||`Jolly ${i}`, w:100});
  return cols;
}

async function toggleTabella() { await openTabella(); }
async function openTabella() {
  document.getElementById('tabella-section').style.display = 'block';
  loadTableColConfig();
  if (!tableData) await loadTableData();
  else renderTableView();
}
function closeTabella() {
  document.getElementById('tabella-section').style.display = 'none';
  document.getElementById('sb-nav-verifica').classList.add('active');
  document.getElementById('sb-nav-tabella').classList.remove('active');
}

async function tblReload() {
  tableData = null;
  await loadTableData();
}

async function loadTableData() {
  const el = document.getElementById('tbl-loading');
  el.style.display = 'block';
  document.getElementById('tbl-table-wrap').innerHTML = '';
  const aslKey = (currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  const token = await supaToken();
  let all = [], offset = 0;
  while (true) {
    const r = await fetch(
      `${SUPA_URL}/rest/v1/dispositivi_${aslKey}?select=*&limit=1000&offset=${offset}`,
      {headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+token,'Range-Unit':'items'}}
    );
    if (!r.ok) { toast('Errore caricamento tabella','warn'); break; }
    const rows = await r.json();
    all = all.concat(rows);
    if (rows.length < 1000) break;
    offset += 1000;
  }
  tableData = all;
  el.style.display = 'none';
  tableSelected = new Set(all.map(r => r.codice));
  renderTableView();
  toast(`${all.length} dispositivi caricati`, 'ok');
}

function _tblFilteredRows() {
  if (!tableData) return [];
  const q = tableSearchQ.toLowerCase();
  const cols = _getTblCols();
  return tableData.filter(row => {
    if (!showArchiviati && (row.presenze_effettive||'').toLowerCase() === 'archiviato') return false;
    if (q && !cols.some(c => (row[c.k]||'').toLowerCase().includes(q))) return false;
    for (const [k, vals] of Object.entries(tableColFilters)) {
      if (!vals || vals.size === 0) continue;
      if (!vals.has(row[k]||'')) return false;
    }
    return true;
  }).sort((a,b) => {
    const av = a[tableSortCol]||'', bv = b[tableSortCol]||'';
    return av < bv ? -tableSortDir : av > bv ? tableSortDir : 0;
  });
}

function renderTableView() {
  _tblRows = _tblFilteredRows();
  _tblCols = _getTblCols().filter(c => !tableHiddenCols.has(c.k));
  const rows = _tblRows, cols = _tblCols;

  const selCount = rows.filter(r => tableSelected.has(r.codice)).length;
  const allSel   = rows.length > 0 && rows.every(r => tableSelected.has(r.codice));
  document.getElementById('tbl-sel-count').textContent = selCount > 0 ? `${selCount} selezionati` : '';
  document.getElementById('btn-crea-sess-tbl').disabled = selCount === 0;
  document.getElementById('tbl-row-count').textContent = `${rows.length} dispositivi`;

  // bottone clear filtri
  const anyFilter = Object.values(tableColFilters).some(v => v?.size > 0);
  const clearBtn = document.getElementById('tbl-clear-filters');
  if (clearBtn) clearBtn.style.display = anyFilter ? 'inline-block' : 'none';

  // thead
  let thead = '<tr><th class="tbl-th-chk"><input type="checkbox"' + (allSel?' checked':'') + ' onchange="tblToggleAll(this.checked)"></th>';
  for (const c of cols) {
    const filtered = tableColFilters[c.k]?.size > 0;
    const sorted   = tableSortCol === c.k;
    const si = sorted ? (tableSortDir===1?' ▲':' ▼') : '';
    const fltIcon = filtered ? '▾<span class="tbl-flt-dot">●</span>' : '▾';
    thead += `<th class="tbl-th${filtered?' tbl-th-filtered':''}" style="min-width:${c.w}px"><div class="tbl-th-inner"><span class="tbl-th-label" onclick="tblSort('${c.k}')">${_esc(c.l)}${si}</span><button class="tbl-th-flt${filtered?' active':''}" onclick="openTblFilter('${c.k}',event)">${fltIcon}</button></div></th>`;
  }
  thead += '</tr>';

  const colCount = cols.length + 1;
  const wrap = document.getElementById('tbl-table-wrap');

  // Rimuovi vecchio scroll handler
  if (wrap._tblScrollFn) wrap.removeEventListener('scroll', wrap._tblScrollFn);

  wrap.innerHTML = `<table class="tbl-table">
    <thead>${thead}</thead>
    <tbody><tr id="tbl-virt-top"><td colspan="${colCount}" style="height:0px;padding:0;border:none"></td></tr></tbody>
    <tbody id="tbl-tbody"></tbody>
    <tbody><tr id="tbl-virt-bot"><td colspan="${colCount}" style="height:${rows.length*TBL_ROW_H}px;padding:0;border:none"></td></tr></tbody>
  </table>`;

  wrap._tblScrollFn = () => {
    if (_tblRaf) cancelAnimationFrame(_tblRaf);
    _tblRaf = requestAnimationFrame(() => _tblRenderSlice(wrap));
  };
  wrap.addEventListener('scroll', wrap._tblScrollFn);
  wrap.scrollTop = 0;
  _tblRenderSlice(wrap);
}

function _tblRenderSlice(wrap) {
  const rows = _tblRows, cols = _tblCols;
  const total = rows.length;
  const tbody = document.getElementById('tbl-tbody');
  const topEl = document.getElementById('tbl-virt-top');
  const botEl = document.getElementById('tbl-virt-bot');
  if (!tbody || !topEl || !botEl) return;

  if (!total) { tbody.innerHTML = ''; return; }

  const scrollTop = wrap.scrollTop;
  const viewH     = wrap.clientHeight || 500;
  const startIdx  = Math.max(0,     Math.floor(scrollTop / TBL_ROW_H) - TBL_BUFFER);
  const endIdx    = Math.min(total, Math.ceil((scrollTop + viewH) / TBL_ROW_H) + TBL_BUFFER);

  topEl.firstChild.style.height = (startIdx * TBL_ROW_H) + 'px';
  botEl.firstChild.style.height = ((total - endIdx) * TBL_ROW_H) + 'px';

  let html = '';
  for (let i = startIdx; i < endIdx; i++) {
    const row = rows[i];
    const sel = tableSelected.has(row.codice);
    html += `<tr class="${sel?'tbl-row-sel':''}" data-cod="${_esc(row.codice)}" style="height:${TBL_ROW_H}px" onclick="tblRowClick(event,'${_esc(row.codice)}')">`;
    html += `<td class="tbl-td-chk"><input type="checkbox"${sel?' checked':''} onclick="event.stopPropagation();tblToggleRow('${_esc(row.codice)}',this.checked)"></td>`;
    for (const c of cols) html += `<td class="tbl-td" title="${_esc(row[c.k]||'')}">${_esc(row[c.k]||'')}</td>`;
    html += '</tr>';
  }
  tbody.innerHTML = html;
}

function tblSearch(v) {
  tableSearchQ = v;
  clearTimeout(_tblSearchTm);
  _tblSearchTm = setTimeout(renderTableView, 200);
}

function tblRowClick(e, codice) {
  if (e.target.tagName === 'INPUT') return;
  openAnagDetail(codice);
}

function tblSort(k) {
  if (tableSortCol === k) tableSortDir *= -1;
  else { tableSortCol = k; tableSortDir = 1; }
  renderTableView();
}

function tblToggleAll(checked) {
  if (checked) _tblRows.forEach(r => tableSelected.add(r.codice));
  else _tblRows.forEach(r => tableSelected.delete(r.codice));
  // aggiorna solo la slice visibile, non ricostruisce l'intera struttura
  const wrap = document.getElementById('tbl-table-wrap');
  if (wrap) _tblRenderSlice(wrap);
  const selCount = _tblRows.filter(r => tableSelected.has(r.codice)).length;
  document.getElementById('tbl-sel-count').textContent = selCount > 0 ? `${selCount} selezionati` : '';
  document.getElementById('btn-crea-sess-tbl').disabled = selCount === 0;
}

function tblToggleRow(codice, checked) {
  if (checked) tableSelected.add(codice);
  else tableSelected.delete(codice);
  // Aggiorna solo la riga nel DOM senza ricostruire nulla
  const tr = document.querySelector(`#tbl-tbody tr[data-cod="${CSS.escape(codice)}"]`);
  if (tr) tr.classList.toggle('tbl-row-sel', checked);
  // Aggiorna contatore e "seleziona tutto"
  const selCount = _tblRows.filter(r => tableSelected.has(r.codice)).length;
  document.getElementById('tbl-sel-count').textContent = selCount > 0 ? `${selCount} selezionati` : '';
  document.getElementById('btn-crea-sess-tbl').disabled = selCount === 0;
  const allChk = document.querySelector('#tbl-table-wrap thead input[type=checkbox]');
  if (allChk) allChk.checked = _tblRows.length > 0 && selCount === _tblRows.length;
}

// ── Filtri per colonna ──
let _tblFilterOpenKey = null;
let _tblFilterOutside = null;

function openTblFilter(k, e) {
  e.stopPropagation();
  closeTblFilter();
  if (!tableData) return;
  const cols = _getTblCols();
  const col = cols.find(c => c.k === k);
  const activeVals = tableColFilters[k];
  // Filtra per tutti gli altri filtri attivi (cascata), esclusa la colonna corrente
  const q = tableSearchQ.toLowerCase();
  const allCols = _getTblCols();
  const baseRows = tableData.filter(row => {
    if (q && !allCols.some(c => (row[c.k]||'').toLowerCase().includes(q))) return false;
    for (const [fk, vals] of Object.entries(tableColFilters)) {
      if (fk === k) continue;
      if (!vals || vals.size === 0) continue;
      if (!vals.has(row[fk]||'')) return false;
    }
    return true;
  });
  const uniqueVals = [...new Set(baseRows.map(r => r[k]||''))].sort((a,b) => a < b ? -1 : a > b ? 1 : 0);

  const panel = document.createElement('div');
  panel.id = 'tbl-filter-panel';
  panel.className = 'tbl-filter-panel';
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const left = Math.min(rect.left, window.innerWidth - 250);
  panel.style.cssText = `position:fixed;top:${rect.bottom+4}px;left:${left}px;z-index:9000`;

  let listHtml = '';
  for (const v of uniqueVals) {
    const chk = !activeVals || activeVals.size === 0 || activeVals.has(v);
    listHtml += `<label class="tbl-fp-item"><input type="checkbox" value="${_esc(v)}"${chk?' checked':''}><span>${_esc(v||'(vuoto)')}</span></label>`;
  }
  panel.innerHTML = `
    <div class="tbl-fp-hdr">${_esc(col?.l||k)}</div>
    <input class="tbl-fp-search" type="text" placeholder="Cerca valore..." oninput="tblFpSearch(this.value)">
    <div class="tbl-fp-actions">
      <button onclick="tblFpSelAll()">Tutti</button>
      <button onclick="tblFpSelNone()">Nessuno</button>
    </div>
    <div class="tbl-fp-list" id="tbl-fp-list">${listHtml}</div>
    <div class="tbl-fp-footer">
      <button onclick="tblFpApply('${k}')">Applica</button>
      <button onclick="tblFpClear('${k}')">Cancella filtro</button>
    </div>`;
  panel._allVals = uniqueVals;
  document.body.appendChild(panel);
  _tblFilterOpenKey = k;
  _tblFilterOutside = (ev) => { if (!panel.contains(ev.target)) closeTblFilter(); };
  setTimeout(() => document.addEventListener('click', _tblFilterOutside), 0);
}

function closeTblFilter() {
  const p = document.getElementById('tbl-filter-panel');
  if (p) p.remove();
  if (_tblFilterOutside) { document.removeEventListener('click', _tblFilterOutside); _tblFilterOutside = null; }
  _tblFilterOpenKey = null;
}

function tblFpSearch(q) {
  const ql = q.toLowerCase();
  document.querySelectorAll('#tbl-fp-list .tbl-fp-item').forEach(el => {
    el.style.display = el.querySelector('span').textContent.toLowerCase().includes(ql) ? '' : 'none';
  });
}

function tblFpSelAll()  { document.querySelectorAll('#tbl-fp-list input').forEach(cb => cb.checked = true); }
function tblFpSelNone() { document.querySelectorAll('#tbl-fp-list input').forEach(cb => cb.checked = false); }

function tblFpApply(k) {
  const checked = [...document.querySelectorAll('#tbl-fp-list input:checked')].map(cb => cb.value);
  const panel = document.getElementById('tbl-filter-panel');
  const allVals = panel?._allVals || [];
  if (checked.length === 0 || checked.length === allVals.length) delete tableColFilters[k];
  else tableColFilters[k] = new Set(checked);
  closeTblFilter();
  renderTableView();
}

function tblFpClear(k) {
  delete tableColFilters[k];
  closeTblFilter();
  renderTableView();
}

function tblClearAllFilters() {
  tableColFilters = {};
  renderTableView();
}

// ── Schermo intero ──
function toggleTblFullscreen() {
  const sec = document.getElementById('tabella-section');
  const isFs = sec.classList.toggle('tbl-fullscreen');
  document.getElementById('btn-tbl-fs').textContent = isFs ? '✕' : '⛶';
  document.getElementById('btn-tbl-fs').title = isFs ? 'Esci da schermo intero' : 'Schermo intero';
  const wrap = document.getElementById('tbl-table-wrap');
  if (!wrap) return;
  requestAnimationFrame(() => {
    if (isFs) {
      // Misura la distanza del wrap dalla cima del viewport e calcola l'altezza disponibile
      const top = wrap.getBoundingClientRect().top;
      wrap.style.height = (window.innerHeight - top - 4) + 'px';
    } else {
      wrap.style.height = '';
    }
    requestAnimationFrame(() => _tblRenderSlice(wrap));
  });
}

// ── Colonne visibili ──
function toggleTblColPicker() {
  document.getElementById('tbl-col-picker').classList.toggle('open');
  document.getElementById('tbl-views-panel').classList.remove('open');
}

function renderTblColPicker() {
  const cols = _getTblCols();
  let html = '';
  for (const c of cols) {
    const vis = !tableHiddenCols.has(c.k);
    html += `<label class="tbl-cp-item"><input type="checkbox"${vis?' checked':''} onchange="tblToggleCol('${c.k}',this.checked)"><span>${_esc(c.l)}</span></label>`;
  }
  document.getElementById('tbl-col-picker-list').innerHTML = html;
}

function tblToggleCol(k, vis) {
  if (vis) tableHiddenCols.delete(k);
  else tableHiddenCols.add(k);
  saveTableColConfig();
  renderTableView();
}

// ── Viste personali ──
function toggleTblViews() {
  const p = document.getElementById('tbl-views-panel');
  p.classList.toggle('open');
  if (p.classList.contains('open')) { renderTblViews(); }
  document.getElementById('tbl-col-picker').classList.remove('open');
}

function renderTblViews() {
  let html = '';
  tableViews.forEach((v, i) => {
    html += `<div class="tbl-view-item"><span onclick="applyTblView(${i})">${_esc(v.name)}</span><button onclick="deleteTblView(${i})">✕</button></div>`;
  });
  document.getElementById('tbl-views-list').innerHTML = html || '<div style="font-size:12px;color:var(--text2);padding:4px 0">Nessuna vista salvata</div>';
}

function saveTblViewNamed() {
  const name = document.getElementById('tbl-view-name').value.trim();
  if (!name) { toast('Inserisci un nome per la vista','warn'); return; }
  tableViews.push({name, hidden:[...tableHiddenCols]});
  saveTableColConfig();
  document.getElementById('tbl-view-name').value = '';
  renderTblViews();
  toast(`Vista "${name}" salvata`, 'ok');
}

function applyTblView(i) {
  const v = tableViews[i]; if (!v) return;
  tableHiddenCols = new Set(v.hidden);
  saveTableColConfig();
  renderTblColPicker();
  renderTableView();
  document.getElementById('tbl-views-panel').classList.remove('open');
  toast(`Vista "${v.name}" applicata`, 'ok');
}

function deleteTblView(i) {
  const name = tableViews[i]?.name;
  tableViews.splice(i, 1);
  saveTableColConfig();
  renderTblViews();
  if (name) toast(`Vista "${name}" eliminata`, 'ok');
}

function saveTableColConfig() {
  const uid = currentUser?.id || 'guest';
  localStorage.setItem('tbl_cfg_'+uid, JSON.stringify({hidden:[...tableHiddenCols], views:tableViews}));
}

function loadTableColConfig() {
  const uid = currentUser?.id || 'guest';
  try {
    const cfg = JSON.parse(localStorage.getItem('tbl_cfg_'+uid)||'{}');
    tableHiddenCols = new Set(cfg.hidden || []);
    tableViews = cfg.views || [];
  } catch { tableHiddenCols = new Set(); tableViews = []; }
}

// ── Crea sessione dalla selezione ──
function openCreateSessionFromTable() {
  const selRows = _tblFilteredRows().filter(r => tableSelected.has(r.codice));
  if (!selRows.length) { toast('Nessun dispositivo selezionato','warn'); return; }
  document.getElementById('tbl-sess-count').textContent = `${selRows.length} dispositivi selezionati`;
  document.getElementById('tbl-sess-title').value = '';
  document.getElementById('tbl-sess-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('tbl-sess-modal').classList.add('open');
}

function closeTblSessModal() {
  document.getElementById('tbl-sess-modal').classList.remove('open');
}

async function confirmCreateSessionFromTable() {
  const title = document.getElementById('tbl-sess-title').value.trim();
  if (!title) { toast('Inserisci un nome per la sessione','warn'); return; }
  const dataV = document.getElementById('tbl-sess-date').value || new Date().toISOString().split('T')[0];
  const codici = _tblFilteredRows().filter(r => tableSelected.has(r.codice)).map(r => r.codice);

  const token = await supaToken();
  const asl = currentUser?.profile?.asl || 'ASL Benevento';

  // 1. Crea sessione
  const r = await fetch(`${SUPA_URL}/rest/v1/sessioni`, {
    method:'POST', headers:supaHdrs(token),
    body:JSON.stringify({titolo:title, utente_id:currentUser.id, asl, data_verifica:dataV})
  });
  if (!r.ok) { toast('Errore creazione sessione','warn'); return; }
  const rows = await r.json();
  const sess = Array.isArray(rows) ? rows[0] : rows;

  // 2. Record attesi
  await fetch(`${SUPA_URL}/rest/v1/sessione_schede`, {
    method:'POST',
    headers:{...supaHdrs(token),'Prefer':'return=minimal'},
    body:JSON.stringify({sessione_id:sess.id, codice:'__attesi__', dati_vse:{lista:codici}})
  });

  closeTblSessModal();

  // 3. Attiva sessione e naviga
  await activateSession(sess.id, sess.titolo, dataV);
  codici.forEach(c => attesi.add(c));
  renderSession();
  await syncSessionNow();
  await loadSessList();

  document.getElementById('tabella-section').style.display = 'none';
  sbNav('sessione');
  toast(`Sessione "${title}" creata con ${codici.length} dispositivi`, 'ok');
}
