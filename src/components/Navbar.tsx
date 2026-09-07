"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Smart<span className="text-indigo-400">Estate</span>
                </span>
                <span className="text-[10px] font-medium text-emerald-400 tracking-wider uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  100% Legal Verified
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Options */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 shadow-inner">
            <Link
              href="/properties"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Explore Properties
            </Link>
            
            <a
              href="#advantages"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Why Us (Advantages)
            </a>

            <Link
              href="/sell"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Sell Property
            </Link>

            <Link
              href="/lawyer"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Legal Network
            </Link>

            <a
              href="#how-it-works"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all"
            >
              How It Works
            </a>
          </nav>

          {/* Right-most Upper Part: Login & Prominent Sign Up Option */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Log In
            </Link>

            {/* Rightmost Upper Sign Up Option */}
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-indigo-500 group-hover:to-pink-500 transition-all duration-300"></span>
              <span className="relative flex items-center gap-2">
                Sign Up
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/signup"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              Sign Up
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800/80 rounded-xl"
          >
            🏡 Explore Properties
          </Link>
          <a
            href="#advantages"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800/80 rounded-xl"
          >
            🛡️ Advantages of SmartEstate
          </a>
          <Link
            href="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800/80 rounded-xl"
          >
            ➕ Sell Property
          </Link>
          <Link
            href="/lawyer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800/80 rounded-xl"
          >
            👨‍⚖️ Legal Experts & Lawyers
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:bg-slate-800/80 rounded-xl"
          >
            💡 How It Works
          </a>
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-slate-300 hover:text-white font-medium rounded-xl bg-slate-900 border border-slate-800"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-white font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
            >
              Create Account (Sign Up)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
