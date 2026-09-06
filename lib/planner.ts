export type Brief = {
  family: string; organizer: string; email: string; date: string;
  guests: number; dinnerGuests: number; rooms: number; nights: number;
  budget: number; hotelBudget: number; style: 'beach' | 'redwoods' | 'resort';
  needs: string; notes: string;
};

export type Vendor = {
  id: string; name: string; category: 'hotel' | 'restaurant' | 'venue';
  location: string; description: string; capacity: number | null;
  email?: string; url: string; priceNote: string; highlights: string[];
  image?: string; source: string; checkedAt: string;
};

export type Quote = {
  id: string; vendorId: string; amount: number; deposit: number;
  deadline: string; status: 'estimate' | 'quoted' | 'confirmed'; notes: string;
};

export type ScheduleItem = {
  id: string; day: number; time: string; title: string; location: string; notes: string;
};

export type Workspace = {
  brief: Brief; selected: string[]; completed: string[]; quotes: Quote[];
  schedule: ScheduleItem[]; guestMessage: string; created: boolean;
};

export const defaultBrief: Brief = {
  family: '', organizer: '', email: '', date: '', guests: 60, dinnerGuests: 25,
  rooms: 20, nights: 2, budget: 5000, hotelBudget: 225, style: 'beach',
  needs: '', notes: '',
};

export function money(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(Number.isFinite(amount) ? amount : 0);
}

export function dateLabel(value: string, dayOffset = 0): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return dayOffset ? `Day ${dayOffset + 1}` : 'Dates to be decided';
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) return 'Dates to be decided';
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function makeSchedule(brief: Brief): ScheduleItem[] {
  const gathering = {
    beach: { title: 'Our big beach gathering', location: 'Santa Cruz beach · location to confirm', notes: 'Confirm the permitted gathering area, access, shade, catering rules, and an indoor weather alternative.' },
    redwoods: { title: 'A picnic under the redwoods', location: 'Redwood picnic area · location to confirm', notes: 'Confirm group reservations, accessible routes, picnic facilities, catering rules, and a weather alternative.' },
    resort: { title: 'Everyone together at the hotel', location: 'Hotel event space · location to confirm', notes: 'Request a room layout, an all-in event proposal, accessibility details, and setup and cleanup arrangements.' },
  }[brief.style];
  const nights = Math.min(14, Math.max(1, Math.trunc(brief.nights) || 1));
  const schedule: ScheduleItem[] = [
    { id: 'arrival', day: 0, time: '15:00', title: 'Arrive & settle in', location: 'Your chosen hotel', notes: 'Check-in times and booking links will be added after you confirm lodging.' },
    { id: 'welcome', day: 0, time: '18:00', title: 'An easy welcome dinner', location: 'Group restaurant · to confirm', notes: `Plan for approximately ${brief.dinnerGuests} people. Confirm the final count, menu, dietary needs, and total price.` },
    { id: 'gathering', day: 1, time: '11:00', ...gathering },
    { id: 'free-time', day: 1, time: nights === 1 ? '13:00' : '15:00', title: 'A little Santa Cruz time', location: 'Choose your own adventure', notes: 'Leave room for a walk, a nap, beach time, or exploring together. Keep optional activities optional.' },
  ];
  for (let day = 2; day < nights; day++) schedule.push({ id: `explore-${day}`, day, time: '10:00', title: 'A day at your own pace', location: 'Santa Cruz · choose together', notes: 'Keep this day flexible for exploring, resting, or smaller family get-togethers. Confirm opening hours and any activity reservations separately.' });
  schedule.push({ id: 'farewell', day: nights, time: nights === 1 ? '15:00' : '09:00', title: nights === 1 ? 'One last hug & goodbyes' : 'Coffee, hugs & goodbyes', location: 'Meetup spot · to confirm', notes: nights === 1 ? 'Say goodbye after the gathering. Arrange luggage storage and check out of your hotel before the day’s activities if needed.' : 'A relaxed goodbye before everyone heads home. Check hotel checkout times.' });
  return schedule;
}

export const defaultWorkspace: Workspace = {
  brief: { ...defaultBrief }, selected: [], completed: [], quotes: [],
  schedule: makeSchedule(defaultBrief), guestMessage: '', created: false,
};

