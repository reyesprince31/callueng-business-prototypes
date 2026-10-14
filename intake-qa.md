# Customer requests and AI inbox · 14 October 2026

## UI review

| Before | After | Why |
| --- | --- | --- |
| Download builders without an intake handoff | Explicit Send to demo inbox on all three request flows | Lets the presentation show a request arriving in the backoffice |
| Same navigation for every business | Build enquiries / Customer requests / Service requests, plus Consultations / Customer calls / Coordination calls | Uses the business's actual work as the organizing language |
| No chat transcripts in backoffice | Scoped AI conversation lists, full visitor/assistant/team histories, request links and handoff state | Makes the assistant's work reviewable by the team |
| Dashboard built from lead counts alone | Working-desk overview with request queue, human handoffs and meetings | Shows what the team needs to act on |
| Plain flat dashboard | Soft structural surfaces, nested inbox frame, precise document treatment and business colors | Gives the presentation a distinct identity while keeping controls familiar |
| No way to demonstrate a human reply | Demo team reply appears back in the visitor's website chat; preset replies pause during team handling | Demonstrates continuity between assistant and staff |

## Verified

- Fourteen pages, 772 local asset/link references, unique IDs, declared app routes, indexing controls and base contrast checks pass.
- All five Node checks pass: build brief, design studio, print request, CMS/CRM and intake.
- Intake checks cover org scope, unsafe IDs, request/chat links, review choices, bounded message history, team takeover and failed-write preservation.
- Regression check for a build enquiry with a style discussion but no selected exterior/interior: the request records “Not selected yet” and is accepted.
- Chromium: chatted on Blueprinting, submitted a 10-page × 2-set request with revision C, and verified it arrived in another backoffice tab without reload. Filtered Website demo submissions, reviewed it, saved checks/notes/status, and created a CRM lead once.
- The same conversation was linked to that request. Added a team reply in backoffice and verified it appeared in the website widget. A subsequent visitor message arrived in backoffice without another preset reply.
- Submitted a materials-only request through Hardware and verified it entered that workspace. Submitted a Construction brief from its three-step flow and verified it entered Build enquiries.
- Workspace switching updates the route, survives reload, and changes names, review checklist, statuses, records and website link together.
- All eight views checked at 360px: document width 345px plus a 15px scrollbar, no document overflow. Temporary viewport override cleared afterward.

## Presentation walk-through

1. Choose Blueprinting in the backoffice. Show Customer requests, the sample drawing set, review checklist and file metadata.
2. Open Blueprinting's website. Ask its assistant about paper/scale, prepare a request and click Send to demo inbox. Use fictional information.
3. Return to the backoffice. Filter Website demo submissions, open the request and save a review. Create a CRM lead.
4. Open AI conversations. Read the linked conversation, add a team reply, and return to the website widget to show the reply.
5. Switch to Construction and Hardware to show their different request details, navigation and review process.

Requests and transcripts use browser local storage on the same origin; they do not sync across browsers, devices, localhost and GitHub Pages. CMS/CRM edits remain in the current tab's session storage. Older request downloads were never submissions and are not imported automatically. PDF content is not stored/uploaded; the drawing graphic is an illustration. Preset replies are not live AI. Authentication and organizational server permissions still need implementation before real customer use.

No physical-device, screen-reader session or Lighthouse audit was run.
