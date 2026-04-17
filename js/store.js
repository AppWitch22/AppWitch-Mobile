// ─────────────────────────────────────────────────────────────
// store.js — Store reattivo minimale (vanilla)
// API: store.get(path) / store.set(path, val) / store.subscribe(path, fn)
// path è dot-notation ('ui.syncStatus'). Subscriber notificati
// quando cambia il path o un suo discendente.
// ─────────────────────────────────────────────────────────────

function createStore(initial) {
  let state = structuredClone(initial);
  const subs = new Map(); // path(string) → Set<fn>

  function _getPath(obj, path) {
    if (!path) return obj;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  }

  function _setPath(obj, path, value) {
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
      cur = cur[p];
    }
    cur[parts[parts.length - 1]] = value;
  }

  function get(path) {
    return _getPath(state, path);
  }

  // Notifica il path stesso, i suoi antenati, e i discendenti registrati
  function _notify(path) {
    // antenati (incluso path)
    const parts = path ? path.split('.') : [];
    const ancestors = [''];
    for (let i = 0; i < parts.length; i++) {
      ancestors.push(parts.slice(0, i + 1).join('.'));
    }
    const toFire = new Set();
    for (const a of ancestors) {
      const set = subs.get(a);
      if (set) set.forEach(fn => toFire.add(fn));
    }
    // discendenti (subscriber su sotto-path)
    const prefix = path ? path + '.' : '';
    if (path !== '') {
      for (const [key, set] of subs.entries()) {
        if (key.startsWith(prefix)) set.forEach(fn => toFire.add(fn));
      }
    } else {
      // path === '' (root): notifica tutti
      for (const set of subs.values()) set.forEach(fn => toFire.add(fn));
    }
    toFire.forEach(fn => {
      try { fn(get(''), path); } catch (e) { console.error('[store] subscriber error', e); }
    });
  }

  function set(path, value) {
    const prev = _getPath(state, path);
    if (prev === value) return; // no-op su primitivi uguali
    _setPath(state, path, value);
    _notify(path);
  }

  // Update shallow merge su un oggetto a path
  function patch(path, partial) {
    const cur = _getPath(state, path) || {};
    const next = { ...cur, ...partial };
    _setPath(state, path, next);
    _notify(path);
  }

  function subscribe(path, fn, { immediate = false } = {}) {
    const key = path || '';
    if (!subs.has(key)) subs.set(key, new Set());
    subs.get(key).add(fn);
    if (immediate) {
      try { fn(get(''), key); } catch (e) { console.error('[store] subscriber error', e); }
    }
    return () => subs.get(key)?.delete(fn);
  }

  return { get, set, patch, subscribe, _state: () => state };
}

// ── Istanza globale ──────────────────────────────────────────

window.store = createStore({
  ui: {
    // 'idle' = nessuna sessione / reset; 'syncing' = in corso;
    // 'synced' = ok; 'dirty' = modifiche locali in attesa
    syncStatus: 'idle',
    sessionTitle: null,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true
  }
});
