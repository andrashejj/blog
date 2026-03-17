export interface PhysicalExercise {
  name: string;
  rep: string;
  hint: string;
}

export interface PhysicalData {
  exercises: PhysicalExercise[];
}

export interface MathData {
  additionSubtraction: string[];
  multiplication: string[];
  division: string[];
  geometry: string[];
  patterns: string[];
  wordProblems: string[];
}

export interface MathConfig {
  addSubMax: number;
  timesMax: number;
}

export interface ChallengesData {
  riddle: string;
  anagram: {
    scrambled: string;
    hint: string;
  };
  engineering: string;
  mindfulness: string;
}

export interface ChallengesPromptData {
  riddle: string;
  anagram: {
    word: string;
    hint: string;
  };
  engineering: string;
  mindfulness: string;
}

export interface SketchesData {
  exercises: string[];
}

export interface WordsData {
  words: string[];
  hook: string;
}

export const defaultMathConfig: MathConfig = {
  addSubMax: 200,
  timesMax: 5,
};

const MULTIPLICATION_FIRST_FACTOR_MIN = 2;
const MULTIPLICATION_FIRST_FACTOR_MAX = 10;

export const fallbackPhysical: PhysicalData = {
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

export const fallbackChallenges: ChallengesPromptData = {
  riddle:
    "I have keys but no locks. I have space but no room. You can enter but not go outside. What am I?",
  anagram: { word: "SILENT", hint: "Quiet" },
  engineering:
    "Build the tallest tower you can using exactly 10 books and 2 pieces of paper. Measure it!",
  mindfulness:
    "Sit outside with your eyes closed for 2 minutes. Write down the 3 quietest sounds you heard.",
};

export const fallbackSketches: SketchesData = {
  exercises: [
    "Strokes and Lines Control",
    "Basic Shapes in Space",
    "Light and Shadow Study",
    "Perspective and Proportions",
    "Shadow Study: A Mug by Lamp",
    "Sketch of the Day: Treehouse Storm",
  ],
};

export const fallbackWords: WordsData = {
  words: [
    "thunder",
    "lantern",
    "clattering",
    "midnight",
    "jungle",
    "whisper",
    "copper",
    "zigzag",
    "backpack",
    "splash",
  ],
  hook: "The old clock tower hadn't chimed in fifty years, but tonight, right at midnight, it struck thirteen times.",
};

const MATH_COUNTS = {
  additionSubtraction: 10,
  multiplication: 8,
  division: 8,
  geometry: 3,
  patterns: 3,
  wordProblems: 4,
} as const;

type MathSectionKey = keyof typeof MATH_COUNTS;

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function repeat<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, index) => factory(index));
}

function normalizeText(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

function normalizeFixedList<T>(
  value: unknown,
  fallback: readonly T[],
  normalizeItem: (item: unknown, fallbackItem: T, index: number) => T,
): T[] {
  if (!Array.isArray(value) || value.length < fallback.length) {
    return fallback.map((item, index) => normalizeItem(undefined, item, index));
  }

  return fallback.map((fallbackItem, index) =>
    normalizeItem(value[index], fallbackItem, index),
  );
}

function parseBinaryExpression(
  value: string,
  pattern: RegExp,
): { left: number; right: number; operator?: string } | null {
  const match = value.match(pattern);
  if (!match) {
    return null;
  }

  const left = Number.parseInt(match[1], 10);
  const right = Number.parseInt(match[match.length - 1], 10);
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return null;
  }

  const operator = match.length === 4 ? match[2] : undefined;
  return { left, right, operator };
}

function generateAdditionProblem(max: number): string {
  const left = rand(0, max);
  const right = rand(0, max - left);
  return `${left} + ${right}`;
}

function generateSubtractionProblem(max: number): string {
  const left = rand(1, max);
  const right = rand(0, left);
  return `${left} - ${right}`;
}

function generateMultiplicationProblem(max: number): string {
  const left = rand(
    MULTIPLICATION_FIRST_FACTOR_MIN,
    MULTIPLICATION_FIRST_FACTOR_MAX,
  );
  const right = rand(2, max);
  return `${left} x ${right}`;
}

