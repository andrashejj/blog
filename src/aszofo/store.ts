// A small key-value store for the booking data.
//
// Production talks to Upstash Redis over its REST API, using the variables
// Vercel's Upstash integration sets (KV_REST_API_URL / KV_REST_API_TOKEN, or
// the UPSTASH_REDIS_REST_* pair). Local development without those falls back
// to a JSON file in .data/, which understands the handful of commands used here.

import { env, isDev } from "./env";

type Arg = string | number;

export class StoreUnavailableError extends Error {
  constructor() {
    super(
      "Booking storage is not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN (Upstash Redis).",
    );
  }
}

interface Backend {
  run(args: Arg[]): Promise<unknown>;
}

function upstash(url: string, token: string): Backend {
  return {
    async run(args) {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args.map(String)),
      });
      const data = (await res.json()) as { result?: unknown; error?: string };
      if (!res.ok || data.error) {
        throw new Error(
          `Upstash ${args[0]} failed: ${data.error ?? res.status}`,
        );
      }
      return data.result ?? null;
    },
  };
}

interface FileData {
  strings: Record<string, { value: string; expiresAt?: number }>;
  hashes: Record<string, Record<string, string>>;
}

function fileStore(): Backend {
  const path = ".data/aszofo-dev.json";

  // Read on every call: the file is tiny, and it keeps separate dev processes
  // (and hand edits while testing) in step.
  async function load(): Promise<FileData> {
    const fs = await import("node:fs/promises");
    try {
      return JSON.parse(await fs.readFile(path, "utf8")) as FileData;
    } catch {
      return { strings: {}, hashes: {} };
    }
  }

  async function save(data: FileData) {
    const fs = await import("node:fs/promises");
    await fs.mkdir(".data", { recursive: true });
    await fs.writeFile(path, JSON.stringify(data, null, 2));
  }

  function live(data: FileData, key: string) {
    const entry = data.strings[key];
    if (entry?.expiresAt && entry.expiresAt < Date.now()) {
      delete data.strings[key];
      return undefined;
    }
    return entry;
  }

  return {
    async run(args) {
      const data = await load();
      const [cmd, key, ...rest] = args.map(String);
      switch (cmd.toUpperCase()) {
        case "GET":
          return live(data, key)?.value ?? null;
        case "GETDEL": {
          const value = live(data, key)?.value ?? null;
          delete data.strings[key];
          await save(data);
          return value;
        }
        case "SET": {
          const exIndex = rest.findIndex((a) => a.toUpperCase() === "EX");
          const nx = rest.some((a) => a.toUpperCase() === "NX");
          if (nx && live(data, key)) return null;
          data.strings[key] = {
            value: rest[0],
            expiresAt:
              exIndex >= 0
                ? Date.now() + Number(rest[exIndex + 1]) * 1000
                : undefined,
          };
          await save(data);
          return "OK";
        }
        case "DEL":
          delete data.strings[key];
          delete data.hashes[key];
          await save(data);
          return 1;
        case "INCR": {
          const entry = live(data, key);
          const next = Number(entry?.value ?? 0) + 1;
          data.strings[key] = {
            value: String(next),
            expiresAt: entry?.expiresAt,
          };
          await save(data);
          return next;
        }
        case "EXPIRE": {
          const entry = live(data, key);
          if (!entry) return 0;
          entry.expiresAt = Date.now() + Number(rest[0]) * 1000;
          await save(data);
          return 1;
        }
        case "HGET":
          return data.hashes[key]?.[rest[0]] ?? null;
        case "HSET": {
          data.hashes[key] ??= {};
          for (let i = 0; i < rest.length; i += 2) {
            data.hashes[key][rest[i]] = rest[i + 1];
          }
          await save(data);
          return rest.length / 2;
        }
        case "HDEL": {
          let removed = 0;
          for (const field of rest) {
            if (data.hashes[key]?.[field] !== undefined) {
              delete data.hashes[key][field];
              removed++;
            }
          }
          await save(data);
          return removed;
        }
        case "HGETALL":
          return Object.entries(data.hashes[key] ?? {}).flat();
        default:
          throw new Error(`File store does not support ${cmd}`);
      }
    },
  };
}

let backend: Backend | null = null;

function getBackend(): Backend {
  if (backend) return backend;
  const url = env("KV_REST_API_URL") ?? env("UPSTASH_REDIS_REST_URL");
  const token = env("KV_REST_API_TOKEN") ?? env("UPSTASH_REDIS_REST_TOKEN");
  if (url && token) {
    backend = upstash(url, token);
  } else if (isDev() || !env("VERCEL")) {
    backend = fileStore();
  } else {
    throw new StoreUnavailableError();
  }
  return backend;
}

const PREFIX = "aszofo:";
const k = (key: string) => `${PREFIX}${key}`;

export const store = {
  async get(key: string): Promise<string | null> {
    return (await getBackend().run(["GET", k(key)])) as string | null;
  },
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const args: Arg[] = ["SET", k(key), value];
    if (ttlSeconds) args.push("EX", ttlSeconds);
    await getBackend().run(args);
  },
  async take(key: string): Promise<string | null> {
    return (await getBackend().run(["GETDEL", k(key)])) as string | null;
  },
  async del(key: string): Promise<void> {
    await getBackend().run(["DEL", k(key)]);
  },
  // Counts calls within a window; returns the count including this one.
  async hit(key: string, windowSeconds: number): Promise<number> {
    const count = Number(await getBackend().run(["INCR", k(key)]));
    if (count === 1) await getBackend().run(["EXPIRE", k(key), windowSeconds]);
    return count;
  },
  async hget(key: string, field: string): Promise<string | null> {
    return (await getBackend().run(["HGET", k(key), field])) as string | null;
  },
  async hset(key: string, field: string, value: string): Promise<void> {
    await getBackend().run(["HSET", k(key), field, value]);
  },
  async hdel(key: string, ...fields: string[]): Promise<void> {
    if (fields.length === 0) return;
    await getBackend().run(["HDEL", k(key), ...fields]);
  },
  async hgetall(key: string): Promise<Record<string, string>> {
    const flat = ((await getBackend().run(["HGETALL", k(key)])) ??
      []) as string[];
    const out: Record<string, string> = {};
    for (let i = 0; i < flat.length; i += 2) out[flat[i]] = flat[i + 1];
    return out;
  },
};
