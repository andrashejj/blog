export const prerender = false;

import type { APIContext } from "astro";
import { generateJSON, jsonResponse } from "../../lib/gemini";
import {
  ACTIVITIES,
  BOAT_TRIP_USD_PER_PERSON,
  CAR_HIRE_USD_PER_DAY,
  type Lang,
  activityById,
  activityLines,
} from "../../lib/tamarin-activities";

interface PlanDay {
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  logistics: string;
}

interface PlanResponse {
  title: string;
  summary: string;
  days: PlanDay[];
  budget: string;
  watchOuts: string[];
}

const MAX_DAYS = 7;
const MAX_NOTE_LENGTH = 400;

function clampDays(value: unknown): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 4;
  return Math.min(MAX_DAYS, Math.max(1, n));
}

function pickLang(value: unknown): Lang {
  return value === "de" ? "de" : "en";
}

function cleanText(value: unknown, max = MAX_NOTE_LENGTH): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((id): id is string => typeof id === "string")
    .filter((id) => activityById(id) !== undefined)
    .slice(0, ACTIVITIES.length);
}

const FALLBACK_ROTATION = [
  {
    ids: ["dolphins", "le-morne-beach", "the-post"],
    en: {
      title: "Dolphins, then a slow afternoon",
      morning: "Dolphin boat out of Tamarin. Pickup is around 6.30am.",
      afternoon: "Le Morne beach once you have dried off and eaten something.",
      evening: "Dinner at The Post, back in the village.",
      logistics:
        "The boat includes pickup. You only need the car for the beach.",
    },
    de: {
      title: "Delfine, danach ein ruhiger Nachmittag",
      morning: "Delfinboot ab Tamarin. Abholung gegen 6.30 Uhr.",
      afternoon:
        "Strand am Le Morne, sobald ihr trocken seid und gegessen habt.",
      evening: "Abendessen im The Post, zurück im Dorf.",
      logistics:
        "Beim Boot ist die Abholung dabei. Das Auto braucht ihr nur für den Strand.",
    },
  },
  {
    ids: ["casela", "kind-coffee"],
    en: {
      title: "Casela, all of it",
      morning: "Drive to Casela for opening. Zip lines and quads first.",
      afternoon: "Stay. The park is a full day if the kids are enjoying it.",
      evening: "Cook at home, or a late coffee at Kind Coffee.",
      logistics: "20 minutes each way. Car needed. Food is on site.",
    },
    de: {
      title: "Casela, und zwar ganz",
      morning: "Zur Öffnung nach Casela fahren. Zuerst Ziplines und Quads.",
      afternoon:
        "Bleiben. Der Park füllt einen ganzen Tag, wenn es den Kindern gefällt.",
      evening: "Zu Hause kochen, oder noch ein Kaffee im Kind Coffee.",
      logistics: "20 Minuten pro Richtung. Auto nötig. Essen gibt es vor Ort.",
    },
  },
  {
    ids: ["chamarel", "ebony-forest", "legend-hill"],
    en: {
      title: "Up to Chamarel",
      morning: "Ebony Forest guided walk. Book the slot the day before.",
      afternoon: "Seven Coloured Earths, the waterfall, the rum distillery.",
      evening: "Legend Hill for the view on the way back down.",
      logistics: "Car all day. Take water, the forest has little to buy.",
    },
    de: {
      title: "Hoch nach Chamarel",
      morning: "Geführter Rundgang im Ebony Forest. Termin am Vortag buchen.",
      afternoon: "Siebenfarbige Erde, Wasserfall, Rumdestillerie.",
      evening: "Auf dem Rückweg Legend Hill wegen der Aussicht.",
      logistics:
        "Den ganzen Tag Auto. Wasser mitnehmen, im Wald gibt es kaum etwas.",
    },
  },
  {
    ids: ["turtles", "emba-filao"],
    en: {
      title: "Turtles and a long brunch",
      morning: "Turtle snorkel trip. Pickup included, bring water.",
      afternoon: "Brunch at Emba Filao and nothing else.",
      evening: "Sunset from Tamarin bay.",
      logistics: "No car needed today.",
    },
    de: {
      title: "Schildkröten und langer Brunch",
      morning:
        "Schnorcheltour zu den Schildkröten. Abholung inklusive, Wasser mitnehmen.",
      afternoon: "Brunch im Emba Filao, sonst nichts.",
      evening: "Sonnenuntergang in der Bucht von Tamarin.",
      logistics: "Heute kein Auto nötig.",
    },
  },
  {
    ids: ["vallee-des-couleurs", "south-coast"],
    en: {
      title: "South, with zip lines",
      morning: "Drive to La Vallee des Couleurs. Book the rides on arrival.",
      afternoon: "Carry on to Gris Gris and La Roche qui Pleure.",
      evening: "Eat on the way home, the drive back is about an hour.",
      logistics: "Longest driving day of the trip. Fill up before you go.",
    },
    de: {
      title: "Süden, mit Ziplines",
      morning:
        "Fahrt zur Vallee des Couleurs. Aktivitäten bei der Ankunft buchen.",
      afternoon: "Weiter nach Gris Gris und La Roche qui Pleure.",
      evening: "Unterwegs essen, die Rückfahrt dauert etwa eine Stunde.",
      logistics: "Der längste Fahrtag. Vorher tanken.",
    },
  },
  {
    ids: ["le-morne-hike", "moustache"],
    en: {
      title: "Le Morne before the heat",
      morning:
        "At the trailhead by 7am. A guide takes you past the halfway point.",
      afternoon: "Swim at the public beach below, then sleep it off.",
      evening: "Dinner at Moustache.",
      logistics: "Car, 30 minutes. Two litres of water per person.",
    },
    de: {
      title: "Le Morne vor der Hitze",
      morning: "Um 7 Uhr am Einstieg. Ab der Hälfte geht es nur mit Guide.",
      afternoon: "Unten am öffentlichen Strand schwimmen, danach ausruhen.",
      evening: "Abendessen im Moustache.",
      logistics: "Auto, 30 Minuten. Zwei Liter Wasser pro Person.",
    },
  },
  {
    ids: ["tamarin-falls", "sketch"],
    en: {
      title: "Waterfalls",
      morning: "Guided hike to Tamarin Falls. Shoes that can get wet.",
      afternoon: "Back for a late lunch, then the pool or the beach.",
      evening: "Sketch, in the village.",
      logistics: "Car, 35 minutes. Pack lunch, there is nothing up there.",
    },
    de: {
      title: "Wasserfälle",
      morning:
        "Geführte Wanderung zu den Tamarin Falls. Schuhe, die nass werden dürfen.",
      afternoon: "Zurück zum späten Mittagessen, danach Pool oder Strand.",
      evening: "Sketch, im Dorf.",
      logistics: "Auto, 35 Minuten. Essen mitnehmen, oben gibt es nichts.",
    },
  },
];

