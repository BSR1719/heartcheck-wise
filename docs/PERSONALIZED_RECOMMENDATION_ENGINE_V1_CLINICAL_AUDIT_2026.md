# HeartCheck Wise — Clinical Audit of Personalized Recommendation Engine v1

Audit date: 2026-08-25
Scope: `js/recommendation-engine.js`
Status: PRE-UAT clinical audit

## Governing principle

This audit evaluates the recommendation layer only. It does **not** modify AHA PREVENT equations, validated numerical outputs, emergency gating, or established-CVD gating.

The recommendation engine is intended for public health literacy and shared-decision support. It must not issue autonomous medication orders, diagnose disease, or imply that additional testing is mandatory when the guideline recommends selective use.

## Latest governing CPGs used

1. **2026 AHA/ACC/ADA/ASN Guideline for Prevention, Detection, Evaluation, and Management of Cardiovascular-Kidney-Metabolic (CKM) Syndrome** — latest overarching guideline linking obesity, diabetes, CKD and CVD; explicitly integrates PREVENT, CKM staging, eGFR + UACR, weight/lifestyle intervention and coordinated care.
2. **2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia** — current guideline for PREVENT-ASCVD risk categories, LDL-C/non-HDL-C management, Lp(a), ApoB and CAC.
3. **2025 ACC/AHA Multisociety High Blood Pressure Guideline** — current BP definitions, target <130/80 mmHg for most adults, PREVENT-CVD risk-based therapy, home BP monitoring and severe hypertension handling.
4. **ADA Standards of Care in Diabetes 2025 — Cardiovascular Disease and Risk Management** — supporting disease-specific lifestyle recommendations for diabetes, including DASH/Mediterranean-style dietary patterns, sodium reduction and >=150 min/week moderate aerobic activity.
5. **AHA Life's Essential 8** — supporting health-behavior framework for diet, physical activity, tobacco/nicotine, sleep, weight, lipids, glucose and BP. This is a cardiovascular-health construct rather than a 2026 CPG and should be labeled accordingly in technical documentation.

---

# Executive audit conclusion

**Overall: CONDITIONALLY APPROVABLE after targeted modifications.**

The v1 engine is directionally aligned with current evidence, particularly for smoking, elevated BP, LDL-C >=190 mg/dL, diabetes, CKD, diet, physical activity, Lp(a), ApoB and selective CAC. However, several rules need refinement before public UAT because the current wording sometimes mixes education, guideline thresholds and implied clinical management too tightly.

Required changes before UI integration:

1. use **PREVENT-CVD**, not PREVENT-ASCVD, for BP risk-based treatment context;
2. add **UACR** as a recommended kidney assessment when CKD/diabetes is relevant;
3. refine CKD logic so `eGFR <60` does not automatically equal a confirmed CKD diagnosis without chronicity/albuminuria context;
4. make CAC eligibility a **shared-decision selective recommendation**, not an automated test recommendation based only on 3-<10% ASCVD risk;
5. retain Lp(a) once-in-adulthood recommendation;
6. keep ApoB selective and explicitly conditional on the clinical contexts named in the 2026 dyslipidemia guideline;
7. separate lifestyle education from medication-treatment thresholds so a public tool does not imply a prescription decision.

---

# Rule-by-rule audit

## 1. Smoking / nicotine — KEEP, with wording refinement

### Current engine
Priority 10; recommends quit date, trigger reduction, cessation support and secondhand-smoke avoidance.

### Audit
**KEEP.** Smoking cessation is a major cardiovascular prevention intervention and aligns with AHA cardiovascular-health guidance and CKM prevention principles.

### Modify
Use `บุหรี่และผลิตภัณฑ์นิโคติน` rather than only smoking where appropriate, because contemporary cardiovascular guidance increasingly frames nicotine exposure broadly.

Do not recommend a specific pharmacologic cessation product from this public engine; keep the instruction to discuss evidence-based support with a clinician.

---

## 2. Blood pressure >=130 mmHg — MODIFY

### Current engine
Triggers at SBP >=130; recommends repeat measurement, DASH-like diet, activity and weight management. For SBP >=140 it recommends medical review; at 130-139 it suggests assessment with risk/comorbidity context.

### Audit
**Core concept: KEEP. Risk logic: MODIFY.**

2025 BP guideline target is generally **<130/80 mmHg**. For Stage 1 hypertension (130-139/80-89), treatment decisions are informed by **10-year PREVENT-CVD**, with a 7.5% threshold relevant to pharmacotherapy decisions. Lower-risk adults with average BP >=130/80 may receive lifestyle modification first, with medication considered if BP remains elevated after 3-6 months.

