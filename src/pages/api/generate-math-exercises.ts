export const prerender = false;

import type { APIRoute } from "astro";

import { generateJSON, jsonResponse } from "../../lib/gemini";

interface MathResponse {
  additionSubtraction: string[];
  multiplication: string[];
  division: string[];
  geometry: string[];
  patterns: string[];
  wordProblems: string[];
}

interface MathConfig {
  addSubMax: number;
  timesMax: number;
}

const DEFAULT_MATH_CONFIG: MathConfig = {
  addSubMax: 200,
  timesMax: 5,
};

function buildPrompt(config: MathConfig): string {
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
- Multiplication should stay within times tables up to ${config.timesMax}; at least one factor must be ${config.timesMax} or smaller
- "division" should be arithmetic expressions only, using / and whole-number results
- Division should use divisors no greater than ${config.timesMax}
- "geometry", "patterns", and "wordProblems" should be short, clear text questions
- Keep everything age-appropriate and engaging for a 9-year-old
- Use varied contexts and avoid repeating the same theme in all word problems`;
}

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function clampInt(
  value: string | null,
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

function getMathConfig(request: Request): MathConfig {
  const url = new URL(request.url);
  return {
    addSubMax: clampInt(
      url.searchParams.get("addSubMax"),
      20,
      999,
      DEFAULT_MATH_CONFIG.addSubMax,
    ),
    timesMax: clampInt(
      url.searchParams.get("timesMax"),
      2,
      12,
      DEFAULT_MATH_CONFIG.timesMax,
    ),
  };
}

function addProblem(max: number): string {
  const a = rand(0, max);
  const b = rand(0, max - a);
  return `${a} + ${b}`;
}

function subtractionProblem(max: number): string {
  const a = rand(1, max);
  const b = rand(0, a);
  return `${a} - ${b}`;
}

function multiplicationProblem(max: number): string {
  const a = rand(2, 12);
  const b = rand(2, max);
  return Math.random() < 0.5 ? `${a} x ${b}` : `${b} x ${a}`;
}

function divisionProblem(max: number): string {
  const divisor = rand(2, max);
  const quotient = rand(2, 12);
  return `${divisor * quotient} / ${divisor}`;
}

function buildFallback(config: MathConfig): MathResponse {
  const additionSubtraction = Array.from({ length: 10 }, (_, index) => {
    return index < 5
      ? addProblem(config.addSubMax)
      : subtractionProblem(config.addSubMax);
  });

  const multiplication = Array.from({ length: 8 }, () =>
    multiplicationProblem(config.timesMax),
  );

  const division = Array.from({ length: 8 }, () =>
    divisionProblem(config.timesMax),
  );

  const geometry = [
    `A rectangle is ${rand(4, 11)} units by ${rand(4, 11)} units. What is its area?`,
    `A rectangle is ${rand(6, 13)} m long and ${rand(3, 9)} m wide. What is its perimeter?`,
    `A square has a perimeter of ${rand(5, 14) * 4} units. What is one side length?`,
  ];

  const patterns = [
    (() => {
      const start = rand(8, 24);
      const step = rand(3, 8);
      const seq = [0, 1, 2, 3, 4].map((i) => start + step * i);
      return `What comes next: ${seq.join(", ")}, __`;
    })(),
    (() => {
      const start = rand(65, 95);
      const step = rand(4, 9);
      const seq = [0, 1, 2, 3].map((i) => start - step * i);
      return `Fill in the blank: ${seq[0]}, ${seq[1]}, __, ${seq[3]}, ${seq[3] - step}`;
    })(),
    (() => {
      const n = rand(3, 8);
      const seq = [n, n + 5, n + 4, n + 9, n + 8];
      return `Use +5, then -1, and repeat: ${seq.join(", ")}, __`;
    })(),
  ];

  const wordProblems = [
    (() => {
      const packs = rand(3, 6);
      const perPack = rand(6, 11);
      const given = rand(5, 14);
      return `Noah has ${packs} packs of stickers with ${perPack} stickers in each pack. He gives ${given} away. How many are left?`;
    })(),
    (() => {
      const rounds = rand(3, 6);
      const minutes = rand(10, 20);
      const breakMinutes = rand(3, 8);
      return `Training has ${rounds} rounds. Each round is ${minutes} minutes, with a ${breakMinutes}-minute break between rounds. How many minutes total?`;
    })(),
    (() => {
      const rows = rand(4, 8);
      const seats = rand(5, 9);
      const filled = rand(8, rows * seats - 3);
      return `A mini-bus has ${rows} rows with ${seats} seats each. ${filled} seats are filled. How many seats are empty?`;
    })(),
    (() => {
      const boxes = rand(3, 6);
      const each = rand(6, 12);
      const used = rand(8, 18);
      return `A class has ${boxes} boxes of pencils with ${each} pencils in each box. ${used} pencils were used. How many pencils remain?`;
    })(),
  ];

  return {
    additionSubtraction,
    multiplication,
    division,
    geometry,
    patterns,
    wordProblems,
  };
}

function isValidAddSub(value: string, config: MathConfig): boolean {
  const match = value.match(/^\s*(\d+)\s*([+-])\s*(\d+)\s*$/);
  if (!match) {
    return false;
  }

  const left = Number.parseInt(match[1], 10);
  const operator = match[2];
  const right = Number.parseInt(match[3], 10);

  if (left > config.addSubMax || right > config.addSubMax) {
    return false;
  }

  const result = operator === "+" ? left + right : left - right;
  return result >= 0 && result <= config.addSubMax;
}

function isValidMultiplication(value: string, config: MathConfig): boolean {
  const match = value.match(/^\s*(\d+)\s*x\s*(\d+)\s*$/i);
  if (!match) {
    return false;
  }

  const left = Number.parseInt(match[1], 10);
  const right = Number.parseInt(match[2], 10);
  return Math.min(left, right) <= config.timesMax;
}

function isValidDivision(value: string, config: MathConfig): boolean {
  const match = value.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
  if (!match) {
    return false;
  }

  const dividend = Number.parseInt(match[1], 10);
  const divisor = Number.parseInt(match[2], 10);

  if (divisor < 1 || divisor > config.timesMax) {
    return false;
  }

  return dividend % divisor === 0;
}

function normalizeList(
  list: unknown,
  count: number,
  fallbackList: string[],
  isValid?: (value: string) => boolean,
): string[] {
  if (!Array.isArray(list) || list.length < count) {
    return fallbackList.slice(0, count);
  }

  return list.slice(0, count).map((item, index) => {
    const fallbackItem = fallbackList[index] || "";
    if (typeof item !== "string") {
      return fallbackItem;
    }
    const value = item.trim();
    if (!value) {
      return fallbackItem;
    }
    return isValid && !isValid(value) ? fallbackItem : value;
  });
}

function normalizeMathData(
  data: Partial<MathResponse>,
  fallback: MathResponse,
  config: MathConfig,
): MathResponse {
  return {
    additionSubtraction: normalizeList(
      data.additionSubtraction,
      10,
      fallback.additionSubtraction,
      (value) => isValidAddSub(value, config),
    ),
    multiplication: normalizeList(
      data.multiplication,
      8,
      fallback.multiplication,
      (value) => isValidMultiplication(value, config),
    ),
    division: normalizeList(data.division, 8, fallback.division, (value) =>
      isValidDivision(value, config),
    ),
    geometry: normalizeList(data.geometry, 3, fallback.geometry),
    patterns: normalizeList(data.patterns, 3, fallback.patterns),
    wordProblems: normalizeList(data.wordProblems, 4, fallback.wordProblems),
  };
}

export const GET: APIRoute = async ({ request }) => {
  const config = getMathConfig(request);
  const fallback = buildFallback(config);
  const data = await generateJSON<MathResponse>(buildPrompt(config), fallback);
  return jsonResponse(normalizeMathData(data, fallback, config));
};
