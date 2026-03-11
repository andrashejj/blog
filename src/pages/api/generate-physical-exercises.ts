export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";

interface PhysicalExercise {
  name: string;
  rep: string;
  hint: string;
}

interface PhysicalResponse {
  exercises: PhysicalExercise[];
}

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

const fallback: PhysicalResponse = {
  exercises: [
    { name: "Jumping Jacks", rep: "40x", hint: "Land softly" },
    { name: "Bear Crawl", rep: "2 x 20 sec", hint: "Slow and steady" },
    { name: "Air Squats", rep: "20x", hint: "Chest up" },
    { name: "Skater Hops", rep: "24x", hint: "Stick the landing" },
    { name: "Crab Walk", rep: "2 x 20 sec", hint: "Hips high" },
    { name: "Wall Pushups", rep: "20x", hint: "Straight body" },
    { name: "Single-Leg Balance", rep: "30 sec each", hint: "Eyes forward" },
    { name: "Mountain Climbers", rep: "30x", hint: "Quick knees" },
    { name: "Superman Hold", rep: "2 x 20 sec", hint: "Squeeze back" },
    { name: "Starfish Stretch", rep: "90 sec", hint: "Slow breathing" },
  ],
};

function normalizeExercise(
  exercise: Partial<PhysicalExercise>,
  index: number,
): PhysicalExercise {
  const fallbackExercise =
    fallback.exercises[index % fallback.exercises.length];
  return {
    name: (exercise.name || fallbackExercise.name).trim(),
    rep: (exercise.rep || fallbackExercise.rep).trim(),
    hint: (exercise.hint || fallbackExercise.hint).trim(),
  };
}

export const GET = async () => {
  const data = await generateJSON<PhysicalResponse>(PROMPT, fallback);

  if (!Array.isArray(data.exercises) || data.exercises.length < 10) {
    data.exercises = fallback.exercises;
  }

  data.exercises = data.exercises
    .slice(0, 10)
    .map((exercise, index) => normalizeExercise(exercise, index));

  return jsonResponse(data);
};
