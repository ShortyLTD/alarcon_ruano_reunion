import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Waves } from 'lucide-react';
import { siteUrl } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Our Real Santa Cruz Family Reunion | June 2026',
  description: 'See the Alarcon Ruano family reunion that inspired the kit: a June 2026 weekend, an original guest website, a local guide, and lodging suggestions.',
  alternates: { canonical: '/our-reunion' },
  openGraph: {
    type: 'article',
    url: '/our-reunion',
    title: 'The family reunion that started Santa Cruz Reunion Kit',
    description: 'Our own family weekend inspired a better starting point for the next organizer. See the original guest website and weekend plan.',
    images: [{ url: '/images/our-family-reunion.webp', width: 1348, height: 926, alt: 'Original Alarcon Ruano Family Reunion guest website, June 2026' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The reunion that started it',
    description: 'An actual Santa Cruz family weekend. The guest website and planning experience behind our reunion kit.',
    images: ['/images/our-family-reunion.webp'],
  },
};

const originalSite = 'https://santacruzreunion.com/';
const resources = [
  {
    number: '01', title: 'A weekend everyone could follow',
    description: 'The main gatherings, their locations, and time for people to explore on their own. The original page also includes calendar controls.',
    anchor: 'schedule-section', link: 'See the original schedule',
  },
  {
    number: '02', title: 'Places to make a home base',
    description: 'Sixteen lodging suggestions organized into five areas, from the beach and downtown to the redwoods and Aptos. Suggestions for guests to explore, rather than a list of confirmed room blocks.',
    anchor: 'lodging-section', link: 'Explore the lodging guide',
  },
  {
    number: '03', title: 'Room for everyone’s kind of weekend',
    description: 'A local field guide covers food, nature, music, art, wellness, and shopping, with searchable restaurant suggestions. Families could choose what interested them between gatherings.',
    anchor: 'field-guide-section', link: 'Browse the family field guide',
  },
  {
    number: '04', title: 'A way to find it all',
    description: 'A map collects local places with category filters and directions, helping guests connect the guide to the places around them.',
    anchor: 'map-section', link: 'Open the original map',
  },
];

export default function OurReunion() {
  return <div className="marketing reunion-case">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: 'The family reunion that started Santa Cruz Reunion Kit', description: 'The original guest website and June 2026 family weekend that inspired the planning kit.', mainEntityOfPage: `${siteUrl}/our-reunion`, image: [`${siteUrl}/images/our-family-reunion.webp`], dateModified: '2026-09-06', author: { '@type': 'Organization', name: 'Santa Cruz Reunion Kit', url: siteUrl }, citation: originalSite }).replace(/</g, '\\u003c') }}/>
    <a className="mk-skip" href="#main">Skip to content</a>
    <header className="mk-nav">
      <Link href="/" className="brand" aria-label="Santa Cruz Reunion Kit home"><span className="brand-icon"><Waves size={24}/></span><span>Santa Cruz<span className="brand-sub">REUNION KIT</span></span></Link>
      <nav aria-label="Main navigation"><Link href="/#included">The kit</Link><Link href="/our-reunion" aria-current="page">Our reunion</Link><Link href="/guides">Local guides</Link><Link href="/plan" className="mk-nav-plan">Open planner <ArrowRight size={15}/></Link></nav>
    </header>
    <main id="main">
      <section className="rc-intro mk-wrap">
        <p className="mk-label">THE ALARCON RUANO FAMILY REUNION · JUNE 2026</p>
        <h1>Our family came together.<br/><em>This is where the kit began.</em></h1>
        <p className="rc-lede">In June 2026, our founder helped organize a Santa Cruz reunion for around 100 relatives. The planning work behind that weekend inspired a better starting point for the next family organizer.</p>
        <div className="rc-intro-links"><a href={originalSite} target="_blank" rel="noreferrer" className="mk-text-link">Visit our original guest website <ArrowUpRight size={17}/></a><Link href="/plan?start=1" className="mk-text-link">Start your own plan <ArrowRight size={17}/></Link></div>
      </section>
      <figure className="rc-main-artifact mk-wrap">
        <a href={originalSite} target="_blank" rel="noreferrer" aria-label="Open the original Alarcon Ruano reunion guest website"><img src="/images/our-family-reunion.webp" alt="The original Alarcon Ruano Family Reunion website, with its June 2026 invitation and Santa Cruz by the Sea title" width="1348" height="926" fetchPriority="high"/></a>
        <figcaption><span>A screenshot of the actual guest website.</span><a href={originalSite} target="_blank" rel="noreferrer">Explore the original <ArrowUpRight size={14}/></a></figcaption>
      </figure>
      <section className="rc-weekend mk-wrap" aria-labelledby="weekend-title">
        <div className="rc-section-intro"><p className="mk-label">THE WEEKEND WE PLANNED</p><h2 id="weekend-title">A little structure.<br/>Plenty of time together.</h2><p>The original guest schedule put the main gatherings in one place, with room for people to enjoy Santa Cruz in between.</p><a href={`${originalSite}#schedule-section`} target="_blank" rel="noreferrer" className="mk-text-link">Read the original schedule <ArrowUpRight size={15}/></a></div>
        <ol className="rc-timeline">
          <li><div className="rc-day"><span>FRIDAY</span><time dateTime="2026-06-05">June 5</time></div><div><h3>Arrive and reconnect</h3><p>An open arrival day to settle in and explore, with the local guide available for ideas.</p></div></li>
          <li><div className="rc-day"><span>SATURDAY</span><time dateTime="2026-06-06">June 6</time></div><div><h3>Beach time and tacos</h3><p>A family gathering at Cowell Beach, by the wharf, with a taco lunch on the schedule.</p></div></li>
          <li><div className="rc-day"><span>SUNDAY</span><time dateTime="2026-06-07">June 7</time></div><div><h3>Redwoods and a farewell</h3><p>A morning outing at Henry Cowell Redwoods, followed by a family farewell gathering.</p></div></li>
        </ol>
      </section>
      <section className="rc-resources" aria-labelledby="resources-title">
        <div className="mk-wrap rc-resources-grid">
          <div className="rc-section-intro"><p className="mk-label">THE WORK YOU CAN SEE</p><h2 id="resources-title">One place for<br/>the guest details.</h2><p>The original website is still available. Open the actual resources that accompanied our family weekend.</p></div>
          <div className="rc-resource-list">{resources.map(resource => <article key={resource.number}><span className="rc-resource-number">{resource.number}</span><div><h3>{resource.title}</h3><p>{resource.description}</p><a href={`${originalSite}#${resource.anchor}`} target="_blank" rel="noreferrer" className="mk-text-link">{resource.link} <ArrowUpRight size={15}/></a></div></article>)}</div>
        </div>
      </section>
      <section className="rc-next mk-wrap" aria-labelledby="next-title">
        <div className="rc-section-intro"><p className="mk-label">FROM OUR WEEKEND TO YOURS</p><h2 id="next-title">Keep the head start.<br/>Make the reunion yours.</h2><p>We turned the experience into a kit for researching places, preparing inquiries, comparing replies, and putting a guest plan together. Your dates, budget, and family shape what comes next.</p><Link href="/plan?start=1" className="mk-button">Build my reunion preview <ArrowRight size={17}/></Link><p className="mk-micro">Free working preview · No account or card required</p></div>
        <aside className="rc-context" aria-label="About this real reunion example"><h3>What this example shows</h3><p>The guest website documents our family’s June 2026 plans. The approximate attendance comes from the founder’s firsthand account.</p><p>The commercial planning kit was developed afterward. Its current preview provides a downloadable guest guide; a hosted guest website like this historical example is not included.</p><p>Provider availability, current prices, reservations, and permits need to be confirmed for your own reunion.</p><Link href="/#sample" className="mk-text-link">Look inside today’s kit <ArrowRight size={15}/></Link></aside>
      </section>
    </main>
    <footer className="mk-footer mk-wrap"><div><Link href="/" className="brand">Santa Cruz<span className="brand-sub">REUNION KIT</span></Link><p>Made for getting together.</p></div><nav aria-label="Footer navigation"><Link href="/our-reunion" aria-current="page">Our reunion</Link><Link href="/guides">Planning guides</Link><Link href="/plan">Your planner</Link><Link href="/#price">Pricing</Link><Link href="/your-data">Your data</Link></nav><small>Historical example: June 2026. Original guest website reviewed September 6, 2026.</small></footer>
  </div>;
}
