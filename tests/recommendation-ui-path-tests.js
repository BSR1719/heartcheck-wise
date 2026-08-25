const fs=require('fs'),vm=require('vm'),assert=require('assert');

const index=fs.readFileSync('index.html','utf8');
const clinical=fs.readFileSync('js/clinical-content.js','utf8');
const app=fs.readFileSync('js/app.js','utf8');

function test(name,fn){try{fn();console.log('PASS',name)}catch(e){console.error('FAIL',name,'-',e.message);process.exitCode=1}}

// Static wiring contract: deployed page must load app first, then the clinical-content UI layer.
test('index loads clinical-content after app',()=>{
  const appPos=index.indexOf('<script src="js/app.js"></script>');
  const clinicalPos=index.indexOf('<script src="js/clinical-content.js"></script>');
  assert(appPos>=0,'app.js script missing');
  assert(clinicalPos>appPos,'clinical-content.js must load after app.js');
});

test('clinical-content dynamically loads recommendation engine when needed',()=>{
  assert(clinical.includes("s.src='js/recommendation-engine.js'"));
  assert(clinical.includes('window.HeartCheckRecommendations.buildPlan'));
});

test('app result no longer renders legacy recommendation block',()=>{
  const submitSource=app.slice(app.indexOf('function submit'),app.indexOf('function reset'));
  assert(!submitSource.includes('personalAdvice('),'legacy personalAdvice must not be rendered by submit');
  assert(!submitSource.includes('เริ่มจากเรื่องที่ช่วยลดความเสี่ยงได้มากที่สุด'),'legacy recommendation heading must be absent from rendered result');
});

class ClassList{
  constructor(names=[]){this.s=new Set(names)}
  add(x){this.s.add(x)} remove(x){this.s.delete(x)} toggle(x){this.s.has(x)?this.s.delete(x):this.s.add(x)} contains(x){return this.s.has(x)}
}
class BasicEl{
  constructor(){this.value='';this.innerHTML='';this.textContent='';this.dataset={};this.listeners={};this.classList=new ClassList();}
  addEventListener(name,fn){this.listeners[name]=fn}
  scrollIntoView(){}
  prepend(){}
  appendChild(){}
  querySelector(){return null}
  querySelectorAll(){return []}
}
class LaunchEl extends BasicEl{
  constructor(){super();this.panel=new BasicEl();this.panel.classList=new ClassList(['plan-hidden']);this.button=new BasicEl();}
  querySelector(sel){if(sel==='.personal-plan')return this.panel;if(sel==='.plan-button')return this.button;return null}
}
class ResultEl extends BasicEl{
  constructor(){super();this.hidden=false;this.innerHTML='<div class="risk-number">4.3%</div>';this.launch=null;}
  querySelector(sel){
    if(sel==='.personal-plan-launch')return this.launch;
    if(sel==='.risk-number')return {textContent:'4.3%'};
    return null;
  }
  appendChild(el){if(el.className==='personal-plan-launch')this.launch=el}
}

const form=new BasicEl(),result=new ResultEl();
const fields={
  age:Object.assign(new BasicEl(),{value:'55'}),sex:Object.assign(new BasicEl(),{value:'0'}),
  sbp:Object.assign(new BasicEl(),{value:'145'}),dbp:Object.assign(new BasicEl(),{value:'85'}),
  ldl:Object.assign(new BasicEl(),{value:'130'}),egfr:Object.assign(new BasicEl(),{value:'90'}),
  dm:Object.assign(new BasicEl(),{value:'0'}),smoking:Object.assign(new BasicEl(),{value:'0'}),
  weightKg:Object.assign(new BasicEl(),{value:'78'}),heightCm:Object.assign(new BasicEl(),{value:'170'})
};
const styleRegistry={};
const document={
  querySelector(sel){
    if(sel==='#riskForm')return form;
    if(sel==='#result')return result;
    if(sel==='#personal-plan-styles')return styleRegistry.main||null;
    if(sel.startsWith('#'))return fields[sel.slice(1)]||null;
    if(sel==='script[data-recommendation-engine]')return null;
    return null;
  },
  createElement(tag){if(tag==='section')return new LaunchEl();return new BasicEl()},
  head:{appendChild(el){styleRegistry.main=el}},
  body:{appendChild(){}}
};
const ctx={console,Math,document,window:null,setTimeout:(fn)=>fn()};ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/recommendation-engine.js','utf8'),ctx);
vm.runInContext(clinical,ctx);

test('clinical-content exposes refineResult and binds form submit hook',()=>{
  assert(ctx.HeartCheckClinicalContent&&typeof ctx.HeartCheckClinicalContent.refineResult==='function');
  assert.equal(typeof form.listeners.submit,'function');
});

test('submit hook mounts recommendation CTA',()=>{
  form.listeners.submit();
  assert(result.launch,'recommendation launch section not mounted');
  assert(result.launch.innerHTML.includes('ดูคำแนะนำสำหรับฉัน'));
  assert.equal(typeof result.launch.button.listeners.click,'function','CTA click handler missing');
});

test('CTA click renders personalized recommendation view',()=>{
  const button=result.launch.button,panel=result.launch.panel;
  button.listeners.click.call(button);
  assert(panel.innerHTML.includes('คำแนะนำสำหรับคุณ'));
  assert(panel.innerHTML.includes('จัดการความดันโลหิต'));
  assert(panel.innerHTML.includes('แผนของคุณใน 90 วัน'));
  assert(panel.innerHTML.includes('เริ่มวัดและบันทึกความดัน'));
  assert(panel.innerHTML.includes('สิ่งที่อาจคุยกับแพทย์เพิ่มเติม'));
  assert(!panel.classList.contains('plan-hidden'),'recommendation panel should be visible after click');
});

if(process.exitCode)process.exit(process.exitCode);
console.log('\nRecommendation CTA integration path: PASS');
