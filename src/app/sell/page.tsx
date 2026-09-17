"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UploadedPhoto {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl?: string;
}

const PROPERTY_TYPES = [
  { id: "APARTMENT", label: "Apartment / Flat", icon: "🏢" },
  { id: "HOUSE", label: "Independent House", icon: "🏡" },
  { id: "VILLA", label: "Luxury Villa", icon: "🏰" },
  { id: "COMMERCIAL", label: "Commercial Office / Shop", icon: "🏬" },
  { id: "PLOT", label: "Residential Plot / Land", icon: "📐" },
  { id: "OTHER", label: "Penthouse / Studio", icon: "✨" },
];

const AVAILABLE_AMENITIES = [
  "24/7 Security & CCTV",
  "Power Backup",
  "Covered Car Parking",
  "Swimming Pool",
  "Gym & Fitness Center",
  "Clubhouse",
  "Private Garden / Lawn",
  "Elevator / Lift",
  "Solar Water Heating",
  "Children's Play Area",
  "Fire Safety System",
  "RERA Approved Layout",
];

export default function SellPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Listing Form State
  const [listingType, setListingType] = useState<"SELL" | "RENT">("SELL");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("APARTMENT");
  const [price, setPrice] = useState<number | "">("");
  const [area, setArea] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);

  // Location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "24/7 Security & CCTV",
    "Covered Car Parking",
    "Power Backup",
  ]);

  // ImageKit Uploaded Photos
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdProperty, setCreatedProperty] = useState<any>(null);

  // Verify auth session
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? sessionStorage.getItem("smartestate_token") || localStorage.getItem("smartestate_token")
        : null;

    if (!token) {
      setAuthChecked(true);
      return;
    }

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  // Handle Photo Selection & Direct Upload to ImageKit via /api/upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMessage("");

    try {
      const token =
        sessionStorage.getItem("smartestate_token") || localStorage.getItem("smartestate_token");

      if (!token) {
        setErrorMessage("Please sign in to upload property photos.");
        setUploading(false);
        return;
      }

      const newPhotos: UploadedPhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgressText(`Uploading ${i + 1} of ${files.length} to ImageKit (${file.name})...`);

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }

        if (data.images && Array.isArray(data.images)) {
          newPhotos.push(...data.images);
        } else if (data.url) {
          newPhotos.push({
            url: data.url,
            fileId: data.fileId || `ik-${Date.now()}`,
            name: data.name || file.name,
            thumbnailUrl: data.thumbnailUrl || data.url,
          });
        }
      }

      setUploadedPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload photo to ImageKit");
    } finally {
      setUploading(false);
      setUploadProgressText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setUploadedPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Submit Listing
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Please enter a property title.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMessage("Please enter a valid price / rent amount.");
      return;
    }
    if (!area || Number(area) <= 0) {
      setErrorMessage("Please specify the built-up / carpet area.");
      return;
    }
    if (!address.trim() || !city.trim() || !state.trim()) {
      setErrorMessage("Please fill in complete location details (Address, City, State).");
      return;
    }
    if (uploadedPhotos.length === 0) {
      setErrorMessage("Please upload at least 1 photo of the property to store in ImageKit.");
      return;
    }

    setSubmitting(true);

    try {
      const token =
        sessionStorage.getItem("smartestate_token") || localStorage.getItem("smartestate_token");

      const imageUrls = uploadedPhotos.map((p) => p.url);

      const payload = {
        title: title.trim(),
        description: description.trim() || `${listingType === "RENT" ? "Rental" : "Sale"} listing for a ${propertyType.toLowerCase()} in ${city.trim()}.`,
        price: Number(price),
        listingType,
        propertyType,
        area: Number(area),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        location: {
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          zipCode: zipCode.trim() || undefined,
        },
        amenities: selectedAmenities,
        images: imageUrls,
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create property listing.");
      }

      setCreatedProperty(data.property);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit property listing.");
    } finally {
      setSubmitting(false);
    }
  };

  // Auth Gate: If user not signed in
  if (authChecked && !currentUser) {
    return (
      <div className="min-h-[85vh] bg-[#DCE5EC] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-[32px] neu-raised p-8 sm:p-10 text-center space-y-6 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)]">
          <div className="w-16 h-16 rounded-[22px] neu-inset flex items-center justify-center mx-auto text-3xl">
            🔐
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sign In Required</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              You must have an authenticated SmartEstate account to list properties and upload photos to ImageKit.
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/login?redirect=/sell"
              className="w-full py-3 rounded-2xl neu-btn-primary text-xs font-bold text-white text-center"
            >
              Sign In to Your Account →
            </Link>
            <Link
              href="/signup?redirect=/sell"
              className="w-full py-3 rounded-2xl neu-btn-secondary text-xs font-bold text-slate-700 text-center"
            >
              Create a Free Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (createdProperty) {
    return (
      <div className="min-h-[85vh] bg-[#DCE5EC] flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-[32px] neu-raised p-8 sm:p-10 text-center space-y-6 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)]">
          <div className="w-16 h-16 rounded-full neu-inset mx-auto flex items-center justify-center text-3xl text-emerald-500">
            ✓
          </div>
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-700">
              Listing Created Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
              {createdProperty.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Your property has been submitted with{" "}
              <strong>{uploadedPhotos.length} photo(s)</strong> securely stored in ImageKit. It is now queued for verification and marketplace publishing.
            </p>
          </div>

          {/* First Photo Preview */}
          {uploadedPhotos[0] && (
            <div className="w-full h-44 rounded-2xl overflow-hidden neu-inset p-1">
              <img
                src={uploadedPhotos[0].url}
                alt="Uploaded property"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/properties"
              className="flex-1 py-3 rounded-2xl neu-btn-primary text-xs font-bold text-white text-center"
            >
              Explore in Marketplace →
            </Link>
            <button
              onClick={() => {
                setCreatedProperty(null);
                setUploadedPhotos([]);
                setTitle("");
                setDescription("");
                setPrice("");
                setArea("");
                setAddress("");
                setCity("");
                setState("");
              }}
              className="flex-1 py-3 rounded-2xl neu-btn-secondary text-xs font-bold text-slate-700"
            >
              + List Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] text-slate-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Ribbon */}
        <header className="rounded-[32px] neu-raised p-6 sm:p-10 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-inset text-xs font-bold uppercase tracking-wider text-[#3155FF]">
              <span className="w-2 h-2 rounded-full bg-[#3155FF] animate-pulse" />
              <span>Real Estate Seller &amp; Landlord Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              List Property for <span className="text-[#3155FF]">{listingType === "SELL" ? "Sale" : "Rent"}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Upload photos to ImageKit and connect with authenticated buyers &amp; legal advocates.
            </p>
          </div>

          {/* Sell vs Rent Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl neu-inset bg-[#D5DFE7] self-start md:self-auto">
            <button
              type="button"
              onClick={() => setListingType("SELL")}
              className={`py-2 px-5 rounded-xl text-xs font-bold transition-all ${
                listingType === "SELL"
                  ? "neu-raised text-[#3155FF] bg-[#E2EAF1]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Sale
            </button>
            <button
              type="button"
              onClick={() => setListingType("RENT")}
              className={`py-2 px-5 rounded-xl text-xs font-bold transition-all ${
                listingType === "RENT"
                  ? "neu-raised text-indigo-600 bg-[#E2EAF1]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Rent
            </button>
          </div>
        </header>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl neu-inset bg-rose-50/80 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-3">
            <span className="text-base">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Listing Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: PHOTO UPLOADS TO IMAGEKIT */}
          <section className="rounded-[32px] neu-raised p-6 sm:p-8 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <span>📸</span> Property Photos (ImageKit Storage)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-resolution photos are uploaded directly to ImageKit CDN for fast, optimized viewing.
                </p>
              </div>
              <span className="text-xs font-bold text-[#3155FF] bg-blue-100 px-3 py-1 rounded-full">
                {uploadedPhotos.length} Photo(s) Uploaded
              </span>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/*"
              multiple
              className="hidden"
            />

            {/* Drop / Click Zone */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`p-8 rounded-2xl neu-inset text-center cursor-pointer border-2 border-dashed transition-all ${
                uploading
                  ? "border-[#3155FF] bg-blue-50/40 cursor-wait"
                  : "border-slate-300 hover:border-[#3155FF] hover:bg-white/40"
              }`}
            >
              <div className="max-w-sm mx-auto space-y-2">
                <div className="w-14 h-14 rounded-2xl neu-raised flex items-center justify-center mx-auto text-2xl">
                  {uploading ? "⏳" : "☁️"}
                </div>
                <div className="text-xs font-extrabold text-slate-800">
                  {uploading
                    ? uploadProgressText || "Uploading to ImageKit..."
                    : "Click to select property photos or drag & drop"}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Supports PNG, JPG, WEBP • Max 10MB per photo
                </p>
              </div>
            </div>

            {/* Uploaded Photos Thumbnails Grid */}
            {uploadedPhotos.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-700">Uploaded Photos:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {uploadedPhotos.map((photo, idx) => (
                    <div
                      key={photo.fileId || idx}
                      className="relative rounded-2xl overflow-hidden neu-raised p-1 group border border-white"
                    >
                      <img
                        src={photo.thumbnailUrl || photo.url}
                        alt={photo.name}
                        className="w-full h-28 object-cover rounded-xl"
                      />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#3155FF] text-white">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePhoto(idx);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-md hover:bg-rose-700 transition-colors"
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* SECTION 2: BASIC DETAILS & PRICING */}
          <section className="rounded-[32px] neu-raised p-6 sm:p-8 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] space-y-5">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>🏷️</span> Property Details &amp; Pricing
            </h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Property Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Greenwood Lakeview 3 BHK Luxury Penthouse"
                className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
              />
            </div>

            {/* Property Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Property Type <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setPropertyType(pt.id)}
                    className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all text-left ${
                      propertyType === pt.id
                        ? "neu-inset text-[#3155FF] bg-blue-50/50 border border-blue-200"
                        : "neu-raised text-slate-700 hover:text-slate-900 border border-white"
                    }`}
                  >
                    <span className="text-lg">{pt.icon}</span>
                    <span>{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {listingType === "SELL" ? "Asking Price (₹ INR)" : "Monthly Rent (₹ INR)"} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
                    placeholder={listingType === "SELL" ? "8500000" : "45000"}
                    className="w-full pl-8 pr-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-bold border border-slate-200/60"
                  />
                </div>
                {price && Number(price) >= 100000 && (
                  <span className="text-[11px] font-bold text-[#3155FF] mt-1 block">
                    ≈ ₹{(Number(price) / (Number(price) >= 10000000 ? 10000000 : 100000)).toFixed(2)}{" "}
                    {Number(price) >= 10000000 ? "Crore" : "Lakh"}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Carpet / Super Built-Up Area (Sq. Ft.) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={area}
                  onChange={(e) => setArea(e.target.value ? Number(e.target.value) : "")}
                  placeholder="1850"
                  className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-bold border border-slate-200/60"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Bedrooms
                </label>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-bold border border-slate-200/60 cursor-pointer"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num === 0 ? "Studio / Open Layout" : `${num} BHK`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Bathrooms
                </label>
                <select
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-bold border border-slate-200/60 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>
                      {num} Bathroom{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* SECTION 3: LOCATION */}
          <section className="rounded-[32px] neu-raised p-6 sm:p-8 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] space-y-5">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>📍</span> Geographic Location
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Street Address / Society <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Tower 4, Flat 1202, Golf Course Road"
                className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Gurugram"
                  className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  State <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Haryana"
                  className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Postal Pincode
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="122002"
                  className="w-full px-4 py-3 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
                />
              </div>
            </div>
          </section>

          {/* SECTION 4: AMENITIES & DESCRIPTION */}
          <section className="rounded-[32px] neu-raised p-6 sm:p-8 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] space-y-5">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>✨</span> Highlights &amp; Amenities
            </h2>

            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                      isSelected
                        ? "neu-inset text-[#3155FF] bg-blue-50/60 border border-blue-200"
                        : "neu-raised text-slate-600 hover:text-slate-900 border border-white"
                    }`}
                  >
                    {isSelected ? "✓ " : "+ "}
                    {amenity}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Description / Special Features
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention clear title deed history, OC availability, nearby metro/schools, furnish status, and vaastu compliance..."
                className="w-full p-4 text-xs rounded-2xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60 resize-none"
              />
            </div>
          </section>

          {/* SUBMIT BUTTON */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-2xl neu-btn-secondary text-xs font-bold text-slate-600"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-8 py-4 rounded-2xl neu-btn-primary text-xs font-bold text-white shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <span>🚀</span>
              <span>
                {submitting
                  ? "Publishing Listing..."
                  : `Publish ${listingType === "SELL" ? "Sale" : "Rental"} Listing`}
              </span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
