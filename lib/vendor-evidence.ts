/** Official-source decision evidence, checked 2026-09-06.
 * A published feature is not a date-specific availability or accessibility guarantee.
 */
export type VendorEvidence = {
  vendorId: string;
  decisionSummary: string;
  capacity?: { label: string; guests: number; format: 'seated' | 'picnic' | 'standing' | 'rooms'; matchScope: 'entire-listing' | 'one-layout' }[];
  capacityScope?: 'seated-meal' | 'gathering' | 'catering';
  hotelRooms?: number;
  budget?: { kind: 'published' | 'quote-required'; amount?: number; unit?: string; note: string; minimum?: { amount: number; basis: 'room-night' | 'event-total' | 'per-person'; appliesTo: 'lodging' | 'gathering' | 'dinner' } };
  accessibility: { status: 'documented-features' | 'confirm'; details: string[] };
  bookingSteps: string[];
  questions: string[];
  sources: { label: string; url: string; checkedAt: string }[];
  lodgingStyle?: 'resort' | 'hotel';
  mealService?: 'onsite' | 'offsite';
};

const checkedAt = '2026-09-06';
const source = (label: string, url: string) => ({ label, url, checkedAt });
const cityPicnics = 'https://www.santacruzca.gov/Government/City-Departments/Parks-Recreation/Events/Reservation-Office-Event-Permits/Private-Events-Reservations/Picnic-Areas';
const cityFees = 'https://www.santacruzca.gov/files/assets/city/v/4/pr/documents/fees-pr-facilities-effective-jan-5-2026v5.pdf';
const hotelQuestions = ['What is the full room-night price including mandatory fees and tax?', 'Is this a courtesy block or does the organizer owe for unused rooms?', 'What are the room-release, deposit and cancellation dates?', 'Can guests book and pay individually through one hotel booking link?'];

