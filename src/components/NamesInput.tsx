"use client";

import { useStore } from "@/lib/store";

export default function NamesInput() {
  const name1 = useStore((s) => s.name1);
  const name2 = useStore((s) => s.name2);
  const date = useStore((s) => s.date);
  const locationLabel = useStore((s) => s.locationLabel);
  const setName1 = useStore((s) => s.setName1);
  const setName2 = useStore((s) => s.setName2);
  const setDate = useStore((s) => s.setDate);
  const setLocationLabel = useStore((s) => s.setLocationLabel);

  const inputClass =
    "w-full py-2.5 px-3 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose/40 focus:border-rose/40";

  return (
    <div className="space-y-3">
      <label className="text-xs font-medium uppercase tracking-wider text-charcoal/60 block">
        Your Names
      </label>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
        <input
          type="text"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder="Their name"
          className={inputClass}
        />
      </div>

      {(name1 || name2) && (
        <p className="text-center text-sm text-charcoal/60 italic">
          {name1 || "___"}{" "}
          <span className="text-rose font-semibold">&amp;</span>{" "}
          {name2 || "___"}
        </p>
      )}

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-charcoal/60 mb-2 block">
          Date (optional)
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-charcoal/60 mb-2 block">
          Location Label
        </label>
        <input
          type="text"
          value={locationLabel}
          onChange={(e) => setLocationLabel(e.target.value)}
          placeholder="e.g. Paris, France"
          className={inputClass}
        />
      </div>
    </div>
  );
}
