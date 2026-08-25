(function(){
'use strict';
const q=s=>document.querySelector(s);
const result=()=>q('#result');
const CDN={
  html2canvas:'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  jspdf:'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js'
};

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
  await loadScript(CDN.html2canvas,()=>typeof window.html2canvas==='function');
  await loadScript(CDN.jspdf,()=>!!(window.jspdf&&window.jspdf.jsPDF));
}

function ensurePrintHeading(container){
  let heading=container.querySelector('.pdf-report-heading');
  if(heading)return heading;
  heading=document.createElement('section');
  heading.className='pdf-report-heading';
  heading.innerHTML='<h1>ผลการประเมินความเสี่ยงโรคหัวใจและหลอดเลือด</h1><p>HeartCheck Wise · Bangkok Hospital Surat</p><p class="pdf-generated-at"></p>';
  container.prepend(heading);
  return heading;
}

function setGeneratedAt(container){
  const heading=ensurePrintHeading(container);
  const when=heading.querySelector('.pdf-generated-at');
  if(!when)return;
  try{when.textContent='วันที่บันทึก: '+new Intl.DateTimeFormat('th-TH',{dateStyle:'long',timeStyle:'short'}).format(new Date());}
  catch(_){when.textContent='วันที่บันทึก: '+new Date().toLocaleString();}
}

function ensurePdfButton(){
  const container=result();
  if(!container||container.hidden||!container.innerHTML||container.querySelector('.pdf-export-wrap'))return;
  const wrap=document.createElement('div');
  wrap.className='pdf-export-wrap';
  wrap.innerHTML='<button type="button" class="pdf-export-button" aria-label="บันทึกผลการประเมินเป็น PDF">บันทึกผลเป็น PDF</button><p>สร้างไฟล์ PDF บนอุปกรณ์ของคุณ โดยไม่ส่งข้อมูลส่วนบุคคลกลับมายังระบบ</p><div class="pdf-status" aria-live="polite"></div>';
  container.appendChild(wrap);
  wrap.querySelector('.pdf-export-button').addEventListener('click',downloadResultPdf);
}

function expandForPdf(container){
  const planButton=container.querySelector('.plan-button');
  const panel=container.querySelector('.personal-plan');
  if(planButton&&panel&&(!panel.dataset.rendered||panel.classList.contains('plan-hidden'))){planButton.click();}
  container.querySelectorAll('details').forEach(d=>{d.open=true;});
}

function setStatus(message,isError=false){
  const el=q('.pdf-status');if(!el)return;
  el.textContent=message||'';el.classList.toggle('error',!!isError);
}

function setBusy(busy){
  const btn=q('.pdf-export-button');if(!btn)return;
  btn.disabled=busy;btn.textContent=busy?'กำลังสร้าง PDF…':'บันทึกผลเป็น PDF';
}

function captureTargets(container){
  const targets=[];
  const resultShell=container.querySelector('.result-shell');
  if(resultShell){[...resultShell.children].forEach(n=>targets.push(n));}
  const launch=container.querySelector('.personal-plan-launch');
  const plan=launch&&launch.querySelector('.personal-plan');
  if(plan){[...plan.children].forEach(n=>targets.push(n));}
  if(!targets.length){[...container.children].filter(n=>!n.classList.contains('pdf-export-wrap')).forEach(n=>targets.push(n));}
  return targets.filter(n=>{
    const cs=getComputedStyle(n);return cs.display!=='none'&&cs.visibility!=='hidden'&&n.offsetHeight>0;
  });
}

async function nodeCanvas(node){
  return window.html2canvas(node,{scale:1.5,useCORS:true,backgroundColor:'#ffffff',logging:false,scrollX:0,scrollY:-window.scrollY});
}

function addCanvasToPdf(doc,canvas,state){
  const pageW=210,pageH=297,margin=10,usableW=pageW-margin*2,usableH=pageH-margin*2;
  const imgW=usableW;
  const pxPerMm=canvas.width/imgW;
  const fullHmm=canvas.height/pxPerMm;
  let sourceY=0;
  while(sourceY<canvas.height){
    let availableMm=usableH-state.y;
    if(availableMm<25){doc.addPage();state.y=margin;availableMm=usableH;}
    const remainingMm=(canvas.height-sourceY)/pxPerMm;
    const chunkMm=Math.min(remainingMm,availableMm);
    const chunkPx=Math.max(1,Math.floor(chunkMm*pxPerMm));
    const crop=document.createElement('canvas');crop.width=canvas.width;crop.height=chunkPx;
    const ctx=crop.getContext('2d');ctx.drawImage(canvas,0,sourceY,canvas.width,chunkPx,0,0,canvas.width,chunkPx);
    const data=crop.toDataURL('image/jpeg',0.92);
    doc.addImage(data,'JPEG',margin,state.y,imgW,chunkPx/pxPerMm,undefined,'FAST');
    state.y+=chunkPx/pxPerMm+3;sourceY+=chunkPx;
    if(sourceY<canvas.height){doc.addPage();state.y=margin;}
  }
}

async function buildPdfBlob(){
  const container=result();
  if(!container||container.hidden)throw new Error('ยังไม่มีผลการประเมิน');
  expandForPdf(container);setGeneratedAt(container);
  await ensurePdfLibraries();
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});
  const state={y:10};

  // Compact report heading rendered as HTML image so Thai text remains correct without embedding fonts.
  const reportHeader=document.createElement('div');
  reportHeader.className='pdf-capture-header';
  reportHeader.innerHTML='<div class="pdf-capture-brand">Bangkok Hospital Surat · HeartCheck Wise</div><h1>ผลการประเมินความเสี่ยงโรคหัวใจและหลอดเลือด</h1><p>'+((container.querySelector('.pdf-generated-at')||{}).textContent||'')+'</p>';
  document.body.appendChild(reportHeader);
  try{addCanvasToPdf(doc,await nodeCanvas(reportHeader),state);}finally{reportHeader.remove();}

  const targets=captureTargets(container);
  for(const target of targets){
    if(target.classList.contains('pdf-export-wrap'))continue;
    const canvas=await nodeCanvas(target);
    addCanvasToPdf(doc,canvas,state);
  }
  return doc.output('blob');
}

