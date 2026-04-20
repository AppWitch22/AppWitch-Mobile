// ── CORE: stato globale, Supabase, auth, DB, sessioni, preset ──

// MAIN APP
// Mappa verifiche per codice — generata da Programmate_2025 + CIVAB
// v = tipi verifica, cq = foglio CQ, vsp = foglio VSP
const VERIF_MAP={"0000017":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000039":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000053":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000054":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000058":{"cq":"CQ_VPO"},"0000062":{"cq":"CQ_ECT"},"0000067":{"cq":"CQ_ECT"},"0000100":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000101":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000102":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000103":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000109":{"cq":"CQ_ECT"},"0000112":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000117":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000143":{"cq":"CQ_ECT"},"0000158":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000171":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000172":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000173":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000181":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000182":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000185":{"cq":"CQ_VPO"},"0000190":{"cq":"CQ_ECT"},"0000194":{"cq":"CQ_ECT"},"0000221":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000225":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000226":{"cq":"CQ_VPO"},"0000233":{"cq":"CQ_MON"},"0000234":{"cq":"CQ_MON"},"0000247":{"cq":"CQ_VPO"},"0000248":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000255":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000260":{"cq":"CQ_FBI"},"0000262":{"cq":"CQ_FBI"},"0000273":{"cq":"CQ_FBI"},"0000274":{"cq":"CQ_FBI"},"0000275":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000283":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000284":{"cq":"CQ_FBI"},"0000292":{"cq":"CQ_FBI"},"0000293":{"cq":"CQ_FBI"},"0000306":{"cq":"CQ_ECT"},"0000313":{"cq":"CQ_ECT"},"0000319":{"cq":"CQ_ANS"},"0000348":{"cq":"CQ_ECT"},"0000375":{"cq":"CQ_ANS"},"0000376":{"cq":"CQ_MON"},"0000380":{"cq":"CQ_MON"},"0000381":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000383":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000387":{"cq":"CQ_FBI"},"0000392":{"cq":"CQ_VPO"},"0000401":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000408":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000416":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000418":{"cq":"CQ_FBI"},"0000421":{"cq":"CQ_FBI"},"0000422":{"cq":"CQ_FBI"},"0000428":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000435":{"cq":"CQ_FBI"},"0000436":{"cq":"CQ_FBI"},"0000441":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000442":{"cq":"CQ_ANS"},"0000446":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000447":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000451":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000452":{"cq":"CQ_VPO"},"0000469":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000475":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000476":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000502":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000505":{"cq":"CQ_ECT"},"0000511":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000512":{"cq":"CQ_FBI"},"0000513":{"cq":"CQ_FBI"},"0000514":{"cq":"CQ_FBI"},"0000515":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000516":{"cq":"CQ_FBI"},"0000517":{"cq":"CQ_FBI"},"0000522":{"cq":"CQ_FBI"},"0000523":{"cq":"CQ_FBI"},"0000525":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000533":{"cq":"CQ_FBI"},"0000534":{"cq":"CQ_FBI"},"0000535":{"cq":"CQ_FBI"},"0000539":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000540":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000559":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000563":{"cq":"CQ_FBI"},"0000578":{"cq":"CQ_ECT"},"0000596":{"cq":"CQ_FBI"},"0000597":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000602":{"cq":"CQ_FBI"},"0000603":{"cq":"CQ_FBI"},"0000611":{"cq":"CQ_FBI"},"0000623":{"cq":"CQ_FBI"},"0000624":{"cq":"CQ_FBI"},"0000625":{"cq":"CQ_FBI"},"0000626":{"cq":"CQ_FBI"},"0000628":{"cq":"CQ_FBI"},"0000629":{"cq":"CQ_FBI"},"0000630":{"cq":"CQ_FBI"},"0000642":{"cq":"CQ_FBI"},"0000643":{"cq":"CQ_FBI"},"0000652":{"cq":"CQ_ECT"},"0000671":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000688":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000705":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000706":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000709":{"cq":"CQ_FBI"},"0000716":{"cq":"CQ_FBI"},"0000717":{"cq":"CQ_FBI"},"0000718":{"cq":"CQ_FBI"},"0000721":{"cq":"CQ_FBI"},"0000734":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000740":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000741":{"cq":"CQ_ECT"},"0000749":{"cq":"CQ_FBI"},"0000760":{"cq":"CQ_FBI"},"0000761":{"cq":"CQ_FBI"},"0000762":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000766":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000774":{"cq":"CQ_FBI"},"0000790":{"cq":"CQ_ECT"},"0000808":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000809":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000811":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000812":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000821":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0000827":{"cq":"CQ_ECT"},"0000837":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000841":{"cq":"CQ_FBI"},"0000842":{"cq":"CQ_FBI"},"0000843":{"cq":"CQ_FBI"},"0000885":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000892":{"cq":"CQ_FBI"},"0000893":{"cq":"CQ_FBI"},"0000894":{"cq":"CQ_FBI"},"0000895":{"cq":"CQ_FBI"},"0000907":{"cq":"CQ_FBI"},"0000914":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000915":{"cq":"CQ_FBI"},"0000918":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000920":{"cq":"CQ_FBI"},"0000924":{"cq":"CQ_FBI"},"0000925":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0000926":{"cq":"CQ_FBI"},"0000931":{"cq":"CQ_FBI"},"0000932":{"cq":"CQ_FBI"},"0000939":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000942":{"cq":"CQ_ECT"},"0000945":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0000949":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0000953":{"cq":"CQ_FBI"},"0000974":{"cq":"CQ_FBI"},"0000983":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0001001":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001012":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001013":{"cq":"CQ_ECT"},"0001016":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001017":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001021":{"cq":"CQ_ECT"},"0001044":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001046":{"cq":"CQ_FBI"},"0001053":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001054":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001055":{"cq":"CQ_FBI"},"0001058":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001073":{"cq":"CQ_FBI"},"0001074":{"cq":"CQ_FBI"},"0001077":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001082":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001091":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0001092":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0001094":{"cq":"CQ_ANS"},"0001096":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001097":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0001106":{"cq":"CQ_VPO"},"0001108":{"cq":"CQ_FBI"},"0001110":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001124":{"cq":"CQ_FBI"},"0001135":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001361":{"cq":"CQ_FBI"},"0001366":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001369":{"cq":"CQ_FBI"},"0001373":{"cq":"CQ_FBI"},"0001374":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001379":{"cq":"CQ_FBI"},"0001380":{"cq":"CQ_FBI"},"0001381":{"cq":"CQ_FBI"},"0001384":{"cq":"CQ_FBI"},"0001386":{"cq":"CQ_FBI"},"0001387":{"cq":"CQ_FBI"},"0001389":{"cq":"CQ_FBI"},"0001392":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001393":{"cq":"CQ_MON"},"0001396":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001398":{"cq":"CQ_FBI"},"0001399":{"cq":"CQ_FBI"},"0001400":{"cq":"CQ_FBI"},"0001406":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001414":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001415":{"cq":"CQ_ECT"},"0001422":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001426":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001427":{"cq":"CQ_FBI"},"0001430":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001431":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001432":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001433":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001434":{"cq":"CQ_VPO"},"0001466":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001467":{"cq":"CQ_FBI"},"0001469":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001472":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001474":{"cq":"CQ_FBI"},"0001475":{"cq":"CQ_FBI"},"0001476":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001479":{"cq":"CQ_FBI"},"0001480":{"cq":"CQ_FBI"},"0001481":{"cq":"CQ_FBI"},"0001534":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001560":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001594":{"cq":"CQ_FBI"},"0001595":{"cq":"CQ_FBI"},"0001596":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001597":{"cq":"CQ_FBI"},"0001598":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001599":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001600":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001623":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001642":{"cq":"CQ_FBI"},"0001647":{"cq":"CQ_FBI"},"0001648":{"cq":"CQ_FBI"},"0001655":{"cq":"CQ_ECT"},"0001671":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001672":{"cq":"CQ_FBI"},"0001673":{"cq":"CQ_FBI"},"0001683":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001705":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001724":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001725":{"cq":"CQ_FBI"},"0001735":{"cq":"CQ_FBI"},"0001756":{"cq":"CQ_FBI"},"0001771":{"cq":"CQ_FBI"},"0001772":{"cq":"CQ_FBI"},"0001782":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001797":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001798":{"cq":"CQ_FBI"},"0001806":{"cq":"CQ_FBI"},"0001807":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001824":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001825":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001856":{"cq":"CQ_FBI"},"0001862":{"cq":"CQ_FBI"},"0001864":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001866":{"cq":"CQ_FBI"},"0001867":{"cq":"CQ_FBI"},"0001871":{"cq":"CQ_FBI"},"0001872":{"cq":"CQ_FBI"},"0001873":{"cq":"CQ_FBI"},"0001874":{"cq":"CQ_FBI"},"0001879":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001880":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001881":{"cq":"CQ_FBI"},"0001882":{"cq":"CQ_FBI"},"0001883":{"cq":"CQ_FBI"},"0001886":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001893":{"cq":"CQ_FBI"},"0001894":{"cq":"CQ_FBI"},"0001902":{"cq":"CQ_ECT"},"0001909":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001910":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001916":{"cq":"CQ_MON"},"0001926":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001928":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0001955":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0001974":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001977":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0001989":{"cq":"CQ_FBI"},"0001993":{"cq":"CQ_ECT"},"0001994":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0001999":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002014":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002017":{"cq":"CQ_FBI"},"0002020":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002021":{"cq":"CQ_FBI"},"0002022":{"cq":"CQ_FBI"},"0002024":{"cq":"CQ_FBI"},"0002032":{"cq":"CQ_FBI"},"0002034":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002040":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002046":{"cq":"CQ_FBI"},"0002047":{"cq":"CQ_FBI"},"0002051":{"cq":"CQ_FBI"},"0002052":{"cq":"CQ_FBI"},"0002053":{"cq":"CQ_FBI"},"0002054":{"cq":"CQ_FBI"},"0002055":{"cq":"CQ_FBI"},"0002069":{"cq":"CQ_FBI"},"0002070":{"cq":"CQ_FBI"},"0002071":{"cq":"CQ_FBI"},"0002072":{"cq":"CQ_FBI"},"0002073":{"cq":"CQ_FBI"},"0002083":{"cq":"CQ_FBI"},"0002148":{"cq":"CQ_FBI"},"0002191":{"cq":"CQ_FBI"},"0002199":{"cq":"CQ_FBI"},"0002202":{"cq":"CQ_FBI"},"0002203":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002205":{"cq":"CQ_ECT"},"0002223":{"cq":"CQ_FBI"},"0002224":{"cq":"CQ_FBI"},"0002234":{"cq":"CQ_ECT"},"0002256":{"cq":"CQ_FBI"},"0002262":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0002326":{"cq":"CQ_FBI"},"0002327":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002328":{"cq":"CQ_FBI"},"0002333":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002334":{"cq":"CQ_ECT"},"0002399":{"cq":"CQ_FBI"},"0002400":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002405":{"cq":"CQ_FBI"},"0002417":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002452":{"cq":"CQ_ECT"},"0002551":{"cq":"CQ_MON"},"0002552":{"cq":"CQ_MON"},"0002553":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002567":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002636":{"cq":"CQ_FBI"},"0002637":{"cq":"CQ_FBI"},"0002639":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002640":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002650":{"cq":"CQ_ECT"},"0002672":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0002684":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002693":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002706":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002711":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002717":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002719":{"cq":"CQ_FBI"},"0002720":{"cq":"CQ_FBI"},"0002721":{"cq":"CQ_ECT"},"0002738":{"cq":"CQ_FBI"},"0002739":{"cq":"CQ_FBI"},"0002741":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0002742":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0002751":{"cq":"CQ_ANS"},"0002752":{"cq":"CQ_MON"},"0002765":{"cq":"CQ_FBI"},"0002766":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0002767":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0002769":{"cq":"CQ_FBI"},"0002772":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002776":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002788":{"cq":"CQ_FBI"},"0002828":{"cq":"CQ_VPO"},"0002831":{"cq":"CQ_VPO"},"0002837":{"cq":"CQ_ECT"},"0002845":{"cq":"CQ_VPO"},"0002846":{"cq":"CQ_ANS"},"0002847":{"cq":"CQ_MON"},"0002872":{"cq":"CQ_FBI"},"0002904":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0002906":{"cq":"CQ_FBI"},"0002914":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0002947":{"cq":"CQ_MON"},"0002949":{"cq":"CQ_MON"},"0002952":{"cq":"CQ_MON"},"0002954":{"cq":"CQ_MON"},"0002955":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0002957":{"cq":"CQ_MON"},"0002963":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002973":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0002984":{"cq":"CQ_FBI"},"0002985":{"cq":"CQ_FBI"},"0002986":{"cq":"CQ_FBI"},"0002987":{"cq":"CQ_FBI"},"0002989":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0002990":{"cq":"CQ_FBI"},"0002991":{"cq":"CQ_FBI"},"0002992":{"cq":"CQ_FBI"},"0002995":{"cq":"CQ_ECT"},"0002999":{"cq":"CQ_ECT"},"0003001":{"cq":"CQ_FBI"},"0003027":{"cq":"CQ_FBI"},"0003029":{"cq":"CQ_VPO"},"0003103":{"cq":"CQ_ECT"},"0003129":{"cq":"CQ_VPO"},"0003130":{"cq":"CQ_VPO"},"0003133":{"cq":"CQ_VPO"},"0003135":{"cq":"CQ_VPO"},"0003143":{"cq":"CQ_VPO"},"0003150":{"cq":"CQ_FBI"},"0003187":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0003226":{"cq":"CQ_ECT"},"0003235":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003236":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003252":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0003260":{"cq":"CQ_VPO"},"0003261":{"cq":"CQ_VPO"},"0003262":{"cq":"CQ_VPO"},"0003263":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003264":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003272":{"cq":"CQ_VPO"},"0003291":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003316":{"cq":"CQ_VPO"},"0003318":{"cq":"CQ_VPO"},"0003325":{"cq":"CQ_VPO"},"0003366":{"cq":"CQ_VPO"},"0003378":{"cq":"CQ_ANS"},"0003379":{"cq":"CQ_MON"},"0003396":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003399":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003405":{"cq":"CQ_FBI"},"0003406":{"cq":"CQ_FBI"},"0003407":{"cq":"CQ_FBI"},"0003408":{"cq":"CQ_FBI"},"0003409":{"cq":"CQ_FBI"},"0003410":{"cq":"CQ_FBI"},"0003419":{"cq":"CQ_FBI"},"0003420":{"cq":"CQ_FBI"},"0003432":{"cq":"CQ_VPO"},"0003434":{"cq":"CQ_FBI"},"0003435":{"cq":"CQ_FBI"},"0003445":{"cq":"CQ_FBI"},"0003455":{"cq":"CQ_FBI"},"0003457":{"cq":"CQ_FBI"},"0003458":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003459":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003460":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003461":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003462":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003463":{"cq":"CQ_VPO"},"0003471":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0003472":{"cq":"CQ_VPO"},"0003485":{"cq":"CQ_VPO"},"0003499":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0003505":{"cq":"CQ_VPO"},"0003565":{"cq":"CQ_VPO"},"0003572":{"cq":"CQ_VPO"},"0003585":{"cq":"CQ_FBI"},"0003586":{"cq":"CQ_FBI"},"0003587":{"cq":"CQ_FBI"},"0003588":{"cq":"CQ_FBI"},"0003593":{"cq":"CQ_FBI"},"0003598":{"cq":"CQ_FBI"},"0003599":{"cq":"CQ_FBI"},"0003600":{"cq":"CQ_FBI"},"0003612":{"cq":"CQ_FBI"},"0003619":{"cq":"CQ_VPO"},"0003625":{"cq":"CQ_FBI"},"0003626":{"cq":"CQ_FBI"},"0003627":{"cq":"CQ_FBI"},"0003628":{"cq":"CQ_FBI"},"0003629":{"cq":"CQ_FBI"},"0003630":{"cq":"CQ_VPO"},"0003647":{"cq":"CQ_FBI"},"0003660":{"cq":"CQ_VPO"},"0003675":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003676":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003677":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003678":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003679":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003680":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003730":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0003737":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0003739":{"cq":"CQ_VPO"},"0003741":{"cq":"CQ_VPO"},"0003770":{"cq":"CQ_VPO"},"0003774":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003776":{"cq":"CQ_VPO"},"0003782":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003783":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003827":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0003837":{"cq":"CQ_FBI"},"0003859":{"cq":"CQ_VPO"},"0003891":{"cq":"CQ_VPO"},"0003892":{"cq":"CQ_FBI"},"0003896":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0003920":{"cq":"CQ_VPO"},"0003922":{"cq":"CQ_FBI"},"0003923":{"cq":"CQ_FBI"},"0003960":{"cq":"CQ_FBI"},"0003964":{"cq":"CQ_VPO"},"0003970":{"cq":"CQ_FBI"},"0003971":{"cq":"CQ_VPO"},"0004003":{"cq":"CQ_ECT"},"0004038":{"cq":"CQ_ECT"},"0004142":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004143":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004144":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004145":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004146":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004147":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004148":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004149":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004181":{"cq":"CQ_ECT"},"0004188":{"cq":"CQ_ECT"},"0004193":{"cq":"CQ_FBI"},"0004194":{"cq":"CQ_FBI"},"0004195":{"cq":"CQ_FBI"},"0004198":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004199":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004200":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004204":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004205":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004206":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004253":{"cq":"CQ_VPO"},"0004254":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004255":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004268":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004274":{"cq":"CQ_VPO"},"0004275":{"cq":"CQ_VPO"},"0004277":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004369":{"cq":"CQ_MON"},"0004382":{"cq":"CQ_VPO"},"0004395":{"cq":"CQ_VPO"},"0004411":{"cq":"CQ_FBI"},"0004487":{"cq":"CQ_FBI"},"0004519":{"cq":"CQ_ECT"},"0004541":{"cq":"CQ_VPO"},"0004580":{"cq":"CQ_FBI"},"0004581":{"cq":"CQ_FBI"},"0004585":{"cq":"CQ_VPO"},"0004596":{"cq":"CQ_MON"},"0004597":{"cq":"CQ_MON"},"0004598":{"cq":"CQ_MON"},"0004599":{"cq":"CQ_MON"},"0004612":{"cq":"CQ_VPO"},"0004622":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0004623":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0004624":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0004626":{"cq":"CQ_FBI"},"0004632":{"cq":"CQ_ANS"},"0004634":{"cq":"CQ_FBI"},"0004635":{"cq":"CQ_FBI"},"0004636":{"cq":"CQ_FBI"},"0004641":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0004658":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004663":{"cq":"CQ_FBI"},"0004667":{"cq":"CQ_ECT"},"0004675":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004685":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0004698":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0004701":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004702":{"cq":"CQ_FBI"},"0004704":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004705":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004706":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0004747":{"cq":"CQ_FBI"},"0004752":{"cq":"CQ_FBI"},"0004766":{"cq":"CQ_VPO"},"0004769":{"cq":"CQ_FBI"},"0004770":{"cq":"CQ_FBI"},"0004822":{"cq":"CQ_FBI"},"0004823":{"cq":"CQ_FBI"},"0004824":{"cq":"CQ_FBI"},"0004825":{"cq":"CQ_FBI"},"0004826":{"cq":"CQ_FBI"},"0004874":{"cq":"CQ_VPO"},"0004888":{"cq":"CQ_VPO"},"0004893":{"cq":"CQ_ANS"},"0004894":{"cq":"CQ_MON"},"0004958":{"cq":"CQ_VPO"},"0004991":{"cq":"CQ_VPO"},"0004999":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005012":{"cq":"CQ_VPO"},"0005013":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005014":{"cq":"CQ_VPO"},"0005018":{"cq":"CQ_VPO"},"0005039":{"cq":"CQ_VPO"},"0005049":{"cq":"CQ_VPO"},"0005086":{"cq":"CQ_FBI"},"0005091":{"cq":"CQ_FBI"},"0005092":{"cq":"CQ_FBI"},"0005093":{"cq":"CQ_FBI"},"0005094":{"cq":"CQ_FBI"},"0005095":{"cq":"CQ_FBI"},"0005096":{"cq":"CQ_FBI"},"0005097":{"cq":"CQ_FBI"},"0005098":{"cq":"CQ_FBI"},"0005101":{"cq":"CQ_VPO"},"0005106":{"cq":"CQ_VPO"},"0005107":{"cq":"CQ_VPO"},"0005144":{"cq":"CQ_VPO"},"0005151":{"cq":"CQ_VPO"},"0005187":{"cq":"CQ_VPO"},"0005203":{"cq":"CQ_VPO"},"0005226":{"cq":"CQ_FBI"},"0005227":{"cq":"CQ_FBI"},"0005233":{"cq":"CQ_VPO"},"0005246":{"cq":"CQ_VPO"},"0005248":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0005280":{"cq":"CQ_VPO"},"0005299":{"cq":"CQ_VPO"},"0005337":{"cq":"CQ_VPO"},"0005338":{"cq":"CQ_VPO"},"0005350":{"cq":"CQ_VPO"},"0005355":{"cq":"CQ_VPO"},"0005372":{"cq":"CQ_VPO"},"0005389":{"cq":"CQ_VPO"},"0005427":{"cq":"CQ_VPO"},"0005433":{"cq":"CQ_FBI"},"0005442":{"cq":"CQ_VPO"},"0005447":{"cq":"CQ_VPO"},"0005450":{"cq":"CQ_VPO"},"0005486":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005492":{"cq":"CQ_VPO"},"0005506":{"cq":"CQ_VPO"},"0005606":{"cq":"CQ_VPO"},"0005628":{"cq":"CQ_VPO"},"0005629":{"cq":"CQ_VPO"},"0005630":{"cq":"CQ_VPO"},"0005662":{"cq":"CQ_VPO"},"0005665":{"cq":"CQ_VPO"},"0005672":{"cq":"CQ_VPO"},"0005675":{"cq":"CQ_VPO"},"0005690":{"cq":"CQ_VPO"},"0005693":{"cq":"CQ_VPO"},"0005699":{"cq":"CQ_VPO"},"0005709":{"cq":"CQ_VPO"},"0005720":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005721":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005722":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005723":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005724":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005725":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005784":{"cq":"CQ_VPO"},"0005785":{"cq":"CQ_VPO"},"0005790":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005801":{"cq":"CQ_FBI"},"0005814":{"cq":"CQ_VPO"},"0005819":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005838":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005847":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005860":{"cq":"CQ_VPO"},"0005861":{"cq":"CQ_VPO"},"0005876":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005882":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005891":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005901":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005910":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005921":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0005942":{"cq":"CQ_VPO"},"0005955":{"cq":"CQ_VPO"},"0005956":{"cq":"CQ_VPO"},"0005963":{"cq":"CQ_VPO"},"0005964":{"cq":"CQ_VPO"},"0005975":{"cq":"CQ_VPO"},"0005983":{"cq":"CQ_VPO"},"0006052":{"cq":"CQ_VPO"},"0006057":{"cq":"CQ_VPO"},"0006092":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006093":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006097":{"cq":"CQ_VPO"},"0006098":{"cq":"CQ_VPO"},"0006106":{"cq":"CQ_ECT"},"0006115":{"cq":"CQ_VPO"},"0006644":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006161":{"cq":"CQ_FBI"},"0006162":{"cq":"CQ_FBI"},"0006163":{"cq":"CQ_FBI"},"0006180":{"cq":"CQ_FBI"},"0006186":{"cq":"CQ_FBI"},"0006190":{"cq":"CQ_FBI"},"0006191":{"cq":"CQ_FBI"},"0006192":{"cq":"CQ_FBI"},"0006204":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006205":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006206":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006209":{"cq":"CQ_FBI"},"0006210":{"cq":"CQ_FBI"},"0006211":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006212":{"cq":"CQ_FBI"},"0006264":{"cq":"CQ_VPO"},"0006271":{"cq":"CQ_VPO"},"0006291":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006303":{"cq":"CQ_FBI"},"0006348":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006349":{"cq":"CQ_VPO"},"0006357":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006366":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0006370":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0006371":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006376":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006378":{"cq":"CQ_FBI"},"0006388":{"cq":"CQ_ECT"},"0006393":{"cq":"CQ_ECT"},"0006414":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006415":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006420":{"cq":"CQ_FBI"},"0006426":{"cq":"CQ_FBI"},"0006429":{"cq":"CQ_FBI"},"0006442":{"cq":"CQ_FBI"},"0006453":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006460":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006470":{"cq":"CQ_ECT"},"0006475":{"cq":"CQ_ECT"},"0006481":{"cq":"CQ_ECT"},"0006491":{"cq":"CQ_ECT"},"0006496":{"cq":"CQ_ECT"},"0006503":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006506":{"cq":"CQ_ECT"},"0006512":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006514":{"cq":"CQ_ECT"},"0006518":{"cq":"CQ_FBI"},"0006537":{"cq":"CQ_FBI"},"0006593":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006594":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006595":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0006596":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006597":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006599":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006600":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006601":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006602":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006603":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006611":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006619":{"cq":"CQ_MON"},"0006620":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006621":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006622":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006623":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006624":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006625":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006626":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006627":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006628":{"cq":"CQ_ECT"},"0006645":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006646":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006647":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006648":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006649":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006650":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006651":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006652":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006653":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006654":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006655":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006656":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006657":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006658":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006659":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006660":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006661":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006662":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006663":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006664":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006665":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006666":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006667":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006668":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006669":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006672":{"cq":"CQ_MON"},"0006675":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006681":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006688":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006698":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006699":{"cq":"CQ_FBI"},"0006800":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006852":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0006131":{"cq":"CQ_ECT"},"0006860":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0006864":{"cq":"CQ_FBI"},"0006900":{"cq":"CQ_FBI"},"0006901":{"cq":"CQ_FBI"},"0006902":{"cq":"CQ_FBI"},"0006957":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006975":{"cq":"CQ_FBI"},"0006986":{"cq":"CQ_FBI"},"0006988":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0006996":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007073":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007074":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007075":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007076":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007077":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007078":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007080":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007084":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007085":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007099":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007101":{"cq":"CQ_MON"},"0007102":{"cq":"CQ_MON"},"0007103":{"cq":"CQ_MON"},"0007104":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007107":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007127":{"cq":"CQ_FBI"},"0007129":{"cq":"CQ_FBI"},"0007136":{"cq":"CQ_FBI"},"0007198":{"cq":"CQ_FBI"},"0007201":{"cq":"CQ_ANS"},"0007202":{"cq":"CQ_FBI"},"0007205":{"cq":"CQ_FBI"},"0007214":{"cq":"CQ_ECT"},"0007217":{"cq":"CQ_ECT"},"0007296":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007297":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007305":{"cq":"CQ_ECT"},"0007312":{"cq":"CQ_ECT"},"0007329":{"cq":"CQ_FBI"},"0007330":{"cq":"CQ_FBI"},"0007334":{"cq":"CQ_FBI"},"0007335":{"cq":"CQ_FBI"},"0007336":{"cq":"CQ_FBI"},"0007337":{"cq":"CQ_FBI"},"0007338":{"cq":"CQ_FBI"},"0007339":{"cq":"CQ_FBI"},"0007340":{"cq":"CQ_FBI"},"0007341":{"cq":"CQ_FBI"},"0007346":{"cq":"CQ_FBI"},"0007389":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0007406":{"cq":"CQ_FBI"},"0007407":{"cq":"CQ_FBI"},"0007408":{"vsp":"VSP_ELB","cq":"CQ_ELB"},"0007409":{"cq":"CQ_FBI"},"0007410":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007411":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007412":{"cq":"CQ_FBI"},"0007417":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007421":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007422":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007426":{"cq":"CQ_FBI"},"0007449":{"cq":"CQ_FBI"},"0007450":{"cq":"CQ_FBI"},"0007458":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007473":{"cq":"CQ_FBI"},"0007487":{"cq":"CQ_ECT"},"0007491":{"cq":"CQ_FBI"},"0007492":{"cq":"CQ_FBI"},"0007493":{"cq":"CQ_FBI"},"0007494":{"cq":"CQ_FBI"},"0007495":{"cq":"CQ_FBI"},"0007508":{"cq":"CQ_FBI"},"0007510":{"cq":"CQ_FBI"},"0007515":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007517":{"cq":"CQ_MON"},"0007522":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007526":{"cq":"CQ_FBI"},"0007530":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007531":{"cq":"CQ_FBI"},"0007560":{"cq":"CQ_FBI"},"0007566":{"cq":"CQ_FBI"},"0007567":{"cq":"CQ_FBI"},"0007591":{"cq":"CQ_FBI"},"0007592":{"cq":"CQ_FBI"},"0007601":{"cq":"CQ_ECT"},"0007607":{"cq":"CQ_ECT"},"0007613":{"cq":"CQ_ECT"},"0007619":{"cq":"CQ_ECT"},"0007629":{"cq":"CQ_ECT"},"0007637":{"cq":"CQ_ECT"},"0007643":{"cq":"CQ_ECT"},"0007649":{"cq":"CQ_ECT"},"0007653":{"cq":"CQ_ECT"},"0007657":{"cq":"CQ_FBI"},"0007658":{"cq":"CQ_FBI"},"0007659":{"cq":"CQ_FBI"},"0007666":{"cq":"CQ_ECT"},"0007669":{"cq":"CQ_ECT"},"0007714":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007715":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007716":{"cq":"CQ_MON"},"0007755":{"cq":"CQ_ECT"},"0006566":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0007762":{"cq":"CQ_ECT"},"0007766":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007767":{"cq":"CQ_ECT"},"0007775":{"cq":"CQ_ECT"},"0007917":{"cq":"CQ_ECT"},"0007925":{"cq":"CQ_ECT"},"0007933":{"cq":"CQ_ECT"},"0007941":{"cq":"CQ_ECT"},"0007954":{"cq":"CQ_FBI"},"0007955":{"cq":"CQ_FBI"},"0007958":{"cq":"CQ_ECT"},"0007964":{"cq":"CQ_FBI"},"0007965":{"cq":"CQ_ECT"},"0007978":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007980":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007982":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007984":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007986":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007988":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007990":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007992":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007994":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0007996":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008003":{"cq":"CQ_ECT"},"0008009":{"cq":"CQ_ECT"},"0008016":{"cq":"CQ_FBI"},"0008017":{"cq":"CQ_FBI"},"0008018":{"cq":"CQ_FBI"},"0008019":{"cq":"CQ_FBI"},"0008020":{"cq":"CQ_FBI"},"0008021":{"cq":"CQ_FBI"},"0008022":{"cq":"CQ_FBI"},"0008023":{"cq":"CQ_FBI"},"0008025":{"cq":"CQ_FBI"},"0008034":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008035":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008036":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008037":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008038":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008039":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008040":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008041":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008042":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008043":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008063":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008107":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008108":{"cq":"CQ_ECT"},"0008121":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008126":{"vsp":"VSP_CEN","cq":"CQ_CEN"},"0008155":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008183":{"cq":"CQ_ECT"},"0008201":{"cq":"CQ_FBI"},"0008202":{"cq":"CQ_FBI"},"0008204":{"cq":"CQ_MON"},"0008205":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008296":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008298":{"vsp":"VSP_DEF","cq":"CQ_DEF"},"0008407":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008408":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008409":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008410":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008411":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008412":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008413":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008414":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008415":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008416":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008417":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008418":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008419":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008420":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008421":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008422":{"vsp":"VSP_ECG","cq":"CQ_ECG"},"0008447":{"cq":"CQ_FBI"},"0008448":{"cq":"CQ_FBI"},"0008449":{"cq":"CQ_FBI"},"0008450":{"cq":"CQ_FBI"},"0008451":{"cq":"CQ_FBI"},"0008452":{"cq":"CQ_FBI"},"0008509":{"cq":"CQ_FBI"}};

