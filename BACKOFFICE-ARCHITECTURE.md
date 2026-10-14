# One backoffice, three independent businesses

The presentation uses one `backoffice.html` application with three business workspaces. Each has independent copy, drafts, published demo snapshots, contacts, leads, meetings and settings. It uses fictional records and session storage. There is no authentication, backend, live AI, email, calendar integration or public-site publishing. The CMS editor demonstrates three core sections per business rather than editing every paragraph or image in the thirteen public pages.

## Production shape for Next.js / Convex / Better Auth

Use one Next.js backoffice and three Better Auth organizations. Each website belongs to one organization. People may belong to more than one business; show only their permitted businesses in the selector. A business can later have several website routes or domains without becoming several organizations. Better Auth provides organizations, members, invitations, active organization selection and configurable permissions. [Organization plugin](https://www.better-auth.com/docs/plugins/organization).

Use the Convex + Better Auth Next.js integration for authenticated UI and server access. Organization is not in the integration's out-of-the-box supported plugin list. Plan to use **Local Install**, add the organization plugin to the auth configuration, and generate the corresponding component schema. Check versions and generated types when implementing; this prototype has not installed or validated those dependencies. [Next.js guide](https://labs.convex.dev/better-auth/framework-guides/next), [supported plugins](https://labs.convex.dev/better-auth/supported-plugins), [Local Install](https://labs.convex.dev/better-auth/features/local-install).

| Application records | Scope / purpose |
| --- | --- |
| Websites / business settings | organizationId; domain/slug maps a public website to its business |
| CMS pages and revisions | organizationId + websiteId; draft copy, approved published revision, editor and timestamps |
| Contacts | organizationId; customer details and relationship notes |
| Leads | organizationId + contactId; source website, stage, submitted brief and next questions |
| Meetings | organizationId + contactId, optional leadId; date/time/timezone, agenda and status |
| Audit history | organizationId; actor, action, record and timestamp |

These are proposed application tables. Better Auth's generated organization, member, invitation and session tables remain in the auth component. The website selector is a convenience, not authorization: every Convex query/mutation must authenticate the person, validate membership and the required permission, then read or write records in that organization. Fetching a record by ID must verify its organization. Contacts and leads linked to a meeting must belong to the same business. Index lists by organizationId. The selected organization supplied by the browser must never be trusted on its own. [Convex authentication in functions](https://docs.convex.dev/auth/functions-auth).

Suggested application permissions: content read/edit/publish; contacts read/write; leads read/write; meetings read/write; business settings manage. Map them to owner, editor and customer-care roles after discovery. UI visibility follows these permissions; server functions enforce them. An editor should not gain contact access just because both features share a dashboard. No member invitations or permissions are changed in this demo.

Public intake resolves the business from a server-controlled website/domain mapping. Validate the form, apply abuse limits and write into that business's lead queue. Keep a build brief in Construction, print specifications in Blueprinting, and support requests in Hardware/Rentals/Hauling. Avoid sharing customer details between businesses by default. Shared storage with organization scoping is logical separation; it is not a separate physical database per company. Use separate deployments if contractual or operational requirements demand that boundary.

## Focused AI opportunities after discovery

1. Draft a lead summary from the submitted brief or print/support specification. A person checks it.
2. Suggest missing questions and an agenda before a meeting.
3. Draft website copy against that business's approved facts. Editors review and publish.

Keep retrieval, conversation history and tools scoped to the organization. A live AI model must not decide access, publish unreviewed claims, send invitations or quote prices from unverified rates. Measure time saved and correction rate before adding more automation. Project management remains outside this backoffice scope.

## Presentation credit

AyosGawa is the primary studio credit; Prince Reyes is the linked personal portfolio. Both websites were read on 2026-10-14. AyosGawa describes Prince's studio for apps, websites and AI features; the portfolio explains workflow-focused AI and engineering. [AyosGawa](https://ayosgawa.com/), [Prince Reyes](https://princereyes.com/). The credit says “Website concept by”; it does not imply a contracted engagement or endorsement by Callueng.
