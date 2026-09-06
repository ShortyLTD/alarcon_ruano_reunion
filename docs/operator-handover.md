# Santa Cruz Reunion Kit — operator handover

Prepared September 6, 2026. Proposed acquisition asking price: **$2,500**. Final transfer inventory and terms must be agreed before payment. This runbook does not itself assign rights or confirm a sale.

## 1. Understand the current product

A public, browser-based reunion planning product built with Next.js, React, and TypeScript. Families answer a guided brief, inspect Santa Cruz research, prepare provider inquiries, maintain quotes and a schedule, and produce organizer and guest materials. Working organizer data is stored on the organizer's device, with an exported backup for transfer or recovery.

The reviewed public release is the reference for delivered features. Do not infer capabilities from an older screenshot or a development branch. Guest links represent shareable snapshots; they are not a centrally updated guest database. No automated provider booking, automatic quote retrieval, bulk email sending, central customer account system, automatic RSVP collection, or consumer payment entitlement system is represented.

The live public preview is free. The proposed $2,500 purchase concerns the product assets, not a reunion ticket or a consumer kit.

## 2. Define the transfer inventory

Prepare an inventory with: asset, path or identifier, owner, transfer basis, third-party terms, included/excluded, verification result, and recipient. Proposed included items:

| Item | Location | Acceptance evidence |
| --- | --- | --- |
| Application source | Clean snapshot of app/, components/, lib/, public/ and root configuration | Buyer installs, builds, and deploys the same accepted release |
| Research records | lib/vendors.ts and supporting original research notes | Records have official source links and check dates; buyer can edit one |
| Original local guides | lib/guides.ts and app/guides | Guide text and source links render on the buyer's deployment |
| Planner and export logic | lib/planner.ts, lib/exports.ts and related modules in accepted release | A new fictional plan produces correct inquiry, budget and guest outputs |
| Operating documentation | README.md and agreed docs/ files | A new operator can perform the launch checks without seller account access |
| Brand treatment and seller-owned copy | Enumerate final files in the inventory | Buyer rights and any name use are explicitly established |
| Third-party dependencies and image references | package-lock.json and asset attribution manifest | Applicable licenses and attribution requirements are recorded |

Explicitly exclude unless a separate agreement says otherwise:

- Personal inboxes, account credentials, API secrets, and private user data.
- The original family domain and historical family guest website.
- Family guest lists, private correspondence, reservations, personal media, and private reunion records.
- Provider contracts, exclusive discounts, referral agreements, and endorsements that do not exist in the documented inventory.
- Third-party rights or software ownership that the seller cannot convey.
- Traffic, customers, earnings, or future sales not documented and expressly included.

The founder case-study page and its family-site screenshot need an explicit permission decision before the buyer republishes them. Remove or replace them if permission is not part of the agreement.

## 3. Transfer a clean release

1. Record the accepted commit, production URL, acceptance date, and inventory version.
2. Create a clean buyer repository snapshot. Do not blindly transfer historical Git content from a repository that may also have held the personal family website.
3. Exclude `.env*` secrets, `.vercel`, `.next`, `node_modules`, local databases, temporary QA artifacts, private exports, and browser state. Include a placeholder-only `.env.example` if available and relevant.
4. Enumerate the seller-owned files and third-party assets. Resolve permissions or remove assets outside the agreed scope.
5. Have the buyer create or designate their GitHub repository and Vercel project. Transfer only the agreed source. The buyer owns their service accounts.
6. Set the buyer's contact inbox, canonical site URL, chosen analytics setting, and any integrations. Secrets belong in the buyer's environment configuration.
7. Deploy a preview, run acceptance checks, then publish to the buyer's chosen domain.
8. Replace any developer default addresses or references to the seller's account that should not remain. Update the acquisition page after a completed sale rather than continuing to imply availability.
9. Record delivery and acceptance in writing. Any transition work or ongoing maintenance should have a defined scope and price.

## 4. Setup

Use the Node version configured for the accepted Vercel project and the checked-in package lock. Current project commands:

```sh
npm ci
npm run build
npm test
npm run dev
```

This release uses Next.js App Router. `npm run dev` starts the development server on port 3000. Verify the complete application on the buyer's deployment; a successful local build alone does not verify domain, sharing, downloads, or account configuration.

Public configuration:

| Variable | Purpose | Operator action |
| --- | --- | --- |
| NEXT_PUBLIC_SITE_URL | Canonical public origin | Set to the buyer's final HTTPS origin before production build |
| NEXT_PUBLIC_CONTACT_EMAIL | Public support and acquisition inbox | Set to a monitored buyer-owned inbox before launch |
| NEXT_PUBLIC_VERCEL_ANALYTICS | Optional Vercel Web Analytics load flag | Set to 1 only when the operator intends to enable it; align the data page with reality |

Public variables are included in browser code. Never put credentials in `NEXT_PUBLIC_*` variables. New payment or email features need separate server-side credentials and their own review.

## 5. Buyer acceptance checks

Run these checks on the exact source snapshot and deployment being accepted:

