"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "LAWYER" | "ADMIN";
  createdAt?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const tabToken =
        typeof window !== "undefined"
          ? sessionStorage.getItem("smartestate_token") || localStorage.getItem("smartestate_token")
          : null;

      if (!tabToken) {
        router.push("/login?redirect=/dashboard/profile");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${tabToken}` },
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
        sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
        localStorage.setItem("smartestate_user", JSON.stringify(data.user));
      } else {
        router.push("/login?redirect=/dashboard/profile");
      }
    } catch {
      router.push("/login?redirect=/dashboard/profile");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ text: "Name cannot be empty", type: "error" });
      return;
    }

    setIsSaving(true);
    try {
      const updated: UserProfile = { ...user!, name: name.trim(), phone: phone.trim() };
      setUser(updated);
      sessionStorage.setItem("smartestate_user", JSON.stringify(updated));
      localStorage.setItem("smartestate_user", JSON.stringify(updated));
      window.dispatchEvent(new Event("tab-auth-changed"));
      setFeedback({ text: "Profile changes saved successfully!", type: "success" });
      setTimeout(() => setFeedback(null), 4000);
    } catch {
      setFeedback({ text: "Failed to update profile", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Neumorphic Loading State
  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#DCE5EC] px-4 py-8">
        <div className="rounded-[32px] neu-raised p-6 sm:p-8 text-center space-y-5 max-w-md w-full border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)]">
          <div className="w-16 h-16 rounded-[22px] neu-inset flex items-center justify-center mx-auto p-1.5 animate-pulse">
            <div className="w-full h-full rounded-[16px] bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center text-white font-bold text-xl shadow-[0_8px_20px_rgba(49,85,255,0.4)]">
              👤
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">SmartEstate Profile</h3>
            <p className="text-xs text-slate-500 font-medium">Loading your profile preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  const roleTitle =
    user?.role === "ADMIN" ? "Platform Administrator" : user?.role === "LAWYER" ? "Legal Advocate" : "Verified Client";

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] text-slate-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/dashboard" className="hover:text-[#3155FF] transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-[#3155FF]">Profile Settings</span>
        </div>

        {/* Profile Card Header */}
        <header className="rounded-[32px] neu-raised p-6 sm:p-8 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-[24px] neu-inset flex items-center justify-center p-1.5 shrink-0">
              <div className="w-full h-full rounded-[18px] bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center text-white text-2xl font-black shadow-[0_8px_20px_rgba(49,85,255,0.4)]">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "US"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-[#3155FF]">
                  {roleTitle}
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {user?._id?.slice(-6) || "USER"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800">{user?.name}</h1>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full neu-btn-secondary text-xs font-bold text-slate-700"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </header>

        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold border transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Profile Edit Form */}
        <section className="rounded-[32px] neu-raised p-6 sm:p-10 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <h2 className="text-lg font-extrabold text-slate-800">Edit Account Information</h2>
            <p className="text-xs text-slate-500 mt-1">
              Update your personal credentials and contact methods for property notifications.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-2xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 text-xs rounded-2xl neu-inset bg-[#D5DFE7] outline-none text-slate-800 font-medium border border-slate-200/60"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-4 py-3 text-xs rounded-2xl neu-inset bg-[#D5DFE7] outline-none text-slate-500 font-medium border border-slate-200/60 cursor-not-allowed opacity-75"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Email address is linked to account authentication and cannot be changed.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  System Role
                </label>
                <input
                  type="text"
                  disabled
                  value={roleTitle}
                  className="w-full px-4 py-3 text-xs rounded-2xl neu-inset bg-[#D5DFE7] outline-none text-[#3155FF] font-bold border border-slate-200/60 cursor-not-allowed opacity-75"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 rounded-2xl neu-btn-primary text-xs font-bold text-white flex items-center gap-2"
              >
                <span>💾</span>
                <span>{isSaving ? "Saving..." : "Save Profile Details"}</span>
              </button>
            </div>
          </form>
        </section>

      </div>
    </div>
  );
}
