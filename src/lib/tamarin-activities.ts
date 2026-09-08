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
  kind: Bilingual;
  sources: { label: string; url: string }[];
  /** False until an unresolved listing can be identified. */
  plannerEligible?: boolean;
  /** typical hours door to door, used by the duration filter */
  hours: number;
  /** true when a car, taxi or arranged road transfer is the practical option */
  needsCar: boolean;
  /** free-text place lookup, accurate enough for a maps search */
  mapQuery: string;
  duration: Bilingual;
  transport: Bilingual;
  food: Bilingual;
  notes: Bilingual;
}

// Personal budgeting estimate, not a current rental quote.
export const CAR_HIRE_USD_PER_DAY = 25;

// Sources checked 8 September 2026. Time budgets are planning estimates
// from Tamarin, not operator-guaranteed durations.
export const ACTIVITIES: Activity[] = [
  {
    id: "casela",
    name: "Casela Nature Parks",
    category: "land",
    hours: 7,
    needsCar: true,
    mapQuery: "Casela Nature Park, Mauritius",
    duration: {
      en: "6-7 hours",
      de: "6-7 Stunden",
    },
    transport: {
      en: "Car or taxi to Cascavelle",
      de: "Auto oder Taxi nach Cascavelle",
    },
    food: {
      en: "Restaurants on site",
      de: "Restaurants vor Ort",
    },
    notes: {
      en: "The safari bus takes you among giraffes, rhinos, antelopes and ostriches. The rest of the park has big cats, giant tortoises and aviaries. Allow time for the safari departure; check which animal encounters and rides your ticket includes.",
      de: "Mit dem Safaribus geht es zu Giraffen, Nashörnern, Antilopen und Straußen. Im übrigen Park gibt es Raubkatzen, Riesenschildkröten und Vogelvolieren. Zeit für die Safari einplanen und prüfen, welche Tierbegegnungen und Fahrten im Ticket enthalten sind.",
    },
    kind: {
      en: "Safari & wildlife park",
      de: "Safari- und Tierpark",
    },
    sources: [
      {
        label: "Casela",
        url: "https://caselaparks.com/",
      },
      {
        label: "Safari bus",
        url: "https://caselaparks.com/activity/safari-bus/",
      },
    ],
  },
  {
    id: "tamarin-falls",
    name: "Tamarind Falls (7 Cascades)",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Tamarin Falls Seven Cascades, Mauritius",
    duration: {
      en: "5–6 hours; longer for all seven",
      de: "5–6 Stunden; länger für alle sieben",
    },
    transport: {
      en: "Car or taxi to Henrietta; meet your guide",
      de: "Auto oder Taxi nach Henrietta; Treffpunkt mit Guide",
    },
    food: {
      en: "Water and snacks; check tour inclusions",
      de: "Wasser und Snacks; Leistungen der Tour prüfen",
    },
    notes: {
      en: "Also called Tamarind Falls or 7 Cascades. A half-day guided route takes 3–4 hours on foot and visits part of the falls; the full route takes 6–7 hours of walking. Choose the route with your guide, rather than assuming all seven fit into a morning.",
      de: "Auch Tamarind Falls oder 7 Cascades genannt. Die geführte Halbtagestour dauert 3–4 Stunden zu Fuß und besucht einen Teil der Fälle; die gesamte Route braucht 6–7 Stunden Gehzeit. Die Route mit dem Guide abstimmen, statt alle sieben für einen Vormittag einzuplanen.",
    },
    kind: {
      en: "Guided waterfall hike",
      de: "Geführte Wasserfallwanderung",
    },
    sources: [
      {
        label: "Jay 7 Cascades",
        url: "https://jay7cascades.com/services/",
      },
    ],
  },
  {
    id: "ebony-forest",
    name: "Ebony Forest, Chamarel",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Ebony Forest Chamarel, Mauritius",
    duration: {
      en: "Half day; longer with Piton Canot",
      de: "Halber Tag; länger mit Piton Canot",
    },
    transport: {
      en: "Car or taxi to Chamarel",
      de: "Auto oder Taxi nach Chamarel",
    },
    food: {
      en: "Snacks on site; picnics not allowed",
      de: "Snacks vor Ort; Picknicks nicht erlaubt",
    },
    notes: {
      en: "A forest restoration reserve with endemic birds, a raised walkway and views from Sublime Point. Walking routes take 1–4 hours on site; Piton Canot is the longer extension. There is also a two-hour guided jeep visit that needs booking.",
      de: "Ein Wiederaufforstungsgebiet mit endemischen Vögeln, einem erhöhten Holzsteg und dem Aussichtspunkt Sublime Point. Die Wanderwege dauern vor Ort 1–4 Stunden; Piton Canot ist die längere Erweiterung. Eine zweistündige geführte Jeeptour ist ebenfalls möglich, mit Voranmeldung.",
    },
    kind: {
      en: "Native forest & conservation",
      de: "Einheimischer Wald und Artenschutz",
    },
    sources: [
      {
        label: "Ebony Forest walks",
        url: "https://www.ebonyforest.com/visit-ebony/take-a-hike/",
      },
      {
        label: "Jeep visit",
        url: "https://www.ebonyforest.com/visit-ebony/take-a-drive/",
      },
    ],
  },
  {
    id: "chamarel",
    name: "Chamarel: Seven Coloured Earth & waterfall",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Seven Coloured Earths Chamarel, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Car or taxi to Chamarel",
      de: "Auto oder Taxi nach Chamarel",
    },
    food: {
      en: "Viewpoint Café or village restaurants",
      de: "Viewpoint Café oder Restaurants im Dorf",
    },
    notes: {
      en: "The Seven Coloured Earth geopark includes the dunes, waterfall viewpoints and giant tortoises. The rum distillery is a separate nearby visit. Choose your stops before setting off; adding the distillery and a long Ebony Forest walk makes this a full day.",
      de: "Zum Geopark der Siebenfarbigen Erde gehören die Dünen, Aussichtspunkte am Wasserfall und Riesenschildkröten. Die Rumdestillerie ist ein eigener Besuch in der Nähe. Stopps vorher auswählen: Mit Destillerie und langer Ebony-Forest-Wanderung wird daraus ein ganzer Tag.",
    },
    kind: {
      en: "Coloured earth & waterfall",
      de: "Farbige Erde und Wasserfall",
    },
    sources: [
      {
        label: "Chamarel geopark",
        url: "https://chamarel7colouredearth.com/",
      },
      {
        label: "Rhumerie de Chamarel",
        url: "https://www.rhumeriedechamarel.com/en/",
      },
    ],
  },
  {
    id: "le-morne-hike",
    name: "Le Morne Brabant hike",
    category: "land",
    hours: 5,
    needsCar: true,
    mapQuery: "Le Morne Brabant, Mauritius",
    duration: {
      en: "4-5 hours",
      de: "4-5 Stunden",
    },
    transport: {
      en: "Car or taxi to the trail entrance",
      de: "Auto oder Taxi zum Wanderstart",
    },
    food: {
      en: "Bring water; eat before or after the hike",
      de: "Wasser mitbringen; vor oder nach der Wanderung essen",
    },
    notes: {
      en: "A mountain walk with lagoon views. The upper route is steep and exposed and ends at the cross below the summit. Check current trail access with the heritage authority before arranging a guide; the upper section is unsuitable for young children or anyone uncomfortable with heights.",
      de: "Eine Bergwanderung mit Blick auf die Lagune. Der obere Weg ist steil und ausgesetzt und endet am Kreuz unterhalb des Gipfels. Aktuellen Zugang bei der Heritage-Behörde prüfen, bevor ihr einen Guide bucht; der obere Teil eignet sich nicht für kleine Kinder oder bei Höhenangst.",
    },
    kind: {
      en: "Mountain hike",
      de: "Bergwanderung",
    },
    sources: [
      {
        label: "Le Morne Heritage Trust",
        url: "https://lemorneheritage.govmu.org/lmh/",
      },
      {
        label: "Trail information",
        url: "https://lemorneheritage.govmu.org/lmh/wp-content/uploads/2023/07/General-practical-information.pdf",
      },
    ],
  },
  {
    id: "le-morne-beach",
    name: "Le Morne beach and lagoon",
    category: "water",
    hours: 4,
    needsCar: true,
    mapQuery: "Le Morne Public Beach, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Car or taxi to Le Morne public beach",
      de: "Auto oder Taxi zum öffentlichen Strand von Le Morne",
    },
    food: {
      en: "Emba Filao on the public beach",
      de: "Emba Filao am öffentlichen Strand",
    },
    notes: {
      en: "Public beach below Le Morne Brabant, with the lagoon on one side and the mountain behind you. This entry is for a few hours at the beach. Emba Filao is on the beachfront, so lunch there fits into the same visit.",
      de: "Öffentlicher Strand unterhalb des Le Morne Brabant, mit der Lagune vor euch und dem Berg im Rücken. Dieser Eintrag ist für ein paar Stunden am Strand gedacht. Emba Filao liegt direkt dort und passt als Mittagspause dazu.",
    },
    kind: {
      en: "Beach & lagoon",
      de: "Strand und Lagune",
    },
    sources: [
      {
        label: "Beach Authority",
        url: "https://www.beachauthority.mu/pdf/beaches/List2025.pdf",
      },
      {
        label: "Emba Filao",
        url: "https://www.luxislandresorts.com/media/7145/integrated-annual-report-lir.pdf",
      },
    ],
  },
  {
    id: "black-river-gorges",
    name: "Black River Gorges",
    category: "land",
    hours: 6,
    needsCar: true,
    mapQuery: "Black River Gorges National Park, Mauritius",
    duration: {
      en: "Half to full day",
      de: "Halber bis ganzer Tag",
    },
    transport: {
      en: "Car or taxi; entrance depends on the route",
      de: "Auto oder Taxi; Eingang hängt von der Route ab",
    },
    food: {
      en: "Pack lunch and water for a hike",
      de: "Für eine Wanderung Essen und Wasser einpacken",
    },
    notes: {
      en: "Native forest, endemic birds and routes of very different difficulty. A viewpoint visit is a shorter outing; the official Machabée trail from Pétrin to the Lower Gorges is a strenuous 10 km route. Choose the trail and entrance first, then arrange transport for its endpoint.",
      de: "Einheimischer Wald, endemische Vögel und Wege mit sehr unterschiedlichem Anspruch. Ein Aussichtspunkt ist ein kürzerer Ausflug; der offizielle Machabée-Weg von Pétrin zu den Lower Gorges ist eine anstrengende 10-km-Strecke. Erst Route und Eingang wählen, dann die Rückfahrt vom Ziel organisieren.",
    },
    kind: {
      en: "National park & hiking",
      de: "Nationalpark und Wanderungen",
    },
    sources: [
      {
        label: "National Parks Service",
        url: "https://npcs.govmu.org/Pages/National%20Parks/Black-River-Gorges-National-Parks.aspx",
      },
    ],
  },
  {
    id: "vallee-des-couleurs",
    name: "Vallée des Couleurs (Vallé)",
    category: "land",
    hours: 7,
    needsCar: true,
    mapQuery: "La Vallee des Couleurs Nature Park, Mauritius",
    duration: {
      en: "5-7 hours",
      de: "5-7 Stunden",
    },
    transport: {
      en: "Car or taxi to Chamouny",
      de: "Auto oder Taxi nach Chamouny",
    },
    food: {
      en: "Le Chamouzé restaurant on site",
      de: "Restaurant Le Chamouzé vor Ort",
    },
    notes: {
      en: "Now called Vallé Advenature Park. Come for ziplines, quad or buggy rides and the Nepalese suspension bridge, with waterfalls and coloured earth around the park. Choose a ride package before visiting; age, height and weight limits differ by activity.",
      de: "Heißt heute Vallé Advenature Park. Hier geht es um Ziplines, Quad- oder Buggyfahrten und die nepalesische Hängebrücke, dazu Wasserfälle und farbige Erde. Aktivitäten vor dem Besuch auswählen; Alters-, Größen- und Gewichtsgrenzen unterscheiden sich je nach Fahrt.",
    },
    kind: {
      en: "Zipline & adventure park",
      de: "Zipline- und Abenteuerpark",
    },
    sources: [
      {
        label: "Vallé",
        url: "https://vallepark.com/",
      },
      {
        label: "Ride requirements",
        url: "https://vallepark.com/wp-content/uploads/2025/10/AGEWEIGHTHEIGHT-REQUIREMENTS.pdf",
      },
    ],
  },
  {
    id: "south-coast",
    name: "South coast drive",
    category: "land",
    hours: 8,
    needsCar: true,
    mapQuery: "Gris Gris Souillac, Mauritius",
    duration: {
      en: "Full day",
      de: "Ganzer Tag",
    },
    transport: {
      en: "Car",
      de: "Auto",
    },
    food: {
      en: "Plan a lunch stop around Souillac",
      de: "Mittagspause rund um Souillac einplanen",
    },
    notes: {
      en: "Head towards Souillac for the cliffs at Gris Gris and La Roche qui Pleure, with Rochester Falls as a separate stop. Leave time to get out of the car, walk and have lunch. Pick a few stops along this coast rather than trying to cross the whole south in one day.",
      de: "Richtung Souillac zu den Klippen bei Gris Gris und La Roche qui Pleure fahren; Rochester Falls ist ein eigener Stopp. Zeit zum Aussteigen, Gehen und Mittagessen lassen. Lieber einige Orte an dieser Küste auswählen, als an einem Tag den gesamten Süden abzufahren.",
    },
    kind: {
      en: "Coastal drive & stops",
      de: "Küstenfahrt mit Stopps",
    },
    sources: [
      {
        label: "Mauritius Tourism",
        url: "https://mauritiusnow.com/mauritius-map/south-mauritius/",
      },
      {
        label: "Gris Gris & La Roche qui Pleure",
        url: "https://mauritiusnow.com/blog/things-to-do/gris-gris-beach/",
      },
    ],
  },
  {
    id: "ile-aux-cerfs",
    name: "Ile aux Cerfs",
    category: "water",
    hours: 10,
    needsCar: true,
    mapQuery: "Ile aux Cerfs, Mauritius",
    duration: {
      en: "Full day",
      de: "Ganzer Tag",
    },
    transport: {
      en: "Car plus boat, or an organised tour",
      de: "Auto plus Boot oder organisierte Tour",
    },
    food: {
      en: "Island restaurants; tour lunch only if included",
      de: "Inselrestaurants; Tour-Mittagessen nur falls inklusive",
    },
    notes: {
      en: "An east-coast leisure island with beaches, watersports, restaurants and a golf course. You can take the shuttle from Pointe Maurice or book a longer boat excursion. From Tamarin, allow a full day for the cross-island journey, boat transfers and time on the beach.",
      de: "Eine Freizeitinsel an der Ostküste mit Stränden, Wassersport, Restaurants und Golfplatz. Anreise per Shuttle ab Pointe Maurice oder als längerer Bootsausflug. Ab Tamarin einen ganzen Tag für die Fahrt quer über die Insel, Bootsfahrten und Strandzeit einplanen.",
    },
    kind: {
      en: "Island beach day",
      de: "Strandtag auf einer Insel",
    },
    sources: [
      {
        label: "Île aux Cerfs",
        url: "https://www.ileauxcerfsleisureisland.com/",
      },
    ],
  },
  {
    id: "port-louis",
    name: "Port Louis",
    category: "land",
    hours: 5,
    needsCar: false,
    mapQuery: "Central Market Port Louis, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Car, taxi or bus to Port Louis",
      de: "Auto, Taxi oder Bus nach Port Louis",
    },
    food: {
      en: "Central Market and the Caudan waterfront",
      de: "Zentralmarkt und Caudan Waterfront",
    },
    notes: {
      en: "Start at the Central Market for fruit, spices and food stalls, then walk to the Caudan Waterfront for the harbour, craft market and lunch. This is a city visit on foot once you arrive. Leave extra time for traffic on the way in and out.",
      de: "Am Zentralmarkt mit Obst, Gewürzen und Essensständen anfangen, dann zur Caudan Waterfront mit Hafen, Kunsthandwerksmarkt und Mittagessen gehen. Vor Ort seid ihr zu Fuß unterwegs. Für die Hin- und Rückfahrt zusätzliche Zeit für Verkehr einplanen.",
    },
    kind: {
      en: "Markets & city walk",
      de: "Märkte und Stadtbummel",
    },
    sources: [
      {
        label: "Mauritius Tourism",
        url: "https://tourism.govmu.org/Pages/Services/Tourist-Sites.aspx",
      },
      {
        label: "Caudan craft market",
        url: "https://caudan.com/craft-markets/",
      },
    ],
  },
  {
    id: "turtles",
    name: "Turtle snorkelling, Le Morne",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Le Morne Public Beach, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Boat; arrange transport to the meeting point",
      de: "Boot; Anfahrt zum Treffpunkt organisieren",
    },
    food: {
      en: "Check whether your trip includes lunch",
      de: "Prüfen, ob die Tour Mittagessen enthält",
    },
    notes: {
      en: "Some west-coast lagoon trips include snorkelling where sea turtles may be seen around Le Morne. Sightings depend on the animals and conditions. Ask which route you are booking: a short snorkelling outing and a lagoon cruise with lunch take different amounts of time.",
      de: "Einige Lagunentouren an der Westküste bieten Schnorcheln an Stellen rund um Le Morne, an denen Meeresschildkröten vorkommen. Sichtungen hängen von Tieren und Bedingungen ab. Die Route klären: Ein kurzer Schnorchelausflug dauert anders lange als eine Lagunenfahrt mit Mittagessen.",
    },
    kind: {
      en: "Turtle snorkelling",
      de: "Schnorcheln mit Schildkröten",
    },
    sources: [
      {
        label: "Pelagic lagoon trip",
        url: "https://www.pelagic-mauritius.com/boat-lagoon-trip",
      },
    ],
  },
  {
    id: "snorkelling",
    name: "Snorkelling",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Black River Riviere Noire, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Boat; arrange transport to the departure point",
      de: "Boot; Anfahrt zum Ablegeplatz organisieren",
    },
    food: {
      en: "Bring water; check what the boat provides",
      de: "Wasser mitbringen; Verpflegung an Bord erfragen",
    },
    notes: {
      en: "A boat outing to west-coast reef sites, with the crew choosing stops for the conditions. Book a dedicated snorkelling trip if that is your priority; a dolphin or lunch cruise may only include a short stop. Confirm equipment, meeting point and return time.",
      de: "Bootsausflug zu Riffen an der Westküste; die Crew wählt Stopps nach den Bedingungen. Eine eigene Schnorcheltour buchen, wenn euch das am wichtigsten ist: Eine Delfin- oder Mittagessenstour enthält eventuell nur einen kurzen Stopp. Ausrüstung, Treffpunkt und Rückkehrzeit klären.",
    },
    kind: {
      en: "Guided reef snorkelling",
      de: "Geführtes Schnorcheln am Riff",
    },
    sources: [
      {
        label: "ECOCEAN snorkelling",
        url: "https://www.boatexcursionsmauritius.com/snorkeling.php",
      },
    ],
  },
  {
    id: "diving",
    name: "Diving",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Blue Lungs Diving, Paradis Beachcomber, Le Morne, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Meet at the dive centre; transfer by arrangement",
      de: "Treffpunkt Tauchbasis; Transfer nach Vereinbarung",
    },
    food: {
      en: "Plan a meal around the dive schedule",
      de: "Mahlzeit um den Tauchplan herum einplanen",
    },
    notes: {
      en: "Book through a dive centre and state your experience when enquiring. An introductory session and a trip for certified divers have different requirements and schedules. West-coast centres include Blue Lungs at Le Morne; confirm the centre, dive site and equipment before planning transport.",
      de: "Über eine Tauchbasis buchen und eure Erfahrung bei der Anfrage angeben. Schnuppertauchen und Ausfahrten für brevetierte Taucher haben unterschiedliche Voraussetzungen und Abläufe. An der Westküste gibt es etwa Blue Lungs in Le Morne; Basis, Tauchplatz und Ausrüstung vor der Anfahrt klären.",
    },
    kind: {
      en: "Scuba diving",
      de: "Gerätetauchen",
    },
    sources: [
      {
        label: "Blue Lungs centre",
        url: "https://bluelungsdiving.com/en/blue-lungs-diving-centre/",
      },
      {
        label: "Mauritius Scuba Diving Association",
        url: "https://msda.mu/en/",
      },
    ],
  },
  {
    id: "dolphins",
    name: "Dolphin watching",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Tamarin Bay, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Boat from Tamarin or Black River; confirm transfers",
      de: "Boot ab Tamarin oder Black River; Transfer klären",
    },
    food: {
      en: "Bring water; check snacks with the operator",
      de: "Wasser mitbringen; Snacks beim Anbieter erfragen",
    },
    notes: {
      en: "An early boat trip off Tamarin and Black River to look for wild dolphins. Book an observation trip if you want to stay on the boat, since many packages also advertise swimming. Sightings are not guaranteed; leave the afternoon free after the early start.",
      de: "Früher Bootsausflug vor Tamarin und Black River zur Beobachtung freilebender Delfine. Eine Beobachtungstour buchen, wenn ihr an Bord bleiben möchtet, denn viele Pakete bieten auch Schwimmen an. Sichtungen sind nicht garantiert; nach dem frühen Start den Nachmittag frei lassen.",
    },
    kind: {
      en: "Dolphin watching by boat",
      de: "Delfinbeobachtung vom Boot",
    },
    sources: [
      {
        label: "Whale Dream",
        url: "https://www.whalewatchingmauritius.com/",
      },
    ],
  },
  {
    id: "whales",
    name: "Whale watching",
    category: "water",
    hours: 4,
    needsCar: false,
    mapQuery: "Tamarin Bay, Mauritius",
    duration: {
      en: "Half day",
      de: "Halber Tag",
    },
    transport: {
      en: "Offshore boat trip; confirm departure point",
      de: "Hochsee-Bootstour; Ablegeplatz bestätigen",
    },
    food: {
      en: "Bring water; check snacks with the operator",
      de: "Wasser mitbringen; Snacks beim Anbieter erfragen",
    },
    notes: {
      en: "Sperm whales live off the west coast year-round; humpbacks visit during the austral winter migration. These trips head farther offshore than lagoon outings, so sea conditions matter. Confirm departure and trip length with the operator, and keep the rest of the day quiet.",
      de: "Pottwale leben ganzjährig vor der Westküste; Buckelwale kommen während ihrer Wanderung im Südwinter vorbei. Die Touren führen weiter aufs offene Meer als Lagunenausflüge, deshalb spielt der Seegang eine Rolle. Abfahrt und Dauer beim Anbieter klären und den restlichen Tag ruhig halten.",
    },
    kind: {
      en: "Offshore whale watching",
      de: "Walbeobachtung auf offener See",
    },
    sources: [
      {
        label: "Whale Dream",
        url: "https://www.whalewatchingmauritius.com/",
      },
      {
        label: "Dolswim whale watching",
        url: "https://www.mauritiusdolphinswim.com/whale-watching",
      },
    ],
  },
  {
    id: "paragliding",
    name: "Tandem paragliding",
    category: "air",
    hours: 4,
    needsCar: false,
    mapQuery: "Chamarel, Mauritius",
    duration: {
      en: "Half day; depends on launch site",
      de: "Halber Tag; abhängig vom Startplatz",
    },
    transport: {
      en: "Car, taxi or agreed transfer to the chosen site",
      de: "Auto, Taxi oder vereinbarter Transfer zum Startplatz",
    },
    food: {
      en: "Eat afterwards",
      de: "Danach essen",
    },
    notes: {
      en: "A flight with a pilot, with the launch site chosen for the weather. Mauritius Tandem advertises about 30–35 minutes for its classic flight and uses sites including Le Morne and Chamarel. Confirm the site before arranging transport; a launch farther away needs a longer day.",
      de: "Ein Flug mit Pilot; der Startplatz richtet sich nach dem Wetter. Mauritius Tandem nennt etwa 30–35 Minuten für den klassischen Flug und nutzt unter anderem Le Morne und Chamarel. Erst Startplatz bestätigen, dann Anfahrt organisieren; ein weiter entfernter Start braucht mehr Zeit.",
    },
    kind: {
      en: "Tandem flight",
      de: "Tandemflug",
    },
    sources: [
      {
        label: "Mauritius Tandem",
        url: "https://www.mauritius-tandem-paragliding.com/",
      },
    ],
  },
  {
    id: "the-post",
    name: "Le Bistrot de la Poste",
    category: "food",
    hours: 3,
    needsCar: true,
    mapQuery:
      "Le Bistrot de la Poste, Nautica Commercial Centre, Riviere Noire, Mauritius",
    duration: {
      en: "2–3 hours including travel",
      de: "2–3 Stunden mit Anfahrt",
    },
    transport: {
      en: "Car or taxi to Nautica, La Preneuse",
      de: "Auto oder Taxi zum Nautica, La Preneuse",
    },
    food: {
      en: "French bistro dinner",
      de: "Französische Bistroküche am Abend",
    },
    notes: {
      en: "A French bistro at Nautica Commercial Centre in Rivière Noire, with dishes such as escargots, duck parmentier and fondue. Plan it for dinner: its published listing shows Monday–Saturday evenings, closed Sundays.",
      de: "Französisches Bistro im Nautica Commercial Centre in Rivière Noire, mit Gerichten wie Weinbergschnecken, Entenparmentier und Fondue. Fürs Abendessen einplanen: Laut veröffentlichtem Eintrag Montag bis Samstag abends geöffnet, sonntags geschlossen.",
    },
    kind: {
      en: "French bistro",
      de: "Französisches Bistro",
    },
    sources: [
      {
        label: "Restaurant listing",
        url: "https://www.tripadvisor.com/Restaurant_Review-g951345-d15575919-Reviews-Le_Bistrot_de_la_Poste-Riviere_Noire.html",
      },
      {
        label: "Menu & location",
        url: "https://newhorizon.mu/fr/articles/where-to-eat-in-mauritius-6-must-visit-restaurants-in-the-west",
      },
    ],
  },
  {
    id: "legend-hill",
    name: "Legend Hill",
    category: "food",
    hours: 3,
    needsCar: true,
    mapQuery: "Legend Hill Residences & Spa, Tamarin, Mauritius",
    duration: {
      en: "2-3 hours",
      de: "2-3 Stunden",
    },
    transport: {
      en: "Car or taxi uphill in Rivière Noire",
      de: "Auto oder Taxi den Hang in Rivière Noire hinauf",
    },
    food: {
      en: "Lunch or dinner",
      de: "Mittag- oder Abendessen",
    },
    notes: {
      en: "A hillside hotel in Rivière Noire with BVIEW for bistro dining, Le 1812 for a gourmet meal and the Santoshia poolside bar. Choose the restaurant when booking and confirm access for non-residents. A restaurant reservation does not automatically include a pool or spa day.",
      de: "Ein Hotel am Hang in Rivière Noire mit BVIEW für Bistroküche, Le 1812 für ein Gourmetessen und der Poolbar Santoshia. Bei der Reservierung das Restaurant nennen und den Zugang für externe Gäste klären. Eine Tischreservierung umfasst nicht automatisch Pool oder Spa.",
    },
    kind: {
      en: "Hotel restaurants & bar",
      de: "Hotelrestaurants und Bar",
    },
    sources: [
      {
        label: "Legend Hill brochure",
        url: "https://www.legendhill-resort.com/download/legendhillbrochureen.pdf",
      },
    ],
  },
  {
    id: "kind-coffee",
    name: "Kind Coffee",
    category: "food",
    hours: 2,
    needsCar: true,
    mapQuery: "Kind Coffee, La Gaulette, Mauritius",
    duration: {
      en: "1–2 hours including travel",
      de: "1–2 Stunden mit Anfahrt",
    },
    transport: {
      en: "Car to La Gaulette",
      de: "Auto nach La Gaulette",
    },
    food: {
      en: "Coffee; check the current food menu",
      de: "Kaffee; aktuelle Speisekarte prüfen",
    },
    notes: {
      en: "A specialty coffee shop in La Gaulette, started by Taylor Holl and Willow-River Tonkin. It makes a coffee stop on the way to or from Le Morne. Allow travel time from Tamarin if you are going just for coffee.",
      de: "Ein Spezialitätenkaffee-Café in La Gaulette, gegründet von Taylor Holl und Willow-River Tonkin. Passt als Kaffeestopp auf dem Weg nach oder von Le Morne. Wenn ihr nur für Kaffee hinfahrt, die Anfahrt ab Tamarin mit einplanen.",
    },
    kind: {
      en: "Specialty coffee café",
      de: "Spezialitätenkaffee",
    },
    sources: [
      {
        label: "Founder interview",
        url: "https://magazine.coffee/blog/1/6718/coffee-culture-takes-flight-in-mauritius",
      },
    ],
  },
  {
    id: "moustache",
    name: "Moustache Bistro",
    category: "food",
    hours: 2,
    needsCar: false,
    mapQuery: "Moustache Bistro, Royal Road, Tamarin, Mauritius",
    duration: {
      en: "1-2 hours",
      de: "1-2 Stunden",
    },
    transport: {
      en: "Royal Road, La Mivoie; walk or local taxi",
      de: "Royal Road, La Mivoie; zu Fuß oder per Taxi",
    },
    food: {
      en: "Dinner",
      de: "Abendessen",
    },
    notes: {
      en: "A French bistro and wine bar on Royal Road in La Mivoie, Tamarin. A local dinner option after an outing. Check the current opening days before making it your dinner plan.",
      de: "Französisches Bistro und Weinbar an der Royal Road in La Mivoie, Tamarin. Eine Möglichkeit fürs Abendessen nach einem Ausflug. Die aktuellen Öffnungstage prüfen, bevor ihr es fest einplant.",
    },
    kind: {
      en: "Bistro & wine bar",
      de: "Bistro und Weinbar",
    },
    sources: [
      {
        label: "Restaurant listing",
        url: "https://moustachebistro.restaurant.mu/en",
      },
    ],
  },
  {
    id: "sketch",
    name: "Sketch",
    category: "food",
    hours: 2,
    needsCar: false,
    mapQuery: "Sketch, Royal Road, Tamarin, Mauritius",
    duration: {
      en: "1-2 hours",
      de: "1-2 Stunden",
    },
    transport: {
      en: "Royal Road, La Mivoie; walk or local taxi",
      de: "Royal Road, La Mivoie; zu Fuß oder per Taxi",
    },
    food: {
      en: "Breakfast or lunch; kitchen until 3pm",
      de: "Frühstück oder Mittagessen; Küche bis 15 Uhr",
    },
    notes: {
      en: "A daytime café on Royal Road in La Mivoie, Tamarin. Its published hours are 8am–4pm daily, with the kitchen closing at 3pm. Use it for breakfast or lunch; it is not a dinner stop.",
      de: "Ein Tagescafé an der Royal Road in La Mivoie, Tamarin. Laut Website täglich 8–16 Uhr geöffnet, die Küche schließt um 15 Uhr. Für Frühstück oder Mittagessen einplanen; abends ist es geschlossen.",
    },
    kind: {
      en: "Breakfast & lunch café",
      de: "Frühstücks- und Lunchcafé",
    },
    sources: [
      {
        label: "Sketch hours",
        url: "https://www.sketchmauritius.com/contact",
      },
    ],
  },
  {
    id: "emba-filao",
    name: "Emba Filao",
    category: "food",
    hours: 3,
    needsCar: true,
    mapQuery: "Emba Filao, Le Morne, Mauritius",
    duration: {
      en: "2–3 hours including travel",
      de: "2–3 Stunden mit Anfahrt",
    },
    transport: {
      en: "Car to Le Morne",
      de: "Auto nach Le Morne",
    },
    food: {
      en: "Beach lunch",
      de: "Mittagessen am Strand",
    },
    notes: {
      en: "A restaurant directly on Le Morne public beach, beside LUX* Le Morne, serving seafood and Mauritian dishes. Plan it as a beach lunch stop and check current service hours before travelling specifically for a meal.",
      de: "Restaurant direkt am öffentlichen Strand von Le Morne, neben LUX* Le Morne, mit Meeresfrüchten und mauritischen Gerichten. Passt als Mittagspause am Strand; vor einer eigenen Anfahrt die aktuellen Küchenzeiten prüfen.",
    },
    kind: {
      en: "Beach restaurant",
      de: "Strandrestaurant",
    },
    sources: [
      {
        label: "LUX Island Resorts",
        url: "https://www.luxislandresorts.com/media/7145/integrated-annual-report-lir.pdf",
      },
      {
        label: "Current restaurant listing",
        url: "https://www.tripadvisor.com.au/Restaurant_Review-g488105-d7023362-Reviews-Emba_Filao-Le_Morne.html",
      },
    ],
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

export function activityLines(
  lang: Lang,
  activities: Activity[] = ACTIVITIES,
): string {
  return activities
    .filter((a) => a.plannerEligible !== false)
    .map(
      (a) =>
        `- ${a.id} | ${a.name} | ${a.kind[lang]} | ${a.duration[lang]} | ${a.transport[lang]} | ${a.food[lang]} | ${a.notes[lang]}`,
    )
    .join("\n");
}
