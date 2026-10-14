# Callueng business presentation prototypes

Thirteen static HTML pages demonstrate three independent customer journeys. This is a proposal for discussion, not the businesses' official website or a live ordering system.

| Site | Presentation link | Customer action |
| --- | --- | --- |
| Construction | [Open construction demo](https://reyesprince31.github.io/callueng-business-prototypes/) | Explore design concepts and prepare a meeting/build brief |
| Blueprinting | [Open printing demo](https://reyesprince31.github.io/callueng-business-prototypes/blueprinting.html) | Specify supplied drawings and prepare a print request |
| Hardware, Rentals & Hauling | [Open service demo](https://reyesprince31.github.io/callueng-business-prototypes/site-support.html) | Request materials, equipment, hauling, or a combination |

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

## Source and editing

`tools/build-pages.py` and `tools/entity_pages.py` generate the pages using standard Python. Construction UI is in `site.js`; independent business UI is in `entity.js`. Shared CSS tokens are in `site.css`, with studio and business layouts in `studio.css` and `entity.css`.

`SOURCE-REVIEW.md` records public sources and open verification questions. `AUTOMATION-PLAN.md` describes proposed live workflows and independent business queues. `independent-businesses-qa.md` records local checks; browser screenshots/download examples remain in the local presentation package, not this repository.

```sh
node tests/brief-self-check.cjs
node tests/studio-self-check.cjs
node tests/printing-self-check.cjs
python tests/site-self-check.py
```

The PDF File self-check uses Node 20 or newer. Other checks use standard Node/Python libraries.

## Credits and publication review

Company logo and project imagery are public company references; confirm usage rights, biographies, contacts, and current service scope with the owner before a commercial launch. AI concepts are labelled and are not built-project evidence. Full prompts are in `assets/concept-prompts.json`. Bundled DM Sans/Manrope fonts retain their OFL licences; Tabler icons retain their MIT licence. This repository does not relicense company imagery or branding. All pages carry `noindex,nofollow` for presentation use.
