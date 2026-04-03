// Genera Excel di mappatura campo-app → cella-template per VSP_DEF e CQ_DEF
// Uso: node gen_mapping.js
const XLSX = require('xlsx');

// ── Stili colonne ──────────────────────────────────────────────
const COLS_VSP = [
  { wch: 30 }, // Sezione
  { wch: 22 }, // ID campo app
  { wch: 40 }, // Etichetta
  { wch: 12 }, // Valore/Opzione
  { wch: 18 }, // Cella template
  { wch: 30 }, // Note
];

// ── Helper ─────────────────────────────────────────────────────
function row(sezione, id, etichetta, valore, cella, note='') {
  return { Sezione: sezione, 'ID campo': id, Etichetta: etichetta, 'Valore/Opzione': valore, 'Cella template': cella, Note: note };
}

// ══════════════════════════════════════════════════════════════
// VSP_DEF
// ══════════════════════════════════════════════════════════════
const vspDef = [];

// Anagrafica
vspDef.push(row('Anagrafica', 'dev.c', 'N° inventario', '(testo)', 'L11', 'Codice dispositivo'));
vspDef.push(row('Anagrafica', 'vsp_data', 'Data verifica', '(data)', 'Q54 + Q115', 'Pagina 1 e pagina 2'));
vspDef.push(row('Anagrafica', 'vsp_tecnico', 'Tecnico esecutore', '(testo)', 'D113', ''));

// Checkpoint (VSP_POINTS VSP_DEF — start riga 21, riga = 21 + (lettera−A))
const checkpoints = [
  ['A', 'Verifica prescrizioni istruzioni per la defibrillazione e/o monitoraggio ECG', ['OK','KO']],
  ['B', 'Verifica raccomandazioni elettrodi e cavi paziente', ['OK','KO']],
  ['C', 'Verifica raccomandazioni sorgente elettrica interna', ['NA','OK','KO']],
  ['D', 'Verifica prescrizioni indicatore di stato sorgente elettrica interna', ['NA','OK','KO']],
  ['E', 'Verifica prescrizioni preselettore di energia', ['NA','OK','KO']],
  ['F', 'Verifica prescrizioni preselettore tarato in Joule', ['NA','OK','KO']],
  ['G', 'Verifica prescrizioni indicatore vocale e/o sonoro di fine carica', ['OK','KO']],
  ['H', 'Verifica raccomandazioni dispositivo di ricarica automatica', ['NA','OK','KO']],
  ['I', 'Verifica prescrizioni dispositivo di auto scarica interno', ['OK','KO']],
  ['J', 'Verifica prescrizioni dispositivo di scarica', ['OK','KO']],
  ['K', 'Verifica prescrizioni energia massima selezionabile per elettrodi esterni ≤ 360 J', ['NA','OK','KO']],
  ['L', 'Verifica prescrizioni energia massima selezionabile per elettrodi interni ≤ 50 J', ['NA','OK','KO']],
  ['M', 'Verifica prescrizioni indicazione luminosa e/o sonora del dispositivo di sincronizzazione', ['NA','OK','KO']],
  ['N', "Verifica prescrizioni dispositivo di sincronizzazione non attivo all'accensione", ['NA','OK','KO']],
  ['O', 'Verifica prescrizioni indicatore vocale e/o sonoro rilevamento ritmo (DAE)', ['NA','OK','KO']],
  ['P', 'Verifica prescrizioni visualizzazione segnale ECG', ['NA','OK','KO']],
  ['Q', 'Verifica prescrizioni impossibilità attivazione contemporanea elettrodi interni ed esterni', ['OK','KO']],
  ['R', 'Verifica prescrizioni protezione da versamento liquidi', ['OK','KO']],
];

const colMap3 = ['R','S','T']; // NA, opts[0/1], opts[2]  — 3 opzioni
const colMap2 = ['S','T'];     // opts[0], opts[1]         — 2 opzioni
checkpoints.forEach(([lettera, etichetta, opts]) => {
  const riga = 21 + (lettera.charCodeAt(0) - 65);
  const id = `vsp_${lettera}`;
  if (opts.length === 2) {
    vspDef.push(row('Controlli visivi', id, `${lettera}. ${etichetta}`, opts[0], `S${riga}`, 'X se selezionato'));
    vspDef.push(row('', '', '', opts[1], `T${riga}`, 'X se selezionato'));
  } else {
    vspDef.push(row('Controlli visivi', id, `${lettera}. ${etichetta}`, opts[0], `R${riga}`, 'X se selezionato'));
    vspDef.push(row('', '', '', opts[1], `S${riga}`, 'X se selezionato'));
    vspDef.push(row('', '', '', opts[2], `T${riga}`, 'X se selezionato'));
  }
});

