export const prerender = false;

import type { APIRoute } from "astro";

import { generateJSON, jsonResponse } from "../../lib/gemini";
import {
  buildMathPrompt,
  getMathConfigFromSearchParams,
  normalizeMathData,
  type MathData,
} from "../../lib/noah-worksheet";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const config = getMathConfigFromSearchParams(url.searchParams);
  const fallback = normalizeMathData(null, config);
  const data = await generateJSON<MathData>(buildMathPrompt(config), fallback);

  return jsonResponse(normalizeMathData(data, config));
};
