import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../src/calculations.js';
import {XRAY_CHARTS} from '../src/manufacturer-data.js';
import {LEGACY_EXPOSURE_TABLE} from '../src/legacy-exposure-table.js';
const near=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} vs ${expected}`);
const snr={material:'steel',thickness:40,voltage:400,qualityClass:'B',roi:'weld',flush:false,cp1:false,iqiConfirmed:false};
const measurement={...snr,name:'Test',setup:'Tube / IP / scanner',screens:'Pb 0.1 mm',scan:'50 um / raw',delay:10,srb:.13,magnification:1,kind:'normalized',measured:85,current:2,seconds:120,fdd:1000,measuredAt:'2026-09-05T10:00:00Z',id:'test-1'};

test('Annex A independently read regions: B6 / A5 and centered exposure',()=>{
 for(const [qualityClass,count] of [['B',6],['A',5]]){
  assert.equal(c.exposureCount({technique:'double',qualityClass,thickness:10,diameter:200,distance:400}).count,count);
  assert.equal(c.exposureCount({technique:'inside',qualityClass,thickness:10,diameter:200,distance:100}).count,1);
 }
 assert.equal(c.exposureCount({technique:'outside',qualityClass:'B',thickness:10,diameter:219,distance:500}).count,10);
});
test('Annex A rejects sources in the wall, wrong-side geometry and out-of-chart coordinates',()=>{
 const base={technique:'inside',qualityClass:'B',thickness:10,diameter:200,distance:195};
 for(const update of [{},{distance:99},{distance:190},{thickness:51,distance:120},{distance:0}])assert.throws(()=>c.exposureCount({...base,...update}));
 assert.throws(()=>c.exposureCount({...base,technique:'double',distance:200}));
 assert.throws(()=>c.exposureCount({...base,technique:'outside',distance:49}));
});
test('unsharpness uses evaluated surface, gap, DWSI and DWDI geometry',()=>{
 const base={focus:1.5,sourceDistance:490,thickness:10,gap:0,diameter:219,qualityClass:'B'};
 near(c.unsharpness(base).ug,15/490);near(c.unsharpness({...base,gap:20}).ug,45/490);
 const rear=c.unsharpness({...base,technique:'dwsi'});assert.equal(rear.f,699);assert.equal(rear.b,10);near(rear.ug,15/699);
 const both=c.unsharpness({...base,technique:'dwdi',gap:20});assert.equal(both.f,490);assert.equal(both.b,239);near(both.ug,1.5*239/490);
 near(both.minF,c.unsharpness({...base,technique:'dwdi'}).minF);
 const a=c.unsharpness({...base,qualityClass:'A'});near(a.minF*2,c.unsharpness(base).minF);
 near(c.unsharpness({...base,qualityClass:'A',planar:true}).minF,c.unsharpness(base).minF);
 near(c.unsharpness({...base,gap:1}).minF,c.unsharpness(base).minF);
 assert.throws(()=>c.unsharpness({...base,sourceDistance:0}));assert.throws(()=>c.unsharpness({...base,gap:-1}));
});
test('voltage recommendations use all four piecewise curves and reject extrapolation above 1 MV',()=>{
 for(const [m,v] of [['steel',175],['aluminum',65],['titanium',110],['copper_nickel',210]])near(c.maximumVoltage(m,10),v);
 near(c.maximumVoltage('steel',40),424.01,.01);near(c.maximumVoltage('aluminum',40),117.24,.1);
 assert.equal(c.maximumVoltage('steel',1000),null);assert.throws(()=>c.maximumVoltage('steel',0));
});
test('Ir-192 benchmark from manufacturer plot, inverse square law, half-life and planned dates',()=>{
 const input={activity:1000,referenceTime:'2026-01-01T00:00Z',exposureTime:'2026-01-01T00:00Z',thickness:40,distance:1000,film:'D7'};
 const r=c.gammaTime(input);near(r.ciHours,9.3,.2);near(r.minutes,20.716,0.03);assert.equal(c.formatDuration(r.minutes),'20 min 43 s');
 near(c.gammaTime({...input,distance:2000}).minutes,4*r.minutes);
 const later=new Date(Date.parse(input.referenceTime)+c.HALF_LIFE_DAYS*86400000).toISOString();
 near(c.activityAt(1000,input.referenceTime,later),500);near(c.gammaTime({...input,exposureTime:later}).minutes,2*r.minutes);
 assert.throws(()=>c.gammaTime({...input,exposureTime:'2025-12-31'}));assert.throws(()=>c.gammaTime({...input,thickness:9.99}));assert.throws(()=>c.gammaTime({...input,thickness:90.01}));
 assert.ok(c.gammaTime({...input,thickness:10}).minutes>0);assert.ok(c.gammaTime({...input,thickness:90}).minutes>0);
});
test('film-specific X-ray curves match independently read 20 mm / 200 kV chart values',()=>{
 for(const [film,e] of [['D7',5.2],['D5',8.1],['D4',13.6],['D3',20.9],['D2',39.6]])near(c.xrayChartExposure(film,20,200),e,.6);
 // 180 kV and 260 kV catch nonsequential PDF drawing order in D2/D4.
 near(c.xrayChartExposure('D2',20,180),71,3);near(c.xrayChartExposure('D4',20,260),2.9,.2);
 for(const [film,curves] of Object.entries(XRAY_CHARTS))for(let w=1;w<=39;w+=.5){
  let previous=Infinity;
  for(const line of curves){if(w<line.minThickness||w>line.maxThickness)continue;const value=c.xrayChartExposure(film,w,line.kv);assert.ok(value<previous,`${film} ${w} mm, ${line.kv} kV`);previous=value;}
 }
 near(c.xrayChartExposure('D7',20,210),Math.sqrt(c.xrayChartExposure('D7',20,200)*c.xrayChartExposure('D7',20,220)));
 for(const args of [['D7',20,99],['D7',20,261],['D7',40,100],['D7',41,260]])assert.throws(()=>c.xrayChartExposure(...args));
});
test('all historical finite table nodes work without unrelated null corners; no extrapolation',()=>{
 const t=LEGACY_EXPOSURE_TABLE;let count=0;
 for(let i=0;i<t.thicknesses.length;i++)for(let j=0;j<t.voltages.length;j++)if(Number.isFinite(t.values[i][j])){count++;near(c.interpolateTable(t,t.thicknesses[i],t.voltages[j]),t.values[i][j]);}
 assert.equal(count,50);assert.equal(c.interpolateTable(t,0,200),null);
 const sparse={thicknesses:[10,20],voltages:[100,200],values:[[1,null],[4,16]]};
 near(c.interpolateTable(sparse,15,100,true),2);assert.equal(c.interpolateTable(sparse,15,150,true),null);
});
test('manual X-ray E respects its actual reference distance and current, with safe formatting',()=>{
 near(c.xrayTime({exposure:10,distance:1000,referenceDistance:800,current:2}),7.8125);
 assert.throws(()=>c.xrayTime({exposure:10,distance:1000,referenceDistance:800,current:0}));
 assert.equal(c.formatDuration(1.99999),'2 min 0 s');assert.equal(c.formatDuration(.001),'< 1 s');assert.equal(c.formatDuration(Infinity),'Mimo rozsah');
});
test('CR SNR targets cover exact kV and thickness boundaries in tables 3 and 4',()=>{
 for(const [voltage,thickness,a,b]of [[50,40,100,150],[50.01,40,70,120],[150,40,70,120],[150.01,40,70,100],[250,51,70,100],[250.01,50,70,100],[250.01,50.01,70,70],[1000,51,70,70]]){
  for(const [qualityClass,expected]of [['A',a],['B',b]])near(c.snrTarget({...snr,voltage,thickness,qualityClass}).target,expected);
 }
 for(const material of ['aluminum','titanium'])for(const [voltage,target]of [[50,120],[150,120],[150.01,100],[500,100]])near(c.snrTarget({...snr,material,voltage}).target,target);
 assert.throws(()=>c.snrTarget({...snr,voltage:1000.01}));assert.throws(()=>c.snrTarget({...snr,material:'aluminum',voltage:500.01}));
 near(c.snrTarget({...snr,roi:'haz'}).target,140);near(c.snrTarget({...snr,roi:'haz',flush:true}).target,100);
});
test('CR CP I is conditional; raw SNR is normalized using measured SRb',()=>{
 assert.throws(()=>c.snrTarget({...snr,cp1:true,iqiConfirmed:true}));assert.throws(()=>c.snrTarget({...snr,voltage:200,cp1:true}));
 near(c.snrTarget({...snr,voltage:200,cp1:true,iqiConfirmed:true}).target,80);
 near(c.normalizedSnr({measured:176,kind:'raw',srb:.13}),119.95076923,1e-7);
 assert.throws(()=>c.normalizedSnr({measured:176,kind:'raw',srb:0}));
});
test('CR stores actual exposure and failure; calibrated estimates depend on SNR squared',()=>{
 const ref=c.createCrMeasurement(measurement);assert.equal(ref.exposure,4);assert.equal(ref.snrPass,false);assert.equal(ref.target,100);assert.ok(c.isMeasurement(ref));
 near(c.predictCrExposure(ref,measurement,100),4*(100/85)**2);
 near(c.predictCrExposure(ref,{...measurement,fdd:2000},100),16*(100/85)**2);
 for(const change of [{voltage:399},{thickness:41},{setup:'other'},{delay:11},{srb:NaN},{fdd:0},{flush:true}])assert.throws(()=>c.predictCrExposure(ref,{...measurement,...change},100));
 assert.throws(()=>c.predictCrExposure({schema:1},measurement,100));assert.throws(()=>c.createCrMeasurement({...measurement,seconds:0}));
 const tampered={...ref,exposure:1,achievedSnr:1000};near(c.predictCrExposure(tampered,measurement,100),4*(100/85)**2);
});
