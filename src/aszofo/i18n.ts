// Every word on the Aszófő pages, in English, Hungarian and German.
// English is the reference shape; the other two must match it key for key.

import type { Lang } from "./config";

const en = {
  locale: "en-GB",
  langName: "English",
  meta: {
    title: "Aszófő · A press house above Lake Balaton",
    description:
      "A thatched press house among the vines above Lake Balaton, for up to six guests. See open dates and send a booking request.",
  },
  nav: {
    house: "The house",
    around: "Around",
    seasons: "Seasons",
    request: "Request dates",
    skip: "Skip to content",
  },
  hero: {
    eyebrow: "Aszófő · Balaton Uplands · Hungary",
    title: "A press house among the vines, above Lake Balaton.",
    lead: "Thatched roof, thick walls, a green tile stove and a vaulted cellar. Old trees, rows of vines, and the lake on the horizon.",
    cta: "See open dates",
    secondary: "Look around",
    caption: "The press house on an August evening",
  },
  intro: {
    body: "We bought this house for the view and stayed for everything else: the walnut trees, the evening light on the vines, the way the tile stove warms the whole room. It's our family's place. When we aren't there, we'd like to share it with people who will treat it the way we do.",
    sign: "Andras & family",
  },
  facts: [
    { value: "6", label: "guests at most" },
    { value: "3", label: "bedrooms under old beams" },
    { value: "6,186 m²", label: "of garden and vineyard" },
    { value: "0", label: "televisions, on purpose" },
  ],
  house: {
    label: "The house",
    rooms: {
      downstairs: {
        title: "Downstairs",
        body: "One long room around the green tile stove. A long table, wooden benches, and double doors that open straight onto the terrace.",
      },
      upstairs: {
        title: "Upstairs",
        body: "Three bedrooms under exposed wooden beams: a main bedroom facing the lake, a guest room, and a children's room with bunks.",
      },
      cellar: {
        title: "The cellar",
        body: "Down a short stair under the house is the brick-vaulted cellar the press house was built for. It stays cool in the hottest weeks. Bring a bottle from one of the nearby cellars and open it there.",
      },
      outside: {
        title: "Outside",
        body: "A covered terrace shaded with reed, a stone pergola, a fire pit, and old walnut and fruit trees with enough room between them for children to disappear for an hour.",
      },
      vineyard: {
        title: "The vineyard",
        body: "Rows of vines run down the hill toward the water. On a clear day you can see across the lake to the hills of the south shore.",
      },
    },
    alt: {
      front: "The white press house with its steep thatched roof at dusk",
      table: "A long wooden table with benches, the door open to the garden",
      stove: "The green tile stove in the living room",
      beams: "An upstairs bedroom under dark wooden beams",
      cellar: "The brick vault of the cellar",
      terrace:
        "The garden and two old trees seen from under the reed-shaded terrace",
      pergola: "The stone wall and wooden pergola beside the house",
      vinesLake: "Rows of vines leading down toward Lake Balaton",
      vinesHouse: "The vineyard, with the thatched roof behind it",
      door: "Double doors open from the living room onto the terrace",
    },
  },
  evenings: {
    title: "No television. On purpose.",
    body: "Books, board games, the tile stove, the fire pit, a long dinner that runs late. The view does the rest.",
  },
  progress: {
    label: "Work in progress",
    body: "We're renovating in stages through 2027: a kitchen that opens onto the terrace, a wide window in the main bedroom, proper heating for winter, and later a small sauna in the garden. Our reply will tell you what's finished by your dates.",
  },
  seasons: {
    label: "Seasons",
    title: "Four seasons on the hill",
    items: [
      {
        name: "Spring",
        body: "Almond and cherry blossom on the slopes, empty roads, walks in the Káli Basin before the heat.",
      },
      {
        name: "Summer",
        body: "The lake is warm enough to swim from June. Lavender flowers on the Tihany peninsula in late June and July, and the evenings on the terrace are long.",
      },
      {
        name: "Autumn",
        body: "Harvest in the vineyards, new wine, mild days for walking. The lake is often still swimmable in September.",
      },
      {
        name: "Winter",
        body: "The tile stove, frost on the vines, quiet villages. The thermal lake at Hévíz is about an hour away.",
      },
    ],
  },
  around: {
    label: "Around",
    title: "Around the house",
    lead: "Aszófő sits at the neck of the Tihany peninsula, between Balatonfüred and the Káli Basin. Most of what's worth the drive is within half an hour.",
    note: "Confirmed guests get a private page with restaurants, cellars, walks and markets chosen for their dates and interests.",
    minutes: "{n} min",
    diagramLabel:
      "Places around Aszófő, drawn by direction and driving time from the house",
  },
  booking: {
    label: "Dates",
    title: "Open dates",
    lead: "Choose your arrival and departure. This sends a request, not a booking: we reply within two days, and nothing is binding until you confirm.",
    legend: {
      open: "Open",
      taken: "Taken",
      selected: "Your stay",
      today: "Today",
    },
    chooseArrival: "Choose your arrival",
    chooseDeparture: "Now choose your departure",
    minNights: "Minimum stay: {n} nights",
    clear: "Clear dates",
    prev: "Previous month",
    next: "Next month",
    loading: "Checking the calendar…",
    loadError: "The calendar didn't load. Write to us instead at {email}.",
    continue: "Continue",
    back: "Back",
    steps: ["Dates", "Guests", "Your stay"],
    fields: {
      name: "Your name",
      email: "Email",
      phone: "Phone (optional)",
      adults: "Adults",
      children: "Children",
      dog: "We'd like to bring a dog",
      message: "Anything we should know?",
      messageHint:
        "Who's coming, what you're celebrating, questions about the house.",
    },
    prefsIntro:
      "A few questions, all optional. If we confirm your stay, we use the answers to fill your private guest page with places that suit you.",
    group: {
      question: "Who's coming?",
      options: {
        couple: "A couple",
        friends: "Friends",
        "family-young": "Family with small children",
        "family-older": "Family with older children",
        solo: "Just me",
      },
    },
    interests: {
      question: "What would you like to do?",
      options: {
        wine: "Wine & cellars",
        food: "Good food",
        lake: "The lake",
        walk: "Walks & hikes",
        bike: "Cycling",
        culture: "Culture & history",
        market: "Markets & crafts",
        slow: "Very little",
        wellness: "Thermal baths & spa",
      },
    },
    pace: {
      question: "How full should the days be?",
      options: { slow: "Slow", balanced: "A bit of both", full: "Full" },
    },
    transport: {
      question: "How are you travelling?",
      options: { car: "By car", train: "By train", unsure: "Not sure yet" },
    },
    food: "Food preferences or allergies",
    occasion: "Celebrating anything?",
    keysQuestion: "Keys",
    keysHunor: "Hunor lets us in (20 €)",
    keysBudapest: "We'll collect the keys in Budapest",
    keysRequired:
      "From October to April Hunor lets you in and looks after the water and heating: 20 € for his two visits.",
    thanksLabel: "A thank-you for the house (optional)",
    thanksHint:
      "Whatever feels right, in euros. Leave it empty if you'd rather not.",
    consent:
      "I understand this is a request. You'll use these details only to answer it and host our stay, and delete them afterwards.",
    submit: "Send request",
    sending: "Sending…",
    errors: {
      dates: "Please choose valid dates.",
      guests: "Please check the number of guests (up to 6).",
      name: "Please add your name.",
      email: "Please check your email address.",
      consent: "Please confirm you've read the note above.",
      taken: "These dates were taken a moment ago. Please choose others.",
      generic: "Something went wrong. Please try again, or write to {email}.",
      storage: "Requests are paused for a moment. Please write to {email}.",
      rate: "Too many requests from this connection. Please try again later.",
    },
    success: {
      title: "Thank you, {name}.",
      body: "Your request for {dates} is with us. We'll reply by email within two days, and we've sent a copy to {email}.",
      link: "Your request page",
    },
  },
  costs: {
    label: "What it costs",
    lead: "There's no nightly rate. We ask for what a stay actually costs us, however long you stay.",
    cleaning: "Cleaning",
    keys: "Hunor: keys, water and heating (two visits)",
    keysNote:
      "Needed from October to April. From May to September you can collect the keys in Budapest instead.",
    budapest: "Keys collected in Budapest",
    thanks: "A thank-you",
    thanksValue: "Your choice",
    thanksNote:
      "If you'd like to give something towards the house on top, you decide how much.",
    total: "Total",
    payNote: "We'll tell you how to pay when we confirm.",
  },
  practical: {
    label: "Good to know",
    items: [
      { term: "Arrival", detail: "From 15:00" },
      { term: "Departure", detail: "By 11:00" },
      { term: "Minimum stay", detail: "2 nights" },
      { term: "Guests", detail: "Up to 6, children welcome" },
      { term: "Dogs", detail: "Ask us" },
      { term: "Wi‑Fi", detail: "None" },
      { term: "Included", detail: "Bed linen, towels, firewood" },
      {
        term: "Getting here",
        detail:
          "About 2 hours by car from Budapest, or a direct train to the village.",
      },
    ],
  },
  how: {
    label: "How it works",
    steps: [
      {
        title: "Request",
        body: "Pick dates and tell us a little about your group.",
      },
      {
        title: "Reply",
        body: "We answer within two days, and tell you how to pay the small costs.",
      },
      {
        title: "Your page",
        body: "Once confirmed, you get a private page with directions, the house, and places we chose for you. It stays open until your stay is over.",
      },
    ],
  },
  footer: {
    place: "Aszófő, Balaton Uplands, Hungary",
    questions: "Questions?",
    hosted: "A family house, hosted by Andras.",
  },
  units: {
    night: { one: "{n} night", other: "{n} nights" },
    adult: { one: "{n} adult", other: "{n} adults" },
    child: { one: "{n} child", other: "{n} children" },
    day: { one: "{n} day", other: "{n} days" },
  },
  stay: {
    metaTitle: "Your stay · Aszófő",
    hello: "Welcome, {name}.",
    helloPending: "Thank you, {name}.",
    status: {
      pending: "Request received",
      open: "Confirmed",
      ended: "Closed",
      declined: "Not possible",
      cancelled: "Cancelled",
    },
    countdown: {
      future: "{days} to go",
      tomorrow: "Tomorrow",
      today: "Today",
      during: "Day {d} of {n}",
      after: "Safe travels home",
    },
    arrive: "Arrive",
    depart: "Leave",
    guests: "Guests",
    from: "from {time}",
    by: "by {time}",
    dog: "and a dog",
    pendingBody:
      "We have your request and will answer by email within two days. Once your stay is confirmed, this page fills with directions, the house, and places we've picked for you.",
    declinedBody: "We're sorry, we can't host you on these dates.",
    cancelledBody:
      "This stay has been cancelled. If that's unexpected, please write to {email}.",
    endedBody:
      "This page has closed now that the stay is over. Thank you for looking after the house. We hope to see you again.",
    otherDates: "See other dates",
    validUntil: "This page is yours until {date}.",
    noteTitle: "A note from us",
    arriveTitle: "Getting here",
    address: "Address",
    openMaps: "Open in maps",
    byCar: "By car",
    byTrain: "By train",
    byPlane: "By plane",
    keysTitle: "Arrival and keys",
    revealLater:
      "Hunor's number and the arrival details appear here {n} days before you arrive.",
    notSetYet: "We'll add this before you arrive.",
    revealShort: "Appears {n} days before you arrive.",
    notFound:
      "This link doesn't open a stay. Check the address in your email, or write to us.",
    parking: "Parking",
    houseTitle: "In the house",
    noStreet:
      "There's no street address up on the hill. Use the pin, or the plus code in any maps app.",
    plusCode: "Plus code",
    keysHunorBody:
      "{name} has the keys and gets the house ready, with water and heating in the colder months. Call him a few days before you arrive to agree on a time and anything else.",
    keysPickupBody: "You're collecting the keys in Budapest:",
    keysPickupAfter: "Message us on WhatsApp to agree on a time.",
    callKey: "Call {name}",
    costsTitle: "Your costs",
    whatsapp: "WhatsApp {name}",
    favourites: "Our favourites",
    hostPick: "One of ours",
    manualTitle: "How the house works",
    leaveTitle: "Before you leave",
    picksTitle: "Chosen for you",
    picksLead:
      "Picked for your dates and what you told us. Everything else nearby follows below.",
    picksLeadNoPrefs:
      "Picked for your dates. Tell us what you enjoy (just reply to our email) and we'll tune this list.",
    because: "For: {x}",
    inSeason: "Open during your stay",
    allTitle: "Around the house",
    mapTitle: "On the map",
    essentialsTitle: "Everyday things",
    contactTitle: "If you need us",
    emergency: "Emergency: ambulance, fire, police",
    call: "Call",
    write: "Email",
    directions: "Directions",
    website: "Website",
    bookAhead: "Book ahead",
    datesVary: "Dates change yearly, check first",
    easierByCar: "Easier by car",
    goodWithKids: "Good with children",
    onlyOn: "Only on {days}",
    none: "Nothing in this group matches your dates.",
    categories: {
      restaurant: "Eat",
      cafe: "Cafés & sweets",
      winery: "Cellars",
      lake: "The lake",
      nature: "Walks & nature",
      culture: "Culture",
      market: "Markets",
      event: "Events around your dates",
      kids: "With children",
      wellness: "Baths & rest",
    },
  },
  email: {
    greeting: "Hello {name},",
    received: {
      subject: "We have your request · Aszófő",
      body: "Thank you for your request for {dates} ({guests}). We'll reply within two days.",
      link: "You can see your request here:",
      costs:
        "What it costs: {items}. We'll tell you how to pay when we confirm.",
    },
    approved: {
      subject: "Your stay in Aszófő is confirmed",
      body: "Good news: {dates} are yours.",
      link: "Everything you need is on your private page. Hunor's number and the arrival details appear there two weeks before you arrive, and the page stays open until {until}.",
      button: "Your stay page",
    },
    declined: {
      subject: "About your request for Aszófő",
      body: "Thank you for asking. Unfortunately we can't host you on {dates}.",
      link: "If other dates work for you, the calendar is here:",
    },
  },
};

