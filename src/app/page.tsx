import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Background Lighting Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] animate-float-delayed" />
        <div className="absolute top-80 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Announcement Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md shadow-lg shadow-indigo-500/10 mb-8 animate-float-slow">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-transparent">
              100% Legal Document Verification & Risk-Free Transactions
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15]">
            Buy, Sell & Verify Real Estate with{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              Zero Legal Risk
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Eliminate property scams, title breaks, and hidden encumbrances. SmartEstate pairs cutting-edge AI deed screening with certified real estate lawyers for 100% safe property transactions.
          </p>

          {/* CTA Button Group */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <span>Get Started - Sign Up Free</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <Link
              href="/properties"
              className="px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base backdrop-blur-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Explore Verified Homes</span>
            </Link>
          </div>

          {/* Statistics Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-800/80 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">5,000+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Verified Properties</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Title Guarantee</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400">150+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Registered Lawyers</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-purple-400">24-Hour</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Deed Audit Speed</p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SEARCH & LEGAL FILTER PREVIEW */}
        <section className="max-w-6xl mx-auto px-4 -mt-6 mb-24">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800/90 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              Search Verified Properties by Location & Title Clearance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Bangalore, Gurgaon"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Property Type</label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                  <option>All Types</option>
                  <option>Apartments & Flats</option>
                  <option>Independent Villas</option>
                  <option>Residential Plots</option>
                  <option>Commercial Spaces</option>
                </select>
              </div>

              {/* Verification Level */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Verification Level</label>
                <select className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-emerald-400 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                  <option>🛡️ 100% Lawyer Audited</option>
                  <option>🤖 AI Deed Screened</option>
                  <option>📜 RERA Approved</option>
                </select>
              </div>

              {/* Search CTA */}
              <div className="flex items-end">
                <Link
                  href="/properties"
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm text-center shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Verified
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CENTER MARKETING PART: ADVANTAGES OF THIS WEBSITE */}
        <section id="advantages" className="py-20 bg-slate-900/50 border-y border-slate-800/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Why Choose SmartEstate
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Key Advantages & Legal Protection Features
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Traditional real estate leaves buyers vulnerable to title disputes, forged deeds, and delayed approvals. Here is how SmartEstate revolutionizes property transactions:
              </p>
            </div>

            {/* 6 Grid Advantage Cards */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Advantage 1 */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  100% Certified Legal Audits
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every listed property undergoes a comprehensive 30-year title search, municipal approval audit, and encumbrance check by experienced real estate advocates before being approved.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Zero Unverified Listings Allowed
                </div>
              </div>

              {/* Advantage 2 */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  AI Deed & Document Scanner
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Upload mother deeds, mutation certificates, or tax receipts. Our proprietary AI instant-scans legal documents to flag ownership gaps, court stays, and land use mismatches in seconds.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Instant Document Risk Score
                </div>
              </div>

              {/* Advantage 3 */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  On-Demand Lawyer Panel
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Hire verified real estate advocates directly through the platform. Request customized sales agreement drafting, power-of-attorney reviews, or live legal video consultations.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Certified High Court & RERA Advocates
                </div>
              </div>

              {/* Advantage 4 */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  Smart Escrow Token Safety
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your deposit token is stored securely in a digital legal escrow account. Funds are released to the seller only after your assigned advocate confirms 100% legal document clarity.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  100% Deposit Refund Guarantee
                </div>
              </div>

              {/* Advantage 5 */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  Neighborhood Risk Analytics
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Analyze historical price trends, builder reputation scores, municipal zone permissions, and legal litigation history for any locality or layout project before bidding.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-semibold text-pink-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time Data Intelligence
                </div>
              </div>

              {/* Advantage 6 */}
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  Sell 3x Faster with Verified Badge
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Property sellers gain instant trust with our green &quot;Verified Legal Badge&quot;. Attract serious high-value buyers, minimize negotiations, and complete deals 40% faster.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800 text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified Sellers Get 5x Inquiries
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* COMPARISON MATRIX SECTION */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Traditional Real Estate vs. <span className="text-indigo-400">SmartEstate</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              See why thousands of buyers and sellers are switching to verified digital property legalities.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-2xl overflow-hidden glass-panel">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  <th className="p-4 sm:p-6 text-sm font-bold text-slate-300 uppercase tracking-wider">Feature</th>
                  <th className="p-4 sm:p-6 text-sm font-bold text-rose-400 uppercase tracking-wider bg-rose-950/20">Traditional Real Estate</th>
                  <th className="p-4 sm:p-6 text-sm font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/20">SmartEstate Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-white">Title Verification</td>
                  <td className="p-4 sm:p-6 text-slate-400 bg-rose-950/10">Unverified / Buyer does manual legwork</td>
                  <td className="p-4 sm:p-6 text-emerald-300 font-bold bg-emerald-950/10">100% Lawyer Audited Prior to Listing</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-white">Token Money Risk</td>
                  <td className="p-4 sm:p-6 text-slate-400 bg-rose-950/10">High risk of non-refundable deposit loss</td>
                  <td className="p-4 sm:p-6 text-emerald-300 font-bold bg-emerald-950/10">Protected in Smart Legal Escrow</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-white">Deed Verification Speed</td>
                  <td className="p-4 sm:p-6 text-slate-400 bg-rose-950/10">3 to 6 Weeks of physical visits</td>
                  <td className="p-4 sm:p-6 text-emerald-300 font-bold bg-emerald-950/10">Instant AI Scan + 24h Lawyer Turnaround</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-white">Legal Consultation</td>
                  <td className="p-4 sm:p-6 text-slate-400 bg-rose-950/10">Expensive private retainers & office visits</td>
                  <td className="p-4 sm:p-6 text-emerald-300 font-bold bg-emerald-950/10">On-demand 1-on-1 Legal Experts Panel</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6 font-semibold text-white">Property Fraud Prevention</td>
                  <td className="p-4 sm:p-6 text-slate-400 bg-rose-950/10">Frequent fake deeds & double selling scams</td>
                  <td className="p-4 sm:p-6 text-emerald-300 font-bold bg-emerald-950/10">Zero Fraud Guarantee & Encumbrance Protection</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-slate-900/40 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Simple & Transparent Workflow
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
                How SmartEstate Protects You in 4 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 relative">
                <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                  01
                </div>
                <h4 className="text-lg font-bold text-white">Browse or Upload</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Search pre-verified properties or upload your property deed for legal due diligence.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 relative">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30">
                  02
                </div>
                <h4 className="text-lg font-bold text-white">AI Document Scan</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  AI scans title history, encumbrances, and municipal clearances within 60 seconds.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  03
                </div>
                <h4 className="text-lg font-bold text-white">Advocate Audit</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  A certified real estate attorney reviews documents and issues a binding legal report.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 relative">
                <div className="w-12 h-12 rounded-xl bg-pink-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
                  04
                </div>
                <h4 className="text-lg font-bold text-white">Safe Escrow Close</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Pay token money via safe legal escrow and finalize title registration with 100% peace of mind.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM HIGH-CONVERTING MARKETING CTA BANNER */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 overflow-hidden shadow-2xl text-center space-y-6">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-400/10 text-emerald-300 border border-emerald-400/30">
              Join 10,000+ Smart Buyers & Sellers
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
              Ready to Buy or Sell Real Estate with 100% Legal Certainty?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
              Create your free account today and experience fraud-free property transactions backed by top legal professionals.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/signup"
                className="px-9 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-extrabold text-base shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
              >
                Create Account (Sign Up Free)
              </Link>
              <Link
                href="/login"
                className="px-9 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 font-bold text-base transition-all duration-300 hover:scale-105"
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
