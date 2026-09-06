import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['./planner', './action-kit', './vendor-evidence', './guest-guide'].includes(specifier) ? `${specifier}.ts` : specifier, context);
} });
const { assessVendor, recommendVendors, quoteCostType, quoteTotals, parseWorkspace, defaultWorkspace, defaultBrief, suggestTasks, inquiry, makeSchedule } = await import('../lib/planner.ts');
const { comparisonRows } = await import('../lib/action-kit.ts');

const provider = (id, category, capacity = null) => ({ id, category, capacity, name: id, description: 'A group inquiry option', location: 'Santa Cruz', url: 'https://example.com', source: 'https://example.com', checkedAt: '2026-09-06', priceNote: 'Quote required', highlights: [] });
const brief = { ...defaultBrief, family: 'Test family', guests: 100, dinnerGuests: 25, rooms: 20, date: '2027-06-18' };
const evidence = patch => ({ vendorId: 'test', decisionSummary: '', accessibility: { status: 'confirm', details: [] }, bookingSteps: [], questions: [], sources: [], ...patch });
const quote = (id, patch = {}) => ({ id, vendorId: 'hotel', amount: 100, deposit: 0, deadline: '', status: 'quoted', notes: '', ...patch });

test('zero rooms removes lodging recommendations and hotel tasks without losing event providers', () => {
  const dayOnly = { ...brief, rooms: 0 };
  const hotel = provider('test-hotel', 'hotel'), venue = provider('test-venue', 'venue', 100);
  assert.deepEqual(recommendVendors([hotel, venue], dayOnly).map(v => v.id), ['test-venue']);
  assert.equal(assessVendor(hotel, dayOnly).status, 'mismatch');
  assert.ok(!suggestTasks(dayOnly).some(task => task.id === 'hotel'));
  assert.doesNotMatch(inquiry(hotel, dayOnly).body, /approximately 0 rooms/);
  assert.match(inquiry(hotel, dayOnly).subject, /gathering availability/);
  assert.doesNotMatch(makeSchedule(dayOnly)[0].location, /hotel/i);
});

test('unknown capacity is explicitly unresolved; a small room is not an entire property ceiling', () => {
  const restaurant = provider('test-restaurant', 'restaurant');
  const roomEvidence = evidence({ capacity: [{ label: 'Small room', guests: 20, format: 'seated', matchScope: 'one-layout' }] });
  const unknown = assessVendor(restaurant, brief, roomEvidence);
  assert.equal(unknown.status, 'research-lead');
  assert.match(unknown.unresolved.join(' '), /Capacity for 25 welcome-dinner guests is not verified/);
  const known = assessVendor({ ...restaurant, capacity: 20 }, brief, roomEvidence);
  assert.equal(known.status, 'mismatch');
  assert.match(known.reasons.join(' '), /published capacity is 20/);
  assert.equal(assessVendor(provider('test-space', 'venue', 90), brief).status, 'mismatch');
});

test('hotel event capacity is not room inventory; known inventory can identify an oversized block', () => {
  const hotel = provider('test-hotel', 'hotel', 10);
  assert.equal(assessVendor(hotel, brief).status, 'research-lead');
  assert.equal(assessVendor(hotel, brief, evidence({ hotelRooms: 12 })).status, 'mismatch');
  const large = assessVendor(hotel, brief, evidence({ hotelRooms: 100 }));
  assert.equal(large.status, 'research-lead');
  assert.match(large.reasons.join(' '), /not the number available/);
  assert.match(large.unresolved.join(' '), /Availability beginning .* is unverified/);
});

test('a low budget never becomes verified rate fit when rates are unknown', () => {
  const hotel = provider('test-hotel', 'hotel');
  const low = assessVendor(hotel, { ...brief, hotelBudget: 80 });
  const high = assessVendor(hotel, { ...brief, hotelBudget: 800 });
  assert.equal(low.status, 'research-lead');
  assert.equal(high.status, 'research-lead');
  assert.match(low.unresolved.join(' '), /\$80 per room per night.*Obtain a dated rate/);
  assert.match(high.unresolved.join(' '), /\$800 per room per night/);
  const minimum = evidence({ budget: { kind: 'published', note: 'Published minimum before taxes.', minimum: { amount: 200, basis: 'room-night', appliesTo: 'lodging' } } });
  assert.equal(assessVendor(hotel, { ...brief, hotelBudget: 80 }, minimum).status, 'mismatch');
  assert.equal(assessVendor(hotel, { ...brief, hotelBudget: 800 }, minimum).status, 'research-lead');
});

test('a reference menu price is not a mandatory minimum or an all-in quote', () => {
  const food = provider('test-caterer', 'restaurant');
  const assessment = assessVendor(food, { ...brief, budget: 10 }, evidence({ mealService: 'offsite', budget: { kind: 'published', amount: 15.95, unit: 'bag lunch', note: '$15.95 bag lunch; alternatives available.' } }));
  assert.equal(assessment.status, 'research-lead');
  assert.match(assessment.reasons.join(' '), /does not establish an all-in quote or budget fit/);
  assert.match(assessment.unresolved.join(' '), /100 reunion guests/);
  assert.match(assessment.reasons.join(' '), /not a restaurant reservation/);
});

