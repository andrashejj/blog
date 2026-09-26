// Outgoing mail through Resend's HTTP API. Without RESEND_API_KEY the message
// is logged instead, so the flow still works locally and the host can copy
// links from the admin page.

import { type Host, hostNames, hosts } from "./auth";
import type { Booking } from "./bookings";
import { accessUntil } from "./bookings";
import { BASE_PATH, house, keyContact } from "./config";
import { costsFor, euro } from "./costs";
import { env } from "./env";
import {
  dict,
  fill,
  formatDateForSuffix,
  formatRange,
  guestLine,
} from "./i18n";

interface Mail {
  to: string | string[];
  subject: string;
  paragraphs: string[];
  link?: { href: string; label: string };
  replyTo?: string;
}

export function emailConfigured(): boolean {
  return Boolean(env("RESEND_API_KEY"));
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function html(mail: Mail): string {
  const body = mail.paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");
  const link = mail.link
    ? `<p style="margin:24px 0"><a href="${escapeHtml(mail.link.href)}" style="display:inline-block;padding:12px 22px;background:#2b3d33;color:#f3efe7;text-decoration:none;border-radius:2px;font-family:Helvetica,Arial,sans-serif;font-size:14px;letter-spacing:.04em">${escapeHtml(mail.link.label)}</a></p><p style="margin:0 0 16px;font-size:12px;color:#8a857b;word-break:break-all">${escapeHtml(mail.link.href)}</p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#f3efe7"><div style="max-width:560px;margin:0 auto;padding:40px 28px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.6;color:#262521"><p style="margin:0 0 32px;font-size:22px;letter-spacing:.02em">Aszófő</p>${body}${link}<p style="margin:40px 0 0;font-size:12px;color:#8a857b;font-family:Helvetica,Arial,sans-serif">Aszófő · Balaton</p></div></body></html>`;
}

function text(mail: Mail): string {
  const parts = [...mail.paragraphs];
  if (mail.link) parts.push(`${mail.link.label}: ${mail.link.href}`);
  return parts.join("\n\n");
}

export async function send(mail: Mail): Promise<boolean> {
  const key = env("RESEND_API_KEY");
  if (!key) {
    console.info(
      `[aszofo] email not sent (no RESEND_API_KEY)\nTo: ${mail.to}\nSubject: ${mail.subject}\n\n${text(mail)}\n`,
    );
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env("ASZOFO_EMAIL_FROM") ?? "Aszófő <onboarding@resend.dev>",
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        reply_to: mail.replyTo ?? house.contactEmail,
        subject: mail.subject,
        html: html(mail),
        text: text(mail),
      }),
    });
    if (!res.ok) {
      console.error("[aszofo] Resend failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[aszofo] Resend error", error);
    return false;
  }
}

export const stayUrl = (origin: string, b: Booking) =>
  `${origin}${BASE_PATH}/stay/${b.token}`;

const publicUrl = (origin: string, b: Booking) =>
  `${origin}${BASE_PATH}${b.lang === "en" ? "" : `/${b.lang}`}#dates`;

// ---------------------------------------------------------------- to guests

// "Cleaning 40 €, Hunor 20 €, a thank-you 30 € (total 90 €)" in the guest's
// language.
function costLine(b: Booking): string {
  const d = dict(b.lang);
  const c = costsFor(b.checkIn, b.keys, b.thanks ?? 0);
  const items = [`${d.costs.cleaning} ${euro(c.cleaning)}`];
  items.push(c.keys > 0 ? `${keyContact} ${euro(c.keys)}` : d.costs.budapest);
  if (c.thanks > 0) items.push(`${d.costs.thanks} ${euro(c.thanks)}`);
  return `${items.join(", ")} (${d.costs.total.toLowerCase()} ${euro(c.total)})`;
}

export function sendReceived(origin: string, b: Booking) {
  const d = dict(b.lang);
  const dates = formatRange(b.lang, b.checkIn, b.checkOut);
  return send({
    to: b.email,
    subject: d.email.received.subject,
    paragraphs: [
      fill(d.email.greeting, { name: b.name }),
      fill(d.email.received.body, {
        dates,
        guests: guestLine(b.lang, b.adults, b.children),
      }),
      fill(d.email.received.costs, { items: costLine(b) }),
      d.email.received.link,
      hostNames(),
    ],
    link: { href: stayUrl(origin, b), label: d.booking.success.link },
  });
}

export function sendApproved(origin: string, b: Booking, by: Host) {
  const d = dict(b.lang);
  const paragraphs = [
    fill(d.email.greeting, { name: b.name }),
    fill(d.email.approved.body, {
      dates: formatRange(b.lang, b.checkIn, b.checkOut),
    }),
  ];
  if (b.hostNote) paragraphs.push(b.hostNote);
  paragraphs.push(
    fill(d.email.approved.link, {
      until: formatDateForSuffix(b.lang, accessUntil(b)),
    }),
    by.name,
  );
  return send({
    to: b.email,
    replyTo: by.email,
    subject: d.email.approved.subject,
    paragraphs,
    link: { href: stayUrl(origin, b), label: d.email.approved.button },
  });
}

