# HeartCheck Wise PREVENT v2.3 — Privacy / PDPA Sign-off Packet

Candidate: `9d4122bd0267f7f4fc2848efcf766a2391543329`

Status: **review required — no privacy/governance approval recorded**

## Current data-flow declaration

- Browser-only calculation; no application backend.
- No name, HN, phone number, email or direct identifier field.
- No login, database, analytics or application persistence identified.
- Assessment values are not intentionally transmitted by application code.
- Logo, html2canvas and jsPDF runtime assets are self-hosted in the candidate.
- Dependency versions, license texts and SHA-256 digests are retained in
  `vendor/`.
- A no-referrer policy and restrictive CSP meta policy are present. Hosting-level
  response headers still require review because a meta CSP does not provide every
  protection available from HTTP headers.

## Required privacy/security review

- [ ] Verify network traffic independently for initial load, calculation and PDF export
- [ ] Confirm no URL/query-string or referrer contains assessment values
- [x] Self-host all current runtime assets
- [ ] Review pinned dependency digests, licenses and supply-chain risk
- [ ] Review Content Security Policy, referrer policy and final hosting headers
- [ ] Approve or revise the claim `ข้อมูลของคุณปลอดภัย / ไม่เก็บข้อมูลส่วนบุคคล`
- [ ] Confirm UAT records use study IDs only and exclude direct identifiers
- [ ] Define retention, access and disposal for completed UAT score sheets
- [ ] Confirm incident/contact process before controlled pilot
- [ ] Require new privacy review before analytics, HIS, appointment, login,
  database, telemetry or cloud storage is introduced

## Decision

- [ ] APPROVE for controlled Human UAT with fictional profiles only
- [ ] APPROVE for controlled Human UAT with non-identifiable participant records
- [ ] APPROVE WITH CONDITIONS listed below
- [ ] REJECT / remediation required

Conditions or required changes:

____________________________________________________________________

____________________________________________________________________

Privacy/PDPA reviewer: ____________________  Date: __________

Approval record/signature reference: __________________________________

This form does not authorize public clinical deployment or collection of
identifiable patient data.
