import React, { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | SmartEstate",
  description: "Sign in to access your properties, legal verification audits, and appointments.",
};

function AuthFormFallback() {
  return (
    <div className="w-full max-w-2xl mx-auto p-12 text-center text-slate-400">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-2xl" />
        <div className="h-6 w-48 bg-white/10 rounded-lg" />
        <div className="h-4 w-64 bg-white/10 rounded-lg" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#050714] via-[#0d0f28] via-[#1a103c] to-[#070618] text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-hidden">
      {/* Background Atmospheric Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[30%] right-[-5%] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[650px] h-[650px] bg-violet-600/15 rounded-full blur-[180px] pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      {/* Main Form Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Suspense fallback={<AuthFormFallback />}>
          <AuthForm initialMode="login" />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
