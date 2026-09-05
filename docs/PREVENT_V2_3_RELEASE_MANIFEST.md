# PREVENT v2.3 — Release Manifest

## Intended status
UAT / pre-production candidate. Not yet a public clinical release.

## Locked integrated Human UAT candidate
- Commit: `9d4122bd0267f7f4fc2848efcf766a2391543329`
- Locked: 2026-08-28 (Asia/Bangkok)
- Source branch at lock: `prevent-v2-working-prototype`
- Scope: PREVENT engine, safety gates, patient-facing clinical communication,
  recommendation engine v1.1, responsive UI and one-page PDF export as integrated
  at the commit above.
- Rule: Human UAT evidence and clinical/privacy sign-off are valid only for this
  exact commit. Any subsequent change requires a new candidate SHA and documented
  impact assessment; affected gates must be rerun.

Historical component baselines such as `dfd5379c758746a1f32829bdc45c0e6182471c69`
(pre-human-UAT technical baseline) and `14da4f69f70928234999f54b028151068456100a`
(one-page PDF component baseline) support provenance but do not replace the locked
integrated candidate.

Candidate `e86b0c293d18ebb9a6374a6d6a806628de18567a` is superseded after initial bench UAT
identified three comprehension/error-message findings. The locked candidate
remediates those findings without changing PREVENT equations, safety thresholds
or recommendation rules.

Candidate `9d4122bd0267f7f4fc2848efcf766a2391543329` additionally self-hosts the logo,
html2canvas and jsPDF, retains dependency licenses/digests, applies a no-referrer
policy and restrictive CSP meta policy, and replaces broad privacy assurances
with factual data-flow wording. GitHub Actions QA, isolated Pages deployment and
the complete 12-case deployed-browser bench set passed. Real-device testing,
participant comprehension UAT and human review of the exported PDF remain pending.

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

For the locked candidate, the remaining release gates are human functional and
50+ comprehension UAT, device/accessibility evidence, cardiology/preventive-medicine
sign-off, privacy/PDPA governance sign-off and a recorded production decision.

## Version traceability
These identifiers are independent and must not be used interchangeably:
- **HeartCheck Wise application version:** 8.0.0 (`VERSION`).
- **PREVENT equation/source version:** AHAprevent R package 1.0.0 base equations; coefficients remain unchanged.
- **UAT release version:** PREVENT v2.3.
- **Git commit SHA:** injected into the isolated UAT artifact by the Pages workflow from the exact checked-out UAT source commit.
