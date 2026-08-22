const fs=require('fs');const vm=require('vm');const code=fs.readFileSync('js/clinical-rules.js','utf8')+'\n;globalThis.__rules=HeartCheckRules;';const context={};vm.createContext(context);vm.runInContext(code,context);const R=context.__rules;let n=0;function ok(cond,msg){n++;if(!cond){console.error('FAIL:',msg);process.exitCode=1}else console.log('PASS:',msg)}function base(){return{age:50,sex:'male',knownASCVD:false,acute:false,symptomatic:false,smoking:false,diabetes:false,hypertension:false,familyHistory:false,ckd:false,plaqueConcern:false,sbp:null,ldl:null,hba1c:null,egfr:null,lpa:null,lpaUnit:'mg'}}
let d=base();d.acute=true;let r=R.evaluate(d);ok(r.actionLevel==='emergency','acute symptoms always hard-stop to emergency');ok(r.cacEligible===false,'acute symptoms never recommend CAC');
d=base();d.knownASCVD=true;r=R.evaluate(d);ok(r.actionLevel==='known-ascvd','known ASCVD exits screening pathway');
d=base();d.ldl=195;r=R.evaluate(d);ok(r.actionLevel==='clinician-priority','LDL >=190 triggers clinician-priority');ok(r.cacEligible===false,'LDL >=190 does not use CAC to decide treatment');
d=base();d.hba1c=6.6;r=R.evaluate(d);ok(r.actionLevel==='clinician-priority','A1C >=6.5 triggers clinician-priority');
d=base();d.egfr=25;r=R.evaluate(d);ok(r.actionLevel==='clinician-priority','eGFR <30 triggers clinician-priority');
d=base();d.lpa=126;d.lpaUnit='nmol';r=R.evaluate(d);ok(r.labs.some(x=>x.text.includes('risk-enhancing')),'Lp(a) >=125 nmol/L recognized as risk-enhancing');
d=base();d.lpa=49;d.lpaUnit='mg';r=R.evaluate(d);ok(!r.labs.some(x=>x.level==='warn'&&x.text.includes('risk-enhancing')),'Lp(a) <50 mg/dL not mislabeled high');
d=base();d.age=42;d.smoking=true;r=R.evaluate(d);ok(r.cacEligible===true,'male >=40 with risk factor may enter CAC discussion pathway');
d=base();d.age=39;d.smoking=true;r=R.evaluate(d);ok(r.cacEligible===false,'male <40 does not enter CAC discussion pathway');
console.log(`Checked ${n} safety assertions.`);if(process.exitCode)process.exit(process.exitCode);
