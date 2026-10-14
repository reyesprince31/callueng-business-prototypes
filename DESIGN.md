# Final Website B: design and journey

## Design read

A premium design-and-build website for people who need confidence about scope, cost assumptions, project decisions, and the path from idea to handover. The primary action is creating a useful first-meeting brief. The emotional tone is calm, architectural, and approachable.

The original logo, blue/yellow brand relationship, and published portfolio are preserved. A dusk interpretation gives the homepage a distinct atmosphere; warm interior light connects the construction offer with the everyday life a home supports. The hero is clearly disclosed as an AI concept.

## Visual decisions

- **Colour:** deep blue chrome, warm yellow actions, pale mineral surfaces; a complete dark theme uses the same semantic hierarchy.
- **Type:** Manrope for the architectural headline rhythm, DM Sans for long-form reading and forms. Local font files remove a third-party runtime dependency.
- **Composition:** two-line desktop hero, asymmetric selected-work layout, image-and-accordion service stage, four-stage process, and a separate editorial resource treatment. The page changes structure as the subject changes.
- **Brand evidence:** company-published project images with original-image views and source links. No invented awards, testimonials, completion statistics, prices, or team credentials.
- **Navigation:** eleven construction pages share planning and assistant actions. Blueprinting and Hardware/Rentals/Hauling have independent business navigation, contacts, and requests, bringing the bundle to thirteen pages.

Marketing pages use expressive composition with moderate motion and low content density. Forms, checklists, and the client workspace use familiar, predictable controls with more explicit labels. These interaction-heavy areas deliberately prioritize task completion over visual novelty.

## Customer concerns and responses

| Concern | Website response | Useful next step |
| --- | --- | --- |
| “Will the budget cover my ideas?” | Scope-first explanation, visible assumptions, careful separation of example arithmetic and reviewed pricing | Capture a Build Brief |
| “Where does the scope begin and end?” | Service deliverables, inclusions, exclusions, and open decisions | Read the scope guide |
| “What could hold the schedule back?” | Four-stage process and dependency discussion | Review planning questions |
| “How will I know what is happening?” | Working sample workspace connecting updates, selections, records, and conversation | Explore client care |
| “What should I prepare?” | Six topic-specific guides with checklists | Bring information to the first meeting |
| “How do I explain what I like?” | Four paired concept boards, separate exterior/interior favourites, colour and everyday priorities | Download a visual meeting pack |
| “Do I need plans or just prints?” | Separate plan preparation and blueprint printing references and intake choices | Prepare the appropriate brief |
| “How do I organise site support?” | Material, rental, and hauling request categories with a downloadable record | Confirm scope and provider availability |

The conversion journey is: understand the offer → see published work → clarify concerns → prepare a brief → contact the company through its official channel. The local prototype keeps this whole journey reviewable without collecting enquiries or requiring sign-in.

## Signature interaction: a shared design direction

The homepage studio begins with four architectural moods, each showing a matching exterior and living/dining concept. Visitors can combine an exterior from one style with an interior from another, then add colours, practical ideas, and notes. A floating assistant suggests a direction and routes service questions. The latest six questions become meeting notes.

The visual meeting pack embeds both selected images and captures context, preferences, discussion focus, an optional requested date, and open questions in a self-contained HTML file. Choices also flow into the existing Build Brief. This creates something both client and company can review before a confirmed appointment.

Prepared AI examples show the concept immediately. Preference controls record requests without implying that the shown image has been regenerated. The local chat uses explicit preset responses. A live workflow would need generation APIs, safe storage, lead delivery, and review gates; `AUTOMATION-PLAN.md` describes that scope.

## Build Brief

The planning flow collects the place, direction, and priorities. It retains a tab-session draft, validates inputs, creates tailored questions, and exports a plain-text dossier. It responds immediately, shows what was produced, and lets the visitor edit the result. No simulated waiting screen or fake AI processing is used.

The optional allowance is hidden behind an explicit disclosure and uses fixed demonstration rates. A professional estimate would require reviewed drawings, measured quantities, site assessment, specifications, rates, and exclusions.

## Motion and accessibility

The motion vocabulary is limited to a restrained hero entrance, short section reveals, fine-pointer image hovers, immediate button press feedback, and a 220 ms native-dialog entrance. Transform and opacity handle decorative motion. Keyboard actions disable decorative transitions; reduced-motion preference removes them. There is no scroll hijacking, custom cursor, autoplay background video, or scroll-event rendering loop.

The translucent navigation has a solid alternative for reduced transparency. Controls use visible focus states, real labels, native validation, semantic disclosures, native dialogs with Escape behavior, and keyboard-operated tabs. Small-screen navigation and workspace tabs use layouts that expose their choices without page overflow.

Light and dark modes use semantic surface, text, border, and accent tokens. The photographic hero and deep blue brand navigation keep their intentional dark presentation in both modes.

## Scope choice

Blueprinting and Hardware/Rentals/Hauling are independent customer journeys, following the user's clarification. Customers can print supplied drawings or request one material, rental, or hauling service without providing a construction-project brief. Each has its own identity, contact route, request draft, and download. The bundle shares presentation infrastructure; a live service would need separate business queues and permissions.

The hardware site uses a request brief because no current catalogue, stock, prices, or fulfilment model was established. Blueprinting collects drawing revision, output size/scale, pages/sets, finishing, and pickup/delivery requests; its sheet total is deterministic arithmetic. A local PDF header check does not replace PDF preflight or professional review. The earlier team-app remains a separate proposal.

This is native HTML, CSS, and JavaScript. Additional application frameworks would not improve this downloadable presentation prototype; a live data service can be chosen after the scope, permissions, and operational workflow are agreed.
