import { NOMOGRAMS } from './nomograms.js';
import { XRAY_CHARTS, GAMMA_CHARTS } from './manufacturer-data.js';

export const SOURCES = Object.freeze({
  iso1: 'https://weldcalc.ssab.com/sisStandards/ISO%2017636-1.pdf',
  iso2: 'https://weldcalc.ssab.com/sisStandards/ISO%2017636-2.pdf',
  film: 'https://dam.bakerhughes.com/m/15e84aab13c9d73d/original/Radiographic-Film-Systems-Brochure_EN_LR.pdf',
  decay: 'https://www.lnhb.fr/nuclides/Ir-192_tables.pdf',
  cr: 'https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1561_web.pdf',
});
export const MATERIALS = { steel: 'Ocel', aluminum: 'Hliník', titanium: 'Titan', copper_nickel: 'Měď / nikl' };
export const HALF_LIFE_DAYS = 73.827;
export const CALCULATION_VERSION = '2026-09-06.1';
// Product scope, not a normative exposure limit. Over one day the integrated
// activity differs by <0.5% from the constant-activity approximation used here.
export const MAX_GAMMA_MINUTES = 24 * 60;

export function positive(value, name='Hodnota') {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name}: zadejte kladné konečné číslo.`);
  return value;
}
function nonnegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name}: zadejte nulu nebo kladné číslo.`);
  return value;
}
function testingClass(value) {
  if (!['A','B'].includes(value)) throw new Error('Vyberte třídu A nebo B.');
}
function materialKey(value) {
  if (!Object.hasOwn(MATERIALS,value)) throw new Error('Vyberte podporovaný materiál.');
}
export function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > Number.MAX_SAFE_INTEGER/60) return 'Mimo rozsah';
  const seconds = Math.round(minutes*60);
  if (seconds===0) return '< 1 s';
  return `${Math.floor(seconds/60)} min ${seconds%60} s`;
}
export function interpolate(points, x, logarithmic=false) {
  if (!Number.isFinite(x) || !points?.length || x<points[0].x || x>points.at(-1).x) return null;
  const exact=points.find(p=>p.x===x);
  if (exact) return exact.y;
  const high=points.findIndex(p=>p.x>x),a=points[high-1],b=points[high];
  if (!a || !b) return null;
  const q=(x-a.x)/(b.x-a.x);
  if (logarithmic) return Math.exp(Math.log(positive(a.y))*(1-q)+Math.log(positive(b.y))*q);
  return a.y+(b.y-a.y)*q;
}

// Only for historical table import / checking. Existing nodes and grid edges do
// not depend on unrelated missing corners. No automatic operational use.
export function interpolateTable(table, thickness, voltage, logarithmic=false) {
  const bracket=(arr,value)=>{
    if (!Number.isFinite(value)||value<arr[0]||value>arr.at(-1)) return null;
    const exact=arr.indexOf(value);if(exact>=0)return[exact,exact];
    const hi=arr.findIndex(v=>v>value);return[hi-1,hi];
  };
  const t=bracket(table.thicknesses,thickness),v=bracket(table.voltages,voltage);
  if(!t||!v)return null;
  const at=j=>{
    const p=t.map(i=>({x:table.thicknesses[i],y:table.values[i][j]}));
    if(p.some(p=>!Number.isFinite(p.y)||p.y<=0))return null;
    return interpolate(p,thickness,logarithmic);
  };
  const values=v.map(j=>({x:table.voltages[j],y:at(j)}));
  if(values.some(p=>p.y===null))return null;
  return interpolate(values,voltage,logarithmic);
}

// Annex A curves are region boundaries. Clip only to the printed plotting
// rectangle; do not extrapolate incomplete curves into invented thresholds.
export function nomogramBoundary(line,x,outside) {
  const p=line.dataPoints;
  if(x<p[0].x)return outside?4:0;
  if(x>p.at(-1).x)return 0;
  return interpolate(p,x);
}
function countAt(lines,x,y,outside) {
  const sorted=[...lines].sort((a,b)=>a.N-b.N);
  return sorted.find(l=>outside?y<=nomogramBoundary(l,x,true):y>=nomogramBoundary(l,x,false))?.N ?? null;
}
export function exposureCount({technique,qualityClass,thickness,diameter,distance}) {
  testingClass(qualityClass);
  positive(thickness,'Tloušťka stěny');positive(diameter,'Průměr');positive(distance,'Vzdálenost');
  if(!['outside','inside','double'].includes(technique))throw new Error('Vyberte techniku prozařování.');
  const x=thickness/diameter,y=diameter/distance,outside=technique==='outside';
  if(x>.25)throw new Error('Mimo nomogram: t/De musí být nejvýše 0,25.');
  if(outside && y>4)throw new Error('Mimo nomogram: De/f musí být nejvýše 4.');
  if(technique==='double' && distance<=diameter)throw new Error('Zdroj musí ležet vně trubky: SFD musí být větší než De.');
  if(technique==='inside' && (distance<diameter/2 || distance>=diameter-thickness))throw new Error('Zdroj musí ležet v dutině: De/2 ≤ SFD < De − t. Oblast uvnitř stěny není přípustná.');
  const key=(outside?'outside':'inside')+qualityClass,lines=NOMOGRAMS[key];
  const centered=technique==='inside' && Math.abs(y-2)<1e-12;
  const nominal=centered?1:countAt(lines,x,y,outside);
  // Coordinate reading uncertainty of the supplied digitisation. Use the higher
  // count near a boundary, never fractional interpolation of exposure numbers.
  let count=nominal;
  if(!centered) {
    const candidates=[x,Math.max(0,x-.001),Math.min(.25,x+.001)].map(px=>countAt(lines,px,outside?Math.min(4,y+.01):Math.max(0,y-.01),outside));
    count=candidates.some(n=>n===null)?null:Math.max(nominal??0,...candidates);
  }
  return {count,nominal,nearBoundary:count!==nominal,x,y,lines,outside,yMax:outside?4:2,
    figure:outside?(qualityClass==='B'?'A.1':'A.3'):(qualityClass==='B'?'A.2':'A.4'),
    maxCount:Math.max(...lines.map(l=>l.N)),centered};
}

