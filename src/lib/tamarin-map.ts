import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { ACTIVITIES, type Lang } from "./tamarin-activities";
import { MAP_LOCATIONS } from "./tamarin-map-locations";

export function initTamarinMap(container: HTMLElement, initialLang: Lang) {
  let lang = initialLang;
  const map = L.map(container, { scrollWheelZoom: false, zoomSnap: 0.5 });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const cluster = L.markerClusterGroup({
    maxClusterRadius: 35,
    showCoverageOnHover: false,
    animate: false,
    iconCreateFunction: (group) =>
      L.divIcon({
        className: "guide-map-cluster",
        html: `<span>${group.getChildCount()}</span>`,
        iconSize: [34, 34],
      }),
  });
  const markers = new Map<string, L.Marker>();
  const colors = {
    land: "#526347",
    water: "#35677a",
    air: "#91652c",
    food: "#a44228",
  };

  for (const activity of ACTIVITIES) {
    const location = MAP_LOCATIONS[activity.id];
    if (!location) throw new Error(`Missing map location: ${activity.id}`);
    const marker = L.marker(location.position, {
      title: activity.name,
      icon: L.divIcon({
        className: "guide-map-pin",
        html: `<span style="background:${colors[activity.category]}"></span>`,
        iconSize: [18, 18],
      }),
    });
    marker.bindTooltip(activity.name);
    marker.bindPopup(() => {
      const popup = document.createElement("div");
      popup.className = "guide-map-popup";
      const title = document.createElement("strong");
      title.textContent = activity.name;
      const detail = document.createElement("p");
      detail.textContent = `${activity.kind[lang]} · ${activity.duration[lang]}`;
      popup.append(title, detail);
      if (location.note) {
        const note = document.createElement("p");
        note.textContent = location.note[lang];
        popup.append(note);
      }
      const directions = document.createElement("a");
      directions.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.mapQuery)}`;
      directions.target = "_blank";
      directions.rel = "noopener noreferrer";
      directions.textContent = lang === "de" ? "Route" : "Directions";
      popup.append(directions);
      return popup;
    });
    markers.set(activity.id, marker);
    cluster.addLayer(marker);
  }
  map.addLayer(cluster);

  const showAll = () => {
    map.closePopup();
    map.fitBounds(cluster.getBounds(), { padding: [35, 35], animate: false });
  };
  showAll();
  map.on("resize", showAll);
  container.dataset.mapCount = String(markers.size);

  return {
    showAll,
    select(id: string) {
      const marker = markers.get(id);
      if (marker) cluster.zoomToShowLayer(marker, () => marker.openPopup());
    },
    setLang(next: Lang) {
      lang = next;
      for (const marker of markers.values()) {
        if (marker.isPopupOpen()) marker.getPopup()?.update();
      }
    },
  };
}
