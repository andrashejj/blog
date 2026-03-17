import {
  buildMathUrl,
  clampInt,
  createMathFallback,
  fallbackChallengeCards,
  defaultMathConfig,
  fallbackPhysical,
  fallbackSketches,
  fallbackWords,
  normalizeChallengeCardsData,
  normalizeMathData,
  normalizePhysicalData,
  normalizeSketchesData,
  normalizeWordsData,
  type ChallengesData,
  type MathConfig,
  type MathData,
  type PhysicalData,
  type SketchesData,
  type WordsData,
} from "./noah-worksheet";

const answerLine =
  '<div class="flex-grow border-b-2 border-dotted border-slate-300 h-6"></div>';
const answerBlank = '<div class="w-40 border-b-2 border-slate-400"></div>';

function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function mathRow(expression: string): string {
  return `<div class="flex gap-4 items-center print:gap-1">&bull; <span>${esc(expression)} = </span>${answerLine}</div>`;
}

function textQuestion(question: string): string {
  return `
    <div class="text-xl font-sans font-medium text-slate-700 print:text-sm">${esc(question)}</div>
    <div class="mt-2 text-xl font-medium text-slate-400 flex items-end gap-2 font-sans print:text-xs print:mt-1">Answer: ${answerBlank}</div>
  `;
}