export function unsharpness({focus,sourceDistance,thickness,gap=0,diameter,technique='single',qualityClass='B',planar=false}) {
  positive(focus,'Ohnisko');positive(sourceDistance,'Vzdálenost zdroj–předmět');positive(thickness,'Tloušťka stěny');nonnegative(gap,'Mezera');testingClass(qualityClass);
  if(!['single','dwsi','dwdi'].includes(technique))throw new Error('Nepodporovaná geometrie.');
  if(technique!=='single') {
    positive(diameter,'Průměr');if(diameter<=2*thickness)throw new Error('Průměr musí být větší než dvě tloušťky stěny.');
  }
  const f=sourceDistance+(technique==='dwsi'?diameter-thickness:0);
  const b=(technique==='dwdi'?diameter:thickness)+gap;
  const effectiveB=technique==='dwdi'?diameter:(b<1.2*thickness?thickness:b);
  const coefficient=qualityClass==='B'||planar?15:7.5;
  const minF=coefficient*focus*effectiveB**(2/3);
  return {ug:focus*b/f,f,b,minF,passes:f>=minF,minInputDistance:Math.max(0,minF-(technique==='dwsi'?diameter-thickness:0)),coefficient};
}

export function maximumVoltage(material,thickness) {
  materialKey(material);positive(thickness,'Prozářená tloušťka');
  const c={steel:[100,7.5,40,.64],aluminum:[40,2.5,24,.43],titanium:[70,4,35,.5],copper_nickel:[120,9,48,.65]}[material];
  const value=thickness<=10?c[0]+c[1]*thickness:c[2]*thickness**c[3];
  return value<=1000?value:null;
}
export function activityAt(activity,referenceTime,exposureTime) {
  positive(activity,'Aktivita');
  const start=new Date(referenceTime).getTime(),end=new Date(exposureTime).getTime();
  if(!Number.isFinite(start)||!Number.isFinite(end))throw new Error('Zadejte datum a čas aktivity i expozice.');
  if(end<start)throw new Error('Datum expozice nesmí předcházet referenční aktivitě.');
  return positive(activity*2**(-(end-start)/86400000/HALF_LIFE_DAYS),'Vypočtená aktivita');
}
export function gammaTime({activity,referenceTime,exposureTime,thickness,distance,film},{historical=false}={}) {
  positive(thickness,'Prozářená tloušťka');positive(distance,'SFD');
  const curve=GAMMA_CHARTS[film];if(!curve)throw new Error('Pro tento film není dostupný diagram Ir‑192.');
  if(thickness<10 || thickness>90)throw new Error('Diagram Ir‑192 platí pro ocel 10–90 mm.');
  const currentActivity=activityAt(activity,referenceTime,exposureTime);
  const ciHours=10**(curve.log10Intercept+curve.log10Slope*thickness);
  const gbqHours=ciHours*37;
  const minutes=positive(gbqHours/currentActivity*60*(distance/1000)**2);
  if(!historical&&minutes>MAX_GAMMA_MINUTES)throw new Error('Odhad přesahuje podporovaných 24 hodin. Zkontrolujte aktivitu v GBq, datum a vzdálenost. Pro delší expozici použijte samostatně ověřený postup zohledňující rozpad zdroje.');
  return {minutes,currentActivity,ciHours,gbqHours};
}
export function xrayChartExposure(film,thickness,voltage) {
  positive(thickness,'Prozářená tloušťka');positive(voltage,'Napětí');
  const curves=XRAY_CHARTS[film];if(!curves)throw new Error('Film nemá výrobní diagram.');
  if(voltage<curves[0].kv||voltage>curves.at(-1).kv||thickness<1||thickness>40)throw new Error('Mimo výrobní diagram. Použijte vlastní referenční E.');
  let selected=curves.filter(c=>c.kv===voltage);
  if(!selected.length){const hi=curves.findIndex(c=>c.kv>voltage);selected=[curves[hi-1],curves[hi]];}
  if(selected.some(c=>thickness<c.minThickness||thickness>c.maxThickness))throw new Error('Tloušťka a napětí leží mimo vykreslené křivky. Použijte vlastní referenční E.');
  const points=selected.map(c=>({x:c.kv,y:10**(c.log10Intercept+c.log10Slope*thickness)}));
  return interpolate(points,voltage,true);
}
export function xrayTime({exposure,distance,referenceDistance,current}) {
  positive(exposure,'Referenční E');positive(distance,'SFD');positive(referenceDistance,'Referenční SFD');positive(current,'Skutečný proud');
  return positive(exposure*(distance/referenceDistance)**2/current,'Expoziční čas');
}

