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
  ['verifica','sessione','anagrafica','tabella','archivio','storico'].forEach(k => {
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
  if (key !== 'storico')    { const s = document.getElementById('storico-section'); if (s) s.style.display = 'none'; }
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
    if (sel?.size > 0 && !sel.has(_anagDbVal(d, def.key))) return false;
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
    <div class="anag-item" onclick="openAnagDetail('${_esc(d.c)}')">
      <span class="anag-cod">${_esc(d.c)}</span>
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
  const aslKey = db._aslKey();
  localStorage.setItem('jolly_meta_'+aslKey, JSON.stringify(meta));
  db.configAsl.saveJolly(meta).catch(() => {});
}
async function loadJollyMetaFromDB() {
  const aslKey = db._aslKey();
  try {
    const labels = await db.configAsl.getJolly();
    if (labels) localStorage.setItem('jolly_meta_'+aslKey, JSON.stringify(labels));
  } catch(e) {}
}
function getJollyLabels() { return getJollyMeta().map(m=>m.label); }

async function openAnagDetail(codice) {
  openGestioneBene(codice);
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
  const _fmtDate = v => _fmtDateIT(v);

  const _jollyField = jf => {
    const k          = 'jolly_'+jf.idx;
    const v          = _esc(d[k]||'');
    const isBloccata = jf.type === 'bloccata';
    const lbl = currentUser?.profile?.role === 'admin'
      ? `<button class="jolly-lbl-btn" onclick="editJollyLabel(${jf.idx})" title="Clicca per configurare">${_esc(jf.label)} ✎</button>`
      : `<span style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.04em">${_esc(jf.label)}</span>`;
    if (isBloccata) {
      const dlId   = `dl-jolly-${jf.idx}`;
      const addBtn = can('lookup_write')
        ? `<button type="button" onclick="anagAddLookupValue('${k}','${_esc(jf.label)}')" title="Aggiungi nuovo valore" style="flex-shrink:0;padding:0 10px;height:38px;font-size:18px;font-weight:600;border:1.5px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--info);cursor:pointer;line-height:1">+</button>`
        : '';
      return `<div class="anag-field"><label>${lbl}</label><div style="display:flex;gap:4px"><input type="text" id="anag-f-${k}" data-k="${k}" value="${v}" list="${dlId}" style="flex:1;min-width:0">${addBtn}</div></div>`;
    }
    return `<div class="anag-field"><label>${lbl}</label><input type="text" id="anag-f-${k}" data-k="${k}" value="${v}"></div>`;
  };

  let html = '';
  for (const grp of ANAG_GROUPS) {
    const bodyCls = 'anag-grp-body'+(grp.cols4?' cols4':'');
    html += `<div class="anag-grp">
      <div class="anag-grp-hdr" onclick="toggleAnagGrp('${grp.id}')"><span>${grp.label}</span><span id="anag-tog-${grp.id}">▾</span></div>
      <div class="${bodyCls}" id="anag-grp-${grp.id}">`;
    for (const f of grp.fields) {
      const raw  = d[f.k] != null ? d[f.k] : '';
      const cls  = 'anag-field'+(f.full?' full':'');
      const isRo = f.ro && !anagIsNew;
      const req  = f.req ? ' <span style="color:var(--ko)">*</span>' : '';
      if (isRo) {
        html += `<div class="${cls}"><label>${f.l}</label><input type="text" id="anag-f-${f.k}" data-k="${f.k}" value="${_esc(String(raw))}" readonly></div>`;
      } else if (f.ta) {
        html += `<div class="${cls}"><label>${f.l}</label><textarea id="anag-f-${f.k}" data-k="${f.k}">${_esc(String(raw))}</textarea></div>`;
      } else if (DATE_KEYS.has(f.k)) {
        let dateVal = raw ? (_toISODate(raw) || '') : '';
        // Calcola data prossima se vuota
        const proxMap = {
          data_prossima_vse: ['data_ultima_vse','periodicita_vse'],
          data_prossima_vsp: ['data_ultima_vsp','periodicita_vsp'],
          data_prossima_mo:  ['data_ultima_mo', 'periodicita_mo'],
          data_prossima_cq:  ['data_ultima_cq', 'periodicita_cq'],
        };
        if (!dateVal && proxMap[f.k]) {
          const [ultKey, perKey] = proxMap[f.k];
          dateVal = _calcProssima(d[ultKey], d[perKey]) || '';
        }
        // Campi data_ultima_* aggiornano la prossima al cambio
        const tipoUlt = f.k.match(/^data_ultima_(\w+)$/)?.[1];
        const oiUlt   = tipoUlt ? ` oninput="anagUpdateProssima('${tipoUlt}')"` : '';
        html += `<div class="${cls}"><label>${f.l}</label><input type="date" id="anag-f-${f.k}" data-k="${f.k}" value="${dateVal}"${oiUlt}></div>`;
      } else if (LOOKUP_KEYS.has(f.k)) {
        const dlId   = FIELD_DL[f.k] || '';
        const listAttr = dlId ? ` list="${dlId}"` : '';
        const tipoPeriodicita = f.k.match(/^periodicita_(\w+)$/)?.[1];
        const oiAttr = f.k === 'costruttore'
          ? ` oninput="updateModelloDatalist(this.value)"`
          : tipoPeriodicita ? ` oninput="anagUpdateProssima('${tipoPeriodicita}')"` : '';
        const addBtn   = can('lookup_write')
          ? `<button type="button" onclick="anagAddLookupValue('${f.k}','${_esc(f.l)}')" title="Aggiungi nuovo valore" style="flex-shrink:0;padding:0 10px;height:38px;font-size:18px;font-weight:600;border:1.5px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--info);cursor:pointer;line-height:1">+</button>`
          : '';
        html += `<div class="${cls}"><label>${f.l}${req}</label><div style="display:flex;gap:4px"><input type="text" id="anag-f-${f.k}" data-k="${f.k}" value="${_esc(String(raw))}"${listAttr}${oiAttr} style="flex:1;min-width:0">${addBtn}</div></div>`;
      } else {
        html += `<div class="${cls}"><label>${f.l}${req}</label><input type="text" id="anag-f-${f.k}" data-k="${f.k}" value="${_esc(String(raw))}"></div>`;
      }
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

function anagAddLookupValue(campo, label) {
  const input  = document.getElementById('anag-f-' + campo);
  const valore = input ? input.value.trim() : '';
  if (!valore) { toast('Inserisci un valore nel campo prima di aggiungerlo alla lista.', 'warn'); return; }
  if (isValidLookup(campo, valore)) { toast(`"${valore}" è già presente nella lista.`, 'warn'); return; }
  document.getElementById('anag-add-lookup-modal')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div id="anag-add-lookup-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:20000;display:flex;align-items:center;justify-content:center;padding:20px">
      <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:340px;padding:20px">
        <div style="font-size:14px;font-weight:600;margin-bottom:10px;color:var(--text)">Aggiungi alla lista</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:16px">
          Aggiungere <strong>${_esc(valore)}</strong> alla lista del campo <em>${_esc(label)}</em>?<br>
          <span style="font-size:11px;color:var(--text3)">Il valore sarà disponibile per tutti gli utenti dell'ASL.</span>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end">
          <button onclick="document.getElementById('anag-add-lookup-modal').remove()"
            style="padding:7px 14px;font-size:13px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg3);color:var(--text);cursor:pointer">Annulla</button>
          <button onclick="anagConfirmAddLookup('${_esc(campo)}','${_esc(valore)}')"
            style="padding:7px 14px;font-size:13px;font-weight:600;border:none;border-radius:var(--rad);background:var(--info);color:#fff;cursor:pointer">Aggiungi</button>
        </div>
      </div>
    </div>`);
}

async function anagConfirmAddLookup(campo, valore) {
  document.getElementById('anag-add-lookup-modal')?.remove();
  await saveLookupValue(campo, valore);
  toast(`"${valore}" aggiunto alla lista.`, 'ok');
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

  // Validazione lookup
  const lookupErrors = [];
  LOOKUP_KEYS.forEach(k => {
    const el = document.getElementById('anag-f-' + k);
    if (!el || el.readOnly) return;
    const val = el.value.trim();
    if (val && !isValidLookup(k, val)) {
      lookupErrors.push(k);
      el.style.outline = '2px solid var(--ko)';
    } else {
      el.style.outline = '';
    }
  });
  if (lookupErrors.length) {
    toast('Valori non validi in: ' + lookupErrors.join(', ') + '. Usa + per aggiungere nuovi valori.', 'warn');
    return;
  }

  if (anagIsNew) {
    const body = Object.assign({}, anagCurDev, data);
    try {
      await db.dispositivi.insert(body);
    } catch(e) {
      if (e instanceof db.DbError && e.isDuplicate()) toast('Codice già esistente nel DB','warn');
      else toast('Errore inserimento: ' + (e.status || e.message), 'warn');
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
    try {
      await db.dispositivi.update(anagCurDev.codice, data);
    } catch(e) { toast('Errore salvataggio','warn'); return; }
    const cod = anagCurDev.codice;
    Object.assign(anagCurDev, data);
    if (DB[cod]) {
      if (data.descrizione_classe!==undefined)   DB[cod].n   = data.descrizione_classe||'';
      if (data.costruttore!==undefined)          DB[cod].b   = data.costruttore||'';
      if (data.modello!==undefined)              DB[cod].m   = data.modello||'';
      if (data.matricola!==undefined)            DB[cod].mat = data.matricola||'';
      if (data.presidio!==undefined)             DB[cod].loc = data.presidio||'';
      if (data.reparto!==undefined)              DB[cod].rep = data.reparto||'';
      if (data.presenze_effettive!==undefined)   DB[cod].pe  = data.presenze_effettive||'';
      if (data.sede_struttura!==undefined)       DB[cod].ss  = data.sede_struttura||'';
      if (data.nuova_area!==undefined)           DB[cod].na  = data.nuova_area||'';
      if (data.data_ultima_vse!==undefined)      DB[cod].data_ultima_vse = data.data_ultima_vse||null;
      if (data.data_ultima_vsp!==undefined)      DB[cod].data_ultima_vsp = data.data_ultima_vsp||null;
      if (data.data_ultima_mo!==undefined)       DB[cod].data_ultima_mo  = data.data_ultima_mo||null;
      if (data.data_ultima_cq!==undefined)       DB[cod].data_ultima_cq  = data.data_ultima_cq||null;
    }
    // Aggiorna anche tableData se caricata
    if (tableData) {
      const row = tableData.find(r => r.codice === cod);
      if (row) Object.assign(row, data);
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
        <div style="margin-bottom:10px">
          <label style="font-size:12px;color:var(--text2);display:block;margin-bottom:4px">Sezione</label>
          <select id="jolly-edit-section"
            style="width:100%;padding:7px 10px;border:1px solid var(--border2);border-radius:var(--rad);font-size:13px;background:var(--bg2);color:var(--text);box-sizing:border-box">
            ${opts}
          </select>
        </div>
        <div style="margin-bottom:16px">
          <label style="font-size:12px;color:var(--text2);display:block;margin-bottom:4px">Tipo campo</label>
          <select id="jolly-edit-type"
            style="width:100%;padding:7px 10px;border:1px solid var(--border2);border-radius:var(--rad);font-size:13px;background:var(--bg2);color:var(--text);box-sizing:border-box">
            <option value="libera"${(m.type||'libera')==='libera'?' selected':''}>Testo libero</option>
            <option value="bloccata"${m.type==='bloccata'?' selected':''}>Lista bloccata (lookup)</option>
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
  const label   = document.getElementById('jolly-edit-label').value.trim() || `Jolly ${i}`;
  const section = document.getElementById('jolly-edit-section').value;
  const type    = document.getElementById('jolly-edit-type').value;
  const meta = getJollyMeta();
  meta[i-1] = {label, section, type};
  saveJollyMeta(meta);
  buildLookups(); // ricrea datalist jolly bloccate
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
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type:'array', cellDates:true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) { toast('Foglio non trovato','warn'); return; }

  const rows = XLSX.utils.sheet_to_json(ws, { defval:null, raw:false });
  if (!rows.length) { toast('File vuoto','warn'); return; }

  // Pre-processing date: legge il seriale numerico raw dalla cella per evitare
  // ambiguità D/M vs M/D nelle stringhe formattate da sheet_to_json
  try {
    const date1904 = !!(wb.Workbook?.WBProps?.date1904);
    const range = XLSX.utils.decode_range(ws['!ref']);
    const dateColLetters = {};
    for (let c = range.s.c; c <= range.e.c; c++) {
      const hdrCell = ws[XLSX.utils.encode_cell({ r: range.s.r, c })];
      if (!hdrCell || hdrCell.v == null) continue;
      const key = String(hdrCell.v).trim();
      if (DATE_KEYS.has(key)) dateColLetters[key] = XLSX.utils.encode_col(c);
    }
    for (let i = 0; i < rows.length; i++) {
      for (const [key, colLetter] of Object.entries(dateColLetters)) {
        rows[i][key] = _cellToISO(ws[colLetter + (range.s.r + 2 + i)], date1904);
      }
    }
  } catch(e) { console.warn('[import anagrafica] pre-processing date fallito:', e); }

  // Colonne tecniche valide
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
  const jollyLabelToKey = {};
  getJollyMeta().forEach((m,i) => { if (m.label) jollyLabelToKey[m.label.toLowerCase()] = `jolly_${i+1}`; });
  const resolveCol = k => {
    if (DB_COLS.has(k)) return k;
    if (jollyLabelToKey[k.toLowerCase()]) return jollyLabelToKey[k.toLowerCase()];
    const m = k.match(/^jolly?\s*_?\s*(\d+)$/i); if (m) return `jolly_${m[1]}`;
    return DB_COLS.has(k.toLowerCase()) ? k.toLowerCase() : null;
  };
  const xlsxDateToISO = n => { const d=new Date(Math.round((n-25569)*86400*1000)); return isNaN(d.getTime())?null:d.toISOString().split('T')[0]; };

  const PERIOD_VALIDE = /^(annuale|1\s*anno|12\s*mesi|12|semestrale|6\s*mesi|6|biennale|2\s*anni|24\s*mesi|24|trimestrale|3\s*mesi|3|quadrimestrale|4\s*mesi|4|non prevista|\d+)$/i;
  const PERIOD_KEYS = ['periodicita_vse','periodicita_vsp','periodicita_mo','periodicita_cq'];
  const erroriVal = []; // { codice, campo, valore, tipo }

  const clean = rows.map(r => {
    const obj = {};
    for (let [k, v] of Object.entries(r)) {
      k = resolveCol(k); if (!k) continue;
      if (v===null||v===undefined||v==='') { obj[k]=null; continue; }
      if (v instanceof Date) { obj[k]=isNaN(v.getTime())?null:v.toISOString().split('T')[0]; continue; }
      const s = String(v).trim(); if (!s) { obj[k]=null; continue; }
      if (/^\d+$/.test(s)) { const n=parseInt(s,10); if (n>30000&&n<70000) { obj[k]=xlsxDateToISO(n); continue; } }
      if (DATE_KEYS.has(k)) {
        const iso = _toISODate(s);
        if (!iso) erroriVal.push({ codice: String(r.codice||'?'), campo:k, valore:s, tipo:'data_non_valida' });
        obj[k]=iso; continue;
      }
      if ((k==='codice'||k==='codice_padre') && /^\d+$/.test(s)) { obj[k]=s.padStart(7,'0').slice(0,7); continue; }
      if (PERIOD_KEYS.includes(k) && s && !PERIOD_VALIDE.test(s)) {
        erroriVal.push({ codice: String(r.codice||'?'), campo:k, valore:s, tipo:'periodicita_non_valida' });
      }
      obj[k]=s;
    }
    return obj;
  }).filter(r => r.codice && r.codice !== '0000000');

  const seen = new Map(); clean.forEach(r => seen.set(r.codice, r));
  const deduped = [...seen.values()];

  // Classificazione: nuovi vs già esistenti
  const esistenti = deduped.filter(r => DB[r.codice]).map(r => r.codice);
  const nuovi = deduped.filter(r => !DB[r.codice]);

  // Report pre-inserimento
  const righeReport = [];
  if (nuovi.length)     righeReport.push(`✅ Nuovi da inserire: ${nuovi.length}`);
  if (esistenti.length) righeReport.push(`⚠️ Già esistenti (ignorati): ${esistenti.length}\n   ${esistenti.slice(0,10).join(', ')}${esistenti.length>10?' …':''}`);
  if (erroriVal.length) {
    const perTipo = erroriVal.reduce((a,e)=>(a[e.tipo]=(a[e.tipo]||0)+1,a),{});
    righeReport.push(`❌ Errori validazione: ${erroriVal.length}`);
    if (perTipo.data_non_valida)        righeReport.push(`   • Date non valide: ${perTipo.data_non_valida}`);
    if (perTipo.periodicita_non_valida) righeReport.push(`   • Periodicità non riconosciuta: ${perTipo.periodicita_non_valida}`);
    erroriVal.slice(0,5).forEach(e => righeReport.push(`     – ${e.codice} · ${e.campo}: "${e.valore}"`));
    if (erroriVal.length>5) righeReport.push(`     … e altri ${erroriVal.length-5}`);
  }
  if (!nuovi.length) {
    alert(righeReport.join('\n')+'\n\nNessun dispositivo nuovo da inserire.');
    return;
  }
  if (!confirm(righeReport.join('\n')+'\n\nProcedere con l\'inserimento?')) return;

  toast(`Inserimento ${nuovi.length} dispositivi...`,'warn');
  const { inserted, errors } = await db.dispositivi.insertBatch(nuovi, { ignoreDuplicates:true });
  if (errors) toast(`Errore import (${errors} chunk falliti)`,'warn');
  await initDB();
  toast(inserted ? `Inseriti ${inserted} dispositivi` : 'Nessun dispositivo inserito', inserted?'ok':'warn');
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
let tableViews      = [];     // [{name, hidden:[...], order:[...]}]
let tableColOrder   = [];     // [] = ordine default; altrimenti array di colKey
let tableSearchQ    = '';
let _tblDragKey     = null;   // chiave colonna in drag
// virtual scroll
const TBL_ROW_H   = 28;      // px per riga — deve corrispondere al CSS
const TBL_BUFFER  = 60;      // righe extra sopra/sotto il viewport
let _tblRows      = [];      // righe filtrate/ordinate correnti (cache)
let _tblCols      = [];      // colonne visibili correnti (cache)
let _tblRaf       = null;    // requestAnimationFrame handle
let _tblSearchTm  = null;    // debounce handle per la ricerca
let _tblSliceStart = -1;     // ultima slice renderizzata — evita loop scroll
let _tblSliceEnd   = -1;

function _getTblCols() {
  const jmeta = getJollyMeta();
  const cols = [...TBL_COLS];
  jmeta.forEach((m, idx) => {
    // Colonne jolly senza etichetta personalizzata → fantasma (non mostrate in tabella)
    const isDefault = /^jolly\s*\d*\s*\??$/i.test(m.label.trim());
    if (!isDefault) cols.push({k:'jolly_'+(idx+1), l:m.label, w:100});
  });
  if (!tableColOrder.length) return cols;
  const byKey = Object.fromEntries(cols.map(c => [c.k, c]));
  const ordered = tableColOrder.filter(k => byKey[k]).map(k => byKey[k]);
  const rest = cols.filter(c => !tableColOrder.includes(c.k));
  return [...ordered, ...rest];
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
  let all;
  try {
    all = await db.dispositivi.listAll();
  } catch (e) {
    toast('Errore caricamento tabella', 'warn');
    el.style.display = 'none';
    return;
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
  // bottone aggiornamento massivo
  const amBtn = document.getElementById('btn-agg-massivo');
  if (amBtn && amBtn.style.display !== 'none') {
    amBtn.disabled = !(anyFilter || selCount > 0);
  }

  // thead
  let thead = '<tr><th class="tbl-th-chk"><input type="checkbox"' + (allSel?' checked':'') + ' onchange="tblToggleAll(this.checked)"></th>';
  for (const c of cols) {
    const filtered = tableColFilters[c.k]?.size > 0;
    const sorted   = tableSortCol === c.k;
    const si = sorted ? (tableSortDir===1?' ▲':' ▼') : '';
    const fltIcon = filtered ? '▾<span class="tbl-flt-dot">●</span>' : '▾';
    thead += `<th class="tbl-th${filtered?' tbl-th-filtered':''}" draggable="true" data-colkey="${c.k}" style="min-width:${c.w}px"><div class="tbl-th-inner"><span class="tbl-th-label" onclick="tblSort('${c.k}')">${_esc(c.l)}${si}</span><button class="tbl-th-flt${filtered?' active':''}" onclick="openTblFilter('${c.k}',event)">${fltIcon}</button></div></th>`;
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

  const theadEl = wrap.querySelector('thead');
  if (theadEl) _tblAttachDrag(theadEl);

  wrap._tblScrollFn = () => {
    if (_tblRaf) cancelAnimationFrame(_tblRaf);
    _tblRaf = requestAnimationFrame(() => _tblRenderSlice(wrap));
  };
  wrap.addEventListener('scroll', wrap._tblScrollFn);
  _tblSliceStart = -1; _tblSliceEnd = -1;
  wrap.scrollTop = 0;
  _tblRenderSlice(wrap, true);
}

function _tblRenderSlice(wrap, force = false) {
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

  // Evita loop: se la slice non è cambiata, non aggiornare il DOM
  if (!force && startIdx === _tblSliceStart && endIdx === _tblSliceEnd) return;
  _tblSliceStart = startIdx;
  _tblSliceEnd   = endIdx;

  topEl.firstChild.style.height = (startIdx * TBL_ROW_H) + 'px';
  botEl.firstChild.style.height = ((total - endIdx) * TBL_ROW_H) + 'px';
  // Ripristina scrollTop: alcune implementazioni browser lo aggiustano
  // automaticamente quando cambia l'altezza dei placeholder
  if (wrap.scrollTop !== scrollTop) wrap.scrollTop = scrollTop;

  let html = '';
  for (let i = startIdx; i < endIdx; i++) {
    const row = rows[i];
    const sel = tableSelected.has(row.codice);
    html += `<tr class="${sel?'tbl-row-sel':''}" data-cod="${_esc(row.codice)}" style="height:${TBL_ROW_H}px" onclick="tblRowClick(event,'${_esc(row.codice)}')">`;
    html += `<td class="tbl-td-chk"><input type="checkbox"${sel?' checked':''} onclick="event.stopPropagation();tblToggleRow('${_esc(row.codice)}',this.checked)"></td>`;
    for (const c of cols) {
      const raw = row[c.k] || '';
      const disp = (DATE_KEYS.has(c.k) || c.k.startsWith('jolly_'))
        ? (_fmtDateIT(raw) || raw)
        : raw;
      html += `<td class="tbl-td" title="${_esc(disp)}">${_esc(disp)}</td>`;
    }
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
  if (wrap) _tblRenderSlice(wrap, true);
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
let _tblColPickerOutside = null;
let _tblViewsOutside = null;

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
    if (!showArchiviati && (row.presenze_effettive||'').toLowerCase() === 'archiviato') return false;
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

function _tblAttachDrag(thead) {
  thead.addEventListener('dragstart', e => {
    const th = e.target.closest('th[data-colkey]');
    if (!th) return;
    _tblDragKey = th.dataset.colkey;
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => th.classList.add('tbl-th-dragging'));
  });
  thead.addEventListener('dragover', e => {
    const th = e.target.closest('th[data-colkey]');
    if (!th || th.dataset.colkey === _tblDragKey) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    thead.querySelectorAll('.tbl-th-drag-over').forEach(t => t.classList.remove('tbl-th-drag-over'));
    th.classList.add('tbl-th-drag-over');
  });
  thead.addEventListener('dragleave', e => {
    if (!thead.contains(e.relatedTarget)) {
      thead.querySelectorAll('.tbl-th-drag-over').forEach(t => t.classList.remove('tbl-th-drag-over'));
    }
  });
  thead.addEventListener('drop', e => {
    e.preventDefault();
    const th = e.target.closest('th[data-colkey]');
    if (!th || !_tblDragKey) return;
    const dropKey = th.dataset.colkey;
    if (dropKey === _tblDragKey) return;
    const keys = _getTblCols().map(c => c.k);
    const fromIdx = keys.indexOf(_tblDragKey);
    const toIdx   = keys.indexOf(dropKey);
    if (fromIdx === -1 || toIdx === -1) return;
    keys.splice(fromIdx, 1);
    keys.splice(toIdx, 0, _tblDragKey);
    tableColOrder = keys;
    _tblDragKey = null;
    saveTableColConfig();
    renderTableView();
  });
  thead.addEventListener('dragend', () => {
    thead.querySelectorAll('.tbl-th-drag-over,.tbl-th-dragging').forEach(t => {
      t.classList.remove('tbl-th-drag-over', 'tbl-th-dragging');
    });
    _tblDragKey = null;
  });
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
function toggleTblColPicker(e) {
  const p = document.getElementById('tbl-col-picker');
  document.getElementById('tbl-views-panel').classList.remove('open');
  if (_tblViewsOutside) { document.removeEventListener('click', _tblViewsOutside); _tblViewsOutside = null; }
  if (p.classList.contains('open')) {
    p.classList.remove('open');
    if (_tblColPickerOutside) { document.removeEventListener('click', _tblColPickerOutside); _tblColPickerOutside = null; }
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  p.style.top = (rect.bottom + 4) + 'px';
  p.style.left = Math.max(4, Math.min(rect.left, window.innerWidth - 424)) + 'px';
  p.classList.add('open');
  setTimeout(() => {
    _tblColPickerOutside = (ev) => {
      if (!p.contains(ev.target)) {
        p.classList.remove('open');
        document.removeEventListener('click', _tblColPickerOutside);
        _tblColPickerOutside = null;
      }
    };
    document.addEventListener('click', _tblColPickerOutside);
  }, 0);
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
function toggleTblViews(e) {
  const p = document.getElementById('tbl-views-panel');
  document.getElementById('tbl-col-picker').classList.remove('open');
  if (_tblColPickerOutside) { document.removeEventListener('click', _tblColPickerOutside); _tblColPickerOutside = null; }
  if (p.classList.contains('open')) {
    p.classList.remove('open');
    if (_tblViewsOutside) { document.removeEventListener('click', _tblViewsOutside); _tblViewsOutside = null; }
    return;
  }
  const rect = e.currentTarget.getBoundingClientRect();
  p.style.top = (rect.bottom + 4) + 'px';
  p.style.left = Math.max(4, Math.min(rect.left, window.innerWidth - 364)) + 'px';
  p.classList.add('open');
  renderTblViews();
  setTimeout(() => {
    _tblViewsOutside = (ev) => {
      if (!p.contains(ev.target)) {
        p.classList.remove('open');
        document.removeEventListener('click', _tblViewsOutside);
        _tblViewsOutside = null;
      }
    };
    document.addEventListener('click', _tblViewsOutside);
  }, 0);
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
  tableViews.push({name, hidden:[...tableHiddenCols], order:[...tableColOrder]});
  saveTableColConfig();
  document.getElementById('tbl-view-name').value = '';
  renderTblViews();
  toast(`Vista "${name}" salvata`, 'ok');
}

function applyTblView(i) {
  const v = tableViews[i]; if (!v) return;
  tableHiddenCols = new Set(v.hidden);
  tableColOrder   = v.order ? [...v.order] : [];
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
  localStorage.setItem('tbl_cfg_'+uid, JSON.stringify({v:3, hidden:[...tableHiddenCols], order:tableColOrder, views:tableViews}));
}

function loadTableColConfig() {
  const uid = currentUser?.id || 'guest';
  try {
    const cfg = JSON.parse(localStorage.getItem('tbl_cfg_'+uid)||'{}');
    tableHiddenCols = new Set(cfg.hidden || []);
    tableColOrder   = cfg.order || [];
    tableViews = cfg.views || [];
    // Migrazione v2: con la logica jolly-fantasma le jolly_N precedentemente
    // nascoste potrebbero essere ora etichettate → reset visibilità jolly una tantum
    if (!cfg.v || cfg.v < 2) {
      for (let i = 1; i <= 22; i++) tableHiddenCols.delete('jolly_'+i);
      saveTableColConfig();
    }
  } catch { tableHiddenCols = new Set(); tableColOrder = []; tableViews = []; }
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
  const asl = currentUser?.profile?.asl || 'ASL Benevento';

  // 1. Crea sessione
  let sess;
  try {
    sess = await db.sessioni.create({ titolo: title, utente_id: currentUser.id, asl, data_verifica: dataV });
  } catch(e) { toast('Errore creazione sessione','warn'); return; }

  // 2. Record attesi
  await db.schede.insert({ sessione_id: sess.id, codice: '__attesi__', dati_vse: { lista: codici } });

  closeTblSessModal();

  // 3. Attiva sessione e naviga
  await activateSession(sess.id, sess.titolo, dataV);
  _attesiMut(s => codici.forEach(c => s.add(c)));
  renderSession();
  await syncSessionNow();
  await loadSessList();

  document.getElementById('tabella-section').style.display = 'none';
  sbNav('sessione');
  toast(`Sessione "${title}" creata con ${codici.length} dispositivi`, 'ok');
}

// ── AGGIORNAMENTO MASSIVO ─────────────────────────────────────

function openAggiornamentoMassivo() {
  if (!can('aggiornamento_massivo')) return;
  const anyFilter = Object.values(tableColFilters).some(v => v?.size > 0);
  const selInView = _tblRows.filter(r => tableSelected.has(r.codice));
  const target    = selInView.length > 0 ? selInView : _tblRows;
  if (!target.length) { toast('Nessun dispositivo da aggiornare', 'warn'); return; }

  document.getElementById('am-modal')?.remove();

  const _inp = (k, l, dl) => `
    <div style="display:flex;flex-direction:column;gap:3px">
      <label style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em">${l}</label>
      <input id="am-f-${k}" type="text" list="${dl||''}" autocomplete="off"
        style="padding:6px 8px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:13px"
        placeholder="—">
    </div>`;
  const _date = (k, l) => `
    <div style="display:flex;flex-direction:column;gap:3px">
      <label style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.05em">${l}</label>
      <input id="am-f-${k}" type="date"
        style="padding:6px 8px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:13px">
    </div>`;
  const _sec = t => `<div style="grid-column:1/-1;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--text3);border-bottom:1px solid var(--border);padding-bottom:4px;margin-top:6px">${t}</div>`;

  // Jolly configurate (label personalizzata, non default "Jolly N")
  let jollyHtml = '';
  try {
    getJollyMeta().forEach((m, i) => {
      if (!m.label || m.label === `Jolly ${i+1}`) return;
      const k = `jolly_${i+1}`;
      const dl = m.type === 'bloccata' ? `dl-${k}` : '';
      jollyHtml += _inp(k, m.label, dl);
    });
  } catch(e) {}

  const label = selInView.length > 0
    ? `${target.length} dispositivi selezionati`
    : `${target.length} dispositivi (tutti i filtrati)`;

  document.body.insertAdjacentHTML('beforeend', `
  <div id="am-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">
    <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:640px;padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-size:16px;font-weight:600">Aggiornamento massivo</div>
        <button onclick="document.getElementById('am-modal').remove()" style="padding:4px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);cursor:pointer">✕</button>
      </div>
      <div style="font-size:13px;color:var(--text3);margin-bottom:14px">${label} — compila solo i campi da modificare</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;max-height:65vh;overflow-y:auto;padding-right:4px">

        ${_sec('Identificazione')}
        ${_inp('codice_padre',       'Codice padre',       '')}
        ${_inp('descrizione_classe', 'Classe / Tipo',      'dl-classe')}
        ${_inp('costruttore',        'Costruttore',        'dl-costruttore')}
        ${_inp('modello',            'Modello',            'dl-modello')}
        ${_inp('civab',              'CIVAB',              'dl-civab')}
        ${_inp('verifiche',          'Verifiche',          'dl-verifiche')}

        ${_sec('Ubicazione')}
        ${_inp('presidio',       'Presidio',       'dl-presidio')}
        ${_inp('reparto',        'Reparto',        'dl-reparto')}
        ${_inp('nuova_area',     'Area',           'dl-area')}
        ${_inp('sede_struttura', 'Sede struttura', 'dl-sede')}
        ${_inp('stanza',         'Stanza',         '')}

        ${_sec('Stato / Logistica')}
        ${_inp('dettagli_stato',     'Stato',          'dl-stato')}
        ${_inp('presenze_effettive', 'Presenze',       'dl-presenze')}
        ${_inp('forma_presenza',     'Forma presenza', 'dl-presenza')}
        ${_inp('manutentore',        'Manutentore',    'dl-manutentore')}
        ${_inp('cliente',            'Cliente',        'dl-cliente')}
        ${_inp('proprieta',          'Proprietà',      'dl-proprieta')}

        ${_sec('Verifiche / Scadenze')}
        ${_inp('periodicita_vse',  'Periodicità VSE', 'dl-periodicita')}
        ${_date('data_ultima_vse', 'Data ultima VSE')}
        ${_inp('esito_ultima_vse', 'Esito ultima VSE','dl-esito')}
        ${_date('data_prossima_vse','Prossima VSE')}
        ${_inp('periodicita_vsp',  'Periodicità VSP', 'dl-periodicita')}
        ${_date('data_ultima_vsp', 'Data ultima VSP')}
        ${_inp('esito_ultima_vsp', 'Esito ultima VSP','dl-esito')}
        ${_date('data_prossima_vsp','Prossima VSP')}
        ${_inp('periodicita_mo',   'Periodicità MO',  'dl-periodicita')}
        ${_date('data_ultima_mo',  'Data ultima MO')}
        ${_inp('esito_ultima_mo',  'Esito ultima MO', 'dl-esito')}
        ${_date('data_prossima_mo','Prossima MO')}
        ${_inp('periodicita_cq',   'Periodicità CQ',  'dl-periodicita')}
        ${_date('data_ultima_cq',  'Data ultima CQ')}
        ${_inp('esito_ultima_cq',  'Esito ultima CQ', 'dl-esito')}
        ${_date('data_prossima_cq','Prossima CQ')}

        ${_sec('Date')}
        ${_date('data_fine_garanzia',     'Fine garanzia')}
        ${_date('fine_service_comodato',  'Fine comodato')}
        ${_date('data_collaudo',          'Data collaudo')}
        ${_date('proposta_dismissione',   'Proposta dismissione')}
        ${_date('dismissione_effettiva',  'Dismissione effettiva')}

        ${_sec('Note')}
        ${_inp('note_programmate', 'Note programmate', '')}
        ${_inp('note_inventario',  'Note inventario',  '')}

        ${jollyHtml ? _sec('Campi aggiuntivi') + jollyHtml : ''}
      </div>
      <div id="am-warn" style="display:none;padding:8px 12px;border-radius:var(--rad);font-size:13px;background:var(--ko-bg);color:var(--ko);margin-bottom:12px"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button onclick="document.getElementById('am-modal').remove()" style="padding:7px 16px;font-size:13px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text2);cursor:pointer">Annulla</button>
        <button onclick="amApplica()" style="padding:7px 16px;font-size:13px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer">Applica</button>
      </div>
    </div>
  </div>`);

  window._amTargetCodici = target.map(r => r.codice);
}

async function amApplica() {
  const FIELDS = [
    'codice_padre','descrizione_classe','costruttore','modello','civab','verifiche',
    'presidio','reparto','nuova_area','sede_struttura','stanza',
    'dettagli_stato','presenze_effettive','forma_presenza','manutentore','cliente','proprieta',
    'periodicita_vse','data_ultima_vse','esito_ultima_vse','data_prossima_vse',
    'periodicita_vsp','data_ultima_vsp','esito_ultima_vsp','data_prossima_vsp',
    'periodicita_mo','data_ultima_mo','esito_ultima_mo','data_prossima_mo',
    'periodicita_cq','data_ultima_cq','esito_ultima_cq','data_prossima_cq',
    'data_fine_garanzia','fine_service_comodato','data_collaudo',
    'proposta_dismissione','dismissione_effettiva',
    'note_programmate','note_inventario',
    ...(Array.from({length:22},(_,i)=>`jolly_${i+1}`)),
  ];

  // Raccoglie solo i campi valorizzati
  const patch = {};
  for (const k of FIELDS) {
    const val = document.getElementById('am-f-' + k)?.value?.trim();
    if (val) patch[k] = val;
  }
  if (!Object.keys(patch).length) {
    const w = document.getElementById('am-warn');
    if (w) { w.textContent = 'Compila almeno un campo da modificare.'; w.style.display = 'block'; }
    return;
  }

  const codici = window._amTargetCodici || [];
  if (!codici.length) return;

  const { errors } = await db.dispositivi.bulkPatch(codici, patch);
  errors.forEach(e => console.error('amApplica batch error:', e.error));

  // Aggiorna cache locale per i batch andati a buon fine
  const failedSet = new Set(errors.flatMap(e => e.slice));
  const applicati = codici.filter(c => !failedSet.has(c));
  const applicatiSet = new Set(applicati);

  if (tableData) {
    for (const row of tableData) {
      if (!applicatiSet.has(row.codice)) continue;
      for (const [k, v] of Object.entries(patch)) row[k] = v;
    }
  }
  const KEY_MAP = {
    presidio:'loc', reparto:'rep', nuova_area:'na', sede_struttura:'ss',
    manutentore:'man', dettagli_stato:'ds', presenze_effettive:'pe',
    forma_presenza:'fp', cliente:'cli', proprieta:'pro',
  };
  for (const cod of applicati) {
    if (!DB[cod]) continue;
    for (const [k, v] of Object.entries(patch)) {
      const short = KEY_MAP[k];
      if (short) DB[cod][short] = v;
    }
  }

  document.getElementById('am-modal')?.remove();
  if (errors.length) toast(`Aggiornamento completato con ${errors.length} errori`, 'warn');
  else toast(`${codici.length} dispositivi aggiornati`, 'ok');
  renderTableView();
}

// ── SOSTITUZIONE MASSIVA ──────────────────────────────────────

const SM_FIELDS = [
  {k:'codice_padre',        l:'Codice padre'},
  {k:'descrizione_classe',  l:'Classe / Tipo'},
  {k:'costruttore',         l:'Costruttore'},
  {k:'modello',             l:'Modello'},
  {k:'civab',               l:'CIVAB'},
  {k:'verifiche',           l:'Verifiche'},
  {k:'presidio',            l:'Presidio'},
  {k:'reparto',             l:'Reparto'},
  {k:'nuova_area',          l:'Area'},
  {k:'sede_struttura',      l:'Sede struttura'},
  {k:'stanza',              l:'Stanza'},
  {k:'dettagli_stato',      l:'Stato'},
  {k:'presenze_effettive',  l:'Presenze'},
  {k:'forma_presenza',      l:'Forma presenza'},
  {k:'manutentore',         l:'Manutentore'},
  {k:'cliente',             l:'Cliente'},
  {k:'proprieta',           l:'Proprietà'},
  {k:'periodicita_vse',     l:'Periodicità VSE'},
  {k:'esito_ultima_vse',    l:'Esito ultima VSE'},
  {k:'periodicita_vsp',     l:'Periodicità VSP'},
  {k:'esito_ultima_vsp',    l:'Esito ultima VSP'},
  {k:'periodicita_mo',      l:'Periodicità MO'},
  {k:'esito_ultima_mo',     l:'Esito ultima MO'},
  {k:'periodicita_cq',      l:'Periodicità CQ'},
  {k:'esito_ultima_cq',     l:'Esito ultima CQ'},
  {k:'note_programmate',    l:'Note programmate'},
  {k:'note_inventario',     l:'Note inventario'},
];

function openSostMassiva() {
  if (!can('aggiornamento_massivo')) return;
  document.getElementById('sm-modal')?.remove();

  // Aggiungi jolly configurate
  const fields = [...SM_FIELDS];
  try {
    getJollyMeta().forEach((m, i) => {
      if (!m.label || m.label === `Jolly ${i+1}`) return;
      fields.push({ k: `jolly_${i+1}`, l: m.label });
    });
  } catch(e) {}

  const opts = fields.map(f => `<option value="${f.k}">${_esc(f.l)}</option>`).join('');

  document.body.insertAdjacentHTML('beforeend', `
  <div id="sm-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:10000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">
    <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:480px;padding:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="font-size:16px;font-weight:600">Sostituzione massiva</div>
        <button onclick="document.getElementById('sm-modal').remove()" style="padding:4px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);cursor:pointer">✕</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px">
        <div style="display:flex;flex-direction:column;gap:3px">
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text3)">Campo</label>
          <select id="sm-campo" onchange="smUpdatePreview()" style="padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px">
            <option value="">— seleziona —</option>
            ${opts}
          </select>
        </div>
        <div style="display:flex;flex-direction:column;gap:3px">
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text3)">Valore attuale</label>
          <input id="sm-da" type="text" list="sm-dl-da" oninput="smUpdatePreview()" autocomplete="off"
            style="padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px"
            placeholder="Valore da sostituire">
          <datalist id="sm-dl-da"></datalist>
        </div>
        <div style="display:flex;flex-direction:column;gap:3px">
          <label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--text3)">Nuovo valore</label>
          <input id="sm-a" type="text" list="sm-dl-a" autocomplete="off"
            oninput="smValidateNuovo()"
            style="padding:8px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);font-size:14px"
            placeholder="Nuovo valore">
          <datalist id="sm-dl-a"></datalist>
          <div id="sm-a-err" style="display:none;font-size:11px;color:var(--ko);margin-top:2px">Valore non presente nelle liste configurate</div>
        </div>
      </div>
      <div id="sm-preview" style="padding:10px 12px;border-radius:var(--rad);background:var(--bg3);border:1px solid var(--border);font-size:13px;color:var(--text3);margin-bottom:14px;min-height:36px">
        Seleziona campo e valore attuale per vedere l'anteprima.
      </div>
      <div id="sm-warn" style="display:none;padding:8px 12px;border-radius:var(--rad);font-size:13px;background:var(--ko-bg);color:var(--ko);margin-bottom:12px"></div>
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button onclick="document.getElementById('sm-modal').remove()" style="padding:7px 16px;font-size:13px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text2);cursor:pointer">Annulla</button>
        <button id="sm-btn-applica" onclick="smApplica()" disabled
          style="padding:7px 16px;font-size:13px;font-weight:600;background:var(--info);color:#fff;border:none;border-radius:var(--rad);cursor:pointer;opacity:.5">
          Sostituisci
        </button>
      </div>
    </div>
  </div>`);
}

function smValidateNuovo() {
  const campo = document.getElementById('sm-campo')?.value;
  const a     = document.getElementById('sm-a')?.value?.trim();
  const err   = document.getElementById('sm-a-err');
  const input = document.getElementById('sm-a');
  if (!err || !input) return;
  if (!a || !campo) {
    err.style.display = 'none'; input.style.borderColor = ''; return;
  }
  // Valori validi = tutti i valori non vuoti presenti nel DB per quel campo
  const validVals = new Set((tableData || []).map(r => r[campo] ?? '').filter(Boolean));
  const valid = validVals.size === 0 || validVals.has(a);
  err.style.display       = valid ? 'none' : 'block';
  input.style.borderColor = valid ? '' : 'var(--ko)';
}

function smUpdatePreview() {
  const campo   = document.getElementById('sm-campo')?.value;
  const da      = document.getElementById('sm-da')?.value;
  const btn     = document.getElementById('sm-btn-applica');
  const preview = document.getElementById('sm-preview');

  // Popola datalist con valori unici del campo dalle righe visibili
  if (campo) {
    const rows = _tblRows || [];
    const vals = [...new Set(rows.map(r => r[campo] ?? ''))].sort();
    const dlDa = document.getElementById('sm-dl-da');
    if (dlDa) dlDa.innerHTML = vals.map(v => `<option value="${_esc(v)}">`).join('');
    const dlA  = document.getElementById('sm-dl-a');
    if (dlA) {
      const allVals = [...new Set((tableData || []).map(r => r[campo] ?? '').filter(Boolean))].sort();
      dlA.innerHTML = allVals.map(v => `<option value="${_esc(v)}">`).join('');
    }
  }

  if (!campo || da === '' || da === undefined || da === null) {
    if (preview) preview.innerHTML = 'Seleziona campo e valore attuale per vedere l\'anteprima.';
    if (btn) { btn.disabled = true; btn.style.opacity = '.5'; }
    return;
  }

  // Conta nelle righe visibili (filtrate)
  const rows  = _tblRows || [];
  const match = rows.filter(r => (r[campo] ?? '') === da);
  if (preview) {
    const daLabel = da === '' ? '(vuoto)' : `"${_esc(da)}"`;
    preview.innerHTML = match.length > 0
      ? `<span style="color:var(--text);font-weight:600">${match.length}</span> <span style="color:var(--text2)">dei ${rows.length} dispositivi visibili hanno il valore ${daLabel} nel campo <strong>${_esc(campo)}</strong></span>`
      : `<span style="color:var(--text3)">Nessun record visibile con questo valore.</span>`;
  }
  if (btn) { btn.disabled = match.length === 0; btn.style.opacity = match.length > 0 ? '1' : '.5'; }
  window._smMatchCodici = match.map(r => r.codice);
}

async function smApplica() {
  const campo = document.getElementById('sm-campo')?.value;
  const da    = document.getElementById('sm-da')?.value;
  const a     = document.getElementById('sm-a')?.value?.trim() ?? '';
  const warn  = document.getElementById('sm-warn');

  if (!campo || da === undefined || da === null) {
    if (warn) { warn.textContent = 'Seleziona campo e valore attuale.'; warn.style.display = 'block'; } return;
  }
  if (da === a) {
    if (warn) { warn.textContent = 'Il nuovo valore è uguale a quello attuale.'; warn.style.display = 'block'; } return;
  }
  if (a) {
    const validVals = new Set((tableData || []).map(r => r[campo] ?? '').filter(Boolean));
    if (validVals.size > 0 && !validVals.has(a)) {
      if (warn) { warn.textContent = 'Nuovo valore non presente nel database.'; warn.style.display = 'block'; } return;
    }
  }

  const codici = window._smMatchCodici || [];
  if (!codici.length) return;

  const daLabel = da === '' ? '(vuoto)' : `"${da}"`;
  const aLabel  = a  === '' ? '(vuoto)' : `"${a}"`;
  if (!confirm(`Sostituire ${daLabel} con ${aLabel} in ${codici.length} record?\n\nCampo: ${campo}\n\nL'operazione non può essere annullata.`)) return;

  const newVal = a === '' ? null : a;

  // PATCH a batch via data layer (default 100 per chunk)
  const { ok, errors } = await db.dispositivi.bulkPatch(codici, { [campo]: newVal });

  // Aggiorna cache locali solo per i codici effettivamente passati
  const failedCodici = new Set(errors.flatMap(e => e.slice));
  const successCodici = codici.filter(c => !failedCodici.has(c));
  const successSet = new Set(successCodici);
  if (tableData) {
    for (const row of tableData) {
      if (successSet.has(row.codice)) row[campo] = newVal;
    }
  }
  const KEY_MAP = {
    descrizione_classe:'n', costruttore:'b', modello:'m', presidio:'loc',
    reparto:'rep', nuova_area:'na', sede_struttura:'ss', manutentore:'man',
    dettagli_stato:'ds', presenze_effettive:'pe', forma_presenza:'fp',
    verifiche:'ver', civab:'civ',
  };
  const short = KEY_MAP[campo];
  if (short) {
    for (const cod of successCodici) {
      if (DB[cod]) DB[cod][short] = newVal || '';
    }
  }

  // Aggiorna lookup: aggiungi il nuovo valore se campo è gestito a lista
  if (newVal && LOOKUP_KEYS.has(campo)) await saveLookupValue(campo, newVal);

  document.getElementById('sm-modal')?.remove();
  if (errors.length) toast(`Sostituzione completata con ${errors.length} batch falliti (${ok} OK)`, 'warn');
  else toast(`${ok} record aggiornati`, 'ok');
  renderTableView();
}

// ── Ricalcolo dinamico data prossima nel modal anagrafica ─────
function anagUpdateProssima(tipo) {
  const ultEl = document.getElementById(`anag-f-data_ultima_${tipo}`);
  const perEl = document.getElementById(`anag-f-periodicita_${tipo}`);
  const proEl = document.getElementById(`anag-f-data_prossima_${tipo}`);
  if (!ultEl || !perEl || !proEl) return;
  const calcolata = _calcProssima(ultEl.value, perEl.value);
  if (calcolata) proEl.value = calcolata;
}