function generateDivisionProblem(max: number): string {
  const divisor = rand(2, max);
  const quotient = rand(
    MULTIPLICATION_FIRST_FACTOR_MIN,
    MULTIPLICATION_FIRST_FACTOR_MAX,
  );
  return `${divisor * quotient} / ${divisor}`;
}

const geometryGenerators = [
  () =>
    `A rectangle is ${rand(4, 11)} units by ${rand(4, 11)} units. What is its area?`,
  () =>
    `A rectangle is ${rand(6, 13)} m long and ${rand(3, 9)} m wide. What is its perimeter?`,
  () =>
    `A square has a perimeter of ${rand(5, 14) * 4} units. What is one side length?`,
] satisfies Array<() => string>;

const patternGenerators = [
  () => {
    const start = rand(8, 24);
    const step = rand(3, 8);
    const sequence = repeat(5, (index) => start + step * index);
    return `What comes next: ${sequence.join(", ")}, __`;
  },
  () => {
    const start = rand(65, 95);
    const step = rand(4, 9);
    const sequence = repeat(4, (index) => start - step * index);
    return `Fill in the blank: ${sequence[0]}, ${sequence[1]}, __, ${sequence[3]}, ${sequence[3] - step}`;
  },
  () => {
    const start = rand(3, 8);
    const sequence = [start, start + 5, start + 4, start + 9, start + 8];
    return `Use +5, then -1, and repeat: ${sequence.join(", ")}, __`;
  },
] satisfies Array<() => string>;

const wordProblemGenerators = [
  () => {
    const packs = rand(3, 6);
    const perPack = rand(6, 11);
    const givenAway = rand(5, 14);
    return `Noah has ${packs} packs of stickers with ${perPack} stickers in each pack. He gives ${givenAway} away. How many are left?`;
  },
  () => {
    const rounds = rand(3, 6);
    const minutes = rand(10, 20);
    const breakMinutes = rand(3, 8);
    return `Training has ${rounds} rounds. Each round is ${minutes} minutes, with a ${breakMinutes}-minute break between rounds. How many minutes total?`;
  },
  () => {
    const rows = rand(4, 8);
    const seats = rand(5, 9);
    const filled = rand(8, rows * seats - 3);
    return `A mini-bus has ${rows} rows with ${seats} seats each. ${filled} seats are filled. How many seats are empty?`;
  },
  () => {
    const boxes = rand(3, 6);
    const pencilsPerBox = rand(6, 12);
    const used = rand(8, 18);
    return `A class has ${boxes} boxes of pencils with ${pencilsPerBox} pencils in each box. ${used} pencils were used. How many pencils remain?`;
  },
] satisfies Array<() => string>;

function generateMathSection(
  key: MathSectionKey,
  config: MathConfig,
): string[] {
  switch (key) {
    case "additionSubtraction":
      return [
        ...repeat(MATH_COUNTS.additionSubtraction / 2, () =>
          generateAdditionProblem(config.addSubMax),
        ),
        ...repeat(MATH_COUNTS.additionSubtraction / 2, () =>
          generateSubtractionProblem(config.addSubMax),
        ),
      ];
    case "multiplication":
      return repeat(MATH_COUNTS.multiplication, () =>
        generateMultiplicationProblem(config.timesMax),
      );
    case "division":
      return repeat(MATH_COUNTS.division, () =>
        generateDivisionProblem(config.timesMax),
      );
    case "geometry":
      return geometryGenerators.map((generator) => generator());
    case "patterns":
      return patternGenerators.map((generator) => generator());
    case "wordProblems":
      return wordProblemGenerators.map((generator) => generator());
  }
}

function isValidAddSub(value: string, config: MathConfig): boolean {
  const parsed = parseBinaryExpression(value, /^\s*(\d+)\s*([+-])\s*(\d+)\s*$/);
  if (!parsed || !parsed.operator) {
    return false;
  }

  const { left, right, operator } = parsed;
  if (left > config.addSubMax || right > config.addSubMax) {
    return false;
  }

  const result = operator === "+" ? left + right : left - right;
  return result >= 0 && result <= config.addSubMax;
}

