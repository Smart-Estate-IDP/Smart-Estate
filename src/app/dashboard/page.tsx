"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) {
          // If a lawyer opens client dashboard, guide them to lawyer portal
          if (data.user.role === "LAWYER") {
            router.push("/lawyer");
            return;
          }
          setUser(data.user);
        } else {
          router.push("/login");
        }
      })
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050714] text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#050714] via-[#0d0f28] via-[#1a103c] to-[#070618] text-slate-100 font-sans">
      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-8 glass-panel border border-white/10 overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Client Portal
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Welcome back, {user?.name || "Client"} 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {user?.email} • Account Role: <span className="text-purple-300 font-semibold">{user?.role}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/properties"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-600/30"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/sell"
                className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/10 text-white font-semibold text-sm transition-all"
              >
                + List Property
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Saved Properties</span>
              <span className="text-xl">❤️</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3">{user?.savedProperties?.length || 0}</div>
            <div className="text-xs text-indigo-300 mt-1">Items in your watchlist</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Deed Audits</span>
              <span className="text-xl">📜</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3">0</div>
            <div className="text-xs text-purple-300 mt-1">Active verification requests</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">Scheduled Visits</span>
              <span className="text-xl">📅</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3">0</div>
            <div className="text-xs text-emerald-300 mt-1">Upcoming appointments</div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">My Listings</span>
              <span className="text-xl">🏡</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-3">0</div>
            <div className="text-xs text-sky-300 mt-1">Properties listed for sale</div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Legal Verification Request */}
          <div className="lg:col-span-2 p-8 rounded-3xl glass-panel border border-white/10">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span>⚖️</span> Request Property Document Verification
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Never purchase property without verifying the 30-year title deed, mother deed, encumbrance certificate, and approved layout sanctions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-xs font-bold text-indigo-300 mb-1">Step 1: Upload Documents</div>
                <div className="text-xs text-slate-400">Provide sale deed copies or encumbrance certificates.</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                <div className="text-xs font-bold text-purple-300 mb-1">Step 2: Choose Registered Lawyer</div>
                <div className="text-xs text-slate-400">Select advocate based on fee and rating for a 48h audit report.</div>
              </div>
            </div>

            <Link
              href="/lawyer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-600/30"
            >
              <span>Explore Lawyer Directory</span>
              <span>→</span>
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Account Overview</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">User ID</span>
                  <span className="text-slate-200 font-mono">{user?._id?.slice(-8) || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Role</span>
                  <span className="text-indigo-300 font-bold">{user?.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Email Status</span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-slate-400">Phone</span>
                  <span className="text-slate-200">{user?.phone || "Not linked"}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/properties"
                className="w-full block text-center py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-bold transition-colors"
              >
                Search Verified Properties
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
