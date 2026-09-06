import { SOURCES } from './calculations.js';
import { geometryChoices } from './geometry.js';

const field=(id,label,value='',unit='',hint='',extra='')=>`<div class="field"><label for="${id}">${label}</label><div class="input-unit"><input id="${id}" type="text" data-number inputmode="decimal" autocomplete="off" value="${value}" ${extra} aria-describedby="${id}-hint ${id}-error">${unit?`<span aria-hidden="true">${unit}</span>`:''}</div>${hint?`<small id="${id}-hint">${hint}<span class="sr-only">${unit?' Jednotka: '+unit:''}</span></small>`:`<span id="${id}-hint" class="sr-only">${unit?'Jednotka: '+unit:''}</span>`}<p id="${id}-error" class="field-error"></p></div>`;
const textField=(id,label,placeholder='',limit=160)=>`<div class="field"><label for="${id}">${label}</label><input id="${id}" type="text" maxlength="${limit}" placeholder="${placeholder}" aria-describedby="${id}-error"><p id="${id}-error" class="field-error"></p></div>`;
const date=(id,label)=>`<div class="field"><label for="${id}">${label}</label><input type="datetime-local" id="${id}" aria-describedby="${id}-error"><p id="${id}-error" class="field-error"></p></div>`;
const select=(id,label,options)=>`<div class="field"><label for="${id}">${label}</label><select id="${id}" aria-describedby="${id}-error">${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select><p id="${id}-error" class="field-error"></p></div>`;
const check=(id,label)=>`<label class="check"><input id="${id}" type="checkbox"><span>${label}</span></label>`;
const material=id=>select(id,'Materiál',[['steel','Ocel (Fe)'],['aluminum','Hliník (Al)'],['titanium','Titan (Ti)'],['copper_nickel','Měď / nikl a jejich slitiny']]);
const quality=id=>select(id,'Třída zkoušení',[['B','B'],['A','A']]);
const result=(id,label,unit='')=>`<div class="result-card"><span>${label}</span><div class="result-value"><output id="${id}" aria-live="polite">—</output>${unit?`<span class="result-unit">${unit}</span>`:''}</div></div>`;
const error=id=>`<p class="error-message" id="${id}" role="status"></p>`;
const source=(url,text)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`;

export function forms() {return `
<section id="exposures" class="tab-pane" role="tabpanel" aria-labelledby="tab-exposures">
 <div class="calc-layout"><div class="form-stack">
  ${geometryChoices('n_technique','Technika prozařování',[['outside','Jedna stěna · zdroj vně'],['double','Dvě stěny · DWSI'],['inside','Jedna stěna · zdroj uvnitř']])}
  <p class="help" id="n_technique_help">Film uvnitř, zdroj vně trubky. Vzdálenost f se měří k přivrácenému povrchu.</p>
  <div class="form-section"><h3>Geometrie</h3>
  <div class="fields-two">${field('n_thickness','Tloušťka jedné stěny t',10,'mm')}${field('n_diameter','Vnější průměr De',219,'mm')}</div>
  ${field('n_distance','Vzdálenost zdroj–předmět f',500,'mm','Vzdálenost podle schématu.')}${quality('n_testingClass')}
  </div>
  ${error('n_error')}
  <p class="help">Eliptická a kolmá technika DWDI se těmito nomogramy nepočítají.</p>
 </div><div class="form-stack result-column" id="n_result_panel">
  <div class="result-focus" id="n_result_focus"><span class="result-kind" id="n_result_kind">Odečet nomogramu</span>
  ${result('n_result-display','Minimální počet expozic')}
  <p id="n_result_context" class="result-context"></p><p id="n_next_step" class="next-step"></p></div>
  <div class="chart-wrap"><canvas id="nomogramChart" aria-label="Nomogram počtu expozic" role="img"></canvas></div>
  <p id="n_result-ratios" class="result-detail"></p><p id="n_boundary_note" class="help"></p>
  <details class="calculation-details"><summary>Schéma geometrie a podklad výpočtu</summary>
  <div id="n_geometry_diagram" class="geometry-stage"></div>
  <p class="source-note">${source(SOURCES.iso1+'#page=32','ISO 17636‑1:2022 · příloha A')}<br>Digitalizovaný odečet. V blízkosti hranice se použije vyšší počet.</p>
  </details>
 </div></div>
