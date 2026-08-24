(function(global){
'use strict';
const q=s=>document.querySelector(s), val=id=>q('#'+id)?.value??'';
const finite=id=>{const raw=val(id);if(raw==='')return null;const n=Number(raw);return Number.isFinite(n)?n:NaN};
const pct=v=>v==null?'—':v.toFixed(1)+'%';
function riskBand(r){if(r==null)return{label:'ASCVD risk unavailable',cls:'neutral'};if(r<3)return{label:'Low risk',cls:'low'};if(r<5)return{label:'Borderline risk',cls:'borderline'};if(r<10)return{label:'Intermediate risk',cls:'intermediate'};return{label:'High risk',cls:'high'}}
function validateUI(){
  const errors=[];
  const required=['age','sex','sbp','egfr','dm','smoking','bptreat'];
  required.forEach(id=>{const n=finite(id);if(n==null||!Number.isFinite(n))errors.push(`${id} is required and must be finite`)});
  for(const id of ['sex','dm','smoking','bptreat']){const n=finite(id);if(n!=null&&Number.isFinite(n)&&![0,1].includes(n))errors.push(`${id} must be explicitly Yes or No`)}
  const tc=finite('tc'),hdl=finite('hdl'),statin=finite('statin'),height=finite('heightCm'),weight=finite('weightKg'),dbp=finite('dbp'),ldl=finite('ldl');
  for(const [id,n] of [['TC',tc],['HDL-C',hdl],['height',height],['weight',weight],['DBP',dbp],['LDL-C',ldl]])if(Number.isNaN(n))errors.push(`${id} must be finite`);
  if((tc==null)!==(hdl==null))errors.push('Total cholesterol and HDL-C must be provided together');
  if(tc!=null&&hdl!=null&&(statin==null||![0,1].includes(statin)))errors.push('Statin status must be explicitly answered when cholesterol values are provided');
  if((height==null)!==(weight==null))errors.push('Height and weight must be provided together');
  if(height!=null&&(height<100||height>250))errors.push('Height must be 100-250 cm');
  if(weight!=null&&(weight<25||weight>300))errors.push('Weight must be 25-300 kg');
  if(dbp!=null&&(dbp<40||dbp>140))errors.push('DBP must be 40-140 mmHg');
  if(ldl!=null&&(ldl<0||ldl>400))errors.push('LDL-C must be 0-400 mg/dL');
  return errors;
}
function calculatedBMI(){const w=finite('weightKg'),h=finite('heightCm');if(!Number.isFinite(w)||!Number.isFinite(h)||h<=0)return null;return w/((h/100)**2)}
function interpretation(r){
  if(r.ascvd10!=null){const b=riskBand(r.ascvd10);return {band:b,text:b.cls==='low'?'ความเสี่ยง ASCVD 10 ปีอยู่ในระดับต่ำ แต่ควรพิจารณาปัจจัยเสี่ยงระยะยาวร่วมด้วย':b.cls==='borderline'?'ควรทบทวน ASCVD risk enhancers และหารือแนวทางป้องกันกับบุคลากรทางการแพทย์':b.cls==='intermediate'?'ควรประเมิน ASCVD preventive strategy อย่างเป็นระบบ':'ควรได้รับการประเมินความเสี่ยง ASCVD และวางแผนป้องกันกับแพทย์'};}
  if(r.hf10!=null)return{band:riskBand(null),text:'ไม่มีผล ASCVD/CVD เนื่องจากข้อมูลไขมันไม่ครบ ผลที่แสดงเป็นความเสี่ยงภาวะหัวใจล้มเหลว (HF) เท่านั้น และไม่ควรแปลผลเป็นความเสี่ยง ASCVD'};
  return{band:riskBand(null),text:'ข้อมูลไม่เพียงพอสำหรับการคำนวณ ASCVD/CVD หรือ HF กรุณาเพิ่มข้อมูลไขมัน และ/หรือส่วนสูงกับน้ำหนัก'};
}
function show(id){q(id).hidden=false;q(id).scrollIntoView({behavior:'smooth',block:'start'})}
function refreshBMI(){const bmi=calculatedBMI();q('#bmiDisplay').value=bmi==null?'':bmi.toFixed(1)+' kg/m²'}
function renderErrors(errors){q('#errors').innerHTML=`<div class="alert danger"><strong>ตรวจสอบข้อมูล:</strong><ul>${errors.map(x=>`<li>${x}</li>`).join('')}</ul></div>`}
function submit(e){
  e.preventDefault();q('#errors').innerHTML='';
  const emergency=[...document.querySelectorAll('input[name="redflag"]:checked')].length>0;
  if(emergency){q('#result').innerHTML='<div class="alert danger"><h2>ควรได้รับการประเมินเร่งด่วน</h2><p>หากอาการกำลังเกิดขึ้น ให้ไปห้องฉุกเฉินทันที หรือขอความช่วยเหลือจากบริการการแพทย์ฉุกเฉินในพื้นที่ กรุณาอย่ารอผลจากเครื่องมือนี้</p></div>';return show('#result')}
  if(val('redflagNone')!=='1')return renderErrors(['Please explicitly confirm that no emergency warning symptom is present']);
  if(val('ascvdHistory')==='1'){q('#result').innerHTML='<div class="alert warning"><h2>เครื่องมือนี้ไม่เหมาะสำหรับ Secondary Prevention</h2><p>คุณมีประวัติโรคหัวใจหรือหลอดเลือดแล้ว จึงไม่ควรใช้ PREVENT primary-prevention score เป็นตัวตัดสินหลัก ควรประเมินร่วมกับแพทย์</p></div>';return show('#result')}
  if(val('ascvdHistory')!=='0')return renderErrors(['Please explicitly answer the established cardiovascular disease question']);
  const errors=validateUI();if(errors.length)return renderErrors(errors);
  const bmi=calculatedBMI(),input={sex:finite('sex'),age:finite('age'),sbp:finite('sbp'),dm:finite('dm'),smoking:finite('smoking'),egfr:finite('egfr'),bptreat:finite('bptreat'),tc:finite('tc'),hdl:finite('hdl'),statin:finite('statin'),bmi};
  const out=PREVENT.baseRisk(input);if(!out.ok)return renderErrors(out.errors);
  const r=out.result,view=interpretation(r),ldl=finite('ldl'),dbp=finite('dbp'),overrides=[];
  if(ldl!=null&&ldl>=190)overrides.push('LDL-C ≥190 mg/dL: ต้องเข้าสู่ clinical override pathway ไม่ควรใช้ risk ต่ำเพื่อสร้างความมั่นใจเกินจริง');
  if(input.sbp>=180||(dbp!=null&&dbp>=120))overrides.push('ความดันสูงมาก: ควรวัดซ้ำอย่างถูกต้องและประเมินอาการเร่งด่วน');
  const hfNote=out.partial.hfSuppressed?'<div class="alert warning">BMI อยู่นอกช่วงที่รองรับสำหรับสมการ HF (18.5–39.9 kg/m²): ระงับผล HF แต่ยังคงผล ASCVD/CVD</div>':'';
  q('#result').innerHTML=`<div class="result-head ${view.band.cls}"><span class="eyebrow">${r.ascvd10==null&&r.hf10!=null?'PREVENT Heart Failure 10-year risk':'PREVENT-ASCVD 10-year risk'}</span><div class="risk-number">${pct(r.ascvd10==null?r.hf10:r.ascvd10)}</div><div class="risk-band">${view.band.label}</div></div>${hfNote}${overrides.length?`<div class="alert warning"><strong>Clinical override</strong><ul>${overrides.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:''}<div class="metric-grid"><div class="metric"><span>ASCVD 10 ปี</span><strong>${pct(r.ascvd10)}</strong></div><div class="metric"><span>CVD 10 ปี</span><strong>${pct(r.cvd10)}</strong></div><div class="metric"><span>HF 10 ปี</span><strong>${pct(r.hf10)}</strong></div><div class="metric"><span>ASCVD 30 ปี</span><strong>${pct(r.ascvd30)}</strong></div><div class="metric"><span>CVD 30 ปี</span><strong>${pct(r.cvd30)}</strong></div><div class="metric"><span>HF 30 ปี</span><strong>${pct(r.hf30)}</strong></div></div><div class="result-section"><h3>การแปลผล</h3><p>${view.text}</p></div><div class="result-section small"><strong>Traceability:</strong> HeartCheck Wise app 8.0.0 · PREVENT equation/source: AHAprevent R package 1.0.0 base equations · UAT release: PREVENT v2.3 · Commit: <span id="commitSha">__GIT_COMMIT_SHA__</span>.</div>`;show('#result');
}
function reset(){q('#riskForm').reset();q('#bmiDisplay').value='';q('#result').hidden=true;q('#result').innerHTML='';q('#errors').innerHTML='';global.scrollTo({top:0,behavior:'smooth'})}
q('#weightKg').addEventListener('input',refreshBMI);q('#heightCm').addEventListener('input',refreshBMI);q('#riskForm').addEventListener('submit',submit);q('#resetBtn').addEventListener('click',reset);
global.HeartCheckWiseUI={validateUI,calculatedBMI,interpretation,submit,reset};
})(window);
