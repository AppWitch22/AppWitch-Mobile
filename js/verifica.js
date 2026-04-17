// ── VERIFICA: VSE, MP, VSP, CQ — form fill/collect/restore, preset ──

const MP_POINTS=[
  {n:1,t:"Integrità dell'involucro",d:"Esaminare l'esterno dell'apparecchiatura, verificare che non ci siano segni di versamento di liquidi e che non vi sia nessun tipo di danneggiamento grave. Assicurarsi che viti, dadi e bloccaggi siano ben saldi."},
  {n:2,t:"Supporti",d:"Accertare che i supporti sui quali l'apparecchiatura poggia siano sicuri e ben saldi."},
  {n:3,t:"Ruote e sistemi frenanti",d:"Accertare che le ruote siano libere di ruotare e piroettare ed il corretto funzionamento dei meccanismi di blocco ruote."},
  {n:4,t:"Circuito di alimentazione",d:"Accertare l'integrità dei cavi elettrici, dei passacavi, delle spine e di eventuali prese a bordo macchina. Negli apparecchi con alimentazione separata, verificare l'integrità del cavo di collegamento e il funzionamento del carica batterie."},
  {n:5,t:"Connettori e collegamento elettrico",d:"Verificare i connettori prestando particolare attenzione ai loro pin e al loro corretto ancoraggio all'involucro, rimuovere eventuali tracce di ossido."},
  {n:6,t:"Cavi di collegamento",d:"Controllare che tutti i cavi e connettori utilizzati per i collegamenti apparecchio-accessori siano in buone condizioni e correttamente cablati. Verificare l'assenza di rotture e/o schiacciamenti."},
  {n:7,t:"Tubi e raccordi di alimentazione",d:"Verificare accuratamente l'integrità dei tubi, dei raccordi e dei connettori, che non siano tagliati, attorcigliati, ostruiti o crepati. Accertare l'assenza di perdite."},
  {n:8,t:"Filtri",d:"Controllare lo stato e il corretto posizionamento dei filtri e se necessario sostituirli."},
  {n:9,t:"Sistema di ventilazione/raffreddamento",d:"Verificare il funzionamento delle ventole di raffreddamento, pulire i filtri (dove presenti), se necessario eseguire una pulizia accurata interna."},
  {n:10,t:"Sistema di riscaldamento",d:"Verificare lo stato e il funzionamento del sistema di riscaldamento."},
  {n:11,t:"Comandi, interruttori, indicatori luminosi e sonori",d:"Accertare che ogni comando manuale ed elettronico del pannello di controllo espleti correttamente la propria funzione. Controllare il funzionamento di tutti gli indicatori luminosi e sonori."},
  {n:12,t:"Allarmi",d:"Controllare il buon funzionamento di tutti gli allarmi."},
  {n:13,t:"Livello liquidi",d:"Controllare il livello dei liquidi e rabboccare se necessario."},
  {n:14,t:"Meccanica di trascinamento",d:"Verificare lo stato e la regolare tensione delle cinghie di trascinamento, se necessario pulire e registrare. Pulire e/o lubrificare gli ingranaggi meccanici."},
  {n:15,t:"Indicazioni corretto utilizzo",d:"Verificare che serigrafie e simboli riportati su tasti, comandi ed involucro siano intatti e ben leggibili."},
  {n:16,t:"Verifica finale",d:"Verifica finale del funzionamento generale dello strumento. Reimpostare l'apparecchiatura come ad avvio di manutenzione."},
  {n:17,t:"Manutenzione specifica",d:"Consultare il Manuale di Servizio per eventuali manutenzioni specifiche."},
  {n:18,t:"Valutazione finale",d:"Valutare la necessità di aprire un intervento di manutenzione correttiva."},
  {n:19,t:"Attendibilità/ripetibilità misurazioni",d:"Accertarsi che le varie misurazioni / risultati effettuati sulla funzionalità dell'apparecchiatura siano attendibili e ripetibili."}
];

let mpState={};  // punto -> 'OK'|'KO'|'NA'

function buildMPPoints(){
  const container=document.getElementById('mp-points');
  container.innerHTML=MP_POINTS.map(p=>`
    <div class="mp-point" id="mp-p-${p.n}">
      <div class="mp-point-hdr" onclick="toggleMPDesc(${p.n})">
        <div class="mp-num">${p.n}</div>
        <div class="mp-title">${p.t}</div>
        <div class="mp-stato" id="mp-stato-${p.n}">—</div>
      </div>
      <div class="mp-desc" id="mp-desc-${p.n}" style="display:none">${p.d}</div>
      <div class="mp-btns" id="mp-btns-${p.n}" style="display:none">
        <button class="mp-btn ok" onclick="setMP(${p.n},'OK')">OK</button>
        <button class="mp-btn ko" onclick="setMP(${p.n},'KO')">KO</button>
        <button class="mp-btn na" onclick="setMP(${p.n},'NA')">NA</button>
      </div>
    </div>`).join('');
}

function toggleMPDesc(n){
  const desc=document.getElementById('mp-desc-'+n);
  const btns=document.getElementById('mp-btns-'+n);
  const open=desc.style.display!=='none';
  desc.style.display=open?'none':'block';
  btns.style.display=open?'none':'flex';
}

function setMP(n,val){
  mpState[n]=val;
  const stato=document.getElementById('mp-stato-'+n);
  stato.textContent=val;
  stato.className='mp-stato '+val.toLowerCase();
  // Color the point header
  const hdr=document.querySelector('#mp-p-'+n+' .mp-point-hdr');
  hdr.style.background=val==='OK'?'var(--info-bg)':val==='KO'?'var(--ko-bg)':'var(--bg2)';
  // Update buttons
  document.querySelectorAll('#mp-btns-'+n+' .mp-btn').forEach(b=>{
    b.classList.toggle('sel',b.textContent===val);
  });
  // Close after selection
  document.getElementById('mp-desc-'+n).style.display='none';
  document.getElementById('mp-btns-'+n).style.display='none';
  updateMPCount();
  uP();
}

function updateMPCount(){
  const done=Object.keys(mpState).length;
  document.getElementById('mp-count').textContent=done;
}

function resetMPPoints(){
  mpState={};
  MP_POINTS.forEach(p=>{
    const stato=document.getElementById('mp-stato-'+p.n);
    if(stato){stato.textContent='—';stato.className='mp-stato';}
    const hdr=document.querySelector('#mp-p-'+p.n+' .mp-point-hdr');
    if(hdr)hdr.style.background='';
    document.querySelectorAll('#mp-btns-'+p.n+' .mp-btn').forEach(b=>b.classList.remove('sel'));
    const desc=document.getElementById('mp-desc-'+p.n);
    const btns=document.getElementById('mp-btns-'+p.n);
    if(desc)desc.style.display='none';
    if(btns)btns.style.display='none';
  });
  document.getElementById('mp-count').textContent='0';
}

function loadMPSaved(rec){
  if(!rec)return;
  MP_POINTS.forEach(p=>{
    const val=rec['mp'+p.n];
    if(val)setMP(p.n,val);
  });
  const e=document.getElementById('mp-tecnico');if(e)e.value=rec.mp_tecnico||'';
  const _cMo=curGet();const _dMo=(useDataUltimaVerifica&&_cMo&&DB[_cMo.c]?.data_ultima_mo)||null;
  const d=document.getElementById('mp-data');if(d)d.value=_dMo||currentSessionDate||rec.mp_data||'';
  const d2=document.getElementById('mp-data2');if(d2)d2.value=rec.mp_data2||'';
  const n=document.getElementById('mp-note');if(n)n.value=rec.mp_note||'-';
  const c=document.getElementById('mp-codice');if(c)c.value=rec.codice||'';
}

function collectMP(){
  const t=new Date().toISOString().split('T')[0];
  const rec={codice:gv('mp-codice'),mp_data:gv('mp-data')||t,mp_note:gv('mp-note'),mp_tecnico:gv('mp-tecnico'),mp_data2:gv('mp-data2')||t};
  MP_POINTS.forEach(p=>{rec['mp'+p.n]=mpState[p.n]||'';});
  return rec;
}

function switchTab(tab){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  const btn=document.getElementById('tab-'+tab);
  if(btn)btn.classList.add('active');
  document.getElementById('panel-vse').classList.toggle('active',tab==='vse');
  document.getElementById('panel-mp').classList.toggle('active',tab==='mp');
  document.getElementById('panel-vsp').classList.toggle('active',tab==='vsp');
  document.getElementById('panel-cq').classList.toggle('active',tab==='cq');
}


function updateTabs(){
  const _cv=curVerifGet();
  const hasCQ=!!(_cv&&_cv.cq);
  const hasVSP=!!(_cv&&_cv.vsp);
  const cqFoglio=hasCQ?_cv.cq:'';
  const vspFoglio=hasVSP?_cv.vsp:'';
  // Rebuild tab bar
  const tabBar=document.querySelector('.tabs');
  tabBar.innerHTML=`
    <button class="tab active" id="tab-vse" onclick="switchTab('vse')">VSE</button>
    <button class="tab" id="tab-mp" onclick="switchTab('mp')">MP</button>
    ${hasVSP?`<button class="tab" id="tab-vsp" onclick="switchTab('vsp')">${vspFoglio||'VSP'}</button>`:''}
    ${hasCQ?`<button class="tab" id="tab-cq" onclick="switchTab('cq')">${cqFoglio||'CQ'}</button>`:''}
  `;
  // Mostra/nascondi bottoni export VSP e CQ
  const bVsp=document.getElementById('btn-exp-vsp');
  const bCq=document.getElementById('btn-exp-cq');
  if(bVsp){bVsp.style.display=hasVSP?'':'none';bVsp.disabled=false;bVsp.textContent='📥 '+(vspFoglio||'VSP');}
  if(bCq){bCq.style.display=hasCQ?'':'none';bCq.disabled=false;bCq.textContent='📥 '+(cqFoglio||'CQ');}
}

function fillMPHeader(d){
  const t=(useDataUltimaVerifica&&d.data_ultima_mo)||currentSessionDate||new Date().toISOString().split('T')[0];
  document.getElementById('mp-codice').value=d.c;
  document.getElementById('mp-data').value=t;
  document.getElementById('mp-note').value='-';
  document.getElementById('mp-data2').value=t;
  document.getElementById('mp-tecnico').value=d.ver||'';
}

const sv=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v!=null?v:'';};
const sr=(g,v)=>{document.querySelectorAll('#'+g+' .rb').forEach(b=>b.classList.toggle('sel',b.dataset.v===v));};
const gr=(g)=>{const s=document.querySelector('#'+g+' .rb.sel');return s?s.dataset.v:'';};
const gv=(id)=>{const e=document.getElementById(id);return e?e.value:'';};
const lv=(id)=>{const e=document.getElementById(id);return e?e.textContent:'';};
const sl=(id,v)=>{if(v)document.getElementById(id).textContent=v;};

function fillVSE(d){
  const _today=new Date().toISOString().split('T')[0];
  const t=(useDataUltimaVerifica&&d.data_ultima_vse)?d.data_ultima_vse:(currentSessionDate||_today);
  sv('f-codice',d.c);sv('f-data',t);sv('f-note','-');
  sv('f-ten',d.ten);sr('rg-tdp',d.tdp);sv('f-frq',d.frq);sr('rg-fdp',d.fdp);
  sv('f-pot',d.pot);sr('rg-pdp',d.pdp);sv('f-mar',d.mar);sv('f-fud',d.fud);sv('f-fur',d.fur);
  sr('rg-cls',d.cls);sr('rg-cdp',d.cdp);sr('rg-pa',d.pat);sr('rg-padp',d.pad);
  sr('rg-fnz',d.fnz);sr('rg-def',d.def);
  sv('f-spi',d.spi);sr('rg-smo',d.smo);sv('f-msp',d.msp);sr('rg-cav',d.cav);
  sr('rg-icv',d.icv);sr('rg-isp',d.isp);sr('rg-int',d.int);sv('f-pdc',d.pdc);
  sr('rg-icn',d.icn);sr('rg-prc',d.prc);sr('rg-icd',d.icd);
  sr('rg-mus',d.mus);sr('rg-mse',d.mse);sv('f-nag',d.nag);
  sr('rg-clm',d.clm);sv('f-tms',d.tms);sv('f-cor',d.cor);
  sl('lim-tr',d.trl);sv('f-trm',d.trm);
  sl('lim-pn',d.pnl);sv('f-pnm',d.pnm);
  sl('lim-pi',d.pil);sv('f-pim',d.pim);
  sl('lim-pnbf',d.pbl);sv('f-pbm',d.pbm);
  sl('lim-pibf',d.ibl);sv('f-ibm',d.ibm);
  sl('lim-pncf',d.pcl);sv('f-pcm',d.pcm);
  sl('lim-picf',d.icl);sv('f-icm',d.icm);
  sG(d.giu||'POSITIVO');sr('rg-vt',d.vt);sr('rg-vd',d.vd);sv('f-mot',d.mot);
  sv('f-str',d.str);sv('f-nrs',d.nrs);sv('f-ver',d.ver);
  sv('f-dat2',d.dat2||t);sv('f-vrc',d.vrc);
  sr('rg-norma',d.norma||'62353');sv('f-sct',d.sct?d.sct.toString().split(' ')[0]:d.sct);
  document.getElementById('dev-cod').textContent=d.c;
  document.getElementById('dev-nom').textContent=d.n.toLowerCase();
  document.getElementById('dev-inf').textContent=d.b+' · '+d.m;
  const loc=document.getElementById('dev-loc');
  const locParts=[d.loc,d.ss,d.rep].filter(Boolean);
  if(locParts.length){loc.textContent='▸ '+locParts.join(' · ');loc.style.display='inline-block';}
  else loc.style.display='none';
  uM();
  ['f-trm','f-pnm','f-pim'].forEach((id,i)=>cv(id,['lim-tr','lim-pn','lim-pi'][i],['e-tr','e-pn','e-pi'][i]));
  uP();
}

function restoreVSE(rec){
  const _cVse=curGet();const _dUlt=useDataUltimaVerifica&&_cVse&&DB[_cVse.c]?.data_ultima_vse;
  sv('f-data',_dUlt||currentSessionDate||rec.data);sv('f-note',rec.note);
  sv('f-ten',rec.ten);sr('rg-tdp',rec.tdp);sv('f-frq',rec.frq);sr('rg-fdp',rec.fdp);
  sv('f-pot',rec.pot);sr('rg-pdp',rec.pdp);sv('f-mar',rec.mar);sv('f-fud',rec.fud);sv('f-fur',rec.fur);
  sr('rg-cls',rec.cls);sr('rg-cdp',rec.cdp);sr('rg-pa',rec.pat);sr('rg-padp',rec.pad);
  sr('rg-fnz',rec.fnz);sr('rg-def',rec.def);
  sv('f-spi',rec.spi);sr('rg-smo',rec.smo);sv('f-msp',rec.msp);sr('rg-cav',rec.cav);
  sr('rg-icv',rec.icv);sr('rg-isp',rec.isp);sr('rg-int',rec.int);sv('f-pdc',rec.pdc);
  sr('rg-icn',rec.icn);sr('rg-prc',rec.prc);sr('rg-icd',rec.icd);
  sr('rg-mus',rec.mus);sr('rg-mse',rec.mse);sv('f-nag',rec.nag);
  sr('rg-clm',rec.clm);sv('f-tms',rec.tms);sv('f-cor',rec.cor);
  sv('f-trm',rec.trm);sv('f-pnm',rec.pnm);sv('f-pim',rec.pim);
  sv('f-pbm',rec.pbm);sv('f-ibm',rec.ibm);sv('f-pcm',rec.pcm);sv('f-icm',rec.icm);
  sG(rec.giu||'POSITIVO');sr('rg-vt',rec.vt);sr('rg-vd',rec.vd);sv('f-mot',rec.mot);
  sv('f-str',rec.str);sv('f-nrs',rec.nrs);sv('f-ver',rec.ver);sv('f-dat2',rec.dat2);sv('f-vrc',rec.vrc);sv('f-sct',rec.sct?rec.sct.toString().split(' ')[0]:rec.sct);
  sv('f-ris-inv',rec.ris_inv);sv('f-ris-pa',rec.ris_pa);
  sr('rg-norma',rec.norma||'62353');
  uM();
}

