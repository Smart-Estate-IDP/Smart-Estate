"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function LawyerPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lawyerProfile, setLawyerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          if (data.user.role !== "LAWYER" && data.user.role !== "ADMIN") {
            router.push("/dashboard");
            return;
          }
          setUser(data.user);
          setLawyerProfile(data.lawyerProfile);
        } else {
          router.push("/login?redirect=/lawyer");
        }
      })
      .catch(() => {
        router.push("/login?redirect=/lawyer");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050714] text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading Lawyer Chamber...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#050714] via-[#0d0f28] via-[#1a103c] to-[#070618] text-slate-100 font-sans">
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-8 glass-panel border border-purple-500/30 overflow-hidden mb-8 bg-gradient-to-r from-purple-950/20 via-indigo-950/20 to-slate-950">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Legal Practitioner Chamber
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
                <span>Adv. {user?.name}</span>
                {lawyerProfile?.verified ? (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    ✓ Bar Verified
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                    ⏳ Verification In Review
                  </span>
                )}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Bar License:{" "}
                <span className="text-purple-300 font-mono font-semibold">
                  {lawyerProfile?.licenseNumber || "BCI-RECORDED"}
                </span>{" "}
                • Practice Exp: {lawyerProfile?.experienceYears || 0} Years
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="px-5 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 text-sm font-semibold flex items-center gap-2">
                <span>Audit Fee:</span>
                <span className="text-white font-extrabold text-base">
                  ₹{lawyerProfile?.verificationFee?.toLocaleString() || "2,500"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Pending Requests</span>
              <span className="text-xl">📥</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3">0</div>
            <div className="text-xs text-amber-300 mt-1">Documents awaiting audit</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Deeds Verified</span>
              <span className="text-xl">⚖️</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3">{lawyerProfile?.verifiedCount || 0}</div>
            <div className="text-xs text-emerald-300 mt-1">Reports generated</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Client Rating</span>
              <span className="text-xl">⭐</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3">
              {lawyerProfile?.rating ? lawyerProfile.rating.toFixed(1) : "5.0"}
            </div>
            <div className="text-xs text-purple-300 mt-1">
              Based on {lawyerProfile?.reviewCount || 0} reviews
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Earnings</span>
              <span className="text-xl">💳</span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-3">₹0</div>
            <div className="text-xs text-slate-400 mt-1">Paid out to bank</div>
          </div>
        </div>

        {/* Audit Queue Section */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Title Deed Audit Requests</h2>
              <p className="text-xs text-slate-400 mt-1">
                Property documents assigned to your chamber for 30-year search and encumbrance verification.
              </p>
            </div>
            <span className="text-xs text-purple-300 font-medium">Real-time sync active</span>
          </div>

          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <span className="text-4xl">📂</span>
            <h3 className="text-base font-bold text-white mt-4">No Pending Verification Requests</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
              When property buyers or sellers request legal verification for deed documents, their requests will appear here for your formal review and remarks.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