export type Dict = typeof en;

const hu: Dict = {
  locale: "hu-HU",
  langName: "Magyar",
  meta: {
    title: "Aszófő · Présház a Balaton fölött",
    description:
      "Nádtetős présház a szőlők között, a Balaton fölött, legfeljebb hat vendégnek. Nézd meg a szabad időpontokat, és küldj foglalási kérést.",
  },
  nav: {
    house: "A ház",
    around: "Környék",
    seasons: "Évszakok",
    request: "Időpontot kérek",
    skip: "Ugrás a tartalomra",
  },
  hero: {
    eyebrow: "Aszófő · Balaton-felvidék",
    title: "Présház a szőlők között, a Balaton fölött.",
    lead: "Nádtető, vastag falak, zöld cserépkályha és boltíves pince. Öreg fák, szőlősorok, a láthatáron a tó.",
    cta: "Szabad időpontok",
    secondary: "Nézz körül",
    caption: "A présház egy augusztusi estén",
  },
  intro: {
    body: "A kilátás miatt vettük meg ezt a házat, és minden más miatt maradtunk: a diófák, az esti fény a szőlőn, ahogy a cserépkályha átmelegíti az egész szobát. Ez a családunk háza. Amikor nem vagyunk ott, szívesen megosztjuk olyanokkal, akik úgy vigyáznak rá, ahogy mi.",
    sign: "András és a család",
  },
  facts: [
    { value: "6", label: "vendég fér el" },
    { value: "3", label: "hálószoba öreg gerendák alatt" },
    { value: "6186 m²", label: "kert és szőlő" },
    { value: "0", label: "tévé, szándékosan" },
  ],
  house: {
    label: "A ház",
    rooms: {
      downstairs: {
        title: "Lent",
        body: "Egy hosszú tér a zöld cserépkályha körül. Hosszú asztal, fapadok, és kétszárnyú ajtó, amely egyenesen a teraszra nyílik.",
      },
      upstairs: {
        title: "Fent",
        body: "Három hálószoba látszó fagerendák alatt: a tóra néző nagy hálószoba, egy vendégszoba és egy gyerekszoba emeletes ágyakkal.",
      },
      cellar: {
        title: "A pince",
        body: "A ház alatt, egy rövid lépcső aljában van a téglaboltozatos pince, amiért a présház egykor épült. A legmelegebb hetekben is hűvös. Hozz egy üveget a közeli pincészetek valamelyikéből, és ott bontsd ki.",
      },
      outside: {
        title: "Kint",
        body: "Náddal árnyékolt, fedett terasz, kőpergola, tűzrakóhely, és öreg dió- meg gyümölcsfák, köztük annyi hellyel, hogy a gyerekek egy órára eltűnhessenek.",
      },
      vineyard: {
        title: "A szőlő",
        body: "A szőlősorok a domboldalon a víz felé futnak. Tiszta időben átlátni a tó túlpartjára, a somogyi dombokig.",
      },
    },
    alt: {
      front: "A fehér présház meredek nádtetővel, alkonyatkor",
      table: "Hosszú faasztal padokkal, a kertre nyíló nyitott ajtóval",
      stove: "A zöld cserépkályha a nappaliban",
      beams: "Emeleti hálószoba sötét fagerendák alatt",
      cellar: "A pince téglaboltozata",
      terrace: "A kert és két öreg fa a nádárnyékos terasz alól nézve",
      pergola: "A kőfal és a fa pergola a ház mellett",
      vinesLake: "Szőlősorok a Balaton felé",
      vinesHouse: "A szőlő, mögötte a nádtető",
      door: "A nappaliból a teraszra nyíló kétszárnyú ajtó",
    },
  },
  evenings: {
    title: "Tévé nincs. Szándékosan.",
    body: "Könyvek, társasjátékok, a cserépkályha, a tűzrakó, egy hosszú, későbe nyúló vacsora. A többit elintézi a kilátás.",
  },
  progress: {
    label: "Épül, szépül",
    body: "2027-ig szakaszosan újítjuk fel a házat: teraszra nyíló konyha, nagy ablak a fő hálószobában, rendes téli fűtés, később egy kis szauna a kertben. A válaszunkban megírjuk, mi készül el az általatok kért időpontra.",
  },
  seasons: {
    label: "Évszakok",
    title: "Négy évszak a szőlőhegyen",
    items: [
      {
        name: "Tavasz",
        body: "Mandula- és cseresznyevirágzás a lejtőkön, üres utak, séták a Káli-medencében, mielőtt beköszönt a meleg.",
      },
      {
        name: "Nyár",
        body: "Júniustól lehet fürdeni a tóban. Június végén és júliusban virágzik a levendula a Tihanyi-félszigeten, a teraszon hosszúak az esték.",
      },
      {
        name: "Ősz",
        body: "Szüret, újbor, enyhe napok a túrázáshoz. Szeptemberben a tó gyakran még fürdésre is jó.",
      },
      {
        name: "Tél",
        body: "Cserépkályha, dér a szőlőn, csendes falvak. A hévízi tó kb. egy órányira van.",
      },
    ],
  },
  around: {
    label: "Környék",
    title: "A ház körül",
    lead: "Aszófő a Tihanyi-félsziget tövében fekszik, Balatonfüred és a Káli-medence között. A legtöbb, amiért érdemes kocsiba ülni, fél órán belül van.",
    note: "A visszaigazolt vendégek saját oldalt kapnak, rajta éttermekkel, pincékkel, sétákkal és piacokkal, az időpontjukhoz és az érdeklődésükhöz válogatva.",
    minutes: "{n} perc",
    diagramLabel:
      "Helyek Aszófő körül, irány és autós menetidő szerint elhelyezve",
  },
  booking: {
    label: "Időpontok",
    title: "Szabad időpontok",
    lead: "Válaszd ki az érkezés és a távozás napját. Ez kérés, nem foglalás: két napon belül válaszolunk, és semmi sem kötelező, amíg vissza nem igazolod.",
    legend: {
      open: "Szabad",
      taken: "Foglalt",
      selected: "A ti időpontotok",
      today: "Ma",
    },
    chooseArrival: "Válaszd ki az érkezés napját",
    chooseDeparture: "Most válaszd ki a távozás napját",
    minNights: "Legalább {n} éjszaka",
    clear: "Dátumok törlése",
    prev: "Előző hónap",
    next: "Következő hónap",
    loading: "Nézzük a naptárat…",
    loadError: "Nem töltött be a naptár. Írj nekünk inkább ide: {email}",
    continue: "Tovább",
    back: "Vissza",
    steps: ["Időpont", "Vendégek", "Kívánságok"],
    fields: {
      name: "Neved",
      email: "E-mail",
      phone: "Telefon (nem kötelező)",
      adults: "Felnőttek",
      children: "Gyerekek",
      dog: "Kutyát is hoznánk",
      message: "Van valami, amit tudnunk kellene?",
      messageHint: "Kik jönnek, mit ünnepeltek, kérdések a házról.",
    },
    prefsIntro:
      "Néhány kérdés, egyik sem kötelező. Ha visszaigazoljuk a foglalást, a válaszaid alapján töltjük meg a saját vendégoldaladat hozzátok illő helyekkel.",
    group: {
      question: "Kik jönnek?",
      options: {
        couple: "Egy pár",
        friends: "Barátok",
        "family-young": "Család kisgyerekkel",
        "family-older": "Család nagyobb gyerekekkel",
        solo: "Csak én",
      },
    },
    interests: {
      question: "Mihez lenne kedvetek?",
      options: {
        wine: "Bor és pincék",
        food: "Jó ételek",
        lake: "A tó",
        walk: "Séta és túra",
        bike: "Kerékpár",
        culture: "Kultúra és történelem",
        market: "Piacok és kézművesek",
        slow: "Minél kevesebb",
        wellness: "Termálfürdő és spa",
      },
    },
    pace: {
      question: "Mennyire legyenek tele a napok?",
      options: {
        slow: "Lassan",
        balanced: "Egy kicsit mindkettő",
        full: "Tele programmal",
      },
    },
    transport: {
      question: "Hogyan érkeztek?",
      options: { car: "Autóval", train: "Vonattal", unsure: "Még nem tudjuk" },
    },
    food: "Étkezési szokások, allergiák",
    occasion: "Ünnepeltek valamit?",
    keysQuestion: "Kulcs",
    keysHunor: "Hunor enged be (20 €)",
    keysBudapest: "A kulcsot Budapesten vesszük át",
    keysRequired:
      "Októbertől áprilisig Hunor enged be, és ő intézi a vizet és a fűtést: a két útja 20 €.",
    thanksLabel: "Köszönet a házra (nem kötelező)",
    thanksHint:
      "Amennyit jónak érzel, euróban. Hagyd üresen, ha nem szeretnél.",
    consent:
      "Tudom, hogy ez csak kérés. Az adataimat csak a válaszhoz és a vendégséghez használjátok, utána törlitek.",
    submit: "Kérés elküldése",
    sending: "Küldés…",
    errors: {
      dates: "Válassz érvényes időpontot.",
      guests: "Nézd meg a vendégek számát (legfeljebb 6).",
      name: "Add meg a neved.",
      email: "Nézd meg az e-mail-címed.",
      consent: "Kérjük, erősítsd meg, hogy elolvastad a fenti megjegyzést.",
      taken: "Ezt az időpontot épp most foglalták le. Válassz másikat.",
      generic: "Valami hiba történt. Próbáld újra, vagy írj nekünk: {email}",
      storage: "A kérések most szünetelnek. Írj nekünk: {email}",
      rate: "Túl sok kérés érkezett erről a kapcsolatról. Próbáld később.",
    },
    success: {
      title: "Köszönjük, {name}.",
      body: "Megkaptuk a kérésed ({dates}). Két napon belül válaszolunk e-mailben, a másolatot elküldtük ide: {email}.",
      link: "A kérésed oldala",
    },
  },
  costs: {
    label: "Mennyibe kerül",
    lead: "Éjszakánkénti ár nincs. Csak azt kérjük, ami egy vendégséggel ténylegesen felmerül, akármeddig maradtok.",
    cleaning: "Takarítás",
    keys: "Hunor: kulcs, víz és fűtés (két alkalom)",
    keysNote:
      "Októbertől áprilisig szükséges. Májustól szeptemberig a kulcsot Budapesten is átveheted helyette.",
    budapest: "Kulcsátvétel Budapesten",
    thanks: "Köszönet",
    thanksValue: "Rajtad áll",
    thanksNote:
      "Ha ezen felül a házra is adnál valamit, te döntöd el, mennyit.",
    total: "Összesen",
    payNote: "A visszaigazolással együtt megírjuk, hogyan fizethetsz.",
  },
  practical: {
    label: "Jó tudni",
    items: [
      { term: "Érkezés", detail: "15:00-tól" },
      { term: "Távozás", detail: "11:00-ig" },
      { term: "Legrövidebb foglalás", detail: "2 éjszaka" },
      { term: "Vendégek", detail: "Legfeljebb 6, gyerekekkel is" },
      { term: "Kutya", detail: "Kérdezz minket" },
      { term: "Wifi", detail: "Nincs" },
      { term: "Az árban", detail: "Ágynemű, törölköző, tűzifa" },
      {
        term: "Megközelítés",
        detail:
          "Budapestről autóval kb. 2 óra, vagy közvetlen vonattal a faluig.",
      },
    ],
  },
  how: {
    label: "Hogyan működik",
    steps: [
      {
        title: "Kérés",
        body: "Válassz időpontot, és mesélj egy kicsit magatokról.",
      },
      {
        title: "Válasz",
        body: "Két napon belül válaszolunk, és megírjuk, hogyan fizethetsz.",
      },
      {
        title: "A saját oldalad",
        body: "Visszaigazolás után saját oldalt kapsz: útvonal, a ház, és helyek, amiket nektek választottunk. Az oldal a vendégséged végéig él.",
      },
    ],
  },
  footer: {
    place: "Aszófő, Balaton-felvidék",
    questions: "Kérdésed van?",
    hosted: "Családi ház, vendéglátó: András.",
  },
  units: {
    night: { one: "{n} éjszaka", other: "{n} éjszaka" },
    adult: { one: "{n} felnőtt", other: "{n} felnőtt" },
    child: { one: "{n} gyerek", other: "{n} gyerek" },
    day: { one: "{n} nap", other: "{n} nap" },
  },
  stay: {
    metaTitle: "A vendégséged · Aszófő",
    hello: "Szia, {name}!",
    helloPending: "Köszönjük, {name}.",
    status: {
      pending: "Kérés megérkezett",
      open: "Visszaigazolva",
      ended: "Lezárva",
      declined: "Nem megoldható",
      cancelled: "Lemondva",
    },
    countdown: {
      future: "Még {days}",
      tomorrow: "Holnap",
      today: "Ma",
      during: "{n} napból a {d}.",
      after: "Jó hazautat",
    },
    arrive: "Érkezés",
    depart: "Távozás",
    guests: "Vendégek",
    from: "{time}-tól",
    by: "{time}-ig",
    dog: "és egy kutya",
    pendingBody:
      "Megkaptuk a kérésed, két napon belül válaszolunk e-mailben. Ha visszaigazoltuk, ezen az oldalon találod majd az útvonalat, a ház tudnivalóit és a nektek válogatott helyeket.",
    declinedBody: "Sajnáljuk, ezekre a napokra nem tudunk vendégül látni.",
    cancelledBody:
      "Ezt a vendégséget lemondtuk. Ha ez meglepetés, írj nekünk: {email}",
    endedBody:
      "A vendégség véget ért, ezért ez az oldal bezárt. Köszönjük, hogy vigyáztatok a házra. Reméljük, még találkozunk.",
    otherDates: "Más időpontok",
    validUntil: "Ez az oldal {date}-ig a tiéd.",
    noteTitle: "Üzenet tőlünk",
    arriveTitle: "Megközelítés",
    address: "Cím",
    openMaps: "Megnyitás térképen",
    byCar: "Autóval",
    byTrain: "Vonattal",
    byPlane: "Repülővel",
    keysTitle: "Érkezés és kulcsok",
    revealLater:
      "Hunor telefonszáma és az érkezés részletei {n} nappal az érkezésed előtt jelennek meg itt.",
    notSetYet: "Érkezésed előtt kiegészítjük.",
    revealShort: "Az érkezésed előtt {n} nappal jelenik meg.",
    notFound:
      "Ez a link nem nyit meg vendégséget. Nézd meg a címet az e-mailben, vagy írj nekünk.",
    parking: "Parkolás",
    houseTitle: "A házban",
    noStreet:
      "A hegyen nincs utcanév és házszám. Használd a jelölést, vagy bármelyik térképen a plus code-ot.",
    plusCode: "Plus code",
    keysHunorBody:
      "{name} viszi a kulcsot és készíti elő a házat, a hidegebb hónapokban a vízzel és a fűtéssel együtt. Pár nappal az érkezésed előtt hívd fel, és beszéljetek meg mindent.",
    keysPickupBody: "A kulcsot Budapesten veszed át:",
    keysPickupAfter: "Írj nekünk WhatsAppon, és megbeszéljük az időpontot.",
    callKey: "{name} hívása",
    costsTitle: "Költségek",
    whatsapp: "WhatsApp: {name}",
    favourites: "A kedvenceink",
    hostPick: "Kedvencünk",
    manualTitle: "Hogyan működik a ház",
    leaveTitle: "Mielőtt elindulsz",
    picksTitle: "Nektek válogattuk",
    picksLead:
      "Az időpontotokhoz és ahhoz válogatva, amit írtatok. Lejjebb minden más is ott van a környékről.",
    picksLeadNoPrefs:
      "Az időpontotokhoz válogatva. Írd meg, mit szerettek (elég válaszolni az e-mailünkre), és finomítunk a listán.",
    because: "Mert: {x}",
    inSeason: "Nyitva, amikor itt vagytok",
    allTitle: "A ház körül",
    mapTitle: "Térképen",
    essentialsTitle: "Hétköznapi dolgok",
    contactTitle: "Ha szükséged van ránk",
    emergency: "Segélyhívó: mentők, tűzoltók, rendőrség",
    call: "Hívás",
    write: "E-mail",
    directions: "Útvonal",
    website: "Weboldal",
    bookAhead: "Foglalás ajánlott",
    datesVary: "Évente változik, nézd meg előre",
    easierByCar: "Autóval egyszerűbb",
    goodWithKids: "Gyerekekkel is jó",
    onlyOn: "Csak: {days}",
    none: "Ebben a csoportban semmi sem esik a ti időpontotokra.",
    categories: {
      restaurant: "Enni",
      cafe: "Kávé és édesség",
      winery: "Pincék",
      lake: "A tó",
      nature: "Séták és természet",
      culture: "Kultúra",
      market: "Piacok",
      event: "Rendezvények az időpontotok körül",
      kids: "Gyerekekkel",
      wellness: "Fürdők és pihenés",
    },
  },
  email: {
    greeting: "Szia {name}!",
    received: {
      subject: "Megkaptuk a kérésed · Aszófő",
      body: "Köszönjük a kérésed: {dates} ({guests}). Két napon belül válaszolunk.",
      link: "A kérésed itt látod:",
      costs:
        "A költségek: {items}. A visszaigazolással együtt megírjuk, hogyan fizethetsz.",
    },
    approved: {
      subject: "Visszaigazoltuk az aszófői vendégséged",
      body: "Jó hír: visszaigazoltuk a foglalást ({dates}).",
      link: "Minden tudnivalót megtalálsz a saját oldaladon. Hunor telefonszáma és az érkezés részletei két héttel az érkezésed előtt jelennek meg, az oldal pedig {until}-ig nyitva marad.",
      button: "A vendégoldalad",
    },
    declined: {
      subject: "Az aszófői kérésedről",
      body: "Köszönjük, hogy minket választottál. Sajnos erre az időpontra ({dates}) nem tudunk vendégül látni.",
      link: "Ha más időpont is jó, itt a naptár:",
    },
  },
};

