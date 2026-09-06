import type { Metadata } from 'next';
import Link from 'next/link';
import { guides, siteUrl } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Santa Cruz Reunion Planning Guides',
  description: 'Practical guides to Santa Cruz reunion venues, large-group dining and hotel room blocks, with official sources and questions to ask before you book.',
  alternates: { canonical: `${siteUrl}/guides` },
  robots: { index: true, follow: true },
  openGraph: { title: 'Santa Cruz Reunion Planning Guides', description: 'Local venues, group dining and hotel room blocks, with official sources and useful booking questions.', url: `${siteUrl}/guides`, type: 'website', images: [{ url: '/images/santa-cruz-coast.jpg', alt: 'Santa Cruz coast' }] },
};

export default function GuidesPage() {
  return (
    <main className="guide-shell">
      <nav className="guide-nav" aria-label="Main navigation"><Link href="/">Santa Cruz Reunion Kit</Link><Link href="/plan?start=1">Build your plan →</Link></nav>
      <header className="guide-hero">
        <p className="guide-eyebrow">THE LOCAL PLANNING NOTES</p>
        <h1>Start with the right questions.</h1>
        <p>Where everyone will gather. Where they will stay. Where you will share a meal. Work through the big decisions with researched local options and clear next steps.</p>
      </header>
      <div className="guide-grid">
        {guides.map((guide, i) => <article className="guide-card" key={guide.slug}>
          <p className="guide-eyebrow">0{i + 1} / PLANNING GUIDE</p>
          <h2><Link href={`/guides/${guide.slug}`}>{guide.shortTitle}</Link></h2>
          <p>{guide.description}</p>
          <Link className="guide-text-link" href={`/guides/${guide.slug}`}>Read the guide →</Link>
        </article>)}
      </div>
      <section className="guide-cta"><h2>Turn the research into your family’s plan.</h2><p>Choose your dates and headcount to bring together a shortlist, personalized inquiries, a weekend schedule and a guest guide.</p><Link href="/plan?start=1">Preview your reunion plan →</Link></section>
      <footer className="guide-footer"><Link href="/">Back to Santa Cruz Reunion Kit</Link><p>Published by Santa Cruz Reunion Kit. Official sources checked September 6, 2026. Ask providers for current availability and complete quotes.</p></footer>
    </main>
  );
}
