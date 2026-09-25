import type { APIContext } from "astro";
import { env } from "./env";
import { StoreUnavailableError } from "./store";

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function readJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 20_000) return null;
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

// Blocks cross-site form posts against the host endpoints.
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function siteOrigin(request: Request): string {
  return (env("ASZOFO_BASE_URL") ?? new URL(request.url).origin).replace(
    /\/$/,
    "",
  );
}

export function clientIp(context: APIContext): string {
  const forwarded = context.request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  try {
    return context.clientAddress;
  } catch {
    return "unknown";
  }
}

export function isSecure(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}

// Turns storage outages into a readable 503 instead of a stack trace.
export async function guard(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof StoreUnavailableError) {
      return json({ error: "storage" }, 503);
    }
    console.error("[aszofo]", error);
    return json({ error: "server" }, 500);
  }
}