### Required change
- recommendation logic may use SBP/DBP to trigger lifestyle advice;
- any risk-based treatment statement must reference **PREVENT-CVD 10-year risk**, not PREVENT-ASCVD;
- public-facing wording should say `ควรประเมินร่วมกับแพทย์` rather than imply automatic drug initiation;
- home BP monitoring should be explicitly recommended when appropriate;
- cuffless smartwatch BP should not be presented as equivalent to validated cuff-based measurement.

---

## 3. Severe BP >180/120 — KEEP in safety layer, not recommendation engine

The 2025 guideline distinguishes severe hypertension without acute target-organ damage from hypertensive emergency. Very high BP without red-flag symptoms should receive timely outpatient clinical evaluation/treatment, while acute symptoms compatible with target-organ injury require emergency assessment.

**Recommendation engine should not duplicate or override the already-audited safety gate.** It may display a follow-up education card only after safety logic has run.

---

## 4. LDL-C >=190 mg/dL — KEEP

### Current engine
Treats LDL-C >=190 as a separate high-priority clinical context not to be reassured away by a low PREVENT percentage.

### Audit
**KEEP.** This is appropriate. Current dyslipidemia guidance treats markedly elevated LDL-C as a distinct clinical context and PREVENT percentage should not be used alone to dismiss it.

### Modify
Add wording that very high LDL-C may warrant evaluation for causes including familial hypercholesterolemia/strong inherited risk, but do not diagnose FH from the calculator.

---

## 5. LDL-C >=160 but <190 — KEEP, simplify

2026 dyslipidemia guideline emphasizes earlier prevention and notes LDL-C >=160 mg/dL in young adulthood as an important context for considering earlier treatment, especially with strong family history of premature ASCVD.

**KEEP** the lifestyle and clinician-discussion message.

### Modify
Do not imply that LDL-C >=160 has a single universal treatment threshold across all ages. Phrase as a risk-enhancing/high-lifetime-exposure context that deserves discussion.

---

## 6. Diabetes — KEEP, but update to CKM framework

### Current engine
Flags diabetes and states that adults age 40-75 should undergo additional cardiovascular prevention assessment.

### Audit
**KEEP**, strengthened by 2026 CKM and dyslipidemia guidelines.

Current 2026 dyslipidemia guidance recommends LDL-lowering therapy for primary prevention in adults 40-75 with diabetes regardless of LDL-C level, while the CKM guideline emphasizes integrated cardiovascular-kidney-metabolic management.

### Required change
For a public tool, do not state a medication command. Recommended wording:

`หากคุณเป็นเบาหวาน โดยเฉพาะช่วงอายุ 40–75 ปี ควรทบทวนแผนป้องกันโรคหัวใจและหลอดเลือดกับแพทย์ แม้เปอร์เซ็นต์ PREVENT จะไม่สูง`

Also consider recommending HbA1c review when recent glycemic control is unknown, but only if the questionnaire captures whether a recent value exists.

---

## 7. eGFR <60 / CKD — MODIFY materially

### Current engine
Labels `การทำงานของไตลดลง` and says `โรคไตเรื้อรังเป็นบริบทสำคัญ`.

### Audit
**MODIFY.** An isolated eGFR <60 does not by itself establish chronic kidney disease unless chronicity is known. The 2026 CKM guideline recommends **both eGFR and UACR** to characterize CKD and guide kidney/cardiovascular protection.

### Required change
- do not automatically label the user as having CKD solely from one eGFR result;
- use wording such as `ค่าการทำงานของไตต่ำกว่าช่วงที่ควรติดตาม`;
- recommend confirming persistence and checking **urine albumin-to-creatinine ratio (UACR)** where clinically appropriate;
- if the user already has known CKD, the engine may use the stronger CKD-specific recommendation.

This is one of the most important changes required before UAT.

---

## 8. Weight / BMI >=25 — MODIFY to avoid over-reliance on BMI

### Current engine
Triggers at BMI >=25 and recommends gradual weight management.

### Audit
**KEEP concept, MODIFY framing.** The 2026 CKM guideline reframes adiposity as a cardiovascular-kidney-metabolic risk state and supports lifestyle/weight reduction where indicated. However, BMI alone is an incomplete measure of adiposity and risk.

