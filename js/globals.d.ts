// ─────────────────────────────────────────────────────────────
// globals.d.ts — Tipi globali condivisi tra i file js/*.js
//
// Strategia (Step A2 piano qualità):
// L'app è vanilla JS classico (no ES modules), tutte le globali
// vivono su window via <script> tags. Questo file dichiara i
// contratti minimi che TypeScript checkJs deve conoscere per
// fare type-checking utile senza falsi positivi a cascata.
//
// Questo file NON viene caricato a runtime. Esiste solo per `tsc`.
// ─────────────────────────────────────────────────────────────

// ─── Librerie CDN caricate da index.html ─────────────────────

declare const supabase: {
  createClient(url: string, key: string): any;
};

declare const XLSX: any;
declare const JSZip: any;

// ─── Helper esposti da core.js (solo function: var/const sono inferiti) ──

declare function supaToken(): Promise<string | undefined>;
declare function supaHdrs(token: string): Record<string, string>;
declare function toast(msg: string, type?: string): void;
declare function can(flag: string): boolean;
declare function _esc(s: any): string;

// ─── Stato condiviso (vive in store.* ma esposto come var) ──
// NOTA: SUPA_URL/SUPA_KEY/supa/IS_STAGING/currentUser/DB/saved/currentSession*
// e tableData NON sono dichiarati qui — TS li inferisce dai file dove sono
// definiti (core.js, anagrafica.js). Dichiararli qui causa TS6200/TS2451.

declare let cur: any;
declare let curVerif: { vsp: string; cq: string };
declare let vspState: Record<string, any>;
declare let cqState: Record<string, any>;

// ─── store reattivo ──────────────────────────────────────────

declare const store: {
  get(path: string): any;
  set(path: string, value: any): void;
  patch(path: string, partial: any): void;
  subscribe(path: string, fn: (val: any, key?: string) => void, opts?: { immediate?: boolean }): () => void;
};

// ─── db facade (vedi js/db.js) ───────────────────────────────

interface DbNamespace {
  get?(...args: any[]): Promise<any>;
  list?(opts?: any): Promise<any>;
  listAll?(opts?: any): Promise<any[]>;
  insert?(...args: any[]): Promise<any>;
  insertBatch?(rows: any[], opts?: any): Promise<{ inserted: number; errors: number }>;
  update?(...args: any[]): Promise<any>;
  delete?(...args: any[]): Promise<any>;
  delete_?(...args: any[]): Promise<any>;
  bulkPatch?(codici: string[], patch: any): Promise<{ ok: number; errors: any[] }>;
  truncate?(): Promise<any>;
  upsert?(...args: any[]): Promise<any>;
  [k: string]: any;
}

declare const db: {
  dispositivi: DbNamespace & { _tbl(): string };
  configAsl: DbNamespace;
  sessioni: DbNamespace;
  schede: DbNamespace;
  storico: DbNamespace;
  lookupAsl: DbNamespace;
  preset: DbNamespace;
  archivio: {
    listFiles(opts?: { allUsers?: boolean }): Promise<any[]>;
    insertFileMeta(meta: any): Promise<any>;
    deleteFileMeta(id: string): Promise<any>;
    upload(path: string, blob: Blob, opts?: { contentType?: string; upsert?: boolean }): Promise<void>;
    download(path: string): Promise<Blob>;
    remove(paths: string | string[]): Promise<void>;
    downloadTemplate(filename: string): Promise<Blob>;
  };
  auth: {
    getSession(): Promise<any>;
    getToken(): Promise<string | null>;
    signIn(email: string, password: string): Promise<any>;
    signOut(): Promise<void>;
  };
  profiles: DbNamespace;
  admin: {
    manageUsers(payload: any): Promise<any>;
  };
  DbError: any;
  _aslKey(): string;
};

// ─── window estesa: cache custom, API moderne, helper ─────

interface Window {
  // File System Access API (manca dai lib TS standard nel target ES2022)
  showDirectoryPicker?(options?: any): Promise<any>;

  // Globali esposte su window dai vari script
  db?: any;
  store?: any;
  JSZip?: any;

  // Cache appiccicate a window dai vari moduli
  _storedLookups?: any;
  _lookupSets?: any;
  _modelliByCostr?: any;
  _amTargetCodici?: any;
  _smMatchCodici?: any;
}

// ─── HTMLElement esteso: il codice usa direttamente .value/.checked
// ───   senza castare a HTMLInputElement. In modalità non-strict
// ───   accettiamo questo per non aggiungere centinaia di cast.

interface HTMLElement {
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  options?: any;
  selectedIndex?: number;
  files?: FileList | null;

  // Cache custom appiccicate agli elementi DOM
  _tblScrollFn?: any;
  _allVals?: any;
}

// ChildNode/Element estesi per pattern di iterazione children
interface Element {
  value?: any;
  checked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSStyleDeclaration;
  dataset?: DOMStringMap;
  click?(): void;
}

interface ChildNode {
  style?: CSSStyleDeclaration;
}

// EventTarget esteso: handler event spesso accedono a .closest, .value
interface EventTarget {
  closest?(selector: string): Element | null;
  value?: any;
  checked?: boolean;
  dataset?: DOMStringMap;
  result?: any;
}
