# HeartCheck Wise — Evidence-based Personalized Recommendation Engine v1

Status: PRE-UAT clinical decision-support/health-literacy layer
Date: 2026-08-25
Engine: `js/recommendation-engine.js`

## Purpose
Turn PREVENT results and user-entered risk factors into an understandable prevention plan without changing the PREVENT equation. Recommendations are educational and intended to support clinician-patient discussion, not autonomous diagnosis or prescribing.

## Architecture
`PREVENT -> risk communication -> prioritized modifiable factors -> lifestyle plan -> selective additional tests -> 90-day plan`

The engine is deterministic and rule-based. It does not use generative AI to invent medical advice at runtime.

## Priority rules v1
1. Current smoking
2. Elevated blood pressure
3. LDL-C >=190 mg/dL clinical override
4. Diabetes
5. eGFR <60 / CKD context
6. LDL-C >=160 mg/dL
7. Weight/BMI context
8. Diet
9. Physical activity
10. Sleep
11. Lp(a) once-in-adulthood discussion
12. Selective ApoB
13. Selective CAC for risk reclassification

Priority is a communication order, not a claim that the first item is always the largest causal effect for every individual.

## Evidence matrix

### Smoking
Trigger: current smoking.
Recommendation: stop tobacco/nicotine exposure; offer support if quitting is difficult.
Evidence framework: AHA Life’s Essential 8 — Quit Tobacco.
Confidence: high.

### Blood pressure
Trigger: SBP >=130 mmHg.
Recommendation: correct repeat/home measurements, sodium reduction/DASH-style eating, physical activity, weight management; clinical review based on repeated values and overall risk.
Evidence: 2025 ACC/AHA High Blood Pressure Guideline.
Confidence: high.
Safety: emergency symptoms remain governed by the separate frozen safety gate; very high BP alone is not relabeled as hypertensive emergency by this engine.

### LDL-C
Triggers: LDL-C >=190 mg/dL (clinical override) or >=160 mg/dL (high LDL context).
Recommendation: heart-healthy dietary pattern and clinician assessment; do not allow a low PREVENT percentage to reassure away LDL-C >=190.
Evidence: 2026 ACC/AHA Multisociety Dyslipidemia Guideline.
Confidence: high.

### Diabetes
Trigger: known diabetes.
Recommendation: glucose management, healthy dietary pattern, physical activity and cardiovascular prevention review. Adults 40–75 should not use a low PREVENT percentage alone to dismiss prevention planning.
Evidence: 2026 ACC/AHA Dyslipidemia Guideline plus AHA Life’s Essential 8.
Confidence: high.

### CKD
Trigger: eGFR <60 mL/min/1.73m2.
Recommendation: clinical kidney/CV review and management of BP, glucose and lipids.
Evidence: 2026 ACC/AHA Dyslipidemia Guideline; KDIGO CKD guidance.
Confidence: high for need for clinical context; individual treatment remains clinician-directed.

### Diet
Universal education.
Recommendation: vegetables/fruits, whole grains, legumes/nuts, fish/lean protein; reduce sodium, highly processed foods, processed meat, saturated fat and sugar-sweetened beverages.
Evidence: AHA Life’s Essential 8 — Eat Better; BP/lipid guidelines.
Confidence: high.

### Physical activity
Universal education.
Recommendation: at least 150 min/week moderate aerobic or 75 min/week vigorous aerobic activity plus muscle strengthening >=2 days/week; inactive users may start with short sessions and build gradually.
Evidence: AHA Life’s Essential 8 — Be More Active.
Confidence: high.

### Sleep
Universal education.
Recommendation: most adults approximately 7–9 hours/night; consider medical assessment for symptoms suggestive of sleep apnea.
Evidence: AHA Life’s Essential 8 — Get Healthy Sleep.
Confidence: high for general health recommendation.

### Lp(a)
Trigger: adult user; presented as discussion item, not mandatory urgent test.
Recommendation: consider measuring Lp(a) at least once in adulthood if not previously measured.
Evidence: 2026 ACC/AHA Dyslipidemia Guideline.
Confidence: high.

### ApoB
Selective trigger: diabetes, triglycerides >200 mg/dL when available, or very low LDL-C context.
Recommendation: may help assess residual lipoprotein-related risk; not required for everyone.
Evidence: 2026 ACC/AHA Dyslipidemia Guideline.
Confidence: moderate for UI personalization because the current HeartCheck form does not collect triglycerides.

### Coronary artery calcium (CAC)
Selective trigger v1: PREVENT-ASCVD 10-y 3% to <10% plus age >=40 in men or >=45 in women.
Recommendation: discuss only when treatment/prevention decision remains uncertain and the result could change management. Never present CAC as mandatory screening for everyone.
Evidence: 2026 ACC/AHA Dyslipidemia Guideline.
Confidence: moderate; requires clinical review of exact UI wording and final eligibility logic before production.

## 90-day health-literacy framework
The UI should translate recommendations into:
- Today: choose one high-priority achievable action.
- 2–4 weeks: monitor the relevant metric/behavior.
- About 3 months: review progress and clinically appropriate follow-up tests.

The 3-month interval is a behavior-change communication scaffold, not a universal mandated laboratory retest interval.

## Safety and governance constraints
- Never start, stop or dose prescription medication from this engine.
- Never override the emergency safety gate.
- Never change PREVENT coefficients or outputs.
- Do not imply Thai-population validation of PREVENT.
- Additional tests must be framed as selective discussion, not package upselling.
- Recommendations requiring clinical judgment must say `ควรปรึกษาแพทย์` / discuss with a clinician.
- Every recommendation rule must have an explicit evidence source and version/year.

## Sources
- American Heart Association. Life’s Essential 8. https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8
- American Heart Association. Be More Active. https://www.heart.org/en/healthy-living/healthy-lifestyle/lifes-essential-8/how-to-be-more-active-fact-sheet
- 2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia, Professional Heart Daily. https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia
- 2025 ACC/AHA High Blood Pressure Guideline, Professional Heart Daily. https://professional.heart.org/en/science-news/2025-high-blood-pressure-guideline
- KDIGO Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease (2024). https://kdigo.org/guidelines/ckd-evaluation-and-management/

## Pre-UI release gates
1. Clinical audit of every rule and Thai wording.
2. Unit tests for triggers, ordering, non-trigger cases and safety separation.
3. Confirm recommendations render as optional expandable content so the primary result remains readable for adults 50+.
4. Human UAT questions must add: `หลังอ่านคำแนะนำ คุณรู้หรือไม่ว่าพรุ่งนี้จะเริ่มทำอะไร?` and `มีคำแนะนำใดที่ทำให้เข้าใจว่าเป็นคำสั่งรักษาหรือไม่?`
5. Only after these gates should the engine be loaded into `index.html` for UAT.
