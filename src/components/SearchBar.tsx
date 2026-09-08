"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NeuSlider } from "./NeumorphicUI";

interface SearchBarProps {
  onSearch?: (filters: {
    query: string;
    propertyType: string;
    verification: string;
    maxPrice: number;
  }) => void;
  compact?: boolean;
}

export default function SearchBar({ onSearch, compact = false }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("ALL");
  const [verification, setVerification] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState(25000000); // 2.5 Cr default

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ query, propertyType, verification, maxPrice });
    } else {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (propertyType !== "ALL") params.set("type", propertyType);
      if (verification !== "ALL") params.set("verification", verification);
      if (maxPrice) params.set("maxPrice", maxPrice.toString());
      router.push(`/properties?${params.toString()}`);
    }
  };

  const formatPriceLabel = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    return `₹${(num / 100000).toFixed(0)} Lakh`;
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`w-full rounded-[28px] neu-raised-lg p-6 sm:p-8 space-y-6 border border-white/80 ${
        compact ? "neu-raised-sm" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Search Legally Clear Properties
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          Over 5,000+ Verified Listings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City / Locality Inset Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Location
          </label>
          <div className="relative flex items-center">
            <svg
              className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none"
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
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Mumbai, Whitefield..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl neu-input font-medium placeholder-slate-400"
            />
          </div>
        </div>

        {/* Property Type Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Asset Type
          </label>
          <div className="relative flex items-center">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-2xl neu-input font-medium text-slate-700 appearance-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              <option value="APARTMENT">Flats & Apartments</option>
              <option value="VILLA">Luxury Villas & Bungalows</option>
              <option value="PLOT">Clear-Title Plots</option>
              <option value="COMMERCIAL">Office & Commercial</option>
            </select>
            <svg
              className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Legal Clearance Level Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
            Audit Level
          </label>
          <div className="relative flex items-center">
            <select
              value={verification}
              onChange={(e) => setVerification(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-2xl neu-input font-semibold text-emerald-700 appearance-none cursor-pointer"
            >
              <option value="ALL">All Audit Grades</option>
              <option value="VERIFIED">🛡️ 100% Lawyer Audited</option>
              <option value="AI_SCREENED">🤖 AI Deed Screened</option>
              <option value="RERA">📜 RERA Registered Only</option>
            </select>
            <svg
              className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Budget Slider */}
        <div className="space-y-1.5 flex flex-col justify-end">
          <NeuSlider
            min={2000000}
            max={50000000}
            step={1000000}
            value={maxPrice}
            onChange={setMaxPrice}
            label="Max Budget"
            formatValue={formatPriceLabel}
          />
        </div>
      </div>

      {/* Footer Filters & Search CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-slate-400">Quick Filters:</span>
          {["Ready to Move", "Freehold Title", "Bank Approved", "Zero Encumbrance"].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full neu-inset text-slate-600 hover:text-[#3155FF] cursor-pointer transition-colors"
              >
                + {tag}
              </span>
            )
          )}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full neu-btn-primary font-bold text-sm tracking-wide flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Find Verified Homes
        </button>
      </div>
    </form>
  );
}