function fallbackPlan(
  days: number,
  lang: Lang,
  mustDo: string[],
): PlanResponse {
  const rotation = [...FALLBACK_ROTATION].sort((a, b) => {
    const aHit = a.ids.some((id) => mustDo.includes(id)) ? -1 : 0;
    const bHit = b.ids.some((id) => mustDo.includes(id)) ? -1 : 0;
    return aHit - bHit;
  });

  const carCost = days * CAR_HIRE_USD_PER_DAY;

  return {
    title:
      lang === "de" ? `${days} Tage ab Tamarin` : `${days} days out of Tamarin`,
    summary:
      lang === "de"
        ? "Ein Standardplan aus der Liste unten. Ohne Live-Vorschläge, der Planer war gerade nicht erreichbar."
        : "A default plan built from the list below. The live planner was unreachable, so this is the standard rotation.",
    days: rotation.slice(0, days).map((entry, index) => ({
      title: `${lang === "de" ? "Tag" : "Day"} ${index + 1}: ${entry[lang].title}`,
      morning: entry[lang].morning,
      afternoon: entry[lang].afternoon,
      evening: entry[lang].evening,
      logistics: entry[lang].logistics,
    })),
    budget:
      lang === "de"
        ? `Mietwagen etwa ${carCost} Dollar für ${days} Tage, Bootstouren etwa ${BOAT_TRIP_USD_PER_PERSON} Dollar pro Person und Fahrt.`
        : `Car hire around $${carCost} for ${days} days, boat trips around $${BOAT_TRIP_USD_PER_PERSON} per person per trip.`,
    watchOuts:
      lang === "de"
        ? [
            "Bootstouren starten früh, meist zwischen 6.30 und 8 Uhr.",
            "Wale nur etwa Juli bis Oktober.",
          ]
        : [
            "Boat trips start early, usually between 6.30 and 8am.",
            "Whales are only around from roughly July to October.",
          ],
  };
}

