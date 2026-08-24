const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

// Load the browser-targeted engine into an isolated Node VM.
const code = fs.readFileSync('js/prevent-base.js', 'utf8');
const context = { console, Math };
context.window = context;
vm.createContext(context);
vm.runInContext(code, context);
const PREVENT = context.PREVENT;

function close(actual, expected, tolerance = 1e-5, label = '') {
  assert(Number.isFinite(actual), `${label} must be finite`);
  const delta = Math.abs(actual - expected);
  assert(delta <= tolerance, `${label}: expected ${expected}, got ${actual}, |Δ|=${delta}`);
}

// ORACLE 1 — official AHAprevent package vignette output.
// AHAprevent v1.0.0 example: 45-y female, TC 200, HDL 60, SBP 120,
// diabetes yes, nonsmoker, BMI 25, eGFR 95, no BP treatment, no statin.
const ahaExample = PREVENT.baseRisk({
  sex: 1, age: 45, tc: 200, hdl: 60, sbp: 120,
  dm: 1, smoking: 0, bmi: 25, egfr: 95, bptreat: 0, statin: 0
});
assert(ahaExample.ok);
close(ahaExample.result.cvd10, 3.37941, 1e-5, 'AHA vignette CVD 10y');
close(ahaExample.result.ascvd10, 2.101978, 1e-5, 'AHA vignette ASCVD 10y');
close(ahaExample.result.hf10, 1.698138, 1e-5, 'AHA vignette HF 10y');
close(ahaExample.result.cvd30, 20.64996, 1e-5, 'AHA vignette CVD 30y');
close(ahaExample.result.ascvd30, 11.99614, 1e-5, 'AHA vignette ASCVD 30y');
close(ahaExample.result.hf30, 12.79447, 1e-5, 'AHA vignette HF 30y');

// AGE BOUNDARIES — 30-year outputs only for age 30–59.
const age59 = PREVENT.baseRisk({sex:0,age:59,tc:210,hdl:45,sbp:130,dm:0,smoking:0,bmi:27,egfr:90,bptreat:0,statin:0});
assert(age59.ok);
assert.notStrictEqual(age59.result.ascvd30, null);
const age60 = PREVENT.baseRisk({sex:0,age:60,tc:210,hdl:45,sbp:130,dm:0,smoking:0,bmi:27,egfr:90,bptreat:0,statin:0});
assert(age60.ok);
assert.strictEqual(age60.result.ascvd30, null);
assert.strictEqual(age60.result.cvd30, null);
assert.strictEqual(age60.result.hf30, null);

// PARTIAL OUTPUTS — lipids absent => HF still calculable when BMI is present.
const hfOnly = PREVENT.baseRisk({sex:0,age:58,tc:null,hdl:null,sbp:150,dm:0,smoking:0,bmi:35,egfr:45,bptreat:1,statin:null});
assert(hfOnly.ok);
assert.strictEqual(hfOnly.result.ascvd10, null);
assert.strictEqual(hfOnly.result.cvd10, null);
assert(Number.isFinite(hfOnly.result.hf10));
assert.strictEqual(hfOnly.partial.lipids, false);
assert.strictEqual(hfOnly.partial.bmi, true);

// BMI absent => CVD/ASCVD still calculable when lipid inputs are complete.
const lipidOnly = PREVENT.baseRisk({sex:1,age:39,tc:190,hdl:50,sbp:110,dm:1,smoking:0,bmi:null,egfr:120,bptreat:0,statin:0});
assert(lipidOnly.ok);
assert(Number.isFinite(lipidOnly.result.ascvd10));
assert(Number.isFinite(lipidOnly.result.cvd10));
assert.strictEqual(lipidOnly.result.hf10, null);
assert.strictEqual(lipidOnly.partial.lipids, true);
assert.strictEqual(lipidOnly.partial.bmi, false);

// INPUT VALIDATION / RANGE GUARDS.
for (const bad of [
  {key:'age', value:29}, {key:'age', value:80},
  {key:'sbp', value:89}, {key:'sbp', value:201},
  {key:'tc', value:129}, {key:'tc', value:321},
  {key:'hdl', value:19}, {key:'hdl', value:101},
  {key:'egfr', value:14}, {key:'egfr', value:141}
]) {
  const input = {sex:0,age:50,tc:200,hdl:50,sbp:120,dm:0,smoking:0,bmi:25,egfr:90,bptreat:0,statin:0};
  input[bad.key] = bad.value;
  const r = PREVENT.baseRisk(input);
  assert.strictEqual(r.ok, false, `${bad.key}=${bad.value} should fail validation`);
}


// BMI outside the HF-supported range suppresses only HF, preserving lipid outputs.
for (const bmi of [18.4, 40]) {
  const r = PREVENT.baseRisk({sex:0,age:50,tc:200,hdl:50,sbp:120,dm:0,smoking:0,bmi,egfr:90,bptreat:0,statin:0});
  assert(r.ok, `BMI ${bmi} must not reject otherwise valid ASCVD/CVD inputs`);
  assert(Number.isFinite(r.result.ascvd10) && Number.isFinite(r.result.cvd10));
  assert.strictEqual(r.result.hf10, null);
  assert.strictEqual(r.partial.hfSuppressed, true);
}

// MONOTONIC SANITY CHECKS — not a clinical oracle, but useful regression alarms.
const low = PREVENT.baseRisk({sex:0,age:50,tc:180,hdl:60,sbp:115,dm:0,smoking:0,bmi:23,egfr:100,bptreat:0,statin:0});
const high = PREVENT.baseRisk({sex:0,age:50,tc:260,hdl:35,sbp:160,dm:1,smoking:1,bmi:34,egfr:45,bptreat:1,statin:0});
assert(low.ok && high.ok);
assert(high.result.ascvd10 > low.result.ascvd10);
assert(high.result.cvd10 > low.result.cvd10);
assert(high.result.hf10 > low.result.hf10);

console.log('PREVENT v2.1 validation passed: official vignette oracle + boundary + partial-output + range + sanity tests');
