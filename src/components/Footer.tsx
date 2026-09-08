import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 backdrop-blur-2xl bg-white/[0.02] py-12 text-xs text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="text-sm font-bold text-white">SmartEstate</span>
        </div>

        <p className="text-slate-400 text-center md:text-left max-w-md">
          © {new Date().getFullYear()} SmartEstate. Secure property transactions with lawyer-backed title deed audits.
        </p>

        <div className="flex gap-6 text-slate-300">
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
          <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          <Link href="/properties" className="hover:text-white transition-colors">Properties</Link>
          <Link href="/lawyer" className="hover:text-white transition-colors">Lawyers</Link>
        </div>
      </div>
    </footer>
  );
}
