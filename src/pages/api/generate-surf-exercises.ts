export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";
import { skillsSummary } from "../../lib/surf-skills";

interface ActivityItem {
  name: string;
  description: string;
}

interface SurfSessionResponse {
  intro: {
    sessionGoal: string;
    structureNote: string;
  };
  icebreaker: {
    name: string;
    description: string;
    coachNote: string;
  };
  warmup: {
    drills: ActivityItem[];
    coachNote: string;
  };
  theory: {
    topic: string;
    explain: string;
    demoCue: string;
    checkQuestion: string;
  };
  waterBlock: {
    focus: string;
    coachCue: string;
    successMarker: string;
    challenge: string;
  };
  closing: {
    debriefPrompt: string;
    goodbyeCue: string;
  };
}

const THEORY_TOPICS = [
  "safety and water awareness",
  "lineup etiquette",
  "paddling body position",
  "pop-up timing",
  "surf stance",
  "looking where you go",
  "choosing the right wave",
] as const;

const PROMPT = `Generate a professional but kid-friendly surf coaching session for a group of kids aged 7-9 training at a beach in Mauritius.

Here are their current skill levels (scale of 1-5):
${skillsSummary()}

IMPORTANT:
- Keep the session suitable for a sandy beach with no equipment.
- Tone must be short, calm, clear, coach-friendly, and positive.
- This is a printable kids surf session with a fixed land structure and a flexible water block.
- Session timing is:
  - Welcome + rules + today's plan: 5 min
  - Theola playful opener: 10 min
  - Warmup + stretch: 10 min
  - Theory on the sand: 10 min
  - Water block: flexible, usually 20-60 min depending on conditions and energy
  - Quick debrief + goodbye: 5 min
- Content should feel professional, not silly, not random, and not overengineered.
- The "icebreaker" block is led by Theola. It must be playful and social, and must NOT feel like conditioning.
- The "warmup" block is movement prep only. It must NOT be another game.
- Generate exactly 3 warmup drills.
- Theory must rotate around exactly ONE topic from this list:
  - safety and water awareness
  - lineup etiquette
  - paddling body position
  - pop-up timing
  - surf stance
  - looking where you go
  - choosing the right wave
- Use the exact chosen topic text in "theory.topic".
- The water block must focus on the SAME single topic. Use the exact same text in "waterBlock.focus".
- "intro" should stay aligned with the fixed session structure and explain the plan simply for kids.

Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "intro": {
    "sessionGoal": "One short sentence",
    "structureNote": "One short sentence explaining the session flow"
  },
  "icebreaker": {
    "name": "2-5 words",
    "description": "One short sentence",
    "coachNote": "One short coaching note"
  },
  "warmup": {
    "drills": [
      {
        "name": "2-5 words",
        "description": "One short sentence"
      }
    ],
    "coachNote": "One short coaching note"
  },
  "theory": {
    "topic": "Must be exactly one topic from the provided list",
    "explain": "One short sentence for kids",
    "demoCue": "One short demonstration cue",
    "checkQuestion": "One short question"
  },
  "waterBlock": {
    "focus": "Must be exactly the same text as theory.topic",
    "coachCue": "One short coaching cue",
    "successMarker": "One short sentence describing what good looks like",
    "challenge": "One short achievable mission sentence"
  },
  "closing": {
    "debriefPrompt": "One short debrief question",
    "goodbyeCue": "One short goodbye routine cue"
  }
}`;

