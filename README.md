# Callueng business presentation prototypes

Fourteen static HTML pages demonstrate three independent customer journeys and a CMS/CRM backoffice. This is a proposal for discussion, not the businesses' official website or a live ordering system.

| Site | Presentation link | Customer action |
| --- | --- | --- |
| Construction | [Open construction demo](https://reyesprince31.github.io/callueng-business-prototypes/) | Explore design concepts and prepare a meeting/build brief |
| Blueprinting | [Open printing demo](https://reyesprince31.github.io/callueng-business-prototypes/blueprinting.html) | Specify supplied drawings and prepare a print request |
| Hardware, Rentals & Hauling | [Open service demo](https://reyesprince31.github.io/callueng-business-prototypes/site-support.html) | Request materials, equipment, hauling, or a combination |
| CMS / CRM backoffice | [Open dashboard demo](https://reyesprince31.github.io/callueng-business-prototypes/backoffice.html) | Switch business-specific request desks, review AI transcripts and handoffs, edit copy, and manage fictional CRM records |

## Run locally

```sh
python -m http.server 8767 --bind 127.0.0.1
```

Open http://127.0.0.1:8767/ . Assets, icons, fonts, and scripts are local; no install or build is needed. GitHub Pages publishes `main` from the repository root; `.nojekyll` keeps this a static site.

## Prototype boundaries

- AI chat uses local rules and concept boards use prepared AI images. Custom preferences are recorded, not newly rendered.
- Drafts use separate browser session keys. Meeting, printing, and service-request downloads are generated locally.
- PDF selection performs only extension/size/header checks. Files are not uploaded or restored after reload; sheet count is entered manually.
- No enquiry delivery, live AI, authentication, verified quote, appointment, inventory, order, payment, or print/haul production is connected.
- Construction client records are fictional. Team role cards are clearly marked proposals. Business identities are separated following the user's instruction.
- Requested print sizes, finishing, delivery, rates, timings, hardware stock, and equipment availability require the responsible provider's confirmation.
- All records are fictional. CMS/CRM edits stay per tab; website demo requests and conversation histories sync across tabs on the same origin using local storage. They do not sync across browsers or devices. Demo publication changes its preview, not the public websites. No actual sign-in, server authorization, invitations or project management are implemented.

## Source and editing

`tools/build-pages.py` and `tools/entity_pages.py` generate the pages using standard Python. Construction UI is in `site.js`; independent business UI is in `entity.js`. Shared CSS tokens are in `site.css`, with studio and business layouts in `studio.css` and `entity.css`.

`SOURCE-REVIEW.md` records public sources and open verification questions. `AUTOMATION-PLAN.md` describes proposed live workflows and independent business queues. `independent-businesses-qa.md` records local checks; browser screenshots/download examples remain in the local presentation package, not this repository.

The backoffice uses `backoffice.html`, `backoffice.css` and `backoffice.js`. `BACKOFFICE-ARCHITECTURE.md` maps the proposed Next.js / Convex / Better Auth organization structure; `backoffice-qa.md` records presentation checks. Its CMS demonstrates three copy sections per business rather than every paragraph or media asset. The static backoffice HTML is maintained directly; rebuilding the public pages retains it.

`demo-inbox.js` connects the presentation: Send to demo inbox creates a business-scoped request, website assistant history appears under AI conversations, and a demo team reply appears back in that visitor's widget. `backoffice-inbox.css` supplies the working-desk layout. There are eight backoffice views. `intake-qa.md` documents tests and a presentation walk-through. Existing downloads remain available; old downloads are not imported as submissions. PDF content is never uploaded or stored, and the drawing preview is explicitly illustrative.

```sh
node tests/brief-self-check.cjs
node tests/studio-self-check.cjs
node tests/printing-self-check.cjs
node tests/backoffice-self-check.cjs
node tests/intake-self-check.cjs
python tests/site-self-check.py
```

The PDF File self-check uses Node 20 or newer. Other checks use standard Node/Python libraries.

## Credits and publication review

Website and product concept by [AyosGawa](https://ayosgawa.com/), with [Prince Reyes’ portfolio](https://princereyes.com/) linked on all websites and in the backoffice. This presentation credit does not imply a contracted engagement or endorsement.

Company logo and project imagery are public company references; confirm usage rights, biographies, contacts, and current service scope with the owner before a commercial launch. AI concepts are labelled and are not built-project evidence. Full prompts are in `assets/concept-prompts.json`. Bundled DM Sans/Manrope fonts retain their OFL licences; Tabler icons retain their MIT licence. This repository does not relicense company imagery or branding. All pages carry `noindex,nofollow` for presentation use.
