# Santa Cruz Reunion Kit

A standard Next.js 16 / React 19 application for Vercel. GitHub is the source of truth.

## Product

- Public free planning product plus a separate $2,500 business-asset acquisition page at /for-sale, with downloadable operator brief and handover playbook.
- Source-backed local planning guides, canonical URLs, sitemap, robots, Open Graph image and structured data (Organization, WebSite, FAQPage, Article, BreadcrumbList, CollectionPage).
- Accessibility: WCAG AA colour contrast on marketing, guide and planner pages; named progress bars; mobile navigation links; sticky intake actions on small screens.

- Three-step family intake, with optional browser dictation.
- Personalized and editable reunion schedule.
- Fourteen local providers with official-source decision evidence, including three nonresort group hotels, checked September 6, 2026. Capacity, access, booking steps, published price units and unknowns are explicit.
- Shortlists and individually tailored email inquiries; organizer sends from their own email client.
- Manually recorded quotes, separate shared-event and guest-lodging budgets, and checklists.
- A matching guest preview, hosted snapshot link and standalone HTML download; explicit publication choices, email RSVP and calendar export for dated confirmed locations.
- Real ZIP packet: printable organizer plan, guest guide, budget and contact CSVs, invitation, unsent email drafts, restorable JSON backup, follow-up drafts, booking checklists, quote-comparison workbook, guest reminder, and day-of run sheet.

## Run

Node 22 or newer recommended.

```sh
npm ci
npm run dev
npm test
npm run build
```

## Current release boundaries

The current consumer tools are free. The $2,500 acquisition offer concerns defined business assets, not a consumer reunion or validated revenue stream. Consumer checkout is not connected. It does not charge customers, send emails automatically, book venues, claim live quotes, or collect RSVPs on a server.

Planning state is saved in the current browser. Download/restore provides portability across devices. There is no account service or cloud sync in this release. The app states this in the saved indicator and About dialog.

Guest guides use an allowlisted public payload compressed into a /reunion#v1 URL fragment. Guests open the same design as the preview and HTML download. Links are snapshots, readable by anyone holding them, not revocable or automatically updated. No public guest database exists; RSVP opens an organizer email draft. Private budgets, practical needs, notes and provider research are excluded. Only explicitly selected schedule moments are published.

Personalization uses deterministic planning rules based on the family brief, not a connected large-language-model API. Browser dictation uses the browser speech service where supported.

## Commercial launch work

1. Connect the owner's payment account and implement paid entitlement verification.
2. A hosted snapshot guest page works now. Add a database/auth service only if the operating offer needs stable live-updating links, shared accounts or server-side RSVP collection.
3. Connect a verified sending domain and email provider only if automatic provider outreach is included.
4. Confirm supplier details directly and distinguish personally used providers from researched listings.

## Source evidence and image

Vendor summaries are in `lib/vendors.ts`; decision evidence and official sources are in `lib/vendor-evidence.ts`. The interactive /blueprint demonstrates a 100-person picnic with a sourced reference subtotal, not an all-in reunion quote. Hotel targets are user-entered spending goals, not researched live rates.

Coastal photo: Sean Kelley, Unsplash qR5wQNyDA1s. Source: https://unsplash.com/photos/qR5wQNyDA1s . Download corroboration: https://santacruzbw.com/explore-santa-cruz/ . Unsplash License. Photographer credit appears in the app.

## Configuration

All settings are optional public build-time variables (set them in the Vercel project, then redeploy):

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for canonicals, Open Graph, sitemap, robots and structured data. Set this when moving to a branded domain. | `https://santacruzreunion.com` |
| `NEXT_PUBLIC_ORIGINAL_SITE_URL` | Original June 2026 family guest guide, hosted separately from the kit. | `https://2026.santacruzreunion.com/` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact for the acquisition offer, support and data questions. Set the buyer's address on transfer. | jason@t3.am |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | Set to `1` after enabling Web Analytics for the Vercel project. Loads Vercel's cookieless Web Analytics script (no npm dependency) and records funnel events: `preview_started`, `plan_built`, `inquiry_opened`, `inquiry_copied`, `sample_viewed`, `sample_downloaded`, `kit_downloaded`, `guest_guide_downloaded`, `guest_link_created`. No names, emails, notes or free text are sent. /your-data discloses analytics only when this is enabled. | off |

## Deployment

Vercel framework: Next.js. Build command: `npm run build`. No environment secrets are needed for this preview. Marketing, /blueprint, /for-sale and guide pages allow indexing; /plan and /reunion are noindex. Vercel is deployed from the same authored source saved in GitHub. The Vercel project `alarcon_ruano_reunion` is connected to this repository and serves https://santacruzreunion.com; legacy hosts redirect through next.config.ts. DNS is hosted by Vercel; GoDaddy is the registrar only. The original June 2026 guest guide is hosted at https://2026.santacruzreunion.com/ in the separate `da-boyz/reunion-2026-guest-site` Vercel project, connected to `ShortyLTD/santacruzreunion-2026`. Its URL is configurable with `NEXT_PUBLIC_ORIGINAL_SITE_URL`. The guest subdomain is independent and must not be added to the kit's legacy-host redirect list.

## Offer and validation

See `docs/offer-and-pricing.md` for the competitor prices, evidence limits, visual decisions, acquisition plan and conversion measurement sequence. The $39 consumer price remains a research hypothesis in historical notes. The public tools are free; $2,500 is the asking price for the acquisition. Neither is a validated willingness-to-pay result. See docs/operator-handover.md for the transfer scope and current features. Conversion analytics and Search Console still need setup; no conversion improvement is claimed.
