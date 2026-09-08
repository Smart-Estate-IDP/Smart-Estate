"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: "USER" | "LAWYER" | "ADMIN";
  } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check localStorage first for instant hydration
    const savedUser = localStorage.getItem("smartestate_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // Verify session with server
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.success && data.user) {
          setUser(data.user);
          localStorage.setItem("smartestate_user", JSON.stringify(data.user));
        } else {
          // If server says unauthorized, clear localStorage
          localStorage.removeItem("smartestate_user");
          setUser(null);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    }
    localStorage.removeItem("smartestate_user");
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-sky-400 p-[1px] shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950/90 rounded-[15px] flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
              SmartEstate
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-indigo-300/80">
              AI & Legal Verification
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/properties" className="hover:text-white transition-colors py-1 relative group">
            Properties
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/sell" className="hover:text-white transition-colors py-1 relative group">
            Sell Property
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/lawyer" className="hover:text-white transition-colors py-1 relative group flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
            Lawyers Directory
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/#verification" className="hover:text-white transition-colors py-1 relative group">
            How Verification Works
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
          </Link>
        </nav>

        {/* User Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={user.role === "LAWYER" ? "/lawyer" : user.role === "ADMIN" ? "/admin" : "/dashboard"}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all text-sm font-medium text-white"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold leading-none">{user.name}</span>
                  <span className="text-[10px] text-purple-300 font-medium">
                    {user.role === "LAWYER" ? "⚖️ Advocate" : user.role === "ADMIN" ? "🛡️ Admin" : "🏢 Client"}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-rose-400 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth?mode=login"
                className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth?mode=signup"
                className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] border border-white/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 px-6 py-6 space-y-4">
          <Link
            href="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium text-sm py-2"
          >
            Properties
          </Link>
          <Link
            href="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium text-sm py-2"
          >
            Sell Property
          </Link>
          <Link
            href="/lawyer"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white font-medium text-sm py-2"
          >
            Lawyer Directory
          </Link>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === "LAWYER" ? "/lawyer" : user.role === "ADMIN" ? "/admin" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white/[0.08] text-white text-sm font-semibold"
                >
                  My Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-rose-400 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth?mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-white/[0.08] text-white text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
