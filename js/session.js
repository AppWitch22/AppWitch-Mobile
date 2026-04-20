// ─────────────────────────────────────────────────────────────
// session.js — Stato sessione attiva (migrato a store.session.*)
//
// Estratto da core.js (Step B4 piano qualità).
// Caricato in index.html DOPO sync.js (che referenzia currentSessionId).
//
// Source of truth: store.session.*
// I nomi globali legacy (currentSessionId / Title / Date / CreatorId,
// useDataUltimaVerifica) sono esposti come getter/setter su window
// via Object.defineProperty, così i ~90 callsite pre-esistenti
// continuano a funzionare senza modifiche: ogni lettura/scrittura
// passa da store.set / store.get.
// ─────────────────────────────────────────────────────────────

/** @type {[string, string][]} legacy name → store path */
const _SESS_PROXY = [
  ['currentSessionId',        'session.id'],
  ['currentSessionTitle',     'session.title'],
  ['currentSessionDate',      'session.date'],
  ['currentSessionCreatorId', 'session.creatorId'],
  ['useDataUltimaVerifica',   'session.useDataUltima'],
];

for (const [name, path] of _SESS_PROXY) {
  Object.defineProperty(window, name, {
    get() { return store.get(path); },
    set(v) { store.set(path, v); },
    configurable: true,
    enumerable: true,
  });
}

// Default per useDataUltimaVerifica (era `let x = false` in core.js)
if (store.get('session.useDataUltima') === undefined) {
  store.set('session.useDataUltima', false);
}

// ── attesi: Set codici dispositivi attesi — vive in store.session.attesi ──
function attesiSet() { return store.get('session.attesi'); }

/**
 * Muta il Set attesi clonando (nuovo riferimento → store.set notifica).
 * @param {(s: Set<string>) => void} fn
 */
function _attesiMut(fn) {
  const s = new Set(store.get('session.attesi'));
  fn(s);
  store.set('session.attesi', s);
}

// ── canEditSession: admin o chi ha creato la sessione ─────────
function canEditSession() {
  if (!currentSessionId) return false;
  if (currentUser?.profile?.role === 'admin') return true;
  return !!currentSessionCreatorId && currentSessionCreatorId === currentUser?.id;
}
