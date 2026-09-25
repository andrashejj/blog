// The guest page map: every place on the page, coloured by kind, around the
// house. Loaded only when the map scrolls into view.

import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPlace {
  id: string;
  name: string;
  town: string;
  lat: number;
  lng: number;
  category: string;
  label: string;
  minutes: number;
}

const COLORS: Record<string, string> = {
  restaurant: "#a35f3e",
  cafe: "#c08a5b",
  winery: "#6b2f3a",
  lake: "#5f7f86",
  nature: "#6d7458",
  culture: "#3a3833",
  market: "#b9a47c",
  event: "#a35f3e",
  kids: "#8a9c9c",
  wellness: "#7d8c8c",
};

export function initStayMap(el: HTMLElement) {
  const places = JSON.parse(el.dataset.places ?? "[]") as MapPlace[];
  const home = JSON.parse(el.dataset.home ?? "{}") as {
    lat: number;
    lng: number;
    name: string;
  };
  const directions = el.dataset.directions ?? "Directions";

  const map = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.5 });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Frame the half-hour around the house; farther places are a zoom away.
  const points: L.LatLngExpression[] = [[home.lat, home.lng]];
  for (const place of places) {
    if (place.minutes <= 30) points.push([place.lat, place.lng]);
    const marker = L.marker([place.lat, place.lng], {
      title: place.name,
      icon: L.divIcon({
        className: "stay-pin",
        html: `<span style="background:${COLORS[place.category] ?? "#262521"}"></span>`,
        iconSize: [14, 14],
      }),
    });
    marker.bindPopup(() => {
      const box = document.createElement("div");
      box.className = "stay-popup";
      const title = document.createElement("strong");
      title.textContent = place.name;
      const meta = document.createElement("span");
      meta.textContent = `${place.town} · ${place.label}`;
      const links = document.createElement("p");
      const card = document.createElement("a");
      card.href = `#place-${place.id}`;
      card.textContent = "↓";
      card.addEventListener("click", (e) => {
        const target = document.querySelector<HTMLElement>(
          `[data-place="${place.id}"]`,
        );
        if (!target) return;
        e.preventDefault();
        const group = target.closest("details");
        if (group) group.open = true;
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("flash");
        setTimeout(() => target.classList.remove("flash"), 1600);
      });
      const route = document.createElement("a");
      route.href = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
      route.target = "_blank";
      route.rel = "noopener noreferrer";
      route.textContent = `${directions} ↗`;
      links.append(route, " ", card);
      box.append(title, meta, links);
      return box;
    });
    marker.addTo(map);
  }

  L.marker([home.lat, home.lng], {
    title: home.name,
    zIndexOffset: 1000,
    icon: L.divIcon({
      className: "stay-home",
      html: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 16.6 15.9 3.3l12.7 13.1" stroke-width="2.4"/><path d="M6.9 13.2v15.6h18.3V13.4" stroke-width="1.6"/></svg>`,
      iconSize: [30, 30],
      iconAnchor: [15, 26],
    }),
  })
    .bindTooltip(home.name, { direction: "top", offset: [0, -24] })
    .addTo(map);

  const fit = () =>
    map.fitBounds(L.latLngBounds(points), { padding: [28, 28] });
  fit();
  map.on("resize", fit);
}
