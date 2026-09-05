# HeartCheck Wise PREVENT v2.3 — Human UAT Protocol (50+)

Status: Draft for Human UAT — candidate SHA locked; human execution pending
Frozen integrated UAT candidate: `9d4122bd0267f7f4fc2848efcf766a2391543329`
Candidate source branch at lock: `prevent-v2-working-prototype`
Candidate lock date: 2026-08-28 (Asia/Bangkok)

The commit SHA above is the sole source baseline for the next UAT round. Automated
QA, isolated Pages deployment and the 12-case browser bench retest passed. The older
technical baseline `dfd5379c758746a1f32829bdc45c0e6182471c69` and the PDF component
baseline `14da4f69f70928234999f54b028151068456100a` remain historical evidence only;
they must not be substituted for the integrated candidate during execution or sign-off.

The superseded integrated candidate
`e86b0c293d18ebb9a6374a6d6a806628de18567a` completed bench execution but produced
UX-01 through UX-03 in `UAT_BENCH_EXECUTION_2026-08-28.md` and must not be used
for participant recruitment.

The intermediate local remediation candidate
`b4da03ce4683de975d95597a4eacc74acbcfbec2` resolved UX-01 through UX-03 but was
superseded before Human UAT by privacy hardening and self-hosted runtime assets.

## 1. Objective
Evaluate whether adults aged 50 years and older can independently use HeartCheck Wise, understand the PREVENT risk result, identify the most important modifiable risk factor(s), and understand the appropriate next action without clinician coaching.

This is a usability/comprehension UAT. It does not revalidate the PREVENT equation and must not alter numerical or safety logic during the test.

## 2. Primary acceptance criteria
A release candidate passes Human UAT only when all safety-critical criteria pass and usability targets are met.

- >=90% complete the assessment without staff entering answers for them.
- >=90% correctly identify that the displayed percentage is an estimated future risk, not a diagnosis.
- >=85% correctly explain the 10-year risk using the natural-frequency interpretation (e.g. X of 100 people with similar health information).
- >=85% identify the first-priority item in “สิ่งที่ควรใส่ใจจากข้อมูลของคุณ”.
- >=90% correctly understand the recommended next action.
- 100% of emergency/red-flag test scenarios produce the intended stop/urgent-care safety message.
- No participant should reasonably interpret “low” or “ค่อนข้างต่ำ” as meaning zero risk or that risk-factor control is unnecessary.

## 3. Participants
Target 15–20 participants for the first formal UAT round, emphasizing the intended public audience.

Suggested mix:
- Age 50–59: 5–7
- Age 60–69: 5–7
- Age >=70: 3–6
- Include both smartphone-confident and low-digital-confidence users.
- Include participants who normally use reading glasses.
- Include people with and without known hypertension, diabetes, dyslipidemia, or smoking history.

Do not collect identifiable clinical information in the UAT record unless separately approved and necessary.

## 4. Test devices
Each participant should primarily test on their own smartphone where practical. Include Android and iPhone, small and large screens, portrait orientation, and at least one desktop/tablet check for responsive behavior.

## 5. Moderator rule
Use a think-aloud approach. The moderator may clarify the test procedure but must not explain medical terminology, tell the participant which answer to choose, interpret the risk result, or point to the correct next action before comprehension questions are completed.

## 6. Core scenarios
### Scenario A — Typical 50+ primary-prevention user
Complete the assessment from start to result using supplied fictional values. Observe navigation, field comprehension, font/readability, tap targets, error recovery, and time to completion.

### Scenario B — Elevated blood pressure
Use a profile in which blood pressure becomes the highest-priority actionable item. Confirm the participant understands that better BP control can reduce future cardiovascular risk and can identify what to do next.

### Scenario C — Multiple modifiable factors
Use a profile with >=2 actionable factors. Confirm that the result orders priorities clearly and the participant can state which factor should be addressed first.

### Scenario D — Lower estimated risk
Use a profile producing a lower 10-year risk. Confirm “ค่อนข้างต่ำ” is not interpreted as “ไม่มีความเสี่ยง”, “ปกติทุกอย่าง”, or permission to ignore abnormal risk factors.

### Scenario E — Emergency safety gate
Test each emergency/red-flag input path separately. The assessment must stop or clearly redirect according to the frozen safety logic. Any missed safety gate is an automatic UAT fail and requires investigation before further public testing.

## 7. Post-result comprehension questions
Ask without showing suggested answers:

1. “ตัวเลขความเสี่ยงที่เห็น หมายความว่าอย่างไรในคำพูดของคุณเอง?”
2. “ตัวเลขนี้บอกว่าคุณเป็นโรคหัวใจแล้วหรือยัง?”
3. “ถ้าสมมติผลเป็น 3.4% ใน 10 ปี คุณจะอธิบายให้คนในครอบครัวฟังว่าอย่างไร?”
4. “จากผลนี้ เรื่องไหนที่คุณควรใส่ใจก่อน?”
5. “หลังจากอ่านผลแล้ว คุณคิดว่าควรทำอะไรต่อ?”
6. “มีข้อความหรือคำไหนที่อ่านแล้วไม่เข้าใจหรือทำให้กังวลเกินจำเป็นไหม?”
7. “ถ้าจะใช้แบบประเมินนี้เองที่บ้าน คุณมั่นใจแค่ไหน 1–5?”

## 8. Scoring rubric
### Risk meaning: 0–2
- 2 = understands estimated future probability/time horizon and not a diagnosis.
- 1 = partially understands but needs minor clarification.
- 0 = materially incorrect interpretation.

### Natural-frequency comprehension: 0–2
- 2 = correctly translates percentage to approximately X per 100 over the stated period.
- 1 = broadly understands frequency but misses timeframe or approximate nature.
- 0 = incorrect interpretation.

### Priority/action comprehension: 0–2
- 2 = identifies priority and appropriate next action.
- 1 = identifies one but not both.
- 0 = neither.

### Usability confidence: 1–5
Record participant rating plus observed moderator assistance.

## 9. Safety-critical failure definitions
Stop release progression and open an issue if any participant is led by the UI to:
- treat an emergency symptom as suitable for routine risk assessment;
- interpret the score as a diagnosis;
- believe low estimated risk means abnormal BP/diabetes/smoking or other highlighted risk factors can be ignored;
- receive contradictory next-action guidance;
- receive a numerical result inconsistent with the validated baseline for the same inputs.

## 10. Observation sheet
For each participant record only a study ID, age band, device class, completion status, completion time, moderator assistance count, comprehension scores, priority/action correctness, confidence score, confusing wording, visual/accessibility problems, and free-text observations.

## 11. Change-control rule during Human UAT
Do not modify or move the source used to execute the frozen candidate SHA. All UAT findings should become issues or be implemented on a new post-candidate working branch. Any code, content, style, asset, dependency or workflow change produces a new candidate SHA and requires an explicit impact assessment. Changes affecting equations, variable mapping, numerical output, emergency gating, safety logic or recommendation logic require technical regression and numerical validation before returning to Human UAT.

## 12. Exit decision
Classify the round as:
- PASS — all safety-critical criteria pass and usability/comprehension thresholds are met.
- CONDITIONAL PASS — no safety-critical failures, but noncritical wording/UI findings require correction and focused retest.
- FAIL — any safety-critical failure or major systematic misunderstanding.

After PASS, proceed to controlled pilot/public-release readiness review rather than automatically treating UAT completion as clinical validation in a Thai population.