async function fetchJSON<T>(url: string, timeoutMs = 10_000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

function withLoading(
  button: HTMLButtonElement,
  containerId: string,
  action: () => Promise<void>,
  extraDisabled: Array<HTMLInputElement | HTMLButtonElement> = [],
): () => Promise<void> {
  return async () => {
    const container = document.getElementById(containerId);
    const originalHtml = button.innerHTML;

    button.disabled = true;
    extraDisabled.forEach((element) => {
      element.disabled = true;
    });
    button.innerHTML =
      '<span class="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> Loading...';
    container?.classList.add("opacity-50", "pointer-events-none");

    try {
      await action();
    } finally {
      button.disabled = false;
      extraDisabled.forEach((element) => {
        element.disabled = false;
      });
      button.innerHTML = originalHtml;
      container?.classList.remove("opacity-50", "pointer-events-none");
    }
  };
}

function renderPhysical(data: PhysicalData): string {
  return data.exercises
    .map(
      (exercise) => `
        <div class="border-2 border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-50 transition-colors print:p-1.5 print:break-inside-avoid print:border">
          <div>
            <div class="text-xl font-medium font-sans text-slate-700 print:text-sm">${esc(exercise.name)}</div>
            <div class="text-sm text-slate-500 font-medium print:text-[10px]">${esc(exercise.hint)}</div>
          </div>
          <div class="text-lg font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md print:text-xs print:px-1.5 print:py-0.5">${esc(exercise.rep)}</div>
        </div>
      `,
    )
    .join("");
}

function renderBorderedTextBlocks(
  title: string,
  rows: string,
  rowClassName = "space-y-4 text-xl font-medium font-sans print:space-y-1 print:text-sm",
): string {
  return `
    <div class="border-2 border-dashed border-slate-300 rounded-xl p-5 bg-white print:p-2 print:break-inside-avoid">
      <div class="text-lg font-semibold text-slate-700 border-b-2 border-slate-100 pb-2 mb-4 font-sans print:text-[13px] print:mb-1 print:pb-1">${title}</div>
      <div class="${rowClassName}">
        ${rows}
      </div>
    </div>
  `;
}

function renderMathQuestions(questions: string[]): string {
  return questions
    .map((question, index) => {
      const block = textQuestion(question);
      return index === 0
        ? block
        : `<div class="border-t border-slate-100 pt-3 print:pt-1">${block}</div>`;
    })
    .join("");
}

function renderWordProblems(wordProblems: string[]): string {
  return wordProblems
    .map(
      (question, index) => `
        <div ${index === 0 ? "" : 'class="border-t border-slate-100 pt-4 print:pt-1"'}>
          <div class="text-xl font-sans font-medium text-slate-700 print:text-sm">${index + 1}. ${esc(question)}</div>
          <div class="mt-2 text-xl font-medium text-slate-400 flex items-end gap-2 font-sans print:text-xs print:mt-1">Answer: ${answerBlank}</div>
        </div>
      `,
    )
    .join("");
}

function renderMath(data: MathData): string {
  return [
    renderBorderedTextBlocks(
      "Addition &amp; Subtraction",
      data.additionSubtraction.map((problem) => mathRow(problem)).join(""),
    ),
    renderBorderedTextBlocks(
      "Multiplication",
      data.multiplication.map((problem) => mathRow(problem)).join(""),
    ),
    renderBorderedTextBlocks(
      "Division",
      data.division.map((problem) => mathRow(problem)).join(""),
    ),
    renderBorderedTextBlocks(
      "Geometry",
      renderMathQuestions(data.geometry),
      "space-y-4 print:space-y-1",
    ),
    renderBorderedTextBlocks(
      "Number Patterns",
      renderMathQuestions(data.patterns),
      "space-y-4 print:space-y-1",
    ),
    renderBorderedTextBlocks(
      "Word Problems (Grade 3-4)",
      renderWordProblems(data.wordProblems),
      "space-y-5 print:space-y-1",
    ),
  ].join("");
}

function renderChallenges(data: ChallengesData): string {
  return `
    <div class="border-2 border-slate-300 rounded-xl bg-orange-50/50 p-5 flex flex-col justify-between print:p-2 print:break-inside-avoid">
      <div>
        <div class="text-sm font-semibold text-orange-800 uppercase tracking-widest mb-2 border-b-2 border-orange-200 pb-1 print:text-[10px] print:mb-1">Daily Riddle</div>
        <p class="text-xl font-medium text-slate-700 leading-tight font-sans print:text-sm">${esc(data.riddle)}</p>
      </div>
      <div class="mt-6 text-lg font-medium text-slate-400 flex items-end gap-2 font-sans print:mt-1 print:text-xs">Answer: ${answerBlank}</div>
    </div>
    <div class="border-2 border-slate-300 rounded-xl bg-amber-50/50 p-5 flex flex-col justify-between print:p-2 print:break-inside-avoid">
      <div>
        <div class="text-sm font-semibold text-amber-800 uppercase tracking-widest mb-2 border-b-2 border-amber-200 pb-1 print:text-[10px] print:mb-1">Word Puzzle (Anagram)</div>
        <p class="text-xl font-medium text-slate-700 leading-tight font-sans print:text-sm">
          Unscramble this word: <strong class="tracking-widest uppercase text-amber-700">${esc(data.anagram.scrambled)}</strong> (Hint: ${esc(data.anagram.hint)})
        </p>
      </div>
      <div class="mt-6 text-lg font-medium text-slate-400 flex items-end gap-2 font-sans print:mt-1 print:text-xs">Answer: ${answerBlank}</div>
    </div>
    <div class="border-2 border-slate-300 rounded-xl bg-red-50/50 p-5 flex flex-col print:p-2 print:break-inside-avoid">
      <div class="text-sm font-semibold text-red-800 uppercase tracking-widest mb-2 border-b-2 border-red-200 pb-1 print:text-[10px] print:mb-1">Mini-Engineering</div>
      <p class="text-xl font-medium text-slate-700 leading-tight font-sans print:text-sm">${esc(data.engineering)}</p>
      <div class="mt-4 flex flex-col gap-2 print:mt-1">
        <div class="flex items-end gap-2 text-lg font-medium text-slate-400 font-sans print:text-xs">Height: <div class="w-24 border-b-2 border-slate-400"></div> cm</div>
        <div class="flex items-end gap-2 text-lg font-medium text-slate-400 mt-2 font-sans print:text-xs print:mt-0.5">Did it fall over? <div class="w-24 border-b-2 border-slate-400"></div></div>
      </div>
    </div>
    <div class="border-2 border-slate-300 rounded-xl bg-teal-50/50 p-5 flex flex-col print:p-2 print:break-inside-avoid">
      <div class="text-sm font-semibold text-teal-800 uppercase tracking-widest mb-2 border-b-2 border-teal-200 pb-1 print:text-[10px] print:mb-1">Observation / Mindfulness</div>
      <p class="text-xl font-medium text-slate-700 leading-tight font-sans print:text-sm">${esc(data.mindfulness)}</p>
      <div class="mt-4 flex flex-col gap-3 print:mt-1 print:gap-1">
        <div class="flex items-end gap-2 text-lg font-medium text-slate-400 font-sans print:text-xs">1. <div class="flex-grow border-b-2 border-slate-400"></div></div>
        <div class="flex items-end gap-2 text-lg font-medium text-slate-400 font-sans print:text-xs">2. <div class="flex-grow border-b-2 border-slate-400"></div></div>
        <div class="flex items-end gap-2 text-lg font-medium text-slate-400 font-sans print:text-xs">3. <div class="flex-grow border-b-2 border-slate-400"></div></div>
      </div>
    </div>
  `;
}

function renderSketches(data: SketchesData): string {
  const boxClassName =
    "border-2 border-blue-400 rounded-lg bg-blue-50/10 h-128 relative overflow-hidden flex flex-col print:h-[calc(50vh-20px)]";
  const headerClassName =
    "bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 uppercase tracking-wider border-b-2 border-blue-200 print:text-xs";

  return `
    <div class="grid grid-cols-1 gap-6 print:gap-2">
      ${data.exercises
        .map((exercise, index) => {
          const cardClassName =
            index % 2 === 0
              ? `${boxClassName} print:break-before-page`
              : boxClassName;

          return `<div class="${cardClassName}"><div class="${headerClassName}">${index + 1}. ${esc(exercise)}</div></div>`;
        })
        .join("")}
    </div>
  `;
}

function renderWords(words: string[]): string {
  return words
    .map(
      (word) =>
        `<span class="inline-block bg-white border-2 border-indigo-200 text-indigo-900 px-3 py-1 rounded-md text-lg font-medium shadow-sm font-sans print:text-sm print:px-1.5 print:py-0.5 print:border">${esc(word)}</span>`,
    )
    .join("");
}

function readMathConfig(): MathConfig {
  const addSubInput = document.getElementById(
    "math-add-sub-max",
  ) as HTMLInputElement | null;
  const timesInput = document.getElementById(
    "math-times-max",
  ) as HTMLInputElement | null;

  return {
    addSubMax: clampInt(
      addSubInput?.value,
      20,
      999,
      defaultMathConfig.addSubMax,
    ),
    timesMax: clampInt(timesInput?.value, 2, 12, defaultMathConfig.timesMax),
  };
}

function syncMathConfigInputs(): MathConfig {
  const config = readMathConfig();
  const addSubInput = document.getElementById(
    "math-add-sub-max",
  ) as HTMLInputElement | null;
  const timesInput = document.getElementById(
    "math-times-max",
  ) as HTMLInputElement | null;

  if (addSubInput) {
    addSubInput.value = String(config.addSubMax);
  }
  if (timesInput) {
    timesInput.value = String(config.timesMax);
  }

  return config;
}

function setHtml(id: string, html: string): void {
  const container = document.getElementById(id);
  if (container) {
    container.innerHTML = html;
  }
}

async function loadPhysical(): Promise<void> {
  try {
    const data = await fetchJSON<PhysicalData>("/api/generate-physical-exercises");
    setHtml("section-physical", renderPhysical(normalizePhysicalData(data)));
  } catch {
    setHtml("section-physical", renderPhysical(normalizePhysicalData(fallbackPhysical)));
  }
}

async function loadMath(): Promise<void> {
  const config = syncMathConfigInputs();

  try {
    const data = await fetchJSON<MathData>(buildMathUrl(config), 12_000);
    setHtml("section-math", renderMath(normalizeMathData(data, config)));
  } catch {
    setHtml("section-math", renderMath(createMathFallback(config)));
  }
}

async function loadChallenges(): Promise<void> {
  try {
    const data = await fetchJSON<ChallengesData>("/api/generate-challenges");
    setHtml(
      "section-challenges",
      renderChallenges(normalizeChallengeCardsData(data)),
    );
  } catch {
    setHtml(
      "section-challenges",
      renderChallenges(normalizeChallengeCardsData(fallbackChallengeCards)),
    );
  }
}

async function loadSketches(): Promise<void> {
  try {
    const data = await fetchJSON<SketchesData>("/api/generate-sketches");
    setHtml("section-sketches", renderSketches(normalizeSketchesData(data)));
  } catch {
    setHtml("section-sketches", renderSketches(normalizeSketchesData(fallbackSketches)));
  }
}

async function loadWords(): Promise<void> {
  let normalized: WordsData;

  try {
    const data = await fetchJSON<WordsData>("/api/generate-words");
    normalized = normalizeWordsData(data);
  } catch {
    normalized = normalizeWordsData(fallbackWords);
  }

  setHtml("word-bank-container", renderWords(normalized.words));

  const storyHook = document.getElementById("story-hook-container");
  if (storyHook) {
    storyHook.textContent = `${normalized.hook} `;
  }
}

function hasLoadingSkeleton(container: HTMLElement | null): boolean {
  if (!container) {
    return true;
  }

  return Boolean(container.querySelector(".loading-skeleton, .animate-pulse"));
}

function hasStoryHookContent(): boolean {
  const storyHook = document.getElementById("story-hook-container");
  return Boolean(storyHook?.textContent?.trim());
}

function initPrintButton(): void {
  const printButton = document.getElementById("print-btn");
  if (!(printButton instanceof HTMLElement)) {
    return;
  }

  printButton.addEventListener("click", () => {
    const header = document.querySelector("body > div > header") as HTMLElement | null;
    const footer = document.querySelector("body > div > footer") as HTMLElement | null;
    const main = document.querySelector("body > div > main") as HTMLElement | null;
    const proseElements = document.querySelectorAll<HTMLElement>(
      ".prose > *:not(.worksheet-container)",
    );

    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    if (main) {
      main.style.width = "100%";
      main.style.maxWidth = "100%";
      main.style.padding = "0";
      main.style.margin = "0";
    }
    proseElements.forEach((element) => {
      element.style.display = "none";
    });
    document.body.style.background = "white";

    let restored = false;
    const restoreLayout = () => {
      if (restored) {
        return;
      }

      restored = true;
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
      if (main) {
        main.style.width = "";
        main.style.maxWidth = "";
        main.style.padding = "";
        main.style.margin = "";
      }
      proseElements.forEach((element) => {
        element.style.display = "";
      });
      document.body.style.background = "";
    };

    window.addEventListener("afterprint", restoreLayout, { once: true });
    window.print();
    if (!("onafterprint" in window)) {
      setTimeout(restoreLayout, 1200);
    }
  });
}

export function initNoahWorksheet(): void {
  const physicalButton = document.getElementById(
    "regen-physical-btn",
  ) as HTMLButtonElement | null;
  const mathButton = document.getElementById(
    "regen-math-btn",
  ) as HTMLButtonElement | null;
  const challengesButton = document.getElementById(
    "regen-challenges-btn",
  ) as HTMLButtonElement | null;
  const sketchButton = document.getElementById(
    "regen-sketch-btn",
  ) as HTMLButtonElement | null;
  const wordsButton = document.getElementById(
    "regen-words-btn",
  ) as HTMLButtonElement | null;
  const mathAddSubInput = document.getElementById(
    "math-add-sub-max",
  ) as HTMLInputElement | null;
  const mathTimesInput = document.getElementById(
    "math-times-max",
  ) as HTMLInputElement | null;
  const mathInputs = [mathAddSubInput, mathTimesInput].filter(
    Boolean,
  ) as HTMLInputElement[];

  if (physicalButton) {
    physicalButton.addEventListener(
      "click",
      withLoading(physicalButton, "section-physical", loadPhysical),
    );
  }

  if (mathButton) {
    const reloadMath = withLoading(mathButton, "section-math", loadMath, mathInputs);
    syncMathConfigInputs();
    mathButton.addEventListener("click", reloadMath);
    mathInputs.forEach((input) => {
      input.addEventListener("change", reloadMath);
      input.addEventListener("blur", syncMathConfigInputs);
    });
  }

  if (challengesButton) {
    challengesButton.addEventListener(
      "click",
      withLoading(challengesButton, "section-challenges", loadChallenges),
    );
  }

  if (sketchButton) {
    sketchButton.addEventListener(
      "click",
      withLoading(sketchButton, "section-sketches", loadSketches),
    );
  }

  if (wordsButton) {
    wordsButton.addEventListener(
      "click",
      withLoading(wordsButton, "word-bank-container", loadWords),
    );
  }

  const buttons = [
    physicalButton,
    mathButton,
    challengesButton,
    sketchButton,
    wordsButton,
  ].filter(Boolean) as HTMLButtonElement[];

  const loads: Promise<void>[] = [];

  if (hasLoadingSkeleton(document.getElementById("section-physical"))) {
    loads.push(loadPhysical());
  }
  if (hasLoadingSkeleton(document.getElementById("section-math"))) {
    loads.push(loadMath());
  }
  if (hasLoadingSkeleton(document.getElementById("section-challenges"))) {
    loads.push(loadChallenges());
  }
  if (hasLoadingSkeleton(document.getElementById("section-sketches"))) {
    loads.push(loadSketches());
  }
  if (
    hasLoadingSkeleton(document.getElementById("word-bank-container")) ||
    !hasStoryHookContent()
  ) {
    loads.push(loadWords());
  }

  if (loads.length > 0) {
    buttons.forEach((button) => {
      button.disabled = true;
    });
    Promise.allSettled(loads).then(() => {
      buttons.forEach((button) => {
        button.disabled = false;
      });
    });
  }

  initPrintButton();
}
