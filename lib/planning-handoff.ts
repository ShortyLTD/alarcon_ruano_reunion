import { assessVendor, makeSchedule, recommendVendors } from './planner';
import type { Brief, Quote, ScheduleItem, Workspace } from './planner';
import { vendorEvidence } from './vendor-evidence';
import { vendors } from './vendors';

type BlueprintResidency = 'resident' | 'nonresident' | 'unknown';
type RebuildOptions = { blueprintResidency?: BlueprintResidency };

export const blueprintQuoteIds = {
  venue: 'blueprint:delaveaga-site',
  food: 'blueprint:zoccolis-lunch',
} as const;

const majorFields: (keyof Brief)[] = ['date', 'guests', 'dinnerGuests', 'rooms', 'nights', 'style', 'needs'];
const scheduleFields: (keyof ScheduleItem)[] = ['id', 'day', 'time', 'title', 'location', 'notes'];
const sameItem = (a: ScheduleItem, b: ScheduleItem) => scheduleFields.every(key => a[key] === b[key]);
const reconfirmationNote = 'Reconfirm: reunion details changed.';

function reconcileSchedule(existing: Workspace, brief: Brief): ScheduleItem[] {
  const previous = new Map(makeSchedule(existing.brief).map(item => [item.id, item]));
  const next = new Map(makeSchedule(brief).map(item => [item.id, item]));
  const currentIds = new Set(existing.schedule.map(item => item.id));
  const schedule: ScheduleItem[] = [];
  for (const item of existing.schedule) {
    const original = previous.get(item.id);
    if (original && sameItem(original, item)) {
      const replacement = next.get(item.id);
      if (replacement) schedule.push({ ...replacement });
      // An untouched extra-day template disappears when the stay gets shorter.
    } else {
      // Personal edits and custom events survive, even beyond the new dates.
      schedule.push({ ...item });
    }
  }
  for (const item of next.values()) {
    // New stay days get templates. Deliberately deleted older events stay deleted.
    if (!currentIds.has(item.id) && !previous.has(item.id)) schedule.push({ ...item });
  }
  return schedule;
}

function defaultSelection(brief: Brief): string[] {
  const suggested = recommendVendors(vendors, brief);
  return [
    ...suggested.filter(vendor => vendor.category === 'hotel').slice(0, 2),
    ...suggested.filter(vendor => vendor.category === 'restaurant').slice(0, 1),
    ...suggested.filter(vendor => vendor.category === 'venue').slice(0, 1),
  ].map(vendor => vendor.id);
}

function blueprintSelection(brief: Brief): string[] {
  return ['hampton-santa-cruz', 'hyatt-place', 'crows-nest', 'delaveaga', 'zoccolis'].filter(id => {
    const vendor = vendors.find(candidate => candidate.id === id);
    return vendor && assessVendor(vendor, brief).status !== 'mismatch';
  });
}

/** Reference arithmetic only: unavailable evidence produces no invented price. */
function blueprintReferences(brief: Brief, selected: string[], residency: BlueprintResidency): Quote[] {
  const references: Quote[] = [];
  const venue = vendorEvidence.delaveaga;
  if (selected.includes('delaveaga') && venue?.budget?.kind === 'published' && venue.sources.length) {
    const residentRate = venue.budget.unit?.includes('City resident') ? venue.budget.amount : undefined;
    const nonresidentMatch = venue.budget.note.match(/\$([\d,]+(?:\.\d{1,2})?)\s+for\s+nonresidents\b/i);
    const nonresidentRate = nonresidentMatch ? Number(nonresidentMatch[1].replaceAll(',', '')) : undefined;
    const amount = residency === 'resident' ? residentRate : nonresidentRate;
    if (amount !== undefined && Number.isFinite(amount) && amount > 0) {
      const qualification = residency === 'resident'
        ? 'City of Santa Cruz resident rate selected by the organizer. Confirm eligibility with the City; county residency alone does not qualify.'
        : residency === 'unknown'
          ? 'Nonresident rate used as a planning assumption because City residency is unconfirmed.'
          : 'Nonresident rate selected by the organizer.';
      references.push({
        id: blueprintQuoteIds.venue, vendorId: 'delaveaga', amount, deposit: 0, deadline: '', status: 'estimate', costType: 'event', includedInBudget: true,
        notes: `Published base site fee for one day, not a dated offer or reservation. ${qualification}\n${venue.budget.note}\nExtra permits, deposits, setup and other charges remain unpriced. Deposit field is unfilled, not evidence of a zero deposit.\n${venue.sources.map(source => `Source checked ${source.checkedAt}: ${source.url}`).join('\n')}`,
      });
    }
  }
  const food = vendorEvidence.zoccolis;
  if (selected.includes('zoccolis') && food?.budget?.kind === 'published' && food.budget.unit?.includes('bag lunch') && food.sources.length) {
    const unitPrice = food.budget.amount;
    if (unitPrice !== undefined && Number.isFinite(unitPrice) && unitPrice > 0) {
      references.push({
        id: blueprintQuoteIds.food, vendorId: 'zoccolis', amount: Math.round(unitPrice * brief.guests * 100) / 100, deposit: 0, deadline: '', status: 'estimate', costType: 'event', includedInBudget: true,
        notes: `Menu-reference arithmetic: ${brief.guests} bag lunches × $${unitPrice.toFixed(2)}. This assumes one bag lunch per reunion guest, not a provider quote.\nTaxes, delivery or pickup, drinks, serving supplies and all other charges remain unpriced. Quantity, dietary options and date availability require confirmation. Deposit field is unfilled, not evidence of a zero deposit.\n${food.sources.map(source => `Source checked ${source.checkedAt}: ${source.url}`).join('\n')}`,
      });
    }
  }
  return references;
}

/** Rebuild generated material while preserving the organizer's actual work. */
export function rebuildWorkspace(existing: Workspace, brief: Brief, options: RebuildOptions = {}): Workspace {
  const majorChange = majorFields.some(key => brief[key] !== existing.brief[key]);
  const anyChange = (Object.keys(brief) as (keyof Brief)[]).some(key => brief[key] !== existing.brief[key]);
  const applyBlueprint = options.blueprintResidency !== undefined;
  const schedule = reconcileSchedule(existing, brief);
  const selected = applyBlueprint ? blueprintSelection(brief) : existing.selected.length ? [...existing.selected] : defaultSelection(brief);
  let quotes = existing.quotes.map(quote => majorChange ? {
    ...quote,
    status: 'estimate' as const,
    notes: quote.notes.includes(reconfirmationNote) ? quote.notes : `${quote.notes}${quote.notes ? '\n' : ''}${reconfirmationNote}`,
  } : { ...quote });
  if (applyBlueprint) {
    const generatedIds = new Set<string>(Object.values(blueprintQuoteIds));
    quotes = [
      ...quotes.filter(quote => !generatedIds.has(quote.id)),
      ...blueprintReferences(brief, selected, options.blueprintResidency!),
    ];
  }
  let guestSettings = existing.guestSettings;
  if (guestSettings) {
    const present = new Set(schedule.map(item => item.id));
    const scheduleIds = [...new Set(guestSettings.scheduleIds)].filter(id => present.has(id));
    const shared = new Set(scheduleIds);
    guestSettings = {
      scheduleIds,
      confirmedLocationIds: majorChange ? [] : [...new Set(guestSettings.confirmedLocationIds)].filter(id => shared.has(id)),
    };
  }
  return {
    ...existing, brief: { ...brief }, created: true, selected, quotes, schedule,
    drafts: anyChange ? {} : { ...existing.drafts },
    ...(guestSettings ? { guestSettings } : {}),
  };
}
