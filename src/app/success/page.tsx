"use client";

import { useEffect, useState } from "react";
import { Heart, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { exportPoster } from "@/lib/export-poster";

export default function SuccessPage() {
  const [downloading, setDownloading] = useState(false);
  const [autoTriggered, setAutoTriggered] = useState(false);
  const state = useStore();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await exportPoster(state);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Auto-trigger download once on mount if we have a marker
  useEffect(() => {
    if (state.markerLngLat && !autoTriggered) {
      setAutoTriggered(true);
      handleDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.markerLngLat]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-10 space-y-6">
          <Heart className="w-14 h-14 mx-auto fill-rose text-rose" />

          <div>
            <h1 className="text-3xl mb-2">Thank you!</h1>
            <p className="text-charcoal/60">
              Your payment was successful. Your poster is being generated.
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2 bg-rose hover:bg-rose/90 disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {downloading ? (
              "Generating poster..."
            ) : (
              <>
                <Download className="w-5 h-5" />
                Download Poster Again
              </>
            )}
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Create another poster
          </Link>
        </div>
      </div>
    </div>
  );
}