/** Validate untrusted imports and browser storage before using them as app state. */
export function parseWorkspace(value: unknown): Workspace | null {
  const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  const string = (v: unknown, max = 5000): v is string => typeof v === 'string' && v.length <= max;
  const number = (v: unknown, max = 1000000): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max;
  if (!record(value)) return null;
  const w = record(value.workspace) ? value.workspace : value;
  if (!record(w.brief)) return null;
  const b = w.brief;
  if (!['family', 'organizer', 'email', 'date', 'needs', 'notes'].every(key => string(b[key]))) return null;
  if (!['guests', 'dinnerGuests', 'rooms', 'nights', 'budget', 'hotelBudget'].every(key => number(b[key]))) return null;
  if (!['guests', 'dinnerGuests', 'rooms', 'nights'].every(key => Number.isInteger(b[key]))) return null;
  if ((b.guests as number) < 2 || (b.guests as number) > 2000 || (b.dinnerGuests as number) < 1 || (b.dinnerGuests as number) > (b.guests as number) || (b.rooms as number) > 1000 || (b.nights as number) < 1 || (b.nights as number) > 14) return null;
  if (!['beach', 'redwoods', 'resort'].includes(String(b.style))) return null;
  if (b.date !== '' && (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.date)) || dateLabel(String(b.date)) === 'Dates to be decided')) return null;
  if (!Array.isArray(w.selected) || !Array.isArray(w.completed) || !Array.isArray(w.quotes) || !Array.isArray(w.schedule)) return null;
  if (![w.selected, w.completed, w.quotes, w.schedule].every(items => items.length <= 1000)) return null;
  if (![...w.selected, ...w.completed].every(id => string(id, 200))) return null;
  if (!string(w.guestMessage) || typeof w.created !== 'boolean') return null;
  const quotes: Quote[] = [];
  for (const q of w.quotes) {
    if (!record(q) || !['id', 'vendorId', 'deadline', 'notes'].every(key => string(q[key])) || !number(q.amount) || !number(q.deposit) || !['estimate', 'quoted', 'confirmed'].includes(String(q.status))) return null;
    if (q.deposit > q.amount || (q.deadline !== '' && (!/^\d{4}-\d{2}-\d{2}$/.test(String(q.deadline)) || dateLabel(String(q.deadline)) === 'Dates to be decided'))) return null;
    quotes.push({ id: q.id as string, vendorId: q.vendorId as string, deadline: q.deadline as string, notes: q.notes as string, amount: q.amount, deposit: q.deposit, status: q.status as Quote['status'] });
  }
  const schedule: ScheduleItem[] = [];
  for (const item of w.schedule) {
    if (!record(item) || !['id', 'time', 'title', 'location', 'notes'].every(key => string(item[key])) || !number(item.day, 365) || !Number.isInteger(item.day)) return null;
    schedule.push({ id: item.id as string, time: item.time as string, title: item.title as string, location: item.location as string, notes: item.notes as string, day: item.day });
  }
  return {
    brief: { family: b.family as string, organizer: b.organizer as string, email: b.email as string, date: b.date as string, needs: b.needs as string, notes: b.notes as string, guests: b.guests as number, dinnerGuests: b.dinnerGuests as number, rooms: b.rooms as number, nights: b.nights as number, budget: b.budget as number, hotelBudget: b.hotelBudget as number, style: b.style as Brief['style'] },
    selected: [...new Set(w.selected as string[])], completed: [...new Set(w.completed as string[])], quotes, schedule, guestMessage: w.guestMessage, created: w.created,
  };
}

function positive(value: number) { return Number.isFinite(value) ? Math.max(0, value) : 0; }

export function recommendVendors(vendors: Vendor[], brief: Brief): Vendor[] {
  return vendors.filter(vendor => {
    if (vendor.category === 'hotel') return true;
    const count = vendor.category === 'restaurant' ? brief.dinnerGuests : brief.guests;
    return vendor.capacity === null || vendor.capacity >= positive(count);
  }).sort((a, b) => {
    const score = (vendor: Vendor) => {
      const text = `${vendor.name} ${vendor.description} ${vendor.highlights.join(' ')}`.toLowerCase();
      const keywords = brief.style === 'beach' ? /beach|coast|waterfront|ocean/ : brief.style === 'redwoods' ? /redwood|forest|picnic|park/ : /resort|hotel|staff|indoor/;
      return (keywords.test(text) ? 2 : 0) + (vendor.capacity !== null ? 1 : 0);
    };
    return score(b) - score(a);
  });
}

