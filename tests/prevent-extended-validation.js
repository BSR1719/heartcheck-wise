const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const code = fs.readFileSync('js/prevent-base.js', 'utf8');
const ctx = { console, Math };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(code, ctx);
const PREVENT = ctx.PREVENT;

function calc(p) {
  const r = PREVENT.baseRisk(p);
  assert(r.ok, `Expected valid profile, got errors: ${(r.errors||[]).join('; ')}`);
  return r;
}
function finite01(x, label) {
  assert(Number.isFinite(x), `${label} must be finite`);
  assert(x >= 0 && x <= 100, `${label} must be within 0-100`);
}
function assertAllAvailable(r, age) {
  ['cvd10','ascvd10','hf10'].forEach(k => finite01(r.result[k], k));
  ['cvd30','ascvd30','hf30'].forEach(k => {
    if (age <= 59) finite01(r.result[k], k);
    else assert.strictEqual(r.result[k], null, `${k} must be null at age ${age}`);
  });
}

// 1) Broad matrix: sex x age x cardiometabolic phenotype.
const ages = [30, 40, 50, 59, 60, 70, 79];
const phenotypes = [
  {name:'favorable', tc:170, hdl:65, sbp:105, dm:0, smoking:0, bmi:22, egfr:110, bptreat:0, statin:0},
  {name:'intermediate', tc:220, hdl:45, sbp:138, dm:0, smoking:0, bmi:28, egfr:75, bptreat:1, statin:0},
  {name:'high-risk', tc:280, hdl:30, sbp:175, dm:1, smoking:1, bmi:37, egfr:30, bptreat:1, statin:0},
  {name:'treated', tc:190, hdl:50, sbp:125, dm:1, smoking:0, bmi:31, egfr:55, bptreat:1, statin:1}
];
let count = 0;
for (const sex of [0,1]) {
  for (const age of ages) {
    for (const ph of phenotypes) {
      const r = calc({sex, age, ...ph});
      assertAllAvailable(r, age);
      count++;
    }
  }
}
assert.strictEqual(count, 56);

// 2) Exact accepted lower/upper boundaries should calculate.
for (const p of [
  {sex:0,age:30,tc:130,hdl:20,sbp:90,dm:0,smoking:0,bmi:18.5,egfr:15,bptreat:0,statin:0},
  {sex:1,age:79,tc:320,hdl:100,sbp:200,dm:1,smoking:1,bmi:39.9,egfr:140,bptreat:1,statin:1}
]) {
  const r = calc(p);
  ['cvd10','ascvd10','hf10'].forEach(k => finite01(r.result[k], `boundary ${k}`));
}

// 3) Single-factor directional checks around the same male profile.
const maleBase = {sex:0,age:52,tc:195,hdl:55,sbp:120,dm:0,smoking:0,bmi:25,egfr:95,bptreat:0,statin:0};
const mb = calc(maleBase).result;
assert(calc({...maleBase, age:65}).result.ascvd10 > mb.ascvd10, 'Older age should increase 10y ASCVD in this reference profile');
assert(calc({...maleBase, sbp:160, bptreat:1}).result.ascvd10 > mb.ascvd10, 'Higher treated SBP should increase ASCVD in this reference profile');
assert(calc({...maleBase, dm:1}).result.ascvd10 > mb.ascvd10, 'Diabetes should increase ASCVD in this reference profile');
assert(calc({...maleBase, smoking:1}).result.ascvd10 > mb.ascvd10, 'Smoking should increase ASCVD in this reference profile');
assert(calc({...maleBase, hdl:35}).result.ascvd10 > mb.ascvd10, 'Lower HDL should increase ASCVD in this reference profile');
assert(calc({...maleBase, tc:270}).result.ascvd10 > mb.ascvd10, 'Higher total cholesterol should increase ASCVD in this reference profile');
assert(calc({...maleBase, egfr:35}).result.ascvd10 > mb.ascvd10, 'Lower eGFR should increase ASCVD in this reference profile');
assert(calc({...maleBase, bmi:37}).result.hf10 > mb.hf10, 'Higher BMI should increase HF in this reference profile');

// 4) Same directional checks in a female profile to cover the other coefficient set.
const femaleBase = {sex:1,age:52,tc:195,hdl:55,sbp:120,dm:0,smoking:0,bmi:25,egfr:95,bptreat:0,statin:0};
const fb = calc(femaleBase).result;
assert(calc({...femaleBase, age:65}).result.ascvd10 > fb.ascvd10, 'Female: older age should increase 10y ASCVD in reference profile');
assert(calc({...femaleBase, dm:1}).result.ascvd10 > fb.ascvd10, 'Female: diabetes should increase ASCVD');
assert(calc({...femaleBase, smoking:1}).result.ascvd10 > fb.ascvd10, 'Female: smoking should increase ASCVD');
assert(calc({...femaleBase, egfr:35}).result.hf10 > fb.hf10, 'Female: lower eGFR should increase HF');

// 5) Partial-output contract across sexes and age bands.
for (const sex of [0,1]) {
  for (const age of [30,59,60,79]) {
    const hfOnly = calc({sex,age,tc:null,hdl:null,sbp:130,dm:0,smoking:0,bmi:29,egfr:80,bptreat:0,statin:null});
    assert.strictEqual(hfOnly.result.cvd10, null);
    assert.strictEqual(hfOnly.result.ascvd10, null);
    finite01(hfOnly.result.hf10, 'HF partial');
    if (age <= 59) finite01(hfOnly.result.hf30, 'HF30 partial'); else assert.strictEqual(hfOnly.result.hf30, null);

    const lipidOnly = calc({sex,age,tc:210,hdl:45,sbp:130,dm:0,smoking:0,bmi:null,egfr:80,bptreat:0,statin:0});
    finite01(lipidOnly.result.cvd10, 'CVD partial');
    finite01(lipidOnly.result.ascvd10, 'ASCVD partial');
    assert.strictEqual(lipidOnly.result.hf10, null);
    if (age <= 59) {
      finite01(lipidOnly.result.cvd30, 'CVD30 partial');
      finite01(lipidOnly.result.ascvd30, 'ASCVD30 partial');
    } else {
      assert.strictEqual(lipidOnly.result.cvd30, null);
      assert.strictEqual(lipidOnly.result.ascvd30, null);
    }
  }
}

// 6) Determinism / repeatability over representative profiles.
const deterministicProfiles = [
  maleBase,
  femaleBase,
  {sex:0,age:79,tc:320,hdl:20,sbp:200,dm:1,smoking:1,bmi:39.9,egfr:15,bptreat:1,statin:1},
  {sex:1,age:30,tc:130,hdl:100,sbp:90,dm:0,smoking:0,bmi:18.5,egfr:140,bptreat:0,statin:0}
];
for (const p of deterministicProfiles) {
  const a = calc(p).result;
  const b = calc({...p}).result;
  assert.deepStrictEqual(a,b,'Repeated calculation must be deterministic');
}

console.log(`PREVENT v2.2 extended validation passed: ${count} matrix profiles + boundaries + paired clinical factors + partial outputs + determinism`);
