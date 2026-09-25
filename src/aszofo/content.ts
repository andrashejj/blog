// Place names and practical knowledge that the pages share. Descriptions of
// individual restaurants, cellars and sights live in places.json.

import type { Lang } from "./config";

type Localized = Record<Lang, string>;

export interface Destination {
  name: Localized;
  lat: number;
  lng: number;
  minutes: number; // by car from the house
}

// The ripple diagram and distance list on the public page.
export const destinations: Destination[] = [
  {
    name: { en: "Örvényes mill", hu: "Örvényesi malom", de: "Mühle Örvényes" },
    lat: 46.9151,
    lng: 17.8125,
    minutes: 4,
  },
  {
    name: { en: "Tihany Abbey", hu: "Tihanyi apátság", de: "Abtei Tihany" },
    lat: 46.9142,
    lng: 17.8893,
    minutes: 10,
  },
  {
    name: { en: "Balatonfüred", hu: "Balatonfüred", de: "Balatonfüred" },
    lat: 46.9551,
    lng: 17.8928,
    minutes: 12,
  },
  {
    name: { en: "Pécsely", hu: "Pécsely", de: "Pécsely" },
    lat: 46.9525,
    lng: 17.7836,
    minutes: 12,
  },
  {
    name: { en: "Káli Basin", hu: "Káli-medence", de: "Káli-Becken" },
    lat: 46.8818,
    lng: 17.6072,
    minutes: 25,
  },
  {
    name: {
      en: "Nagyvázsony castle",
      hu: "Nagyvázsonyi vár",
      de: "Burg Nagyvázsony",
    },
    lat: 46.9837,
    lng: 17.6965,
    minutes: 25,
  },
  {
    name: { en: "Veszprém", hu: "Veszprém", de: "Veszprém" },
    lat: 47.0931,
    lng: 17.9115,
    minutes: 30,
  },
  {
    name: { en: "Badacsony", hu: "Badacsony", de: "Badacsony" },
    lat: 46.8018,
    lng: 17.5045,
    minutes: 40,
  },
  {
    name: { en: "Hévíz", hu: "Hévíz", de: "Hévíz" },
    lat: 46.7896,
    lng: 17.1893,
    minutes: 65,
  },
  {
    name: { en: "Budapest", hu: "Budapest", de: "Budapest" },
    lat: 47.4979,
    lng: 19.0402,
    minutes: 120,
  },
];

export const lakeName: Localized = {
  en: "Lake Balaton",
  hu: "Balaton",
  de: "Balaton",
};

// ---------------------------------------------------------------- guest page

type LocalizedList = Record<Lang, string[]>;

// Ways to arrive. Checked against the MÁV timetable and road routes; update
// when the timetable changes each December.
export const travel: Record<"car" | "train" | "plane", Localized> = {
  car: {
    en: "From Budapest, take the M7 toward Lake Balaton, leave at the Balatonvilágos exit and follow road 71 along the north shore to Balatonfüred and on to Aszófő. About 2 hours, longer on summer Friday afternoons. From Vienna, about 3½ hours via Győr and Veszprém. Both countries' motorways need an e-vignette.",
    hu: "Budapestről az M7-esen a Balaton felé, a balatonvilágosi lehajtónál le, majd a 71-es úton az északi parton Balatonfüredig és tovább Aszófőig. Kb. 2 óra, nyári péntek délután több. Bécsből Győrön és Veszprémen át kb. 3,5 óra. Az autópályákhoz e-matrica kell.",
    de: "Von Budapest über die M7 Richtung Balaton, Ausfahrt Balatonvilágos, dann auf der Straße 71 am Nordufer bis Balatonfüred und weiter nach Aszófő. Etwa 2 Stunden, an Sommerfreitagen länger. Von Wien etwa 3½ Stunden über Győr und Veszprém. In Österreich und Ungarn brauchen Sie eine Vignette.",
  },
  train: {
    en: "Direct trains run from Budapest-Déli (and Kelenföld a few minutes later) to Aszófő in about 2 hours, no change needed: every two hours outside summer, more often in season. The station is on the southern edge of the village, 500 m below the centre. Tell us your train and we'll help with the last stretch up the hill.",
    hu: "Budapest-Déliből (és pár perccel később Kelenföldről) közvetlen vonat jár Aszófőre, kb. 2 óra, átszállás nélkül: nyáron kívül kétóránként, szezonban sűrűbben. Az állomás a falu déli szélén van, 500 méterrel a központ alatt. Írd meg, melyik vonattal jössz, és segítünk az utolsó szakaszon fel a hegyre.",
    de: "Direktzüge fahren ab Budapest-Déli (und wenige Minuten später ab Kelenföld) in etwa 2 Stunden ohne Umsteigen nach Aszófő: außerhalb des Sommers alle zwei Stunden, in der Saison öfter. Der Bahnhof liegt am Südrand des Dorfes, 500 m unterhalb des Ortskerns. Sagen Sie uns Ihren Zug, dann helfen wir beim letzten Stück den Hügel hinauf.",
  },
  plane: {
    en: "Budapest Airport is about 2½ hours away by car, Vienna about 3½. From Budapest you can also take the train: into the city, then the direct train from Kelenföld or Déli. Hévíz–Balaton Airport, 1½ hours away, has only a few seasonal charter flights.",
    hu: "A budapesti repülőtér autóval kb. 2,5 óra, a bécsi kb. 3,5. Budapestről vonattal is lehet jönni: be a városba, onnan Kelenföldről vagy a Déliből közvetlen vonat. A másfél órára lévő Hévíz–Balaton repülőtérre csak néhány szezonális charterjárat érkezik.",
    de: "Der Flughafen Budapest ist mit dem Auto etwa 2½ Stunden entfernt, Wien etwa 3½. Von Budapest geht es auch mit der Bahn: in die Stadt, dann mit dem Direktzug ab Kelenföld oder Déli. Der Flughafen Hévíz–Balaton, 1½ Stunden entfernt, hat nur einige saisonale Charterflüge.",
  },
};

