export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";

interface ChallengesResponse {
  riddle: string;
  anagram: { word: string; hint: string };
  engineering: string;
  mindfulness: string;
}

const PROMPT = `Generate 4 challenges for an 8-year-old child's daily worksheet. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "riddle": "A short clever riddle with a clear one-word or short-phrase answer. Do NOT include the answer.",
  "anagram": {
    "word": "A SINGLE common English word in UPPERCASE that an 8-year-old would know (5-7 letters). Examples: PLANET, BRIDGE, CASTLE, MARKET, FROZEN. Do NOT scramble it — just provide the plain word.",
    "hint": "A one-word hint for the word"
  },
  "engineering": "A hands-on mini-engineering challenge using common household items (books, paper, tape, coins, cups, rubber bands, spoons, pencils). Include specific quantities and a measurable goal.",
  "mindfulness": "A quiet observation or sensory awareness exercise that takes 1-3 minutes. Ask them to write down 3 specific things they notice."
}`;

const fallback: ChallengesResponse = {
  riddle:
    "I have keys but no locks. I have space but no room. You can enter but not go outside. What am I?",
  anagram: { word: "SILENT", hint: "Quiet" },
  engineering:
    "Build the tallest tower you can using exactly 10 books and 2 pieces of paper. Measure it!",
  mindfulness:
    "Sit outside with your eyes closed for 2 minutes. Write down the 3 quietest sounds you heard.",
};

function scramble(word: string): string {
  const arr = word.split("");
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join("");
  // If shuffle produced the original word, try again
  return result === word ? scramble(word) : result;
}

export const GET = async () => {
  const data = await generateJSON<ChallengesResponse>(PROMPT, fallback);
  // Scramble the anagram server-side — LLMs can't reliably shuffle letters
  const word = (data.anagram?.word || fallback.anagram.word).toUpperCase().replace(/[^A-Z]/g, "");
  return jsonResponse({
    ...data,
    anagram: {
      scrambled: scramble(word).split("").join(" "),
      hint: data.anagram?.hint || fallback.anagram.hint,
    },
  });
};
