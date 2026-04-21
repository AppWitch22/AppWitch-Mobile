#!/usr/bin/env node
// tools/preview_import.js — simula l'import senza toccare il DB.
//
// Usa la STESSA logica di admin.js:importDatabaseDispositivi (lettura celle
// raw via _cellToISO) per mostrare quali valori finirebbero in Supabase.
// Utile per:
//   - Verificare un file prima di caricarlo dall'app
//   - Diagnosticare anomalie (date future in data_ultima_*, celle non
//     riconosciute, colonne sconosciute)
//
// Uso:
//   node tools/preview_import.js path/al/file.xlsx
//   node tools/preview_import.js path/al/file.xlsx --verbose
//   node tools/preview_import.js path/al/file.xlsx --codice 0000675
//
// Non fa alcuna scrittura. Stampa solo un report.

import XLSX from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Estrazione helper date da js/core.js ─────────────────────────
// Stesso trick del test: estraiamo le 4 funzioni per avere il comportamento
// identico alla app, senza dover caricare tutto core.js (che dipende da store/supa).
function extractFn(code, name) {
  const idx = code.indexOf(`function ${name}`);
  if (idx < 0) throw new Error(`Function ${name} not found`);
  let depth = 0, seen = false;
  for (let i = idx; i < code.length; i++) {
    if (code[i] === '{') { depth++; seen = true; }
    else if (code[i] === '}') { depth--; if (seen && depth === 0) return code.substring(idx, i + 1); }
  }
  throw new Error(`Unbalanced braces in ${name}`);
}
const coreSrc = fs.readFileSync(path.resolve(__dirname, '../js/core.js'), 'utf-8');
const NAMES = ['_excelSerialToISO', '_dateObjToISO', '_toISODate', '_cellToISO'];
const body = NAMES.map((n) => extractFn(coreSrc, n)).join('\n\n');
const ret = '{' + NAMES.map((n) => `${JSON.stringify(n)}:${n}`).join(',') + '}';
const helpers = new Function(
  `const _MESI_IT_NUM = { gen:1,feb:2,mar:3,apr:4,mag:5,giu:6,lug:7,ago:8,set:9,ott:10,nov:11,dic:12 };\n${body}\n;return ${ret};`
)();

// ── DATE_KEYS e DB_COLS — replicate da core.js/admin.js ─────────
const DATE_KEYS = new Set([
  'proposta_dismissione','dismissione_effettiva','data_fine_garanzia',
  'data_ultima_vse','data_prossima_vse','data_ultima_vsp','data_prossima_vsp',
  'data_ultima_mo','data_prossima_mo','data_ultima_cq','data_prossima_cq',
  'fine_service_comodato','data_collaudo',
  'data_inizio_gestione','data_delibera',
]);
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
  ...Array.from({ length: 22 }, (_, i) => `jolly_${i + 1}`),
]);

// ── CLI args ─────────────────────────────────────────────────────
const args = process.argv.slice(2);
// Primo argomento non-flag = filePath. Gli argomenti dopo `--codice` vanno parsati.
const filePath = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--codice');
const verbose = args.includes('--verbose');
const codIdx = args.indexOf('--codice');
const codiceFilter = codIdx >= 0 && args[codIdx + 1] && !args[codIdx + 1].startsWith('--')
  ? args[codIdx + 1] : null;

if (!filePath) {
  console.error('Uso: node tools/preview_import.js <file.xlsx> [--verbose] [--codice 0000675]');
  process.exit(1);
}
if (!fs.existsSync(filePath)) {
  console.error(`File non trovato: ${filePath}`);
  process.exit(1);
}

// ── Lettura e pre-processing date (stessa logica di admin.js) ───
const wb = XLSX.readFile(filePath, { cellDates: true });
const sheetName = wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
const date1904 = !!(wb.Workbook && wb.Workbook.WBProps && wb.Workbook.WBProps.date1904);
const rows = XLSX.utils.sheet_to_json(ws, { defval: null, raw: false });

console.log(`\n📄 File: ${filePath}`);
console.log(`📑 Sheet: ${sheetName} · righe: ${rows.length} · sistema data: ${date1904 ? '1904 (Mac)' : '1900'}`);
if (rows.length === 0) { console.log('(file vuoto)'); process.exit(0); }

