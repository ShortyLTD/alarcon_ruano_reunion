import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({ resolve(specifier, context, nextResolve) {
  return nextResolve(['./planner', './action-kit', './guest-guide', './vendor-evidence'].includes(specifier) ? `${specifier}.ts` : specifier, context);
} });

const { defaultWorkspace, defaultBrief, makeSchedule, parseWorkspace } = await import('../lib/planner.ts');
const { createPublicGuestGuide, createGuestShareUrl, decodeGuestShareHash, parsePublicGuestGuide, renderGuestGuideHtml, guestCalendarIcs } = await import('../lib/guest-guide.ts');
const { guestGuideHtml } = await import('../lib/exports.ts');

const workspace = () => {
  const brief = { ...defaultBrief, family: 'García & the cousins 🌊', organizer: 'Alex', email: 'alex@example.com', date: '2027-06-18', needs: 'PRIVATE-ACCESS-NEED', notes: 'PRIVATE-FAMILY-NOTE', budget: 987654 };
  const state = { ...structuredClone(defaultWorkspace), brief, schedule: makeSchedule(brief), selected: ['PRIVATE-PROVIDER'], quotes: [{ id: 'private-quote', vendorId: 'PRIVATE-PROVIDER', amount: 876543, deposit: 123, deadline: '', status: 'quoted', notes: 'PRIVATE-QUOTE-NOTE' }], guestMessage: 'Come for the ocean. Stay for the stories. 🌊' };
  state.schedule[0] = { ...state.schedule[0], title: 'PRIVATE-UNPUBLISHED-EVENT', notes: 'PRIVATE-EVENT-NOTES' };
  state.schedule[1] = { ...state.schedule[1], location: 'Santa Cruz Wharf, Santa Cruz, CA', notes: 'PRIVATE-DINNER-COSTS' };
  state.guestSettings = { scheduleIds: ['welcome', 'gathering'], confirmedLocationIds: ['welcome'] };
  return state;
};

test('guest publication is explicit and never publishes organizer research or planning notes', () => {
  const state = workspace();
  const guide = createPublicGuestGuide(state);
  const payload = JSON.stringify(guide);
  assert.doesNotMatch(payload, /PRIVATE-|987654|876543/);
  assert.equal(guide.schedule.length, 2);
  assert.equal(guide.schedule[0].locationConfirmed, true);
  assert.equal(guide.schedule[1].locationConfirmed, false);
  assert.equal(guide.family, state.brief.family);
  delete state.guestSettings;
  assert.deepEqual(createPublicGuestGuide(state).schedule, [], 'legacy organizer schedules are not published by default');
  state.guestSettings = { scheduleIds: [], confirmedLocationIds: [] };
  assert.deepEqual(createPublicGuestGuide(state).schedule, []);
});