- Start a fresh fictional reunion and complete all intake steps on a phone-width screen.
- Change headcount, meal count, rooms, budget, and accessibility needs; inspect how the shortlist and caveats respond. An unconfirmed price must remain unconfirmed.
- Open at least one official provider source. Verify a researched price or capacity against that source and its stated context.
- Create an inquiry. Check dates, counts, needs, sender details, price questions, and provider identity before copying it.
- Record a fictional event quote and hotel-room quote; verify event spending and guest accommodation costs remain correctly distinguished.
- Edit the schedule, build guest materials, and confirm private budget, quote details, and organizer notes are absent from the guest output.
- Open a shared guest snapshot on another browser/device. Verify schedule, contact and calendar actions. Confirm changes to the organizer plan do not falsely appear to update an older snapshot.
- Download the organizer kit and backup. Open representative files, restore the backup, and compare content.
- Verify the public contact action opens a draft to the operator's inbox and never sends automatically.
- Verify page titles, canonical origin, sitemap, footer references, mobile layout, and the data disclosure match the deployment.
- Run the production build and functional tests. Record any remaining known limitations as part of acceptance.

## 6. Operating costs and ongoing work

Acquisition price does not include third-party charges. Check the buyer's actual plan and usage before buying services. This document does not assert that commercial hosting is free.

| Dependency | Current need | Source to check |
| --- | --- | --- |
| Hosting | A Vercel plan suitable for the buyer's intended commercial use and usage | https://vercel.com/pricing |
| Source hosting | GitHub account/repository under buyer control | https://github.com/pricing |
| Domain | Buyer-selected domain and renewal | Buyer's registrar quote; domain not included |
| Support | Monitored inbox and operator response capacity | Buyer's existing email service and staffing |
| Billing, if added | Checkout, receipt, access delivery, refund/support process | Payment provider's current fees and integration requirements |
| Transactional email, if added | Sending service, verified domain and delivery monitoring | Selected provider's current pricing |
| Research maintenance | Periodic official-source checks and provider confirmation | Operator time; no existing provider contracts assumed |

There is no requirement for an LLM API to run the current deterministic organizer workflow. Any future AI service has separate usage, quality, and data-handling considerations.

## 7. First 30 days: a practical operator playbook

### Days 1–3: take control

Deploy under buyer accounts. Set the correct inbox and domain. Complete acceptance checks. Choose one target buyer segment already reachable through the operator's business. Write a one-sentence promise tied to the work the operator will actually deliver.

Output: accepted deployment, asset inventory, monitored contact route, and one specific target customer.

### Days 4–7: verify the local decision points

Recheck the most relevant providers for the initial audience. Prioritize dated price context, group capacity by room/layout, minimums, wheelchair routes, parking, restrooms, weather alternatives, deposit deadlines, and cancellation terms. Record confirmed facts with source/date. Where only a provider can answer, keep a clearly named question.

Draft provider outreach for operator review. Do not imply that a research listing is a partnership or send bulk messages automatically.

Output: a small current shortlist that explains fit, tradeoffs, and unresolved questions.

### Days 8–14: observe five real organizers

Recruit from existing customers or the operator's audience. Observe each person starting without coaching. Ask them to choose a plausible gathering place, prepare one provider inquiry, and share their guest plan. Record time, hesitation, missing information, and whether the output helped the next real decision.

Chosen pilot criteria: each organizer should be able to explain what the product does, identify what remains unconfirmed, and produce one usable next action. These are operator-set criteria, not industry conversion benchmarks.

Output: five task records, actual objections, and a ranked fix list. Do not treat a download as a sale.

### Days 15–21: test one bounded offer

Choose a self-service product or an assisted planning service. Specify the exact deliverable, provider-booking responsibilities, support scope, delivery date, and price. For paid transactions, configure and test payment, receipt, delivery/access, contact and refund handling first.

An assisted offer may use a service payment process the operator already has. Price it using actual delivery effort, costs, customer value and observed demand. The historical $39 retail kit idea is unvalidated; no consumer price is set by this acquisition.

Output: one offer that a customer can understand and the operator can reliably fulfill.

### Days 22–30: measure and repeat

Share the offer with one relevant audience through the operator's existing permitted channels. Keep distribution small enough to support personally. Track qualified visitors or conversations, starts, useful inquiries prepared, guest-guide sharing, real purchases, delivery effort, support needs, and refunds. Review provider replies for missing quote terms and improve the templates.

Output: evidence of demand or a specific reason to revise the offer. Do not increase advertising because the site looks finished.

## 8. Illustrative acquisition arithmetic

These calculations are examples, not revenue forecasts, recommended prices, or profit claims:

- At an assumed $39 consumer price, 65 sales produce $2,535 gross receipts.
- At an assumed $399 assisted-service price, 7 engagements produce $2,793 gross receipts.
- Neither calculation accounts for acquisition expense, processing fees, refunds, delivery labor, hosting, support, or tax. Demand at either price is unvalidated.
- A useful purchase decision uses contribution per delivered customer: `price minus variable acquisition, processing, refunds and delivery costs`. Acquisition payback units are `2,500 / positive contribution per customer`, rounded up. Fixed operating costs remain additional.

Do not use these examples in sales copy as a promise that the buyer will earn back the purchase price.