// How the house works. Safety first; the host adds house-specific notes in
// the admin settings.
export const manual: LocalizedList = {
  en: [
    "The tile stove: ask us before you light it the first time. Never close the flue while anything inside is still glowing.",
    "The cellar stair is steep and the vault is low at the sides. Take the light, and keep small children with you.",
    "The fire pit: only on calm evenings and never during a fire ban, which is announced in dry summers. Keep a bucket of water beside it.",
    "The hill is quiet at night. Please keep music indoors after 22:00.",
  ],
  hu: [
    "A cserépkályha: az első begyújtás előtt szólj nekünk. Soha ne zárd le a füstcsövet, amíg bármi parázslik benne.",
    "A pincelépcső meredek, a boltív oldalt alacsony. Vigyél lámpát, a kisgyerekeket pedig ne engedd le egyedül.",
    "A tűzrakó: csak szélcsendes estén, és soha tűzgyújtási tilalom idején, amelyet száraz nyarakon hirdetnek ki. Legyen mellette egy vödör víz.",
    "A hegyen csendesek az éjszakák. 22 óra után kérünk, a zene maradjon a házban.",
  ],
  de: [
    "Der Kachelofen: Bitte sprechen Sie vor dem ersten Anheizen mit uns. Schließen Sie die Klappe nie, solange noch etwas glüht.",
    "Die Kellertreppe ist steil und das Gewölbe an den Seiten niedrig. Nehmen Sie Licht mit und lassen Sie kleine Kinder nicht allein hinunter.",
    "Die Feuerstelle: nur an windstillen Abenden und nie während eines Feuerverbots, das in trockenen Sommern ausgerufen wird. Ein Eimer Wasser gehört daneben.",
    "Nachts ist es auf dem Hügel still. Nach 22 Uhr bitte Musik nur im Haus.",
  ],
};

export const beforeYouLeave: LocalizedList = {
  en: [
    "Windows closed, doors locked",
    "Fire pit out, stove flue left as we showed you",
    "Dishes done, fridge emptied",
    "Rubbish sorted and out",
    "Keys back where you found them",
  ],
  hu: [
    "Ablakok becsukva, ajtók bezárva",
    "Tűzrakó kioltva, a kályha úgy hagyva, ahogy mutattuk",
    "Mosogatás kész, hűtő kiürítve",
    "Szemét szelektálva, kivíve",
    "Kulcsok vissza oda, ahol találtátok",
  ],
  de: [
    "Fenster zu, Türen abgeschlossen",
    "Feuerstelle aus, Ofenklappe so, wie wir es gezeigt haben",
    "Geschirr gespült, Kühlschrank leer",
    "Müll getrennt und draußen",
    "Schlüssel dorthin zurück, wo Sie sie gefunden haben",
  ],
};

export interface Essential {
  label: Localized;
  name: string;
  detail: Localized;
  lat?: number;
  lng?: number;
  // A phone or web link instead of directions.
  href?: string;
}

