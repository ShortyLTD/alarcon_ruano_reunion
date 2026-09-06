import type { Metadata } from 'next';
import Link from 'next/link';
import { guides, siteUrl } from '@/lib/guides';
import { siteName } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Santa Cruz Reunion Planning Guides: Venues, Dining, Hotels' },
  description: 'Practical guides to Santa Cruz reunion venues, large-group dining and hotel room blocks, with official sources and questions to ask before you book.',
  alternates: { canonical: `${siteUrl}/guides` },
  robots: { index: true, follow: true },
  openGraph: { title: 'Santa Cruz Reunion Planning Guides', description: 'Local venues, group dining and hotel room blocks, with official sources and useful booking questions.', url: `${siteUrl}/guides`, type: 'website', images: [{ url: '/images/santa-cruz-coast.jpg', width: 1100, height: 825, alt: 'Pacific waves along the Santa Cruz coast' }] },
  twitter: { card: 'summary_large_image', images: ['/images/santa-cruz-coast.jpg'] },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': `${siteUrl}/guides#webpage`, url: `${siteUrl}/guides`, name: 'Santa Cruz Reunion Planning Guides', isPartOf: { '@id': `${siteUrl}/#website` }, hasPart: guides.map((guide) => ({ '@type': 'Article', headline: guide.title, url: `${siteUrl}/guides/${guide.slug}` })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Planning guides', item: `${siteUrl}/guides` }] },
  ],
};

export default function GuidesPage() {
  return (
    <main className="guide-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <nav className="guide-nav" aria-label="Main navigation"><Link href="/">{siteName}</Link><span className="guide-nav-links"><Link href="/our-reunion">Our reunion</Link><Link href="/#price">Pricing</Link></span><Link href="/plan?start=1">Start my free plan →</Link></nav>
      <header className="guide-hero">
        <p className="guide-eyebrow">THE LOCAL PLANNING NOTES</p>
        <h1>Start with the right questions.</h1>
        <p>Compare Santa Cruz gathering spaces, group dining, and hotel room blocks. Each guide uses official sources, separates published facts from details you still need to confirm, and gives you questions to send before you book.</p>
      </header>
      <div className="guide-grid">
        {guides.map((guide, i) => <article className="guide-card" key={guide.slug}>
          <p className="guide-eyebrow">0{i + 1} / PLANNING GUIDE</p>
          <h2><Link href={`/guides/${guide.slug}`}>{guide.shortTitle}</Link></h2>
          <p>{guide.description}</p>
          <Link className="guide-text-link" href={`/guides/${guide.slug}`}>Read the guide →</Link>
        </article>)}
      </div>
      <section className="guide-cta"><h2>Turn the research into your family’s plan.</h2><p>Answer three short steps to shape the researched options into a shortlist, editable provider inquiries, a weekend schedule, quote and budget workbooks, and a downloadable guest guide.</p><Link href="/plan?start=1">Start my free plan →</Link><p className="guide-cta-note">Free working preview · No account or card required · Saves in this browser</p></section>
      <footer className="guide-footer"><Link href="/">Back to Santa Cruz Reunion Kit</Link><p>Published by Santa Cruz Reunion Kit. Official sources checked September 6, 2026. Ask providers for current availability and complete quotes.</p></footer>
    </main>
  );
}