### Required change
- avoid labeling the person simply `อ้วน` or `น้ำหนักผิดปกติ` from BMI alone;
- phrase as `น้ำหนัก/สัดส่วนร่างกายเป็นอีกปัจจัยที่อาจช่วยลดความเสี่ยงได้`;
- consider adding waist circumference in a later version if product scope permits;
- avoid fixed aggressive weight-loss targets unless supported by clinician assessment.

---

## 9. Diet — KEEP, but make Thai-practical and disease-aware

### Current engine
Recommends vegetables/fruits, whole grains, legumes, fish/lean protein; reduces salty/processed foods, processed meat, fried food, saturated fat and sugary drinks.

### Audit
**KEEP.** This is consistent with BP, diabetes and lipid guidelines.

### Required refinement for public health literacy
Translate generic diet advice into actionable Thai examples without turning it into a rigid meal plan:
- reduce high-sodium sauces, processed meats, instant foods and heavily seasoned packaged foods;
- emphasize vegetables, whole grains, beans/soy, fish and minimally processed protein sources;
- reduce saturated fat and trans fat;
- reduce sugar-sweetened beverages.

For CKD, advanced diabetes or other special conditions, include `คำแนะนำอาหารอาจต้องปรับเฉพาะบุคคล`.

---

## 10. Physical activity — KEEP

### Current engine
General target: >=150 min/week moderate aerobic or 75 min/week vigorous activity, plus muscle strengthening >=2 days/week; allows gradual initiation.

### Audit
**KEEP.** This is consistent with AHA cardiovascular-health guidance and diabetes lifestyle recommendations.

### Modify
For older adults and those with low baseline activity, explicitly prioritize gradual progression and functional safety. Do not imply that a previously inactive person must immediately reach the full target.

If exertional chest pain, unexplained dyspnea, presyncope/syncope or major mobility limitation exists, the user should be evaluated before substantially increasing intensity.

---

## 11. Sleep — KEEP as supportive health-literacy advice, not a PREVENT treatment rule

### Current engine
7-9 hours/night and prompts evaluation for snoring/daytime sleepiness/suspected sleep apnea.

### Audit
**KEEP with relabeling.** Sleep is part of Life's Essential 8, while 2026 CKM guidance also recommends selected assessment for obstructive sleep apnea in relevant individuals.

### Modify
Label this as `สุขภาพการนอน` rather than implying that 7-9 hours is a disease-specific prescription. OSA screening should be symptom/risk based rather than universal.

---

# Additional testing / risk refinement

## 12. Lp(a) once in adulthood — KEEP

2026 dyslipidemia guideline states that **Lp(a) should be measured at least once** to identify people at higher ASCVD risk. Elevated Lp(a) is a risk-enhancing factor.

**KEEP.** This is one of the strongest evidence-supported “additional tests” for the health-literacy layer.

### Public wording
`ถ้ายังไม่เคยตรวจ Lp(a) อาจคุยกับแพทย์เรื่องการตรวจอย่างน้อยหนึ่งครั้งในวัยผู้ใหญ่ เพราะเป็นปัจจัยเสี่ยงทางพันธุกรรมที่ PREVENT ไม่ได้รวมโดยตรง`

Do not imply repeated routine testing in everyone.

---

## 13. ApoB — KEEP selectively, tighten trigger

2026 dyslipidemia guideline states ApoB can be useful particularly when:
- triglycerides >200 mg/dL;
- diabetes is present;
- achieved LDL-C is <70 mg/dL;
- residual lipoprotein-related risk is suspected after standard lipid goals are reached.

### Current engine
Triggers when diabetes, TG >200, or LDL-C <70.

### Audit
**KEEP**, but only if TG is actually available and reliable. Since current HeartCheck Wise does not collect triglycerides in the public form, do not display a TG-based ApoB recommendation until TG becomes a captured input.

For diabetes, ApoB may be presented as `อาจมีประโยชน์ในบางกรณี`, not routine mandatory testing.

---

## 14. CAC — MODIFY materially

### Current engine
Triggers CAC when PREVENT-ASCVD 3-<10% plus age threshold (men >=40, women >=45).

### Audit
**MODIFY.** The 2026 dyslipidemia guideline supports CAC to improve risk assessment in men >=40 and women >=45 and as part of the CPR approach (Calculate, Personalize, Reclassify/Reassess). However, CAC should be used **selectively when the result is likely to change a prevention decision**.

### Required change
Do not automatically recommend CAC to every person with PREVENT-ASCVD 3-<10%.

Use a two-stage rule:
1. borderline/intermediate PREVENT-ASCVD or otherwise uncertain preventive decision;
2. only display CAC if a clinician-patient decision remains uncertain after considering risk enhancers/preferences.

