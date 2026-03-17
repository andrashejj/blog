export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";
import {
  fallbackChallenges,
  normalizeChallengesData,
  type ChallengesPromptData,
} from "../../lib/noah-worksheet";

const PROMPT = `Generate 4 challenges for a 9-year-old boy's daily worksheet. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "riddle": "A short clever riddle with a clear one-word or short-phrase answer. Do NOT include the answer.",
  "anagram": {
    "word": "A SINGLE common English word in UPPERCASE that a 9-year-old would know (5-7 letters). Examples: PLANET, BRIDGE, CASTLE, MARKET, FROZEN. Do NOT scramble it — just provide the plain word.",
    "hint": "A one-word hint for the word"
  },
  "engineering": "A hands-on mini-engineering challenge using common household items (books, paper, tape, coins, cups, rubber bands, spoons, pencils). Include specific quantities and a measurable goal.",
  "mindfulness": "A quiet observation or sensory awareness exercise that takes 1-3 minutes. Ask them to write down 3 specific things they notice."
}`;

export const GET = async () => {
  const data = await generateJSON<ChallengesPromptData>(PROMPT, fallbackChallenges);
  return jsonResponse(normalizeChallengesData(data));
};