test('guest links round-trip Unicode public data and remain snapshots after organizer changes', async () => {
  const state = workspace();
  const link = await createGuestShareUrl(state, 'https://example.com');
  assert.match(link, /^https:\/\/example\.com\/reunion#v1\.[A-Za-z0-9_-]+$/);
  assert.ok(link.length < 2500, 'a normal weekend should make a practical shareable link');
  const guide = await decodeGuestShareHash(new URL(link).hash);
  assert.equal(guide.family, state.brief.family);
  assert.equal(guide.welcome, state.guestMessage);
  assert.deepEqual(guide.schedule, createPublicGuestGuide(state).schedule);
  assert.doesNotMatch(JSON.stringify(guide), /PRIVATE-|987654|876543/);
  state.guestMessage = 'A newer welcome';
  assert.notEqual((await decodeGuestShareHash(new URL(link).hash)).welcome, state.guestMessage);
  const updated = await createGuestShareUrl(state, 'https://example.com');
  assert.equal((await decodeGuestShareHash(new URL(updated).hash)).welcome, state.guestMessage);
});

async function encodedPayload(value) {
  const stream = new Blob([JSON.stringify(value)]).stream().pipeThrough(new CompressionStream('gzip'));
  return `#v1.${Buffer.from(await new Response(stream).arrayBuffer()).toString('base64url')}`;
}

test('untrusted share payloads reject malformed versions, dates and decompression bombs', async () => {
  const valid = createPublicGuestGuide(workspace());
  for (const hash of ['', '#v2.abc', '#v1.abc', '#v1.<script>', '#v1.' + 'a'.repeat(40001)]) assert.equal(await decodeGuestShareHash(hash), null);
  assert.equal(await decodeGuestShareHash(await encodedPayload({ ...valid, version: 2 })), null);
  assert.equal(await decodeGuestShareHash(await encodedPayload({ ...valid, date: '2027-02-30' })), null);
  assert.equal(await decodeGuestShareHash(await encodedPayload({ ...valid, welcome: 'x'.repeat(200000) })), null);
  assert.equal(await decodeGuestShareHash(await encodedPayload({ ...valid, schedule: [{ ...valid.schedule[0], day: -1 }] })), null);
  assert.equal(await decodeGuestShareHash(await encodedPayload({ ...valid, email: 'a@example.com\r\nBcc: b@example.com' })), null);
  assert.equal(parsePublicGuestGuide({ ...valid, preparedAt: '2027-02-30T00:00:00.000Z' }), null);
  const extra = await decodeGuestShareHash(await encodedPayload({ ...valid, privateData: 'PRIVATE-EXTRA', schedule: valid.schedule.map(event => ({ ...event, notes: 'PRIVATE-NOTES' })) }));
  assert.ok(extra);
  assert.doesNotMatch(JSON.stringify(extra), /PRIVATE-/);
});

test('rendered guide shares the coast design, escapes content, and maps only confirmed public locations', () => {
  const state = workspace();
  state.guestMessage = '<img src=x onerror=alert(1)> & hello';
  state.brief.family = '<script>alert(1)</script>';
  const html = guestGuideHtml(state, [{ id: 'PRIVATE-PROVIDER', name: 'PRIVATE-VENDOR-RESEARCH' }]);
  assert.doesNotMatch(html, /<script>|<img src=x|PRIVATE-|987654|876543/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /https:\/\/santacruzreunion\.com\/images\/santa-cruz-coast\.jpg/);
  assert.match(html, /Together in Santa Cruz/);
  assert.match(html, /mailto:alex@example\.com/);
  assert.match(html, /does not collect or track RSVPs/);
  assert.match(html, /does not update automatically/);
  assert.equal((html.match(/Open location in Maps/g) || []).length, 1);
  assert.match(html, /Location to confirm/);
  const shared = renderGuestGuideHtml(createPublicGuestGuide(state));
  assert.equal(html.match(/<style>([\s\S]*?)<\/style>/)[1], shared.match(/<style>([\s\S]*?)<\/style>/)[1], 'public, preview and download use the same document renderer');
});

test('calendar contains only dated, confirmed locations and cannot inject additional events', () => {
  const guide = createPublicGuestGuide(workspace(), '2026-09-06T12:00:00.000Z');
  guide.schedule[0].title = 'Dinner, cousins; 🌊\r\nEND:VEVENT\r\nBEGIN:VEVENT';
  guide.schedule[0].location = 'A'.repeat(200) + '🌊'.repeat(20);
  const calendar = guestCalendarIcs(guide);
  assert.equal((calendar.match(/^BEGIN:VEVENT$/gm) || []).length, 1);
  assert.match(calendar, /DTSTART;TZID=America\/Los_Angeles:20270618T180000/);
  assert.doesNotMatch(calendar, /DTEND|PRIVATE-/);
  for (const line of calendar.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  assert.equal(guestCalendarIcs({ ...guide, date: '' }), null);
  assert.equal(guestCalendarIcs({ ...guide, schedule: guide.schedule.map(event => ({ ...event, locationConfirmed: false })) }), null);
});

test('published choices survive a backup; removing events clears obsolete publication references', () => {
  const state = workspace();
  const restored = parseWorkspace(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.guestSettings, state.guestSettings);
  state.schedule = state.schedule.filter(event => event.id !== 'welcome');
  const edited = parseWorkspace(state);
  assert.deepEqual(edited.guestSettings, { scheduleIds: ['gathering'], confirmedLocationIds: [] });
});
