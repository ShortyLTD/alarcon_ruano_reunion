import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle2, Compass, FileText, Hotel, Mail, MapPin, Users, Waves } from 'lucide-react';
import SampleKit from '@/components/sample-kit';
import { vendors } from '@/lib/vendors';
import { guides } from '@/lib/guides';
import { contactEmail, mailto, researchCheckedLabel, siteName, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    url: '/', type: 'website', locale: 'en_US', siteName,
    title: 'Santa Cruz Family Reunion Planner: Hotels, Venues & Dining',
    description: 'Researched local places, editable provider inquiries and a personalized reunion plan. Explore the free working preview.',
    images: [{ url: '/images/santa-cruz-coast.jpg', width: 1100, height: 825, alt: 'Pacific waves along the Santa Cruz coast' }],
  },
  twitter: { card: 'summary_large_image' },
};

const inclusions = [
  ['A researched local starting point', `Compare ${vendors.length} Santa Cruz hotels, group-dining options, picnic catering, and gathering spaces. Each record links to an official source and shows when it was checked.`],
  ['Know why a place is on your shortlist', 'See published capacities, access details, booking steps, and the questions still needing answers. Your headcount and room needs help screen options; your budget and practical needs travel with every inquiry.'],
  ['Provider inquiries ready to review', 'Start with editable, provider-specific drafts, follow-ups, and the questions that help you request comparable quotes. Review, copy, and send.'],
  ['One place to compare replies', 'Record prices, deposits, deadlines, missing terms, and next steps before your family commits.'],
  ['A guest page ready for the family chat', 'Choose which moments to share, add your welcome, and copy a link to the same beautiful guide you see in the preview. Keep your budget and organizer notes private.'],
  ['A complete organizer kit to keep', 'Download the plan, contacts, workbooks, inquiry drafts, day-of notes, guest guide, and a restorable backup.'],
];
const faqs = [
  ['What does the planner cost?', 'The current planner is free to use, including the research, provider drafts, guest links, and downloadable kit. No card or account is required. Hotel, food, venue and permit charges are paid separately to providers.'],
  ['Can I buy and operate this business?', 'Yes. The $2,500 asking price is for the software and defined business assets, not a family’s reunion. The ownership page explains the working product, transfer scope, operating model and current limitations. No customer revenue is claimed.'],
  ['Are these places personally vetted?', `No. They are research leads, not personal endorsements. The current edition includes ${vendors.length} local options researched from official provider and public-agency sources, with a source link and check date on each record (last checked ${researchCheckedLabel}). You still need to confirm availability, current prices, capacity, permits, accessibility details, and terms directly with each provider.`],
  ['Do you contact providers or make reservations for me?', 'No. The kit prepares editable inquiries and questions for you to review. You choose what to send from your own email, receive replies in your own inbox, and confirm every reservation directly with the provider. Hotel, food, venue, permit, and other provider charges are separate.'],
  ['Does the kit include current prices?', 'Only where a useful public price is available, and every published price is labeled with a source and check date. Most group hotel, restaurant, and venue arrangements need a quote for your dates, layout, and headcount. The inquiry drafts ask for a complete price, and the workbook helps you compare written replies.'],
  ['Can I start before our dates or headcount are final?', 'Yes. Use your best estimate and leave dates flexible if needed. Update the plan as details settle, and ask providers to refresh quotes whenever your dates, headcount, or requirements change.'],
  ['How do I share the plan with my family?', 'Choose which schedule moments to include, review your guest page, then copy its shareable link or download the matching HTML guide. The link contains a snapshot of your selected guest details. Anyone with the link can read it. Create and resend a new link after changes; RSVPs go to your email, with no automatic response tracking.'],
  ['Where is my plan saved?', 'Your working plan saves in this browser on this device. It is not uploaded to a shared account. Download a backup before clearing browser data or moving to another device.'],
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': `${siteUrl}/#webpage`, url: `${siteUrl}/`, name: 'Santa Cruz Family Reunion Planner', isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': `${siteUrl}/#organization` }, dateModified: '2026-09-06' },
    { '@type': 'FAQPage', mainEntity: faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ],
};

