import { dateLabel, quoteCostType } from './planner';
import type { Brief, Vendor, Workspace } from './planner';

const catering = (vendor: Vendor) => vendor.id === 'zoccolis';

/** Questions to resolve with a provider, never a statement of their terms. */
export function bookingChecks(vendor: Vendor): string[] {
  if (vendor.category === 'hotel') return [
    'Confirm room types, room count, arrival and departure dates, and accessible-room availability.',
    'Request the total per room per night including taxes, mandatory fees, parking, and breakfast; identify anything excluded.',
    'Ask whether the block is courtesy or contracted, the booking cutoff, minimum stay, and responsibility for unbooked rooms (attrition).',
    'Confirm the deposit, who pays it, payment dates, cancellation terms, and quote expiry.',
    'Request the guest booking link or reservation instructions and the group sales contact.',
    'If you need gathering space, obtain a separate event proposal, capacity by layout, and food-and-beverage minimums.',
  ];
  if (catering(vendor)) return [
    'Confirm the menu, portions, quantity, dietary accommodations, and the number of people the order will serve.',
    'Request the total including taxes, packaging, delivery if offered, and any other charges.',
    'Confirm order lead time, final-count deadline, payment, and cancellation terms.',
    'Agree on pickup or delivery time, the exact address, and who is responsible for transport and food service.',
    'Ask what equipment, serving supplies, food storage, and cleanup arrangements you must provide.',
    'Confirm separately that your gathering location permits the planned food service.',
  ];
  if (vendor.category === 'restaurant') return [
    'Confirm the meal date, time, seated headcount, room layout, and whether everyone can sit together.',
    'Request the full menu price, minimum spend, room fee, taxes, service charge, and gratuity policy.',
    'Ask about dietary accommodations, children’s meals, drinks, and separate checks.',
    'Confirm deposit and payment dates, cancellation terms, final-count deadline, and quote expiry.',
    'Confirm accessible entry, restrooms, parking, and how long the group may use the space.',
    'Request written reservation details and the contact for changes or arrival-day questions.',
  ];
  return [
    'Confirm the exact reservable area, headcount, permitted activities, and what remains open to other visitors.',
    'Ask which reservation or permit is needed, how to apply, lead times, required documents, and total fees.',
    'Confirm food service, alcohol, amplified sound, equipment, setup, and cleanup rules for your event.',
    'Confirm accessible routes, parking, restrooms, shade, and loading or unloading arrangements.',
    'Agree on a weather alternative, the decision deadline, cancellation terms, and any additional charges.',
    'Request written reservation details, allowed access hours, and an event-day contact.',
  ];
}

function eventContext(vendor: Vendor, brief: Brief): string {
  const count = vendor.category === 'hotel' && brief.rooms > 0
    ? `${brief.rooms} rooms for ${brief.nights} nights`
    : `${vendor.category === 'restaurant' && !catering(vendor) ? brief.dinnerGuests : brief.guests} people`;
  return `${brief.family.trim() || 'our family'} reunion in Santa Cruz, starting ${dateLabel(brief.date)}, for ${count}`;
}

function signature(brief: Brief): string {
  return `${brief.organizer.trim() || 'Reunion organizer'}${brief.email.trim() ? `\n${brief.email.trim()}` : ''}`;
}

export function followUp(vendor: Vendor, brief: Brief): string {
  return `Hello ${vendor.name} team,\n\nI’m following up on an inquiry about ${eventContext(vendor, brief)}.\n\nAre you able to accommodate the request? If so, could you share availability, a written price breakdown, the terms we would need to review, and how long the offer is valid? If our dates or group size do not fit, please let us know what alternatives you could offer.\n\n${brief.needs.trim() ? `Please also address these practical needs: ${brief.needs.trim()}\n\n` : ''}We are comparing options. This message does not reserve space or accept any terms.\n\nThank you,\n${signature(brief)}`;
}

