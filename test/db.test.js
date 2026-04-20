// Test per js/db.js — focus sui helper puri (_aslKey, _qs) e sulla
// costruzione URL/headers nelle namespace facade.
//
// db.js dipende da: currentUser, supa, SUPA_URL, SUPA_KEY, supaToken,
// supaHdrs. Vengono iniettati come stub via loader.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadScript } from './loader.js';

function makeStubs(currentUser = null) {
  return {
    currentUser,
    supa: { storage: { from: () => ({ upload: vi.fn(), download: vi.fn(), remove: vi.fn() }) } },
    SUPA_URL: 'https://example.supabase.co',
    SUPA_KEY: 'fake-anon-key',
    supaToken: async () => 'fake-token',
    supaHdrs: (token) => ({
      apikey: 'fake-anon-key',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
  };
}

describe('db._aslKey', () => {
  it('estrae il nome ASL minuscolo senza prefisso "asl "', () => {
    const stubs = makeStubs({ profile: { asl: 'ASL Avellino' } });
    const { _aslKey } = loadScript('js/db.js', ['_aslKey'], stubs);
    expect(_aslKey()).toBe('avellino');
  });

  it('default a "benevento" se currentUser è null', () => {
    const stubs = makeStubs(null);
    const { _aslKey } = loadScript('js/db.js', ['_aslKey'], stubs);
    expect(_aslKey()).toBe('benevento');
  });

  it('default a "benevento" se profile manca', () => {
    const stubs = makeStubs({ id: 'u1' });
    const { _aslKey } = loadScript('js/db.js', ['_aslKey'], stubs);
    expect(_aslKey()).toBe('benevento');
  });
});

describe('db._qs', () => {
  const { _qs } = loadScript('js/db.js', ['_qs'], makeStubs());

  it('costruisce query string semplice', () => {
    expect(_qs({ a: '1', b: '2' })).toBe('?a=1&b=2');
  });

  it('ritorna stringa vuota per oggetto vuoto o null', () => {
    expect(_qs({})).toBe('');
    expect(_qs(null)).toBe('');
  });

  it('salta valori null/undefined/stringa-vuota', () => {
    expect(_qs({ a: '1', b: null, c: undefined, d: '' })).toBe('?a=1');
  });

  it('preserva i filtri PostgREST con "=" nel valore (eq.X, in.(X,Y))', () => {
    // Pattern usato nei filtri lista: "campo=eq.valore"
    expect(_qs({ codice: 'eq.ABC123' })).toBe('?codice=eq.ABC123');
  });

  it('URL-encodifica caratteri speciali quando il valore non contiene "="', () => {
    expect(_qs({ q: 'a&b' })).toBe('?q=a%26b');
    expect(_qs({ q: 'spazio nel mezzo' })).toBe('?q=spazio%20nel%20mezzo');
  });
});

describe('DbError', () => {
  const { DbError } = loadScript('js/db.js', ['DbError'], makeStubs());

  it('isDuplicate riconosce code 23505 (Postgres unique violation)', () => {
    const e = new DbError('Conflict', { status: 409, code: '23505', body: '' });
    expect(e.isDuplicate()).toBe(true);
  });

  it('isDuplicate riconosce body con "duplicate" o "unique"', () => {
    const e1 = new DbError('Err', { status: 409, body: 'duplicate key' });
    const e2 = new DbError('Err', { status: 409, body: 'unique constraint' });
    expect(e1.isDuplicate()).toBe(true);
    expect(e2.isDuplicate()).toBe(true);
  });

  it('isDuplicate è false per errori generici', () => {
    const e = new DbError('Server error', { status: 500, body: 'internal' });
    expect(e.isDuplicate()).toBe(false);
  });
});

describe('db.dispositivi.list — costruzione URL', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve('[]'),
      })
    );
    globalThis.fetch = fetchMock;
  });

  it('usa la tabella dispositivi_<asl> e accoda select+limit+offset+order', async () => {
    const stubs = makeStubs({ profile: { asl: 'ASL Benevento' } });
    const { _dispositivi } = loadScript('js/db.js', ['_dispositivi'], stubs);
    await _dispositivi.list({ select: 'codice,modello', limit: 10, offset: 20, order: 'codice.asc' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = fetchMock.mock.calls[0][0];
    expect(url).toContain('/rest/v1/dispositivi_benevento?');
    expect(url).toContain('select=codice,modello');
    expect(url).toContain('limit=10');
    expect(url).toContain('offset=20');
    expect(url).toContain('order=codice.asc');
  });
});
