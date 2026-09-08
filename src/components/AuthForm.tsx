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
          localStorage.setItem("smartestate_user", JSON.stringify(data.user));
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
          localStorage.setItem("smartestate_user", JSON.stringify(data.user));
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
      {/* NEONMORPHIC OUTER ENCLOSURE */}
      <div
        className={`relative rounded-3xl p-6 sm:p-10 neonmorphic-card transition-all duration-500 ${
          isLawyer ? "neonmorphic-card-purple" : "neonmorphic-card-cyan"
        }`}
      >
        {/* Top Header & Role Indicator */}
        <div className="text-center mb-8">
          {/* Identity Switcher Ribbon */}
          <div className="flex items-center justify-between p-2 rounded-2xl neonmorphic-inset mb-6">
            <button
              type="button"
              onClick={() => {
                setRole("USER");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                !isLawyer
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>🏢</span>
              <span>Client / User</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole("LAWYER");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isLawyer
                  ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40 shadow-[0_0_15px_rgba(192,38,211,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>⚖️</span>
              <span>Legal Advisor</span>
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {mode === "login" ? (
              <>
                Sign In as{" "}
                <span className={isLawyer ? "neon-text-purple" : "neon-text-cyan"}>
                  {isLawyer ? "Legal Advocate" : "Property Client"}
                </span>
              </>
            ) : (
              <>
                Register as{" "}
                <span className={isLawyer ? "neon-text-purple" : "neon-text-cyan"}>
                  {isLawyer ? "Advocate Chamber" : "Property Client"}
                </span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {mode === "login"
              ? isLawyer
                ? "Access your deed audit queue, earnings, and legal opinions."
                : "Manage saved listings, deeds, and lawyer verification requests."
              : isLawyer
              ? "Join our certified legal panel to conduct property deed audits."
              : "Create an account to browse verified homes and request legal audits."}
          </p>

          {/* Mode Switcher Tabs (Sign In / Sign Up) */}
          <div className="flex p-1 rounded-2xl neonmorphic-inset mt-6 max-w-xs mx-auto">
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
                    ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.4)]"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)] font-extrabold"
                  : "text-slate-400 hover:text-white"
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
                    ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.4)]"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,243,255,0.4)] font-extrabold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-fadeIn">
            <span className="text-base">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-fadeIn">
            <span className="text-base">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sign Up Fields: Name & Phone */}
          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isLawyer ? "Adv. Rajesh Sharma" : "Sarah Jenkins"}
                  className={`w-full px-4 py-3 rounded-xl neonmorphic-inset text-sm text-white placeholder:text-slate-600 ${
                    isLawyer ? "neonmorphic-inset-purple" : "neonmorphic-inset-cyan"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-3 rounded-xl neonmorphic-inset text-sm text-white placeholder:text-slate-600 ${
                    isLawyer ? "neonmorphic-inset-purple" : "neonmorphic-inset-cyan"
                  }`}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isLawyer ? "advocate@legalchamber.com" : "user@example.com"}
              className={`w-full px-4 py-3 rounded-xl neonmorphic-inset text-sm text-white placeholder:text-slate-600 ${
                isLawyer ? "neonmorphic-inset-purple" : "neonmorphic-inset-cyan"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password <span className="text-rose-400">*</span>
              </label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => alert("Password reset instructions will be sent to your email.")}
                  className={`text-xs transition-colors ${
                    isLawyer ? "text-fuchsia-400 hover:text-fuchsia-300" : "text-cyan-400 hover:text-cyan-300"
                  }`}
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
                className={`w-full pl-4 pr-11 py-3 rounded-xl neonmorphic-inset text-sm text-white placeholder:text-slate-600 ${
                  isLawyer ? "neonmorphic-inset-purple" : "neonmorphic-inset-cyan"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-200 transition-colors"
              >
                {showPassword ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* Confirm Password (Signup only) */}
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl neonmorphic-inset text-sm text-white placeholder:text-slate-600 ${
                  isLawyer ? "neonmorphic-inset-purple" : "neonmorphic-inset-cyan"
                }`}
              />
            </div>
          )}

          {/* LAWYER-SPECIFIC FIELDS */}
          {mode === "signup" && isLawyer && (
            <div className="pt-4 border-t border-fuchsia-500/20 space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
                <span>⚖️</span>
                <span>Bar Council Enrollment & Chamber Details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Bar License No. <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="BCI/DL/1234/2018"
                    className="w-full px-4 py-3 rounded-xl neonmorphic-inset neonmorphic-inset-purple text-sm text-white placeholder:text-slate-600 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl neonmorphic-inset neonmorphic-inset-purple text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Audit Fee per Title Deed (₹ INR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-fuchsia-400 font-bold">
                    ₹
                  </div>
                  <input
                    type="number"
                    step="100"
                    min="100"
                    required
                    value={verificationFee}
                    onChange={(e) => setVerificationFee(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl neonmorphic-inset neonmorphic-inset-purple text-sm text-white"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Custom verification rate charged to property buyers per comprehensive title search.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
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
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                          isSelected
                            ? "bg-fuchsia-600/30 border-fuchsia-400 text-white font-medium shadow-[0_0_12px_rgba(192,38,211,0.4)]"
                            : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
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
                className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                I agree to the <span className="text-slate-200 underline">SmartEstate Legal Platform Terms</span> and{" "}
                <span className="text-slate-200 underline">Privacy Policy</span>.
              </label>
            </div>
          )}

          {/* TACTILE NEON SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 py-3.5 px-6 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isLawyer ? "neon-btn-purple" : "neon-btn-cyan"
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
        <div className="mt-8 pt-6 border-t border-white/10 text-center flex flex-col items-center gap-3">
          <p className="text-xs text-slate-400">
            {mode === "login" ? "Need a new account? " : "Already registered? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`font-bold transition-colors ml-1 ${
                isLawyer ? "text-fuchsia-300 hover:text-white" : "text-cyan-300 hover:text-white"
              }`}
            >
              {mode === "login" ? "Create one now" : "Sign In here"}
            </button>
          </p>

          <Link
            href="/auth"
            className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1.5 mt-2"
          >
            <span>↔</span>
            <span>Switch Portal Selection</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