export function confirmationRequest(vendor: Vendor, brief: Brief): string {
  return `Hello ${vendor.name} team,\n\nBefore we decide whether to proceed with ${eventContext(vendor, brief)}, could you send the written details and next steps for our review?\n\n${bookingChecks(vendor).map((check, index) => `${index + 1}. ${check}`).join('\n\n')}\n\nPlease identify any information you still need from us. We will review your written proposal before making a commitment. This request is not acceptance of a quote or confirmation of a booking.\n\nThank you,\n${signature(brief)}`;
}

export function guestReminder(workspace: Workspace): string {
  const b = workspace.brief;
  return `${b.family.trim() || 'Our family'} reunion — a quick note before you travel\n\nWe’re looking forward to seeing you in Santa Cruz!\n\nCurrent start date: ${dateLabel(b.date)}\n\nPlease check these details with us before setting off:\n• Your arrival time, confirmed hotel reservation, and transport.\n• The exact meeting addresses and parking or accessible arrival directions.\n• Which meals and activities your household plans to join.\n• Any changes to the schedule or weather backup.\n\n${workspace.schedule.map(item => `${dateLabel(b.date, item.day)} · ${item.time} · ${item.title}\n${item.location || 'Location to confirm'}`).join('\n\n')}\n\nBring layers, comfortable shoes, sun protection, and a refillable water bottle. If you have a question or your plans have changed, contact ${b.organizer.trim() || 'the organizer'}${b.email.trim() ? ` at ${b.email.trim()}` : ''}.\n\nOrganizer: review this draft, replace unconfirmed arrangements, and remove this line before sharing. This message has not been sent.\n`;
}

export function comparisonRows(workspace: Workspace, vendors: Vendor[]): unknown[][] {
  const rows: unknown[][] = [[
    'Provider', 'Type', 'Your inquiry scope', 'Recorded amount USD', 'Amount evidence',
    'Recorded deposit USD (part of total)', 'Recorded deadline', 'All-in price basis / what is excluded',
    'Capacity and exact space / room types', 'Taxes and mandatory fees', 'Parking / breakfast or service charge / gratuity',
    'Room block cutoff and attrition / minimum spend / permit steps', 'Cancellation and payment terms',
    'Access and practical needs', 'Weather alternative where relevant', 'Provider response date', 'Source or quote reference', 'Organizer notes',
    'Cost category', 'Quote record ID', 'Included in working budget',
  ]];
  for (const vendor of vendors.filter(v => workspace.selected.includes(v.id))) {
    const quotes = workspace.quotes.filter(q => q.vendorId === vendor.id);
    const unknown = 'Not recorded — ask provider';
    for (const quote of quotes.length ? quotes : [undefined]) rows.push([
      vendor.name, catering(vendor) ? 'catering' : vendor.category, quote && vendor.category === 'hotel' && quoteCostType(quote, vendors) === 'event' ? `Hotel event charge; ${workspace.brief.guests} total reunion guests. Confirm the exact meal or gathering scope in this proposal.` : eventContext(vendor, workspace.brief),
      quote ? quote.amount : unknown,
      quote ? (quote.status === 'estimate' ? 'Organizer estimate — not a provider quote' : `${quote.status} — recorded by organizer`) : 'No quote recorded',
      quote ? quote.deposit : unknown, quote?.deadline || unknown,
      unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown,
      vendor.url, quote?.notes || '',
      quote ? quoteCostType(quote, vendors) : 'Not recorded', quote?.id || '', quote ? quote.includedInBudget === false ? 'No — alternative proposal' : 'Yes' : 'Not recorded',
    ]);
  }
  return rows;
}

export function runSheetRows(workspace: Workspace): unknown[][] {
  return [
    ['Date', 'Time', 'Moment', 'Meeting location', 'Guest-facing notes', 'Lead helper', 'Confirmed provider contact', 'Setup / transport details', 'Weather alternative'],
    ...workspace.schedule.map(item => [dateLabel(workspace.brief.date, item.day), item.time, item.title, item.location, item.notes, 'Assign a helper', 'Add confirmed contact', 'Complete with your team', 'Confirm if needed']),
  ];
}
