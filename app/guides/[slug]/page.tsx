import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides, guideStructuredData, siteUrl } from '@/lib/guides';
import { vendors } from '@/lib/vendors';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.description, alternates: { canonical: `${siteUrl}/guides/${guide.slug}` }, robots: { index: true, follow: true }, openGraph: { title: guide.title, description: guide.description, url: `${siteUrl}/guides/${guide.slug}`, type: 'article' } };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const places = guide.vendorIds.map((id) => vendors.find((vendor) => vendor.id === id)).filter((vendor) => vendor !== undefined);
  return (
    <main className="guide-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData(guide)).replace(/</g, '\\u003c') }} />
      <nav className="guide-nav" aria-label="Main navigation"><Link href="/">Santa Cruz Reunion Kit</Link><Link href="/plan?start=1">Build your plan →</Link></nav>
      <header className="guide-hero">
        <Link className="guide-eyebrow" href="/guides">← ALL PLANNING GUIDES</Link>
        <h1>{guide.title}</h1><p>{guide.intro}</p>
        <p className="guide-byline">By Santa Cruz Reunion Kit · Official sources checked September 6, 2026</p>
      </header>
      <article className="guide-body">
        {guide.sections.map((section) => <section className="guide-section" key={section.title}><h2>{section.title}</h2><p>{section.text}</p>{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
        <section className="guide-section"><h2>Researched places to start</h2><p>These are research leads from official provider pages. We have not contacted providers about your event, and inclusion does not mean a date or price is available.</p>
          <div className="guide-grid">{places.map((vendor) => <article className="guide-card" key={vendor.id}>
            <p className="guide-eyebrow">{vendor.category === 'hotel' ? 'GROUP LODGING' : vendor.category === 'venue' ? 'GATHERING PLACE' : vendor.id === 'zoccolis' ? 'PICNIC CATERING' : 'GROUP DINING'}</p>
            <h3>{vendor.name}</h3><p>{vendor.description}</p><p className="guide-price-note">{vendor.priceNote}</p>
            <div className="guide-card-links"><a href={vendor.source} target="_blank" rel="noopener noreferrer">Official source ↗</a><a href={vendor.url} target="_blank" rel="noopener noreferrer">Contact / inquiry ↗</a></div>
            <p className="guide-source-date">Source checked {vendor.checkedAt}</p>
          </article>)}</div>
        </section>
        <section className="guide-section"><h2>Questions to send with your inquiry</h2><ol>{guide.questions.map((question) => <li key={question}>{question}</li>)}</ol></section>
        <section className="guide-section"><h2>Your next step</h2><p>{guide.takeaway}</p></section>
      </article>
      <section className="guide-cta"><h2>Put these questions to work.</h2><p>Enter your reunion details and the kit prepares personalized inquiry drafts, a shortlist and a plan you can save and use.</p><Link href="/plan?start=1">Preview your reunion plan →</Link></section>
      <aside className="guide-related"><h2>Keep planning</h2>{guides.filter((item) => item.slug !== slug).map((item) => <Link key={item.slug} href={`/guides/${item.slug}`}>{item.shortTitle} →</Link>)}</aside>
      <footer className="guide-footer"><Link href="/">Back to Santa Cruz Reunion Kit</Link><p>Provider replies, written terms and official permit decisions determine what you can book. Save the latest confirmation with your reunion plan.</p></footer>
    </main>
  );
}
