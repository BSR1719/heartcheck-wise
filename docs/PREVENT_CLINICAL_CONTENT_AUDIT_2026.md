# HeartCheck Wise — PREVENT Clinical Content Audit (2026)

Status: PRE-UAT clinical communication audit
Scope: communication and clinical decision-support layer only. PREVENT equations and coefficients are out of scope and must not be changed by this audit.

## Governing sources

1. 2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia.
2. AHA PREVENT Equations / PREVENT Quickstart Guide (2026).
3. 2025 AHA/ACC High Blood Pressure Guideline.

## KEEP

### PREVENT-ASCVD 10-year categories
The current numerical cut points are evidence-based and should be retained for PREVENT-ASCVD 10-year risk:
- Low: <3%
- Borderline: 3% to <5%
- Intermediate: 5% to <10%
- High: >=10%

These are the categories adopted by the 2026 ACC/AHA dyslipidemia guideline for PREVENT-ASCVD in primary prevention. They are treatment-discussion categories, not diagnoses.

### Natural-frequency risk communication
Keep the translation of absolute risk into approximately X people out of 100 over the stated time horizon. The AHA PREVENT Quickstart Guide explicitly uses this style for both 10-year and 30-year risk communication.

### Established CVD gate
Keep the gate that prevents the primary-prevention score from being presented as the main decision tool in people with established cardiovascular disease.

### Emergency symptom gate
Keep symptom-first emergency triage ahead of risk calculation. A risk calculator must never delay evaluation of acute chest pain, acute dyspnea, focal neurologic symptoms, or loss of consciousness.

## MODIFY

### Public wording for 3% to <5%
The underlying guideline category is `borderline`, but the public label should not imply a diagnosis. The current Thai phrase `ความเสี่ยงค่อนข้างต่ำ` is understandable but can understate that this is a guideline-recognized category where lipid-lowering therapy may be considered after clinician-patient discussion.

Recommended public wording:
`ความเสี่ยงเพิ่มขึ้นเล็กน้อย`

Recommended supporting text:
`ตัวเลขนี้อยู่ในช่วง 3% ถึงน้อยกว่า 5% ซึ่งแนวทางปัจจุบันใช้เป็นช่วงหนึ่งในการพิจารณาการป้องกันร่วมกับปัจจัยสุขภาพอื่น ไม่ได้หมายความว่าคุณเป็นโรค`

Do not expose the English word `borderline` as the main public-facing label.

### Intermediate and high labels
Keep the numerical thresholds, but explicitly state that the labels refer to estimated 10-year PREVENT-ASCVD risk and are not disease severity grades.

### Severe blood pressure override
2025 AHA/ACC defines severe hypertension as >180/120 mm Hg and hypertensive emergency as severe BP plus acute target-organ damage. Severe BP without acute target-organ damage is not automatically an emergency.

Public behavior should therefore be:
- Acute red-flag symptoms -> emergency pathway regardless of calculated risk.
- Very high BP without red-flag symptoms -> repeat correctly and obtain timely clinical evaluation; do not automatically label as emergency.

### LDL-C >=190 mg/dL
Keep as a prominent clinical override, but make clear that PREVENT-ASCVD treatment categories in the 2026 dyslipidemia guideline are intended for LDL-C 70-189 mg/dL in the principal risk-based primary-prevention pathway. LDL-C >=190 mg/dL requires separate clinical evaluation and should not be reassured by a low PREVENT percentage.

### LDL-C outside 70-189 mg/dL
If LDL-C is available and outside 70-189 mg/dL, add a visible note that the displayed PREVENT estimate may still be informative but should not be used alone to interpret lipid-treatment decisions under the 2026 guideline pathway.

### Diabetes and CKD advice
Avoid implying that a low PREVENT percentage removes the need for clinical prevention planning. The 2026 dyslipidemia guideline recommends lipid-lowering therapy for primary prevention in adults 40-75 with diabetes or CKD stage 3/4 regardless of LDL-C level. Public wording should direct these users to clinician review rather than give a medication instruction.

## REMOVE / AVOID

- Do not call PREVENT categories a diagnosis.
- Do not imply that `low risk` means `no risk`.
- Do not use PREVENT percentage alone to tell a user to start, stop, or change prescription medication.
- Do not classify asymptomatic BP at or around 180/120 as a hypertensive emergency without evidence of acute target-organ damage.
- Do not imply that PREVENT has been specifically validated or calibrated for the Thai population unless direct evidence becomes available.
- Do not combine or average PREVENT with another cardiovascular risk score.

## ADD

### Source transparency beside the result
Add a short line near the result:
`ระดับความเสี่ยงอ้างอิงช่วงคะแนน PREVENT-ASCVD ตามแนวทาง ACC/AHA 2026 และเป็นการประเมินความเสี่ยง ไม่ใช่การวินิจฉัยโรค`

### Clinical-context note
For LDL-C >=190, diabetes age 40-75, CKD stage 3/4, or very high BP, show a separate `ควรปรึกษาแพทย์` card independent of the risk percentage.

### Thailand limitation
Keep a concise disclosure:
`PREVENT พัฒนาจากข้อมูลประชากรในสหรัฐอเมริกา ผลในคนไทยควรใช้เพื่อช่วยประเมินและสื่อสารความเสี่ยงร่วมกับข้อมูลทางคลินิก ไม่ใช่ใช้แทนการประเมินโดยแพทย์`

## UAT acceptance criteria for clinical communication

A participant should be able to answer all of the following after reading their result:
1. What does the percentage refer to?
2. What is the time horizon (10 or 30 years)?
3. Does the result mean they definitely will or will not develop disease? (Correct answer: no.)
4. What is the first health factor they should address?
5. When should they seek medical review?
6. If acute warning symptoms are present, do they understand not to wait for the calculator result?

Target before production: >=90% correct for questions 1-4 and 100% recognition of the emergency instruction in the safety-gate UAT scenario.

## Release conclusion

- PREVENT numerical category thresholds: KEEP.
- Public labels and contextual explanations: MODIFY.
- Safety/established-CVD gates: KEEP.
- Very-high-BP and LDL >=190 behavior: KEEP concept, refine wording/context.
- PREVENT equation/coefficient code: NO CHANGE.
- Production status: NOT YET APPROVED; proceed to implementation of communication-layer changes, automated regression tests, independent numerical validation, then Human UAT.
