"use client";

import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DownloadButton() {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <button
        onClick={() => router.push("/checkout")}
        className="w-full flex items-center justify-center gap-2 bg-rose hover:bg-rose/90 text-white font-semibold py-3 px-6 rounded-xl transition-colors cursor-pointer"
      >
        <Download className="w-5 h-5" />
        Download Poster — $4.99
      </button>
      <p className="text-[11px] text-center text-charcoal/30">
        High-resolution A4 print-quality PNG
      </p>
    </div>
  );
}