let DB={};const saved=store.get('session.saved');
// cur (device corrente) e curVerif vivono in store.session.*
function curGet() { return store.get('session.cur'); }
function curSet(d) { store.set('session.cur', d); }
function curVerifGet() { return store.get('session.curVerif'); }
let PRESETS={};

// Database incorporato e compresso (gzip+base64) — nessun file esterno necessari

async function loadPresets(){
  try{
    const vse=await db.preset.list('vse');
    const pVse={};vse.forEach(r=>{pVse[r.codice]=r.dati;});
    PRESETS['PRESET_VSE']=pVse;
    console.log('Preset VSE caricati:',Object.keys(pVse).length);

    const mp=await db.preset.list('mp');
    const pMp={};mp.forEach(r=>{pMp[r.codice]=r.dati;});
    PRESETS['PRESET_MP']=pMp;

    const vsp=await db.preset.list('vsp');
    vsp.forEach(r=>{
      const key='PRESET_'+r.tipo;
      if(!PRESETS[key])PRESETS[key]={};
      PRESETS[key][r.codice]=r.dati;
    });

    const cq=await db.preset.list('cq');
    cq.forEach(r=>{
      const key='PRESET_'+r.tipo;
      if(!PRESETS[key])PRESETS[key]={};
      PRESETS[key][r.codice]=r.dati;
    });
    console.log('Preset caricati da Supabase');
  }catch(e){
    console.error('Preset error:',e);
  }
}


async function initDB(){
  const bar=document.getElementById('db-bar');
  try{
    bar.textContent='Caricamento database...';
    const rows = await db.dispositivi.list({
      select: 'codice,descrizione_classe,costruttore,modello,matricola,presidio,reparto,sede_struttura,codice_padre,nuova_area,presenze_effettive,verifiche,dettagli_stato,forma_presenza,manutentore,civab,data_ultima_vse,data_ultima_vsp,data_ultima_mo,data_ultima_cq',
      limit: 10000
    });
    DB={};
    const VERIF_MAP_NEW={};
    rows.forEach(r=>{
      DB[r.codice]={
        c:r.codice,
        n:r.descrizione_classe||'',
        b:r.costruttore||'',
        m:r.modello||'',
        mat:r.matricola||'',
        loc:r.presidio||'',
        rep:r.reparto||'',
        ss:r.sede_struttura||'',
        cp:r.codice_padre||'',
        na:r.nuova_area||'',
        pe:r.presenze_effettive||'',
        ds:r.dettagli_stato||'',
        fp:r.forma_presenza||'',
        man:r.manutentore||'',
        ver:r.verifiche||'',
        civ:r.civab||'',
        data_ultima_vse:r.data_ultima_vse||null,
        data_ultima_vsp:r.data_ultima_vsp||null,
        data_ultima_mo:r.data_ultima_mo||null,
        data_ultima_cq:r.data_ultima_cq||null
      };
      if(r.verifiche){
        const parts=r.verifiche.split(',').map(s=>s.trim());
        const entry={};
        parts.forEach(p=>{
          if(p.startsWith('VSP_'))entry.vsp=p;
          else if(p.startsWith('CQ_'))entry.cq=p;
        });
        if(Object.keys(entry).length)VERIF_MAP_NEW[r.codice]=entry;
      }
    });
    // Sovrascrivi VERIF_MAP globale
    Object.keys(VERIF_MAP).forEach(k=>delete VERIF_MAP[k]);
    Object.assign(VERIF_MAP,VERIF_MAP_NEW);
    bar.innerHTML='<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#1a3a6b;margin-right:8px;vertical-align:middle;flex-shrink:0;"></span><span>Database pronto</span><span style="font-family:\'IBM Plex Mono\',ui-monospace,monospace;font-size:12px;color:#1a3a6b;margin-left:6px;">— '+Object.keys(DB).length.toLocaleString()+' dispositivi</span>';
    bar.className='db-bar ready';
    await loadJollyMetaFromDB();
    await loadLookupsFromDB();
    await loadPresets();
  }catch(e){
    console.error('DB error:',e);
    bar.textContent='Errore caricamento database: '+e.message;
    bar.className='db-bar error';
  }
}

// ── Costanti globali lookup ───────────────────────────────────
const LOOKUP_KEYS = new Set([
  'descrizione_classe','costruttore','modello','presidio','reparto','nuova_area',
  'sede_struttura','civab','verifiche','dettagli_stato','manutentore',
  'periodicita_vse','periodicita_vsp','periodicita_mo','periodicita_cq',
  'esito_ultima_vse','esito_ultima_vsp','esito_ultima_mo','esito_ultima_cq',
  'presenze_effettive','cliente','proprieta','forma_presenza',
]);

