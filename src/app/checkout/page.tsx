"use client";

import { useState } from "react";
import { Heart, ArrowLeft, CreditCard, Shield, Download } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const name1 = useStore((s) => s.name1);
  const name2 = useStore((s) => s.name2);
  const locationLabel = useStore((s) => s.locationLabel);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to editor
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
          {/* Header */}
          <div className="bg-charcoal text-white p-8 text-center">
            <Heart className="w-10 h-10 mx-auto mb-3 fill-rose text-rose" />
            <h1 className="text-2xl mb-1">Your poster is ready</h1>
            <p className="text-sm text-white/60">
              High-resolution A4 print-quality PNG
            </p>
          </div>

          {/* Details */}
          <div className="p-8 space-y-6">
            {/* Poster summary */}
            <div className="bg-cream rounded-xl p-5 space-y-2">
              {(name1 || name2) && (
                <p className="text-center text-lg font-semibold" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {name1 || "___"}{" "}
                  <span className="text-rose">&amp;</span>{" "}
                  {name2 || "___"}
                </p>
              )}
              {locationLabel && (
                <p className="text-center text-sm text-charcoal/60">
                  {locationLabel}
                </p>
              )}
              <div className="flex justify-between text-xs text-charcoal/40 pt-2 border-t border-black/5">
                <span>2480 × 3508 px</span>
                <span>300 DPI</span>
                <span>Print-ready</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <span className="text-charcoal/70">HD Poster Download</span>
              <span className="text-2xl font-semibold">$4.99</span>
            </div>

            {/* Pay button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-rose hover:bg-rose/90 disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                "Redirecting to payment..."
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay $4.99
                </>
              )}
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 text-xs text-charcoal/40">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Secure payment
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" />
                Instant download
              </span>
            </div>

            <p className="text-[11px] text-center text-charcoal/30">
              Powered by Stripe. Your payment info is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
