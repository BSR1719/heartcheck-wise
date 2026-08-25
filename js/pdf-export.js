(function(){
'use strict';
const q=s=>document.querySelector(s);
const result=()=>q('#result');

function ensurePrintHeading(container){
  let heading=container.querySelector('.pdf-report-heading');
  if(heading)return heading;
  heading=document.createElement('section');
  heading.className='pdf-report-heading';
  heading.innerHTML='<h1>ผลการประเมินความเสี่ยงโรคหัวใจและหลอดเลือด</h1><p>HeartCheck Wise · Bangkok Hospital Surat</p><p class="pdf-generated-at"></p>';
  container.prepend(heading);
  return heading;
}

function isLikelyInAppBrowser(){
  const ua=navigator.userAgent||'';
  return /(Line\/|FBAN|FBAV|Instagram|MicroMessenger|WebView|wv\))/i.test(ua);
}

function showMobileHelp(){
  let box=q('#pdf-mobile-help');
  if(!box){
    box=document.createElement('div');
    box.id='pdf-mobile-help';
    box.className='pdf-mobile-help';
    box.innerHTML='<strong>หากหน้าบันทึก PDF ไม่เปิด</strong><p>บางแอปเปิดเว็บผ่านเบราว์เซอร์ภายในซึ่งไม่รองรับการพิมพ์เป็น PDF ให้เปิดหน้านี้ใน Safari หรือ Chrome แล้วกด “บันทึกผลเป็น PDF” อีกครั้ง</p><p class="pdf-ios-tip"><strong>iPhone:</strong> ในหน้าพิมพ์ แตะภาพตัวอย่างค้าง/ขยายให้เต็มหน้า แล้วกด Share → Save to Files เพื่อเก็บเป็น PDF</p>';
    const wrap=q('.pdf-export-wrap');
    if(wrap)wrap.appendChild(box);
  }
  box.hidden=false;
  box.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function ensurePdfButton(){
  const container=result();
  if(!container||container.hidden||!container.innerHTML||container.querySelector('.pdf-export-wrap'))return;
  const wrap=document.createElement('div');
  wrap.className='pdf-export-wrap';
  wrap.innerHTML='<button type="button" class="pdf-export-button" aria-label="บันทึกผลการประเมินเป็น PDF">บันทึกผลเป็น PDF</button><p>ไฟล์จะสร้างจากผลการประเมินและคำแนะนำบนอุปกรณ์ของคุณ โดยไม่ส่งข้อมูลส่วนบุคคลกลับมายังระบบ</p>';
  container.appendChild(wrap);
  wrap.querySelector('.pdf-export-button').addEventListener('click',printResultPdf);
}

function expandForPrint(container){
  const planButton=container.querySelector('.plan-button');
  const panel=container.querySelector('.personal-plan');
  if(planButton&&panel&&(!panel.dataset.rendered||panel.classList.contains('plan-hidden'))){
    planButton.click();
  }
  container.querySelectorAll('details').forEach(d=>{d.open=true;});
}

function printResultPdf(){
  const container=result();
  if(!container||container.hidden)return;
  expandForPrint(container);
  const heading=ensurePrintHeading(container);
  const when=heading.querySelector('.pdf-generated-at');
  if(when){
    try{when.textContent='วันที่บันทึก: '+new Intl.DateTimeFormat('th-TH',{dateStyle:'long',timeStyle:'short'}).format(new Date());}
    catch(_){when.textContent='วันที่บันทึก: '+new Date().toLocaleString();}
  }
  document.body.classList.add('printing-result-pdf');
  const cleanup=()=>document.body.classList.remove('printing-result-pdf');
  window.addEventListener('afterprint',cleanup,{once:true});
  try{
    // Important for iOS/mobile WebKit: keep print() in the original user gesture.
    window.print();
    setTimeout(cleanup,2500);
  }catch(_){
    cleanup();
    showMobileHelp();
    return;
  }
  if(isLikelyInAppBrowser()){
    setTimeout(()=>{if(document.visibilityState==='visible')showMobileHelp();},700);
  }
}

function addStyles(){
  if(q('#pdf-export-styles'))return;
  const s=document.createElement('style');
  s.id='pdf-export-styles';
  s.textContent=`
.pdf-export-wrap{margin-top:20px;padding:18px;border-radius:18px;background:#f7fbff;border:1px solid #d6e7f3;text-align:center}.pdf-export-button{width:100%;min-height:56px;border:0;border-radius:14px;background:#0a4f91;color:#fff;font:inherit;font-weight:900;font-size:17px;cursor:pointer}.pdf-export-wrap>p{margin:9px 0 0;color:#60778d;font-size:12px}.pdf-mobile-help{margin-top:14px;padding:14px 15px;border-radius:14px;background:#fff8e8;border:1px solid #ecd99d;text-align:left;color:#6e5210}.pdf-mobile-help strong{color:#5a4208}.pdf-mobile-help p{margin:6px 0 0;font-size:13px;line-height:1.55}.pdf-ios-tip{padding-top:4px}.pdf-report-heading{display:none}
@media(max-width:520px){.pdf-export-button{min-height:62px;font-size:18px}.pdf-export-wrap{padding:15px}.pdf-mobile-help p{font-size:14px}}
@media print{
 @page{size:A4;margin:14mm 12mm}
 html,body{background:#fff!important;color:#102f52!important;font-size:11pt!important}
 body.printing-result-pdf .hero,body.printing-result-pdf .mobile-steps,body.printing-result-pdf .journey,body.printing-result-pdf #riskForm,body.printing-result-pdf #errors,body.printing-result-pdf .actions,body.printing-result-pdf .trust-strip,body.printing-result-pdf .footnote,body.printing-result-pdf .top-trust,body.printing-result-pdf .prototype,body.printing-result-pdf .pdf-export-wrap{display:none!important}
 body.printing-result-pdf .top{position:static!important;padding:0 0 8mm!important;min-height:auto!important;border-bottom:1px solid #d8e5ef!important;background:#fff!important;backdrop-filter:none!important}
 body.printing-result-pdf .brand-mark{width:52mm!important;height:15mm!important}
 body.printing-result-pdf .brand>div:last-child{display:none!important}
 body.printing-result-pdf .shell{max-width:none!important;padding:0!important;margin:0!important}
 body.printing-result-pdf .page-layout{display:block!important}
 body.printing-result-pdf .form-column{width:100%!important}
 body.printing-result-pdf #result{display:block!important;border:0!important;box-shadow:none!important;padding:0!important;margin:0!important;background:#fff!important}
 body.printing-result-pdf .pdf-report-heading{display:block!important;margin:0 0 7mm;padding:0 0 5mm;border-bottom:2px solid #0a4f91}
 body.printing-result-pdf .pdf-report-heading h1{font-size:22pt!important;line-height:1.25!important;margin:0 0 2mm!important;color:#0d3155!important}
 body.printing-result-pdf .pdf-report-heading p{margin:0;color:#526b84;font-size:10pt}
 body.printing-result-pdf .personal-plan-launch{border:0!important;background:#fff!important;padding:0!important;margin-top:8mm!important}
 body.printing-result-pdf .personal-plan-launch>h3,body.printing-result-pdf .personal-plan-launch>p,body.printing-result-pdf .plan-button{display:none!important}
 body.printing-result-pdf .personal-plan{display:block!important;margin-top:0!important}
 body.printing-result-pdf .plan-card,body.printing-result-pdf .result-card,body.printing-result-pdf .plan-90,body.printing-result-pdf .alert{break-inside:avoid;page-break-inside:avoid;box-shadow:none!important}
 body.printing-result-pdf details>summary{display:none!important}
 body.printing-result-pdf details>*{display:block!important}
 body.printing-result-pdf a{color:#102f52!important;text-decoration:none!important}
 body.printing-result-pdf .result-section.small{font-size:8pt!important;color:#6d8294!important}
}
`;
  document.head.appendChild(s);
}

addStyles();
const target=result();
if(target){
  const observer=new MutationObserver(()=>setTimeout(ensurePdfButton,0));
  observer.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});
  setTimeout(ensurePdfButton,0);
}
window.HeartCheckPdfExport={ensurePdfButton,printResultPdf,expandForPrint,isLikelyInAppBrowser,showMobileHelp};
})();
