"use client";

import { useStore } from "@/lib/store";

export default function PosterPreview() {
  const name1 = useStore((s) => s.name1);
  const name2 = useStore((s) => s.name2);
  const locationLabel = useStore((s) => s.locationLabel);
  const date = useStore((s) => s.date);
  const markerLngLat = useStore((s) => s.markerLngLat);
  const title = useStore((s) => s.title);

  const hasContent = name1 || name2 || locationLabel || date || markerLngLat;
  if (!hasContent) return null;

  const formatCoords = (lngLat: [number, number]) => {
    const lat = Math.abs(lngLat[1]).toFixed(4) + (lngLat[1] >= 0 ? "N" : "S");
    const lng = Math.abs(lngLat[0]).toFixed(4) + (lngLat[0] >= 0 ? "E" : "W");
    return `${lat}  ${lng}`;
  };

  const formatDate = (d: string) => {
    if (!d) return "";
    const parsed = new Date(d + "T00:00:00");
    return parsed.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="poster-overlay absolute bottom-0 left-0 right-0 flex justify-center p-6">
      <div className="text-center text-white space-y-1 bg-black/55 backdrop-blur-sm rounded-2xl px-10 py-6">
        <h2 className="text-lg font-light tracking-[0.25em] uppercase opacity-80">
          {title}
        </h2>

        {(name1 || name2) && (
          <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {name1 || "___"}{" "}
            <span className="text-rose-light">&amp;</span>{" "}
            {name2 || "___"}
          </p>
        )}

        {locationLabel && (
          <p className="text-sm tracking-wider opacity-80">{locationLabel}</p>
        )}

        {date && (
          <p className="text-sm opacity-70">{formatDate(date)}</p>
        )}

        {markerLngLat && (
          <p className="text-xs font-mono tracking-wider opacity-50 pt-1">
            {formatCoords(markerLngLat)}
          </p>
        )}
      </div>
    </div>
  );
}
