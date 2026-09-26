// Restaurants, cellars, sights and markets near the house, researched and
// sourced in places.json. This module types them and fills in drive times.

import { type Lang, house } from "./config";
import raw from "./data/places.json";

export const CATEGORIES = [
  "restaurant",
  "cafe",
  "winery",
  "lake",
  "nature",
  "culture",
  "market",
  "event",
  "kids",
  "wellness",
] as const;

export type Category = (typeof CATEGORIES)[number];

interface RawPlace {
  id: string;
  name: string;
  town: string;
  category: string;
  lat: number;
  lng: number;
  driveMinutes: number | null;
  url: string | null;
  months: number[];
  days: number[] | null;
  bookingAdvised: boolean;
  kidFriendly: boolean;
  price: number | null;
  noCar: boolean;
  tags: string[];
  desc_en: string;
  desc_hu: string;
  desc_de: string;
  tip_en?: string | null;
  tip_hu?: string | null;
  tip_de?: string | null;
  dates?: { start: string; end: string }[];
  hostPick?: boolean;
}

export interface Place {
  id: string;
  name: string;
  town: string;
  category: Category;
  lat: number;
  lng: number;
  minutes: number;
  url: string | null;
  months: number[];
  days: number[] | null;
  bookingAdvised: boolean;
  kidFriendly: boolean;
  price: number | null;
  noCar: boolean;
  tags: string[];
  desc: Record<Lang, string>;
  tip: Record<Lang, string> | null;
  // Known dates for events that move each year; `end` is the day after.
  dates: { start: string; end: string }[];
  // On the hosts' own list of places they go to.
  hostPick: boolean;
}

function km(lat: number, lng: number): number {
  const rad = Math.PI / 180;
  const dLat = (lat - house.lat) * rad;
  const dLng = (lng - house.lng) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(house.lat * rad) * Math.cos(lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

// Country roads here wind; straight-line distance times 1.35 at ~55 km/h is
// close to what the drive actually takes.
function estimateMinutes(lat: number, lng: number): number {
  return Math.max(3, Math.round((km(lat, lng) * 1.35 * 60) / 55));
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export const places: Place[] = (raw.places as RawPlace[])
  .filter((p) => isCategory(p.category))
  .map((p) => ({
    id: p.id,
    name: p.name,
    town: p.town,
    category: p.category as Category,
    lat: p.lat,
    lng: p.lng,
    minutes: p.driveMinutes ?? estimateMinutes(p.lat, p.lng),
    url: p.url,
    months: p.months,
    days: p.days,
    bookingAdvised: p.bookingAdvised,
    kidFriendly: p.kidFriendly,
    price: p.price,
    noCar: p.noCar,
    tags: p.tags,
    desc: { en: p.desc_en, hu: p.desc_hu, de: p.desc_de },
    tip:
      p.tip_en && p.tip_hu && p.tip_de
        ? { en: p.tip_en, hu: p.tip_hu, de: p.tip_de }
        : null,
    dates: p.dates ?? [],
    hostPick: p.hostPick === true,
  }));
