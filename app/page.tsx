import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check, CheckCircle2, Compass, FileText, Hotel, Mail, MapPin, Users, Waves } from 'lucide-react';
import SampleKit from '@/components/sample-kit';
import { vendors } from '@/lib/vendors';
import { guides } from '@/lib/guides';
import { contactEmail, mailto, plannedPrice, researchCheckedLabel, siteName, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: { url: '/' },
  twitter: { card: 'summary_large_image' },
};

const inclusions = [
  ['A researched local starting point', `Compare ${vendors.length} Santa Cruz hotels, group-dining options, picnic catering, and gathering spaces. Each record links to an official source and shows when it was checked.`],
  ['A shortlist shaped around your family', 'Your dates, headcount, room needs, budget, and accessibility needs turn the research into a practical shortlist and an editable weekend plan.'],
  ['Provider inquiries ready to review', 'Start with editable, provider-specific drafts, follow-ups, and the questions that help you request comparable quotes. Review, copy, and send.'],
  ['One place to compare replies', 'Record prices, deposits, deadlines, missing terms, and next steps before your family commits.'],
  ['A guest guide you can download', 'Share the weekend schedule, welcome message, and organizer contact details—without sharing your private budget or planning notes.'],
  ['A complete organizer kit to keep', 'Download the plan, contacts, workbooks, inquiry drafts, day-of notes, guest guide, and a restorable backup.'],
];
const faqs = [
  ['What is free now, and what will cost $39?', `Today the whole working preview is free: build your plan, read every researched place, edit the inquiries, and download your kit. When paid checkout opens, the planned price for the complete kit is $${plannedPrice} once per reunion—not a subscription. Checkout is not connected yet, and nothing is charged without a checkout step you choose.`],
  ['What makes this worth $39?', `The kit brings the groundwork into one usable plan: ${vendors.length} researched local options, prepared provider inquiries, quote and budget workbooks, a weekend schedule, and a downloadable guest guide. Inspect the complete sample and use the working preview before deciding whether the future paid edition is worth $${plannedPrice} for your reunion.`],
  ['Are these places personally vetted?', `No. They are research leads, not personal endorsements. The current edition includes ${vendors.length} local options researched from official provider and public-agency sources, with a source link and check date on each record (last checked ${researchCheckedLabel}). You still need to confirm availability, current prices, capacity, permits, accessibility details, and terms directly with each provider.`],
  ['Do you contact providers or make reservations for me?', 'No. The kit prepares editable inquiries and questions for you to review. You choose what to send from your own email, receive replies in your own inbox, and confirm every reservation directly with the provider. Hotel, food, venue, permit, and other provider charges are separate.'],
  ['Does the kit include current prices?', 'Only where a useful public price is available, and every published price is labeled with a source and check date. Most group hotel, restaurant, and venue arrangements need a quote for your dates, layout, and headcount. The inquiry drafts ask for a complete price, and the workbook helps you compare written replies.'],
  ['Can I start before our dates or headcount are final?', 'Yes. Use your best estimate and leave dates flexible if needed. Update the plan as details settle, and ask providers to refresh quotes whenever your dates, headcount, or requirements change.'],
  ['How do I share the plan with my family?', 'Download the separate guest guide and invitation text. The guest guide can include your welcome message, schedule, and organizer email without your private budget, quotes, or planning notes. It is a file you resend when plans change. Hosted guest websites, shared accounts, and automatic RSVP tracking are not included.'],
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
    <header className="mk-nav"><Link href="/" className="brand"><span className="brand-icon"><Waves size={24}/></span><span>Santa Cruz<span className="brand-sub">REUNION KIT</span></span></Link><nav aria-label="Main navigation"><a href="#included">The kit</a><Link href="/our-reunion">Our reunion</Link><Link href="/guides">Local guides</Link><a href="#price">Pricing</a><Link href="/plan" className="mk-nav-plan">Open planner <ArrowRight size={15}/></Link></nav></header>
    <main id="main">
      <section className="mk-hero mk-wrap">
        <div className="mk-hero-copy"><p className="mk-label">SANTA CRUZ FAMILY REUNION PLANNING</p><h1>A whole reunion to plan.<br/><em>A lot less to figure out.</em></h1><p className="mk-lede">Answer three short steps to get a Santa Cruz shortlist of hotels, group dining, and gathering spaces, editable provider inquiries, a quote workbook, a weekend schedule, and a downloadable guest guide for your family.</p><div className="mk-hero-actions"><Link href="/plan?start=1" className="mk-button">Start my free plan <ArrowRight size={18}/></Link><a href="#sample" className="mk-button mk-button-light">See a complete sample</a></div><p className="mk-micro">Free working preview · No account or card required · Saves in this browser</p><div className="mk-hero-price"><span>PLANNED PRICE</span><p><strong>${plannedPrice}</strong> once per reunion when checkout opens. The working preview is free today.</p></div></div>
        <div className="mk-hero-art"><img src="/images/santa-cruz-coast.jpg" alt="Waves meeting the cliffs along the Santa Cruz coast" fetchPriority="high" decoding="async" width="1100" height="825"/><div className="mk-art-caption"><MapPin size={13}/> A LITTLE TIME TOGETHER, BY THE COAST</div><a className="mk-paper" href="#sample"><div className="mk-paper-top"><Waves size={23}/><span>YOUR REUNION<br/>STARTS HERE</span></div><h2>From “we should”<br/>to “see you there.”</h2><ul><li><CheckCircle2 size={17}/> Places that fit your group</li><li><CheckCircle2 size={17}/> Inquiries ready to personalize</li><li><CheckCircle2 size={17}/> One plan to bring it together</li></ul><div className="mk-paper-bottom"><span>LOCAL RESEARCH + YOUR FAMILY</span><Compass size={22}/></div></a></div>
      </section>
      <div className="mk-proof-strip"><div className="mk-wrap"><span><MapPin size={18}/><strong>{vendors.length} researched local options</strong></span><span><CheckCircle2 size={18}/> Official sources, checked {researchCheckedLabel}</span><span><Mail size={18}/> Editable inquiries, schedule &amp; budget workbooks</span><a href="#sample"><FileText size={18}/> A complete sample you can inspect</a></div></div>
      <section className="mk-family-proof mk-wrap" aria-labelledby="family-proof-title">
        <div className="mk-family-copy">
          <p className="mk-label">THE REUNION THAT INSPIRED THE KIT</p>
          <h2 id="family-proof-title">It started with<br/>our own family reunion.</h2>
          <p>In June 2026, our founder helped organize a Santa Cruz reunion for around 100 relatives. The weekend included a beach gathering, time in the redwoods, and an original guest website with the June 5–7 schedule, 16 lodging suggestions, a local guide, and a map.</p>
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
      <section className="mk-section mk-wrap mk-how"><div><p className="mk-label">FROM IDEA TO INQUIRIES</p><h2>You don’t need<br/>every answer yet.</h2><p>Start with your best estimates. You can update the plan as dates, headcount, and provider replies become clearer.</p><Link href="/plan?start=1" className="mk-text-link">Start my free plan <ArrowRight size={16}/></Link></div><ol><li><span>01</span><div><h3>Answer three short steps.</h3><p>Add your dates or date flexibility, estimated headcount, room needs, budget, accessibility needs, and the kind of weekend you want.</p></div></li><li><span>02</span><div><h3>Review your personalized starting point.</h3><p>See a suggested shortlist, weekend schedule, and provider-specific inquiry drafts. Edit anything before you use it.</p></div></li><li><span>03</span><div><h3>Send, compare, and confirm.</h3><p>Contact providers yourself, record their written replies, confirm bookings directly, and download the guest guide when the details are ready to share.</p></div></li></ol></section>
      <section className="mk-section mk-wrap mk-pricing" id="price"><div><p className="mk-label">ONE REUNION. ONE PLANNING KIT.</p><h2>The working preview is free today.<br/>The planned price is ${plannedPrice}.</h2><p>Use the current preview to build and download a complete reunion plan while checkout is being prepared. When paid checkout opens, the planned price is ${plannedPrice} once per reunion—not a subscription.</p><div className="mk-price-example"><Users size={23}/><p>Shared across <strong>20 households</strong>, a ${plannedPrice} kit would be <strong>${(plannedPrice / 20).toFixed(2)} per household</strong>.<small>Illustrative cost split for the planning kit only.</small></p></div></div><article className="mk-price-card"><p className="mk-label">THE COMPLETE REUNION KIT</p><div className="mk-price"><span>${plannedPrice}</span><p>Planned one-time price<br/>per reunion</p></div><p className="mk-price-description">Local groundwork, shaped around your family.</p><ul>{[`${vendors.length} researched Santa Cruz options`,'Personalized shortlist and organizer plan','Editable provider inquiries and follow-ups','Quote, deposit, budget, and decision workbooks','Schedule, invitation text, and day-of notes','Downloadable guest guide and restorable backup'].map(text => <li key={text}><Check size={17}/>{text}</li>)}</ul><Link href="/plan?start=1" className="mk-button">Start my free plan <ArrowRight size={17}/></Link><p className="mk-price-status">The preview edition is free today. Checkout is not connected.</p>{contactEmail && <a className="mk-notify" href={mailto(`Tell me when the $${plannedPrice} Santa Cruz Reunion Kit is ready`, 'Hi—please let me know when the complete kit is available.\n\nOur reunion (rough dates and headcount): ')}><Mail size={16}/> Email me when the ${plannedPrice} kit launches</a>}<small>Provider charges are separate. You send inquiries, receive replies, and confirm every booking directly with the provider.</small></article></section>
      <section className="mk-section mk-wrap mk-guides"><div className="mk-section-head"><p className="mk-label">A LITTLE LOCAL KNOW-HOW</p><h2>Start with your biggest question.</h2></div><div>{guides.map((guide,i)=><Link href={`/guides/${guide.slug}`} key={guide.slug}><span>{i===0?<MapPin size={23}/>:i===1?<Users size={23}/>:<Hotel size={23}/>}</span><h3>{guide.shortTitle}</h3><p>{guide.description}</p><strong>Read the guide <ArrowRight size={16}/></strong></Link>)}</div></section>
      <section className="mk-section mk-wrap mk-faq"><div><p className="mk-label">BEFORE YOU START</p><h2>A few good questions.</h2></div><div>{faqs.map(([question,answer])=><details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="mk-final"><p className="mk-label">YOUR FAMILY. YOUR WEEKEND.</p><h2>Give your reunion<br/>a useful starting point.</h2><Link href="/plan?start=1" className="mk-button mk-button-cream">Start my free plan <ArrowRight size={18}/></Link><p>Answer three short steps · No account or card required · Saves in this browser</p></section>
    </main>
    <footer className="mk-footer mk-wrap"><div><Link href="/" className="brand">Santa Cruz<span className="brand-sub">REUNION KIT</span></Link><p>Made for getting together.</p></div><nav aria-label="Footer navigation"><Link href="/our-reunion">Our reunion</Link><Link href="/guides">Planning guides</Link><Link href="/plan">Your planner</Link><a href="#price">Pricing</a><Link href="/your-data">Your data</Link>{contactEmail && <a href={mailto(`Question about ${siteName}`)}>Contact</a>}<a href="https://unsplash.com/photos/qR5wQNyDA1s" target="_blank" rel="noreferrer">Photo: Sean Kelley</a></nav><small>Research checked {researchCheckedLabel}. Providers are researched from official sources, not personally vetted. Confirm availability and complete terms with each provider.</small></footer>
  </div>;
}
