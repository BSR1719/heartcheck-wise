const fs=require('fs'),vm=require('vm'),assert=require('assert');
class El{constructor(id){this.id=id;this.value='';this.innerHTML='';this.hidden=id==='result';this.checked=false;this.listeners={}}addEventListener(n,f){this.listeners[n]=f}scrollIntoView(){}reset(){Object.values(elements).forEach(e=>{if(e!==this){e.value='';e.checked=false}})}}
const ids=[...fs.readFileSync('index.html','utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]),elements={};ids.forEach(id=>elements[id]=new El(id));
const redflags=[new El(),new El()];
const document={querySelector:s=>s.startsWith('#')?elements[s.slice(1)]:null,querySelectorAll:s=>s==='input[name="redflag"]:checked'?redflags.filter(x=>x.checked):[]};
const context={console,Math,document,window:null};context.window=context;context.scrollTo=()=>{};vm.createContext(context);vm.runInContext(fs.readFileSync('js/prevent-base.js','utf8'),context);vm.runInContext(fs.readFileSync('js/app.js','utf8'),context);
const UI=context.HeartCheckWiseUI;let passed=0;
function test(name,fn){try{clear();fn();passed++;console.log(`PASS ${name}`)}catch(e){console.error(`FAIL ${name}: ${e.message}`);process.exitCode=1}}
function clear(){Object.values(elements).forEach(e=>{e.value='';e.innerHTML='';e.hidden=e.id==='result'});redflags.forEach(x=>x.checked=false)}
function base(){Object.assign(elements.age,{value:'55'});elements.sex.value='0';elements.sbp.value='130';elements.egfr.value='90';elements.dm.value='0';elements.smoking.value='0';elements.bptreat.value='0';elements.redflagNone.value='1';elements.ascvdHistory.value='0'}
function full(){base();elements.tc.value='200';elements.hdl.value='50';elements.statin.value='0';elements.heightCm.value='170';elements.weightKg.value='70'}
function submit(){UI.submit({preventDefault(){}})}
function has(s){return elements.result.innerHTML.includes(s)||elements.errors.innerHTML.includes(s)}
test('emergency gate with empty calculator fields',()=>{redflags[0].checked=true;submit();assert(has('ประเมินเร่งด่วน'))});
test('emergency precedes established CVD',()=>{redflags[0].checked=true;elements.ascvdHistory.value='1';submit();assert(has('ประเมินเร่งด่วน'));assert(!has('Secondary Prevention'))});
test('secondary-prevention gate',()=>{elements.redflagNone.value='1';elements.ascvdHistory.value='1';submit();assert(has('Secondary Prevention'))});
test('complete six-output profile',()=>{full();elements.age.value='59';submit();assert.equal((elements.result.innerHTML.match(/<strong>\d+\.\d%<\/strong>/g)||[]).length,6)});
test('HF-only profile is explicitly HF',()=>{base();elements.heightCm.value='170';elements.weightKg.value='70';submit();assert(has('Heart Failure 10-year'));assert(has('HF) เท่านั้น'));assert(has('ASCVD risk unavailable'));assert(!has('High risk'))});
test('ASCVD/CVD-only profile',()=>{base();elements.tc.value='200';elements.hdl.value='50';elements.statin.value='0';submit();assert(has('HF 10 ปี</span><strong>—'));assert(has('PREVENT-ASCVD'))});
test('age 59 has 30-year outputs',()=>{full();elements.age.value='59';submit();assert(!has('ASCVD 30 ปี</span><strong>—'))});
test('age 60 suppresses 30-year outputs',()=>{full();elements.age.value='60';submit();assert(has('ASCVD 30 ปี</span><strong>—'))});
test('LDL-C 190 override',()=>{full();elements.ldl.value='190';submit();assert(has('LDL-C ≥190'))});
test('SBP 180 override',()=>{full();elements.sbp.value='180';submit();assert(has('ความดันสูงมาก'))});
test('DBP 120 override',()=>{full();elements.dbp.value='120';submit();assert(has('ความดันสูงมาก'))});
test('missing TC or HDL rejected',()=>{base();elements.tc.value='200';submit();assert(has('provided together'))});
test('missing height or weight rejected',()=>{base();elements.heightCm.value='170';submit();assert(has('provided together'))});
test('invalid height and weight rejected',()=>{base();elements.heightCm.value='99';elements.weightKg.value='301';submit();assert(has('Height must'));assert(has('Weight must'))});
test('BMI lower boundary suppresses HF only',()=>{full();elements.heightCm.value='200';elements.weightKg.value='73.9';submit();assert(has('ระงับผล HF'));assert(!has('ASCVD 10 ปี</span><strong>—'))});
test('BMI supported boundary produces HF',()=>{full();elements.heightCm.value='200';elements.weightKg.value='74';submit();assert(!has('HF 10 ปี</span><strong>—'))});
test('reset clears outputs',()=>{full();submit();UI.reset();assert(elements.result.hidden);assert.equal(elements.result.innerHTML,'');assert.equal(elements.age.value,'')});
test('unanswered clinical question is not No',()=>{base();elements.dm.value='';submit();assert(has('dm is required'))});
console.log(`\nUI functional tests: ${passed}/18 passed, ${18-passed} failed`);if(process.exitCode)process.exit(process.exitCode);