test('documented access details help prioritize an access need without certifying the whole venue', () => {
  const venue = provider('test-space', 'venue', 100);
  const access = evidence({ accessibility: { status: 'documented-features', details: ['Accessible restrooms are listed.'] } });
  const ordinary = assessVendor(venue, brief, access);
  const withNeeds = assessVendor(venue, { ...brief, needs: 'Wheelchair route and vegetarian meals' }, access);
  assert.ok(withNeeds.score > ordinary.score);
  assert.match(withNeeds.reasons.join(' '), /Accessible restrooms.*do not confirm every route/);
  assert.match(withNeeds.unresolved.join(' '), /Wheelchair route and vegetarian meals/);
});

test('hotel event charges count toward events; lodging and estimate evidence remain separate', () => {
  const vendors = [provider('hotel', 'hotel'), provider('park', 'venue')];
  const quotes = [
    quote('rooms', { amount: 6000, deposit: 1000, costType: 'lodging', status: 'confirmed' }),
    quote('catering', { amount: 2000, deposit: 500, costType: 'event' }),
    quote('chairs', { vendorId: 'park', amount: 100, deposit: 50, status: 'estimate', costType: 'event' }),
  ];
  const totals = quoteTotals(quotes, vendors);
  assert.equal(totals.event.recorded, 2100);
  assert.equal(totals.event.documented, 2000);
  assert.equal(totals.event.estimated, 100);
  assert.equal(totals.event.quoted, 2000);
  assert.equal(totals.event.confirmed, 0);
  assert.equal(totals.event.deposits, 550, 'deposits are a recorded requirement, never extra spending');
  assert.equal(totals.lodging.recorded, 6000);
  assert.equal(totals.lodging.confirmed, 6000);
  assert.equal(quoteCostType(quote('legacy-hotel'), vendors), 'lodging');
  assert.equal(quoteCostType(quote('legacy-park', { vendorId: 'park' }), vendors), 'event');
});

test('old backups preserve missing cost type; separate charges at one provider round trip', () => {
  const state = structuredClone(defaultWorkspace);
  state.quotes = [quote('old')];
  assert.deepEqual(parseWorkspace(state), state);
  assert.equal(Object.hasOwn(parseWorkspace(state).quotes[0], 'costType'), false);
  state.quotes = [quote('rooms', { costType: 'lodging' }), quote('meal', { costType: 'event' })];
  assert.deepEqual(parseWorkspace(state).quotes, state.quotes);
  assert.equal(parseWorkspace({ ...state, quotes: [quote('same'), quote('same')] }), null);
  assert.equal(parseWorkspace({ ...state, quotes: [quote('bad', { costType: 'unknown' })] }), null);
  state.selected = ['hotel'];
  const rows = comparisonRows(state, [provider('hotel', 'hotel')]);
  assert.equal(rows.length, 3);
  assert.equal(rows[1][18], 'lodging');
  assert.equal(rows[2][18], 'event');
  assert.match(rows[2][2], /Hotel event charge/);
});

test('alternative proposals stay in the comparison but do not inflate the chosen budget', () => {
  const state = structuredClone(defaultWorkspace), vendors = [provider('hotel', 'hotel')];
  state.selected = ['hotel'];
  state.quotes = [quote('chosen', { amount: 2000, deposit: 500, costType: 'event' }), quote('alternative', { amount: 4000, deposit: 1000, costType: 'event', includedInBudget: false })];
  const totals = quoteTotals(state.quotes, vendors);
  assert.equal(totals.event.recorded, 2000);
  assert.equal(totals.event.deposits, 500);
  assert.deepEqual(parseWorkspace(state).quotes, state.quotes);
  assert.equal(parseWorkspace({ ...state, quotes: [quote('bad', { includedInBudget: 'no' })] }), null);
  const rows = comparisonRows(state, vendors);
  assert.equal(rows.length, 3);
  assert.equal(rows[1][20], 'Yes');
  assert.equal(rows[2][20], 'No — alternative proposal');
});

test('explicit guest selection survives restore and obsolete schedule references are removed', () => {
  const state = structuredClone(defaultWorkspace);
  assert.equal(Object.hasOwn(parseWorkspace(state), 'guestSettings'), false);
  state.guestSettings = { scheduleIds: ['arrival', 'arrival', 'removed'], confirmedLocationIds: ['arrival', 'welcome', 'removed'] };
  assert.deepEqual(parseWorkspace(state).guestSettings, { scheduleIds: ['arrival'], confirmedLocationIds: ['arrival'] });
  assert.equal(parseWorkspace({ ...state, guestSettings: { scheduleIds: [3], confirmedLocationIds: [] } }), null);
  assert.equal(parseWorkspace({ ...state, guestSettings: { scheduleIds: Array(101).fill('arrival'), confirmedLocationIds: [] } }), null);
});
