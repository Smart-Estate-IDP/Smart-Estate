"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  propertyType: string;
  listingType?: "SALE" | "RENT";
  verificationStatus?: "VERIFIED" | "IN_PROGRESS" | "AI_SCREENED" | "UNVERIFIED" | "REJECTED";
  imageUrl: string;
  images?: string[];
  lawyerName?: string;
  auditScore?: number;
  onQuickView?: (id: string) => void;
}

export default function PropertyCard({
  id,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  propertyType,
  listingType = "SALE",
  verificationStatus = "VERIFIED",
  imageUrl,
  images = [],
  lawyerName = "Adv. Ramesh Saxena (High Court)",
  auditScore = 98,
  onQuickView,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = images && images.length > 0 ? images : [imageUrl];
  const activeImage = allImages[currentImageIndex] || imageUrl;

  const isRent = listingType === "RENT" || title.toLowerCase().includes("[for rent]") || title.toLowerCase().includes("rent");

  const formatPrice = (num: number) => {
    if (isRent) {
      return `₹${num.toLocaleString("en-IN")}/mo`;
    }
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="group rounded-[28px] neu-raised p-4 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between border border-white/80 h-full">
      <div className="space-y-3.5">
        {/* Image Container with Inset Frame */}
        <div className="relative w-full h-52 rounded-[22px] overflow-hidden neu-inset p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={title}
            className="w-full h-full object-cover rounded-[20px] transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
            }}
          />

          {/* Listing Type Tag (SALE vs RENT) */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                isRent
                  ? "bg-purple-600/90 text-white border border-purple-400"
                  : "bg-[#3155FF]/90 text-white border border-blue-400"
              }`}
            >
              {isRent ? "🔑 For Rent" : "🏷️ For Sale"}
            </span>

            {/* Verification Badge */}
            {verificationStatus === "VERIFIED" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/95 text-emerald-700 shadow-sm backdrop-blur-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                🛡️ Audited
              </span>
            )}
            {verificationStatus === "AI_SCREENED" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/95 text-[#3155FF] shadow-sm backdrop-blur-md border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3155FF]" />
                🤖 AI Screened
              </span>
            )}
            {(verificationStatus === "IN_PROGRESS" || verificationStatus === "UNVERIFIED") && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/95 text-amber-700 shadow-sm backdrop-blur-md border border-amber-200">
                ⏳ Audit Pending
              </span>
            )}
          </div>

          {/* Favorite & Image Count */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {allImages.length > 1 && (
              <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-950/70 text-white backdrop-blur-md">
                📸 {currentImageIndex + 1}/{allImages.length}
              </span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsFavorite(!isFavorite);
              }}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm active:scale-90 transition-all"
              aria-label="Save Property"
            >
              <svg
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? "fill-rose-500 text-rose-500" : "fill-none stroke-current stroke-2"
                }`}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Photo Navigation arrows if multiple photos */}
          {allImages.length > 1 && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-xs backdrop-blur-sm pointer-events-auto hover:bg-black/80"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center text-xs backdrop-blur-sm pointer-events-auto hover:bg-black/80"
              >
                ›
              </button>
            </div>
          )}

          {/* Property Type Chip */}
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-md tracking-wider uppercase">
              {propertyType}
            </span>
          </div>
        </div>

        {/* Info Block */}
        <div className="space-y-2 px-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-[#3155FF] tracking-tight">
              {formatPrice(price)}
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              {isRent ? "Rental Agreement" : "Clear Title Deed"}
            </span>
          </div>

          <Link href={`/properties/${id}`}>
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#3155FF] transition-colors">
              {title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <svg
              className="w-3.5 h-3.5 text-slate-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{location}</span>
          </p>

          {/* Specs Inset Bar */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl neu-inset text-center text-slate-600">
            <div>
              <span className="block text-xs font-extrabold text-slate-800">
                {bedrooms > 0 ? `${bedrooms} BHK` : "Studio"}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">
                Layout
              </span>
            </div>
            <div className="border-x border-slate-300/60">
              <span className="block text-xs font-extrabold text-slate-800">
                {bathrooms}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">
                Baths
              </span>
            </div>
            <div>
              <span className="block text-xs font-extrabold text-slate-800">
                {area}
              </span>
              <span className="text-[9px] text-slate-400 font-semibold uppercase">
                Sq.Ft
              </span>
            </div>
          </div>

          {/* Legal Certification Micro-strip */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-medium">
            <span className="flex items-center gap-1 truncate max-w-[170px]">
              <span className="text-emerald-500">✓</span> {lawyerName}
            </span>
            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
              Score {auditScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3.5 mt-2 border-t border-slate-200/60 flex items-center gap-2">
        <Link
          href={`/properties/${id}`}
          className="flex-1 text-center py-2.5 px-3 rounded-2xl neu-btn-primary text-xs font-bold transition-all"
        >
          View Full Dossier
        </Link>
        {onQuickView ? (
          <button
            type="button"
            onClick={() => onQuickView(id)}
            className="p-2.5 rounded-2xl neu-btn-secondary text-slate-600 hover:text-[#3155FF] transition-all"
            title="Quick View & Images"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        ) : (
          <Link
            href={`/properties/${id}`}
            className="p-2.5 rounded-2xl neu-btn-secondary text-slate-600 hover:text-[#3155FF] transition-all"
            title="Quick View & Images"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