function pick(el){const already=el.classList.contains('sel');el.closest('.rg').querySelectorAll('.rb').forEach(b=>b.classList.remove('sel'));if(!already)el.classList.add('sel');dirty=true;uP();}

function uM(){
  const cls   = gr('rg-cls');
  const pa    = gr('rg-pa');
  const norma = gr('rg-norma') || '62353';
  const spiEl = document.getElementById('f-spi');
  const spina = spiEl ? spiEl.value : '';

  const isAI    = cls === 'AI';
  const isCls1  = cls === 'I';
  const isBF    = pa === 'BF';
  const isCF    = pa === 'CF';
  const haPA    = pa === 'B' || pa === 'BF' || pa === 'CF';
  const isFisso = spina === 'Impianto Fisso';
  const is61010 = norma === '61010';

  // Tensione mis. + corrente: nascosti per AI
  const blkTms = document.getElementById('blk-tms');
  const blkCor = document.getElementById('blk-cor');
  if(blkTms) blkTms.style.display = isAI ? 'none' : 'flex';
  if(blkCor) blkCor.style.display = isAI ? 'none' : 'flex';

  // Badge AI
  const bdgAI = document.getElementById('badge-ai');
  if(bdgAI) bdgAI.style.display = (isAI && haPA) ? 'inline-block' : 'none';

  // Info Impianto Fisso
  const blkFissoInfo = document.getElementById('blk-fisso-info');
  if(blkFissoInfo) blkFissoInfo.style.display = isFisso ? 'block' : 'none';

  // Info AI
  const blkAIInfo = document.getElementById('blk-ai-info');
  if(blkAIInfo) blkAIInfo.style.display = isAI ? 'block' : 'none';

  // TERRA — solo Classe I, non Impianto Fisso, non AI
  const blkTerra = document.getElementById('blk-terra');
  const inpTrm   = document.getElementById('f-trm');
  const limTr    = document.getElementById('lim-tr');
  const showTerra = isCls1 && !isFisso && !isAI;
  if(blkTerra) blkTerra.style.display = showTerra ? 'block' : 'none';
  if(inpTrm){
    inpTrm.disabled = !showTerra;
    if(!showTerra){ inpTrm.value=''; inpTrm.placeholder='N/A'; }
    else inpTrm.placeholder='';
  }
  if(limTr) limTr.textContent = '300';

  // RESISTENZA DI ISOLAMENTO — nascosta per Impianto Fisso
  const blkIsol = document.getElementById('blk-isol');
  if(blkIsol) blkIsol.style.display = isFisso ? 'none' : 'block';
  const blkRisPa = document.getElementById('blk-ris-pa');
  if(blkRisPa) blkRisPa.style.display = (isBF || isCF) ? 'block' : 'none';

  // DISPERSIONE INVOLUCRO — nascosta per Impianto Fisso e AI
  // Limite: 100 mA (62353/60601), 3500 mA (61010)
  const blkDispInv = document.getElementById('blk-disp-inv');
  if(blkDispInv) blkDispInv.style.display = (isFisso || isAI) ? 'none' : 'block';
  const limInv = is61010 ? 3500 : (isCls1 ? 500 : 100);
  const limPN  = document.getElementById('lim-pn');
  const limPI  = document.getElementById('lim-pi');
  if(limPN) limPN.textContent = limInv;
  if(limPI) limPI.textContent = limInv;
  const msubInv = document.getElementById('msub-disp-inv');
  if(msubInv) msubInv.innerHTML = is61010
    ? 'Corrente dispersione apparecchio<br>Involucro (IEC 61010, lim. 3500 <span class="unit">mA</span>)'
    : isCls1
      ? 'Corrente dispersione apparecchio<br>Involucro (Cl.I, lim. 500 <span class="unit">mA</span>)'
      : 'Corrente dispersione apparecchio<br>Involucro (Cl.II, lim. 100 <span class="unit">mA</span>)';
  const inpPnm = document.getElementById('f-pnm');
  const inpPim = document.getElementById('f-pim');
  if(inpPnm){ inpPnm.disabled=isFisso||isAI; if(isFisso||isAI){inpPnm.value='';inpPnm.placeholder='N/A';}else inpPnm.placeholder=''; }
  if(inpPim){ inpPim.disabled=isFisso||isAI; if(isFisso||isAI){inpPim.value='';inpPim.placeholder='N/A';}else inpPim.placeholder=''; }

  // DISPERSIONE PA BF — solo se PA=BF e norma≠61010
  const blkPABF = document.getElementById('blk-pa-bf');
  if(blkPABF) blkPABF.style.display = (isBF && !is61010) ? 'block' : 'none';
  const limPnBF = document.getElementById('lim-pnbf');
  const limPiBF = document.getElementById('lim-pibf');
  if(limPnBF) limPnBF.textContent = '5000';
  if(limPiBF) limPiBF.textContent = '5000';

  // DISPERSIONE PA CF — solo se PA=CF e norma≠61010
  const blkPACF = document.getElementById('blk-pa-cf');
  if(blkPACF) blkPACF.style.display = (isCF && !is61010) ? 'block' : 'none';
  const limPnCF = document.getElementById('lim-pncf');
  const limPiCF = document.getElementById('lim-picf');
  if(limPnCF) limPnCF.textContent = '50';
  if(limPiCF) limPiCF.textContent = '50';

  // Ricalcola esiti
  cv('f-trm','lim-tr','e-tr');
  cv('f-pnm','lim-pn','e-pn');
  cv('f-pim','lim-pi','e-pi');
  cv('f-pbm','lim-pnbf','e-pnbf');
  cv('f-ibm','lim-pibf','e-pibf');
  cv('f-pcm','lim-pncf','e-pncf');
  cv('f-icm','lim-picf','e-picf');
}

function sG(v){
  document.getElementById('gp').classList.toggle('sel',v==='POSITIVO');
  document.getElementById('gn').classList.toggle('sel',v==='NEGATIVO');
  document.getElementById('f-vrc').value=v==='POSITIVO'?'SI è Positivo':'NON CONFORME';
}

function cv(fid,lid,eid){
  const v=parseFloat(document.getElementById(fid).value);
  const l=parseFloat(document.getElementById(lid).textContent);
  const e=document.getElementById(eid);
  if(isNaN(v)){e.textContent='';return;}
  e.textContent=v<=l?'✓ OK':'✗ KO';e.style.color=v<=l?'var(--ok)':'var(--ko)';
}

function aG(){
  let neg=false;
  [
    ['f-trm','lim-tr'],
    ['f-pnm','lim-pn'],['f-pim','lim-pi'],
    ['f-pbm','lim-pnbf'],['f-ibm','lim-pibf'],
    ['f-pcm','lim-pncf'],['f-icm','lim-picf']
  ].forEach(([f,l])=>{
    const el=document.getElementById(f);
    const lel=document.getElementById(l);
    if(!el||!lel||el.disabled) return;
    const v=parseFloat(el.value);
    const lv=parseFloat(lel.textContent);
    if(!isNaN(v)&&v>lv) neg=true;
  });
  sG(neg?'NEGATIVO':'POSITIVO');
}

function resetCur(){const _c=curGet();if(_c){fillVSE(_c);resetMPPoints();fillMPHeader(_c);}dirty=false;}

function uP(){
  const fs=['f-codice','f-ten','f-mar','f-str','f-ver'];
  const n=fs.filter(id=>{const e=document.getElementById(id);return e&&e.value.trim()!==''}).length;
  const mpDone=Object.keys(mpState).length;
  const total=fs.length+19;
  document.getElementById('prog').style.width=Math.round((n+mpDone)/total*100)+'%';
}

function collectVSE(){
  return{codice:gv('f-codice'),data:gv('f-data'),note:gv('f-note'),
    ten:gv('f-ten'),tdp:gr('rg-tdp'),frq:gv('f-frq'),fdp:gr('rg-fdp'),
    pot:gv('f-pot'),pdp:gr('rg-pdp'),mar:gv('f-mar'),fud:gv('f-fud'),fur:gv('f-fur'),
    cls:gr('rg-cls'),cdp:gr('rg-cdp'),pat:gr('rg-pa'),pad:gr('rg-padp'),
    fnz:gr('rg-fnz'),def:gr('rg-def'),
    spi:gv('f-spi'),smo:gr('rg-smo'),msp:gv('f-msp'),cav:gr('rg-cav'),
    icv:gr('rg-icv'),isp:gr('rg-isp'),int:gr('rg-int'),pdc:gv('f-pdc'),
    icn:gr('rg-icn'),prc:gr('rg-prc'),icd:gr('rg-icd'),
    mus:gr('rg-mus'),mse:gr('rg-mse'),nag:gv('f-nag'),
    clm:gr('rg-clm'),tms:gv('f-tms'),cor:gv('f-cor'),
    trl:lv('lim-tr'),trm:gv('f-trm'),pnl:lv('lim-pn'),pnm:gv('f-pnm'),
    pil:lv('lim-pi'),pim:gv('f-pim'),
    pbl:lv('lim-pnbf'),pbm:gv('f-pbm'),ibl:lv('lim-pibf'),ibm:gv('f-ibm'),
    pcl:lv('lim-pncf'),pcm:gv('f-pcm'),icl:lv('lim-picf'),icm:gv('f-icm'),
    giu:document.getElementById('gp').classList.contains('sel')?'POSITIVO':'NEGATIVO',
    vt:gr('rg-vt'),vd:gr('rg-vd'),mot:gv('f-mot'),
    str:gv('f-str'),nrs:gv('f-nrs'),ver:gv('f-ver'),dat2:gv('f-dat2'),vrc:gv('f-vrc'),sct:gv('f-sct'),
    norma:gr('rg-norma'),
    ris_inv:gv('f-ris-inv'),ris_pa:gv('f-ris-pa')};
}

function saveAll(){
  const cur=curGet();
  if(!cur){toast('Seleziona un dispositivo','warn');return;}
  const cod=cur.c;
  const existing=saved[cod]||{codice:cod};
  const vseRec=collectVSE();
  const mpRec=collectMP();
  const _cv=curVerifGet();
  const vspRec=_cv&&_cv.vsp?collectVSP():null;
  const cqRec=_cv&&_cv.cq?collectCQ():null;
  saved[cod]={...existing,...vseRec,...mpRec,
    ...(vspRec?{...vspRec,vsp_saved:true,vsp_type:vspTypeGet()}:{}),
    ...(cqRec?{...cqRec,cq_saved:true,cq_type:cqTypeGet()}:{}),
    vse_saved:true,mp_saved:true};
   
  dirty=false;
  updateTabIndicators();
  renderSession();
  const parts=['VSE','MP'];if(vspRec)parts.push(_cv.vsp);if(cqRec)parts.push(_cv.cq);
  const label=parts.join(' + ');
  toast('Salvato: '+cod+' ('+label+')','ok');
  // Auto-save su Supabase
  scheduleSync();
  setTimeout(()=>{
    document.querySelector('.card').scrollIntoView({behavior:'smooth'});
    document.getElementById('search-input').focus();
  },700);
}

function updateTabIndicators(){
  const cur=curGet();
  if(!cur)return;
  const s=saved[cur.c];
  const tVse=document.getElementById('tab-vse');
  const tMp=document.getElementById('tab-mp');
  const tVsp=document.getElementById('tab-vsp');
  if(tVse)tVse.classList.toggle('saved-tab',!!(s&&s.vse_saved));
  if(tMp)tMp.classList.toggle('saved-tab',!!(s&&s.mp_saved));
  if(tVsp)tVsp.classList.toggle('saved-tab',!!(s&&s.vsp_saved));
}


// vspState/vspType vivono in store.form.* — helper read-only per brevità
function vspStateGet(){return store.get('form.vsp');}
function vspTypeGet(){return store.get('form.vspType');}

const VSP_POINTS = {
  'VSP_CEN': [
    {l:'A', t:'Il coperchio resta chiuso a centrifuga avviata', opts:['OK','KO','NA']},
    {l:'B', t:'Il coperchio rimane bloccato finché il rotore non è fermo', opts:['OK','KO','NA']},
    {l:'C', t:'A coperchio aperto la centrifuga si avvia', opts:['OK','KO','NA']},
    {l:'D', t:'A coperchio aperto la centrifuga non si avvia', opts:['OK','KO','NA']},
    {l:'E', t:'Esiste la protezione meccanica sulle parti in movimento, se accessibili', opts:['OK','KO','NA']},
  ],
  'VSP_ECG': [
    {l:'A', t:'Indicazione della protezione da defibrillatore', opts:['OK','KO','NA']},
    {l:'B', t:'Impossibilità di contatto con un piano conduttore per il connettore lato apparecchio del cavo ECG', opts:['OK','KO','NA']},
    {l:'C', t:'Segnalazione sorgente elettrica interna scarica', opts:['OK','KO','NA']},
    {l:'D', t:'SOLO PER I MONITOR: Indicazione del tipo PA (barrare la scelta)', opts:['B','BF','CF','NA']},
  ],
  'VSP_DEF': [
    {l:'A', t:'Verifica prescrizioni istruzioni per la defibrillazione e/o monitoraggio ECG', opts:['OK','KO']},
    {l:'B', t:'Verifica raccomandazioni elettrodi e cavi paziente', opts:['OK','KO']},
    {l:'C', t:'Verifica raccomandazioni sorgente elettrica interna', opts:['NA','OK','KO']},
    {l:'D', t:'Verifica prescrizioni indicatore di stato sorgente elettrica interna', opts:['NA','OK','KO']},
    {l:'E', t:'Verifica prescrizioni preselettore di energia', opts:['NA','OK','KO']},
    {l:'F', t:'Verifica prescrizioni preselettore tarato in Joule', opts:['NA','OK','KO']},
    {l:'G', t:'Verifica prescrizioni indicatore vocale e/o sonoro di fine carica', opts:['OK','KO']},
    {l:'H', t:'Verifica raccomandazioni dispositivo di ricarica automatica', opts:['NA','OK','KO']},
    {l:'I', t:'Verifica prescrizioni dispositivo di auto scarica interno', opts:['OK','KO']},
    {l:'J', t:'Verifica prescrizioni dispositivo di scarica', opts:['OK','KO']},
    {l:'K', t:'Verifica prescrizioni energia massima selezionabile per elettrodi esterni ≤ 360 J', opts:['NA','OK','KO']},
    {l:'L', t:'Verifica prescrizioni energia massima selezionabile per elettrodi interni ≤ 50 J', opts:['NA','OK','KO']},
    {l:'M', t:'Verifica prescrizioni indicazione luminosa e/o sonora del dispositivo di sincronizzazione', opts:['NA','OK','KO']},
    {l:'N', t:'Verifica prescrizioni dispositivo di sincronizzazione non attivo all\'accensione', opts:['NA','OK','KO']},
    {l:'O', t:'Verifica prescrizioni indicatore vocale e/o sonoro rilevamento ritmo (DAE)', opts:['NA','OK','KO']},
    {l:'P', t:'Verifica prescrizioni visualizzazione segnale ECG', opts:['NA','OK','KO']},
    {l:'Q', t:'Verifica prescrizioni impossibilità attivazione contemporanea elettrodi interni ed esterni', opts:['OK','KO']},
    {l:'R', t:'Verifica prescrizioni protezione da versamento liquidi', opts:['OK','KO']},
  ],
  'VSP_ELB': [
    {l:'A', t:'Verifica prescrizioni colorazione delle lampade spia (giallo: taglio, blu: coagulo, rosso: guasto piastra)', opts:['OK','KO','NA']},
    {l:'B', t:'Verifica prescrizioni protezione immersione pedale (Solo per apparecchiature in Sala Operatoria)', opts:['OK','KO','NA']},
    {l:'C', t:'Verifica prescrizioni assenza alimentazione simultanea degli elettrodi attivi', opts:['OK','KO','NA']},
    {l:'D', t:'Verifica prescrizioni non intercambiabilità fra elettrodo neutro e attivo', opts:['OK','KO','NA']},
    {l:'E', t:'Verifica prescrizioni allarme interruzione cavo elettrodo neutro per Pnom>50W', opts:['OK','KO','NA']},
    {l:'F', t:'Verifica prescrizioni segnalazione sonora di uscita attivata', opts:['OK','KO','NA']},
  ],
};

