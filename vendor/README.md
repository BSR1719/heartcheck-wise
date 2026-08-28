# Vendored browser dependencies

These exact, locally served files support one-page PDF export. They are loaded
only when a user requests a PDF and remove runtime dependence on third-party
CDNs.

| File | Package source | SHA-256 |
|---|---|---|
| `html2canvas-1.4.1.min.js` | npm `html2canvas@1.4.1`, `dist/html2canvas.min.js` | `e87e550794322e574a1fda0c1549a3c70dae5a93d9113417a429016838eab8cb` |
| `jspdf-2.5.2.umd.min.js` | npm `jspdf@2.5.2`, `dist/jspdf.umd.min.js` | `85ba2cc3ff858a20fa49fe6e457bec863ea40b55a9f3725e58a940e62f6f61a4` |

License texts are retained as `LICENSE-html2canvas.txt` and
`LICENSE-jspdf.txt`. Any upgrade requires dependency review, updated digests,
PDF regression testing and privacy/security impact assessment.
