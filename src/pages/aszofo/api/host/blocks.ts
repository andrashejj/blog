export const prerender = false;

import type { APIContext } from "astro";
import { isHost } from "../../../../aszofo/auth";
import { addBlock, removeBlock } from "../../../../aszofo/bookings";
import { isISODate } from "../../../../aszofo/dates";
import { guard, json, readJson, sameOrigin } from "../../../../aszofo/http";

export const POST = ({ request, cookies }: APIContext) =>
  guard(async () => {
    if (!sameOrigin(request)) return json({ error: "origin" }, 403);
    if (!isHost(cookies)) return json({ error: "auth" }, 401);

    const body = await readJson(request);
    if (body?.action === "remove" && typeof body.id === "string") {
      await removeBlock(body.id);
      return json({ ok: true });
    }
    if (
      body?.action === "add" &&
      isISODate(body.start) &&
      isISODate(body.end) &&
      body.start < body.end
    ) {
      const block = await addBlock(
        { start: body.start, end: body.end },
        typeof body.label === "string" ? body.label : "",
      );
      return json({ ok: true, block });
    }
    return json({ error: "bad-request" }, 400);
  });
