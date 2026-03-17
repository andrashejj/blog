export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";
import {
  fallbackPhysical,
  normalizePhysicalData,
  type PhysicalData,
} from "../../lib/noah-worksheet";

const PROMPT = `Generate 10 physical exercises for a 9-year-old boy's daily worksheet. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "exercises": [
    {
      "name": "Exercise name (2-4 words)",
      "rep": "Reps or duration, e.g. 20x or 45 sec",
      "hint": "Short coaching hint (2-5 words)"
    }
  ]
}

Rules:
- Exactly 10 exercises in "exercises"
- Keep each exercise safe for home, garden, or park with no equipment
- Mix warm-up, strength, balance, coordination, and cool-down
- Keep language playful, clear, and age-appropriate for a 9-year-old
- Include realistic reps/durations for a child
- Keep each "hint" short and actionable`;

export const GET = async () => {
  const data = await generateJSON<PhysicalData>(PROMPT, fallbackPhysical);
  return jsonResponse(normalizePhysicalData(data));
};
