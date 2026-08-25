# HeartCheck Wise — One-page PDF Baseline v2.2

Status: APPROVED FOR HUMAN UAT

Frozen branch: `baseline/one-page-pdf-v2.2`
Frozen source commit: `14da4f69f70928234999f54b028151068456100a`
Frozen on: 2026-08-25 (Asia/Bangkok)
Source branch at freeze: `prevent-v2-working-prototype`

## Scope of this baseline

This baseline freezes the one-page A4 PDF report experience used after a PREVENT assessment. The frozen snapshot includes:

- 10-year and 30-year PREVENT risk display.
- Plain-language translation of percentage risk into approximate people per 100.
- Explanation that 30-year risk is usually higher because the time horizon is longer, not because risk suddenly increases today.
- Personalized top-priority section.
- Dynamic single-priority support card to avoid dead space and provide a practical next step.
- 90-day action plan.
- Long-term lifestyle foundation section covering food, physical activity, weight, and sleep.
- Optional doctor-discussion section such as Lp(a) when triggered by the recommendation layer.
- Clinical disclaimer and evidence references.
- Direct PDF generation in-browser and iPhone share/save flow.
- A4 single-page constraint.

## Clinical safeguards

This baseline does **not** change:

- AHA PREVENT equation implementation.
- Numerical validation logic or golden vectors.
- Existing safety/red-flag logic.
- Recommendation-engine clinical decision logic.

The PDF is a presentation layer for already-computed assessment results and recommendation outputs.

## UAT acceptance intent

Human UAT should focus on:

1. Whether users understand what the 10-year and 30-year percentages mean.
2. Whether the people-per-100 explanation improves comprehension.
3. Whether the top-priority action is clear and actionable.
4. Whether the 90-day plan feels realistic and easy to follow.
5. Whether the one-page PDF remains readable on iPhone and when printed on A4.
6. Whether Save/Share to Files works reliably on iPhone.
7. Whether any wording is confusing, alarming, or interpreted as a diagnosis or medication order.

## Change-control rule

Do not modify the frozen branch for routine iteration. Any further changes should be developed on `prevent-v2-working-prototype` (or a new working branch), re-run QA/CI, undergo visual/functional review, and be assigned a new baseline version before replacing this baseline.
