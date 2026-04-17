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

// ── db.sessioni ──────────────────────────────────────────────

const _sessioni = {
  async create({ titolo, utente_id, asl, data_verifica }) {
    const rows = await _req('sessioni', {
      method: 'POST',
      body: { titolo, utente_id, asl, data_verifica }
    });
    return Array.isArray(rows) ? rows[0] : rows;
  },

  async list({ asl, utenteId, select = 'id,titolo,data_verifica,data_aggiornamento,utente_id', limit = 50, order = 'data_aggiornamento.desc' } = {}) {
    const parts = [`select=${select}`, `limit=${limit}`, `order=${order}`];
    if (utenteId) parts.push(`utente_id=eq.${encodeURIComponent(utenteId)}`);
    else if (asl) parts.push(`asl=eq.${encodeURIComponent(asl)}`);
    return await _req(`sessioni?${parts.join('&')}`);
  },

  async update(id, patch) {
    return await _req(`sessioni?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: patch,
      headers: { 'Prefer': 'return=minimal' }
    });
  },

  async delete_(id) {
    return await _req(`sessioni?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  touchAggiornamento(id) {
    return this.update(id, { data_aggiornamento: new Date().toISOString() });
  },
};

// ── db.schede ────────────────────────────────────────────────

const _schede = {
  async listBySessione(sessioneId, { select = '*' } = {}) {
    return await _req(`sessione_schede?sessione_id=eq.${encodeURIComponent(sessioneId)}&select=${select}`);
  },

  async listByCodice(codice, { select = '*', limit = 200, order = 'sessione_id.desc' } = {}) {
    return await _req(`sessione_schede?codice=eq.${encodeURIComponent(codice)}&select=${select}&order=${order}&limit=${limit}`);
  },

  async exists(sessioneId, codice) {
    const rows = await _req(`sessione_schede?sessione_id=eq.${encodeURIComponent(sessioneId)}&codice=eq.${encodeURIComponent(codice)}&select=codice`);
    return rows?.length > 0;
  },

  async insert(payload) {
    return await _req('sessione_schede', {
      method: 'POST',
      body: payload,
      headers: { 'Prefer': 'return=minimal' }
    });
  },

  async update(sessioneId, codice, patch) {
    return await _req(`sessione_schede?sessione_id=eq.${encodeURIComponent(sessioneId)}&codice=eq.${encodeURIComponent(codice)}`, {
      method: 'PATCH',
      body: patch,
      headers: { 'Prefer': 'return=minimal' }
    });
  },

  // PATCH-first con Content-Range: PostgREST ritorna N righe modificate.
  // Se 0 → INSERT. Elimina i 409 in console nello scenario comune.
  async upsert(payload) {
    const { sessione_id, codice } = payload;
    const res = await _req(
      `sessione_schede?sessione_id=eq.${encodeURIComponent(sessione_id)}&codice=eq.${encodeURIComponent(codice)}`,
      {
        method: 'PATCH',
        body: payload,
        headers: { 'Prefer': 'count=exact,return=minimal' },
        raw: true
      }
    );
    const cr = res.headers.get('Content-Range');
    const modified = cr ? parseInt(cr.split('/').pop(), 10) : 0;
    if (modified > 0) return null;
    return await this.insert(payload);
  },

  // Upsert della scheda speciale __attesi__ (PATCH-first, come upsert)
  async upsertAttesi(sessioneId, lista) {
    return await this.upsert({
      sessione_id: sessioneId,
      codice: '__attesi__',
      dati_vse: { lista },
      dati_mp: null, dati_vsp: null, dati_cq: null
    });
  },

  async deleteBySessione(sessioneId) {
    return await _req(`sessione_schede?sessione_id=eq.${encodeURIComponent(sessioneId)}`, { method: 'DELETE' });
  },

  async deleteOne(sessioneId, codice) {
    return await _req(`sessione_schede?sessione_id=eq.${encodeURIComponent(sessioneId)}&codice=eq.${encodeURIComponent(codice)}`, { method: 'DELETE' });
  },
};

// ── db.storico ───────────────────────────────────────────────

const _storico = {
  async listByCodice(codice, { limit = 200, order = 'data.desc' } = {}) {
    return await _req(`storico_verifiche?codice=eq.${encodeURIComponent(codice)}&order=${order}&limit=${limit}`);
  },

  // List paginata con count totale (usa Content-Range).
  // Ritorna { rows, total }.
  async listByAsl({ aslKey, filtri = {}, offset = 0, pageSize = 50, order = 'data.desc' } = {}) {
    const parts = [
      `asl=ilike.*${encodeURIComponent(aslKey)}*`,
      `order=${order}`,
      `limit=${pageSize}`,
      `offset=${offset}`
    ];
    if (filtri.da)        parts.push(`data=gte.${filtri.da}`);
    if (filtri.a)         parts.push(`data=lte.${filtri.a}`);
    if (filtri.tipo)      parts.push(`tipo=eq.${encodeURIComponent(filtri.tipo)}`);
    if (filtri.esito)     parts.push(`esito=eq.${encodeURIComponent(filtri.esito)}`);
    if (filtri.categoria) parts.push(`categoria=eq.${encodeURIComponent(filtri.categoria)}`);
    const res = await _req(`storico_verifiche?${parts.join('&')}`, {
      headers: { 'Range-Unit': 'items', 'Range': `${offset}-${offset + pageSize - 1}`, 'Prefer': 'count=exact' },
      raw: true
    });
    const rows  = await res.json();
    const cr    = res.headers.get('Content-Range') || '';
    const total = parseInt(cr.split('/')[1] || '0') || 0;
    return { rows, total };
  },

  async update(id, patch) {
    return await _req(`storico_verifiche?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: patch,
      headers: { 'Prefer': 'return=minimal' }
    });
  },

  async delete_(id) {
    return await _req(`storico_verifiche?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async insertMany(rows, { ignoreDuplicates = false } = {}) {
    if (!rows?.length) return null;
    const prefer = ignoreDuplicates
      ? 'return=minimal,resolution=ignore-duplicates'
      : 'return=minimal';
    return await _req('storico_verifiche', {
      method: 'POST',
      body: rows,
      headers: { 'Prefer': prefer }
    });
  },
};

// ── db.lookupAsl ─────────────────────────────────────────────

const _lookupAsl = {
  // Ritorna array di { campo, valore } per l'ASL dell'utente corrente
  async listByAsl() {
    return await _req(`lookup_asl?asl=eq.${encodeURIComponent(_aslKey())}&select=campo,valore`);
  },

  async insert(campo, valore) {
    return await _req('lookup_asl', {
      method: 'POST',
      body: { asl: _aslKey(), campo, valore },
      headers: { 'Prefer': 'resolution=ignore-duplicates' }
    });
  },

  async delete_(campo, valore) {
    return await _req(
      `lookup_asl?asl=eq.${encodeURIComponent(_aslKey())}&campo=eq.${encodeURIComponent(campo)}&valore=eq.${encodeURIComponent(valore)}`,
      { method: 'DELETE' }
    );
  },
};

// ── db.preset ────────────────────────────────────────────────
// Tabelle: preset_{vse|mp|vsp|cq}_{asl}
// - VSE/MP: colonne (codice, dati)
// - VSP/CQ: colonne (codice, tipo, dati)

const _preset = {
  _tbl(kind) { return `preset_${kind}_${_aslKey()}`; },

  _hasTipo(kind) { return kind === 'vsp' || kind === 'cq'; },

  async list(kind) {
    const cols = this._hasTipo(kind) ? 'codice,tipo,dati' : 'codice,dati';
    return await _req(`${this._tbl(kind)}?select=${cols}&limit=10000`);
  },

  // PATCH-first upsert: se 0 righe modificate → INSERT.
  async upsert(kind, codice, tipo, dati) {
    const filter = this._hasTipo(kind)
      ? `codice=eq.${encodeURIComponent(codice)}&tipo=eq.${encodeURIComponent(tipo)}`
      : `codice=eq.${encodeURIComponent(codice)}`;
    const res = await _req(`${this._tbl(kind)}?${filter}`, {
      method: 'PATCH',
      body: { dati },
      headers: { 'Prefer': 'count=exact,return=minimal' },
      raw: true
    });
    const cr = res.headers.get('Content-Range');
    const modified = cr ? parseInt(cr.split('/').pop(), 10) : 0;
    if (modified > 0) return;
    const body = this._hasTipo(kind) ? { codice, tipo, dati } : { codice, dati };
    return await _req(this._tbl(kind), {
      method: 'POST',
      body,
      headers: { 'Prefer': 'return=minimal' }
    });
  },

  // Insert a batch con merge-duplicates. Rilancia l'errore al chiamante.
  async insertBatch(kind, rows) {
    if (!rows?.length) return;
    return await _req(this._tbl(kind), {
      method: 'POST',
      body: rows,
      headers: { 'Prefer': 'return=minimal,resolution=merge-duplicates' }
    });
  },
};

// ── Export globale ───────────────────────────────────────────

window.db = {
  dispositivi: _dispositivi,
  configAsl:   _configAsl,
  sessioni:    _sessioni,
  schede:      _schede,
  storico:     _storico,
  lookupAsl:   _lookupAsl,
  preset:      _preset,
  DbError,
  _aslKey,
};
