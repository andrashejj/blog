// Shared pricing for the form, persisted requests, guest pages and emails.
import { type Lang, costs } from "./config";
import { diffDays } from "./dates";

export const KEY_OPTIONS = ["hunor", "budapest"] as const;
export type KeyOption = (typeof KEY_OPTIONS)[number];
export const GUEST_TYPES = ["regular", "friends"] as const;
export type GuestType = (typeof GUEST_TYPES)[number];

export function keysOptional(checkIn: string): boolean {
  return (costs.keysOptionalMonths as readonly number[]).includes(
    Number(checkIn.slice(5, 7)),
  );
}
export function effectiveKeys(checkIn: string, keys?: KeyOption): KeyOption {
  return keysOptional(checkIn) && keys === "budapest" ? "budapest" : "hunor";
}

// All amounts are stored in EUR; capture the conversion with the quote too.
export interface CostBreakdown {
  nightly: number;
  nights: number;
  accommodation: number;
  cleaning: number;
  keys: number;
  thanks: number;
  total: number;
  hufPerEuro: number;
}

export function quoteStay(
  checkIn: string,
  checkOut: string,
  guestType: GuestType,
  keys?: KeyOption,
): CostBreakdown {
  const nightly = costs.nightly[guestType];
  const nights = Math.max(0, diffDays(checkIn, checkOut));
  const keyCost =
    effectiveKeys(checkIn, keys) === "hunor"
      ? costs.keyVisits * costs.keyVisitPrice
      : 0;
  const accommodation = nightly * nights;
  return {
    nightly,
    nights,
    accommodation,
    cleaning: costs.cleaning,
    keys: keyCost,
    thanks: 0,
    total: accommodation + costs.cleaning + keyCost,
    hufPerEuro: costs.hufPerEuro,
  };
}

export function costsFor(b: {
  checkIn: string;
  keys?: KeyOption;
  thanks?: number;
  pricing?: CostBreakdown;
}): CostBreakdown {
  if (b.pricing) return b.pricing;
  // Existing requests retain the previous cleaning + keys + thank-you model.
  const keyCost =
    effectiveKeys(b.checkIn, b.keys) === "hunor"
      ? costs.keyVisits * costs.keyVisitPrice
      : 0;
  const thanks = Math.max(0, Math.round(b.thanks ?? 0) || 0);
  return {
    nightly: 0,
    nights: 0,
    accommodation: 0,
    cleaning: costs.cleaning,
    keys: keyCost,
    thanks,
    total: costs.cleaning + keyCost + thanks,
    hufPerEuro: costs.hufPerEuro,
  };
}

export function money(
  amount: number,
  lang: Lang,
  hufPerEuro: number = costs.hufPerEuro,
): string {
  return new Intl.NumberFormat(
    lang === "hu" ? "hu-HU" : lang === "de" ? "de-DE" : "en-IE",
    {
      style: "currency",
      currency: lang === "hu" ? "HUF" : "EUR",
      maximumFractionDigits: 0,
    },
  ).format(lang === "hu" ? amount * hufPerEuro : amount);
}
export const euro = (n: number) => money(n, "en");
