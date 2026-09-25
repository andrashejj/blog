// Booking requests, owner blocks and private house settings.

import { randomBytes } from "node:crypto";
import { type Lang, house, isLang, booking as rules } from "./config";
import {
  type DateRange,
  type ISODate,
  addDays,
  diffDays,
  isISODate,
  overlaps,
  todayAtHouse,
} from "./dates";
import {
  GROUPS,
  INTERESTS,
  type Interest,
  PACES,
  type Prefs,
  TRANSPORTS,
} from "./prefs";
import { store } from "./store";

export type { Prefs } from "./prefs";

export type Status = "pending" | "approved" | "declined" | "cancelled";

export interface Booking {
  id: string;
  token: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
  checkIn: ISODate;
  checkOut: ISODate;
  adults: number;
  children: number;
  dog: boolean;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  lang: Lang;
  prefs: Prefs;
  // Shown to the guest on their page and in the approval email.
  hostNote?: string;
}

export interface Block {
  id: string;
  start: ISODate;
  end: ISODate;
  label: string;
}

export interface PrivateSettings {
  address: string;
  mapsUrl: string;
  arrival: string;
  parking: string;
  wifiName: string;
  wifiPassword: string;
  hostPhone: string;
  notes: string;
}

export const EMPTY_SETTINGS: PrivateSettings = {
  address: "",
  mapsUrl: "",
  arrival: "",
  parking: "",
  wifiName: "",
  wifiPassword: "",
  hostPhone: "",
  notes: "",
};

const newId = () => randomBytes(6).toString("hex");
const newToken = () => randomBytes(24).toString("base64url");

// ---------------------------------------------------------------- validation

export type RequestInput = Omit<
  Booking,
  "id" | "token" | "status" | "createdAt" | "updatedAt" | "hostNote"
>;

function text(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // Drop control characters except line breaks.
  return value
    .replace(/\p{Cc}/gu, (c) => (c === "\n" ? c : ""))
    .trim()
    .slice(0, max);
}

function int(value: unknown, fallback = 0): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

function oneOf<T extends string>(
  list: readonly T[],
  value: unknown,
): T | undefined {
  return list.includes(value as T) ? (value as T) : undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function stayLimits(today = todayAtHouse()) {
  return {
    first: addDays(today, 1),
    last: addDays(today, rules.horizonDays),
  };
}

// Returns the cleaned request, or the list of fields that failed.
export function parseRequest(
  body: Record<string, unknown>,
  today = todayAtHouse(),
): { ok: true; value: RequestInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const { first, last } = stayLimits(today);

  const checkIn = body.checkIn;
  const checkOut = body.checkOut;
  if (!isISODate(checkIn) || !isISODate(checkOut)) {
    errors.push("dates");
  } else {
    const nights = diffDays(checkIn, checkOut);
    if (
      checkIn < first ||
      checkIn > last ||
      nights < rules.minNights ||
      nights > rules.maxNights
    ) {
      errors.push("dates");
    }
  }

  const adults = int(body.adults, 0);
  const children = int(body.children, 0);
  if (adults < 1 || children < 0 || adults + children > house.maxGuests) {
    errors.push("guests");
  }

  const name = text(body.name, 80);
  if (name.length < 2) errors.push("name");
  const email = text(body.email, 120).toLowerCase();
  if (!EMAIL_RE.test(email)) errors.push("email");

  const rawPrefs = (body.prefs ?? {}) as Record<string, unknown>;
  const interests = Array.isArray(rawPrefs.interests)
    ? [...new Set(rawPrefs.interests)]
        .map((i) => oneOf(INTERESTS, i))
        .filter((i): i is Interest => Boolean(i))
    : [];

  if (errors.length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      checkIn: checkIn as ISODate,
      checkOut: checkOut as ISODate,
      adults,
      children,
      dog: body.dog === true,
      name,
      email,
      phone: text(body.phone, 40) || undefined,
      message: text(body.message, 1500) || undefined,
      lang: isLang(body.lang) ? body.lang : "en",
      prefs: {
        group: oneOf(GROUPS, rawPrefs.group),
        interests,
        pace: oneOf(PACES, rawPrefs.pace),
        transport: oneOf(TRANSPORTS, rawPrefs.transport),
        food: text(rawPrefs.food, 200) || undefined,
        occasion: text(rawPrefs.occasion, 160) || undefined,
      },
    },
  };
}

// ---------------------------------------------------------------- bookings

function parseAll<T>(hash: Record<string, string>): T[] {
  const items: T[] = [];
  for (const raw of Object.values(hash)) {
    try {
      items.push(JSON.parse(raw) as T);
    } catch {
      // A corrupt record should not take the whole list down.
    }
  }
  return items;
}

async function save(b: Booking) {
  await store.hset("bookings", b.id, JSON.stringify(b));
}

function isStale(b: Booking, today: ISODate): boolean {
  if (b.status === "declined" || b.status === "cancelled") {
    return diffDays(b.updatedAt.slice(0, 10), today) > rules.keepClosedDays;
  }
  return diffDays(b.checkOut, today) > rules.keepPastDays;
}

