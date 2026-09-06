import type { Workspace } from './planner';

/** An intentionally small allowlist. Never serialize the organizer workspace into a guest link. */
export type PublicGuestEvent = {
  day: number; time: string; title: string; location: string; locationConfirmed: boolean;
};
export type PublicGuestGuide = {
  version: 1; family: string; date: string; nights: number; organizer: string;
  email: string; welcome: string; preparedAt: string; schedule: PublicGuestEvent[];
};

const PUBLIC_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://santacruzreunion.com').replace(/\/+$/, '');
const MAX_BYTES = 60000;
const MAX_FRAGMENT = 40000;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const validEmail = (value: string) => /^[^\s<>@,;?&]+@[^\s<>@,;?&]+\.[^\s<>@,;?&]+$/.test(value);
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const validTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export function parsePublicGuestGuide(value: unknown): PublicGuestGuide | null {
  const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  const text = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v);
  if (!record(value) || value.version !== 1 || !text(value.family, 200) || !text(value.organizer, 200) || !text(value.email, 254) || !text(value.welcome, 5000) || !text(value.date, 10) || !text(value.preparedAt, 30)) return null;
  if (value.date !== '' && !validDate(value.date)) return null;
  if (value.email !== '' && !validEmail(value.email)) return null;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.preparedAt) || !Number.isFinite(Date.parse(value.preparedAt)) || new Date(value.preparedAt).toISOString() !== value.preparedAt) return null;
  if (typeof value.nights !== 'number' || !Number.isInteger(value.nights) || value.nights < 1 || value.nights > 14 || !Array.isArray(value.schedule) || value.schedule.length > 60) return null;
  const schedule: PublicGuestEvent[] = [];
  for (const event of value.schedule) {
    if (!record(event) || typeof event.day !== 'number' || !Number.isInteger(event.day) || event.day < 0 || event.day > 365 || !text(event.time, 50) || !text(event.title, 300) || !text(event.location, 500) || typeof event.locationConfirmed !== 'boolean') return null;
    // Reconstruct, rather than spread: unknown properties can contain private organizer data.
    schedule.push({ day: event.day, time: event.time, title: event.title, location: event.location, locationConfirmed: event.locationConfirmed && !!event.location.trim() });
  }
  return { version: 1, family: value.family, date: value.date, nights: value.nights, organizer: value.organizer, email: value.email, welcome: value.welcome, preparedAt: value.preparedAt, schedule };
}

export function createPublicGuestGuide(workspace: Workspace, preparedAt = new Date().toISOString()): PublicGuestGuide {
  const published = new Set(workspace.guestSettings?.scheduleIds ?? []);
  const confirmed = new Set(workspace.guestSettings?.confirmedLocationIds ?? []);
  const guide = parsePublicGuestGuide({
    version: 1, family: workspace.brief.family.trim() || 'Our family', date: workspace.brief.date,
    nights: workspace.brief.nights, organizer: workspace.brief.organizer.trim(),
    email: validEmail(workspace.brief.email.trim()) ? workspace.brief.email.trim() : '',
    welcome: workspace.guestMessage || 'A weekend of familiar faces, ocean air, and stories we’ll tell for years. We can’t wait to see you.',
    preparedAt,
    schedule: workspace.schedule.filter(event => published.has(event.id)).map(event => ({
      day: event.day, time: event.time, title: event.title, location: event.location,
      locationConfirmed: confirmed.has(event.id) && !!event.location.trim(),
    })).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time)),
  });
  if (!guide) throw new Error('Keep your guest guide to 60 events, short event titles and locations, and a welcome under 5,000 characters. Check your date and organizer details.');
  return guide;
}