const DATE_KEYS = new Set([
  'proposta_dismissione','dismissione_effettiva','data_fine_garanzia',
  'data_ultima_vse','data_prossima_vse','data_ultima_vsp','data_prossima_vsp',
  'data_ultima_mo','data_prossima_mo','data_ultima_cq','data_prossima_cq',
  'fine_service_comodato','data_collaudo',
  'data_inizio_gestione','data_delibera',
]);

const FIELD_DL = {
  descrizione_classe: 'dl-classe',
  costruttore:        'dl-costruttore',
  modello:            'dl-modello',
  presidio:           'dl-presidio',
  reparto:            'dl-reparto',
  nuova_area:         'dl-area',
  sede_struttura:     'dl-sede',
  civab:              'dl-civab',
  verifiche:          'dl-verifiche',
  dettagli_stato:     'dl-stato',
  manutentore:        'dl-manutentore',
  periodicita_vse:    'dl-periodicita',
  periodicita_vsp:    'dl-periodicita',
  periodicita_mo:     'dl-periodicita',
  periodicita_cq:     'dl-periodicita',
  esito_ultima_vse:   'dl-esito',
  esito_ultima_vsp:   'dl-esito',
  esito_ultima_mo:    'dl-esito',
  esito_ultima_cq:    'dl-esito',
  presenze_effettive: 'dl-presenze',
  cliente:            'dl-cliente',
  proprieta:          'dl-proprieta',
  forma_presenza:     'dl-presenza',
};

function buildLookups() {
  const sets = {
    descrizione_classe: new Set(), costruttore: new Set(), modello: new Set(),
    presidio: new Set(), reparto: new Set(), sede_struttura: new Set(), nuova_area: new Set(),
    verifiche: new Set(), manutentore: new Set(), dettagli_stato: new Set(),
    presenze_effettive: new Set(), forma_presenza: new Set(),
    periodicita_vse: new Set(), periodicita_vsp: new Set(), periodicita_mo: new Set(), periodicita_cq: new Set(),
    esito_ultima_vse: new Set(), esito_ultima_vsp: new Set(), esito_ultima_mo: new Set(), esito_ultima_cq: new Set(),
    civab: new Set(), cliente: new Set(), proprieta: new Set(),
  };
  const modelliByCostr = {};
  for (const d of Object.values(DB)) {
    if (d.n)   sets.descrizione_classe.add(d.n);
    if (d.b)   sets.costruttore.add(d.b);
    if (d.m)   { sets.modello.add(d.m); if (d.b) { if (!modelliByCostr[d.b]) modelliByCostr[d.b] = new Set(); modelliByCostr[d.b].add(d.m); } }
    if (d.loc) sets.presidio.add(d.loc);
    if (d.rep) sets.reparto.add(d.rep);
    if (d.ss)  sets.sede_struttura.add(d.ss);
    if (d.na)  sets.nuova_area.add(d.na);
    if (d.man) sets.manutentore.add(d.man);
    if (d.ds)  sets.dettagli_stato.add(d.ds);
    if (d.pe)  sets.presenze_effettive.add(d.pe);
    if (d.fp)  sets.forma_presenza.add(d.fp);
    if (d.ver) sets.verifiche.add(d.ver);
    if (d.civ) sets.civab.add(d.civ);
  }
  // Merge con stored lookups (da Supabase)
  const stored = window._storedLookups || {};
  for (const [campo, values] of Object.entries(stored)) {
    if (!sets[campo]) sets[campo] = new Set();
    for (const v of (values || [])) if (v) sets[campo].add(v);
  }
  window._lookupSets     = sets;
  window._modelliByCostr = modelliByCostr;
  // Popola datalist statici
  const periodicita = new Set([...sets.periodicita_vse,...sets.periodicita_vsp,...sets.periodicita_mo,...sets.periodicita_cq]);
  const esito       = new Set([...sets.esito_ultima_vse,...sets.esito_ultima_vsp,...sets.esito_ultima_mo,...sets.esito_ultima_cq]);
  const dlMap = {
    'dl-classe':      sets.descrizione_classe,
    'dl-presidio':    sets.presidio,
    'dl-reparto':     sets.reparto,
    'dl-sede':        sets.sede_struttura,
    'dl-area':        sets.nuova_area,
    'dl-costruttore': sets.costruttore,
    'dl-modello':     sets.modello,
    'dl-manutentore': sets.manutentore,
    'dl-stato':       sets.dettagli_stato,
    'dl-presenza':    sets.forma_presenza,
    'dl-presenze':    sets.presenze_effettive,
    'dl-verifiche':   sets.verifiche,
    'dl-cliente':     sets.cliente,
    'dl-proprieta':   sets.proprieta,
    'dl-civab':       sets.civab,
    'dl-periodicita': periodicita,
    'dl-esito':       esito,
  };
  for (const [id, set] of Object.entries(dlMap)) {
    const dl = document.getElementById(id);
    if (!dl) continue;
    dl.innerHTML = [...set].sort().map(v => `<option value="${_esc(v)}">`).join('');
  }
  // Datalist jolly bloccate (create on demand)
  try {
    const jmeta = getJollyMeta();
    jmeta.forEach((m, idx) => {
      if (m.type !== 'bloccata') return;
      const jollyKey = `jolly_${idx + 1}`;
      const dlId     = `dl-${jollyKey}`;
      let dl = document.getElementById(dlId);
      if (!dl) { dl = document.createElement('datalist'); dl.id = dlId; document.body.appendChild(dl); }
      const jollySet = sets[jollyKey] || new Set();
      dl.innerHTML = [...jollySet].sort().map(v => `<option value="${_esc(v)}">`).join('');
    });
  } catch(e) {}
}

function updateModelloDatalist(costruttore) {
  const dl = document.getElementById('dl-modello');
  if (!dl || !window._modelliByCostr) return;
  const set = window._modelliByCostr[costruttore] || new Set();
  dl.innerHTML = [...set].sort().map(v => `<option value="${_esc(v)}">`).join('');
}

async function loadLookupsFromDB() {
  try {
    const rows = await db.lookupAsl.listByAsl();
    const stored = {};
    for (const { campo, valore } of (rows || [])) {
      if (!stored[campo]) stored[campo] = [];
      stored[campo].push(valore);
    }
    window._storedLookups = stored;
  } catch(e) {}
  buildLookups();
}

async function saveLookupValue(campo, valore) {
  if (!campo || !valore) return;
  // Aggiorna memoria locale
  if (!window._storedLookups) window._storedLookups = {};
  if (!Array.isArray(window._storedLookups[campo])) window._storedLookups[campo] = [];
  if (!window._storedLookups[campo].includes(valore)) window._storedLookups[campo].push(valore);
  if (!window._lookupSets) window._lookupSets = {};
  if (!window._lookupSets[campo]) window._lookupSets[campo] = new Set();
  window._lookupSets[campo].add(valore);
  // Aggiorna datalist
  const dlId = FIELD_DL[campo] || (campo.startsWith('jolly_') ? `dl-${campo}` : null);
  if (dlId) {
    const dl = document.getElementById(dlId);
    if (dl && ![...dl.options].some(o => o.value === valore)) {
      const opt = document.createElement('option'); opt.value = valore; dl.appendChild(opt);
    }
  }
  // Aggiorna modelliByCostr per campo modello
  if (campo === 'modello') {
    const costrEl = document.querySelector('[data-k="costruttore"]');
    const costr = costrEl?.value?.trim();
    if (costr) {
      if (!window._modelliByCostr) window._modelliByCostr = {};
      if (!window._modelliByCostr[costr]) window._modelliByCostr[costr] = new Set();
      window._modelliByCostr[costr].add(valore);
      updateModelloDatalist(costr);
    }
  }
  // Salva su Supabase (fire-and-forget)
  db.lookupAsl.insert(campo, valore).catch(e => console.warn('[saveLookupValue]', e));
}

async function deleteLookupValue(campo, valore) {
  if (!campo || !valore) return false;
  // Prima tenta la DELETE remota — non toccare lo stato locale finché non è confermata.
  let rows;
  try {
    rows = await db.lookupAsl.delete_(campo, valore);
  } catch (e) {
    console.warn('[deleteLookupValue] errore rete/HTTP', e);
    if (typeof toast === 'function') toast(`Errore eliminazione: ${e?.message || e}`, false);
    return false;
  }
  if (!Array.isArray(rows) || rows.length === 0) {
    console.warn('[deleteLookupValue] 0 righe cancellate (possibile RLS mancante o filtro non corrispondente)', { campo, valore, asl: db._aslKey() });
    if (typeof toast === 'function') toast('Eliminazione non riuscita: verifica permessi RLS su lookup_asl.', false);
    return false;
  }
  // Solo ora aggiorna stato locale
  if (window._storedLookups?.[campo]) {
    window._storedLookups[campo] = window._storedLookups[campo].filter(v => v !== valore);
  }
  if (window._lookupSets?.[campo]) {
    window._lookupSets[campo].delete(valore);
  }
  const dlId = FIELD_DL[campo] || (campo.startsWith('jolly_') ? `dl-${campo}` : null);
  if (dlId) {
    const dl = document.getElementById(dlId);
    if (dl) { const opt = [...dl.options].find(o => o.value === valore); if (opt) opt.remove(); }
  }
  return true;
}

function isValidLookup(campo, valore) {
  if (!valore) return true;
  const set = window._lookupSets?.[campo];
  // Set vuoto = nessun valore configurato = nessuna restrizione
  return !set || set.size === 0 || set.has(valore);
}

function onSearch(){const q=document.getElementById('search-input').value.trim();if(q.length>=2)doSearch();else document.getElementById('results').innerHTML='';}

function doSearch(){
  const q=document.getElementById('search-input').value.trim().toLowerCase();
  if(!q||!Object.keys(DB).length)return;
  const res=[];
  const pad=q.replace(/\D/g,'').padStart(7,'0');
  if(DB[pad])res.push(DB[pad]);
  for(const d of Object.values(DB)){
    if(res.length>=7)break;
    if(d===res[0])continue;
    if(d.c.includes(q)||d.n.toLowerCase().includes(q)||d.b.toLowerCase().includes(q))res.push(d);
  }
  const box=document.getElementById('results');
  if(!res.length){box.innerHTML='<div class="not-found">Nessun apparecchio trovato</div>';return;}
  box.innerHTML=res.map(d=>{
    const s=saved[d.c];
    const vm=VERIF_MAP[d.c];
    const extraTags=vm?[vm.vsp,vm.cq].filter(Boolean).map(t=>`<span class="r-tag part">${t}</span>`).join(''):'';
    const doneTags=s?`<span class="r-tag done">${[s.vse_saved?'VSE':'',s.mp_saved?'MP':''].filter(Boolean).join('+')}</span>`:'';
    const attTag=attesiSet().has(d.c)&&!s?`<span class="r-tag pending">atteso</span>`:'';
    return`<div class="result-item" onclick="sel('${d.c}')">
      <span class="r-cod">${d.c}</span>
      <span class="r-nome">${d.n.toLowerCase()}</span>
      <span class="r-stato">${doneTags}${attTag}${extraTags}</span>
      <span class="r-loc">${(d.pre||'').split(' ')[0]}</span>
    </div>`;
  }).join('');
}

function sel(cod){
  const d=DB[cod];if(!d)return;
  curSet(d);
  // Get verif info from map (fallback: VS+MP only)
  store.set('session.curVerif', VERIF_MAP[cod]||null);
  document.getElementById('results').innerHTML='';
  document.getElementById('search-input').value='';
  document.getElementById('form-area').style.display='block';
  const gbBtn=document.getElementById('btn-gestione-bene-scheda');
  if(gbBtn) gbBtn.style.display=can('anagrafica_write')?'':'none';
  fillVSE(d);
  fillMPHeader(d);
  resetMPPoints();
  resetVSP();
  resetCQ();
  // Build VSP/CQ if needed
  const _cv=curVerifGet();
  if(_cv&&_cv.vsp){buildVSPPoints(_cv.vsp);fillVSPHeader(d);}
  if(_cv&&_cv.cq){buildCQPoints(_cv.cq);fillCQHeader(d);}
  updateTabs();
  switchTab('vse');
  // Restore saved if exists, altrimenti applica i preset
  const hasSaved = saved[cod];
  if(hasSaved){
    if(hasSaved.vse_saved)restoreVSE(hasSaved);
    if(hasSaved.mp_saved)loadMPSaved(hasSaved);
    if(hasSaved.vsp_saved)loadVSPSaved(hasSaved);
    if(hasSaved.cq_saved)loadCQSaved(hasSaved);
    updateTabIndicators();
  } else {
    // Nessun dato salvato: applica preset come valori di default
    setTimeout(()=>fillVSEPreset(d.c),50);
    setTimeout(()=>fillMPPreset(d.c),50);
    const _cv2=curVerifGet();
    if(_cv2&&_cv2.vsp) setTimeout(()=>fillVSPPreset(d.c,_cv2.vsp),50);
    if(_cv2&&_cv2.cq)  setTimeout(()=>fillCQPreset(d.c,_cv2.cq),50);
  }
  document.getElementById('form-area').scrollIntoView({behavior:'smooth',block:'start'});
  // Aggiorna classe active sui chip senza ri-renderizzare tutto
  document.querySelectorAll('#chips .chip[data-cod]').forEach(el=>{
    if(el.dataset.cod===cod) el.classList.add('active');
    else el.classList.remove('active');
  });
}

function renderSession(){
  const keys=Object.keys(saved);
  const pending=[...attesiSet()].filter(c=>!saved[c]);
  document.getElementById('btn-xlsx').disabled=keys.length===0;
  const bxm=document.getElementById('btn-xlsx-mobile');if(bxm)bxm.disabled=keys.length===0;
  const bem=document.getElementById('btn-export-massivo');if(bem)bem.disabled=keys.length===0;
  const bemm=document.getElementById('btn-export-massivo-m');if(bemm)bemm.disabled=keys.length===0;
  const bodl=document.getElementById('btn-compila-odl');if(bodl)bodl.disabled=keys.length===0;
  const bodlm=document.getElementById('btn-compila-odl-m');if(bodlm)bodlm.disabled=keys.length===0;
  const chips=document.getElementById('chips');
  const stats=document.getElementById('sess-stats');
  if(!keys.length&&!pending.length){
    const _emptyAdd=currentSessionId&&canEditSession()?`<div style="display:flex;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);flex-basis:100%">
      <input type="text" id="inline-attesi-input" placeholder="Codice dispositivo..." autocomplete="off"
        style="flex:1;padding:5px 8px;border:1px solid var(--border2);border-radius:var(--rad);font-size:12px;background:var(--bg);color:var(--text);min-width:0"
        onkeydown="if(event.key==='Enter')addAttesiInline()">
      <button onclick="addAttesiInline()" style="padding:5px 12px;font-size:12px;border:none;border-radius:var(--rad);background:var(--info);color:#fff;cursor:pointer;white-space:nowrap;font-weight:600">+ Aggiungi</button>
    </div>`:'';
    chips.innerHTML='<span class="sess-empty">Nessun apparecchio compilato</span>'+_emptyAdd;
    stats.style.display='none';document.getElementById('export-preview').style.display='none';return;
  }
  const _flagBtn=(cod,flag,label,active)=>
    `<span onclick="event.stopPropagation();toggleDevFlag('${cod}','${flag}')" title="${flag==='non_reperibile'?'Non reperibile':'Non eseguita'}"
      style="font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:3px;cursor:pointer;line-height:1.4;${
        active?'background:var(--ko-bg);color:var(--ko);border:1px solid rgba(185,28,28,.3)':'background:var(--bg3);color:var(--text3);border:1px solid var(--border)'
      }">${label}</span>`;
  const savedChips=keys.map(k=>{
    const s=saved[k];const _c=curGet();const act=_c&&_c.c===k;
    const isNR=!!s.non_reperibile;const isNE=!!s.non_eseguita;
    const both=s.vse_saved&&s.mp_saved;
    const cls=isNR||isNE?'part':both?'done':'part';
    return`<div class="chip ${cls}${act?' active':''}" data-cod="${k}" onclick="sel('${k}')">
      <div class="chip-dot"></div><span>${k}</span>${_flagBtn(k,'non_reperibile','NR',isNR)}${_flagBtn(k,'non_eseguita','NE',isNE)}
    </div>`;
  }).join('');
  const _canEdit = canEditSession();
  const pendingChips=pending.map(c=>{
    const rmBtn=_canEdit?`<span onclick="event.stopPropagation();removeFromAttesi('${c}')" title="Rimuovi dagli attesi"
      style="font-size:10px;font-weight:700;padding:1px 5px;border-radius:3px;margin-left:3px;cursor:pointer;line-height:1.4;background:var(--ko-bg);color:var(--ko);border:1px solid rgba(185,28,28,.3)">✕</span>`:'';
    const _c2=curGet();
    return`<div class="chip pending${_c2&&_c2.c===c?' active':''}" data-cod="${c}" onclick="sel('${c}')" title="Da verificare">
      <div class="chip-dot"></div><span>${c}</span>${_flagBtn(c,'non_reperibile','NR',false)}${_flagBtn(c,'non_eseguita','NE',false)}${rmBtn}
    </div>`;
  }).join('');
  const addBar=currentSessionId&&_canEdit?`<div style="display:flex;gap:6px;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);flex-basis:100%">
    <input type="text" id="inline-attesi-input" placeholder="Codice dispositivo..." autocomplete="off"
      style="flex:1;padding:5px 8px;border:1px solid var(--border2);border-radius:var(--rad);font-size:12px;background:var(--bg);color:var(--text);min-width:0"
      onkeydown="if(event.key==='Enter')addAttesiInline()">
    <button onclick="addAttesiInline()" style="padding:5px 12px;font-size:12px;border:none;border-radius:var(--rad);background:var(--info);color:#fff;cursor:pointer;white-space:nowrap;font-weight:600">+ Aggiungi</button>
  </div>`:''
  chips.innerHTML=savedChips+pendingChips+addBar;
  const totalAttesi=attesiSet().size||keys.length;
  const done=keys.filter(k=>saved[k].vse_saved&&saved[k].mp_saved).length;
  const vspCount=keys.filter(k=>saved[k].vsp_saved).length;
  const cqCount=keys.filter(k=>saved[k].cq_saved).length;
  let statsText=attesiSet().size?`${done}/${totalAttesi} completati`:`${keys.length} dispositivi`;
  if(vspCount)statsText+=' · '+vspCount+' VSP';
  if(cqCount)statsText+=' · '+cqCount+' CQ';
  stats.textContent=statsText;
  stats.style.display='block';
  if(keys.length){
    document.getElementById('export-preview').style.display='block';
    document.getElementById('export-rows').innerHTML=keys.map(k=>{
      const s=saved[k];const d=DB[k]||{};
      return`<div class="ex-row">
        <span class="ex-cod">${k}</span>
        <span class="ex-nome">${(d.n||'').toLowerCase()}</span>
        <span class="ex-tags">
          ${s.non_reperibile?`<span class="badge warn">Non reperibile</span>`:s.non_eseguita?`<span class="badge warn">Non eseguita</span>`:''}
          ${!s.non_reperibile&&!s.non_eseguita&&s.vse_saved?`<span class="badge ${s.giu==='POSITIVO'?'pos':'neg'}">VSE ${s.giu==='POSITIVO'?'✓':'✗'}</span>`:''}
          ${!s.non_reperibile&&!s.non_eseguita&&s.mp_saved?`<span class="badge info">MP ✓</span>`:''}
          ${!s.non_reperibile&&!s.non_eseguita&&s.vsp_saved?`<span class="badge info">${s.vsp_type} ✓</span>`:''}
          ${!s.non_reperibile&&!s.non_eseguita&&s.cq_saved?`<span class="badge info">${s.cq_type} ✓</span>`:''}
        </span>
        ${_canEdit?`<button onclick="removeFromSession('${k}')" style="padding:2px 8px;font-size:11px;border:1px solid var(--ko);border-radius:var(--rad);background:transparent;color:var(--ko);cursor:pointer;flex-shrink:0">✕</button>`:''}
      </div>`;
    }).join('');
  } else {
    document.getElementById('export-preview').style.display='none';
  }
}
async function removeFromSession(cod) {
  if (!canEditSession()) { toast('Non hai i permessi per modificare questa sessione', 'warn'); return; }
  if (!confirm('Rimuovere ' + cod + ' dalla sessione?\nI dati salvati verranno eliminati.')) return;
  try { await db.schede.deleteOne(currentSessionId, cod); } catch(e) { console.error('removeFromSession:', e); }
  delete saved[cod];
  const _c=curGet();
  if (_c && _c.c === cod) { curSet(null); store.set('session.curVerif', null); document.getElementById('form-area').style.display = 'none'; }
  renderSession();
  scheduleSync();
  toast('Dati rimossi: ' + cod + (attesiSet().has(cod) ? ' (tornato in attesa)' : ''), 'warn');
}