Public wording:
`ในบางคนที่การตัดสินใจเรื่องการป้องกันยังไม่ชัด การตรวจ CAC อาจช่วยจัดระดับความเสี่ยงได้ แต่ไม่ใช่การตรวจที่ทุกคนจำเป็นต้องทำ`

---

# Important missing recommendations to ADD

## A. UACR — ADD

The 2026 CKM guideline recommends using **eGFR + UACR** to characterize CKD and guide kidney/cardiovascular management.

Add conditional recommendation when:
- known diabetes; or
- eGFR is reduced; or
- known CKD but UACR status is unknown.

Do not suggest UACR as a universal package item without context.

## B. Home blood pressure monitoring — ADD prominently

For elevated BP, recommend validated upper-arm cuff home BP monitoring with standardized technique. This is directly supported by the 2025 BP guideline.

## C. Family history of premature ASCVD — ADD as future questionnaire input

The 2026 dyslipidemia guideline uses strong family history as important context, particularly in younger adults and when personalizing risk. Current engine cannot use it because the public form does not collect it.

Recommended future field:
`พ่อ แม่ พี่น้อง เคยมีโรคหัวใจหรือหลอดเลือดสมองก่อนอายุประมาณ 55 ปีในผู้ชาย หรือ 65 ปีในผู้หญิงหรือไม่?`

Exact final wording/threshold should undergo clinical-language review before UI implementation.

## D. UACR / HbA1c / triglycerides presence rather than guessed values — ADD data-awareness

The engine should never infer that a test was normal because it was not entered. If future recommendations depend on HbA1c, UACR or triglycerides, the form should explicitly ask whether the result is known and capture it before using numeric rules.

---

# REMOVE / AVOID

1. Do not recommend specific prescription initiation/dose changes from this public engine.
2. Do not use PREVENT-ASCVD 10-year risk for BP pharmacotherapy logic; BP guideline uses **PREVENT-CVD**.
3. Do not diagnose CKD from one isolated eGFR value.
4. Do not automatically send all borderline/intermediate users for CAC.
5. Do not call ApoB mandatory for all diabetes.
6. Do not imply Lp(a) requires frequent repeated testing in all adults.
7. Do not state that a healthy lifestyle can “cancel” or reduce a current calculated PREVENT percentage by a known amount unless a validated benefit model is implemented.
8. Do not use recommendations as a commercial package-upgrade path; testing suggestions must remain clinically conditional.

---

# Revised priority framework recommended for v1.1

Priority 0: emergency/established-CVD safety gates — outside recommendation engine.

Priority 1 — Immediate modifiable hazards / high-impact clinical context:
- smoking/nicotine;
- severe/uncontrolled BP after safety gate;
- LDL-C >=190 mg/dL.

Priority 2 — Major CKM conditions:
- diabetes;
- reduced eGFR / known CKD;
- materially elevated BP;
- high LDL-C.

Priority 3 — Foundational behavior plan:
- diet;
- physical activity;
- weight/adiposity;
- sleep.

Priority 4 — Selective further assessment:
- Lp(a) once in adulthood;
- UACR when diabetes/CKD risk context exists;
- ApoB selectively;
- CAC only when decision uncertainty remains.

---

# Confidence classification

**High confidence / directly guideline-supported**
- PREVENT as risk framework;
- BP target/context and home BP monitoring;
- LDL-C >=190 separate clinical context;
- diabetes/CKD require prevention planning beyond low risk score;
- Lp(a) at least once;
- selective ApoB;
- selective CAC;
- eGFR + UACR for CKD characterization.

**Moderate / implementation-dependent**
- exact ordering between smoking, BP, diabetes and LDL for an individual user;
- use of BMI alone for action prioritization;
- exact public wording for 90-day plans;
- how strongly to surface CAC in a self-assessment tool.

**Supportive health-literacy framework rather than disease-specific CPG rule**
- 7-9 hours sleep;
- generic Life's Essential 8 framing;
- generic progressive activity start plan.

---

# Release decision

**Recommendation Engine v1: NOT YET READY to integrate into Human UAT UI unchanged.**

It can proceed to **v1.1 remediation** with the targeted changes above. The PREVENT numerical engine remains untouched.

After v1.1 changes, required gates are:
1. deterministic unit tests for each recommendation rule;
2. clinical-content regression tests;
3. review that no rule can override emergency/secondary-prevention gates;
4. mobile result-page review for information overload;
5. focused Human UAT on whether users can identify their top 1-3 actions and understand which tests are optional versus recommended.