export function snrTarget({material,thickness,voltage,qualityClass,roi='weld',flush=false,cp1=false,iqiConfirmed=false}) {
  materialKey(material);positive(thickness,'Prozářená tloušťka');positive(voltage,'Skutečné napětí');testingClass(qualityClass);
  if(!['weld','haz'].includes(roi))throw new Error('Vyberte místo měření SNR.');
  const light=['aluminum','titanium'].includes(material);
  if(voltage>(light?500:1000))throw new Error('Napětí je mimo podporovanou tabulku SNR_N pro tento materiál.');
  let base;
  if(light)base=qualityClass==='A'?70:(voltage<=150?120:100);
  else if(voltage<=50)base=qualityClass==='A'?100:150;
  else if(qualityClass==='A')base=70;
  else if(voltage<=150)base=120;
  else base=voltage>250&&thickness>50?70:100;
  const roiFactor=roi==='haz'&&!flush?1.4:1;
  if(cp1) {
    const max=maximumVoltage(material,thickness);
    if(!iqiConfirmed||max===null||voltage>max*.8+1e-9)throw new Error('CP I vyžaduje potvrzené IQI / kvalitu obrazu a U ≤ 80 % referenčního napětí.');
  }
  return {base,roiFactor,cpFactor:cp1 ? 0.8 : 1,target:base*roiFactor*(cp1 ? 0.8 : 1),table:light?4:3};
}
export function normalizedSnr({measured,kind,srb}) {
  positive(measured,'Naměřené SNR');
  if(kind==='normalized')return measured;
  if(kind!=='raw')throw new Error('Vyberte SNR nebo SNR_N.');
  positive(srb,'Základní prostorové rozlišení SR_b');
  return positive(measured*.0886/srb,'Normalizované SNR_N');
}

export const REFERENCE_KEYS=['material','thickness','voltage','setup','screens','scan','delay','srb','magnification','roi','flush'];
export function predictCrExposure(reference,current,target) {
  if(!isMeasurement(reference) || reference.legacy)throw new Error('Nejprve zvolte referenční měření z knihovny.');
  reference=createCrMeasurement(reference);
  const changed=REFERENCE_KEYS.filter(k=>typeof reference[k]==='number'?!Number.isFinite(current[k])||Math.abs(reference[k]-current[k])>1e-9:reference[k]!==current[k]);
  if(changed.length)throw new Error('Reference neodpovídá materiálu, tloušťce, napětí, geometrii měření nebo nastavení sestavy. Je potřeba nové měření.');
  positive(reference.achievedSnr,'Referenční SNR_N');positive(reference.exposure,'Referenční expozice');positive(reference.fdd);positive(current.fdd);positive(target);
  return positive(reference.exposure*(current.fdd/reference.fdd)**2*(target/reference.achievedSnr)**2,'Odhadovaná expozice');
}
export function createCrMeasurement(input) {
  const name=input.name?.trim(),setup=input.setup?.trim(),scan=input.scan?.trim(),screens=input.screens?.trim();
  if(!name||name.length>120||!setup||!scan||!screens)throw new Error('Vyplňte název, sestavu, fólie/filtraci a nastavení skeneru.');
  positive(input.current,'Skutečný proud');positive(input.seconds,'Skutečný čas');positive(input.fdd,'FDD');positive(input.srb,'SR_b');
  if(input.magnification<1||!Number.isFinite(input.magnification))throw new Error('Zvětšení musí být alespoň 1.');
  nonnegative(input.delay,'Prodleva do skenování');
  if(!input.measuredAt || !Number.isFinite(new Date(input.measuredAt).getTime()))throw new Error('Zadejte datum měření.');
  const target=snrTarget(input),achievedSnr=normalizedSnr(input);
  const exposure=positive(input.current*input.seconds/60,'Skutečná expozice');
  return {...input,name,setup,scan,screens,schema:2,calculationVersion:CALCULATION_VERSION,achievedSnr,exposure,target:target.target,snrPass:achievedSnr>=target.target};
}
export function isMeasurement(record) {
  try {
    if(!record||record.schema!==2||typeof record.id!=='string')return false;
    const checked=createCrMeasurement(record);
    return Number.isFinite(checked.exposure)&&Number.isFinite(checked.achievedSnr);
  } catch {return false;}
}