// Extra numeric fields for DEF and ELB
const VSP_EXTRA = {
  'VSP_DEF': [
    {sec:'Precisione energia erogata', fields:[
      {id:'def_e1i',l:'E1 Impostato (J)'},{id:'def_e1m',l:'E1 Misurato (J)'},
      {id:'def_e2i',l:'E2 Impostato (J)'},{id:'def_e2m',l:'E2 Misurato (J)'},
      {id:'def_e3i',l:'E3 Impostato (J)'},{id:'def_e3m',l:'E3 Misurato (J)'},
      {id:'def_e4i',l:'E4 Impostato (J)'},{id:'def_e4m',l:'E4 Misurato (J)'},
      {id:'def_e5i',l:'E5 Impostato (J)'},{id:'def_e5m',l:'E5 Misurato (J)'},
      {id:'def_dae_mis',l:'DAE Misurato (J)'},
      {id:'def_e_esito',l:'Esito energia',type:'rb',opts:['NA','OK','KO'],labels:['NA','OK','KO']},
    ]},
    {sec:'Tempi di carica alla massima energia', fields:[
      {id:'def_tc_ar',l:'A — Rete (s)'},{id:'def_tc_ab',l:'A — Batteria (s)'},{id:'def_tc_am',l:'A — Max (s)'},
      {id:'def_tc_br',l:'B — Rete (s)'},{id:'def_tc_bb',l:'B — Batteria (s)'},{id:'def_tc_bm',l:'B — Max (s)'},
      {id:'def_tc_cr',l:'C — Rete (s)'},{id:'def_tc_cb',l:'C — Batteria (s)'},{id:'def_tc_cm',l:'C — Max (s)'},
      {id:'def_tc_dr',l:'D — Rete (s)'},{id:'def_tc_db',l:'D — Batteria (s)'},{id:'def_tc_dm',l:'D — Max (s)'},
      {id:'def_tc_ab_na',l:'N/A A+B',type:'rb',opts:['X'],labels:['N/A']},
      {id:'def_tc_cd_na',l:'N/A C+D',type:'rb',opts:['X'],labels:['N/A']},
      {id:'def_tc_ok',l:'Esito OK',type:'rb',opts:['X'],labels:['OK']},
    ]},
    {sec:'Tempi di ritardo e ripristino', fields:[
      {id:'def_tr_ar',l:'A — Rilevato (s)'},{id:'def_tr_am',l:'A — Max (s)'},{id:'def_tr_a_esito',l:'A — Esito',type:'rb',opts:['NA','OK'],labels:['NA','OK']},
      {id:'def_tr_br',l:'B — Rilevato (s)'},{id:'def_tr_bm',l:'B — Max (s)'},{id:'def_tr_b_esito',l:'B — Esito',type:'rb',opts:['NA','OK'],labels:['NA','OK']},
      {id:'def_tr_cr',l:'C — Rilevato (s)'},{id:'def_tr_cm',l:'C — Max (s)'},{id:'def_tr_c_esito',l:'C — Esito',type:'rb',opts:['NA','OK'],labels:['NA','OK']},
    ]},
    {sec:'Raccomandazioni', fields:[
      {id:'def_rac_a',l:'A — Verifica prescrizioni parti applicate di tipo BF o CF',type:'rb',opts:['NA','OK','KO'],labels:['NA','OK','KO']},
      {id:'def_rac_b',l:'B — Verifica prescrizioni parti applicate elettrodi ECG separati di tipo CF',type:'rb',opts:['NA','OK','KO'],labels:['NA','OK','KO']},
      {id:'def_rac_c',l:'C — Verifica prescrizioni parti applicate a prova di defibrillazione',type:'rb',opts:['NA','OK','KO'],labels:['NA','OK','KO']},
    ]},
    {sec:'Strumentazione utilizzata', fields:[
      {id:'def_strum',l:'Strumento'},{id:'def_mod',l:'Modello'},
      {id:'def_ser',l:'N° Serie'},{id:'def_cert',l:'Certificato N.'},
      {id:'def_scad',l:'Scadenza taratura',type:'date'},
    ]},
  ],
  'VSP_ELB': [
    {sec:'Identificazione — Dati di targa', fields:[
      {id:'elb_pbip',l:'Potenza bipolare (W)'},{id:'elb_cbip',l:'Carico bip. (Ω)'},
      {id:'elb_fhz',l:'Freq. bip. [Hz]'},{id:'elb_fkhz',l:'Freq. bip. [KHz]'},{id:'elb_fmhz',l:'Freq. bip. [MHz]'},
      {id:'elb_pmono',l:'Potenza monopolare (W)'},{id:'elb_cmono',l:'Carico mono. (Ω)'},
      {id:'elb_fhz2',l:'Freq. mono. [Hz]'},{id:'elb_fkhz2',l:'Freq. mono. [KHz]'},{id:'elb_fmhz2',l:'Freq. mono. [MHz]'},
      {id:'elb_pa',l:'Tipo PA in HF',type:'rb',opts:['F','T'],labels:['Flottante (F)','Riferite a terra']},
      {id:'elb_pdt',l:'Presenza nei dati di targa delle indicazioni di frequenza, potenza di uscita e carico',type:'rb',opts:['OK','KO'],labels:['OK','KO']},
    ]},
    {sec:'Corrente di dispersione nel paziente in HF', fields:[
      {id:'elb_ct_t',l:'Carico elettrodi — Taglio (mA)'},{id:'elb_ct_m',l:'Carico elettrodi — Mix (mA)'},{id:'elb_ct_c',l:'Carico elettrodi — Coagulo (mA)'},
      {id:'elb_at_t',l:'Attivo/terra — Taglio (mA)'},{id:'elb_at_m',l:'Attivo/terra — Mix (mA)'},{id:'elb_at_c',l:'Attivo/terra — Coagulo (mA)'},
      {id:'elb_en_t',l:'El. neutro — Taglio (mA)'},{id:'elb_en_m',l:'El. neutro — Mix (mA)'},{id:'elb_en_c',l:'El. neutro — Coagulo (mA)'},
      {id:'elb_ea_t',l:'El. attivo — Taglio (mA)'},{id:'elb_ea_m',l:'El. attivo — Mix (mA)'},{id:'elb_ea_c',l:'El. attivo — Coagulo (mA)'},
      {id:'elb_iso1n',l:'Uscita isolata CN — El.1 (mA)'},{id:'elb_iso1t',l:'Uscita isolata CN — El.2 (mA)'},
      {id:'elb_iso2n',l:'Uscita isolata MT — El.1 (mA)'},{id:'elb_iso2t',l:'Uscita isolata MT — El.2 (mA)'},
      {id:'elb_hf_esito',l:'Correnti HF nei limiti',type:'rb'},
      {id:'elb_bip_esito',l:'Correnti bipolare nei limiti',type:'rb'},
    ]},
    {sec:'Tolleranza di uscita (unità arbitrarie o W)', fields:[
      {id:'elb_rc_t_ni',l:'Taglio — Nulla Ind.'},{id:'elb_rc_t_nm',l:'Taglio — Nulla Mis.'},
      {id:'elb_rc_t_q1i',l:'Taglio — ¼ Ind.'},{id:'elb_rc_t_q1m',l:'Taglio — ¼ Mis.'},
      {id:'elb_rc_t_q2i',l:'Taglio — ½ Ind.'},{id:'elb_rc_t_q2m',l:'Taglio — ½ Mis.'},
      {id:'elb_rc_t_q3i',l:'Taglio — ¾ Ind.'},{id:'elb_rc_t_q3m',l:'Taglio — ¾ Mis.'},
      {id:'elb_rc_t_mxi',l:'Taglio — MAX Ind.'},{id:'elb_rc_t_mxm',l:'Taglio — MAX Mis.'},
      {id:'elb_rc_m_ni',l:'Mix — Nulla Ind.'},{id:'elb_rc_m_nm',l:'Mix — Nulla Mis.'},
      {id:'elb_rc_m_q1i',l:'Mix — ¼ Ind.'},{id:'elb_rc_m_q1m',l:'Mix — ¼ Mis.'},
      {id:'elb_rc_m_q2i',l:'Mix — ½ Ind.'},{id:'elb_rc_m_q2m',l:'Mix — ½ Mis.'},
      {id:'elb_rc_m_q3i',l:'Mix — ¾ Ind.'},{id:'elb_rc_m_q3m',l:'Mix — ¾ Mis.'},
      {id:'elb_rc_m_mxi',l:'Mix — MAX Ind.'},{id:'elb_rc_m_mxm',l:'Mix — MAX Mis.'},
      {id:'elb_rc_c_ni',l:'Coagulo — Nulla Ind.'},{id:'elb_rc_c_nm',l:'Coagulo — Nulla Mis.'},
      {id:'elb_rc_c_q1i',l:'Coagulo — ¼ Ind.'},{id:'elb_rc_c_q1m',l:'Coagulo — ¼ Mis.'},
      {id:'elb_rc_c_q2i',l:'Coagulo — ½ Ind.'},{id:'elb_rc_c_q2m',l:'Coagulo — ½ Mis.'},
      {id:'elb_rc_c_q3i',l:'Coagulo — ¾ Ind.'},{id:'elb_rc_c_q3m',l:'Coagulo — ¾ Mis.'},
      {id:'elb_rc_c_mxi',l:'Coagulo — MAX Ind.'},{id:'elb_rc_c_mxm',l:'Coagulo — MAX Mis.'},
      {id:'elb_rc_b_ni',l:'Bipolare — Nulla Ind.'},{id:'elb_rc_b_nm',l:'Bipolare — Nulla Mis.'},
      {id:'elb_rc_b_q1i',l:'Bipolare — ¼ Ind.'},{id:'elb_rc_b_q1m',l:'Bipolare — ¼ Mis.'},
      {id:'elb_rc_b_q2i',l:'Bipolare — ½ Ind.'},{id:'elb_rc_b_q2m',l:'Bipolare — ½ Mis.'},
      {id:'elb_rc_b_q3i',l:'Bipolare — ¾ Ind.'},{id:'elb_rc_b_q3m',l:'Bipolare — ¾ Mis.'},
      {id:'elb_rc_b_mxi',l:'Bipolare — MAX Ind.'},{id:'elb_rc_b_mxm',l:'Bipolare — MAX Mis.'},
    ]},
    {sec:'Verifica erogazione', fields:[
      {id:'elb_er1',l:'Aumento progressivo della potenza di uscita all\'aumento dell\'indicazione del comando di uscita',type:'rb',opts:['OK','KO'],labels:['OK','KO']},
      {id:'elb_er2',l:'Potenza minima di uscita < 5% di P nominale o 10W (il valore più basso)',type:'rb',opts:['OK','KO'],labels:['OK','KO']},
      {id:'elb_er3',l:'Potenza massima misurata ± 20% di P impostata',type:'rb',opts:['OK','KO'],labels:['OK','KO']},
    ]},
    {sec:'Controlli visivi alle norme particolari', fields:[
      {id:'elb_vp1',l:'Colorazione lampade spia (giallo: taglio, blu: coagulo, rosso: guasto circuito piastra)',type:'rb',opts:['KO'],labels:['KO']},
      {id:'elb_vp2',l:'Protezione all\'immersione del pedale di comando (Solo per apparecchiature in Sala Operatoria)',type:'rb',opts:['NA','OK','KO'],labels:['NA','OK','KO']},
      {id:'elb_vp3',l:'Assenza alimentazione simultanea, da un singolo interruttore, degli elettrodi attivi',type:'rb',opts:['OK','KO'],labels:['OK','KO']},
      {id:'elb_vp4',l:'Non intercambiabilità fra elettrodo neutro e attivo',type:'rb',opts:['OK','KO'],labels:['OK','KO']},
      {id:'elb_vp5',l:'Allarme interruzione cavo elettrodo neutro per apparecchiature con potenza: Pnom>50W',type:'rb',opts:['NA','OK','KO'],labels:['NA','OK','KO']},
      {id:'elb_vp6',l:'Segnalazione sonora di uscita attivata',type:'rb',opts:['OK','KO'],labels:['OK','KO']},
    ]},
    {sec:'Strumentazione utilizzata', fields:[
      {id:'elb_strum',l:'Strumento'},{id:'elb_mod',l:'Modello'},
      {id:'elb_ser',l:'N° Serie'},{id:'elb_cert',l:'Certificato N.'},
      {id:'elb_scad',l:'Scadenza taratura',type:'date'},
    ]},
  ],
};

