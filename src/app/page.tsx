"use client";

import dynamic from "next/dynamic";
import StylePicker from "@/components/StylePicker";
import LocationSearch from "@/components/LocationSearch";
import NamesInput from "@/components/NamesInput";
import PosterPreview from "@/components/PosterPreview";
import DownloadButton from "@/components/DownloadButton";
import { Heart } from "lucide-react";

const MapCanvas = dynamic(() => import("@/components/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-charcoal/10 animate-pulse flex items-center justify-center">
      <p className="text-charcoal/40 text-sm">Loading map...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-[360px] lg:min-w-[360px] bg-cream border-b lg:border-b-0 lg:border-r border-black/10 overflow-y-auto order-2 lg:order-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <Heart className="w-5 h-5 text-rose fill-rose" />
              <h1 className="text-2xl tracking-tight">Where We Met</h1>
            </div>
            <p className="text-sm text-charcoal/50">
              Create a beautiful poster of the place you first met
            </p>
          </div>

          <hr className="border-black/8" />

          <LocationSearch />
          <StylePicker />

          <hr className="border-black/8" />

          <NamesInput />

          <hr className="border-black/8" />

          <DownloadButton />

          <p className="text-[11px] text-center text-charcoal/30">
            Tip: Click the map to place a heart, then drag it to adjust
          </p>
        </div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative min-h-[50vh] lg:min-h-0 order-1 lg:order-2">
        <MapCanvas />
        <PosterPreview />
      </main>
    </div>
  );
}
