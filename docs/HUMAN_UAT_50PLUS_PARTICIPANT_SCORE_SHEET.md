# HeartCheck Wise PREVENT v2.3 — Participant Score Sheet

Use one sheet per participant. Do not record name, HN, phone number or other direct identifier.

UAT candidate SHA: `9d4122bd0267f7f4fc2848efcf766a2391543329`

Before starting: [ ] displayed SHA matches the UAT candidate  [ ] test stopped because SHA does not match

## A. Session information

- Study ID: __________
- Date: __________
- Moderator: __________
- Age band: [ ] 50–59  [ ] 60–69  [ ] >=70
- Device: [ ] Android phone  [ ] iPhone  [ ] Tablet  [ ] Desktop
- Screen size impression: [ ] Small  [ ] Medium  [ ] Large
- Browser: __________
- Uses reading glasses for smartphone: [ ] Yes  [ ] No
- Self-rated smartphone confidence before test: 1  2  3  4  5
- UAT case(s): __________
- Observed application SHA: __________________________________________

## B. Task completion

- Started without help: [ ] Yes [ ] No
- Completed assessment: [ ] Yes [ ] No
- Completion time: ______ min ______ sec
- Moderator interventions: ______
- Had to restart/reset: [ ] No [ ] Yes; count ______
- Encountered validation/error message: [ ] No [ ] Yes
- Could recover from error without explanation: [ ] Yes [ ] No [ ] N/A

## C. Observed usability

Score each 1–5 (1 very difficult/poor; 5 very easy/good).

- Text readability: 1 2 3 4 5
- Font size: 1 2 3 4 5
- Contrast/visual clarity: 1 2 3 4 5
- Tap targets/buttons: 1 2 3 4 5
- Understanding field labels/units: 1 2 3 4 5
- Navigation/flow: 1 2 3 4 5
- Result-page readability: 1 2 3 4 5
- Overall ease of use: 1 2 3 4 5

Observed problem(s):
____________________________________________________________________
____________________________________________________________________

## D. Comprehension — ask before explaining result

### Q1. “ตัวเลขความเสี่ยงที่เห็น หมายความว่าอย่างไรในคำพูดของคุณเอง?”
Participant answer:
____________________________________________________________________

Risk meaning score:
- [ ] 2 = understands estimated future probability/time horizon and not a diagnosis
- [ ] 1 = partial understanding/minor clarification needed
- [ ] 0 = materially incorrect

### Q2. “ตัวเลขนี้บอกว่าคุณเป็นโรคหัวใจแล้วหรือยัง?”
- Participant answer: ____________________________
- Correct understanding (No): [ ] Yes [ ] No

### Q3. “ถ้าผลเป็น 3.4% ใน 10 ปี คุณจะอธิบายให้คนในครอบครัวฟังว่าอย่างไร?”
Participant answer:
____________________________________________________________________

Natural-frequency score:
- [ ] 2 = approximately 3–4 of 100 similar people over 10 years; recognizes estimate
- [ ] 1 = broadly understands frequency but misses timeframe/approximate nature
- [ ] 0 = incorrect interpretation

### Q4. “จากผลนี้ เรื่องไหนที่ควรใส่ใจก่อน?”
Participant answer: _________________________________________________
- Correct first priority: [ ] Yes [ ] No [ ] N/A

### Q5. “หลังจากอ่านผลแล้ว คุณคิดว่าควรทำอะไรต่อ?”
Participant answer:
____________________________________________________________________
- Appropriate next action: [ ] Yes [ ] Partly [ ] No

Priority/action score:
- [ ] 2 = identifies priority and appropriate next action
- [ ] 1 = identifies one but not both
- [ ] 0 = neither

### Q6. “มีข้อความหรือคำไหนที่อ่านแล้วไม่เข้าใจ หรือทำให้กังวลเกินจำเป็นไหม?”
____________________________________________________________________
____________________________________________________________________

### Q7. “ถ้าจะใช้แบบประเมินนี้เองที่บ้าน คุณมั่นใจแค่ไหน?”
Post-test confidence: 1 2 3 4 5
Reason:
____________________________________________________________________

## E. Lower-risk safety comprehension (when applicable)

Ask: “ถ้าผลบอกว่าความเสี่ยงต่ำ หมายความว่าปัจจัยอย่างความดัน เบาหวาน หรือบุหรี่ไม่ต้องสนใจแล้วใช่ไหม?”
- Correct answer (No): [ ] Yes [ ] No [ ] N/A
- Participant explanation: __________________________________________

## F. Emergency/safety gate (when applicable)

- Emergency message appeared before calculator result: [ ] Yes [ ] No [ ] N/A
- Participant understood not to wait for risk score: [ ] Yes [ ] No [ ] N/A
- Participant identified urgent/emergency action: [ ] Yes [ ] No [ ] N/A

Any “No” in an applicable emergency scenario = SAFETY-CRITICAL FAILURE.

## G. Moderator summary

- Risk meaning: ___ /2
- Natural-frequency comprehension: ___ /2
- Priority/action: ___ /2
- Total comprehension: ___ /6
- Correctly understands score is not diagnosis: [ ] Yes [ ] No
- Correctly understands time horizon: [ ] Yes [ ] No
- Correctly identifies first priority: [ ] Yes [ ] No [ ] N/A
- Correct next action: [ ] Yes [ ] Partly [ ] No
- Safety-critical failure: [ ] No [ ] Yes
- Defect severity if applicable: [ ] S0 [ ] S1 [ ] S2 [ ] S3 [ ] None

Moderator recommendation:
- [ ] PASS for this participant
- [ ] PASS with minor usability finding
- [ ] Requires focused retest
- [ ] Safety stop / investigate before further public UAT

## H. Free-text observation

What worked well:
____________________________________________________________________
____________________________________________________________________

What caused hesitation/confusion:
____________________________________________________________________
____________________________________________________________________

Exact participant wording worth preserving:
____________________________________________________________________
____________________________________________________________________

Recommended UI/wording change (do not implement during frozen UAT):
____________________________________________________________________
____________________________________________________________________

## I. Round-level aggregation fields

These fields support later aggregation across 15–20 participants:
- Independent completion: 0/1
- Correct risk-not-diagnosis: 0/1
- Correct natural-frequency interpretation: 0/1
- Correct first priority: 0/1/N/A
- Correct next action: 0/1
- Emergency recognition: 0/1/N/A
- Completion time seconds: ______
- Moderator intervention count: ______
- Confidence 1–5: ______
