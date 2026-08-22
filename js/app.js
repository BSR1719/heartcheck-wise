let currentState = null;
let currentResult = null;

const $ = (id) => document.getElementById(id);
const checked = (id) => $(id).checked;
const radioValue = (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || "no";
const numeric = (id) => $(id).value === "" ? null : Number($(id).value);

function collectState() {
  return {
    age: Number($("age").value || 0),
    sex: $("sex").value,
    knownASCVD: radioValue("knownASCVD") === "yes",
    acute: radioValue("acute") === "yes",
    symptomatic: radioValue("chestPain") === "yes" || radioValue("otherSymptoms") === "yes",
    smoking: checked("smoking"),
    diabetes: checked("diabetes"),
    hypertension: checked("hypertension"),
    familyHistory: checked("familyHistory"),
    ckd: checked("ckd"),
    plaqueConcern: checked("plaqueConcern"),
    sbp: numeric("sbp"),
    ldl: numeric("ldl"),
    hba1c: numeric("hba1c"),
    egfr: numeric("egfr"),
    lpa: numeric("lpa"),
    lpaUnit: $("lpaUnit").value
  };
}

function validate(state) {
  const errors = [];
  if (!Number.isFinite(state.age) || state.age < 18 || state.age > 100) errors.push("กรุณากรอกอายุระหว่าง 18–100 ปี");
  if (state.sbp !== null && (state.sbp < 60 || state.sbp > 280)) errors.push("กรุณาตรวจสอบค่า SBP");
  if (state.ldl !== null && (state.ldl < 0 || state.ldl > 500)) errors.push("กรุณาตรวจสอบค่า LDL-C");
  if (state.hba1c !== null && (state.hba1c < 3 || state.hba1c > 20)) errors.push("กรุณาตรวจสอบค่า HbA1c");
  if (state.egfr !== null && (state.egfr < 0 || state.egfr > 200)) errors.push("กรุณาตรวจสอบค่า eGFR");
  if (state.lpa !== null && state.lpa < 0) errors.push("กรุณาตรวจสอบค่า Lp(a)");
  return errors;
}

function showValidation(errors) {
  const box = $("validationBox");
  if (!errors.length) { box.classList.add("hidden"); box.innerHTML = ""; return; }
  box.classList.remove("hidden");
  box.innerHTML = `<strong>กรุณาตรวจสอบข้อมูล</strong><ul>${errors.map(x => `<li>${x}</li>`).join("")}</ul>`;
  box.scrollIntoView({behavior:"smooth", block:"center"});
}

function testCard(name, entry) {
  const [status, reason] = entry;
  const labels = {recommended:"ควร", consider:"อาจพิจารณา", "not-routine":"ไม่ใช่ routine"};
  return `<article class="test-card ${status}"><h3>${name}</h3><p><strong>${labels[status] || status}</strong><br>${reason}</p></article>`;
}

function render(result) {
  $("resultHero").className = `result-hero ${result.category}`;
  $("resultTitle").textContent = result.title;
  $("resultText").textContent = result.text;
  $("adviceList").innerHTML = result.advice.map(x => `<div class="advice">${x}</div>`).join("");
  $("labInterpretation").innerHTML = result.labs.length
    ? result.labs.map(x => `<div class="lab ${x.level}">${x.text}</div>`).join("")
    : `<div class="lab ok">ยังไม่ได้กรอกผลตรวจตัวเลข ระบบจึงให้คำแนะนำจากข้อมูลที่มี</div>`;

  const names = {labs:"ตรวจเลือดพื้นฐาน", cac:"Calcium Score", echo:"Echo", est:"EST", ccta:"CCTA", cag:"CAG / สวนหัวใจ"};
  $("testRecommendations").innerHTML = Object.entries(result.tests).map(([k,v]) => testCard(names[k], v)).join("");
  $("summary").innerHTML = `<strong>ผลการประเมิน:</strong> ${result.title}<br><br><strong>คำแนะนำ:</strong><br>${result.advice.map((x,i)=>`${i+1}. ${x}`).join("<br>")}<br><br><strong>คำถามสำคัญก่อนตรวจ:</strong> “การตรวจนี้กำลังหาคำตอบอะไร และผลจะเปลี่ยนการรักษาหรือการป้องกันของฉันอย่างไร?”`;
  $("results").classList.remove("hidden");
  $("progressBar").style.width = "100%";
  if ($("progressText")) $("progressText").textContent = "ประเมินเสร็จแล้ว";
  $("results").scrollIntoView({behavior:"smooth"});
}

function evaluate() {
  currentState = collectState();
  const errors = validate(currentState);
  showValidation(errors);
  if (errors.length) return;
  currentResult = HeartCheckRules.evaluate(currentState);
  render(currentResult);
}

function assessPackage() {
  if (!currentResult) return;
  const items = [...document.querySelectorAll(".package-item:checked")].map(x => x.value);
  const verdict = PackageChecker.assess(items, currentState, currentResult);
  $("packageVerdict").className = `verdict ${verdict.type}`;
  $("packageVerdict").innerHTML = verdict.lines.join("<br>");
}

function saveResult() {
  if (!currentResult) return;
  const text = [
    "Bangkok Hospital Surat - HeartCheck Wise V7.5",
    `วันที่: ${new Date().toLocaleString("th-TH")}`,
    "",
    `ผลการประเมิน: ${currentResult.title}`,
    currentResult.text,
    "",
    "คำแนะนำ",
    ...currentResult.advice.map((x,i)=>`${i+1}. ${x}`),
    "",
    "การแปลผลที่กรอก",
    ...currentResult.labs.map(x=>`- ${x.text}`),
    "",
    "หมายเหตุ: เครื่องมือนี้เพื่อ health literacy และ shared decision-making ไม่ใช้แทนการวินิจฉัยหรือการดูแลฉุกเฉิน"
  ].join("\n");
  const blob = new Blob([text], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "HeartCheck_Wise_Result.txt";
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function updateProgressUI() {
  const ageValid = Number($("age").value) >= 18;
  let pct = ageValid ? 35 : 20;
  if (["smoking","diabetes","hypertension","familyHistory","ckd","plaqueConcern"].some(id => checked(id))) pct += 15;
  if (["sbp","ldl","hba1c","egfr","lpa"].some(id => $(id).value !== "")) pct += 25;
  $("progressBar").style.width = Math.min(pct, 85) + "%";
  if ($("progressText")) $("progressText").textContent = pct >= 70 ? "ใกล้เสร็จแล้ว" : pct >= 40 ? "กำลังกรอกข้อมูล" : "เริ่มต้น";
}

$("evaluateBtn").addEventListener("click", evaluate);
$("packageBtn").addEventListener("click", assessPackage);
$("saveBtn").addEventListener("click", saveResult);
$("printBtn").addEventListener("click", () => window.print());
$("resetBtn").addEventListener("click", () => window.location.reload());
if ($("jumpResultBtn")) $("jumpResultBtn").addEventListener("click", () => !$("results").classList.contains("hidden") ? $("results").scrollIntoView({behavior:"smooth"}) : $("assessmentPanel").scrollIntoView({behavior:"smooth"}));
document.addEventListener("input", updateProgressUI);
document.addEventListener("change", updateProgressUI);
updateProgressUI();