function removeFromAttesi(cod) {
  if (!canEditSession()) { toast('Non hai i permessi per modificare questa sessione', 'warn'); return; }
  if (!confirm('Rimuovere ' + cod + ' dagli attesi?')) return;
  _attesiMut(s => s.delete(cod));
  renderSession();
  scheduleSync();
  toast('Rimosso dagli attesi: ' + cod, 'warn');
}

function addAttesiInline() {
  if (!currentSessionId || !canEditSession()) return;
  const inp = document.getElementById('inline-attesi-input');
  if (!inp) return;
  const txt = inp.value.trim();
  if (!txt) { toast('Inserisci almeno un codice', 'warn'); return; }
  const codici = txt.split(/[\s,;]+/).map(c => c.replace(/\D/g,'').padStart(7,'0')).filter(c => c.length === 7);
  const validi = codici.filter(c => DB[c]);
  const nonTrovati = codici.filter(c => !DB[c]);
  _attesiMut(s => validi.forEach(c => s.add(c)));
  inp.value = '';
  renderSession();
  if (validi.length) scheduleSync();
  const msg = (validi.length ? validi.length + ' aggiunto/i agli attesi' : '') +
              (nonTrovati.length ? (validi.length ? ' · ' : '') + nonTrovati.length + ' non trovato/i' : '');
  if (msg) toast(msg, validi.length ? 'ok' : 'warn');
}

function toast(msg,type){
  const t=document.getElementById('toast');
  t.textContent=msg;t.className='toast show'+(type==='ok'?' ok':type==='warn'?' warn':'');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// ── Toggle ambiente prod / staging ────────────────────────────
// Staging: hostname contiene "staging" oppure è localhost/127.0.0.1.
// Produzione: tutto il resto (incluso GitHub Pages "appwitch22.github.io").
// Per testare staging in locale: aprire http://localhost:... oppure ospitare
// su un dominio con "staging" nel nome.
const IS_STAGING = /staging/i.test(location.hostname)
                || location.hostname === 'localhost'
                || location.hostname === '127.0.0.1';

const SUPA_URL = IS_STAGING
  ? 'https://ednnmbhhbsiqjcxtjzfd.supabase.co'
  : 'https://ttgvuoiznybjdyhlshpt.supabase.co';

const SUPA_KEY = IS_STAGING
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbm5tYmhoYnNpcWpjeHRqemZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDgxMzYsImV4cCI6MjA5MjEyNDEzNn0.g5uYyvexvrqDcEUQ1UpHT6cTKXrfSojWf2jxubG5G6Y'
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Z3Z1b2l6bnliamR5aGxzaHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNDc2OTIsImV4cCI6MjA4OTcyMzY5Mn0.Igk1hjHa_yY70FfDay6oCQRYo5EhIoCh-8H2u9NAXxo';

const supa = supabase.createClient(SUPA_URL, SUPA_KEY);

// Banner visivo se in staging — evita confusione tra ambienti
if (IS_STAGING) {
  console.warn('[AppWitch] Running in STAGING mode →', SUPA_URL);
  document.addEventListener('DOMContentLoaded', () => {
    const b = document.createElement('div');
    b.textContent = 'STAGING';
    b.style.cssText = 'position:fixed;top:0;right:0;z-index:9999;background:#ff8800;color:#000;font:bold 11px sans-serif;padding:2px 8px;border-bottom-left-radius:4px;';
    document.body.appendChild(b);
  });
}

// currentUser vive in store.user.current; manteniamo questo alias come mirror
// automatico per non toccare i 57 consumer sparsi. Unica fonte di verità: store.
let currentUser = null;
store.subscribe('user.current', () => { currentUser = store.get('user.current'); });

const ROLE_LABELS = {
  tecnico:        'Tecnico',
  responsabile:   'Responsabile',
  amministrativo: 'Amministrativo',
  admin:          'Admin'
};

function can(flag) {
  const p = currentUser?.profile;
  if (!p) return false;
  if (p.role === 'admin') return true;
  return p.permissions?.[flag] === true;
}

document.body.insertAdjacentHTML('afterbegin', `
<div id="login-screen">
  <div class="login-box">
    <div class="login-logo">
      <svg width="100%" viewBox="0 0 420 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="8" x2="420" y2="8" stroke="#C8A96E" stroke-width="0.8"/>
        <text x="0" y="57" font-family="'Playfair Display',serif" font-size="46" font-weight="700" fill="#8B0000" letter-spacing="-1">App</text>
        <text x="107" y="57" font-family="'Playfair Display',serif" font-size="46" font-weight="700" fill="#C8A96E" letter-spacing="-1">Witch</text>
        <line x1="0" y1="68" x2="58" y2="68" stroke="#C8A96E" stroke-width="1" opacity="0.35"/>
        <polyline points="58,68 64,68 67,59 70,77 73,64 76,72 79,68 230,68" stroke="#C8A96E" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.7"/>
        <line x1="230" y1="68" x2="420" y2="68" stroke="#C8A96E" stroke-width="1" opacity="0.35"/>
        <text x="0" y="84" font-family="'IBM Plex Sans',sans-serif" font-size="12" font-weight="500" fill="#1A3A6B" letter-spacing="3">GESTIONALE · DISPOSITIVI MEDICI</text>
      </svg>
    </div>
    <div class="login-field">
      <label>Email</label>
      <input type="email" id="l-email" placeholder="nome@asl.it" autocomplete="email">
    </div>
    <div class="login-field">
      <label>Password</label>
      <input type="password" id="l-pass" placeholder="••••••••" autocomplete="current-password">
    </div>
    <button class="login-btn" id="l-btn" onclick="doLogin()">Accedi</button>
    <div class="login-err" id="l-err"></div>
  </div>
</div>
`);

document.querySelector('.app').insertAdjacentHTML('afterbegin', `
<div id="user-bar">
  <div><span class="u-name" id="u-name"></span><span class="u-role" id="u-role"></span></div>
 <button onclick="openAdmin()" id="btn-admin" style="display:none">Admin</button>
  <button onclick="toggleAnagrafica()">Anagrafica</button>
  <button onclick="doLogout()">Esci</button>
</div>
`);

// NOTA: doLogin/onLogin/doLogout/checkSession + supaToken/supaHdrs estratti
// in js/auth.js (Step B2). Il keydown listener su #l-pass vive lì.

const CP_ICONS = {
  verifica:  `<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="3.5" stroke="currentColor" stroke-width="1.4"/><path d="M9 9L11.5 11.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  sessioni:  `<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M4 5h6M4 7.5h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  anagrafica:`<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M1.5 11L4 6l3 3 2-5L13 11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tabella:   `<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="11" height="11" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M1.5 5h11M5 5v7" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  archivio:  `<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M2 5h10v7a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" stroke="currentColor" stroke-width="1.3"/><path d="M1 2h12v3H1z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M5.5 8.5h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>`,
  storico:   `<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M7 4v3.5l2 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  gestione:  `<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M4.5 6h5M4.5 8.5h3" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><circle cx="7" cy="1.5" r="1" stroke="currentColor" stroke-width="1.1"/></svg>`,
  admin:     `<svg width="18" height="18" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`,
};

function buildCPGrid(role) {
  const grid = document.getElementById('cp-grid');
  if (!grid) return;
  const cards = [];
  if (can('verifica'))        cards.push({ key:'verifica',   color:'',      title:'Verifica',            desc:'Cerca e compila schede dispositivi',      action:"sbNav('verifica');document.getElementById('search-input').focus()" });
  if (can('sessioni'))        cards.push({ key:'sessioni',   color:'',      title:'Sessioni',            desc:'Crea o riprendi una sessione di lavoro',  action:"openSessModal()" });
  if (can('anagrafica_read')) cards.push({ key:'anagrafica', color:'green', title:'Anagrafica',          desc:'Consulta l\'elenco dispositivi',          action:"sbNav('anagrafica');toggleAnagrafica()" });
  if (can('anagrafica_read')) cards.push({ key:'tabella',    color:'green', title:'Tabella',             desc:'Vista tabellare con filtri avanzati',     action:"sbNav('tabella');toggleTabella()" });
  if (can('anagrafica_read')) cards.push({ key:'storico',    color:'green', title:'Storico Verifiche',   desc:'Tabella storica verifiche con filtri',    action:"sbNav('storico');openStoricoTable()" });
  if (can('archivio_cloud'))  cards.push({ key:'archivio',   color:'slate', title:'Archivio cloud',      desc:'Sessioni salvate e report Excel',         action:"sbNav('archivio');openArchivioModal()" });
  if (currentUser?.profile?.role === 'admin') {
    cards.push({ key:'admin', color:'red', title:'Amministrazione', desc:'Utenti, ruoli e gestione database', action:"openAdmin()" });
  }
  grid.innerHTML = cards.map(c => `
    <div class="cp-card" onclick="${c.action}">
      <div class="cp-card-icon${c.color ? ' '+c.color : ''}">${CP_ICONS[c.key]}</div>
      <div class="cp-card-title">${c.title}</div>
      <div class="cp-card-desc">${c.desc}</div>
    </div>`).join('');
}

function showHome() {
  ['verifica','sessione','anagrafica','tabella','archivio','storico'].forEach(k => {
    const sb = document.getElementById('sb-nav-' + k); if (sb) sb.classList.remove('active');
    const bn = document.getElementById('bnav-' + k);   if (bn) bn.classList.remove('active');
  });
  ['verifica-section','anag-section','tabella-section','storico-section'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
  const home = document.getElementById('home-section');
  if (home) home.style.display = '';
  renderHome();
  if (window.innerWidth < 768 && document.body.classList.contains('sidebar-open')) {
    if (typeof toggleSidebar === 'function') toggleSidebar();
  }
}

function renderHome() {
  const box = document.getElementById('home-sess-box');
  if (!box) return;
  if (currentSessionId) {
    const count = Object.keys(saved).length;
    const attesiCount = attesiSet()?.size || 0;
    const dateStr = currentSessionDate
      ? new Date(currentSessionDate).toLocaleDateString('it-IT', {day:'2-digit',month:'short',year:'numeric'})
      : '';
    box.innerHTML = `
      <div class="home-sess-box">
        <div class="home-sess-label">
          <span class="sess-sync-dot synced" style="display:inline-block;flex-shrink:0"></span>
          Sessione in corso
        </div>
        <div class="home-sess-title">${currentSessionTitle || '—'}</div>
        <div class="home-sess-meta">${count} dispositivi compilati${attesiCount ? ' · ' + attesiCount + ' attesi' : ''}${dateStr ? ' · ' + dateStr : ''}</div>
        <div class="home-sess-acts">
          <button class="btn-salva" onclick="sbNav('verifica');document.getElementById('search-input').focus()">→ Continua verifica</button>
          <button class="btn-sm danger" onclick="chiudiSessione()">✕ Chiudi sessione</button>
        </div>
      </div>`;
  } else {
    box.innerHTML = '';
  }
}

async function showApp() {
  const p = currentUser?.profile;
  if (!p) { console.error('showApp: profilo non disponibile'); return; }
  const roleLabel = ROLE_LABELS[p.role] || p.role || '—';
  document.getElementById('u-name').textContent = p.full_name || '—';
  document.getElementById('u-role').textContent = ' · ' + roleLabel;
  document.getElementById('user-bar').style.display = 'flex';
  if (p.role === 'admin') document.getElementById('btn-admin').style.display = '';
  document.getElementById('login-screen').style.display = 'none';
  // Sidebar + bottom nav
  document.getElementById('sb-name').textContent = p.full_name || '—';
  document.getElementById('sb-meta').textContent = roleLabel + (p.asl_key ? ' · ASL ' + p.asl_key.toUpperCase() : '');
  document.body.classList.add('logged-in');
  // Popola header pannello di controllo
  const nome = p.full_name ? p.full_name.split(' ')[0] : '—';
  const greetEl = document.getElementById('home-greeting');
  if (greetEl) greetEl.textContent = 'Benvenuto, ' + nome;
  const roleEl = document.getElementById('home-role');
  if (roleEl) roleEl.textContent = roleLabel + (p.asl_key ? ' · ASL ' + p.asl_key.toUpperCase() : '');
  // Costruisce le card del pannello (una volta sola, in base al ruolo)
  buildCPGrid(p.role);
  // Mostra pannello come landing screen
  showHome();
  if (p.role === 'admin') {
    document.getElementById('sb-btn-admin').style.display = '';
    document.getElementById('sb-btn-gestione-db').style.display = '';
  }
  const listBtn = document.getElementById('sb-btn-liste');
  if (listBtn) listBtn.style.display = can('lookup_write') ? '' : 'none';
  const amBtn = document.getElementById('btn-agg-massivo');
  if (amBtn) amBtn.style.display = can('aggiornamento_massivo') ? '' : 'none';
  const smBtn = document.getElementById('btn-sost-massiva');
  if (smBtn) smBtn.style.display = can('aggiornamento_massivo') ? '' : 'none';
  // Sidebar: mostra/nascondi voci in base ai permessi
  const sbShow = (id, flag) => {
    const el = document.getElementById(id);
    if (el) el.style.display = flag ? '' : 'none';
  };
  sbShow('sb-nav-verifica',   can('verifica'));
  sbShow('bnav-verifica',     can('verifica'));
  sbShow('sb-nav-anagrafica', can('anagrafica_read'));
  sbShow('sb-nav-tabella',    can('anagrafica_read'));
  sbShow('sb-nav-storico',    can('anagrafica_read'));
  sbShow('bnav-storico',      can('anagrafica_read'));
  sbShow('sb-nav-archivio',   can('archivio_cloud'));
  sbShow('bnav-archivio',     can('archivio_cloud'));
  sbShow('btn-data-ultima',   can('data_ultima_verifica'));
  sbShow('btn-data-ultima-m', can('data_ultima_verifica'));
  // Bottoni preset personali: visibili solo a chi ha preset_edit_personal
  if (!can('preset_edit_personal')) {
    ['btn-salva-preset','btn-carica-preset','btn-salva-preset-m','btn-carica-preset-m'].forEach(id => {
      const el = document.getElementById(id); if (el) el.style.display = 'none';
    });
  }
  await initDB();
}

// Iscrive la sync bar allo store — qualunque cambio a ui.* re-renderizza
store.subscribe('ui', () => updateSyncBar());

let currentSessionId        = null;   // UUID sessione attiva
let currentSessionTitle     = null;   // Titolo sessione attiva
let currentSessionDate      = null;   // Data verifica della sessione attiva (YYYY-MM-DD)
let currentSessionCreatorId = null;   // utente_id di chi ha creato la sessione

// ── attesi: Set codici dispositivi attesi — vive in store.session.attesi ──
function attesiSet() { return store.get('session.attesi'); }
// Muta il Set clonando (nuovo riferimento → store.set notifica)
function _attesiMut(fn) {
  const s = new Set(store.get('session.attesi'));
  fn(s);
  store.set('session.attesi', s);
}

// Può modificare la lista attesi: admin o chi ha creato la sessione
function canEditSession() {
  if (!currentSessionId) return false;
  if (currentUser?.profile?.role === 'admin') return true;
  return !!currentSessionCreatorId && currentSessionCreatorId === currentUser?.id;
}
let syncPending = false;        // ci sono modifiche da sincronizzare
let syncTimer   = null;         // timer auto-save
let useDataUltimaVerifica = false; // se true, usa data_ultima_vse di ogni dispositivo come data verifica

// NOTA: supaToken/supaHdrs estratti in js/auth.js (Step B2).

// ── Crea nuova sessione ───────────────────────────────────────
async function createSession() {
  const title = document.getElementById('sess-new-title').value.trim();
  if (!title) { toast('Inserisci un nome per la sessione', 'warn'); return; }
  const asl = currentUser?.profile?.asl || 'ASL Benevento';
  // Parse lista dispositivi attesi (se inserita)
  const attesiTxt = document.getElementById('sess-new-attesi').value.trim();
  const attesiList = attesiTxt
    ? attesiTxt.split(/[\s,;]+/).map(c => c.replace(/\D/g,'').padStart(7,'0')).filter(c => c.length === 7 && DB[c])
    : [];
  const today = new Date().toISOString().split('T')[0];
  const dataV = document.getElementById('sess-new-date').value || today;
  let sess;
  try {
    sess = await db.sessioni.create({ titolo: title, utente_id: currentUser.id, asl, data_verifica: dataV });
  } catch(e) { toast('Errore creazione sessione', 'warn'); return; }
  document.getElementById('sess-new-title').value = '';
  document.getElementById('sess-new-attesi').value = '';
  document.getElementById('sess-new-date').value = '';
  // Attiva la sessione (imposta currentSessionId e attesi)
  await activateSession(sess.id, sess.titolo, dataV, currentUser.id);
  // Se ci sono attesi, aggiungili e sincronizza
  if (attesiList.length) {
    _attesiMut(s => attesiList.forEach(c => s.add(c)));
    renderSession();
    await syncSessionNow();
  }
  await loadSessList();
  const msg = attesiList.length ? `Sessione "${sess.titolo}" creata con ${attesiList.length} dispositivi` : `Sessione "${sess.titolo}" creata`;
  toast(msg, 'ok');
}

// ── Attiva una sessione (carica i dati in memoria) ────────────
async function activateSession(id, titolo, dataVerifica, utenteId = null) {
  // Salva sessione corrente prima di cambiare
  if (currentSessionId && Object.keys(saved).length > 0) {
    await syncSessionNow();
  }
  // Reset memoria
  Object.keys(saved).forEach(k => delete saved[k]);
  curSet(null); store.set('session.curVerif', null);
  useDataUltimaVerifica = false;
  _updateDataUltimaBtn();
  document.getElementById('form-area').style.display = 'none';
  currentSessionId        = id;
  currentSessionTitle     = titolo || null;
  currentSessionDate      = dataVerifica || null;
  currentSessionCreatorId = utenteId || null;
  store.patch('session', { id, title: currentSessionTitle, creatorId: currentSessionCreatorId, attesi: new Set() });
  // Popola campi inline edit
  const _inlT = document.getElementById('sess-inline-title');
  const _inlD = document.getElementById('sess-inline-date');
  if (_inlT) _inlT.value = titolo || '';
  if (_inlD) _inlD.value = dataVerifica || '';
  // Carica schede (include la scheda speciale __attesi__ per i dispositivi attesi)
  let schede = null;
  try { schede = await db.schede.listBySessione(id); } catch(e) { console.error('activateSession load:', e); }
  if (schede) {
    schede.forEach(s => {
      if (s.codice === '__attesi__') {
        // Scheda speciale: contiene la lista dispositivi attesi
        _attesiMut(set => (s.dati_vse?.lista || []).forEach(c => set.add(c)));
        return;
      }
      const rec = {
        codice: s.codice,
        ...(s.dati_vse || {}),
        ...(s.dati_mp  || {}),
        ...(s.dati_vsp || {}),
        ...(s.dati_cq  || {}),
        vse_saved: !!s.dati_vse,
        mp_saved:  !!s.dati_mp,
        vsp_saved: !!s.dati_vsp,
        cq_saved:  !!s.dati_cq,
        vsp_type:  s.vsp_type || null,
        cq_type:   s.cq_type  || null,
      };
      saved[s.codice] = rec;
    });
  }
  store.set('ui.syncStatus', 'synced');
  renderSession();
  closeSessModal();
  const home = document.getElementById('home-section');
  if (home && home.style.display !== 'none') renderHome();
  toast('Sessione "' + titolo + '" caricata', 'ok');
}

// ── Sync una scheda su Supabase ───────────────────────────────
async function syncScheda(codice) {
  if (!currentSessionId) return;
  const rec = saved[codice];
  if (!rec) return;

  const payload = {
    sessione_id: currentSessionId,
    codice:      codice,
    dati_vse:    rec.vse_saved ? collectVSEFromRec(rec) : null,
    dati_mp:     rec.mp_saved  ? collectMPFromRec(rec)  : null,
    dati_vsp:    rec.vsp_saved ? collectVSPFromRec(rec) : null,
    dati_cq:     rec.cq_saved  ? collectCQFromRec(rec)  : null,
    vsp_type:    rec.vsp_type || null,
    cq_type:     rec.cq_type  || null,
  };
  try { await db.schede.upsert(payload); }
  catch(e) { console.error('syncScheda fallita:', e); }
}

// ── Sync completa della sessione ─────────────────────────────
async function syncSessionNow() {
  if (!currentSessionId) return;
  syncPending = false;
  store.set('ui.syncStatus', 'syncing');
  const codici = Object.keys(saved);
  for (const cod of codici) {
    await syncScheda(cod);
  }
  // Aggiorna data_aggiornamento della sessione
  try { await db.sessioni.touchAggiornamento(currentSessionId); } catch(e) { console.error('touchAggiornamento:', e); }
  // Salva lista attesi come scheda speciale __attesi__
  if (attesiSet().size > 0) {
    try { await db.schede.upsertAttesi(currentSessionId, [...attesiSet()]); }
    catch(e) { console.error('upsertAttesi:', e); }
  }
  store.set('ui.syncStatus', 'synced');
}

// ── Helper formato data italiano ─────────────────────────────
const _MESI_IT = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
const _MESI_IT_NUM = { gen:1,feb:2,mar:3,apr:4,mag:5,giu:6,lug:7,ago:8,set:9,ott:10,nov:11,dic:12 };

// Converte qualsiasi formato data in "12-mar-2026"
function _fmtDateIT(v) {
  if (!v) return '';
  const s = String(v).trim();
  let d;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    // ISO: YYYY-MM-DD
    const [y,m,dd] = s.substring(0,10).split('-');
    d = new Date(+y, +m-1, +dd);
  } else {
    // Formati con slash: M/D/YY, M/D/YYYY, D/M/YYYY (con eventuale suffisso orario)
    const mSlash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+\d{1,2}:\d{2}.*)?$/);
    if (mSlash) {
      const yr = mSlash[3].length === 2 ? 2000 + +mSlash[3] : +mSlash[3];
      const a = +mSlash[1], b = +mSlash[2];
      if (b > 12) d = new Date(yr, a-1, b);      // M/D: b è giorno > 12
      else        d = new Date(yr, b-1, a);      // D/M: formato italiano
    }
    const mDD = s.match(/^(\d{1,2})-([a-z]{3})-(\d{4})$/i);
    if (mDD) {
      const mo = _MESI_IT_NUM[mDD[2].toLowerCase()];
      if (mo) d = new Date(+mDD[3], mo-1, +mDD[1]);
    }
  }
  if (!d || isNaN(d.getTime())) return s;
  return `${String(d.getDate()).padStart(2,'0')}-${_MESI_IT[d.getMonth()]}-${d.getFullYear()}`;
}

