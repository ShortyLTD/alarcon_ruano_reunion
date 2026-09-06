# Redesign and SEO review

September 6, 2026. Target: https://santa-cruz-reunion-kit.vercel.app/

## What needed attention

The offer already had an inspectable sample and working planner, but the strongest first-party proof was a short, buried founder paragraph. The original family website was not linked. The marketing layout repeated cards, and page-level social metadata needed complete images and URLs. There was no dedicated data-handling explanation or useful custom 404.

## Changes

- Put the actual Alarcon Ruano reunion guest-site screenshot and origin story near the beginning of the homepage, with a dedicated /our-reunion page.
- Show the published June 5–7, 2026 schedule, 16 lodging suggestions across five areas, local field guide and map. Link directly to the source guest website.
- Attribute approximately 100 relatives to the founder's firsthand account. Do not present it as an independently verified attendee count or a result of using this new kit.
- Retain the visible sample and clear free-preview action. Use the established editorial typography and coastal palette, with a distinct proof composition.
- Add canonical/social metadata for the new public pages, explicit favicon metadata, WebSite structured data, article images and updated sitemap entries.
- Add /your-data describing the current browser-saved planner and user-controlled sharing, plus a useful 404 page.

## Evidence boundary

Original source inspected: https://santacruzreunion.com/ . Its published schedule and guest resources demonstrate what the family website provided. Lodging suggestions are not booked room blocks. This review does not establish exclusive beach access, signed venue contracts, saved hours, successful paid customers or measured conversion improvement.

Google's [Article guidance](https://developers.google.com/search/docs/appearance/structured-data/article) informs the factual article metadata. [Robots meta guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) informs keeping the planner crawlable with noindex while public research pages can be indexed. Search eligibility does not guarantee ranking.

## Ploy audit brief

The user requested a review in their existing Ploy account. The brief below was submitted in the authenticated workspace on September 6, 2026; results and implemented changes are in the section at the end of this document.

Brief as submitted:

> Audit https://santa-cruz-reunion-kit.vercel.app/ and its linked public pages, especially /our-reunion and /guides. This is a Santa Cruz family reunion planning product with a free working preview and a planned $39 one-time kit. Review positioning, above-the-fold clarity, mobile usability, CTA hierarchy, trust, pricing communication, sample visibility, technical SEO, page titles/descriptions, crawlability, canonical URLs, sitemap, internal linking, original experience and search intent. Prioritize the five most consequential changes with affected URLs, observable evidence, specific recommended fixes and how to validate them. Separate observed defects from hypotheses. Do not invent traffic, search volume, conversion lift, research hours, testimonials or booking outcomes. The founder's approximately 100-person reunion inspired the product; the current kit did not organize that past event. We deploy through GitHub and Vercel. Do not publish changes, migrate hosting, send outreach or start paid campaigns.