// All bookings, newest stay first. Old records are removed on the way, which
// keeps guest data only as long as the stated retention.
export async function listBookings(today = todayAtHouse()): Promise<Booking[]> {
  const all = parseAll<Booking>(await store.hgetall("bookings"));
  const stale = all.filter((b) => isStale(b, today));
  for (const b of stale) await deleteBooking(b);
  return all
    .filter((b) => !stale.includes(b))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
}

export async function getBooking(id: string): Promise<Booking | null> {
  const raw = await store.hget("bookings", id);
  return raw ? (JSON.parse(raw) as Booking) : null;
}

export async function getBookingByToken(
  token: string,
): Promise<Booking | null> {
  if (!/^[\w-]{20,64}$/.test(token)) return null;
  const id = await store.hget("tokens", token);
  if (!id) return null;
  const b = await getBooking(id);
  return b && b.token === token ? b : null;
}

export async function createBooking(input: RequestInput): Promise<Booking> {
  const now = new Date().toISOString();
  const b: Booking = {
    ...input,
    id: newId(),
    token: newToken(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  await save(b);
  await store.hset("tokens", b.token, b.id);
  return b;
}

export async function updateBooking(
  id: string,
  patch: Partial<Pick<Booking, "status" | "hostNote">>,
): Promise<Booking | null> {
  const b = await getBooking(id);
  if (!b) return null;
  const next = { ...b, ...patch, updatedAt: new Date().toISOString() };
  await save(next);
  return next;
}

export async function deleteBooking(b: Booking): Promise<void> {
  await store.hdel("bookings", b.id);
  await store.hdel("tokens", b.token);
}

// ---------------------------------------------------------------- blocks

export async function listBlocks(): Promise<Block[]> {
  return parseAll<Block>(await store.hgetall("blocks")).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
}

export async function addBlock(
  range: DateRange,
  label: string,
): Promise<Block> {
  const block: Block = { id: newId(), ...range, label: text(label, 80) };
  await store.hset("blocks", block.id, JSON.stringify(block));
  return block;
}

export async function removeBlock(id: string): Promise<void> {
  await store.hdel("blocks", id);
}

// ---------------------------------------------------------------- availability

function merge(ranges: DateRange[]): DateRange[] {
  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  const out: DateRange[] = [];
  for (const r of sorted) {
    const last = out.at(-1);
    if (last && r.start <= last.end) {
      if (r.end > last.end) last.end = r.end;
    } else {
      out.push({ start: r.start, end: r.end });
    }
  }
  return out;
}

// Nights nobody can request: confirmed stays and owner blocks. Pending
// requests stay open so the host can choose between overlapping ones.
export async function unavailableRanges(
  today = todayAtHouse(),
): Promise<DateRange[]> {
  const [bookings, blocks] = await Promise.all([
    listBookings(today),
    listBlocks(),
  ]);
  const taken = [
    ...bookings
      .filter((b) => b.status === "approved")
      .map((b) => ({
        start: b.checkIn,
        end: b.checkOut,
      })),
    ...blocks.map((b) => ({ start: b.start, end: b.end })),
  ];
  return merge(taken).filter((r) => r.end > today);
}

export function conflictsWith(range: DateRange, ranges: DateRange[]): boolean {
  return ranges.some((r) => overlaps(range, r));
}

// ---------------------------------------------------------------- guest access

export type Access = "pending" | "open" | "ended" | "declined" | "cancelled";

export function accessUntil(b: Booking): ISODate {
  return addDays(b.checkOut, rules.accessGraceDays);
}

export function guestAccess(b: Booking, today = todayAtHouse()): Access {
  if (b.status === "declined") return "declined";
  if (b.status === "cancelled") return "cancelled";
  if (b.status === "pending") return today > b.checkIn ? "ended" : "pending";
  return today > accessUntil(b) ? "ended" : "open";
}

export function detailsRevealed(b: Booking, today = todayAtHouse()): boolean {
  return diffDays(today, b.checkIn) <= rules.revealDaysBefore;
}

// ---------------------------------------------------------------- settings

export async function getSettings(): Promise<PrivateSettings> {
  const raw = await store.get("settings");
  if (!raw) return { ...EMPTY_SETTINGS };
  try {
    return {
      ...EMPTY_SETTINGS,
      ...(JSON.parse(raw) as Partial<PrivateSettings>),
    };
  } catch {
    return { ...EMPTY_SETTINGS };
  }
}

export async function saveSettings(
  body: Record<string, unknown>,
): Promise<PrivateSettings> {
  const next = { ...EMPTY_SETTINGS };
  for (const key of Object.keys(EMPTY_SETTINGS) as (keyof PrivateSettings)[]) {
    next[key] = text(
      body[key],
      key === "arrival" || key === "notes" ? 3000 : 300,
    );
  }
  await store.set("settings", JSON.stringify(next));
  return next;
}
