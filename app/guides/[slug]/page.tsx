import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { guides, guideStructuredData, siteUrl } from '@/lib/guides';
import { vendors } from '@/lib/vendors';
import { researchCheckedLabel } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) return {};
  return { title: { absolute: guide.seoTitle }, description: guide.description, alternates: { canonical: `${siteUrl}/guides/${guide.slug}` }, robots: { index: true, follow: true }, openGraph: { title: guide.title, description: guide.description, url: `${siteUrl}/guides/${guide.slug}`, type: 'article', publishedTime: guide.publishedAt, modifiedTime: guide.checkedAt, images: [{ url: '/images/santa-cruz-coast.jpg', width: 1100, height: 825, alt: 'Pacific waves along the Santa Cruz coast' }] }, twitter: { card: 'summary_large_image', images: ['/images/santa-cruz-coast.jpg'] } };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) notFound();
  const places = guide.vendorIds.map((id) => vendors.find((vendor) => vendor.id === id)).filter((vendor) => vendor !== undefined);
  return (
    <main className="guide-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData(guide)).replace(/</g, '\\u003c') }} />
      <nav className="guide-nav" aria-label="Main navigation"><Link href="/">Santa Cruz Reunion Kit</Link><span className="guide-nav-links"><Link href="/guides">All guides</Link><Link href="/our-reunion">Our reunion</Link><Link href="/#price">Pricing</Link></span><Link href="/plan?start=1">Start my free plan →</Link></nav>
      <header className="guide-hero">
        <Link className="guide-eyebrow" href="/guides">← ALL PLANNING GUIDES</Link>
        <h1>{guide.title}</h1><p>{guide.intro}</p>
        <p className="guide-byline">By Santa Cruz Reunion Kit · Official sources checked {researchCheckedLabel}</p>
      </header>
      <aside className="guide-proof" aria-labelledby="guide-proof-title">
        <p className="guide-eyebrow" id="guide-proof-title">FROM THIS GUIDE TO YOUR OWN PLAN</p>
        <p><strong>{vendors.length} researched local options</strong>, each linked to its official source and checked {researchCheckedLabel}. Answer three short steps and the free planner turns them into a shortlist, editable provider inquiries, a quote workbook, a weekend schedule and a downloadable guest guide.</p>
        <div className="guide-proof-actions"><Link href="/plan?start=1">Start my free plan →</Link><Link href="/#sample">See a complete sample</Link></div>
      </aside>
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
      <section className="guide-cta"><h2>Put these questions to work.</h2><p>Add your dates, estimated headcount, room needs, budget, accessibility needs, and preferred setting. The working preview turns the local research into a shortlist, editable provider inquiries, workbooks, a weekend schedule, and a downloadable guest guide.</p><Link href="/plan?start=1">Start my free plan →</Link><p className="guide-cta-note">Free working preview · No account or card required · Saves in this browser</p></section>
      <aside className="guide-related"><h2>Keep planning</h2>{guides.filter((item) => item.slug !== slug).map((item) => <Link key={item.slug} href={`/guides/${item.slug}`}>{item.shortTitle} →</Link>)}</aside>
      <footer className="guide-footer"><Link href="/">Back to Santa Cruz Reunion Kit</Link><p>Provider replies, written terms and official permit decisions determine what you can book. Save the latest confirmation with your reunion plan. Places are researched from official sources, not personally vetted.</p></footer>
    </main>
  );
}
