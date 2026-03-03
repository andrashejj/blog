export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";

interface SketchesResponse {
  shadow: string;
  sketch: string;
}

const PROMPT = `Generate 2 drawing prompts for an 8-year-old child's daily sketch practice. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "shadow": "A simple everyday object with interesting shadows for the child to draw, focusing on light and shadow (e.g. 'A Pillow on a Chair', 'A Ball on the Floor', 'A Folded Towel', 'A Crumpled Paper Bag'). The object should be something they can find at home and set up with a lamp. 3-6 words.",
  "sketch": "A more complex, creative scene or subject for a detailed sketch (e.g. 'A Treehouse in a Storm', 'A Market Stall Full of Fruit', 'A Cat Sleeping on a Stack of Books'). Keep it fun, visual, and challenging. 4-10 words."
}`;

const fallback: SketchesResponse = {
  shadow: "A Pillow on a Chair",
  sketch: "A Castle on a Cliff",
};

export const GET = async () => {
  const data = await generateJSON<SketchesResponse>(PROMPT, fallback);
  return jsonResponse(data);
};
