export const prerender = false;

import type { APIContext } from "astro";
import { generateJSON, jsonResponse } from "../../lib/gemini";
import {
  FLAT_DAY_THEORY_TOPICS,
  pickExercises,
  pickWaterDrills,
} from "../../lib/surf-exercises";
import type { WaterDrill } from "../../lib/surf-exercises";
import { skillsSummary } from "../../lib/surf-skills";

interface ActivityItem {
  name: string;
  description: string;
}

interface WavyWaterBlock {
  mode: "wavy";
  focus: string;
  coachCue: string;
  successMarker: string;
  challenge: string;
}

interface FlatWaterBlock {
  mode: "flat";
  drills: Array<{
    name: string;
    description: string;
    category: string;
    safetyNote?: string;
  }>;
  coachNote: string;
  sessionChallenge: string;
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
  waterBlock: WavyWaterBlock | FlatWaterBlock;
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

const skillsBlock = skillsSummary();

const WAVY_PROMPT = `Generate a professional but kid-friendly surf coaching session for a group of kids aged 7-9 training at a beach in Mauritius.

Here are their current skill levels (scale of 1-5):
${skillsBlock}

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

const FLAT_PROMPT = `Generate a professional but kid-friendly surf coaching session for a FLAT DAY (no waves) for kids aged 7-9 at a beach in Mauritius.

Here are their current skill levels (scale of 1-5):
${skillsBlock}

IMPORTANT:
- This is a flat day — there are no waves. The water block will focus on water drills, board skills, and ocean confidence instead of wave riding.
- Keep the session suitable for a sandy beach with no equipment.
- Tone must be short, calm, clear, coach-friendly, and positive.
- Session timing is the same as a wave day:
  - Welcome + rules + today's plan: 5 min
  - Theola playful opener: 10 min
  - Warmup + stretch: 10 min
  - Theory on the sand: 10 min
  - Water drills: flexible, usually 20-60 min
  - Quick debrief + goodbye: 5 min
- The "icebreaker" block is led by Theola. It must be playful and social, and must NOT feel like conditioning.
- Do NOT generate warmup drills or water drills. Those are handled from a curated bank. Only generate coachNotes.
- Theory must rotate around exactly ONE topic from this list:
  - safety and water awareness
  - paddling body position
  - board control and balance
  - ocean reading and currents
  - lineup etiquette
- Use the exact chosen topic text in "theory.topic".
- The "waterBlock" fields are just a coachNote and sessionChallenge to frame the pre-selected water drills.
- "intro" should mention it's a flat-day session focused on water skills and board confidence.

Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "intro": {
    "sessionGoal": "One short sentence",
    "structureNote": "One short sentence explaining the flat-day session flow"
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
    "coachNote": "One short coaching note to frame the water drills",
    "sessionChallenge": "One short achievable mission sentence for the flat-day drills"
  },
  "closing": {
    "debriefPrompt": "One short debrief question",
    "goodbyeCue": "One short goodbye routine cue"
  }
}`;

// -- Fallbacks ---------------------------------------------------------------

const wavyFallback = {
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
    drills: [] as ActivityItem[],
    coachNote:
      "Keep the tempo light and tidy; this block prepares bodies for surfing, not exhaustion.",
  },
  theory: {
    topic: "paddling body position" as string,
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

const flatFallback = {
  ...wavyFallback,
  intro: {
    sessionGoal:
      "Today we sharpen board skills and water confidence on a flat-day training session.",
    structureNote:
      "We warm up on the sand, learn one idea, then practise water drills and board skills.",
  },
  theory: {
    topic: "board control and balance" as string,
    explain:
      "Controlling your board in calm water helps you feel confident when the waves return.",
    demoCue:
      "Show a stable sitting position on the board, then demonstrate a controlled spin.",
    checkQuestion: "What do you do with your hands to keep the board stable?",
  },
  waterBlock: {
    coachNote:
      "Focus on calm, controlled movements — flat days are perfect for practising skills without pressure.",
    sessionChallenge:
      "Each surfer completes all four water drills and picks their favourite to show the group.",
  },
};

// -- Helpers -----------------------------------------------------------------

function pickText(value: string | undefined, fallbackValue: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallbackValue;
}

function normalizeTopicFrom<T extends readonly string[]>(
  topic: string | undefined,
  topics: T,
  fallbackTopic: string,
): string {
  const trimmed = topic?.trim().toLowerCase();
  if (!trimmed) return fallbackTopic;
  return topics.find((c) => c.toLowerCase() === trimmed) || fallbackTopic;
}

function buildCommonFields(
  // biome-ignore lint/suspicious/noExplicitAny: raw AI response
  raw: any,
  fb: typeof wavyFallback,
) {
  return {
    intro: fb.intro,
    icebreaker: {
      name: pickText(raw.icebreaker?.name, fb.icebreaker.name),
      description: pickText(
        raw.icebreaker?.description,
        fb.icebreaker.description,
      ),
      coachNote: pickText(raw.icebreaker?.coachNote, fb.icebreaker.coachNote),
    },
    warmup: {
      drills: [
        ...pickExercises(2, "mobility"),
        ...pickExercises(2, "strength"),
      ].map((e) => ({ name: e.name, description: e.description })),
      coachNote: pickText(raw.warmup?.coachNote, fb.warmup.coachNote),
    },
    closing: {
      debriefPrompt: pickText(
        raw.closing?.debriefPrompt,
        fb.closing.debriefPrompt,
      ),
      goodbyeCue: pickText(raw.closing?.goodbyeCue, fb.closing.goodbyeCue),
    },
  };
}

function waterDrillToItem(d: WaterDrill) {
  return {
    name: d.name,
    description: d.description,
    category: d.category,
    safetyNote: d.safetyNote,
  };
}

// -- Handler -----------------------------------------------------------------

export const GET = async ({ request }: APIContext) => {
  const url = new URL(request.url);
  const mode = url.searchParams.get("mode") === "flat" ? "flat" : "wavy";
  const model = process.env.GEMINI_SURF_MODEL || "gemini-3-flash-preview";
  const genOpts = { model, timeoutMs: 25_000, temperature: 0.9 };

  if (mode === "flat") {
    const raw = await generateJSON<typeof flatFallback>(
      FLAT_PROMPT,
      flatFallback,
      genOpts,
    );

    const topic = normalizeTopicFrom(
      raw.theory?.topic,
      FLAT_DAY_THEORY_TOPICS,
      flatFallback.theory.topic,
    );

    const data: SurfSessionResponse = {
      ...buildCommonFields(raw, flatFallback),
      theory: {
        topic,
        explain: pickText(raw.theory?.explain, flatFallback.theory.explain),
        demoCue: pickText(raw.theory?.demoCue, flatFallback.theory.demoCue),
        checkQuestion: pickText(
          raw.theory?.checkQuestion,
          flatFallback.theory.checkQuestion,
        ),
      },
      waterBlock: {
        mode: "flat",
        drills: pickWaterDrills().map(waterDrillToItem),
        coachNote: pickText(
          raw.waterBlock?.coachNote,
          flatFallback.waterBlock.coachNote,
        ),
        sessionChallenge: pickText(
          raw.waterBlock?.sessionChallenge,
          flatFallback.waterBlock.sessionChallenge,
        ),
      },
    };

    return jsonResponse(data);
  }

  // Wavy mode (default)
  const raw = await generateJSON<typeof wavyFallback>(
    WAVY_PROMPT,
    wavyFallback,
    genOpts,
  );

  const topic = normalizeTopicFrom(
    raw.theory?.topic,
    THEORY_TOPICS,
    wavyFallback.theory.topic,
  );

  const data: SurfSessionResponse = {
    ...buildCommonFields(raw, wavyFallback),
    theory: {
      topic,
      explain: pickText(raw.theory?.explain, wavyFallback.theory.explain),
      demoCue: pickText(raw.theory?.demoCue, wavyFallback.theory.demoCue),
      checkQuestion: pickText(
        raw.theory?.checkQuestion,
        wavyFallback.theory.checkQuestion,
      ),
    },
    waterBlock: {
      mode: "wavy",
      focus: topic,
      coachCue: pickText(
        raw.waterBlock?.coachCue,
        wavyFallback.waterBlock.coachCue,
      ),
      successMarker: pickText(
        raw.waterBlock?.successMarker,
        wavyFallback.waterBlock.successMarker,
      ),
      challenge: pickText(
        raw.waterBlock?.challenge,
        wavyFallback.waterBlock.challenge,
      ),
    },
  };

  return jsonResponse(data);
};
