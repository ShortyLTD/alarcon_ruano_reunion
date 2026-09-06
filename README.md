# Santa Cruz Reunion Kit

A standard Next.js 16 / React 19 application for Vercel. GitHub is the source of truth.

## Product

- Public offer page with interactive sample and researched $39 initial pricing hypothesis.
- Source-backed local planning guides, canonical URLs, sitemap, robots, Open Graph image and structured data (Organization, WebSite, FAQPage, Article, BreadcrumbList, CollectionPage).
- Accessibility: WCAG AA colour contrast on marketing, guide and planner pages; named progress bars; mobile navigation links; sticky intake actions on small screens.

- Three-step family intake, with optional browser dictation.
- Personalized and editable reunion schedule.
- Eleven local providers researched from official sources, checked September 6, 2026.
- Shortlists and individually tailored email inquiries; organizer sends from their own email client.
- Manually recorded quotes, separate shared-event and guest-lodging budgets, and checklists.
- Guest-guide preview and standalone HTML download with email RSVP.
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

This is a free launch preview of the planned $39 kit. Checkout is not connected. It does not charge customers, send emails automatically, book venues, claim live quotes, or collect RSVPs on a server.

Planning state is saved in the current browser. Download/restore provides portability across devices. There is no account service or cloud sync in this release. The app states this in the saved indicator and About dialog.

Guest guides are downloadable HTML snapshots; RSVP uses an organizer email link. No public guest database exists. Private budgets and organizer-only notes are excluded from guest exports.

Personalization uses deterministic planning rules based on the family brief, not a connected large-language-model API. Browser dictation uses the browser speech service where supported.

## Commercial launch work

1. Connect the owner's payment account and implement paid entitlement verification.
2. Decide whether the downloadable kit remains the product or whether hosted guest pages and shared RSVPs require a database/auth service.
3. Connect a verified sending domain and email provider only if automatic provider outreach is included.
4. Confirm supplier details directly and distinguish personally used providers from researched listings.

## Source evidence and image

Vendor evidence is in `lib/vendors.ts`. Hotel targets are user-entered spending goals, not researched live rates.

Coastal photo: Sean Kelley, Unsplash qR5wQNyDA1s. Source: https://unsplash.com/photos/qR5wQNyDA1s . Download corroboration: https://santacruzbw.com/explore-santa-cruz/ . Unsplash License. Photographer credit appears in the app.

## Configuration

All settings are optional public build-time variables (set them in the Vercel project, then redeploy):

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for canonicals, Open Graph, sitemap, robots and structured data. | `https://santacruzreunion.com` |
| `NEXT_PUBLIC_ORIGINAL_SITE_URL` | Where the original June 2026 guest website lives (linked from /our-reunion). Set to `https://2026.santacruzreunion.com/` once that alias is configured on the Netlify site. | the guest site's Netlify URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact address. When set, the footer shows a Contact link, the pricing card shows an "Email me when the $39 kit launches" link, and /your-data shows a data-question address. When empty these links are not rendered. | empty |
| `NEXT_PUBLIC_VERCEL_ANALYTICS` | Set to `1` after enabling Web Analytics for the Vercel project. Loads Vercel's cookieless Web Analytics script (no npm dependency) and records funnel events: `preview_started`, `plan_built`, `inquiry_opened`, `inquiry_copied`, `sample_viewed`, `sample_downloaded`, `kit_downloaded`, `guest_guide_downloaded`. No names, emails, notes or free text are sent. /your-data discloses analytics only when this is enabled. | off |

## Deployment

Vercel framework: Next.js. Build command: `npm run build`. No environment secrets are needed for this preview. Marketing and guide pages allow indexing; /plan remains noindex and crawlable. The Vercel project `alarcon_ruano_reunion` is connected to this repository: pushes to `main` deploy production at https://santacruzreunion.com (www and the *.vercel.app hosts permanently redirect there via `next.config.ts`).

## Offer and validation

See `docs/offer-and-pricing.md` for the competitor prices, evidence limits, visual decisions, acquisition plan and conversion measurement sequence. The current price is a planned first paid test, not a validated willingness-to-pay result. Conversion analytics and Search Console still need setup; no conversion improvement is claimed.
