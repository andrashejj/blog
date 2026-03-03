export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";
import { skillsSummary } from "../../lib/surf-skills";

interface SurfExercisesResponse {
  mobility: Array<{ name: string; description: string; reps: string }>;
  strength: Array<{ name: string; description: string; reps: string }>;
  warmupGame: { name: string; description: string };
  theoryTopic: { title: string; description: string };
  techniqueFocus: string;
  surfChallenge: string;
}

const PROMPT = `Generate surf coaching exercises for a group of kids aged 7-9 training at a beach in Mauritius.

Here are their current skill levels (scale of 1-5):
${skillsSummary()}

IMPORTANT: Tailor ALL exercises, theory, technique focus, and challenges to match these skill levels. For weak areas (1-2), focus on fundamentals and building confidence. For stronger areas (3+), push progression. The surf challenge and technique focus should be realistic for their abilities — don't assume they can do things their skill levels say they can't.

Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "mobility": [
    { "name": "Exercise name (2-4 words)", "description": "Clear one-sentence instruction a child can follow", "reps": "e.g. 10x each side" }
  ],
  "strength": [
    { "name": "Exercise name (2-4 words)", "description": "Clear one-sentence instruction. Must be a partner or group exercise.", "reps": "e.g. 3x 30s" }
  ],
  "warmupGame": {
    "name": "Game name (2-4 words)",
    "description": "Clear 1-2 sentence rules explanation. Must be a fun, high-energy team game playable on sand with no equipment. Examples: beach tag, relay races, capture the flag, sharks & minnows, red light green light, ultimate frisbee without a frisbee (use a ball of sand), king of the hill. Should get the whole group running and laughing."
  },
  "theoryTopic": {
    "title": "Short topic title (2-5 words)",
    "description": "A 1-2 sentence explanation of a surf theory concept appropriate for kids. Topics can include: how tides work, wave formation, rip currents and safety, how fins affect turning, why wax matters, reading the ocean, wind and swell direction, board types and when to use them, surf etiquette and priority rules, ocean currents."
  },
  "techniqueFocus": "A specific surf technique to focus on during the wave practice. Should be a single concrete coaching point that the kids can think about on every wave. Examples: 'Keep your eyes looking down the line, not at your feet, when you pop up', 'Bend your knees low and compress before starting a bottom turn'. One sentence.",
  "surfChallenge": "A fun, specific surf challenge for the group to attempt during the session. Should be achievable but push their skills. Examples: 'Catch 3 green waves in a row', 'Try one forehand turn on every wave'. One sentence."
}

Generate exactly 3 mobility exercises and 3 strength exercises. Keep descriptions short and action-oriented. All exercises must be safe for kids on a sandy beach with no equipment. Strength exercises MUST involve partners or the whole group (wheelbarrow walks, partner push-ups, team relay planks, etc).`;

const fallback: SurfExercisesResponse = {
  mobility: [
    {
      name: "Surf Pop-up Flow",
      description:
        "From lying flat, pop up into a low surf stance, hold for 3 seconds, then back down.",
      reps: "8x",
    },
    {
      name: "Ankle Circles in Sand",
      description:
        "Stand on one leg in the sand and draw big circles with the other foot.",
      reps: "10x each direction, each foot",
    },
    {
      name: "Crab Walk Sideways",
      description:
        "Sit on the sand, lift your hips, and crab-walk sideways as fast as you can.",
      reps: "2x 10m each direction",
    },
  ],
  strength: [
    {
      name: "Wheelbarrow Walk Race",
      description:
        "One person holds their partner's ankles while they walk on their hands — race to the cone and switch.",
      reps: "3x each",
    },
    {
      name: "Partner Push-up High Fives",
      description:
        "Face your partner in push-up position. After each push-up, high-five with opposite hands.",
      reps: "10x",
    },
    {
      name: "Surf Paddle Plank",
      description:
        "Hold a plank while mimicking paddle strokes with alternating arms.",
      reps: "3x 20s",
    },
  ],
  warmupGame: {
    name: "Sharks & Minnows",
    description:
      "One person is the shark in the middle. Everyone else (minnows) must run from one line to the other without getting tagged. If tagged, you become a shark too. Last minnow standing wins!",
  },
  theoryTopic: {
    title: "Reading the Lineup",
    description:
      "Before paddling out, sit on the beach for 2 minutes and watch where the waves break. The spot where they consistently break is called 'the peak' — that's where you want to sit.",
  },
  techniqueFocus:
    "Focus on looking down the line — not at your feet — the moment you pop up. Pick a point on the wave face and steer towards it.",
  surfChallenge:
    "Catch a wave and try to do one turn before kicking out cleanly at the end. Count how many you land out of 5 attempts.",
};

export const GET = async () => {
  // Surf exercise generation can be slower; use a lighter model and a longer timeout.
  const model = process.env.GEMINI_SURF_MODEL || "gemini-3-flash-preview";
  const data = await generateJSON<SurfExercisesResponse>(PROMPT, fallback, {
    model,
    timeoutMs: 25_000,
    temperature: 1.1,
  });

  if (!data.mobility?.length) data.mobility = fallback.mobility;
  if (!data.strength?.length) data.strength = fallback.strength;
  if (!data.warmupGame?.name) data.warmupGame = fallback.warmupGame;
  if (!data.theoryTopic?.title) data.theoryTopic = fallback.theoryTopic;
  if (!data.techniqueFocus) data.techniqueFocus = fallback.techniqueFocus;
  if (!data.surfChallenge) data.surfChallenge = fallback.surfChallenge;

  return jsonResponse(data);
};
