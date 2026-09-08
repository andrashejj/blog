import type { Bilingual } from "./tamarin-activities";

interface MapLocation {
  position: [number, number];
  source: string;
  note?: Bilingual;
}

// Verified once when authoring, rather than geocoding on every page visit.
// Excursions with variable meeting points are explicitly labelled as areas.
export const MAP_LOCATIONS: Record<string, MapLocation> = {
  casela: {
    position: [-20.3050626, 57.4079745],
    source: "https://www.openstreetmap.org/way/996645321",
  },
  "tamarin-falls": {
    position: [-20.3515249, 57.4635199],
    source: "https://www.openstreetmap.org/node/4601459069",
  },
  "ebony-forest": {
    position: [-20.4370934, 57.3718465],
    source: "https://www.openstreetmap.org/way/459008713",
  },
  chamarel: {
    position: [-20.4416011, 57.374198],
    source: "https://www.openstreetmap.org/way/133131984",
  },
  "le-morne-hike": {
    position: [-20.4540752, 57.3213024],
    source: "https://www.openstreetmap.org/node/828423453",
  },
  "black-river-gorges": {
    position: [-20.4247022, 57.4296883],
    source: "https://www.openstreetmap.org/way/133131981",
  },
  "vallee-des-couleurs": {
    position: [-20.4574949, 57.4849894],
    source: "https://www.openstreetmap.org/node/5625285721",
  },
  "south-coast": {
    position: [-20.5245202, 57.531899],
    source: "https://www.openstreetmap.org/way/258670267",
  },
  "ile-aux-cerfs": {
    position: [-20.2720269, 57.8036655],
    source: "https://www.openstreetmap.org/relation/5337913",
  },
  "port-louis": {
    position: [-20.1604837, 57.5025791],
    source: "https://www.openstreetmap.org/way/159257749",
  },
  moustache: {
    position: [-20.3438416, 57.3644292],
    source: "https://www.openstreetmap.org/way/509036926",
  },
  sketch: {
    position: [-20.3451764, 57.3643368],
    source: "https://www.openstreetmap.org/node/13906365387",
  },
  "emba-filao": {
    position: [-20.4543864, 57.3123999],
    source: "https://www.openstreetmap.org/node/2163827313",
  },
  "le-morne-beach": {
    position: [-20.4543864, 57.3123999],
    source: "https://www.openstreetmap.org/node/2163827313",
    note: {
      en: "Public beach near Emba Filao.",
      de: "Öffentlicher Strand beim Emba Filao.",
    },
  },
  dolphins: {
    position: [-20.3292161, 57.3776792],
    source: "https://www.openstreetmap.org/search?query=Tamarin",
    note: {
      en: "Tamarin departure area. Confirm the meeting point with your operator.",
      de: "Abfahrtsgebiet Tamarin. Treffpunkt beim Anbieter bestätigen.",
    },
  },
  whales: {
    position: [-20.3292161, 57.3776792],
    source: "https://www.openstreetmap.org/search?query=Tamarin",
    note: {
      en: "Tamarin departure area. Confirm the meeting point with your operator.",
      de: "Abfahrtsgebiet Tamarin. Treffpunkt beim Anbieter bestätigen.",
    },
  },
  snorkelling: {
    position: [-20.3664544, 57.3751323],
    source:
      "https://www.openstreetmap.org/search?query=Black%20River%20Mauritius",
    note: {
      en: "Black River departure area. Confirm the meeting point with your operator.",
      de: "Abfahrtsgebiet Black River. Treffpunkt beim Anbieter bestätigen.",
    },
  },
  diving: {
    position: [-20.4354625, 57.3207344],
    source: "https://bluelungsdiving.com/contact/",
    note: {
      en: "Blue Lungs at Paradis Beachcomber, one west-coast dive centre. Confirm where your own booking departs.",
      de: "Blue Lungs im Paradis Beachcomber, eine Tauchbasis an der Westküste. Treffpunkt eurer Buchung bestätigen.",
    },
  },
  turtles: {
    position: [-20.4543864, 57.3123999],
    source: "https://www.openstreetmap.org/node/2163827313",
    note: {
      en: "Le Morne area, not a fixed wildlife location. Confirm pickup with your operator.",
      de: "Gebiet Le Morne, kein fester Tierstandort. Abholung beim Anbieter bestätigen.",
    },
  },
  paragliding: {
    position: [-20.4253074, 57.3912706],
    source: "https://www.openstreetmap.org/search?query=Chamarel",
    note: {
      en: "Chamarel area. The operator confirms the launch and meeting points.",
      de: "Gebiet Chamarel. Start- und Treffpunkt bestätigt der Anbieter.",
    },
  },
  "the-post": {
    position: [-20.35835, 57.36726],
    source:
      "https://mauritius.worldplaces.me/fr/view-place/83307362-le-bistrot-de-la-poste.html",
    note: {
      en: "Nautica Commercial Centre, La Preneuse, Rivière Noire.",
      de: "Nautica Commercial Centre, La Preneuse, Rivière Noire.",
    },
  },
  "legend-hill": {
    position: [-20.38784, 57.38065],
    source:
      "https://mauritius.worldplaces.me/fr/review/86910744-legend-hill-conciergery-spa-and-resort-ile-maurice.html",
  },
  "kind-coffee": {
    position: [-20.4294492, 57.358575],
    source: "https://mycoffee.guide/en/cafe/kind-coffee-la-gaulette",
  },
};
