// ── EXPORT ENGINE: tabella dispositivi ──

const EXP_PROFILES_KEY = 'appwitch_export_profiles';
let _expFields  = [];
let _expDragIdx = null;

function _expLoadProfiles() {
  try { return JSON.parse(localStorage.getItem(EXP_PROFILES_KEY) || '[]'); } catch { return []; }
}
function _expSaveProfiles(p) { localStorage.setItem(EXP_PROFILES_KEY, JSON.stringify(p)); }

function openExportTblModal() {
  const allCols = _getTblCols();
  const visCols = new Set((_tblCols.length ? _tblCols : allCols).map(c => c.k));
  _expFields = allCols.map(c => ({k: c.k, l: c.l, sel: visCols.has(c.k)}));
  _expRender();
  document.getElementById('modal-export-tbl').classList.add('open');
}

function closeExportTblModal() {
  document.getElementById('modal-export-tbl').classList.remove('open');
}

function _expRender() {
  _expRenderProfileSelect();
  _expRenderFieldList();
  _expUpdateInfo();
}

function _expRenderProfileSelect() {
  const sel = document.getElementById('exp-profile-select');
  const profiles = _expLoadProfiles();
  sel.innerHTML = '<option value="">— Nessun profilo —</option>' +
    profiles.map((p, i) => `<option value="${i}">${_esc(p.name)}</option>`).join('');
}

function _expRenderFieldList() {
  const list = document.getElementById('exp-field-list');
  list.innerHTML = _expFields.map((f, i) => `
    <div class="exp-field-item" draggable="true" data-idx="${i}"
         ondragstart="_expDragStart(event,${i})"
         ondragend="_expDragEnd(event)"
         ondragover="_expDragOver(event,${i})"
         ondrop="_expDrop(event,${i})">
      <span class="exp-drag-handle">⠿</span>
      <label style="display:flex;align-items:center;gap:7px;cursor:pointer;flex:1;font-size:13px">
        <input type="checkbox" ${f.sel ? 'checked' : ''} onchange="_expToggle(${i},this.checked)">
        ${_esc(f.l)}
      </label>
    </div>`).join('');
}

function _expUpdateInfo() {
  const selCount = _expFields.filter(f => f.sel).length;
  const rowCount = tableSelected.size > 0 ? tableSelected.size : (_tblRows.length || 0);
  document.getElementById('exp-info').textContent = `${rowCount} righe · ${selCount} colonne`;
}

function _expToggle(idx, checked) {
  _expFields[idx].sel = checked;
  _expUpdateInfo();
}

function expSelectAll()   { _expFields.forEach(f => f.sel = true);  _expRenderFieldList(); _expUpdateInfo(); }
function expDeselectAll() { _expFields.forEach(f => f.sel = false); _expRenderFieldList(); _expUpdateInfo(); }

// ── Drag & Drop ──

function _expDragStart(e, idx) {
  _expDragIdx = idx;
  e.dataTransfer.effectAllowed = 'move';
}

function _expDragEnd() {
  document.querySelectorAll('#exp-field-list .exp-field-item').forEach(el => el.classList.remove('drag-over'));
}

function _expDragOver(e, idx) {
  e.preventDefault();
  document.querySelectorAll('#exp-field-list .exp-field-item').forEach(el =>
    el.classList.toggle('drag-over', parseInt(el.dataset.idx) === idx));
}

function _expDrop(e, idx) {
  e.preventDefault();
  document.querySelectorAll('#exp-field-list .exp-field-item').forEach(el => el.classList.remove('drag-over'));
  if (_expDragIdx === null || _expDragIdx === idx) { _expDragIdx = null; return; }
  const moved = _expFields.splice(_expDragIdx, 1)[0];
  _expFields.splice(idx, 0, moved);
  _expDragIdx = null;
  _expRenderFieldList();
  _expUpdateInfo();
}

// ── Profili ──

function expSaveProfile() {
  const nameInput = document.getElementById('exp-profile-name');
  const name = nameInput.value.trim();
  if (!name) { toast('Inserisci un nome per il profilo', 'warn'); return; }
  const profiles = _expLoadProfiles();
  const idx = profiles.findIndex(p => p.name === name);
  const entry = {name, fields: _expFields.map(f => ({k: f.k, l: f.l, sel: f.sel}))};
  if (idx >= 0) profiles[idx] = entry; else profiles.push(entry);
  _expSaveProfiles(profiles);
  _expRenderProfileSelect();
  document.getElementById('exp-profile-select').value = _expLoadProfiles().findIndex(p => p.name === name);
  nameInput.value = '';
  toast('Profilo salvato', 'ok');
}

function expLoadProfile() {
  const sel = document.getElementById('exp-profile-select');
  const idx = parseInt(sel.value);
  if (isNaN(idx)) return;
  const p = _expLoadProfiles()[idx];
  if (!p) return;
  const allCols   = _getTblCols();
  const inProfile = new Set(p.fields.map(f => f.k));
  _expFields = p.fields.map(f => ({...f}));
  allCols.forEach(c => { if (!inProfile.has(c.k)) _expFields.push({k: c.k, l: c.l, sel: false}); });
  document.getElementById('exp-profile-name').value = p.name;
  _expRenderFieldList();
  _expUpdateInfo();
}

function expDeleteProfile() {
  const sel = document.getElementById('exp-profile-select');
  const idx = parseInt(sel.value);
  if (isNaN(idx)) { toast('Nessun profilo selezionato', 'warn'); return; }
  const profiles = _expLoadProfiles();
  const name = profiles[idx]?.name;
  profiles.splice(idx, 1);
  _expSaveProfiles(profiles);
  _expRenderProfileSelect();
  toast(`Profilo "${name}" eliminato`, 'ok');
}

