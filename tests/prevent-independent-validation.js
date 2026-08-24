const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

// Independent numerical cross-validation for the HeartCheck Wise PREVENT base engine.
//
// Oracle provenance:
// - Primary official oracle already lives in tests/prevent-validation.js and is the
//   AHAprevent v1.0.0 vignette.
// - The additional vectors below are transcribed from the public pyprevent
//   r_reference.csv fixture, which the upstream project documents as generated
//   from the AHAprevent R implementation. This is an independent reproducibility
//   cross-check, not a substitute for direct licensed AHA source validation.
//
// External fixture source (pinned by blob SHA in validation report):
// https://github.com/kingrc15/pyprevent/blob/main/tests/fixtures/r_cases.csv
// https://github.com/kingrc15/pyprevent/blob/main/tests/fixtures/r_reference.csv

const code = fs.readFileSync('js/prevent-base.js', 'utf8');
const context = { console, Math };
context.window = context;
vm.createContext(context);
vm.runInContext(code, context);
const PREVENT = context.PREVENT;

function close(actual, expected, tolerance = 1e-6, label = '') {
  assert(Number.isFinite(actual), `${label} must be finite; got ${actual}`);
  const delta = Math.abs(actual - expected);
  assert(delta <= tolerance, `${label}: expected ${expected}, got ${actual}, |Δ|=${delta}`);
}
function isNull(actual, label='') {
  assert.strictEqual(actual, null, `${label}: expected null, got ${actual}`);
}

const cases = [
  {
    id: 'vignette_base_female_45',
    input: {sex:1,age:45,tc:200,hdl:60,sbp:120,dm:1,smoking:0,bmi:25,egfr:95,bptreat:0,statin:0},
    expected: {cvd10:3.37940958559732,ascvd10:2.10197806318443,hf10:1.69813841006346,cvd30:20.649964963609,ascvd30:11.9961361012451,hf30:12.7944685124708}
  },
  {
    id: 'vignette_uacr_male_75_base_model',
    input: {sex:0,age:75,tc:240,hdl:90,sbp:130,dm:0,smoking:0,bmi:30,egfr:105,bptreat:1,statin:1},
    expected: {cvd10:18.1662515298969,ascvd10:10.5942427184478,hf10:12.7023425493465,cvd30:null,ascvd30:null,hf30:null}
  },
  {
    id: 'vignette_hba1c_female_39_bmi_missing_base_model',
    input: {sex:1,age:39,tc:190,hdl:50,sbp:110,dm:1,smoking:0,bmi:null,egfr:120,bptreat:0,statin:0},
    expected: {cvd10:2.07907934287527,ascvd10:1.30624111041156,hf10:null,cvd30:13.9356008230627,ascvd30:7.98817492476527,hf30:null}
  },
  {
    id: 'vignette_sdi_male_58_hdl_missing_base_model',
    input: {sex:0,age:58,tc:267,hdl:null,sbp:150,dm:0,smoking:0,bmi:35,egfr:45,bptreat:1,statin:null},
    expected: {cvd10:null,ascvd10:null,hf10:11.0185644608283,cvd30:null,ascvd30:null,hf30:34.917641070667}
  },
  {
    id: 'tables25_female_50',
    input: {sex:1,age:50,tc:200,hdl:45,sbp:160,dm:1,smoking:0,bmi:35,egfr:90,bptreat:1,statin:0},
    expected: {cvd10:14.6839372164812,ascvd10:9.19508975363287,hf10:8.05609677791426,cvd30:52.9850387063578,ascvd30:35.4255198869041,hf30:38.9602267110663}
  },
  {
    id: 'preventr_base_male_66',
    input: {sex:0,age:66,tc:188,hdl:52,sbp:148,dm:1,smoking:1,bmi:30,egfr:67,bptreat:0,statin:1},
    expected: {cvd10:22.4155711977015,ascvd10:14.2049700817931,hf10:13.7948077945273,cvd30:null,ascvd30:null,hf30:null}
  }
];

let comparisons = 0;
for (const c of cases) {
  const scored = PREVENT.baseRisk(c.input);
  assert(scored.ok, `${c.id}: engine rejected valid reference input: ${JSON.stringify(scored.errors || [])}`);
  for (const key of ['cvd10','ascvd10','hf10','cvd30','ascvd30','hf30']) {
    const expected = c.expected[key];
    const actual = scored.result[key];
    if (expected === null) isNull(actual, `${c.id} ${key}`);
    else close(actual, expected, 1e-6, `${c.id} ${key}`);
    comparisons++;
  }
  console.log(`PASS ${c.id}`);
}

console.log(`Independent PREVENT numerical cross-validation passed: ${cases.length} profiles, ${comparisons} outcome checks, tolerance <= 0.000001 percentage point`);