export default function Home() {
  return <div className="marketing">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}/>
    <a className="mk-skip" href="#main">Skip to content</a>
    <header className="mk-nav"><Link href="/" className="brand"><span className="brand-icon"><Waves size={24}/></span><span>Santa Cruz<span className="brand-sub">REUNION KIT</span></span></Link><nav aria-label="Main navigation"><a href="#included">The kit</a><Link href="/our-reunion">Our reunion</Link><Link href="/guides">Local guides</Link><Link href="/blueprint">100-person example</Link><Link href="/plan" className="mk-nav-plan">Open planner <ArrowRight size={15}/></Link></nav></header>
    <main id="main">
      <section className="mk-hero mk-wrap">
        <div className="mk-hero-copy"><p className="mk-label">SANTA CRUZ FAMILY REUNION PLANNING</p><h1>A whole reunion to plan.<br/><em>A lot less to figure out.</em></h1><p className="mk-lede">Tell us about your family in three short steps. Get a Santa Cruz shortlist of hotels, group dining, and gathering spaces, editable provider inquiries, a quote workbook, a weekend schedule, and a beautiful guest page you can share with one link.</p><div className="mk-hero-actions"><Link href="/plan?start=1" className="mk-button">Start my free plan <ArrowRight size={18}/></Link><Link href="/blueprint" className="mk-button mk-button-light">See a researched weekend</Link></div><p className="mk-micro">Free working preview · No account or card required · Saves in this browser</p><div className="mk-hero-price"><span>THE LOCAL ADVANTAGE</span><p>Published fees. Specific spaces. Questions already written. <Link href="/blueprint">See the evidence →</Link></p></div></div>
        <div className="mk-hero-art"><img src="/images/santa-cruz-coast.jpg" alt="Waves meeting the cliffs along the Santa Cruz coast" fetchPriority="high" decoding="async" width="1100" height="825"/><div className="mk-art-caption"><MapPin size={13}/> A LITTLE TIME TOGETHER, BY THE COAST</div><a className="mk-paper" href="#sample"><div className="mk-paper-top"><Waves size={23}/><span>YOUR REUNION<br/>STARTS HERE</span></div><h2>From “we should”<br/>to “see you there.”</h2><ul><li><CheckCircle2 size={17}/> Understand your options</li><li><CheckCircle2 size={17}/> Inquiries ready to personalize</li><li><CheckCircle2 size={17}/> One plan to bring it together</li></ul><div className="mk-paper-bottom"><span>LOCAL RESEARCH + YOUR FAMILY</span><Compass size={22}/></div></a></div>
      </section>
      <div className="mk-proof-strip"><div className="mk-wrap"><span><MapPin size={18}/><strong>{vendors.length} researched local options</strong></span><span><CheckCircle2 size={18}/> Official sources, checked {researchCheckedLabel}</span><span><Mail size={18}/> Editable inquiries, schedule &amp; budget workbooks</span><a href="#sample"><FileText size={18}/> A complete sample you can inspect</a></div></div>
      <section className="mk-family-proof mk-wrap" aria-labelledby="family-proof-title">
        <div className="mk-family-copy">
          <p className="mk-label">THE REUNION THAT INSPIRED THE KIT</p>
          <h2 id="family-proof-title">It started with<br/>our own family reunion.</h2>
          <p>In June 2026, Jason La Barbera helped organize a Santa Cruz reunion for around 100 relatives. The weekend included a beach gathering, time in the redwoods, and an original guest website with the June 5–7 schedule, 16 lodging suggestions, a local guide, and a map.</p>
          <p>That firsthand experience inspired this kit. The kit was researched and developed afterward, for the next family organizer. You can see the original schedule, lodging suggestions, and local guide for yourself.</p>
          <Link href="/our-reunion" className="mk-text-link">See the original reunion <ArrowRight size={17}/></Link>
          <small>A firsthand example—not a customer result. The planning kit was developed afterward and did not organize that weekend.</small>
        </div>
        <figure className="mk-family-artifact">
          <Link href="/our-reunion" aria-label="See the story behind our Alarcon Ruano family reunion"><img src="/images/our-family-reunion.webp" alt="The original Alarcon Ruano Family Reunion guest website for Santa Cruz, June 2026" width="1348" height="926" loading="lazy" decoding="async"/></Link>
          <figcaption><span>OUR ORIGINAL GUEST WEBSITE</span><span>June 5–7, 2026</span></figcaption>
        </figure>
      </section>
      <section className="mk-section mk-wrap" id="included"><div className="mk-section-head"><p className="mk-label">LOCAL RESEARCH, SHAPED AROUND YOUR FAMILY</p><h2>Start with the groundwork.<br/>Make the decisions yours.</h2><p>Which places can handle your group? What should you ask before paying a deposit? What belongs in the guest guide? Start with researched options and prepared questions, then shape the plan around your dates, headcount, budget, and accessibility needs.</p></div><div className="mk-inclusions">{inclusions.map(([title, description], i) => <article key={title}><span className="mk-item-number">0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
      <section className="mk-sample-section" id="sample"><div className="mk-wrap"><div className="mk-section-head"><p className="mk-label">SEE THE WORK BEFORE YOU START</p><h2>A complete sample,<br/>ready to inspect.</h2><p>Open the Rivera family example to see the kind of shortlist, inquiry, schedule, workbook, and guest guide your own answers produce. Sample dates are flexible and no provider is booked.</p></div><SampleKit/></div></section>
      <section className="mk-section mk-wrap mk-how"><div><p className="mk-label">FROM IDEA TO INQUIRIES</p><h2>You don’t need<br/>every answer yet.</h2><p>Start with your best estimates. You can update the plan as dates, headcount, and provider replies become clearer.</p><Link href="/plan?start=1" className="mk-text-link">Start my free plan <ArrowRight size={16}/></Link></div><ol><li><span>01</span><div><h3>Complete three short steps.</h3><p>Add your dates or date flexibility, estimated headcount, room needs, budget, accessibility needs, and the kind of weekend you want.</p></div></li><li><span>02</span><div><h3>Review your personalized starting point.</h3><p>See a suggested shortlist, weekend schedule, and provider-specific inquiry drafts. Edit anything before you use it.</p></div></li><li><span>03</span><div><h3>Send, compare, and confirm.</h3><p>Contact providers yourself, record their written replies, confirm bookings directly, and download the guest guide when the details are ready to share.</p></div></li></ol></section>
      <section className="mk-section mk-wrap mk-pricing" id="price"><div><p className="mk-label">YOUR FAMILY HAS ENOUGH TO ORGANIZE</p><h2>The groundwork is here.<br/>Start making it yours.</h2><p>Explore the local research, build your plan, review your inquiries, and share your guest guide. The current edition is free. Provider charges are separate.</p><Link href="/blueprint" className="mk-text-link">See the 100-person picnic and its published costs <ArrowRight size={16}/></Link></div><article className="mk-price-card"><p className="mk-label">FOR YOUR FAMILY</p><div className="mk-price"><span>Free</span><p>Current planner edition<br/>No account or card</p></div><p className="mk-price-description">Useful local research. A plan you can act on.</p><ul>{[`${vendors.length} researched Santa Cruz options`,'Capacity, access, price evidence and booking steps','Provider inquiries and follow-up drafts','Separate event and household lodging costs','A matching guest preview, shareable page and download','Your organizer kit and restorable backup'].map(text => <li key={text}><Check size={17}/>{text}</li>)}</ul><Link href="/plan?start=1" className="mk-button">Start my free plan <ArrowRight size={17}/></Link><small>You choose providers, send inquiries, receive replies and confirm every booking.</small></article></section>
      <section className="mk-operator-bridge mk-wrap"><div><p className="mk-label">A LOCAL BUSINESS, READY FOR ITS NEXT OWNER</p><h2>Make this your Santa Cruz business.</h2><p>The working planner, editable research, guest experience and operating playbook. Built for an event planner, concierge or local publisher to take forward.</p></div><Link href="/for-sale" className="mk-button">Explore ownership · $2,500 <ArrowRight size={17}/></Link></section>
      <section className="mk-section mk-wrap mk-guides"><div className="mk-section-head"><p className="mk-label">A LITTLE LOCAL KNOW-HOW</p><h2>Start with your biggest question.</h2></div><div>{guides.map((guide,i)=><Link href={`/guides/${guide.slug}`} key={guide.slug}><span>{i===0?<MapPin size={23}/>:i===1?<Users size={23}/>:<Hotel size={23}/>}</span><h3>{guide.shortTitle}</h3><p>{guide.description}</p><strong>Read the guide <ArrowRight size={16}/></strong></Link>)}</div></section>
      <section className="mk-section mk-wrap mk-faq"><div><p className="mk-label">BEFORE YOU START</p><h2>A few good questions.</h2></div><div>{faqs.map(([question,answer])=><details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="mk-final"><p className="mk-label">YOUR FAMILY. YOUR WEEKEND.</p><h2>Give your reunion<br/>a useful starting point.</h2><Link href="/plan?start=1" className="mk-button mk-button-cream">Start my free plan <ArrowRight size={18}/></Link><p>Three short steps · No account or card required · Saves in this browser</p></section>
    </main>
    <footer className="mk-footer mk-wrap"><div><Link href="/" className="brand">Santa Cruz<span className="brand-sub">REUNION KIT</span></Link><p>Made for getting together.</p></div><nav aria-label="Footer navigation"><Link href="/our-reunion">Our reunion</Link><Link href="/guides">Planning guides</Link><Link href="/plan">Your planner</Link><Link href="/blueprint">100-person example</Link><Link href="/your-data">Your data</Link><Link href="/for-sale">Own this business</Link>{contactEmail && <a href={mailto(`Question about ${siteName}`)}>Contact</a>}<a href="https://unsplash.com/photos/qR5wQNyDA1s" target="_blank" rel="noreferrer">Photo: Sean Kelley</a></nav><small>Research checked {researchCheckedLabel}. Providers are researched from official sources, not personally vetted. Confirm availability and complete terms with each provider.</small></footer>
  </div>;
}
