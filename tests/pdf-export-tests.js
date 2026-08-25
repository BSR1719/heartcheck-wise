const fs=require('fs'),assert=require('assert');
const index=fs.readFileSync('index.html','utf8');
const pdf=fs.readFileSync('js/pdf-export.js','utf8');
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,'-',e.message);process.exitCode=1}}

test('index loads PDF export after clinical content',()=>{
  const clinical=index.indexOf('<script src="js/clinical-content.js"></script>');
  const exportPos=index.indexOf('<script src="js/pdf-export.js"></script>');
  assert(clinical>=0);assert(exportPos>clinical,'pdf-export.js must load after clinical-content.js');
});

test('PDF export exposes one-page save action',()=>{
  assert(pdf.includes('บันทึกสรุป 1 หน้า PDF'));
  assert(pdf.includes('downloadResultPdf'));
});

test('PDF export renders personalized plan before extracting report data',()=>{
  assert(pdf.includes('planButton.click()'));
  assert(pdf.includes('reportData(container)'));
});

test('PDF is generated directly without print dialog',()=>{
  assert(pdf.includes('html2canvas'));
  assert(pdf.includes('jsPDF'));
  assert(pdf.includes("doc.output('blob')"));
  assert(!pdf.includes('window.print()'));
});

test('PDF is explicitly designed as a single A4 page',()=>{
  assert(pdf.includes("format:'a4'"));
  assert(pdf.includes('pdf-one-page-report'));
  assert(pdf.includes('width:794px;height:1123px'));
  assert(!pdf.includes('doc.addPage('));
});

test('one-page report includes key consumer sections',()=>{
  assert(pdf.includes('สิ่งที่ควรใส่ใจก่อน'));
  assert(pdf.includes('แผนของคุณใน 90 วัน'));
  assert(pdf.includes('พื้นฐานที่ช่วยลดความเสี่ยงระยะยาว'));
  assert(pdf.includes('เรื่องที่อาจคุยกับแพทย์เพิ่มเติม'));
});

test('risk numbers are translated into people-per-100 explanations',()=>{
  assert(pdf.includes('ตัวเลขนี้หมายถึงอะไร?'));
  assert(pdf.includes('ถ้ามีคน 100 คนที่มีอายุและข้อมูลสุขภาพใกล้เคียงกับคุณ'));
  assert(pdf.includes('คนอาจเกิดโรคหัวใจขาดเลือดหรือโรคหลอดเลือดสมอง'));
  assert(pdf.includes('คนจะไม่เกิดเหตุการณ์ดังกล่าวในช่วงเวลานี้'));
});

test('30-year explanation prevents common misinterpretation',()=>{
  assert(pdf.includes('ตัวเลข 30 ปีมักสูงกว่า 10 ปีเพราะเป็นช่วงเวลาที่ยาวกว่า'));
  assert(pdf.includes('ไม่ได้หมายความว่าความเสี่ยงเพิ่มขึ้นทันทีในวันนี้'));
  assert(pdf.includes('ไม่ใช่คำทำนายว่าจะเกิดกับคุณแน่นอน'));
});

test('iPhone path shares a real PDF File',()=>{
  assert(pdf.includes("new File([blob],name,{type:'application/pdf'})"));
  assert(pdf.includes('navigator.canShare({files:[file]})'));
  assert(pdf.includes('navigator.share({files:[file]'));
});

test('fallback downloads generated PDF blob',()=>{
  assert(pdf.includes('URL.createObjectURL(blob)'));
  assert(pdf.includes('a.download=name'));
  assert(pdf.includes('Downloads/Files'));
});

test('Thai content is rendered from DOM into PDF image',()=>{
  assert(pdf.includes('window.html2canvas(report'));
  assert(pdf.includes("canvas.toDataURL('image/jpeg'"));
  assert(pdf.includes('Noto Sans Thai'));
});

test('report includes clinical disclaimer and evidence reference',()=>{
  assert(pdf.includes('ไม่ใช่การวินิจฉัยโรค'));
  assert(pdf.includes('AHA PREVENT™ Equations'));
  assert(pdf.includes('ไม่แทนการประเมินโดยแพทย์'));
});

if(process.exitCode)process.exit(process.exitCode);
console.log('\nOne-page PDF export regression tests: PASS');
