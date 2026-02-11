"use client";

import { Download, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { exportPoster } from "@/lib/export-poster";

export default function DownloadButton() {
  const isExporting = useStore((s) => s.isExporting);
  const setIsExporting = useStore((s) => s.setIsExporting);
  const state = useStore();

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      await exportPoster(state);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="w-full flex items-center justify-center gap-2 bg-rose hover:bg-rose/90 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Generating poster...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Download Poster
        </>
      )}
    </button>
  );
}
