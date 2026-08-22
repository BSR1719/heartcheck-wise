# HeartCheck Wise V7 — GitHub Production Edition

Mobile-first, client-side health-literacy decision aid for understanding coronary heart disease screening tests.

## Included
- symptom safety hard-stop
- risk-factor + optional lab inputs
- plain-language SBP, LDL-C, HbA1c, eGFR, Lp(a) interpretation
- selective CAC logic
- Echo / EST / CCTA / CAG appropriateness messaging
- hospital package checker
- Save Result and browser Print / Save PDF
- clinical logic separated from UI

## Structure
```text
heartcheck-wise-v7/
├── index.html
├── css/style.css
├── js/app.js
├── js/clinical-rules.js
├── js/package-checker.js
├── docs/clinical-references.md
├── README.md
├── VERSION
└── .nojekyll
```

## GitHub Pages deployment
1. Create a repository and upload this project preserving folders.
2. Go to **Settings -> Pages**.
3. Choose **Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Save.

## Clinical governance
All clinical logic is in `js/clinical-rules.js`. Production governance should maintain a rule version, clinical review date, approver, changelog, and regression tests for hard-stops and thresholds.

## Privacy
V7 is client-side only and does not transmit entered health data to a server. If analytics, login, database, or cloud storage is later added, complete a privacy/security review first.

## Disclaimer
For health literacy and shared decision-making only. Not a diagnostic tool and not a replacement for emergency or professional medical care.

## Bangkok Hospital Surat Brand Edition

This edition applies a more formal hospital-facing visual system with:
- Thai-first typography using Sarabun
- brand-aligned blue and teal palette
- more formal copy tone for public-facing hospital communication
- explicit use of the public-facing hospital name “Bangkok Hospital Surat”

## V7.3 Final Brand Refinement

Refinement based on the current public-facing Bangkok Hospital / Bangkok Hospital Surat digital style: restrained hospital blue/navy/white palette, calmer typography, full hospital name instead of an invented acronym, Thai-first copy, and reduced startup-app visual effects.

Important: this package intentionally does **not** embed or recreate the official Bangkok Hospital trademark/logo. The hospital's official approved logo asset should be inserted by the authorized IT/brand team if required.

## GitHub Pages deployment (V7.4)

This repository is ready to deploy with GitHub Actions.

### Recommended setup
1. Create a new GitHub repository, for example `heartcheck-wise`.
2. Upload or push the entire contents of this folder to the `main` branch.
3. In GitHub open **Settings → Pages**.
4. Under **Build and deployment → Source**, select **GitHub Actions**.
5. Push to `main` or manually run the **Deploy HeartCheck Wise to GitHub Pages** workflow from the Actions tab.
6. The published URL will appear in the workflow deployment summary and in **Settings → Pages**.

### Important before public launch
- Replace the text-based hospital identity with the approved official Bangkok Hospital Surat logo asset if required by the brand team.
- Confirm the public disclaimer and clinical rules with the designated clinical governance owner.
- Confirm privacy policy requirements before adding analytics, login, database storage, or any server-side health-data collection.
- Keep `js/clinical-rules.js` under version-controlled clinical review.

### Deployment workflow
`.github/workflows/deploy-pages.yml` deploys the static repository directly to GitHub Pages after every push to `main`.
