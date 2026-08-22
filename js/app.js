const $=id=>document.getElementById(id);
const radio=name=>document.querySelector(`input[name="${name}"]:checked`).value;
const ck=id=>$(id).checked;
let current=null;

function collect(){
  return {
    symptoms:radio('symptoms')==='yes',
    knownAscvd:radio('knownAscvd')==='yes',
    ageBand:$('ageBand').value,
    diabetes:ck('diabetes'),hypertension:ck('hypertension'),smoking:ck('smoking'),
    dyslipidemia:ck('dyslipidemia'),ckd:ck('ckd'),familyHistory:ck('familyHistory'),
    ldl190:ck('ldl190'),highLpa:ck('highLpa'),neverLpa:ck('neverLpa')
  };
}

function render(r){
  $('results').classList.remove('hidden');
  if(r.stop){
    $('screeningResults').classList.add('hidden');
    $('stopCard').classList.remove('hidden');
    $('stopCard').innerHTML=`<h2>${r.title}</h2><p>${r.text}</p>`;
  }else{
    $('stopCard').classList.add('hidden');
    $('screeningResults').classList.remove('hidden');
    $('summaryText').textContent=r.summary;
    $('testGrid').innerHTML=r.tests.map(t=>`<article class="test-card ${t.status}"><div class="test-head"><h3>${t.name}</h3><span class="badge">${t.label}</span></div><p>${t.reason}</p></article>`).join('');
    $('bloodList').innerHTML=r.blood.map(b=>`<div class="blood-item"><strong>✅ ${b.name}</strong><span>${b.reason}</span></div>`).join('');
    $('bottomLine').textContent=r.bottom;
  }
  $('results').scrollIntoView({behavior:'smooth'});
}

function evaluate(){ current=HeartCheckV8.evaluate(collect()); render(current); }

function save(){
  if(!current||current.stop)return;
  const lines=['HeartCheck Wise V8','',current.summary,'','การตรวจ',...current.tests.map(t=>`- ${t.name}: ${t.label} — ${t.reason}`),'','เลือดที่ควรเริ่ม',...current.blood.map(b=>`- ${b.name}: ${b.reason}`),'','หมายเหตุ: เครื่องมือนี้เพื่อ health literacy ไม่ใช้วินิจฉัยโรค'];
  const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url;a.download='HeartCheck_Wise_V8_Result.txt';a.click();URL.revokeObjectURL(url);
}

$('evaluateBtn').addEventListener('click',evaluate);
$('resetBtn').addEventListener('click',()=>location.reload());
$('saveBtn').addEventListener('click',save);
$('printBtn').addEventListener('click',()=>window.print());
