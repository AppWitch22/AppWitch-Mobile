// Setup globale per tutti i test.
// jsdom fornisce già window/document. Qui definiamo solo helper
// e stub minimi che servono trasversalmente.

import { vi } from 'vitest';

// fetch è usato da db.js — di default mock vuoto, i singoli test
// possono sovrascrivere con `globalThis.fetch = vi.fn(...)`.
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = vi.fn(() => Promise.reject(new Error('fetch non mockato nel test')));
}

// structuredClone esiste in jsdom moderno; fallback per sicurezza.
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (v) => JSON.parse(JSON.stringify(v));
}
