# PREVENT v2.3 — UAT / Pre-production Protocol

Status: **UAT candidate — not authorized for public clinical production**

## Release gates

All gates below must pass before merging to `main` for a public clinical release.

### Gate A — Calculation engine
- [x] Official AHAprevent v1.0.0 vignette oracle matches within <=0.00001 percentage point.
- [x] 10-year outputs available for age 30–79 when required inputs are complete.
- [x] 30-year outputs suppressed for age >=60.
- [x] Partial-output contract: HF may calculate without lipid inputs when BMI is available.
- [x] Partial-output contract: ASCVD/CVD may calculate without BMI when lipid inputs are available.
- [x] Extended matrix covers both sex coefficient sets and age 30/40/50/59/60/70/79.
- [x] Range guards cover age, SBP, TC, HDL-C, BMI, and eGFR.

### Gate B — Clinical safety
- [ ] Human UAT: emergency symptom selection stops calculation and shows urgent-care message.
- [ ] Human UAT: established ASCVD/heart failure stops primary-prevention interpretation.
- [ ] Human UAT: LDL-C >=190 mg/dL displays clinical override even if PREVENT risk is low.
- [ ] Human UAT: SBP >=180 or DBP >=120 displays severe-BP override.
- [ ] Human UAT: no treatment recommendation is presented as an automatic prescription.
- [ ] Human UAT: result page clearly states prototype / non-diagnostic status.

### Gate C — User experience
Test on desktop and mobile widths.
- [ ] Thai text is readable and no content overlaps.
- [ ] Keyboard-only navigation reaches every input and button.
- [ ] Focus indicator is visible.
- [ ] Required-field errors are understandable.
- [ ] Reset clears inputs and result.
- [ ] 30-year cards display dash/not-applicable at age >=60, not a fabricated risk.
- [ ] Missing lipid data yields HF-only output if HF inputs are complete.
- [ ] Missing BMI yields ASCVD/CVD-only output if lipid inputs are complete.

### Gate D — Clinical review before production
- [ ] Cardiologist / preventive-medicine reviewer approves patient-facing Thai wording.
- [ ] Reviewer approves emergency and secondary-prevention gates.
- [ ] Reviewer approves risk bands and clinical override wording.
- [ ] Privacy/PDPA review completed before collecting any identifiable patient data.
- [ ] Production deployment decision recorded.

## Human UAT scenarios

| ID | Scenario | Expected result |
|---|---|---|
| UAT-01 | Chest pain selected | Stop; urgent evaluation message; no PREVENT score |
| UAT-02 | Prior MI/CAD/PCI/CABG selected | Stop primary-prevention score interpretation; secondary-prevention message |
| UAT-03 | Age 59, complete inputs | 10y + 30y CVD/ASCVD/HF shown |
| UAT-04 | Age 60, complete inputs | 10y shown; all 30y outputs shown as not available |
| UAT-05 | LDL-C 205 with otherwise favorable profile | LDL >=190 override shown regardless of calculated band |
| UAT-06 | SBP 180 | Severe-BP override shown |
| UAT-07 | DBP 120 | Severe-BP override shown |
| UAT-08 | TC/HDL missing, BMI present | HF result available; CVD/ASCVD unavailable |
| UAT-09 | BMI missing, TC/HDL present | CVD/ASCVD available; HF unavailable |
| UAT-10 | TC 321 | Validation error; no risk result |
| UAT-11 | BMI 40.0 with complete lipids | ASCVD/CVD retained; HF suppressed with warning |
| UAT-12 | Reset after a result | Form and result clear |

## Production rule

Do **not** merge/deploy as a public clinical calculator solely because CI is green. CI verifies software behavior; final release also requires human UAT and clinical governance sign-off.
