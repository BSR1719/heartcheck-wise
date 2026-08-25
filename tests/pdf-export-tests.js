const fs=require('fs'),assert=require('assert');
const index=fs.readFileSync('index.html','utf8');
const pdf=fs.readFileSync('js/pdf-export.js','utf8');
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,'-',e.message);process.exitCode=1}}
test('index loads PDF export after clinical content',()=>{const clinical=index.indexOf('<script src="js/clinical-content.js"></script>');const exportPos=index.indexOf('<script src="js/pdf-export.js"></script>');assert(clinical>=0);assert(exportPos>clinical,'pdf-export.js must load after clinical-content.js')});
test('PDF export exposes a user-visible save action',()=>{assert(pdf.includes('บันทึกผลเป็น PDF'));assert(pdf.includes('downloadResultPdf'))});
test('PDF export expands personalized recommendations',()=>{assert(pdf.includes('planButton.click()'));assert(pdf.includes('d.open=true'))});
test('PDF is generated directly instead of relying on print dialog',()=>{assert(pdf.includes('html2canvas'));assert(pdf.includes('jsPDF'));assert(pdf.includes("doc.output('blob')"));assert(!pdf.includes('window.print()'))});
test('PDF export states local-device privacy behavior',()=>{assert(pdf.includes('ไม่ส่งข้อมูลส่วนบุคคลกลับมายังระบบ'))});
test('iPhone path shares a real PDF File',()=>{assert(pdf.includes("new File([blob],name,{type:'application/pdf'})"));assert(pdf.includes('navigator.canShare({files:[file]})'));assert(pdf.includes('navigator.share({files:[file]'))});
test('fallback downloads generated PDF blob',()=>{assert(pdf.includes('URL.createObjectURL(blob)'));assert(pdf.includes('a.download=name'));assert(pdf.includes('Downloads/Files'))});
test('Thai content is rendered from DOM into PDF images',()=>{assert(pdf.includes('nodeCanvas'));assert(pdf.includes("toDataURL('image/jpeg'"));assert(pdf.includes('Noto Sans Thai'))});
if(process.exitCode)process.exit(process.exitCode);console.log('\nPDF export regression tests: PASS');