function pdfFilename(){
  const d=new Date(),pad=n=>String(n).padStart(2,'0');
  return `HeartCheck-Wise-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}.pdf`;
}

async function deliverPdf(blob){
  const name=pdfFilename();
  const file=new File([blob],name,{type:'application/pdf'});
  if(navigator.share&&navigator.canShare){
    try{
      if(navigator.canShare({files:[file]})){
        await navigator.share({files:[file],title:'ผลการประเมิน HeartCheck Wise'});
        return 'shared';
      }
    }catch(e){if(e&&e.name==='AbortError')return 'cancelled';}
  }
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
  return 'downloaded';
}

async function downloadResultPdf(){
  setBusy(true);setStatus('กำลังจัดหน้าและสร้างไฟล์ PDF…');
  try{
    const blob=await buildPdfBlob();
    const mode=await deliverPdf(blob);
    if(mode==='shared')setStatus('สร้าง PDF แล้ว เลือก “Save to Files” หรือแอปที่ต้องการจาก Share Sheet ได้เลย');
    else if(mode==='cancelled')setStatus('สร้าง PDF แล้ว แต่ยังไม่ได้เลือกที่บันทึก');
    else setStatus('สร้าง PDF แล้ว หากไม่เห็นไฟล์ให้ตรวจใน Downloads/Files');
  }catch(e){
    console.error(e);setStatus('ยังสร้าง PDF ไม่สำเร็จ กรุณาเปิดหน้านี้ใน Safari หรือ Chrome แล้วลองอีกครั้ง',true);
  }finally{setBusy(false);}
}

function addStyles(){
  if(q('#pdf-export-styles'))return;
  const s=document.createElement('style');s.id='pdf-export-styles';s.textContent=`
.pdf-export-wrap{margin-top:20px;padding:18px;border-radius:18px;background:#f7fbff;border:1px solid #d6e7f3;text-align:center}.pdf-export-button{width:100%;min-height:56px;border:0;border-radius:14px;background:#0a4f91;color:#fff;font:inherit;font-weight:900;font-size:17px;cursor:pointer}.pdf-export-button:disabled{opacity:.65;cursor:wait}.pdf-export-wrap>p{margin:9px 0 0;color:#60778d;font-size:12px}.pdf-status{margin-top:10px;color:#17643f;font-size:13px;font-weight:700}.pdf-status.error{color:#b42318}.pdf-report-heading{display:none}.pdf-capture-header{position:fixed;left:-10000px;top:0;width:760px;padding:28px 34px;background:#fff;color:#102f52;font-family:Inter,"Noto Sans Thai",Tahoma,sans-serif}.pdf-capture-header h1{font-size:30px;line-height:1.25;margin:5px 0 10px}.pdf-capture-header p{margin:0;color:#60778d;font-size:14px}.pdf-capture-brand{font-weight:900;color:#0a4f91;font-size:18px}
@media(max-width:520px){.pdf-export-button{min-height:62px;font-size:18px}.pdf-export-wrap{padding:15px}.pdf-status{font-size:14px}}
`;
  document.head.appendChild(s);
}

addStyles();
const target=result();
if(target){const observer=new MutationObserver(()=>setTimeout(ensurePdfButton,0));observer.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});setTimeout(ensurePdfButton,0);}
window.HeartCheckPdfExport={ensurePdfButton,downloadResultPdf,buildPdfBlob,deliverPdf,expandForPdf,ensurePdfLibraries,captureTargets};
})();
