// ─────────────────────────────────────────────────────────────
// db.js — Data Layer unificato
// Incapsula tutte le chiamate a Supabase (REST + Storage + Auth).
// Dipendenze: core.js (supa, SUPA_URL, SUPA_KEY, supaToken, supaHdrs, currentUser)
// ─────────────────────────────────────────────────────────────

class DbError extends Error {
  constructor(msg, { status = 0, code = '', body = '' } = {}) {
    super(msg);
    this.name = 'DbError';
    this.status = status;
    this.code = code;
    this.body = body;
  }
  isDuplicate() {
    return this.code === '23505' || /duplicate|unique/i.test(this.body);
  }
}

// ── Helpers interni ──────────────────────────────────────────

function _aslKey() {
  return (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
}

async function _hdrs(extra) {
  const token = await supaToken();
  return { ...supaHdrs(token), ...(extra || {}) };
}

function _qs(params) {
  if (!params) return '';
  const out = [];
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue;
    out.push(`${k}=${typeof v === 'string' && v.includes('=') ? v : encodeURIComponent(v)}`);
  }
  return out.length ? '?' + out.join('&') : '';
}

async function _req(path, { method = 'GET', body, headers, raw = false } = {}) {
  const url = `${SUPA_URL}/rest/v1/${path}`;
  const opts = { method, headers: await _hdrs(headers) };
  if (body !== undefined) opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    let code = '';
    try { code = JSON.parse(txt)?.code || ''; } catch (e) {}
    throw new DbError(`HTTP ${res.status}`, { status: res.status, code, body: txt });
  }
  if (raw) return res;
  if (method === 'DELETE' || res.status === 204) return null;
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

// Batch in.(...) per PATCH/DELETE su più codici
async function _batchInFilter(tabella, campo, valori, { method = 'PATCH', body, batchSize = 100 }) {
  const errors = [];
  for (let i = 0; i < valori.length; i += batchSize) {
    const slice = valori.slice(i, i + batchSize);
    const filter = `${campo}=in.(${slice.map(v => encodeURIComponent(v)).join(',')})`;
    try {
      await _req(`${tabella}?${filter}`, {
        method, body,
        headers: { 'Prefer': 'return=minimal' }
      });
    } catch (e) { errors.push({ slice, error: e }); }
  }
  return errors;
}

// ── db.dispositivi ───────────────────────────────────────────

const _dispositivi = {
  _tbl() { return `dispositivi_${_aslKey()}`; },

  async get(codice) {
    const rows = await _req(`${this._tbl()}?codice=eq.${encodeURIComponent(codice)}&limit=1`);
    return rows?.[0] || null;
  },

  async list({ select = '*', filter = '', limit, offset, order } = {}) {
    const parts = [`select=${select}`];
    if (filter) parts.push(filter);
    if (limit != null) parts.push(`limit=${limit}`);
    if (offset != null) parts.push(`offset=${offset}`);
    if (order) parts.push(`order=${order}`);
    return await _req(`${this._tbl()}?${parts.join('&')}`);
  },

  async insert(data) {
    const body = { ...data };
    Object.keys(body).forEach(k => { if (body[k] == null) delete body[k]; });
    return await _req(this._tbl(), {
      method: 'POST',
      body,
      headers: { 'Prefer': 'return=minimal' }
    });
  },

  async update(codice, patch) {
    return await _req(`${this._tbl()}?codice=eq.${encodeURIComponent(codice)}`, {
      method: 'PATCH',
      body: patch,
      headers: { 'Prefer': 'return=minimal' }
    });
  },

  async delete_(codice) {
    return await _req(`${this._tbl()}?codice=eq.${encodeURIComponent(codice)}`, {
      method: 'DELETE'
    });
  },

  // PATCH batch su più codici — ritorna { ok: n, errors: [...] }
  async bulkPatch(codici, patch, { batchSize = 100 } = {}) {
    const errors = await _batchInFilter(this._tbl(), 'codice', codici, {
      method: 'PATCH', body: patch, batchSize
    });
    return { ok: codici.length - errors.reduce((s, e) => s + e.slice.length, 0), errors };
  },
};

// ── db.configAsl ─────────────────────────────────────────────

const _configAsl = {
  async getJolly() {
    const rows = await _req(`config_asl?asl=eq.${encodeURIComponent(_aslKey())}&limit=1`);
    return rows?.[0]?.jolly_labels || null;
  },

  async saveJolly(meta) {
    return await _req('config_asl', {
      method: 'POST',
      body: { asl: _aslKey(), jolly_labels: meta },
      headers: { 'Prefer': 'resolution=merge-duplicates' }
    });
  },
};

// ── Export globale ───────────────────────────────────────────

window.db = {
  dispositivi: _dispositivi,
  configAsl:   _configAsl,
  DbError,
  _aslKey,
};