/** Public snapshot in the URL fragment; no account, upload, database, or live synchronization. */
export async function createGuestShareUrl(workspace: Workspace, baseUrl = PUBLIC_ORIGIN): Promise<string> {
  const guide = createPublicGuestGuide(workspace);
  const bytes = encoder.encode(JSON.stringify(guide));
  if (bytes.byteLength > MAX_BYTES) throw new Error('Your guest guide is too long to share as a link. Shorten the welcome or share fewer events.');
  if (typeof CompressionStream === 'undefined') throw new Error('This browser cannot create guest links. Download your guest guide, or use a current version of Chrome or Safari.');
  const stream = new Blob([bytes.buffer as ArrayBuffer]).stream().pipeThrough(new CompressionStream('gzip'));
  const compressed = new Uint8Array(await new Response(stream).arrayBuffer());
  let binary = '';
  for (const byte of compressed) binary += String.fromCharCode(byte);
  const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (encoded.length > MAX_FRAGMENT) throw new Error('Your guest link is too long. Shorten the welcome or download the guide instead.');
  const url = new URL('/reunion', baseUrl);
  if (!/^https?:$/.test(url.protocol)) throw new Error('A guest link needs a valid website address.');
  url.hash = `v1.${encoded}`;
  return url.href;
}

/** Treat fragments as untrusted: cap both compressed and expanded data before parsing. */
export async function decodeGuestShareHash(hash: string): Promise<PublicGuestGuide | null> {
  try {
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    if (raw.length > MAX_FRAGMENT + 3 || !/^v1\.[A-Za-z0-9_-]+$/.test(raw) || typeof DecompressionStream === 'undefined') return null;
    const encoded = raw.slice(3).replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(encoded + '='.repeat((4 - encoded.length % 4) % 4));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    const reader = new Blob([bytes.buffer]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BYTES) { await reader.cancel(); return null; }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const expanded = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { expanded.set(chunk, offset); offset += chunk.byteLength; }
    return parsePublicGuestGuide(JSON.parse(decoder.decode(expanded)));
  } catch { return null; }
}

