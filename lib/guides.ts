import { siteUrl } from './site';

export { siteUrl };

export type GuideSection = {
  title: string;
  text: string;
  bullets?: string[];
};

export type PlanningGuide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  /** Search result title, kept under about 60 characters. */
  seoTitle: string;
  intro: string;
  publishedAt: string;
  checkedAt: string;
  vendorIds: string[];
  sections: GuideSection[];
  questions: string[];
  takeaway: string;
};

export const guides: PlanningGuide[] = [
  {
    slug: 'santa-cruz-family-reunion-venues',
    title: 'Santa Cruz family reunion venues: beach, park or resort?',
    shortTitle: 'Choose your reunion setting',
    description: 'Compare researched Santa Cruz reunion settings, understand capacity and permit questions, and prepare a useful venue inquiry before choosing a date.',
    seoTitle: '4 Santa Cruz Family Reunion Venues to Compare: Beach, Park, Resort',
    publishedAt: '2026-09-06',
    intro: 'Your main gathering place shapes the rest of the weekend. Start with the people who need to fit comfortably, the meal you want to serve, and the help you need on the day. Then compare a small set of places against the same brief.',
    checkedAt: '2026-09-06',
    vendorIds: ['delaveaga', 'twin-lakes', 'roaring-camp', 'dream-inn'],
    sections: [
      { title: 'Choose the kind of day you want', text: 'A beach gathering, a reservable picnic area and a catered resort event ask different things of the organizer. Compare the whole job, including setup and cleanup, before comparing venue fees.', bullets: ['Beach: ask about the permitted event footprint, setup, parking and access to restrooms.', 'Picnic area: check the specific reservable area, seated capacity, tables, grills and food arrangements.', 'Resort or event venue: request the room layout, catering requirements, staffing and a complete event quote.'] },
      { title: 'One headcount is not enough', text: 'Tell each venue how many people will attend the main gathering and how many will sit down to eat. Mention children, mobility needs and whether everyone must be in one space. A property’s maximum event capacity is not the capacity of every room, and standing reception capacity is not seated dinner capacity.' },
      { title: 'Confirm permission before building the invitation', text: 'For a State Parks beach, use the official park page and special-events contact to confirm whether your proposed gathering is permitted and which application applies. A permit inquiry is not a reservation or permission to close a public beach. For a city picnic site, name the exact area you want to reserve.' },
    ],
    questions: ['Is our date available for this exact space and event format?', 'How many guests fit in the proposed seated layout?', 'What is included, and what must we arrange ourselves?', 'What are the complete fees, deposit, cancellation terms and payment dates?', 'Which food, equipment, music or other setup details need approval?', 'What is the accessible arrival route and practical weather backup?'],
    takeaway: 'Choose a first-choice setting and a workable backup. Put both into your plan, send the same event brief to each provider, and compare their written replies before confirming anything with guests.',
  },
  {
    slug: 'santa-cruz-restaurants-for-large-groups',
    title: 'Santa Cruz restaurants for large groups: what to ask before booking',
    shortTitle: 'Find a place for the family meal',
    description: 'A Santa Cruz group-dining shortlist with published capacity context, private-event contacts, catering options and a checklist for complete dinner quotes.',
    seoTitle: 'Santa Cruz Restaurants for Large Groups: 4 Places to Ask',
    publishedAt: '2026-09-06',
    intro: 'A restaurant that takes reservations may handle a large family dinner through a separate events team. Give that team the dinner headcount, date, time and seating preference so they can answer the questions that matter.',
    checkedAt: '2026-09-06',
    vendorIds: ['crows-nest', 'shadowbrook', 'hindquarter', 'zoccolis'],
    sections: [
      { title: 'Use the dinner count, not the whole reunion count', text: 'If 100 relatives are coming for the weekend but 25 are joining Friday dinner, your restaurant inquiry should say 25. Decide whether children need seats or a different menu, and whether a private room is essential or simply preferred.' },
      { title: 'Compare the same meal and the same total', text: 'Ask each restaurant to quote a comparable arrangement. A menu price alone does not tell you the final cost of a group dinner.', bullets: ['Specify seated dinner, buffet, reception or another format.', 'Ask whether a set menu, minimum spend or room fee applies.', 'Request tax, service charges and gratuity details, plus what drinks are included.', 'Ask how dietary requirements, children’s meals and changes to the headcount are handled.'] },
      { title: 'Keep catering separate from a restaurant reservation', text: 'A picnic meal may be a better fit for your gathering. A catering lead helps you source food; it does not establish a place for your group to sit. Confirm portions, order lead time, pickup or delivery and the food arrangements allowed at your venue.' },
    ],
    questions: ['Can our whole dinner group sit together in one room?', 'Is the room private, semi-private or part of the main dining room?', 'What is the all-in price for our menu and headcount?', 'When are the deposit, final count and final payment due?', 'What happens if the headcount changes or we cancel?', 'Who is our events contact, and when will we receive written confirmation?'],
    takeaway: 'Shortlist two realistic dinner options. Send each the same headcount and meal brief, save the replies with your plan, and tell guests the restaurant is confirmed only after the provider confirms it.',
  },
  {
    slug: 'santa-cruz-hotel-room-blocks',
    title: 'Santa Cruz hotel room blocks: a reunion organizer’s inquiry checklist',
    shortTitle: 'Ask hotels for comparable quotes',
    description: 'Prepare a Santa Cruz reunion room-block request with researched hotel contacts, the details hotels need and the questions that make quotes comparable.',
    seoTitle: 'Santa Cruz Hotel Room Blocks for Reunions: 3 Places to Ask',
    publishedAt: '2026-09-06',
    intro: 'A useful hotel request starts with room nights, not just reunion attendance. Gather an estimated number of rooms, arrival and departure dates, preferred room types and a nightly target before contacting group sales.',
    checkedAt: '2026-09-06',
    vendorIds: ['dream-inn', 'seascape', 'chaminade'],
    sections: [
      { title: 'Give hotels a brief they can quote', text: 'Tell each hotel that you are arranging a family reunion, how many rooms you estimate needing on each night, and whether guests will book and pay individually. Include your preferred dates, any flexibility, and whether you also want gathering space or catering.', bullets: ['Separate the total number of guests from the estimated number of rooms.', 'List the arrival and departure dates, plus any likely early arrivals.', 'Include room-type preferences and accessibility requests.', 'State your nightly budget as a target to discuss, not a rate you expect to be available.'] },
      { title: 'Compare more than the nightly rate', text: 'Ask for a written quote that explains taxes, mandatory fees, parking and included amenities. Ask whether there is a minimum stay or room commitment, when guests must book, and how unused rooms or cancellations are handled. Have the hotel explain any agreement before you accept it.' },
      { title: 'Keep lodging and the reunion event budget distinct', text: 'Guest-paid hotel rooms are different from expenses the organizer pays. If a hotel is also quoting your gathering, ask for lodging and event costs separately. That makes it easier to compare a resort weekend with a hotel stay plus a park picnic.' },
    ],
    questions: ['Can guests book and pay individually using a link or group code?', 'What is the total nightly cost including mandatory fees and taxes?', 'Is this a courtesy block or does the organizer make a commitment?', 'What are the booking cutoff, cancellation and unused-room terms?', 'Can guests extend their stay, and on what terms?', 'When does this quote expire, and what confirms the arrangement?'],
    takeaway: 'Send one consistent brief to two or three hotels. Record their dated replies, compare the complete terms, and publish the booking instructions to guests only when the hotel has confirmed them.',
  },
];

export function guideStructuredData(guide: PlanningGuide) {
  const url = `${siteUrl}/guides/${guide.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        mainEntityOfPage: url,
        image: [`${siteUrl}/images/santa-cruz-coast.jpg`],
        datePublished: guide.publishedAt,
        dateModified: guide.checkedAt,
        author: { '@type': 'Organization', name: 'Santa Cruz Reunion Kit', url: siteUrl },
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Planning guides', item: `${siteUrl}/guides` },
          { '@type': 'ListItem', position: 3, name: guide.shortTitle, item: url },
        ],
      },
    ],
  };
}
