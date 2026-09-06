import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

// The app uses Next's extensionless TypeScript imports; resolve that single local
// import when testing the same files directly under Node's type stripping.
registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['./planner', './action-kit'].includes(specifier) ? `${specifier}.ts` : specifier, context);
} });
const { defaultBrief, defaultWorkspace, dateLabel, inquiry, makeSchedule, recommendVendors, suggestTasks, parseWorkspace } = await import('../lib/planner.ts');
const { createPacket, csvCell, guestGuideHtml } = await import('../lib/exports.ts');

const vendor = (id, category, capacity, extra = {}) => ({ id, category, capacity, name: id, location: 'Santa Cruz', description: 'Researched option', email: 'events@example.com', url: 'https://example.com/events', source: 'https://example.com/events', checkedAt: '2026-09-06', priceNote: 'Quote required', highlights: [], ...extra });
const brief = { ...defaultBrief, family: 'Rivera', guests: 100, dinnerGuests: 25, rooms: 20, date: '2027-06-18', organizer: 'Alex', email: 'alex@example.com' };
const workspace = () => ({ ...structuredClone(defaultWorkspace), brief: { ...brief }, created: true, schedule: makeSchedule(brief) });

test('meal and gathering capacity use different headcounts; hotel event capacity is not room inventory', () => {
  const providers = [vendor('dinner-30', 'restaurant', 30), vendor('dinner-20', 'restaurant', 20), vendor('venue-90', 'venue', 90), vendor('venue-100', 'venue', 100), vendor('hotel', 'hotel', 10), vendor('unknown', 'venue', null)];
  assert.deepEqual(new Set(recommendVendors(providers, brief).map(v => v.id)), new Set(['dinner-30', 'venue-100', 'hotel', 'unknown']));
});

test('inquiries use provider-specific counts and do not imply bookings', () => {
  const restaurant = inquiry(vendor('restaurant', 'restaurant', 30), brief);
  assert.match(restaurant.body, /meal for approximately 25 people/);
  assert.match(restaurant.body, /not a reservation/);
  const hotel = inquiry(vendor('hotel', 'hotel', null), brief);
  assert.match(hotel.body, /20 rooms for 2 nights/);
  assert.match(hotel.body, /unbooked rooms/);
  const flexible = inquiry(vendor('hotel', 'hotel', null), { ...brief, date: '' });
  assert.match(flexible.body, /dates are still flexible/);
  assert.doesNotMatch(flexible.body, /Invalid Date/);
});

test('date rendering is calendar-stable across offsets and handles unknown or invalid dates', () => {
  assert.match(dateLabel('2027-12-31', 1), /Jan 1, 2028/);
  assert.equal(dateLabel('2027-02-30'), 'Dates to be decided');
  assert.equal(dateLabel(''), 'Dates to be decided');
  assert.equal(dateLabel('', 2), 'Day 3');
});

test('schedule and conditional tasks carry the family brief', () => {
  assert.match(makeSchedule({ ...brief, style: 'redwoods' }).find(i => i.id === 'gathering').title, /redwoods/);
  assert.match(makeSchedule(brief).find(i => i.id === 'welcome').notes, /25 people/);
  assert.ok(suggestTasks({ ...brief, needs: 'Step-free route' }).find(t => t.id === 'access'));
  assert.equal(suggestTasks(brief).filter(t => t.id === 'access').length, 0);
});

test('one-night schedule ends after the gathering and every extra day has an activity', () => {
  const overnight = makeSchedule({ ...brief, nights: 1 });
  assert.ok(overnight.every(item => /^([01]\d|2[0-3]):[0-5]\d$/.test(item.time)));
  const gathering = overnight.find(item => item.id === 'gathering');
  const farewell = overnight.find(item => item.id === 'farewell');
  assert.equal(farewell.day, 1);
  assert.ok(farewell.time > gathering.time);
  const longer = makeSchedule({ ...brief, nights: 5 });
  assert.deepEqual([...new Set(longer.map(item => item.day))], [0, 1, 2, 3, 4, 5]);
});

test('guest guide escapes user content and excludes organizer budgets, quotes and notes', () => {
  const state = workspace();
  state.brief.family = '<script>alert(1)</script>';
  state.brief.notes = 'PRIVATE-ORGANIZER-NOTE';
  state.brief.needs = 'PRIVATE-ACCESS-NOTE';
  state.guestMessage = '<img src=x onerror=alert(1)>';
  state.quotes = [{ id: 'q', vendorId: 'x', amount: 98765, deposit: 1234, deadline: '', status: 'quoted', notes: 'PRIVATE-QUOTE' }];
  const html = guestGuideHtml(state, []);
  assert.doesNotMatch(html, /<script>|<img|PRIVATE-|98,765/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /mailto:alex@example.com/);
  assert.match(html, /does not collect or track RSVPs/);
  assert.match(html, /not a live website/);
});

test('CSV cells neutralize spreadsheet formulas and preserve quotes', () => {
  assert.equal(csvCell('=HYPERLINK("https://evil")'), '"\'=HYPERLINK(""https://evil"")"');
  assert.equal(csvCell('  +cmd'), '"\'  +cmd"');
  assert.equal(csvCell('normal, value'), '"normal, value"');
});

test('backup validation rejects malformed state and strips unrecognized fields', () => {
  const state = workspace();
  assert.deepEqual(parseWorkspace(state), state);
  assert.deepEqual(parseWorkspace({ workspace: state }), state);
  assert.equal(parseWorkspace({ ...state, brief: { ...state.brief, guests: '<script>' } }), null);
  assert.equal(parseWorkspace({ ...state, brief: { ...state.brief, style: 'unknown' } }), null);
  assert.equal(parseWorkspace({ ...state, schedule: [{ title: 'Missing fields' }] }), null);
  assert.equal(parseWorkspace({ ...state, quotes: [{ id: 'missing' }] }), null);
  assert.equal(parseWorkspace({ ...state, selected: [123] }), null);
  assert.equal(parseWorkspace({ ...state, unknownField: true }).unknownField, undefined);
});

