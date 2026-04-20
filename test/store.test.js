// Test per js/store.js — store reattivo minimale.
// Carica il file via loader, estrae `createStore` ed esercita
// get/set/patch/subscribe.

import { describe, it, expect, vi } from 'vitest';
import { loadScript } from './loader.js';

const { createStore } = loadScript('js/store.js', ['createStore']);

describe('store.createStore', () => {
  it('inizializza con stato iniziale (deep clone)', () => {
    const initial = { a: { b: 1 } };
    const s = createStore(initial);
    expect(s.get('a.b')).toBe(1);
    // Deve essere una copia: mutare initial non tocca lo store
    initial.a.b = 999;
    expect(s.get('a.b')).toBe(1);
  });

  it('get("") ritorna lo stato completo', () => {
    const s = createStore({ x: 1 });
    expect(s.get('')).toEqual({ x: 1 });
  });

  it('get di path inesistente ritorna undefined senza errore', () => {
    const s = createStore({});
    expect(s.get('a.b.c')).toBeUndefined();
  });

  it('set crea path nidificati e li recupera', () => {
    const s = createStore({});
    s.set('a.b.c', 42);
    expect(s.get('a.b.c')).toBe(42);
    expect(s.get('a.b')).toEqual({ c: 42 });
  });

  it('subscribe sul path notifica al cambio', () => {
    const s = createStore({ ui: { mode: 'idle' } });
    const fn = vi.fn();
    s.subscribe('ui.mode', fn);
    s.set('ui.mode', 'syncing');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('subscribe sul padre notifica anche per cambi sui figli', () => {
    const s = createStore({ ui: { mode: 'idle' } });
    const fn = vi.fn();
    s.subscribe('ui', fn);
    s.set('ui.mode', 'syncing');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('subscribe NON notifica per set di valore identico (primitivo)', () => {
    const s = createStore({ x: 5 });
    const fn = vi.fn();
    s.subscribe('x', fn);
    s.set('x', 5); // no-op
    expect(fn).not.toHaveBeenCalled();
  });

  it('patch fa shallow merge su un oggetto', () => {
    const s = createStore({ user: { name: 'Tom', age: 30 } });
    s.patch('user', { age: 31 });
    expect(s.get('user')).toEqual({ name: 'Tom', age: 31 });
  });

  it('unsubscribe ferma le notifiche successive', () => {
    const s = createStore({ x: 1 });
    const fn = vi.fn();
    const off = s.subscribe('x', fn);
    s.set('x', 2);
    off();
    s.set('x', 3);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
