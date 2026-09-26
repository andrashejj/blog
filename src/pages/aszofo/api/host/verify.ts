export const prerender = false;

import type { APIContext } from "astro";
import { consumeLoginToken, startSession } from "../../../../aszofo/auth";
import { BASE_PATH } from "../../../../aszofo/config";
import { isSecure, sameOrigin } from "../../../../aszofo/http";

// The emailed link opens a page with a button that posts here, so mail
// scanners that prefetch links can't use up the one-time token.
export const POST = async ({ request, cookies, redirect }: APIContext) => {
  if (!sameOrigin(request))
    return redirect(`${BASE_PATH}/admin/login?e=origin`, 303);
  const form = await request.formData();
  const token = String(form.get("t") ?? "");
  const host = await consumeLoginToken(token);
  if (!host) return redirect(`${BASE_PATH}/admin/login?e=expired`, 303);
  startSession(cookies, isSecure(request), host);
  return redirect(`${BASE_PATH}/admin`, 303);
};
