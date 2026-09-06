import { dateLabel, inquiry, money, suggestTasks, quoteCostType } from './planner';
import type { Workspace, Vendor } from './planner';
import { bookingChecks, comparisonRows, confirmationRequest, followUp, guestReminder, runSheetRows } from './action-kit';
import { guestGuideHtml as renderWorkspaceGuestGuide, createPublicGuestGuide, guestCalendarIcs } from './guest-guide';

const utf8 = new TextEncoder();
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
export function csvCell(value: unknown): string {
  let text = String(value ?? '');
  if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
function csv(rows: unknown[][]) { return '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n'); }
function safeUrl(value: string) {
  try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch { return ''; }
}
function emailAddress(value: string) { return /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value) ? value : ''; }
function link(url: string, label: string) { const safe = safeUrl(url); return safe ? `<a href="${escapeHtml(safe)}">${escapeHtml(label)}</a>` : escapeHtml(label); }
function slug(value: string) { return value.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).toLowerCase() || 'reunion'; }
function layout(title: string, content: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title><style>body{font:16px/1.65 system-ui,sans-serif;color:#193c3b;background:#f8f7f2;margin:0}main{max-width:900px;margin:40px auto;padding:36px;background:white;border-radius:20px}h1,h2,h3{line-height:1.2}h1{font-size:42px}h2{margin-top:36px}p,li{max-width:76ch}a{color:#006b69}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #dce3df}.note{background:#edf4ef;padding:16px;border-radius:12px}.muted{color:#596d68}article{padding:14px 0;border-bottom:1px solid #dce3df}pre{white-space:pre-wrap;font:inherit}@media(max-width:600px){main{margin:0;padding:22px;border-radius:0}h1{font-size:32px}table{display:block;overflow:auto}}@media print{body{background:white}main{margin:0;max-width:none;padding:0}article,tr{break-inside:avoid}a{color:inherit}h2{break-after:avoid}}</style></head><body><main>${content}</main></body></html>`;
}
function scheduleHtml(workspace: Workspace) {
  return workspace.schedule.map(item => `<article><strong>${escapeHtml(dateLabel(workspace.brief.date, item.day))} · ${escapeHtml(item.time)}</strong><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.location)}</p><p class="muted">${escapeHtml(item.notes)}</p></article>`).join('');
}
function vendorHtml(vendors: Vendor[]) {
  return vendors.map(v => `<article><h3>${escapeHtml(v.name)}</h3><p>${escapeHtml(v.category)} · ${escapeHtml(v.location)}</p><p>${escapeHtml(v.description)}</p><p><strong>Pricing:</strong> ${escapeHtml(v.priceNote)}. Request terms for your dates.</p><p><strong>Capacity:</strong> ${v.capacity === null ? 'Needs confirmation' : `${escapeHtml(v.capacity)}${v.category === 'hotel' ? ' event guests (confirm configuration)' : ' guests (confirm configuration)'}`}</p><p>${link(v.url, 'Official contact / inquiry page')} · ${link(v.source, 'Research source')} · Checked ${escapeHtml(v.checkedAt)}</p><p class="muted">Researched option. Availability and suitability for your event are unconfirmed.</p></article>`).join('') || '<p>No providers shortlisted yet. Choose providers in your workspace, then download an updated packet.</p>';
}

/** Kept as a compatibility wrapper; provider research never enters the public guide. */
export function guestGuideHtml(workspace: Workspace, _vendors?: Vendor[]): string {
  return renderWorkspaceGuestGuide(workspace);
}

/** Invitation copy for the downloadable guest snapshot. A fresh hosted link is created in the planner. */
export function invitationText(workspace: Workspace): string {
  const b = workspace.brief;
  return `${b.family || 'Our family'} reunion — Santa Cruz\n\n${dateLabel(b.date)} · ${b.nights} nights\n\n${workspace.guestMessage || 'Let’s get everyone together for a little time by the coast. We’re putting together our Santa Cruz reunion and would love you to join us.'}\n\nOur guest guide includes the schedule moments we’ve chosen to share. Please check any locations marked “to confirm” with us before booking travel. Use the latest guest link or attached guide for details.\n\nTo RSVP, reply with your household name, who is coming, and which meals and activities you expect to join.\n\n${b.organizer || 'Your reunion organizer'}${b.email ? `\n${b.email}` : ''}\n`;
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
/** Standards-compliant ZIP STORE archive. No compression library or network dependency. */
export function zipFiles(files: { name: string; content: string }[]): Blob {
  const chunks: Uint8Array[] = [], central: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const name = utf8.encode(file.name), data = utf8.encode(file.content), crc = crc32(data);
    const local = new Uint8Array(30 + name.length), l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x800, true);
    l.setUint16(12, 33, true); l.setUint32(14, crc, true); l.setUint32(18, data.length, true); l.setUint32(22, data.length, true); l.setUint16(26, name.length, true); local.set(name, 30);
    const entry = new Uint8Array(46 + name.length), e = new DataView(entry.buffer);
    e.setUint32(0, 0x02014b50, true); e.setUint16(4, 20, true); e.setUint16(6, 20, true); e.setUint16(8, 0x800, true);
    e.setUint16(14, 33, true); e.setUint32(16, crc, true); e.setUint32(20, data.length, true); e.setUint32(24, data.length, true); e.setUint16(28, name.length, true); e.setUint32(42, offset, true); entry.set(name, 46);
    chunks.push(local, data); central.push(entry); offset += local.length + data.length;
  }
  const centralSize = central.reduce((sum, entry) => sum + entry.length, 0);
  const end = new Uint8Array(22), view = new DataView(end.buffer);
  view.setUint32(0, 0x06054b50, true); view.setUint16(8, files.length, true); view.setUint16(10, files.length, true); view.setUint32(12, centralSize, true); view.setUint32(16, offset, true);
  const result = new Uint8Array(offset + centralSize + end.length);
  let cursor = 0;
  for (const chunk of [...chunks, ...central, end]) { result.set(chunk, cursor); cursor += chunk.length; }
  return new Blob([result.buffer], { type: 'application/zip' });
}

