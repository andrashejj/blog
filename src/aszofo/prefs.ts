// What guests can tell us about themselves when they ask for dates.

export const GROUPS = [
  "couple",
  "friends",
  "family-young",
  "family-older",
  "solo",
] as const;

export const INTERESTS = [
  "wine",
  "food",
  "lake",
  "walk",
  "bike",
  "culture",
  "market",
  "slow",
  "wellness",
] as const;

export const PACES = ["slow", "balanced", "full"] as const;
export const TRANSPORTS = ["car", "train", "unsure"] as const;

export type Group = (typeof GROUPS)[number];
export type Interest = (typeof INTERESTS)[number];
export type Pace = (typeof PACES)[number];
export type Transport = (typeof TRANSPORTS)[number];

export interface Prefs {
  group?: Group;
  interests: Interest[];
  pace?: Pace;
  transport?: Transport;
  food?: string;
  occasion?: string;
}
