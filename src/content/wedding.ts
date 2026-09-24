/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT YOUR WEDDING HERE — and only here.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every name, date, place and paragraph on the site comes from this file.
 *  All the values below are tasteful placeholders: swap them for the real
 *  details and the whole site updates. Nothing else needs touching.
 */

export const couple = {
  /** Shown big on the front page, in that order. */
  one: 'Krister',
  two: 'Kjersti',
  /** Used in the browser tab, link previews and the footer. */
  hashtag: '#RosaAndEllis',
}

export const wedding = {
  /** Human-readable date. Keep it short — it is set in large display type. */
  date: 'Lørdag 17 april 2027',
  dateShort: '17 . 04 . 2027',
  /** Machine-readable, for the countdown. Format: YYYY-MM-DDTHH:MM:SS */
  startsAt: '2027-04-17T15:00:00',
  // ceremonyTime: '2 in the afternoon',
  venueName: 'Lerflaten Gård',
  venueAddress: 'Ashcombe Vale, Somerset BA3 0QT',
  venueMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Somerset+England',
  dressCode: 'Pent',
  dressCodeNote:
    'Think linen, long dresses and colour. The ceremony is on grass and the dancing carries on outside, so bring shoes you can stand in for a while and a layer for when the sun goes down.',
}

/** The long-form “about the wedding” copy on the front page. */
export const story = {
  // eyebrow: 'Ten years in the making',
  heading: 'Vi gifter oss!',
  paragraphs: [
    'We met in a queue for a very bad cup of coffee, and we have been arguing about where to get the good stuff ever since. Ten years, four flats, one stubborn dog and a great many kitchen-table dinners later, we are doing the obvious thing about it.',
    'We wanted a weekend rather than an afternoon — somewhere everyone we love could sit at the same long table, eat far too much, and stay up later than they meant to. So we found a stone barn at the end of a lane in Somerset, booked it for two days, and filled it with the people who made us.',
    'There is no seating plan drama, no five-hour photography interlude, and absolutely no obligation to dance. There is a field, a lot of food, and the whole of Friday night as a warm-up. Come for all of it if you can.',
  ],
}

/** The Saturday running order. */
export const schedule = [
  {
    time: '14:00',
    title: 'Ankomst',
    detail: 'Parkering hos Lerflaten Gård, ellers er det taxi som gjelder',
  },
  {
    time: '15:00 pm',
    title: 'Middag, kaker, taler osv.',
    detail: 'Koldtbord-middag inne på låven',
  },
  {
    time: '21:00',
    title: 'Dansegulv?!',
    detail: 'Fizz, lemonade, small things on trays, and the lawn games that will get competitive quickly.',
  },
  {
    time: '23:00 pm',
    title: 'Nattmat',
    detail: 'Blir det kokt grillpølse?',
  },
  {
    time: '8:30 pm',
    title: 'Dancing',
    detail: 'Doors open, band on, terrace lit. Requests welcome and mostly honoured.',
  },
  {
    time: '01:00',
    title: 'Festen er over',
    detail: 'Bacon rolls, then taxis from the top of the lane. The bar closes; the fire pit does not.',
  },
]

/** The Friday-night event people sign up for. */
export const fridayEvent = {
  name: 'Fredagstreff',
  date: 'Fridag 16 april 2027',
  time: '6:30 pm until late',
  venueName: 'TBD',
  venueAddress: 'Trondheim et sted',
  blurb:
    'Kvelden før bryllupsfesten ønsker vi å samle de som vil til et uformelt bli-kjent treff på en bar. Blir det også noe lindy hop kanskje?',
  practicalities: [
    'Ingen dresscode, bare møt opp når du ønsker og ha på det du føler for',
    'Children are very welcome on Friday, and there is a garden to run around in.',
    'Food is served from 7:00 pm, so arrive hungry rather than fashionably late.',
  ],
  /** Sign-ups close on this date (shown as plain text). */
  rsvpBy: '01 april 2027',
  /** Roughly how many the courtyard holds — shown to nudge early sign-ups. */
  capacityNote: 'For å booke sted så trenger vi å vite hvor mange som ønsker å delta på fredagen.',
}

export const travel = [
  {
    title: 'Getting there',
    body: 'The nearest station is Bath Spa, 25 minutes away by taxi. Trains from London Paddington take about 90 minutes. If you are driving, there is plenty of parking in the top meadow and you are welcome to leave a car overnight.',
  },
  {
    title: 'Staying over',
    body: 'We have held rooms at two places in the village at a reduced rate until March 2027 — quote our names when booking. There is also space for a handful of camper vans in the orchard if that is more your speed.',
  },
  {
    title: 'Presents',
    body: 'Your being there is genuinely the thing we want. If you would like to give something anyway, we are putting a pot together towards a very long honeymoon and there is a card at the barn.',
  },
]

export const faqs = [
  {
    q: 'Can I bring my children?',
    a: 'On Friday night, absolutely — the more the better. Saturday is an adults-only day, mostly so that the parents among you get an evening off. We can recommend local sitters if that helps.',
  },
  {
    q: 'Can I bring a plus one?',
    a: 'If your invitation names two people, yes. If you are coming solo and would rather not, tell us and we will seat you brilliantly.',
  },
  {
    q: 'What if it rains?',
    a: 'Then we all move inside the barn, which is beautiful, dry and holds everyone comfortably. The ceremony works in there too.',
  },
  {
    q: 'Any dietary requirements?',
    a: 'Tell us on the Friday sign-up form and we will pass everything to the kitchen for both days. Vegetarian and vegan options are standard, not an afterthought.',
  },
  {
    q: 'Is the venue accessible?',
    a: 'The barn, the lawn and the loos are all step-free, though the lawn is grass and the lane is gravel. Let us know what you need and we will make sure it is sorted before you arrive.',
  },
]
