import React, { Suspense } from "react";
import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | SmartEstate",
  description: "Sign in to access your properties, legal verification audits, and appointments.",
};

function AuthFormFallback() {
  return (
    <div className="w-full max-w-xl mx-auto p-12 text-center text-slate-500">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 neu-raised bg-[#E2EAF1] rounded-2xl" />
        <div className="h-6 w-48 neu-inset bg-[#D5DFE7] rounded-lg" />
        <div className="h-4 w-64 neu-inset bg-[#D5DFE7] rounded-lg" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Suspense fallback={<AuthFormFallback />}>
        <AuthForm initialMode="login" />
      </Suspense>
    </div>
  );
}