</section>


<section id="unsharpness" class="tab-pane hidden" role="tabpanel" aria-labelledby="tab-unsharpness" hidden>
 <div class="calc-layout"><div class="form-stack">
  ${geometryChoices('ug_technique','Hodnocená geometrie',[['single','Jedna stěna'],['dwsi','Dvě stěny · DWSI'],['dwdi','Dvě stěny · DWDI']])}
  <div class="form-section"><h3>Geometrie a vzdálenosti</h3><p id="ug_technique_help" class="help"></p>
   <div class="fields-two">${field('ug_thickness','Tloušťka jedné stěny t',10,'mm')}${field('ug_gap','Mezera za zadním povrchem',0,'mm')}</div>
   <div id="ug_diameter_wrap" hidden>${field('ug_diameter','Vnější průměr De',219,'mm')}</div>
   ${field('ug_source_distance','Zdroj–přivrácený povrch',490,'mm')}
  </div>
  <div class="form-section"><h3>Zdroj a třída zkoušení</h3>${field('ug_focus','Velikost ohniska / zdroje d',1.5,'mm','Větší z obou rozměrů při skutečném výkonu.')}${quality('ug_class')}${check('ug_planar','Ve třídě A se požaduje detekce plošných vad')}</div>${error('ug_error')}
 </div><aside class="form-stack result-column" id="ug_result_panel">
  <div class="result-focus" id="ug_result_focus"><span class="result-kind" id="ug_result_kind">Geometrický výpočet</span>${result('ug_result-display','Geometrická neostrost Ug','mm')}<p id="ug_geometry" class="result-context"></p><p id="ug_next_step" class="next-step"></p><p id="ug_minimum" class="status-box"></p></div>
  <div id="ug_geometry_diagram" class="geometry-stage"></div>
  <p class="help">Posuzuje se geometrická neostrost a minimální vzdálenost pro film.</p>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p>Ug = d × b / f. DWSI hodnotí stěnu u filmu pomocí f′ a b′. Pro normové minimum f u DWDI se použije De. Podmíněná zkrácení vzdálenosti se neuplatňují.</p>${source(SOURCES.iso1+'#page=26','ISO 17636‑1:2022 · čl. 7.6')}</details>
 </aside></div>
</section>

