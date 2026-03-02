import { GoogleGenAI } from "@google/genai";

function getApiKey(): string | undefined {
  return import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
}

export async function generateJSON<T>(prompt: string, fallback: T): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not found, using fallback.");
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) return fallback;

    // Strip markdown code fences if Gemini wraps the JSON
    const cleaned = text
      .replace(/^```json\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "");

    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("Gemini generation error:", e);
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
