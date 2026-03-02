export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";

interface SketchesResponse {
  texture: string;
  object: string;
  sketch: string;
}

const PROMPT = `Generate 3 drawing prompts for an 8-year-old child's daily sketch practice. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "texture": "A single texture or surface pattern for the child to practice drawing (e.g. 'Wood Grain', 'Fur', 'Waves'). Just the name, 2-3 words max.",
  "object": "A single everyday household object for the child to find and draw from real life observation (e.g. 'Coffee Mug', 'Backpack'). Just the name, 2-3 words max.",
  "sketch": "A creative, imaginative scene or subject for a larger sketch (e.g. 'A Dragon Flying Over a Castle', 'A Robot Walking a Dog'). Keep it fun and visual, 3-8 words."
}`;

const fallback: SketchesResponse = {
  texture: "Waves",
  object: "Coffee Mug",
  sketch: "A Friendly Robot",
};

export const GET = async () => {
  const data = await generateJSON<SketchesResponse>(PROMPT, fallback);
  return jsonResponse(data);
};