function buildVSPPoints(type){
  store.set('form.vspType', type);
  store.set('form.vsp', {});
  const points=VSP_POINTS[type]||[];
  document.getElementById('vsp-sec-title').textContent='Controllo visivo — '+type.replace('VSP_','');
  document.getElementById('vsp-total').textContent=points.length;
  document.getElementById('vsp-count').textContent='0';
  // Build points — same style as MP
  const container=document.getElementById('vsp-points');
  container.innerHTML=points.map(p=>{
    const btns=p.opts.map(o=>{
      const cls=o==='OK'?'mp-btn ok':o==='KO'?'mp-btn ko':'mp-btn na';
      return `<button class="${cls}" onclick="setVSP('${p.l}','${o}')">${o}</button>`;
    }).join('');
    return `<div class="mp-point" id="vsp-p-${p.l}">
      <div class="mp-point-hdr" onclick="toggleVSP('${p.l}')">
        <div class="mp-num">${p.l}</div>
        <div class="mp-title">${p.t}</div>
        <div class="mp-stato" id="vsp-stato-${p.l}">—</div>
      </div>
      <div class="mp-btns" id="vsp-btns-${p.l}" style="display:none">${btns}</div>
    </div>`;
  }).join('');
  // Build extra fields
  const extraDiv=document.getElementById('vsp-extra');
  const extra=VSP_EXTRA[type];
  if(extra){
    let html='';
    const GRUPPI_HF=[
      {label:'Carico elettrodi',ids:['elb_ct_t','elb_ct_m','elb_ct_c'],cols:3},
      {label:'Attivo / Terra',ids:['elb_at_t','elb_at_m','elb_at_c'],cols:3},
      {label:'Elettrodo neutro',ids:['elb_en_t','elb_en_m','elb_en_c'],cols:3},
      {label:'Elettrodo attivo',ids:['elb_ea_t','elb_ea_m','elb_ea_c'],cols:3},
      {label:'Uscita isolata',ids:['elb_iso1n','elb_iso1t','elb_iso2n','elb_iso2t'],cols:4},
    ];
    extra.forEach(sec=>{
      if(sec.sec==='Identificazione — Dati di targa'){
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:56px;text-align:center">`;
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div style="overflow-x:auto;padding:0 14px 12px"><table style="border-collapse:collapse;font-size:12px"><tbody>`;
        html+=`<tr><td style="padding:5px 8px;white-space:nowrap;font-weight:600">Potenza Bipolare (W)</td><td style="padding:4px">${inp('elb_pbip')}</td><td style="padding:5px 8px;white-space:nowrap;font-weight:600">Carico (Ω)</td><td style="padding:4px">${inp('elb_cbip')}</td><td style="padding:5px 8px;white-space:nowrap;font-weight:600">Frequenza</td><td style="padding:4px">${inp('elb_fhz')}</td><td style="padding:4px">${inp('elb_fkhz')}</td><td style="padding:5px 2px;font-size:11px">KHz</td><td style="padding:4px">${inp('elb_fmhz')}</td><td style="padding:5px 2px;font-size:11px">MHz</td></tr>`;
        html+=`<tr><td style="padding:5px 8px;white-space:nowrap;font-weight:600">Potenza Monopolare (W)</td><td style="padding:4px">${inp('elb_pmono')}</td><td style="padding:5px 8px;white-space:nowrap;font-weight:600">Carico (Ω)</td><td style="padding:4px">${inp('elb_cmono')}</td><td style="padding:5px 8px;white-space:nowrap;font-weight:600">Frequenza</td><td style="padding:4px">${inp('elb_fhz2')}</td><td style="padding:4px">${inp('elb_fkhz2')}</td><td style="padding:5px 2px;font-size:11px">KHz</td><td style="padding:4px">${inp('elb_fmhz2')}</td><td style="padding:5px 2px;font-size:11px">MHz</td></tr>`;
        html+=`<tr><td style="padding:5px 8px;white-space:nowrap;font-weight:600" colspan="2">Tipo parte applicata in HF</td><td colspan="8" style="padding:5px 8px"><input type="hidden" id="elb_pa"><div class="rg" id="rg-elb_pa"><div class="rb" data-v="T" onclick="pick(this);document.getElementById('elb_pa').value='T'">÷ Riferita a terra</div><div class="rb" data-v="F" onclick="pick(this);document.getElementById('elb_pa').value='F'">[F] Flottante</div></div></td></tr>`;
        html+=`<tr><td style="padding:5px 8px;font-size:11px" colspan="7">Presenza nei dati di targa delle indicazioni di frequenza, potenza di uscita e carico</td><td colspan="3" style="padding:4px"><input type="hidden" id="elb_pdt"><div class="rg" id="rg-elb_pdt"><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('elb_pdt').value='OK'">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('elb_pdt').value='KO'">KO</div></div></td></tr>`;
        html+=`</tbody></table></div></div>`;
      } else if(sec.sec==='Tolleranza di uscita (unità arbitrarie o W)'){
        const RC_MODES=[{k:'t',l:'Taglio'},{k:'m',l:'Mix'},{k:'c',l:'Coagulo'},{k:'b',l:'Bipolare'}];
        const RC_LEVELS=[{k:'ni',l:'Nulla Ind.'},{k:'nm',l:'Nulla Mis.'},{k:'q1i',l:'¼ Ind.'},{k:'q1m',l:'¼ Mis.'},{k:'q2i',l:'½ Ind.'},{k:'q2m',l:'½ Mis.'},{k:'q3i',l:'¾ Ind.'},{k:'q3m',l:'¾ Mis.'},{k:'mxi',l:'MAX Ind.'},{k:'mxm',l:'MAX Mis.'}];
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div style="overflow-x:auto;padding:0 14px 12px"><table style="border-collapse:collapse;font-size:11px;width:100%"><thead><tr><th style="text-align:left;padding:4px 6px;white-space:nowrap"></th>`;
        RC_LEVELS.forEach(lv=>{ html+=`<th style="padding:4px 4px;text-align:center;white-space:nowrap">${lv.l}</th>`; });
        html+=`</tr></thead><tbody>`;
        RC_MODES.forEach(m=>{
          html+=`<tr><td style="padding:4px 6px;font-weight:600;white-space:nowrap">${m.l}</td>`;
          RC_LEVELS.forEach(lv=>{ const id=`elb_rc_${m.k}_${lv.k}`; html+=`<td style="padding:2px 3px"><input type="text" id="${id}" inputmode="decimal" style="width:52px;text-align:center"></td>`; });
          html+=`</tr>`;
        });
        html+=`</tbody></table></div></div>`;
      } else if(sec.sec==='Corrente di dispersione nel paziente in HF'){
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:54px;text-align:center">`;
        const th=`padding:5px 8px;text-align:center;white-space:nowrap;border-bottom:2px solid #1a3a6b;font-weight:700`;
        const td=`padding:5px 8px;white-space:nowrap`;
        const tc=`padding:4px;text-align:center`;
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div style="overflow-x:auto;padding:0 14px 12px"><table style="border-collapse:collapse;font-size:12px">`;
        html+=`<thead><tr><th style="${th};text-align:left">Prova</th><th style="${th}">Taglio</th><th style="${th}">Mix</th><th style="${th}">Coagulo</th><th style="${th}">Tipo uscita</th></tr></thead><tbody>`;
        html+=`<tr><td style="${td}">Carico tra elettrodi</td><td style="${tc}">${inp('elb_ct_t')}</td><td style="${tc}">${inp('elb_ct_m')}</td><td style="${tc}">${inp('elb_ct_c')}</td><td style="${td};font-size:11px;text-align:center" rowspan="2">Uscita riferita<br>a terra in HF</td></tr>`;
        html+=`<tr><td style="${td}">Carico tra attivo e terra</td><td style="${tc}">${inp('elb_at_t')}</td><td style="${tc}">${inp('elb_at_m')}</td><td style="${tc}">${inp('elb_at_c')}</td></tr>`;
        html+=`<tr><td style="${td}">Elettrodo neutro</td><td style="${tc}">${inp('elb_en_t')}</td><td style="${tc}">${inp('elb_en_m')}</td><td style="${tc}">${inp('elb_en_c')}</td><td style="${td};font-size:11px;text-align:center" rowspan="2">Uscita<br>isolata</td></tr>`;
        html+=`<tr><td style="${td}">Elettrodo attivo</td><td style="${tc}">${inp('elb_ea_t')}</td><td style="${tc}">${inp('elb_ea_m')}</td><td style="${tc}">${inp('elb_ea_c')}</td></tr>`;
        html+=`<tr><td style="${td};font-size:11px" colspan="2">Correnti di dispersione in HF rientranti nei limiti<br>Condizioni Normali 150 mA</td><td style="${td};font-size:11px" colspan="2">Misura sui Terminali Apparecchio 100 mA</td><td style="${tc}"><input type="hidden" id="elb_hf_esito"><div class="rg" id="rg-elb_hf_esito"><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('elb_hf_esito').value='OK'">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('elb_hf_esito').value='KO'">KO</div><div class="rb na" data-v="NA" onclick="pick(this);document.getElementById('elb_hf_esito').value='NA'">NA</div></div></td></tr>`;
        html+=`<tr><td style="${td}" rowspan="2">Elettrodo bipolare</td><td style="${tc};font-size:11px" colspan="2">Elettrodo 1<br>${inp('elb_iso1n')}&nbsp;${inp('elb_iso1t')}</td><td style="${tc};font-size:11px" colspan="2">Elettrodo 2 — Uscita isolata<br>${inp('elb_iso2n')}&nbsp;${inp('elb_iso2t')}</td></tr>`;
        html+=`<tr><td style="${td};font-size:11px" colspan="3">Correnti di dispersione in HF rientranti nei limiti — 1% di P misurata su carico di 200 Ω</td><td style="${tc}"><input type="hidden" id="elb_bip_esito"><div class="rg" id="rg-elb_bip_esito"><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('elb_bip_esito').value='OK'">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('elb_bip_esito').value='KO'">KO</div><div class="rb na" data-v="NA" onclick="pick(this);document.getElementById('elb_bip_esito').value='NA'">NA</div></div></td></tr>`;
        html+=`</tbody></table></div></div>`;
      } else if(sec.sec==='Precisione energia erogata'){
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:13px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const rbE=`<input type="hidden" id="def_e_esito"><div class="rg" id="rg-def_e_esito"><div class="rb na" data-v="NA" onclick="pick(this);document.getElementById('def_e_esito').value='NA'">N/A</div><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('def_e_esito').value='OK'">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('def_e_esito').value='KO'">KO</div></div>`;
        const thH=`text-align:center;font-size:12px;font-weight:700;color:#1a3a6b;padding:4px 8px 8px`;
        const tdL=`padding:4px 4px 4px 0;font-size:13px;white-space:nowrap;text-align:right`;
        const tdC=`padding:4px 6px`;
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">Precisione energia erogata<span style="font-size:10px;font-weight:400;text-transform:none;letter-spacing:0;color:var(--text3)">Tolleranza: ±15% di E impostata, ±3J E misurata</span></div><div style="padding:0 14px 12px">
          <table style="border-collapse:collapse;width:100%">
            <colgroup><col style="width:15%"><col style="width:18%"><col><col></colgroup>
            <thead><tr>
              <th colspan="2" style="padding:0"></th>
              <th style="${thH}">Impostato (J)</th>
              <th style="${thH}">Misurato (J)</th>
            </tr></thead>
            <tbody>
              <tr>
                <td rowspan="5" style="font-weight:700;font-size:20px;text-align:center;vertical-align:middle;padding:6px 8px">MANUALE</td>
                <td style="${tdL}">Misura 1</td><td style="${tdC}">${inp('def_e1i')}</td><td style="${tdC}">${inp('def_e1m')}</td>
              </tr>
              <tr><td style="${tdL}">Misura 2</td><td style="${tdC}">${inp('def_e2i')}</td><td style="${tdC}">${inp('def_e2m')}</td></tr>
              <tr><td style="${tdL}">Misura 3</td><td style="${tdC}">${inp('def_e3i')}</td><td style="${tdC}">${inp('def_e3m')}</td></tr>
              <tr><td style="${tdL}">Misura 4</td><td style="${tdC}">${inp('def_e4i')}</td><td style="${tdC}">${inp('def_e4m')}</td></tr>
              <tr><td style="${tdL}">Misura 5</td><td style="${tdC}">${inp('def_e5i')}</td><td style="${tdC}">${inp('def_e5m')}</td></tr>
              <tr style="border-top:2px solid var(--border2)">
                <td style="font-weight:700;font-size:20px;text-align:center;vertical-align:middle;padding:8px 8px">DAE</td>
                <td colspan="2"></td>
                <td style="${tdC}">${inp('def_dae_mis')}</td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex;align-items:center;gap:8px;margin-top:10px;padding-top:10px;border-top:2px solid var(--border2)"><span style="font-size:12px;font-weight:600;color:var(--text2)">Esito sezione:</span>${rbE}</div>
        </div></div>`;
      } else if(sec.sec==='Tempi di carica alla massima energia'){
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:13px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const btnNA=(id)=>`<input type="hidden" id="${id}"><div class="rg" id="rg-${id}" style="justify-content:center"><div class="rb na" data-v="X" onclick="pick(this);document.getElementById('${id}').value=this.classList.contains('sel')?'X':''">N/A</div></div>`;
        const btnOK=`<input type="hidden" id="def_tc_ok"><div class="rg" id="rg-def_tc_ok" style="display:inline-flex"><div class="rb ok" data-v="X" onclick="pick(this);document.getElementById('def_tc_ok').value=this.classList.contains('sel')?'X':''">OK</div></div>`;
        const thT=`padding:5px 6px;text-align:center;border-bottom:2px solid #1a3a6b;font-weight:700;white-space:nowrap;font-size:11px`;
        const tdC=`padding:4px 5px;text-align:center`;
        const tdK=`padding:4px 8px;font-weight:700;white-space:nowrap;font-size:12px`;
        const tdD=`padding:4px 8px;font-size:11px`;
        const tdM=`padding:4px 8px;text-align:center;font-size:12px;font-weight:600;color:var(--text3)`;
        // hidden inputs per max (def_tc_am/bm/cm/dm) — preservati ma non mostrati
        const hiddenMax=`<input type="hidden" id="def_tc_am"><input type="hidden" id="def_tc_bm"><input type="hidden" id="def_tc_cm"><input type="hidden" id="def_tc_dm">`;
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">Tempi di carica alla massima energia</div><div style="overflow-x:auto;padding:0 14px 12px">
          ${hiddenMax}
          <table style="border-collapse:collapse;width:100%"><thead><tr>
            <th style="${thT}"></th><th style="${thT}">Tipo di carica</th><th style="${thT}">Tempo rilevato<br>a rete (s)</th><th style="${thT}">Tempo rilevato<br>a batteria (s)</th><th style="${thT}">Tempo massimo (s)</th><th style="${thT}">[NA]</th>
          </tr></thead><tbody>
            <tr>
              <td style="${tdK}">A</td>
              <td style="${tdD}">Condizione di defibrillatore pronto alla defibrillazione</td>
              <td style="${tdC}">${inp('def_tc_ar')}</td><td style="${tdC}">${inp('def_tc_ab')}</td>
              <td style="${tdM}">15</td>
              <td style="${tdC}" rowspan="2">${btnNA('def_tc_ab_na')}</td>
            </tr>
            <tr>
              <td style="${tdK}">B</td>
              <td style="${tdD}">Condizione di defibrillatore pronto dall\'accensione dell\'apparecchio</td>
              <td style="${tdC}">${inp('def_tc_br')}</td><td style="${tdC}">${inp('def_tc_bb')}</td>
              <td style="${tdM}">25</td>
            </tr>
            <tr>
              <td style="${tdK}">C</td>
              <td style="${tdD}">Condizione di defibrillatore pronto dopo il rilevamento del ritmo che necessita la defibrillazione (DAE)</td>
              <td style="${tdC}">${inp('def_tc_cr')}</td><td style="${tdC}">${inp('def_tc_cb')}</td>
              <td style="${tdM}">30</td>
              <td style="${tdC}" rowspan="2">${btnNA('def_tc_cd_na')}</td>
            </tr>
            <tr>
              <td style="${tdK}">D</td>
              <td style="${tdD}">Condizione di defibrillatore pronto dopo il rilevamento del ritmo DAE dall\'accensione</td>
              <td style="${tdC}">${inp('def_tc_dr')}</td><td style="${tdC}">${inp('def_tc_db')}</td>
              <td style="${tdM}">40</td>
            </tr>
          </tbody></table>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;flex-wrap:wrap;gap:8px">
            <span style="font-size:11px;color:var(--text3)">[N/A]: non applicabile, batterie non presenti</span>
            <div style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;font-weight:600">Esito:</span>${btnOK}</div>
          </div>
        </div></div>`;
      } else if(sec.sec==='Tempi di ritardo e ripristino'){
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:13px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const rb=(id)=>`<input type="hidden" id="${id}"><div class="rg" id="rg-${id}"><div class="rb na" data-v="NA" onclick="pick(this);document.getElementById('${id}').value='NA'">NA</div><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('${id}').value='OK'">OK</div></div>`;
        const thR=`padding:5px 6px;text-align:center;border-bottom:2px solid #1a3a6b;font-weight:700;white-space:nowrap;font-size:11px`;
        const tdK=`padding:4px 8px;font-weight:700;white-space:nowrap;font-size:12px`;
        const tdD=`padding:4px 8px;font-size:11px`;
        const tdC=`padding:4px 5px;text-align:center`;
        const ritardi=[
          ['A','def_tr_ar','def_tr_am','def_tr_a_esito','Massimo ritardo picco onda R → uscita defibrillatore'],
          ['B','def_tr_br','def_tr_bm','def_tr_b_esito','Massimo ripristino monitoraggio cardiaco dopo scarica'],
          ['C','def_tr_cr','def_tr_cm','def_tr_c_esito','Massimo riconoscimento ritmo DAE dopo scarica'],
        ];
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">Tempi di ritardo e ripristino</div><div style="overflow-x:auto;padding:0 14px 12px">
          <table style="border-collapse:collapse;width:100%"><thead><tr>
            <th style="${thR}">Conf.</th><th style="${thR}">Tipo</th><th style="${thR}">Rilevato (s)</th><th style="${thR}">Max (s)</th><th style="${thR}">Esito</th>
          </tr></thead><tbody>`;
        ritardi.forEach(([k,r,m,e,desc])=>{
          html+=`<tr><td style="${tdK}">${k}</td><td style="${tdD}">${desc}</td><td style="${tdC}">${inp(r)}</td><td style="${tdC}">${inp(m)}</td><td style="${tdC}">${rb(e)}</td></tr>`;
        });
        html+=`</tbody></table></div></div>`;
      } else if(sec.sec==='Raccomandazioni'){
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">Raccomandazioni</div><div style="padding:0 14px 12px">`;
        sec.fields.forEach(f=>{
          html+=`<input type="hidden" id="${f.id}"><div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:12px;color:var(--text2);line-height:1.5"><span style="font-weight:700;min-width:16px">${f.l.charAt(0)}</span><span>${f.l.slice(4)}</span></div>`;
        });
        html+=`</div></div>`;
      } else {
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div class="sec-body" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">`;
        sec.fields.forEach(f=>{
          if(f.type==='rb'){
            const opts=f.opts||['OK','KO','NA'];
            const lbls=f.labels||opts;
            const rbHtml=opts.map((v,i)=>`<div class="rb" data-v="${v}" onclick="pick(this);document.getElementById('${f.id}').value='${v}'">${lbls[i]}</div>`).join('');
            html+=`<input type="hidden" id="${f.id}"><div class="field" style="grid-column:1/-1"><label>${f.l}</label><div class="rg" id="rg-${f.id}">${rbHtml}</div></div>`;
          } else {
            const inp=f.type==='date'?`<input type="date" id="${f.id}">`:`<input type="text" id="${f.id}" inputmode="decimal">`;
            html+=`<div class="field"><label>${f.l}</label>${inp}</div>`;
          }
        });
        html+='</div></div>';
      }
    });
    extraDiv.innerHTML=html;
    extraDiv.style.display='block';
  } else {
    extraDiv.innerHTML='';
    extraDiv.style.display='none';
  }
}