export function suggestTasks(brief: Brief): { id: string; title: string; detail: string }[] {
  const tasks = [
    { id: 'dates', title: brief.date ? 'Confirm the dates with your family' : 'Choose a weekend together', detail: brief.date ? `Your current start date is ${dateLabel(brief.date)}. Check with key households before requesting firm quotes.` : 'Offer your family two or three date options before making commitments.' },
    { id: 'headcount', title: 'Get a first headcount', detail: `Start with ${brief.guests} reunion guests, ${brief.dinnerGuests} at dinner, and ${brief.rooms} hotel rooms. These are separate counts.` },
    { id: 'venue', title: brief.style === 'beach' ? 'Check the beach gathering process' : brief.style === 'redwoods' ? 'Find your group picnic space' : 'Request an event-space proposal', detail: 'Confirm capacity, access, rules, fees, setup, and an alternative for poor weather. A recommendation is not a reservation.' },
    { id: 'hotel', title: 'Request comparable hotel quotes', detail: `Ask about ${brief.rooms} rooms for ${brief.nights} nights, targeting ${money(brief.hotelBudget)} per room per night. Confirm taxes, parking, room-block terms, and cutoffs.` },
    { id: 'dinner', title: 'Find the right welcome dinner', detail: `Contact restaurants for ${brief.dinnerGuests} guests. Ask for an all-in proposal including service charges and minimum spend.` },
    { id: 'budget', title: 'Replace estimates with actual quotes', detail: `Your shared-event target is ${money(brief.budget)}. Keep household hotel bills separate and record unknown fees.` },
    { id: 'weather', title: 'Choose a weather backup', detail: 'Keep a practical covered or indoor option. Confirm the switch deadline and any added cost.' },
    { id: 'guests', title: 'Prepare your guest guide', detail: 'Review the schedule and contact details, then download a guide to send to your family. Keep unconfirmed arrangements labeled.' },
  ];
  if (brief.needs.trim()) tasks.splice(3, 0, { id: 'access', title: 'Confirm your family’s practical needs', detail: `${brief.needs.trim()} — ask each provider for specific confirmation before committing.` });
  return tasks;
}

export function inquiry(vendor: Vendor, brief: Brief): { subject: string; body: string } {
  const family = brief.family.trim() || 'our family';
  const subject = `${family} reunion — ${vendor.category === 'hotel' ? 'group room rates' : vendor.category === 'restaurant' ? 'group dining inquiry' : 'gathering availability'} — ${brief.date || 'flexible dates'}`.replace(/[\r\n]/g, ' ');
  const timing = brief.date ? `Our reunion begins ${dateLabel(brief.date)} and we are planning ${brief.nights} night${brief.nights === 1 ? '' : 's'}.` : `Our dates are still flexible; we are planning a ${brief.nights}-night reunion and would welcome suitable date options.`;
  const details = vendor.category === 'hotel'
    ? `We expect to need approximately ${brief.rooms} rooms for ${brief.nights} nights. Our target is ${money(brief.hotelBudget)} per room per night; please specify whether taxes and fees are included. Guests would normally book and pay individually.\n\nCould you share availability, room types, all-in rates, parking and breakfast costs, minimum stay, accessible room options, and room-block terms? Please include deposits, cancellation terms, responsibility for unbooked rooms, booking cutoffs, and quote expiry.`
    : vendor.category === 'restaurant'
      ? `We are considering a seated group meal for approximately ${brief.dinnerGuests} people. Our full reunion has ${brief.guests} attendees, but this inquiry is specifically for the smaller meal. Meal date and time can be discussed.\n\nCould you confirm suitable spaces and availability, seated capacity, whether our group would share a space or use multiple rooms, menu options, dietary accommodations, minimum spend, room fees, taxes, service charges and gratuities? Please also include deposits, cancellation terms, final-count deadlines, and whether separate checks are possible.`
      : `We are considering a ${brief.style === 'beach' ? 'beach gathering' : brief.style === 'redwoods' ? 'redwood picnic' : 'hotel or resort gathering'} for approximately ${brief.guests} people.\n\nCould you advise on availability, the appropriate space and capacity, reservation or permit steps, total fees, setup and cleanup time, catering and equipment rules, parking, restrooms, accessible routes, and weather or cancellation alternatives? Please identify what would be reserved and any required documents or deadlines.`;
  const needs = brief.needs.trim() ? `\n\nPractical needs to plan around: ${brief.needs.trim()}` : '';
  const notes = brief.notes.trim() ? `\n\nAdditional context: ${brief.notes.trim()}` : '';
  return { subject, body: `Hello ${vendor.name} team,\n\nI’m organizing a reunion for ${family} in Santa Cruz. ${timing}\n\n${details}${needs}${notes}\n\nThis is an availability and pricing inquiry, not a reservation or acceptance of any terms.\n\nThank you,\n${brief.organizer.trim() || 'Reunion organizer'}${brief.email.trim() ? `\n${brief.email.trim()}` : ''}` };
}
