# PREVENT v2.3 — Release Manifest

## Intended status
UAT / pre-production candidate. Not yet a public clinical release.

## Source of truth
- Calculation model: AHA PREVENT base equations, AHAprevent R package v1.0.0 supplied from AHA-DS-Analytics/PREVENT.
- Browser engine: `js/prevent-base.js` JavaScript port.
- Patient-facing orchestration: `js/app.js`.

## Automated validation
1. `tests/qa-tests.js` — retained legacy HeartCheck safety regression suite.
2. `tests/prevent-validation.js` — official AHA vignette numerical oracle, age boundary, partial-output and range checks.
3. `tests/prevent-extended-validation.js` — 56-profile sex/age/phenotype matrix plus exact boundaries, paired-factor checks, partial outputs and determinism.
4. `.github/workflows/qa.yml` — executes all suites on the PREVENT branch and PRs to main.

## Model behavior frozen for UAT
- PREVENT 10-year: age 30–79.
- PREVENT 30-year: age 30–59 only.
- ASCVD/CVD require lipid inputs and statin status; BMI is not required for these base outputs.
- HF requires BMI in the supported 18.5–39.9 kg/m² range; absent/out-of-range BMI suppresses HF without suppressing mathematically independent ASCVD/CVD outputs.
- No silent substitution of normal values for missing inputs.
- Inputs outside validated implementation ranges are rejected rather than silently clamped.

## Interpretation layer
- PREVENT-ASCVD 10y display bands: <3% Low; 3–<5% Borderline; 5–<10% Intermediate; >=10% High.
- Emergency symptoms override calculator flow.
- Established ASCVD/heart failure routes away from primary-prevention interpretation.
- LDL-C >=190 mg/dL and severe BP trigger visible clinical override warnings.

## Known pre-production limitations
- Base equation only: optional UACR/HbA1c models are not yet exposed in the browser UI.
- Thai CV Risk and WHO Southeast Asia fallback are not yet implemented in this branch.
- No patient identity, appointment integration, HIS integration, analytics, or persistence.
- No local Thai recalibration of PREVENT.
- Human clinical wording/UAT sign-off is still required.

## Merge criterion
The branch may be considered technically ready for a controlled UAT preview after CI is green. Public clinical deployment requires completion of `docs/PREVENT_V2_3_UAT.md` and explicit clinical governance approval.

## Version traceability
These identifiers are independent and must not be used interchangeably:
- **HeartCheck Wise application version:** 8.0.0 (`VERSION`).
- **PREVENT equation/source version:** AHAprevent R package 1.0.0 base equations; coefficients remain unchanged.
- **UAT release version:** PREVENT v2.3.
- **Git commit SHA:** injected into the isolated UAT artifact by the Pages workflow from the exact checked-out UAT source commit.
