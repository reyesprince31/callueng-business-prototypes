# CMS / CRM presentation checks · 14 October 2026

## UI review

| Before | After | Why |
| --- | --- | --- |
| No visible creator credit | AyosGawa primary studio link and Prince Reyes portfolio link on all thirteen websites and in the backoffice | Gives the prospect a clear path to the person proposing the work |
| Public websites and enquiry builders only | Six backoffice views: overview, content, leads, contacts, meetings and business settings | Shows how the team can work with the enquiries |
| Three independent customer journeys | Business selector changes the CMS, CRM, meetings, settings and website link together | Makes the business context visible throughout the workflow |
| No editable CMS prototype | Draft editor, live typing preview, separate published snapshot and demo publication | Demonstrates review before changing website copy |
| Marketing-site smooth scrolling inherited by dashboard | Immediate dashboard navigation and no dialog entrance animation | Keeps frequent actions stable and responsive |
| Phone table actions could expand document width | Contained table scrolling, positioned table headings, two-row phone navigation | Maintains the narrow layout while keeping every view reachable |

## Verified

- Fourteen HTML pages: unique IDs, one h1, noindex, image alternatives, working local assets/links and declared app routes. 752 references checked.
- Dedicated Node self-check: business scope, unknown organization/type rejection, cross-business contact references, record validation, record limit, safe HTML text, and draft/published separation.
- Existing brief, studio and printing self-checks still pass.
- Chromium: edited a Construction headline, saved a draft, verified old published copy remained, published the draft in the demo, and switched to untouched Blueprinting copy.
- Created a Blueprinting contact and linked lead; filtered the stage; searched by contact name; edited the lead to Meeting. Created a dated meeting with notes. Reload restored the selected business and its records.
- Switched to Hardware and confirmed that the Blueprinting contact did not appear in its directory. Its overview displayed its own enquiries, meetings and website.
- Edited local business location settings and verified recent-change history.
- All six views tested at 320px: document width 305px with a 15px scrollbar, no document overflow. Tables scroll within their own panels. Phone controls use at least 44px targets.
- Native dialog focuses the first input, supports Escape and returns to the previous control. Public demo copy changes do not touch the public page files.
- Existing base light/dark text contrast checks pass. The backoffice uses a deliberate light palette with business accent colors.

## Limits

The CMS covers three core copy sections per business and a text preview; it does not manage images, entire page layouts or every public paragraph. All records are fictional; storage is per browser tab with no authentication, server authorization, shared sync, external sending or live AI. A public demo must not be used for private customer information. Production organizations need the implementation in `BACKOFFICE-ARCHITECTURE.md`.

No Lighthouse run, screen-reader session, physical phone check, or real Next.js/Convex/Better Auth integration was performed. The existing client-care presentation remains separate; the new backoffice has no project management features.
