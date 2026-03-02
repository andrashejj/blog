import { generateJSON, jsonResponse } from "../../lib/gemini";

interface WordsResponse {
  words: string[];
  hook: string;
}

const PROMPT = `Generate a creative writing prompt for an 8-year-old child. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "words": ["word1", "word2", "word3", "word4", "word5", "word6", "word7", "word8", "word9", "word10"],
  "hook": "One single engaging opening sentence to start their story."
}

The "words" array must contain exactly 10 interesting action verbs or descriptive nouns. The "hook" must be a single compelling opening sentence that sparks imagination.`;

const fallback: WordsResponse = {
  words: [
    "Drifting",
    "Glow",
    "Silent",
    "Unknown",
    "Trail",
    "Flicker",
    "Signal",
    "Float",
    "Darkness",
    "Beyond",
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
