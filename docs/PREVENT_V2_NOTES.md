# PREVENT v2 Working Prototype

## Status
Development/UAT only. Not approved for clinical production.

## Engine
`js/prevent-base.js` is a JavaScript port of the **base equations** from the AHA PREVENT R package v1.0.0 supplied for this project. The original package is GPL-3.0.

Supported outputs:
- 10-year CVD, ASCVD and HF risk for age 30–79
- 30-year CVD, ASCVD and HF risk for age 30–59
- Partial output: ASCVD/CVD requires TC + HDL + statin; HF requires BMI

Prototype validation ranges:
- age 30–79 years
- SBP 90–200 mmHg
- TC 130–320 mg/dL
- HDL-C 20–100 mg/dL
- BMI 18.5–39.9 kg/m2
- eGFR 15–140 mL/min/1.73m2

## Clinical layer
The UI applies safety/eligibility gates before interpretation:
- acute red flags → stop calculator / urgent assessment message
- established ASCVD/HF → secondary-prevention pathway
- LDL-C >=190 mg/dL → clinical override warning
- SBP >=180 or DBP >=120 mmHg → severe BP warning

10-year PREVENT-ASCVD display bands:
- <3% Low
- 3 to <5% Borderline
- 5 to <10% Intermediate
- >=10% High

## Required before production
1. Run golden profiles and all boundary cases against the official AHA R package and freeze expected outputs.
2. Add unit tests with strict numeric tolerances.
3. Clinical review of safety gates, wording, risk enhancers, CAC pathway and CTA.
4. Add HbA1c/UACR variants only after independent equation-port verification.
5. Review licensing/attribution for the deployed distribution.
6. Privacy, security, accessibility and PDPA review.

## Design principle
Keep the PREVENT equation engine separate from clinical recommendation rules so guideline updates do not modify the validated math layer.
