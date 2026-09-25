// Server-only environment access. process.env is read first so values set in
// Vercel apply at runtime; import.meta.env covers `astro dev` reading .env.

export function env(name: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  if (fromProcess) return fromProcess;
  const fromVite = (import.meta.env as Record<string, string | undefined>)[
    name
  ];
  return fromVite || undefined;
}

export const isProduction = (): boolean =>
  Boolean(env("VERCEL")) || import.meta.env.PROD === true;

export const isDev = (): boolean => import.meta.env.DEV === true;