function coerceDay(raw: unknown, index: number, lang: Lang): PlanDay {
  const day = (raw ?? {}) as Record<string, unknown>;
  const fallbackTitle = `${lang === "de" ? "Tag" : "Day"} ${index + 1}`;
  return {
    title: cleanText(day.title, 120) || fallbackTitle,
    morning: cleanText(day.morning),
    afternoon: cleanText(day.afternoon),
    evening: cleanText(day.evening),
    logistics: cleanText(day.logistics),
  };
}

export const POST = async ({ request }: APIContext): Promise<Response> => {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const days = clampDays(body.days);
  const lang = pickLang(body.lang);
  const party = cleanText(body.party, 80);
  const pace = cleanText(body.pace, 80);
  const notes = cleanText(body.notes);
  const mustDo = cleanIds(body.mustDo);

  const mustDoNames = mustDo
    .map((id) => activityById(id)?.name)
    .filter(Boolean)
    .join(", ");

  const prompt = `You are planning ${days} days for someone staying in Tamarin on the west coast of Mauritius.

Only use activities from this list. Each line is: id | name | category | time | transport | food | notes.
${activityLines(lang)}

Facts to respect:
- A hire car costs about ${CAR_HIRE_USD_PER_DAY} US dollars a day.
- Guided boat trips cost about ${BOAT_TRIP_USD_PER_PERSON} US dollars per person and leave early, usually between 6.30 and 8am.
- Whale watching only runs from roughly July to October.
- Anything marked as needing a car cannot be reached without one.

Group: ${party || "not specified"}.
Pace: ${pace || "not specified"}.
Must include: ${mustDoNames || "nothing in particular"}.
Extra notes from the traveller: ${notes || "none"}.

Rules:
- One long drive per day at most. Do not stack two full-day trips back to back.
- Put early boat trips on days that end near Tamarin.
- Suggest a restaurant from the list for the evening where it fits.
- Name times and driving minutes. No adjectives, no selling, no filler.
- Write in ${lang === "de" ? "German, using the informal du and ihr forms" : "English"}.
- One sentence per field, 20 words maximum. Day titles are three words maximum.
- At most three watchOuts, one line each.

Return only JSON in this shape:
{"title":"string","summary":"string","days":[{"title":"Day 1: short name","morning":"string","afternoon":"string","evening":"string","logistics":"string"}],"budget":"string","watchOuts":["string"]}
The days array must have exactly ${days} entries.`;

  const fallback = fallbackPlan(days, lang, mustDo);
  const raw = await generateJSON<PlanResponse>(prompt, fallback, {
    model: "gemini-flash-latest",
    temperature: 0.9,
    timeoutMs: 25_000,
  });

  const rawDays = Array.isArray(raw?.days) ? raw.days : [];
  const planDays = rawDays
    .slice(0, days)
    .map((day, index) => coerceDay(day, index, lang));

  while (planDays.length < days) {
    const filler = fallback.days[planDays.length % fallback.days.length];
    planDays.push({
      ...filler,
      title: filler?.title ?? `Day ${planDays.length + 1}`,
    });
  }

  const data: PlanResponse = {
    title: cleanText(raw?.title, 120) || fallback.title,
    summary: cleanText(raw?.summary) || fallback.summary,
    days: planDays,
    budget: cleanText(raw?.budget) || fallback.budget,
    watchOuts: Array.isArray(raw?.watchOuts)
      ? raw.watchOuts
          .map((w) => cleanText(w, 200))
          .filter(Boolean)
          .slice(0, 4)
      : fallback.watchOuts,
  };

  return jsonResponse(data);
};
