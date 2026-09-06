'use client';

import { useState } from 'react';
import { ArrowRight, Check, Download, Mail, MapPin, Users } from 'lucide-react';
import { defaultWorkspace, inquiry, makeSchedule } from '@/lib/planner';
import { exportPacket } from '@/lib/exports';
import { vendors } from '@/lib/vendors';
import { track } from '@/lib/track';

const sampleBrief = { ...defaultWorkspace.brief, family: 'Rivera family', organizer: 'Alex Rivera', guests: 60, dinnerGuests: 25, rooms: 20, nights: 2 };
const sample = { ...defaultWorkspace, brief: sampleBrief, schedule: makeSchedule(sampleBrief), selected: ['dream-inn', 'shadowbrook', 'delaveaga'], created: true };
const sampleHotel = vendors.find(v => v.id === 'dream-inn')!;

export default function SampleKit() {
  const [view, setView] = useState('places');
  const [status, setStatus] = useState('');
  return <div className="mk-sample">
    <div className="mk-sample-top"><div><span className="mk-label">THE RIVERA FAMILY · EXAMPLE</span><h3>A weekend for 60, coming together.</h3><p>Example for a 60-person reunion · Sample details · Places still to confirm</p></div><button className="mk-button mk-button-light" onClick={() => { try { exportPacket(sample, vendors); track('sample_downloaded'); setStatus('Your sample ZIP is downloading.'); } catch { setStatus('The download did not start. Please try again.'); } }}><Download size={16}/> Download the sample kit</button></div>
    <div className="mk-sample-nav" aria-label="Sample sections">{[{id:'places',label:'Your local shortlist',icon:MapPin},{id:'inquiry',label:'Your hotel inquiry',icon:Mail},{id:'guests',label:'Your guest guide',icon:Users}].map(item => <button key={item.id} aria-pressed={view===item.id} onClick={() => { setView(item.id); track('sample_viewed', { view: item.id }); }}><item.icon size={16}/>{item.label}</button>)}</div>
    <div className="mk-sample-content">
      {view === 'places' && <div className="mk-sample-places">{vendors.filter(v => sample.selected.includes(v.id)).map(v => <article key={v.id}><span className="mk-label">{v.category === 'hotel' ? 'STAY TOGETHER' : v.category === 'restaurant' ? 'SHARE A MEAL' : 'THE MAIN GATHERING'}</span><h4>{v.name}</h4><p>{v.description}</p><div><Check size={15}/><span>{v.highlights[0]}</span></div><a href={v.source} target="_blank" rel="noreferrer">Official source · checked {v.checkedAt} <ArrowRight size={13}/></a></article>)}</div>}
      {view === 'inquiry' && <div className="mk-sample-email"><div><span>Prepared for</span><strong>{sampleHotel.name}</strong></div><div><span>Subject</span><strong>{inquiry(sampleHotel, sampleBrief).subject}</strong></div><pre>{inquiry(sampleHotel, sampleBrief).body}</pre><p>Use the hotel’s official inquiry form with this draft. You review and send it.</p></div>}
      {view === 'guests' && <div className="mk-sample-guest"><span className="mk-label">A NOTE FOR YOUR PEOPLE</span><h4>Rivera family.<br/>Together in Santa Cruz.</h4><p>We can’t wait for a weekend by the coast. Here’s the plan so far—please check with us before booking travel.</p><ol><li><span>DAY 1</span><strong>Arrive, settle in, share a meal.</strong></li><li><span>DAY 2</span><strong>The big gathering. Time to reconnect.</strong></li><li><span>DAY 3</span><strong>Coffee, hugs, and one more memory.</strong></li></ol><small>Illustrative weekend. Your downloadable guide uses your actual schedule. Add your email to receive family RSVPs in your inbox.</small></div>}
    </div><p className="mk-sample-foot">The sample includes editable inquiry drafts, a printable organizer plan, contacts, budget sheets, and a downloadable guest guide. It does not include confirmed availability, reservations, or prices for your reunion.<span role="status">{status}</span></p>
  </div>;
}
