import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['./planner', './action-kit', './vendor-evidence', './guest-guide'].includes(specifier) ? `${specifier}.ts` : specifier, context);
} });
const { defaultBrief, defaultWorkspace, makeSchedule } = await import('../lib/planner.ts');
const { bookingChecks, followUp, confirmationRequest, guestReminder, comparisonRows } = await import('../lib/action-kit.ts');
const { createPacket, executionGuideHtml } = await import('../lib/exports.ts');

const brief = { ...defaultBrief, family: 'Rivera', organizer: 'Alex', email: 'alex@example.com', guests: 100, dinnerGuests: 25, rooms: 20, date: '2027-06-18', notes: 'PRIVATE-NOTE', needs: 'PRIVATE-ACCESS-DETAIL' };
const provider = (id, category, extra = {}) => ({ id, category, capacity: null, name: id, location: 'Santa Cruz', description: 'Researched', url: 'https://example.com', source: 'https://example.com', priceNote: 'Quote required', checkedAt: '2026-09-06', highlights: [], ...extra });
const workspace = () => ({ ...structuredClone(defaultWorkspace), brief: { ...brief }, selected: ['hotel'], schedule: makeSchedule(brief), quotes: [{ id: 'q', vendorId: 'hotel', amount: 123456, deposit: 300, deadline: '', status: 'estimate', notes: 'PRIVATE-QUOTE' }] });

test('action drafts preserve the relevant counts and request terms without accepting a booking', () => {
  assert.match(followUp(provider('hotel', 'hotel'), brief), /20 rooms for 2 nights/);
  assert.match(followUp(provider('dinner', 'restaurant'), brief), /25 people/);
  assert.match(followUp(provider('zoccolis', 'restaurant'), brief), /100 people/);
  assert.match(confirmationRequest(provider('venue', 'venue'), brief), /not acceptance of a quote or confirmation of a booking/);
  assert.match(bookingChecks(provider('hotel', 'hotel')).join(' '), /attrition/);
  assert.match(bookingChecks(provider('dinner', 'restaurant')).join(' '), /minimum spend/);
  assert.match(bookingChecks(provider('venue', 'venue')).join(' '), /permit/);
  assert.match(bookingChecks(provider('zoccolis', 'restaurant')).join(' '), /pickup or delivery/);
});

test('comparison preserves estimate evidence, distinguishes missing terms from zero, and limits rows to shortlist', () => {
  const state = workspace();
  const rows = comparisonRows(state, [provider('hotel', 'hotel'), provider('other', 'hotel')]);
  assert.equal(rows.length, 2);
  assert.equal(rows[1][3], 123456);
  assert.match(rows[1][4], /Organizer estimate/);
  assert.equal(rows[1][7], 'Not recorded — ask provider');
  state.quotes = [];
  assert.equal(comparisonRows(state, [provider('hotel', 'hotel')])[1][3], 'Not recorded — ask provider');
});

test('guest reminder excludes private organizer details; execution guide escapes content and unsafe links', () => {
  const state = workspace();
  assert.doesNotMatch(guestReminder(state), /PRIVATE-|123456/);
  assert.match(guestReminder(state), /Alex at alex@example.com/);
  state.brief.family = '<script>alert(1)</script>';
  const html = executionGuideHtml(state, [provider('<img src=x onerror=alert(1)>', 'hotel', { url: 'javascript:alert(1)' })]);
  assert.doesNotMatch(html, /<script>|<img|href="javascript:/);
  assert.match(html, /&lt;script&gt;/);
});

test('execution deliverables are present in the actual ZIP and CSV formulas stay neutralized', async () => {
  const state = workspace();
  const bytes = new Uint8Array(await createPacket(state, [provider('hotel', 'hotel', { name: '=HYPERLINK("bad")' })]).arrayBuffer());
  const view = new DataView(bytes.buffer), decoder = new TextDecoder(), files = new Map();
  for (let offset = 0; view.getUint32(offset, true) === 0x04034b50;) {
    const size = view.getUint32(offset + 18, true), length = view.getUint16(offset + 26, true), extra = view.getUint16(offset + 28, true);
    const name = decoder.decode(bytes.slice(offset + 30, offset + 30 + length));
    const start = offset + 30 + length + extra;
    files.set(name, decoder.decode(bytes.slice(start, start + size)));
    offset = start + size;
  }
  for (const file of ['execution-guide.html', 'quote-comparison.csv', 'day-of-run-sheet.csv', 'guest-reminder.txt']) assert.ok(files.has(file), file);
  assert.ok([...files.keys()].some(name => name.endsWith('-follow-up.txt')));
  assert.ok([...files.keys()].some(name => name.endsWith('-booking-details.txt')));
  assert.match(files.get('quote-comparison.csv'), /'=HYPERLINK/);
  assert.match(files.get('START-HERE.txt'), /execution-guide.html/);
});
