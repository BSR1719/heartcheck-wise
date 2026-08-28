const fs=require('fs'),vm=require('vm'),assert=require('assert');
const stylesheet=fs.readFileSync('css/style.css','utf8');
class El{constructor(id){this.id=id;this.value='';this.innerHTML='';this.hidden=id==='result';this.checked=false;this.listeners={}}addEventListener(n,f){this.listeners[n]=f}scrollIntoView(){}reset(){Object.values(elements).forEach(e=>{if(e!==this){e.value='';e.checked=false}})}}
const ids=[...fs.readFileSync('index.html','utf8').matchAll(/id="([^"]+)"/g)].map(m=>m[1]),elements={};ids.forEach(id=>elements[id]=new El(id));
const redflags=[new El(),new El()];
const document={querySelector:s=>s.startsWith('#')?elements[s.slice(1)]:null,querySelectorAll:s=>s==='input[name="redflag"]:checked'?redflags.filter(x=>x.checked):[]};
const context={console,Math,document,window:null};context.window=context;context.scrollTo=()=>{};vm.createContext(context);vm.runInContext(fs.readFileSync('js/prevent-base.js','utf8'),context);vm.runInContext(fs.readFileSync('js/app.js','utf8'),context);
const UI=context.HeartCheckWiseUI;let passed=0;
function test(name,fn){try{clear();fn();passed++;console.log(`PASS ${name}`)}catch(e){console.error(`FAIL ${name}: ${e.message}`);process.exitCode=1}}
function clear(){Object.values(elements).forEach(e=>{e.value='';e.innerHTML='';e.hidden=e.id==='result'});redflags.forEach(x=>x.checked=false)}
function base(){elements.age.value='55';elements.sex.value='0';elements.sbp.value='130';elements.egfr.value='90';elements.dm.value='0';elements.smoking.value='0';elements.bptreat.value='0';elements.redflagNone.value='1';elements.ascvdHistory.value='0'}
function full(){base();elements.tc.value='200';elements.hdl.value='50';elements.statin.value='0';elements.heightCm.value='170';elements.weightKg.value='70'}
function submit(){UI.submit({preventDefault(){}})}
function has(s){return elements.result.innerHTML.includes(s)||elements.errors.innerHTML.includes(s)}
function metricIsDash(label){return has(`${label}</span><strong>—`) }

