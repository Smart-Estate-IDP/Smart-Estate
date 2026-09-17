"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LawyerPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchLawyerSession = useCallback(async () => {
    try {
      const tabToken =
        typeof window !== "undefined"
          ? sessionStorage.getItem("smartestate_token") || localStorage.getItem("smartestate_token")
          : null;

      if (!tabToken) {
        router.push("/login?redirect=/lawyer");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${tabToken}` },
      });

      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();

      if (data.success && data.user) {
        if (data.user.role !== "LAWYER" && data.user.role !== "ADMIN") {
          router.push("/dashboard");
          return;
        }
        setUser(data.user);
        setLawyerProfile(data.lawyerProfile);
        sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
        localStorage.setItem("smartestate_user", JSON.stringify(data.user));
      } else {
        router.push("/login?redirect=/lawyer");
      }
    } catch {
      router.push("/login?redirect=/lawyer");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchLawyerSession();
  }, [fetchLawyerSession]);

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

  // Matching Neumorphic Loading State
  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#DCE5EC] px-4 py-8">
        <div className="rounded-[32px] neu-raised p-6 sm:p-8 text-center space-y-5 max-w-md w-full border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)]">
          <div className="w-16 h-16 rounded-[22px] neu-inset flex items-center justify-center mx-auto p-1.5 animate-pulse">
            <div className="w-full h-full rounded-[16px] bg-gradient-to-br from-indigo-600 to-[#3155FF] flex items-center justify-center text-white text-xl font-bold shadow-[0_8px_20px_rgba(79,70,229,0.4)]">
              ⚖️
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-800">SmartEstate Advocate Chamber</h3>
            <p className="text-xs text-slate-500 font-medium">Verifying Bar credentials &amp; active queue...</p>
          </div>
          <div className="w-full h-2 neu-inset rounded-full overflow-hidden p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-[#3155FF] to-emerald-400 animate-pulse w-3/4 shadow-[0_2px_8px_rgba(79,70,229,0.4)]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#DCE5EC] text-slate-800 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner (Neumorphic Raised) */}
        <header className="rounded-[32px] neu-raised p-6 sm:p-10 border border-white/90 shadow-[0_12px_36px_rgba(140,160,185,0.35)] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-[24px] neu-inset flex items-center justify-center p-1.5 shrink-0">
              <div className="w-full h-full rounded-[18px] bg-gradient-to-br from-indigo-600 to-[#3155FF] flex items-center justify-center text-white text-2xl font-black shadow-[0_8px_20px_rgba(79,70,229,0.4)]">
                ⚖️
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Legal Practitioner Chamber
                </span>
                {lawyerProfile?.verified ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    ✓ Bar Council Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    ⏳ Verification In Review
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                Adv. {user?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Bar License: <strong className="text-indigo-700 font-mono">{lawyerProfile?.licenseNumber || "BCI-RECORDED"}</strong> • Practice Exp: {lawyerProfile?.experienceYears || 0} Years
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-5 py-2.5 rounded-full neu-inset text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>Deed Audit Fee:</span>
              <span className="text-indigo-700 font-extrabold text-sm">
                ₹{lawyerProfile?.verificationFee?.toLocaleString() || "2,500"}
              </span>
            </div>
            <Link
              href="/properties"
              className="px-5 py-2.5 rounded-full neu-btn-primary text-xs font-bold"
            >
              Browse Properties
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full neu-raised text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* 4 Metric Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Requests</span>
              <span className="text-xl">📥</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">0</p>
            <span className="text-[10px] text-slate-500 font-medium">Documents awaiting audit</span>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deeds Verified</span>
              <span className="text-xl">⚖️</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">{lawyerProfile?.verifiedCount || 0}</p>
            <span className="text-[10px] text-emerald-600 font-bold">Reports generated</span>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Client Rating</span>
              <span className="text-xl">⭐</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-[#3155FF]">
              {lawyerProfile?.rating ? lawyerProfile.rating.toFixed(1) : "5.0"}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Verified Client Reviews</span>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] neu-raised space-y-2 border border-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
              <span className="text-xl">💰</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-800">₹0</p>
            <span className="text-[10px] text-slate-500 font-medium">Deed audit disbursements</span>
          </div>
        </section>

        {/* Verification Queue Section */}
        <section className="p-6 sm:p-8 rounded-[28px] neu-raised space-y-6 border border-white/90">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>📜</span> Client Document Verification Queue
            </h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              48h Turnaround SLA
            </span>
          </div>

          <div className="p-12 rounded-2xl neu-inset text-center space-y-2">
            <span className="text-3xl">🗂️</span>
            <p className="text-sm font-bold text-slate-700">No pending verification requests</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When buyers or sellers upload sale deeds, mother deeds, and revenue records for audit, they will populate here for legal inspection.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
