'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Clipboard, Clock3, MapPin, Trees, Users, Utensils, Waves } from 'lucide-react';

type Props = { sources: { label: string; url: string }[]; parkAccess: string[]; researchDate: string };
type Residency = 'unknown' | 'resident' | 'nonresident';
const dollars = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(cents / 100);
const clipCount = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, Math.round(Number.isFinite(value) ? value : minimum)));

export default function Blueprint({ sources, parkAccess, researchDate }: Props) {
  const [guests, setGuests] = useState(100);
  const [dinnerGuests, setDinnerGuests] = useState(40);
  const [residency, setResidency] = useState<Residency>('unknown');
  const [selectedDay, setSelectedDay] = useState(1);
  const [copyStatus, setCopyStatus] = useState('');
  const picnicFee = residency === 'resident' ? 25100 : 32700;
  const foodCost = guests * 1595;
  const picnicSubtotal = picnicFee + foodCost;
  const dinnerFits = dinnerGuests <= 50;
  const plannerUrl = `/plan?blueprint=picnic100&guests=${guests}&dinner=${dinnerGuests}&residency=${residency}`;
  const inquiry = `Hello Santa Cruz Parks & Recreation,\n\nWe are exploring a family reunion picnic for ${guests} people at DeLaveaga Park’s Forty Thieves area. Our dates are still flexible.\n\nCould you please confirm:\n• Available dates and the permitted setup, event, and cleanup hours.\n• The applicable ${residency === 'resident' ? 'City-resident' : residency === 'nonresident' ? 'nonresident' : 'resident or nonresident'} fee and any additional permits, deposits, insurance, or other charges.\n• Whether outside catered bag lunches are permitted, and any delivery or pickup restrictions.\n• The accessible route from parking to the tables and restrooms, and whether it suits guests using wheelchairs.\n• Parking arrangements for this headcount, sound restrictions, and the cancellation or weather policy.\n\nPlease include the complete terms and next steps for a reservation. We have not committed to a date or made a booking yet.\n\nThank you!`;
  const [inquiryEdits, setInquiryEdits] = useState<{ key: string; value: string } | null>(null);
  const inquiryKey = `${guests}-${residency}`;
  const shownInquiry = inquiryEdits?.key === inquiryKey ? inquiryEdits.value : inquiry;

  async function copyInquiry() {
    try {
      await navigator.clipboard.writeText(shownInquiry);
      setCopyStatus('Copied. Paste into your email and add your dates before sending.');
    } catch {
      setCopyStatus('Select the text above and copy it into your email.');
    }
  }

  const days = [
    { label: 'Friday', theme: 'Arrive & reconnect', moments: [
      { time: '3:00 PM', title: 'Give arrivals a clear landing place', people: 'Traveling households', detail: 'Send the confirmed hotel booking link, check-in details, and your organizer’s number. Guests book their own rooms unless you choose another arrangement.', owner: 'Guest communications lead' },
      { time: '6:00 PM', title: dinnerGuests ? 'A smaller welcome dinner' : 'An open evening', people: dinnerGuests ? `${dinnerGuests} dinner guests` : 'Individual family plans', detail: dinnerGuests ? dinnerFits ? 'Ask the Crow’s Nest about the Harbor Room for this group. Confirm the seated layout, full menu price, food-and-beverage minimum, and access route.' : 'This group exceeds the Harbor Room’s 50-seat listing. Request another venue or split the gathering before announcing a restaurant.' : 'Share a few nearby dining ideas. Keep the main gathering for Saturday so late arrivals don’t miss it.', owner: 'Welcome dinner lead' },
      { time: '8:00 PM', title: 'One useful message for tomorrow', people: 'All households', detail: 'Once the picnic is confirmed, send the exact meeting point, arrival time, parking instructions, weather plan, and what to bring.', owner: 'Guest communications lead' },
    ] },
    { label: 'Saturday', theme: 'The whole family, together', moments: [
      { time: '10:00 AM', title: 'Set up before guests arrive', people: 'Setup volunteers', detail: 'Use the hours in your City reservation. Check the access route and restrooms; set out signs, name tags, water, and clearly labeled food areas.', owner: 'Site lead + two helpers' },
      { time: '11:00 AM', title: 'Make introductions easy', people: `${guests} picnic guests`, detail: 'Welcome people at Forty Thieves. Start with name tags and a simple family connection prompt, with seats available for anyone who needs them.', owner: 'Host' },
      { time: '12:00 PM', title: 'Picnic lunch, without a kitchen project', people: `${guests} bag lunches in this estimate`, detail: 'Arrange a named pickup lead with Zoccoli’s. Confirm the order size, dietary substitutions, timing, food handling, and what drinks or supplies you need to bring.', owner: 'Food lead' },
      { time: '1:00 PM', title: 'The part everyone came for', people: 'Everyone who wants to join', detail: 'Take the family photo, invite a few stories, and leave time for relaxed conversation. Choose activities people can join seated as well as standing.', owner: 'Photo + activities lead' },
      { time: '3:00 PM', title: 'Leave the site ready for the next family', people: 'Cleanup volunteers', detail: 'This is a suggested timeline. Follow your permitted end time, pack out belongings, handle waste, and complete any City checkout requirements.', owner: 'Site lead + cleanup team' },
    ] },
    { label: 'Sunday', theme: 'An easy goodbye', moments: [
      { time: '9:00 AM', title: 'One last coffee, if people have time', people: 'Optional small groups', detail: 'Choose a confirmed, accessible meeting point or the hotel breakfast area with permission. Keep this separate from the priced Saturday picnic.', owner: 'Host' },
      { time: '10:00 AM', title: 'Make departures simple', people: 'Traveling households', detail: 'Remind guests of their own checkout time and transport plans. Hotel checkout times and late checkout must be confirmed with each property.', owner: 'Guest communications lead' },
      { time: 'AFTERWARD', title: 'Keep the good part going', people: 'The whole family', detail: 'Send a thank-you, a photo-sharing link chosen by the family, and any final cost reconciliation. Ask who wants to help with the next reunion.', owner: 'Organizer' },
    ] },
  ];

  return <>
    <section className="bp-hero mk-wrap">
      <div className="bp-hero-copy"><p className="mk-label">THE LOCAL HEAD START · AN INTERACTIVE EXAMPLE</p><h1>A Santa Cruz weekend,<br/>{' '}<em>already thought through.</em></h1><p className="bp-lede">A park that holds the whole family. A welcome dinner sized for the people actually coming. Picnic prices you can trace to the source. Take this starting point and make it yours.</p><a href="#costs" className="mk-button">Try your numbers <ArrowDown size={17}/></a><p className="bp-small">Start with 100 guests · Change the numbers below · No account required</p></div>
      <figure className="bp-cover"><img src="/images/santa-cruz-coast.jpg" width="1100" height="825" alt="Waves along the Santa Cruz coastline" fetchPriority="high"/><figcaption><span>SANTA CRUZ, CALIFORNIA</span><span>A PLACE TO COME TOGETHER</span></figcaption><div className="bp-cover-note"><Trees size={23}/><p>Friday by the harbor.<br/>Saturday with everyone.<br/><em>Sunday, a little reluctant to leave.</em></p></div></figure>
    </section>

    <div className="bp-decision-strip"><div className="mk-wrap"><span><Users size={17}/><strong>{guests}</strong> at the main gathering</span><span><Utensils size={17}/><strong>{dinnerGuests}</strong> at welcome dinner</span><span><Clock3 size={17}/><strong>3 days</strong> with room to breathe</span><span><MapPin size={17}/> Source-checked {researchDate}</span></div></div>

    <section className="bp-cost-section mk-wrap" id="costs" aria-labelledby="cost-title">
      <div className="bp-section-heading"><div><p className="mk-label">01 / THE NUMBERS THAT GROUND THE PLAN</p><h2 id="cost-title">Start with what we know.</h2></div><p>Price the core of Saturday’s picnic, then keep the missing costs visible. This is a sourced starting subtotal, not a quote for the weekend.</p></div>
      <div className="bp-calculator">
        <div className="bp-controls">
          <label className="bp-control-label" htmlFor="picnic-guests">People at the main picnic <span>2–100 guests</span></label>
          <div className="bp-count-input"><input id="picnic-guests" type="number" min={2} max={100} inputMode="numeric" value={guests} onChange={event => { const next = clipCount(Number(event.target.value), 2, 100); setGuests(next); setDinnerGuests(value => Math.min(value, next)); setCopyStatus(''); }}/><span>people</span></div>
          <input className="bp-range" type="range" min={2} max={100} value={guests} aria-label="Adjust picnic guest count" onChange={event => { const next = Number(event.target.value); setGuests(next); setDinnerGuests(value => Math.min(value, next)); setCopyStatus(''); }}/>
          <p className="bp-input-note">Forty Thieves lists capacity for 100. For a larger gathering, choose a different site before scaling the food order.</p>
          <label className="bp-control-label" htmlFor="picnic-residency">City of Santa Cruz resident?</label>
          <select id="picnic-residency" value={residency} onChange={event => { setResidency(event.target.value as Residency); setCopyStatus(''); }}><option value="unknown">Not sure — use the nonresident fee</option><option value="resident">Yes — subject to City eligibility</option><option value="nonresident">No — outside City limits</option></select>
          <p className="bp-input-note">City limits, not Santa Cruz County. Confirm eligibility with the reservation office.</p>
          <div className="bp-rate-pair"><span>Resident site fee<strong>$251 / day</strong></span><span>Nonresident site fee<strong>$327 / day</strong></span></div>
        </div>
        <div className="bp-ledger">
          <p className="mk-label">SATURDAY PICNIC · PUBLISHED BASE PRICES</p>
          <div className="bp-ledger-row"><div><strong>Forty Thieves picnic area</strong><span>One day · {residency === 'resident' ? 'City-resident tier' : 'nonresident tier'} <a href={sources[0].url} target="_blank" rel="noreferrer" aria-label="Read official City picnic fees">[1]</a></span></div><b>{dollars(picnicFee)}</b></div>
          <div className="bp-ledger-row"><div><strong>Zoccoli’s bag lunches</strong><span>{guests} × $15.95 · one per person <a href={sources[2].url} target="_blank" rel="noreferrer" aria-label="Read Zoccoli’s official catering menu">[3]</a></span></div><b>{dollars(foodCost)}</b></div>
          <div className="bp-subtotal" aria-live="polite" aria-atomic="true"><div><span>Known base subtotal</span><strong>{dollars(picnicSubtotal)}</strong></div><p>{dollars(Math.round(picnicSubtotal / guests))} per picnic guest<br/><span>Before all items listed below</span></p></div>
          <div className="bp-unpriced"><span>STILL TO PRICE</span><p>Food tax and fees · drinks and supplies · any permits, insurance, or deposits · transport · welcome dinner · lodging · other meals · weather backup.</p></div>
          <p className="bp-ledger-note">City fees effective January 5, 2026. Menu checked {researchDate}. A bag lunch includes a sandwich, chips, and a cookie. Confirm current prices, order capacity, substitutions, and pickup before committing.</p>
        </div>
      </div>
      <div className="bp-budget-context"><Waves size={22}/><p><strong>Separate the shared picnic from everyone’s travel.</strong> A hotel room block is a different quote. Keeping lodging, optional dinner, and the main gathering separate helps families understand what they are agreeing to pay.</p></div>
    </section>

    <section className="bp-fit-section" aria-labelledby="fit-title"><div className="mk-wrap">
      <div className="bp-section-heading"><div><p className="mk-label">02 / RIGHT PLACE, RIGHT HEADCOUNT</p><h2 id="fit-title">One reunion. Different gatherings.</h2></div><p>A restaurant for 40 can be a great welcome dinner. That doesn’t make it a venue for the 100-person main event.</p></div>
      <div className="bp-place-grid">
        <article className="bp-place"><div className="bp-place-top"><Trees size={22}/><span>THE MAIN GATHERING</span></div><h3>DeLaveaga Park<br/>Forty Thieves</h3><p>A picnic-site reservation is the anchor for this example. Request the site and food separately, and confirm the City’s catering requirements.</p><dl><div><dt>Published capacity</dt><dd>100 people</dd></div><div><dt>Your picnic count</dt><dd>{guests} people</dd></div><div><dt>Standard daily site fee</dt><dd>$251 / $327</dd></div></dl><p className="bp-fit-result"><Check size={16}/> Within the published headcount</p><details><summary>Access and details to confirm</summary><ul>{parkAccess.map(detail => <li key={detail}>{detail}</li>)}<li>Confirm table layout, the exact reservation hours, parking, catering, and any permit requirements for your activities.</li><li>At 100, there is no spare headcount in the published capacity. Confirm how the City counts everyone on site.</li></ul></details><a href={sources[1].url} target="_blank" rel="noreferrer" className="mk-text-link">See the City’s site details <ArrowUpRight size={15}/></a></article>
        <article className="bp-place"><div className="bp-place-top"><Utensils size={22}/><span>THE OPTIONAL WELCOME DINNER</span></div><h3>The Crow’s Nest<br/>Harbor Room</h3><p>A separate private-dining lead for the smaller arrival group. Its quoted dinner cost does not appear in the picnic subtotal.</p><div className="bp-dinner-control"><label htmlFor="welcome-guests">People at welcome dinner</label><input id="welcome-guests" type="number" min={1} max={guests} inputMode="numeric" value={dinnerGuests} onChange={event => setDinnerGuests(clipCount(Number(event.target.value), 1, guests))}/></div><dl><div><dt>Published seated capacity</dt><dd>50 people</dd></div><div><dt>Menu, room fees & minimums</dt><dd>Quote required</dd></div></dl><p className={`bp-fit-result ${dinnerFits ? '' : 'bp-fit-warning'}`} aria-live="polite">{dinnerGuests === 0 ? 'Welcome dinner skipped in your plan.' : dinnerFits ? <><Check size={16}/> {dinnerGuests} fits the listed seated capacity</> : `${dinnerGuests} exceeds 50 seats. Choose another venue or reduce the dinner group.`}</p><details><summary>What the dinner quote needs to include</summary><ul><li>Seated layout, date availability, and exclusive use of the room.</li><li>Food-and-beverage minimum, room fee, tax, service charges, and any additional gratuity.</li><li>Step-free route, accessible restroom, dietary needs, and cancellation terms.</li></ul></details><a href="https://crowsnest-santacruz.com/santa-cruz-the-crows-nest-party" target="_blank" rel="noreferrer" className="mk-text-link">Ask the banquet team <ArrowUpRight size={15}/></a></article>
      </div>
    </div></section>

    <section className="bp-weekend mk-wrap" aria-labelledby="weekend-title"><div className="bp-section-heading"><div><p className="mk-label">03 / GIVE THE WEEKEND A SHAPE</p><h2 id="weekend-title">Enough structure.<br/>Plenty of family time.</h2></div><p>A suggested run-of-show with a person responsible for each handoff. Adapt every time and location to your confirmed reservations.</p></div><div className="bp-day-tabs" role="tablist" aria-label="Weekend days">{days.map((day, index) => <button type="button" key={day.label} id={`bp-day-${index}`} role="tab" aria-selected={selectedDay === index} aria-controls={`bp-panel-${index}`} tabIndex={selectedDay === index ? 0 : -1} onClick={() => setSelectedDay(index)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3; setSelectedDay(next); document.getElementById(`bp-day-${next}`)?.focus(); } }}><span>DAY 0{index + 1} / {day.label}</span><strong>{day.theme}</strong></button>)}</div><div id={`bp-panel-${selectedDay}`} role="tabpanel" aria-labelledby={`bp-day-${selectedDay}`} className="bp-day-panel"><ol>{days[selectedDay].moments.map(moment => <li key={moment.time}><span className="bp-time">{moment.time}</span><div><div className="bp-moment-top"><h3>{moment.title}</h3><span>{moment.people}</span></div><p>{moment.detail}</p><small><Users size={13}/>{moment.owner}</small></div></li>)}</ol></div></section>

    <section className="bp-next-section"><div className="mk-wrap bp-next-grid"><div><p className="mk-label">04 / THE ORDER MATTERS</p><h2>Secure the anchor.<br/>Then fill in the weekend.</h2><ol className="bp-booking-order"><li><span>1</span><div><h3>Ask the City about your picnic date.</h3><p>Confirm the site, rules, access, and complete fees. A preferred date is not a reservation.</p></div></li><li><span>2</span><div><h3>Check the food plan for that date.</h3><p>Ask Zoccoli’s whether it can fulfill {guests} lunches, when to order, and how pickup and dietary requests work.</p></div></li><li><span>3</span><div><h3>Quote lodging and any welcome dinner.</h3><p>Compare total room costs and release terms. {dinnerGuests ? `Use ${dinnerGuests} for the dinner inquiry, not ${guests}.` : 'You have left the welcome dinner optional.'}</p></div></li><li><span>4</span><div><h3>Confirm terms. Then send the invitation.</h3><p>Publish the details you have actually secured. Assign a food lead, a site lead, and a guest communications lead.</p></div></li></ol></div><div className="bp-first-inquiry"><p className="mk-label">YOUR FIRST USEFUL ACTION</p><h3>The park inquiry,<br/>already drafted.</h3><p className="bp-inquiry-to">To: <a href="mailto:parksandrec@santacruzca.gov">parksandrec@santacruzca.gov</a></p><label className="sr-only" htmlFor="park-inquiry">Edit your park inquiry</label><textarea id="park-inquiry" value={shownInquiry} onChange={event => { setInquiryEdits({ key: inquiryKey, value: event.target.value }); setCopyStatus(''); }}/><button type="button" className="mk-button" onClick={copyInquiry}><Clipboard size={16}/> Copy inquiry</button><p className="bp-small">Review and add your dates. You send it from your own email. Changing picnic count or residency refreshes the draft.</p><p className="bp-copy-status" role="status">{copyStatus}</p></div></div></section>

    <section className="bp-sources mk-wrap" aria-labelledby="source-title"><div><p className="mk-label">THE RESEARCH, OPEN TO INSPECTION</p><h2 id="source-title">Follow the facts.</h2><p>Official sources checked {researchDate}. Published prices and features are starting evidence; providers confirm your actual date, group, and terms.</p></div><ol>{sources.map((source, index) => <li key={source.url}><span>0{index + 1}</span><a href={source.url} target="_blank" rel="noreferrer">{source.label}<ArrowUpRight size={15}/></a></li>)}</ol></section>
    <section className="bp-final"><div className="mk-wrap"><div><p className="mk-label">KEEP THE WORK. MAKE IT YOURS.</p><h2>Your family.<br/>A useful head start.</h2><p>Carry your {guests}-person gathering and {dinnerGuests}-person welcome dinner into the planner. Add your dates, room needs, and priorities, then adapt the inquiries and schedule.</p></div><div><Link href={plannerUrl} className="mk-button mk-button-cream">Use this reunion blueprint <ArrowRight size={18}/></Link><p>Free working planner · No account required</p><Link href="/for-sale" className="bp-owner-link">Interested in owning the business? <ArrowRight size={15}/></Link></div></div></section>
  </>;
}
