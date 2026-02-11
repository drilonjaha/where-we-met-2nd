"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { GeocodingFeature } from "@/types";

export default function LocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const mapInstance = useStore((s) => s.mapInstance);
  const setLocationLabel = useStore((s) => s.setLocationLabel);
  const setMarkerLngLat = useStore((s) => s.setMarkerLngLat);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const res = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&limit=5&access_token=${token}`
    );
    const data = await res.json();

    const features: GeocodingFeature[] = (data.features ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) => ({
        id: f.id,
        name: f.properties?.name ?? f.properties?.full_address ?? q,
        full_address: f.properties?.full_address ?? "",
        coordinates: f.geometry.coordinates as [number, number],
      })
    );
    setResults(features);
    setIsOpen(true);
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (feature: GeocodingFeature) => {
    setQuery(feature.name);
    setResults([]);
    setIsOpen(false);
    setLocationLabel(feature.name);
    setMarkerLngLat(feature.coordinates);

    if (mapInstance) {
      mapInstance.flyTo({ center: feature.coordinates, zoom: 14, duration: 2000 });
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-xs font-medium uppercase tracking-wider text-charcoal/60 mb-2 block">
        Search Location
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="Search for a place..."
          className="w-full pl-9 pr-8 py-2.5 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose/40"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-cream transition-colors border-b border-black/5 last:border-0 cursor-pointer"
            >
              <div className="font-medium">{r.name}</div>
              {r.full_address && r.full_address !== r.name && (
                <div className="text-xs text-charcoal/50 mt-0.5 truncate">
                  {r.full_address}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