// Converte qualsiasi formato data in ISO YYYY-MM-DD (per Supabase)
function _toISODate(v) {
  if (!v) return null;
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.substring(0,10);
  // Formati con slash: M/D/YY, M/D/YYYY, D/M/YYYY (con eventuale suffisso orario)
  const mSlash = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+\d{1,2}:\d{2}.*)?$/);
  if (mSlash) {
    const yr = mSlash[3].length === 2 ? '20' + mSlash[3] : mSlash[3];
    const a = +mSlash[1], b = +mSlash[2];
    if (b > 12) return `${yr}-${String(a).padStart(2,'0')}-${String(b).padStart(2,'0')}`;  // M/D
    return `${yr}-${String(b).padStart(2,'0')}-${String(a).padStart(2,'0')}`;              // D/M italiano
  }
  const mDD = s.match(/^(\d{1,2})-([a-z]{3})-(\d{4})$/i);
  if (mDD) {
    const mo = _MESI_IT_NUM[mDD[2].toLowerCase()];
    if (mo) return `${mDD[3]}-${String(mo).padStart(2,'0')}-${mDD[1].padStart(2,'0')}`;
  }
  // Seriale Excel numerico
  if (/^\d+$/.test(s)) {
    const n = parseInt(s, 10);
    if (n > 30000 && n < 70000) {
      const d = new Date(Math.round((n - 25569) * 86400 * 1000));
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    }
  }
  return null;
}

// ── Helpers scadenze ─────────────────────────────────────────
function _parsePeriodicitaMesi(val) {
  if (!val) return null;
  const s = String(val).toLowerCase().trim();
  if (s === 'non prevista') return null;
  if (/^(annuale|1\s*anno|12\s*mesi|12)$/.test(s)) return 12;
  if (/^(semestrale|6\s*mesi|6)$/.test(s)) return 6;
  if (/^(biennale|2\s*anni|24\s*mesi|24)$/.test(s)) return 24;
  if (/^(trimestrale|3\s*mesi|3)$/.test(s)) return 3;
  if (/^(quadrimestrale|4\s*mesi|4)$/.test(s)) return 4;
  const n = parseInt(s, 10);
  return isNaN(n) ? null : n;
}

function _calcProssima(dataUltima, periodicita) {
  if (!dataUltima || !periodicita) return null;
  const mesi = _parsePeriodicitaMesi(periodicita);
  if (!mesi) return null;
  const iso = _toISODate(dataUltima);
  if (!iso) return null;
  const [y,m,dd] = iso.split('-');
  const d = new Date(+y, +m-1, +dd);
  if (isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + mesi);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// ── Helpers raccolta dati per tipo ───────────────────────────
function collectVSEFromRec(rec) {
  const keys = ['data','note','ten','tdp','frq','fdp','pot','pdp','mar','fud','fur',
    'cls','cdp','pat','pad','fnz','def','spi','smo','msp','cav','icv','isp','int',
    'pdc','icn','prc','icd','mus','mse','nag','clm','tms','cor','trl','trm','pnl',
    'pnm','pil','pim','pbl','pbm','ibl','ibm','pcl','pcm','icl','icm','giu','vt',
    'vd','mot','str','nrs','ver','vrc','sct','ris_inv','ris_pa'];
  return Object.fromEntries(keys.filter(k => rec[k] != null && rec[k] !== '').map(k => [k, rec[k]]));
}
function collectMPFromRec(rec) {
  const keys = ['mp_data','mp_note','mp_tecnico','mp_data2'];
  for (let i=1;i<=19;i++) keys.push('mp'+i);
  return Object.fromEntries(keys.filter(k => rec[k] != null && rec[k] !== '').map(k => [k, rec[k]]));
}
function collectVSPFromRec(rec) {
  return Object.fromEntries(
    Object.entries(rec).filter(([k,v]) => k.startsWith('vsp_') && v != null && v !== '')
  );
}
function collectCQFromRec(rec) {
  return Object.fromEntries(
    Object.entries(rec).filter(([k,v]) => k.startsWith('cq_') && v != null && v !== '')
  );
}

// ── Barra sync ───────────────────────────────────────────────
// Legge lo stato sync dallo store (ui.syncStatus, session.title).
// Chi vuole cambiare lo stato sync usa store.patch('ui', {...}).
function updateSyncBar() {
  const bar   = document.getElementById('sess-sync-bar');
  const dot   = document.getElementById('sync-dot');
  const dotM  = document.getElementById('sync-dot-mobile');
  const label = document.getElementById('sync-label');
  if (!bar) return;
  bar.style.display = 'block';
  const syncStatus  = store.get('ui.syncStatus');
  const storeTitolo = store.get('session.title');
  let cls;
  if (!currentSessionId) {
    cls = 'sess-sync-dot offline';
    if (label) label.textContent = 'Nessuna sessione attiva';
  } else if (syncStatus === 'syncing') {
    cls = 'sess-sync-dot pending';
    if (label) label.textContent = 'Sincronizzazione...';
  } else if (syncStatus === 'synced') {
    cls = 'sess-sync-dot synced';
    const t = storeTitolo || currentSessionTitle || 'Sessione attiva';
    if (label) label.textContent = canEditSession() ? 'Sincronizzato' : t + ' · Sincronizzato';
  } else {
    // 'dirty' | 'idle' con sessione attiva
    cls = 'sess-sync-dot pending';
    const t = storeTitolo || currentSessionTitle || 'Sessione attiva';
    if (label) label.textContent = canEditSession() ? 'Modifiche in attesa' : t + ' · Modifiche in attesa';
  }
  if (dot) dot.className = cls;
  if (dotM) dotM.className = cls;
  // Inline edit row
  const inlineEdit = document.getElementById('sess-inline-edit');
  const canEdit = canEditSession();
  if (inlineEdit) inlineEdit.style.display = canEdit ? 'flex' : 'none';
  // Bottone Salva
  ['btn-salva-sess','btn-salva-sess-m'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=canEdit?'':'none'; });
  // Bottone Chiudi
  const hasSession = !!currentSessionId;
  ['btn-chiudi-sess','btn-chiudi-sess-m'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=hasSession?'':'none'; });
  // Bottoni Aggiorna Anagrafica / Straordinaria
  const hasSaved = hasSession && Object.keys(saved).length > 0;
  ['btn-sync-prog','btn-sync-straord'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=hasSaved?'':'none'; });
  ['btn-sync-prog-m','btn-sync-straord-m'].forEach(id => { const el=document.getElementById(id); if(el) el.style.display=hasSaved?'':'none'; });
}

// ── Auto-save: schedula sync 3s dopo l'ultima modifica ────────
function scheduleSync() {
  if (!currentSessionId) return;
  syncPending = true;
  store.set('ui.syncStatus', 'dirty');
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncSessionNow(), 3000);
}

// ── Toggle: usa data ultima verifica vs data sessione ─────────
function toggleDataUltimaVerifica() {
  if (!currentSessionId) { toast('Carica prima una sessione', 'warn'); return; }
  useDataUltimaVerifica = !useDataUltimaVerifica;

  // Applica/ripristina date per tutti i dispositivi già in saved
  let countSet = 0, countNoDate = 0;
  Object.keys(saved).forEach(cod => {
    const d = DB[cod];
    if (!d) return;
    if (useDataUltimaVerifica) {
      if (d.data_ultima_vse) { saved[cod].data    = d.data_ultima_vse; countSet++; }
      else countNoDate++;
      if (d.data_ultima_mo)  saved[cod].mp_data  = d.data_ultima_mo;
      else if (!saved[cod].mp_saved) saved[cod].mp_data = currentSessionDate || '';
      if (d.data_ultima_vsp) saved[cod].vsp_data = d.data_ultima_vsp;
      else if (!saved[cod].vsp_saved) saved[cod].vsp_data = currentSessionDate || '';
      if (d.data_ultima_cq)  saved[cod].cq_data  = d.data_ultima_cq;
      else if (!saved[cod].cq_saved) saved[cod].cq_data = currentSessionDate || '';
    } else {
      saved[cod].data    = currentSessionDate || '';
      saved[cod].mp_data = currentSessionDate || '';
      saved[cod].vsp_data = currentSessionDate || '';
      saved[cod].cq_data = currentSessionDate || '';
    }
  });

  // Se c'è un dispositivo aperto aggiorna subito i campi data nei tab
  const _c = curGet();
  if (_c) {
    const d = DB[_c.c];
    const sess = currentSessionDate || '';
    const setF = (id, ultVal) => {
      const el = document.getElementById(id);
      if (el) el.value = (useDataUltimaVerifica && ultVal) ? ultVal : sess;
    };
    setF('f-data',   d?.data_ultima_vse);
    setF('mp-data',  d?.data_ultima_mo);
    setF('vsp-data', d?.data_ultima_vsp);
    setF('cq-data',  d?.data_ultima_cq);
  }

  _updateDataUltimaBtn();
  scheduleSync();

  if (useDataUltimaVerifica) {
    const msg = countSet > 0
      ? `Date impostate: ${countSet} disp.${countNoDate > 0 ? ', ' + countNoDate + ' senza data ultima' : ''}`
      : 'Nessun dispositivo già compilato — verrà applicato all\'apertura';
    toast(msg, 'ok');
  } else {
    toast('Ripristinata data sessione', 'ok');
  }
}

function _updateDataUltimaBtn() {
  ['btn-data-ultima', 'btn-data-ultima-m'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (useDataUltimaVerifica) {
      btn.classList.add('active-mode');
      btn.title = 'Usa data sessione (attualmente: date ultime verifiche)';
    } else {
      btn.classList.remove('active-mode');
      btn.title = 'Imposta date ultime verifiche per tutti i dispositivi';
    }
  });
}

// ── Aggiungi dispositivi attesi alla sessione corrente ────────
async function addAttesiToSession() {
  if (!currentSessionId) { toast('Nessuna sessione attiva', 'warn'); return; }
  const txt = document.getElementById('sess-attesi-input').value.trim();
  if (!txt) { toast('Inserisci almeno un codice', 'warn'); return; }
  const codici = txt.split(/[\s,;]+/).map(c => c.replace(/\D/g,'').padStart(7,'0')).filter(c => c.length === 7);
  const validi = codici.filter(c => DB[c]);
  const nonTrovati = codici.filter(c => !DB[c] && c !== '0000000');
  _attesiMut(s => validi.forEach(c => s.add(c)));
  document.getElementById('sess-attesi-input').value = '';
  renderSession();
  scheduleSync();
  let msg = validi.length + ' dispositivi aggiunti';
  if (nonTrovati.length) msg += ' · ' + nonTrovati.length + ' non trovati nel DB';
  toast(msg, validi.length ? 'ok' : 'warn');
}

