# HeartCheck Wise — Production Release Readiness Checklist

Candidate: **to be assigned after privacy hardening commit**

Release state: **BLOCKED — do not merge or deploy to the public production path**

## 1. Immutable candidate and build evidence

- [ ] Record exact candidate SHA in all UAT/sign-off documents
- [ ] CI passes syntax, legacy safety, deterministic PREVENT, independent
  cross-validation, extended matrix, UI, recommendation and PDF suites
- [ ] Live browser artifact displays the same SHA
- [ ] Dependency versions, license files and SHA-256 digests recorded
- [ ] No unreviewed commit is added after sign-off

## 2. Controlled preview verification

- [ ] Preview is clearly labelled pre-production/UAT
- [ ] Search-engine indexing is disabled for the preview
- [ ] Twelve bench UAT cases pass on the preview artifact
- [ ] Android Chrome, iPhone Safari and desktop Chrome/Edge checked
- [ ] Small/large screens, portrait layout and text zoom checked
- [ ] Keyboard navigation, visible focus, errors and Reset verified
- [ ] PDF save/share checked on iPhone and Android/desktop fallback

## 3. Human UAT

- [ ] 15–20 intended users recruited without collecting unnecessary identifiers
- [ ] All safety-critical scenarios pass 100%
- [ ] Completion, risk meaning, natural-frequency, priority and next-action
  thresholds meet the approved protocol
- [ ] No user interprets low risk as zero risk or permission to ignore abnormal factors
- [ ] Findings classified S0–S3 and disposition recorded
- [ ] Required focused retest completed

## 4. Clinical governance

- [ ] Cardiology reviewer approval recorded
- [ ] Preventive-medicine reviewer approval recorded
- [ ] Emergency and secondary-prevention wording approved
- [ ] Risk bands and LDL/BP overrides approved
- [ ] Recommendation engine and Thai wording approved
- [ ] US-derived PREVENT / Thai-local-validity limitation accepted

## 5. Privacy, PDPA and security

- [ ] Privacy/PDPA reviewer approval recorded
- [x] No direct identifier input fields
- [x] No analytics, login, database or application persistence
- [x] PDF libraries and logo self-hosted in the candidate
- [x] Referrer policy and restrictive CSP meta policy added
- [ ] Browser network trace independently verifies no health-field transmission
- [ ] Hosting security headers reviewed; meta CSP limitations accepted or server
  headers configured on the final hosting platform
- [ ] Public privacy notice, owner/contact and incident route approved
- [ ] UAT record retention/access/disposal approved

## 6. Operational ownership

- [ ] Clinical owner named
- [ ] Product/technical owner named
- [ ] Privacy/security contact named
- [ ] Defect and clinical-incident escalation route tested
- [ ] Model/content review cadence defined
- [ ] Rollback commit and recovery procedure documented and rehearsed
- [ ] Monitoring avoids collection of health values or identifiers unless separately approved

## 7. Final release decision

- [ ] All blocking items above complete
- [ ] Residual risks listed and accepted by authorized governance owner
- [ ] Production path and release SHA recorded
- [ ] Final GO decision signed and dated
- [ ] Deployment performed by an authorized owner
- [ ] Post-deployment smoke test passes against the production SHA

GO/NO-GO decision: ____________________

Authorized by: ____________________  Date/time: ____________________

Production SHA: ____________________

This checklist is deliberately fail-closed: an unchecked approval or
safety-critical item means NO-GO.