<section id="time" class="tab-pane hidden" role="tabpanel" aria-labelledby="tab-time" hidden>
 <div class="source-switch">${select('source_type','Zdroj záření',[['xray','Rentgenka'],['gamma','Iridium‑192']])}</div>
 <div id="xray_calculator" class="calc-layout section-gap"><div class="form-stack">
  <div class="form-section"><h3>Materiál a film</h3>${select('xray_mode','Expoziční podklad',[['chart','Výrobní diagram Waygate / Agfa'],['manual','Vlastní referenční E']])}${material('xray_material')}<div class="fields-two">${field('t_thickness_xray','Celková prozářená tloušťka w',20,'mm')}${select('xray_film','Film',[['D7','Agfa D7'],['D5','Agfa D5'],['D4','Agfa D4'],['D3','Agfa D3'],['D2','Agfa D2']])}</div></div>
  <div class="form-section"><h3>Nastavení expozice</h3><div class="fields-two">${field('xray_voltage','Skutečné napětí U',200,'kV')}${field('xray_current','Skutečný proud I','','mA','Podle nastavení přístroje.')}</div><p class="help">Referenční maximum napětí: <strong id="xray_voltage_recommendation">—</strong></p>${field('t_distance_xray','Vzdálenost zdroj–film SFD',1000,'mm')}</div>
  <details class="calculation-details" id="xray_reference_fields"><summary>Referenční expozice a vzdálenost</summary><div class="form-stack"><div class="fields-two">${field('xray_factor','Referenční expozice E','','mA·min','','readonly')}${field('xray_reference_distance','Referenční SFD',1000,'mm','','readonly')}</div><div id="xray_manual_fields" class="form-stack" hidden>${textField('xray_reference_name','Podklad a podmínky','Přístroj, denzita, fólie, zpracování')}<button class="secondary-button" id="xray_confirm_reference" type="button">Potvrdit referenci pro tyto podmínky</button><p id="xray_manual_status" class="help"></p></div></div></details>${error('xray_error')}
 </div><aside class="form-stack result-column" id="xray_result_panel">
  <div class="result-focus" id="xray_result_focus" data-state="estimate"><span class="result-kind" id="xray_result_kind">Odhad z výrobního diagramu</span>${result('t_result_display_xray','Expoziční čas')}<p id="xray_result_context" class="result-context"></p><p id="xray_actual_exposure" class="result-detail"></p><p id="xray_next_step" class="next-step"></p></div>
  <div id="xray_chart_conditions" class="conditions-note"><strong>Podmínky diagramu</strong><p>Ocel · konstantní napětí · Pb fólie · denzita 2 · G135 / 28 °C / 8 minut.</p><p>Orientační podklad; ověřte shodu s přístrojem a zpracováním.</p></div>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p>t = E<sub>ref</sub> × (SFD / SFD<sub>ref</sub>)² / I</p><p>Používá se křivka zvoleného filmu při 1 m. Mimo její rozsah nebo pro jiné podmínky zvolte vlastní referenční E. Proud se zadává podle přístroje.</p>${source(SOURCES.film+'#page=14','Waygate / Agfa · str. 14')}</details>
 </aside></div>
 <div id="gamma_calculator" class="calc-layout section-gap" hidden><div class="form-stack">
  <div class="form-section"><h3>Aktivita zdroje</h3>${field('t_activity','Referenční aktivita A₀',1000,'GBq')}${date('t_activity_date','Datum a čas referenční aktivity')}${date('t_exposure_date','Datum a čas plánované expozice')}</div>
  <div class="form-section"><h3>Materiál a geometrie</h3>${field('t_thickness_gamma','Celková prozářená tloušťka oceli',40,'mm','Rozsah diagramu: 10–90 mm.')}${field('t_distance_gamma','Vzdálenost zdroj–film SFD',1000,'mm')}${select('t_film','Film',[['D7','Agfa D7'],['D5','Agfa D5'],['D4','Agfa D4']])}</div>${error('gamma_error')}
 </div><aside class="form-stack result-column" id="gamma_result_panel">
  <div class="result-focus" id="gamma_result_focus" data-state="estimate"><span class="result-kind" id="gamma_result_kind">Odhad z výrobního diagramu</span>${result('t_result_display_gamma','Expoziční čas')}<p id="gamma_result_context" class="result-context"></p><p id="t_current_activity" class="result-detail"></p><p id="gamma_next_step" class="next-step"></p></div>
  <div class="conditions-note"><strong>Ir‑192 · ocel 10–90 mm</strong><p>Pb fólie · denzita 2 · referenční SFD 1 m.</p><p>Ověřte shodu podmínek a zpracování filmu.</p></div>
  <p class="conditions-note">Kalkulátor podporuje expozice nejvýše 24 hodin. Jde o rozsah tohoto modelu, nikoli limit normy. Aktivita během expozice se aproximuje jako konstantní; do 24 hodin činí rozdíl oproti integrovanému rozpadu méně než 0,5 %.</p>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p id="gamma_reference_exposure"></p><p>A = A₀ × 2<sup>−Δd/73,827</sup>. Převod: 1 Ci = 37 GBq, 1 h = 60 min. Vzdálenost se uplatňuje ve druhé mocnině.</p>${source(SOURCES.film+'#page=16','Diagram Ir‑192 · str. 16')}<br>${source(SOURCES.decay,'Poločas Ir‑192 · LNHB')}</details>
 </aside></div>
</section>