export const vendorEvidence: Record<string, VendorEvidence> = {
  'delaveaga': {
    vendorId: 'delaveaga',
    decisionSummary: 'A practical anchor for a picnic of up to 100: a defined reservable site, published daily fees and documented accessible parking and bathrooms.',
    capacity: [{ label: 'Forty Thieves picnic area', guests: 100, format: 'picnic', matchScope: 'entire-listing' }], capacityScope: 'gathering',
    budget: { kind: 'published', amount: 251, unit: 'day · City resident base fee', note: 'Standard daily site fee: $251 for City of Santa Cruz residents; $327 for nonresidents. Effective January 5, 2026. Extra permits and deposits can apply; City residency is not county residency.' },
    accessibility: { status: 'documented-features', details: ['The City lists accessible bathrooms and accessible parking at Forty Thieves.', 'Confirm the continuous route from your parking spaces to the specific reserved tables.'] },
    bookingSteps: ['Contact the City reservation office at 831-420-5270 with the exact site, date, headcount and activities.', 'Confirm the rate category, permits, deposit, access route and weather cancellation terms.', 'Keep the written reservation and site map with your day-of coordinator.'],
    questions: ['Does the 100-person limit include children, helpers and vendors?', 'What is included for tables, power, cleanup and trash?', 'Which permits or deposits apply to our food service, music or alcohol?'],
    sources: [source('City picnic sites and access features', cityPicnics), source('2026 City fee schedule · page 2', cityFees), source('City facility record and reservation office', 'https://casantacruzweb.myvscloud.com/webtrac/web/iteminfo.html?FMID=151327&Module=FR')],
  },
  'zoccolis': {
    vendorId: 'zoccolis', decisionSummary: 'An off-site picnic meal with a useful public price reference. A bag lunch includes a sandwich, chips and a cookie; drinks and event logistics need separate planning.',
    capacityScope: 'catering', mealService: 'offsite',
    budget: { kind: 'published', amount: 15.95, unit: 'bag lunch · menu reference', note: '$15.95 per bag lunch on the checked menu. For 100 lunches, $1,595 is food-menu arithmetic only, before tax, delivery or other charges. Quantity and date require confirmation.' },
    accessibility: { status: 'confirm', details: ['This is food supplied to your chosen venue; assess access at that venue separately.'] },
    bookingSteps: ['Call 831-423-1711 to check order capacity and pickup for your event date.', 'Give quantities by sandwich choice, dietary requirement and allergy.', 'Confirm order deadline, all charges, labeling, serving supplies and who transports the food.'],
    questions: ['Can you fulfill our full headcount on the chosen day?', 'Can vegetarian meals be labeled and kept separate from allergy-sensitive orders?', 'What are the pickup, cancellation and safe serving instructions?'],
    sources: [source('Official catering menu and order phone', 'https://www.zoccolis.com/catering')],
  },
  'crows-nest': {
    vendorId: 'crows-nest', decisionSummary: 'A well-defined inquiry for a welcome dinner of 40–50. The Harbor Room is a private downstairs waterfront room with a published seated limit of 50.',
    capacity: [{ label: 'Harbor Room · seated meal', guests: 50, format: 'seated', matchScope: 'entire-listing' }], capacityScope: 'seated-meal', mealService: 'onsite',
    budget: { kind: 'quote-required', note: 'Private-party menu, minimum spend, room fee and service charges require a proposal.' },
    accessibility: { status: 'confirm', details: ['Downstairs is a location description, not proof of a step-free route. Ask about the Harbor Room entrance and restroom route.'] },
    bookingSteps: ['Use the official groups form or events@crowsnest-santacruz.com with your dinner headcount.', 'Request a Harbor Room floor plan and an itemized menu proposal.', 'Confirm the final-count deadline, exclusive-use hours and deposit before inviting guests.'],
    questions: ['Will our whole dinner party sit together in the Harbor Room?', 'Is the complete arrival-to-table-to-restroom route step-free?', 'What does the quote include for children, dietary meals, drinks, tax and service?'],
    sources: [source('Official Harbor Room capacity', 'https://crowsnest-santacruz.com/'), source('Official group inquiry form', 'https://crowsnest-santacruz.com/santa-cruz-the-crows-nest-party')],
  },
  'shadowbrook': {
    vendorId: 'shadowbrook', decisionSummary: 'A distinctive smaller dinner option. For 40+ people, ask about combined rooms; the Wine Cellar alone seats no more than 35.',
    capacity: [
      { label: 'Wine Cellar', guests: 35, format: 'seated', matchScope: 'one-layout' },
      { label: 'Redwood Room · maximum listed configuration', guests: 26, format: 'seated', matchScope: 'one-layout' },
      { label: 'Owner’s Private Reserve', guests: 16, format: 'seated', matchScope: 'one-layout' },
    ], capacityScope: 'seated-meal', mealService: 'onsite',
    budget: { kind: 'quote-required', note: 'The banquet team supplies group minimums and pricing. Combined rooms for 50+ are described, without a total seated maximum.' },
    accessibility: { status: 'confirm', details: ['Confirm the specific room and step-free arrival route; a cable car or garden path is not an accessibility guarantee.'] },
    bookingSteps: ['Email banquets@shadowbrook-capitola.com or call 831-475-1222.', 'Ask for one named room or a written combined-room configuration.', 'Compare minimum spend, room privacy and the full banquet total.'],
    questions: ['Would the family be split between rooms?', 'Which arrival route and restroom serve guests using mobility aids?', 'Can dietary meals and children’s portions be included in the proposal?'],
    sources: [source('Private rooms, configurations and banquet contact', 'https://shadowbrook-capitola.com/private-events/')],
  },
  'hindquarter': {
    vendorId: 'hindquarter', decisionSummary: 'A custom-menu lead whose actual group layout still needs confirmation. Its website explicitly says an online reservation enters a waiting list.',
    capacityScope: 'seated-meal', mealService: 'onsite',
    budget: { kind: 'quote-required', note: 'Regular nightly specials are not a group menu or a private-event price.' },
    accessibility: { status: 'confirm', details: ['Ask for the step-free entrance, table layout and accessible restroom route for the chosen area.'] },
    bookingSteps: ['Call 831-426-7770 to discuss a special event and custom menu.', 'Confirm space, total headcount, seating and the requested date directly.', 'Obtain written confirmation; an online waiting-list entry does not reserve the event.'],
    questions: ['What is the largest party you can seat together?', 'Is the area private, and is there a minimum spend?', 'Can you provide an all-in group menu price?'],
    sources: [source('Official event instructions and waiting-list warning', 'https://www.thehindquarter.com/')],
  },
  'roaring-camp': {
    vendorId: 'roaring-camp', decisionSummary: 'A reunion program that can combine a private picnic site, catering and an optional redwood train ride. Choose a named site before treating the event as a fit.',
    capacityScope: 'gathering',
    budget: { kind: 'quote-required', note: 'Request separate prices for the picnic site, food, parking and optional train tickets. Published program sizes span 25–2,500, not one guaranteed event layout.' },
    accessibility: { status: 'confirm', details: ['Confirm the chosen picnic site surface, accessible restroom route and train boarding arrangements separately.'] },
    bookingSteps: ['Contact group sales at 831-335-4484 or the official contact form.', 'Request a site map and the named space that fits your gathering.', 'Compare picnic-only and picnic-plus-train proposals with a weather fallback.'],
    questions: ['Which specific reserved site accommodates the whole family?', 'Is a covered or indoor fallback included or separately priced?', 'Can guests using mobility aids take the planned train and reach the picnic tables?'],
    sources: [source('Official reunion group program and sales contact', 'https://roaringcamp.com/group-activities')],
  },
  'twin-lakes': {
    vendorId: 'twin-lakes', decisionSummary: 'A beach option with an official special-event route and a beach-wheelchair program. Get the exact permitted footprint and access plan before using it as your main gathering.',
    capacityScope: 'gathering',
    budget: { kind: 'quote-required', note: 'Ask State Parks for the event-specific permit charges, deposit and parking plan. Public beach access is not a private reservation.' },
    accessibility: { status: 'documented-features', details: ['State Parks lists free beach wheelchairs; reserving at least five business days ahead is recommended.', 'The equipment offer does not establish a continuous firm route to every event footprint.'] },
    bookingSteps: ['Email SCD.specialevents@parks.ca.gov with date, headcount, setup and an exact area.', 'Review the current application linked on the park page and confirm applicable conditions.', 'Arrange a beach wheelchair through Friends of Santa Cruz State Parks if required, then verify arrival and restroom routes.'],
    questions: ['What exact area and activities can be authorized?', 'How will public access, tides, wind and parking affect our setup?', 'Which route, restroom and mobility equipment meet our family’s needs?'],
    sources: [source('Park and current event application', 'https://www.parks.ca.gov/?page_id=547'), source('State Parks beach-wheelchair instructions', 'https://www.parks.ca.gov/AccessibleFeatures/Details/547')],
  },
  'seacliff': {
    vendorId: 'seacliff', decisionSummary: 'A beach picnic lead with covered accessible picnic sites in the South End day-use area. Storm-damaged routes and the closed campground make the precise meeting point important.',
    capacityScope: 'gathering',
    budget: { kind: 'published', amount: 10, unit: 'vehicle day use · reference only', note: 'The park publishes $10 vehicle day use, subject to change or peak pricing. This is parking/entry, not an event reservation or permit price.' },
    accessibility: { status: 'documented-features', details: ['South End day use lists accessible picnic sites, parking and restrooms.', 'The usable southern Promenade segment is approximately 0.3 mile; rerouted sections include compacted aggregate and soil.', 'Free beach wheelchairs are offered; advance reservation is recommended.'] },
    bookingSteps: ['Email SCD.specialevents@parks.ca.gov for the exact site and group size.', 'Confirm current route conditions, event charges and parking before selecting the gathering point.', 'Share the approved arrival point with guests; do not offer the closed campground as lodging.'],
    questions: ['Which covered picnic site can our group reserve, and for how many people?', 'Is the route suitable for the specific mobility devices in our family?', 'What happens to the reservation during a weather or access closure?'],
    sources: [source('Current park access, fees and event contact', 'https://www.parks.ca.gov/SeacliffStateBeach'), source('Specific picnic and trail access features', 'https://www.parks.ca.gov/AccessibleFeatures/Details/543')],
  },
  'dream-inn': {
    vendorId: 'dream-inn', decisionSummary: 'A beachfront lodging and event-space option with documented accessible routes. Request lodging and event costs separately so room-block and gathering commitments remain clear.',
    lodgingStyle: 'resort',
    budget: { kind: 'quote-required', note: 'No date-specific room rate or reunion event total has been verified. The published ballroom maximum does not establish your seated-meal layout.' },
    accessibility: { status: 'documented-features', details: ['The property lists accessible entrance-to-meeting-room and restaurant routes, public restrooms and pool lifts.', 'Accessible guestroom features and transport can be requested; verify the exact room and availability.'] },
    bookingSteps: ['Submit the family-reunion RFP with rooms, dates and event headcount.', 'Request a named event room and a floor plan for your meal format.', 'Obtain separate lodging and gathering quotes, with the accessible room types listed.'],
    questions: [...hotelQuestions, 'Which event layout fits our meal, microphone, photo area and mobility clearances?'],
    sources: [source('Official event and reunion inquiry', 'https://www.dreaminnsantacruz.com/meetings/overview'), source('Property accessibility features', 'https://www.dreaminnsantacruz.com/accessibility')],
  },
  'seascape': {
    vendorId: 'seascape', decisionSummary: 'A coastal resort with room-specific seated capacities: Pacific Room can accommodate 110 at rounds, while Bayview lists 70. Match the actual room to your gathering.',
    lodgingStyle: 'resort', capacity: [{ label: 'Pacific Room · rounds', guests: 110, format: 'seated', matchScope: 'one-layout' }, { label: 'Bayview Room · rounds', guests: 70, format: 'seated', matchScope: 'one-layout' }],
    budget: { kind: 'quote-required', note: 'Room-block rates, resort charges, catering and event minimums require a dated proposal.' },
    accessibility: { status: 'confirm', details: ['Ask about the route between the exact suite or villa, reserved event room and beach; these are separate access questions.'] },
    bookingSteps: ['Use the meeting inquiry and specify family reunion in the event description.', 'For about 100 seated guests, request the Pacific Room layout and alternatives.', 'Compare suites/villas by permitted occupancy and total cost, including any minimum stay.'],
    questions: [...hotelQuestions, 'Does the quoted rounds layout allow space for buffet, microphone and mobility devices?'],
    sources: [source('Official room capacities and proposal form', 'https://seascaperesort.com/meetings-conferences')],
  },
  'chaminade': {
    vendorId: 'chaminade', decisionSummary: 'A resort option for an event with or without overnight stays. The published day-meeting program is useful as an inquiry route, but must be adapted and quoted for a family reunion.',
    lodgingStyle: 'resort',
    budget: { kind: 'quote-required', note: 'Per-person conference pricing is described without a published reunion price. Ask for a custom event proposal and separate lodging costs.' },
    accessibility: { status: 'confirm', details: ['Ask group sales for the exact accessible room types, arrival route and route to the proposed gathering space.'] },
    bookingSteps: ['Contact sales@chaminade.com or group sales at 831-465-3421.', 'Describe a family celebration and ask for event-only and overnight options.', 'Confirm the specific space, layout, meal plan and all minimum commitments.'],
    questions: [...hotelQuestions, 'Can the gathering be booked without a room block or conference package?'],
    sources: [source('Official day-event program and sales contact', 'https://www.chaminade.com/santacruz-meetings/benchmark-conference-plan/')],
  },
  'hampton-santa-cruz': {
    vendorId: 'hampton-santa-cruz', decisionSummary: 'Compare this nonresort option when included breakfast and parking matter. Its official group tools offer 10–25-room blocks and a guest hotel-booking page.',
    lodgingStyle: 'hotel',
    budget: { kind: 'quote-required', note: 'Hot breakfast and self-parking are listed as included. The group nightly rate, tax and cancellation terms still require your dates; no budget fit is guaranteed.' },
    accessibility: { status: 'confirm', details: ['Confirm the accessible room types and quantity directly; the checked hotel page did not expose a detailed property access checklist.'] },
    bookingSteps: ['Use the hotel’s Book a Room Block route for 10–25 rooms, or contact the property for other sizes.', 'Ask for a comparable complete rate and the room-block liability terms.', 'Use the hotel’s attendee booking page after the block is accepted; this link is supplied by Hilton.'],
    questions: [...hotelQuestions, 'Can included breakfast accommodate the group’s timing and dietary needs?'],
    sources: [source('Hotel group-block and attendee-page tools', 'https://www.hilton.com/en/hotels/sruhhhx-hampton-santa-cruz/'), source('Included amenities and direct hotel contact', 'https://www.hilton.com/en/hotels/sruhhhx-hampton-santa-cruz/hotel-info/')],
  },
  'hyatt-place': {
    vendorId: 'hyatt-place', decisionSummary: 'A nonresort room-block comparison with documented accessible routes. The combined event-space maximum is 80 attendees, so it is not the main indoor venue for 100.',
    lodgingStyle: 'hotel',
    budget: { kind: 'quote-required', note: 'Request current block rates and written breakfast and parking inclusions. Published event capacity is not a promise of available guestrooms.' },
    accessibility: { status: 'documented-features', details: ['The hotel lists accessible routes to guestrooms, dining and meeting areas, plus accessible public restrooms.', 'Accessible guestroom doorways list 32 inches clear width; confirm the needed room type and bathroom layout.'] },
    bookingSteps: ['Call 831-226-2300 and request the sales team for a family room block.', 'Request specific accessible rooms and a guest booking link.', 'If adding a smaller event, ask for the seated layout; the combined space lists 80 attendees maximum.'],
    questions: [...hotelQuestions, 'Which accessible bathroom configurations can you hold for our dates?'],
    sources: [source('Hotel room blocks', 'https://www.hyatt.com/hyatt-place/en-US/sjczs-hyatt-place-santa-cruz'), source('Event-space maximum', 'https://www.hyatt.com/hyatt-place/en-US/sjczs-hyatt-place-santa-cruz/meetings'), source('Specific accessible routes and features', 'https://www.hyatt.com/hyatt-place/en-US/sjczs-hyatt-place-santa-cruz/hotel-info')],
  },
  'fairfield-capitola': {
    vendorId: 'fairfield-capitola', decisionSummary: 'A suite-based lodging alternative with a room-block route and a 70-seat banquet room. Useful for a smaller welcome event; a 100-person main meal needs another space.',
    lodgingStyle: 'hotel', hotelRooms: 84,
    capacity: [{ label: 'Meeting room · banquet layout', guests: 70, format: 'seated', matchScope: 'one-layout' }],
    budget: { kind: 'quote-required', note: 'Ask for full suite rates, occupancy rules and any parking charges. Published inventory of 84 suites is not room-block availability.' },
    accessibility: { status: 'documented-features', details: ['Marriott lists accessible parking, van parking, elevators, an accessible entrance and meeting spaces.', 'Request the exact accessible suite type during booking; available quantities can be limited.'] },
    bookingSteps: ['Use the official event planning route or call 831-427-2900 for a room block.', 'Compare suite occupancy and total stay costs against the family’s room needs.', 'If using the 70-seat meeting room, confirm food service and the actual event layout.'],
    questions: [...hotelQuestions, 'How many adults and children are permitted in each proposed suite type?'],
    sources: [source('Suite inventory and room-block contact', 'https://www.marriott.com/en-us/hotels/sjccp-fairfield-inn-and-suites-santa-cruz-capitola/rooms/'), source('Banquet capacity and event inquiry', 'https://www.marriott.com/en-us/hotels/sjccp-fairfield-inn-and-suites-santa-cruz-capitola/events/'), source('Property access features', 'https://www.marriott.com/en-us/hotels/sjccp-fairfield-inn-and-suites-santa-cruz-capitola/overview/')],
  },
};

export function getVendorEvidence(vendorId: string): VendorEvidence | undefined {
  return vendorEvidence[vendorId];
}