function base64(text: string) {
  const bytes = utf8.encode(text);
  let binary = ''; for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function encodedHeader(text: string) {
  const chunks: string[] = [];
  let chunk = '';
  for (const character of text.replace(/[\r\n]/g, ' ')) {
    if (utf8.encode(chunk + character).length > 42) { chunks.push(chunk); chunk = ''; }
    chunk += character;
  }
  if (chunk) chunks.push(chunk);
  return chunks.map(value => `=?UTF-8?B?${base64(value)}?=`).join('\r\n ');
}

export function createPacket(workspace: Workspace, vendors: Vendor[]): Blob {
  const b = workspace.brief, selected = vendors.filter(v => workspace.selected.includes(v.id));
  const generated = new Date().toISOString();
  const rows: unknown[][] = [['Provider', 'Status / evidence', 'Total amount USD', 'Deposit USD (part of total; not an extra expense)', 'Deadline', 'Notes', 'Spending category', 'Included in working budget']];
  for (const quote of workspace.quotes) rows.push([vendors.find(v => v.id === quote.vendorId)?.name || quote.vendorId, quote.status === 'estimate' ? 'Organizer planning estimate — not a provider quote' : quote.status === 'quoted' ? 'Quote recorded by organizer — verify source and terms' : 'Confirmed by organizer — verify booking documents', quote.amount, quote.deposit, quote.deadline, quote.notes, quoteCostType(quote, vendors) === 'event' ? 'Shared event spending' : 'Guest lodging — separate', quote.includedInBudget === false ? 'No — alternative proposal' : 'Yes']);
  const contacts: unknown[][] = [['Name', 'Category', 'Location', 'Email', 'Official inquiry URL', 'Capacity (configuration must be confirmed)', 'Pricing reference (not availability)', 'Source', 'Checked date']];
  for (const v of selected) contacts.push([v.name, v.category, v.location, v.email || 'Use official inquiry route', v.url, v.capacity ?? 'Unconfirmed', v.priceNote, v.source, v.checkedAt]);
  const budgetRows = workspace.quotes.map(q => `<tr><td>${escapeHtml(vendors.find(v => v.id === q.vendorId)?.name || q.vendorId)}</td><td>${escapeHtml(q.status === 'estimate' ? 'Planning estimate' : `${q.status} · organizer recorded`)}</td><td>${money(q.amount)}</td><td>${money(q.deposit)}</td><td>${escapeHtml(q.deadline || 'Not recorded')}</td><td>${quoteCostType(q, vendors) === 'event' ? 'Shared event' : 'Guest lodging'}</td><td>${q.includedInBudget === false ? 'Alternative — excluded' : 'Included'}</td></tr>`).join('');
  const plan = layout(`${b.family || 'Family'} reunion plan`, `<p class="muted">SANTA CRUZ REUNION KIT · ORGANIZER PACKET</p><h1>Your people. A weekend together.</h1><h2>${escapeHtml(b.family || 'Your family')} reunion</h2><p>${escapeHtml(dateLabel(b.date))} · ${b.guests} guests · ${b.dinnerGuests} at the welcome meal · ${b.rooms} rooms · ${b.nights} nights</p><div class="note">Prepared ${escapeHtml(generated)}. This packet is a snapshot. Research is not confirmation of availability, and no inquiries are sent by downloading it.</div><h2>Your working budget</h2><p>Shared-event target: <strong>${money(b.budget)}</strong>. Household lodging target: <strong>${money(b.hotelBudget)} per room per night</strong>, separate from the shared-event budget. Taxes and fees require confirmation.</p><p>Estimates below are planning assumptions. Quoted and confirmed entries are recorded by the organizer. Deposits are part of the price, not additional spending. Unknown fees are not zero. Alternative proposals marked excluded do not count toward your working budget. Hotel event charges belong to shared event spending; guest room charges stay separate.</p>${budgetRows ? `<table><thead><tr><th>Provider</th><th>Evidence</th><th>Amount</th><th>Deposit</th><th>Deadline</th><th>Spending category</th><th>Working budget</th></tr></thead><tbody>${budgetRows}</tbody></table>` : '<p>No costs recorded yet. Request quotes to build your budget.</p>'}<h2>The weekend</h2>${scheduleHtml(workspace)}<h2>Your next actions</h2><ul>${suggestTasks(b).map(t => `<li><strong>${workspace.completed.includes(t.id) ? '✓ ' : ''}${escapeHtml(t.title)}</strong><br>${escapeHtml(t.detail)}</li>`).join('')}</ul><h2>Your shortlist</h2>${vendorHtml(selected)}<h2>Family needs & planning notes</h2><p style="white-space:pre-wrap">${escapeHtml(b.needs || 'No practical needs recorded.')}\n${escapeHtml(b.notes)}</p><h2>How to use your packet</h2><p>Open inquiry drafts in your mail app, review, and send individually. Where a provider uses a form, use its official link and copy the prepared inquiry. Share guest-guide.html and invitation.txt with your family, or copy a hosted guest link from the planner. Only schedule moments you choose to share appear in the guide. Keep backup.json private and import it in your planner to restore this snapshot. Downloading does not publish a site, send mail, collect RSVPs, or reserve anything.</p>`);
  const files = [
    { name: 'reunion-plan.html', content: plan }, { name: 'budget.csv', content: csv(rows) },
    { name: 'contacts.csv', content: csv(contacts) }, { name: 'invitation.txt', content: invitationText(workspace) },
    { name: 'backup.json', content: JSON.stringify(workspace, null, 2) },
    { name: 'guest-guide.html', content: guestGuideHtml(workspace, vendors) },
    { name: 'execution-guide.html', content: executionGuideHtml(workspace, selected) },
    { name: 'quote-comparison.csv', content: csv(comparisonRows(workspace, vendors)) },
    { name: 'day-of-run-sheet.csv', content: csv(runSheetRows(workspace)) },
    { name: 'guest-reminder.txt', content: guestReminder(workspace) },
    { name: 'START-HERE.txt', content: `YOUR SANTA CRUZ REUNION KIT\nGenerated ${generated}\n\nOpen reunion-plan.html in your browser. Use Print > Save as PDF if you want a PDF.\nbudget.csv and contacts.csv open in spreadsheet apps.\nexecution-guide.html walks through provider follow-up, comparison, and booking details.\nquote-comparison.csv keeps unresolved costs and terms visible; unknown does not mean zero.\nday-of-run-sheet.csv is for your organizing team: assign helpers and add confirmed contact details.\nReview guest-reminder.txt before sending it with the latest guest guide.\ninquiries/ contains individual, unsent drafts. Some mail apps require importing .eml; the accompanying .txt files always work. Review dates, recipients, and details before sending.\nFor providers without email, use the official inquiry page listed in the .txt draft.\nShare guest-guide.html and invitation.txt with family, or create a hosted guest link in the planner. Only explicitly shared schedule moments appear. The guide and hosted link are snapshots; updates require a new download or link. RSVP opens the organizer email address. reunion-events.ics, when included, contains only dated events whose locations you marked confirmed; end times are unspecified.\nKeep backup.json private. It contains organizer planning information and can restore this saved plan.\n\nProvider information is researched, not confirmation of availability. Prices are reference information or organizer-entered figures, not offers from this service.\n` },
  ];
  const guestCalendar = guestCalendarIcs(createPublicGuestGuide(workspace));
  if (guestCalendar) files.push({ name: 'reunion-events.ics', content: guestCalendar });
  selected.forEach((v, index) => {
    const draft = inquiry(v, b), prefix = `inquiries/${String(index + 1).padStart(2, '0')}-${slug(v.name)}`;
    files.push({ name: `${prefix}-follow-up.txt`, content: `UNSENT FOLLOW-UP DRAFT — use after sending your first inquiry\nOfficial inquiry route: ${v.url}\n${v.email ? `Email: ${v.email}\n` : ''}\n${followUp(v, b)}` });
    files.push({ name: `${prefix}-booking-details.txt`, content: `UNSENT REQUEST FOR WRITTEN DETAILS — NOT A BOOKING\nOfficial inquiry route: ${v.url}\n${v.email ? `Email: ${v.email}\n` : ''}\n${confirmationRequest(v, b)}` });
    if (workspace.drafts && Object.prototype.hasOwnProperty.call(workspace.drafts, v.id)) draft.body = workspace.drafts[v.id];
    files.push({ name: `${prefix}.txt`, content: `Provider: ${v.name}\nOfficial inquiry route: ${v.url}\n${v.email ? `Email: ${v.email}\n` : 'Use the official form or phone route; no provider email is recorded.\n'}Status: UNSENT DRAFT\n\nSubject: ${draft.subject}\n\n${draft.body}\n` });
    const email = emailAddress(v.email || '');
    if (email) files.push({ name: `${prefix}.eml`, content: `To: ${email}\r\nSubject: ${encodedHeader(draft.subject)}\r\nX-Unsent: 1\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${base64(draft.body).match(/.{1,76}/g)?.join('\r\n') || ''}\r\n` });
  });
  return zipFiles(files);
}

export function executionGuideHtml(workspace: Workspace, selected: Vendor[]): string {
  const b = workspace.brief;
  const providerSections = selected.map(v => `<article><h3>${escapeHtml(v.name)}</h3><p>${link(v.url, 'Official inquiry route')}</p><ul>${bookingChecks(v).map(check => `<li>${escapeHtml(check)}</li>`).join('')}</ul><h3>Follow-up draft</h3><pre>${escapeHtml(followUp(v, b))}</pre><h3>Request written booking details</h3><pre>${escapeHtml(confirmationRequest(v, b))}</pre></article>`).join('');
  return layout(`${b.family || 'Your family'} · from shortlist to reunion day`, `<p class="muted">SANTA CRUZ REUNION KIT · ORGANIZER EXECUTION GUIDE</p><h1>From a shortlist to a weekend together.</h1><p>${escapeHtml(b.family || 'Your family')} · ${escapeHtml(dateLabel(b.date))} · ${b.guests} guests</p><div class="note">This guide contains questions and unsent drafts. Written provider approval, completed reservation steps, and any required payment establish your arrangements. Keep this organizer guide private; share guest-guide.html with your family.</div><h2>1. Request comparable offers</h2><p>Send the personalized first inquiry to each shortlisted provider. Use quote-comparison.csv to capture the replies. Keep unknown terms marked “Not recorded”; they are not zero-cost items. For hotels, specify whether a price is per room, per night, or the entire stay. Compare the same dates, counts, and inclusions.</p><h2>2. Follow up and resolve the details</h2><p>After you send an inquiry, choose a follow-up date that fits your decision deadline. If a provider specifies a response window, allow for it. Review each draft below and send through the official contact route. Nothing is sent automatically.</p>${providerSections || '<p>Add providers to your shortlist and download again to include provider-specific questions and drafts.</p>'}<h2>3. Confirm, then tell your guests</h2><p>Ask your chosen provider for written terms, check every unresolved point, and complete its required reservation process. Record the booking reference, receipt, deadlines, and change contact with your private planning notes. Update your guest schedule and addresses only when you know what is arranged.</p><h2>4. Hand off the day-of details</h2><p>Open day-of-run-sheet.csv. Assign one helper to each moment, add confirmed provider contacts, and record setup, transport, and weather arrangements. Download a fresh copy after changing your schedule. Keep the run sheet with the organizing team.</p><h2>5. Send a final guest reminder</h2><p>Review guest-reminder.txt, confirm addresses and arrival details, then send it with the latest guest guide. Check household attendance and practical needs directly with your guests. The kit does not send reminders or collect replies.</p><h2>Your current run of show</h2>${scheduleHtml(workspace)}`);
}

export function downloadFile(filename: string, content: string | Blob, mime = 'text/plain;charset=utf-8'): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportPacket(workspace: Workspace, vendors: Vendor[]): Blob {
  const packet = createPacket(workspace, vendors);
  downloadFile(`${slug(workspace.brief.family || 'santa-cruz')}-reunion-kit.zip`, packet);
  return packet;
}