const de: Dict = {
  locale: "de-DE",
  langName: "Deutsch",
  meta: {
    title: "Aszófő · Ein Presshaus über dem Balaton",
    description:
      "Ein reetgedecktes Presshaus zwischen Reben über dem Balaton, für bis zu sechs Gäste. Freie Termine ansehen und eine Anfrage senden.",
  },
  nav: {
    house: "Das Haus",
    around: "Umgebung",
    seasons: "Jahreszeiten",
    request: "Termin anfragen",
    skip: "Zum Inhalt springen",
  },
  hero: {
    eyebrow: "Aszófő · Balaton-Oberland · Ungarn",
    title: "Ein Presshaus zwischen Reben, über dem Balaton.",
    lead: "Reetdach, dicke Mauern, ein grüner Kachelofen und ein Gewölbekeller. Alte Bäume, Rebzeilen und der See am Horizont.",
    cta: "Freie Termine",
    secondary: "Umsehen",
    caption: "Das Presshaus an einem Augustabend",
  },
  intro: {
    body: "Wir haben dieses Haus wegen der Aussicht gekauft und sind wegen allem anderen geblieben: die Nussbäume, das Abendlicht auf den Reben, die Art, wie der Kachelofen den ganzen Raum wärmt. Es ist das Haus unserer Familie. Wenn wir nicht da sind, teilen wir es gern mit Menschen, die es so behandeln wie wir.",
    sign: "Andras & Familie",
  },
  facts: [
    { value: "6", label: "Gäste höchstens" },
    { value: "3", label: "Schlafzimmer unter alten Balken" },
    { value: "6.186 m²", label: "Garten und Weinberg" },
    { value: "0", label: "Fernseher, mit Absicht" },
  ],
  house: {
    label: "Das Haus",
    rooms: {
      downstairs: {
        title: "Unten",
        body: "Ein langer Raum um den grünen Kachelofen. Ein langer Tisch, Holzbänke und eine Flügeltür, die direkt auf die Terrasse führt.",
      },
      upstairs: {
        title: "Oben",
        body: "Drei Schlafzimmer unter sichtbaren Holzbalken: ein Hauptschlafzimmer zum See, ein Gästezimmer und ein Kinderzimmer mit Etagenbetten.",
      },
      cellar: {
        title: "Der Keller",
        body: "Eine kurze Treppe unter dem Haus führt in den Ziegelgewölbekeller, für den das Presshaus einst gebaut wurde. Auch in den heißesten Wochen bleibt er kühl. Bringen Sie eine Flasche von einem der Weingüter in der Nähe mit und öffnen Sie sie dort unten.",
      },
      outside: {
        title: "Draußen",
        body: "Eine überdachte Terrasse mit Schilfschatten, eine Steinpergola, eine Feuerstelle und alte Nuss- und Obstbäume, zwischen denen Kinder für eine Stunde verschwinden können.",
      },
      vineyard: {
        title: "Der Weinberg",
        body: "Die Rebzeilen laufen den Hang hinunter zum Wasser. An klaren Tagen sieht man über den See bis zu den Hügeln am Südufer.",
      },
    },
    alt: {
      front: "Das weiße Presshaus mit steilem Reetdach in der Abenddämmerung",
      table: "Ein langer Holztisch mit Bänken, die Tür zum Garten offen",
      stove: "Der grüne Kachelofen im Wohnraum",
      beams: "Ein Schlafzimmer im Obergeschoss unter dunklen Holzbalken",
      cellar: "Das Ziegelgewölbe des Kellers",
      terrace:
        "Der Garten mit zwei alten Bäumen, gesehen von der schilfbeschatteten Terrasse",
      pergola: "Die Steinmauer und die Holzpergola neben dem Haus",
      vinesLake: "Rebzeilen, die zum Balaton hinunterführen",
      vinesHouse: "Der Weinberg, dahinter das Reetdach",
      door: "Die Flügeltür vom Wohnraum auf die Terrasse",
    },
  },
  evenings: {
    title: "Kein Fernseher. Mit Absicht.",
    body: "Bücher, Brettspiele, der Kachelofen, die Feuerstelle, ein langes Abendessen, das spät endet. Den Rest erledigt die Aussicht.",
  },
  progress: {
    label: "Im Werden",
    body: "Bis 2027 renovieren wir in Etappen: eine Küche, die sich zur Terrasse öffnet, ein großes Fenster im Hauptschlafzimmer, eine richtige Heizung für den Winter und später eine kleine Sauna im Garten. In unserer Antwort schreiben wir, was zu Ihren Daten fertig ist.",
  },
  seasons: {
    label: "Jahreszeiten",
    title: "Vier Jahreszeiten am Weinberg",
    items: [
      {
        name: "Frühling",
        body: "Mandel- und Kirschblüte an den Hängen, leere Straßen, Wanderungen im Káli-Becken, bevor es heiß wird.",
      },
      {
        name: "Sommer",
        body: "Ab Juni ist der See warm genug zum Schwimmen. Ende Juni und im Juli blüht der Lavendel auf der Halbinsel Tihany, und die Abende auf der Terrasse sind lang.",
      },
      {
        name: "Herbst",
        body: "Weinlese, junger Wein und milde Tage zum Wandern. Baden kann man oft noch im September.",
      },
      {
        name: "Winter",
        body: "Der Kachelofen, Raureif auf den Reben, stille Dörfer. Der Thermalsee von Hévíz ist etwa eine Stunde entfernt.",
      },
    ],
  },
  around: {
    label: "Umgebung",
    title: "Rund um das Haus",
    lead: "Aszófő liegt am Ansatz der Halbinsel Tihany, zwischen Balatonfüred und dem Káli-Becken. Das meiste, wofür sich die Fahrt lohnt, erreichen Sie in einer halben Stunde.",
    note: "Bestätigte Gäste bekommen eine eigene Seite mit Restaurants, Weinkellern, Wanderungen und Märkten, ausgewählt nach Reisedaten und Interessen.",
    minutes: "{n} Min.",
    diagramLabel:
      "Orte rund um Aszófő, nach Richtung und Fahrzeit vom Haus angeordnet",
  },
  booking: {
    label: "Termine",
    title: "Freie Termine",
    lead: "Wählen Sie Anreise und Abreise. Das ist eine Anfrage, keine Buchung: Wir antworten innerhalb von zwei Tagen, und nichts ist verbindlich, bevor Sie bestätigen.",
    legend: {
      open: "Frei",
      taken: "Belegt",
      selected: "Ihr Aufenthalt",
      today: "Heute",
    },
    chooseArrival: "Wählen Sie den Anreisetag",
    chooseDeparture: "Jetzt den Abreisetag wählen",
    minNights: "Mindestens {n} Nächte",
    clear: "Auswahl löschen",
    prev: "Vorheriger Monat",
    next: "Nächster Monat",
    loading: "Kalender wird geladen…",
    loadError:
      "Der Kalender konnte nicht geladen werden. Schreiben Sie uns stattdessen: {email}",
    continue: "Weiter",
    back: "Zurück",
    steps: ["Termin", "Gäste", "Wünsche"],
    fields: {
      name: "Ihr Name",
      email: "E-Mail",
      phone: "Telefon (optional)",
      adults: "Erwachsene",
      children: "Kinder",
      dog: "Wir möchten einen Hund mitbringen",
      message: "Gibt es etwas, das wir wissen sollten?",
      messageHint: "Wer kommt, was Sie feiern, Fragen zum Haus.",
    },
    prefsIntro:
      "Ein paar Fragen, alle freiwillig. Wenn wir bestätigen, füllen wir mit Ihren Antworten Ihre persönliche Gästeseite mit Orten, die zu Ihnen passen.",
    group: {
      question: "Wer kommt?",
      options: {
        couple: "Ein Paar",
        friends: "Freunde",
        "family-young": "Familie mit kleinen Kindern",
        "family-older": "Familie mit größeren Kindern",
        solo: "Nur ich",
      },
    },
    interests: {
      question: "Worauf haben Sie Lust?",
      options: {
        wine: "Wein & Keller",
        food: "Gutes Essen",
        lake: "Der See",
        walk: "Spazieren & Wandern",
        bike: "Radfahren",
        culture: "Kultur & Geschichte",
        market: "Märkte & Handwerk",
        slow: "Möglichst wenig",
        wellness: "Thermalbad & Spa",
      },
    },
    pace: {
      question: "Wie voll sollen die Tage sein?",
      options: { slow: "Ruhig", balanced: "Von beidem etwas", full: "Voll" },
    },
    transport: {
      question: "Wie reisen Sie an?",
      options: {
        car: "Mit dem Auto",
        train: "Mit dem Zug",
        unsure: "Noch offen",
      },
    },
    food: "Ernährung oder Allergien",
    occasion: "Gibt es etwas zu feiern?",
    keysQuestion: "Schlüssel",
    keysHunor: "Hunor lässt uns ein (20 €)",
    keysBudapest: "Wir holen die Schlüssel in Budapest ab",
    keysRequired:
      "Von Oktober bis April lässt Hunor Sie ein und kümmert sich um Wasser und Heizung: 20 € für seine zwei Besuche.",
    thanksLabel: "Ein Dankeschön für das Haus (freiwillig)",
    thanksHint:
      "Was sich richtig anfühlt, in Euro. Leer lassen, wenn Sie nicht möchten.",
    consent:
      "Mir ist klar, dass dies eine Anfrage ist. Die Angaben werden nur für die Antwort und den Aufenthalt verwendet und danach gelöscht.",
    submit: "Anfrage senden",
    sending: "Wird gesendet…",
    errors: {
      dates: "Bitte wählen Sie gültige Daten.",
      guests: "Bitte prüfen Sie die Zahl der Gäste (höchstens 6).",
      name: "Bitte geben Sie Ihren Namen an.",
      email: "Bitte prüfen Sie Ihre E-Mail-Adresse.",
      consent: "Bitte bestätigen Sie den Hinweis oben.",
      taken: "Diese Tage wurden gerade vergeben. Bitte wählen Sie andere.",
      generic:
        "Etwas ist schiefgegangen. Bitte versuchen Sie es erneut oder schreiben Sie an {email}.",
      storage:
        "Anfragen sind gerade nicht möglich. Bitte schreiben Sie an {email}.",
      rate: "Zu viele Anfragen von dieser Verbindung. Bitte später erneut versuchen.",
    },
    success: {
      title: "Vielen Dank, {name}.",
      body: "Ihre Anfrage für {dates} ist bei uns. Wir antworten innerhalb von zwei Tagen per E-Mail, eine Kopie ging an {email}.",
      link: "Ihre Anfrageseite",
    },
  },
  costs: {
    label: "Was es kostet",
    lead: "Es gibt keinen Preis pro Nacht. Wir bitten nur um das, was ein Aufenthalt uns tatsächlich kostet, egal wie lange Sie bleiben.",
    cleaning: "Reinigung",
    keys: "Hunor: Schlüssel, Wasser und Heizung (zwei Besuche)",
    keysNote:
      "Von Oktober bis April nötig. Von Mai bis September können Sie die Schlüssel stattdessen in Budapest abholen.",
    budapest: "Schlüssel in Budapest abgeholt",
    thanks: "Ein Dankeschön",
    thanksValue: "Ganz nach Ihnen",
    thanksNote:
      "Wenn Sie darüber hinaus etwas für das Haus geben möchten, bestimmen Sie den Betrag.",
    total: "Gesamt",
    payNote:
      "Mit der Bestätigung schreiben wir Ihnen, wie Sie bezahlen können.",
  },
  practical: {
    label: "Gut zu wissen",
    items: [
      { term: "Anreise", detail: "ab 15:00" },
      { term: "Abreise", detail: "bis 11:00" },
      { term: "Mindestaufenthalt", detail: "2 Nächte" },
      { term: "Gäste", detail: "bis zu 6, Kinder willkommen" },
      { term: "Hunde", detail: "Bitte fragen" },
      { term: "WLAN", detail: "Keins" },
      { term: "Inklusive", detail: "Bettwäsche, Handtücher, Brennholz" },
      {
        term: "Anfahrt",
        detail:
          "Mit dem Auto etwa 2 Stunden ab Budapest, oder mit dem Direktzug bis ins Dorf.",
      },
    ],
  },
  how: {
    label: "So funktioniert es",
    steps: [
      {
        title: "Anfrage",
        body: "Termin wählen und ein wenig über Ihre Gruppe erzählen.",
      },
      {
        title: "Antwort",
        body: "Wir antworten innerhalb von zwei Tagen und sagen Ihnen, wie Sie die kleinen Kosten bezahlen.",
      },
      {
        title: "Ihre Seite",
        body: "Nach der Bestätigung bekommen Sie eine eigene Seite: Anfahrt, das Haus und Orte, die wir für Sie ausgesucht haben. Sie bleibt bis zum Ende Ihres Aufenthalts offen.",
      },
    ],
  },
  footer: {
    place: "Aszófő, Balaton-Oberland, Ungarn",
    questions: "Fragen?",
    hosted: "Ein Familienhaus. Gastgeber: Andras.",
  },
  units: {
    night: { one: "{n} Nacht", other: "{n} Nächte" },
    adult: { one: "{n} Erwachsener", other: "{n} Erwachsene" },
    child: { one: "{n} Kind", other: "{n} Kinder" },
    day: { one: "{n} Tag", other: "{n} Tage" },
  },
  stay: {
    metaTitle: "Ihr Aufenthalt · Aszófő",
    hello: "Willkommen, {name}.",
    helloPending: "Vielen Dank, {name}.",
    status: {
      pending: "Anfrage erhalten",
      open: "Bestätigt",
      ended: "Geschlossen",
      declined: "Leider nicht möglich",
      cancelled: "Storniert",
    },
    countdown: {
      future: "Noch {days}",
      tomorrow: "Morgen",
      today: "Heute",
      during: "Tag {d} von {n}",
      after: "Gute Heimreise",
    },
    arrive: "Anreise",
    depart: "Abreise",
    guests: "Gäste",
    from: "ab {time}",
    by: "bis {time}",
    dog: "und ein Hund",
    pendingBody:
      "Ihre Anfrage ist bei uns, wir antworten innerhalb von zwei Tagen per E-Mail. Sobald der Aufenthalt bestätigt ist, finden Sie hier Anfahrt, Hinweise zum Haus und Orte, die wir für Sie ausgesucht haben.",
    declinedBody:
      "Es tut uns leid, an diesen Tagen können wir Sie nicht empfangen.",
    cancelledBody:
      "Dieser Aufenthalt wurde storniert. Falls das überraschend kommt, schreiben Sie uns bitte: {email}",
    endedBody:
      "Der Aufenthalt ist vorbei, deshalb ist diese Seite jetzt geschlossen. Danke, dass Sie gut auf das Haus aufgepasst haben. Wir hoffen, Sie wiederzusehen.",
    otherDates: "Andere Termine",
    validUntil: "Diese Seite gehört Ihnen bis {date}.",
    noteTitle: "Eine Nachricht von uns",
    arriveTitle: "Anfahrt",
    address: "Adresse",
    openMaps: "In Karten öffnen",
    byCar: "Mit dem Auto",
    byTrain: "Mit dem Zug",
    byPlane: "Mit dem Flugzeug",
    keysTitle: "Ankunft und Schlüssel",
    revealLater:
      "Hunors Nummer und die Details zur Ankunft erscheinen hier {n} Tage vor Ihrer Anreise.",
    notSetYet: "Wir ergänzen das vor Ihrer Anreise.",
    revealShort: "Erscheint {n} Tage vor Ihrer Anreise.",
    notFound:
      "Dieser Link führt zu keinem Aufenthalt. Prüfen Sie die Adresse in Ihrer E-Mail oder schreiben Sie uns.",
    parking: "Parken",
    houseTitle: "Im Haus",
    noStreet:
      "Oben am Hang gibt es keine Straßenadresse. Nutzen Sie die Markierung oder den Plus Code in einer Karten-App.",
    plusCode: "Plus Code",
    keysHunorBody:
      "{name} hat die Schlüssel und bereitet das Haus vor, in den kälteren Monaten auch Wasser und Heizung. Rufen Sie ihn ein paar Tage vor der Anreise an und besprechen Sie alles.",
    keysPickupBody: "Sie holen die Schlüssel in Budapest ab:",
    keysPickupAfter:
      "Schreiben Sie uns auf WhatsApp, dann vereinbaren wir eine Zeit.",
    callKey: "{name} anrufen",
    costsTitle: "Ihre Kosten",
    whatsapp: "WhatsApp an {name}",
    favourites: "Unsere Favoriten",
    hostPick: "Unser Favorit",
    manualTitle: "Wie das Haus funktioniert",
    leaveTitle: "Vor der Abreise",
    picksTitle: "Für Sie ausgesucht",
    picksLead:
      "Ausgewählt nach Ihren Daten und Ihren Antworten. Alles andere in der Nähe folgt weiter unten.",
    picksLeadNoPrefs:
      "Ausgewählt nach Ihren Daten. Schreiben Sie uns, was Ihnen gefällt (einfach auf unsere E-Mail antworten), dann passen wir die Liste an.",
    because: "Für: {x}",
    inSeason: "Geöffnet während Ihres Aufenthalts",
    allTitle: "Rund um das Haus",
    mapTitle: "Auf der Karte",
    essentialsTitle: "Alltägliches",
    contactTitle: "Wenn Sie uns brauchen",
    emergency: "Notruf: Rettung, Feuerwehr, Polizei",
    call: "Anrufen",
    write: "E-Mail",
    directions: "Route",
    website: "Website",
    bookAhead: "Reservierung empfohlen",
    datesVary: "Termin wechselt jährlich, bitte prüfen",
    easierByCar: "Besser mit dem Auto",
    goodWithKids: "Gut mit Kindern",
    onlyOn: "Nur {days}",
    none: "In dieser Gruppe passt nichts zu Ihren Daten.",
    categories: {
      restaurant: "Essen",
      cafe: "Cafés & Süßes",
      winery: "Weinkeller",
      lake: "Der See",
      nature: "Wandern & Natur",
      culture: "Kultur",
      market: "Märkte",
      event: "Veranstaltungen rund um Ihre Daten",
      kids: "Mit Kindern",
      wellness: "Bäder & Ruhe",
    },
  },
  email: {
    greeting: "Hallo {name},",
    received: {
      subject: "Ihre Anfrage ist da · Aszófő",
      body: "vielen Dank für Ihre Anfrage für {dates} ({guests}). Wir antworten innerhalb von zwei Tagen.",
      link: "Ihre Anfrage können Sie hier ansehen:",
      costs:
        "Die Kosten: {items}. Mit der Bestätigung schreiben wir Ihnen, wie Sie bezahlen können.",
    },
    approved: {
      subject: "Ihr Aufenthalt in Aszófő ist bestätigt",
      body: "gute Nachricht: Wir haben Ihren Aufenthalt bestätigt ({dates}).",
      link: "Alles Wichtige steht auf Ihrer persönlichen Seite. Hunors Nummer und die Details zur Ankunft erscheinen dort zwei Wochen vor der Anreise, und die Seite bleibt bis {until} geöffnet.",
      button: "Ihre Gästeseite",
    },
    declined: {
      subject: "Zu Ihrer Anfrage für Aszófő",
      body: "vielen Dank für Ihre Anfrage. Leider können wir Sie im Zeitraum {dates} nicht empfangen.",
      link: "Falls andere Termine passen, hier ist der Kalender:",
    },
  },
};

