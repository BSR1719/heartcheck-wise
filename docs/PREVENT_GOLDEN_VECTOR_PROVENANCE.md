# PREVENT Golden Vector Provenance

Baseline validated engine commit: `fff560a8a5bd923a43aead325d4a232df9eae569`
Test file: `tests/prevent-independent-validation.js`
Test blob SHA: `00890ebf39ec31952b5f6bc0551c1599e4cff500`

## Provenance hierarchy

### Primary oracle
The primary official-package oracle in HeartCheck Wise is the AHAprevent v1.0.0 vignette represented in `tests/prevent-validation.js`.

Reference profile:
- Female, age 45
- TC 200 mg/dL
- HDL-C 60 mg/dL
- SBP 120 mmHg
- Diabetes: yes
- Smoking: no
- BMI 25 kg/m2
- eGFR 95 mL/min/1.73m2
- BP treatment: no
- Statin: no

Expected base-model outputs used by the independent suite:
- CVD 10 y: 3.37940958559732%
- ASCVD 10 y: 2.10197806318443%
- HF 10 y: 1.69813841006346%
- CVD 30 y: 20.649964963609%
- ASCVD 30 y: 11.9961361012451%
- HF 30 y: 12.7944685124708%

### Independent public reproducibility source
Additional vectors were transcribed from the public `kingrc15/pyprevent` test fixtures:
- `tests/fixtures/r_cases.csv`
- `tests/fixtures/r_reference.csv`

The upstream project documents those reference outputs as generated from the AHAprevent R implementation. These vectors are used as a reproducibility cross-check rather than as a replacement for the official-package vignette.

## Golden vector inventory

1. `vignette_base_female_45` — complete base-model profile; six numerical outcomes.
2. `vignette_uacr_male_75_base_model` — age 75; 10-year outputs present, 30-year outputs expected null.
3. `vignette_hba1c_female_39_bmi_missing_base_model` — BMI absent; CVD/ASCVD remain calculable, HF expected null.
4. `vignette_sdi_male_58_hf_only_normalized` — HF-only parity case; lipid triplet normalized to null to comply with HeartCheck Wise incomplete-lipid validation policy.
5. `tables25_female_50` — higher-risk complete profile; six numerical outcomes.
6. `preventr_base_male_66` — age 66 complete profile; 10-year outputs present, 30-year outputs expected null.

Total: 6 profiles x 6 output slots = 36 assertions/checks. Null expectations are part of the golden behavior and are not treated as missing test data.

## Transformation log

Only one intentional transformation is documented for the independent vectors:

`vignette_sdi_male_58_hf_only_normalized`

Upstream-style input had TC populated while HDL and statin were absent. HeartCheck Wise requires complete lipid pairs for lipid-dependent outputs. For HF-only validation, TC/HDL/statin were all set to null because those variables do not participate in the HF base equation. Expected HF values were not changed:
- HF 10 y: 11.0185644608283%
- HF 30 y: 34.917641070667%

Commit recording normalization: `fff560a8a5bd923a43aead325d4a232df9eae569`.

No equation coefficient, risk transformation, expected HF value or tolerance was altered by this normalization.

## Integrity rules for future edits

Any future change to a golden vector must record:
1. vector ID;
2. old and new input/output values;
3. source/provenance;
4. reason for change;
5. whether equation code changed;
6. whether tolerance changed;
7. reviewer/clinical governance disposition.

Golden expected values must never be changed merely to make a failing implementation test pass. A mismatch should first be investigated as an implementation, transcription, model-version or provenance problem.
