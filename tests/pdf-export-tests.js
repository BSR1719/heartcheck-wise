const fs=require('fs'),assert=require('assert');
const index=fs.readFileSync('index.html','utf8');
const pdf=fs.readFileSync('js/pdf-export.js','utf8');
function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,'-',e.message);process.exitCode=1}}
test('index loads PDF export after clinical content',()=>{const clinical=index.indexOf('<script src="js/clinical-content.js"></script>');const exportPos=index.indexOf('<script src="js/pdf-export.js"></script>');assert(clinical>=0);assert(exportPos>clinical,'pdf-export.js must load after clinical-content.js')});
test('PDF export exposes a user-visible save action',()=>{assert(pdf.includes('บันทึกผลเป็น PDF'));assert(pdf.includes('window.print()'))});
test('PDF export expands personalized recommendations before printing',()=>{assert(pdf.includes('planButton.click()'));assert(pdf.includes('d.open=true'))});
test('PDF print mode isolates assessment result and uses A4',()=>{assert(pdf.includes('@page{size:A4'));assert(pdf.includes('printing-result-pdf'));assert(pdf.includes('#result{display:block!important'))});
test('PDF export states local-device privacy behavior',()=>{assert(pdf.includes('ไม่ส่งข้อมูลส่วนบุคคลกลับมายังระบบ'))});
if(process.exitCode)process.exit(process.exitCode);console.log('\nPDF export regression tests: PASS');
