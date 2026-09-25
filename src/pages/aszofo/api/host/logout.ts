export const prerender = false;

import type { APIContext } from "astro";
import { endSession } from "../../../../aszofo/auth";
import { BASE_PATH } from "../../../../aszofo/config";

export const POST = ({ cookies, redirect }: APIContext) => {
  endSession(cookies);
  return redirect(`${BASE_PATH}/admin/login`, 303);
};
