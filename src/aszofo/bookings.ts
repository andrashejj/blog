// Booking requests, owner blocks and private house settings.

import { randomBytes } from "node:crypto";
import { type Lang, costs, house, isLang, booking as rules } from "./config";
import { KEY_OPTIONS, type KeyOption, effectiveKeys } from "./costs";
import {
  type DateRange,
  type ISODate,
  addDays,
  diffDays,
  isISODate,
  overlaps,
  todayAtHouse,
} from "./dates";
import { env } from "./env";
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
  // How the guest gets in: Hunor, or keys collected in Budapest (summer only).
  keys: KeyOption;
  // An optional thank-you in euros, on top of cleaning and keys.
  thanks: number;
  // Shown to the guest on their page and in the approval email.
  hostNote?: string;
  // The host who approved or declined, who signs the note.
  decidedBy?: string;
}

export interface Block {
  id: string;
  start: ISODate;
  end: ISODate;
  label: string;
}

export interface PrivateSettings {
  // Free text; the house has no street address.
  address: string;
  mapsUrl: string;
  // Resolved from mapsUrl when the settings are saved.
  lat: string;
  lng: string;
  parking: string;
  keyPhone: string;
  keyPickup: string;
  arrival: string;
  whatsapp: string;
  notes: string;
}

export const EMPTY_SETTINGS: PrivateSettings = {
  address: "",
  mapsUrl: "",
  lat: "",
  lng: "",
  parking: "",
  keyPhone: "",
  keyPickup: "",
  arrival: "",
  whatsapp: "",
  notes: "",
};

const newId = () => randomBytes(6).toString("hex");
const newToken = () => randomBytes(24).toString("base64url");

// ---------------------------------------------------------------- validation

export type RequestInput = Omit<
  Booking,
  | "id"
  | "token"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "hostNote"
  | "decidedBy"
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

  const thanks = Math.min(
    costs.maxThanks,
    Math.max(0, Math.round(Number(body.thanks) || 0)),
  );

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
      keys: effectiveKeys(checkIn as ISODate, oneOf(KEY_OPTIONS, body.keys)),
      thanks,
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
  patch: Partial<Pick<Booking, "status" | "hostNote" | "decidedBy">>,
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

// Values set in the environment (ASZOFO_HOUSE, a JSON object) fill in
// anything the hosts haven't saved from the dashboard yet.
function settingsDefaults(): Partial<PrivateSettings> {
  try {
    const parsed = JSON.parse(env("ASZOFO_HOUSE") ?? "{}") as Record<
      string,
      unknown
    >;
    const out: Partial<PrivateSettings> = {};
    for (const key of Object.keys(
      EMPTY_SETTINGS,
    ) as (keyof PrivateSettings)[]) {
      if (parsed[key] !== undefined) out[key] = String(parsed[key]);
    }
    return out;
  } catch {
    return {};
  }
}

export async function getSettings(): Promise<PrivateSettings> {
  const defaults = settingsDefaults();
  const raw = await store.get("settings");
  let saved: Partial<PrivateSettings> = {};
  try {
    saved = raw ? (JSON.parse(raw) as Partial<PrivateSettings>) : {};
  } catch {
    saved = {};
  }
  const merged = { ...EMPTY_SETTINGS };
  for (const key of Object.keys(EMPTY_SETTINGS) as (keyof PrivateSettings)[]) {
    merged[key] = saved[key] || defaults[key] || "";
  }
  // The pin belongs to whichever map link is in use.
  if (saved.mapsUrl) {
    merged.lat = saved.lat ?? "";
    merged.lng = saved.lng ?? "";
  }
  return merged;
}

// Pulls the pin out of a Google Maps link. Short links (maps.app.goo.gl) are
// followed one redirect; only Google hosts are fetched.
export async function coordsFromMapsUrl(
  url: string,
): Promise<{ lat: string; lng: string } | null> {
  const parse = (value: string) => {
    const pin =
      value.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/) ??
      value.match(
        /[?&](?:q|query|destination)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
      ) ??
      value.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    return pin ? { lat: pin[1], lng: pin[2] } : null;
  };
  const direct = parse(decodeURIComponent(url));
  if (direct) return direct;
  try {
    const host = new URL(url).hostname;
    if (!/(^|\.)(goo\.gl|google\.[a-z.]+)$/.test(host)) return null;
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    });
    const location = res.headers.get("location");
    return location ? parse(decodeURIComponent(location)) : null;
  } catch {
    return null;
  }
}

export async function saveSettings(
  body: Record<string, unknown>,
): Promise<PrivateSettings> {
  const next = { ...EMPTY_SETTINGS };
  for (const key of Object.keys(EMPTY_SETTINGS) as (keyof PrivateSettings)[]) {
    next[key] = text(
      body[key],
      key === "arrival" || key === "notes" || key === "address" ? 3000 : 300,
    );
  }
  const pin = next.mapsUrl ? await coordsFromMapsUrl(next.mapsUrl) : null;
  next.lat = pin?.lat ?? "";
  next.lng = pin?.lng ?? "";
  await store.set("settings", JSON.stringify(next));
  return next;
}
