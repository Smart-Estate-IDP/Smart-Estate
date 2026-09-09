"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
  initialMode?: "login" | "signup";
  initialRole?: "USER" | "LAWYER";
}

const SPECIALIZATIONS = [
  "Title Deed Verification",
  "RERA Compliance & Disputes",
  "Property Registration & Sale Deeds",
  "Encumbrance & Lien Audit",
  "Agricultural to Non-Agri Land Law",
  "Commercial Real Estate",
];

export default function AuthForm({ initialMode = "login", initialRole = "USER" }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "login" or "signup"
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  
  // Role: "USER" or "LAWYER"
  const [role, setRole] = useState<"USER" | "LAWYER">(initialRole);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Lawyer specific fields
  const [licenseNumber, setLicenseNumber] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [verificationFee, setVerificationFee] = useState<number>(2500);
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([
    "Title Deed Verification",
    "Property Registration & Sale Deeds",
  ]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sync mode and role from URL params
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "LAWYER" || roleParam === "USER") {
      setRole(roleParam);
    }
    const modeParam = searchParams.get("mode");
    if (modeParam === "login" || modeParam === "signup") {
      setMode(modeParam);
    }
  }, [searchParams]);

  const toggleSpecialization = (spec: string) => {
    if (selectedSpecializations.includes(spec)) {
      setSelectedSpecializations(selectedSpecializations.filter((s) => s !== spec));
    } else {
      setSelectedSpecializations([...selectedSpecializations, spec]);
    }
  };

  const isLawyer = role === "LAWYER";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setErrorMessage("Please provide your full name.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match. Please verify.");
        return;
      }
      if (!agreeTerms) {
        setErrorMessage("Please accept the Terms of Service to continue.");
        return;
      }
      if (isLawyer) {
        if (!licenseNumber.trim()) {
          setErrorMessage("Bar Council License Number is required for Advocate accounts.");
          return;
        }
        if (verificationFee <= 0) {
          setErrorMessage("Please set a valid consultation/verification fee.");
          return;
        }
      }
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Invalid email or password.");
        }

        if (typeof window !== "undefined" && data.user) {
          if (data.token) {
            sessionStorage.setItem("smartestate_token", data.token);
          }
          sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
          localStorage.removeItem("smartestate_user");
          localStorage.removeItem("smartestate_token");
          window.dispatchEvent(new Event("tab-auth-changed"));
        }

        setSuccessMessage(`Welcome back, ${data.user.name}! Redirecting...`);

        const redirectUrl = searchParams.get("redirect");
        setTimeout(() => {
          if (redirectUrl) {
            router.push(redirectUrl);
          } else if (data.user.role === "LAWYER") {
            router.push("/lawyer");
          } else if (data.user.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        }, 900);
      } else {
        const payload: any = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
          role,
        };

        if (isLawyer) {
          payload.licenseNumber = licenseNumber.trim().toUpperCase();
          payload.experienceYears = Number(experienceYears);
          payload.verificationFee = Number(verificationFee);
          payload.specialization = selectedSpecializations;
        }

        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Registration failed. Please check your credentials.");
        }

        if (typeof window !== "undefined" && data.user) {
          if (data.token) {
            sessionStorage.setItem("smartestate_token", data.token);
          }
          sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
          localStorage.removeItem("smartestate_user");
          localStorage.removeItem("smartestate_token");
          window.dispatchEvent(new Event("tab-auth-changed"));
        }

        setSuccessMessage(
          isLawyer
            ? "Advocate chamber registered! Redirecting to Lawyer Dashboard..."
            : "Client account created! Redirecting to Dashboard..."
        );

        setTimeout(() => {
          if (isLawyer) {
            router.push("/lawyer");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* NEUMORPHIC OUTER ENCLOSURE */}
      <div className="relative rounded-[32px] p-6 sm:p-10 neu-raised bg-[#E2EAF1] transition-all duration-500">
        {/* Top Header & Role Indicator */}
        <div className="text-center mb-8">
          {/* Identity Switcher Ribbon */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl neu-inset bg-[#D5DFE7] mb-6">
            <button
              type="button"
              onClick={() => {
                setRole("USER");
                setErrorMessage("");
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                !isLawyer
                  ? "bg-[#E2EAF1] text-[#3155FF] shadow-[4px_4px_10px_rgba(140,160,185,0.5),-4px_-4px_10px_#FFFFFF]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="text-base">🏢</span>
              <span>Client / User</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("LAWYER");
                setErrorMessage("");
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isLawyer
                  ? "bg-[#E2EAF1] text-indigo-600 shadow-[4px_4px_10px_rgba(140,160,185,0.5),-4px_-4px_10px_#FFFFFF]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="text-base">⚖️</span>
              <span>Legal Advisor</span>
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {mode === "login" ? (
              <>
                Sign In as{" "}
                <span className={isLawyer ? "text-indigo-600" : "text-[#3155FF]"}>
                  {isLawyer ? "Legal Advocate" : "Property Client"}
                </span>
              </>
            ) : (
              <>
                Register as{" "}
                <span className={isLawyer ? "text-indigo-600" : "text-[#3155FF]"}>
                  {isLawyer ? "Advocate Chamber" : "Property Client"}
                </span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {mode === "login"
              ? isLawyer
                ? "Access your deed audit queue, fee earnings, and verification certificates."
                : "Manage saved listings, deeds, and lawyer verification requests."
              : isLawyer
              ? "Join our certified legal panel to conduct property deed audits."
              : "Create an account to browse verified homes and request legal audits."}
          </p>

          {/* Mode Switcher Tabs (Sign In / Sign Up) */}
          <div className="flex p-1.5 rounded-2xl neu-inset bg-[#D5DFE7] mt-6 max-w-xs mx-auto">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                mode === "login"
                  ? isLawyer
                    ? "bg-indigo-600 text-white shadow-[4px_4px_10px_rgba(79,70,229,0.35),-4px_-4px_10px_#FFFFFF]"
                    : "bg-[#3155FF] text-white shadow-[4px_4px_10px_rgba(49,85,255,0.35),-4px_-4px_10px_#FFFFFF]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                mode === "signup"
                  ? isLawyer
                    ? "bg-indigo-600 text-white shadow-[4px_4px_10px_rgba(79,70,229,0.35),-4px_-4px_10px_#FFFFFF]"
                    : "bg-[#3155FF] text-white shadow-[4px_4px_10px_rgba(49,85,255,0.35),-4px_-4px_10px_#FFFFFF]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl neu-inset bg-rose-50/80 border border-rose-200 text-rose-700 text-xs flex items-start gap-3 shadow-inner">
            <span className="text-base">⚠️</span>
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl neu-inset bg-emerald-50/80 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3 shadow-inner">
            <span className="text-base">✓</span>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up Fields: Name & Phone */}
          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isLawyer ? "Adv. Rajesh Sharma" : "Sarah Jenkins"}
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3155FF]/40 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3155FF]/40 transition-all font-medium"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isLawyer ? "advocate@legalchamber.com" : "user@example.com"}
              className="w-full px-4 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3155FF]/40 transition-all font-medium"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password <span className="text-rose-500">*</span>
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => alert("Password reset instructions will be sent to your email.")}
                  className="text-xs text-[#3155FF] hover:underline font-semibold"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-11 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3155FF]/40 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-800 transition-colors text-sm"
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3155FF]/40 transition-all font-medium"
              />
            </div>
          )}

          {/* LAWYER-SPECIFIC FIELDS */}
          {mode === "signup" && isLawyer && (
            <div className="pt-4 border-t border-slate-300/60 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <span>⚖️</span>
                <span>Bar Council Enrollment & Chamber Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Bar License No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="BCI/DL/1234/2018"
                    className="w-full px-4 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all uppercase font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Audit Fee per Title Deed (₹ INR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-600 font-bold">
                    ₹
                  </div>
                  <input
                    type="number"
                    step="100"
                    min="100"
                    required
                    value={verificationFee}
                    onChange={(e) => setVerificationFee(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl neu-inset bg-[#D5DFE7] text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Custom verification rate charged to property buyers per comprehensive title search.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Legal Specializations
                </label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((spec) => {
                    const isSelected = selectedSpecializations.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-[3px_3px_8px_rgba(79,70,229,0.35),-3px_-3px_8px_#FFFFFF]"
                            : "neu-btn bg-[#E2EAF1] text-slate-700 hover:text-slate-900"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Terms checkbox */}
          {mode === "signup" && (
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#3155FF] focus:ring-[#3155FF] cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                I agree to the <span className="text-slate-900 font-semibold underline">SmartEstate Legal Platform Terms</span> and{" "}
                <span className="text-slate-900 font-semibold underline">Privacy Policy</span>.
              </label>
            </div>
          )}

          {/* NEUMORPHIC PRIMARY SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isLawyer
                ? "bg-indigo-600 shadow-[6px_6px_16px_rgba(79,70,229,0.4),-6px_-6px_16px_#FFFFFF] hover:brightness-110 active:scale-[0.98]"
                : "neu-btn-primary bg-[#3155FF] shadow-[6px_6px_16px_rgba(49,85,255,0.4),-6px_-6px_16px_#FFFFFF] hover:brightness-110 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : mode === "login" ? (
              <span>Sign In to {isLawyer ? "Lawyer Chamber" : "Client Portal"} →</span>
            ) : isLawyer ? (
              <span>Register Advocate Chamber →</span>
            ) : (
              <span>Create Client Account →</span>
            )}
          </button>
        </form>

        {/* Footer info & Choose Role Gateway Link */}
        <div className="mt-8 pt-6 border-t border-slate-300/60 text-center flex flex-col items-center gap-3">
          <p className="text-xs text-slate-600">
            {mode === "login" ? "Need a new account? " : "Already registered? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`font-bold transition-colors ml-1 ${
                isLawyer ? "text-indigo-600 hover:underline" : "text-[#3155FF] hover:underline"
              }`}
            >
              {mode === "login" ? "Create one now" : "Sign In here"}
            </button>
          </p>

          <Link
            href="/auth"
            className="neu-btn px-4 py-2 rounded-full text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-all inline-flex items-center gap-1.5 mt-2"
          >
            <span>↔</span>
            <span>Switch Role Selection</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