function dayDate(date: string, day: number): Date | null {
  if (!validDate(date)) return null;
  const result = new Date(`${date}T12:00:00Z`);
  result.setUTCDate(result.getUTCDate() + day);
  return result;
}
function dayLabel(date: string, day: number, short = false) {
  const value = dayDate(date, day);
  return value ? value.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long', month: 'short', day: 'numeric', timeZone: 'UTC' }) : `Day ${day + 1}`;
}
function timeLabel(value: string) {
  if (!validTime(value)) return value || 'Time to follow';
  const [hours, minutes] = value.split(':').map(Number);
  return `${hours % 12 || 12}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''} ${hours < 12 ? 'am' : 'pm'}`;
}
function calendarEscape(value: string) { return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,'); }
function foldCalendarLine(value: string) {
  let line = '', length = 0, result = '';
  for (const character of value) {
    const bytes = encoder.encode(character).length;
    if (length + bytes > 75) { result += line + '\r\n '; line = ''; length = 1; }
    line += character; length += bytes;
  }
  return result + line;
}

/** Only explicitly confirmed locations with a date and clock time become calendar events. */
export function guestCalendarIcs(guide: PublicGuestGuide): string | null {
  const events = guide.schedule.filter(event => event.locationConfirmed && validTime(event.time) && validDate(guide.date));
  if (!events.length) return null;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Santa Cruz Reunion Kit//Guest Guide//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VTIMEZONE', 'TZID:America/Los_Angeles', 'BEGIN:DAYLIGHT', 'DTSTART:20070311T020000', 'TZOFFSETFROM:-0800', 'TZOFFSETTO:-0700', 'TZNAME:PDT', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU', 'END:DAYLIGHT', 'BEGIN:STANDARD', 'DTSTART:20071104T020000', 'TZOFFSETFROM:-0700', 'TZOFFSETTO:-0800', 'TZNAME:PST', 'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU', 'END:STANDARD', 'END:VTIMEZONE'];
  events.forEach((event, index) => {
    const date = dayDate(guide.date, event.day)!.toISOString().slice(0, 10).replace(/-/g, '');
    // A point-in-time calendar event avoids inventing an event duration.
    lines.push('BEGIN:VEVENT', `UID:${guide.preparedAt.replace(/[^0-9]/g, '')}-${index}@santa-cruz-reunion-kit`,
      `DTSTAMP:${guide.preparedAt.replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
      `DTSTART;TZID=America/Los_Angeles:${date}T${event.time.replace(':', '')}00`,
      `SUMMARY:${calendarEscape(`${guide.family}: ${event.title}`)}`, `LOCATION:${calendarEscape(event.location)}`,
      `DESCRIPTION:${calendarEscape('Location confirmed by the organizer in this guest-guide snapshot. Check the latest guide for changes. Event end time has not been supplied.')}`, 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.map(foldCalendarLine).join('\r\n') + '\r\n';
}

/** The download, organizer preview and hosted link render this exact document. No injected scripts. */
export function renderGuestGuideHtml(guide: PublicGuestGuide, imageOrigin = PUBLIC_ORIGIN): string {
  const safe = parsePublicGuestGuide(guide);
  if (!safe) throw new Error('This guest guide has invalid details.');
  const g = safe;
  let origin = PUBLIC_ORIGIN;
  try { const parsed = new URL(imageOrigin); if (/^https?:$/.test(parsed.protocol)) origin = parsed.origin; } catch { /* use canonical public image */ }
  const image = `${origin}/images/santa-cruz-coast.jpg`;
  const days = [...new Set(g.schedule.map(event => event.day))].sort((a, b) => a - b);
  const rsvp = g.email ? `mailto:${g.email}?subject=${encodeURIComponent(`${g.family} reunion RSVP`)}&body=${encodeURIComponent('Hello!\n\nHousehold name:\nAdults attending:\nChildren attending:\nEvents we can join:\nQuestions for the organizer:\n\nLooking forward to seeing everyone!')}` : '';
  const calendar = guestCalendarIcs(g);
  const schedule = days.map(day => `<section class="day"><div class="day-heading"><span class="day-number">${String(day + 1).padStart(2, '0')}</span><h3>${escape(dayLabel(g.date, day))}</h3></div>${g.schedule.filter(event => event.day === day).map(event => `<article class="event"><div class="event-time">${escape(timeLabel(event.time))}</div><div><h4>${escape(event.title)}</h4><p>${escape(event.location || 'A little closer to the date, we’ll share where to meet.')}</p><span class="status ${event.locationConfirmed ? 'confirmed' : ''}">${event.locationConfirmed ? 'Location confirmed by organizer' : 'Location to confirm'}</span>${event.locationConfirmed ? `<a class="map-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(event.location)}" target="_blank" rel="noopener noreferrer">Open location in Maps <span aria-hidden="true">↗</span></a>` : ''}</div></article>`).join('')}</section>`).join('');
  const date = g.date ? `${dayLabel(g.date, 0, true)} – ${dayLabel(g.date, g.nights, true)} · ${g.date.slice(0, 4)}` : 'Dates to be announced';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta name="robots" content="noindex,nofollow"><title>${escape(g.family)} · Together in Santa Cruz</title><style>
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f7f5ee;color:#193f3b;font:16px/1.7 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:inherit;text-underline-offset:4px}a:focus-visible{outline:3px solid #bc603e;outline-offset:5px}h1,h2,h3,h4,p{margin:0}h1,h2,h3{font-family:Georgia,"Times New Roman",serif;font-weight:400;line-height:1.12}h1{font-size:clamp(48px,8vw,88px);letter-spacing:-.045em;max-width:850px;overflow-wrap:anywhere}h2{font-size:clamp(34px,5vw,52px);letter-spacing:-.035em}h3{font-size:28px}h4{font-size:19px;line-height:1.35;overflow-wrap:anywhere}.eyebrow{display:block;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase}.wrap{width:min(1040px,100% - 64px);margin:auto}.hero{min-height:600px;position:relative;background:#294f4b;background-image:linear-gradient(180deg,rgba(12,41,38,.25),rgba(12,41,38,.23) 35%,rgba(12,41,38,.85)),url('${escape(image)}');background-position:center 45%;background-size:cover;color:white;display:flex;flex-direction:column;justify-content:space-between}.masthead{padding-top:32px;display:flex;justify-content:space-between;gap:20px;align-items:center}.coast-mark{font:28px Georgia,serif;line-height:1}.masthead a{font-size:13px;text-decoration:none;border-bottom:1px solid #ffffff80}.hero-copy{padding-top:100px;padding-bottom:60px}.hero-copy .eyebrow{margin-bottom:24px}.hero-copy h1 em{font-weight:400}.date{margin-top:24px;font-size:15px}.intro{display:grid;grid-template-columns:1fr 1.35fr;gap:72px;padding:72px 0}.intro .eyebrow{color:#7b5142;margin-bottom:18px}.welcome{font-size:18px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}.byline{margin-top:22px;font-size:13px;color:#596b63}.weekend{border-top:1px solid #d3dcd3;padding:60px 0 52px}.section-top{display:flex;justify-content:space-between;align-items:flex-end;gap:28px;margin-bottom:36px}.section-top .eyebrow{color:#7b5142;margin-bottom:12px}.calendar-link{font-size:13px;white-space:nowrap}.day{margin-top:32px;border:1px solid #d7ded5;border-radius:4px;background:#fffdf8;overflow:hidden}.day-heading{padding:23px 28px;display:flex;align-items:center;gap:20px;border-bottom:1px solid #dfe5dc}.day-number{font:italic 26px Georgia,serif;color:#8b624f}.event{display:grid;grid-template-columns:100px 1fr;gap:22px;padding:26px 28px;border-bottom:1px solid #e5e8e0}.event:last-child{border:0}.event-time{font-size:14px;font-weight:600}.event p{color:#566a62;font-size:14px;margin:8px 0;overflow-wrap:anywhere}.status{font-size:11px;color:#785d3e;background:#f3eee4;border-radius:20px;padding:4px 9px;display:inline-block}.status.confirmed{background:#e8efe7;color:#32594a}.map-link{display:block;font-size:12px;margin-top:12px;width:max-content;max-width:100%}.empty{padding:30px;background:#eeeee4;border-radius:4px;color:#566a62}.practical{display:grid;grid-template-columns:1fr 1fr;gap:48px;border-top:1px solid #d3dcd3;padding:52px 0}.practical h3{margin:12px 0 20px}.practical p{font-size:15px;color:#52655d}.practical a{display:inline-block;margin-top:15px;font-size:13px}.rsvp{background:#153f39;color:white;text-align:center;padding:58px 24px;border-radius:4px;margin:12px 0 48px}.rsvp .eyebrow{color:#c4d7c9;margin-bottom:18px}.rsvp h2{max-width:680px;margin:auto}.rsvp p{max-width:570px;margin:22px auto 0;color:#d8e4d9;font-size:14px}.button{display:inline-flex;align-items:center;justify-content:center;padding:14px 24px;background:#f4f0df;color:#173f37;border-radius:3px;font-size:14px;font-weight:600;text-decoration:none;margin-top:28px;max-width:100%;overflow-wrap:anywhere}.rsvp .fine-print{font-size:11px;line-height:1.6;max-width:430px;color:#bfd0c4;margin-top:18px}.footer{display:flex;justify-content:space-between;gap:24px;padding-bottom:38px;font-size:11px;color:#627267}.footer p{max-width:640px}.footer .eyebrow{font-size:9px;white-space:nowrap;padding-top:3px}@media(max-width:680px){.wrap{width:calc(100% - 40px)}.hero{min-height:530px}.masthead{padding-top:23px}.masthead .eyebrow{font-size:9px;letter-spacing:.16em}.hero-copy{padding-top:90px;padding-bottom:42px}.hero-copy .eyebrow{margin-bottom:18px}.intro{grid-template-columns:1fr;gap:25px;padding:42px 0}.welcome{font-size:16px}.weekend{padding-top:38px}.section-top{display:block}.calendar-link{display:inline-block;margin-top:20px}.day-heading{padding:20px;gap:15px}.day-heading h3{font-size:24px}.event{grid-template-columns:65px 1fr;gap:14px;padding:22px 18px}.event h4{font-size:17px}.event-time{font-size:12px}.practical{grid-template-columns:1fr;gap:32px;padding:36px 0}.rsvp{margin-top:10px;padding:42px 20px}.rsvp h2{font-size:34px}.footer{display:block}.footer .eyebrow{margin-top:22px}.date{font-size:13px}}@media print{body{background:white}.hero{min-height:300px;print-color-adjust:exact;-webkit-print-color-adjust:exact}.hero-copy{padding-top:30px;padding-bottom:35px}h1{font-size:48px}.wrap{width:100%}.masthead{padding-top:0}.intro,.practical{padding:30px 0}.day,.event,.rsvp{break-inside:avoid}.rsvp{background:#153f39;print-color-adjust:exact}.footer{padding-bottom:0}.calendar-link{display:none}}
</style></head><body><header class="hero"><div class="wrap masthead"><span class="eyebrow"><span class="coast-mark" aria-hidden="true">≈</span> SANTA CRUZ, CALIFORNIA</span><a href="#weekend">Our weekend ↓</a></div><div class="wrap hero-copy"><span class="eyebrow">A LITTLE OCEAN AIR. ALL OUR FAVORITE PEOPLE.</span><h1>${escape(g.family)}.<br><em>Together in Santa Cruz.</em></h1><p class="date">${escape(date)}</p></div></header><main class="wrap"><section class="intro"><div><span class="eyebrow">THE BEST PART IS BEING TOGETHER</span><h2>A little time.<br>A lot of memories.</h2></div><div><p class="welcome">${escape(g.welcome)}</p>${g.organizer ? `<p class="byline">With love, ${escape(g.organizer)}</p>` : ''}</div></section><section class="weekend" id="weekend"><div class="section-top"><div><span class="eyebrow">GOOD COMPANY. NO GUESSWORK.</span><h2>The weekend, at a glance.</h2></div>${calendar ? `<a class="calendar-link" href="data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}" download="reunion-events.ics">Add confirmed locations to calendar ↗</a>` : ''}</div>${schedule || '<div class="empty">Your organizer is putting the weekend together. The schedule will be shared when it’s ready.</div>'}</section><section class="practical"><div><span class="eyebrow">A SOFT LANDING</span><h3>Getting here.</h3><p>Use the event links above for locations your organizer has confirmed. Before heading out, check your arrival details, parking, and the easiest route for your household.</p><a href="https://www.google.com/maps/search/?api=1&amp;query=Santa+Cruz+California" target="_blank" rel="noopener noreferrer">Find Santa Cruz on the map ↗</a></div><div><span class="eyebrow">PACK A LITTLE COMFORT</span><h3>Make yourself at home.</h3><p>Bring layers for cool coastal evenings, comfortable shoes, sun protection, a refillable water bottle, and a favorite family story. Your organizer can help with specific arrival or meal needs.</p></div></section><section class="rsvp"><span class="eyebrow">SAVE US A PLACE IN YOUR PLANS</span><h2>We’re better when you’re here.</h2><p>Let ${escape(g.organizer || 'your organizer')} know who’s coming and which moments you can join. A quick reply helps bring the whole weekend together.</p>${rsvp ? `<a class="button" href="${escape(rsvp)}" target="_top">Send our household RSVP ↗</a><p class="fine-print">This opens your email app. Review and send your message yourself. This guide does not collect or track RSVPs.</p>` : '<p>Get in touch with your organizer to RSVP. Their email address hasn’t been included in this guide yet.</p>'}</section></main><footer class="wrap footer"><p>Guest-guide snapshot · Prepared ${escape(new Date(g.preparedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }))}. This copy does not update automatically. Ask your organizer for a new link if plans change. The downloaded version is a file, not a live website.</p><span class="eyebrow">MADE FOR TIME TOGETHER</span></footer></body></html>`;
}

export function guestGuideHtml(workspace: Workspace): string {
  return renderGuestGuideHtml(createPublicGuestGuide(workspace));
}