<section id="digital_radiography" class="tab-pane hidden" role="tabpanel" aria-labelledby="tab-digital_radiography" hidden>
 <select id="cr_task" hidden aria-label="Úkol CR"><option value="check">Zkontrolovat SNR</option><option value="record">Zapsat měření</option><option value="estimate">Odhadnout expozici</option></select>
 <div class="task-switch" role="radiogroup" aria-label="Úkol CR">${[['check','Zkontrolovat SNR'],['record','Zapsat měření'],['estimate','Odhadnout expozici']].map(([v,t],i)=>`<button type="button" role="radio" aria-checked="${i===0}" tabindex="${i===0?0:-1}" data-choice-for="cr_task" data-value="${v}">${t}</button>`).join('')}</div>
 <p id="cr_task_hint" class="pane-intro"></p>
 <div class="calc-layout"><div class="form-stack">
  <div id="cr_reference_picker" class="reference-selection" hidden><div><span class="section-label">Referenční měření</span><strong id="cr_selected_reference">Žádná reference</strong></div><button type="button" id="cr_choose_reference" class="secondary-button">Vybrat z knihovny</button></div>
  <div class="form-section"><h3>Podmínky zkoušky</h3>${material('cr_material')}<div class="fields-two">${field('cr_thickness','Celková prozářená tloušťka w',40,'mm')}${field('cr_voltage','Skutečné napětí U',400,'kV')}</div>${quality('cr_class')}<p class="help">Referenční napětí: <strong id="cr_voltage_recommendation">—</strong></p>${select('cr_roi','Místo měření SNR',[['weld','Homogenní oblast svaru / kořene'],['haz','HAZ / základní materiál']])}${check('cr_flush','Převýšení svaru i kořen jsou zarovnány se základním materiálem')}
   <details class="calculation-details"><summary>Kompenzace CP I</summary><div class="form-stack">${check('cr_cp1','Podmíněně snížit požadavek SNR_N na 80 %')}${check('cr_iqi','Požadované IQI a kvalita obrazu byly ověřeny')}<p class="help">Vyžaduje skutečné napětí ≤ 80 % reference. Ostatní kompenzace se neposuzují.</p><p id="cr_cp1_error" class="field-error"></p></div></details>
  </div>
  <details id="cr_setup_details" class="calculation-details"><summary>Sestava a podmínky skenování</summary><div class="form-stack">${textField('cr_setup','Přístroj, deska a skener','Přesné modely a identifikace sestavy')}${textField('cr_screens','Filtrace, fólie a uspořádání','Materiál, tloušťka; případně bez fólií')}${textField('cr_scan','Nastavení skeneru','Rozlišení, režim, zesílení a zpracování')}${field('cr_delay','Prodleva do skenování','','min')}</div></details>
  <div id="cr_exposure_fields" class="form-section"><h3 id="cr_exposure_heading">Skutečná expozice</h3>${field('cr_fdd','Vzdálenost ohnisko–detektor FDD',1000,'mm')}<div class="fields-two">${field('cr_current','Proud','','mA')}<div id="cr_seconds_wrap">${field('cr_seconds','Skutečný čas','','s')}</div></div></div>
  <div id="cr_quality_fields" class="form-section"><h3>Naměřená kvalita</h3>${select('cr_snr_kind','Hodnota ze softwaru',[['normalized','Normalizované SNR_N'],['raw','Nenormalizované SNR']])}<div id="cr_resolution_fields"><div class="fields-two">${field('cr_srb','Naměřené SR_b','','mm','Nepoužívejte automaticky rozměr pixelu.')}${field('cr_magnification','Zvětšení M',1,'×','M ≤ 1,2: SR_b detektoru; M > 1,2: SR_b obrazu.')}</div></div>${field('cr_achieved_snr','Naměřená hodnota','','','Zadejte po nastavení podmínek měření.')}<p id="cr_stale_message" class="stale-note" role="status" hidden></p></div>
  <div id="cr_record_fields" class="form-section"><h3>Uložení měření</h3>${textField('cr_technique_name','Název měření','Např. Ocel 40 mm · zkouška 1',120)}${date('cr_measured_at','Datum a čas měření')}<button class="primary-button" type="button" id="cr_save_button">Uložit skutečné měření</button><p class="help">Uložit lze i zkušební měření pod cílem. Výsledek SNR zůstane součástí záznamu.</p>${error('cr_save_error')}</div>
  ${error('cr_error')}
 </div><aside class="form-stack result-column" id="cr_result_panel">
  <div class="result-focus" id="cr_result_focus"><span class="result-kind" id="cr_result_kind">Kontrola SNR_N</span>
   <div id="cr_quality_output">${result('cr_target_snr','Požadované SNR_N')}<p id="cr_validation_message" class="status-box" role="status"></p></div>
   <div id="cr_estimate_output" hidden>${result('cr_suggested_time','Expoziční čas')}<div class="exposure-total"><span>Potřebná expozice</span><output id="cr_suggested_exposure">—</output></div><p id="cr_estimate_target" class="result-detail"></p></div>
   <p id="cr_result_context" class="result-context"></p><p id="cr_next_step" class="next-step"></p>
  </div>
  <div id="cr_reference_status" hidden><p id="cr_reference_name" class="result-detail"></p><div id="cr_reference_error" class="reference-errors" role="status"></div><button id="cr_clear_reference" class="text-button" type="button" hidden>Zrušit referenci</button></div>
  <p class="help" id="cr_scope_note">Posuzuje se pouze SNR_N. IQI, prostorové rozlišení a ostatní požadavky se ověřují samostatně.</p>
  <details class="calculation-details"><summary>Podklady výpočtu</summary><p id="cr_target_explanation"></p>${source(SOURCES.iso2+'#page=27','ISO 17636‑2:2022, oprava 2023‑02 · tabulky 3/4')}<p>Odhad z měření: E ∝ FDD² × SNR_N². Platí při převaze kvantového šumu a shodných ostatních podmínkách. Nový snímek vždy znovu změřte.</p>${source(SOURCES.cr,'Fyzikální základ přepočtu · IAEA')}</details>
 </aside></div>
 <section class="library-section" id="cr_library_section" aria-labelledby="cr_library_title"><div class="library-heading"><div><span class="section-label">MĚŘENÍ V TOMTO PROHLÍŽEČI</span><h3 id="cr_library_title" tabindex="-1">Knihovna měření</h3></div><span id="cr_library_count"></span></div><div id="cr_library_container"></div></section>
