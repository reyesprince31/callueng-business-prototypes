# Website B extension: verification

Checked on 14 October 2026 in the Codex in-app Chromium browser. This preserves the twelve-page `studio-4` baseline. See `independent-businesses-qa.md` for the subsequent thirteen-page revision with separate business websites. The original ten-page checks remain in `design-qa.md`.

## Before / After / Why

| Before | After | Why |
| --- | --- | --- |
| A short project-details strip | Four visual themes with paired exterior/interior references and preference controls | Gives clients a concrete starting point |
| Ideas remain a general conversation | Separate favourites, colour, practical priorities, notes, and latest six assistant questions carry into briefs | Makes preferences reviewable together |
| A text-only first-meeting record | Downloaded HTML meeting pack with both images embedded | Keeps the direction visible when sharing the file |
| Planning questions only in the wizard | Floating local assistant with style, scope, plan, print, and site-support routes | Helps visitors find the appropriate next step |
| Generic studio page | Expanded About us plus a sourced owner profile and proposed role cards | Shows a replaceable team presentation without invented employees |
| Broad design service | Separate new-plan and existing-drawing printing routes | Clarifies the service being requested |
| No supplied hardware profile in the proposal | Material, rental, and hauling request builder linked to its source | Covers site needs without fabricated inventory or pricing |
| Broad AI ideas | A practical automation roadmap with inputs, outputs, and human review | Defines how the proposal could become operational |

## Browser checks

- All twelve pages passed document-width checks at 1440 × 900 and 320 × 740; loaded images with actual sources reported no failures. Results are saved in `previews/studio-browser-checks.json`. Empty images reserved for unopened dialogs are excluded from the loaded-image check.
- The four prepared styles load both views. Modern tropical exterior and Japandi interior can be saved independently. Mixed favourites, colours, checked priorities, project context, and notes survive reload in the test tab.
- The design assistant displays the saved direction. A meeting prompt recognises mixed favourites. Typed blueprint-printing advice provides the correct service link. Whitespace-only input adds no chat message; Escape closes the native popover.
- Chat is contained within the 320 × 740 viewport; light and dark appearances were visually reviewed. The home studio was also checked at 390 × 844. Mobile navigation exposes eight links with 44 px target heights and closes with Escape.
- The native meeting dialog fits 320 × 740 with internal scrolling. The optional date and discussion focus are editable. Escape closes it.
- A real `Callueng-Meeting-Pack.html` download was produced. Its two embedded WebP images were decoded and matched byte-for-byte to the selected tropical and Japandi files. The file includes Antipolo, 135 m², the selected consultation/date, priorities, and notes, with no scripts. A copy is included as `previews/sample-meeting-pack.html` using illustrative QA inputs.
- Both Services links seed the correct plan-set-only or blueprint-printing selection. Completed results retain the design preferences and omit the construction allowance in both cases. Printing produces a print-specific first question.
- Site support rejects a request with no category. A material-and-hauling request produced a real `Callueng-Site-Support-Request.txt` download containing the selected categories and city with an explicit local-demo disclosure.
- Desktop previews were saved for the revised homepage, About us, Team, Services, and Site support. Separate chat and meeting captures cover small screens. Reduced-motion emulation was used for stable captures and removed afterward; all temporary viewport overrides were cleared.
- Reviewed test-tab browser logs contained no warnings or errors. The original user tab's project inputs were preserved; QA used a separate temporary tab.

## Source and logic checks

`tests/brief-self-check.cjs`, `tests/studio-self-check.cjs`, `tests/site-self-check.py`, and JavaScript syntax validation passed. The studio self-check covers strict saved-state enums (including rejecting array coercion), deduplicated priorities, input limits, intent routing, valid calendar dates, past-date rejection, HTML escaping, embedded-image validation, mixed styles, plan/print allowance exclusions, and support-request boundaries.

The static check covers twelve pages and 716 local asset/link references, unique IDs, image alternatives, internal fragments, UTF-8, no-index metadata, and semantic colour tokens. Text tokens meet 4.5:1 against defined surfaces and form outlines meet 3:1; this is not a full accessibility-conformance audit.

## Limits

No live AI, lead delivery, booking, supplier order, payment, authentication, or real project workflow is connected. Concepts are prepared AI examples; custom colours and ideas are recorded rather than rendered. Latest-six assistant notes persist, while the visible conversation resets on reload. Native popover fallback was source-reviewed but not tested in a browser lacking Popover API support.

Lighthouse, screen-reader speech, Safari, Firefox, physical devices, and production networking were not tested. Company credentials, team content, contacts, image rights, provider relationships, stock, prices, and current availability require owner confirmation. See `SOURCE-REVIEW.md` for the public reference findings and `AUTOMATION-PLAN.md` for the proposed live service.
