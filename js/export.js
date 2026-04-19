// ── EXPORT: XLSX, schede singole, ODL, cloud, archivio ──

function applyPageSetup(ws){
  ws['!pageSetup']={paperSize:9,orientation:'landscape',fitToPage:true,fitToWidth:1,fitToHeight:0};
  ws['!printOptions']={fitToPage:true};
  ws['!margins']={left:0.5,right:0.5,top:0.75,bottom:0.75,header:0.3,footer:0.3};
}
function exportXLSX(){
  const keys=Object.keys(saved);if(!keys.length){toast('Nessun dato','warn');return;}
  if(typeof XLSX==='undefined'){
    toast('Caricamento libreria Excel...','warn');
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload=()=>exportXLSX();document.head.appendChild(s);return;
  }
  const wb=XLSX.utils.book_new();
  const date=new Date().toISOString().split('T')[0];

  // ── VSE (60 col, 1 header row) ──
  // Col 53 = "Colonna vuota": '' in FVSE aligns str→54, nrs→55, ver→56, dat2→57, vrc→58, sct→59
  const HVSE=['CODICE','DATA','NOTE','Tensione','Tensione D/P','Frequenza','Frequenza D/P','Potenza','Potenza D/P','Marchio Conformita','Fusibili Dichiarati','Fusibili Riscontrati','Classe','Classe D/P','PA Tipo','Tipo D/P','Funzionamento','Protezione Defibrillatore','Tipo Spina','Smontabile/pressofusa','Marchio Spina','Cavo Alimentazione','IntegritaCavo','Integrita Spina','InterruttoreRete','ParteApplicata','IntegritaConnettori','ProtezioneConduttori','IntegritaConduttori','Manuale Uso','Manuale Servizio','Note Aggiuntive','ClasseMisura','Tensione2','CorrenteAssorbitaMA','TerraProtezioneLimite','TerraProtezioneMisurata','PN Limite','PN Misurata','PI Limite','PI Misurata','PN BF Limite','PN BF Misurata','PI BF Limite','PI BF Misurata','PN CF Limite','PN CF Misurata','PI CF Limite','PI CF Misurata','Giudizio','ValoriMessaTerra','ValoriDispersione','MotiviNonConformita','Colonna vuota','Strumento','NrSerie','Verificatore','Data','VERIFICATO','Scadenza Taratura'];
  const FVSE=['codice','data','note','ten','tdp','frq','fdp','pot','pdp','mar','fud','fur','cls','cdp','pat','pad','fnz','def','spi','smo','msp','cav','icv','isp','int','pdc','icn','prc','icd','mus','mse','nag','clm','tms','cor','trl','trm','pnl','pnm','pil','pim','pbl','pbm','ibl','ibm','pcl','pcm','icl','icm','giu','vt','vd','mot','','str','nrs','ver','dat2','vrc','sct'];
  const NUMERIC_VSE=new Set([33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49]);
  const vseKeys=keys.filter(k=>saved[k].vse_saved);
  if(vseKeys.length){
    const rows=vseKeys.map(k=>{const r=saved[k];return FVSE.map((f,i)=>{const v=f?r[f]||'':'';if(NUMERIC_VSE.has(i)&&v!==''){const n=parseFloat(v);return isNaN(n)?v:n;}return v;});});
    const ws=XLSX.utils.aoa_to_sheet([HVSE,...rows]);
    ws['!cols']=HVSE.map(()=>({wch:16}));
    applyPageSetup(ws);
    XLSX.utils.book_append_sheet(wb,ws,'Inserimento_VSE');
  }

  // ── MP (61 col, 2 header rows, tecnico col 60) ──
  const mpKeys=keys.filter(k=>saved[k].mp_saved);
  if(mpKeys.length){
    /** @type {any[]} */
    const R1=['CODICE','DATA','NOTE'];
    for(let i=1;i<=19;i++){R1.push(i,null,null);}
    R1.push('Tecnico Esecutore');
    const R2=[null,null,null];
    for(let i=1;i<=19;i++){R2.push('OK','KO','NA');}
    R2.push(null);
    const rows=mpKeys.map(k=>{
      const r=saved[k];
      const row=[r.codice||'',r.mp_data||'',r.mp_note||''];
      for(let i=1;i<=19;i++){
        const v=r['mp'+i]||'';
        row.push(v==='OK'?'X':null,v==='KO'?'X':null,v==='NA'?'X':null);
      }
      row.push(r.mp_tecnico||'');
      return row;
    });
    const ws=XLSX.utils.aoa_to_sheet([R1,R2,...rows]);
    const cols=[{wch:10},{wch:12},{wch:20}];
    for(let i=0;i<19;i++)cols.push({wch:5},{wch:5},{wch:5});
    cols.push({wch:20});
    ws['!cols']=cols;
    applyPageSetup(ws);
    XLSX.utils.book_append_sheet(wb,ws,'Inserimento_MP');
  }

  // ── VSP (3 header rows) ──
  const vspTypes=[...new Set(keys.filter(k=>saved[k].vsp_saved).map(k=>saved[k].vsp_type).filter(Boolean))];
  vspTypes.forEach(vtype=>{
    const def=VSP_POINTS[vtype];if(!def)return;
    const vspKeys=keys.filter(k=>saved[k].vsp_saved&&saved[k].vsp_type===vtype);
    if(!vspKeys.length)return;
    let R1,R2,R3,rows;

    if(vtype==='VSP_DEF'){
      // 107 cols: checkboxes col 3-49, extra col 50-95, tecnico col 96, esiti col 97-106
      const NC=107;
      R1=Array(NC).fill(null);R2=Array(NC).fill(null);R3=Array(NC).fill(null);
      R1[0]='CODICE';R1[1]='DATA';R1[2]='NOTE';R1[3]='2 Controlli visivi';
      R1[50]='3 Energia erogata';R1[64]='4 Tempi carica';R1[79]='5 Tempi ritardo';
      R1[91]='8 Strumentazione';R1[96]='TECNICO ESECUTORE';R1[97]='Esiti';R1[100]='5 Tempi ritardo esiti';R1[104]='6 Raccomandazioni';
      let ci=3;def.forEach(p=>{R2[ci]=p.l;ci+=p.opts.length;});
      ['E1i','E1m','E2i','E2m','E3i','E3m','E4i','E4m','E5i','E5m'].forEach((v,i)=>R3[50+i]=v);
      R2[60]='DAE';R3[60]='Mis';
      ['A-r','A-b','A-M','B-r','B-b','B-M','C-r','C-b','C-M','D-r','D-b','D-M'].forEach((v,i)=>R3[64+i]=v);
      R2[79]='A';R3[79]='Ril';R3[80]='Max';R2[83]='B';R3[83]='Ril';R3[84]='Max';R2[87]='C';R3[87]='Ril';R3[88]='Max';
      ['Strum','Mod','Serie','Cert','Scad'].forEach((v,i)=>R2[91+i]=v);
      [['E-esito',97],['TC-AB-NA',98],['TC-CD-NA',99],['TC-OK',100],['TR-A-esito',101],['TR-B-esito',102],['TR-C-esito',103],['Rac-A',104],['Rac-B',105],['Rac-C',106]].forEach(([v,c])=>R2[c]=v);
      ci=3;def.forEach(p=>{p.opts.forEach(o=>{R3[ci++]=o;});});
      rows=vspKeys.map(k=>{
        const r=saved[k];const row=Array(NC).fill(null);
        row[0]=r.vsp_codice||'';row[1]=r.vsp_data||'';row[2]=r.vsp_note||'';
        let ci2=3;def.forEach(p=>{const val=r['vsp_'+p.l]||'';p.opts.forEach(o=>{row[ci2++]=(val===o?'X':null);});});
        ['def_e1i','def_e1m','def_e2i','def_e2m','def_e3i','def_e3m','def_e4i','def_e4m','def_e5i','def_e5m'].forEach((f,i)=>{const v=r[f];if(v)row[50+i]=v;});
        if(r['def_dae_mis'])row[60]=r['def_dae_mis'];
        ['def_tc_ar','def_tc_ab','def_tc_am','def_tc_br','def_tc_bb','def_tc_bm','def_tc_cr','def_tc_cb','def_tc_cm','def_tc_dr','def_tc_db','def_tc_dm'].forEach((f,i)=>{const v=r[f];if(v)row[64+i]=v;});
        [['def_tr_ar',79],['def_tr_am',80],['def_tr_br',83],['def_tr_bm',84],['def_tr_cr',87],['def_tr_cm',88]].forEach(([f,c])=>{const v=r[f];if(v)row[c]=v;});
        ['def_strum','def_mod','def_ser','def_cert','def_scad'].forEach((f,i)=>{const v=r[f];if(v)row[91+i]=v;});
        row[96]=r.vsp_tecnico||'';
        [['def_e_esito',97],['def_tc_ab_na',98],['def_tc_cd_na',99],['def_tc_ok',100],['def_tr_a_esito',101],['def_tr_b_esito',102],['def_tr_c_esito',103],['def_rac_a',104],['def_rac_b',105],['def_rac_c',106]].forEach(([f,c])=>{const v=r[f];if(v)row[c]=v;});
        return row;
      });
    } else if(vtype==='VSP_ELB'){
      // 106 cols: targa col 3-17, checkboxes col 18-35, corrente col 36-55, strum col 100-104, tecnico col 105
      const NC=113;
      const RC_FIELDS_ELB=['elb_rc_t_ni','elb_rc_t_nm','elb_rc_t_q1i','elb_rc_t_q1m','elb_rc_t_q2i','elb_rc_t_q2m','elb_rc_t_q3i','elb_rc_t_q3m','elb_rc_t_mxi','elb_rc_t_mxm','elb_rc_m_ni','elb_rc_m_nm','elb_rc_m_q1i','elb_rc_m_q1m','elb_rc_m_q2i','elb_rc_m_q2m','elb_rc_m_q3i','elb_rc_m_q3m','elb_rc_m_mxi','elb_rc_m_mxm','elb_rc_c_ni','elb_rc_c_nm','elb_rc_c_q1i','elb_rc_c_q1m','elb_rc_c_q2i','elb_rc_c_q2m','elb_rc_c_q3i','elb_rc_c_q3m','elb_rc_c_mxi','elb_rc_c_mxm','elb_rc_b_ni','elb_rc_b_nm','elb_rc_b_q1i','elb_rc_b_q1m','elb_rc_b_q2i','elb_rc_b_q2m','elb_rc_b_q3i','elb_rc_b_q3m','elb_rc_b_mxi','elb_rc_b_mxm'];
      R1=Array(NC).fill(null);R2=Array(NC).fill(null);R3=Array(NC).fill(null);
      R1[0]='CODICE';R1[1]='DATA';R1[2]='NOTE';R1[3]='1 Dati di targa';R1[18]='3 Controlli visivi';
      R1[36]='4 Corrente disp.';R1[56]='5 Esiti';R1[58]='6 Controlli norme';R1[64]='7 Erogazione';R1[67]='8 Tolleranza uscita';R1[107]='9 Strumentazione';R1[112]='TECNICO ESECUTORE';
      [['Pbip',3],['Cbip',4],['fHz-bip',5],['fKHz-bip',6],['fMHz-bip',7],['Pmono',8],['Cmono',9],['fHz-mono',10],['fKHz-mono',11],['fMHz-mono',12],['PA',15],['PdT-Esito',16]].forEach(([v,c])=>R2[c]=v);
      let ci=18;def.forEach(p=>{R2[ci]=p.l;R3[ci]='OK';R3[ci+1]='KO';R3[ci+2]='NA';ci+=3;});
      [['T',36],['M',37],['C',38],['T',39],['M',40],['C',41],['T',42],['M',43],['C',44],['T',46],['M',47],['C',48]].forEach(([v,c])=>R3[c]=v);
      ['Carico-el.','','','Att/terra','','','El.neutro','','','','El.attivo','',''].forEach((v,i)=>R2[36+i]=v);
      ['E1-CN','E2-CN','E1-MT','E2-MT'].forEach((v,i)=>R2[52+i]=v);
      [['HF-esito',56],['Bip-esito',57],['VP1',58],['VP2',59],['VP3',60],['VP4',61],['VP5',62],['VP6',63],['ER1',64],['ER2',65],['ER3',66]].forEach(([v,c])=>R2[c]=v);
      RC_FIELDS_ELB.forEach((f,i)=>R2[67+i]=f.replace('elb_rc_','').replace(/_/g,'-'));
      ['Strum','Mod','Serie','Cert','Scad'].forEach((v,i)=>R2[107+i]=v);
      rows=vspKeys.map(k=>{
        const r=saved[k];const row=Array(NC).fill(null);
        row[0]=r.vsp_codice||'';row[1]=r.vsp_data||'';row[2]=r.vsp_note||'';
        [['elb_pbip',3],['elb_cbip',4],['elb_fhz',5],['elb_fkhz',6],['elb_fmhz',7],['elb_pmono',8],['elb_cmono',9],['elb_fhz2',10],['elb_fkhz2',11],['elb_fmhz2',12],['elb_pa',15],['elb_pdt',16]].forEach(([f,c])=>{const v=r[f];if(v)row[c]=v;});
        let ci2=18;def.forEach(p=>{const val=r['vsp_'+p.l]||'';p.opts.forEach(o=>{row[ci2++]=(val===o?'X':null);});});
        [['elb_ct_t',36],['elb_ct_m',37],['elb_ct_c',38],['elb_at_t',39],['elb_at_m',40],['elb_at_c',41],['elb_en_t',42],['elb_en_m',43],['elb_en_c',44],['elb_ea_t',46],['elb_ea_m',47],['elb_ea_c',48],['elb_iso1n',52],['elb_iso1t',53],['elb_iso2n',54],['elb_iso2t',55]].forEach(([f,c])=>{const v=r[f];if(v)row[c]=v;});
        [['elb_hf_esito',56],['elb_bip_esito',57],['elb_vp1',58],['elb_vp2',59],['elb_vp3',60],['elb_vp4',61],['elb_vp5',62],['elb_vp6',63],['elb_er1',64],['elb_er2',65],['elb_er3',66]].forEach(([f,c])=>{const v=r[f];if(v)row[c]=v;});
        RC_FIELDS_ELB.forEach((f,i)=>{const v=r[f];if(v)row[67+i]=v;});
        ['elb_strum','elb_mod','elb_ser','elb_cert','elb_scad'].forEach((f,i)=>{const v=r[f];if(v)row[107+i]=v;});
        row[112]=r.vsp_tecnico||'';return row;
      });
    } else {
      // CEN (19 col) and ECG (17 col): 3 header rows, checkboxes from col 3, tecnico last
      const chkCols=def.reduce((s,p)=>s+p.opts.length,0);
      R1=['CODICE','DATA','NOTE','CONTROLLO VISIVO',...Array(chkCols-1).fill(null),'TECNICO ESECUTORE'];
      R2=[null,null,null];R3=[null,null,null];
      def.forEach(p=>{R2.push(p.l,...Array(p.opts.length-1).fill(null));R3.push(...p.opts);});
      R2.push(null);R3.push(null);
      rows=vspKeys.map(k=>{
        const r=saved[k];
        const row=[r.vsp_codice||'',r.vsp_data||'',r.vsp_note||''];
        def.forEach(p=>{const val=r['vsp_'+p.l]||'';p.opts.forEach(o=>row.push(val===o?'X':null));});
        row.push(r.vsp_tecnico||'');return row;
      });
    }
    const wsVsp=XLSX.utils.aoa_to_sheet([R1,R2,R3,...rows]);
    applyPageSetup(wsVsp);
    XLSX.utils.book_append_sheet(wb,wsVsp,'Inserimento_VSP_'+vtype.replace('VSP_',''));
  });

  // ── CQ (3 header rows, tecnico last, strum before tecnico) ──
  // Per-type prova field→column mappings (mirror of importPresetsFromExcel)
  const _CPMAP={
    'CQ_DEF':[['cq_def_tipo_man',3],['cq_def_tipo_dae',4],['cq_def_opt_pac',5],['cq_def_opt_nibp',6],['cq_def_opt_spo2',7],
              ['cq_def_e1i',29],['cq_def_e1m',30],['cq_def_e2i',33],['cq_def_e2m',34],['cq_def_e3i',37],['cq_def_e3m',38],
              ['cq_def_e4i',41],['cq_def_e4m',42],['cq_def_e5i',45],['cq_def_e5m',46],['cq_def_e6i',49],['cq_def_e6m',50]],
    'CQ_ECG':[['cq_ecg_v1i',24],['cq_ecg_v1ind',25],['cq_ecg_v1lim',26],['cq_ecg_v2i',29],['cq_ecg_v2ind',30],['cq_ecg_v2lim',31],
              ['cq_ecg_v3i',34],['cq_ecg_v3ind',35],['cq_ecg_v3lim',36],['cq_ecg_v4i',39],['cq_ecg_v4ind',40],['cq_ecg_v4lim',41],
              ['cq_ecg_v5i',44],['cq_ecg_v5ind',45],['cq_ecg_v5lim',46]],
    'CQ_CEN':[['cq_cen_g1i',18],['cq_cen_g1m',19],['cq_cen_g2i',20],['cq_cen_g2m',21],['cq_cen_g3i',22],['cq_cen_g3m',23],
              ['cq_cen_t1i',24],['cq_cen_t1m',25],['cq_cen_t2i',26],['cq_cen_t2m',27],['cq_cen_t3i',28],['cq_cen_t3m',29]],
    'CQ_ELB':[['cq_elb_ct_t',33],['cq_elb_ct_c',34],['cq_elb_at_t',35],['cq_elb_at_c',36],['cq_elb_fn_t',37],['cq_elb_fn_c',38],
              ['cq_elb_en_t',39],['cq_elb_en_c',40],['cq_elb_iso1',44],['cq_elb_iso2',45],
              ['cq_elb_hf_esito',46],['cq_elb_bip_esito',47],
              ['cq_elb_pt1d',49],['cq_elb_pt1r',50],['cq_elb_pc1d',51],['cq_elb_pc1r',52],['cq_elb_pb1d',53],['cq_elb_pb1r',54],
              ['cq_elb_pt2d',55],['cq_elb_pt2r',56],['cq_elb_pc2d',57],['cq_elb_pc2r',58],['cq_elb_pb2d',59],['cq_elb_pb2r',60],
              ['cq_elb_pt3d',61],['cq_elb_pt3r',62],['cq_elb_pc3d',63],['cq_elb_pc3r',64],['cq_elb_pb3d',65],['cq_elb_pb3r',66],
              ['cq_elb_pt4d',67],['cq_elb_pt4r',68],['cq_elb_pc4d',69],['cq_elb_pc4r',70],['cq_elb_pb4d',71],['cq_elb_pb4r',72],
              ['cq_elb_pot_esito',73]],
    'CQ_FBI':[['cq_fbi_r1label',9],['cq_fbi_r1i',10],['cq_fbi_r1ind',11],['cq_fbi_r1it',12],['cq_fbi_r1m',13],['cq_fbi_r1l',14],
              ['cq_fbi_r2label',15],['cq_fbi_r2i',16],['cq_fbi_r2ind',17],['cq_fbi_r2it',18],['cq_fbi_r2m',19],['cq_fbi_r2l',20],
              ['cq_fbi_r3label',21],['cq_fbi_r3i',22],['cq_fbi_r3ind',23],['cq_fbi_r3it',24],['cq_fbi_r3m',25],['cq_fbi_r3l',26],
              ['cq_fbi_r4label',27],['cq_fbi_r4i',28],['cq_fbi_r4ind',29],['cq_fbi_r4it',30],['cq_fbi_r4m',31],['cq_fbi_r4l',32]],
    'CQ_ECT':[['cq_ect_s1',27],['cq_ect_s2',28],['cq_ect_s3',29],['cq_ect_s4',30],
              ['cq_ect_m1s1',31],['cq_ect_m1s2',32],['cq_ect_m1s3',33],['cq_ect_m1s4',34],
              ['cq_ect_m2as1',35],['cq_ect_m2as2',36],['cq_ect_m2as3',37],['cq_ect_m2as4',38],
              ['cq_ect_m2bs1',39],['cq_ect_m2bs2',40],['cq_ect_m2bs3',41],['cq_ect_m2bs4',42],
              ['cq_ect_m3as1',43],['cq_ect_m3as2',44],['cq_ect_m3as3',45],['cq_ect_m3as4',46],
              ['cq_ect_m3bs1',47],['cq_ect_m3bs2',48],['cq_ect_m3bs3',49],['cq_ect_m3bs4',50],
              ['cq_ect_m4as1',51],['cq_ect_m4as2',52],['cq_ect_m4as3',53],['cq_ect_m4as4',54],
              ['cq_ect_m4bs1',55],['cq_ect_m4bs2',56],['cq_ect_m4bs3',57],['cq_ect_m4bs4',58],
              ['cq_ect_m5s1',59],['cq_ect_m5s2',60],['cq_ect_m5s3',61],['cq_ect_m5s4',62],
              ['cq_ect_m6s1',63],['cq_ect_m6s2',64],['cq_ect_m6s3',65],['cq_ect_m6s4',66]],
    'CQ_MON':[['cq_mon_e1i',12],['cq_mon_e1ind',13],['cq_mon_e1lim',14],['cq_mon_e2i',17],['cq_mon_e2ind',18],['cq_mon_e2lim',19],
              ['cq_mon_e3i',22],['cq_mon_e3ind',23],['cq_mon_e3lim',24],['cq_mon_e4i',27],['cq_mon_e4ind',28],['cq_mon_e4lim',29],
              ['cq_mon_e5i',32],['cq_mon_e5ind',33],['cq_mon_e5lim',34],
              ['cq_mon_s1i',37],['cq_mon_s1ind',38],['cq_mon_s1lim',39],['cq_mon_s2i',42],['cq_mon_s2ind',43],['cq_mon_s2lim',44],
              ['cq_mon_s3i',47],['cq_mon_s3ind',48],['cq_mon_s3lim',49],['cq_mon_s4i',52],['cq_mon_s4ind',53],['cq_mon_s4lim',54],
              ['cq_mon_s5i',57],['cq_mon_s5ind',58],['cq_mon_s5lim',59],['cq_mon_s6i',62],['cq_mon_s6ind',63],['cq_mon_s6lim',64],
              ['cq_mon_n1i',67],['cq_mon_n1ind',68],['cq_mon_n1lim',69],['cq_mon_n2i',72],['cq_mon_n2ind',73],['cq_mon_n2lim',74],
              ['cq_mon_n3i',77],['cq_mon_n3ind',78],['cq_mon_n3lim',79]],
    'CQ_ANS':[['cq_ans_comp',15],['cq_ans_res',16],['cq_ans_ie',17],['cq_ans_fri',18],['cq_ans_frv',19],['cq_ans_frm',20],['cq_ans_frl',21],
              ['cq_ans_vii',24],['cq_ans_viv',25],['cq_ans_vim',26],['cq_ans_vil',27]],
    'CQ_SPM':[['cq_spm_v1i',27],['cq_spm_v1m',28],['cq_spm_v2i',29],['cq_spm_v2m',30],['cq_spm_v3i',31],['cq_spm_v3m',32]],
    'CQ_VPO':[['cq_ans_comp',15],['cq_ans_res',16],['cq_ans_ie',17],['cq_ans_fri',18],['cq_ans_frv',19],['cq_ans_frm',20],['cq_ans_frl',21],
              ['cq_ans_vii',24],['cq_ans_viv',25],['cq_ans_vim',26],['cq_ans_vil',27]],
  };
  const _CVC0={'CQ_DEF':8};
  const _CVN={'CQ_ANS':4,'CQ_VPO':4};
  const _CSC={'CQ_DEF':53,'CQ_ECG':49,'CQ_CEN':30,'CQ_ELB':76,'CQ_FBI':33,'CQ_ECT':67,'CQ_MON':82,'CQ_ANS':30,'CQ_SPM':33,'CQ_VPO':30};
  const _CTC={'CQ_DEF':58,'CQ_ECG':54,'CQ_CEN':35,'CQ_ELB':92,'CQ_FBI':38,'CQ_ECT':72,'CQ_MON':87,'CQ_ANS':35,'CQ_SPM':38,'CQ_VPO':35};

  const cqTypes=[...new Set(keys.filter(k=>saved[k].cq_saved).map(k=>saved[k].cq_type).filter(Boolean))];
  cqTypes.forEach(ctype=>{
    const cqKeys=keys.filter(k=>saved[k].cq_saved&&saved[k].cq_type===ctype);
    if(!cqKeys.length)return;
    const c0=_CVC0[ctype]||3;
    const visAll=CQ_VIS[ctype]||[];
    const visPoints=visAll.slice(0,_CVN[ctype]||visAll.length);
    const pmap=_CPMAP[ctype]||[];
    const sc=_CSC[ctype], tc=_CTC[ctype];
    if(tc==null)return;
    const NC=tc+1;
    // Build 3 header rows
    const R1=Array(NC).fill(null),R2=Array(NC).fill(null),R3=Array(NC).fill(null);
    R1[0]='CODICE';R1[1]='DATA';R1[2]='NOTE';
    if(c0>3)R1[3]='TIPOLOGIA';
    R1[c0]='CONTROLLO VISIVO';
    visPoints.forEach((p,idx)=>{const c=c0+idx*3;R2[c]=p;R3[c]='OK';R3[c+1]='KO';R3[c+2]='NA';});
    // Prova column labels from CQ_PROVA
    const provaAll=[];(CQ_PROVA[ctype]||[]).forEach(sec=>sec.fields.forEach(f=>provaAll.push(f)));
    provaAll.forEach(f=>{const pm=pmap.find(([id])=>id===f.id);if(pm)R2[pm[1]]=f.l;});
    if(pmap.length){const fc=Math.min(...pmap.map(([,c])=>c));if(fc>=c0+visPoints.length*3)R1[fc]='PROVA FUNZIONALE';}
    // CQ_DEF: aggiungi headers OK/KO per ogni misura energia (2 colonne vuote dopo impostata/misurata)
    if(ctype==='CQ_DEF'){[1,2,3,4,5,6].forEach(n=>{const b=29+(n-1)*4;R2[b+2]='OK';R2[b+3]='KO';});}
    if(sc!=null){R1[sc]='STRUMENTAZIONE';['Strumento','Modello','Serie','Certificato N.','Scadenza'].forEach((v,i)=>R2[sc+i]=v);}
    R1[tc]='TECNICO ESECUTORE';
    // Build data rows
    const rows=cqKeys.map(k=>{
      const r=saved[k];const row=Array(NC).fill(null);
      row[0]=r.cq_codice||'';row[1]=r.cq_data||'';row[2]=r.cq_note||'';
      visPoints.forEach((p,idx)=>{
        const pid=p.replace('.','_'),c=c0+idx*3,val=r['cq_vis_'+pid]||'';
        row[c]=(val==='OK'?'X':null);row[c+1]=(val==='KO'?'X':null);row[c+2]=(val==='NA'?'X':null);
      });
      pmap.forEach(([f,c])=>{const v=r[f];if(v!=null&&v!=='')row[c]=v;});
      // CQ_DEF: esiti energia erogata (OK→X / KO→X nelle 2 colonne dopo impostata/misurata)
      if(ctype==='CQ_DEF'){[1,2,3,4,5,6].forEach(n=>{const b=29+(n-1)*4,ev=r['cq_def_e'+n+'_esito']||'';row[b+2]=(ev==='OK'?'X':null);row[b+3]=(ev==='KO'?'X':null);});}
      if(sc!=null){['cq_strum','cq_strum_mod','cq_strum_ser','cq_strum_cert','cq_strum_scad'].forEach((f,i)=>{const v=r[f];if(v)row[sc+i]=v;});}
      row[tc]=r.cq_tecnico||'';
      return row;
    });
    const ws=XLSX.utils.aoa_to_sheet([R1,R2,R3,...rows]);
    ws['!cols']=Array(NC).fill({wch:14});
    applyPageSetup(ws);
    XLSX.utils.book_append_sheet(wb,ws,'Inserimento_'+ctype);
  });

  XLSX.writeFile(wb,'AppWitch_'+date+'.xlsx');
  const hasVsp=keys.some(k=>saved[k].vsp_saved), hasCq=keys.some(k=>saved[k].cq_saved);
  toast('Excel scaricato (VSE+MP'+(hasVsp?'+VSP':'')+(hasCq?'+CQ':'')+')','ok');
}


