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
  verificationStatus: "VERIFIED" | "IN_PROGRESS" | "AI_SCREENED";
  imageUrl: string;
  lawyerName?: string;
  auditScore?: number;
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
  verificationStatus = "VERIFIED",
  imageUrl,
  lawyerName = "Adv. Ramesh Saxena (High Court)",
  auditScore = 98,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="group rounded-[24px] neu-raised p-4 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between border border-white/80">
      <div className="space-y-3.5">
        {/* Image Container with Inset Frame */}
        <div className="relative w-full h-52 rounded-[20px] overflow-hidden neu-inset p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-[18px] transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
            }}
          />

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {verificationStatus === "VERIFIED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/95 text-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.25)] backdrop-blur-md border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                🛡️ 100% Lawyer Audited
              </span>
            )}
            {verificationStatus === "AI_SCREENED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/95 text-[#3155FF] shadow-[0_4px_12px_rgba(49,85,255,0.25)] backdrop-blur-md border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-[#3155FF]" />
                🤖 AI Deed Verified
              </span>
            )}
            {verificationStatus === "IN_PROGRESS" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-white/95 text-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)] backdrop-blur-md border border-amber-200">
                ⏳ Audit Pending
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-[2px_2px_8px_rgba(0,0,0,0.15)] active:scale-90 transition-all"
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

          {/* Property Type Chip */}
          <div className="absolute bottom-3 right-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900/75 text-white backdrop-blur-md tracking-wider uppercase">
              {propertyType}
            </span>
          </div>
        </div>

        {/* Info Block */}
        <div className="space-y-2 px-1">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#3155FF] tracking-tight">
              {formatPrice(price)}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Clear Title
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-[#3155FF] transition-colors">
            {title}
          </h3>

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
                {bedrooms} Beds
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                Layout
              </span>
            </div>
            <div className="border-x border-slate-300/60">
              <span className="block text-xs font-extrabold text-slate-800">
                {bathrooms} Baths
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                Baths
              </span>
            </div>
            <div>
              <span className="block text-xs font-extrabold text-slate-800">
                {area}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                Sq.Ft
              </span>
            </div>
          </div>

          {/* Legal Certification Micro-strip */}
          <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-medium">
            <span className="flex items-center gap-1 truncate max-w-[170px]">
              <span className="text-emerald-500">✓</span> {lawyerName}
            </span>
            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Score {auditScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center gap-2">
        <Link
          href={`/properties`}
          className="flex-1 text-center py-2.5 px-3 rounded-full neu-btn-primary text-xs font-bold transition-all"
        >
          View Legal Dossier
        </Link>
        <Link
          href={`/properties`}
          className="p-2.5 rounded-full neu-btn-secondary text-slate-600 hover:text-[#3155FF] transition-all"
          title="Quick View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
