import type { MapStyle } from "@/types";

export const MAP_STYLES: MapStyle[] = [
  {
    id: "dark",
    name: "Dark",
    url: "mapbox://styles/mapbox/dark-v11",
    color: "#1a1a2e",
  },
  {
    id: "light",
    name: "Light",
    url: "mapbox://styles/mapbox/light-v11",
    color: "#e8e8e8",
  },
  {
    id: "streets",
    name: "Streets",
    url: "mapbox://styles/mapbox/streets-v12",
    color: "#b0c4de",
  },
  {
    id: "satellite",
    name: "Satellite",
    url: "mapbox://styles/mapbox/satellite-streets-v12",
    color: "#2d4a22",
  },
  {
    id: "outdoors",
    name: "Outdoors",
    url: "mapbox://styles/mapbox/outdoors-v12",
    color: "#7eb89e",
  },
  {
    id: "night-nav",
    name: "Night Nav",
    url: "mapbox://styles/mapbox/navigation-night-v1",
    color: "#0f1a2e",
  },
];

export function getStyleUrl(id: string): string {
  return MAP_STYLES.find((s) => s.id === id)?.url ?? MAP_STYLES[0].url;
}
