export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";

interface WordsResponse {
  words: string[];
  hook: string;
}

const PROMPT = `Generate a creative writing prompt for a 9-year-old boy. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10"],
  "hook": "A vivid, intriguing opening sentence that drops the reader into the middle of action or a surprising moment."
}

The "words" array must contain exactly 10 words — mix interesting verbs, unusual adjectives, and concrete nouns. Avoid generic or abstract words like "unknown", "beyond", "mystery". Instead, pick words a child can picture: "crumbling", "whisker", "avalanche", "copper", "howl".

The "hook" must be a single sentence that is specific and vivid — NOT a generic "something magical happened" opener. Great hooks start in the middle of something happening, include a sensory detail, or present a concrete weird situation. Examples of GOOD hooks:
- "The jar of pickles on the kitchen shelf had started to glow green, and it was humming."
- "Maya found a door in the back of her wardrobe that definitely hadn't been there yesterday."
- "The dog came home carrying a map in its mouth, and it was marked with a red X."
Bad hooks (too vague): "Something strange was about to happen.", "It was a day unlike any other.", "Little did they know, everything was about to change."`;

const fallback: WordsResponse = {
  words: [
    "thunder",
    "lantern",
    "clattering",
    "midnight",
    "jungle",
    "whisper",
    "copper",
    "zigzag",
    "backpack",
    "splash",
  ],
  hook: "The old clock tower hadn't chimed in fifty years, but tonight, right at midnight, it struck thirteen times.",
};

export const GET = async () => {
  const data = await generateJSON<WordsResponse>(PROMPT, fallback);
  // Ensure we always have at least some words
  if (!data.words?.length) data.words = fallback.words;
  if (!data.hook) data.hook = fallback.hook;
  return jsonResponse(data);
};