Relevant Ploy workflows advertised publicly include [Publish Readiness](https://ploy.ai/ploybooks/publish-readiness), conversion copywriting, above-the-fold review and SEO/AEO strategy. Their availability inside the user's account must be checked after sign-in.

## Launch boundaries

The public working preview can be shared. Paid checkout, conversion measurement, verified commercial-domain connection and Search Console setup remain separate release tasks. No paid launch or Ploy score is claimed.

## Verification completed

Production compilation and TypeScript checks passed. Browser review confirmed the actual screenshot, source links and case-study layout on desktop and in 320px/390px iframe viewports. Homepage and case-study documents had no horizontal overflow at the reviewed widths. The case-study planning action opened the three-step planner intake. Generated public pages have one primary heading, image alt text, self-canonical URLs and social images; /plan retains noindex. The temporary responsive-review page is only in the preview deployment and is excluded from production and GitHub.

---

## September 6, 2026 — authenticated Ploy audit and implemented changes

Ploy (workspace "Santa Cruz Reunion Kit", Ploy agent with the marketing-page CRO audit, DataForSEO and copywriting Ploybooks) audited the live site. Its outputs are saved in that workspace as "Santa Cruz Reunion Kit — Live Site Audit" and "Santa Cruz Reunion Kit — Exact Copy Changes". An independent inspection of the source and a local axe/Playwright run were used to verify and extend the findings. Nothing was migrated into Ploy Sites.

### Measured baseline (before changes)

- Lighthouse (Ploy, lab): performance 100 on /, /our-reunion, /guides and /plan; LCP about 0.6–0.7 s. Accessibility 96 / 96 / 95 / 93 with colour-contrast failures on every page, label/accessible-name mismatches on /, /our-reunion and /plan, and an unnamed progress bar on /plan.
- axe (local, desktop and 390 px): 24 contrast failures on /, 9 on /our-reunion, 1 on guide pages, 40–46 on /plan; two `label-content-name-mismatch` failures (brand link `aria-label`, hero paper card); one `aria-progressbar-name` failure.
- Generated HTML: the 404 page inherited the homepage canonical and emitted both `noindex` and `index, follow`; guide titles were 81–94 characters; guide descriptions up to 163 characters; the homepage title used "Outreach", a term with weaker search demand than "planner" (Ploy/DataForSEO: "family reunion planner" ≈ 1,300 US searches/month vs "family reunion planning kit" ≈ 10; directional third-party estimates).
- Mobile: primary navigation links (Our reunion, Local guides, Pricing) were hidden below 760 px with no menu; the intake dialog's Continue action sat below the first viewport at 390×844; trust-bearing text (source links, footnotes) rendered at 9–10 px.
- Discovery: a `site:` search returned no results; Search Console is not connected, so indexing state is unknown. No analytics existed, so no funnel step was measurable.
- Product state: /plan offered "Download kit" from the example plan with no statement of what is free now versus the planned $39 kit.

### Top five findings and what changed

1. **Hero mechanism and output (/)** — Kept the headline; the supporting paragraph now names the input (three short steps) and the outputs (shortlist, editable provider inquiries, quote workbook, schedule, downloadable guest guide). Primary CTA is "Start my free plan" everywhere on marketing pages; secondary CTA "See a complete sample" is a visible button and the hero paper card links to the sample. Proof strip lists options, source date, deliverables and the sample. Impact on plan starts is a hypothesis until analytics run.
2. **Free preview vs planned $39 (/, /plan)** — Pricing section, hero note, FAQ ("What is free now, and what will cost $39?") and the planner (FREE PREVIEW EDITION pill, packet-card note, About dialog) all say the same thing: everything is free in the preview edition; the planned price is $39 once per reunion when checkout opens; checkout is not connected. No promise about retained access was added because that policy is undecided.
3. **Planner action hierarchy and mobile intake (/plan)** — "Start my plan" is the primary action in the top bar, heading and example banner; the example download is secondary and labelled "Download sample". The intake dialog keeps Back/Continue in a sticky footer while fields scroll; buttons are "Continue" and "Build my plan"; progress bars have accessible names; field labels and helper text were clarified. Tabs renamed "Inquiries" and "Budget & bookings".
4. **Search discovery and metadata** — Shorter titles: home "Santa Cruz Family Reunion Planner: Hotels, Venues & Dining"; guides "4 Santa Cruz Family Reunion Venues to Compare…", "Santa Cruz Restaurants for Large Groups: 4 Places to Ask", "Santa Cruz Hotel Room Blocks for Reunions: 3 Places to Ask"; descriptions ≤ 156 characters. Canonical and robots moved from the root layout to each page; 404 is `noindex` with no canonical. Sitemap has lastmod/changefreq/priority for every URL. Structured data: Organization + WebSite (site-wide), WebPage + FAQPage (home), Article + BreadcrumbList + publisher (guides, /our-reunion), CollectionPage + BreadcrumbList (/guides). Open Graph image dimensions corrected (1100×825). Guide articles carry a compact proof module and richer navigation; /our-reunion links to each guide. Site URL, contact address and analytics are environment-driven so a branded domain is a one-variable change.
5. **Accessibility** — 34 muted text colours darkened to ≥ 4.5:1 on their backgrounds; `aria-label` mismatches removed; three progress bars named; trust-bearing text raised to ≥ 12 px; mobile navigation links restored as a second row.

Also: cookieless Vercel Web Analytics with funnel events (off until `NEXT_PUBLIC_VERCEL_ANALYTICS=1`, no npm dependency), and honest copy tightening across /our-reunion ("What this example can—and cannot—show"), /guides and the sample section.

### Ploy recommendations not adopted, and why

- "Answer three short questions" — the intake is three steps with several fields each; the site says "three short steps".
- "Quote tracker" — the product's own term is "quote workbook"; kept the product term.
- Homepage title "Santa Cruz Family Reunion Planner | Research, Inquiries & Guest Guide" (68 characters) — too long; used a 57-character title with the same lead phrase.
- "Case study" framing for /our-reunion — Ploy's own audit notes it is not a customer case study; the title now says "The Santa Cruz Family Reunion That Inspired the Kit".
- Publishing a free-vs-paid feature comparison — premature while the policy is undecided.
- Unused-JavaScript reduction (85–95 KiB) and hero-image optimisation (≈128 KiB) — performance already scores 100; deferred so the change set stays text-only for this deployment path.

### Verification after changes

- `npm run typecheck`, `npm run build` and the 16 existing tests pass.
- axe (wcag2a/aa/21aa + best-practice) reports zero violations on /, /our-reunion, /guides, a guide article, /plan, /plan?start=1 and /your-data at 1366 px and 390 px; no horizontal overflow at either width.
- Playwright flow on desktop and mobile: home CTA opens the intake with Continue inside the viewport; three steps build a plan; the inquiry draft is personalized; the kit ZIP, guest guide and sample ZIP download; the plan persists after reload; no console or page errors.
- Generated metadata checked for every route (titles, descriptions, canonicals, robots, Open Graph, structured-data types, sitemap, robots.txt).

### Remaining blockers (need the owner)

1. Deployment: this session's GitHub credential did not cover the repository, so the changes were committed through the GitHub web UI onto the `audit-fixes` branch and opened as a pull request. The Vercel project `santa-cruz-reunion-kit` is not connected to GitHub: merge the pull request, then connect the repository in the Vercel project settings (production branch `main`) or run `vercel --prod` from the merged checkout.
2. Enable Web Analytics in the Vercel project and set `NEXT_PUBLIC_VERCEL_ANALYTICS=1`; set `NEXT_PUBLIC_CONTACT_EMAIL` to show contact and launch-notification links.
3. Verify the property in Google Search Console and Bing Webmaster Tools, submit /sitemap.xml, request indexing for /, /guides and the three articles.
4. Move to a branded domain (Vercel Pro offers a free first-year domain) and set `NEXT_PUBLIC_SITE_URL`; add a truthful link from santacruzreunion.com to /our-reunion.
5. Decide the free-preview transition policy before checkout launches; then add one sentence to the pricing card.

### Release follow-through after merge

The Ploy audit implementation was merged into `main` as `435c664`. The release build uses those changes, preserving the researched-provider and free-preview boundaries. A generated-HTML check caught a remaining homepage Open Graph issue: its page-level `url` override replaced the layout image metadata. The homepage now supplies complete social metadata explicitly. The hero's awkward "Answer three short steps" wording was also corrected.

This release passed the production build, TypeScript checks and all 16 functional/export tests. Browser review covered the desktop homepage, mobile homepage and reunion story at 320px/390px, completion of the three-step mobile interview, persisted reunion state, personalized inquiry content, and kit-generation success feedback. Browser download-event capture timed out, so an observed completed file transfer is not claimed from this verification session; the existing tests validate generated ZIP contents and private guest exports. A temporary responsive-review page remains confined to the preview deployment.

The original Chrome account connection was not available to this session; the authenticated Ploy audit and recommendations already committed in `docs/ploy-audit-2026-09-06.md` supplied the audit evidence. No new Ploy audit or measured conversion gain is claimed.
