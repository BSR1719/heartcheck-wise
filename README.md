# HeartCheck Wise V7.5 — Production QA Edition

Mobile-first, client-side health-literacy decision aid for understanding coronary heart disease screening tests.

## Included
- symptom safety hard-stop
- known ASCVD screening exclusion
- risk-factor + optional lab inputs
- plain-language SBP, LDL-C, HbA1c, eGFR, and Lp(a) interpretation
- selective CAC discussion logic
- Echo / EST / CCTA / CAG appropriateness messaging
- hospital package checker
- Save Result and browser Print / Save PDF
- clinical logic separated from UI
- regression tests for safety-critical rules

## Structure
```text
heartcheck-wise/
├── index.html
├── css/style.css
├── js/app.js
├── js/clinical-rules.js
├── js/package-checker.js
├── docs/clinical-references.md
├── tests/qa-tests.js
├── CHANGELOG.md
├── README.md
├── VERSION
└── .nojekyll
```

## GitHub Pages deployment
This repository deploys with GitHub Actions. In **Settings → Pages**, select **GitHub Actions** as the source. The workflow in `.github/workflows/deploy-pages.yml` publishes after pushes to `main`.

## Clinical governance
All clinical logic is in `js/clinical-rules.js` and should remain under version-controlled clinical review.

V7.5 removes the earlier non-validated weighted pseudo-risk score and replaces it with transparent action rules. It also adds known-ASCVD exclusion, dual-unit Lp(a), input validation, stronger emergency/package overrides, and safety regression tests.

Run the regression tests locally with:

```bash
node tests/qa-tests.js
```

## Privacy
The app is client-side only and does not transmit entered health data to a server. If analytics, login, database, or cloud storage is later added, complete a privacy/security review first.

## Brand
This edition uses the public-facing name **Bangkok Hospital Surat** and a restrained hospital blue / navy / white visual system. It intentionally does not recreate or embed an unofficial hospital logo. Use only approved brand assets if an official logo is added.

## Disclaimer
For health literacy and shared decision-making only. Not a diagnostic tool and not a replacement for emergency or professional medical care.
