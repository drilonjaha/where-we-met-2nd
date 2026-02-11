import type mapboxgl from "mapbox-gl";

export interface MapStyle {
  id: string;
  name: string;
  url: string;
  color: string; // preview swatch color
}

export interface GeocodingFeature {
  id: string;
  name: string;
  full_address: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface AppState {
  selectedStyle: string;
  center: [number, number];
  zoom: number;
  markerLngLat: [number, number] | null;
  name1: string;
  name2: string;
  locationLabel: string;
  date: string;
  title: string;
  mapInstance: mapboxgl.Map | null;
  isExporting: boolean;

  setSelectedStyle: (id: string) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setMarkerLngLat: (lngLat: [number, number] | null) => void;
  setName1: (name: string) => void;
  setName2: (name: string) => void;
  setLocationLabel: (label: string) => void;
  setDate: (date: string) => void;
  setTitle: (title: string) => void;
  setMapInstance: (map: mapboxgl.Map | null) => void;
  setIsExporting: (exporting: boolean) => void;
}
