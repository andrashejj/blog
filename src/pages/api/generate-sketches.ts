export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";

interface SketchesResponse {
  exercises: string[];
}

const PROMPT = `Generate 6 drawing exercises for a 9-year-old boy's daily sketch practice. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "exercises": [
    "Short drawing exercise title #1",
    "Short drawing exercise title #2",
    "Short drawing exercise title #3",
    "Short drawing exercise title #4",
    "Short drawing exercise title #5",
    "Short drawing exercise title #6"
  ]
}

Rules:
- Exactly 6 items in "exercises"
- Keep each item 3-9 words
- Mix fundamentals and creative prompts
- Keep age appropriate and easy to set up at home`;

const fallback: SketchesResponse = {
  exercises: [
    "Strokes and Lines Control",
    "Basic Shapes in Space",
    "Light and Shadow Study",
    "Perspective and Proportions",
    "Shadow Study: A Mug by Lamp",
    "Sketch of the Day: Treehouse Storm",
  ],
};

export const GET = async () => {
  const data = await generateJSON<SketchesResponse>(PROMPT, fallback);
  if (!Array.isArray(data.exercises) || data.exercises.length < 6) {
    data.exercises = fallback.exercises;
  }
  data.exercises = data.exercises.slice(0, 6);
  return jsonResponse(data);
};
