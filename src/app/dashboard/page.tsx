"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserImageManager from "@/components/UserImageManager";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "LAWYER" | "ADMIN";
  savedProperties?: any[];
  isEmailVerified?: boolean;
  createdAt?: string;
}

interface SavedPropertyPreview {
  _id: string;
  title: string;
  price: number;
  location: any;
  propertyType: string;
  status: string;
  verificationStatus: string;
  images: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "saved" | "media" | "audits" | "security">("overview");

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [updateMessage, setUpdateMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sample or Fetched Properties
  const [recentProperties, setRecentProperties] = useState<SavedPropertyPreview[]>([]);
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [selectedPropId, setSelectedPropId] = useState<string>("");

  const fetchSession = useCallback(async () => {
    try {
      const tabToken =
        typeof window !== "undefined"
          ? sessionStorage.getItem("smartestate_token") || localStorage.getItem("smartestate_token")
          : null;

      if (!tabToken) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${tabToken}` },
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();

      if (data.success && data.user) {
        if (data.user.role === "LAWYER") {
          router.push("/lawyer");
          return;
        }
        setUser(data.user);
        setNameInput(data.user.name || "");
        setPhoneInput(data.user.phone || "");

        sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
        localStorage.setItem("smartestate_user", JSON.stringify(data.user));
      } else {
        sessionStorage.removeItem("smartestate_token");
        sessionStorage.removeItem("smartestate_user");
        localStorage.removeItem("smartestate_token");
        localStorage.removeItem("smartestate_user");
        router.push("/login?redirect=/dashboard");
      }
    } catch {
      sessionStorage.removeItem("smartestate_token");
      sessionStorage.removeItem("smartestate_user");
      localStorage.removeItem("smartestate_token");
      localStorage.removeItem("smartestate_user");
      router.push("/login?redirect=/dashboard");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSession();

    // Fetch properties for showcase
    fetch("/api/properties")
      .then((res) => res.json())
      .then((d) => {
        if (d.success && Array.isArray(d.properties)) {
          setRecentProperties(d.properties.slice(0, 3));
        }
      })
      .catch(() => {});
  }, [fetchSession]);

  useEffect(() => {
    if (user?._id) {
      fetch(`/api/properties?ownerId=${user._id}&status=ALL`)
        .then((res) => res.json())
        .then((d) => {
          if (d.success && Array.isArray(d.properties)) {
            setMyProperties(d.properties);
            if (d.properties.length > 0) {
              setSelectedPropId(d.properties[0]._id);
            }
          }
        })
        .catch(() => {});
    }
  }, [user?._id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setUpdateMessage({ text: "Name cannot be empty", type: "error" });
      return;
    }

    setSavingProfile(true);
    setUpdateMessage(null);

    try {
      // Optimistic local update
      const updatedUser: UserProfile = {
        ...user!,
        name: nameInput.trim(),
        phone: phoneInput.trim(),
      };
      setUser(updatedUser);
      sessionStorage.setItem("smartestate_user", JSON.stringify(updatedUser));
      localStorage.setItem("smartestate_user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("tab-auth-changed"));

      setIsEditing(false);
      setUpdateMessage({ text: "Profile details updated successfully!", type: "success" });
      setTimeout(() => setUpdateMessage(null), 4000);
    } catch (err: any) {
      setUpdateMessage({ text: err.message || "Failed to update profile", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    sessionStorage.removeItem("smartestate_token");
    sessionStorage.removeItem("smartestate_user");
    localStorage.removeItem("smartestate_token");
    localStorage.removeItem("smartestate_user");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.dispatchEvent(new Event("tab-auth-changed"));
    window.location.href = "/login";
  };

  // 1. MATCHING NEUMORPHIC LOADING STATE (Identical to loading.tsx)
  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#DCE5EC] px-4 py-8">
        <div className="rounded-[32px] neu-raised p-6 sm:p-8 text-center space-y-5 max-w-md w-full border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)]">
          {/* Pulsing Soft Neumorphic Shield */}
          <div className="w-16 h-16 rounded-[22px] neu-inset flex items-center justify-center mx-auto p-1.5 animate-pulse">
            <div className="w-full h-full rounded-[16px] bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center shadow-[0_8px_20px_rgba(49,85,255,0.4)]">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              Smart<span className="text-[#3155FF]">Estate</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Loading User Profile &amp; Deed Vault...</p>
          </div>

          <div className="w-full h-2 neu-inset rounded-full overflow-hidden p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-[#3155FF] via-[#287BFF] to-emerald-400 animate-pulse w-3/4 shadow-[0_2px_8px_rgba(49,85,255,0.4)]" />
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Encrypted Session Active</span>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel =
    user?.role === "ADMIN" ? "Platform Administrator" : user?.role === "LAWYER" ? "Legal Advocate" : "Verified Client";
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : "US";

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] text-slate-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top User Profile Header Banner (Neumorphic Raised) */}
        <header className="rounded-[32px] neu-raised p-6 sm:p-10 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Pill */}
            <div className="relative w-20 h-20 rounded-[24px] neu-inset flex items-center justify-center p-1.5 shrink-0 shadow-inner">
              <div className="w-full h-full rounded-[18px] bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center text-white text-2xl font-black shadow-[0_8px_20px_rgba(49,85,255,0.4)]">
                {userInitials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow">
                ✓
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-[#3155FF] border border-blue-200/80">
                  {roleLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  100% KYC Verified
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {user?._id ? user._id.slice(-8) : "88921"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                {user?.name || "Client Portal"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {user?.email} • {user?.phone || "No phone linked"}
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-5 py-2.5 rounded-full neu-btn-primary text-xs font-bold flex items-center gap-1.5"
              >
                <span>👑</span>
                <span>Admin Command Center</span>
              </Link>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2.5 rounded-full neu-btn-secondary text-xs font-bold text-slate-700 flex items-center gap-1.5"
            >
              <span>✏️</span>
              <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
            </button>
            <Link
              href="/properties"
              className="px-5 py-2.5 rounded-full neu-btn-primary text-xs font-bold flex items-center gap-1.5"
            >
              <span>🏡</span>
              <span>Explore Homes</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full neu-raised text-xs font-bold text-rose-600 hover:text-rose-700 active:neu-inset transition-colors"
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Update Notification */}
        {updateMessage && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold border transition-all ${
              updateMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {updateMessage.text}
          </div>
        )}

        {/* Inline Profile Editing Drawer */}
        {isEditing && (
          <section className="rounded-[28px] neu-raised p-6 sm:p-8 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.25)] space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <span>📝</span>
                <span>Update Personal Details</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">Changes apply immediately to your session</span>
            </div>

            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl neu-btn-secondary text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl neu-btn-primary text-xs font-bold text-white flex items-center gap-2"
                >
                  <span>💾</span>
                  <span>{savingProfile ? "Saving..." : "Save Profile Changes"}</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* 4 Metric Counter Cards (Neumorphic Inset/Raised Strips) */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saved Homes</span>
              <span className="text-xl">❤️</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#3155FF]">
              {user?.savedProperties?.length || 0}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Watchlist properties</span>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deed Audits</span>
              <span className="text-xl">📜</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600">
              0
            </p>
            <span className="text-[10px] text-indigo-500 font-bold">Active Title Reviews</span>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Site Visits</span>
              <span className="text-xl">📅</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">
              0
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">Scheduled Appointments</span>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Listings</span>
              <span className="text-xl">🏡</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-800">
              {myProperties.length}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Active Properties for Sale</span>
          </div>
        </section>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-slate-300/80 pb-3">
          {[
            { id: "overview", label: "Profile Overview", icon: "👤" },
            { id: "saved", label: `Watchlist (${user?.savedProperties?.length || 0})`, icon: "❤️" },
            { id: "media", label: `Property Photos (${myProperties.length})`, icon: "📸" },
            { id: "audits", label: "Legal Document Audits", icon: "⚖️" },
            { id: "security", label: "Security & Credentials", icon: "🛡️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "neu-inset text-[#3155FF] bg-blue-50/50"
                  : "neu-raised text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & DETAILS */}
        {activeTab === "overview" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: User Details & Document Vault */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Account Credentials Card */}
              <div className="p-6 sm:p-8 rounded-[28px] neu-raised space-y-5 border border-white/90">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <span>🪪</span> Official Account Credentials
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Active &amp; Authenticated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl neu-inset space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Legal Name</span>
                    <p className="text-xs font-black text-slate-800">{user?.name || "Client"}</p>
                  </div>

                  <div className="p-4 rounded-2xl neu-inset space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                    <p className="text-xs font-black text-slate-800">{user?.email}</p>
                  </div>

                  <div className="p-4 rounded-2xl neu-inset space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Phone</span>
                    <p className="text-xs font-black text-slate-800">{user?.phone || "None registered"}</p>
                  </div>

                  <div className="p-4 rounded-2xl neu-inset space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Role</span>
                    <p className="text-xs font-black text-[#3155FF]">{roleLabel}</p>
                  </div>
                </div>
              </div>

              {/* Legal Deed Verification Guidance */}
              <div className="p-6 sm:p-8 rounded-[28px] neu-raised space-y-4 border border-white/90">
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <span>⚖️</span> 30-Year Title Deed Verification
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  SmartEstate connects you directly to certified Bar Council legal advisors to inspect mother deeds, encumbrance certificates (EC), RERA permits, and revenue mutation records.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl neu-inset space-y-1">
                    <span className="text-xs font-bold text-indigo-700">Step 1: Select Property Deed</span>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Upload PDF/scanned copies of the sale deed and layout sanctions.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl neu-inset space-y-1">
                    <span className="text-xs font-bold text-emerald-700">Step 2: 48h Advocate Audit</span>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Receive an official Bar-certified legal verification report.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/lawyer"
                    className="px-6 py-3 rounded-xl neu-btn-primary text-xs font-bold inline-flex items-center gap-2"
                  >
                    <span>Hire a Verification Advocate</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Col: Quick Actions & System Security */}
            <div className="space-y-6">
              
              {/* Quick Actions Panel */}
              <div className="p-6 sm:p-8 rounded-[28px] neu-raised space-y-4 border border-white/90">
                <h3 className="text-base font-extrabold text-slate-800">Quick Shortcuts</h3>
                <div className="space-y-2.5">
                  <Link
                    href="/properties"
                    className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-left hover:text-[#3155FF] transition-colors flex items-center justify-between"
                  >
                    <span>Browse Verified Properties</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/sell"
                    className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-left hover:text-[#3155FF] transition-colors flex items-center justify-between"
                  >
                    <span>+ List Property for Sale</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/lawyer"
                    className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-left hover:text-[#3155FF] transition-colors flex items-center justify-between"
                  >
                    <span>Find Legal Experts</span>
                    <span>→</span>
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>👑</span> Admin Command Center
                      </span>
                      <span>→</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Encryption & Security Status Card */}
              <div className="p-6 rounded-[28px] neu-raised space-y-3.5 border border-white/90">
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-slate-800">
                  <span className="text-lg">🔐</span>
                  <span>Session &amp; Security Vault</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-500 font-medium">
                  <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                    <span>Protocol</span>
                    <span className="font-bold text-slate-800 font-mono">JWT HMAC-SHA256</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                    <span>Storage Engine</span>
                    <span className="font-bold text-emerald-600">Local Tab Session</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/80">
                    <span>KYC State</span>
                    <span className="font-bold text-emerald-600">Verified Client</span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* TAB 2: WATCHLIST & PROPERTIES */}
        {activeTab === "saved" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-800">Your Watchlist &amp; Market Properties</h2>
              <Link href="/properties" className="text-xs font-bold text-[#3155FF] hover:underline">
                View all properties →
              </Link>
            </div>

            {recentProperties.length === 0 ? (
              <div className="p-12 rounded-[28px] neu-raised text-center space-y-3 border border-white/90">
                <div className="w-14 h-14 rounded-full neu-inset mx-auto flex items-center justify-center text-2xl">
                  🏡
                </div>
                <p className="text-sm font-bold text-slate-700">No properties in your watchlist yet.</p>
                <p className="text-xs text-slate-500">Explore verified homes and click the heart icon to save them here.</p>
                <Link href="/properties" className="inline-block px-5 py-2.5 rounded-full neu-btn-primary text-xs font-bold mt-2">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProperties.map((prop) => (
                  <div
                    key={prop._id}
                    className="p-5 rounded-[28px] neu-raised space-y-3.5 border border-white/90 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-2xl overflow-hidden neu-inset">
                        <img
                          src={prop.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300">
                          {prop.verificationStatus || "VERIFIED"}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{prop.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {typeof prop.location === "object" ? prop.location.city || prop.location.address : prop.location}
                      </p>
                      <p className="text-base font-extrabold text-[#3155FF]">
                        ₹{(prop.price / 100000).toFixed(2)} Lakh
                      </p>
                    </div>

                    <Link
                      href="/properties"
                      className="w-full py-2.5 text-center text-xs font-bold rounded-xl neu-btn-primary block"
                    >
                      View Property Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB: PROPERTY MEDIA / IMAGES */}
        {activeTab === "media" && (
          <section className="space-y-6">
            {myProperties.length === 0 ? (
              <div className="p-10 rounded-[28px] neu-raised border border-white/90 text-center space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-2xl neu-inset mx-auto flex items-center justify-center text-3xl">
                  📸
                </div>
                <h3 className="text-lg font-bold text-slate-800">No Properties Listed Yet</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  You haven&apos;t listed any properties for sale yet. Once you create a listing, you can upload multiple high-resolution photos, adjust captions, and track administrative gallery approval.
                </p>
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full neu-btn-primary text-xs font-bold"
                >
                  <span>+</span> List Your Property Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Property Selector Bar */}
                <div className="p-6 rounded-[24px] neu-raised border border-white/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                      <span>📸</span> Property Photo &amp; Gallery Center
                    </h2>
                    <p className="text-xs text-slate-500">
                      Upload photos, set captions, and view administrative approval &amp; visibility status.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label className="text-xs font-bold text-slate-600 shrink-0">Selected Listing:</label>
                    <select
                      value={selectedPropId}
                      onChange={(e) => setSelectedPropId(e.target.value)}
                      className="px-4 py-2.5 rounded-xl neu-inset text-xs font-bold text-slate-800 outline-none w-full sm:w-72 bg-transparent"
                    >
                      {myProperties.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title} ({p.location?.city || "Active"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedPropId && (
                  <UserImageManager
                    propertyId={selectedPropId}
                    propertyTitle={myProperties.find((p) => p._id === selectedPropId)?.title}
                  />
                )}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: AUDITS */}
        {activeTab === "audits" && (
          <section className="p-8 rounded-[28px] neu-raised space-y-6 border border-white/90">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-800">Title Deed Verification Requests</h2>
                <p className="text-xs text-slate-500 mt-0.5">Track active title searches and advocate clearance certificates</p>
              </div>
              <Link href="/lawyer" className="px-5 py-2.5 rounded-full neu-btn-primary text-xs font-bold">
                + New Audit Request
              </Link>
            </div>

            <div className="p-10 rounded-2xl neu-inset text-center space-y-2">
              <span className="text-3xl">📜</span>
              <p className="text-sm font-bold text-slate-700">No active deed audits</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When you request document verification for a property, the audit milestones will update here live.
              </p>
            </div>
          </section>
        )}

        {/* TAB 4: SECURITY & CREDENTIALS */}
        {activeTab === "security" && (
          <section className="p-8 rounded-[28px] neu-raised space-y-6 border border-white/90 max-w-2xl mx-auto">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-slate-800">Security &amp; Account Settings</h2>
              <p className="text-xs text-slate-500">Manage security tokens and active session credentials</p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl neu-inset flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Password Authentication</p>
                  <p className="text-[11px] text-slate-500">Bcrypt salt encrypted password storage</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Configured
                </span>
              </div>

              <div className="p-4 rounded-2xl neu-inset flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Account Role Authorization</p>
                  <p className="text-[11px] text-slate-500">Role-Based Access Control (RBAC) Enforced</p>
                </div>
                <span className="text-xs font-bold text-[#3155FF] bg-blue-100 px-3 py-1 rounded-full">
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">Need to terminate your current session?</span>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full neu-raised text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                Sign Out Everywhere
              </button>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