test('backup validation enforces related counts, planning bounds and quote terms', () => {
  assert.ok(parseWorkspace(structuredClone(defaultWorkspace)), 'empty-family example remains valid');
  const state = workspace();
  for (const patch of [{ guests: 1 }, { guests: 2001 }, { dinnerGuests: 101 }, { dinnerGuests: 0 }, { rooms: 1001 }, { nights: 0 }, { nights: 15 }]) assert.equal(parseWorkspace({ ...state, brief: { ...state.brief, ...patch } }), null);
  const quote = { id: 'q', vendorId: 'hotel', amount: 100, deposit: 50, deadline: '2027-05-01', status: 'quoted', notes: '' };
  assert.ok(parseWorkspace({ ...state, quotes: [quote] }));
  assert.equal(parseWorkspace({ ...state, quotes: [{ ...quote, deposit: 101 }] }), null);
  assert.equal(parseWorkspace({ ...state, quotes: [{ ...quote, deadline: '2027-02-30' }] }), null);
  assert.ok(parseWorkspace({ ...state, quotes: [{ ...quote, deadline: '' }] }));
});

async function readStoredZip(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer()), view = new DataView(bytes.buffer), decoder = new TextDecoder(), entries = new Map();
  let offset = 0;
  while (view.getUint32(offset, true) === 0x04034b50) {
    assert.equal(view.getUint16(offset + 8, true), 0, 'ZIP uses STORE compression');
    const size = view.getUint32(offset + 18, true), nameLength = view.getUint16(offset + 26, true), extraLength = view.getUint16(offset + 28, true);
    const name = decoder.decode(bytes.slice(offset + 30, offset + 30 + nameLength));
    const start = offset + 30 + nameLength + extraLength;
    entries.set(name, decoder.decode(bytes.slice(start, start + size)));
    offset = start + size;
  }
  assert.equal(view.getUint32(offset, true), 0x02014b50, 'central directory exists');
  assert.equal(view.getUint32(bytes.length - 22, true), 0x06054b50, 'archive has an end record');
  assert.equal(view.getUint16(bytes.length - 12, true), entries.size);
  return entries;
}

test('packet contains restorable data, real individual drafts and portable guest/organizer files', async () => {
  const state = workspace();
  const providers = [vendor('Email Hotel', 'hotel', null), vendor('Form Restaurant', 'restaurant', 30, { email: undefined })];
  state.selected = providers.map(v => v.id);
  state.quotes = [{ id: 'q1', vendorId: 'Email Hotel', amount: 1200, deposit: 300, deadline: '2027-05-01', status: 'estimate', notes: '=unsafe()' }];
  const files = await readStoredZip(createPacket(state, providers));
  for (const name of ['reunion-plan.html', 'budget.csv', 'contacts.csv', 'invitation.txt', 'backup.json', 'guest-guide.html']) assert.ok(files.has(name), name);
  assert.deepEqual(JSON.parse(files.get('backup.json')), state);
  const draft = files.get('inquiries/01-email-hotel.eml');
  assert.match(draft, /To: events@example.com\r\n/);
  assert.match(draft, /X-Unsent: 1/);
  assert.ok(!files.has('inquiries/02-form-restaurant.eml'));
  assert.match(files.get('inquiries/02-form-restaurant.txt'), /Use the official form or phone/);
  assert.match(files.get('budget.csv'), /Organizer planning estimate/);
  assert.match(files.get('budget.csv'), /'=unsafe/);
});

test('untrusted recipient or URL cannot become an email header or executable link', async () => {
  const state = workspace(); state.selected = ['bad'];
  const providers = [vendor('bad', 'hotel', null, { email: 'x@example.com\r\nBcc: thief@example.com', url: 'javascript:alert(1)', source: 'javascript:alert(2)' })];
  const files = await readStoredZip(createPacket(state, providers));
  assert.ok(![...files.keys()].some(key => key.endsWith('.eml')));
  assert.doesNotMatch(files.get('guest-guide.html'), /href="javascript:/);
});

test('edited outreach body survives backup restore and both text and email exports', async () => {
  const state = workspace(), provider = vendor('hotel', 'hotel', null);
  state.selected = ['hotel'];
  state.drafts = { hotel: 'Hello team,\nPlease use our revised arrival details.\nThanks, Alex' };
  const restored = parseWorkspace(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.drafts.hotel, state.drafts.hotel);
  const files = await readStoredZip(createPacket(restored, [provider]));
  assert.match(files.get('inquiries/01-hotel.txt'), /Please use our revised arrival details/);
  const eml = files.get('inquiries/01-hotel.eml');
  assert.equal(Buffer.from(eml.split('\r\n\r\n')[1].replace(/\s/g, ''), 'base64').toString('utf8'), state.drafts.hotel);
  assert.equal(JSON.parse(files.get('backup.json')).drafts.hotel, state.drafts.hotel);
  assert.equal(parseWorkspace({ ...state, drafts: { hotel: 123 } }), null);
  assert.equal(parseWorkspace({ ...state, drafts: { hotel: 'x'.repeat(15001) } }), null);
  assert.equal(parseWorkspace({ ...state, drafts: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [`v${i}`, 'draft'])) }), null);
  const legacy = { ...state }; delete legacy.drafts;
  assert.deepEqual(parseWorkspace(legacy).drafts, {});
});
