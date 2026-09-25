// The three-step request form: dates, guests, preferences.

import type { DateRange } from "../dates";
import { type Selection, createCalendar } from "./calendar";

interface Text {
  locale: string;
  lang: string;
  email: string;
  base: string;
  maxGuests: number;
  booking: {
    chooseArrival: string;
    chooseDeparture: string;
    minNights: string;
    prev: string;
    next: string;
    loading: string;
    loadError: string;
    submit: string;
    sending: string;
    errors: Record<string, string>;
    success: { title: string; body: string; link: string };
    taken: string;
    today: string;
  };
  units: { night: { one: string; other: string } };
}

interface Availability {
  today: string;
  first: string;
  last: string;
  minNights: number;
  maxNights: number;
  maxGuests: number;
  unavailable: DateRange[];
}

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));

export function initBooking(root: HTMLElement) {
  const text = JSON.parse(root.dataset.text ?? "{}") as Text;
  const b = text.booking;
  const form = root.querySelector<HTMLFormElement>(
    "[data-form]",
  ) as HTMLFormElement;
  const monthsEl = root.querySelector<HTMLElement>(
    "[data-calendar]",
  ) as HTMLElement;
  const selectionEl = root.querySelector<HTMLElement>(
    "[data-selection]",
  ) as HTMLElement;
  const nextFromDates = root.querySelector<HTMLButtonElement>(
    '[data-next="2"]',
  ) as HTMLButtonElement;
  const clearBtn = root.querySelector<HTMLButtonElement>(
    "[data-clear]",
  ) as HTMLButtonElement;
  const submitBtn = root.querySelector<HTMLButtonElement>(
    "[data-submit]",
  ) as HTMLButtonElement;
  const successEl = root.querySelector<HTMLElement>(
    "[data-success]",
  ) as HTMLElement;
  const startedAt = Date.now();

  const plural = new Intl.PluralRules(text.locale);
  const nightsLabel = (n: number) =>
    fill(
      plural.select(n) === "one"
        ? text.units.night.one
        : text.units.night.other,
      { n },
    );
  const range = new Intl.DateTimeFormat(text.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);

  let selection: Selection = {};
  let minNights = 2;
  let calendar: ReturnType<typeof createCalendar> | null = null;
  const counts = { adults: 2, children: 0 };
  let step = 1;

  // ------------------------------------------------------------ steps

  function showStep(n: number) {
    step = n;
    for (const panel of root.querySelectorAll<HTMLElement>("[data-step]")) {
      panel.hidden = panel.dataset.step !== String(n);
    }
    for (const tab of root.querySelectorAll<HTMLElement>("[data-step-tab]")) {
      const i = Number(tab.dataset.stepTab);
      if (i === n) tab.setAttribute("aria-current", "step");
      else tab.removeAttribute("aria-current");
      if (i < n) tab.dataset.done = "";
      else delete tab.dataset.done;
    }
    const top = root.getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    root
      .querySelector<HTMLElement>(
        `[data-step="${n}"] input, [data-step="${n}"] button`,
      )
      ?.focus({
        preventScroll: true,
      });
  }

  function showError(step: number, message: string | null) {
    const el = root.querySelector<HTMLElement>(`[data-error="${step}"]`);
    if (!el) return;
    el.hidden = !message;
    el.textContent = message ?? "";
  }

  // ------------------------------------------------------------ dates

  function renderSelection() {
    const { checkIn, checkOut } = selection;
    const hint = document.createElement("span");
    hint.className = "hint";
    if (checkIn && checkOut) {
      const nights = Math.round(
        (utc(checkOut).getTime() - utc(checkIn).getTime()) / 86_400_000,
      );
      selectionEl.textContent = range.formatRange(utc(checkIn), utc(checkOut));
      hint.textContent = nightsLabel(nights);
    } else if (checkIn) {
      selectionEl.textContent = range.format(utc(checkIn));
      hint.textContent = b.chooseDeparture;
    } else {
      selectionEl.textContent = b.chooseArrival;
      hint.textContent = fill(b.minNights, { n: minNights });
    }
    selectionEl.append(hint);
    nextFromDates.disabled = !(checkIn && checkOut);
    clearBtn.hidden = !checkIn;
  }

  async function loadAvailability(): Promise<Availability | null> {
    try {
      const res = await fetch(`${text.base}/api/availability`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(String(res.status));
      return (await res.json()) as Availability;
    } catch {
      return null;
    }
  }

  async function start() {
    const data = await loadAvailability();
    if (!data) {
      monthsEl.removeAttribute("aria-busy");
      monthsEl.innerHTML = "";
      const p = document.createElement("p");
      p.className = "cal-status";
      p.textContent = fill(b.loadError, { email: text.email });
      monthsEl.append(p);
      return;
    }
    minNights = data.minNights;
    calendar = createCalendar({
      months: monthsEl,
      prev: root.querySelector<HTMLButtonElement>("[data-cal-prev]"),
      next: root.querySelector<HTMLButtonElement>("[data-cal-next]"),
      locale: text.locale,
      labels: { taken: b.taken, today: b.today },
      today: data.today,
      first: data.first,
      last: data.last,
      unavailable: data.unavailable,
      minNights: data.minNights,
      maxNights: data.maxNights,
      onChange(next) {
        selection = next;
        showError(1, null);
        renderSelection();
      },
    });
    renderSelection();
  }

  clearBtn.addEventListener("click", () => calendar?.clear());

  // ------------------------------------------------------------ guests

  function renderCounts() {
    for (const key of ["adults", "children"] as const) {
      const out = root.querySelector<HTMLOutputElement>(
        `[data-count="${key}"]`,
      );
      if (out) out.textContent = String(counts[key]);
    }
    const total = counts.adults + counts.children;
    const set = (sel: string, disabled: boolean) => {
      const el = root.querySelector<HTMLButtonElement>(sel);
      if (el) el.disabled = disabled;
    };
    set('[data-dec="adults"]', counts.adults <= 1);
    set('[data-dec="children"]', counts.children <= 0);
    set('[data-inc="adults"]', total >= text.maxGuests);
    set('[data-inc="children"]', total >= text.maxGuests);
  }

  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const inc = target.closest<HTMLElement>("[data-inc]")?.dataset.inc as
      | keyof typeof counts
      | undefined;
    const dec = target.closest<HTMLElement>("[data-dec]")?.dataset.dec as
      | keyof typeof counts
      | undefined;
    if (inc && counts.adults + counts.children < text.maxGuests) counts[inc]++;
    if (dec) counts[dec] = Math.max(dec === "adults" ? 1 : 0, counts[dec] - 1);
    if (inc || dec) renderCounts();
  });
  renderCounts();

  const field = (name: string) =>
    form.elements.namedItem(name) as HTMLInputElement | null;
  const value = (name: string) => field(name)?.value.trim() ?? "";

  function markInvalid(name: string, invalid: boolean) {
    const wrap = root.querySelector<HTMLElement>(`[data-field="${name}"]`);
    if (!wrap) return;
    if (invalid) wrap.dataset.invalid = "";
    else delete wrap.dataset.invalid;
    field(name)?.setAttribute("aria-invalid", String(invalid));
  }

  function validateGuests(): string | null {
    const nameBad = value("name").length < 2;
    const emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value("email"));
    markInvalid("name", nameBad);
    markInvalid("email", emailBad);
    if (nameBad) return b.errors.name;
    if (emailBad) return b.errors.email;
    return null;
  }

  // ------------------------------------------------------------ navigation

  function advance(to: number) {
    if (to === 2) {
      if (!(selection.checkIn && selection.checkOut))
        return showError(1, b.errors.dates);
      showStep(2);
    }
    if (to === 3) {
      const error = validateGuests();
      showError(2, error);
      if (!error) showStep(3);
    }
  }

  root.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const next = target.closest<HTMLElement>("[data-next]")?.dataset.next;
    const back = target.closest<HTMLElement>("[data-back]")?.dataset.back;
    if (back) showStep(Number(back));
    if (next) advance(Number(next));
  });

  // ------------------------------------------------------------ submit

  function payload() {
    const checked = (name: string) =>
      [
        ...form.querySelectorAll<HTMLInputElement>(
          `input[name="${name}"]:checked`,
        ),
      ].map((i) => i.value);
    return {
      checkIn: selection.checkIn,
      checkOut: selection.checkOut,
      adults: counts.adults,
      children: counts.children,
      dog: Boolean(field("dog")?.checked),
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      message: value("message"),
      lang: text.lang,
      website: value("website"),
      startedAt,
      consent: Boolean(field("consent")?.checked),
      prefs: {
        group: checked("group")[0],
        interests: checked("interests"),
        pace: checked("pace")[0],
        transport: checked("transport")[0],
        food: value("food"),
        occasion: value("occasion"),
      },
    };
  }

  function success(page: string | undefined, body: ReturnType<typeof payload>) {
    form.hidden = true;
    root.querySelector(".steps")?.setAttribute("hidden", "");
    const h = document.createElement("h3");
    h.textContent = fill(b.success.title, { name: body.name });
    const p = document.createElement("p");
    p.className = "lead";
    p.textContent = fill(b.success.body, {
      dates: range.formatRange(
        utc(body.checkIn as string),
        utc(body.checkOut as string),
      ),
      email: body.email,
    });
    successEl.replaceChildren(h, p);
    if (page) {
      const a = document.createElement("a");
      a.className = "btn ghost";
      a.href = page;
      a.innerHTML = `${b.success.link} <span class="arrow" aria-hidden="true">→</span>`;
      successEl.append(a);
    }
    successEl.hidden = false;
    successEl.focus();
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Enter in an earlier step moves forward instead of sending.
    if (step < 3) return advance(step + 1);
    if (!field("consent")?.checked) return showError(3, b.errors.consent);
    showError(3, null);
    const body = payload();
    submitBtn.disabled = true;
    submitBtn.textContent = b.sending;
    try {
      const res = await fetch(`${text.base}/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        page?: string;
        error?: string;
      };
      if (res.ok && data.ok) return success(data.page, body);

      const key = data.error ?? "generic";
      const message = fill(b.errors[key] ?? b.errors.generic, {
        email: text.email,
      });
      if (key === "taken" || key === "dates") {
        const fresh = await loadAvailability();
        if (fresh) calendar?.setUnavailable(fresh.unavailable);
        calendar?.clear();
        showStep(1);
        showError(1, message);
      } else if (key === "name" || key === "email" || key === "guests") {
        showStep(2);
        showError(2, message);
      } else {
        showError(3, message);
      }
    } catch {
      showError(3, fill(b.errors.generic, { email: text.email }));
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `${b.submit} <span class="arrow" aria-hidden="true">→</span>`;
    }
  });

  start();
}
