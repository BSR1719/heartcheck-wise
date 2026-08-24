const fs = require('fs');
const vm = require('vm');
const path = require('path');

const AHA_API = 'https://professional.heart.org/aha-service/PHDSearch/PreventCalculate';
const TOL = 0.051; // AHA API/UI is rounded to 0.1 percentage point

const source = fs.readFileSync('js/prevent-base.js', 'utf8');
const ctx = { console, Math };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(source, ctx);
const PREVENT = ctx.PREVENT;

const cases = [
  {id:'female_30_favorable',sex:1,age:30,tc:170,hdl:70,sbp:100,bmi:21,egfr:120,dm:0,smoking:0,bptreat:0,statin:0},
  {id:'male_35_smoker',sex:0,age:35,tc:230,hdl:42,sbp:138,bmi:27,egfr:95,dm:0,smoking:1,bptreat:0,statin:0},
  {id:'female_39_diabetes',sex:1,age:39,tc:190,hdl:50,sbp:110,bmi:25,egfr:120,dm:1,smoking:0,bptreat:0,statin:0},
  {id:'female_45_AHA_vignette',sex:1,age:45,tc:200,hdl:60,sbp:120,bmi:25,egfr:95,dm:1,smoking:0,bptreat:0,statin:0},
  {id:'male_50_intermediate',sex:0,age:50,tc:210,hdl:45,sbp:135,bmi:28,egfr:80,dm:0,smoking:0,bptreat:0,statin:0},
  {id:'female_50_highrisk',sex:1,age:50,tc:200,hdl:45,sbp:160,bmi:35,egfr:90,dm:1,smoking:0,bptreat:1,statin:0},
  {id:'male_59_ckd_treated',sex:0,age:59,tc:245,hdl:38,sbp:150,bmi:31,egfr:45,dm:1,smoking:0,bptreat:1,statin:1},
  {id:'female_59_smoker',sex:1,age:59,tc:260,hdl:35,sbp:155,bmi:33,egfr:62,dm:0,smoking:1,bptreat:1,statin:0},
  {id:'male_60_boundary',sex:0,age:60,tc:200,hdl:50,sbp:130,bmi:25,egfr:90,dm:0,smoking:0,bptreat:0,statin:0},
  {id:'male_66_reference',sex:0,age:66,tc:188,hdl:52,sbp:148,bmi:30,egfr:67,dm:1,smoking:1,bptreat:0,statin:1},
  {id:'female_72_ckd',sex:1,age:72,tc:220,hdl:48,sbp:145,bmi:29,egfr:35,dm:1,smoking:0,bptreat:1,statin:1},
  {id:'male_79_upper_boundary',sex:0,age:79,tc:300,hdl:30,sbp:180,bmi:38,egfr:20,dm:1,smoking:1,bptreat:1,statin:1}
];

function payload(c){
  return {
    genderType: c.sex === 1 ? 1 : 2,
    age: c.age,
    totalCholesterol: c.tc,
    hdlCholesterol: c.hdl,
    sbp: c.sbp,
    bmi: c.bmi,
    egfr: c.egfr,
    isAntihyperTensiveMedicUsed: !!c.bptreat,
    isLipidLoweringMedicUsed: !!c.statin,
    isDiabetes: !!c.dm,
    isSmoker: !!c.smoking,
    uacr: null,
    hbA1C: null,
    zipCode: null
  };
}

function mapRisk(items){
  const out = {};
  for(const item of items || []){
    if(item.Type === 'CVD') out.cvd = Number(item.RiskPercentage);
    if(item.Type === 'ASCVD') out.ascvd = Number(item.RiskPercentage);
    if(item.Type === 'Heart Failure') out.hf = Number(item.RiskPercentage);
  }
  return out;
}

function check(label, ours, official, failures){
  if(official == null){
    if(ours != null) failures.push(`${label}: official missing but local=${ours}`);
    return null;
  }
  if(ours == null){ failures.push(`${label}: local missing but official=${official}`); return null; }
  const delta = Math.abs(ours - official);
  if(delta > TOL) failures.push(`${label}: local=${ours.toFixed(6)} official=${official.toFixed(6)} delta=${delta.toFixed(6)}`);
  return delta;
}

(async()=>{
  const report = {endpoint:AHA_API,tolerance_pp:TOL,generated_at:new Date().toISOString(),cases:[],summary:{}};
  const failures = [];
  let maxDelta = 0;
  let comparisons = 0;

  for(const c of cases){
    const local = PREVENT.baseRisk(c);
    if(!local.ok) throw new Error(`${c.id}: local engine rejected valid case: ${local.errors.join('; ')}`);

    const res = await fetch(AHA_API, {
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json','User-Agent':'heartcheck-wise-live-parity/1.0'},
      body:JSON.stringify(payload(c))
    });
    if(!res.ok) throw new Error(`${c.id}: AHA HTTP ${res.status}`);
    const body = await res.json();
    if(!body.success) throw new Error(`${c.id}: AHA API returned unsuccessful response`);
    if(body.modelName !== 'Base Model') throw new Error(`${c.id}: expected Base Model, got ${body.modelName}`);

    const ten = mapRisk(body.tenYearRiskEstimations);
    const thirty = mapRisk(body.thirtyYearRiskEstimations);
    const r = local.result;
    const deltas = {};

    for(const [k,lk] of [['cvd','cvd10'],['ascvd','ascvd10'],['hf','hf10']]){
      const d = check(`${c.id} 10y ${k}`,r[lk],ten[k],failures); if(d!=null){deltas[`10y_${k}`]=d;maxDelta=Math.max(maxDelta,d);comparisons++;}
    }
    for(const [k,lk] of [['cvd','cvd30'],['ascvd','ascvd30'],['hf','hf30']]){
      if(c.age <= 59){
        const d = check(`${c.id} 30y ${k}`,r[lk],thirty[k],failures); if(d!=null){deltas[`30y_${k}`]=d;maxDelta=Math.max(maxDelta,d);comparisons++;}
      } else if(r[lk] !== null){
        failures.push(`${c.id} ${lk}: local engine should suppress 30-year output at age ${c.age}`);
      }
    }

    report.cases.push({id:c.id,input:c,local:r,official:{modelName:body.modelName,tenYear:ten,thirtyYear:thirty},deltas});
    console.log(`${c.id}: PASS candidate | max delta ${Math.max(0,...Object.values(deltas)).toFixed(4)} pp`);
  }

  report.summary = {cases:cases.length,comparisons,max_delta_pp:maxDelta,failures:failures.length,status:failures.length?'FAIL':'PASS'};
  fs.mkdirSync('validation',{recursive:true});
  fs.writeFileSync(path.join('validation','prevent-live-aha-parity-report.json'),JSON.stringify(report,null,2));

  console.log(`\nLive AHA parity: ${report.summary.status} | ${cases.length} cases | ${comparisons} comparisons | max delta ${maxDelta.toFixed(4)} pp`);
  if(failures.length){
    console.error('\nFailures:'); failures.forEach(x=>console.error('- '+x)); process.exit(1);
  }
})();
