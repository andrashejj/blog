// Host sign-in. A host asks for a one-time link sent to their own address; an
// optional password (ASZOFO_ADMIN_PASSWORD) works as a fallback when email is
// not set up. A signed, HTTP-only cookie keeps the session and remembers who
// signed in, so notices can say who approved what.

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

export interface Host {
  name: string;
  email: string;
}

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

// ASZOFO_HOSTS lists everyone who may sign in, as "Name <email>" separated by
// commas. It lives in the environment so private addresses stay out of the
// repo. Without it, the single ASZOFO_ADMIN_EMAIL (or the public contact) is
// the only host.
export function hosts(): Host[] {
  const listed = (env("ASZOFO_HOSTS") ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const match = entry.match(/^(.*?)\s*<([^>]+)>$/);
      const email = (match ? match[2] : entry).trim().toLowerCase();
      const name = (match?.[1] || email.split("@")[0]).trim();
      return { name, email };
    })
    .filter((h) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(h.email));
  if (listed.length > 0) return listed;
  const email = (env("ASZOFO_ADMIN_EMAIL") ?? house.contactEmail)
    .trim()
    .toLowerCase();
  return [{ name: house.hostName, email }];
}

export function findHost(email: string): Host | undefined {
  const wanted = email.trim().toLowerCase();
  return hosts().find((h) => h.email === wanted);
}

// "Andras & Dóra": how the hosts sign messages nobody in particular sent.
export function hostNames(): string {
  const names = hosts().map((h) => h.name);
  return names.length > 1
    ? `${names.slice(0, -1).join(", ")} & ${names.at(-1)}`
    : names[0];
}

export function passwordEnabled(): boolean {
  return Boolean(env("ASZOFO_ADMIN_PASSWORD"));
}

export function checkPassword(email: string, password: string): Host | null {
  const expected = env("ASZOFO_ADMIN_PASSWORD");
  const host = findHost(email);
  if (!expected || !host) return null;
  return safeEqual(password, expected) ? host : null;
}

export function startSession(
  cookies: AstroCookies,
  secure: boolean,
  host: Host,
) {
  const who = Buffer.from(host.email).toString("base64url");
  const payload = `v2.${Date.now() + SESSION_DAYS * 86_400_000}.${who}`;
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

// The signed-in host, or null. A host removed from ASZOFO_HOSTS loses access
// at once, even with a valid cookie.
export function currentHost(cookies: AstroCookies): Host | null {
  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return null;
  const cut = raw.lastIndexOf(".");
  const payload = raw.slice(0, cut);
  const signature = raw.slice(cut + 1);
  try {
    if (!safeEqual(signature, sign(payload))) return null;
  } catch {
    return null;
  }
  const [version, expires, who] = payload.split(".");
  if (version !== "v2" || !(Number(expires) > Date.now()) || !who) return null;
  return findHost(Buffer.from(who, "base64url").toString()) ?? null;
}

export function isHost(cookies: AstroCookies): boolean {
  return currentHost(cookies) !== null;
}

// One-time sign-in links. Only a hash of the token is stored, with the
// address it was sent to.
export async function createLoginToken(host: Host): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await store.set(`login:${sha(token)}`, host.email, LINK_MINUTES * 60);
  return token;
}

export async function consumeLoginToken(token: string): Promise<Host | null> {
  if (!/^[\w-]{20,64}$/.test(token)) return null;
  const email = await store.take(`login:${sha(token)}`);
  return email ? (findHost(email) ?? null) : null;
}
