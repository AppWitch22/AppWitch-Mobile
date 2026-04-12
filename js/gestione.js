// ── GESTIONE BENE: scheda dispositivo, lookup, aggiornamento/sostituzione massiva ──

let gestioneCodice = null; // codice dispositivo corrente in Gestione Bene

function openGestioneBene(codice) {
  if (!codice) return;
  gestioneCodice = codice;
  const canEdit = can('anagrafica_write');
  const dev = DB[codice] || {};
  const nome = dev.n || codice;

  // Rimuovi modal precedente se aperto
  const existing = document.getElementById('gb-modal');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', `
    <div id="gb-modal" style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto">
      <div style="background:var(--bg);border-radius:var(--rad-lg);width:100%;max-width:640px;padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--text3)">Gestione Bene</div>
          <button onclick="document.getElementById('gb-modal').remove()" style="padding:4px 10px;border:1px solid var(--border2);border-radius:var(--rad);background:var(--bg);color:var(--text);cursor:pointer">✕</button>
        </div>
        <div style="font-size:16px;font-weight:600;color:var(--text);margin-bottom:2px">${_esc(nome.toLowerCase())}</div>
        <div style="font-size:12px;color:var(--text3);margin-bottom:16px">${_esc(codice)}${canEdit ? '' : ' · <span style="color:var(--warn)">sola lettura</span>'}</div>
        <div style="padding:32px 0;text-align:center;color:var(--text3);border:1px dashed var(--border2);border-radius:var(--rad)">
          🚧 Scheda dispositivo — in costruzione (FASE 2)<br>
          <span style="font-size:11px">Dati · Storico verifiche · Scadenze</span>
        </div>
      </div>
    </div>`);
}
