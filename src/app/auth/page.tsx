"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function AuthGatewayContent() {
  const searchParams = useSearchParams();
  const preferredMode = searchParams.get("mode") || "signup";

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-inset text-xs font-bold uppercase tracking-wider text-[#3155FF] mb-5">
          <span className="w-2 h-2 rounded-full bg-[#3155FF] animate-pulse" />
          <span>Step 1 • Choose Your Account Role</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-800 leading-tight">
          Select Your{" "}
          <span className="text-[#3155FF]">
            Account Type
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-3.5 leading-relaxed">
          Choose whether you are exploring verified properties as a client, or conducting title deed audits as a licensed legal advocate.
        </p>
      </div>

      {/* The Two Neumorphic Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* CARD 1: CLIENT / USER */}
        <div className="group relative rounded-[28px] p-8 sm:p-10 neu-raised bg-[#E2EAF1] flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl neu-raised bg-[#E2EAF1] flex items-center justify-center text-3xl shadow-[5px_5px_12px_rgba(140,160,185,0.5),-5px_-5px_12px_#FFFFFF] group-hover:scale-110 transition-transform duration-300">
                🏢
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full neu-inset text-[#3155FF]">
                Property Seeker / Investor
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-800 group-hover:text-[#3155FF] transition-colors">
              Client / User
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Explore 100% legally authenticated real estate, request comprehensive 30-year deed audits, and schedule property visits with complete transparency.
            </p>

            {/* Feature Bullets */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full neu-inset text-[#3155FF] flex items-center justify-center text-[10px] font-black">✓</span>
                <span>Browse 100% verified real estate listings</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full neu-inset text-[#3155FF] flex items-center justify-center text-[10px] font-black">✓</span>
                <span>Request lawyer-backed title deed & encumbrance audits</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full neu-inset text-[#3155FF] flex items-center justify-center text-[10px] font-black">✓</span>
                <span>Direct secure escrow for safe token payments</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-300/60 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login?role=USER"
              className={`flex-1 text-center py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "login"
                  ? "neu-btn-primary bg-[#3155FF] text-white shadow-[4px_4px_12px_rgba(49,85,255,0.4),-4px_-4px_12px_#FFFFFF] hover:brightness-110"
                  : "neu-btn text-slate-700 hover:text-slate-900"
              }`}
            >
              Sign In as Client
            </Link>
            <Link
              href="/signup?role=USER"
              className={`flex-1 text-center py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "signup"
                  ? "neu-btn-primary bg-[#3155FF] text-white shadow-[4px_4px_12px_rgba(49,85,255,0.4),-4px_-4px_12px_#FFFFFF] hover:brightness-110"
                  : "neu-btn text-slate-700 hover:text-slate-900"
              }`}
            >
              Create Account →
            </Link>
          </div>
        </div>

        {/* CARD 2: LAWYER / LEGAL ADVISOR */}
        <div className="group relative rounded-[28px] p-8 sm:p-10 neu-raised bg-[#E2EAF1] flex flex-col justify-between transition-all duration-300 hover:translate-y-[-4px]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl neu-raised bg-[#E2EAF1] flex items-center justify-center text-3xl shadow-[5px_5px_12px_rgba(140,160,185,0.5),-5px_-5px_12px_#FFFFFF] group-hover:scale-110 transition-transform duration-300">
                ⚖️
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full neu-inset text-indigo-600">
                Licensed Legal Practitioner
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">
              Legal Advisor / Lawyer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Review uploaded property deeds, conduct encumbrance checks, set consultation fees, and issue certified legal title verification certificates.
            </p>

            {/* Feature Bullets */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full neu-inset text-indigo-600 flex items-center justify-center text-[10px] font-black">✓</span>
                <span>Receive title deed audit requests directly from buyers</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full neu-inset text-indigo-600 flex items-center justify-center text-[10px] font-black">✓</span>
                <span>Set your custom document verification audit fee</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-medium text-slate-700">
                <span className="w-5 h-5 rounded-full neu-inset text-indigo-600 flex items-center justify-center text-[10px] font-black">✓</span>
                <span>Bar Council verified digital legal practice profile</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-300/60 flex flex-col sm:flex-row gap-3">
            <Link
              href="/login?role=LAWYER"
              className={`flex-1 text-center py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "login"
                  ? "neu-btn-primary bg-indigo-600 text-white shadow-[4px_4px_12px_rgba(79,70,229,0.4),-4px_-4px_12px_#FFFFFF] hover:brightness-110"
                  : "neu-btn text-slate-700 hover:text-slate-900"
              }`}
            >
              Sign In as Lawyer
            </Link>
            <Link
              href="/signup?role=LAWYER"
              className={`flex-1 text-center py-3.5 px-4 rounded-2xl text-xs font-bold transition-all duration-200 ${
                preferredMode === "signup"
                  ? "neu-btn-primary bg-indigo-600 text-white shadow-[4px_4px_12px_rgba(79,70,229,0.4),-4px_-4px_12px_#FFFFFF] hover:brightness-110"
                  : "neu-btn text-slate-700 hover:text-slate-900"
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
          className="neu-btn px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-2 transition-all"
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
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col justify-center">
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-slate-500 py-20 font-medium">Loading portal options...</div>}>
        <AuthGatewayContent />
      </Suspense>
    </div>
  );
}
