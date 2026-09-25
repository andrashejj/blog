// Date-only helpers. Stays are counted in nights, and every date is an ISO
// "YYYY-MM-DD" string handled in UTC so time zones never shift a day.

export type ISODate = string;

export interface DateRange {
  start: ISODate; // first night
  end: ISODate; // check-out day, not a night
}

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isISODate(value: unknown): value is ISODate {
  if (typeof value !== "string" || !ISO_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function toDate(iso: ISODate): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function toISO(date: Date): ISODate {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

export function diffDays(from: ISODate, to: ISODate): number {
  return Math.round(
    (toDate(to).getTime() - toDate(from).getTime()) / 86_400_000,
  );
}

// Today's date at the house, which is what "tomorrow" and "after check-out"
// mean to a guest.
export function todayAtHouse(now = new Date()): ISODate {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Budapest",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function nightsOf(range: DateRange): ISODate[] {
  const nights: ISODate[] = [];
  for (let d = range.start; d < range.end; d = addDays(d, 1)) nights.push(d);
  return nights;
}

export function overlaps(a: DateRange, b: DateRange): boolean {
  return a.start < b.end && b.start < a.end;
}

// 1–12 for every month the stay touches.
export function monthsOf(range: DateRange): number[] {
  const months = new Set<number>();
  for (const night of nightsOf(range)) months.add(Number(night.slice(5, 7)));
  months.add(Number(range.end.slice(5, 7)));
  return [...months];
}

// 0 (Sunday) – 6 for every day the guest is at the house, arrival to departure.
export function weekdaysOf(range: DateRange): number[] {
  const days = new Set<number>();
  for (let d = range.start; d <= range.end; d = addDays(d, 1)) {
    days.add(toDate(d).getUTCDay());
    if (days.size === 7) break;
  }
  return [...days];
}
