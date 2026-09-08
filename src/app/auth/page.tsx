"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function AuthGatewayContent() {
  const searchParams = useSearchParams();
  const preferredMode = searchParams.get("mode") || "signup";

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 max-w-6xl mx-auto w-full">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neonmorphic-card text-xs font-semibold uppercase tracking-widest text-cyan-300 mb-6 border border-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f3ff] animate-ping" />
          <span>Step 1 • Choose Your Role</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          Select Your{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,243,255,0.4)]">
            Account Type
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed font-light">
          Choose whether you are exploring verified properties as a client, or conducting title deed audits as a licensed advocate.
        </p>
      </div>

      {/* The Two Neonmorphic Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* CARD 1: CLIENT / USER (NEON CYAN THEME) */}
        <div className="group relative rounded-3xl p-8 sm:p-10 neonmorphic-card neonmorphic-card-cyan flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(0,243,255,0.25)] group-hover:scale-110 transition-transform duration-300">
                🏢
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 shadow-[0_0_12px_rgba(0,243,255,0.2)]">
                Property Seeker / Investor
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
              Client / User
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Explore 100% legally authenticated real estate, request comprehensive 30-year deed audits, and schedule site tours.
            </p>

            {/* Feature Bullets */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-[10px] font-bold shadow-[0_0_8px_rgba(0,243,255,0.4)]">✓</span>
                <span>Browse 100% verified real estate listings</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-[10px] font-bold shadow-[0_0_8px_rgba(0,243,255,0.4)]">✓</span>
                <span>Request lawyer-backed title deed & encumbrance audits</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 text-[10px] font-bold shadow-[0_0_8px_rgba(0,243,255,0.4)]">✓</span>
                <span>List properties for sale with verified badges</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login?role=USER"
              className={`flex-1 text-center py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "login"
                  ? "neon-btn-cyan font-black"
                  : "text-slate-200 bg-white/[0.04] border border-white/10 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-950/30"
              }`}
            >
              Sign In as Client
            </Link>
            <Link
              href="/signup?role=USER"
              className={`flex-1 text-center py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "signup"
                  ? "neon-btn-cyan font-black"
                  : "text-slate-200 bg-white/[0.04] border border-white/10 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-950/30"
              }`}
            >
              Create Account →
            </Link>
          </div>
        </div>

        {/* CARD 2: LAWYER / LEGAL ADVISOR (NEON MAGENTA/PURPLE THEME) */}
        <div className="group relative rounded-3xl p-8 sm:p-10 neonmorphic-card neonmorphic-card-purple flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-400/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(192,38,211,0.25)] group-hover:scale-110 transition-transform duration-300">
                ⚖️
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-300 shadow-[0_0_12px_rgba(192,38,211,0.2)]">
                Licensed Legal Practitioner
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white group-hover:text-fuchsia-200 transition-colors">
              Legal Advisor / Lawyer
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Review uploaded property deeds, conduct encumbrance checks, set consultation fees, and issue legal verification reports.
            </p>

            {/* Feature Bullets */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-300 text-[10px] font-bold shadow-[0_0_8px_rgba(192,38,211,0.4)]">✓</span>
                <span>Receive title deed audit requests from buyers</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-300 text-[10px] font-bold shadow-[0_0_8px_rgba(192,38,211,0.4)]">✓</span>
                <span>Set your custom document verification audit fee</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/50 flex items-center justify-center text-fuchsia-300 text-[10px] font-bold shadow-[0_0_8px_rgba(192,38,211,0.4)]">✓</span>
                <span>Bar Council verified digital law practice profile</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login?role=LAWYER"
              className={`flex-1 text-center py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "login"
                  ? "neon-btn-purple font-black"
                  : "text-slate-200 bg-white/[0.04] border border-white/10 hover:border-fuchsia-500/50 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
              }`}
            >
              Sign In as Lawyer
            </Link>
            <Link
              href="/signup?role=LAWYER"
              className={`flex-1 text-center py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "signup"
                  ? "neon-btn-purple font-black"
                  : "text-slate-200 bg-white/[0.04] border border-white/10 hover:border-fuchsia-500/50 hover:text-fuchsia-300 hover:bg-fuchsia-950/30"
              }`}
            >
              Register as Lawyer →
            </Link>
          </div>
        </div>

      </div>

      {/* Return Home Link */}
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to SmartEstate Home</span>
        </Link>
      </div>
    </div>
  );
}

export default function AuthGatewayPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#050714] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-hidden">
      {/* Ambient Neon Atmosphere Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[25%] w-[650px] h-[650px] bg-indigo-600/15 rounded-full blur-[180px] pointer-events-none animate-pulse-glow" />

      {/* Navigation */}
      <Navbar />

      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-400">Loading portals...</div>}>
        <AuthGatewayContent />
      </Suspense>

      <Footer />
    </div>
  );
}