function toggleVSP(l){
  const btns=document.getElementById('vsp-btns-'+l);
  if(btns) btns.style.display=btns.style.display==='none'?'flex':'none';
}

function setVSP(l,val){
  const vsp=vspStateGet(); vsp[l]=val;
  const stato=document.getElementById('vsp-stato-'+l);
  stato.textContent=val;
  stato.className='mp-stato '+(val==='OK'?'ok':val==='KO'?'ko':'na');
  const hdr=document.querySelector('#vsp-p-'+l+' .mp-point-hdr');
  if(hdr) hdr.style.background=val==='OK'?'var(--info-bg)':val==='KO'?'var(--ko-bg)':'var(--bg2)';
  document.querySelectorAll('#vsp-btns-'+l+' .mp-btn').forEach(b=>b.classList.toggle('sel',b.textContent===val));
  document.getElementById('vsp-btns-'+l).style.display='none';
  document.getElementById('vsp-count').textContent=Object.keys(vsp).length;
  uP();
}

function fillVSPHeader(d){
  const t=(useDataUltimaVerifica&&d.data_ultima_vsp)||currentSessionDate||new Date().toISOString().split('T')[0];
  sv('vsp-codice',d.c); sv('vsp-data',t); sv('vsp-note','-');
  sv('vsp-data2',t); sv('vsp-tecnico',d.ver||'');
}

function resetVSP(){
  store.set('form.vsp', {}); store.set('form.vspType', null);
  const c=document.getElementById('vsp-count'); if(c) c.textContent='0';
  document.querySelectorAll('[id^="vsp-p-"]').forEach(el=>{
    const l=el.id.replace('vsp-p-','');
    const s=document.getElementById('vsp-stato-'+l); if(s){s.textContent='—';s.className='mp-stato';}
    const h=el.querySelector('.mp-point-hdr'); if(h) h.style.background='';
    const b=document.getElementById('vsp-btns-'+l); if(b){b.style.display='none';b.querySelectorAll('.mp-btn').forEach(x=>x.classList.remove('sel'));}
  });
  const ex=document.getElementById('vsp-extra'); if(ex){ex.innerHTML='';ex.style.display='none';}
}

function collectVSP(){
  const vspType=vspTypeGet(); if(!vspType) return null;
  const vspState=vspStateGet();
  const t=new Date().toISOString().split('T')[0];
  const rec={vsp_type:vspType,vsp_codice:gv('vsp-codice'),vsp_data:gv('vsp-data')||t,
    vsp_note:gv('vsp-note'),vsp_tecnico:gv('vsp-tecnico'),vsp_data2:gv('vsp-data2')||t};
  (VSP_POINTS[vspType]||[]).forEach(p=>{rec['vsp_'+p.l]=vspState[p.l]||'';});
  const extra=VSP_EXTRA[vspType];
  if(extra) extra.forEach(sec=>sec.fields.forEach(f=>{rec[f.id]=gv(f.id)||'';}));
  return rec;
}

function loadVSPSaved(rec){
  if(!rec||!rec.vsp_type) return;
  buildVSPPoints(rec.vsp_type);
  const _cVsp=curGet();const _dVsp=(useDataUltimaVerifica&&_cVsp&&DB[_cVsp.c]?.data_ultima_vsp)||null;
  sv('vsp-data',_dVsp||currentSessionDate||rec.vsp_data||''); sv('vsp-note',rec.vsp_note||'-');
  sv('vsp-tecnico',rec.vsp_tecnico||''); sv('vsp-data2',rec.vsp_data2||'');
  (VSP_POINTS[rec.vsp_type]||[]).forEach(p=>{if(rec['vsp_'+p.l]) setVSP(p.l,rec['vsp_'+p.l]);});
  const extra=VSP_EXTRA[rec.vsp_type];
  if(extra) extra.forEach(sec=>sec.fields.forEach(f=>{if(f.type==='rb'){const v=rec[f.id]||'';sr('rg-'+f.id,v);const hid=document.getElementById(f.id);if(hid)hid.value=v;}else{const el=document.getElementById(f.id);if(el&&rec[f.id])el.value=rec[f.id];}}));
}


// ===================== CQ =====================
// cqState/cqType vivono in store.form.* — helper read-only
function cqStateGet(){return store.get('form.cq');}
function cqTypeGet(){return store.get('form.cqType');}

const CQ_VIS={
  'CQ_DEF':['1.1','1.2','1.3','1.4','1.5','1.6','1.7'],
  'CQ_ECG':['1.1','1.2','1.3','1.4','1.5','1.6','1.7'],
  'CQ_CEN':['1.1','1.2','1.3','1.4','1.5'],
  'CQ_ELB':['1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','1.10'],
  'CQ_FBI':['1.1','1.2'],
  'CQ_ECT':['1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8'],
  'CQ_MON':['1.1','1.2','1.3'],
  'CQ_ANS':['1.1','1.2','1.3','1.4'],
  'CQ_SPM':['1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8'],
  'CQ_VPO':['1.1','1.2','1.3','1.4'],
};

const CQ_VIS_LABELS={
  'CQ_DEF':{
    '1.1':'Massima energia selezionabile 360 J o 50 J per defibrillazione interna',
    '1.2':'Controllo integrità piastre e cavi',
    '1.3':'Istruzioni sul funzionamento e istruzioni per la defibrillazione sull\'involucro in Italiano leggibili da 1 Metro e/o udibili',
    '1.4':'Verifica tempo di carica alla massima energia con alimentazione a batteria',
    '1.5':'Verifica presenza segnalazione sonora di raggiunto livello di energia',
    '1.6':'Verifica, se presente, impulso di sincronizzazione con misura del tempo di sincronismo < 60 ms',
    '1.7':'Prova funzionale',
  },
  'CQ_ECG':{
    '1.1':'Controllo integrità involucro esterno',
    '1.2':'Controllo funzionamento di comandi, interruttori, pulsanti e manopole',
    '1.3':'Controllo funzionamento spie luminose',
    '1.4':'Controllo isolamento cavi ECG',
    '1.5':'Verifica velocità 25mm/sec',
    '1.6':'Verifica velocità 5mm/sec',
    '1.7':'Prova Funzionale',
  },
  'CQ_CEN':{
    '1.1':'Controllo funzionamento di comandi, interruttori, pulsanti e manopole',
    '1.2':'Controllo sistema di sicurezza bloccaggio coperchio',
    '1.3':'Pulizia e lubrificazione rotore e parti in movimento',
    '1.4':'Prova funzionale',
    '1.5':'I giri e la temperatura misurata rientrano nei limiti di precisione dichiarati dal costruttore nel manuale d\'uso o definiti dall\'utente',
  },
  'CQ_ELB':{
    '1.1':'Presente indicatore luminoso verde indicante tensione di rete',
    '1.2':'Presente simbolo protezione da defibrillatore',
    '1.3':'Presente indicatore luminoso giallo indicante taglio attivato',
    '1.4':'Presente indicatore luminoso blu indicante coagulo attivato',
    '1.5':'Presente indicatore luminoso rosso indicante guasto circuito piastra',
    '1.6':'Comandi del manipolo: avanti taglio - dietro coagulo',
    '1.7':'Comandi del pedale: sinistra taglio - destra coagulo',
    '1.8':'Presenza segnale sonoro di uscita attivata',
    '1.9':'Presenza segnale sonoro di allarme guasto circuito piastra',
    '1.10':'Prova funzionale',
  },
  'CQ_FBI':{
    '1.1':'Controllo funzionamento di comandi, interruttori, pulsanti e manopole',
    '1.2':'Controllo presenza allarme temperatura',
  },
  'CQ_ECT':{
    '1.1':'Controllo integrità involucro',
    '1.2':'Controllo integrità cavi elettrici/spina/presa',
    '1.3':'Controllo funzionamento di comandi, interruttori, pulsanti e manopole',
    '1.4':'Controllo corretta funzionalità dei comandi',
    '1.5':'Verifica stato sonde (cavi e superficie)',
    '1.6':'Controllo efficienza dei movimenti meccanici',
    '1.7':'Pulizia filtri',
    '1.8':'Prova funzionale',
  },
  'CQ_MON':{
    '1.1':'Controllo visivo isolamento cavi parti applicate e integrità manicotto NIBP',
    '1.2':'Controllo funzionamento di comandi, interruttori, pulsanti e manopole',
    '1.3':'Presenza allarme frequenza cardiaca',
  },
  'CQ_ANS':{
    '1.1':'Presenza allarme mancanza rete',
    '1.2':'Cavo di alimentazione protetto contro disconnessione accidentale',
    '1.3':'Controllo numero prese ausiliarie (massimo 4)',
    '1.4':'Presenza valvola ossigeno di emergenza',
    '1.5':'Esito di tutte le prove eseguite',
  },
  'CQ_VPO':{
    '1.1':'Presenza allarme mancanza rete',
    '1.2':'Cavo di alimentazione protetto contro disconnessione accidentale',
    '1.3':'Controllo numero prese ausiliarie (massimo 4)',
    '1.4':'Presenza valvola ossigeno di emergenza',
  },
  'CQ_SPM':{
    '1.1':'Controllo integrità involucro',
    '1.2':'Controllo integrità cavi elettrici/spina/presa',
    '1.3':'Controllo corretto amperaggio fusibili',
    '1.4':'Controllo funzionamento di comandi, interruttori, pulsanti e manopole',
    '1.5':'Verifica dello stato dei tubi e connettori',
    '1.6':'Verifica dell\'integrità del trasduttore',
    '1.7':'Verifica dello stato delle batterie interne, se presenti',
    '1.8':'Prova funzionale',
  },
};

