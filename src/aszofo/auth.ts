// Host sign-in. The host asks for a one-time link sent to their address; an
// optional password (ASZOFO_ADMIN_PASSWORD) works as a fallback when email is
// not set up. A signed, HTTP-only cookie keeps the session.

import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import type { AstroCookies } from "astro";
import { BASE_PATH, house } from "./config";
import { env, isDev } from "./env";
import { store } from "./store";

const COOKIE = "aszofo_host";
const SESSION_DAYS = 30;
const LINK_MINUTES = 15;

function secret(): string {
  const value = env("ASZOFO_SECRET");
  if (value) return value;
  if (isDev()) return "aszofo-dev-secret";
  throw new Error("ASZOFO_SECRET is not set");
}

const sign = (payload: string) =>
  createHmac("sha256", secret()).update(payload).digest("base64url");

const sha = (value: string) => createHash("sha256").update(value).digest("hex");

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(sha(a));
  const bb = Buffer.from(sha(b));
  return timingSafeEqual(ab, bb);
}

export function adminEmail(): string {
  return (env("ASZOFO_ADMIN_EMAIL") ?? house.contactEmail).trim().toLowerCase();
}

export function passwordEnabled(): boolean {
  return Boolean(env("ASZOFO_ADMIN_PASSWORD"));
}

export function checkPassword(email: string, password: string): boolean {
  const expected = env("ASZOFO_ADMIN_PASSWORD");
  if (!expected) return false;
  return (
    email.trim().toLowerCase() === adminEmail() && safeEqual(password, expected)
  );
}

export function startSession(cookies: AstroCookies, secure: boolean) {
  const payload = `v1.${Date.now() + SESSION_DAYS * 86_400_000}`;
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: BASE_PATH,
    maxAge: SESSION_DAYS * 86_400,
  });
}

export function endSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: BASE_PATH });
}

export function isHost(cookies: AstroCookies): boolean {
  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return false;
  const cut = raw.lastIndexOf(".");
  const payload = raw.slice(0, cut);
  const signature = raw.slice(cut + 1);
  try {
    if (!safeEqual(signature, sign(payload))) return false;
  } catch {
    return false;
  }
  const expires = Number(payload.split(".")[1]);
  return Number.isFinite(expires) && expires > Date.now();
}

// One-time sign-in links. Only a hash of the token is stored.
export async function createLoginToken(): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await store.set(`login:${sha(token)}`, "1", LINK_MINUTES * 60);
  return token;
}

export async function consumeLoginToken(token: string): Promise<boolean> {
  if (!/^[\w-]{20,64}$/.test(token)) return false;
  return (await store.take(`login:${sha(token)}`)) === "1";
}
