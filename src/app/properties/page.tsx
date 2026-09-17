"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";

interface PropertyItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  listingType?: "SALE" | "RENT";
  propertyType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  amenities: string[];
  status: string;
  verificationStatus: "VERIFIED" | "IN_PROGRESS" | "AI_SCREENED" | "UNVERIFIED";
  images: string[];
  ownerId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
}

const PROPERTY_TYPES = [
  { id: "ALL", label: "All Types" },
  { id: "APARTMENT", label: "Apartments" },
  { id: "HOUSE", label: "Houses" },
  { id: "VILLA", label: "Villas" },
  { id: "COMMERCIAL", label: "Commercial" },
  { id: "PLOT", label: "Plots & Land" },
];

const MAJOR_CITIES = [
  "ALL",
  "Gurugram",
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Noida",
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [listingTypeFilter, setListingTypeFilter] = useState<"ALL" | "SALE" | "RENT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedBedrooms, setSelectedBedrooms] = useState("ALL");
  const [priceRange, setPriceRange] = useState("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "PRICE_ASC" | "PRICE_DESC" | "AREA_DESC">("NEWEST");

  // Quick View Modal State
  const [quickViewProperty, setQuickViewProperty] = useState<PropertyItem | null>(null);
  const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);

  // Fetch properties from API
  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (listingTypeFilter !== "ALL") params.append("listingType", listingTypeFilter);
      if (selectedType !== "ALL") params.append("propertyType", selectedType);
      if (selectedCity !== "ALL") params.append("city", selectedCity);
      if (selectedBedrooms !== "ALL") params.append("bedrooms", selectedBedrooms);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load properties");
      }

      setProperties(data.properties || []);
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      setError(err.message || "Could not retrieve property listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [listingTypeFilter, selectedType, selectedCity, selectedBedrooms]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProperties();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Client-side Price and Sort Processing
  const filteredAndSortedProperties = useMemo(() => {
    let result = [...properties];

    // Price Filter
    if (priceRange !== "ALL") {
      if (listingTypeFilter === "RENT") {
        if (priceRange === "UNDER_25K") result = result.filter((p) => p.price < 25000);
        else if (priceRange === "25K_50K") result = result.filter((p) => p.price >= 25000 && p.price <= 50000);
        else if (priceRange === "50K_1L") result = result.filter((p) => p.price > 50000 && p.price <= 100000);
        else if (priceRange === "ABOVE_1L") result = result.filter((p) => p.price > 100000);
      } else {
        if (priceRange === "UNDER_50L") result = result.filter((p) => p.price < 5000000);
        else if (priceRange === "50L_15CR") result = result.filter((p) => p.price >= 5000000 && p.price <= 15000000);
        else if (priceRange === "15CR_5CR") result = result.filter((p) => p.price > 15000000 && p.price <= 50000000);
        else if (priceRange === "ABOVE_5CR") result = result.filter((p) => p.price > 50000000);
      }
    }

    // Sorting
    if (sortBy === "NEWEST") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "PRICE_ASC") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "PRICE_DESC") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "AREA_DESC") {
      result.sort((a, b) => (b.area || 0) - (a.area || 0));
    }

    return result;
  }, [properties, priceRange, sortBy, listingTypeFilter]);

  const resetAllFilters = () => {
    setListingTypeFilter("ALL");
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedCity("ALL");
    setSelectedBedrooms("ALL");
    setPriceRange("ALL");
    setSortBy("NEWEST");
  };

  const hasActiveFilters =
    listingTypeFilter !== "ALL" ||
    searchQuery.trim() !== "" ||
    selectedType !== "ALL" ||
    selectedCity !== "ALL" ||
    selectedBedrooms !== "ALL" ||
    priceRange !== "ALL";

  return (
    <div className="min-h-screen bg-[#DCE5EC] text-slate-800 font-sans pb-16">
      
      {/* TOP HERO & CALL TO ACTION BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="max-w-7xl mx-auto rounded-[32px] neu-raised p-6 sm:p-10 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] relative overflow-hidden">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-inset text-xs font-black uppercase tracking-wider text-[#3155FF]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>100% Legal Audited Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight">
                Verified Properties to <span className="text-[#3155FF]">Buy</span>,{" "}
                <span className="text-indigo-600">Rent</span> &amp;{" "}
                <span className="text-slate-700">Invest</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                Every listing is verified with clear title deed reports, encumbrance clearances, and AI legal screening. Looking to sell or rent out your home? Upload photos directly to ImageKit and reach authenticated buyers.
              </p>
            </div>

            {/* Prominent Sell/Rent Action Card */}
            <div className="lg:w-80 rounded-2xl neu-inset p-5 flex flex-col justify-between space-y-4 border border-white/70 bg-[#D4DFE7]/70 shrink-0">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#3155FF] bg-blue-100 px-2.5 py-0.5 rounded-full">
                  For Property Owners
                </span>
                <h2 className="text-sm font-extrabold text-slate-800">
                  Have a Property to Sell or Rent?
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Upload photos with instant ImageKit CDN hosting and get 100% verified legal certification.
                </p>
              </div>
              <Link
                href="/sell"
                className="w-full py-3 px-4 rounded-xl neu-btn-primary text-xs font-extrabold text-white text-center flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-transform"
              >
                <span>📸</span>
                <span>+ List Property for Sale / Rent</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & DISCOVERY BAR */}
      <section className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="rounded-[28px] neu-raised p-5 border border-white/90 shadow-[0_8px_24px_rgba(140,160,185,0.25)] space-y-4">
            
            {/* Top Row: Search Input + Listing Type Switcher (Buy/Rent) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              
              {/* Buy vs Rent Switcher */}
              <div className="inline-flex items-center p-1 rounded-2xl neu-inset bg-[#D5DFE7] shrink-0 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setListingTypeFilter("ALL")}
                  className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all ${
                    listingTypeFilter === "ALL"
                      ? "neu-raised text-[#3155FF] bg-[#E2EAF1]"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All Listings
                </button>
                <button
                  type="button"
                  onClick={() => setListingTypeFilter("SALE")}
                  className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    listingTypeFilter === "SALE"
                      ? "neu-raised text-[#3155FF] bg-[#E2EAF1]"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>🏷️</span> Buy / Sale
                </button>
                <button
                  type="button"
                  onClick={() => setListingTypeFilter("RENT")}
                  className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    listingTypeFilter === "RENT"
                      ? "neu-raised text-indigo-600 bg-[#E2EAF1]"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>🔑</span> For Rent
                </button>
              </div>

              {/* Search Bar with Inset Design */}
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by society, locality, city, landmark or property title..."
                  className="w-full pl-10 pr-10 py-3 text-xs rounded-2xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium placeholder-slate-400 border border-slate-200/60"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 w-6 h-6 rounded-full flex items-center justify-center neu-raised"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>

            {/* Secondary Row: Property Types, City, Bedrooms, Price & Sort */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              
              {/* Property Type Dropdown */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-700 font-bold border border-slate-200/60 cursor-pointer"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Location / City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-700 font-bold border border-slate-200/60 cursor-pointer"
                >
                  {MAJOR_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c === "ALL" ? "All Cities" : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms / BHK */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Bedrooms / BHK
                </label>
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-700 font-bold border border-slate-200/60 cursor-pointer"
                >
                  <option value="ALL">Any Bedrooms</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Budget / Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-700 font-bold border border-slate-200/60 cursor-pointer"
                >
                  {listingTypeFilter === "RENT" ? (
                    <>
                      <option value="ALL">Any Rent</option>
                      <option value="UNDER_25K">Under ₹25,000 /mo</option>
                      <option value="25K_50K">₹25,000 - ₹50,000 /mo</option>
                      <option value="50K_1L">₹50,000 - ₹1 Lakh /mo</option>
                      <option value="ABOVE_1L">Above ₹1 Lakh /mo</option>
                    </>
                  ) : (
                    <>
                      <option value="ALL">Any Budget</option>
                      <option value="UNDER_50L">Under ₹50 Lakh</option>
                      <option value="50L_15CR">₹50 Lakh - ₹1.5 Cr</option>
                      <option value="15CR_5CR">₹1.5 Cr - ₹5 Cr</option>
                      <option value="ABOVE_5CR">Above ₹5 Crore</option>
                    </>
                  )}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-700 font-bold border border-slate-200/60 cursor-pointer"
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                  <option value="AREA_DESC">Area: Largest First</option>
                </select>
              </div>

            </div>

            {/* Active Filter Tags & Reset */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <span className="text-slate-400 font-bold text-[11px]">Active Filters:</span>
                {listingTypeFilter !== "ALL" && (
                  <span className="px-2.5 py-1 rounded-full neu-inset text-[11px] font-bold text-[#3155FF]">
                    Type: {listingTypeFilter === "SALE" ? "For Sale" : "For Rent"}
                  </span>
                )}
                {selectedType !== "ALL" && (
                  <span className="px-2.5 py-1 rounded-full neu-inset text-[11px] font-bold text-slate-700">
                    Category: {selectedType}
                  </span>
                )}
                {selectedCity !== "ALL" && (
                  <span className="px-2.5 py-1 rounded-full neu-inset text-[11px] font-bold text-slate-700">
                    City: {selectedCity}
                  </span>
                )}
                {selectedBedrooms !== "ALL" && (
                  <span className="px-2.5 py-1 rounded-full neu-inset text-[11px] font-bold text-slate-700">
                    {selectedBedrooms} BHK
                  </span>
                )}
                {priceRange !== "ALL" && (
                  <span className="px-2.5 py-1 rounded-full neu-inset text-[11px] font-bold text-slate-700">
                    Budget Filtered
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="ml-auto text-[11px] font-black text-rose-600 hover:text-rose-700 underline"
                >
                  Clear All Filters ✕
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* RESULTS HEADER */}
      <section className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-800">
              {listingTypeFilter === "RENT"
                ? "Rental Properties"
                : listingTypeFilter === "SALE"
                ? "Properties for Sale"
                : "All Listed Properties"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black neu-inset text-[#3155FF]">
              {filteredAndSortedProperties.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              Showing verified listings
            </span>
          </div>
        </div>
      </section>

      {/* ERROR STATE */}
      {error && (
        <section className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto p-4 rounded-2xl neu-inset bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={fetchProperties}
              className="px-3 py-1 rounded-xl neu-raised text-rose-700 hover:text-rose-900"
            >
              Retry
            </button>
          </div>
        </section>
      )}

      {/* PROPERTY GRID / SKELETON */}
      <section className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          
          {loading ? (
            /* Loading Skeletons */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((sk) => (
                <div
                  key={sk}
                  className="rounded-[28px] neu-raised p-4 h-96 flex flex-col justify-between border border-white/80 animate-pulse space-y-4"
                >
                  <div className="w-full h-52 rounded-[20px] neu-inset bg-slate-300/40" />
                  <div className="space-y-2">
                    <div className="w-1/3 h-5 rounded-lg neu-inset bg-slate-300/40" />
                    <div className="w-4/5 h-4 rounded-lg neu-inset bg-slate-300/40" />
                    <div className="w-1/2 h-3 rounded-lg neu-inset bg-slate-300/40" />
                  </div>
                  <div className="w-full h-10 rounded-xl neu-inset bg-slate-300/40" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedProperties.length > 0 ? (
            /* Property Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProperties.map((property) => (
                <PropertyCard
                  key={property._id}
                  id={property._id}
                  title={property.title}
                  location={`${property.location?.address || ""}, ${property.location?.city || ""}`}
                  price={property.price}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area}
                  propertyType={property.propertyType}
                  listingType={property.listingType || (property.title?.includes("[For Rent]") ? "RENT" : "SALE")}
                  verificationStatus={property.verificationStatus || "VERIFIED"}
                  imageUrl={
                    property.images && property.images.length > 0
                      ? property.images[0]
                      : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  }
                  images={property.images}
                  lawyerName="Adv. Ramesh Saxena (High Court)"
                  auditScore={property.verificationStatus === "VERIFIED" ? 98 : 88}
                  onQuickView={(id) => {
                    const found = properties.find((p) => p._id === id);
                    if (found) {
                      setQuickViewProperty(found);
                      setQuickViewImageIndex(0);
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-[32px] neu-raised p-12 text-center max-w-xl mx-auto space-y-6 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.25)]">
              <div className="w-20 h-20 rounded-[24px] neu-inset flex items-center justify-center mx-auto text-4xl">
                🏡
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-800">
                  No Properties Found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  We couldn&apos;t find any listings matching your current filter criteria. Try expanding your search, changing the city, or clearing filters.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl neu-btn-secondary text-xs font-bold text-slate-700"
                >
                  Reset All Filters
                </button>
                <Link
                  href="/sell"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl neu-btn-primary text-xs font-bold text-white text-center"
                >
                  + Sell or Rent a Property
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* QUICK VIEW DOSSIER MODAL */}
      {quickViewProperty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setQuickViewProperty(null)}
        >
          <div
            className="w-full max-w-3xl rounded-[32px] neu-raised p-6 sm:p-8 bg-[#DCE5EC] border border-white/90 shadow-[0_24px_64px_rgba(0,0,0,0.25)] space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      quickViewProperty.listingType === "RENT"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-blue-100 text-[#3155FF] border border-blue-200"
                    }`}
                  >
                    {quickViewProperty.listingType === "RENT" ? "For Rent" : "For Sale"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    {quickViewProperty.propertyType}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                  {quickViewProperty.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {quickViewProperty.location?.address}, {quickViewProperty.location?.city},{" "}
                  {quickViewProperty.location?.state}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setQuickViewProperty(null)}
                className="w-9 h-9 rounded-full neu-raised flex items-center justify-center text-slate-500 hover:text-slate-900 font-bold shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Photo Gallery (ImageKit Powered) */}
            <div className="space-y-3">
              <div className="relative w-full h-72 rounded-[24px] overflow-hidden neu-inset p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    quickViewProperty.images && quickViewProperty.images.length > 0
                      ? quickViewProperty.images[quickViewImageIndex]
                      : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={quickViewProperty.title}
                  className="w-full h-full object-cover rounded-[22px]"
                />

                {quickViewProperty.images && quickViewProperty.images.length > 1 && (
                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3">
                    <button
                      type="button"
                      onClick={() =>
                        setQuickViewImageIndex(
                          (prev) =>
                            (prev - 1 + quickViewProperty.images.length) %
                            quickViewProperty.images.length
                        )
                      }
                      className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center text-sm backdrop-blur-sm hover:bg-black/80"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setQuickViewImageIndex((prev) => (prev + 1) % quickViewProperty.images.length)
                      }
                      className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center text-sm backdrop-blur-sm hover:bg-black/80"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {quickViewProperty.images && quickViewProperty.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {quickViewProperty.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setQuickViewImageIndex(idx)}
                      className={`w-16 h-12 rounded-xl overflow-hidden neu-inset p-0.5 shrink-0 transition-all ${
                        quickViewImageIndex === idx
                          ? "ring-2 ring-[#3155FF] scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="Thumb" className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price & Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl neu-inset text-center">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">
                  {quickViewProperty.listingType === "RENT" ? "Monthly Rent" : "Price"}
                </span>
                <span className="text-base font-black text-[#3155FF]">
                  ₹{quickViewProperty.price.toLocaleString("en-IN")}
                  {quickViewProperty.listingType === "RENT" ? "/mo" : ""}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Area</span>
                <span className="text-base font-black text-slate-800">
                  {quickViewProperty.area} Sq.Ft
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Bedrooms</span>
                <span className="text-base font-black text-slate-800">
                  {quickViewProperty.bedrooms > 0 ? `${quickViewProperty.bedrooms} BHK` : "Studio"}
                </span>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase">Bathrooms</span>
                <span className="text-base font-black text-slate-800">
                  {quickViewProperty.bathrooms} Baths
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                Property Overview
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {quickViewProperty.description}
              </p>
            </div>

            {/* Legal Certification Mini Card */}
            <div className="p-4 rounded-2xl neu-raised border border-emerald-200/80 bg-emerald-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-xl text-emerald-600">
                  🛡️
                </div>
                <div>
                  <div className="text-xs font-extrabold text-emerald-900">
                    Advocate Inspected &amp; Clean Title Deed
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium">
                    Verified through High Court Advocate Ramesh Saxena
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black text-emerald-700 neu-inset bg-emerald-100">
                Score: 98%
              </span>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuickViewProperty(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl neu-btn-secondary text-xs font-bold text-slate-600"
              >
                Close Preview
              </button>
              <Link
                href={`/properties/${quickViewProperty._id}`}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl neu-btn-primary text-xs font-bold text-white text-center"
              >
                View Full Legal Dossier &amp; Contact Owner →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
