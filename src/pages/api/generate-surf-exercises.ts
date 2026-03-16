export const prerender = false;

import { generateJSON, jsonResponse } from "../../lib/gemini";
import { pickExercises } from "../../lib/surf-exercises";
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
- Do NOT generate warmup drills. The warmup exercises are handled separately from a curated bank. Only generate a short warmup coachNote.
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
    "coachNote": "One short coaching note for the warmup block"
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
        name: "Hip Circles",
        description:
          "Stand on one leg, draw big circles with the other knee to loosen hips — five each direction.",
      },
      {
        name: "Cat-Cow Flow",
        description:
          "On all fours, arch the back up like a cat then drop the belly like a cow, slow and smooth.",
      },
      {
        name: "Pop-Up Push-Ups",
        description:
          "Start flat on the sand, push up and spring to surf stance, then back down — five reps.",
      },
      {
        name: "Superhero Hold",
        description:
          "Lie face down, lift arms and legs off the sand and hold for five seconds, then relax.",
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
    goodbyeCue: "Shake hands, thank the group, and carry boards back together.",
  },
};

function pickText(value: string | undefined, fallbackValue: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallbackValue;
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
      drills: [
        ...pickExercises(2, "mobility"),
        ...pickExercises(2, "strength"),
      ].map((e) => ({ name: e.name, description: e.description })),
      coachNote: pickText(rawData.warmup?.coachNote, fallback.warmup.coachNote),
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
