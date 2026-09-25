export const prerender = false;

import type { APIContext } from "astro";
import { isHost } from "../../../../aszofo/auth";
import {
  type Booking,
  conflictsWith,
  deleteBooking,
  getBooking,
  listBlocks,
  listBookings,
  updateBooking,
} from "../../../../aszofo/bookings";
import {
  sendApproved,
  sendDecisionToHosts,
  sendDeclined,
  stayUrl,
} from "../../../../aszofo/email";
import {
  guard,
  json,
  readJson,
  sameOrigin,
  siteOrigin,
} from "../../../../aszofo/http";

const ACTIONS = [
  "approve",
  "decline",
  "cancel",
  "reopen",
  "note",
  "delete",
] as const;
type Action = (typeof ACTIONS)[number];

// Confirmed stays and blocks that overlap this booking, ignoring itself.
async function clashes(b: Booking) {
  const [bookings, blocks] = await Promise.all([listBookings(), listBlocks()]);
  const taken = [
    ...bookings
      .filter((o) => o.status === "approved" && o.id !== b.id)
      .map((o) => ({ start: o.checkIn, end: o.checkOut })),
    ...blocks,
  ];
  return conflictsWith({ start: b.checkIn, end: b.checkOut }, taken);
}

export const POST = ({ request, cookies }: APIContext) =>
  guard(async () => {
    if (!sameOrigin(request)) return json({ error: "origin" }, 403);
    if (!isHost(cookies)) return json({ error: "auth" }, 401);

    const body = await readJson(request);
    const action = body?.action as Action;
    if (!body || !ACTIONS.includes(action) || typeof body.id !== "string") {
      return json({ error: "bad-request" }, 400);
    }
    const current = await getBooking(body.id);
    if (!current) return json({ error: "not-found" }, 404);

    const note =
      typeof body.note === "string"
        ? body.note.trim().slice(0, 2000)
        : undefined;
    const notify = body.notify !== false;
    const origin = siteOrigin(request);

    if (action === "delete") {
      await deleteBooking(current);
      return json({ ok: true, deleted: true });
    }

    if (action === "approve") {
      if (body.force !== true && (await clashes(current))) {
        return json({ error: "clash" }, 409);
      }
      const next = await updateBooking(current.id, {
        status: "approved",
        hostNote: note ?? current.hostNote,
      });
      const emailed = next && notify ? await sendApproved(origin, next) : false;
      if (next) await sendDecisionToHosts(origin, next, "approved", emailed);
      return json({
        ok: true,
        booking: next,
        emailed,
        link: stayUrl(origin, current),
      });
    }

    if (action === "decline") {
      const next = await updateBooking(current.id, {
        status: "declined",
        hostNote: note ?? current.hostNote,
      });
      const emailed = next && notify ? await sendDeclined(origin, next) : false;
      if (next) await sendDecisionToHosts(origin, next, "declined", emailed);
      return json({ ok: true, booking: next, emailed });
    }

    if (action === "cancel") {
      const next = await updateBooking(current.id, { status: "cancelled" });
      if (next) await sendDecisionToHosts(origin, next, "cancelled", false);
      return json({ ok: true, booking: next, emailed: false });
    }

    if (action === "reopen") {
      const next = await updateBooking(current.id, { status: "pending" });
      return json({ ok: true, booking: next });
    }

    const next = await updateBooking(current.id, { hostNote: note ?? "" });
    return json({ ok: true, booking: next });
  });
