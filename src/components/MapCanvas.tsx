"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useStore } from "@/lib/store";
import { getStyleUrl } from "@/lib/styles";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

function createHeartElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "heart-marker heart-marker-pulse";
  el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#e63946" stroke="#fff" stroke-width="1"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.83-4.5 2.17C10.832 3.83 9.26 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
  return el;
}

export default function MapCanvas() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const selectedStyle = useStore((s) => s.selectedStyle);
  const center = useStore((s) => s.center);
  const zoom = useStore((s) => s.zoom);
  const markerLngLat = useStore((s) => s.markerLngLat);
  const setCenter = useStore((s) => s.setCenter);
  const setZoom = useStore((s) => s.setZoom);
  const setMarkerLngLat = useStore((s) => s.setMarkerLngLat);
  const setMapInstance = useStore((s) => s.setMapInstance);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: getStyleUrl(selectedStyle),
      center: center,
      zoom: zoom,
      preserveDrawingBuffer: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("moveend", () => {
      const c = map.getCenter();
      setCenter([c.lng, c.lat]);
      setZoom(map.getZoom());
    });

    map.on("click", (e) => {
      const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setMarkerLngLat(lngLat);
    });

    mapRef.current = map;
    setMapInstance(map);

    return () => {
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(getStyleUrl(selectedStyle));
  }, [selectedStyle]);

  // Update marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (markerLngLat) {
      const el = createHeartElement();
      const marker = new mapboxgl.Marker({ element: el, draggable: true })
        .setLngLat(markerLngLat)
        .addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLngLat();
        setMarkerLngLat([pos.lng, pos.lat]);
      });

      markerRef.current = marker;
    }
  }, [markerLngLat, setMarkerLngLat]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {!markerLngLat && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 text-white px-5 py-3 rounded-xl text-sm backdrop-blur-sm">
            Click on the map to place your heart
          </div>
        </div>
      )}
    </div>
  );
}