function _openIDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open('AppWitchCache',1);
    r.onupgradeneeded=e=>e.target.result.createObjectStore('blobs');
    r.onsuccess=e=>res(e.target.result);r.onerror=e=>rej(e);
  });
}
async function _idbGet(k){
  const db=await _openIDB();
  return new Promise((res,rej)=>{const t=db.transaction('blobs','readonly');const r=t.objectStore('blobs').get(k);r.onsuccess=e=>res(e.target.result);r.onerror=rej;});
}
async function _idbSet(k,v){
  const db=await _openIDB();
  return new Promise((res,rej)=>{const t=db.transaction('blobs','readwrite');const r=t.objectStore('blobs').put(v,k);r.onsuccess=()=>res();r.onerror=rej;});
}

const _tplCache={};
async function _getTemplate(idbKey,filename){
  if(_tplCache[idbKey])return _tplCache[idbKey];
  _tplCache[idbKey]=await _idbGet(idbKey);
  if(_tplCache[idbKey])return _tplCache[idbKey];
  toast('Scaricamento template '+filename+'...','warn');
  let data;
  try { data = await db.archivio.downloadTemplate(filename); }
  catch (e) { toast('Errore download template: '+(e.message||'sconosciuto'),'warn'); return null; }
  _tplCache[idbKey]=await data.arrayBuffer();
  await _idbSet(idbKey,_tplCache[idbKey]);
  return _tplCache[idbKey];
}
async function resetTemplates(){
  const keys=['tpl_vse','tpl_mp','tpl_vsp_cen','tpl_vsp_def','tpl_vsp_ecg','tpl_vsp_elb',
    'tpl_cq_ans','tpl_cq_cen','tpl_cq_def','tpl_cq_ecg','tpl_cq_ect','tpl_cq_elb','tpl_cq_fbi','tpl_cq_mon','tpl_cq_vpo',
    'tpl_odl'];
  keys.forEach(k=>delete _tplCache[k]);
  try{const db=await _openIDB();const t=db.transaction('blobs','readwrite');keys.forEach(k=>t.objectStore('blobs').delete(k));}catch(e){}
  toast('Cache template rimossa','ok');
}

