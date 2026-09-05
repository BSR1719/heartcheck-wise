# HeartCheck Wise PREVENT Validation Manifest

Status: PRE-UAT validation record
Validated baseline commit: `fff560a8a5bd923a43aead325d4a232df9eae569`
Branch: `prevent-v2-working-prototype`
Date recorded: 2026-08-25

## Purpose

This manifest freezes the evidence chain used to validate the numerical PREVENT implementation before Human UAT. It is an engineering validation record, not a claim of clinical validation in a Thai population and not a substitute for independent clinical governance.

## Implementation under test

- Engine: `js/prevent-base.js`
- Core oracle/regression test: `tests/prevent-validation.js`
- Independent numerical cross-validation: `tests/prevent-independent-validation.js`
- Live AHA parity probe: `tests/prevent-live-aha-parity.js`
- Extended validation: `tests/prevent-extended-validation.js`
- Baseline commit: `fff560a8a5bd923a43aead325d4a232df9eae569`

## Numerical validation layers

### Layer 1 — Official-package vignette oracle
`tests/prevent-validation.js` checks the AHAprevent v1.0.0 vignette example (45-year-old female) across six base-model outcomes: CVD, ASCVD and HF at 10 and 30 years. The test also covers age boundaries, partial outputs, input range guards and monotonic sanity checks.

Tolerance for the vignette comparisons: `<= 0.00001` percentage point.

### Layer 2 — Independent reproducibility cross-check
`tests/prevent-independent-validation.js` contains six reference profiles and evaluates six output slots per profile (36 checks, including expected null outputs). The numerical vectors are transcribed from public `pyprevent` fixtures documented upstream as generated from the AHAprevent R implementation.

Tolerance for numerical values: `<= 0.000001` percentage point.

This layer is independent of the HeartCheck Wise implementation code, but it is not equivalent to direct validation against a licensed/official live AHA calculator.

### Layer 3 — Live AHA parity
A separate live parity probe exists. If the external AHA endpoint cannot be verified, its result must remain `UNAVAILABLE`, not `PASS`. Live parity is therefore not required to misrepresent unavailable external evidence.

## HF-only normalization decision

One upstream HF-only reference case contained TC while HDL and statin were missing. HeartCheck Wise intentionally rejects incomplete lipid pairs. Because the HF base equation does not use TC/HDL/statin, the test vector was normalized to `tc=null`, `hdl=null`, `statin=null` while preserving the HF oracle values. This tests the same HF numerical target without weakening HeartCheck Wise input-validation policy.

The normalization was committed as `fff560a8a5bd923a43aead325d4a232df9eae569` and did not alter the PREVENT equation or numerical tolerance.

## Release gate interpretation

At this baseline:

- Independent numerical cross-validation: PASS in CI after HF-only fixture normalization.
- Core validation/regression suite: required for release gating.
- UI/communication tests: separate from numerical equation validation.
- Live AHA endpoint parity: may be UNAVAILABLE; UNAVAILABLE must never be relabeled as PASS.

## Claims explicitly NOT supported by this manifest

This record does not establish:

1. prospective clinical effectiveness;
2. calibration or discrimination specifically in Thai patients;
3. equivalence to every AHA calculator implementation or future PREVENT release;
4. regulatory approval as a diagnostic device;
5. safety of autonomous treatment decisions.

Human UAT should test comprehension, usability, mobile accessibility and communication safety without modifying the frozen equation solely to improve user acceptance.