function isValidMultiplication(value: string, config: MathConfig): boolean {
  const parsed = parseBinaryExpression(value, /^\s*(\d+)\s*x\s*(\d+)\s*$/i);
  if (!parsed) {
    return false;
  }

  const { left, right } = parsed;
  return (
    left >= MULTIPLICATION_FIRST_FACTOR_MIN &&
    left <= MULTIPLICATION_FIRST_FACTOR_MAX &&
    right >= 2 &&
    right <= config.timesMax
  );
}

function isValidDivision(value: string, config: MathConfig): boolean {
  const parsed = parseBinaryExpression(value, /^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!parsed) {
    return false;
  }

  const { left: dividend, right: divisor } = parsed;
  if (divisor < 2 || divisor > config.timesMax) {
    return false;
  }

  if (dividend % divisor !== 0) {
    return false;
  }

  const quotient = dividend / divisor;
  return (
    quotient >= MULTIPLICATION_FIRST_FACTOR_MIN &&
    quotient <= MULTIPLICATION_FIRST_FACTOR_MAX
  );
}

function normalizeMathList(
  value: unknown,
  fallback: string[],
  isValid?: (entry: string) => boolean,
): string[] {
  return normalizeFixedList(value, fallback, (item, fallbackItem) => {
    const normalized = normalizeText(item, fallbackItem);
    return isValid && !isValid(normalized) ? fallbackItem : normalized;
  });
}

export function clampInt(
  value: string | null | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function getMathConfigFromSearchParams(
  searchParams: URLSearchParams,
): MathConfig {
  return {
    addSubMax: clampInt(
      searchParams.get("addSubMax"),
      20,
      999,
      defaultMathConfig.addSubMax,
    ),
    timesMax: clampInt(
      searchParams.get("timesMax"),
      2,
      12,
      defaultMathConfig.timesMax,
    ),
  };
}

export function buildMathUrl(config: MathConfig): string {
  const params = new URLSearchParams({
    addSubMax: String(config.addSubMax),
    timesMax: String(config.timesMax),
  });
  return `/api/generate-math-exercises?${params.toString()}`;
}

export function buildMathPrompt(config: MathConfig): string {
  return `Generate a fresh math worksheet for a 9-year-old boy. Return ONLY valid JSON with no markdown formatting, matching this exact structure:

{
  "additionSubtraction": ["problem 1", "problem 2", "problem 3", "problem 4", "problem 5", "problem 6", "problem 7", "problem 8", "problem 9", "problem 10"],
  "multiplication": ["problem 1", "problem 2", "problem 3", "problem 4", "problem 5", "problem 6", "problem 7", "problem 8"],
  "division": ["problem 1", "problem 2", "problem 3", "problem 4", "problem 5", "problem 6", "problem 7", "problem 8"],
  "geometry": ["question 1", "question 2", "question 3"],
  "patterns": ["question 1", "question 2", "question 3"],
  "wordProblems": ["question 1", "question 2", "question 3", "question 4"]
}

Rules:
- Use exactly the number of items shown in each array
- Do NOT include any answers
- "additionSubtraction" should be arithmetic expressions only, using + or -
- Every addition/subtraction problem must use numbers no greater than ${config.addSubMax}, and the result must stay between 0 and ${config.addSubMax}
- Allowed example: 198 - 103
- Not allowed example: 102 + 100
- "multiplication" should be arithmetic expressions only, using x
- Multiplication must be written as first number x times-table number, never reversed
- The first multiplication factor must be between ${MULTIPLICATION_FIRST_FACTOR_MIN} and ${MULTIPLICATION_FIRST_FACTOR_MAX}
- The second multiplication factor must be between 2 and ${config.timesMax}
- Allowed example: 10 x ${config.timesMax}
- Not allowed example: ${config.timesMax} x 10
- "division" should be arithmetic expressions only, using / and whole-number results
- Division should match those multiplication facts in reverse, using divisors between 2 and ${config.timesMax}
- "geometry", "patterns", and "wordProblems" should be short, clear text questions
- Keep everything age-appropriate and engaging for a 9-year-old
- Use varied contexts and avoid repeating the same theme in all word problems`;
}

export function createMathFallback(
  config: MathConfig = defaultMathConfig,
): MathData {
  return {
    additionSubtraction: generateMathSection("additionSubtraction", config),
    multiplication: generateMathSection("multiplication", config),
    division: generateMathSection("division", config),
    geometry: generateMathSection("geometry", config),
    patterns: generateMathSection("patterns", config),
    wordProblems: generateMathSection("wordProblems", config),
  };
}

export function normalizePhysicalData(
  data: Partial<PhysicalData> | null | undefined,
): PhysicalData {
  return {
    exercises: normalizeFixedList(
      data?.exercises,
      fallbackPhysical.exercises,
      (item, fallbackExercise) => {
        const source =
          typeof item === "object" && item !== null
            ? (item as Partial<PhysicalExercise>)
            : {};

        return {
          name: normalizeText(source.name, fallbackExercise.name),
          rep: normalizeText(source.rep, fallbackExercise.rep),
          hint: normalizeText(source.hint, fallbackExercise.hint),
        };
      },
    ),
  };
}

export function normalizeMathData(
  data: Partial<MathData> | null | undefined,
  config: MathConfig = defaultMathConfig,
): MathData {
  const fallback = createMathFallback(config);
  return {
    additionSubtraction: normalizeMathList(
      data?.additionSubtraction,
      fallback.additionSubtraction,
      (value) => isValidAddSub(value, config),
    ),
    multiplication: normalizeMathList(
      data?.multiplication,
      fallback.multiplication,
      (value) => isValidMultiplication(value, config),
    ),
    division: normalizeMathList(data?.division, fallback.division, (value) =>
      isValidDivision(value, config),
    ),
    geometry: normalizeMathList(data?.geometry, fallback.geometry),
    patterns: normalizeMathList(data?.patterns, fallback.patterns),
    wordProblems: normalizeMathList(data?.wordProblems, fallback.wordProblems),
  };
}

function normalizeChallengesPromptData(
  data: Partial<ChallengesPromptData> | null | undefined,
): ChallengesPromptData {
  return {
    riddle: normalizeText(data?.riddle, fallbackChallenges.riddle),
    anagram: {
      word: normalizeText(data?.anagram?.word, fallbackChallenges.anagram.word),
      hint: normalizeText(data?.anagram?.hint, fallbackChallenges.anagram.hint),
    },
    engineering: normalizeText(
      data?.engineering,
      fallbackChallenges.engineering,
    ),
    mindfulness: normalizeText(
      data?.mindfulness,
      fallbackChallenges.mindfulness,
    ),
  };
}

export function scrambleWord(
  word: string,
  random: () => number = Math.random,
): string {
  if (word.length < 2) {
    return word;
  }

  const letters = word.split("");

  for (let attempts = 0; attempts < 5; attempts += 1) {
    const shuffled = [...letters];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[index],
      ];
    }

    const candidate = shuffled.join("");
    if (candidate !== word) {
      return candidate;
    }
  }

  return `${word.slice(1)}${word[0]}`;
}

