"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
  isMain: boolean;
  displayOrder: number;
}

interface PropertyDetails {
  _id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  status: string;
  verificationStatus?: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  ownerId?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  galleryImages?: GalleryImage[];
  createdAt: string;
}

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params?.id as string;

  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        // 1. Fetch Property Details
        const propRes = await fetch(`/api/properties/${propertyId}`);
        const propData = await propRes.json();
        if (!propRes.ok || !propData.success) {
          throw new Error(propData.message || "Failed to load property");
        }
        setProperty(propData.property);

        // 2. Fetch Public Approved Visible Images
        const imgRes = await fetch(`/api/properties/${propertyId}/images`);
        const imgData = await imgRes.json();
        if (imgRes.ok && imgData.success && Array.isArray(imgData.images)) {
          setImages(imgData.images);
          // If a main image exists, find its index
          const mainIdx = imgData.images.findIndex((img: GalleryImage) => img.isMain);
          if (mainIdx >= 0) {
            setSelectedImageIndex(mainIdx);
          }
        }
      } catch (err: any) {
        setError(err.message || "Could not fetch property information");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] flex items-center justify-center p-6">
        <div className="p-8 rounded-[32px] neu-raised text-center space-y-4 max-w-sm w-full border border-white/90">
          <div className="w-12 h-12 rounded-full border-4 border-[#3155FF] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading Property &amp; Verified Gallery...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] flex items-center justify-center p-6">
        <div className="p-8 rounded-[32px] neu-raised text-center space-y-4 max-w-md w-full border border-white/90">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-lg font-bold text-slate-800">Property Not Found</h2>
          <p className="text-xs text-slate-500">{error || "This listing may have been moved or unpublished."}</p>
          <Link
            href="/properties"
            className="inline-block px-6 py-2.5 rounded-full neu-btn-primary text-xs font-bold"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  const activeImage = images[selectedImageIndex] || null;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] text-slate-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-slate-800">Properties</Link>
            <span>/</span>
            <span className="text-slate-800 truncate max-w-[200px]">{property.title}</span>
          </div>

          <Link
            href="/properties"
            className="px-4 py-2 rounded-full neu-raised text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            ← Back to Listings
          </Link>
        </div>

        {/* Gallery Section */}
        <div className="p-4 sm:p-6 rounded-[32px] neu-raised border border-white/90 space-y-4">
          {images.length > 0 ? (
            <div className="space-y-4">
              {/* Featured / Hero Display */}
              <div
                className="relative w-full h-[320px] sm:h-[480px] lg:h-[540px] rounded-[24px] neu-inset overflow-hidden group cursor-pointer"
                onClick={() => setLightboxOpen(true)}
              >
                {activeImage && (
                  <img
                    src={activeImage.url}
                    alt={activeImage.caption || property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Hero Overlay Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {activeImage?.isMain && (
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#3155FF] text-white shadow-lg">
                      ★ Featured Cover
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur text-slate-800 shadow">
                    📸 {selectedImageIndex + 1} of {images.length}
                  </span>
                </div>

                {/* Lightbox hint button */}
                <button
                  type="button"
                  className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-900/90 text-white text-xs font-bold backdrop-blur transition-all flex items-center gap-1.5 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                >
                  <span>⤢</span> Fullscreen Gallery
                </button>

                {/* Caption Bar */}
                {activeImage?.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 sm:p-6 text-white">
                    <p className="text-xs sm:text-sm font-medium drop-shadow">
                      {activeImage.caption}
                    </p>
                  </div>
                )}
              </div>

              {/* Thumbnails Navigation Bar */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                  {images.map((img, idx) => (
                    <button
                      key={img._id}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-2xl overflow-hidden shrink-0 transition-all border-2 ${
                        selectedImageIndex === idx
                          ? "border-[#3155FF] shadow-[0_4px_16px_rgba(49,85,255,0.4)] scale-105"
                          : "border-transparent opacity-70 hover:opacity-100 neu-raised"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.caption || `Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {img.isMain && (
                        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#3155FF]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Fallback When No Approved Images Yet */
            <div className="w-full h-[320px] rounded-[24px] neu-inset flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-16 h-16 rounded-full neu-raised flex items-center justify-center text-3xl">
                📸
              </div>
              <p className="text-sm font-bold text-slate-700">Official Gallery In Curation</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Property photographs are undergoing administrative quality verification. High-resolution gallery will appear here once approved.
              </p>
            </div>
          )}
        </div>

        {/* Property Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 sm:p-8 rounded-[32px] neu-raised border border-white/90 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-[#3155FF]">
                  {property.propertyType}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  {property.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                {property.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 font-medium">
                <span>📍</span>
                <span>
                  {property.location?.address}, {property.location?.city}, {property.location?.state}
                </span>
              </p>

              {/* Quick Specs Pill Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80">
                <div className="p-3.5 rounded-2xl neu-inset text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Area</span>
                  <p className="text-xs font-black text-slate-800">{property.area} sq.ft</p>
                </div>
                <div className="p-3.5 rounded-2xl neu-inset text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Bedrooms</span>
                  <p className="text-xs font-black text-slate-800">{property.bedrooms || "—"} BHK</p>
                </div>
                <div className="p-3.5 rounded-2xl neu-inset text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Baths</span>
                  <p className="text-xs font-black text-slate-800">{property.bathrooms || "—"} Washrooms</p>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="p-6 sm:p-8 rounded-[32px] neu-raised border border-white/90 space-y-3">
              <h2 className="text-base font-extrabold text-slate-800">Property Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>

              {property.amenities && property.amenities.length > 0 && (
                <div className="pt-4 border-t border-slate-200/80 space-y-2">
                  <h3 className="text-xs font-bold text-slate-600">Featured Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full neu-inset text-[11px] font-bold text-slate-700"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Contact Sidebar */}
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-[32px] neu-raised border border-white/90 space-y-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Asking Price
                </span>
                <p className="text-3xl font-black text-[#3155FF] mt-1">
                  ₹{(property.price / 100000).toFixed(2)} Lakh
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ₹{Math.round(property.price / (property.area || 1))} / sq.ft carpet
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <Link
                  href="/lawyer"
                  className="w-full py-3.5 rounded-full neu-btn-primary text-xs font-bold text-center block"
                >
                  ⚖️ Request Legal Title Audit
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full py-3 rounded-full neu-raised text-xs font-bold text-slate-700 hover:text-slate-900 text-center block"
                >
                  Save to Watchlist
                </Link>
              </div>

              {/* Owner card */}
              {property.ownerId && (
                <div className="p-4 rounded-2xl neu-inset space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Listed By Owner
                  </span>
                  <p className="text-xs font-bold text-slate-800">{property.ownerId.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{property.ownerId.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && activeImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <div
              className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="absolute -top-12 right-0 px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white/40 text-sm font-bold transition-all"
              >
                ✕ Close
              </button>

              {/* Image with Prev/Next controls */}
              <div className="relative w-full flex items-center justify-center">
                <img
                  src={activeImage.url}
                  alt={activeImage.caption || "Fullscreen preview"}
                  className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center font-bold text-lg backdrop-blur transition-all"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center font-bold text-lg backdrop-blur transition-all"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Caption & Counter */}
              <div className="mt-4 text-center text-white space-y-1">
                {activeImage.caption && (
                  <p className="text-sm font-medium">{activeImage.caption}</p>
                )}
                <p className="text-xs text-white/60">
                  {selectedImageIndex + 1} / {images.length}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