// ── Modal sessioni ───────────────────────────────────────────
async function openSessModal() {
  document.getElementById('sess-modal').classList.add('open');
  const editSec = document.getElementById('sess-edit-section');
  if (editSec) editSec.style.display = (currentSessionId && canEditSession()) ? 'block' : 'none';
  const dateEl = document.getElementById('sess-new-date');
  if (dateEl && !dateEl.value) dateEl.value = new Date().toISOString().split('T')[0];
  await loadSessList();
}

async function saveSessionEdits() {
  if (!currentSessionId || !canEditSession()) return;
  const title = (document.getElementById('sess-inline-title')?.value || '').trim();
  const date  = document.getElementById('sess-inline-date')?.value || null;
  if (!title) { toast('Il nome della sessione non può essere vuoto', 'warn'); return; }
  try {
    await db.sessioni.update(currentSessionId, { titolo: title, data_verifica: date });
    currentSessionTitle = title;
    store.set('session.title', title);
    currentSessionDate  = date;
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; }
    await syncSessionNow();
    store.set('ui.syncStatus', 'synced');
    toast('Sessione aggiornata', 'ok');
  } catch(e) {
    toast('Errore salvataggio sessione', 'err');
  }
}
function closeSessModal() {
  document.getElementById('sess-modal').classList.remove('open');
}

function chiudiSessione() {
  if (!currentSessionId) return;
  currentSessionId = null;
  currentSessionTitle = null;
  currentSessionCreatorId = null;
  store.patch('session', { id: null, title: null, creatorId: null, attesi: new Set() });
  Object.keys(saved).forEach(k => delete saved[k]);
  curSet(null); store.set('session.curVerif', null);
  document.getElementById('form-area').style.display = 'none';
  store.set('ui.syncStatus', 'idle');
  renderSession();
  const home = document.getElementById('home-section');
  if (home && home.style.display !== 'none') renderHome();
  toast('Sessione chiusa', 'ok');
}