async function _loadJSZip(){
  if(window.JSZip)return;
  await new Promise((res,rej)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    s.onload=res;s.onerror=rej;document.head.appendChild(s);
  });
}

function _toExcelDate(dateStr){
  if(!dateStr)return 0;
  const d=new Date(dateStr+'T00:00:00');
  return Math.round((d.getTime()-new Date(1899,11,30).getTime())/86400000);
}
function _fmtDD_MM_YY(dateStr){
  if(!dateStr)return '';
  const[y,m,d]=dateStr.split('-');return d+'-'+m+'-'+y.slice(2);
}

// Helper: converte lettere colonna in numero (A=1, Z=26, AA=27, ...)
function _colToNum(col){return col.split('').reduce((n,c)=>n*26+c.charCodeAt(0)-64,0);}

// Modifica celle via string manipulation (evita corruzione namespace XML)
// Gestisce sia celle self-closing (<c r="X" s="1"/>) che celle con chiusura (</c>)
function _patchCell(xml, addr, val, isNum){
  const start=xml.indexOf('<c r="'+addr+'"');
  if(start===-1)return xml;
  // Trova la chiusura del tag di apertura: il primo '>' dopo start
  // Se il carattere precedente è '/' è self-closing, altrimenti ha </c>
  const tagGt=xml.indexOf('>',start);
  const isSelfClosing=(xml[tagGt-1]==='/');
  const end=isSelfClosing ? tagGt+1 : xml.indexOf('</c>',tagGt)+4;
  const cellXml=xml.slice(start,end);
  const sMatch=cellXml.match(/\bs="(\d+)"/);
  const sAttr=sMatch?' s="'+sMatch[1]+'"':'';
  let newCell;
  if(val===''||val===null||val===undefined){
    newCell='<c r="'+addr+'"'+sAttr+'/>';
  }else if(isNum){
    newCell='<c r="'+addr+'"'+sAttr+'><v>'+val+'</v></c>';
  }else{
    const esc=String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    newCell='<c r="'+addr+'"'+sAttr+' t="inlineStr"><is><t>'+esc+'</t></is></c>';
  }
  return xml.slice(0,start)+newCell+xml.slice(end);
}

