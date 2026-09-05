# HeartCheck Wise PREVENT v2.3 — Bench UAT Execution Record

Status: **PASS — 12/12 functional bench cases passed; formal Human UAT pending**

## Candidate and execution scope

- Candidate: `9d4122bd0267f7f4fc2848efcf766a2391543329`
- Executed: 2026-08-28
- Surface: deployed isolated UAT preview in Chrome
- Data: fictional profiles only
- Purpose: functional bench verification of the 12 cases in
  `PREVENT_V2_3_UAT.md`; this is not participant Human UAT and is not clinical,
  privacy or production approval.

## Results

| Case | Result | Evidence summary |
|---|---|---|
| UAT-01 emergency chest pain | PASS | Calculation stopped; urgent evaluation message shown; no score. |
| UAT-02 established CVD | PASS | Primary-prevention interpretation stopped; secondary-prevention message shown. |
| UAT-03 age 59 | PASS | 10-year and 30-year outputs shown; candidate SHA displayed. |
| UAT-04 age 60 | PASS | 10-year outputs shown; all 30-year metrics displayed as em dash, not zero. |
| UAT-05 LDL-C 205 | PASS | LDL-C >=190 override shown independently of the calculated band. |
| UAT-06 SBP 180 | PASS | Severe-BP override shown. |
| UAT-07 DBP 120 | PASS | Severe-BP override shown. |
| UAT-08 lipids missing, BMI present | PASS | HF-only output shown with the neutral Thai label `ประเมินเฉพาะภาวะหัวใจล้มเหลว`; ASCVD/CVD correctly unavailable. |
| UAT-09 BMI missing, lipids present | PASS | ASCVD/CVD shown; HF unavailable with a prominent Thai explanation that height/weight or BMI is required. |
| UAT-10 TC 321 | PASS | Calculation blocked with Thai-first range guidance. |
| UAT-11 BMI about 40 | PASS | ASCVD/CVD retained; HF suppressed; supported-range warning shown. |
| UAT-12 reset | PASS | Deployed-candidate retest cleared form and errors, hid the result, and removed PDF/recommendation CTAs. |

## Additional accessibility checks

- Keyboard Tab path reached all emergency controls, clinical questions, numeric
  inputs, submit and reset buttons in logical order.
- CSS provides a visible four-pixel focus outline for inputs and selects.
- Real-device Android, iPhone, tablet and desktop-width visual checks remain
  unexecuted and cannot be inferred from this browser bench run.

## Remediated findings verified in the locked candidate

### UX-01 — HF-only result had a contradictory band label

- Original severity: S2.
- Observed: the page displays a valid HF-only percentage and explains that the
  estimate is for heart failure only, while the adjacent band says
  `ยังประเมินไม่ได้`.
- Risk: users may think the displayed HF estimate is invalid or that nothing was
  calculated.
- Disposition: remediated and verified in automated and deployed-browser tests.

### UX-02 — Missing BMI suppressed HF without a prominent explanation

- Original severity: S2.
- Observed: ASCVD/CVD values remain available and HF is shown as an em dash only
  inside collapsed detail; no prominent notice explains why.
- Risk: users may interpret the dash as zero risk or fail to understand the
  partial-output contract.
- Disposition: remediated and verified in automated and deployed-browser tests.

### UX-03 — Range-validation error was not Thai-first

- Original severity: S2.
- Observed for TC 321: `Total cholesterol must be 130-320 mg/dL`.
- Risk: fails the UAT gate requiring understandable required/range errors for
  the intended Thai public audience.
- Disposition: remediated and verified in automated and deployed-browser tests.

## Decision

No S0 safety failure or numerical discrepancy was observed. The locked candidate
passed the complete 12-case functional bench set and may proceed to controlled
15–20 participant Human UAT, subject to the protocol and privacy conditions.
This is technical permission to start Human UAT only; it is not clinical,
privacy/PDPA, merge or production approval.

This record does not authorize merge, public clinical deployment or production
use.

## Candidate progression and verification evidence

Local remediation candidate: `b4da03ce4683de975d95597a4eacc74acbcfbec2`

- UX-01: remediated with the neutral Thai label
  `ประเมินเฉพาะภาวะหัวใจล้มเหลว`.
- UX-02: remediated with a prominent explanation when height/weight and BMI are
  unavailable.
- UX-03: remediated with Thai-first validation messages and a TC 321 regression
  case.
- Automated retest: complete suite passed, including UI/clinical 27/27,
  deterministic and independent PREVENT validation, extended matrix,
  recommendation engine, CTA integration and PDF regression.
- Remaining: live browser artifact retest of UAT-08, UAT-09 and UAT-10 plus the
  full 12-case smoke set before formal participant UAT.

Locked deployed candidate:
`9d4122bd0267f7f4fc2848efcf766a2391543329`.

- GitHub Actions QA: PASS.
- Isolated GitHub Pages deployment: PASS.
- Displayed SHA and all cache-busted CSS/JavaScript asset URLs: MATCH.
- Emergency and established-CVD paths: no PDF or recommendation CTA.
- UAT-08 through UAT-12 deployed-browser retests: PASS.
- Real-device Android/iPhone and participant comprehension UAT: pending.
