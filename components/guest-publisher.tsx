'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Download, ExternalLink, Mail } from 'lucide-react';
import { toast } from 'sonner';
import type { Workspace } from '@/lib/planner';
import { dateLabel } from '@/lib/planner';
import { guestGuideHtml, downloadFile } from '@/lib/exports';
import { createGuestShareUrl } from '@/lib/guest-guide';
import { vendors } from '@/lib/vendors';
import { track } from '@/lib/track';

export function GuestPublisher({ workspace, onChange, onEditOrganizer }: { workspace: Workspace; onChange: (patch: Partial<Workspace>) => void; onEditOrganizer: () => void }) {
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState('');
  const settings = workspace.guestSettings ?? { scheduleIds: [], confirmedLocationIds: [] };
  const preview = useMemo(() => {try {return {html: guestGuideHtml(workspace,vendors), error:''};} catch(error) {return {html:'', error:error instanceof Error ? error.message : 'Choose fewer moments to preview this guide.'};}},[workspace]);
  const html = preview.html;
  function toggle(id: string, field: 'scheduleIds' | 'confirmedLocationIds') {
    const ids = settings[field];
    onChange({guestSettings: {...settings, [field]: ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]}});
    setLink('');
  }
  async function share() {
    if (!settings.scheduleIds.length) return toast.error('Choose at least one moment to include in your guest guide.');
    setBusy(true);
    try {
      const url = await createGuestShareUrl(workspace, window.location.origin);
      setLink(url);
      try { await navigator.clipboard.writeText(url); toast.success('Guest link copied. Paste it into your family group chat.'); }
      catch { toast('Your link is ready. Select and copy it below.'); }
      track('guest_link_created', {events: settings.scheduleIds.length});
    } catch (error) { toast.error(error instanceof Error ? error.message : 'We could not prepare the guest link. Try downloading the guide.'); }
    finally { setBusy(false); }
  }
  return <>
    <div className="section-title"><div><p className="eyebrow">ONE GUIDE FOR YOUR PEOPLE</p><h2>A beautiful page. A link to share.</h2></div><button className="button button-dark" disabled={busy || !!preview.error} onClick={share}><Copy size={16}/>{busy ? 'Preparing your link…' : 'Copy guest link'}</button></div>
    <p className="section-note">Choose the moments your family should see. This preview, the shared page, and your download use the same design.</p>
    <div className="guest-publishing-grid">
      <aside className="guest-controls">
        <section className="panel"><h3>Your welcome</h3><label className="field"><span>Welcome message for guests</span><textarea maxLength={2000} value={workspace.guestMessage} onChange={e => {onChange({guestMessage:e.target.value});setLink('');}} placeholder="We can’t wait to have everyone together…"/></label><button className="text-button" onClick={onEditOrganizer}><Mail size={15}/>{workspace.brief.email ? 'Update organizer contact' : 'Add an email for RSVPs'}</button></section>
        <section className="panel"><h3>Choose what to share</h3><p className="section-note">Only checked moments appear. Organizer notes, quotes, accessibility requests, and research leads stay private.</p>
          <button className="text-button" onClick={() => {onChange({guestSettings:{...settings,scheduleIds:workspace.schedule.map(item => item.id)}});setLink('');}}><Check size={15}/>Include proposed schedule</button>
          <div className="publish-events">{workspace.schedule.map(item => <div className="publish-event" key={item.id}>
            <label><input type="checkbox" checked={settings.scheduleIds.includes(item.id)} onChange={() => toggle(item.id,'scheduleIds')}/><span><strong>{item.title}</strong><small>{workspace.brief.date ? dateLabel(workspace.brief.date,item.day) : `Day ${item.day+1}`} · {item.time}</small><small>{item.location || 'Location to follow'}</small></span></label>
            {settings.scheduleIds.includes(item.id) && <label className="location-confirm"><input type="checkbox" checked={settings.confirmedLocationIds.includes(item.id)} onChange={() => toggle(item.id,'confirmedLocationIds')}/><span>I have confirmed this location</span></label>}
          </div>)}</div>
        </section>
        <section className="share-note"><h3>Ready for the group chat</h3><p>Anyone with your link can read these guest details. It contains a snapshot of this version. Make and resend a new link when the plan changes. RSVPs go to your email.</p><button className="button button-outline" disabled={!!preview.error} onClick={() => {downloadFile('guest-guide.html',html,'text/html;charset=utf-8');track('guest_guide_downloaded');toast.success('Your guest guide is downloading.');}}><Download size={16}/>Download this guide</button></section>
      </aside>
      <div className="guest-delivery-preview">
        {link && <div className="guest-link-ready" role="status"><strong>Your guest link is ready</strong><label className="field"><span>Copy and share this link</span><input readOnly value={link} onFocus={e => e.currentTarget.select()}/></label><a className="text-button" href={link} target="_blank" rel="noreferrer">Open your guest page <ExternalLink size={15}/></a></div>}
        {preview.error ? <div role="alert" className="panel"><h3>Your guide needs a shorter selection</h3><p>{preview.error}</p></div> : <iframe title="Your actual guest guide preview" className="guest-document" srcDoc={html} sandbox="allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"/>}
      </div>
    </div>
  </>;
}
