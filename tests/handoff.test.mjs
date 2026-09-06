import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['./planner', './vendor-evidence', './vendors'].includes(specifier) ? `${specifier}.ts` : specifier, context);
} });
const { rebuildWorkspace, blueprintQuoteIds } = await import('../lib/planning-handoff.ts');
const { defaultWorkspace, defaultBrief, makeSchedule, quoteTotals, parseWorkspace } = await import('../lib/planner.ts');
const { vendors } = await import('../lib/vendors.ts');

function workspace(patch = {}) {
  const brief = { ...defaultBrief, family: 'Handoff test', guests: 100, dinnerGuests: 60, nights: 4, ...patch };
  return { ...structuredClone(defaultWorkspace), brief, schedule: makeSchedule(brief), created: true };
}

test('shortening four nights to one removes only untouched generated extra days', () => {
  const state = workspace();
  state.schedule.find(item => item.id === 'explore-2').title = 'A personally arranged cousin dinner';
  state.schedule.push({ id: 'custom', day: 4, time: '12:00', title: 'Stay behind with cousins', location: 'Personal meeting point', notes: 'Keep my edit' });
  state.guestSettings = { scheduleIds: ['arrival', 'explore-2', 'explore-3', 'custom'], confirmedLocationIds: ['arrival', 'explore-2'] };
  const next = rebuildWorkspace(state, { ...state.brief, nights: 1 });
  assert.equal(next.schedule.some(item => item.id === 'explore-3'), false);
  assert.equal(next.schedule.find(item => item.id === 'explore-2').title, 'A personally arranged cousin dinner');
  assert.equal(next.schedule.find(item => item.id === 'custom').day, 4);
  assert.equal(next.schedule.find(item => item.id === 'farewell').day, 1);
  assert.deepEqual(next.guestSettings, { scheduleIds: ['arrival', 'explore-2', 'custom'], confirmedLocationIds: [] });
  assert.ok(parseWorkspace(next));
  assert.equal(state.schedule.find(item => item.id === 'farewell').day, 4, 'input is untouched');
});

test('template matching survives backup field order, and deleted personal choices stay deleted', () => {
  const state = parseWorkspace(workspace());
  state.schedule = state.schedule.filter(item => item.id !== 'welcome');
  const next = rebuildWorkspace(state, { ...state.brief, nights: 1 });
  assert.equal(next.schedule.some(item => item.id === 'explore-2' || item.id === 'explore-3'), false);
  assert.equal(next.schedule.some(item => item.id === 'welcome'), false);
});

test('100-person blueprint screens a 60-person dinner and loads the two sourced subtotals', () => {
  const state = workspace();
  const unknown = rebuildWorkspace(state, state.brief, { blueprintResidency: 'unknown' });
  assert.equal(unknown.selected.includes('crows-nest'), false);
  assert.ok(unknown.selected.includes('delaveaga'));
  assert.ok(unknown.selected.includes('hampton-santa-cruz'));
  assert.equal(quoteTotals(unknown.quotes, vendors).event.estimated, 1922);
  assert.equal(unknown.quotes.find(quote => quote.id === blueprintQuoteIds.venue).amount, 327);
  assert.match(unknown.quotes.find(quote => quote.id === blueprintQuoteIds.venue).notes, /planning assumption.*residency is unconfirmed/);
  assert.match(unknown.quotes.find(quote => quote.id === blueprintQuoteIds.food).notes, /100 bag lunches × \$15\.95/);
  assert.ok(unknown.quotes.every(quote => quote.notes.includes('https://')));
  const resident = rebuildWorkspace(state, state.brief, { blueprintResidency: 'resident' });
  assert.equal(quoteTotals(resident.quotes, vendors).event.estimated, 1846);
  assert.equal(resident.quotes.find(quote => quote.id === blueprintQuoteIds.venue).amount, 251);
});

test('zero-room blueprint excludes lodging and repeated loading replaces only its own quote IDs', () => {
  const state = workspace({ rooms: 0, dinnerGuests: 40 });
  state.quotes = [{ id: 'organizer-chair-rental', vendorId: 'delaveaga', amount: 450, deposit: 50, deadline: '', status: 'quoted', notes: 'A separate real proposal', costType: 'event' }];
  const first = rebuildWorkspace(state, state.brief, { blueprintResidency: 'unknown' });
  assert.equal(first.selected.some(id => vendors.find(vendor => vendor.id === id)?.category === 'hotel'), false);
  assert.ok(first.selected.includes('crows-nest'));
  const second = rebuildWorkspace(first, first.brief, { blueprintResidency: 'resident' });
  assert.equal(second.quotes.length, 3);
  assert.equal(second.quotes.find(quote => quote.id === 'organizer-chair-rental').status, 'quoted');
  assert.equal(second.quotes.find(quote => quote.id === blueprintQuoteIds.venue).amount, 251);
  assert.equal(quoteTotals(second.quotes, vendors).event.recorded, 2296);
});

test('major changes clear stale confirmations and drafts while minor contact edits preserve quotes', () => {
  const state = workspace();
  state.drafts = { delaveaga: 'My edited draft' };
  state.quotes = [{ id: 'actual', vendorId: 'delaveaga', amount: 500, deposit: 100, deadline: '', status: 'confirmed', notes: 'Provider proposal', costType: 'event' }];
  state.guestSettings = { scheduleIds: ['arrival'], confirmedLocationIds: ['arrival'] };
  const minor = rebuildWorkspace(state, { ...state.brief, organizer: 'A new reply-to name' });
  assert.deepEqual(minor.drafts, {});
  assert.equal(minor.quotes[0].status, 'confirmed');
  assert.deepEqual(minor.guestSettings.confirmedLocationIds, ['arrival']);
  const major = rebuildWorkspace(state, { ...state.brief, date: '2027-07-16' });
  assert.equal(major.quotes[0].status, 'estimate');
  assert.match(major.quotes[0].notes, /Reconfirm: reunion details changed/);
  assert.deepEqual(major.guestSettings.confirmedLocationIds, []);
});

test('an oversized picnic never imports the too-small venue fee as a suitable plan', () => {
  const state = workspace({ guests: 120 });
  const next = rebuildWorkspace(state, state.brief, { blueprintResidency: 'nonresident' });
  assert.equal(next.selected.includes('delaveaga'), false);
  assert.equal(next.quotes.some(quote => quote.id === blueprintQuoteIds.venue), false);
  assert.equal(next.quotes.find(quote => quote.id === blueprintQuoteIds.food).amount, 1914);
});
