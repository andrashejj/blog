// Chooses places for a guest from their dates and what they told us.
// Deterministic on purpose: the same answers give the same page.

import type { Booking } from "./bookings";
import {
  type DateRange,
  addDays,
  monthsOf,
  overlaps,
  weekdaysOf,
} from "./dates";
import { CATEGORIES, type Category, type Place, places } from "./places";
import type { Interest } from "./prefs";

const INTEREST_TAGS: Record<Interest, string[]> = {
  wine: ["wine"],
  food: ["food", "fine-dining", "casual"],
  lake: ["lake", "swim", "sail"],
  walk: ["walk", "hike"],
  bike: ["bike"],
  culture: ["culture", "history", "architecture", "art"],
  market: ["market", "crafts"],
  slow: ["slow", "views"],
  wellness: ["wellness"],
};

const CATEGORY_INTEREST: Partial<Record<Category, Interest>> = {
  restaurant: "food",
  cafe: "food",
  winery: "wine",
  lake: "lake",
  nature: "walk",
  culture: "culture",
  market: "market",
  wellness: "wellness",
};

export interface Scored {
  place: Place;
  score: number;
  reasons: Interest[];
  // An event whose dates for this year aren't known yet.
  unconfirmed: boolean;
}

// Events move every year. When we know this year's dates they must overlap
// the stay; when we don't, the event is shown as "usually around now" but
// never picked, so nobody plans a day around a festival that already ended.
function eventTiming(place: Place, stay: DateRange): "on" | "off" | "maybe" {
  const year = stay.start.slice(0, 4);
  const known = place.dates.filter(
    (d) => d.start.startsWith(year) || d.end.startsWith(year),
  );
  if (known.length === 0) return "maybe";
  // Guests are around on their departure morning too.
  const days = { start: stay.start, end: addDays(stay.end, 1) };
  return known.some((d) => overlaps(days, d)) ? "on" : "off";
}

export function openDuring(place: Place, stay: DateRange): boolean {
  const months = monthsOf(stay);
  if (!place.months.some((m) => months.includes(m))) return false;
  if (place.category === "event" && eventTiming(place, stay) === "off") {
    return false;
  }
  if (!place.days) return true;
  const days = weekdaysOf(stay);
  return place.days.some((d) => days.includes(d));
}

function hasFamily(b: Booking): boolean {
  return (
    b.children > 0 ||
    b.prefs.group === "family-young" ||
    b.prefs.group === "family-older"
  );
}

export function score(place: Place, b: Booking): Scored {
  const p = b.prefs;
  const reasons: Interest[] = [];
  let s = 1;

  for (const interest of p.interests) {
    const tagged = place.tags.some((t) => INTEREST_TAGS[interest].includes(t));
    if (tagged || CATEGORY_INTEREST[place.category] === interest) {
      s += 3;
      reasons.push(interest);
    }
  }

  const family = hasFamily(b);
  if (family) {
    if (place.kidFriendly) s += 1.5;
    if (place.category === "kids") s += 1;
    if (p.group === "family-young" && place.tags.includes("fine-dining"))
      s -= 2;
  } else if (place.category === "kids") {
    s -= 4;
  }
  if (
    (p.group === "couple" || p.group === "solo") &&
    place.tags.includes("fine-dining")
  ) {
    s += 1;
  }

  if (p.transport === "train") s += place.noCar ? 1.5 : -1.5;
  if (p.pace === "slow")
    s += place.minutes <= 20 ? 1 : place.minutes > 40 ? -2 : 0;
  if (place.category === "event") s += 1.5; // timely, and only shown when on

  s -= place.minutes / 30;
  const unconfirmed =
    place.category === "event" &&
    eventTiming(place, { start: b.checkIn, end: b.checkOut }) === "maybe";
  return { place, score: s, reasons, unconfirmed };
}

export interface Recommendation {
  picks: Scored[];
  groups: { category: Category; items: Scored[] }[];
}

export function recommend(b: Booking): Recommendation {
  const stay = { start: b.checkIn, end: b.checkOut };
  const scored = places
    .filter((place) => openDuring(place, stay))
    .map((place) => score(place, b))
    .sort((x, y) => y.score - x.score || x.place.minutes - y.place.minutes);

  const size = b.prefs.pace === "slow" ? 5 : b.prefs.pace === "full" ? 8 : 6;
  const perCategory = new Map<Category, number>();
  const picks: Scored[] = [];
  const take = (item: Scored) => {
    picks.push(item);
    perCategory.set(
      item.place.category,
      (perCategory.get(item.place.category) ?? 0) + 1,
    );
  };
  const fits = (item: Scored) =>
    !picks.includes(item) &&
    !item.unconfirmed &&
    (perCategory.get(item.place.category) ?? 0) < 2;

  // Take turns between the guest's interests so wine and food, which match
  // many places, don't crowd out the one walk they asked for.
  const interests = b.prefs.interests;
  for (let round = 0; round < size && picks.length < size; round++) {
    let added = false;
    for (const interest of interests) {
      if (picks.length >= size) break;
      // Prefer a place that is mainly about this interest (a cellar for
      // wine, a walk for walks) over one that only touches on it.
      const next =
        scored.find(
          (item) =>
            fits(item) && CATEGORY_INTEREST[item.place.category] === interest,
        ) ??
        scored.find((item) => fits(item) && item.reasons.includes(interest));
      if (next) {
        take(next);
        added = true;
      }
    }
    if (!added) break;
  }
  // Then the best of the rest: everything for guests who told us nothing,
  // otherwise only places that match something they said.
  for (const item of scored) {
    if (picks.length >= size) break;
    if (!fits(item)) continue;
    if (interests.length > 0 && item.reasons.length === 0) continue;
    take(item);
  }
  picks.sort((x, y) => y.score - x.score);

  const family = hasFamily(b);
  const groups = CATEGORIES.filter((c) => c !== "kids" || family)
    .map((category) => ({
      category,
      items: scored.filter((s) => s.place.category === category),
    }))
    .filter((g) => g.items.length > 0);

  return { picks, groups };
}
