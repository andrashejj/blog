export const prerender = false;

import type { APIContext } from "astro";
import {
  adminEmail,
  checkPassword,
  createLoginToken,
  startSession,
} from "../../../../aszofo/auth";
import { emailConfigured, sendLoginLink } from "../../../../aszofo/email";
import { isDev } from "../../../../aszofo/env";
import {
  clientIp,
  guard,
  isSecure,
  json,
  readJson,
  sameOrigin,
  siteOrigin,
} from "../../../../aszofo/http";
import { store } from "../../../../aszofo/store";

const MAX_ATTEMPTS = 10; // per 15 minutes and connection

export const POST = (context: APIContext) =>
  guard(async () => {
    const { request, cookies } = context;
    if (!sameOrigin(request)) return json({ error: "origin" }, 403);
    if (
      (await store.hit(`rl:login:${clientIp(context)}`, 900)) > MAX_ATTEMPTS
    ) {
      return json({ error: "rate" }, 429);
    }

    const body = (await readJson(request)) ?? {};
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (password) {
      if (!checkPassword(email, password))
        return json({ error: "password" }, 401);
      startSession(cookies, isSecure(request));
      return json({ ok: true, signedIn: true });
    }

    // The reply is the same whether or not the address matches.
    if (email !== adminEmail()) return json({ ok: true, sent: true });

    const token = await createLoginToken();
    const origin = siteOrigin(request);
    await sendLoginLink(origin, token);
    if (!emailConfigured() && isDev()) {
      return json({
        ok: true,
        sent: false,
        devLink: `/aszofo/admin/login?t=${encodeURIComponent(token)}`,
      });
    }
    return json({ ok: true, sent: true });
  });
