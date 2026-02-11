"use client";

import { useStore } from "@/lib/store";
import { MAP_STYLES } from "@/lib/styles";

export default function StylePicker() {
  const selectedStyle = useStore((s) => s.selectedStyle);
  const setSelectedStyle = useStore((s) => s.setSelectedStyle);

  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-charcoal/60 mb-2 block">
        Map Style
      </label>
      <div className="grid grid-cols-3 gap-2">
        {MAP_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`relative flex flex-col items-center gap-1.5 rounded-lg p-2.5 transition-all cursor-pointer ${
              selectedStyle === style.id
                ? "ring-2 ring-rose bg-white shadow-sm"
                : "hover:bg-white/60"
            }`}
          >
            <div
              className="w-full aspect-[4/3] rounded-md border border-black/10"
              style={{ backgroundColor: style.color }}
            />
            <span className="text-[11px] font-medium">{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
