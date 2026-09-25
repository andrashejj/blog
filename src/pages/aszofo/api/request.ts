export const prerender = false;

import type { APIContext } from "astro";
import {
  conflictsWith,
  createBooking,
  parseRequest,
  unavailableRanges,
} from "../../../aszofo/bookings";
import { BASE_PATH } from "../../../aszofo/config";
import { todayAtHouse } from "../../../aszofo/dates";
import { sendNewRequestToHost, sendReceived } from "../../../aszofo/email";
import {
  clientIp,
  guard,
  json,
  readJson,
  siteOrigin,
} from "../../../aszofo/http";
import { store } from "../../../aszofo/store";

// Forms filled faster than this are almost certainly scripts.
const MIN_FILL_MS = 2500;
const MAX_PER_HOUR = 6;

export const POST = (context: APIContext) =>
  guard(async () => {
    const body = await readJson(context.request);
    if (!body) return json({ error: "generic" }, 400);

    // Honeypot and timing trap: answer like a success, store nothing.
    const startedAt = Number(body.startedAt);
    if (
      (typeof body.website === "string" && body.website.trim() !== "") ||
      !Number.isFinite(startedAt) ||
      Date.now() - startedAt < MIN_FILL_MS
    ) {
      return json({ ok: true });
    }

    if (
      (await store.hit(`rl:request:${clientIp(context)}`, 3600)) > MAX_PER_HOUR
    ) {
      return json({ error: "rate" }, 429);
    }

    if (body.consent !== true) return json({ error: "consent" }, 400);

    const today = todayAtHouse();
    const parsed = parseRequest(body, today);
    if (!parsed.ok)
      return json({ error: parsed.errors[0], fields: parsed.errors }, 400);

    const range = { start: parsed.value.checkIn, end: parsed.value.checkOut };
    if (conflictsWith(range, await unavailableRanges(today))) {
      return json({ error: "taken" }, 409);
    }

    const created = await createBooking(parsed.value);
    const origin = siteOrigin(context.request);
    await Promise.all([
      sendReceived(origin, created),
      sendNewRequestToHost(origin, created),
    ]);

    return json({ ok: true, page: `${BASE_PATH}/stay/${created.token}` });
  });
