# PREVENT v2.1 — Validation Edition

## Purpose
Numerically validate the browser JavaScript implementation of the AHA PREVENT base equations before clinical/public release.

## Reference implementation
- AHAprevent R package v1.0.0 supplied from the AHA-DS-Analytics/PREVENT repository.
- Equation source: `R/AHA_prevent_equations.R` in the official package archive.
- License declared by the package: GPL-3.

## Golden oracle implemented
The official AHAprevent package vignette publishes this base-equation example:

- female, age 45
- TC 200 mg/dL, HDL-C 60 mg/dL
- SBP 120 mmHg, no antihypertensive treatment
- diabetes yes, current smoking no
- BMI 25 kg/m2, eGFR 95 mL/min/1.73m2
- statin no

Published AHAprevent v1.0.0 outputs:

| Endpoint | Official output (%) |
|---|---:|
| 10-y CVD | 3.379410 |
| 10-y ASCVD | 2.101978 |
| 10-y HF | 1.698138 |
| 30-y CVD | 20.649960 |
| 30-y ASCVD | 11.996140 |
| 30-y HF | 12.794470 |

`tests/prevent-validation.js` requires the JavaScript engine to reproduce every value within an absolute tolerance of 0.00001 percentage point.

## Additional automated validation
1. Age 59/60 boundary for 30-year output.
2. Partial-output behavior: missing lipids/statin suppresses CVD/ASCVD but preserves HF if BMI exists.
3. Partial-output behavior: missing BMI suppresses HF but preserves CVD/ASCVD if lipid inputs exist.
4. Range guards for age, SBP, TC, HDL-C, BMI and eGFR.
5. Directional sanity test comparing a low-risk profile with a substantially higher-risk profile.
6. JavaScript syntax validation in CI.
7. Existing HeartCheck clinical-safety regression suite remains active.

## CI gate
GitHub Actions workflow `.github/workflows/qa.yml` runs both the legacy safety suite and PREVENT numerical validation on pull requests to `main`, and on pushes to the PREVENT prototype branch.

## Validation status
**Phase A: PASS at implementation review** — the JavaScript coefficients/transforms were compared with the official R equation source, and the published AHA vignette golden case is reproduced to the required tolerance.

**Phase B: CI required** — GitHub Actions must be green on the PR head commit before merge.

## Remaining production gates
This validation does **not** by itself authorize clinical deployment. Before production:
- obtain green CI status;
- expand golden vectors across both sexes, age/risk boundaries, treatment combinations, and missing-data pathways using outputs generated directly by the official R package;
- clinical governance review of exclusions, overrides, wording and referral recommendations;
- privacy/security and accessibility review;
- UAT on mobile and desktop;
- document calculator version, source version and release date in the UI.

## Release recommendation
Keep PR #3 as Draft until CI and expanded golden-vector testing are complete. Do not merge to public GitHub Pages solely on the basis of the current Phase A validation.