// Energia erogata
const colEn = ['F','I','L','O','R'];
for (let i = 1; i <= 5; i++) {
  vspDef.push(row('Precisione energia erogata', `def_e${i}i`, `E${i} Impostato (J)`, '(numero)', `${colEn[i-1]}69`, ''));
  vspDef.push(row('', `def_e${i}m`, `E${i} Misurato (J)`, '(numero)', `${colEn[i-1]}70`, ''));
}
vspDef.push(row('Precisione energia erogata', 'def_dae_mis', 'DAE Misurato (J)', '(numero)', 'F72', ''));
vspDef.push(row('Precisione energia erogata', 'def_e_esito', 'Esito sezione', 'NA', 'R74', 'X se selezionato'));
vspDef.push(row('', '', '', 'OK', 'S74', 'X se selezionato'));
vspDef.push(row('', '', '', 'KO', 'T74', 'X se selezionato'));

// Tempi di carica
const tcConf = [
  ['A', 'def_tc_ar', 'def_tc_ab', 'N79', 'P79', 'T79', 'N/A A+B'],
  ['B', 'def_tc_br', 'def_tc_bb', 'N80', 'P80', '', ''],
  ['C', 'def_tc_cr', 'def_tc_cb', 'N81', 'P81', 'T81', 'N/A C+D'],
  ['D', 'def_tc_dr', 'def_tc_db', 'N83', 'P83', '', ''],
];
tcConf.forEach(([conf, idR, idB, cellR, cellB, cellNA, notaNA]) => {
  vspDef.push(row('Tempi di carica', idR, `Conf. ${conf} — Rete (s)`, '(numero)', cellR, ''));
  vspDef.push(row('', idB, `Conf. ${conf} — Batteria (s)`, '(numero)', cellB, ''));
  if (cellNA) {
    const naId = conf === 'A' ? 'def_tc_ab_na' : 'def_tc_cd_na';
    vspDef.push(row('', naId, `N/A ${conf==='A'?'A+B':'C+D'}`, 'X', cellNA, 'X se spuntato'));
  }
});
vspDef.push(row('Tempi di carica', 'def_tc_ok', 'Esito OK globale', 'X', 'T85', 'X se spuntato'));

// Tempi di ritardo
const trConf = [
  ['A', 'def_tr_ar', 'def_tr_am', 'def_tr_a_esito', 'O90', 'Q90', 'S90', 'T90'],
  ['B', 'def_tr_br', 'def_tr_bm', 'def_tr_b_esito', 'O91', 'Q91', 'S91', 'T91'],
  ['C', 'def_tr_cr', 'def_tr_cm', 'def_tr_c_esito', 'O92', 'Q92', 'S92', 'T92'],
];
trConf.forEach(([conf, idRil, idMax, idEsito, cellRil, cellMax, cellNA, cellOK]) => {
  vspDef.push(row('Tempi di ritardo', idRil, `Conf. ${conf} — Rilevato (s)`, '(numero)', cellRil, ''));
  vspDef.push(row('', idMax, `Conf. ${conf} — Max (s)`, '(numero)', cellMax, ''));
  vspDef.push(row('', idEsito, `Conf. ${conf} — Esito`, 'NA', cellNA, 'X se selezionato'));
  vspDef.push(row('', '', '', 'OK', cellOK, 'X se selezionato'));
});

// Raccomandazioni
const racData = [
  ['def_rac_a', 'A — Verifica prescrizioni parti applicate di tipo BF o CF'],
  ['def_rac_b', 'B — Verifica prescrizioni parti applicate elettrodi ECG separati di tipo CF'],
  ['def_rac_c', 'C — Verifica prescrizioni parti applicate a prova di defibrillazione'],
];
// Raccomandazioni: sezione di sola lettura nel template, nessuna cella da scrivere
racData.forEach(([id, etichetta]) => {
  vspDef.push(row('Raccomandazioni', id, etichetta, 'NA/OK/KO', '—', 'Sezione di sola lettura — nessuna azione necessaria'));
});

// Strumentazione
vspDef.push(row('Strumentazione', 'def_strum', 'Strumento', '(testo)', 'A105', ''));
vspDef.push(row('', 'def_mod', 'Modello', '(testo)', 'E105', ''));
vspDef.push(row('', 'def_ser', 'N° Serie', '(testo)', 'I105', ''));
vspDef.push(row('', 'def_cert', 'Certificato N.', '(testo)', 'M105', ''));
vspDef.push(row('', 'def_scad', 'Scadenza taratura', '(data)', 'Q105', 'Formato data Excel'));


