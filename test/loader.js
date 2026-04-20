// loader.js — carica un file vanilla JS classico (no ESM) iniettando
// stub per le globali esterne ed estraendo le funzioni richieste.
//
// I file js/*.js usano `function foo() {}` top-level: in browser questi
// diventano window.foo. Nei test non gira un browser reale, quindi
// usiamo `new Function(...stubs, code + return {...})` per eseguire
// il file in uno scope dove le globali esterne sono parametri locali
// e per recuperare le funzioni interne come oggetto.

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

/**
 * @param {string} relPath path relativo alla repo root, es 'js/store.js'
 * @param {string[]} names nomi top-level da estrarre (function/var/const)
 * @param {Record<string, any>} stubs globali esterne da iniettare
 * @returns {Record<string, any>} oggetto con i nomi richiesti
 */
export function loadScript(relPath, names = [], stubs = {}) {
  const code = readFileSync(resolve(repoRoot, relPath), 'utf-8');
  const keys = Object.keys(stubs);
  const values = keys.map((k) => stubs[k]);

  // Costruisce: return { name1: typeof name1!=='undefined'?name1:undefined, ... }
  const returnExpr =
    '{' +
    names
      .map((n) => `${JSON.stringify(n)}: (typeof ${n}!=='undefined'?${n}:undefined)`)
      .join(',') +
    '}';

  // 'use strict' sarebbe meglio ma alcuni file usano pattern non-strict
  const fn = new Function(...keys, `${code}\n;return ${returnExpr};`);
  return fn(...values);
}