async function loadSessList() {
  const list = document.getElementById('sess-list');
  list.innerHTML = '<div style="font-size:13px;color:var(--text3);padding:8px">Caricamento...</div>';
  const asl = currentUser?.profile?.asl || 'ASL Benevento';
  // Responsabile e admin vedono tutte le sessioni dell'ASL; verificatore solo le proprie
  const query = can('sessioni_altrui') ? { asl } : { utenteId: currentUser.id };
  let sessioni;
  try { sessioni = await db.sessioni.list(query); }
  catch(e) { list.innerHTML = '<div style="color:var(--ko);padding:8px">Errore caricamento</div>'; return; }
  if (!sessioni.length) {
    list.innerHTML = '<div style="font-size:13px;color:var(--text3);padding:8px">Nessuna sessione. Creane una nuova.</div>';
    return;
  }
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  list.innerHTML = sessioni.map(s => {
    const isActive = s.id === currentSessionId;
    const data = s.data_aggiornamento
      ? new Date(s.data_aggiornamento).toLocaleDateString('it-IT', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
      : '—';
    return `<div class="sess-item${isActive?' active-sess':''}" data-sid="${esc(s.id)}" data-titolo="${esc(s.titolo)}" data-data="${esc(s.data_verifica||'')}" data-uid="${esc(s.utente_id||'')}">
      <div class="sess-item-info">
        <div class="sess-item-title">${esc(s.titolo)}</div>
        <div class="sess-item-meta">Aggiornata: ${data}</div>
      </div>
      <div class="sess-item-btns">
        ${isActive ? '<span style="font-size:11px;color:var(--info);font-weight:600">ATTIVA</span>' : ''}
        ${isActive ? '<button class="btn-sess" data-chiudi="1" title="Chiudi sessione" style="color:var(--warn);border-color:var(--warn)">Chiudi</button>' : ''}
        <button class="btn-sess" data-exp="1" title="Esporta Excel">⬇</button>
        <button class="btn-sess danger" data-del="1">✕</button>
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('.sess-item').forEach(el => {
    el.addEventListener('click', () => activateSession(el.dataset.sid, el.dataset.titolo, el.dataset.data||null, el.dataset.uid||null));
    const chiudiBtn = el.querySelector('[data-chiudi]');
    if (chiudiBtn) chiudiBtn.addEventListener('click', e => { e.stopPropagation(); chiudiSessione(); closeSessModal(); });
    const expBtn = el.querySelector('[data-exp]');
    if (expBtn) expBtn.addEventListener('click', e => { e.stopPropagation(); exportSessioneByID(el.dataset.sid, el.dataset.titolo); });
    const delBtn = el.querySelector('[data-del]');
    if (delBtn) delBtn.addEventListener('click', e => { e.stopPropagation(); deleteSession(el.dataset.sid, el.dataset.titolo); });
  });
}

async function deleteSession(id, titolo) {
  if (!confirm(`Eliminare la sessione "${titolo}"?\nTutti i dati verranno persi.`)) return;
  try { await db.schede.deleteBySessione(id); } catch(e) { console.error('Eliminazione schede fallita:', e); }
  try { await db.sessioni.delete_(id); } catch(e) { console.error('Eliminazione sessione fallita:', e); }
  if (currentSessionId === id) {
    currentSessionId = null;
    currentSessionTitle = null;
    currentSessionCreatorId = null;
    store.patch('session', { id: null, title: null, creatorId: null, attesi: new Set() });
    Object.keys(saved).forEach(k => delete saved[k]);
    curSet(null); store.set('session.curVerif', null);
    document.getElementById('form-area').style.display = 'none';
    store.set('ui.syncStatus', 'idle');
    renderSession();
  }
  await loadSessList();
  toast('Sessione eliminata', 'warn');
}
// ── PRESET helpers ────────────────────────────────────────────
const VSE_PRESET_FIELDS = new Set(['ten','tdp','frq','fdp','pot','pdp','mar','fud','fur','cls','cdp','pat','pad','fnz','def','spi','smo','msp','cav','icv','isp','int','pdc','icn','prc','icd','mus','mse','nag','clm','tms','cor','trm','pnm','pim','pbm','ibm','pcm','icm','giu','vt','vd','mot','str','nrs','ver','vrc','sct']);

// Upsert: PATCH se il record esiste già, POST se è nuovo
async function presetUpsert(kind, codice, tipo, dati) {
  try {
    await db.preset.upsert(kind, codice, tipo, dati);
    return true;
  } catch (e) {
    console.error('preset upsert error', e);
    return false;
  }
}

// ── PRESET: Salva sessione corrente come preset ───────────────
async function saveSessionAsPresets() {
  if (!can('preset_edit_personal')) { toast('Operazione non consentita per questo profilo', 'warn'); return; }
  const keys = Object.keys(saved).filter(k => saved[k].vse_saved || saved[k].mp_saved || saved[k].vsp_saved || saved[k].cq_saved);
  if (!keys.length) { toast('Nessun dispositivo compilato nella sessione', 'warn'); return; }
  toast(`Salvataggio preset per ${keys.length} dispositivi...`, 'warn');
  let count = 0, errors = 0;
  for (const cod of keys) {
    const rec = saved[cod];
    let ok = true;
    // VSE
    if (rec.vse_saved) {
      const dati = {};
      VSE_PRESET_FIELDS.forEach(f => { if (rec[f] != null && rec[f] !== '') dati[f] = rec[f]; });
      if (Object.keys(dati).length) ok = await presetUpsert('vse', cod, null, dati) && ok;
    }
    // MP
    if (rec.mp_saved) {
      const dati = {};
      for (let i=1;i<=19;i++) {
        const v=rec['mp'+i];
        if (v==='OK') dati['mp'+i+'_ok']=true;
        else if (v==='KO') dati['mp'+i+'_ko']=true;
        else if (v==='NA') dati['mp'+i+'_na']=true;
      }
      if (rec.mp_tecnico) dati.mp_tecnico=rec.mp_tecnico;
      if (Object.keys(dati).length) ok = await presetUpsert('mp', cod, null, dati) && ok;
    }
    // VSP
    if (rec.vsp_saved && rec.vsp_type) {
      const tipo=rec.vsp_type, pts=VSP_POINTS[tipo]||[];
      const dati = {};
      pts.forEach(p => { const v=rec['vsp_'+p.l], opts=p.opts||['OK','KO','NA']; opts.forEach(o=>{ if(v===o) dati['vsp_'+p.l+'_'+o.toLowerCase()]=true; }); });
      if (rec.vsp_tecnico) dati.vsp_tecnico=rec.vsp_tecnico;
      // Campi extra (misure prove di scarica, tempi di carica, correnti ELB, ecc.)
      (VSP_EXTRA[tipo]||[]).forEach(sec=>sec.fields.forEach(f=>{ if(rec[f.id]) dati[f.id]=rec[f.id]; }));
      if (Object.keys(dati).length) ok = await presetUpsert('vsp', cod, tipo, dati) && ok;
    }
    // CQ
    if (rec.cq_saved && rec.cq_type) {
      const tipo=rec.cq_type, visPoints=CQ_VIS[tipo]||[];
      const dati = {};
      visPoints.forEach(p => { const pid=p.replace('.','_'), v=rec['cq_vis_'+pid]; if(v==='OK') dati['cq_vis_'+pid+'_ok']=true; else if(v==='KO') dati['cq_vis_'+pid+'_ko']=true; else if(v==='NA') dati['cq_vis_'+pid+'_na']=true; });
      (CQ_PROVA[tipo]||[]).forEach(sec=>sec.fields.forEach(f=>{ if(rec[f.id]) dati[f.id]=rec[f.id]; }));
      ['cq_strum','cq_strum_mod','cq_strum_ser','cq_strum_cert','cq_strum_scad','cq_tecnico'].forEach(f=>{ if(rec[f]) dati[f]=rec[f]; });
      if (Object.keys(dati).length) ok = await presetUpsert('cq', cod, tipo, dati) && ok;
    }
    if (ok) count++; else errors++;
  }
  await loadPresets();
  if (errors) toast(`${count} preset salvati, ${errors} errori (vedi console)`, 'warn');
  else toast(`Preset aggiornati per ${count} dispositivi`, 'ok');
}

// ── PRESET: Importa da file Excel (formato AppWitch_2_INSERIMENTO) ─────
async function importPresetsFromExcel(input) {
  if (!can('preset_edit_personal')) { toast('Operazione non consentita per questo profilo', 'warn'); input.value=''; return; }
  const file = input.files[0]; if (!file) return;
  input.value = '';
  if (typeof XLSX === 'undefined') {
    toast('Caricamento libreria Excel...','warn');
    await new Promise(res => { const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'; s.onload=res; document.head.appendChild(s); });
  }
  const wb = XLSX.read(await file.arrayBuffer(), {type:'array'});
  const norm = c => String(c||'').trim().replace(/\D/g,'').padStart(7,'0');
  let total = 0;

  async function importBatch(kind, payload) {
    if (!payload.length) return 0;
    // Deduplica per (codice, tipo) — tiene l'ultimo record in caso di duplicati nel file
    const seen = new Map();
    for (const row of payload) { seen.set(row.codice + '|' + (row.tipo||''), row); }
    const deduped = [...seen.values()];
    const CHUNK = 200;
    let count = 0;
    for (let i=0; i<deduped.length; i+=CHUNK) {
      const chunk = deduped.slice(i, i+CHUNK);
      try {
        await db.preset.insertBatch(kind, chunk);
        count += chunk.length;
      } catch (e) {
        console.error(`importBatch ${kind} chunk ${i}:`, e);
        toast(`Errore import ${kind}: ${String(e.body||e.message).slice(0,80)}`, 'warn');
        return count;
      }
    }
    return count;
  }
  // Helper: read cell as string or null
  const _rc = (row,c) => { const v=row[c]; if(v==null||v==='') return null; return typeof v==='number' ? String(Math.round(v)) : String(v); };
  // Helper: converte serial Excel → 'YYYY-MM-DD', oppure stringa già formattata
  const _rxldate = (row,c) => {
    const v = row[c];
    if (v==null||v==='') return null;
    const n = Number(v);
    if (!isNaN(n) && n > 1000 && n < 2958466) {
      const d = new Date(Date.UTC(1899,11,30) + n*86400000);
      return d.toISOString().split('T')[0];
    }
    const s = String(v).trim();
    return s || null;
  };
  // Helper: set multiple explicit [field, colIndex] pairs
  const _fm = (row,map,dati) => map.forEach(([f,c])=>{ const v=_rc(row,c); if(v) dati[f]=v; });

  // ── VSE (60 col, 1 header row, col 53 = "Colonna vuota") ──
  const vseWs = wb.Sheets['Inserimento_VSE'];
  if (vseWs) {
    // '' at index 53 skips the empty column; dat2 (not data2) matches the correct field name
    const FVSE=['codice','data','note','ten','tdp','frq','fdp','pot','pdp','mar','fud','fur','cls','cdp','pat','pad','fnz','def','spi','smo','msp','cav','icv','isp','int','pdc','icn','prc','icd','mus','mse','nag','clm','tms','cor','trl','trm','pnl','pnm','pil','pim','pbl','pbm','ibl','ibm','pcl','pcm','icl','icm','giu','vt','vd','mot','','str','nrs','ver','dat2','vrc','sct'];
    const rows = XLSX.utils.sheet_to_json(vseWs,{header:1,defval:''});
    const payload = rows.slice(1).map(row => {
      const codice=norm(row[0]); if(!codice||codice==='0000000') return null;
      const dati={}; FVSE.forEach((f,i)=>{ if(!VSE_PRESET_FIELDS.has(f)||row[i]==null||row[i]==='') return; dati[f]=f==='sct'?(_rxldate(row,i)||String(row[i])):String(row[i]); });
      return Object.keys(dati).length ? {codice,dati} : null;
    }).filter(Boolean);
    total += await importBatch('vse', payload);
  }

  // ── MP (61 col, 2 header rows, tecnico col 60) ──
  const mpWs = wb.Sheets['Inserimento_MP'];
  if (mpWs) {
    const rows = XLSX.utils.sheet_to_json(mpWs,{header:1,defval:''});
    const payload = rows.slice(2).map(row => {
      const codice=norm(row[0]); if(!codice||codice==='0000000') return null;
      const dati={};
      for(let i=1;i<=19;i++){const b=3+(i-1)*3; if(row[b]) dati['mp'+i+'_ok']=true; if(row[b+1]) dati['mp'+i+'_ko']=true; if(row[b+2]) dati['mp'+i+'_na']=true;}
      if(row[60]) dati.mp_tecnico=String(row[60]);
      return Object.keys(dati).length ? {codice,dati} : null;
    }).filter(Boolean);
    total += await importBatch('mp', payload);
  }

  // ── VSP (3 header rows) ──
  for (const tipo of Object.keys(VSP_POINTS)) {
    const ws = wb.Sheets['Inserimento_VSP_'+tipo.replace('VSP_','')]; if(!ws) continue;
    const rows = XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
    const def = VSP_POINTS[tipo];
    const payload = rows.slice(3).map(row => {
      const codice=norm(row[0]); if(!codice||codice==='0000000') return null;
      const dati={};
      if(tipo==='VSP_ELB'){
        const RC_FIELDS_ELB=['elb_rc_t_ni','elb_rc_t_nm','elb_rc_t_q1i','elb_rc_t_q1m','elb_rc_t_q2i','elb_rc_t_q2m','elb_rc_t_q3i','elb_rc_t_q3m','elb_rc_t_mxi','elb_rc_t_mxm','elb_rc_m_ni','elb_rc_m_nm','elb_rc_m_q1i','elb_rc_m_q1m','elb_rc_m_q2i','elb_rc_m_q2m','elb_rc_m_q3i','elb_rc_m_q3m','elb_rc_m_mxi','elb_rc_m_mxm','elb_rc_c_ni','elb_rc_c_nm','elb_rc_c_q1i','elb_rc_c_q1m','elb_rc_c_q2i','elb_rc_c_q2m','elb_rc_c_q3i','elb_rc_c_q3m','elb_rc_c_mxi','elb_rc_c_mxm','elb_rc_b_ni','elb_rc_b_nm','elb_rc_b_q1i','elb_rc_b_q1m','elb_rc_b_q2i','elb_rc_b_q2m','elb_rc_b_q3i','elb_rc_b_q3m','elb_rc_b_mxi','elb_rc_b_mxm'];
        _fm(row,[['elb_pbip',3],['elb_cbip',4],['elb_fhz',5],['elb_fkhz',6],['elb_fmhz',7],['elb_pmono',8],['elb_cmono',9],['elb_fhz2',10],['elb_fkhz2',11],['elb_fmhz2',12],['elb_pa',15],['elb_pdt',16]],dati);
        let ci=18; def.forEach(p=>{ const opts=p.opts||['OK','KO','NA']; opts.forEach(o=>{ if(row[ci]) dati['vsp_'+p.l+'_'+o.toLowerCase()]=true; ci++; }); });
        _fm(row,[['elb_ct_t',36],['elb_ct_m',37],['elb_ct_c',38],['elb_at_t',39],['elb_at_m',40],['elb_at_c',41],['elb_en_t',42],['elb_en_m',43],['elb_en_c',44],['elb_ea_t',46],['elb_ea_m',47],['elb_ea_c',48],['elb_iso1n',52],['elb_iso1t',53],['elb_iso2n',54],['elb_iso2t',55]],dati);
        _fm(row,[['elb_hf_esito',56],['elb_bip_esito',57],['elb_vp1',58],['elb_vp2',59],['elb_vp3',60],['elb_vp4',61],['elb_vp5',62],['elb_vp6',63],['elb_er1',64],['elb_er2',65],['elb_er3',66]],dati);
        RC_FIELDS_ELB.forEach((f,i)=>{ const v=_rc(row,67+i); if(v) dati[f]=v; });
        ['elb_strum','elb_mod','elb_ser','elb_cert','elb_scad'].forEach((f,i)=>{ const v=f==='elb_scad'?_rxldate(row,107+i):_rc(row,107+i); if(v) dati[f]=v; });
        if(row[112]) dati.vsp_tecnico=String(row[112]);
      } else {
        // CEN, ECG, DEF: checkboxes start at col 3
        let ci=3; def.forEach(p=>{ const opts=p.opts||['OK','KO','NA']; opts.forEach(o=>{ if(row[ci]) dati['vsp_'+p.l+'_'+o.toLowerCase()]=true; ci++; }); });
        if(tipo==='VSP_DEF'){
          // ci=50 here; energy manuale col 50-59, DAE col 60, skip 61-63
          ['def_e1i','def_e1m','def_e2i','def_e2m','def_e3i','def_e3m','def_e4i','def_e4m','def_e5i','def_e5m'].forEach((f,i)=>{ const v=_rc(row,50+i); if(v) dati[f]=v; });
          const daeMis=_rc(row,60); if(daeMis) dati['def_dae_mis']=daeMis;
          // Tempi carica col 64-75, tempi ritardo col 79-88 (with gaps)
          ['def_tc_ar','def_tc_ab','def_tc_am','def_tc_br','def_tc_bb','def_tc_bm','def_tc_cr','def_tc_cb','def_tc_cm','def_tc_dr','def_tc_db','def_tc_dm'].forEach((f,i)=>{ const v=_rc(row,64+i); if(v) dati[f]=v; });
          _fm(row,[['def_tr_ar',79],['def_tr_am',80],['def_tr_br',83],['def_tr_bm',84],['def_tr_cr',87],['def_tr_cm',88]],dati);
          // Strumentazione col 91-95, tecnico col 96
          ['def_strum','def_mod','def_ser','def_cert','def_scad'].forEach((f,i)=>{ const v=f==='def_scad'?_rxldate(row,91+i):_rc(row,91+i); if(v) dati[f]=v; });
          if(row[96]) dati.vsp_tecnico=String(row[96]);
          // Nuovi esiti col 97-106
          [['def_e_esito',97],['def_tc_ab_na',98],['def_tc_cd_na',99],['def_tc_ok',100],['def_tr_a_esito',101],['def_tr_b_esito',102],['def_tr_c_esito',103],['def_rac_a',104],['def_rac_b',105],['def_rac_c',106]].forEach(([f,c])=>{ const v=_rc(row,c); if(v) dati[f]=v; });
        } else {
          // CEN, ECG: tecnico immediately after checkboxes
          if(row[ci]) dati.vsp_tecnico=String(row[ci]);
        }
      }
      return Object.keys(dati).length ? {codice,tipo,dati} : null;
    }).filter(Boolean);
    total += await importBatch('vsp', payload);
  }

  // ── CQ (3 header rows) ──
  // Per-type prova field→column mappings (excludes vis checkboxes and strumentazione)
  const CQ_PMAP = {
    'CQ_DEF': [['cq_def_tipo_man',3],['cq_def_tipo_dae',4],['cq_def_opt_pac',5],['cq_def_opt_nibp',6],['cq_def_opt_spo2',7],
               ['cq_def_e1i',29],['cq_def_e1m',30],['cq_def_e2i',33],['cq_def_e2m',34],['cq_def_e3i',37],['cq_def_e3m',38],
               ['cq_def_e4i',41],['cq_def_e4m',42],['cq_def_e5i',45],['cq_def_e5m',46],['cq_def_e6i',49],['cq_def_e6m',50]],
    'CQ_ECG': [['cq_ecg_v1i',24],['cq_ecg_v1ind',25],['cq_ecg_v1lim',26],['cq_ecg_v2i',29],['cq_ecg_v2ind',30],['cq_ecg_v2lim',31],
               ['cq_ecg_v3i',34],['cq_ecg_v3ind',35],['cq_ecg_v3lim',36],['cq_ecg_v4i',39],['cq_ecg_v4ind',40],['cq_ecg_v4lim',41],
               ['cq_ecg_v5i',44],['cq_ecg_v5ind',45],['cq_ecg_v5lim',46]],
    'CQ_CEN': [['cq_cen_g1i',18],['cq_cen_g1m',19],['cq_cen_g2i',20],['cq_cen_g2m',21],['cq_cen_g3i',22],['cq_cen_g3m',23],
               ['cq_cen_t1i',24],['cq_cen_t1m',25],['cq_cen_t2i',26],['cq_cen_t2m',27],['cq_cen_t3i',28],['cq_cen_t3m',29]],
    'CQ_ELB': [['cq_elb_ct_t',33],['cq_elb_ct_c',34],['cq_elb_at_t',35],['cq_elb_at_c',36],['cq_elb_fn_t',37],['cq_elb_fn_c',38],
               ['cq_elb_en_t',39],['cq_elb_en_c',40],['cq_elb_iso1',44],['cq_elb_iso2',45],
               ['cq_elb_hf_esito',46],['cq_elb_bip_esito',47],
               ['cq_elb_pt1d',49],['cq_elb_pt1r',50],['cq_elb_pc1d',51],['cq_elb_pc1r',52],['cq_elb_pb1d',53],['cq_elb_pb1r',54],
               ['cq_elb_pt2d',55],['cq_elb_pt2r',56],['cq_elb_pc2d',57],['cq_elb_pc2r',58],['cq_elb_pb2d',59],['cq_elb_pb2r',60],
               ['cq_elb_pt3d',61],['cq_elb_pt3r',62],['cq_elb_pc3d',63],['cq_elb_pc3r',64],['cq_elb_pb3d',65],['cq_elb_pb3r',66],
               ['cq_elb_pt4d',67],['cq_elb_pt4r',68],['cq_elb_pc4d',69],['cq_elb_pc4r',70],['cq_elb_pb4d',71],['cq_elb_pb4r',72],
               ['cq_elb_pot_esito',73]],
    'CQ_FBI': [['cq_fbi_r1label',9],['cq_fbi_r1i',10],['cq_fbi_r1ind',11],['cq_fbi_r1it',12],['cq_fbi_r1m',13],['cq_fbi_r1l',14],
               ['cq_fbi_r2label',15],['cq_fbi_r2i',16],['cq_fbi_r2ind',17],['cq_fbi_r2it',18],['cq_fbi_r2m',19],['cq_fbi_r2l',20],
               ['cq_fbi_r3label',21],['cq_fbi_r3i',22],['cq_fbi_r3ind',23],['cq_fbi_r3it',24],['cq_fbi_r3m',25],['cq_fbi_r3l',26],
               ['cq_fbi_r4label',27],['cq_fbi_r4i',28],['cq_fbi_r4ind',29],['cq_fbi_r4it',30],['cq_fbi_r4m',31],['cq_fbi_r4l',32]],
    'CQ_ECT': [['cq_ect_s1',27],['cq_ect_s2',28],['cq_ect_s3',29],['cq_ect_s4',30],
               ['cq_ect_m1s1',31],['cq_ect_m1s2',32],['cq_ect_m1s3',33],['cq_ect_m1s4',34],
               ['cq_ect_m2as1',35],['cq_ect_m2as2',36],['cq_ect_m2as3',37],['cq_ect_m2as4',38],
               ['cq_ect_m2bs1',39],['cq_ect_m2bs2',40],['cq_ect_m2bs3',41],['cq_ect_m2bs4',42],
               ['cq_ect_m3as1',43],['cq_ect_m3as2',44],['cq_ect_m3as3',45],['cq_ect_m3as4',46],
               ['cq_ect_m3bs1',47],['cq_ect_m3bs2',48],['cq_ect_m3bs3',49],['cq_ect_m3bs4',50],
               ['cq_ect_m4as1',51],['cq_ect_m4as2',52],['cq_ect_m4as3',53],['cq_ect_m4as4',54],
               ['cq_ect_m4bs1',55],['cq_ect_m4bs2',56],['cq_ect_m4bs3',57],['cq_ect_m4bs4',58],
               ['cq_ect_m5s1',59],['cq_ect_m5s2',60],['cq_ect_m5s3',61],['cq_ect_m5s4',62],
               ['cq_ect_m6s1',63],['cq_ect_m6s2',64],['cq_ect_m6s3',65],['cq_ect_m6s4',66]],
    'CQ_MON': [['cq_mon_e1i',12],['cq_mon_e1ind',13],['cq_mon_e1lim',14],['cq_mon_e2i',17],['cq_mon_e2ind',18],['cq_mon_e2lim',19],
               ['cq_mon_e3i',22],['cq_mon_e3ind',23],['cq_mon_e3lim',24],['cq_mon_e4i',27],['cq_mon_e4ind',28],['cq_mon_e4lim',29],
               ['cq_mon_e5i',32],['cq_mon_e5ind',33],['cq_mon_e5lim',34],
               ['cq_mon_s1i',37],['cq_mon_s1ind',38],['cq_mon_s1lim',39],['cq_mon_s2i',42],['cq_mon_s2ind',43],['cq_mon_s2lim',44],
               ['cq_mon_s3i',47],['cq_mon_s3ind',48],['cq_mon_s3lim',49],['cq_mon_s4i',52],['cq_mon_s4ind',53],['cq_mon_s4lim',54],
               ['cq_mon_s5i',57],['cq_mon_s5ind',58],['cq_mon_s5lim',59],['cq_mon_s6i',62],['cq_mon_s6ind',63],['cq_mon_s6lim',64],
               ['cq_mon_n1i',67],['cq_mon_n1ind',68],['cq_mon_n1lim',69],['cq_mon_n2i',72],['cq_mon_n2ind',73],['cq_mon_n2lim',74],
               ['cq_mon_n3i',77],['cq_mon_n3ind',78],['cq_mon_n3lim',79]],
    'CQ_ANS': [['cq_ans_comp',15],['cq_ans_res',16],['cq_ans_ie',17],['cq_ans_fri',18],['cq_ans_frv',19],['cq_ans_frm',20],['cq_ans_frl',21],
               ['cq_ans_vii',24],['cq_ans_viv',25],['cq_ans_vim',26],['cq_ans_vil',27]],
    'CQ_SPM': [['cq_spm_v1i',27],['cq_spm_v1m',28],['cq_spm_v2i',29],['cq_spm_v2m',30],['cq_spm_v3i',31],['cq_spm_v3m',32]],
    'CQ_VPO': [['cq_ans_comp',15],['cq_ans_res',16],['cq_ans_ie',17],['cq_ans_fri',18],['cq_ans_frv',19],['cq_ans_frm',20],['cq_ans_frl',21],
               ['cq_ans_vii',24],['cq_ans_viv',25],['cq_ans_vim',26],['cq_ans_vil',27]],
  };
  // Vis start col (default 3; CQ_DEF starts at 8 because col 3-7 = tipologia)
  const CQ_VC0 = {'CQ_DEF':8};
  // Max vis points to import (INSERIMENTO has 4 for ANS/VPO; code has 5 for ANS)
  const CQ_VN = {'CQ_ANS':4,'CQ_VPO':4};
  // Strumentazione start col and tecnico col per type
  const CQ_SC = {'CQ_DEF':53,'CQ_ECG':49,'CQ_CEN':30,'CQ_ELB':76,'CQ_FBI':33,'CQ_ECT':67,'CQ_MON':82,'CQ_ANS':30,'CQ_SPM':33,'CQ_VPO':30};
  const CQ_TC = {'CQ_DEF':58,'CQ_ECG':54,'CQ_CEN':35,'CQ_ELB':92,'CQ_FBI':38,'CQ_ECT':72,'CQ_MON':87,'CQ_ANS':35,'CQ_SPM':38,'CQ_VPO':35};
  const cqSf = ['cq_strum','cq_strum_mod','cq_strum_ser','cq_strum_cert','cq_strum_scad'];

  for (const tipo of [...new Set([...Object.keys(CQ_VIS),...Object.keys(CQ_PROVA)])]) {
    const ws = wb.Sheets['Inserimento_'+tipo]; if(!ws) continue;
    const rows = XLSX.utils.sheet_to_json(ws,{header:1,defval:''});
    const c0 = CQ_VC0[tipo]||3;
    const visAll = CQ_VIS[tipo]||[];
    const visPoints = visAll.slice(0, CQ_VN[tipo]||visAll.length);
    const pmap = CQ_PMAP[tipo]||[];
    const sc = CQ_SC[tipo], tc = CQ_TC[tipo];

    const payload = rows.slice(3).map(row => {
      const codice=norm(row[0]); if(!codice||codice==='0000000') return null;
      const dati={};
      // Vis checkboxes (3 cols each: OK, KO, NA)
      visPoints.forEach((p,idx)=>{
        const pid=p.replace('.','_'), c=c0+idx*3;
        if(row[c]) dati['cq_vis_'+pid+'_ok']=true;
        else if(row[c+1]) dati['cq_vis_'+pid+'_ko']=true;
        else if(row[c+2]) dati['cq_vis_'+pid+'_na']=true;
      });
      // Prova fields (explicit column positions)
      _fm(row,pmap,dati);
      // CQ_DEF: esiti energia erogata (2 colonne OK/KO dopo ogni coppia impostata/misurata)
      if(tipo==='CQ_DEF'){[1,2,3,4,5,6].forEach(n=>{const b=29+(n-1)*4;if(row[b+2]) dati['cq_def_e'+n+'_esito']='OK';else if(row[b+3]) dati['cq_def_e'+n+'_esito']='KO';});}
      // Strumentazione + tecnico
      if(sc!=null) cqSf.forEach((f,i)=>{ const v=f==='cq_strum_scad'?_rxldate(row,sc+i):_rc(row,sc+i); if(v) dati[f]=v; });
      if(tc!=null&&row[tc]) dati.cq_tecnico=String(row[tc]);
      if(row[2]) dati.cq_note=String(row[2]);
      return Object.keys(dati).length ? {codice,tipo,dati} : null;
    }).filter(Boolean);
    total += await importBatch('cq', payload);
  }
  await loadPresets();
  toast(total ? `Importati ${total} preset da Excel` : 'Nessun preset trovato nel file', total?'ok':'warn');
}

// ── PRESET: Esporta preset correnti in formato Excel compatibile con import ──
async function exportPresetsToExcel() {
  if (!can('preset_edit_personal')) { toast('Operazione non consentita per questo profilo', 'warn'); return; }
  if (!PRESETS || !Object.keys(PRESETS).length) { toast('Nessun preset in memoria — ricarica prima', 'warn'); return; }
  if (typeof XLSX === 'undefined') {
    toast('Caricamento libreria Excel...','warn');
    await new Promise(res => { const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'; s.onload=res; document.head.appendChild(s); });
  }
  const wb = XLSX.utils.book_new();
  const date = new Date().toISOString().split('T')[0];
  let sheets = 0;

  // ── VSE ──
  const vseP = PRESETS['PRESET_VSE'] || {};
  const vseK = Object.keys(vseP);
  if (vseK.length) {
    const HVSE=['CODICE','DATA','NOTE','Tensione','Tensione D/P','Frequenza','Frequenza D/P','Potenza','Potenza D/P','Marchio Conformita','Fusibili Dichiarati','Fusibili Riscontrati','Classe','Classe D/P','PA Tipo','Tipo D/P','Funzionamento','Protezione Defibrillatore','Tipo Spina','Smontabile/pressofusa','Marchio Spina','Cavo Alimentazione','IntegritaCavo','Integrita Spina','InterruttoreRete','ParteApplicata','IntegritaConnettori','ProtezioneConduttori','IntegritaConduttori','Manuale Uso','Manuale Servizio','Note Aggiuntive','ClasseMisura','Tensione2','CorrenteAssorbitaMA','TerraProtezioneLimite','TerraProtezioneMisurata','PN Limite','PN Misurata','PI Limite','PI Misurata','PN BF Limite','PN BF Misurata','PI BF Limite','PI BF Misurata','PN CF Limite','PN CF Misurata','PI CF Limite','PI CF Misurata','Giudizio','ValoriMessaTerra','ValoriDispersione','MotiviNonConformita','Colonna vuota','Strumento','NrSerie','Verificatore','Data','VERIFICATO','Scadenza Taratura'];
    const FVSE=['codice','data','note','ten','tdp','frq','fdp','pot','pdp','mar','fud','fur','cls','cdp','pat','pad','fnz','def','spi','smo','msp','cav','icv','isp','int','pdc','icn','prc','icd','mus','mse','nag','clm','tms','cor','trl','trm','pnl','pnm','pil','pim','pbl','pbm','ibl','ibm','pcl','pcm','icl','icm','giu','vt','vd','mot','','str','nrs','ver','dat2','vrc','sct'];
    const NUMERIC_VSE=new Set([33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49]);
    const rows = vseK.map(codice => {
      const d = vseP[codice] || {};
      return FVSE.map((f, i) => {
        const v = f === 'codice' ? codice : f ? (d[f] || '') : '';
        if (NUMERIC_VSE.has(i) && v !== '') { const n = parseFloat(v); return isNaN(n) ? v : n; }
        return v;
      });
    });
    const ws = XLSX.utils.aoa_to_sheet([HVSE, ...rows]);
    ws['!cols'] = HVSE.map(() => ({wch:16}));
    applyPageSetup(ws);
    XLSX.utils.book_append_sheet(wb, ws, 'Inserimento_VSE');
    sheets++;
  }

  // ── MP ──
  const mpP = PRESETS['PRESET_MP'] || {};
  const mpK = Object.keys(mpP);
  if (mpK.length) {
    /** @type {any[]} */
    const R1 = ['CODICE','DATA','NOTE'];
    for (let i=1;i<=19;i++) R1.push(i,null,null);
    R1.push('Tecnico Esecutore');
    const R2 = [null,null,null];
    for (let i=1;i<=19;i++) R2.push('OK','KO','NA');
    R2.push(null);
    const rows = mpK.map(codice => {
      const d = mpP[codice] || {};
      const row = [codice, d.mp_data||'', d.mp_note||''];
      for (let i=1;i<=19;i++) row.push(d['mp'+i+'_ok']?'X':null, d['mp'+i+'_ko']?'X':null, d['mp'+i+'_na']?'X':null);
      row.push(d.mp_tecnico||'');
      return row;
    });
    const ws = XLSX.utils.aoa_to_sheet([R1, R2, ...rows]);
    const cols = [{wch:10},{wch:12},{wch:20}];
    for (let i=0;i<19;i++) cols.push({wch:5},{wch:5},{wch:5});
    cols.push({wch:20});
    ws['!cols'] = cols;
    applyPageSetup(ws);
    XLSX.utils.book_append_sheet(wb, ws, 'Inserimento_MP');
    sheets++;
  }

  // ── VSP ──
  for (const tipo of Object.keys(VSP_POINTS)) {
    const vspP = PRESETS['PRESET_'+tipo] || {};
    const vspK = Object.keys(vspP);
    if (!vspK.length) continue;
    const def = VSP_POINTS[tipo];
    let R1, R2, R3, rows;

    if (tipo === 'VSP_DEF') {
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
      rows = vspK.map(codice => {
        const d = vspP[codice] || {};
        const row = Array(NC).fill(null);
        row[0]=codice; row[1]=d.vsp_data||''; row[2]=d.vsp_note||'';
        let ci2=3;def.forEach(p=>{const opt=p.opts.find(o=>d['vsp_'+p.l+'_'+o.toLowerCase()])||'';p.opts.forEach(o=>{row[ci2++]=(opt===o?'X':null);});});
        ['def_e1i','def_e1m','def_e2i','def_e2m','def_e3i','def_e3m','def_e4i','def_e4m','def_e5i','def_e5m'].forEach((f,i)=>{if(d[f])row[50+i]=d[f];});
        if(d['def_dae_mis'])row[60]=d['def_dae_mis'];
        ['def_tc_ar','def_tc_ab','def_tc_am','def_tc_br','def_tc_bb','def_tc_bm','def_tc_cr','def_tc_cb','def_tc_cm','def_tc_dr','def_tc_db','def_tc_dm'].forEach((f,i)=>{if(d[f])row[64+i]=d[f];});
        [['def_tr_ar',79],['def_tr_am',80],['def_tr_br',83],['def_tr_bm',84],['def_tr_cr',87],['def_tr_cm',88]].forEach(([f,c])=>{if(d[f])row[c]=d[f];});
        ['def_strum','def_mod','def_ser','def_cert','def_scad'].forEach((f,i)=>{if(d[f])row[91+i]=d[f];});
        row[96]=d.vsp_tecnico||'';
        [['def_e_esito',97],['def_tc_ab_na',98],['def_tc_cd_na',99],['def_tc_ok',100],['def_tr_a_esito',101],['def_tr_b_esito',102],['def_tr_c_esito',103],['def_rac_a',104],['def_rac_b',105],['def_rac_c',106]].forEach(([f,c])=>{if(d[f])row[c]=d[f];});
        return row;
      });
    } else if (tipo === 'VSP_ELB') {
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
      rows = vspK.map(codice => {
        const d = vspP[codice] || {};
        const row = Array(NC).fill(null);
        row[0]=codice; row[1]=d.vsp_data||''; row[2]=d.vsp_note||'';
        [['elb_pbip',3],['elb_cbip',4],['elb_fhz',5],['elb_fkhz',6],['elb_fmhz',7],['elb_pmono',8],['elb_cmono',9],['elb_fhz2',10],['elb_fkhz2',11],['elb_fmhz2',12],['elb_pa',15],['elb_pdt',16]].forEach(([f,c])=>{if(d[f])row[c]=d[f];});
        let ci2=18;def.forEach(p=>{const opt=p.opts.find(o=>d['vsp_'+p.l+'_'+o.toLowerCase()])||'';p.opts.forEach(o=>{row[ci2++]=(opt===o?'X':null);});});
        [['elb_ct_t',36],['elb_ct_m',37],['elb_ct_c',38],['elb_at_t',39],['elb_at_m',40],['elb_at_c',41],['elb_en_t',42],['elb_en_m',43],['elb_en_c',44],['elb_ea_t',46],['elb_ea_m',47],['elb_ea_c',48],['elb_iso1n',52],['elb_iso1t',53],['elb_iso2n',54],['elb_iso2t',55]].forEach(([f,c])=>{if(d[f])row[c]=d[f];});
        [['elb_hf_esito',56],['elb_bip_esito',57],['elb_vp1',58],['elb_vp2',59],['elb_vp3',60],['elb_vp4',61],['elb_vp5',62],['elb_vp6',63],['elb_er1',64],['elb_er2',65],['elb_er3',66]].forEach(([f,c])=>{if(d[f])row[c]=d[f];});
        RC_FIELDS_ELB.forEach((f,i)=>{if(d[f])row[67+i]=d[f];});
        ['elb_strum','elb_mod','elb_ser','elb_cert','elb_scad'].forEach((f,i)=>{if(d[f])row[107+i]=d[f];});
        row[112]=d.vsp_tecnico||'';
        return row;
      });
    } else {
      // CEN, ECG
      const chkCols = def.reduce((s,p)=>s+p.opts.length,0);
      R1=['CODICE','DATA','NOTE','CONTROLLO VISIVO',...Array(chkCols-1).fill(null),'TECNICO ESECUTORE'];
      R2=[null,null,null]; R3=[null,null,null];
      def.forEach(p=>{R2.push(p.l,...Array(p.opts.length-1).fill(null));R3.push(...p.opts);});
      R2.push(null); R3.push(null);
      rows = vspK.map(codice => {
        const d = vspP[codice] || {};
        const row = [codice, d.vsp_data||'', d.vsp_note||''];
        def.forEach(p=>{const opt=p.opts.find(o=>d['vsp_'+p.l+'_'+o.toLowerCase()])||'';p.opts.forEach(o=>row.push(opt===o?'X':null));});
        row.push(d.vsp_tecnico||'');
        return row;
      });
    }
    const wsVsp = XLSX.utils.aoa_to_sheet([R1, R2, R3, ...rows]);
    applyPageSetup(wsVsp);
    XLSX.utils.book_append_sheet(wb, wsVsp, 'Inserimento_VSP_'+tipo.replace('VSP_',''));
    sheets++;
  }

  // ── CQ ──
  const _EPMAP={
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
  const _EVC0={'CQ_DEF':8};
  const _EVN={'CQ_ANS':4,'CQ_VPO':4};
  const _ESC={'CQ_DEF':53,'CQ_ECG':49,'CQ_CEN':30,'CQ_ELB':76,'CQ_FBI':33,'CQ_ECT':67,'CQ_MON':82,'CQ_ANS':30,'CQ_SPM':33,'CQ_VPO':30};
  const _ETC={'CQ_DEF':58,'CQ_ECG':54,'CQ_CEN':35,'CQ_ELB':92,'CQ_FBI':38,'CQ_ECT':72,'CQ_MON':87,'CQ_ANS':35,'CQ_SPM':38,'CQ_VPO':35};

  for (const tipo of [...new Set([...Object.keys(CQ_VIS),...Object.keys(CQ_PROVA)])]) {
    const cqP = PRESETS['PRESET_'+tipo] || {};
    const cqK = Object.keys(cqP);
    if (!cqK.length) continue;
    const c0 = _EVC0[tipo]||3;
    const visAll = CQ_VIS[tipo]||[];
    const visPoints = visAll.slice(0, _EVN[tipo]||visAll.length);
    const pmap = _EPMAP[tipo]||[];
    const sc = _ESC[tipo], tc = _ETC[tipo];
    if (tc==null) continue;
    const NC = tc+1;
    const R1=Array(NC).fill(null),R2=Array(NC).fill(null),R3=Array(NC).fill(null);
    R1[0]='CODICE';R1[1]='DATA';R1[2]='NOTE';
    if(c0>3)R1[3]='TIPOLOGIA';
    R1[c0]='CONTROLLO VISIVO';
    visPoints.forEach((p,idx)=>{const c=c0+idx*3;R2[c]=p;R3[c]='OK';R3[c+1]='KO';R3[c+2]='NA';});
    const provaAll=[];(CQ_PROVA[tipo]||[]).forEach(sec=>sec.fields.forEach(f=>provaAll.push(f)));
    provaAll.forEach(f=>{const pm=pmap.find(([id])=>id===f.id);if(pm)R2[pm[1]]=f.l;});
    if(pmap.length){const fc=Math.min(...pmap.map(([,c])=>c));if(fc>=c0+visPoints.length*3)R1[fc]='PROVA FUNZIONALE';}
    if(tipo==='CQ_DEF'){[1,2,3,4,5,6].forEach(n=>{const b=29+(n-1)*4;R2[b+2]='OK';R2[b+3]='KO';});}
    if(sc!=null){R1[sc]='STRUMENTAZIONE';['Strumento','Modello','Serie','Certificato N.','Scadenza'].forEach((v,i)=>R2[sc+i]=v);}
    R1[tc]='TECNICO ESECUTORE';
    const rows = cqK.map(codice => {
      const d = cqP[codice] || {};
      const row = Array(NC).fill(null);
      row[0]=codice; row[1]=d.cq_data||''; row[2]=d.cq_note||'';
      visPoints.forEach((p,idx)=>{
        const pid=p.replace('.','_'), c=c0+idx*3;
        row[c]=(d['cq_vis_'+pid+'_ok']?'X':null);
        row[c+1]=(d['cq_vis_'+pid+'_ko']?'X':null);
        row[c+2]=(d['cq_vis_'+pid+'_na']?'X':null);
      });
      pmap.forEach(([f,c])=>{if(d[f]!=null&&d[f]!=='')row[c]=d[f];});
      if(tipo==='CQ_DEF'){[1,2,3,4,5,6].forEach(n=>{const b=29+(n-1)*4,ev=d['cq_def_e'+n+'_esito']||'';row[b+2]=(ev==='OK'?'X':null);row[b+3]=(ev==='KO'?'X':null);});}
      if(sc!=null){['cq_strum','cq_strum_mod','cq_strum_ser','cq_strum_cert','cq_strum_scad'].forEach((f,i)=>{if(d[f])row[sc+i]=d[f];});}
      row[tc]=d.cq_tecnico||'';
      return row;
    });
    const ws = XLSX.utils.aoa_to_sheet([R1, R2, R3, ...rows]);
    ws['!cols'] = Array(NC).fill({wch:14});
    applyPageSetup(ws);
    XLSX.utils.book_append_sheet(wb, ws, 'Inserimento_'+tipo);
    sheets++;
  }

  if (!sheets) { toast('Nessun preset da esportare', 'warn'); return; }
  XLSX.writeFile(wb, 'AppWitch_Preset_'+date+'.xlsx');
  const tot = Object.values(PRESETS).reduce((s,p)=>s+Object.keys(p).length, 0);
  toast(`Preset esportati: ${tot} dispositivi in ${sheets} fogli`, 'ok');
}

// ── Toggle Non reperibile / Non eseguita per dispositivo ──────
function toggleDevFlag(cod, flag) {
  if (!saved[cod]) saved[cod] = { codice: cod };
  const other = flag === 'non_reperibile' ? 'non_eseguita' : 'non_reperibile';
  saved[cod][flag] = !saved[cod][flag];
  if (saved[cod][flag]) saved[cod][other] = false; // mutually exclusive
  renderSession();
  store.set('ui.syncStatus', 'dirty');
  if (currentSessionId) scheduleSync();
}

// ── Aggiorna Anagrafica (Programmazione) ─────────────────────
async function syncProgrammazioneAnagrafica() {
  const codici = Object.keys(saved);
  if (!codici.length) { toast('Nessun dispositivo in sessione', 'warn'); return; }
  const aslKey      = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
  const sessDate    = currentSessionDate || new Date().toISOString().split('T')[0];
  const verificatore = currentUser?.profile?.full_name || '';
  let ok = 0, skip = 0, err = 0;
  const storRows = [];

  for (const cod of codici) {
    const rec = saved[cod];
    const vm  = VERIF_MAP[cod];
    const dev = DB[cod] || {};
    const nr  = !!rec.non_reperibile;
    const ne  = !!rec.non_eseguita;
    const esitoFlag = nr ? 'Non reperibile' : ne ? 'Non eseguita' : null;
    const payload = {};
    const base = { asl: aslKey, codice: cod, verificatore, categoria: 'programmazione', motivo: null };

    // VSE
    const vseDate  = nr||ne ? sessDate : (rec.vse_saved ? rec.data : null);
    const vseEsito = nr||ne ? esitoFlag : (rec.vse_saved ? (rec.giu==='POSITIVO'?'Positivo':'Negativa') : null);
    if (vseDate) {
      payload.data_ultima_vse=vseDate; payload.esito_ultima_vse=vseEsito; payload.data_prossima_vse=_calcProssima(vseDate,dev.periodicita_vse)||null;
      storRows.push({ ...base, data: vseDate, tipo: 'VSE', esito: vseEsito });
    }

    // MP
    const mpDate  = nr||ne ? sessDate : (rec.mp_saved ? rec.mp_data : null);
    const mpEsito = nr||ne ? esitoFlag : (rec.mp_saved ? 'Positivo' : null);
    if (mpDate) {
      payload.data_ultima_mo=mpDate; payload.esito_ultima_mo=mpEsito; payload.data_prossima_mo=_calcProssima(mpDate,dev.periodicita_mo)||null;
      storRows.push({ ...base, data: mpDate, tipo: 'MO', esito: mpEsito });
    }

    // VSP (solo se previsto per il dispositivo)
    if (vm?.vsp) {
      const vspDate  = nr||ne ? sessDate : (rec.vsp_saved ? rec.vsp_data : null);
      const vspEsito = nr||ne ? esitoFlag : (rec.vsp_saved ? 'Positivo' : null);
      if (vspDate) {
        payload.data_ultima_vsp=vspDate; payload.esito_ultima_vsp=vspEsito; payload.data_prossima_vsp=_calcProssima(vspDate,dev.periodicita_vsp)||null;
        storRows.push({ ...base, data: vspDate, tipo: 'VSP', esito: vspEsito });
      }
    }

    // CQ (solo se previsto per il dispositivo)
    if (vm?.cq) {
      const cqDate  = nr||ne ? sessDate : (rec.cq_saved ? rec.cq_data : null);
      const cqEsito = nr||ne ? esitoFlag : (rec.cq_saved ? 'Positivo' : null);
      if (cqDate) {
        payload.data_ultima_cq=cqDate; payload.esito_ultima_cq=cqEsito; payload.data_prossima_cq=_calcProssima(cqDate,dev.periodicita_cq)||null;
        storRows.push({ ...base, data: cqDate, tipo: 'CQ', esito: cqEsito });
      }
    }

    if (!Object.keys(payload).length) { skip++; continue; }

    try {
      await db.dispositivi.update(cod, payload);
      ok++;
      if (DB[cod]) Object.assign(DB[cod], payload);
    } catch (e) {
      err++;
      console.error('syncProg fallita:', cod, e.status || e.message);
    }
  }

  // Inserisce nello storico le righe della programmazione
  if (storRows.length) {
    try { await db.storico.insertMany(storRows, { ignoreDuplicates: true }); }
    catch (e) {
      console.error('Errore INSERT storico programmazione:', e);
      toast(`Errore registrazione storico (${e.status || '?'})`, 'err');
    }
  }

  if (err===0) toast(`Anagrafica aggiornata: ${ok} dispositivi${skip?` (${skip} senza dati)`:''}`, 'ok');
  else toast(`Completato con ${err} errori (${ok} OK)`, 'warn');
}

// ── Modal Verifica Straordinaria ──────────────────────────────
function openStraordinariaModal() {
  const codici = Object.keys(saved);
  if (!codici.length) { toast('Nessun dispositivo in sessione', 'warn'); return; }
  const el = document.getElementById('straord-desc');
  if (el) el.textContent = `${codici.length} dispositivo${codici.length>1?'i':''} verranno registrati come verifica straordinaria.`;
  const inp = document.getElementById('straord-motivo');
  if (inp) inp.value = '';
  document.getElementById('modal-straord').classList.add('open');
}
function closeStraordinariaModal() {
  document.getElementById('modal-straord').classList.remove('open');
}
function confirmStraordinaria() {
  const motivo = (document.getElementById('straord-motivo')?.value || '').trim();
  if (!motivo) { document.getElementById('straord-motivo').focus(); toast('Inserire il motivo della verifica straordinaria', 'warn'); return; }
  closeStraordinariaModal();
  syncStraordinariaStorico(motivo);
}

// ── Inserisce verifiche straordinarie in storico_verifiche ───
async function syncStraordinariaStorico(motivo) {
  const codici = Object.keys(saved);
  if (!codici.length) return;
  const aslKey     = (currentUser?.profile?.asl || 'ASL Benevento').toLowerCase().replace('asl ', '');
  const verificatore = currentUser?.profile?.full_name || '';
  const sessDate   = currentSessionDate || new Date().toISOString().split('T')[0];
  const rows = [];

  for (const cod of codici) {
    const rec = saved[cod];
    const vm  = VERIF_MAP[cod];
    const nr  = !!rec.non_reperibile;
    const ne  = !!rec.non_eseguita;
    const esitoFlag = nr ? 'Non reperibile' : ne ? 'Non eseguita' : null;
    const base = { asl: aslKey, codice: cod, verificatore, categoria: 'straordinaria', motivo };

    // VSE
    const vseDate  = nr||ne ? sessDate : (rec.vse_saved ? rec.data : null);
    const vseEsito = nr||ne ? esitoFlag : (rec.vse_saved ? (rec.giu==='POSITIVO'?'Positivo':'Negativa') : null);
    if (vseDate) rows.push({ ...base, data: vseDate, tipo: 'VSE', esito: vseEsito });

    // MP
    const mpDate  = nr||ne ? sessDate : (rec.mp_saved ? rec.mp_data : null);
    const mpEsito = nr||ne ? esitoFlag : (rec.mp_saved ? 'Positivo' : null);
    if (mpDate) rows.push({ ...base, data: mpDate, tipo: 'MO', esito: mpEsito });

    // VSP
    if (vm?.vsp) {
      const vspDate  = nr||ne ? sessDate : (rec.vsp_saved ? rec.vsp_data : null);
      const vspEsito = nr||ne ? esitoFlag : (rec.vsp_saved ? 'Positivo' : null);
      if (vspDate) rows.push({ ...base, data: vspDate, tipo: 'VSP', esito: vspEsito });
    }

    // CQ
    if (vm?.cq) {
      const cqDate  = nr||ne ? sessDate : (rec.cq_saved ? rec.cq_data : null);
      const cqEsito = nr||ne ? esitoFlag : (rec.cq_saved ? 'Positivo' : null);
      if (cqDate) rows.push({ ...base, data: cqDate, tipo: 'CQ', esito: cqEsito });
    }
  }

  if (!rows.length) { toast('Nessun dato da registrare', 'warn'); return; }

  try { await db.storico.insertMany(rows); toast(`Verifiche straordinarie registrate: ${rows.length} righe`, 'ok'); }
  catch (e) { console.error(e); toast('Errore registrazione straordinaria', 'warn'); }
}