</section>`;}

export function manual(){return `
<p>Výpočty pracují s rozměry v milimetrech. U každého modulu jsou dostupné použité podklady a rozsah platnosti.</p>
<h3>Ovládání</h3><p>Desetinná čísla lze zadávat čárkou i tečkou. Techniku zvolte podle schématu; při zadávání rozměru se příslušná kóta zvýrazní. Na počítači zůstává panel výsledku při posouvání po ruce. Mobilní souhrn otevře celý výsledek a během psaní se skryje.</p>
<p>Kalkulátory přepínáte vlevo, na mobilu horními záložkami. Zakázku, díl a svar vyberte v řádku nad kalkulátorem. Tlačítko „Uložit k tomuto svaru“ je přímo u výsledku. Historie, společná geometrie a porovnání se otevírají v bočních panelech; zavřete je tlačítkem nebo klávesou Escape.</p><p>V záhlaví lze zvolit světlý, tmavý nebo systémový vzhled. Po rozbalení stavu místního úložiště uvidíte připravenost offline kopie a přístup k ručním zálohám.</p>
<h3>Počet expozic</h3><p>Jedna stěna se zdrojem vně používá f k přivrácenému povrchu. Zdroj uvnitř a DWSI používají SFD k filmu. Zadává se tloušťka jedné stěny, nikoli součet dvou stěn. Nepřípustná poloha zdroje se odmítne; u hranice digitalizovaného nomogramu se zvolí vyšší počet. Eliptická/kolmá DWDI není tímto kalkulátorem pokryta.</p>
<h3>Geometrická neostrost</h3><p>Mezera zahrnuje odstup filmu za zadním povrchem. Pro DWSI se výpočet vztahuje k hodnocené stěně u filmu. Pro DWDI k přivrácené stěně a celé vzdálenosti přes trubku. Minimální vzdálenost se kontroluje pro film bez podmíněných zkrácení; výsledek Ug sám není úplným posouzením radiogramu.</p>
<h3>Expoziční čas na film</h3><p>Do tloušťky w zadejte celou dráhu materiálem ve směru paprsku, včetně prozařovaných stěn a relevantního převýšení. Výrobní diagram je orientační reference pro uvedený materiál, film a zpracování. Vlastní E musí patřit k zadanému filmu, tloušťce, napětí a referenční vzdálenosti. Změna těchto podmínek vyžaduje nové potvrzení hodnoty.</p><p>Rentgenový proud odpovídá skutečnému nastavení přístroje. Pro Ir‑192 se aktivita přepočítá mezi zadanými časy; časy formuláře jsou v místním časovém pásmu zařízení. Výpočet používá převod 1 Ci = 37 GBq a 1 h = 60 min.</p>
<h3>CR měření a reference</h3><p>„Zkontrolovat SNR“ potřebuje pouze podmínky zkoušky a naměřenou kvalitu. „Zapsat měření“ navíc vyžaduje sestavu, skutečnou expozici a údaje záznamu. Ty vyplňte před SNR. „Odhadnout expozici“ použije měření vybrané z knihovny; aktivní reference je označena a její nesoulad se zadáním je rozepsán podle parametrů.</p><p>Při nenormalizovaném SNR je nutné SR_b. Knihovna uchovává i nevyhovující zkušební měření, vždy s jejich výsledkem. Změna podmínek zneplatní dříve zadané SNR a zobrazí důvod. Podrobnosti měření lze rozbalit. Staré záznamy z původního prototypu zůstávají označené jako neověřené odhady a nelze je použít jako referenci.</p><p>Referenční přepočet mění pouze vzdálenost a požadované SNR_N při stejné sestavě, materiálu, tloušťce, kV, SR_b a podmínkách skenování. Při omezení strukturálním šumem nemusí předpověď SNR odpovídat. Požadovaný stav ověřte novým měřením. Splnění SNR_N nepotvrzuje celý postup ani přijatelnost vad.</p>
<h3>Offline, instalace a zálohy</h3><p>Rozbalte stav připojení v záhlaví a otevřete „Offline, instalace a zálohy“. Místní režim ukládá zakázky do zařízení bez účtu. Synchronizovaný režim má oddělené zakázky; přepnutí nic nepřesouvá. Celou místní CR knihovnu a historii zvoleného režimu lze stáhnout jako zálohu JSON a obnovit bez přepsání stávajících záznamů.</p><p>Před prvním odchodem bez sítě vyčkejte na „Aplikace připravena offline“. Instalaci spusťte tlačítkem v panelu nebo z nabídky prohlížeče. Na iPhonu a iPadu použijte Sdílet → Přidat na plochu. Ruční smazání dat webu odstraní místní data i aplikaci pro offline spuštění; pravidelně ukládejte zálohu mimo web. Externí PDF vyžadují internet.</p>
<h3>Podklady</h3><ul><li>${source(SOURCES.iso1,'ISO 17636‑1:2022 · film a geometrie')}</li><li>${source(SOURCES.iso2,'ISO 17636‑2:2022, oprava 2023‑02 · digitální radiografie')}</li><li>${source(SOURCES.film,'Waygate / Agfa · výrobní expoziční diagramy')}</li><li>${source(SOURCES.decay,'LNHB · rozpad Ir‑192')}</li><li>${source(SOURCES.cr,'IAEA · digitální průmyslová radiografie')}</li></ul>
<p>Výrobní diagramy byly převedeny na číselné křivky. Nejde o kalibraci konkrétního pracoviště. Samostatná CR knihovna zůstává v tomto prohlížeči. Zakázky, historie i CR knihovna se ukládají výhradně v tomto zařízení. Mezi zařízeními je přenesete ručním exportem a obnovou zálohy; aktualizaci aplikace stáhnete tlačítkem v panelu Offline a zálohy.</p>`;}