// Override date columns with cell-level ISO parsing
const range = XLSX.utils.decode_range(ws['!ref']);
const dateColLetters = {};
for (let c = range.s.c; c <= range.e.c; c++) {
  const hdr = ws[XLSX.utils.encode_cell({ r: range.s.r, c })];
  if (!hdr || hdr.v == null) continue;
  const key = String(hdr.v).trim();
  if (DATE_KEYS.has(key)) dateColLetters[key] = XLSX.utils.encode_col(c);
}
for (let i = 0; i < rows.length; i++) {
  for (const [key, col] of Object.entries(dateColLetters)) {
    const addr = col + (range.s.r + 2 + i);
    rows[i][key] = helpers._cellToISO(ws[addr], date1904);
  }
}

// ── Analisi colonne ──────────────────────────────────────────────
const cols = Object.keys(rows[0]);
const unknown = cols.filter((c) => {
  if (c === 'updated_at') return false;
  if (DB_COLS.has(c) || DB_COLS.has(c.toLowerCase())) return false;
  if (/^jolly/i.test(c)) return false;
  return true;
});

console.log(`\n🗂️  Colonne file: ${cols.length} · riconosciute DATE_KEYS: ${Object.keys(dateColLetters).length}`);
if (unknown.length) {
  console.log(`⚠️  Colonne sconosciute (verranno skippate in import): ${unknown.length}`);
  console.log(`   ${unknown.join(', ')}`);
}

// ── Anomalie semantiche (come vede la validazione in admin.js) ──
const today = new Date(); today.setHours(0, 0, 0, 0);
const pad = (n) => String(n).padStart(2, '0');
const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
const ULTIMA = ['data_ultima_vse', 'data_ultima_mo', 'data_ultima_vsp', 'data_ultima_cq'];
const isoRx = /^\d{4}-\d{2}-\d{2}$/;
const future = [];
const inverted = [];
for (const r of rows) {
  const cod = r.codice || '(senza)';
  for (const k of ULTIMA) {
    const u = r[k];
    if (u && isoRx.test(u) && u > todayISO) future.push({ cod, k, u });
    const p = r[k.replace('_ultima_', '_prossima_')];
    if (u && p && isoRx.test(u) && isoRx.test(p) && u > p) {
      inverted.push({ cod, k, u, p });
    }
  }
}

console.log(`\n📅 Anomalie data (oggi = ${todayISO}):`);
console.log(`   • data_ultima_* > oggi:      ${future.length}`);
console.log(`   • ultima > prossima (coppia): ${inverted.length}`);
if (future.length) {
  console.log('\n   Esempi (primi 10):');
  for (const f of future.slice(0, 10)) console.log(`     ${f.cod} · ${f.k} = ${f.u}`);
}

// ── Stats parsing per colonna data ───────────────────────────────
console.log('\n📊 Parsing colonne data (dopo _cellToISO):');
for (const k of Object.keys(dateColLetters)) {
  let ok = 0, nullCount = 0;
  for (const r of rows) {
    const v = r[k];
    if (v == null) nullCount++;
    else if (isoRx.test(v)) ok++;
    else nullCount++;
  }
  console.log(`   ${k}: ISO ok=${ok} · null/vuoti=${nullCount}`);
}

// ── Filtro per codice specifico ─────────────────────────────────
if (codiceFilter) {
  console.log(`\n🔍 Dettaglio codice = ${codiceFilter}:`);
  const row = rows.find((r) => String(r.codice) === codiceFilter);
  if (!row) {
    console.log('   (non trovato)');
  } else {
    for (const k of Object.keys(dateColLetters)) {
      const addr = dateColLetters[k] + (rows.indexOf(row) + 2);
      const cell = ws[addr];
      const cellInfo = cell ? `t=${cell.t} v=${JSON.stringify(cell.v)} w="${cell.w || ''}"` : '(cella vuota)';
      console.log(`   ${k}: ${row[k]}    [${cellInfo}]`);
    }
  }
}

if (verbose) {
  console.log('\n📋 Prime 5 righe (solo colonne data):');
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const r = rows[i];
    const dateVals = Object.fromEntries(Object.keys(dateColLetters).map((k) => [k, r[k]]));
    console.log(`   [${i + 2}] codice=${r.codice}:`, dateVals);
  }
}

console.log(`\n${future.length === 0 && inverted.length === 0 ? '✅' : '⚠️'} Report completato.`);
if (future.length > 0) {
  console.log('   Import verrebbe intercettato dalla validazione in admin.js (commit a87848f).');
}
