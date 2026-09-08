"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 pt-16 pb-12 border-t border-slate-300/80 bg-[#DCE5EC] text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Card */}
        <div className="mb-14 rounded-[28px] neu-raised p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/80">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3155FF]">
              Legal Digest & Market Updates
            </span>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Get Weekly Verified Property & Title Alerts
            </h3>
            <p className="text-sm text-slate-500 max-w-lg font-medium">
              Receive curated notifications for vetted properties, updated state land laws, and RERA court judgment digests.
            </p>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-md">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 p-1.5 rounded-full neu-inset">
              <input
                type="email"
                placeholder="Enter your work email..."
                className="w-full bg-transparent px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full neu-btn-primary text-xs font-bold shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* 5 Column Link Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center shadow-[0_4px_10px_rgba(49,85,255,0.3)]">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-slate-800 tracking-tight">
                Smart<span className="text-[#3155FF]">Estate</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed font-medium">
              India&apos;s 1st AI & Lawyer-Verified Real Estate Platform. Eliminating property scams, illegal title breaks, and encumbrance frauds through audited legal due diligence.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-[2px_2px_5px_rgba(16,185,129,0.12)]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                RERA Compliant & Escrow Insured
              </span>
            </div>
          </div>

          {/* Properties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Verified Properties
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li>
                <Link href="/properties" className="hover:text-[#3155FF] transition-colors">
                  Clear-Title Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[#3155FF] transition-colors">
                  Gated Community Villas
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[#3155FF] transition-colors">
                  Verified Residential Plots
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-[#3155FF] transition-colors">
                  List Your Property Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Due Diligence */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Legal Services
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li>
                <Link href="/#advantages" className="hover:text-[#3155FF] transition-colors">
                  AI Deed Screening
                </Link>
              </li>
              <li>
                <Link href="/lawyer" className="hover:text-[#3155FF] transition-colors">
                  On-Demand Legal Panel
                </Link>
              </li>
              <li>
                <Link href="/#advantages" className="hover:text-[#3155FF] transition-colors">
                  30-Year Encumbrance Audit
                </Link>
              </li>
              <li>
                <Link href="/#advantages" className="hover:text-[#3155FF] transition-colors">
                  Escrow Token Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              User Portals
            </h4>
            <ul className="space-y-2 text-xs font-medium text-slate-500">
              <li>
                <Link href="/signup" className="text-[#3155FF] font-bold hover:underline">
                  Create Account (Free)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#3155FF] transition-colors">
                  Client Portal Login
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[#3155FF] transition-colors">
                  Property Dashboard
                </Link>
              </li>
              <li>
                <Link href="/lawyer" className="hover:text-[#3155FF] transition-colors">
                  Join Advocate Panel
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>© {new Date().getFullYear()} SmartEstate Legal Ecosystem Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Verification Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Legal Disclaimer</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
