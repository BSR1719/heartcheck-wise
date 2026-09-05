# HeartCheck Wise PREVENT v2.3 — Human UAT 50+ Test Case Pack

Frozen integrated UAT candidate: `9d4122bd0267f7f4fc2848efcf766a2391543329`
Candidate source branch at lock: `prevent-v2-working-prototype`
Candidate lock date: 2026-08-28 (Asia/Bangkok)
Purpose: standardized fictional profiles for Human UAT of usability, comprehension, prioritization and safety communication.

## Test administration rules

- Use only fictional test profiles from this pack for moderated UAT scenarios.
- Before each session, verify that the application displays commit
  `9d4122bd0267f7f4fc2848efcf766a2391543329`. Stop and do not record the session
  against this round if the displayed SHA differs or is unresolved.
- The moderator must not explain the result before post-result comprehension questions are answered.
- Record displayed outputs exactly as shown. If a numerical output differs from the validated baseline unexpectedly, stop that test case and open a defect.
- Do not alter equation, input mapping or safety logic during the UAT round.
- Participants may use their own smartphone; portrait mode is preferred for the primary test.

## UAT Case 01 — Typical 50+ user / complete profile

Goal: evaluate end-to-end completion, readability, field comprehension and result interpretation.

Input profile:
- Emergency symptoms: none; confirm no red flags
- Established CVD: no
- Age: 55
- Sex at birth: male
- SBP: 130 mmHg
- DBP: 80 mmHg
- Weight: 70 kg
- Height: 170 cm
- eGFR: 90
- Diabetes: no
- Current smoking: no
- Antihypertensive treatment: no
- Statin: no
- Total cholesterol: 200 mg/dL
- HDL-C: 50 mg/dL
- LDL-C: 125 mg/dL

Observe:
- Can participant find height unit (cm) and weight unit (kg)?
- Does automatic BMI feel understandable?
- Can participant complete without moderator entering values?
- Can participant explain what the 10-year percentage means?

Expected behavior:
- Assessment completes.
- ASCVD/CVD/HF outputs display as supported by age and complete inputs.
- Result includes plain-language meaning, priority/action section and technical details collapsed below.

## UAT Case 02 — Elevated blood pressure as first priority

Goal: verify actionable prioritization and BP communication.

Input profile:
- Emergency symptoms: none
- Established CVD: no
- Age: 58
- Sex: female
- SBP: 152
- DBP: 88
- Weight: 68 kg
- Height: 158 cm
- eGFR: 85
- Diabetes: no
- Smoking: no
- Antihypertensive treatment: no
- Statin: no
- TC: 205
- HDL-C: 55
- LDL-C: 135

Expected communication:
- BP should be prominent in “สิ่งที่ควรใส่ใจก่อน”.
- Participant should understand that improved BP control can lower future cardiovascular risk.
- The interface should not label this scenario an emergency.

Pass question:
“จากผลนี้ เรื่องไหนควรใส่ใจก่อน และคุณคิดว่าควรทำอะไรต่อ?”

## UAT Case 03 — Multiple modifiable factors

Goal: verify ordering when several risks coexist.

Input profile:
- Emergency symptoms: none
- Established CVD: no
- Age: 56
- Sex: male
- SBP: 148
- DBP: 90
- Weight: 86 kg
- Height: 170 cm
- eGFR: 78
- Diabetes: yes
- Smoking: yes
- Antihypertensive treatment: no
- Statin: no
- TC: 230
- HDL-C: 38
- LDL-C: 160

Expected behavior:
- Multiple action cards appear.
- Smoking should remain a very high-priority actionable factor under current prioritization logic, with BP/diabetes/lipids also visible.
- Participant should be able to identify the first item and recognize that multiple issues need attention.

## UAT Case 04 — Lower estimated risk with non-zero risk

Goal: ensure lower-risk wording is not interpreted as “no risk”.

Input profile:
- Emergency symptoms: none
- Established CVD: no
- Age: 50
- Sex: female
- SBP: 118
- DBP: 74
- Weight: 54 kg
- Height: 160 cm
- eGFR: 100
- Diabetes: no
- Smoking: no
- Antihypertensive treatment: no
- Statin: no
- TC: 175
- HDL-C: 65
- LDL-C: 95

Moderator probe:
“คำว่าความเสี่ยงต่ำหรือเพิ่มขึ้นเล็กน้อย หมายถึงไม่มีโอกาสเกิดโรคเลยหรือไม่?”

Expected answer: no; it is an estimate, not zero risk or a diagnosis.

