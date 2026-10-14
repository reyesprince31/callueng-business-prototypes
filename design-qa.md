# Final Website B: verification

Verified on 14 October 2026 in the Codex in-app Chromium browser. This report preserves the initial ten-page Website B baseline. See `studio-qa.md` for the subsequent twelve-page design-studio, assistant, team, blueprint, and site-support revision.

## Result

Ten connected HTML pages, seven selectable portfolio stories, six planning guides, a working local Build Brief, and an interactive sample client workspace. All local assets are bundled. The original prototypes remain separate.

## UI review

| Before | After | Why |
| --- | --- | --- |
| Earlier B offered one marketing page beside separate app demos | Ten pages share navigation, content hierarchy, theme, and planning action | A visitor can follow a complete website journey |
| Broad landing-page offer | Four explicit concerns connect budget, scope, timing, and updates to concrete next steps | Helps clients understand what to resolve |
| General estimator concept | Three-step Build Brief with validated details, tailored questions, saved draft, and download | Produces a useful first-meeting record |
| Portfolio thumbnails | Filtered project library, distinct stories, original-image dialog, source links | Supports review of the company's actual published work |
| Uniform promotional blocks | Architectural hero, asymmetric featured work, service accordion, process sequence, editorial guides | Gives each subject a suitable presentation |
| Wide mobile navigation areas | Menu plus visible process and workspace choices with responsive layouts | Keeps important choices accessible on small screens |
| Sample client-care concept | Working tabs, local approval feedback, document previews, and demo messages | Makes the proposal concrete and reviewable |
| Small utility targets and subtle input outlines | 44 px navigation controls, larger checklist/link targets, stronger input borders | Improves touch use and form identification |

## Browser checks

- All ten pages checked at **1440 × 900** and **320 × 740**. Final 320 px checks passed without document overflow or broken loaded images. Geometry results are in `previews/browser-checks.json`.
- Homepage and client-care workspace also checked at **390 × 844**. Final browser viewport override was reset.
- Both colour themes checked on the homepage and interactive areas. The actual company logo remains intact when switching theme.
- Project filters show the correct residential, community, and renovation records. All seven detail keys load the intended title/image. Original-image viewer opens and closes with Escape.
- All six resource topics load their intended content; checklists work.
- Homepage details carry into the planning form. Blank/whitespace city and out-of-range area are rejected. Back/next, result creation, editing, and focus movement work.
- Draft values, checked priorities, and notes survive a tab reload. Restored drafts do not turn query text into markup.
- A real `Callueng-Build-Brief.txt` download was produced and its text checked. The optional allowance showed 120 m² × PHP 30,000 = PHP 3,600,000 with demonstration labels and exclusions.
- Client-care tabs support arrow keys. Demo approval updates the local decision state. Documents open in a native dialog and Escape closes it. Whitespace-only messages are rejected; a valid demo message appears locally with explicit feedback.
- Mobile navigation opens/closes and responds to Escape. Prototype/privacy disclosure opens in a native dialog.
- Reduced-motion emulation removes hero animation and leaves reveal content visible. Stable full-page screenshots were captured with reduced motion emulated; the emulation was then cleared. Cache-testing override was also cleared.
- Final reviewed browser logs contained no warnings or errors.

## Automated source and logic checks

`tests/brief-self-check.cjs` passed: validation boundaries, all enum fields, duplicate priorities, invalid numeric inputs, sample arithmetic, question branches, and plain-text export.

`tests/site-self-check.py` passed: ten pages, 476 local link/asset references, fragments, image alternatives, unique IDs, UTF-8, prototype indexing controls, and semantic colour contrast. Light/dark text tokens meet 4.5:1 against the defined surfaces; input borders meet 3:1.

JavaScript syntax check passed. The hero is a 334,510-byte locally bundled WebP. Duplicate font files were removed; two local font binaries serve all declared weights.

## Visual evidence

`previews/` contains ten full-page desktop captures, a homepage viewport preview, and a mobile homepage preview. Published portfolio photographs are framed through CSS; their full original images remain available in the viewer. The hero is separately disclosed as an AI concept interpretation.

## Limits

Lighthouse was not run: no Lighthouse runner was available in the connected browser or bundled runtime. No Lighthouse score, Core Web Vitals result, or full WCAG conformance claim is made. Screen-reader speech, Safari, Firefox, physical mobile devices, and production network conditions were not tested.

The site is a local prototype. Enquiry delivery, live AI, secure sign-in, real project data, supplier ordering, payments, and binding approvals are not connected. The optional allowance is fixed illustrative arithmetic. Company copy, project facts, contact information, service scope, and image rights require owner review before publication.