// ══════════════════════════════════════════════════════════════
// CQ_DEF
// ══════════════════════════════════════════════════════════════
const cqDef = [];

// Anagrafica
cqDef.push(row('Anagrafica', 'dev.c', 'N° inventario', '(testo)', 'N6', 'Codice dispositivo'));
cqDef.push(row('Anagrafica', 'asl', 'ASL', '(testo)', 'D11', ''));
cqDef.push(row('Anagrafica', 'dev.rep', 'Reparto', '(testo)', 'N11', ''));
cqDef.push(row('Anagrafica', 'dev.b', 'Marca', '(testo)', 'D12', ''));
cqDef.push(row('Anagrafica', 'dev.m', 'Modello', '(testo)', 'D13', ''));
cqDef.push(row('Anagrafica', 'dev.mat', 'Matricola', '(testo)', 'N13', ''));
cqDef.push(row('Anagrafica', 'cq_data', 'Data verifica', '(data)', 'Q54 + Q115', 'Pagina 1 e pagina 2'));
cqDef.push(row('Anagrafica', 'cq_tecnico', 'Tecnico esecutore', '(testo)', 'D105', ''));

// Tipologia
cqDef.push(row('Tipologia e opzioni', 'cq_def_tipo_man', 'Manuale (X)', 'X', 'K15', 'X se spuntato'));
cqDef.push(row('', 'cq_def_tipo_dae', 'DAE (X)', 'X', 'P15', 'X se spuntato'));
cqDef.push(row('', 'cq_def_opt_pac', 'Pacing (X)', 'X', 'F18', 'X se spuntato'));
cqDef.push(row('', 'cq_def_opt_nibp', 'NIBP (X)', 'X', 'K18', 'X se spuntato'));
cqDef.push(row('', 'cq_def_opt_spo2', 'SPO2 (X)', 'X', 'P18', 'X se spuntato'));

// Controlli visivi CQ_DEF
const cqCkRows = { '1_1':20, '1_2':22, '1_3':25, '1_4':27, '1_5':30, '1_6':32, '1_7':34 };
Object.entries(cqCkRows).forEach(([pid, riga]) => {
  cqDef.push(row('Controlli visivi', `cq_vis_${pid}`, `Punto ${pid}`, 'OK', `R${riga}`, 'X se selezionato'));
  cqDef.push(row('', '', '', 'KO', `S${riga}`, 'X se selezionato'));
  cqDef.push(row('', '', '', 'NA', `T${riga}`, 'X se selezionato'));
});

// Energia erogata (6 misure, righe 73-78) + esito per riga (NA/OK)
for (let i = 1; i <= 6; i++) {
  cqDef.push(row('Energia erogata', `cq_def_e${i}i`, `E${i} Impostata (J)`, '(numero)', `A${72+i}`, ''));
  cqDef.push(row('', `cq_def_e${i}m`, `E${i} Misurata (J)`, '(numero)', `I${72+i}`, ''));
  cqDef.push(row('', `cq_def_e${i}_esito`, `E${i} Esito`, 'NA', '?', 'Cella da verificare nel template'));
  cqDef.push(row('', '', '', 'OK', '?', 'Cella da verificare nel template'));
}

// Strumentazione
cqDef.push(row('Strumentazione', 'cq_strum', 'Strumento', '(testo)', 'A85', ''));
cqDef.push(row('', 'cq_strum_mod', 'Modello', '(testo)', 'E85', ''));
cqDef.push(row('', 'cq_strum_ser', 'N° Serie', '(testo)', 'I85', ''));
cqDef.push(row('', 'cq_strum_cert', 'Certificato N.', '(testo)', 'M85', ''));
cqDef.push(row('', 'cq_strum_scad', 'Scadenza taratura', '(data)', 'Q85', 'Formato data Excel'));


// ══════════════════════════════════════════════════════════════
// Genera Excel
// ══════════════════════════════════════════════════════════════
function makeSheet(data, cols) {
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = cols;
  return ws;
}

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, makeSheet(vspDef, COLS_VSP), 'VSP_DEF');
XLSX.utils.book_append_sheet(wb, makeSheet(cqDef, COLS_VSP), 'CQ_DEF');

const outPath = 'mappatura_celle_VSP_CQ_DEF_v2.xlsx';
XLSX.writeFile(wb, outPath);
console.log(`Creato: ${outPath}`);
