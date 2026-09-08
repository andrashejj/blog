export type ActivityCategory = "land" | "water" | "air" | "food";

export type Lang = "en" | "de";

export interface Bilingual {
  en: string;
  de: string;
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  /** typical hours door to door, used by the duration filter */
  hours: number;
  /** true when you cannot reasonably do it without your own car */
  needsCar: boolean;
  /** free-text place lookup, accurate enough for a maps search */
  mapQuery: string;
  duration: Bilingual;
  transport: Bilingual;
  food: Bilingual;
  notes: Bilingual;
}

export const CAR_HIRE_USD_PER_DAY = 25;
export const BOAT_TRIP_USD_PER_PERSON = 100;

export const ACTIVITIES: Activity[] = [
  {
    id: "casela",
    name: "Casela World of Adventures",
    category: "land",
    hours: 7,
    needsCar: true,
    mapQuery: "Casela Nature Park, Mauritius",
    duration: { en: "6-7 hours", de: "6-7 Stunden" },
    transport: { en: "Car, 20 minutes", de: "Auto, 20 Minuten" },
    food: { en: "Restaurants on site", de: "Restaurants vor Ort" },
    notes: {
      en: "Zip lines, quads, big cats, giant tortoises. Enough there to fill a whole day with kids.",
      de: "Ziplines, Quads, Raubkatzen, Riesenschildkröten. Genug für einen ganzen Tag mit Kindern.",
    },
  },
  {
    id: "tamarin-falls",
    name: "Tamarin Falls (Seven Cascades)",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Tamarin Falls Seven Cascades, Mauritius",
    duration: { en: "4-5 hours", de: "4-5 Stunden" },
    transport: { en: "Car, 35 minutes", de: "Auto, 35 Minuten" },
    food: { en: "Bring your own", de: "Selbst mitbringen" },
    notes: {
      en: "Guided hike, beautiful, not too intense. Wear shoes that can get wet.",
      de: "Geführte Wanderung, sehr schön, gut machbar. Schuhe, die nass werden dürfen.",
    },
  },
  {
    id: "ebony-forest",
    name: "Ebony Forest, Chamarel",
    category: "land",
    hours: 8,
    needsCar: true,
    mapQuery: "Ebony Forest Chamarel, Mauritius",
    duration: { en: "Full day", de: "Ganzer Tag" },
    transport: {
      en: "Car, or join an organised tour",
      de: "Auto oder organisierte Tour",
    },
    food: {
      en: "Limited, bring your own",
      de: "Kaum etwas, selbst mitbringen",
    },
    notes: {
      en: "Book the guided walk. Only count on food if the tour includes it.",
      de: "Geführten Rundgang buchen. Essen nur, wenn die Tour es einschließt.",
    },
  },
  {
    id: "chamarel",
    name: "Chamarel village loop",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Seven Coloured Earths Chamarel, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: { en: "Car, 35 minutes", de: "Auto, 35 Minuten" },
    food: { en: "Restaurants in the village", de: "Restaurants im Dorf" },
    notes: {
      en: "Seven Coloured Earths, the waterfall, the rum distillery. Pairs well with Ebony Forest.",
      de: "Siebenfarbige Erde, Wasserfall, Rumdestillerie. Passt gut zum Ebony Forest.",
    },
  },
  {
    id: "le-morne-hike",
    name: "Le Morne Brabant hike",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Le Morne Brabant, Mauritius",
    duration: { en: "4-5 hours", de: "4-5 Stunden" },
    transport: { en: "Car, 30 minutes", de: "Auto, 30 Minuten" },
    food: { en: "Bring your own", de: "Selbst mitbringen" },
    notes: {
      en: "Start at 7am, before the heat. The upper section needs a guide.",
      de: "Um 7 Uhr starten, bevor es heiß wird. Der obere Teil nur mit Guide.",
    },
  },
  {
    id: "le-morne-beach",
    name: "Le Morne beach and lagoon",
    category: "water",
    hours: 4,
    needsCar: true,
    mapQuery: "Le Morne Public Beach, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: { en: "Car, 25 minutes", de: "Auto, 25 Minuten" },
    food: {
      en: "Kiosks and hotels nearby",
      de: "Kioske und Hotels in der Nähe",
    },
    notes: {
      en: "Flat water inside, kitesurfers outside. The easiest beach day from here.",
      de: "Innen flaches Wasser, außen die Kitesurfer. Der einfachste Strandtag von hier.",
    },
  },
  {
    id: "black-river-gorges",
    name: "Black River Gorges",
    category: "land",
    hours: 6,
    needsCar: true,
    mapQuery: "Black River Gorges National Park, Mauritius",
    duration: { en: "Half to full day", de: "Halber bis ganzer Tag" },
    transport: {
      en: "Car, 25 minutes to the viewpoint",
      de: "Auto, 25 Minuten bis zum Aussichtspunkt",
    },
    food: { en: "Bring your own", de: "Selbst mitbringen" },
    notes: {
      en: "Viewpoints for a short visit, the Macchabee trail for a real hike.",
      de: "Aussichtspunkte für den kurzen Besuch, der Macchabee-Trail für eine richtige Wanderung.",
    },
  },
  {
    id: "vallee-des-couleurs",
    name: "La Vallee des Couleurs",
    category: "land",
    hours: 7,
    needsCar: true,
    mapQuery: "La Vallee des Couleurs Nature Park, Mauritius",
    duration: { en: "5-7 hours", de: "5-7 Stunden" },
    transport: { en: "Car, 1 hour", de: "Auto, 1 Stunde" },
    food: { en: "Restaurant on site", de: "Restaurant vor Ort" },
    notes: {
      en: "Zip lines, quads, waterfalls, coloured earth. Works for every age group. Book the rides on arrival, they sell out.",
      de: "Ziplines, Quads, Wasserfälle, farbige Erde. Für jede Altersgruppe. Aktivitäten gleich bei der Ankunft buchen, sie sind schnell voll.",
    },
  },
  {
    id: "south-coast",
    name: "South coast scenic drive",
    category: "land",
    hours: 8,
    needsCar: true,
    mapQuery: "Gris Gris Souillac, Mauritius",
    duration: { en: "Full day", de: "Ganzer Tag" },
    transport: { en: "Car", de: "Auto" },
    food: {
      en: "Restaurant stops the whole way",
      de: "Restaurants auf der ganzen Strecke",
    },
    notes: {
      en: "Gris Gris, La Roche qui Pleure, Rochester Falls. No serious walking.",
      de: "Gris Gris, La Roche qui Pleure, Rochester Falls. Kein ernsthaftes Wandern.",
    },
  },
  {
    id: "ile-aux-cerfs",
    name: "Ile aux Cerfs",
    category: "water",
    hours: 10,
    needsCar: true,
    mapQuery: "Ile aux Cerfs, Mauritius",
    duration: { en: "Full day", de: "Ganzer Tag" },
    transport: {
      en: "Car plus boat, or an organised tour",
      de: "Auto plus Boot oder organisierte Tour",
    },
    food: {
      en: "On the island, or lunch on the catamaran",
      de: "Auf der Insel oder Mittagessen auf dem Katamaran",
    },
    notes: {
      en: "East coast, an hour and fifteen each way. Long day. Book the boat ahead.",
      de: "Ostküste, eine Stunde fünfzehn pro Richtung. Langer Tag. Boot vorher buchen.",
    },
  },
  {
    id: "port-louis",
    name: "Port Louis",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Central Market Port Louis, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: { en: "Car, 40 minutes", de: "Auto, 40 Minuten" },
    food: {
      en: "Central Market and the Caudan waterfront",
      de: "Zentralmarkt und Caudan Waterfront",
    },
    notes: {
      en: "Weekday morning. Avoid the rush hours in both directions.",
      de: "Wochentags vormittags. Stoßzeiten in beide Richtungen meiden.",
    },
  },
  {
    id: "turtles",
    name: "Swimming with turtles",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Le Morne Public Beach, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: {
      en: "Guided boat, pickup included",
      de: "Geführtes Boot, Abholung inklusive",
    },
    food: { en: "Bring snacks and water", de: "Snacks und Wasser mitbringen" },
    notes: {
      en: "Around $100 per person. Don't touch them and don't chase them.",
      de: "Etwa 100 Dollar pro Person. Nicht anfassen, nicht hinterherschwimmen.",
    },
  },
  {
    id: "snorkelling",
    name: "Snorkelling",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Black River Riviere Noire, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: {
      en: "Guided boat, pickup included",
      de: "Geführtes Boot, Abholung inklusive",
    },
    food: { en: "Snacks and water", de: "Snacks und Wasser" },
    notes: {
      en: "Around $100 per person.",
      de: "Etwa 100 Dollar pro Person.",
    },
  },
  {
    id: "diving",
    name: "Diving",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Black River Riviere Noire, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: {
      en: "Guided, pickup included",
      de: "Geführt, Abholung inklusive",
    },
    food: { en: "Snacks and water", de: "Snacks und Wasser" },
    notes: {
      en: "Around $100 per person. The west coast sites are 10 to 20 minutes out of Black River.",
      de: "Etwa 100 Dollar pro Person. Die Spots vor der Westküste liegen 10 bis 20 Minuten vor Black River.",
    },
  },
  {
    id: "dolphins",
    name: "Dolphin watching",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Tamarin Bay, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: {
      en: "Guided boat from Tamarin or Black River",
      de: "Geführtes Boot ab Tamarin oder Black River",
    },
    food: { en: "Snacks and water", de: "Snacks und Wasser" },
    notes: {
      en: "Leaves around 7am. Around $100 per person. Pick an operator that keeps its distance.",
      de: "Abfahrt gegen 7 Uhr. Etwa 100 Dollar pro Person. Anbieter wählen, der Abstand hält.",
    },
  },
  {
    id: "whales",
    name: "Whale watching",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Tamarin Bay, Mauritius",
    duration: { en: "Half day", de: "Halber Tag" },
    transport: { en: "Guided boat", de: "Geführtes Boot" },
    food: { en: "Snacks and water", de: "Snacks und Wasser" },
    notes: {
      en: "Seasonal, roughly July to October. Same operators as the dolphins.",
      de: "Saison etwa Juli bis Oktober. Dieselben Anbieter wie bei den Delfinen.",
    },
  },
  {
    id: "paragliding",
    name: "Tandem paragliding",
    category: "air",
    hours: 3,
    needsCar: false,
    mapQuery: "Chamarel, Mauritius",
    duration: { en: "Half morning", de: "Halber Vormittag" },
    transport: {
      en: "Guided, pickup usually included",
      de: "Geführt, Abholung meist inklusive",
    },
    food: { en: "Eat afterwards", de: "Danach essen" },
    notes: {
      en: "Around 15 minutes in the air. Morning slots, and the wind decides. Ask the price when you book.",
      de: "Etwa 15 Minuten in der Luft. Vormittagstermine, der Wind entscheidet. Preis beim Buchen erfragen.",
    },
  },
  {
    id: "the-post",
    name: "The Post",
    category: "food",
    hours: 2,
    needsCar: false,
    mapQuery: "The Post restaurant, Tamarin, Mauritius",
    duration: { en: "1-2 hours", de: "1-2 Stunden" },
    transport: { en: "Walk from the village", de: "Zu Fuß vom Dorf" },
    food: { en: "Dinner", de: "Abendessen" },
    notes: {
      en: "Book at the weekend.",
      de: "Am Wochenende reservieren.",
    },
  },
  {
    id: "legend-hill",
    name: "Legend Hill",
    category: "food",
    hours: 3,
    needsCar: true,
    mapQuery: "Legend Hill Residences & Spa, Tamarin, Mauritius",
    duration: { en: "2-3 hours", de: "2-3 Stunden" },
    transport: { en: "Car, 10 minutes uphill", de: "Auto, 10 Minuten bergauf" },
    food: { en: "Lunch or dinner", de: "Mittag- oder Abendessen" },
    notes: {
      en: "The view is the reason to go. Ask about the day pass for the pool and the spa.",
      de: "Der Ausblick ist der Grund. Nach dem Tagespass für Pool und Spa fragen.",
    },
  },
  {
    id: "kind-coffee",
    name: "Kind Coffee",
    category: "food",
    hours: 1,
    needsCar: false,
    mapQuery: "Kind Coffee, Tamarin, Mauritius",
    duration: { en: "1 hour", de: "1 Stunde" },
    transport: { en: "Walk from the village", de: "Zu Fuß vom Dorf" },
    food: { en: "Coffee and breakfast", de: "Kaffee und Frühstück" },
    notes: {
      en: "Coffee stop before or after the beach.",
      de: "Kaffeestopp vor oder nach dem Strand.",
    },
  },
  {
    id: "moustache",
    name: "Moustache",
    category: "food",
    hours: 2,
    needsCar: false,
    mapQuery: "Moustache Bistro, Royal Road, Tamarin, Mauritius",
    duration: { en: "1-2 hours", de: "1-2 Stunden" },
    transport: { en: "Walk from the village", de: "Zu Fuß vom Dorf" },
    food: { en: "Dinner", de: "Abendessen" },
    notes: {
      en: "Easy dinner without leaving Tamarin.",
      de: "Unkompliziertes Abendessen, ohne Tamarin zu verlassen.",
    },
  },
  {
    id: "sketch",
    name: "Sketch",
    category: "food",
    hours: 2,
    needsCar: false,
    mapQuery: "Sketch, Royal Road, Tamarin, Mauritius",
    duration: { en: "1-2 hours", de: "1-2 Stunden" },
    transport: { en: "Walk from the village", de: "Zu Fuß vom Dorf" },
    food: { en: "Lunch or dinner", de: "Mittag- oder Abendessen" },
    notes: {
      en: "Good after a beach afternoon.",
      de: "Gut nach einem Strandnachmittag.",
    },
  },
  {
    id: "emba-filao",
    name: "Emba Filao",
    category: "food",
    hours: 2,
    needsCar: false,
    mapQuery: "Emba Filao, Tamarin, Mauritius",
    duration: { en: "2 hours", de: "2 Stunden" },
    transport: { en: "Walk from the village", de: "Zu Fuß vom Dorf" },
    food: { en: "Brunch", de: "Brunch" },
    notes: {
      en: "Late morning at the weekend.",
      de: "Am Wochenende später Vormittag.",
    },
  },
];

export const CATEGORY_LABELS: Record<ActivityCategory, Bilingual> = {
  land: { en: "Land", de: "Land" },
  water: { en: "Water", de: "Wasser" },
  air: { en: "Air", de: "Luft" },
  food: { en: "Food & drink", de: "Essen & Trinken" },
};

export function activityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}

export function activityLines(lang: Lang): string {
  return ACTIVITIES.map(
    (a) =>
      `- ${a.id} | ${a.name} | ${CATEGORY_LABELS[a.category][lang]} | ${a.duration[lang]} | ${a.transport[lang]} | ${a.food[lang]} | ${a.notes[lang]}`,
  ).join("\n");
}
