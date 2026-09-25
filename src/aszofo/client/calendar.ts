// A month-grid date range picker. Guests pick an arrival night and a
// departure day; the host uses the same grid to block dates.

import { type DateRange, addDays, diffDays, toDate } from "../dates";

export interface Selection {
  checkIn?: string;
  checkOut?: string;
}

export interface CalendarOptions {
  months: HTMLElement;
  prev?: HTMLButtonElement | null;
  next?: HTMLButtonElement | null;
  locale: string;
  labels: { taken: string; today: string };
  today: string;
  first: string; // earliest arrival
  last: string; // latest arrival
  unavailable: DateRange[];
  // Extra ranges drawn with a small mark (pending requests, for the host).
  marks?: DateRange[];
  minNights: number;
  maxNights: number;
  // Host mode: any future range can be selected, taken nights included.
  free?: boolean;
  onChange: (selection: Selection) => void;
}

const pad = (n: number) => String(n).padStart(2, "0");
const monthKey = (iso: string) => iso.slice(0, 7);

function nightSet(ranges: DateRange[]): Set<string> {
  const set = new Set<string>();
  for (const r of ranges) {
    for (let d = r.start; d < r.end; d = addDays(d, 1)) set.add(d);
  }
  return set;
}

function shiftMonth(key: string, by: number): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + by, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

