# Independent business sites: verification

Checked 14 October 2026 in the Codex in-app Chromium browser. Final asset revision: `entities-4`. The bundle has eleven construction pages and two independent business sites (thirteen HTML pages in total).

| Before | After | Why |
| --- | --- | --- |
| Printing used the construction wizard | Blueprinting has its own identity, print form, contact profile, and download | Architects/engineers can request prints without construction enquiries |
| Hardware appeared as a construction extension | Independent hardware/rental/hauling site with direct requests | Customers can request one service alone |
| Construction project photo illustrated hardware | A service brief illustrates the separate provider's scope | Avoids implying ownership of the construction portfolio |
| Printing-price questions opened a construction budget brief | Assistant sends printing requests to Blueprinting before general estimate advice | Preserves the correct business context |
| Printing was a construction service choice | Plan preparation/engineering remains; printing is a referral | Distinguishes creating plans from reproducing supplied files |

## Verification

- Thirteen pages checked for width overflow at 320 × 740 and 1440 × 900; no overflow or failed loaded images with actual sources. Geometry records are in `previews/independent-browser-checks.json`.
- Blueprinting's specifications update pages × sets immediately. The tested 1-page, 3-set request displayed 3 sheets; the logic test also checks 12 × 3 = 36. Delivery reveals its city field. Text preferences survive reload; the local file list clears as disclosed.
- A harmless one-page QA PDF was selected through the native file chooser. The local file list and honest preflight limitation appeared. PDF extension/size and valid/invalid header cases are covered in the Node self-check.
- A real `Callueng-Blueprint-Print-Request.txt` download contained the job/revision, scale, sheet/sets total, delivery city, PDF filename, and no-upload disclosure. A copy is in `previews/sample-print-request.txt`.
- A hauling-only request works without construction fields. Empty category selection is rejected. A real independent-business download was verified and copied to `previews/sample-hauling-request.txt`.
- Services links open the independent Blueprinting page. Legacy printing-wizard URLs redirect there. The construction wizard no longer offers printing, and the assistant's printing-price reply provides the independent print-request link.
- Both service sites link their own supplied Facebook profile. Their navigation has no construction-planning CTA or construction chat widget. Cross-site footer links are explicitly identified as other business websites.
- The Blueprinting mobile menu has four 44 px links and closes with Escape. The hardware mobile header and layouts were visually reviewed.
- A theme-selector defect was found and fixed in the shared business script. Browser assertions verify that form/category interactions preserve the theme and that the dedicated button changes it and updates its accessible name. Both colour appearances were inspected. Revised screenshots replace the earlier captures.
- Reviewed browser logs contain no warnings/errors. Temporary responsive overrides were cleared. QA used a separate tab, leaving user tabs and their drafts untouched.
- GitHub Pages deployment completed successfully. All three primary business pages were opened on the live URL. The hosted Engineer print example produced 12 × 3 = 36 sheets, and the hosted hardware selection supports hauling alone. The homepage hero loaded fully; live browser logs had no warnings/errors. Hosted previews are named `github-pages-*.png`. See `DEPLOYMENT.md`.

## Source checks

JavaScript syntax, the existing brief/studio tests, the new printing test, and the Python static check passed. Static checks cover thirteen pages, 721 local link/asset references, IDs, fragments, alternatives, encoding, no-index metadata, and business-page separation. The printing check covers strict enums, integer quantities and bounds, delivery requirements, valid/past/invalid dates, file limits, PDF headers, and export disclosures. Semantic contrast checks pass for the existing light/dark text and control tokens.

## Limits

Local PDF selection does not upload files, inspect drawing content, parse sheet count/dimensions, verify scale, or approve readiness. No shop rates, supported machine sizes, stock, equipment availability, delivery coverage, turnaround, actual quote/order, payment, or booking is connected. Business branding and current operations require owner review. The user confirmed the business separation; legal ownership was not independently reviewed.

Lighthouse, full screen-reader testing, other browser engines, physical devices, and live print/haul operations were not checked. GitHub Pages can host the static presentation; live operational features need an appropriate backend. Prior QA reports preserve earlier revisions.
