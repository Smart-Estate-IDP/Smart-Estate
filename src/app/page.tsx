"use client";

import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import PropertySlider from "@/components/PropertySlider";

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
    {
      id: "prop-4",
      title: "Marina Bay Luxury Seafront Residence",
      location: "Marine Drive, Kochi, Kerala",
      price: 31000000,
      bedrooms: 3,
      bathrooms: 3,
      area: 2400,
      propertyType: "Seafront Condo",
      verificationStatus: "VERIFIED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. Ananya Iyer (Kerala HC)",
      auditScore: 98,
    },
    {
      id: "prop-5",
      title: "The Royal Grand Heritage Estate",
      location: "Jubilee Hills, Hyderabad, Telangana",
      price: 75000000,
      bedrooms: 5,
      bathrooms: 6,
      area: 5600,
      propertyType: "Heritage Villa",
      verificationStatus: "VERIFIED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. Venkatesh Rao (Telangana HC)",
      auditScore: 99,
    },
    {
      id: "prop-6",
      title: "Pinnacle Panorama Skyline Suite",
      location: "Koregaon Park, Pune, Maharashtra",
      price: 19500000,
      bedrooms: 3,
      bathrooms: 2,
      area: 1850,
      propertyType: "Skyline Suite",
      verificationStatus: "VERIFIED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. Priya Kulkarni (Bombay HC)",
      auditScore: 96,
    },
    {
      id: "prop-7",
      title: "Whispering Pines Contemporary Manor",
      location: "ECR Beach Road, Chennai, Tamil Nadu",
      price: 38000000,
      bedrooms: 4,
      bathrooms: 4,
      area: 3400,
      propertyType: "Beachfront Villa",
      verificationStatus: "VERIFIED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. S. Ramanathan (Madras HC)",
      auditScore: 98,
    },
    {
      id: "prop-8",
      title: "Silver Oak Forest View Residence",
      location: "Alipore, Kolkata, West Bengal",
      price: 29000000,
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      propertyType: "Apartment",
      verificationStatus: "VERIFIED" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      lawyerName: "Adv. Subhash Chatterjee (Calcutta HC)",
      auditScore: 97,
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
        </section>

        {/* ========================================================
            SEARCH & FILTER COMPONENT
           ======================================================== */}
        <section className="max-w-6xl mx-auto px-4 mt-8 mb-20">
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

          <PropertySlider properties={featuredProperties} autoSlideInterval={3500} />
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