export function createCalendar(opts: CalendarOptions) {
  let taken = nightSet(opts.unavailable);
  let marked = nightSet(opts.marks ?? []);
  let sel: Selection = {};
  let hover: string | undefined;
  let view = monthKey(opts.first < opts.today ? opts.today : opts.first);
  const lastMonth = monthKey(addDays(opts.last, opts.maxNights));

  const wide = window.matchMedia("(min-width: 720px)");
  const count = () => (wide.matches ? 2 : 1);

  const monthName = new Intl.DateTimeFormat(opts.locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const dayLabel = new Intl.DateTimeFormat(opts.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const weekdayShort = new Intl.DateTimeFormat(opts.locale, {
    weekday: "short",
    timeZone: "UTC",
  });
  // 2024-01-01 was a Monday.
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    weekdayShort.format(new Date(Date.UTC(2024, 0, 1 + i))).replace(".", ""),
  );

  // The latest valid departure for the current arrival: stop at the first
  // taken night, the maximum stay, or the end of the calendar.
  function departureLimit(checkIn: string): string {
    let limit = addDays(checkIn, opts.maxNights);
    if (opts.free) return addDays(checkIn, 366);
    for (let d = addDays(checkIn, 1); d < limit; d = addDays(d, 1)) {
      if (taken.has(d)) {
        limit = d;
        break;
      }
    }
    return limit;
  }

  // An arrival only counts if a minimum stay fits before the next taken night.
  function canArrive(d: string): boolean {
    if (opts.free) return d >= opts.today;
    if (d < opts.first || d > opts.last || taken.has(d)) return false;
    return diffDays(d, departureLimit(d)) >= opts.minNights;
  }

  function canDepart(d: string): boolean {
    if (!sel.checkIn || sel.checkOut) return false;
    const nights = diffDays(sel.checkIn, d);
    const min = opts.free ? 1 : opts.minNights;
    return nights >= min && d <= departureLimit(sel.checkIn);
  }

  function choose(d: string) {
    if (sel.checkIn && !sel.checkOut && canDepart(d)) {
      sel = { checkIn: sel.checkIn, checkOut: d };
    } else if (canArrive(d)) {
      sel = { checkIn: d };
    } else {
      return;
    }
    hover = undefined;
    render();
    opts.onChange({ ...sel });
  }

  function dayClasses(d: string): string[] {
    const cls = ["day"];
    if (d === opts.today) cls.push("today");
    if (taken.has(d)) cls.push("taken");
    if (marked.has(d)) cls.push("pending-mark");
    const { checkIn, checkOut } = sel;
    if (checkIn === d) cls.push("start");
    if (checkOut === d) cls.push("end");
    if (checkIn && checkOut && d > checkIn && d < checkOut)
      cls.push("in-range");
    if (
      checkIn &&
      !checkOut &&
      hover &&
      canDepart(hover) &&
      d > checkIn &&
      d <= hover
    ) {
      cls.push("preview");
    }
    return cls;
  }

  function monthEl(key: string): HTMLElement {
    const [y, m] = key.split("-").map(Number);
    const wrap = document.createElement("div");
    wrap.className = "cal-month";
    const title = document.createElement("h4");
    title.textContent = monthName.format(new Date(Date.UTC(y, m - 1, 1)));
    wrap.append(title);

    const grid = document.createElement("div");
    grid.className = "cal-grid";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", title.textContent);
    for (const w of weekdays) {
      const el = document.createElement("span");
      el.className = "cal-dow";
      el.setAttribute("aria-hidden", "true");
      el.textContent = w;
      grid.append(el);
    }

    const firstDay = `${key}-01`;
    const offset = (toDate(firstDay).getUTCDay() + 6) % 7;
    for (let i = 0; i < offset; i++) {
      const empty = document.createElement("span");
      empty.className = "cal-empty";
      grid.append(empty);
    }

    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    for (let n = 1; n <= daysInMonth; n++) {
      const d = `${key}-${pad(n)}`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.date = d;
      btn.textContent = String(n);
      btn.className = dayClasses(d).join(" ");
      const enabled = canArrive(d) || canDepart(d);
      btn.disabled = !enabled;
      const notes = [dayLabel.format(toDate(d))];
      if (taken.has(d)) notes.push(opts.labels.taken);
      if (d === opts.today) notes.push(opts.labels.today);
      btn.setAttribute("aria-label", notes.join(", "));
      if (sel.checkIn === d || sel.checkOut === d)
        btn.setAttribute("aria-pressed", "true");
      grid.append(btn);
    }
    wrap.append(grid);
    return wrap;
  }

  function render() {
    const n = count();
    const focused = (document.activeElement as HTMLElement | null)?.dataset
      ?.date;
    opts.months.replaceChildren();
    opts.months.dataset.count = String(n);
    for (let i = 0; i < n; i++)
      opts.months.append(monthEl(shiftMonth(view, i)));
    opts.months.removeAttribute("aria-busy");
    if (opts.prev) opts.prev.disabled = view <= monthKey(opts.today);
    if (opts.next) opts.next.disabled = shiftMonth(view, n - 1) >= lastMonth;
    if (focused) {
      opts.months
        .querySelector<HTMLElement>(`[data-date="${focused}"]`)
        ?.focus();
    }
  }

  opts.months.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "button[data-date]",
    );
    if (btn && !btn.disabled) choose(btn.dataset.date as string);
  });

  opts.months.addEventListener("mouseover", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "button[data-date]",
    );
    if (!sel.checkIn || sel.checkOut || !btn) return;
    const d = btn.dataset.date;
    if (d === hover) return;
    hover = d;
    for (const el of opts.months.querySelectorAll<HTMLElement>(
      "button[data-date]",
    )) {
      const date = el.dataset.date as string;
      el.classList.toggle(
        "preview",
        Boolean(
          hover &&
            canDepart(hover) &&
            date > (sel.checkIn as string) &&
            date <= hover,
        ),
      );
    }
  });

  opts.prev?.addEventListener("click", () => {
    view = shiftMonth(view, -1);
    render();
  });
  opts.next?.addEventListener("click", () => {
    view = shiftMonth(view, 1);
    render();
  });
  wide.addEventListener("change", render);

  render();

  return {
    clear() {
      sel = {};
      render();
      opts.onChange({});
    },
    setUnavailable(ranges: DateRange[]) {
      taken = nightSet(ranges);
      render();
    },
    setMarks(ranges: DateRange[]) {
      marked = nightSet(ranges);
      render();
    },
    get selection(): Selection {
      return { ...sel };
    },
  };
}
