// Host dashboard: approve and decline requests, block dates, save details.

import type { DateRange } from "../dates";
import { createCalendar } from "./calendar";

async function post(path: string, body: unknown) {
  const res = await fetch(`/aszofo/api/host/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { ok: res.ok && data.ok === true, status: res.status, data };
}

function say(card: Element, text: string, error = false) {
  const el = card.querySelector<HTMLElement>("[data-status]");
  if (!el) return;
  el.hidden = false;
  el.textContent = text;
  el.style.color = error ? "var(--clay)" : "var(--vine)";
}

const ERRORS: Record<string, string> = {
  clash: "These dates overlap a confirmed stay or blocked dates.",
  auth: "Your session ended. Sign in again.",
  storage: "Storage isn't reachable.",
};

function bookingActions() {
  document.addEventListener("click", async (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-action]",
    );
    const card = button?.closest<HTMLElement>("[data-id]");
    if (!button || !card) return;
    const action = button.dataset.action as string;
    if (button.dataset.confirm && !window.confirm(button.dataset.confirm))
      return;

    const note = card.querySelector<HTMLTextAreaElement>("[data-note]")?.value;
    const notify =
      card.querySelector<HTMLInputElement>("[data-notify]")?.checked ?? false;
    button.disabled = true;

    let result = await post("bookings", {
      id: card.dataset.id,
      action,
      note,
      notify,
    });
    if (result.data.error === "clash") {
      const force = window.confirm(`${ERRORS.clash} Approve anyway?`);
      if (force)
        result = await post("bookings", {
          id: card.dataset.id,
          action,
          note,
          notify,
          force: true,
        });
    }
    button.disabled = false;

    if (!result.ok) {
      const code = String(result.data.error ?? "");
      return say(card, ERRORS[code] ?? "That didn't work. Try again.", true);
    }
    if (action === "note") return say(card, "Saved.");
    if (
      action === "approve" &&
      !result.data.emailed &&
      typeof result.data.link === "string"
    ) {
      await navigator.clipboard?.writeText(result.data.link).catch(() => {});
      window.alert(
        `Approved. No email went out, so the guest page link is on your clipboard:\n\n${result.data.link}`,
      );
    }
    location.reload();
  });

  for (const button of document.querySelectorAll<HTMLButtonElement>(
    "[data-copy]",
  )) {
    button.addEventListener("click", async () => {
      const input =
        button.parentElement?.querySelector<HTMLInputElement>("input");
      if (!input) return;
      await navigator.clipboard
        ?.writeText(input.value)
        .catch(() => input.select());
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy link";
      }, 1600);
    });
  }
}

function blocking() {
  const root = document.querySelector<HTMLElement>("[data-host-calendar]");
  if (!root) return;
  const data = JSON.parse(root.dataset.cal ?? "{}") as {
    locale: string;
    today: string;
    first: string;
    last: string;
    unavailable: DateRange[];
    marks: DateRange[];
    maxNights: number;
  };
  const label = root.querySelector<HTMLElement>("[data-block-selection]");
  const add = root.querySelector<HTMLButtonElement>("[data-block-add]");
  const fmt = new Intl.DateTimeFormat(data.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const utc = (iso: string) => new Date(`${iso}T00:00:00Z`);
  let range: DateRange | null = null;

  createCalendar({
    months: root.querySelector("[data-calendar]") as HTMLElement,
    prev: root.querySelector<HTMLButtonElement>("[data-cal-prev]"),
    next: root.querySelector<HTMLButtonElement>("[data-cal-next]"),
    locale: data.locale,
    labels: { taken: "taken", today: "today" },
    today: data.today,
    first: data.today,
    last: data.last,
    unavailable: data.unavailable,
    marks: data.marks,
    minNights: 1,
    maxNights: data.maxNights,
    free: true,
    onChange({ checkIn, checkOut }) {
      range = checkIn && checkOut ? { start: checkIn, end: checkOut } : null;
      if (add) add.disabled = !range;
      if (!label) return;
      if (range) {
        const nights = Math.round(
          (utc(range.end).getTime() - utc(range.start).getTime()) / 86_400_000,
        );
        label.textContent = `Block ${fmt.formatRange(utc(range.start), utc(range.end))} · ${nights} ${nights === 1 ? "night" : "nights"}`;
      } else if (checkIn)
        label.textContent = `From ${fmt.format(utc(checkIn))}. Now pick the day it opens again.`;
      else label.textContent = "Select dates to block";
    },
  });

  add?.addEventListener("click", async () => {
    if (!range) return;
    add.disabled = true;
    const text =
      root.querySelector<HTMLInputElement>("[data-block-label]")?.value ?? "";
    const result = await post("blocks", {
      action: "add",
      ...range,
      label: text,
    });
    if (result.ok) location.reload();
    else {
      add.disabled = false;
      window.alert("Couldn't block those dates.");
    }
  });

  for (const button of document.querySelectorAll<HTMLButtonElement>(
    "[data-block-remove]",
  )) {
    button.addEventListener("click", async () => {
      button.disabled = true;
      const result = await post("blocks", {
        action: "remove",
        id: button.dataset.blockRemove,
      });
      if (result.ok) location.reload();
      else button.disabled = false;
    });
  }
}

function settingsForm() {
  const form = document.querySelector<HTMLFormElement>("[data-settings]");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    const result = await post("settings", body);
    say(form, result.ok ? "Saved." : "Couldn't save. Try again.", !result.ok);
  });
}

export function initAdmin() {
  bookingActions();
  blocking();
  settingsForm();
}
