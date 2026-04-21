// Test helper date in js/core.js:
// - _excelSerialToISO: seriale Excel → ISO YYYY-MM-DD (con opzione 1904)
// - _dateObjToISO: Date object → ISO YYYY-MM-DD (componenti locali, no TZ drift)
// - _cellToISO: cella xlsx ({t, v}) → ISO (priorità: numero > Date > stringa)
// - _toISODate: parser testuale (slash, italiano, ISO)
//
// Motivazione: il backup utente con date formattate "m/d/yy" (Excel locale US)
// veniva parsato come D/M italiano → 8-feb-2026 diventava 2-ago-2026.
// La lettura del seriale numerico bypassa tutti i formati di display.

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Estrae il corpo di una `function nome(...) { ... }` bilanciando le graffe.
// Serve perché il loader standard `loadScript` esegue tutto il file, e core.js
// ha top-level `const store/supa/...` che confliggono con gli stub passati
// come parametri a `new Function`. Le 4 funzioni helper date sono chiuse:
// _cellToISO chiama _excelSerialToISO, _dateObjToISO, _toISODate — nessuna
// dipendenza esterna. Le isoliamo per testarle in vitro.
function extractFn(code, name) {
  const idx = code.indexOf(`function ${name}`);
  if (idx < 0) throw new Error(`Function ${name} not found in source`);
  let depth = 0, seenOpen = false;
  for (let i = idx; i < code.length; i++) {
    if (code[i] === '{') { depth++; seenOpen = true; }
    else if (code[i] === '}') { depth--; if (seenOpen && depth === 0) return code.substring(idx, i + 1); }
  }
  throw new Error(`Unbalanced braces in function ${name}`);
}

let helpers;
beforeAll(() => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const src = readFileSync(resolve(__dirname, '../js/core.js'), 'utf-8');
  const names = ['_excelSerialToISO', '_dateObjToISO', '_toISODate', '_cellToISO'];
  const body = names.map((n) => extractFn(src, n)).join('\n\n');
  // _toISODate referenzia _MESI_IT_NUM (dichiarato separatamente in core.js)
  const extraDeps = 'const _MESI_IT_NUM = { gen:1,feb:2,mar:3,apr:4,mag:5,giu:6,lug:7,ago:8,set:9,ott:10,nov:11,dic:12 };\n';
  const returnExpr = '{' + names.map((n) => `${JSON.stringify(n)}:${n}`).join(',') + '}';
  const fn = new Function(`${extraDeps}${body}\n;return ${returnExpr};`);
  helpers = fn();
});

describe('_excelSerialToISO', () => {
  it('converte seriale tipico (2026-02-08) nel sistema 1900', () => {
    // Excel: 8 feb 2026 = seriale 46061 (giorni da 1899-12-30, considerando bug 1900 leap)
    // Verifica: Date(Date.UTC(2026,1,8)) ms da epoch = 1770508800000
    // → (1770508800000/86400000) + 25569 = 20491 + 25569 = 46060... aspetta
    // In realtà per Excel 1900 (con bug leap) serial 46061 = 8 feb 2026
    expect(helpers._excelSerialToISO(46061, false)).toBe('2026-02-08');
  });

  it('converte 2024-01-01 (serial 45292)', () => {
    expect(helpers._excelSerialToISO(45292, false)).toBe('2024-01-01');
  });

  it('converte nel sistema 1904 (Mac)', () => {
    // Sistema 1904: origin 1904-01-01. Serial 0 = 1904-01-01.
    // 2026-02-08 nel 1904 = giorni tra 1904-01-01 e 2026-02-08
    // (25569-24107) = 1462 di differenza vs 1900. Serial 1900 era 46061 → 1904 è 46061-1462=44599
    expect(helpers._excelSerialToISO(44599, true)).toBe('2026-02-08');
  });

  it('restituisce null per valori non-numerici o invalidi', () => {
    expect(helpers._excelSerialToISO(null, false)).toBe(null);
    expect(helpers._excelSerialToISO('abc', false)).toBe(null);
    expect(helpers._excelSerialToISO(Infinity, false)).toBe(null);
    expect(helpers._excelSerialToISO(NaN, false)).toBe(null);
  });

  it('gestisce anni bisestili reali (2024-02-29)', () => {
    // 29 feb 2024 = 45351
    expect(helpers._excelSerialToISO(45351, false)).toBe('2024-02-29');
  });
});