// _sc: patch cella se esiste, altrimenti inserisce nella riga esistente
function _sc(xml,addr,val,isNum){
  if(val===''||val===null||val===undefined)return xml;
  if(xml.indexOf('<c r="'+addr+'"')!==-1)return _patchCell(xml,addr,val,isNum);
  const m=addr.match(/^([A-Z]+)(\d+)$/);if(!m)return xml;
  const ri=xml.indexOf('<row r="'+m[2]+'"');if(ri===-1)return xml;
  const re=xml.indexOf('</row>',ri);if(re===-1)return xml;
  let nc;
  if(isNum){nc='<c r="'+addr+'"><v>'+val+'</v></c>';}
  else{const e=String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');nc='<c r="'+addr+'" t="inlineStr"><is><t>'+e+'</t></is></c>';}
  return xml.slice(0,re)+nc+xml.slice(re);
}

// _si: come _sc ma crea la riga se non esiste (necessario per celle non presenti nel template)
// Inserisce la cella in posizione ordinata per colonna (evita corruzione xlsx)
function _si(xml,addr,val,isNum){
  if(val===''||val===null||val===undefined)return xml;
  if(xml.indexOf('<c r="'+addr+'"')!==-1)return _patchCell(xml,addr,val,isNum);
  const m=addr.match(/^([A-Z]+)(\d+)$/);if(!m)return xml;
  const rowNum=parseInt(m[2]);
  const targetCol=_colToNum(m[1]);
  let nc;
  if(isNum){nc='<c r="'+addr+'"><v>'+val+'</v></c>';}
  else{const e=String(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');nc='<c r="'+addr+'" t="inlineStr"><is><t>'+e+'</t></is></c>';}
  const ri=xml.indexOf('<row r="'+m[2]+'"');
  if(ri!==-1){
    const re=xml.indexOf('</row>',ri);if(re===-1)return xml;
    // Trova il punto di inserimento ordinato per colonna
    const rowSlice=xml.slice(ri,re);
    const cellRe=/<c r="([A-Z]+)\d+"/g;
    let insertAt=re;
    let cm;
    while((cm=cellRe.exec(rowSlice))!==null){
      if(_colToNum(cm[1])>targetCol){insertAt=ri+cm.index;break;}
    }
    return xml.slice(0,insertAt)+nc+xml.slice(insertAt);
  }
  // Riga non trovata: trova il punto di inserimento corretto (prima della prima riga > rowNum)
  let insertPos=xml.indexOf('</sheetData>');if(insertPos===-1)return xml;
  const rowRe=/<row r="(\d+)"/g;let match;
  while((match=rowRe.exec(xml))!==null){if(parseInt(match[1])>rowNum){insertPos=match.index;break;}}
  return xml.slice(0,insertPos)+'<row r="'+m[2]+'">'+nc+'</row>'+xml.slice(insertPos);
}

function _fillVSSheet(xml,rec,dev){
  const s=(a,v,n)=>{xml=_patchCell(xml,a,v,n);};
  const date=rec.data||new Date().toISOString().slice(0,10);
  const ds=_toExcelDate(date);
  const toN=v=>{const n=parseFloat(v);return isNaN(n)?null:n;};

  s('A10',dev.c);s('K10',dev.n||'');
  s('D13',dev.b||'');s('N13',dev.rep||'');s('D14',dev.m||'');
  s('N14','');s('D15',dev.mat||'');s('N15',dev.loc||'');s('D16','');
  s('E18',rec.ten||'');s('O18',rec.fud||'');s('R18',rec.fur||'');s('E19',rec.frq||'');s('O19',rec.cls||'');
  s('E20',rec.pot||'');s('O20',rec.pat||'');
  s('E21',rec.mar||'');s('K21',rec.def||'');s('Q21',rec.fnz||'');
  s('A25',rec.giu||'POSITIVO');
  s('A32',(rec.trm||'')+'mohm');s('K32',(rec.pnm||'')+'mA');
  s('D47',rec.ver||'');s('Q54',ds,true);s('P63',dev.c);
  s('B67',rec.spi||'');s('K67',rec.msp||'');
  s('E70',rec.cav||'');s('I71',rec.icv||'');
  s('F80',rec.icn||'');s('N80',rec.icd||'');
  s('F81',rec.prc||'');s('N81',rec.pdc||'');
  s('B85',rec.mus||'');s('H85',rec.mse||'');
  s('B89',rec.clm||'');
  const tmsN=toN(rec.tms);if(tmsN!=null)s('K89',tmsN,true);else s('K89',rec.tms||'');
  s('R89',rec.cor||'');
  const trl=toN(rec.trl);if(trl!=null)s('I93',trl,true);
  const trm=toN(rec.trm);if(trm!=null)s('L93',trm,true);
  [['pnl','J99'],['pnm','L99'],['pil','P99'],['pim','R99'],
   ['pbl','J100'],['pbm','L100'],['ibl','P100'],['ibm','R100'],
   ['pcl','J101'],['pcm','L101'],['icl','P101'],['icm','R101']
  ].forEach(([k,a])=>{const n=toN(rec[k]);if(n!=null)s(a,n,true);});
  // P100 (PI BF limite): copia stile di J100 (stesso font/bordi, non centrato)
  {const mJ=xml.match(/<c r="J100" s="(\d+)"/);if(mJ)xml=xml.replace(/(<c r="P100") s="\d+"/,'$1 s="'+mJ[1]+'"');}
  s('D109',rec.str||'');s('L109',rec.nrs||'');
  if(rec.sct){const n=/^\d{4}-\d{2}-\d{2}$/.test(rec.sct)?_toExcelDate(rec.sct):toN(rec.sct);if(n)s('D111',n,true);else s('D111',rec.sct);}
  s('Q115',ds,true);
  return xml;
}

const _MP_ROWS=[21,25,27,30,35,38,41,44,46,49,73,76,78,80,83,85,88,90,92];
function _fillMPSheet(xml,rec,dev,asl){
  const s=(a,v,n)=>{xml=_patchCell(xml,a,v,n);};
  const date=rec.mp_data||new Date().toISOString().slice(0,10);
  const ds=_toExcelDate(date);

  s('N6',dev.c);
  s('D11',(asl||'ASL BENEVENTO').toUpperCase());
  s('D12',dev.rep||'');s('N12',dev.loc||'');
  s('D15',dev.n||'');s('D16',dev.b||'');s('D17',dev.m||'');
  s('N17',dev.mat||'');s('D18','');
  _MP_ROWS.forEach((row,i)=>{
    const val=(rec['mp'+(i+1)]||'').toUpperCase();
    s('R'+row,val==='OK'?'X':'');s('S'+row,val==='KO'?'X':'');s('T'+row,val==='NA'?'X':'');
  });
  s('A102',rec.mp_note||'');s('D113',rec.mp_tecnico||'');s('Q54',ds,true);
  return xml;
}

// ── VSP / CQ FILL FUNCTIONS ──────────────────────────────────
const _VSP_START={VSP_CEN:21,VSP_DEF:21,VSP_ECG:21,VSP_ELB:26};

const _CQ_CK_ROWS={
  CQ_ANS:{'1_1':16,'1_2':18,'1_3':20,'1_4':22},
  CQ_CEN:{'1_1':16,'1_2':18,'1_3':20,'1_4':22,'1_5':24},
  CQ_DEF:{'1_1':20,'1_2':22,'1_3':25,'1_4':27,'1_5':30,'1_6':32,'1_7':34},
  CQ_ECG:{'1_1':16,'1_2':18,'1_3':20,'1_4':22,'1_5':24,'1_6':26,'1_7':28},
  CQ_ECT:{'1_1':17,'1_2':19,'1_3':21,'1_4':23,'1_5':25,'1_6':27,'1_7':29,'1_8':31},
  CQ_ELB:{'1_1':19,'1_2':21,'1_3':23,'1_4':25,'1_5':27,'1_6':29,'1_7':31,'1_8':33,'1_9':35,'1_10':37},
  CQ_FBI:{'1_1':16,'1_2':18},
  CQ_MON:{'1_1':17,'1_2':19,'1_3':21},
  CQ_VPO:{'1_1':16,'1_2':18,'1_3':20,'1_4':22,'1_5':39},
};

function _fillVSPSheet(xml,rec,dev){
  const s=(a,v,n)=>{xml=_sc(xml,a,v,n);};
  const tipo=rec.vsp_type;
  const date=rec.vsp_data||new Date().toISOString().slice(0,10);
  const ds=_toExcelDate(date);

  // Numero inventario → N11 (top-left del merge N11:T11)
  s('N11',dev.c);

  // Checkpoints: colonne R/S/T mappate su opts[] del punto
  const start=_VSP_START[tipo]||21;
  (VSP_POINTS[tipo]||[]).forEach(p=>{
    const row=start+(p.l.charCodeAt(0)-65);
    const val=(rec['vsp_'+p.l]||'').toUpperCase();
    const opts=p.opts||[];
    if(tipo==='VSP_ECG'&&p.l==='D'){
      // 4 opzioni: K/M/O/Q
      s('K'+row,val===opts[0]?'X':'');s('M'+row,val===opts[1]?'X':'');
      s('O'+row,val===opts[2]?'X':'');s('Q'+row,val===opts[3]?'X':'');
    } else if(opts.length===2){
      // 2 opzioni: S=opts[0], T=opts[1], R non usata
      s('S'+row,val===opts[0]?'X':'');s('T'+row,val===opts[1]?'X':'');
    } else {
      // 3 opzioni: R=opts[0], S=opts[1], T=opts[2]
      s('R'+row,val===opts[0]?'X':'');s('S'+row,val===opts[1]?'X':'');s('T'+row,val===opts[2]?'X':'');
    }
  });

  // Date p1 e p2
  if(ds){ s('Q54',ds,true); if(tipo==='VSP_DEF'||tipo==='VSP_ELB') s('Q115',ds,true); }

  // Tecnico
  const tec=rec.vsp_tecnico||'';
  if(tipo==='VSP_DEF') s('D113',tec); else if(tipo==='VSP_ELB') s('B113',tec); else s('D43',tec);

  // Campi extra per DEF
  if(tipo==='VSP_DEF'){
    const r=rec;
    const si=(a,v,n)=>{xml=_si(xml,a,v,n);};
    // 5 energie: F/I/L/O/R righe 69 (impostato) e 70 (misurato)
    ['F','I','L','O','R'].forEach((c,i)=>{s(c+'69',r['def_e'+(i+1)+'i']);s(c+'70',r['def_e'+(i+1)+'m']);});
    s('F72',r.def_dae_mis);
    // Esito energia (R74=NA, S74=OK, T74=KO) — riga assente nel template → _si
    const ee=r.def_e_esito||'';
    si('R74',ee==='NA'?'X':'');si('S74',ee==='OK'?'X':'');si('T74',ee==='KO'?'X':'');
    // Tempi carica
    s('N79',r.def_tc_ar); s('P79',r.def_tc_ab);
    s('N80',r.def_tc_br); s('P80',r.def_tc_bb);
    s('N81',r.def_tc_cr); s('P81',r.def_tc_cb);
    s('N83',r.def_tc_dr); s('P83',r.def_tc_db);
    // Esito tempi carica: N/A A+B→T79, N/A C+D→T81, OK→T85 — colonna T assente → _si
    si('T79',r.def_tc_ab_na==='X'?'X':''); si('T81',r.def_tc_cd_na==='X'?'X':''); si('T85',r.def_tc_ok==='X'?'X':'');
    // Tempi ritardo
    s('O90',r.def_tr_ar); s('Q90',r.def_tr_am);
    s('O91',r.def_tr_br); s('Q91',r.def_tr_bm);
    s('O92',r.def_tr_cr); s('Q92',r.def_tr_cm);
    // Esiti tempi ritardo (S=NA, T=OK)
    const ta=r.def_tr_a_esito||'';s('S90',ta==='NA'?'X':'');s('T90',ta==='OK'?'X':'');
    const tb=r.def_tr_b_esito||'';s('S91',tb==='NA'?'X':'');s('T91',tb==='OK'?'X':'');
    const tc2=r.def_tr_c_esito||'';s('S92',tc2==='NA'?'X':'');s('T92',tc2==='OK'?'X':'');
    s('A105',r.def_strum); s('E105',r.def_mod); s('I105',r.def_ser); s('M105',r.def_cert);
    if(r.def_scad){const nd=/^\d{4}-\d{2}-\d{2}$/.test(r.def_scad)?_toExcelDate(r.def_scad):parseFloat(r.def_scad);if(!isNaN(nd))s('Q105',nd,true);else s('Q105',r.def_scad);}
  }
  // Campi extra per ELB
  if(tipo==='VSP_ELB'){
    const r=rec;
    s('G20',r.elb_pbip); s('K20',r.elb_cbip); s('O20',r.elb_fhz); s('Q20',r.elb_fkhz); s('S20',r.elb_fmhz);
    s('G21',r.elb_pmono); s('K21',r.elb_cmono); s('O21',r.elb_fhz2); s('Q21',r.elb_fkhz2); s('S21',r.elb_fmhz2);
    xml=_patchCell(xml,'K22',r.elb_pa==='T'?'X':'');
    xml=_patchCell(xml,'P22',r.elb_pa==='F'?'X':'');
    xml=_patchCell(xml,'R23',r.elb_pdt==='OK'?'X':'');
    xml=_patchCell(xml,'T23',r.elb_pdt==='KO'?'X':'');
    s('G39',r.elb_ct_t); s('J39',r.elb_ct_m); s('M39',r.elb_ct_c);
    s('G40',r.elb_at_t); s('J40',r.elb_at_m); s('M40',r.elb_at_c);
    s('G41',r.elb_en_t); s('J41',r.elb_en_m); s('M41',r.elb_en_c);
    s('G42',r.elb_ea_t); s('J42',r.elb_ea_m); s('M42',r.elb_ea_c);
    xml=_patchCell(xml,'R44',r.elb_hf_esito==='OK'?'X':'');
    xml=_patchCell(xml,'S44',r.elb_hf_esito==='KO'?'X':'');
    xml=_patchCell(xml,'T44',r.elb_hf_esito==='NA'?'X':'');
    s('K71',r.elb_rc_t_ni); s('L71',r.elb_rc_t_nm); s('M71',r.elb_rc_t_q1i); s('N71',r.elb_rc_t_q1m); s('O71',r.elb_rc_t_q2i); s('P71',r.elb_rc_t_q2m); s('Q71',r.elb_rc_t_q3i); s('R71',r.elb_rc_t_q3m); s('S71',r.elb_rc_t_mxi); s('T71',r.elb_rc_t_mxm);
    s('K72',r.elb_rc_m_ni); s('L72',r.elb_rc_m_nm); s('M72',r.elb_rc_m_q1i); s('N72',r.elb_rc_m_q1m); s('O72',r.elb_rc_m_q2i); s('P72',r.elb_rc_m_q2m); s('Q72',r.elb_rc_m_q3i); s('R72',r.elb_rc_m_q3m); s('S72',r.elb_rc_m_mxi); s('T72',r.elb_rc_m_mxm);
    s('K73',r.elb_rc_c_ni); s('L73',r.elb_rc_c_nm); s('M73',r.elb_rc_c_q1i); s('N73',r.elb_rc_c_q1m); s('O73',r.elb_rc_c_q2i); s('P73',r.elb_rc_c_q2m); s('Q73',r.elb_rc_c_q3i); s('R73',r.elb_rc_c_q3m); s('S73',r.elb_rc_c_mxi); s('T73',r.elb_rc_c_mxm);
    s('K74',r.elb_rc_b_ni); s('L74',r.elb_rc_b_nm); s('M74',r.elb_rc_b_q1i); s('N74',r.elb_rc_b_q1m); s('O74',r.elb_rc_b_q2i); s('P74',r.elb_rc_b_q2m); s('Q74',r.elb_rc_b_q3i); s('R74',r.elb_rc_b_q3m); s('S74',r.elb_rc_b_mxi); s('T74',r.elb_rc_b_mxm);
    xml=_patchCell(xml,'S77',r.elb_er1==='OK'?'X':''); xml=_patchCell(xml,'T77',r.elb_er1==='KO'?'X':'');
    xml=_patchCell(xml,'S78',r.elb_er2==='OK'?'X':''); xml=_patchCell(xml,'T78',r.elb_er2==='KO'?'X':'');
    xml=_patchCell(xml,'S79',r.elb_er3==='OK'?'X':''); xml=_patchCell(xml,'T79',r.elb_er3==='KO'?'X':'');
    xml=_patchCell(xml,'T26',r.elb_vp1==='KO'?'X':'');
    xml=_patchCell(xml,'R27',r.elb_vp2==='NA'?'X':''); xml=_patchCell(xml,'S27',r.elb_vp2==='OK'?'X':''); xml=_patchCell(xml,'T27',r.elb_vp2==='KO'?'X':'');
    xml=_patchCell(xml,'S28',r.elb_vp3==='OK'?'X':''); xml=_patchCell(xml,'T28',r.elb_vp3==='KO'?'X':'');
    xml=_patchCell(xml,'S29',r.elb_vp4==='OK'?'X':''); xml=_patchCell(xml,'T29',r.elb_vp4==='KO'?'X':'');
    xml=_patchCell(xml,'R30',r.elb_vp5==='NA'?'X':''); xml=_patchCell(xml,'S30',r.elb_vp5==='OK'?'X':''); xml=_patchCell(xml,'T30',r.elb_vp5==='KO'?'X':'');
    xml=_patchCell(xml,'S31',r.elb_vp6==='OK'?'X':''); xml=_patchCell(xml,'T31',r.elb_vp6==='KO'?'X':'');
    s('G46',r.elb_iso1n); s('G47',r.elb_iso1t);
    s('L46',r.elb_iso2n); s('L47',r.elb_iso2t);
    xml=_patchCell(xml,'L49',r.elb_bip_esito==='OK'?'X':'');
    xml=_patchCell(xml,'M49',r.elb_bip_esito==='KO'?'X':'');
    xml=_patchCell(xml,'N49',r.elb_bip_esito==='NA'?'X':'');
    s('A110',r.elb_strum); s('E110',r.elb_mod); s('I110',r.elb_ser); s('M110',r.elb_cert);
    if(r.elb_scad){const nd=/^\d{4}-\d{2}-\d{2}$/.test(r.elb_scad)?_toExcelDate(r.elb_scad):parseFloat(r.elb_scad);if(!isNaN(nd))s('Q110',nd,true);else s('Q110',r.elb_scad);}
  }
  return xml;
}

function _fillCQSheet(xml,rec,dev,asl){
  const s=(a,v,n)=>{xml=_sc(xml,a,v,n);};
  const tipo=rec.cq_type;
  const date=rec.cq_data||new Date().toISOString().slice(0,10);
  const ds=_toExcelDate(date);
  const twoPage=['CQ_DEF','CQ_ELB','CQ_ECT','CQ_MON'].includes(tipo);
  const toN=v=>{const n=parseFloat(v);return isNaN(n)?null:n;};

  // Anagrafica
  s('N6',dev.c);
  s('D11',(asl||'ASL BENEVENTO').toUpperCase());
  s('N11',dev.rep||'');
  s('D12',dev.b||'');
  s('D13',dev.m||'');
  s('N13',dev.mat||'');

  // Checkpoints: R=OK, S=KO, T=NA — usa _si perché le celle potrebbero non esistere nel template
  const ckRows=_CQ_CK_ROWS[tipo]||{};
  Object.entries(ckRows).forEach(([pid,row])=>{
    const val=(rec['cq_vis_'+pid]||'').toUpperCase();
    xml=_si(xml,'R'+row,val==='OK'?'X':'');
    xml=_si(xml,'S'+row,val==='KO'?'X':'');
    xml=_si(xml,'T'+row,val==='NA'?'X':'');
  });

  // Date
  if(ds){s('Q54',ds,true);if(twoPage)s('Q115',ds,true);}

  // Tecnico
  const tecRow={CQ_ANS:51,CQ_CEN:51,CQ_DEF:105,CQ_ECG:51,CQ_ECT:112,CQ_ELB:113,CQ_FBI:51,CQ_MON:112,CQ_VPO:51}[tipo]||51;
  s('D'+tecRow,rec.cq_tecnico||'');

  // Strumentazione
  const strRow={CQ_ANS:43,CQ_CEN:43,CQ_DEF:85,CQ_ECG:43,CQ_ECT:104,CQ_ELB:96,CQ_FBI:43,CQ_MON:104,CQ_VPO:43}[tipo]||43;
  s('A'+strRow,rec.cq_strum||''); s('E'+strRow,rec.cq_strum_mod||'');
  s('I'+strRow,rec.cq_strum_ser||''); s('M'+strRow,rec.cq_strum_cert||'');
  if(rec.cq_strum_scad){const nd=/^\d{4}-\d{2}-\d{2}$/.test(rec.cq_strum_scad)?_toExcelDate(rec.cq_strum_scad):toN(rec.cq_strum_scad);if(nd!=null)s('Q'+strRow,nd,true);else s('Q'+strRow,rec.cq_strum_scad);}

  // Misure per tipo
  if(tipo==='CQ_DEF'){
    // Energia erogata: impostata→A(73-78), misurata→I(73-78), esito OK→Q(73-78), KO→S(73-78)
    // Esito usa _si perché Q/S potrebbero non esistere nel template XML
    for(let i=1;i<=6;i++){
      s('A'+(72+i),rec['cq_def_e'+i+'i']||'');
      s('I'+(72+i),rec['cq_def_e'+i+'m']||'');
      const ev=rec['cq_def_e'+i+'_esito']||'';
      xml=_si(xml,'Q'+(72+i),ev==='OK'?'X':'');
      xml=_si(xml,'S'+(72+i),ev==='KO'?'X':'');
    }
    const tm=rec.cq_def_tipo_man,td=rec.cq_def_tipo_dae;
    if(tm)xml=_sc(xml,'K15',tm==='X'?'X':'');
    if(td)xml=_sc(xml,'P15',td==='X'?'X':'');
    const op=rec.cq_def_opt_pac,on=rec.cq_def_opt_nibp,os=rec.cq_def_opt_spo2;
    if(op)xml=_sc(xml,'F18',op==='X'?'X':'');
    if(on)xml=_sc(xml,'K18',on==='X'?'X':'');
    if(os)xml=_sc(xml,'P18',os==='X'?'X':'');
  }
  else if(tipo==='CQ_ECG'){
    for(let i=1;i<=5;i++){s('A'+(35+i),rec['cq_ecg_v'+i+'i']||'');s('G'+(35+i),rec['cq_ecg_v'+i+'ind']||'');s('M'+(35+i),rec['cq_ecg_v'+i+'lim']||'');}
  }
  else if(tipo==='CQ_CEN'){
    for(let i=1;i<=3;i++){s('A'+(33+i),rec['cq_cen_g'+i+'i']||'');s('E'+(33+i),rec['cq_cen_g'+i+'m']||'');s('M'+(33+i),rec['cq_cen_t'+i+'i']||'');s('Q'+(33+i),rec['cq_cen_t'+i+'m']||'');}
  }
  else if(tipo==='CQ_ANS'||tipo==='CQ_VPO'){
    s('E30',rec.cq_ans_comp||''); s('I30',rec.cq_ans_res||''); s('M30',rec.cq_ans_ie||'');
    s('E33',rec.cq_ans_fri||''); s('I33',rec.cq_ans_frv||''); s('M33',rec.cq_ans_frm||''); s('Q33',rec.cq_ans_frl||'');
    xml=_patchCell(xml,'S33',rec.cq_ans_fr_esito==='OK'?'X':'');
    xml=_patchCell(xml,'T33',rec.cq_ans_fr_esito==='KO'?'X':'');
    s('E35',rec.cq_ans_vii||''); s('I35',rec.cq_ans_viv||''); s('M35',rec.cq_ans_vim||''); s('Q35',rec.cq_ans_vil||'');
    xml=_patchCell(xml,'S35',rec.cq_ans_vi_esito==='OK'?'X':'');
    xml=_patchCell(xml,'T35',rec.cq_ans_vi_esito==='KO'?'X':'');
    xml=_si(xml,'S39',rec.cq_ans_esito==='OK'?'X':'');
    xml=_si(xml,'T39',rec.cq_ans_esito==='KO'?'X':'');
  }
  else if(tipo==='CQ_MON'){
    for(let i=1;i<=5;i++){s('A'+(29+i),rec['cq_mon_e'+i+'i']||'');s('G'+(29+i),rec['cq_mon_e'+i+'ind']||'');s('M'+(29+i),rec['cq_mon_e'+i+'lim']||'');}
    // SPO2: s1-s3 = % (A/D/G), s4-s6 = bpm (K/N/Q) su righe 41-43
    for(let i=0;i<3;i++){
      xml=_patchCell(xml,'A'+(41+i),rec['cq_mon_s'+(i+1)+'i']||''); xml=_patchCell(xml,'D'+(41+i),rec['cq_mon_s'+(i+1)+'ind']||''); xml=_patchCell(xml,'G'+(41+i),rec['cq_mon_s'+(i+1)+'lim']||'');
      xml=_patchCell(xml,'K'+(41+i),rec['cq_mon_s'+(i+4)+'i']||''); xml=_patchCell(xml,'N'+(41+i),rec['cq_mon_s'+(i+4)+'ind']||''); xml=_patchCell(xml,'Q'+(41+i),rec['cq_mon_s'+(i+4)+'lim']||'');
    }
    for(let i=1;i<=3;i++){s('A'+(69+i),rec['cq_mon_n'+i+'i']||'');s('G'+(69+i),rec['cq_mon_n'+i+'ind']||'');s('M'+(69+i),rec['cq_mon_n'+i+'lim']||'');}
  }
  else if(tipo==='CQ_FBI'){
    for(let i=1;i<=4;i++){s('A'+(23+i),rec['cq_fbi_r'+i+'label']||'');s('D'+(23+i),rec['cq_fbi_r'+i+'i']||'');s('G'+(23+i),rec['cq_fbi_r'+i+'ind']||'');s('J'+(23+i),rec['cq_fbi_r'+i+'it']||'');s('M'+(23+i),rec['cq_fbi_r'+i+'m']||'');s('Q'+(23+i),rec['cq_fbi_r'+i+'l']||'');}
  }
  else if(tipo==='CQ_ELB'){
    s('E47',rec.cq_elb_ct_t||''); s('I47',rec.cq_elb_at_t||''); s('M47',rec.cq_elb_fn_t||''); s('Q47',rec.cq_elb_en_t||'');
    s('E48',rec.cq_elb_ct_c||''); s('I48',rec.cq_elb_at_c||''); s('M48',rec.cq_elb_fn_c||''); s('Q48',rec.cq_elb_en_c||'');
    xml=_patchCell(xml,'R50',rec.cq_elb_hf_esito==='OK'?'X':'');
    xml=_patchCell(xml,'S50',rec.cq_elb_hf_esito==='KO'?'X':'');
    xml=_patchCell(xml,'T50',rec.cq_elb_hf_esito==='NA'?'X':'');
    s('E72',rec.cq_elb_iso1||''); s('M72',rec.cq_elb_iso2||'');
    xml=_patchCell(xml,'R74',rec.cq_elb_bip_esito==='OK'?'X':'');
    xml=_patchCell(xml,'S74',rec.cq_elb_bip_esito==='KO'?'X':'');
    xml=_patchCell(xml,'T74',rec.cq_elb_bip_esito==='NA'?'X':'');
    s('B79',rec.cq_elb_pt1d||''); s('E79',rec.cq_elb_pt1r||'');
    s('H79',rec.cq_elb_pc1d||''); s('K79',rec.cq_elb_pc1r||'');
    s('N79',rec.cq_elb_pb1d||''); s('R79',rec.cq_elb_pb1r||'');
    s('B80',rec.cq_elb_pt2d||''); s('E80',rec.cq_elb_pt2r||'');
    s('H80',rec.cq_elb_pc2d||''); s('K80',rec.cq_elb_pc2r||'');
    s('N80',rec.cq_elb_pb2d||''); s('R80',rec.cq_elb_pb2r||'');
    s('B81',rec.cq_elb_pt3d||''); s('E81',rec.cq_elb_pt3r||'');
    s('H81',rec.cq_elb_pc3d||''); s('K81',rec.cq_elb_pc3r||'');
    s('N81',rec.cq_elb_pb3d||''); s('R81',rec.cq_elb_pb3r||'');
    s('B82',rec.cq_elb_pt4d||''); s('E82',rec.cq_elb_pt4r||'');
    s('H82',rec.cq_elb_pc4d||''); s('K82',rec.cq_elb_pc4r||'');
    s('N82',rec.cq_elb_pb4d||''); s('R82',rec.cq_elb_pb4r||'');
    xml=_patchCell(xml,'R92',rec.cq_elb_pot_esito==='OK'?'X':'');
    xml=_patchCell(xml,'S92',rec.cq_elb_pot_esito==='KO'?'X':'');
    xml=_patchCell(xml,'T92',rec.cq_elb_pot_esito==='NA'?'X':'');
  }
  else if(tipo==='CQ_ECT'){
    ['s1','s2','s3','s4'].forEach((sk,i)=>{
      const inv=rec['cq_ect_'+sk]||''; const row=42+i;
      s('A'+row,inv);
      const d=DB[inv]; s('G'+row,d?.n||''); s('N'+row,d?.m||'');
    });
    s('M69',rec.cq_ect_m1s1||''); s('O69',rec.cq_ect_m1s2||''); s('Q69',rec.cq_ect_m1s3||''); s('S69',rec.cq_ect_m1s4||'');
    s('M70',rec.cq_ect_m2as1||''); s('O70',rec.cq_ect_m2as2||''); s('Q70',rec.cq_ect_m2as3||''); s('S70',rec.cq_ect_m2as4||'');
    s('M72',rec.cq_ect_m2bs1||''); s('O72',rec.cq_ect_m2bs2||''); s('Q72',rec.cq_ect_m2bs3||''); s('S72',rec.cq_ect_m2bs4||'');
    s('M76',rec.cq_ect_m3as1||''); s('O76',rec.cq_ect_m3as2||''); s('Q76',rec.cq_ect_m3as3||''); s('S76',rec.cq_ect_m3as4||'');
    s('M80',rec.cq_ect_m3bs1||''); s('O80',rec.cq_ect_m3bs2||''); s('Q80',rec.cq_ect_m3bs3||''); s('S80',rec.cq_ect_m3bs4||'');
    s('M82',rec.cq_ect_m4as1||''); s('O82',rec.cq_ect_m4as2||''); s('Q82',rec.cq_ect_m4as3||''); s('S82',rec.cq_ect_m4as4||'');
    s('M86',rec.cq_ect_m4bs1||''); s('O86',rec.cq_ect_m4bs2||''); s('Q86',rec.cq_ect_m4bs3||''); s('S86',rec.cq_ect_m4bs4||'');
    s('M90',rec.cq_ect_m5s1||''); s('O90',rec.cq_ect_m5s2||''); s('Q90',rec.cq_ect_m5s3||''); s('S90',rec.cq_ect_m5s4||'');
    s('M91',rec.cq_ect_m6s1||''); s('O91',rec.cq_ect_m6s2||''); s('Q91',rec.cq_ect_m6s3||''); s('S91',rec.cq_ect_m6s4||'');
  }
  return xml;
}

// Helper: risolve il percorso di un foglio nel template
async function _resolveSheetPath(zip, name){
  const wbXml=await zip.file('xl/workbook.xml').async('string');
  const relsXml=await zip.file('xl/_rels/workbook.xml.rels').async('string');
  const m=wbXml.match(new RegExp('<sheet[^>]+name="'+name+'"[^>]*/?>'));
  if(!m)return null;
  const rid=m[0].match(/r:id="([^"]+)"/)?.[1];if(!rid)return null;
  const rel=relsXml.match(new RegExp('Id="'+rid+'"[^>]+Target="([^"]+)"'));
  return rel?'xl/'+rel[1]:null;
}

// Helper: clona template, compila il foglio indicato, scarica come xlsx
async function _downloadSheetXLSX(buf, cod, tipo, fillFn, fileDate, sheetName='Foglio1', dirHandle=null){
  await _loadJSZip();
  const z=await JSZip.loadAsync(buf);
  const shPath=await _resolveSheetPath(z,sheetName);
  if(!shPath){toast('Foglio '+sheetName+' non trovato nel template','warn');return null;}
  let shXml=fillFn(await z.file(shPath).async('string'));
  if(tipo==='VS'||tipo==='MP'){
    // Stesse impostazioni di VSP/CQ: portrait, scale=90, fitToHeight=2, print area A:T
    shXml=shXml.replace(/<sheetPr[^>]*\/>/g,'');
    shXml=shXml.replace(/<sheetPr[^>]*>[\s\S]*?<\/sheetPr>/g,'');
    shXml=shXml.replace(/(<worksheet[^>]*>)/,'$1<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>');
    shXml=shXml.replace(/<pageSetup[^/]*\/>/g,'');
    shXml=shXml.replace(/<printOptions[^/]*\/>/g,'');
    shXml=shXml.replace(/<pageMargins/,'<printOptions horizontalCentered="1" verticalCentered="1"/><pageMargins');
    shXml=shXml.replace(/<pageMargins[^/]*\/>/,'<pageMargins left="0" right="0" top="0" bottom="0" header="0" footer="0"/>');
    const PS='<pageSetup paperSize="9" scale="90" fitToHeight="2" orientation="portrait"/>';
    if(/<pageMargins/.test(shXml)) shXml=shXml.replace(/(<pageMargins[^/]*\/>)/,'$1'+PS);
    else shXml=shXml.replace('</worksheet>',PS+'</worksheet>');
    const dimM=shXml.match(/<dimension ref="[^:]+:[A-Z]+(\d+)"/);
    const lastRow=dimM?dimM[1]:'200';
    let wbXml=await z.file('xl/workbook.xml').async('string');
    wbXml=wbXml.replace(/<externalReferences>[\s\S]*?<\/externalReferences>/g,'');
    wbXml=wbXml.replace(/<definedNames>[\s\S]*?<\/definedNames>/g,'');
    const DN='<definedNames><definedName name="_xlnm.Print_Area" localSheetId="0">Foglio1!$A$1:$T$'+lastRow+'</definedName></definedNames>';
    if(/<calcPr/.test(wbXml)) wbXml=wbXml.replace(/<calcPr/,DN+'<calcPr');
    else wbXml=wbXml.replace('</workbook>',DN+'</workbook>');
    z.file('xl/workbook.xml',wbXml);
  }
  z.file(shPath, shXml);
  // Rimuovi external links (evita prompt "aggiorna link" in Excel)
  z.remove('xl/externalLinks/externalLink1.xml');
  z.remove('xl/externalLinks/_rels/externalLink1.xml.rels');
  z.remove('xl/calcChain.xml');
  z.remove('xl/vbaProject.bin');
  let ct=await z.file('[Content_Types].xml').async('string');
  ct=ct.replace(/<Override[^>]*externalLink[^>]*\/>/g,'')
       .replace(/<Override[^>]*calcChain[^>]*\/>/g,'')
       .replace(/<Override[^>]*vbaProject[^>]*\/>/g,'')
       .replace('application/vnd.ms-excel.sheet.macroEnabled.main+xml',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
  z.file('[Content_Types].xml',ct);
  let rels=await z.file('xl/_rels/workbook.xml.rels').async('string');
  rels=rels.replace(/<Relationship[^>]*externalLink[^>]*\/>/g,'')
           .replace(/<Relationship[^>]*vbaProject[^>]*\/>/g,'');
  z.file('xl/_rels/workbook.xml.rels',rels);
  const fname=cod+'_'+tipo+'_'+_fmtDD_MM_YY(fileDate)+'.xlsx';
  const blob=await z.generateAsync({type:'blob',compression:'DEFLATE'});
  if (dirHandle) {
    let saved=false;
    for(let attempt=0;attempt<3&&!saved;attempt++){
      try {
        if(attempt>0) await new Promise(r=>setTimeout(r,600));
        const fh=await dirHandle.getFileHandle(fname,{create:true});
        const ws=await fh.createWritable();
        await ws.write(blob);await ws.close();
        saved=true;
      } catch(e) {
        if(attempt===2){
          console.error('Errore salvataggio cartella',e);
          const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fname;a.click();URL.revokeObjectURL(url);
        }
      }
    }
  } else {
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fname;a.click();URL.revokeObjectURL(url);
  }
  return fname;
}

// Come _downloadSheetXLSX ma ritorna {blob, fname} senza scaricare
async function _buildSheetXLSX(buf, cod, tipo, fillFn, fileDate, sheetName='Foglio1'){
  await _loadJSZip();
  const z=await JSZip.loadAsync(buf);
  const shPath=await _resolveSheetPath(z,sheetName);
  if(!shPath) return null;
  let shXml2=fillFn(await z.file(shPath).async('string'));
  if(tipo==='VS'||tipo==='MP'){
    shXml2=shXml2.replace(/<sheetPr[^>]*\/>/g,'');
    shXml2=shXml2.replace(/<sheetPr[^>]*>[\s\S]*?<\/sheetPr>/g,'');
    shXml2=shXml2.replace(/(<worksheet[^>]*>)/,'$1<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>');
    shXml2=shXml2.replace(/<pageSetup[^/]*\/>/g,'');
    shXml2=shXml2.replace(/<printOptions[^/]*\/>/g,'');
    shXml2=shXml2.replace(/<pageMargins/,'<printOptions horizontalCentered="1" verticalCentered="1"/><pageMargins');
    shXml2=shXml2.replace(/<pageMargins[^/]*\/>/,'<pageMargins left="0" right="0" top="0" bottom="0" header="0" footer="0"/>');
    const PS2='<pageSetup paperSize="9" scale="90" fitToHeight="2" orientation="portrait"/>';
    if(/<pageMargins/.test(shXml2)) shXml2=shXml2.replace(/(<pageMargins[^/]*\/>)/,'$1'+PS2);
    else shXml2=shXml2.replace('</worksheet>',PS2+'</worksheet>');
    const dimM2=shXml2.match(/<dimension ref="[^:]+:[A-Z]+(\d+)"/);
    const lastRow2=dimM2?dimM2[1]:'200';
    let wbXml2=await z.file('xl/workbook.xml').async('string');
    wbXml2=wbXml2.replace(/<externalReferences>[\s\S]*?<\/externalReferences>/g,'');
    wbXml2=wbXml2.replace(/<definedNames>[\s\S]*?<\/definedNames>/g,'');
    const DN2='<definedNames><definedName name="_xlnm.Print_Area" localSheetId="0">Foglio1!$A$1:$T$'+lastRow2+'</definedName></definedNames>';
    if(/<calcPr/.test(wbXml2)) wbXml2=wbXml2.replace(/<calcPr/,DN2+'<calcPr');
    else wbXml2=wbXml2.replace('</workbook>',DN2+'</workbook>');
    z.file('xl/workbook.xml',wbXml2);
  }
  z.file(shPath, shXml2);
  z.remove('xl/externalLinks/externalLink1.xml');
  z.remove('xl/externalLinks/_rels/externalLink1.xml.rels');
  z.remove('xl/calcChain.xml');
  z.remove('xl/vbaProject.bin');
  let ct=await z.file('[Content_Types].xml').async('string');
  ct=ct.replace(/<Override[^>]*externalLink[^>]*\/>/g,'')
       .replace(/<Override[^>]*calcChain[^>]*\/>/g,'')
       .replace(/<Override[^>]*vbaProject[^>]*\/>/g,'')
       .replace('application/vnd.ms-excel.sheet.macroEnabled.main+xml',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
  z.file('[Content_Types].xml',ct);
  let rels=await z.file('xl/_rels/workbook.xml.rels').async('string');
  rels=rels.replace(/<Relationship[^>]*externalLink[^>]*\/>/g,'')
           .replace(/<Relationship[^>]*vbaProject[^>]*\/>/g,'');
  z.file('xl/_rels/workbook.xml.rels',rels);
  const fname=cod+'_'+tipo+'_'+_fmtDD_MM_YY(fileDate)+'.xlsx';
  const blob=await z.generateAsync({type:'blob',compression:'DEFLATE'});
  return {blob, fname};
}

// ── ODL ──────────────────────────────────────────────────────
function _fillODLSheet(xml, keys, asl) {
  // Template structure: 5 pages on one sheet, page break every 63 rows.
  // Data rows per page: 31, starting at row 16 (page 0), 79 (page 1), 142, 205, 268.
  const PAGE_OFFSET = 63;
  const DATA_START  = 16;
  const ROWS_PER_PAGE = 31;
  const MAX_PAGES = 5;

  // Patch header cells on all 5 pages (same fields, offset by PAGE_OFFSET each page)
  const ds = _toExcelDate(new Date().toISOString().slice(0, 10));
  const firstDev = keys.length > 0 ? (DB[keys[0]] || {}) : {};
  const aslUpper = (asl || 'ASL BENEVENTO').toUpperCase();
  for (let p = 0; p < MAX_PAGES; p++) {
    const off = p * PAGE_OFFSET;
    xml = _sc(xml, 'V' + (4  + off), ds, true);
    xml = _sc(xml, 'D' + (9  + off), aslUpper);
    xml = _sc(xml, 'D' + (10 + off), firstDev.loc || '');
    xml = _sc(xml, 'D' + (11 + off), firstDev.ss  || '');
    xml = _sc(xml, 'D' + (12 + off), firstDev.na  || '');
    xml = _sc(xml, 'N' + (12 + off), firstDev.rep || '');
  }

  // Rewrite only the data rows; preserve all other rows (header, footer, formatting)
  const SD_OPEN = '<sheetData>', SD_CLOSE = '</sheetData>';
  const sd0 = xml.indexOf(SD_OPEN), sd1 = xml.indexOf(SD_CLOSE);
  if (sd0 === -1 || sd1 === -1) return xml;

  // Patch a cell within a row XML fragment, preserving its style attribute.
  // If the cell exists: update value keeping s="". If not: inject before </row>.
  const esc = v => String(v || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const patchRowCell = (rowXml, addr, val) => {
    const startTag = `<c r="${addr}"`;
    const ci = rowXml.indexOf(startTag);
    const eStr = val ? `<is><t>${esc(val)}</t></is>` : '';
    if (ci !== -1) {
      const selfClose = rowXml.indexOf('/>', ci);
      const closeC    = rowXml.indexOf('</c>', ci);
      const cellEnd   = (selfClose !== -1 && (closeC === -1 || selfClose < closeC))
                        ? selfClose + 2 : closeC + 4;
      const cellXml   = rowXml.slice(ci, cellEnd);
      const sMatch    = cellXml.match(/\bs="(\d+)"/);
      const sAttr     = sMatch ? ` s="${sMatch[1]}"` : '';
      const newCell   = val
        ? `<c r="${addr}"${sAttr} t="inlineStr">${eStr}</c>`
        : `<c r="${addr}"${sAttr}/>`;
      return rowXml.slice(0, ci) + newCell + rowXml.slice(cellEnd);
    }
    if (!val) return rowXml;
    const closeRow = rowXml.lastIndexOf('</row>');
    return rowXml.slice(0, closeRow)
      + `<c r="${addr}" t="inlineStr">${eStr}</c>`
      + rowXml.slice(closeRow);
  };

  // Clear all cell values in a row XML fragment, keeping style attributes.
  const clearRow = rowXml =>
    rowXml.replace(/<c (r="[^"]+")([^>]*)>[\s\S]*?<\/c>/g, (_, rAttr, rest) => {
      const sMatch = rest.match(/\bs="(\d+)"/);
      return sMatch ? `<c ${rAttr} s="${sMatch[1]}"/>` : `<c ${rAttr}/>`;
    });

  const fillRow = (origRowXml, cod) => {
    let r = clearRow(origRowXml);
    if (!cod) return r;
    const rn   = r.match(/<row r="(\d+)"/)[1];
    const rec  = saved[cod] || {};
    const dev  = DB[cod]  || {};
    r = patchRowCell(r, 'A' + rn, dev.c || cod);
    r = patchRowCell(r, 'C' + rn, dev.n || '');
    r = patchRowCell(r, 'G' + rn, dev.b || '');
    r = patchRowCell(r, 'K' + rn, dev.m || '');
    r = patchRowCell(r, 'O' + rn, dev.mat || '');
    if (rec.vse_saved) r = patchRowCell(r, 'R' + rn, 'x');
    if (rec.cq_saved)  r = patchRowCell(r, 'S' + rn, 'x');
    if (rec.mp_saved)  r = patchRowCell(r, 'T' + rn, 'x');
    return r;
  };

  const inner = xml.slice(sd0 + SD_OPEN.length, sd1);
  const rowRe = /<row r="(\d+)"[^>]*>[\s\S]*?<\/row>/g;
  let newInner = '', m;
  while ((m = rowRe.exec(inner)) !== null) {
    const rn = parseInt(m[1]);
    const rel = rn - DATA_START;
    const page = Math.floor(rel / PAGE_OFFSET);
    const slot = rel % PAGE_OFFSET;
    if (rel >= 0 && slot < ROWS_PER_PAGE && page < MAX_PAGES) {
      const devIdx = page * ROWS_PER_PAGE + slot;
      newInner += fillRow(m[0], keys[devIdx] || null);
    } else {
      newInner += m[0]; // keep non-data rows as-is
    }
  }

  return xml.slice(0, sd0 + SD_OPEN.length) + newInner + xml.slice(sd1);
}

async function compilaODL() {
  const keys = Object.keys(saved).filter(k => saved[k]?.vse_saved || saved[k]?.mp_saved);
  if (!keys.length) { toast('Nessun dispositivo verificato nella sessione', 'warn'); return; }
  const buf = await _getTemplate('tpl_odl', 'Template_ODL.xlsx');
  if (!buf) return;
  try {
    await _loadJSZip();
    const z = await JSZip.loadAsync(buf);
    const shPath = await _resolveSheetPath(z, 'ODL');
    if (!shPath) { toast('Foglio ODL non trovato nel template', 'warn'); return; }
    const asl = currentUser?.profile?.asl || 'ASL Benevento';
    z.file(shPath, _fillODLSheet(await z.file(shPath).async('string'), keys, asl));
    z.remove('xl/externalLinks/externalLink1.xml');
    z.remove('xl/externalLinks/_rels/externalLink1.xml.rels');
    z.remove('xl/calcChain.xml');
    z.remove('xl/vbaProject.bin');
    let ct = await z.file('[Content_Types].xml').async('string');
    ct = ct.replace(/<Override[^>]*externalLink[^>]*\/>/g, '')
           .replace(/<Override[^>]*calcChain[^>]*\/>/g, '')
           .replace(/<Override[^>]*vbaProject[^>]*\/>/g, '')
           .replace('application/vnd.ms-excel.sheet.macroEnabled.main+xml',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml');
    z.file('[Content_Types].xml', ct);
    let rels = await z.file('xl/_rels/workbook.xml.rels').async('string');
    rels = rels.replace(/<Relationship[^>]*externalLink[^>]*\/>/g, '')
               .replace(/<Relationship[^>]*vbaProject[^>]*\/>/g, '');
    z.file('xl/_rels/workbook.xml.rels', rels);
    const date = new Date().toISOString().slice(0, 10);
    const fname = 'ODL_' + _fmtDD_MM_YY(date) + '.xlsx';
    const blob = await z.generateAsync({type: 'blob', compression: 'DEFLATE'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = fname; a.click();
    URL.revokeObjectURL(url);
    toast('ODL scaricato: ' + fname, 'ok');
  } catch(e) { console.error(e); toast('Errore compilazione ODL: ' + e.message, 'warn'); }
}

function _exportGuard(cod, tipoLabel){
  if(!cod){toast('Seleziona un dispositivo','warn');return false;}
  const rec=saved[cod];
  if(!rec?.vse_saved){toast('Prima salva la scheda ('+tipoLabel+')','warn');return false;}
  if(!DB[cod]){toast('Dispositivo non trovato in DB','warn');return false;}
  return true;
}

async function exportVS(cod){
  if(!_exportGuard(cod,'VS'))return;
  const rec=saved[cod],dev=DB[cod];
  try{
    const buf=await _getTemplate('tpl_vse','Template_VSE.xlsx');if(!buf)return;
    const fname=await _downloadSheetXLSX(buf,cod,'VS',xml=>_fillVSSheet(xml,rec,dev),rec.data||new Date().toISOString().slice(0,10));
    if(fname)toast('Scaricato: '+fname,'ok');
  }catch(e){console.error(e);toast('Errore export VS: '+e.message,'warn');}
}

async function exportMP(cod){
  if(!_exportGuard(cod,'MP'))return;
  const rec=saved[cod],dev=DB[cod];
  const asl=currentUser?.profile?.asl||'ASL Benevento';
  try{
    const buf=await _getTemplate('tpl_mp','Template_MP.xlsx');if(!buf)return;
    const date=rec.mp_data||rec.data||new Date().toISOString().slice(0,10);
    const fname=await _downloadSheetXLSX(buf,cod,'MP',xml=>_fillMPSheet(xml,rec,dev,asl),date);
    if(fname)toast('Scaricato: '+fname,'ok');
  }catch(e){console.error(e);toast('Errore export MP: '+e.message,'warn');}
}

async function exportVSP(cod){
  if(!cod){toast('Seleziona un dispositivo','warn');return;}
  const rec=saved[cod];
  if(!rec?.vsp_type){toast('Scheda VSP non compilata','warn');return;}
  if(!DB[cod]){toast('Dispositivo non trovato','warn');return;}
  const tipo=rec.vsp_type; // es. VSP_ECG
  // Template_VSP_EGG.xlsx ha sheet VSP_ECG (nome file diverso dal tipo)
  const tplFile=tipo==='VSP_ECG'?'Template_VSP_EGG.xlsx':'Template_'+tipo+'.xlsx';
  const cacheKey='tpl_'+tipo.toLowerCase().replace('vsp_','vsp_');
  try{
    const buf=await _getTemplate(cacheKey,tplFile);if(!buf)return;
    const dev=DB[cod];
    const date=rec.vsp_data||new Date().toISOString().slice(0,10);
    const fname=await _downloadSheetXLSX(buf,cod,'VSP',xml=>_fillVSPSheet(xml,rec,dev),date,tipo);
    if(fname)toast('Scaricato: '+fname,'ok');
  }catch(e){console.error(e);toast('Errore export VSP: '+e.message,'warn');}
}

async function exportCQ(cod){
  if(!cod){toast('Seleziona un dispositivo','warn');return;}
  // Usa variabile locale per non mutare saved[cod] — evita di creare entry parziali
  let rec=saved[cod]||{};
  if(curGet()?.c===cod&&cqTypeGet()){const cqRec=collectCQ();if(cqRec)rec={...rec,...cqRec};}
  if(!rec?.cq_type){toast('Scheda CQ non compilata','warn');return;}
  if(!DB[cod]){toast('Dispositivo non trovato','warn');return;}
  const tipo=rec.cq_type; // es. CQ_DEF
  const tplFile='Template_'+tipo+'.xlsx';
  const cacheKey='tpl_'+tipo.toLowerCase().replace('cq_','cq_');
  const asl=currentUser?.profile?.asl||'ASL Benevento';
  try{
    const buf=await _getTemplate(cacheKey,tplFile);if(!buf)return;
    const dev=DB[cod];
    const date=rec.cq_data||new Date().toISOString().slice(0,10);
    const fname=await _downloadSheetXLSX(buf,cod,'CQ',xml=>_fillCQSheet(xml,rec,dev,asl),date,tipo);
    if(fname)toast('Scaricato: '+fname,'ok');
  }catch(e){console.error(e);toast('Errore export CQ: '+e.message,'warn');}
}

async function exportTutti(cod){
  if(!_exportGuard(cod,'Tutti'))return;
  // Usa variabile locale per non mutare saved[cod] — evita di creare entry parziali
  let rec={...saved[cod]};
  if(curGet()?.c===cod){
    if(cqTypeGet()){const cqRec=collectCQ();if(cqRec)rec={...rec,...cqRec};}
    if(vspTypeGet()){const vspRec=collectVSP();if(vspRec)rec={...rec,...vspRec};}
  }
  const dev=DB[cod];
  const asl=currentUser?.profile?.asl||'ASL Benevento';
  try{
    // Carica sempre VS e MP; VSP e CQ solo se presenti nel record
    const vspTipo=rec.vsp_type||null;
    const cqTipo=rec.cq_type||null;
    const vspTplFile=vspTipo?(vspTipo==='VSP_ECG'?'Template_VSP_EGG.xlsx':'Template_'+vspTipo+'.xlsx'):null;
    const cqTplFile=cqTipo?'Template_'+cqTipo+'.xlsx':null;

    const [bufVS,bufMP,bufVSP,bufCQ]=await Promise.all([
      _getTemplate('tpl_vse','Template_VSE.xlsx'),
      _getTemplate('tpl_mp','Template_MP.xlsx'),
      vspTplFile?_getTemplate('tpl_'+vspTipo.toLowerCase(),vspTplFile):Promise.resolve(null),
      cqTplFile?_getTemplate('tpl_'+cqTipo.toLowerCase(),cqTplFile):Promise.resolve(null),
    ]);
    if(!bufVS||!bufMP)return;
    const date=rec.data||new Date().toISOString().slice(0,10);
    const dateMP=rec.mp_data||date;
    const dateVSP=rec.vsp_data||date;
    const dateCQ=rec.cq_data||date;
    toast('Esportazione in corso...','warn');
    const fnVS=await _downloadSheetXLSX(bufVS,cod,'VS',xml=>_fillVSSheet(xml,rec,dev),date);
    await new Promise(r=>setTimeout(r,400));
    const fnMP=await _downloadSheetXLSX(bufMP,cod,'MP',xml=>_fillMPSheet(xml,rec,dev,asl),dateMP);
    let fnVSP=null,fnCQ=null;
    if(bufVSP&&vspTipo){
      await new Promise(r=>setTimeout(r,400));
      fnVSP=await _downloadSheetXLSX(bufVSP,cod,'VSP',xml=>_fillVSPSheet(xml,rec,dev),dateVSP,vspTipo);
    }
    if(bufCQ&&cqTipo){
      await new Promise(r=>setTimeout(r,400));
      fnCQ=await _downloadSheetXLSX(bufCQ,cod,'CQ',xml=>_fillCQSheet(xml,rec,dev,asl),dateCQ,cqTipo);
    }
    const nomi=[fnVS,fnMP,fnVSP,fnCQ].filter(Boolean);
    toast('Scaricati: '+nomi.join(', '),'ok');
  }catch(e){console.error(e);toast('Errore export: '+e.message,'warn');}
}

// ── FINE EXPORT XLSX ──────────────────────────────────────────


// ── ARCHIVIO CLOUD ────────────────────────────────────────────

function _cloudFolder() {
  const title = (currentSessionTitle||'Sessione')
    .replace(/[^\w\sàèéìòùÀÈÉÌÒÙ]/g,'').replace(/\s+/g,'_').slice(0,60);
  const date = new Date().toISOString().slice(0,10);
  return title + '_' + date;
}

async function _uploadFileCloud(blob, fname, folder) {
  const aslKey = (currentUser?.profile?.asl||'ASL Benevento').toLowerCase().replace('asl ','');
  const userId = currentUser?.id;
  const storagePath = `${userId}/${aslKey}/${folder}/${fname}`;
  await db.archivio.upload(storagePath, blob, {
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    upsert: true
  });
  await db.archivio.insertFileMeta({
    user_id: userId,
    user_name: currentUser?.profile?.full_name || '',
    asl: currentUser?.profile?.asl || '',
    session_folder: folder,
    filename: fname,
    storage_path: storagePath
  });
  return storagePath;
}

async function uploadSessionToCloud() {
  if (!currentSessionId) { toast('Nessuna sessione attiva', 'warn'); return; }
  const codici = Object.keys(saved).filter(c => c !== '__attesi__' && saved[c]?.vse_saved);
  if (!codici.length) { toast('Nessuna scheda salvata da caricare', 'warn'); return; }
  const folder = _cloudFolder();
  const asl = currentUser?.profile?.asl || 'ASL Benevento';
  toast(`Preparazione ${codici.length} schede...`, 'warn');
  let uploaded = 0, errors = 0;
  for (const cod of codici) {
    const rec = saved[cod], dev = DB[cod];
    if (!dev) continue;
    const vm = VERIF_MAP[cod] || {};
    try {
      const date = rec.data || new Date().toISOString().slice(0,10);
      const vspTipo = rec.vsp_type || vm.vsp || null;
      const cqTipo  = rec.cq_type  || vm.cq  || null;
      const vspTplFile = vspTipo ? (vspTipo==='VSP_ECG'?'Template_VSP_EGG.xlsx':'Template_'+vspTipo+'.xlsx') : null;
      const cqTplFile  = cqTipo  ? 'Template_'+cqTipo+'.xlsx' : null;
      const [bufVS,bufMP,bufVSP,bufCQ] = await Promise.all([
        _getTemplate('tpl_vse','Template_VSE.xlsx'),
        _getTemplate('tpl_mp','Template_MP.xlsx'),
        vspTplFile ? _getTemplate('tpl_'+vspTipo.toLowerCase(),vspTplFile) : Promise.resolve(null),
        cqTplFile  ? _getTemplate('tpl_'+cqTipo.toLowerCase(),cqTplFile)  : Promise.resolve(null),
      ]);
      if (bufVS) {
        const r = await _buildSheetXLSX(bufVS,cod,'VS',xml=>_fillVSSheet(xml,rec,dev),date);
        if (r) await _uploadFileCloud(r.blob,r.fname,folder);
      }
      if (bufMP && rec.mp_saved) {
        const r = await _buildSheetXLSX(bufMP,cod,'MP',xml=>_fillMPSheet(xml,rec,dev,asl),rec.mp_data||date);
        if (r) await _uploadFileCloud(r.blob,r.fname,folder);
      }
      if (bufVSP && vspTipo && rec.vsp_saved) {
        const r = await _buildSheetXLSX(bufVSP,cod,'VSP',xml=>_fillVSPSheet(xml,rec,dev),rec.vsp_data||date,vspTipo);
        if (r) await _uploadFileCloud(r.blob,r.fname,folder);
      }
      if (bufCQ && cqTipo && rec.cq_saved) {
        const r = await _buildSheetXLSX(bufCQ,cod,'CQ',xml=>_fillCQSheet(xml,rec,dev,asl),rec.cq_data||date,cqTipo);
        if (r) await _uploadFileCloud(r.blob,r.fname,folder);
      }
      uploaded++;
    } catch(e) { console.error('Upload', cod, e); errors++; }
  }
  toast(errors
    ? `Caricati ${uploaded} dispositivi, ${errors} errori`
    : `☁️ ${uploaded} dispositivi caricati su cloud`, errors?'warn':'ok');
}

async function exportSessioneMassiva() {
  if (!currentSessionId) { toast('Nessuna sessione attiva', 'warn'); return; }
  const codici = Object.keys(saved).filter(c => c !== '__attesi__' && (saved[c]?.vse_saved || saved[c]?.mp_saved || saved[c]?.vsp_saved || saved[c]?.cq_saved));
  if (!codici.length) { toast('Nessuna scheda salvata', 'warn'); return; }
  let dirHandle = null;
  if (window.showDirectoryPicker) {
    try { dirHandle = await window.showDirectoryPicker({mode:'readwrite'}); }
    catch(e) { if (e.name === 'AbortError') return; }
  }
  await _esportaCodici(codici, saved, dirHandle);
}

async function exportSessioneByID(id, titolo) {
  toast(`Caricamento schede "${titolo}"...`, 'warn');
  let schede;
  try { schede = await db.schede.listBySessione(id); }
  catch(e) { toast('Errore caricamento schede', 'warn'); return; }
  const savedTmp = {};
  schede.forEach(s => {
    if (s.codice === '__attesi__') return;
    savedTmp[s.codice] = {
      codice: s.codice,
      ...(s.dati_vse||{}), ...(s.dati_mp||{}), ...(s.dati_vsp||{}), ...(s.dati_cq||{}),
      vse_saved:!!s.dati_vse, mp_saved:!!s.dati_mp, vsp_saved:!!s.dati_vsp, cq_saved:!!s.dati_cq,
      vsp_type:s.vsp_type||null, cq_type:s.cq_type||null,
    };
  });
  const codici = Object.keys(savedTmp).filter(c => savedTmp[c].vse_saved||savedTmp[c].mp_saved||savedTmp[c].vsp_saved||savedTmp[c].cq_saved);
  if (!codici.length) { toast('Nessuna scheda salvata in questa sessione', 'warn'); return; }
  let dirHandle = null;
  if (window.showDirectoryPicker) {
    try { dirHandle = await window.showDirectoryPicker({mode:'readwrite'}); }
    catch(e) { if (e.name === 'AbortError') return; }
  }
  await _esportaCodici(codici, savedTmp, dirHandle);
}

async function _esportaCodici(codici, savedMap, dirHandle) {
  const asl = currentUser?.profile?.asl || 'ASL Benevento';
  toast(`Esportazione ${codici.length} dispositivi in corso...`, 'warn');
  let count = 0, errors = 0;
  for (const cod of codici) {
    const rec = savedMap[cod], dev = DB[cod];
    if (!dev) continue;
    const vm = VERIF_MAP[cod] || {};
    try {
      const date = rec.data || new Date().toISOString().slice(0,10);
      const vspTipo = rec.vsp_type || vm.vsp || null;
      const cqTipo  = rec.cq_type  || vm.cq  || null;
      const vspTplFile = vspTipo ? (vspTipo==='VSP_ECG'?'Template_VSP_EGG.xlsx':'Template_'+vspTipo+'.xlsx') : null;
      const cqTplFile  = cqTipo  ? 'Template_'+cqTipo+'.xlsx' : null;
      const [bufVS, bufMP, bufVSP, bufCQ] = await Promise.all([
        rec.vse_saved ? _getTemplate('tpl_vse','Template_VSE.xlsx') : Promise.resolve(null),
        rec.mp_saved  ? _getTemplate('tpl_mp','Template_MP.xlsx')   : Promise.resolve(null),
        (rec.vsp_saved && vspTplFile) ? _getTemplate('tpl_'+vspTipo.toLowerCase(),vspTplFile) : Promise.resolve(null),
        (rec.cq_saved  && cqTplFile)  ? _getTemplate('tpl_'+cqTipo.toLowerCase(),cqTplFile)   : Promise.resolve(null),
      ]);
      if (bufVS && rec.vse_saved) {
        await _downloadSheetXLSX(bufVS, cod, 'VS', xml=>_fillVSSheet(xml,rec,dev), date, 'Foglio1', dirHandle);
        await new Promise(r=>setTimeout(r,300));
      }
      if (bufMP && rec.mp_saved) {
        await _downloadSheetXLSX(bufMP, cod, 'MP', xml=>_fillMPSheet(xml,rec,dev,asl), rec.mp_data||date, 'Foglio1', dirHandle);
        await new Promise(r=>setTimeout(r,300));
      }
      if (bufVSP && vspTipo && rec.vsp_saved) {
        await _downloadSheetXLSX(bufVSP, cod, 'VSP', xml=>_fillVSPSheet(xml,rec,dev), rec.vsp_data||date, vspTipo, dirHandle);
        await new Promise(r=>setTimeout(r,300));
      }
      if (bufCQ && cqTipo && rec.cq_saved) {
        await _downloadSheetXLSX(bufCQ, cod, 'CQ', xml=>_fillCQSheet(xml,rec,dev,asl), rec.cq_data||date, cqTipo, dirHandle);
        await new Promise(r=>setTimeout(r,300));
      }
      count++;
    } catch(e) { console.error('Export massivo', cod, e); errors++; }
  }
  toast(errors
    ? `Esportati ${count} dispositivi, ${errors} errori`
    : `⬇ ${count} dispositivi esportati`, errors?'warn':'ok');
}

function downloadMacroPDF() {
  const vbs = `' Converti tutti i file Excel in PDF nella cartella selezionata
' Doppio clic per eseguire - richiede Microsoft Excel installato
Option Explicit

Dim folderPath, objFSO, objFolder, objFile, objExcel, objWB, pdfPath, count, ext
Dim objShell, objBrowse

' Dialogo sfoglia cartella
Set objShell = CreateObject("Shell.Application")
Set objBrowse = objShell.BrowseForFolder(0, "Seleziona la cartella con i file Excel da convertire in PDF", 0)
If objBrowse Is Nothing Then WScript.Quit
folderPath = objBrowse.Self.Path

Set objFSO = CreateObject("Scripting.FileSystemObject")
If Not objFSO.FolderExists(folderPath) Then
  MsgBox "Cartella non trovata:" & Chr(13) & folderPath, 16, "Errore"
  WScript.Quit
End If

Set objExcel = CreateObject("Excel.Application")
objExcel.Visible = False
objExcel.DisplayAlerts = False

count = 0
Set objFolder = objFSO.GetFolder(folderPath)
For Each objFile In objFolder.Files
  ext = LCase(Right(objFile.Name, 5))
  If ext = ".xlsx" Or LCase(Right(objFile.Name, 4)) = ".xls" Then
    pdfPath = objFSO.BuildPath(folderPath, Left(objFile.Name, InStrRev(objFile.Name, ".") - 1) & ".pdf")
    On Error Resume Next
    Set objWB = objExcel.Workbooks.Open(objFile.Path, False, True)
    If Err.Number = 0 Then
      objWB.ExportAsFixedFormat 0, pdfPath, 0, True, False
      objWB.Close False
      count = count + 1
    End If
    On Error GoTo 0
  End If
Next

objExcel.Quit
MsgBox count & " file convertiti in PDF." & Chr(13) & Chr(13) & "Cartella: " & folderPath, 64, "Conversione completata"
`;
  const blob = new Blob([vbs], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='Converti_Excel_PDF.vbs'; a.click();
  URL.revokeObjectURL(url);
  toast('Script scaricato — doppio clic per eseguire', 'ok');
}

function openArchivioModal() {
  document.getElementById('archivio-modal').classList.add('open');
  loadArchivio();
}
function closeArchivioModal() {
  document.getElementById('archivio-modal').classList.remove('open');
}

// ── stato navigazione archivio ───────────────────────────────
let _archGroups = new Map();
let _archCurKey = null;

async function loadArchivio() {
  const el = document.getElementById('archivio-content');
  el.innerHTML = '<div class="arch-empty">Caricamento...</div>';
  const isAdmin = currentUser?.profile?.role === 'admin';
  let files;
  try { files = await db.archivio.listFiles({ allUsers: isAdmin }); }
  catch (e) { el.innerHTML='<div class="arch-empty">Errore caricamento</div>'; return; }
  if (!files.length) { el.innerHTML='<div class="arch-empty">Nessun file caricato</div>'; return; }
  _archGroups = new Map();
  files.forEach(f => {
    const gkey = (isAdmin ? (f.user_name||f.user_id)+' — ' : '') + f.session_folder;
    if (!_archGroups.has(gkey)) _archGroups.set(gkey, []);
    _archGroups.get(gkey).push(f);
  });
  _renderArchivioSessions();
}

function _renderArchivioSessions() {
  _archCurKey = null;
  const el = document.getElementById('archivio-content');
  el.innerHTML = [..._archGroups.entries()].map(([gkey, gfiles]) => {
    const lastDate = gfiles.reduce((d,f)=>(f.created_at||'')>d?(f.created_at||''):d,'').slice(0,10);
    return `<div class="arch-sess-row" onclick="_openArchivioSession('${_esc(gkey)}')">
      <span class="arch-sess-icon">📁</span>
      <div class="arch-sess-info">
        <div class="arch-sess-name">${_esc(gkey)}</div>
        <div class="arch-sess-meta">${gfiles.length} file · ${lastDate}</div>
      </div>
      <span class="arch-sess-chevron">›</span>
    </div>`;
  }).join('');
}

function _openArchivioSession(gkey) {
  _archCurKey = gkey;
  const files = _archGroups.get(gkey);
  if (!files) return;
  const el = document.getElementById('archivio-content');
  el.innerHTML = `
    <div class="arch-detail-hdr">
      <button class="btn-sm" onclick="_renderArchivioSessions()">← Sessioni</button>
      <span class="arch-detail-title">${_esc(gkey)}</span>
      <button class="btn-sm arch-dl-all" onclick="_scaricaTuttiArchivio()">⬇ Scarica tutti</button>
    </div>
    <div class="arch-files-wrap">
      ${files.map(f=>`
        <div class="arch-file">
          <span class="arch-file-name">📄 ${_esc(f.filename)}</span>
          <span class="arch-file-date">${f.created_at?.slice(0,10)||''}</span>
          <div class="arch-file-btns">
            <button class="btn-sm" onclick="downloadArchivioFile('${_esc(f.storage_path)}','${_esc(f.filename)}')">⬇</button>
            <button class="btn-sm" style="color:var(--ko)" onclick="deleteArchivioFile('${_esc(f.id)}','${_esc(f.storage_path)}')">✕</button>
          </div>
        </div>`).join('')}
    </div>`;
}

async function _scaricaTuttiArchivio() {
  const files = _archGroups.get(_archCurKey);
  if (!files?.length) return;
  // Desktop Chrome/Edge: scelta cartella di destinazione
  if (window.showDirectoryPicker) {
    try {
      const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
      toast('Download in corso — ' + files.length + ' file...', 'ok');
      let ok = 0, err = 0;
      for (const f of files) {
        try {
          const data = await db.archivio.download(f.storage_path);
          const fh = await dirHandle.getFileHandle(f.filename, { create: true });
          const w  = await fh.createWritable();
          await w.write(data);
          await w.close();
          ok++;
        } catch(e) { console.error('arch dl', f.filename, e); err++; }
      }
      toast(ok + ' file salvati' + (err ? ` · ${err} errori` : ''), ok ? 'ok' : 'warn');
      return;
    } catch(e) {
      if (e.name === 'AbortError') return; // annullato dall'utente
    }
  }
  // Fallback: download singoli nella cartella Download del browser
  toast('Download avviato — ' + files.length + ' file nella cartella Download', 'ok');
  for (const f of files) {
    await downloadArchivioFile(f.storage_path, f.filename);
    await new Promise(r => setTimeout(r, 350));
  }
}

async function downloadArchivioFile(path, fname) {
  let data;
  try { data = await db.archivio.download(path); }
  catch (e) { toast('Errore download: '+e.message, 'warn'); return; }
  const url = URL.createObjectURL(data);
  const a = document.createElement('a'); a.href=url; a.download=fname; a.click();
  URL.revokeObjectURL(url);
}

async function deleteArchivioFile(id, path) {
  if (!confirm('Eliminare il file?')) return;
  try { await db.archivio.remove(path); }
  catch (e) { toast('Errore eliminazione: '+e.message,'warn'); return; }
  try { await db.archivio.deleteFileMeta(id); }
  catch (e) { toast('Errore eliminazione meta: '+e.message,'warn'); return; }
  toast('File eliminato','ok');
  // aggiorna la lista locale e ridisegna la sessione corrente
  if (_archCurKey) {
    const arr = _archGroups.get(_archCurKey)?.filter(f => f.id !== id);
    if (arr?.length) { _archGroups.set(_archCurKey, arr); _openArchivioSession(_archCurKey); }
    else { _archGroups.delete(_archCurKey); _renderArchivioSessions(); }
  } else { loadArchivio(); }
}

// ── FINE ARCHIVIO CLOUD ───────────────────────────────────────

// ── FINE ANAGRAFICA ───────────────────────────────────────────

