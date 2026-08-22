# Clinical Knowledge Base

HeartCheck Wise is a health-literacy and shared-decision aid. It is not a diagnostic test and does not replace clinician judgment.

## Core references

1. **2026 ACC/AHA Guideline on the Management of Dyslipidemia**
   - PREVENT, LDL-C, Lp(a), ApoB, and selective CAC use.
   - https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia

2. **2023 ACC/AHA Multimodality Appropriate Use Criteria for Chronic Coronary Disease**
   - Appropriateness of exercise ECG, stress imaging, CAC, CCTA, and invasive angiography.
   - https://www.jacc.org/doi/10.1016/j.jacc.2023.03.410

3. **2024 ESC Guidelines for Chronic Coronary Syndromes**
   - Symptomatic CAD pathway, clinical likelihood, CCTA, functional imaging, invasive angiography.
   - https://www.escardio.org/guidelines/clinical-practice-guidelines/all-esc-practice-guidelines/chronic-coronary-syndromes/

4. **ADA Standards of Care in Diabetes 2026**
   - HbA1c interpretation and diagnostic confirmation principles.
   - https://diabetesjournals.org/care/issue/49/Supplement_1

5. **KDIGO 2024 CKD Guideline**
   - eGFR interpretation and chronicity principle.
   - https://kdigo.org/guidelines/ckd-evaluation-and-management/

## Implementation safeguards

- V7.5 contains **no internally weighted pseudo-risk score**. Action levels are based on transparent rule triggers only.
- PREVENT-ASCVD is not calculated unless the validated equation and required inputs are explicitly implemented and tested.
- CAC is presented only as a selective risk-reclassification discussion; age alone is not treated as an indication.
- Lp(a) supports both mg/dL and nmol/L; risk-enhancing thresholds used by the tool are 50 mg/dL and 125 nmol/L.
- CAC = 0 must never be presented as proof that CAD is absent.
- Normal Echo must never be presented as proof that coronary stenosis is absent.
- Invasive coronary angiography is never a routine screening test.
- Known ASCVD exits the screening pathway and directs users to secondary-prevention care.
- Acute/concerning symptoms override preventive-screening logic.

## V7.5 production QA notes

- Removed all arbitrary internal weighted risk scoring.
- Added known ASCVD screening exclusion / hard stop.
- Reframed CAC as selective shared decision-making after overall risk assessment.
- Added Lp(a) dual-unit support.
- Added input validation and regression tests for safety-critical rules.