// ── Iniezione tabella Excel nel file ZIP ──

function _escXml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function _loadFflate() {
  if (typeof fflate !== 'undefined') return;
  await new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js';
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function _injectExcelTable(rawBuf, selFields, rowCount) {
  await _loadFflate();

  const zip = fflate.unzipSync(new Uint8Array(rawBuf));

  const endCol = XLSX.utils.encode_col(selFields.length - 1);
  const tblRef = `A1:${endCol}${rowCount + 1}`;

  const colsXml = selFields.map((f, i) =>
    `<tableColumn id="${i+1}" name="${_escXml(f.l)}"/>`
  ).join('');

  const tableXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
    + `<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"`
    + ` id="1" name="TabellaExport" displayName="TabellaExport" ref="${tblRef}" totalsRowShown="0">`
    + `<autoFilter ref="${tblRef}"/>`
    + `<tableColumns count="${selFields.length}">${colsXml}</tableColumns>`
    + `<tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/>`
    + `</table>`;

  zip['xl/tables/table1.xml'] = fflate.strToU8(tableXml);

  // Rimuovi autoFilter standalone dal foglio (il table ha il suo)
  const sheetKey = Object.keys(zip).find(k => /xl\/worksheets\/sheet\d+\.xml/.test(k));
  if (!sheetKey) throw new Error('Sheet XML non trovato');
  let sheetXml = fflate.strFromU8(zip[sheetKey]);
  sheetXml = sheetXml.replace(/<autoFilter[^>]*\/>/g, '').replace(/<autoFilter[^>]*>.*?<\/autoFilter>/gs, '');
  sheetXml = sheetXml.replace('</worksheet>',
    '<tableParts count="1"><tablePart r:id="rId_tbl1"/></tableParts></worksheet>');
  zip[sheetKey] = fflate.strToU8(sheetXml);

  // Rels del foglio
  const relsKey = sheetKey.replace('xl/worksheets/', 'xl/worksheets/_rels/').replace('.xml', '.xml.rels');
  const tblRel = `<Relationship Id="rId_tbl1" `
    + `Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" `
    + `Target="../tables/table1.xml"/>`;
  if (zip[relsKey]) {
    let relsXml = fflate.strFromU8(zip[relsKey]);
    relsXml = relsXml.replace('</Relationships>', tblRel + '</Relationships>');
    zip[relsKey] = fflate.strToU8(relsXml);
  } else {
    zip[relsKey] = fflate.strToU8(
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
      + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`
      + tblRel + `</Relationships>`
    );
  }

  // Content_Types
  let ctXml = fflate.strFromU8(zip['[Content_Types].xml']);
  if (!ctXml.includes('table+xml')) {
    ctXml = ctXml.replace('</Types>',
      `<Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/></Types>`);
    zip['[Content_Types].xml'] = fflate.strToU8(ctXml);
  }

  return fflate.zipSync(zip, {level: 6});
}

function _saveBuf(buf, fname) {
  const blob = new Blob([buf], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = fname; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ── Export ──

async function doExportTbl() {
  const selFields = _expFields.filter(f => f.sel);
  if (!selFields.length) { toast('Seleziona almeno una colonna', 'warn'); return; }

  if (typeof XLSX === 'undefined') {
    toast('Caricamento libreria Excel...', 'warn');
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = () => doExportTbl();
    document.head.appendChild(s);
    return;
  }

  const rows = tableSelected.size > 0
    ? (_tblRows || []).filter(r => tableSelected.has(r.codice))
    : (_tblRows || []);

  if (!rows.length) { toast('Nessuna riga da esportare', 'warn'); return; }

  const headers  = selFields.map(f => f.l);
  const dataRows = rows.map(r => selFields.map(f => r[f.k] ?? ''));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);

  const allCols = _getTblCols();
  ws['!cols'] = selFields.map(f => {
    const c = allCols.find(col => col.k === f.k);
    return {wch: c ? Math.max(10, Math.round(c.w / 7)) : 16};
  });

  XLSX.utils.book_append_sheet(wb, ws, 'Beni');

  const now   = new Date();
  const pad   = n => String(n).padStart(2, '0');
  const fname = `Esportazione_Beni_${pad(now.getDate())}-${pad(now.getMonth()+1)}-${String(now.getFullYear()).slice(2)}_${pad(now.getHours())}-${pad(now.getMinutes())}.xlsx`;

  let finalBuf;
  try {
    toast('Generazione tabella Excel...', 'warn');
    const rawBuf = XLSX.write(wb, {bookType:'xlsx', type:'array'});
    finalBuf = await _injectExcelTable(rawBuf, selFields, rows.length);
  } catch(err) {
    console.error('Inject table error:', err);
    toast('Errore generazione tabella, export semplice', 'warn');
    finalBuf = new Uint8Array(XLSX.write(wb, {bookType:'xlsx', type:'array'}));
  }

  if (window.showSaveFilePicker) {
    try {
      const handle   = await window.showSaveFilePicker({
        suggestedName: fname,
        types: [{description:'Excel Workbook', accept:{'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':['.xlsx']}}]
      });
      const writable = await handle.createWritable();
      await writable.write(finalBuf);
      await writable.close();
      toast(`Esportate ${rows.length} righe`, 'ok');
      closeExportTblModal();
    } catch(err) {
      if (err.name === 'AbortError') return;
      _saveBuf(finalBuf, fname);
      toast(`Esportate ${rows.length} righe`, 'ok');
      closeExportTblModal();
    }
  } else {
    _saveBuf(finalBuf, fname);
    toast(`Esportate ${rows.length} righe`, 'ok');
    closeExportTblModal();
  }
}