describe('_dateObjToISO', () => {
  it('converte Date creata con new Date(y,m,d) senza TZ shift', () => {
    const d = new Date(2026, 1, 8); // local midnight 8 feb 2026
    expect(helpers._dateObjToISO(d)).toBe('2026-02-08');
  });

  it('converte Date UTC-midnight correttamente in vari TZ (componenti locali)', () => {
    const d = new Date(2026, 6, 15); // 15 luglio 2026
    expect(helpers._dateObjToISO(d)).toBe('2026-07-15');
  });

  it('restituisce null per non-Date o Date invalide', () => {
    expect(helpers._dateObjToISO(null)).toBe(null);
    expect(helpers._dateObjToISO('2026-01-01')).toBe(null);
    expect(helpers._dateObjToISO(new Date('invalid'))).toBe(null);
  });

  it('gestisce data a cavallo mese', () => {
    const d = new Date(2025, 11, 31); // 31 dic 2025
    expect(helpers._dateObjToISO(d)).toBe('2025-12-31');
  });
});

describe('_cellToISO', () => {
  it('cella numerica (t="n") → usa seriale, ignora display format', () => {
    // Scenario reale del backup utente: cella con seriale 46061 (8 feb 2026)
    // ma formato display m/d/yy che fa vedere "2/8/26"
    const cell = { t: 'n', v: 46061, w: '2/8/26', z: 'm/d/yy' };
    expect(helpers._cellToISO(cell, false)).toBe('2026-02-08');
  });

  it('cella Date (t="d") → usa componenti locali', () => {
    const cell = { t: 'd', v: new Date(2025, 5, 20) };
    expect(helpers._cellToISO(cell, false)).toBe('2025-06-20');
  });

  it('cella stringa ISO (t="s") → pass-through via _toISODate', () => {
    const cell = { t: 's', v: '2026-02-08' };
    expect(helpers._cellToISO(cell, false)).toBe('2026-02-08');
  });

  it('cella stringa slash ambigua → _toISODate con assunzione D/M italiano', () => {
    const cell = { t: 's', v: '8/2/2026' };
    expect(helpers._cellToISO(cell, false)).toBe('2026-02-08');
  });

  it('cella stringa formato italiano → _toISODate riconosce', () => {
    const cell = { t: 's', v: '08-feb-2026' };
    expect(helpers._cellToISO(cell, false)).toBe('2026-02-08');
  });

  it('cella vuota o null → null', () => {
    expect(helpers._cellToISO(null, false)).toBe(null);
    expect(helpers._cellToISO(undefined, false)).toBe(null);
    expect(helpers._cellToISO({ t: 's', v: '' }, false)).toBe(null);
    expect(helpers._cellToISO({ t: 's', v: null }, false)).toBe(null);
  });

  it('cella stringa "-" → null (convenzione dati utente)', () => {
    expect(helpers._cellToISO({ t: 's', v: '-' }, false)).toBe(null);
  });

  it('regressione bug 04-18: seriale 46061 NON diventa 2026-08-02', () => {
    // Il bug originale: "2/8/26" parsato come D/M → 2 agosto 2026.
    // Con la fix: dal seriale numerico → 8 febbraio 2026, senza ambiguità.
    const cell = { t: 'n', v: 46061 };
    const iso = helpers._cellToISO(cell, false);
    expect(iso).toBe('2026-02-08');
    expect(iso).not.toBe('2026-08-02');
  });
});

describe('_toISODate (parser testuale esistente)', () => {
  it('ISO pass-through', () => {
    expect(helpers._toISODate('2026-02-08')).toBe('2026-02-08');
  });

  it('ISO con timestamp → solo data', () => {
    expect(helpers._toISODate('2026-02-08 12:34:56')).toBe('2026-02-08');
  });

  it('slash D/M italiano (default)', () => {
    expect(helpers._toISODate('8/2/2026')).toBe('2026-02-08');
  });

  it('slash ambiguo risolto via giorno > 12', () => {
    // "2/25/2026": b=25 > 12 → M/D forzato → feb 25
    expect(helpers._toISODate('2/25/2026')).toBe('2026-02-25');
  });

  it('anno a 2 cifre → 20XX', () => {
    expect(helpers._toISODate('8/2/26')).toBe('2026-02-08');
  });

  it('formato italiano DD-mmm-YYYY', () => {
    expect(helpers._toISODate('08-feb-2026')).toBe('2026-02-08');
  });

  it('seriale numerico stringa in range', () => {
    expect(helpers._toISODate('46061')).toBe('2026-02-08');
  });

  it('valori nulli/vuoti → null', () => {
    expect(helpers._toISODate(null)).toBe(null);
    expect(helpers._toISODate('')).toBe(null);
    expect(helpers._toISODate(undefined)).toBe(null);
  });

  it('stringa non riconoscibile → null', () => {
    expect(helpers._toISODate('domani')).toBe(null);
    expect(helpers._toISODate('-')).toBe(null);
  });
});