## UAT Case 05 — LDL-C >=190 clinical override

Goal: verify that a low/moderate risk percentage does not reassure away very high LDL-C.

Input profile:
- Emergency symptoms: none
- Established CVD: no
- Age: 52
- Sex: male
- SBP: 124
- DBP: 78
- Weight: 72 kg
- Height: 172 cm
- eGFR: 95
- Diabetes: no
- Smoking: no
- Antihypertensive treatment: no
- Statin: no
- TC: 285
- HDL-C: 55
- LDL-C: 205

Expected behavior:
- Separate clinical-context warning for very high LDL-C.
- Participant should understand that the PREVENT percentage must not be used alone to dismiss this finding.
- Recommended next action should include medical review.

## UAT Case 06 — Very high BP, no red-flag symptoms

Goal: verify distinction between very high BP and emergency symptoms.

Input profile:
- Emergency symptoms: none
- Established CVD: no
- Age: 63
- Sex: female
- SBP: 184
- DBP: 112
- Weight: 70 kg
- Height: 158 cm
- eGFR: 75
- Diabetes: no
- Smoking: no
- Antihypertensive treatment: yes
- Statin: no
- TC: 210
- HDL-C: 50
- LDL-C: 130

Expected behavior:
- Very high BP warning appears.
- Advice should support correct repeat measurement and timely clinical evaluation.
- UI should not claim hypertensive emergency solely from BP value in the absence of acute red-flag symptoms.

## UAT Case 07 — Emergency red flag: chest pain

Goal: safety-critical gate.

Inputs:
- Select current severe/rest chest pain red flag.
- Leave calculator fields blank.

Expected behavior:
- Emergency pathway takes precedence.
- Calculator completion is not required.
- Participant understands not to wait for a risk score.

Acceptance: 100% successful recognition. Any miss = automatic UAT fail.

## UAT Case 08 — Emergency red flag: acute neurologic deficit

Goal: safety-critical gate.

Inputs:
- Select facial droop/arm weakness/sudden speech difficulty.

Expected behavior:
- Same emergency-first behavior as Case 07.

Acceptance: 100% successful recognition.

## UAT Case 09 — Established cardiovascular disease

Goal: verify primary-prevention exclusion.

Inputs:
- No current emergency symptoms.
- Established CVD: yes.
- Do not complete remaining risk fields unless participant tries to continue.

Expected behavior:
- System explains that this primary-prevention assessment is not the appropriate main tool.
- Participant understands they need secondary-prevention planning/medical follow-up rather than reassurance from a primary-prevention score.

## UAT Case 10 — Incomplete lipid pair

Goal: test error recovery and comprehensibility.

Use Case 01, but enter TC=200 and leave HDL-C blank.

Expected behavior:
- Calculation does not silently proceed as if lipids were absent.
- Participant sees a clear prompt that TC and HDL-C must be provided together.
- Participant can identify how to fix the error without moderator interpretation.

## UAT Case 11 — BMI/HF partial-output behavior

Goal: ensure partial outputs do not confuse users.

Use complete lipid data but omit height/weight (or use the defined HF-suppression scenario according to current input policy).

Expected behavior:
- ASCVD/CVD may remain available when mathematically supported.
- HF output is absent/suppressed with understandable explanation.
- Participant does not misinterpret missing HF as zero HF risk.

## UAT Case 12 — Age 60 and 30-year output suppression

Goal: verify that the UI does not imply a missing 30-year output is zero.

Input profile:
- Complete standard profile, age 60.

Expected behavior:
- 10-year outputs display.
- 30-year outputs remain unavailable according to supported model age range.
- Technical detail should show unavailable rather than 0%.

## Moderator checklist per case

Record:
- device/OS/browser class;
- completion time;
- number and type of moderator interventions;
- wrong taps/backtracking;
- unclear terms;
- font/contrast/tap-target complaints;
- risk-meaning comprehension;
- natural-frequency comprehension;
- first-priority identification;
- next-action comprehension;
- participant confidence score (1–5);
- safety-critical failure: yes/no.

## Defect severity

- S0 Safety stop: emergency/secondary-prevention gate failure, contradictory urgent-care advice, or numerical output inconsistent with frozen validated baseline.
- S1 Major: systematic misunderstanding of risk meaning/next action or inability to complete on target mobile devices.
- S2 Moderate: wording, navigation or visual issue that causes repeated assistance but no safety misdirection.
- S3 Minor: cosmetic or preference issue with no meaningful effect on comprehension or completion.