const CQ_PROVA={
  'CQ_DEF':[
    {sec:'Tipologia e opzioni',fields:[{id:'cq_def_tipo_man',l:'Manuale (X)'},{id:'cq_def_tipo_dae',l:'DAE (X)'},{id:'cq_def_opt_pac',l:'Pacing (X)'},{id:'cq_def_opt_nibp',l:'NIBP (X)'},{id:'cq_def_opt_spo2',l:'SPO2 (X)'}]},
    {sec:'Energia erogata (J) — Impostata / Misurata',fields:[
      {id:'cq_def_e1i',l:'E1 Impostata'},{id:'cq_def_e1m',l:'E1 Misurata'},{id:'cq_def_e1_esito',l:'E1 Esito',type:'rb',opts:['OK','KO']},
      {id:'cq_def_e2i',l:'E2 Impostata'},{id:'cq_def_e2m',l:'E2 Misurata'},{id:'cq_def_e2_esito',l:'E2 Esito',type:'rb',opts:['OK','KO']},
      {id:'cq_def_e3i',l:'E3 Impostata'},{id:'cq_def_e3m',l:'E3 Misurata'},{id:'cq_def_e3_esito',l:'E3 Esito',type:'rb',opts:['OK','KO']},
      {id:'cq_def_e4i',l:'E4 Impostata'},{id:'cq_def_e4m',l:'E4 Misurata'},{id:'cq_def_e4_esito',l:'E4 Esito',type:'rb',opts:['OK','KO']},
      {id:'cq_def_e5i',l:'E5 Impostata'},{id:'cq_def_e5m',l:'E5 Misurata'},{id:'cq_def_e5_esito',l:'E5 Esito',type:'rb',opts:['OK','KO']},
      {id:'cq_def_e6i',l:'E6 Impostata'},{id:'cq_def_e6m',l:'E6 Misurata'},{id:'cq_def_e6_esito',l:'E6 Esito',type:'rb',opts:['OK','KO']},
    ]},
  ],
  'CQ_ECG':[
    {sec:'Prova funzionale ECG — Impostato / Indicato / Limite',fields:[
      {id:'cq_ecg_v1i',l:'M1 Impostato'},{id:'cq_ecg_v1ind',l:'M1 Indicato'},{id:'cq_ecg_v1lim',l:'M1 Limite'},
      {id:'cq_ecg_v2i',l:'M2 Impostato'},{id:'cq_ecg_v2ind',l:'M2 Indicato'},{id:'cq_ecg_v2lim',l:'M2 Limite'},
      {id:'cq_ecg_v3i',l:'M3 Impostato'},{id:'cq_ecg_v3ind',l:'M3 Indicato'},{id:'cq_ecg_v3lim',l:'M3 Limite'},
      {id:'cq_ecg_v4i',l:'M4 Impostato'},{id:'cq_ecg_v4ind',l:'M4 Indicato'},{id:'cq_ecg_v4lim',l:'M4 Limite'},
      {id:'cq_ecg_v5i',l:'M5 Impostato'},{id:'cq_ecg_v5ind',l:'M5 Indicato'},{id:'cq_ecg_v5lim',l:'M5 Limite'},
    ]},
  ],
  'CQ_CEN':[
    {sec:'Giri — Impostato / Misurato',fields:[
      {id:'cq_cen_g1i',l:'G1 Impostato'},{id:'cq_cen_g1m',l:'G1 Misurato'},
      {id:'cq_cen_g2i',l:'G2 Impostato'},{id:'cq_cen_g2m',l:'G2 Misurato'},
      {id:'cq_cen_g3i',l:'G3 Impostato'},{id:'cq_cen_g3m',l:'G3 Misurato'},
    ]},
    {sec:'Temperatura — Impostata / Misurata',fields:[
      {id:'cq_cen_t1i',l:'T1 Impostata'},{id:'cq_cen_t1m',l:'T1 Misurata'},
      {id:'cq_cen_t2i',l:'T2 Impostata'},{id:'cq_cen_t2m',l:'T2 Misurata'},
      {id:'cq_cen_t3i',l:'T3 Impostata'},{id:'cq_cen_t3m',l:'T3 Misurata'},
    ]},
  ],
  'CQ_ELB':[
    {sec:'CORRENTI DI DISPERSIONE IN ALTA FREQUENZA (mA)',fields:[
      {id:'cq_elb_ct_t',l:'Carico el. — Taglio'},{id:'cq_elb_ct_c',l:'Carico el. — Coagulo'},
      {id:'cq_elb_at_t',l:'Attivo/terra — T'},{id:'cq_elb_at_c',l:'Attivo/terra — C'},
      {id:'cq_elb_fn_t',l:'Flott. att./terra — T'},{id:'cq_elb_fn_c',l:'Flott. att./terra — C'},
      {id:'cq_elb_en_t',l:'El. neutro — T'},{id:'cq_elb_en_c',l:'El. neutro — C'},
      {id:'cq_elb_iso1',l:'Bipolare El.1'},{id:'cq_elb_iso2',l:'Bipolare El.2'},
      {id:'cq_elb_hf_esito',l:'Correnti HF nei limiti',type:'rb'},
      {id:'cq_elb_bip_esito',l:'Correnti bipolare nei limiti',type:'rb'},
    ]},
    {sec:'POTENZA DI USCITA SU CARICO NOMINALE IN WATT ( LIMITE MASSIMO AMMESSO +- 20% )',fields:[
      {id:'cq_elb_pt1d',l:'Taglio — Dic.'},{id:'cq_elb_pt1r',l:'Taglio — Ris.'},
      {id:'cq_elb_pc1d',l:'Coagulo — Dic.'},{id:'cq_elb_pc1r',l:'Coagulo — Ris.'},
      {id:'cq_elb_pb1d',l:'Bipolare — Dic.'},{id:'cq_elb_pb1r',l:'Bipolare — Ris.'},
      {id:'cq_elb_pt2d',l:'Taglio — Dic.'},{id:'cq_elb_pt2r',l:'Taglio — Ris.'},
      {id:'cq_elb_pc2d',l:'Coagulo — Dic.'},{id:'cq_elb_pc2r',l:'Coagulo — Ris.'},
      {id:'cq_elb_pb2d',l:'Bipolare — Dic.'},{id:'cq_elb_pb2r',l:'Bipolare — Ris.'},
      {id:'cq_elb_pt3d',l:'Taglio — Dic.'},{id:'cq_elb_pt3r',l:'Taglio — Ris.'},
      {id:'cq_elb_pc3d',l:'Coagulo — Dic.'},{id:'cq_elb_pc3r',l:'Coagulo — Ris.'},
      {id:'cq_elb_pb3d',l:'Bipolare — Dic.'},{id:'cq_elb_pb3r',l:'Bipolare — Ris.'},
      {id:'cq_elb_pt4d',l:'Taglio — Dic.'},{id:'cq_elb_pt4r',l:'Taglio — Ris.'},
      {id:'cq_elb_pc4d',l:'Coagulo — Dic.'},{id:'cq_elb_pc4r',l:'Coagulo — Ris.'},
      {id:'cq_elb_pb4d',l:'Bipolare — Dic.'},{id:'cq_elb_pb4r',l:'Bipolare — Ris.'},
      {id:'cq_elb_pot_esito',l:'Potenze rientranti nei limiti (max +/- 20%)',type:'rb'},
    ]},
  ],
  'CQ_FBI':[
    {sec:'Taratura temperature (Impostata / Indicata / Termografo / Misurata / Limiti)',fields:[
      {id:'cq_fbi_r1label',l:'Ripiano 1 — Nome'},{id:'cq_fbi_r1i',l:'R1 Impostata'},{id:'cq_fbi_r1ind',l:'R1 Indicata'},{id:'cq_fbi_r1it',l:'R1 Termografo'},{id:'cq_fbi_r1m',l:'R1 Misurata'},{id:'cq_fbi_r1l',l:'R1 Limiti'},
      {id:'cq_fbi_r2label',l:'Ripiano 2 — Nome'},{id:'cq_fbi_r2i',l:'R2 Impostata'},{id:'cq_fbi_r2ind',l:'R2 Indicata'},{id:'cq_fbi_r2it',l:'R2 Termografo'},{id:'cq_fbi_r2m',l:'R2 Misurata'},{id:'cq_fbi_r2l',l:'R2 Limiti'},
      {id:'cq_fbi_r3label',l:'Ripiano 3 — Nome'},{id:'cq_fbi_r3i',l:'R3 Impostata'},{id:'cq_fbi_r3ind',l:'R3 Indicata'},{id:'cq_fbi_r3it',l:'R3 Termografo'},{id:'cq_fbi_r3m',l:'R3 Misurata'},{id:'cq_fbi_r3l',l:'R3 Limiti'},
      {id:'cq_fbi_r4label',l:'Ripiano 4 — Nome'},{id:'cq_fbi_r4i',l:'R4 Impostata'},{id:'cq_fbi_r4ind',l:'R4 Indicata'},{id:'cq_fbi_r4it',l:'R4 Termografo'},{id:'cq_fbi_r4m',l:'R4 Misurata'},{id:'cq_fbi_r4l',l:'R4 Limiti'},
    ]},
  ],
  'CQ_ECT':[
    {sec:'Identificazione sonde',fields:[
      {id:'cq_ect_s1',l:'Sonda 1 (inventario)'},{id:'cq_ect_s2',l:'Sonda 2 (inventario)'},
      {id:'cq_ect_s3',l:'Sonda 3 (inventario)'},{id:'cq_ect_s4',l:'Sonda 4 (inventario)'},
    ]},
    {sec:'Misure — Sonda 1/2/3/4',fields:[
      {id:'cq_ect_m1s1',l:'1) Uniformità S1'},{id:'cq_ect_m1s2',l:'1) Uniformità S2'},{id:'cq_ect_m1s3',l:'1) Uniformità S3'},{id:'cq_ect_m1s4',l:'1) Uniformità S4'},
      {id:'cq_ect_m2as1',l:'2a) Orizz. S1'},{id:'cq_ect_m2as2',l:'2a) Orizz. S2'},{id:'cq_ect_m2as3',l:'2a) Orizz. S3'},{id:'cq_ect_m2as4',l:'2a) Orizz. S4'},
      {id:'cq_ect_m2bs1',l:'2b) Vert. S1'},{id:'cq_ect_m2bs2',l:'2b) Vert. S2'},{id:'cq_ect_m2bs3',l:'2b) Vert. S3'},{id:'cq_ect_m2bs4',l:'2b) Vert. S4'},
      {id:'cq_ect_m3as1',l:'3a) Ris.ass. S1'},{id:'cq_ect_m3as2',l:'3a) Ris.ass. S2'},{id:'cq_ect_m3as3',l:'3a) Ris.ass. S3'},{id:'cq_ect_m3as4',l:'3a) Ris.ass. S4'},
      {id:'cq_ect_m3bs1',l:'3b) Ris.lat. S1'},{id:'cq_ect_m3bs2',l:'3b) Ris.lat. S2'},{id:'cq_ect_m3bs3',l:'3b) Ris.lat. S3'},{id:'cq_ect_m3bs4',l:'3b) Ris.lat. S4'},
      {id:'cq_ect_m4as1',l:'4a) Pseudocisti S1'},{id:'cq_ect_m4as2',l:'4a) Pseudocisti S2'},{id:'cq_ect_m4as3',l:'4a) Pseudocisti S3'},{id:'cq_ect_m4as4',l:'4a) Pseudocisti S4'},
      {id:'cq_ect_m4bs1',l:'4b) Pseudotum. S1'},{id:'cq_ect_m4bs2',l:'4b) Pseudotum. S2'},{id:'cq_ect_m4bs3',l:'4b) Pseudotum. S3'},{id:'cq_ect_m4bs4',l:'4b) Pseudotum. S4'},
      {id:'cq_ect_m5s1',l:'5) Zona morta S1'},{id:'cq_ect_m5s2',l:'5) Zona morta S2'},{id:'cq_ect_m5s3',l:'5) Zona morta S3'},{id:'cq_ect_m5s4',l:'5) Zona morta S4'},
      {id:'cq_ect_m6s1',l:'6) Profondità S1'},{id:'cq_ect_m6s2',l:'6) Profondità S2'},{id:'cq_ect_m6s3',l:'6) Profondità S3'},{id:'cq_ect_m6s4',l:'6) Profondità S4'},
    ]},
  ],
  'CQ_MON':[
    {sec:'Prova ECG — Impostato / Indicato / Limite',fields:[
      {id:'cq_mon_e1i',l:'E1 Imp'},{id:'cq_mon_e1ind',l:'E1 Ind'},{id:'cq_mon_e1lim',l:'E1 Lim'},
      {id:'cq_mon_e2i',l:'E2 Imp'},{id:'cq_mon_e2ind',l:'E2 Ind'},{id:'cq_mon_e2lim',l:'E2 Lim'},
      {id:'cq_mon_e3i',l:'E3 Imp'},{id:'cq_mon_e3ind',l:'E3 Ind'},{id:'cq_mon_e3lim',l:'E3 Lim'},
      {id:'cq_mon_e4i',l:'E4 Imp'},{id:'cq_mon_e4ind',l:'E4 Ind'},{id:'cq_mon_e4lim',l:'E4 Lim'},
      {id:'cq_mon_e5i',l:'E5 Imp'},{id:'cq_mon_e5ind',l:'E5 Ind'},{id:'cq_mon_e5lim',l:'E5 Lim'},
    ]},
    {sec:'Prova SPO2 (%) — Impostato / Indicato / Limite',fields:[
      {id:'cq_mon_s1i',l:'S1 Imp'},{id:'cq_mon_s1ind',l:'S1 Ind'},{id:'cq_mon_s1lim',l:'S1 Lim'},
      {id:'cq_mon_s2i',l:'S2 Imp'},{id:'cq_mon_s2ind',l:'S2 Ind'},{id:'cq_mon_s2lim',l:'S2 Lim'},
      {id:'cq_mon_s3i',l:'S3 Imp'},{id:'cq_mon_s3ind',l:'S3 Ind'},{id:'cq_mon_s3lim',l:'S3 Lim'},
      {id:'cq_mon_s4i',l:'S4 Imp'},{id:'cq_mon_s4ind',l:'S4 Ind'},{id:'cq_mon_s4lim',l:'S4 Lim'},
      {id:'cq_mon_s5i',l:'S5 Imp'},{id:'cq_mon_s5ind',l:'S5 Ind'},{id:'cq_mon_s5lim',l:'S5 Lim'},
      {id:'cq_mon_s6i',l:'S6 Imp'},{id:'cq_mon_s6ind',l:'S6 Ind'},{id:'cq_mon_s6lim',l:'S6 Lim'},
    ]},
    {sec:'Prova NIBP (mmHg) — Impostato / Indicato / Limite',fields:[
      {id:'cq_mon_n1i',l:'N1 Imp'},{id:'cq_mon_n1ind',l:'N1 Ind'},{id:'cq_mon_n1lim',l:'N1 Lim'},
      {id:'cq_mon_n2i',l:'N2 Imp'},{id:'cq_mon_n2ind',l:'N2 Ind'},{id:'cq_mon_n2lim',l:'N2 Lim'},
      {id:'cq_mon_n3i',l:'N3 Imp'},{id:'cq_mon_n3ind',l:'N3 Ind'},{id:'cq_mon_n3lim',l:'N3 Lim'},
    ]},
  ],
  'CQ_ANS':[
    {sec:'Controlli funzionali',fields:[
      {id:'cq_ans_comp',l:'Compliance'},{id:'cq_ans_res',l:'Resistenza'},{id:'cq_ans_ie',l:'I:E'},
      {id:'cq_ans_fri',l:'Freq.resp. Impostato'},{id:'cq_ans_frv',l:'Freq.resp. Visualizzato'},{id:'cq_ans_frm',l:'Freq.resp. Misurato'},{id:'cq_ans_frl',l:'Freq.resp. Limite'},{id:'cq_ans_fr_esito',l:'Freq.resp. Esito',type:'rb'},
      {id:'cq_ans_vii',l:'Vol.ist. Impostato'},{id:'cq_ans_viv',l:'Vol.ist. Visualizzato'},{id:'cq_ans_vim',l:'Vol.ist. Misurato'},{id:'cq_ans_vil',l:'Vol.ist. Limite'},{id:'cq_ans_vi_esito',l:'Vol.ist. Esito',type:'rb'},
      {id:'cq_ans_esito',l:'Esito di tutte le prove eseguite',type:'rb'},
    ]},
  ],
  'CQ_SPM':[
    {sec:'Prova funzionale volume — Impostato / Misurato',fields:[
      {id:'cq_spm_v1i',l:'V1 Impostato'},{id:'cq_spm_v1m',l:'V1 Misurato'},
      {id:'cq_spm_v2i',l:'V2 Impostato'},{id:'cq_spm_v2m',l:'V2 Misurato'},
      {id:'cq_spm_v3i',l:'V3 Impostato'},{id:'cq_spm_v3m',l:'V3 Misurato'},
    ]},
  ],
  'CQ_VPO':[
    {sec:'Controlli funzionali',fields:[
      {id:'cq_ans_comp',l:'Compliance'},{id:'cq_ans_res',l:'Resistenza'},{id:'cq_ans_ie',l:'I:E'},
      {id:'cq_ans_fri',l:'Freq.resp. Impostato'},{id:'cq_ans_frv',l:'Freq.resp. Visualizzato'},{id:'cq_ans_frm',l:'Freq.resp. Misurato'},{id:'cq_ans_frl',l:'Freq.resp. Limite'},{id:'cq_ans_fr_esito',l:'Freq.resp. Esito',type:'rb'},
      {id:'cq_ans_vii',l:'Vol.ist. Impostato'},{id:'cq_ans_viv',l:'Vol.ist. Visualizzato'},{id:'cq_ans_vim',l:'Vol.ist. Misurato'},{id:'cq_ans_vil',l:'Vol.ist. Limite'},{id:'cq_ans_vi_esito',l:'Vol.ist. Esito',type:'rb'},
      {id:'cq_ans_esito',l:'Esito di tutte le prove eseguite',type:'rb'},
    ]},
  ],
};