const fallback: SurfSessionResponse = {
  intro: {
    sessionGoal:
      "Today we build confidence with calm habits, clear coaching, and one simple surf skill.",
    structureNote:
      "We start together on the sand, learn one idea, then take that same idea into the water.",
  },
  icebreaker: {
    name: "Name & Wave Move",
    description:
      "In a circle, each surfer says their name and shows one funny surf move for the group to copy.",
    coachNote:
      "Theola sets the tone: smiles first, quick turns, and make sure every child is seen.",
  },
  warmup: {
    drills: [
      {
        name: "Shoreline Jog",
        description:
          "Jog together on the sand, turn on coach call, and keep shoulders relaxed.",
      },
      {
        name: "Arm Circles & Reaches",
        description:
          "Open the shoulders, twist gently, and reach long to wake up paddling muscles.",
      },
      {
        name: "Lunge Twist Flow",
        description:
          "Step into controlled lunges, rotate over the front leg, and finish with ankle balance.",
      },
    ],
    coachNote:
      "Keep the tempo light and tidy; this block prepares bodies for surfing, not exhaustion.",
  },
  theory: {
    topic: "paddling body position",
    explain:
      "When your chest is lifted and your body is centered, the board glides straighter and catches waves earlier.",
    demoCue:
      "Show one bad paddle position and one good one, then let the kids spot the difference.",
    checkQuestion:
      "Where should your chest and eyes be when you paddle for a wave?",
  },
  waterBlock: {
    focus: "paddling body position",
    coachCue:
      "Long body, light chest lift, and eyes forward before every wave.",
    successMarker:
      "Good looks like a straight board, steady paddling, and an earlier, calmer takeoff.",
    challenge:
      "Each surfer finds 3 waves where they set their body position before trying to stand.",
  },
  closing: {
    debriefPrompt:
      "What helped you most today when you went from sand to water?",
    goodbyeCue:
      "Shake hands, thank the group, and carry boards back together.",
  },
};

function pickText(value: string | undefined, fallbackValue: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallbackValue;
}

function normalizeDrill(
  drill: Partial<ActivityItem> | undefined,
  fallbackDrill: ActivityItem,
): ActivityItem {
  return {
    name: pickText(drill?.name, fallbackDrill.name),
    description: pickText(drill?.description, fallbackDrill.description),
  };
}

function normalizeDrills(
  drills: ActivityItem[] | undefined,
  fallbackDrills: ActivityItem[],
): ActivityItem[] {
  if (!Array.isArray(drills) || drills.length < fallbackDrills.length) {
    return fallbackDrills;
  }

  return fallbackDrills.map((fallbackDrill, index) => {
    const drill = drills[index];
    return normalizeDrill(
      drill && typeof drill === "object" ? drill : undefined,
      fallbackDrill,
    );
  });
}

function normalizeTopic(
  topic: string | undefined,
  fallbackTopic: (typeof THEORY_TOPICS)[number],
): (typeof THEORY_TOPICS)[number] {
  const trimmed = topic?.trim().toLowerCase();
  if (!trimmed) return fallbackTopic;

  return (
    THEORY_TOPICS.find((candidate) => candidate.toLowerCase() === trimmed) ||
    fallbackTopic
  );
}

export const GET = async () => {
  const model = process.env.GEMINI_SURF_MODEL || "gemini-3-flash-preview";
  const rawData = await generateJSON<SurfSessionResponse>(PROMPT, fallback, {
    model,
    timeoutMs: 25_000,
    temperature: 0.9,
  });

  const topic = normalizeTopic(rawData.theory?.topic, fallback.theory.topic);

  const data: SurfSessionResponse = {
    intro: fallback.intro,
    icebreaker: {
      name: pickText(rawData.icebreaker?.name, fallback.icebreaker.name),
      description: pickText(
        rawData.icebreaker?.description,
        fallback.icebreaker.description,
      ),
      coachNote: pickText(
        rawData.icebreaker?.coachNote,
        fallback.icebreaker.coachNote,
      ),
    },
    warmup: {
      drills: normalizeDrills(rawData.warmup?.drills, fallback.warmup.drills),
      coachNote: pickText(
        rawData.warmup?.coachNote,
        fallback.warmup.coachNote,
      ),
    },
    theory: {
      topic,
      explain: pickText(rawData.theory?.explain, fallback.theory.explain),
      demoCue: pickText(rawData.theory?.demoCue, fallback.theory.demoCue),
      checkQuestion: pickText(
        rawData.theory?.checkQuestion,
        fallback.theory.checkQuestion,
      ),
    },
    waterBlock: {
      focus: topic,
      coachCue: pickText(
        rawData.waterBlock?.coachCue,
        fallback.waterBlock.coachCue,
      ),
      successMarker: pickText(
        rawData.waterBlock?.successMarker,
        fallback.waterBlock.successMarker,
      ),
      challenge: pickText(
        rawData.waterBlock?.challenge,
        fallback.waterBlock.challenge,
      ),
    },
    closing: {
      debriefPrompt: pickText(
        rawData.closing?.debriefPrompt,
        fallback.closing.debriefPrompt,
      ),
      goodbyeCue: pickText(
        rawData.closing?.goodbyeCue,
        fallback.closing.goodbyeCue,
      ),
    },
  };

  return jsonResponse(data);
};
