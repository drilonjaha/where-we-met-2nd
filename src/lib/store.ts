import { create } from "zustand";
import type { AppState } from "@/types";

export const useStore = create<AppState>((set) => ({
  selectedStyle: "dark",
  center: [20.4489, 44.7866], // Belgrade default
  zoom: 12,
  markerLngLat: null,
  name1: "",
  name2: "",
  locationLabel: "",
  date: "",
  title: "Where We Met",
  mapInstance: null,
  isExporting: false,

  setSelectedStyle: (id) => set({ selectedStyle: id }),
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setMarkerLngLat: (lngLat) => set({ markerLngLat: lngLat }),
  setName1: (name) => set({ name1: name }),
  setName2: (name) => set({ name2: name }),
  setLocationLabel: (label) => set({ locationLabel: label }),
  setDate: (date) => set({ date }),
  setTitle: (title) => set({ title }),
  setMapInstance: (map) => set({ mapInstance: map }),
  setIsExporting: (exporting) => set({ isExporting: exporting }),
}));