// Checked in September 2026 against the operators' sites, the village's
// "useful information" page and the Balatonfüred on-call rota.
export const essentials: Essential[] = [
  {
    label: { en: "In the village", hu: "A faluban", de: "Im Dorf" },
    name: "Bölcsek Kamrája",
    detail: {
      en: "Small grocery and deli on road 71 at the station turn-off (Tihanyi utca 17). Usually 7:00–20:00.",
      hu: "Kis élelmiszerbolt és csemege a 71-es úton, az állomási leágazásnál (Tihanyi utca 17.). Általában 7:00–20:00.",
      de: "Kleiner Lebensmittelladen mit Feinkost an der Straße 71, an der Abzweigung zum Bahnhof (Tihanyi utca 17). Meist 7:00–20:00.",
    },
    lat: 46.9252,
    lng: 17.8391,
  },
  {
    label: { en: "Supermarket", hu: "Nagybevásárlás", de: "Supermarkt" },
    name: "Tesco, Balatonfüred",
    detail: {
      en: "Széchenyi utca 55, 7 minutes by car, open until 22:00. A pharmacy and a petrol station are on the same site; ALDI and PENNY are on the same road.",
      hu: "Széchenyi utca 55., autóval 7 perc, 22 óráig nyitva. Ugyanott gyógyszertár és benzinkút; ugyanebben az utcában ALDI és PENNY is van.",
      de: "Széchenyi utca 55, 7 Minuten mit dem Auto, bis 22 Uhr geöffnet. Apotheke und Tankstelle auf demselben Gelände; ALDI und PENNY an derselben Straße.",
    },
    lat: 46.9483,
    lng: 17.8777,
  },
  {
    label: { en: "Bakery", hu: "Pékség", de: "Bäckerei" },
    name: "Péklány, Balatonfüred",
    detail: {
      en: "Sourdough bread at Szent István tér 5–7. Tue–Fri 7:00–17:00, Mon from 7:30, Sat until 12:00, closed Sunday.",
      hu: "Kovászos kenyér a Szent István tér 5–7. alatt. Kedd–péntek 7:00–17:00, hétfőn 7:30-tól, szombaton 12-ig, vasárnap zárva.",
      de: "Sauerteigbrot am Szent István tér 5–7. Di–Fr 7:00–17:00, Mo ab 7:30, Sa bis 12:00, sonntags geschlossen.",
    },
    lat: 46.9611,
    lng: 17.8754,
  },
  {
    label: { en: "Pharmacy", hu: "Gyógyszertár", de: "Apotheke" },
    name: "Rozmaring, Tihany",
    detail: {
      en: "The nearest, with short hours: Mon, Wed and Fri 8:00–12:00, Tue and Thu 13:00–17:00. Otherwise use the pharmacy inside Tesco Balatonfüred.",
      hu: "A legközelebbi, rövid nyitvatartással: hétfő, szerda, péntek 8:00–12:00, kedd és csütörtök 13:00–17:00. Máskor a balatonfüredi Tescóban lévő gyógyszertár.",
      de: "Die nächste, mit kurzen Zeiten: Mo, Mi und Fr 8:00–12:00, Di und Do 13:00–17:00. Sonst die Apotheke im Tesco Balatonfüred.",
    },
    lat: 46.9157,
    lng: 17.8828,
  },
  {
    label: { en: "Doctor", hu: "Orvos", de: "Arzt" },
    name: "Háziorvos Aszófő · 1830",
    detail: {
      en: "The village GP (Árpád utca 2) sees patients Mon and Fri 7:30–9:30, Wed 15:00–16:30. Outside those hours call the on-call doctor on 1830 (Balatonfüred, Csárda utca 1).",
      hu: "A falu háziorvosa (Árpád utca 2.) hétfőn és pénteken 7:30–9:30, szerdán 15:00–16:30 rendel. Rendelési időn kívül az ügyelet: 1830 (Balatonfüred, Csárda utca 1.).",
      de: "Der Hausarzt im Dorf (Árpád utca 2) hat Mo und Fr 7:30–9:30, Mi 15:00–16:30 Sprechstunde. Außerhalb dieser Zeiten den Bereitschaftsdienst unter 1830 anrufen (Balatonfüred, Csárda utca 1).",
    },
    lat: 46.9294,
    lng: 17.833,
  },
  {
    label: { en: "Hospital", hu: "Kórház", de: "Krankenhaus" },
    name: "Csolnoky Ferenc Kórház, Veszprém",
    detail: {
      en: "The nearest 24-hour emergency department, about 30 minutes away. The hospital in Balatonfüred treats heart emergencies only.",
      hu: "A legközelebbi, éjjel-nappal nyitott sürgősségi osztály, kb. 30 perc. A balatonfüredi kórház csak szívbetegeket lát el.",
      de: "Die nächste rund um die Uhr geöffnete Notaufnahme, etwa 30 Minuten entfernt. Das Krankenhaus in Balatonfüred behandelt nur Herznotfälle.",
    },
    lat: 47.0904,
    lng: 17.9103,
  },
  {
    label: { en: "Taxi", hu: "Taxi", de: "Taxi" },
    name: "BalatonfüredTaxi · +36 21 212 2039",
    detail: {
      en: "Serves Aszófő and Balatonfüred, handy from the station or after a winery dinner.",
      hu: "Aszófőn és Balatonfüreden jár, jól jön az állomásról vagy egy borvacsora után.",
      de: "Fährt in Aszófő und Balatonfüred, praktisch vom Bahnhof oder nach einem Abendessen im Weingut.",
    },
    href: "tel:+36212122039",
  },
  {
    label: { en: "EV charging", hu: "Elektromos töltő", de: "E-Ladestation" },
    name: "E.ON Drive, ALDI Balatonfüred",
    detail: {
      en: "Two fast chargers (CCS) in the ALDI car park on Fürdő utca, open around the clock.",
      hu: "Két gyorstöltő (CCS) a Fürdő utcai ALDI parkolójában, éjjel-nappal.",
      de: "Zwei Schnelllader (CCS) auf dem ALDI-Parkplatz in der Fürdő utca, rund um die Uhr.",
    },
    lat: 46.9499,
    lng: 17.8738,
  },
];
