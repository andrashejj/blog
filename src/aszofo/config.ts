// House rules and system settings for the Aszófő booking pages. Everything a
// host might want to change without touching page code lives here.

export const LANGS = ["en", "hu", "de"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export function isLang(value: unknown): value is Lang {
  return (
    typeof value === "string" && (LANGS as readonly string[]).includes(value)
  );
}

export const house = {
  // Public contact shown on the pages and used as the reply-to for emails.
  contactEmail: "andras@hejj.xyz",
  hostName: "Andras",
  maxGuests: 6,
  bedrooms: 3,
  plotSquareMetres: 6186,
  checkInFrom: "15:00",
  checkOutBy: "11:00",
  // Village-level position only. The exact address is private and lives in
  // the admin settings, shown to confirmed guests.
  lat: 46.9289,
  lng: 17.8334,
} as const;

export const booking = {
  minNights: 2,
  maxNights: 21,
  // Earliest check-in is tomorrow; latest is this many days ahead.
  horizonDays: 540,
  // The guest page stays open until this many days after check-out.
  accessGraceDays: 3,
  // Door code, Wi-Fi and similar details appear this many days before arrival.
  revealDaysBefore: 14,
  // Declined and cancelled requests are deleted after this many days, past
  // stays after this many days from check-out.
  keepClosedDays: 90,
  keepPastDays: 400,
} as const;

// There's no nightly rate: guests cover cleaning and the key holder, whatever
// the length of stay, and may add a thank-you of their own choosing.
export const costs = {
  cleaning: 40,
  // Hunor comes twice (arrival and departure), 10 € a visit.
  keyVisits: 2,
  keyVisitPrice: 10,
  // From October to April he also opens the water and runs the heating, so
  // he's needed. From May to September guests may collect the keys in
  // Budapest instead.
  keysOptionalMonths: [5, 6, 7, 8, 9],
  maxThanks: 5000,
} as const;

// Who holds the keys. His phone number is a private setting.
export const keyContact = "Hunor";

// Keep the public page out of search results until it has its own domain.
export const indexable = false;

export const BASE_PATH = "/aszofo";
