# Santa Cruz Reunion Kit

A standard Next.js 16 / React 19 application for Vercel. GitHub is the source of truth.

## Product

- Public offer page with interactive sample and researched $39 initial pricing hypothesis.
- Source-backed local planning guides, canonical URLs, sitemap and robots metadata.

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

## Deployment

Vercel framework: Next.js. Build command: `npm run build`. No environment secrets are needed for this preview. Marketing and guide pages allow indexing; /plan remains noindex and crawlable. Vercel is deployed from the same authored source saved in GitHub. Automatic Git-triggered Vercel deployment is not configured.

## Offer and validation

See `docs/offer-and-pricing.md` for the competitor prices, evidence limits, visual decisions, acquisition plan and conversion measurement sequence. The current price is a planned first paid test, not a validated willingness-to-pay result. Conversion analytics and Search Console still need setup; no conversion improvement is claimed.