const DICTS: Record<Lang, Dict> = { en, hu, de };

export function dict(lang: Lang): Dict {
  return DICTS[lang];
}

export function fill(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}

export function plural(
  lang: Lang,
  n: number,
  forms: { one: string; other: string },
): string {
  const rule = new Intl.PluralRules(DICTS[lang].locale).select(n);
  return fill(rule === "one" ? forms.one : forms.other, { n });
}

const dateOpts: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
};

export function formatDate(
  lang: Lang,
  iso: string,
  opts: Intl.DateTimeFormatOptions = dateOpts,
): string {
  return new Intl.DateTimeFormat(DICTS[lang].locale, {
    ...opts,
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

// Hungarian dates end in a period ("2027. április 18."), which has to go
// before a suffix like -ig is attached.
export function formatDateForSuffix(lang: Lang, iso: string): string {
  const text = formatDate(lang, iso);
  return lang === "hu" ? text.replace(/\.$/, "") : text;
}

export function formatRange(lang: Lang, start: string, end: string): string {
  const f = new Intl.DateTimeFormat(DICTS[lang].locale, dateOpts);
  return f.formatRange(
    new Date(`${start}T00:00:00Z`),
    new Date(`${end}T00:00:00Z`),
  );
}

export function guestLine(
  lang: Lang,
  adults: number,
  children: number,
): string {
  const d = DICTS[lang];
  const parts = [plural(lang, adults, d.units.adult)];
  if (children > 0) parts.push(plural(lang, children, d.units.child));
  return parts.join(", ");
}
