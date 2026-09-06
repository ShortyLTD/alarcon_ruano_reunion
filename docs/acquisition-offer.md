# Santa Cruz Reunion Kit: acquisition offer

Updated September 6, 2026. This document records an offer strategy, not a completed transaction or valuation based on earnings.

## The buyer and the decision

The proposed buyer is an owner-operator acquiring the product assets, not a family spending $2,500 on one reunion kit. The strongest initial fit is an existing Santa Cruz event planner or concierge with customers and local relationships. Secondary fits are hospitality operators and destination publishers with relevant distribution and the capacity to maintain a small web product.

The decision to make easy: “Do I have a practical way to put this product in front of the right families, and does acquiring this working foundation beat building it myself?” The buyer must be able to inspect the product before requesting a sales conversation.

The asking price is **$2,500 once for the agreed business assets**. This is the seller's proposed asking price, not a demonstrated market valuation. Consumer tools remain free in the current release. A historical $39 consumer price is a future test hypothesis only; it is not evidence of sales or willingness to pay.

## The actual value proposition

A functioning local planning workflow, editable and sourced local research, original guide content, organizer and guest-delivery assets, and practical ownership documentation. A buyer brings customers, distribution, local relationships, judgment, and ongoing operations.

Avoid “exponentially better than Reunly.” Reunly is a consumer product with different scope. Subscribing to a reunion app and acquiring the rights to an editable destination product are different purchase decisions. Feature counts, beautiful UI, and audit scores do not demonstrate commercial superiority. No earnings, customer acquisition, bookings, traffic, conversion, or time savings are guaranteed or represented.

## Design directions considered

1. **Editorial acquisition prospectus — selected.** Begin with the actual product, local context, asking price, and inspection route. A coastal photograph and tangible inventory note communicate the asset without simulated customer proof. Serif headline, restrained forest ink and warm paper. Desktop split hero with primary action and price above the fold; mobile offer first, then artifact. Strength: buyers know what is for sale and can inspect it. Risk: overloading the page with terms; keep the details beneath tangible product value.
2. **Operator cockpit.** Show a full operational dashboard first, followed by deal economics and transfer steps. Compact sans typography, high information density, live interactive product. Strength: tangible operational depth. Risk: suggests a multi-client SaaS with customers, central data, billing, or lead management that this release does not have.
3. **Founder weekend story.** Lead with the original family reunion and a photograph-led chronology; offer appears after the story. Warm documentary presentation. Strength: personal and local. Risk: buries the acquisition decision and overweights proof of the founder's experience rather than proof of the product.

The selected direction preserves the existing site's editorial identity while clearly distinguishing the operator purchase from the consumer planning journey.

## Selected visual system

- Georgia heading roles: hero 62px desktop / 38px narrow mobile; section 44px desktop / 31px narrow mobile; artifact 28px; body Arial 13–16px.
- Forest #183f36, warm paper #f8f6ef, body #52655c, sage #edf0e7. Cream on forest for the inquiry section.
- Existing max-width content grid and mobile gutters; 47–76px section spacing. Split hero collapses to value, price, CTA, then imagery.
- Borders define document-like groups. Corners 4–6px. One modest shadow on the asset note and original website artifact.
- Product facts, side-by-side transfer scope, numbered handover steps, and native FAQ disclosure elements. No counters, animated income figures, fake scarcity, fabricated reviews, or implied paid customers.
- Mobile links and buttons must remain usable at 320px, and the main offer must not require horizontal scrolling. Parent release review owns actual browser verification.

## Public route and conversion path

`/for-sale` is the indexable acquisition route. It has distinct title, description, canonical and social image metadata. Main journey:

1. Understand the $2,500 asset offer and ideal owner.
2. Open the working planner and inspect the local research.
3. See the founder case with explicit historical context.
4. Recognize a plausible operating model grounded in the buyer's existing advantage.
5. Read proposed included and excluded assets and responsibilities.
6. Download the four-page PDF operator brief or open an editable acquisition email to Jason. An editable Markdown brief and detailed runbook are included in the source.

Contact reads `contactEmail` from `lib/site.ts`. Seller address was verified by the parent agent through the connected Gmail profile as `jason@t3.am`. No emails are sent by this page. A mailto opens a draft for the interested buyer to review. If contact is not configured, the acquisition brief remains accessible and no empty email action is rendered.

No purchase checkout, deposit capture, invented calendar availability, or promise to provide indefinite transition support appears on the offer page.

## Proposed scope and terms to resolve before payment

The exact clean source snapshot and seller-owned content must be enumerated. Third-party code and imagery retain their own terms. The current family-site case is proof of founder experience, not automatically transferable personal content. Its continued use must be agreed or removed from the buyer's release.

Before closing, agree the transferred rights, any exclusivity, exact files and assets, acceptance checks, deployment scope, transition assistance, and payment schedule. No transfer of existing private family information, personal accounts, domain ownership, partner contracts, or existing customer revenue is represented. No right to reuse a provider's brand beyond applicable permission is conveyed by including a research link.

See `operator-handover.md` for the clean-transfer process. This is an operational checklist, not an executed legal agreement.

## Remaining commercial evidence to earn

- Whether a qualified owner wants the asset enough to complete a $2,500 acquisition.
- Whether their audience activates the organizer workflow and gets a useful provider reply.
- Whether a paid consumer or assisted planning offer has demand and positive contribution after real delivery costs.
- Whether a sales process closes and a buyer can independently run the documented deployment.

Track qualified inquiries, product inspections, objections, and actual agreements. A CTA click or file download is not a buyer, and no conversion lift is claimed from this redesign.

## Brief production

`public/operator-brief.pdf` is a four-page branded acquisition brief with live inspection and contact links. Its editable summary is `public/operator-brief.md`; the detailed operational runbook is `docs/operator-handover.md`. `scripts/build-operator-brief.py` regenerates the PDF using ReportLab and the repository coastal image. Intermediate renders are outside the repository. All four PDF pages were rendered and visually inspected without clipping or overlapping content.
