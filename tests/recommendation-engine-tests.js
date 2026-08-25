const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ctx={console};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/recommendation-engine.js','utf8'),ctx);
const E=ctx.HeartCheckRecommendations;
function plan(input={},risk={}){return E.buildPlan(input,risk)}
function has(p,id){return p.items.some(x=>x.id===id)}
function item(p,id){return p.items.find(x=>x.id===id)}
let n=0;function test(name,fn){fn();n++;console.log('PASS',name)}
test('v1.1 traceability',()=>assert.equal(plan().version,'recommendation-engine-v1.1'));
test('smoking priority',()=>{const p=plan({smoking:1});assert.equal(p.items[0].id,'smoking')});
test('BP uses CVD context',()=>{const p=plan({sbp:135},{cvd10:8,ascvd10:2});assert(item(p,'blood-pressure').discuss.includes('PREVENT-CVD'))});
test('BP does not use ASCVD for threshold',()=>{const p=plan({sbp:135},{cvd10:5,ascvd10:9});assert(!item(p,'blood-pressure').discuss.includes('PREVENT-CVD 10 ปีอยู่ในช่วง'))});
test('LDL190 separate context',()=>assert(has(plan({ldl:190}),'ldl-190')));
test('LDL160 context',()=>{const p=plan({ldl:160});assert(has(p,'ldl-high'));assert(!has(p,'ldl-190'))});
test('diabetes recommendation',()=>assert(has(plan({dm:1,age:55}),'diabetes')));
test('isolated low eGFR does not diagnose CKD',()=>{const x=item(plan({egfr:55}),'kidney-function');assert(x.title.includes('ค่าการทำงานของไต'));assert(x.why.includes('ยังไม่ยืนยัน'))});
test('known CKD wording',()=>assert(item(plan({egfr:55,knownCkd:1}),'kidney-function').title.includes('โรคไตเรื้อรัง')));
test('UACR offered for diabetes if absent',()=>assert(has(plan({dm:1}),'uacr')));
test('UACR not offered when supplied',()=>assert(!has(plan({dm:1,uacr:20}),'uacr')));
test('Lp(a) offered',()=>assert(has(plan({}),'lpa')));
test('ApoB selective diabetes',()=>assert(has(plan({dm:1}),'apob')));
test('ApoB not universal',()=>assert(!has(plan({ldl:120}),'apob')));
test('CAC not automatic',()=>assert(!has(plan({sex:0,age:55},{ascvd10:5}),'cac')));
test('CAC requires decision uncertainty',()=>assert(has(plan({sex:0,age:55,cacDecisionUncertain:1},{ascvd10:5}),'cac')));
test('CAC respects age eligibility',()=>assert(!has(plan({sex:0,age:39,cacDecisionUncertain:1},{ascvd10:5}),'cac')));
test('CAC respects risk range',()=>assert(!has(plan({sex:0,age:55,cacDecisionUncertain:1},{ascvd10:11}),'cac')));
test('BMI wording avoids diagnosis',()=>{const x=item(plan({bmi:27}),'weight');assert(x.why.includes('BMI เป็นเพียงส่วนหนึ่ง'))});
test('disclaimer blocks prescribing interpretation',()=>{const d=plan().disclaimer;assert(d.includes('ไม่ใช่คำสั่งเริ่ม/หยุด/ปรับยา'))});
console.log(`Recommendation engine v1.1 deterministic tests passed: ${n}/${n}`);