export function normalizeChallengesData(
  data: Partial<ChallengesPromptData> | null | undefined,
): ChallengesData {
  const normalized = normalizeChallengesPromptData(data);
  const word = normalized.anagram.word.toUpperCase().replace(/[^A-Z]/g, "");
  const fallbackWord = fallbackChallenges.anagram.word;
  const safeWord = word.length >= 2 ? word : fallbackWord;

  return {
    riddle: normalized.riddle,
    anagram: {
      scrambled: scrambleWord(safeWord).split("").join(" "),
      hint: normalized.anagram.hint,
    },
    engineering: normalized.engineering,
    mindfulness: normalized.mindfulness,
  };
}

export function normalizeSketchesData(
  data: Partial<SketchesData> | null | undefined,
): SketchesData {
  return {
    exercises: normalizeFixedList(
      data?.exercises,
      fallbackSketches.exercises,
      (item, fallbackExercise) => normalizeText(item, fallbackExercise),
    ),
  };
}

export function normalizeWordsData(
  data: Partial<WordsData> | null | undefined,
): WordsData {
  return {
    words: normalizeFixedList(
      data?.words,
      fallbackWords.words,
      (item, fallbackWord) => normalizeText(item, fallbackWord),
    ),
    hook: normalizeText(data?.hook, fallbackWords.hook),
  };
}
