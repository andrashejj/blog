import { GoogleGenAI } from "@google/genai";

function getApiKey(): string | undefined {
  return import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
}

interface GenerateJSONOptions {
  timeoutMs?: number;
  model?: string;
  temperature?: number;
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Generation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export async function generateJSON<T>(
  prompt: string,
  fallback: T,
  options: GenerateJSONOptions = {},
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found, using fallback.");
    return fallback;
  }

  const { timeoutMs = 8_500, model = "gemini-3-flash-preview" } = options;
  const { temperature = 1.5 } = options;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const today = new Date().toISOString().slice(0, 10);
    const seed = Math.floor(Math.random() * 100_000);
    const randomizedPrompt = `${prompt}\n\nToday is ${today}. Variation seed: ${seed}. Be creative and produce unique, varied output different from any previous request.`;
    const response = await withTimeout(
      ai.models.generateContent({
        model,
        contents: randomizedPrompt,
        config: { temperature },
      }),
      timeoutMs,
    );

    const text = response.text?.trim();
    if (!text) return fallback;

    // Strip markdown code fences if Gemini wraps the JSON
    const cleaned = text
      .replace(/^```json\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "");

    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("Gemini generation error, using fallback:", e);
    return fallback;
  }
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
