"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: "USER" | "LAWYER" | "ADMIN";
  } | null>(null);

  useEffect(() => {
    // Check this specific tab's sessionStorage
    const syncUser = () => {
      const savedUser = sessionStorage.getItem("smartestate_user");
      const token = sessionStorage.getItem("smartestate_token");
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("tab-auth-changed", syncUser);

    // Verify session with server if this tab has a token
    const tabToken = sessionStorage.getItem("smartestate_token");
    if (tabToken) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${tabToken}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.user) {
            setUser(data.user);
            sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
          } else {
            sessionStorage.removeItem("smartestate_token");
            sessionStorage.removeItem("smartestate_user");
            setUser(null);
          }
        })
        .catch(() => {});
    } else {
      setUser(null);
    }

    return () => {
      window.removeEventListener("tab-auth-changed", syncUser);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout error", e);
    }
    // Only remove session for this tab! Other tabs remain logged in!
    sessionStorage.removeItem("smartestate_user");
    sessionStorage.removeItem("smartestate_token");
    localStorage.removeItem("smartestate_user");
    localStorage.removeItem("smartestate_token");
    window.dispatchEvent(new Event("tab-auth-changed"));
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const navLinks = [
    {
      href: "/properties",
      label: "Properties",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      href: "/#advantages",
      label: "Legal Advantages",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      href: "/sell",
      label: "Sell Property",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      href: "/lawyer",
      label: "Legal Experts",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      href: "/#how-it-works",
      label: "How It Works",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#DCE5EC]/90 backdrop-blur-md transition-all pt-3 pb-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto rounded-[24px] neu-raised px-4 sm:px-6 py-3 flex items-center justify-between border border-white/80">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl neu-inset flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-250">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#3155FF] to-[#287BFF] flex items-center justify-center shadow-[0_4px_12px_rgba(49,85,255,0.35)]">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-800">
                Smart<span className="text-[#3155FF]">Estate</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                100% Legal Audited
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Neumorphic Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full neu-inset">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "neu-raised text-[#3155FF] shadow-[2px_2px_6px_rgba(120,140,155,0.2),-2px_-2px_6px_rgba(255,255,255,0.9)]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                }`}
              >
                <span className={isActive ? "text-[#3155FF]" : "text-slate-400"}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls: User Profile or Sign In / Sign Up */}
        <div className="hidden sm:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={user.role === "LAWYER" ? "/lawyer" : "/dashboard"}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full neu-raised text-xs font-bold text-slate-800 hover:text-[#3155FF] transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#3155FF] to-[#287BFF] flex items-center justify-center text-white text-[10px] font-extrabold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span>{user.name || "My Account"}</span>
                <span className="text-[10px] text-[#3155FF] font-semibold">
                  ({user.role === "LAWYER" ? "Advocate" : "Client"})
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 text-xs font-bold rounded-full neu-btn-secondary text-slate-500 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth?mode=login"
                className="px-5 py-2.5 text-xs font-bold rounded-full neu-btn-secondary text-slate-700 hover:text-slate-900"
              >
                Sign In
              </Link>
              <Link
                href="/auth?mode=signup"
                className="px-6 py-2.5 text-xs font-bold rounded-full neu-btn-primary tracking-wide flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          {!user && (
            <Link
              href="/auth?mode=signup"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold neu-btn-primary"
            >
              Sign Up
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-slate-600 hover:text-slate-900 active:scale-95 transition-all"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown Card */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-7xl mx-auto rounded-[24px] neu-raised-lg p-5 space-y-3 border border-white/90 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl neu-inset text-sm font-bold text-slate-700 hover:text-[#3155FF]"
            >
              <span className="text-[#3155FF]">{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-200/80 flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href={user.role === "LAWYER" ? "/lawyer" : "/dashboard"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-2xl neu-raised text-xs font-bold text-[#3155FF]"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2 text-rose-600 text-xs font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth?mode=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-2xl neu-btn-secondary text-xs font-bold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-2xl neu-btn-primary text-xs font-bold tracking-wide"
                >
                  Create Account (Get Started)
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
