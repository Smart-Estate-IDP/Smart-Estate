"use client";

import React, { useEffect, useState } from "react";

interface FeaturedPropertyPreview {
  _id: string;
  title: string;
  price?: number;
  location?: any;
  images?: string[];
}

const DEFAULT_PREVIEW = {
  _id: "default-1",
  title: "Greenwood Lakeview Luxury Penthouse",
  price: 24000000,
  location: "Whitefield, Bangalore",
  images: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  ],
};

export default function DashboardLoading() {
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedPropertyPreview[]>([DEFAULT_PREVIEW]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    fetch("/api/properties/featured")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
          setFeaturedProperties(data.properties);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (featuredProperties.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % featuredProperties.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [featuredProperties.length]);

  const currentProp = featuredProperties[activeIdx] || DEFAULT_PREVIEW;
  const imageUrl =
    currentProp.images && currentProp.images.length > 0
      ? currentProp.images[0]
      : DEFAULT_PREVIEW.images[0];
  const locationText =
    typeof currentProp.location === "object"
      ? `${currentProp.location?.address || ""}, ${currentProp.location?.city || ""}`.trim().replace(/^,\s*/, "")
      : currentProp.location || "Verified Location";

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#DCE5EC] px-4 py-8">
      <div className="rounded-[32px] neu-raised p-6 sm:p-8 text-center space-y-5 max-w-md w-full border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)]">
        
        {/* Pulsing Soft Neumorphic Shield */}
        <div className="w-16 h-16 rounded-[22px] neu-inset flex items-center justify-center mx-auto p-1.5 animate-pulse">
          <div className="w-full h-full rounded-[16px] bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center shadow-[0_8px_20px_rgba(49,85,255,0.4)]">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
        </div>

        {/* Text & Status */}
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">
            Smart<span className="text-[#3155FF]">Estate</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Loading Client Portal &amp; Deed Vault...
          </p>
        </div>

        {/* Inset Animated Progress Bar */}
        <div className="w-full h-2 neu-inset rounded-full overflow-hidden p-0.5">
          <div className="h-full rounded-full bg-gradient-to-r from-[#3155FF] via-[#287BFF] to-emerald-400 animate-pulse w-3/4 shadow-[0_2px_8px_rgba(49,85,255,0.4)]" />
        </div>

        {/* Admin-Selected Property Preview Box */}
        <div className="p-3.5 rounded-2xl neu-inset text-left space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#3155FF] flex items-center gap-1.5">
              <span>⭐</span>
              <span>Featured Listing Preview</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Legal Verified
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden neu-raised shrink-0 border border-white">
              <img
                src={imageUrl}
                alt={currentProp.title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-slate-800 truncate">
                {currentProp.title}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {locationText}
              </div>
              {currentProp.price && (
                <div className="text-xs font-extrabold text-[#3155FF] mt-0.5">
                  ₹{(currentProp.price / 100000).toFixed(2)} Lakh
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold text-emerald-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Encrypted Session Active</span>
        </div>

      </div>
    </div>
  );
}
