import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Waves } from 'lucide-react';
import { getVendorEvidence } from '@/lib/vendor-evidence';
import { researchCheckedLabel, siteName, siteUrl } from '@/lib/site';
import Blueprint from './blueprint';
import './blueprint.css';

export const metadata: Metadata = {
  title: { absolute: 'A 100-Person Santa Cruz Reunion Blueprint | Costs, Places & Weekend Plan' },
  description: 'Adapt a Santa Cruz picnic reunion: published park and catering prices, separate gathering and dinner counts, a three-day schedule, and the right booking order.',
  alternates: { canonical: '/blueprint' },
  openGraph: {
    title: 'A Santa Cruz weekend, already thought through',
    description: 'An interactive reunion blueprint with sourced picnic costs, a three-day plan, and inquiries ready to adapt.',
    url: '/blueprint', type: 'article', siteName,
    images: [{ url: '/images/santa-cruz-coast.jpg', width: 1100, height: 825, alt: 'The Santa Cruz coast' }],
  },
  twitter: { card: 'summary_large_image' },
};

const parkPage = 'https://www.santacruzca.gov/Government/City-Departments/Parks-Recreation/Events/Reservation-Office-Event-Permits/Private-Events-Reservations/Picnic-Areas';
const feeSchedule = 'https://www.santacruzca.gov/files/assets/city/v/4/pr/documents/fees-pr-facilities-effective-jan-5-2026v5.pdf';

export default function BlueprintPage() {
  const park = getVendorEvidence('delaveaga');
  const food = getVendorEvidence('zoccolis');
  const dinner = getVendorEvidence('crows-nest');
  const sources = [
    { label: 'City of Santa Cruz · 2026 picnic fees, page 2', url: feeSchedule },
    { label: 'City of Santa Cruz · picnic capacity and access', url: parkPage },
    { label: 'Zoccoli’s Deli · catering menu', url: food?.sources.find(source => source.url.includes('catering'))?.url || 'https://www.zoccolis.com/catering' },
    { label: 'The Crow’s Nest · Harbor Room capacity', url: dinner?.sources.find(source => source.url === 'https://crowsnest-santacruz.com/')?.url || 'https://crowsnest-santacruz.com/' },
  ];
  return <div className="marketing blueprint-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article',
      headline: 'A 100-Person Santa Cruz Reunion Blueprint',
      description: 'An adaptable example using published Santa Cruz picnic-site and catering prices, with unpriced costs identified separately.',
      mainEntityOfPage: `${siteUrl}/blueprint`, dateModified: '2026-09-06',
      author: { '@type': 'Organization', name: siteName }, citation: sources.map(source => source.url),
    }).replace(/</g, '\\u003c') }}/>
    <a className="mk-skip" href="#main">Skip to content</a>
    <header className="mk-nav">
      <Link href="/" className="brand"><span className="brand-icon"><Waves size={24}/></span><span>Santa Cruz<span className="brand-sub">REUNION KIT</span></span></Link>
      <nav aria-label="Main navigation"><Link href="/">The kit</Link><Link href="/our-reunion">Our reunion</Link><Link href="/for-sale">Own this business</Link><Link href="/plan" className="mk-nav-plan">Open planner <ArrowRight size={15}/></Link></nav>
    </header>
    <main id="main"><Blueprint sources={sources} parkAccess={park?.accessibility.details || ['Accessible parking and restrooms are listed for Forty Thieves. Confirm the route between parking, tables, and restrooms for your guests.']} researchDate={researchCheckedLabel}/></main>
    <footer className="mk-footer mk-wrap"><div><Link href="/" className="brand">Santa Cruz<span className="brand-sub">REUNION KIT</span></Link><p>More time together. Less to figure out.</p></div><nav aria-label="Footer navigation"><Link href="/our-reunion">Our reunion</Link><Link href="/guides">Local guides</Link><Link href="/plan">Your planner</Link><Link href="/for-sale">Own this business</Link></nav><small>A researched planning example, not a confirmed event or a complete event quote. Official sources checked {researchCheckedLabel}.</small></footer>
  </div>;
}
