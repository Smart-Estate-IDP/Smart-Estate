"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import UserImageManager from "@/components/UserImageManager";
import { NeuButton, NeuInput } from "@/components/NeumorphicUI";

export default function SellPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [token, setToken] = useState<string | null>(null);
  const [createdProperty, setCreatedProperty] = useState<any | null>(null);
  const [imageCount, setImageCount] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    propertyType: "APARTMENT",
    area: "",
    bedrooms: "2",
    bathrooms: "2",
    address: "",
    city: "",
    state: "",
    pincode: "",
    amenities: "Parking, Lift, 24x7 Security",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const t =
      typeof window !== "undefined"
        ? sessionStorage.getItem("smartestate_token") || localStorage.getItem("smartestate_token")
        : null;
    setToken(t);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push("/login?redirect=/sell");
      return;
    }

    if (!formData.title || !formData.price || !formData.address || !formData.city || !formData.area) {
      setFormError("Please fill out all required fields marked with *.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || `${formData.propertyType} located in ${formData.city}`,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        area: Number(formData.area),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        location: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim() || "India",
          pincode: formData.pincode.trim() || "000000",
        },
        amenities: formData.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        images: [],
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
        throw new Error(data.message || "Failed to create property listing");
      }

      setCreatedProperty(data.property);
      setStep(2);
    } catch (err: any) {
      setFormError(err.message || "Error submitting property details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] text-slate-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Wizard Banner */}
        <header className="rounded-[32px] neu-raised p-6 sm:p-8 border border-white/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3155FF]">
                Listing Creator
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                List Your Real Estate Property
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Create your listing and upload photos for admin gallery approval &amp; public showcase.
              </p>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 1
                    ? "bg-[#3155FF] text-white shadow-[0_4px_12px_rgba(49,85,255,0.4)]"
                    : "neu-inset text-slate-400"
                }`}
              >
                1
              </div>
              <div className={`w-8 h-1 rounded-full ${step >= 2 ? "bg-[#3155FF]" : "bg-slate-300"}`} />
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= 2
                    ? "bg-[#3155FF] text-white shadow-[0_4px_12px_rgba(49,85,255,0.4)]"
                    : "neu-inset text-slate-400"
                }`}
              >
                2
              </div>
              <div className={`w-8 h-1 rounded-full ${step >= 3 ? "bg-[#3155FF]" : "bg-slate-300"}`} />
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 3
                    ? "bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.4)]"
                    : "neu-inset text-slate-400"
                }`}
              >
                ✓
              </div>
            </div>
          </div>
        </header>

        {/* STEP 1: PROPERTY DETAILS FORM */}
        {step === 1 && (
          <form onSubmit={handleSubmitDetails} className="p-6 sm:p-10 rounded-[32px] neu-raised border border-white/90 space-y-6">
            <h2 className="text-lg font-extrabold text-slate-800 border-b border-slate-200/80 pb-3">
              Step 1: Property Information
            </h2>

            {formError && (
              <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxurious 3BHK Skyline Penthouse with Balcony"
                  required
                  className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 8500000"
                    required
                    className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none bg-transparent"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="VILLA">Villa</option>
                    <option value="PLOT">Plot</option>
                    <option value="COMMERCIAL">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Carpet Area (sq. ft.) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. 1850"
                    required
                    className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Flat 902, Tower 4, Prestige Palms"
                    required
                    className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    required
                    className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property highlights, nearby landmarks, and amenities..."
                  className="w-full px-4 py-3 rounded-2xl neu-inset text-xs font-medium text-slate-800 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200/80">
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-full neu-raised text-xs font-bold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-full neu-btn-primary text-xs font-bold disabled:opacity-60"
              >
                {submitting ? "Saving Listing..." : "Continue to Photo Upload →"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PHOTO UPLOADER & MANAGER */}
        {step === 2 && createdProperty && (
          <div className="space-y-6">
            <div className="p-6 rounded-[28px] neu-raised border border-white/90 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ✓ Listing Initialized
                </span>
                <h2 className="text-xl font-black text-slate-800 mt-2">
                  {createdProperty.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Upload multiple photos now. Each image is sent for admin verification before public appearance.
                </p>
              </div>

              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-full neu-btn-primary text-xs font-bold shrink-0"
              >
                Done &amp; Finish →
              </button>
            </div>

            <UserImageManager
              propertyId={createdProperty._id}
              propertyTitle={createdProperty.title}
              onImageCountChange={(count) => setImageCount(count)}
            />
          </div>
        )}

        {/* STEP 3: CONFIRMATION */}
        {step === 3 && createdProperty && (
          <div className="p-10 rounded-[32px] neu-raised border border-white/90 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 text-4xl flex items-center justify-center mx-auto shadow-inner">
              ✓
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800">
                Property Submitted Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                Your listing <strong>&ldquo;{createdProperty.title}&rdquo;</strong> and its {imageCount} photo(s) have been saved securely. Our administrative review team will moderate the media for public gallery showcase.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full neu-btn-primary text-xs font-bold"
              >
                Go to Dashboard
              </Link>
              <Link
                href={`/properties/${createdProperty._id}`}
                className="px-6 py-3 rounded-full neu-raised text-xs font-bold text-slate-700 hover:text-slate-900"
              >
                View Listing Preview
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
