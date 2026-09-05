# HeartCheck Wise PREVENT Numerical Validation Report

Report date: 2026-08-25
Validation baseline: `fff560a8a5bd923a43aead325d4a232df9eae569`
Branch: `prevent-v2-working-prototype`
Scope: PREVENT base-equation numerical implementation and deterministic regression behavior before Human UAT.

## Executive conclusion

The HeartCheck Wise PREVENT base engine reached a CI-passing independent numerical cross-validation baseline at commit `fff560a8a5bd923a43aead325d4a232df9eae569`.

The independent suite evaluates six reference profiles over six output slots each (36 checks) with numerical tolerance `<= 0.000001` percentage point. It includes complete profiles, age-dependent null outputs, missing-BMI partial outputs and an HF-only profile.

The primary official-package oracle remains the AHAprevent v1.0.0 vignette in the core validation suite. Additional independent vectors come from public pyprevent fixtures documented upstream as generated from the AHAprevent R implementation.

This is strong software numerical-verification evidence, but it must not be described as Thai-population clinical validation or direct live AHA parity.

## 1. Validation objective

Confirm that HeartCheck Wise reproduces independently sourced PREVENT base-model numerical targets while preserving intentional application validation rules and without changing the equation or loosening tolerance to obtain a pass.

## 2. Components tested

- Runtime engine: `js/prevent-base.js`
- Core oracle/regression suite: `tests/prevent-validation.js`
- Independent numerical suite: `tests/prevent-independent-validation.js`
- Separate live parity probe: `tests/prevent-live-aha-parity.js`

## 3. Reference evidence

### 3.1 AHAprevent package vignette
The core suite encodes the AHAprevent v1.0.0 example and compares all six base outcomes. Its tolerance is `1e-5` percentage point because the displayed vignette targets are stored at fewer decimal places.

### 3.2 Independent pyprevent-derived vectors
The independent suite uses higher-precision expected values transcribed from public pyprevent R-reference fixtures. Its tolerance is `1e-6` percentage point.

The independent test explicitly states that this is a reproducibility cross-check and not a substitute for direct licensed AHA-source validation.

## 4. Test coverage

| Profile | Key condition | 10-y | 30-y |
|---|---|---|---|
| vignette_base_female_45 | Complete official-vignette profile | CVD/ASCVD/HF | CVD/ASCVD/HF |
| vignette_uacr_male_75_base_model | Age 75 | CVD/ASCVD/HF | expected null |
| vignette_hba1c_female_39_bmi_missing_base_model | BMI missing | CVD/ASCVD; HF null | CVD/ASCVD; HF null |
| vignette_sdi_male_58_hf_only_normalized | HF-only, lipids absent | HF; CVD/ASCVD null | HF; CVD/ASCVD null |
| tables25_female_50 | Complete higher-risk profile | CVD/ASCVD/HF | CVD/ASCVD/HF |
| preventr_base_male_66 | Age 66 | CVD/ASCVD/HF | expected null |

Independent suite total: 36 output assertions/checks.

The broader core suite additionally checks age boundaries, partial-output behavior, accepted input ranges, BMI-specific HF suppression and monotonic sanity behavior.

## 5. Acceptance criteria

A validation run passes only if:

- all reference profiles are accepted when they are intended to be valid;
- every expected numerical output is finite and within its defined absolute tolerance;
- every expected null output is exactly null;
- application validation rules remain intact;
- no expected value is silently updated to follow implementation output;
- live external parity is never reported as PASS when the endpoint is unavailable.

Independent numerical tolerance: `|actual - expected| <= 0.000001` percentage point.

## 6. HF-only fixture discrepancy and resolution

An initial independent run exposed a fixture/validation-policy mismatch: the HF-only upstream-style vector supplied TC while HDL/statin were missing, whereas HeartCheck Wise intentionally rejects incomplete lipid pairs.

Resolution: for that HF-only vector, the lipid triplet was normalized to null. This is mathematically appropriate for the HF-only target because TC, HDL and statin are not used by the HF base equation. The HF expected values remained unchanged. The stricter incomplete-lipid policy also remained unchanged.

The resolution was recorded in commit `fff560a8a5bd923a43aead325d4a232df9eae569` with 9 additions and 2 deletions limited to `tests/prevent-independent-validation.js`.

Critically, the resolution did NOT:
- modify `js/prevent-base.js`;
- alter PREVENT coefficients/equations;
- relax numerical tolerance;
- change expected HF oracle values;
- permit incomplete lipid pairs in production logic.

## 7. Result

At baseline commit `fff560a8a5bd923a43aead325d4a232df9eae569`, the independent numerical cross-validation subsequently passed in CI. The deployment workflow also passed at that baseline in the observed GitHub Actions state.

Result classification: **PASS — software numerical cross-validation baseline**.

This classification is intentionally narrower than “clinically validated.”

## 8. Remaining limitations

1. Live AHA parity may remain `UNAVAILABLE` when the external endpoint cannot be verified. This is not a failure of the deterministic local oracle, but it is also not evidence of direct live parity.
2. The independent public vectors ultimately trace to another implementation's R-generated fixture and therefore are not fully independent clinical data.
3. No claim is made here about calibration/discrimination in Thailand.
4. Human UAT has not been replaced by numerical validation; UAT must evaluate comprehension, accessibility and risk communication.
5. Changes to PREVENT model version, coefficients, variable definitions, supported ranges or engine implementation require re-running and re-baselining this report.

## 9. Recommended release evidence chain

For Human UAT and later governance review, retain together:

- this Numerical Validation Report;
- `PREVENT_VALIDATION_MANIFEST.md`;
- `PREVENT_GOLDEN_VECTOR_PROVENANCE.md`;
- the exact validated commit SHA;
- GitHub Actions run evidence;
- clinical-content audit;
- Human UAT protocol/results;
- explicit record of live AHA parity status.

## 10. Governance statement

The numerical validation baseline supports proceeding to controlled Human UAT of HeartCheck Wise PREVENT. It does not by itself authorize autonomous diagnosis, treatment decisions, or production clinical deployment. Any production release should retain clinical governance, version traceability, regression testing and transparent disclosure of the PREVENT source/model version.
