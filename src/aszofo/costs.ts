// What a stay costs. Shared by the request form, the server and the emails.

import { costs } from "./config";

export const KEY_OPTIONS = ["hunor", "budapest"] as const;
export type KeyOption = (typeof KEY_OPTIONS)[number];

// Hunor is needed unless the stay starts between May and September.
export function keysOptional(checkIn: string): boolean {
  return (costs.keysOptionalMonths as readonly number[]).includes(
    Number(checkIn.slice(5, 7)),
  );
}

export function effectiveKeys(checkIn: string, keys?: KeyOption): KeyOption {
  return keysOptional(checkIn) && keys === "budapest" ? "budapest" : "hunor";
}

export interface CostBreakdown {
  cleaning: number;
  keys: number;
  thanks: number;
  total: number;
}

export function costsFor(
  checkIn: string,
  keys: KeyOption | undefined,
  thanks: number,
): CostBreakdown {
  const keyCost =
    effectiveKeys(checkIn, keys) === "hunor"
      ? costs.keyVisits * costs.keyVisitPrice
      : 0;
  const t = Math.max(0, Math.round(thanks) || 0);
  return {
    cleaning: costs.cleaning,
    keys: keyCost,
    thanks: t,
    total: costs.cleaning + keyCost + t,
  };
}

// A no-break space keeps the amount and the sign on one line.
export const euro = (n: number) => `${n}\u00a0€`;
