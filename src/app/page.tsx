"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { NeuProgress } from "@/components/NeumorphicUI";

export default function Home() {
  const featuredProperties = [
    {
      id: "prop-1",
      title: "The Orchid Residence - High-Rise Sky Villa",
      location: "Bandra West, Mumbai, Maharashtra",
      price: 48500000,
      bedrooms: 4,
      bathrooms: 4,
      area: 2850,
      propertyType: "Sky Villa",
      verificationStatus: "VERIFIED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. Rajesh Varma (Bombay HC)",
      auditScore: 99,
    },
    {
      id: "prop-2",
      title: "Greenwood Lakeview Luxury Penthouse",
      location: "Whitefield, Bangalore, Karnataka",
      price: 24000000,
      bedrooms: 3,
      bathrooms: 3,
      area: 2150,
      propertyType: "Apartment",
      verificationStatus: "VERIFIED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. Shalini Nair (Karnataka HC)",
      auditScore: 97,
    },
    {
      id: "prop-3",
      title: "Serene Meadow Gated Estate Villa",
      location: "Golf Course Road, Gurgaon, Haryana",
      price: 62000000,
      bedrooms: 5,
      bathrooms: 5,
      area: 4200,
      propertyType: "Villa",
      verificationStatus: "AI_SCREENED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. Kunal Malhotra (Delhi HC)",
      auditScore: 95,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-[#DCE5EC] text-slate-800">
      
      {/* Soft Ambient Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-300/25 rounded-full blur-[120px] animate-soft-glow" />
        <div className="absolute top-36 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-[140px]" />
        <div className="absolute top-80 left-1/3 w-80 h-80 bg-teal-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        
        {/* ========================================================
            HERO SECTION
           ======================================================== */}
        <section className="pt-10 pb-16 lg:pt-16 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill Announcement Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full neu-raised-sm mb-8">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide">
              100% Legal Document Verification & Zero-Risk Property Transactions
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15] text-slate-800">
            Buy, Sell & Verify Real Estate with{" "}
            <span className="text-[#3155FF] drop-shadow-[0_2px_12px_rgba(49,85,255,0.2)]">
              Zero Legal Risk
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Eliminate property scams, title breaks, and hidden encumbrances. SmartEstate pairs cutting-edge AI deed screening with certified real estate lawyers for 100% safe property transactions.
          </p>

          {/* CTA Button Group */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth?mode=signup"
              className="px-8 py-4 rounded-full neu-btn-primary font-bold text-sm sm:text-base tracking-wide flex items-center gap-2"
            >
              <span>Get Started - Sign Up Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/properties"
              className="px-8 py-4 rounded-full neu-btn-secondary font-bold text-sm sm:text-base flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-[#3155FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Explore Verified Homes</span>
            </Link>
          </div>

          {/* Statistics Strip in Neumorphic Cards */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto text-center">
            <div className="p-5 rounded-[22px] neu-raised space-y-1 border border-white/80">
              <p className="text-2xl sm:text-4xl font-black text-slate-800">5,000+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
                Verified Properties
              </p>
            </div>
            <div className="p-5 rounded-[22px] neu-raised space-y-1 border border-white/80">
              <p className="text-2xl sm:text-4xl font-black text-emerald-600">100%</p>
              <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
                Title Guarantee
              </p>
            </div>
            <div className="p-5 rounded-[22px] neu-raised space-y-1 border border-white/80">
              <p className="text-2xl sm:text-4xl font-black text-[#3155FF]">150+</p>
              <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
                Advocate Partners
              </p>
            </div>
            <div className="p-5 rounded-[22px] neu-raised space-y-1 border border-white/80">
              <p className="text-2xl sm:text-4xl font-black text-indigo-600">24-Hour</p>
              <p className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider">
                Audit Turnaround
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================
            SEARCH & FILTER COMPONENT
           ======================================================== */}
        <section className="max-w-6xl mx-auto px-4 -mt-4 mb-20">
          <SearchBar />
        </section>

        {/* ========================================================
            FEATURED VERIFIED PROPERTIES SHOWCASE
           ======================================================== */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div className="space-y-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider neu-inset text-[#3155FF]">
                Curated Marketplace
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
                Recently Audited & Approved Homes
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Properties with certified 30-year search, title insurance readiness, and encumbrance reports.
              </p>
            </div>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3155FF] hover:underline"
            >
              <span>View All 5,000+ Listings</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </section>

        {/* ========================================================
            INTERACTIVE LIVE DEED AUDIT PREVIEW WIDGET (DASHBOARD PREVIEW)
           ======================================================== */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] neu-raised p-8 sm:p-12 border border-white/90">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Explainer */}
              <div className="lg:col-span-5 space-y-6">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider neu-inset text-emerald-600">
                  Proprietary Verification Engine
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
                  How Our Dual AI & Advocate Audit Works
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  We don&apos;t just list homes. Our deep-learning scanner extracts and cross-checks mother deeds against state land registries, while licensed High Court advocates inspect municipal building sanctions and tax receipts.
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl neu-inset">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase">
                        30-Year Title Search
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Complete unbroken ownership chain without missing inheritance links.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl neu-inset">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase">
                        Nil Encumbrance Certificate
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Certified absence of active bank mortgages, court attachments, or disputes.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl neu-inset">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase">
                        RERA & Municipal Clearances
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Verified Commencement Certificate (CC) and Occupancy Certificate (OC).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/auth?mode=signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full neu-btn-primary text-xs font-bold"
                  >
                    <span>Request Property Audit</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Right Live Simulated Neumorphic Dashboard Widget */}
              <div className="lg:col-span-7">
                <div className="rounded-[28px] neu-raised-lg p-6 sm:p-8 space-y-6 border border-white">
                  
                  {/* Widget Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
                        📜
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">
                          Deed Audit Report #SE-98421
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          Property: Emerald Bay Apt 1402, Mumbai
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      STATUS: 100% CLEAR
                    </span>
                  </div>

                  {/* Score & Gauge Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl neu-inset text-center space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        AI Safety Score
                      </span>
                      <p className="text-2xl font-black text-emerald-600">99.4%</p>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Zero Anomalies
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl neu-inset text-center space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Litigation Search
                      </span>
                      <p className="text-2xl font-black text-slate-800">0 Stays</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Clean Court Record
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl neu-inset text-center space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">
                        Encumbrance
                      </span>
                      <p className="text-2xl font-black text-[#3155FF]">NIL</p>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        No Active Mortgages
                      </span>
                    </div>
                  </div>

                  {/* Progress Items */}
                  <div className="space-y-3">
                    <NeuProgress value={100} label="Mother Deed Chain (1994 - 2024)" color="emerald" />
                    <NeuProgress value={100} label="RERA & Municipal Zoning Check" color="blue" />
                    <NeuProgress value={95} label="Property Tax & Utility NOCs" color="blue" />
                  </div>

                  {/* Assigned Lawyer Card in Inset Well */}
                  <div className="p-4 rounded-2xl neu-inset flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full neu-raised flex items-center justify-center text-base font-bold text-[#3155FF]">
                        ⚖️
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Audited by Adv. Vikramaditya Sen
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Senior Property Advocate, 18 Yrs Experience
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#3155FF] underline cursor-pointer">
                      View Signature
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================
            KEY ADVANTAGES & LEGAL PROTECTION (6 CARDS)
           ======================================================== */}
        <section id="advantages" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider neu-inset text-[#3155FF]">
              Why Choose SmartEstate
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight">
              Six Layers of Complete Buyer & Seller Protection
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Traditional real estate leaves buyers vulnerable to forged deeds, undisclosed bank liens, and inheritance lawsuits. Here is how SmartEstate fixes property transactions permanently:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Advantage 1 */}
            <div className="p-8 rounded-[28px] neu-raised hover:-translate-y-1.5 transition-all duration-300 space-y-4 border border-white/80">
              <div className="w-14 h-14 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                100% Certified Legal Audits
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Every listed property undergoes a comprehensive 30-year title search, municipal approval audit, and encumbrance check by experienced real estate advocates before being approved.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <span>✓</span> Zero Unverified Listings Allowed
              </div>
            </div>

            {/* Advantage 2 */}
            <div className="p-8 rounded-[28px] neu-raised hover:-translate-y-1.5 transition-all duration-300 space-y-4 border border-white/80">
              <div className="w-14 h-14 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                AI Deed & Document Scanner
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Upload mother deeds, mutation certificates, or tax receipts. Our proprietary AI instant-scans legal documents to flag ownership gaps, court stays, and land use mismatches in seconds.
              </p>
              <div className="pt-2 text-xs font-bold text-[#3155FF] flex items-center gap-1.5">
                <span>⚡</span> Instant Document Risk Score
              </div>
            </div>

            {/* Advantage 3 */}
            <div className="p-8 rounded-[28px] neu-raised hover:-translate-y-1.5 transition-all duration-300 space-y-4 border border-white/80">
              <div className="w-14 h-14 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                On-Demand Advocate Panel
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Hire verified real estate advocates directly through the platform. Request customized sales agreement drafting, power-of-attorney reviews, or live legal video consultations.
              </p>
              <div className="pt-2 text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                <span>⚖️</span> Certified High Court & RERA Advocates
              </div>
            </div>

            {/* Advantage 4 */}
            <div className="p-8 rounded-[28px] neu-raised hover:-translate-y-1.5 transition-all duration-300 space-y-4 border border-white/80">
              <div className="w-14 h-14 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Smart Escrow Token Safety
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Your deposit token is stored securely in a digital legal escrow account. Funds are released to the seller only after your assigned advocate confirms 100% legal document clarity.
              </p>
              <div className="pt-2 text-xs font-bold text-amber-600 flex items-center gap-1.5">
                <span>🛡️</span> 100% Deposit Refund Guarantee
              </div>
            </div>

            {/* Advantage 5 */}
            <div className="p-8 rounded-[28px] neu-raised hover:-translate-y-1.5 transition-all duration-300 space-y-4 border border-white/80">
              <div className="w-14 h-14 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Locality Legal Analytics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Analyze historical price trends, builder reputation scores, municipal zone permissions, and legal litigation history for any locality or layout project before bidding.
              </p>
              <div className="pt-2 text-xs font-bold text-teal-600 flex items-center gap-1.5">
                <span>📊</span> Real-time Data Intelligence
              </div>
            </div>

            {/* Advantage 6 */}
            <div className="p-8 rounded-[28px] neu-raised hover:-translate-y-1.5 transition-all duration-300 space-y-4 border border-white/80">
              <div className="w-14 h-14 rounded-2xl neu-inset flex items-center justify-center text-[#3155FF]">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                Sell 3x Faster with Verified Badge
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Property sellers gain instant trust with our green &quot;Verified Legal Badge&quot;. Attract serious high-value buyers, minimize negotiations, and complete deals 40% faster.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <span>🚀</span> 5x Genuine Inquiries
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            COMPARISON MATRIX SECTION
           ======================================================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800">
              Traditional Real Estate vs.{" "}
              <span className="text-[#3155FF]">SmartEstate</span>
            </h2>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              See why modern property buyers and institutional investors trust our verified digital platform.
            </p>
          </div>

          <div className="rounded-[28px] neu-raised overflow-hidden p-3 border border-white/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80">
                    <th className="p-4 sm:p-5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Key Transaction Feature
                    </th>
                    <th className="p-4 sm:p-5 text-xs font-extrabold text-rose-600 uppercase tracking-wider bg-rose-50/50 rounded-2xl">
                      Traditional Real Estate
                    </th>
                    <th className="p-4 sm:p-5 text-xs font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50/50 rounded-2xl">
                      SmartEstate Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 text-xs sm:text-sm font-medium">
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      Title Deed Verification
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">
                      Buyer bears full burden; unverified or superficial agent checks.
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-emerald-50/30">
                      ✓ 100% Advocate Audited Before Property is Listed
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      Token Money Safety
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">
                      High risk of non-refundable deposit forfeiture if title has disputes.
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-emerald-50/30">
                      ✓ 100% Refundable Digital Legal Escrow Protection
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      Deed Audit Speed
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">
                      3 to 6 weeks of tedious physical visits to sub-registrar offices.
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-emerald-50/30">
                      ✓ Instant AI Screening + 24-Hour Advocate Review
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      Legal Consultation Access
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">
                      Expensive retainers and fragmented local legal advice.
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-emerald-50/30">
                      ✓ On-Demand High Court Advocates Panel with Flat Pricing
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-slate-800">
                      Property Fraud Protection
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500">
                      Vulnerable to double sale deeds, forged mutation, and family stays.
                    </td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-emerald-50/30">
                      ✓ Full Encumbrance & Digital Certificate Guarantee
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOW IT WORKS SECTION (4 STEPS)
           ======================================================== */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider neu-inset text-[#3155FF]">
              Simple & Transparent
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-800">
              How SmartEstate Protects You in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-[24px] neu-raised text-center space-y-3.5 border border-white/80">
              <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-slate-800 font-black text-lg mx-auto">
                <span className="text-[#3155FF]">01</span>
              </div>
              <h4 className="text-base font-bold text-slate-800">Browse or Upload</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Search pre-verified properties or upload your existing property deed for legal due diligence.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-[24px] neu-raised text-center space-y-3.5 border border-white/80">
              <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-slate-800 font-black text-lg mx-auto">
                <span className="text-indigo-600">02</span>
              </div>
              <h4 className="text-base font-bold text-slate-800">AI Document Scan</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                AI scans title history, encumbrances, and municipal clearances within 60 seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-[24px] neu-raised text-center space-y-3.5 border border-white/80">
              <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-slate-800 font-black text-lg mx-auto">
                <span className="text-emerald-600">03</span>
              </div>
              <h4 className="text-base font-bold text-slate-800">Advocate Audit</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                A certified real estate attorney reviews documents and issues a binding legal dossier.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-[24px] neu-raised text-center space-y-3.5 border border-white/80">
              <div className="w-12 h-12 rounded-2xl neu-inset flex items-center justify-center text-slate-800 font-black text-lg mx-auto">
                <span className="text-teal-600">04</span>
              </div>
              <h4 className="text-base font-bold text-slate-800">Safe Escrow Close</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">
                Pay token money via safe legal escrow and finalize title registration with 100% peace of mind.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================
            BOTTOM CONVERSION CTA BANNER
           ======================================================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] neu-raised-lg p-10 sm:p-16 text-center space-y-6 border border-white">
            
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#3155FF] border border-blue-200">
              Join 10,000+ Smart Property Transactors
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-800 tracking-tight max-w-3xl mx-auto leading-tight">
              Ready to Buy or Sell Real Estate with 100% Legal Certainty?
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
              Create your free account today and experience fraud-free property transactions backed by top legal professionals.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/auth?mode=signup"
                className="px-9 py-4 rounded-full neu-btn-primary font-bold text-sm sm:text-base tracking-wide"
              >
                Create Account (Sign Up Free)
              </Link>
              <Link
                href="/auth?mode=login"
                className="px-9 py-4 rounded-full neu-btn-secondary font-bold text-sm sm:text-base text-slate-700"
              >
                Log In to Portal
              </Link>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
