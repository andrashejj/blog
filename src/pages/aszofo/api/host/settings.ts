export const prerender = false;

import type { APIContext } from "astro";
import { isHost } from "../../../../aszofo/auth";
import { saveSettings } from "../../../../aszofo/bookings";
import { guard, json, readJson, sameOrigin } from "../../../../aszofo/http";

export const POST = ({ request, cookies }: APIContext) =>
  guard(async () => {
    if (!sameOrigin(request)) return json({ error: "origin" }, 403);
    if (!isHost(cookies)) return json({ error: "auth" }, 401);
    const body = await readJson(request);
    if (!body) return json({ error: "bad-request" }, 400);
    return json({ ok: true, settings: await saveSettings(body) });
  });
