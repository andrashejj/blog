export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";
import { skillsSummary } from "../../lib/surf-skills";

interface ActivityItem {
  name: string;
  description: string;
  duration?: string;
  reps?: string;
}

interface SurfExercisesResponse {
  warmupStretch: {
    drills: ActivityItem[];
    coachNote: string;
  };
  basics: {
    drills: ActivityItem[];
    jumpUps: { reps: string; cue: string };
    coachCue: string;
  };
  waterBlock: {
    paddleFocus: string;
    surfFocus: string;
    challenge: string;
    debriefPrompt: string;
  };
}

const PROMPT = `Generate a flexible surf coaching session for a group of kids aged 7-9 training at a beach in Mauritius.

Here are their current skill levels (scale of 1-5):
${skillsSummary()}

IMPORTANT:
- Tailor all drills and cues to these skill levels.
- Keep all language short, clear, and coach-friendly.
- Session is designed for ~90 minutes total with some slack.
- All activities must be safe on a sandy beach with no equipment.
- Basics MUST include jump-ups with reps fixed to "20x each surfer".

Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "warmupStretch": {
    "drills": [
      {
        "name": "2-5 words",
        "description": "One sentence instruction",
        "duration": "e.g. 4-6 min"
      }
    ],
    "coachNote": "One short coaching note for this block"
  },
  "basics": {
    "drills": [
      {
        "name": "2-5 words",
        "description": "One sentence instruction",
        "reps": "e.g. 8x or 3 rounds"
      }
    ],
    "jumpUps": {
      "reps": "20x each surfer",
      "cue": "One sentence cue for quality jump-ups"
    },
    "coachCue": "One short coaching cue for stand-up mechanics"
  },
  "waterBlock": {
    "paddleFocus": "One sentence on paddle-out focus",
    "surfFocus": "One sentence on surf focus",
    "challenge": "One fun achievable challenge sentence",
    "debriefPrompt": "One short debrief question for end of session"
  }
}

Generate exactly 4 warmup/stretch drills and exactly 3 basics drills.`;

const fallback: SurfExercisesResponse = {
  warmupStretch: {
    drills: [
      {
        name: "Beach Jog Loop",
        description:
          "Jog together along the shoreline, then back to the group cone with relaxed breathing.",
        duration: "4-5 min",
      },
      {
        name: "Dynamic Arm Swings",
        description:
          "Do big arm circles, shoulder rolls, and cross-body swings to wake up paddling muscles.",
        duration: "4-5 min",
      },
      {
        name: "Hip Opener Lunges",
        description:
          "Step into controlled lunges and rotate over the front leg on each side.",
        duration: "4-5 min",
      },
      {
        name: "Ankle Balance Holds",
        description:
          "Hold single-leg balance in soft sand and switch legs with steady posture.",
        duration: "3-4 min",
      },
    ],
    coachNote:
      "Theola leads this block: keep it playful, keep everyone moving, and finish with calm breathing.",
  },
  basics: {
    drills: [
      {
        name: "Pop-up Landing",
        description:
          "From prone, pop up and freeze in stance with eyes forward and knees bent.",
        reps: "8x",
      },
      {
        name: "Rail Reach Drill",
        description:
          "Practice hand placement and chest lift before every pop-up to lock clean sequencing.",
        reps: "8x",
      },
      {
        name: "Low Stance Hold",
        description:
          "Hold a low surf stance for control, then reset with balanced feet.",
        reps: "3x 20s",
      },
    ],
    jumpUps: {
      reps: "20x each surfer",
      cue: "Quality over speed: stable feet, soft knees, eyes down the line.",
    },
    coachCue:
      "No shortcuts on mechanics: every rep starts with clean hand placement and finishes in a stable stance.",
  },
  waterBlock: {
    paddleFocus:
      "Paddle out together through the easiest channel and keep spacing between boards.",
    surfFocus:
      "On every wave, pop up early and look where you want to go, not at your feet.",
    challenge:
      "Each surfer aims for 3 clean rides with controlled takeoff and balanced stance.",
    debriefPrompt:
      "What felt best today, and what is one thing you want to improve next session?",
  },
};

function hasWarmupData(data: SurfExercisesResponse): boolean {
  return Boolean(
    data.warmupStretch?.drills?.length >= 1 && data.warmupStretch?.coachNote,
  );
}

function hasBasicsData(data: SurfExercisesResponse): boolean {
  return Boolean(
    data.basics?.drills?.length >= 1 &&
      data.basics?.jumpUps?.reps &&
      data.basics?.jumpUps?.cue &&
      data.basics?.coachCue,
  );
}

function hasWaterBlockData(data: SurfExercisesResponse): boolean {
  return Boolean(
    data.waterBlock?.paddleFocus &&
      data.waterBlock?.surfFocus &&
      data.waterBlock?.challenge &&
      data.waterBlock?.debriefPrompt,
  );
}

export const GET = async () => {
  const model = process.env.GEMINI_SURF_MODEL || "gemini-3-flash-preview";
  const data = await generateJSON<SurfExercisesResponse>(PROMPT, fallback, {
    model,
    timeoutMs: 25_000,
    temperature: 1.1,
  });

  if (!hasWarmupData(data)) data.warmupStretch = fallback.warmupStretch;
  if (!hasBasicsData(data)) data.basics = fallback.basics;
  if (!hasWaterBlockData(data)) data.waterBlock = fallback.waterBlock;

  data.basics.jumpUps.reps = "20x each surfer";

  return jsonResponse(data);
};
