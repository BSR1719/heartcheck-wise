(function(){
'use strict';
const q=s=>document.querySelector(s);
const result=()=>q('#result');
const PDF_LIBRARIES={
  html2canvas:'vendor/html2canvas-1.4.1.min.js',
  jspdf:'vendor/jspdf-2.5.2.umd.min.js'
};
const LOGO='BSR%20landscape%20logo.png';

function loadScript(src,test){
  if(test())return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const existing=[...document.scripts].find(s=>s.src===src);
    if(existing){existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return;}
    const s=document.createElement('script');s.src=src;s.async=true;s.crossOrigin='anonymous';
    s.onload=resolve;s.onerror=()=>reject(new Error('โหลดเครื่องมือสร้าง PDF ไม่สำเร็จ'));
    document.head.appendChild(s);
  });
}
async function ensurePdfLibraries(){
  await loadScript(PDF_LIBRARIES.html2canvas,()=>typeof window.html2canvas==='function');
  await loadScript(PDF_LIBRARIES.jspdf,()=>!!(window.jspdf&&window.jspdf.jsPDF));
}

function ensurePdfButton(){
  const container=result();
  if(!container||container.hidden||!container.innerHTML||!container.querySelector('.result-shell')||container.querySelector('.pdf-export-wrap'))return;
  const wrap=document.createElement('div');wrap.className='pdf-export-wrap';
  wrap.innerHTML='<div class="export-buttons"><button type="button" class="pdf-export-button" aria-label="บันทึกสรุปผลการประเมินเป็น PDF">บันทึกสรุป 1 หน้า PDF</button><button type="button" class="img-export-button" aria-label="บันทึกหรือแชร์สรุปผลเป็นรูปภาพ">บันทึก/แชร์รูป (PNG)</button></div><p>สรุปความเสี่ยง สิ่งที่ควรใส่ใจก่อน และแผน 90 วัน · บันทึกเป็น PDF หรือรูปภาพเพื่อแชร์ (เช่น ทาง LINE)</p><div class="pdf-status" aria-live="polite"></div>';
  container.appendChild(wrap);wrap.querySelector('.pdf-export-button').addEventListener('click',downloadResultPdf);wrap.querySelector('.img-export-button').addEventListener('click',downloadResultImage);
}
function expandForPdf(container){
  const planButton=container.querySelector('.plan-button'),panel=container.querySelector('.personal-plan');
  if(planButton&&panel&&(!panel.dataset.rendered||panel.classList.contains('plan-hidden')))planButton.click();
}
function setStatus(message,isError=false){const el=q('.pdf-status');if(!el)return;el.textContent=message||'';el.classList.toggle('error',!!isError)}
function setBusy(busy){const btn=q('.pdf-export-button');if(!btn)return;btn.disabled=busy;btn.textContent=busy?'กำลังสร้าง PDF…':'บันทึกสรุป 1 หน้า PDF'}
function setBusyImage(busy){const btn=q('.img-export-button');if(!btn)return;btn.disabled=busy;btn.textContent=busy?'กำลังสร้างรูป…':'บันทึก/แชร์รูป (PNG)'}
function clean(t){return String(t||'').replace(/\s+/g,' ').trim()}
function text(el,sel){const n=el&&el.querySelector(sel);return clean(n&&n.textContent)}
function metricValue(container,pattern){
  const metrics=[...container.querySelectorAll('.metric')];
  for(const m of metrics){if(pattern.test(clean(m.textContent))){const s=m.querySelector('strong');if(s)return clean(s.textContent)}}
  return '';
}
function parsePercent(value){
  const n=parseFloat(String(value||'').replace('%','').trim());
  return Number.isFinite(n)?Math.max(0,Math.min(100,n)):null;
}
function countRange(value){
  const n=parsePercent(value);if(n===null)return null;
  const low=Math.floor(n),high=Math.ceil(n);
  return low===high?String(low):`${low}–${high}`;
}
function complementRange(value){
  const n=parsePercent(value);if(n===null)return null;
  const remaining=100-n,low=Math.floor(remaining),high=Math.ceil(remaining);
  return low===high?String(low):`${low}–${high}`;
}
function riskMeaning(value,years){
  const events=countRange(value),noEvents=complementRange(value);
  if(!events||!noEvents)return '';
  return `ถ้ามีคน 100 คนที่มีอายุและข้อมูลสุขภาพใกล้เคียงกับคุณ ประมาณ ${events} คนอาจเกิดโรคหัวใจขาดเลือดหรือโรคหลอดเลือดสมองภายใน ${years} ปีข้างหน้า และประมาณ ${noEvents} คนจะไม่เกิดเหตุการณ์ดังกล่าวในช่วงเวลานี้`;
}
function reportData(container){
  expandForPdf(container);
  const risk=text(container,'.risk-number')||'—';
  const band=text(container,'.risk-band')||'';
  const ascvd30=metricValue(container,/ASCVD.*30|30.*ASCVD/i);
  const priorities=[...container.querySelectorAll('.plan-card.priority')].slice(0,3).map(c=>({
    title:text(c,'h5'),
    why:text(c,'.plan-why'),
    action:text(c,'li')
  })).filter(x=>x.title);
  const timeline=[...container.querySelectorAll('.plan-90 .plan-time')].slice(0,3).map(c=>({when:text(c,'strong'),detail:clean(c.textContent).replace(text(c,'strong'),'').trim()}));
  const further=[...container.querySelectorAll('.plan-card.further-assessment')].slice(0,1).map(c=>text(c,'h5')).filter(Boolean);
  const fallbackPriorities=[{title:'ดูแลความดัน ไขมัน น้ำตาล และน้ำหนัก',why:'ติดตามค่าที่เกี่ยวข้องตามบริบทสุขภาพของคุณ',action:'เลือกเริ่มจาก 1 เรื่องที่ทำได้จริง'}];
  return{risk,band,ascvd30,priorities:priorities.length?priorities:fallbackPriorities,timeline,further};
}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function nowThai(){try{return new Intl.DateTimeFormat('th-TH',{dateStyle:'long'}).format(new Date())}catch(_){return new Date().toLocaleDateString()}}
function priorityHtml(items){return items.slice(0,3).map((x,i)=>`<div class="r-priority"><span class="r-num">${i+1}</span><div><b>${esc(x.title)}</b>${x.why?`<p>${esc(x.why)}</p>`:''}${x.action?`<small><strong>เริ่มได้เลย:</strong> ${esc(x.action)}</small>`:''}</div></div>`).join('')}
function prioritySupportHtml(items){
  if(items.length!==1)return '';
  return `<div class="r-priority-support"><b>ทำทีละเรื่องก็เพียงพอ</b><ul><li>เริ่มจากคำแนะนำหลักด้านบนเพียง 1 อย่างที่ทำได้จริง</li><li>บันทึกค่าหรือพฤติกรรมที่เกี่ยวข้องอย่างสม่ำเสมอ</li><li>ทบทวนความคืบหน้าอีกครั้งในช่วง 2–4 สัปดาห์</li></ul></div>`;
}
function timelineHtml(items){const fallback=[{when:'วันนี้',detail:'เลือก 1 เรื่องสำคัญและเริ่มลงมือ'},{when:'2–4 สัปดาห์',detail:'ติดตามค่าหรือพฤติกรรมที่เกี่ยวข้อง'},{when:'ประมาณ 3 เดือน',detail:'ทบทวนความคืบหน้าและวางแผนต่อ'}];return (items.length?items:fallback).slice(0,3).map(x=>`<div class="r-time"><b>${esc(x.when)}</b><span>${esc(x.detail)}</span></div>`).join('')}
function riskCountLabel(value,years){const c=countRange(value);return c?`ประมาณ ${c} คนใน 100 คน ในช่วง ${years} ปี`:''}
function meaningHtml(data){
  const m10=riskMeaning(data.risk,10),m30=riskMeaning(data.ascvd30,30);
  return `<section class="r-meaning"><h2>ตัวเลขนี้หมายถึงอะไร?</h2><div class="r-meaning-grid"><div><b>ใน 10 ปีข้างหน้า</b><p>${esc(m10||'ค่าความเสี่ยง 10 ปีเป็นการประมาณโอกาสเกิดเหตุการณ์ในกลุ่มคนที่มีข้อมูลสุขภาพใกล้เคียงกับคุณ')}</p></div>${m30?`<div><b>เมื่อมองยาว 30 ปี</b><p>${esc(m30)}</p></div>`:''}</div><div class="r-meaning-note"><strong>อ่านอย่างไรให้เข้าใจง่าย:</strong> ตัวเลข 30 ปีมักสูงกว่า 10 ปีเพราะเป็นช่วงเวลาที่ยาวกว่า ไม่ได้หมายความว่าความเสี่ยงเพิ่มขึ้นทันทีในวันนี้ แต่สะท้อนโอกาสสะสมเมื่อเวลาผ่านไป ตัวเลขเหล่านี้เป็นการประมาณจากกลุ่มประชากร ไม่ใช่คำทำนายว่าจะเกิดกับคุณแน่นอน</div></section>`;
}
function buildOnePageReport(data){
  const report=document.createElement('section');report.className='pdf-one-page-report';
  report.innerHTML=`
    <header class="r-head"><img src="${LOGO}" crossorigin="anonymous" alt="Bangkok Hospital Surat"><div class="r-brand"><b>HeartCheck Wise</b><span>ผลประเมินเพื่อการป้องกันโรคหัวใจและหลอดเลือด</span></div><div class="r-date">${esc(nowThai())}</div></header>
    <section class="r-risk"><div><span>ความเสี่ยงโรคหัวใจขาดเลือดหรือโรคหลอดเลือดสมองใน 10 ปี</span><strong>${esc(data.risk)}</strong><em>${esc(riskCountLabel(data.risk,10))}</em><b>${esc(data.band)}</b><small>เป็นการประมาณความเสี่ยง ไม่ใช่การวินิจฉัยโรค</small></div><div class="r-risk-side"><span>มองระยะยาว 30 ปี</span><strong>${esc(data.ascvd30||'—')}</strong><em>${esc(riskCountLabel(data.ascvd30,30))}</em><small>ช่วงเวลาที่ยาวกว่าจึงมักเห็นความเสี่ยงสะสมสูงขึ้น</small></div></section>
    ${meaningHtml(data)}
    <section class="r-grid"><div class="r-card r-priority-card"><h2>สิ่งที่ควรใส่ใจก่อน</h2>${priorityHtml(data.priorities)}${prioritySupportHtml(data.priorities)}</div><div class="r-card r-plan"><h2>แผนของคุณใน 90 วัน</h2>${timelineHtml(data.timeline)}</div></section>
    <section class="r-actions"><h2>พื้นฐานที่ช่วยลดความเสี่ยงระยะยาว</h2><div class="r-action-grid"><div><b>อาหาร</b><span>เพิ่มผัก ผลไม้ ถั่ว ปลา และธัญพืชไม่ขัดสี ลดอาหารแปรรูปและเค็ม</span><small>เริ่มต้น: ลดอาหารสำเร็จรูป ไส้กรอก/แฮม และบะหมี่กึ่งสำเร็จรูป</small></div><div><b>การออกกำลังกาย</b><span>ค่อย ๆ เพิ่มกิจกรรมให้สม่ำเสมอ ตามความพร้อมของร่างกาย</span><small>เริ่มต้น: เดินหรือทำกิจกรรมสะสมให้ได้ตามกำลัง แล้วค่อยเพิ่ม</small></div><div><b>น้ำหนัก</b><span>การคุมน้ำหนักช่วยทั้งความดัน น้ำตาล และไขมัน</span><small>เริ่มต้น: ตั้งเป้าหมายเล็ก ๆ ที่ทำได้จริงและติดตามแนวโน้ม</small></div><div><b>การนอน</b><span>นอนให้พอและสม่ำเสมอ เพื่อสุขภาพหัวใจและการเผาผลาญ</span><small>เริ่มต้น: พยายามนอนประมาณ 7–9 ชั่วโมง/คืน หากกรนมากหรือสงสัยหยุดหายใจควรปรึกษาแพทย์</small></div></div></section>
    ${data.further.length?`<section class="r-discuss"><b>เรื่องที่อาจคุยกับแพทย์เพิ่มเติม</b><span>${esc(data.further[0])}</span></section>`:''}
    <footer class="r-foot"><div><b>อ้างอิงหลัก:</b> AHA PREVENT™ Equations · ACC/AHA prevention guidance · AHA Life’s Essential 8</div><div>คำแนะนำนี้ช่วยเพิ่มความเข้าใจและเตรียมการดูแลสุขภาพ ไม่ใช่คำสั่งเริ่ม/หยุด/ปรับยา และไม่แทนการประเมินโดยแพทย์</div></footer>`;
  document.body.appendChild(report);return report;
}
async function waitForImages(node){await Promise.all([...node.querySelectorAll('img')].map(img=>img.complete?Promise.resolve():new Promise(r=>{img.onload=img.onerror=r}))) }
async function buildPdfBlob(){
  const container=result();if(!container||container.hidden)throw new Error('ยังไม่มีผลการประเมิน');
  await ensurePdfLibraries();
  const report=buildOnePageReport(reportData(container));
  try{
    await waitForImages(report);
    const canvas=await window.html2canvas(report,{scale:1.6,useCORS:true,backgroundColor:'#ffffff',logging:false});
    const {jsPDF}=window.jspdf,doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
    const img=canvas.toDataURL('image/jpeg',0.94),pageW=210,pageH=297,margin=5,maxW=pageW-margin*2,maxH=pageH-margin*2;
    const ratio=Math.min(maxW/canvas.width,maxH/canvas.height),w=canvas.width*ratio,h=canvas.height*ratio;
    doc.addImage(img,'JPEG',(pageW-w)/2,(pageH-h)/2,w,h,undefined,'FAST');
    return doc.output('blob');
  }finally{report.remove()}
}
function pdfFilename(){const d=new Date(),pad=n=>String(n).padStart(2,'0');return `HeartCheck-Wise-OnePage-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.pdf`}
async function deliverPdf(blob){
  const name=pdfFilename(),file=new File([blob],name,{type:'application/pdf'});
  if(navigator.share&&navigator.canShare){try{if(navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'สรุปผล HeartCheck Wise'});return 'shared'}}catch(e){if(e&&e.name==='AbortError')return 'cancelled'}}
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);return 'downloaded';
}
async function downloadResultPdf(){
  setBusy(true);setStatus('กำลังสร้างสรุป 1 หน้า…');
  try{const blob=await buildPdfBlob(),mode=await deliverPdf(blob);if(mode==='shared')setStatus('สร้างสรุป 1 หน้าแล้ว เลือก Save to Files หรือแอปที่ต้องการได้เลย');else if(mode==='cancelled')setStatus('สร้าง PDF แล้ว แต่ยังไม่ได้เลือกที่บันทึก');else setStatus('สร้าง PDF แล้ว หากไม่เห็นไฟล์ให้ตรวจใน Downloads/Files')}
  catch(e){console.error(e);setStatus('ยังสร้าง PDF ไม่สำเร็จ กรุณาเปิดใน Safari หรือ Chrome แล้วลองอีกครั้ง',true)}finally{setBusy(false)}
}
async function ensureHtml2canvas(){await loadScript(PDF_LIBRARIES.html2canvas,()=>typeof window.html2canvas==='function')}
async function buildImageBlob(){
  const container=result();if(!container||container.hidden)throw new Error('ยังไม่มีผลการประเมิน');
  await ensureHtml2canvas();
  const report=buildOnePageReport(reportData(container));
  try{
    await waitForImages(report);
    const canvas=await window.html2canvas(report,{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false});
    return await new Promise((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error('สร้างรูปไม่สำเร็จ')),'image/png'));
  }finally{report.remove()}
}
function imageFilename(){const d=new Date(),pad=n=>String(n).padStart(2,'0');return `HeartCheck-Wise-OnePage-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.png`}
async function deliverImage(blob){
  const name=imageFilename(),file=new File([blob],name,{type:'image/png'});
  if(navigator.share&&navigator.canShare){try{if(navigator.canShare({files:[file]})){await navigator.share({files:[file]});return 'shared'}}catch(e){if(e&&e.name==='AbortError')return 'cancelled'}}
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);return 'downloaded';
}
async function downloadResultImage(){
  setBusyImage(true);setStatus('กำลังสร้างรูปสรุป…');
  try{const blob=await buildImageBlob(),mode=await deliverImage(blob);if(mode==='shared')setStatus('สร้างรูปแล้ว เลือกแชร์ไป LINE หรือบันทึกรูปได้เลย');else if(mode==='cancelled')setStatus('สร้างรูปแล้ว แต่ยังไม่ได้เลือกที่บันทึก');else setStatus('บันทึกรูปแล้ว หากไม่เห็นไฟล์ให้ตรวจใน Downloads/Photos')}
  catch(e){console.error(e);setStatus('ยังสร้างรูปไม่สำเร็จ กรุณาลองอีกครั้ง',true)}finally{setBusyImage(false)}
}
function addStyles(){
  if(q('#pdf-export-styles'))return;const s=document.createElement('style');s.id='pdf-export-styles';s.textContent=`
.pdf-export-wrap{margin-top:20px;padding:18px;border-radius:18px;background:#f7fbff;border:1px solid #d6e7f3;text-align:center}.pdf-export-button{width:100%;min-height:56px;border:0;border-radius:14px;background:#0a4f91;color:#fff;font:inherit;font-weight:900;font-size:17px;cursor:pointer}.pdf-export-button:disabled{opacity:.65;cursor:wait}.pdf-export-wrap>p{margin:9px 0 0;color:#60778d;font-size:12px}.pdf-status{margin-top:10px;color:#17643f;font-size:13px;font-weight:700}.pdf-status.error{color:#b42318}
.pdf-one-page-report{position:fixed;left:-10000px;top:0;width:794px;height:1123px;overflow:hidden;padding:28px 32px;background:#fff;color:#12395f;font-family:Inter,"Noto Sans Thai",Tahoma,sans-serif;line-height:1.36}.r-head{height:70px;display:flex;align-items:center;border-bottom:2px solid #d7e4ed;padding-bottom:10px}.r-head img{width:182px;height:52px;object-fit:contain;object-position:left center}.r-brand{padding-left:17px;margin-left:16px;border-left:1px solid #cbdbe7;display:flex;flex-direction:column}.r-brand b{font-size:22px;color:#0d3155}.r-brand span{font-size:12px;color:#60778d}.r-date{margin-left:auto;font-size:11px;color:#60778d;align-self:flex-start;padding-top:6px}.r-risk{margin-top:12px;display:grid;grid-template-columns:1fr 220px;gap:14px;background:linear-gradient(135deg,#edf8ff,#eefbf7);border:1px solid #cde2ec;border-radius:18px;padding:17px 20px}.r-risk>div:first-child{display:flex;flex-direction:column}.r-risk span{font-size:13px;color:#355a78}.r-risk strong{font-size:50px;line-height:1;color:#0d3155;margin:3px 0}.r-risk em{font-style:normal;font-size:13px;font-weight:900;color:#0969da;margin-top:1px}.r-risk b{font-size:16px;color:#0d3155;margin-top:2px}.r-risk small{font-size:9px;color:#60778d;margin-top:4px}.r-risk-side{border-left:1px solid #cbdfe8;padding-left:17px;display:flex;flex-direction:column;justify-content:center}.r-risk-side strong{font-size:31px}.r-risk-side em{font-size:11px;line-height:1.3}.r-risk-side small{font-size:8.5px;line-height:1.35}.r-meaning{margin-top:11px;padding:13px 15px;border:1px solid #d8e7ef;border-radius:15px;background:#fff}.r-meaning h2{font-size:17px;margin:0 0 8px;color:#0d3155}.r-meaning-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.r-meaning-grid>div{padding:10px 11px;border-radius:11px;background:#f6fafc}.r-meaning-grid b{display:block;font-size:12.5px;color:#0969da;margin-bottom:3px}.r-meaning-grid p{margin:0;font-size:10.7px;line-height:1.5;color:#355a78}.r-meaning-note{margin-top:8px;padding:8px 10px;border-radius:9px;background:#fff8e8;color:#70581a;font-size:9.5px;line-height:1.45}.r-grid{display:grid;grid-template-columns:1.08fr .92fr;gap:12px;margin-top:11px}.r-card{border:1px solid #d8e5ef;border-radius:15px;padding:14px 15px;background:#fff;min-height:226px}.r-card h2,.r-actions h2{font-size:17px;margin:0 0 9px;color:#0d3155}.r-priority-card{background:#fff}.r-priority{display:grid;grid-template-columns:30px 1fr;gap:8px;padding:7px 0;border-top:1px solid #edf2f5}.r-priority:first-of-type{border-top:0}.r-num{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#e7f3ff;color:#0969da;font-weight:900;font-size:11px}.r-priority b{font-size:13px}.r-priority p{font-size:10px;line-height:1.45;color:#526b84;margin:3px 0}.r-priority small{display:block;font-size:9.5px;line-height:1.4;color:#176344;background:#f3fbf6;border-radius:7px;padding:5px 7px;margin-top:4px}.r-priority-support{margin-top:10px;padding:9px 11px;border-radius:10px;background:#f7fbff;border:1px solid #dceaf3}.r-priority-support b{font-size:11.5px;color:#0d3155}.r-priority-support ul{margin:5px 0 0 17px;padding:0}.r-priority-support li{font-size:9.3px;line-height:1.4;color:#526b84;margin:2px 0}.r-plan{background:#f3fbf6;border-color:#cee7d8}.r-time{padding:9px 10px;background:#fff;border-radius:9px;margin:7px 0}.r-time b{display:block;color:#176344;font-size:12px}.r-time span{display:block;font-size:9.7px;line-height:1.4;color:#355a78;margin-top:2px}.r-actions{margin-top:11px;border-radius:15px;padding:13px 15px;background:#f5faff;border:1px solid #d6e8f4}.r-action-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.r-action-grid div{border-radius:10px;background:#fff;padding:8px 10px;min-height:74px}.r-action-grid b{display:block;font-size:12px;color:#0969da}.r-action-grid span{display:block;font-size:9.5px;line-height:1.35;color:#526b84;margin-top:2px}.r-action-grid small{display:block;font-size:8.5px;line-height:1.35;color:#176344;margin-top:4px}.r-discuss{margin-top:10px;padding:10px 13px;border-left:4px solid #8b65d5;border-radius:9px;background:#fbf9ff}.r-discuss b{font-size:11.5px}.r-discuss span{font-size:9.5px;color:#526b84;margin-left:7px}.r-foot{position:absolute;left:32px;right:32px;bottom:16px;border-top:1px solid #d8e5ef;padding-top:7px;color:#60778d;font-size:8.5px;line-height:1.35}.r-foot div+div{margin-top:3px}
@media(max-width:520px){.pdf-export-button{min-height:62px;font-size:18px}.pdf-export-wrap{padding:15px}.pdf-status{font-size:14px}}
`;document.head.appendChild(s)
}
addStyles();const target=result();if(target){const observer=new MutationObserver(()=>setTimeout(ensurePdfButton,0));observer.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});setTimeout(ensurePdfButton,0)}
window.HeartCheckPdfExport={ensurePdfButton,downloadResultPdf,buildPdfBlob,deliverPdf,expandForPdf,ensurePdfLibraries,reportData,buildOnePageReport,riskMeaning,countRange,complementRange,riskCountLabel,prioritySupportHtml,downloadResultImage,buildImageBlob,deliverImage,ensureHtml2canvas};
})();
