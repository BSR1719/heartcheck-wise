(function(){
'use strict';
const q=s=>document.querySelector(s);
const num=id=>{const el=q('#'+id);if(!el||el.value==='')return null;const n=Number(el.value);return Number.isFinite(n)?n:null};
function addNotice(container,kind,title,text){if(!container)return;const box=document.createElement('div');box.className='alert '+kind+' clinical-audit-notice';box.innerHTML=`<strong>${title}</strong><p>${text}</p>`;container.prepend(box)}
function refineResult(){
 const result=q('#result');if(!result||result.hidden||!result.innerHTML)return;
 const band=result.querySelector('.risk-band');
 if(band&&band.textContent.trim()==='ความเสี่ยงค่อนข้างต่ำ')band.textContent='ความเสี่ยงเพิ่มขึ้นเล็กน้อย';
 const hero=result.querySelector('.result-hero');
 if(hero&&!result.querySelector('.risk-context-note')){const p=document.createElement('p');p.className='result-muted risk-context-note';p.textContent='ระดับความเสี่ยงนี้อ้างอิงช่วงคะแนน PREVENT-ASCVD 10 ปีตามแนวทาง ACC/AHA 2026 เป็นการประมาณความเสี่ยง ไม่ใช่การวินิจฉัยโรค';hero.appendChild(p)}
 const sbp=num('sbp'),dbp=num('dbp'),ldl=num('ldl'),age=num('age'),dm=num('dm'),egfr=num('egfr');
 const action=result.querySelector('.action-card')||result.querySelector('.meaning-card')||result;
 if((sbp!=null&&sbp>180)||(dbp!=null&&dbp>120))addNotice(action,'warning','ความดันสูงมาก','กรุณาพักอย่างน้อย 1 นาทีแล้ววัดซ้ำอย่างถูกต้อง หากยังสูงกว่า 180/120 mmHg และไม่มีอาการฉุกเฉิน ควรติดต่อบุคลากรทางการแพทย์โดยเร็ว หากมีเจ็บหน้าอก หายใจลำบาก อ่อนแรง/ชา การมองเห็นเปลี่ยน หรือพูดผิดปกติ ให้ไปฉุกเฉินทันที');
 if(ldl!=null&&ldl>=190)addNotice(action,'warning','LDL-C สูงมาก','LDL-C ≥190 mg/dL ควรได้รับการประเมินทางคลินิกแยกต่างหาก ไม่ควรใช้เปอร์เซ็นต์ PREVENT ที่ต่ำเพื่อสรุปว่าไม่จำเป็นต้องดูแลเรื่องไขมัน');
 else if(ldl!=null&&(ldl<70||ldl>189))addNotice(action,'warning','การแปลผลด้านไขมันต้องดูบริบทเพิ่มเติม','แนวทาง PREVENT-ASCVD สำหรับการตัดสินใจลดไขมันแบบ risk-based ใช้หลักกับ LDL-C 70–189 mg/dL ควรใช้ผลนี้ร่วมกับการประเมินทางคลินิก ไม่ใช้เปอร์เซ็นต์เพียงอย่างเดียวเพื่อตัดสินใจเรื่องยา');
 if(dm===1&&age!=null&&age>=40&&age<=75)addNotice(action,'warning','เบาหวานต้องประเมินการป้องกันเพิ่มเติม','แม้เปอร์เซ็นต์ PREVENT จะไม่สูง ผู้ที่เป็นเบาหวานอายุ 40–75 ปีควรได้รับการประเมินแผนป้องกันโรคหัวใจและหลอดเลือดร่วมกับบุคลากรทางการแพทย์ ไม่ควรใช้คะแนนนี้เพียงอย่างเดียวเพื่อตัดสินใจเรื่องยา');
 if(egfr!=null&&egfr<60)addNotice(action,'warning','การทำงานของไตลดลง','โรคไตเรื้อรังเป็นบริบทสำคัญต่อการป้องกันโรคหัวใจและหลอดเลือด แม้เปอร์เซ็นต์ PREVENT จะไม่สูง ควรนำผลการทำงานของไตไปประเมินร่วมกับแพทย์');
}
const form=q('#riskForm');if(form)form.addEventListener('submit',()=>setTimeout(refineResult,0));
window.HeartCheckClinicalContent={refineResult};
})();
