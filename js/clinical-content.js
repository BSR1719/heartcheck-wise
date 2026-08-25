(function(){
'use strict';
const q=s=>document.querySelector(s);
const num=id=>{const el=q('#'+id);if(!el||el.value==='')return null;const n=Number(el.value);return Number.isFinite(n)?n:null};
function addNotice(container,kind,title,text){if(!container)return;const box=document.createElement('div');box.className='alert '+kind+' clinical-audit-notice';box.innerHTML=`<strong>${title}</strong><p>${text}</p>`;container.prepend(box)}
function loadRecommendationEngine(done){
 if(window.HeartCheckRecommendations)return done();
 const existing=document.querySelector('script[data-recommendation-engine]');if(existing){existing.addEventListener('load',done,{once:true});return;}
 const s=document.createElement('script');s.src='js/recommendation-engine.js';s.dataset.recommendationEngine='1';s.onload=done;document.body.appendChild(s);
}
function addStyles(){if(q('#personal-plan-styles'))return;const s=document.createElement('style');s.id='personal-plan-styles';s.textContent=`
.personal-plan-launch{margin-top:22px;padding:22px;border-radius:20px;background:linear-gradient(135deg,#eef8ff,#eefbf7);border:1px solid #cfe4ef}.personal-plan-launch h3{font-size:24px;margin:0 0 7px;color:#0d3155}.personal-plan-launch p{margin:0 0 16px;color:#526b84}.plan-button{width:100%;min-height:58px;border:0;border-radius:15px;background:linear-gradient(135deg,#075fc9,#087de4);color:#fff;font-size:18px;font-weight:900;padding:14px 18px;cursor:pointer}.personal-plan{margin-top:18px}.plan-intro{padding:22px;border-radius:20px;background:#f6fbff;border:1px solid #d8e8f2}.plan-intro h3{font-size:27px;margin:0 0 7px}.plan-intro p{margin:0;color:#526b84}.plan-group{margin-top:20px}.plan-group>h4{font-size:20px;margin:0 0 10px;color:#123e69}.plan-card{position:relative;border:1px solid #d8e5ef;border-radius:18px;padding:18px 18px 16px;margin:10px 0;background:#fff}.plan-card.priority{border-left:6px solid #0969da}.plan-card.foundation{border-left:6px solid #00a69c}.plan-card.further-assessment{border-left:6px solid #8b65d5}.plan-rank{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#e8f3ff;color:#0969da;font-weight:900;margin-right:8px}.plan-card h5{display:inline;font-size:19px;color:#173d61}.plan-why{margin:10px 0;color:#405f78}.plan-card ul{margin:8px 0 10px;padding-left:22px}.plan-card li{margin:7px 0}.plan-discuss{padding:11px 13px;border-radius:12px;background:#f4f8fb;color:#355a78;font-size:14px}.plan-source{display:block;margin-top:10px;color:#71879a;font-size:11px}.optional-tag{display:inline-block;margin-left:8px;padding:3px 8px;border-radius:999px;background:#f2edff;color:#6b4ab0;font-size:11px;font-weight:800}.plan-90{margin-top:20px;padding:20px;border-radius:18px;background:#eef8f2;border:1px solid #cfe8d9}.plan-90 h4{margin:0 0 8px;font-size:20px;color:#176344}.plan-90 ol{margin:0;padding-left:23px}.plan-90 li{margin:8px 0}.plan-disclaimer{margin-top:18px;padding:14px;border-radius:13px;background:#fff7e8;color:#795319;font-size:13px}.plan-collapse{margin-top:14px}.plan-collapse summary{cursor:pointer;font-weight:900;color:#0969da;padding:10px 0}.plan-hidden{display:none!important}
@media(max-width:520px){.personal-plan-launch{padding:18px}.personal-plan-launch h3{font-size:22px}.plan-intro{padding:18px}.plan-intro h3{font-size:24px}.plan-card{padding:16px}.plan-card h5{font-size:18px}.plan-button{font-size:18px;min-height:62px}}
`;document.head.appendChild(s)}
function parseRiskFromResult(result){
 const metrics=[...result.querySelectorAll('.metric')];let cvd10=null,ascvd10=null;
 for(const m of metrics){const t=m.textContent||'',strong=m.querySelector('strong');if(!strong)continue;const n=parseFloat(strong.textContent);if(!Number.isFinite(n))continue;if(/ASCVD.*10|10.*ASCVD/i.test(t))ascvd10=n;if(/CVD.*10|10.*CVD/i.test(t)&&!/ASCVD/i.test(t))cvd10=n;}
 const riskNum=result.querySelector('.risk-number');if(ascvd10==null&&riskNum){const n=parseFloat(riskNum.textContent);if(Number.isFinite(n))ascvd10=n;}
 return{cvd10,ascvd10};
}
function planInput(){const w=num('weightKg'),h=num('heightCm');return{age:num('age'),sex:num('sex'),sbp:num('sbp'),dbp:num('dbp'),ldl:num('ldl'),egfr:num('egfr'),dm:num('dm'),smoking:num('smoking'),bmi:w&&h?w/((h/100)**2):null};}
function cardHtml(item,rank){return `<article class="plan-card ${item.category}">${item.category==='priority'?`<span class="plan-rank">${rank}</span>`:''}<h5>${item.title}</h5>${item.optional?'<span class="optional-tag">พิจารณาเป็นรายบุคคล</span>':''}<p class="plan-why">${item.why}</p><ul>${item.actions.map(a=>`<li>${a}</li>`).join('')}</ul><div class="plan-discuss"><strong>ควรรู้อะไรต่อ:</strong> ${item.discuss}</div><small class="plan-source">อ้างอิง: ${item.source}</small></article>`}
function renderPlan(result){
 if(!window.HeartCheckRecommendations||result.querySelector('.personal-plan-launch'))return;
 const risk=parseRiskFromResult(result),plan=window.HeartCheckRecommendations.buildPlan(planInput(),risk);
 const priorities=plan.items.filter(x=>x.category==='priority'),foundation=plan.items.filter(x=>x.category==='foundation'),tests=plan.items.filter(x=>x.category==='further-assessment');
 const launch=document.createElement('section');launch.className='personal-plan-launch';launch.innerHTML=`<h3>อยากรู้ว่าควรทำอะไรต่อ?</h3><p>ดูคำแนะนำที่เรียงตามข้อมูลสุขภาพของคุณ พร้อมอาหาร การออกกำลังกาย และการตรวจเพิ่มเติมที่อาจเหมาะสม</p><button type="button" class="plan-button">ดูคำแนะนำสำหรับฉัน →</button><div class="personal-plan plan-hidden"></div>`;
 result.appendChild(launch);
 const panel=launch.querySelector('.personal-plan');
 launch.querySelector('.plan-button').addEventListener('click',function(){
   panel.innerHTML=`<div class="plan-intro"><h3>คำแนะนำสำหรับคุณ</h3><p>เริ่มจากเรื่องที่มีความสำคัญกับข้อมูลของคุณก่อน ไม่จำเป็นต้องทำทุกอย่างพร้อมกัน</p></div>${priorities.length?`<section class="plan-group"><h4>3 เรื่องที่ควรใส่ใจก่อน</h4>${priorities.slice(0,3).map((x,i)=>cardHtml(x,i+1)).join('')}${priorities.length>3?`<details class="plan-collapse"><summary>ดูปัจจัยสำคัญอื่นอีก ${priorities.length-3} เรื่อง</summary>${priorities.slice(3).map((x,i)=>cardHtml(x,i+4)).join('')}</details>`:''}</section>`:''}<section class="plan-group"><h4>พื้นฐานที่ช่วยลดความเสี่ยงระยะยาว</h4><details class="plan-collapse"><summary>อาหาร การออกกำลังกาย น้ำหนัก และการนอน</summary>${foundation.map(x=>cardHtml(x,'')).join('')}</details></section>${tests.length?`<section class="plan-group"><h4>การตรวจเพิ่มเติมที่อาจคุยกับแพทย์</h4><p class="muted">ไม่ใช่ทุกคนต้องตรวจทั้งหมด ระบบแสดงเฉพาะสิ่งที่อาจมีประโยชน์ตามบริบท</p>${tests.map(x=>cardHtml(x,'')).join('')}</section>`:''}<section class="plan-90"><h4>แผนง่าย ๆ ใน 90 วัน</h4><ol>${plan.first90Days.map(x=>`<li>${x}</li>`).join('')}</ol></section><div class="plan-disclaimer">${plan.disclaimer}</div>`;
   panel.classList.remove('plan-hidden');this.textContent='ซ่อนคำแนะนำ';this.onclick=()=>{panel.classList.toggle('plan-hidden');this.textContent=panel.classList.contains('plan-hidden')?'ดูคำแนะนำสำหรับฉัน →':'ซ่อนคำแนะนำ'};panel.scrollIntoView({behavior:'smooth',block:'start'});
 });
}
function refineResult(){
 const result=q('#result');if(!result||result.hidden||!result.innerHTML)return;
 const band=result.querySelector('.risk-band');if(band&&band.textContent.trim()==='ความเสี่ยงค่อนข้างต่ำ')band.textContent='ความเสี่ยงเพิ่มขึ้นเล็กน้อย';
 const hero=result.querySelector('.result-hero');if(hero&&!result.querySelector('.risk-context-note')){const p=document.createElement('p');p.className='result-muted risk-context-note';p.textContent='ระดับความเสี่ยงนี้เป็นการประมาณความเสี่ยง ไม่ใช่การวินิจฉัยโรค';hero.appendChild(p)}
 const sbp=num('sbp'),dbp=num('dbp'),ldl=num('ldl'),age=num('age'),dm=num('dm'),egfr=num('egfr');const action=result.querySelector('.action-card')||result.querySelector('.meaning-card')||result;
 if((sbp!=null&&sbp>180)||(dbp!=null&&dbp>120))addNotice(action,'warning','ความดันสูงมาก','กรุณาพักอย่างน้อย 1 นาทีแล้ววัดซ้ำอย่างถูกต้อง หากยังสูงกว่า 180/120 mmHg และไม่มีอาการฉุกเฉิน ควรติดต่อบุคลากรทางการแพทย์โดยเร็ว หากมีเจ็บหน้าอก หายใจลำบาก อ่อนแรง/ชา การมองเห็นเปลี่ยน หรือพูดผิดปกติ ให้ไปฉุกเฉินทันที');
 if(ldl!=null&&ldl>=190)addNotice(action,'warning','LDL-C สูงมาก','LDL-C ≥190 mg/dL ควรได้รับการประเมินทางคลินิกแยกต่างหาก ไม่ควรใช้เปอร์เซ็นต์ PREVENT ที่ต่ำเพื่อสรุปว่าไม่จำเป็นต้องดูแลเรื่องไขมัน');
 if(dm===1&&age!=null&&age>=40&&age<=75)addNotice(action,'warning','เบาหวานต้องประเมินการป้องกันเพิ่มเติม','แม้เปอร์เซ็นต์ PREVENT จะไม่สูง ผู้ที่เป็นเบาหวานอายุ 40–75 ปีควรทบทวนแผนป้องกันโรคหัวใจและหลอดเลือดกับแพทย์ ไม่ควรใช้คะแนนนี้เพียงอย่างเดียวเพื่อตัดสินใจเรื่องยา');
 if(egfr!=null&&egfr<60)addNotice(action,'warning','ค่าการทำงานของไตควรติดตาม','eGFR ที่ต่ำเพียงครั้งเดียวยังไม่ยืนยันโรคไตเรื้อรัง ควรดูความต่อเนื่องของค่าและพิจารณา UACR ร่วมตามบริบท');
 loadRecommendationEngine(()=>renderPlan(result));
}
addStyles();const form=q('#riskForm');if(form)form.addEventListener('submit',()=>setTimeout(refineResult,0));window.HeartCheckClinicalContent={refineResult};
})();