export function sendDeclined(origin: string, b: Booking, by: Host) {
  const d = dict(b.lang);
  const paragraphs = [
    fill(d.email.greeting, { name: b.name }),
    fill(d.email.declined.body, {
      dates: formatRange(b.lang, b.checkIn, b.checkOut),
    }),
  ];
  if (b.hostNote) paragraphs.push(b.hostNote);
  paragraphs.push(d.email.declined.link, by.name);
  return send({
    to: b.email,
    replyTo: by.email,
    subject: d.email.declined.subject,
    paragraphs,
    link: { href: publicUrl(origin, b), label: d.stay.otherDates },
  });
}

// ---------------------------------------------------------------- to the hosts

// Everyone who hears about requests and decisions: ASZOFO_NOTIFY if set,
// otherwise every host.
export function hostRecipients(): string[] {
  const list = (env("ASZOFO_NOTIFY") ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter((address) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address));
  return list.length > 0 ? list : hosts().map((h) => h.email);
}

function costSummaryForHosts(b: Booking): string {
  const c = costsFor(b.checkIn, b.keys, b.thanks ?? 0);
  const keys =
    c.keys > 0 ? `${keyContact} ${euro(c.keys)}` : "keys collected in Budapest";
  return `Cleaning ${euro(c.cleaning)} · ${keys} · thank-you ${euro(c.thanks)} · total ${euro(c.total)}`;
}

export function sendNewRequestToHost(origin: string, b: Booking) {
  const d = dict("en");
  const p = b.prefs;
  const lines = [
    `${b.name} <${b.email}>${b.phone ? ` · ${b.phone}` : ""}`,
    `${formatRange("en", b.checkIn, b.checkOut)} · ${guestLine("en", b.adults, b.children)}${b.dog ? " · with a dog" : ""}`,
    `Language: ${dict(b.lang).langName}`,
    costSummaryForHosts(b),
  ];
  const prefs = [
    p.group && `Group: ${d.booking.group.options[p.group]}`,
    p.interests.length > 0 &&
      `Interests: ${p.interests.map((i) => d.booking.interests.options[i]).join(", ")}`,
    p.pace && `Pace: ${d.booking.pace.options[p.pace]}`,
    p.transport && `Travel: ${d.booking.transport.options[p.transport]}`,
    p.food && `Food: ${p.food}`,
    p.occasion && `Occasion: ${p.occasion}`,
  ].filter(Boolean) as string[];

  return send({
    to: hostRecipients(),
    replyTo: b.email,
    subject: `New request: ${b.name}, ${formatRange("en", b.checkIn, b.checkOut)}`,
    paragraphs: [
      lines.join("\n"),
      ...(b.message ? [`“${b.message}”`] : []),
      ...(prefs.length > 0 ? [prefs.join("\n")] : []),
    ],
    link: {
      href: `${origin}${BASE_PATH}/admin#${b.id}`,
      label: "Review request",
    },
  });
}

const DECISIONS = {
  approved: "Approved",
  declined: "Declined",
  cancelled: "Cancelled",
} as const;

// Tells every host what just happened and who did it.
export function sendDecisionToHosts(
  origin: string,
  b: Booking,
  decision: keyof typeof DECISIONS,
  by: Host,
  guestEmailed: boolean,
) {
  const dates = formatRange("en", b.checkIn, b.checkOut);
  const paragraphs = [
    `${DECISIONS[decision]} by ${by.name}.`,
    `${dates} · ${guestLine("en", b.adults, b.children)}${b.dog ? " · with a dog" : ""}`,
    `${b.name} <${b.email}>${b.phone ? ` · ${b.phone}` : ""}`,
    costSummaryForHosts(b),
    guestEmailed
      ? `${b.name} was emailed in ${dict(b.lang).langName}.`
      : `${b.name} was not emailed; let them know yourself.`,
  ];
  if (b.hostNote && decision !== "cancelled") {
    paragraphs.push(`Note to the guest:\n${b.hostNote}`);
  }
  return send({
    to: hostRecipients(),
    replyTo: b.email,
    subject: `${DECISIONS[decision]}: ${b.name}, ${dates}`,
    paragraphs,
    link:
      decision === "approved"
        ? { href: stayUrl(origin, b), label: "Their guest page" }
        : { href: `${origin}${BASE_PATH}/admin`, label: "Open the dashboard" },
  });
}

export function sendLoginLink(origin: string, token: string, host: Host) {
  return send({
    to: host.email,
    subject: "Sign in to Aszófő",
    paragraphs: [
      `Hi ${host.name},`,
      "Use this link within 15 minutes to sign in. It works once.",
    ],
    link: {
      href: `${origin}${BASE_PATH}/admin/login?t=${encodeURIComponent(token)}`,
      label: "Sign in",
    },
  });
}