function buildCQPoints(type){
  store.set('form.cqType', type); store.set('form.cq', {});
  const pts=CQ_VIS[type]||[];
  if(!pts.length){
    // Tipo non gestito — mostra messaggio
    document.getElementById('cq-sec-title').textContent='Controllo qualità — '+type.replace('CQ_','');
    document.getElementById('cq-total').textContent='0';
    document.getElementById('cq-count').textContent='0';
    document.getElementById('cq-points').innerHTML=`<div style="padding:10px;color:var(--text2);font-size:13px">Form ${type} non ancora disponibile.</div>`;
    document.getElementById('cq-prova').innerHTML='';
    document.getElementById('cq-prova').style.display='none';
    return;
  }
  document.getElementById('cq-sec-title').textContent='Controllo visivo — '+type.replace('CQ_','');
  document.getElementById('cq-total').textContent=pts.length;
  document.getElementById('cq-count').textContent='0';
  const container=document.getElementById('cq-points');
  container.innerHTML=pts.map(p=>{
    const pid=p.replace('.','_');
    return`<div class="mp-point" id="cq-p-${pid}">
      <div class="mp-point-hdr" onclick="toggleCQ('${pid}')">
        <div class="mp-num">${p}</div>
        <div class="mp-title">${(CQ_VIS_LABELS[type]||{})[p]||'Punto '+p}</div>
        <div class="mp-stato" id="cq-stato-${pid}">—</div>
      </div>
      <div class="mp-btns" id="cq-btns-${pid}" style="display:none">
        <button class="mp-btn ok" onclick="setCQ('${pid}','OK')">OK</button>
        <button class="mp-btn ko" onclick="setCQ('${pid}','KO')">KO</button>
        <button class="mp-btn na" onclick="setCQ('${pid}','NA')">NA</button>
      </div>
    </div>`;
  }).join('');
  const provaDiv=document.getElementById('cq-prova');
  const secs=CQ_PROVA[type];
  if(secs&&secs.length){
    let html='';
    secs.forEach(sec=>{
      if(sec.sec==='CORRENTI DI DISPERSIONE IN ALTA FREQUENZA (mA)'){
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr" style="text-transform:none">CORRENTI DI DISPERSIONE IN ALTA FREQUENZA (mA)</div><div class="cq-matrix"><table class="cq-table"><thead><tr><th></th><th>Carico tra elettrodi</th><th>Carico fra attivo e terra</th><th>Tre elettrodo attivo e terra</th><th>Tra elettrodo neutro e terra</th></tr></thead><tbody><tr><td class="cq-row-label">TAGLIO</td><td><input type="text" id="cq_elb_ct_t" inputmode="decimal"></td><td><input type="text" id="cq_elb_at_t" inputmode="decimal"></td><td><input type="text" id="cq_elb_fn_t" inputmode="decimal"></td><td><input type="text" id="cq_elb_en_t" inputmode="decimal"></td></tr><tr><td class="cq-row-label">COAGULO</td><td><input type="text" id="cq_elb_ct_c" inputmode="decimal"></td><td><input type="text" id="cq_elb_at_c" inputmode="decimal"></td><td><input type="text" id="cq_elb_fn_c" inputmode="decimal"></td><td><input type="text" id="cq_elb_en_c" inputmode="decimal"></td></tr></tbody></table></div><input type="hidden" id="cq_elb_hf_esito"><div class="cq-esito-row"><span class="cq-esito-label">Correnti di dispersione in alta frequenza rientranti nei limiti</span><div class="rg" id="rg-cq_elb_hf_esito"><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('cq_elb_hf_esito').value='OK'">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('cq_elb_hf_esito').value='KO'">KO</div><div class="rb na" data-v="NA" onclick="pick(this);document.getElementById('cq_elb_hf_esito').value='NA'">NA</div></div></div></div>`;
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">Bipolare</div><div class="cq-matrix"><table class="cq-table"><thead><tr><th></th><th>Elettrodo 1</th><th>Elettrodo 2</th></tr></thead><tbody><tr><td class="cq-row-label">BIPOLARE</td><td><input type="text" id="cq_elb_iso1" inputmode="decimal"></td><td><input type="text" id="cq_elb_iso2" inputmode="decimal"></td></tr></tbody></table></div><input type="hidden" id="cq_elb_bip_esito"><div class="cq-esito-row"><span class="cq-esito-label">Correnti di dispersione in alta frequenza rientranti nei limiti</span><div class="rg" id="rg-cq_elb_bip_esito"><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('cq_elb_bip_esito').value='OK'">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('cq_elb_bip_esito').value='KO'">KO</div><div class="rb na" data-v="NA" onclick="pick(this);document.getElementById('cq_elb_bip_esito').value='NA'">NA</div></div></div></div>`;
      } else if(sec.sec==='POTENZA DI USCITA SU CARICO NOMINALE IN WATT ( LIMITE MASSIMO AMMESSO +- 20% )'){
        const ROWS_POT=[
          {n:1,pt:'cq_elb_pt1d',pr:'cq_elb_pt1r',ct:'cq_elb_pc1d',cr:'cq_elb_pc1r',bt:'cq_elb_pb1d',br:'cq_elb_pb1r'},
          {n:2,pt:'cq_elb_pt2d',pr:'cq_elb_pt2r',ct:'cq_elb_pc2d',cr:'cq_elb_pc2r',bt:'cq_elb_pb2d',br:'cq_elb_pb2r'},
          {n:3,pt:'cq_elb_pt3d',pr:'cq_elb_pt3r',ct:'cq_elb_pc3d',cr:'cq_elb_pc3r',bt:'cq_elb_pb3d',br:'cq_elb_pb3r'},
          {n:4,pt:'cq_elb_pt4d',pr:'cq_elb_pt4r',ct:'cq_elb_pc4d',cr:'cq_elb_pc4r',bt:'cq_elb_pb4d',br:'cq_elb_pb4r'},
        ];
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div class="cq-matrix"><table class="cq-table"><thead><tr><th>#</th><th>Taglio Dic.</th><th>Taglio Ris.</th><th>Coagulo Dic.</th><th>Coagulo Ris.</th><th>Bipolare Dic.</th><th>Bipolare Ris.</th></tr></thead><tbody>`;
        ROWS_POT.forEach(r=>{html+=`<tr><td class="cq-row-label">${r.n}</td><td><input type="text" id="${r.pt}" inputmode="decimal"></td><td><input type="text" id="${r.pr}" inputmode="decimal"></td><td><input type="text" id="${r.ct}" inputmode="decimal"></td><td><input type="text" id="${r.cr}" inputmode="decimal"></td><td><input type="text" id="${r.bt}" inputmode="decimal"></td><td><input type="text" id="${r.br}" inputmode="decimal"></td></tr>`;});
        html+=`</tbody></table></div><input type="hidden" id="cq_elb_pot_esito"><div class="cq-esito-row"><span class="cq-esito-label">Potenze rientranti nei limiti (max +/- 20%)</span><div class="rg" id="rg-cq_elb_pot_esito"><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('cq_elb_pot_esito').value='OK'">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('cq_elb_pot_esito').value='KO'">KO</div><div class="rb na" data-v="NA" onclick="pick(this);document.getElementById('cq_elb_pot_esito').value='NA'">NA</div></div></div></div>`;
      } else if(sec.sec==='Energia erogata (J) — Impostata / Misurata'){
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:13px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const esito=(n)=>`<input type="hidden" id="cq_def_e${n}_esito"><div class="rg" id="rg-cq_def_e${n}_esito" style="justify-content:flex-end;flex-wrap:nowrap"><div class="rb ok" data-v="OK" onclick="pick(this);document.getElementById('cq_def_e${n}_esito').value=this.classList.contains('sel')?'OK':''">OK</div><div class="rb ko" data-v="KO" onclick="pick(this);document.getElementById('cq_def_e${n}_esito').value=this.classList.contains('sel')?'KO':''">KO</div></div>`;
        const thH=`text-align:center;font-size:12px;font-weight:700;color:#1a3a6b;padding:4px 8px 8px`;
        const tdL=`padding:4px 4px 4px 0;font-size:13px;white-space:nowrap;text-align:right`;
        const tdC=`padding:4px 6px`;
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">Energia erogata (J)<span style="font-size:10px;font-weight:400;text-transform:none;letter-spacing:0;color:var(--text3)">Tolleranza: ±15% di E impostata, ±3J E misurata</span></div><div style="padding:0 14px 12px">
          <table style="border-collapse:collapse;width:100%">
            <colgroup><col style="width:22%"><col><col><col style="width:28%"></colgroup>
            <thead><tr>
              <th style="padding:0"></th>
              <th style="${thH}">Impostata (J)</th>
              <th style="${thH}">Misurata (J)</th>
              <th style="${thH}">Esito</th>
            </tr></thead>
            <tbody>
              ${[1,2,3,4,5,6].map(n=>`<tr><td style="${tdL}">Misura ${n}</td><td style="${tdC}">${inp('cq_def_e'+n+'i')}</td><td style="${tdC}">${inp('cq_def_e'+n+'m')}</td><td style="${tdC}">${esito(n)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div></div>`;
      } else if(sec.sec==='Controlli funzionali'){
        // Tabella CQ_ANS/CQ_VPO: impostazioni paziente + misure Freq.resp / Vol.ist con OK/KO
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:12px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const esito=(id)=>`<input type="hidden" id="${id}"><div class="rg" id="rg-${id}" style="flex-wrap:nowrap;gap:3px;justify-content:center">
          <div class="rb ok" data-v="OK" style="font-size:11px;padding:3px 6px" onclick="pick(this);document.getElementById('${id}').value='OK'">OK</div>
          <div class="rb ko" data-v="KO" style="font-size:11px;padding:3px 6px" onclick="pick(this);document.getElementById('${id}').value='KO'">KO</div>
        </div>`;
        const thH=`text-align:center;font-size:11px;font-weight:700;color:#1a3a6b;padding:6px 4px 8px;border-bottom:2px solid var(--border2)`;
        const tdP=`padding:6px 4px;vertical-align:middle;border-bottom:1px solid var(--border2)`;
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div>
          <div style="padding:10px 14px 6px;display:flex;gap:12px;flex-wrap:wrap">
            <div style="flex:1;min-width:120px"><label style="font-size:11px;color:var(--text2);display:block;margin-bottom:3px">Compliance</label>${inp('cq_ans_comp')}</div>
            <div style="flex:1;min-width:100px"><label style="font-size:11px;color:var(--text2);display:block;margin-bottom:3px">Resistenza</label>${inp('cq_ans_res')}</div>
            <div style="flex:1;min-width:80px"><label style="font-size:11px;color:var(--text2);display:block;margin-bottom:3px">I:E</label>${inp('cq_ans_ie')}</div>
          </div>
          <div style="padding:0 10px 12px;overflow-x:auto">
            <table style="border-collapse:collapse;width:100%;min-width:480px">
              <colgroup><col style="width:20%"><col><col><col><col style="width:13%"><col style="width:14%"></colgroup>
              <thead><tr>
                <th style="${thH};text-align:left">Parametro</th>
                <th style="${thH}">Impostato</th>
                <th style="${thH}">Visualizzato</th>
                <th style="${thH}">Misurato</th>
                <th style="${thH}">Limite</th>
                <th style="${thH}">Esito</th>
              </tr></thead>
              <tbody>
                <tr>
                  <td style="${tdP};font-size:11px;font-weight:600;color:var(--accent)">FREQUENZA RESPIRATORIA</td>
                  <td style="${tdP}">${inp('cq_ans_fri')}</td>
                  <td style="${tdP}">${inp('cq_ans_frv')}</td>
                  <td style="${tdP}">${inp('cq_ans_frm')}</td>
                  <td style="${tdP}">${inp('cq_ans_frl')}</td>
                  <td style="${tdP}">${esito('cq_ans_fr_esito')}</td>
                </tr>
                <tr>
                  <td style="${tdP};font-size:11px;font-weight:600;color:var(--accent)">VOLUME ISTANTANEO</td>
                  <td style="${tdP}">${inp('cq_ans_vii')}</td>
                  <td style="${tdP}">${inp('cq_ans_viv')}</td>
                  <td style="${tdP}">${inp('cq_ans_vim')}</td>
                  <td style="${tdP}">${inp('cq_ans_vil')}</td>
                  <td style="${tdP}">${esito('cq_ans_vi_esito')}</td>
                </tr>
                <tr style="background:var(--bg2)">
                  <td colspan="5" style="${tdP};font-size:12px;font-weight:700;color:var(--accent)">1.5 &nbsp;Esito di tutte le prove eseguite</td>
                  <td style="${tdP}">${esito('cq_ans_esito')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;
      } else if(sec.sec.includes('Sonda 1/2/3/4')){
        // Tabella CQ_ECT: Prova | Riferimento | S1 | S2 | S3 | S4
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:12px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const thH=`text-align:center;font-size:11px;font-weight:700;color:#1a3a6b;padding:6px 4px 8px;border-bottom:2px solid var(--border2)`;
        const tdP=`padding:6px 4px;vertical-align:top;border-bottom:1px solid var(--border2)`;
        const ECT_ROWS=[
          {l:'1) Uniformità immagine',rif:'buona / scarsa',ids:['cq_ect_m1s1','cq_ect_m1s2','cq_ect_m1s3','cq_ect_m1s4']},
          {l:'2a) Accuratezza calibri:<br>Orizzontale (Laterale)',rif:'Buono = Errore &lt; 2mm<br>Scarso = Errore &gt; 2mm',ids:['cq_ect_m2as1','cq_ect_m2as2','cq_ect_m2as3','cq_ect_m2as4']},
          {l:'2b) Accuratezza calibri:<br>Verticale (Assiale)',rif:'Buono = Errore &lt; 1.5mm<br>Scarso = Errore &gt; 1.5mm',ids:['cq_ect_m2bs1','cq_ect_m2bs2','cq_ect_m2bs3','cq_ect_m2bs4']},
          {l:'3a) Risoluzione assiale',rif:'Buono = Errore &lt;1mm oltre 4MHz<br>Buono = Errore &lt;2mm fino 4MHz',ids:['cq_ect_m3as1','cq_ect_m3as2','cq_ect_m3as3','cq_ect_m3as4']},
          {l:'3b) Risoluzione laterale',rif:'Buono = Errore &lt;1mm<br>dal valore di ultima verifica',ids:['cq_ect_m3bs1','cq_ect_m3bs2','cq_ect_m3bs3','cq_ect_m3bs4']},
          {l:'4a) Dimensioni masse Ipoecogene &quot;pseudocisti&quot;',rif:'Buono = rapporto &gt; 0,8<br>Accettab. = rapp. tra 0,6 e 0,8<br>Scarso = rapporto &lt; 0,6<br>prof. 8cm — diam. 8mm',ids:['cq_ect_m4as1','cq_ect_m4as2','cq_ect_m4as3','cq_ect_m4as4']},
          {l:'4b) Dimensioni masse Ipoecogene &quot;pseudotumori&quot;',rif:'Buono = rapporto &gt; 0,8<br>Accettab. = rapp. tra 0,6 e 0,8<br>Scarso = rapporto &lt; 0,6<br>prof. 8cm — diam. 8mm',ids:['cq_ect_m4bs1','cq_ect_m4bs2','cq_ect_m4bs3','cq_ect_m4bs4']},
          {l:'5) Zona morta',rif:'Da 1 a 5 mm',ids:['cq_ect_m5s1','cq_ect_m5s2','cq_ect_m5s3','cq_ect_m5s4']},
          {l:'6) Profondità di penetrazione',rif:'Da 4 a 16 cm',ids:['cq_ect_m6s1','cq_ect_m6s2','cq_ect_m6s3','cq_ect_m6s4']},
        ];
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div style="padding:0 10px 12px;overflow-x:auto">
          <table style="border-collapse:collapse;width:100%;min-width:420px">
            <colgroup><col style="width:28%"><col style="width:30%"><col><col><col><col></colgroup>
            <thead><tr>
              <th style="${thH};text-align:left">Prova</th>
              <th style="${thH};text-align:left">Riferimento</th>
              <th style="${thH}">S1</th><th style="${thH}">S2</th><th style="${thH}">S3</th><th style="${thH}">S4</th>
            </tr></thead>
            <tbody>${ECT_ROWS.map(r=>`<tr>
              <td style="${tdP};font-size:12px;font-weight:600;color:var(--accent)">${r.l}</td>
              <td style="${tdP};font-size:11px;color:#64748b;font-style:italic;line-height:1.5">${r.rif}</td>
              ${r.ids.map(id=>`<td style="${tdP};text-align:center">${inp(id)}</td>`).join('')}
            </tr>`).join('')}</tbody>
          </table>
        </div></div>`;
      } else if(sec.sec.includes('Termografo')){
        // Tabella CQ_FBI: 4 ripiani × 6 colonne (Nome | Impostata | Indicata | Termografo | Misurata | Limiti)
        const inp=(id,mode='decimal')=>`<input type="text" id="${id}" inputmode="${mode}" style="width:100%;box-sizing:border-box;text-align:center;font-size:12px;border-radius:5px;padding:3px 2px;border:1.5px solid var(--border2)">`;
        const thH=`text-align:center;font-size:11px;font-weight:700;color:#1a3a6b;padding:4px 4px 8px`;
        const tdC=`padding:3px 4px`;
        const rows=[];for(let i=0;i<sec.fields.length;i+=6)rows.push(sec.fields.slice(i,i+6));
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div style="padding:0 10px 12px;overflow-x:auto">
          <table style="border-collapse:collapse;width:100%;min-width:420px">
            <colgroup><col style="width:18%"><col><col><col><col><col></colgroup>
            <thead><tr><th style="${thH}">Temperatura</th><th style="${thH}">Impostata</th><th style="${thH}">Indicata</th><th style="${thH}">Indicata Termografo</th><th style="${thH}">Misurata</th><th style="${thH}">Limiti</th></tr></thead>
            <tbody>${rows.map(([fl,fi,find,fit,fm,flim],ri)=>`<tr><td style="${tdC}">${inp(fl.id,'text')}</td><td style="${tdC}">${inp(fi.id)}</td><td style="${tdC}">${inp(find.id)}</td><td style="${tdC}">${inp(fit.id)}</td><td style="${tdC}">${inp(fm.id)}</td><td style="${tdC}">${inp(flim.id,'text')}</td></tr>`).join('')}</tbody>
          </table>
        </div></div>`;
      } else if(sec.sec.includes('/ Indicato /') || sec.sec.includes('/ Indicato /')){
        // Tabella generica 3 colonne: Impostato / Indicato / Limite
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:13px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const thH=`text-align:center;font-size:12px;font-weight:700;color:#1a3a6b;padding:4px 8px 8px`;
        const tdL=`padding:4px 4px 4px 0;font-size:13px;white-space:nowrap;text-align:right;width:20%`;
        const tdC=`padding:4px 6px`;
        const rows=[];for(let i=0;i<sec.fields.length;i+=3)rows.push(sec.fields.slice(i,i+3));
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div style="padding:0 14px 12px">
          <table style="border-collapse:collapse;width:100%">
            <colgroup><col style="width:18%"><col><col><col></colgroup>
            <thead><tr><th style="padding:0"></th><th style="${thH}">Impostato</th><th style="${thH}">Indicato</th><th style="${thH}">Limite</th></tr></thead>
            <tbody>${rows.map(([fi,find,flim])=>`<tr><td style="${tdL}">${fi.l.split(' ')[0]}</td><td style="${tdC}">${inp(fi.id)}</td><td style="${tdC}">${inp(find.id)}</td><td style="${tdC}">${inp(flim.id)}</td></tr>`).join('')}</tbody>
          </table>
        </div></div>`;
      } else if(sec.sec.includes('Impostato / Misurato')||sec.sec.includes('Impostata / Misurata')){
        // Tabella generica 2 colonne: Impostato / Misurato
        const colMis=sec.sec.includes('Misurata')?'Misurata':'Misurato';
        const inp=(id)=>`<input type="text" id="${id}" inputmode="decimal" style="width:100%;box-sizing:border-box;text-align:center;font-size:13px;border-radius:5px;padding:4px 2px;border:1.5px solid var(--border2)">`;
        const thH=`text-align:center;font-size:12px;font-weight:700;color:#1a3a6b;padding:4px 8px 8px`;
        const tdL=`padding:4px 4px 4px 0;font-size:13px;white-space:nowrap;text-align:right;width:20%`;
        const tdC=`padding:4px 6px`;
        const rows=[];for(let i=0;i<sec.fields.length;i+=2)rows.push(sec.fields.slice(i,i+2));
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div style="padding:0 14px 12px">
          <table style="border-collapse:collapse;width:100%">
            <colgroup><col style="width:20%"><col><col></colgroup>
            <thead><tr><th style="padding:0"></th><th style="${thH}">Impostato</th><th style="${thH}">${colMis}</th></tr></thead>
            <tbody>${rows.map(([fi,fm])=>`<tr><td style="${tdL}">${fi.l.split(' ')[0]}</td><td style="${tdC}">${inp(fi.id)}</td><td style="${tdC}">${inp(fm.id)}</td></tr>`).join('')}</tbody>
          </table>
        </div></div>`;
      } else {
        html+=`<div class="sec" style="margin-bottom:10px"><div class="sec-hdr">${sec.sec}</div><div class="sec-body" style="grid-template-columns:repeat(auto-fill,minmax(160px,1fr))">${sec.fields.map(f=>`<div class="field"><label>${f.l}</label><input type="text" id="${f.id}" inputmode="decimal"></div>`).join('')}</div></div>`;
      }
    });
    provaDiv.innerHTML=html;
    provaDiv.style.display='block';
  } else {
    provaDiv.innerHTML=''; provaDiv.style.display='none';
  }
}

function fillCQPreset(cod,type){
  const pkey='PRESET_'+type;
  if(!PRESETS||!PRESETS[pkey]) return;
  const preset=PRESETS[pkey][cod];
  if(!preset) return;
  (CQ_VIS[type]||[]).forEach(p=>{
    const pid=p.replace('.','_');
    const val=preset[`cq_vis_${pid}_ok`]?'OK':preset[`cq_vis_${pid}_ko`]?'KO':preset[`cq_vis_${pid}_na`]?'NA':null;
    if(val) setCQ(pid,val);
  });
  (CQ_PROVA[type]||[]).forEach(sec=>sec.fields.forEach(f=>{
    if(preset[f.id]){if(f.type==='rb'){sr('rg-'+f.id,preset[f.id]);const hid=document.getElementById(f.id);if(hid)hid.value=preset[f.id];}else{const el=document.getElementById(f.id);if(el)el.value=preset[f.id];}}
  }));
  sv('cq-strum',preset['cq_strum']||'');
  sv('cq-strum-mod',preset['cq_strum_mod']||'');
  sv('cq-strum-ser',preset['cq_strum_ser']||'');
  sv('cq-strum-cert',preset['cq_strum_cert']||'');
  sv('cq-strum-scad',preset['cq_strum_scad']||'');
  sv('cq-tecnico',preset['cq_tecnico']||gv('cq-tecnico'));
  if(preset['cq_note']) sv('cq-note',preset['cq_note']);
}

function toggleCQ(pid){const b=document.getElementById('cq-btns-'+pid);if(b)b.style.display=b.style.display==='none'?'flex':'none';}

function setCQ(pid,val){
  const cq=cqStateGet(); cq[pid]=val;
  const s=document.getElementById('cq-stato-'+pid);
  s.textContent=val; s.className='mp-stato '+(val==='OK'?'ok':val==='KO'?'ko':'na');
  const h=document.querySelector('#cq-p-'+pid+' .mp-point-hdr');
  if(h) h.style.background=val==='OK'?'var(--info-bg)':val==='KO'?'var(--ko-bg)':'var(--bg2)';
  document.querySelectorAll('#cq-btns-'+pid+' .mp-btn').forEach(b=>b.classList.toggle('sel',b.textContent===val));
  document.getElementById('cq-btns-'+pid).style.display='none';
  document.getElementById('cq-count').textContent=Object.keys(cq).length;
  uP();
}

function fillCQHeader(d){
  const t=(useDataUltimaVerifica&&d.data_ultima_cq)||currentSessionDate||new Date().toISOString().split('T')[0];
  sv('cq-codice',d.c); sv('cq-data',t); sv('cq-note','-');
  sv('cq-data2',t); sv('cq-tecnico',d.ver||'');
}

function resetCQ(){
  store.set('form.cq', {}); store.set('form.cqType', null);
  const c=document.getElementById('cq-count'); if(c) c.textContent='0';
  document.querySelectorAll('[id^="cq-p-"]').forEach(el=>{
    const pid=el.id.replace('cq-p-','');
    const s=document.getElementById('cq-stato-'+pid); if(s){s.textContent='—';s.className='mp-stato';}
    const h=el.querySelector('.mp-point-hdr'); if(h) h.style.background='';
    const b=document.getElementById('cq-btns-'+pid); if(b){b.style.display='none';b.querySelectorAll('.mp-btn').forEach(x=>x.classList.remove('sel'));}
  });
  const p=document.getElementById('cq-prova'); if(p){p.innerHTML='';p.style.display='none';}
}

function collectCQ(){
  const cqType=cqTypeGet(); if(!cqType) return null;
  const cqState=cqStateGet();
  const t=new Date().toISOString().split('T')[0];
  const rec={cq_type:cqType,cq_codice:gv('cq-codice'),cq_data:gv('cq-data')||t,
    cq_note:gv('cq-note'),cq_tecnico:gv('cq-tecnico'),cq_data2:gv('cq-data2')||t,
    cq_strum:gv('cq-strum'),cq_strum_mod:gv('cq-strum-mod'),
    cq_strum_ser:gv('cq-strum-ser'),cq_strum_cert:gv('cq-strum-cert'),cq_strum_scad:gv('cq-strum-scad')};
  (CQ_VIS[cqType]||[]).forEach(p=>{const pid=p.replace('.','_');rec['cq_vis_'+pid]=cqState[pid]||'';});
  (CQ_PROVA[cqType]||[]).forEach(sec=>sec.fields.forEach(f=>{rec[f.id]=gv(f.id)||'';}));
  return rec;
}

function loadCQSaved(rec){
  if(!rec||!rec.cq_type) return;
  buildCQPoints(rec.cq_type);
  const _cCq=curGet();const _dCq=(useDataUltimaVerifica&&_cCq&&DB[_cCq.c]?.data_ultima_cq)||null;
  sv('cq-data',_dCq||currentSessionDate||rec.cq_data||''); sv('cq-note',rec.cq_note||'-');
  sv('cq-tecnico',rec.cq_tecnico||''); sv('cq-data2',rec.cq_data2||'');
  sv('cq-strum',rec.cq_strum||''); sv('cq-strum-mod',rec.cq_strum_mod||'');
  sv('cq-strum-ser',rec.cq_strum_ser||''); sv('cq-strum-cert',rec.cq_strum_cert||'');
  sv('cq-strum-scad',rec.cq_strum_scad||'');
  (CQ_VIS[rec.cq_type]||[]).forEach(p=>{const pid=p.replace('.','_');if(rec['cq_vis_'+pid])setCQ(pid,rec['cq_vis_'+pid]);});
  (CQ_PROVA[rec.cq_type]||[]).forEach(sec=>sec.fields.forEach(f=>{if(f.type==='rb'){sr('rg-'+f.id,rec[f.id]||'');const hid=document.getElementById(f.id);if(hid)hid.value=rec[f.id]||'';}else{const el=document.getElementById(f.id);if(el&&rec[f.id])el.value=rec[f.id];}}));
}


function fillVSPPreset(cod,type){
  const pkey='PRESET_'+type;
  if(!PRESETS||!PRESETS[pkey]) return;
  const preset=PRESETS[pkey][cod];
  if(!preset) return;
  const pts=VSP_POINTS[type]||[];
  pts.forEach(p=>{
    const l=p.l;
    const opts=p.opts||['OK','KO','NA'];
    const val=opts.find(o=>preset['vsp_'+l+'_'+o.toLowerCase()]||preset['vsp_'+l]===o);
    // For simple OK/KO/NA: check vsp_A_ok, vsp_A_ko, vsp_A_na
    let found=null;
    if(preset['vsp_'+l+'_ok']) found='OK';
    else if(preset['vsp_'+l+'_ko']) found='KO';
    else if(preset['vsp_'+l+'_na']) found='NA';
    else if(preset['vsp_'+l+'_b']) found='B';
    else if(preset['vsp_'+l+'_bf']) found='BF';
    else if(preset['vsp_'+l+'_cf']) found='CF';
    if(found) setVSP(l,found);
  });
  const extra=VSP_EXTRA[type];
  if(extra) extra.forEach(sec=>sec.fields.forEach(f=>{
    if(preset[f.id]){if(f.type==='rb'){sr('rg-'+f.id,preset[f.id]);const hid=document.getElementById(f.id);if(hid)hid.value=preset[f.id];}else{const el=document.getElementById(f.id);if(el)el.value=preset[f.id];}}
  }));
  sv('vsp-tecnico',preset['vsp_tecnico']||gv('vsp-tecnico'));
}

function fillMPPreset(cod){
  if(!PRESETS||!PRESETS['PRESET_MP']) return;
  const preset=PRESETS['PRESET_MP'][cod];
  if(!preset) return;
  for(let n=1;n<=19;n++){
    const val=preset['mp'+n+'_ok']?'OK':preset['mp'+n+'_ko']?'KO':preset['mp'+n+'_na']?'NA':null;
    if(val) setMP(n,val);
  }
  if(preset['mp_tecnico']) sv('mp-tecnico',preset['mp_tecnico']);
}

function fillVSEPreset(cod){
  if(!PRESETS||!PRESETS['PRESET_VSE']) return;
  const p=PRESETS['PRESET_VSE'][cod];
  if(!p) return;
  // Input fields
  const inputs=['ten','frq','pot','mar','fud','fur','spi','msp','pdc','nag','tms','cor','trm','pnm','pim','pbm','ibm','pcm','icm','mot','str','nrs','ver','vrc','sct'];
  inputs.forEach(f=>{
    if(!p[f]) return;
    const v = f==='sct' ? p[f].toString().split(' ')[0] : p[f];
    sv('f-'+f, v);
  });
  // Radio button fields
  const radios=['tdp','fdp','pdp','cls','cdp','fnz','def','smo','cav','icv','isp','int','icn','prc','icd','mus','mse','clm','vt','vd'];
  radios.forEach(f=>{if(p[f]) sr('rg-'+f,p[f]);});
  if(p['pat']) sr('rg-pa',p['pat']);
  if(p['pad']) sr('rg-padp',p['pad']);
  // Special: classe e PA aggiornano le misurazioni
  if(p['cls']||p['pat']) uM();
  // Special: giudizio
  if(p['giu']) sG(p['giu']);
}
// ── SUPABASE AUTH ──────────────────────────────────────────

// chiamata iniziale — DOM già pronto
buildMPPoints();