test('emergency gate with empty calculator fields',()=>{redflags[0].checked=true;submit();assert(has('ประเมินเร่งด่วน'))});
test('emergency precedes established CVD',()=>{redflags[0].checked=true;elements.ascvdHistory.value='1';submit();assert(has('ประเมินเร่งด่วน'));assert(!has('แบบประเมินนี้ไม่เหมาะ'))});
test('secondary-prevention gate',()=>{elements.redflagNone.value='1';elements.ascvdHistory.value='1';submit();assert(has('แบบประเมินนี้ไม่เหมาะกับผู้ที่เคยมีโรคหัวใจหรือหลอดเลือดแล้ว'))});
test('complete six-output profile',()=>{full();elements.age.value='59';submit();assert(has('risk-number'));assert.equal((elements.result.innerHTML.match(/<div class="metric">/g)||[]).length,6);assert(!metricIsDash('โรคหลอดเลือดหัวใจ/สมอง 10 ปี (ASCVD)'));assert(!metricIsDash('โรคหัวใจและหลอดเลือดโดยรวม 10 ปี (CVD)'));assert(!metricIsDash('ภาวะหัวใจล้มเหลว 10 ปี (HF)'))});
test('HF-only profile is explicitly HF',()=>{base();elements.heightCm.value='170';elements.weightKg.value='70';submit();assert(has('ภาวะหัวใจล้มเหลวเท่านั้น'));assert(has('ประเมินเฉพาะภาวะหัวใจล้มเหลว'));assert(!has('ยังประเมินไม่ได้'));assert(!metricIsDash('ภาวะหัวใจล้มเหลว 10 ปี (HF)'));assert(metricIsDash('โรคหลอดเลือดหัวใจ/สมอง 10 ปี (ASCVD)'))});
test('ASCVD/CVD-only profile',()=>{base();elements.tc.value='200';elements.hdl.value='50';elements.statin.value='0';submit();assert(has('ยังไม่มีข้อมูลส่วนสูงและน้ำหนัก'));assert(metricIsDash('ภาวะหัวใจล้มเหลว 10 ปี (HF)'));assert(!metricIsDash('โรคหลอดเลือดหัวใจ/สมอง 10 ปี (ASCVD)'));assert(!metricIsDash('โรคหัวใจและหลอดเลือดโดยรวม 10 ปี (CVD)'))});
test('age 59 has 30-year outputs',()=>{full();elements.age.value='59';submit();assert(!metricIsDash('โรคหลอดเลือดหัวใจ/สมอง 30 ปี (ASCVD)'))});
test('age 60 suppresses 30-year outputs',()=>{full();elements.age.value='60';submit();assert(metricIsDash('โรคหลอดเลือดหัวใจ/สมอง 30 ปี (ASCVD)'))});
test('LDL-C 190 override',()=>{full();elements.ldl.value='190';submit();assert(has('LDL-C ของคุณสูงมาก'))});
test('SBP 180 override',()=>{full();elements.sbp.value='180';submit();assert(has('ความดันของคุณสูงมาก'))});
test('DBP 120 override',()=>{full();elements.dbp.value='120';submit();assert(has('ความดันของคุณสูงมาก'))});
test('missing TC or HDL rejected',()=>{base();elements.tc.value='200';submit();assert(has('กรุณากรอกคอเลสเตอรอลรวมและ HDL-C ให้ครบ'))});
test('missing height or weight rejected',()=>{base();elements.heightCm.value='170';submit();assert(has('กรุณากรอกส่วนสูงและน้ำหนักให้ครบ'))});
test('invalid height and weight rejected',()=>{base();elements.heightCm.value='99';elements.weightKg.value='301';submit();assert(has('ส่วนสูงต้องอยู่ระหว่าง'));assert(has('น้ำหนักต้องอยู่ระหว่าง'))});
test('TC upper range error is Thai-first',()=>{full();elements.tc.value='321';submit();assert(has('คอเลสเตอรอลรวมต้องอยู่ระหว่าง 130–320 mg/dL'));assert(!has('Total cholesterol must'))});
test('BMI lower boundary suppresses HF only',()=>{full();elements.heightCm.value='200';elements.weightKg.value='73.9';submit();assert(has('ยังไม่แสดงความเสี่ยงภาวะหัวใจล้มเหลว'));assert(!metricIsDash('โรคหลอดเลือดหัวใจ/สมอง 10 ปี (ASCVD)'));assert(metricIsDash('ภาวะหัวใจล้มเหลว 10 ปี (HF)'))});
test('BMI supported boundary produces HF',()=>{full();elements.heightCm.value='200';elements.weightKg.value='74';submit();assert(!metricIsDash('ภาวะหัวใจล้มเหลว 10 ปี (HF)'))});
test('reset clears outputs',()=>{full();submit();UI.reset();assert(elements.result.hidden);assert.equal(elements.result.innerHTML,'');assert.equal(elements.age.value,'')});
test('hidden result is not overridden by result display styles',()=>{assert(stylesheet.includes('[hidden]{display:none!important}'))});
test('unanswered clinical question is not No',()=>{base();elements.dm.value='';submit();assert(has('กรุณาตอบคำถามเรื่องเบาหวาน'))});
test('3-5 percent band remains guideline threshold',()=>{const v=UI.interpretation({ascvd10:3.4});assert.equal(v.band.cls,'borderline');assert(!v.band.label.includes('คาบเส้น'))});
test('risk meaning gives event and non-event frequencies',()=>{const s=UI.peopleMeaning(3.4,'โรคหัวใจขาดเลือดหรือโรคหลอดเลือดสมอง',10);assert(s.includes('ประมาณ 3–4 คน'));assert(s.includes('อีกประมาณ 96–97 คน'));assert(s.includes('ภายใน 10 ปีข้างหน้า'))});
test('personal advice prioritizes actionable factors',()=>{const a=UI.personalAdvice({smoking:1,sbp:145,dm:1,egfr:55},170,28);assert.equal(a[0].title,'การสูบบุหรี่');assert.equal(a[1].title,'ความดันโลหิต');assert.equal(a[2].title,'เบาหวาน')});
const audit=fs.readFileSync('js/clinical-content.js','utf8');
test('clinical audit public borderline wording',()=>assert(audit.includes('ความเสี่ยงเพิ่มขึ้นเล็กน้อย')));
test('clinical audit preserves severe BP symptom distinction',()=>{assert(audit.includes('180/120'));assert(audit.includes('หากมีเจ็บหน้าอก'));assert(audit.includes('ไปฉุกเฉินทันที'))});
test('clinical audit protects LDL 190 from low-risk reassurance',()=>assert(audit.includes('LDL-C ≥190 mg/dL')));
test('clinical audit adds diabetes context',()=>assert(audit.includes('เบาหวานอายุ 40–75 ปี')));
test('clinical audit adds CKD context',()=>assert(audit.includes('โรคไตเรื้อรัง')));
console.log(`\nUI/clinical regression tests: ${passed}/28 passed, ${28-passed} failed`);if(process.exitCode)process.exit(process.exitCode);
