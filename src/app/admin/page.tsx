"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "LAWYER" | "ADMIN";
  phone?: string;
  createdAt: string;
}

interface LawyerData {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  licenseNumber: string;
  experienceYears: number;
  verificationFee: number;
  verified: boolean;
  createdAt: string;
}

interface PropertyData {
  _id: string;
  title: string;
  location: string;
  price: number;
  propertyType: string;
  status: "PENDING_APPROVAL" | "PUBLISHED" | "REJECTED";
  images: string[];
  owner?: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalAdmins?: number;
  totalLawyers: number;
  verifiedLawyers: number;
  totalProperties: number;
  publishedProperties: number;
  verificationRequests: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Claim admin state (for unauthorized screen)
  const [claimSecret, setClaimSecret] = useState("");
  const [claimError, setClaimError] = useState("");
  const [claimSuccess, setClaimSuccess] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [showClaimSecret, setShowClaimSecret] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "lawyers" | "users">("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [lawyers, setLawyers] = useState<LawyerData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Admin Secret Key Management State
  const [adminSecretKey, setAdminSecretKey] = useState<string>("");
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [newSecretKeyInput, setNewSecretKeyInput] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [keyCopyFeedback, setKeyCopyFeedback] = useState(false);
  const [revokingAdmin, setRevokingAdmin] = useState(false);

  // Filters
  const [propertyFilter, setPropertyFilter] = useState<string>("ALL");
  const [lawyerFilter, setLawyerFilter] = useState<string>("ALL");
  const [userSearch, setUserSearch] = useState<string>("");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");

  // Filtered admin accounts
  const adminUsers = users.filter((u) => u.role === "ADMIN");

  // Check current session
  const verifySession = useCallback(async () => {
    try {
      setAuthLoading(true);
      const tabToken = typeof window !== "undefined" ? sessionStorage.getItem("smartestate_token") : null;
      if (!tabToken) {
        // This tab has no active session -> redirect to login
        router.push("/login?redirect=/admin");
        return;
      }

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${tabToken}` },
      });
      if (!res.ok) {
        router.push("/login?redirect=/admin");
        return;
      }
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
      } else {
        router.push("/login?redirect=/admin");
      }
    } catch {
      router.push("/login?redirect=/admin");
    } finally {
      setAuthLoading(false);
    }
  }, [router]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Load Admin Data when user is confirmed admin
  const loadAdminData = useCallback(async () => {
    if (!currentUser || currentUser.role !== "ADMIN") return;
    try {
      setDataLoading(true);
      const [statsRes, propsRes, lawyersRes, usersRes, keyRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/properties"),
        fetch("/api/admin/lawyers"),
        fetch("/api/admin/users"),
        fetch("/api/admin/secret-key"),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        if (d.success) setStats(d.stats);
      }
      if (propsRes.ok) {
        const d = await propsRes.json();
        if (d.success) setProperties(d.properties);
      }
      if (lawyersRes.ok) {
        const d = await lawyersRes.json();
        if (d.success) setLawyers(d.lawyers);
      }
      if (usersRes.ok) {
        const d = await usersRes.json();
        if (d.success) setUsers(d.users);
      }
      if (keyRes.ok) {
        const kd = await keyRes.json();
        if (kd.success && kd.secretKey) {
          setAdminSecretKey(kd.secretKey);
          setNewSecretKeyInput(kd.secretKey);
        }
      }
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setDataLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      loadAdminData();
    }
  }, [currentUser, loadAdminData]);

  // Handle Property Status Update
  const handleUpdatePropertyStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/properties/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus as any } : p))
        );
        setActionMessage({ text: `Property marked as ${newStatus}`, type: "success" });
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setActionMessage({ text: data.message || "Failed to update status", type: "error" });
      }
    } catch (e: any) {
      setActionMessage({ text: e.message || "Error updating property", type: "error" });
    }
  };

  // Handle Lawyer Verification Toggle
  const handleToggleLawyerVerify = async (id: string, currentVerified: boolean) => {
    try {
      const res = await fetch(`/api/admin/lawyers/${id}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !currentVerified }),
      });
      const data = await res.json();
      if (data.success) {
        setLawyers((prev) =>
          prev.map((l) => (l._id === id ? { ...l, verified: !currentVerified } : l))
        );
        setActionMessage({
          text: `Lawyer status updated to ${!currentVerified ? "VERIFIED" : "UNVERIFIED"}`,
          type: "success",
        });
        setTimeout(() => setActionMessage(null), 4000);
      } else {
        setActionMessage({ text: data.message || "Failed to update lawyer", type: "error" });
      }
    } catch (e: any) {
      setActionMessage({ text: e.message || "Error updating lawyer", type: "error" });
    }
  };

  // Handle Revoking Admin Privileges (demoting to USER)
  const handleRevokeAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to revoke Administrator access for this account?")) return;
    try {
      setRevokingAdmin(true);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "USER" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({
          text: data.message || "Administrator privileges revoked",
          type: "success",
        });
        setTimeout(() => setActionMessage(null), 5000);
        // Refresh users & stats
        const [usersRes, statsRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/stats"),
        ]);
        if (usersRes.ok) {
          const ud = await usersRes.json();
          if (ud.success) setUsers(ud.users);
        }
        if (statsRes.ok) {
          const sd = await statsRes.json();
          if (sd.success) setStats(sd.stats);
        }
      } else {
        setActionMessage({
          text: data.message || "Failed to revoke admin privileges",
          type: "error",
        });
        setTimeout(() => setActionMessage(null), 5000);
      }
    } catch (e: any) {
      setActionMessage({
        text: e.message || "Error revoking admin privileges",
        type: "error",
      });
      setTimeout(() => setActionMessage(null), 5000);
    } finally {
      setRevokingAdmin(false);
    }
  };

  // Handle Updating the Master Admin Secret Key
  const handleUpdateSecretKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecretKeyInput.trim() || newSecretKeyInput.trim().length < 4) {
      setActionMessage({ text: "Secret key must be at least 4 characters long", type: "error" });
      setTimeout(() => setActionMessage(null), 4000);
      return;
    }
    setSavingKey(true);
    try {
      const res = await fetch("/api/admin/secret-key", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: newSecretKeyInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminSecretKey(data.secretKey);
        setIsEditingKey(false);
        setActionMessage({ text: "Admin Secret Key successfully updated!", type: "success" });
        setTimeout(() => setActionMessage(null), 5000);
      } else {
        setActionMessage({ text: data.message || "Failed to update secret key", type: "error" });
        setTimeout(() => setActionMessage(null), 5000);
      }
    } catch (e: any) {
      setActionMessage({ text: e.message || "Error updating secret key", type: "error" });
      setTimeout(() => setActionMessage(null), 5000);
    } finally {
      setSavingKey(false);
    }
  };

  const handleCopySecretKey = () => {
    if (!adminSecretKey) return;
    navigator.clipboard.writeText(adminSecretKey);
    setKeyCopyFeedback(true);
    setTimeout(() => setKeyCopyFeedback(false), 2500);
  };

  // Handle Claim Admin with Secret Key (from unauthorized screen)
  const handleClaimAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaiming(true);
    setClaimError("");
    setClaimSuccess("");
    try {
      const res = await fetch("/api/admin/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: claimSecret.trim() }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setClaimSuccess("Admin privileges verified! Loading dashboard...");
        if (data.token) {
          sessionStorage.setItem("smartestate_token", data.token);
        }
        sessionStorage.setItem("smartestate_user", JSON.stringify(data.user));
        localStorage.removeItem("smartestate_token");
        localStorage.removeItem("smartestate_user");
        setCurrentUser(data.user);
        window.dispatchEvent(new Event("tab-auth-changed"));
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setClaimError(data.message || "Invalid administrator credentials");
      }
    } catch (e: any) {
      setClaimError(e.message || "Failed to verify administrator key");
    } finally {
      setClaiming(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    // Only logs out THIS tab!
    sessionStorage.removeItem("smartestate_token");
    sessionStorage.removeItem("smartestate_user");
    localStorage.removeItem("smartestate_token");
    localStorage.removeItem("smartestate_user");
    window.dispatchEvent(new Event("tab-auth-changed"));
    router.push("/");
  };

  // 1. Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#DCE5EC] flex items-center justify-center p-4">
        <div className="p-8 rounded-[28px] neu-raised text-center space-y-4 max-w-sm w-full border border-white">
          <div className="w-12 h-12 rounded-full neu-inset flex items-center justify-center mx-auto text-[#3155FF] animate-spin text-xl font-bold">
            ⟳
          </div>
          <p className="text-sm font-bold text-slate-700">Verifying Administrator Access...</p>
          <p className="text-xs text-slate-500 font-medium">Inspecting cryptographic credentials</p>
        </div>
      </div>
    );
  }

  // 2. UNAUTHORIZED ACCESS STATE (Logged in, but not an ADMIN)
  // Requires providing the secret key to unlock admin privileges
  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#DCE5EC] flex items-center justify-center p-4">
        <div className="max-w-lg w-full rounded-[32px] neu-raised p-8 sm:p-10 space-y-6 border border-white text-center">
          {/* Security Lock Badge */}
          <div className="w-20 h-20 rounded-full neu-inset mx-auto flex items-center justify-center text-3xl shadow-inner border border-purple-200">
            🔒
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100/80 text-rose-600 border border-rose-200">
              403 • Administrator Authentication Required
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Administrative Area Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              You are signed in as{" "}
              <strong className="text-slate-800">{currentUser?.name || "User"}</strong> (
              <span className="text-[#3155FF]">{currentUser?.email}</span>), but your account does not currently have{" "}
              <span className="font-bold text-rose-600">Administrator</span> permissions.
            </p>
          </div>

          {/* Dedicated Admin Secret Key Entry Form */}
          <div className="p-5 rounded-2xl neu-inset text-left space-y-3.5 border border-purple-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>🔑</span> Unlock Administrator Privileges
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Secret Key Required
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              If you have been provided with the platform <strong>Admin Secret Key</strong>, enter it below to elevate your account to Administrator:
            </p>

            <form onSubmit={handleClaimAdmin} className="space-y-3">
              <div className="relative">
                <input
                  type={showClaimSecret ? "text" : "password"}
                  placeholder="Enter Admin Secret Key..."
                  value={claimSecret}
                  onChange={(e) => setClaimSecret(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl neu-raised outline-none font-mono text-slate-800 pr-14 border border-slate-200/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowClaimSecret(!showClaimSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-700 font-bold"
                >
                  {showClaimSecret ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                disabled={claiming || !claimSecret.trim()}
                className="w-full py-2.5 rounded-xl neu-btn-primary text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>🔑</span>
                <span>{claiming ? "Verifying Secret Key..." : "Verify & Unlock Admin"}</span>
              </button>

              {claimError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold text-center">
                  ⚠️ {claimError}
                </div>
              )}
              {claimSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-bold text-center">
                  ✓ {claimSuccess}
                </div>
              )}
            </form>
          </div>

          {/* Action Buttons for Regular Users */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-full neu-btn-secondary font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5"
            >
              <span>Go to My Dashboard</span>
              <span>→</span>
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full neu-btn-secondary font-bold text-xs text-slate-700 flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. AUTHORIZED ADMIN DASHBOARD STATE
  return (
    <div className="min-h-screen bg-[#DCE5EC] text-slate-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Admin Header Bar */}
        <header className="rounded-[28px] neu-raised p-6 sm:p-8 border border-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Root Administrator
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {currentUser._id}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Platform Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Signed in as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadAdminData}
              disabled={dataLoading}
              className="px-4 py-2.5 rounded-full neu-btn-secondary text-xs font-bold flex items-center gap-2 hover:text-[#3155FF]"
              title="Refresh Dashboard Data"
            >
              <span className={dataLoading ? "animate-spin" : ""}>↻</span>
              <span>{dataLoading ? "Refreshing..." : "Refresh Data"}</span>
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-full neu-btn-secondary text-xs font-bold text-slate-700"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-full neu-raised text-xs font-bold text-rose-600 hover:text-rose-700 active:neu-inset"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Action Message Alert */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold border transition-all ${
              actionMessage.type === "success"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {actionMessage.text}
          </div>
        )}

        {/* Analytics Key Metrics Strip */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-[24px] neu-raised space-y-1.5 border border-white">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Users
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-800">
              {stats?.totalUsers ?? users.length}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Clients & Buyers</span>
          </div>

          <div className="p-5 rounded-[24px] neu-raised space-y-1.5 border border-purple-200/80 bg-purple-50/20">
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>👑</span> Admin Access
            </span>
            <p className="text-2xl sm:text-3xl font-black text-purple-800">
              {stats?.totalAdmins ?? adminUsers.length}
            </p>
            <span className="text-[10px] text-purple-600 font-bold">
              Can access /admin
            </span>
          </div>

          <div className="p-5 rounded-[24px] neu-raised space-y-1.5 border border-white">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Legal Advocates
            </span>
            <p className="text-2xl sm:text-3xl font-black text-[#3155FF]">
              {stats?.verifiedLawyers ?? 0} / {stats?.totalLawyers ?? lawyers.length}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold">
              {stats?.verifiedLawyers ?? 0} Verified & Active
            </span>
          </div>

          <div className="p-5 rounded-[24px] neu-raised space-y-1.5 border border-white">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Properties
            </span>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600">
              {stats?.publishedProperties ?? 0} / {stats?.totalProperties ?? properties.length}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Published Listings</span>
          </div>

          <div className="p-5 rounded-[24px] neu-raised space-y-1.5 border border-white">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Verification Queue
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats?.verificationRequests ?? 0}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">Active Deed Audits</span>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-300/80 pb-3">
          {[
            { id: "overview", label: "Overview & Health", icon: "📊" },
            { id: "properties", label: `Properties (${properties.length})`, icon: "🏡" },
            { id: "lawyers", label: `Lawyers Panel (${lawyers.length})`, icon: "⚖️" },
            { id: "users", label: `Users Directory (${users.length})`, icon: "👥" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "neu-inset text-[#3155FF] bg-blue-50/50"
                  : "neu-raised text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
        {activeTab === "overview" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-[28px] neu-raised space-y-5 border border-white">
              <h3 className="text-lg font-bold text-slate-800">System Architecture & Connectivity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl neu-inset">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🗄️</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Database Connection</p>
                      <p className="text-[11px] text-slate-500">MongoDB Atlas Cluster (Primary)</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    OPERATIONAL (200 OK)
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl neu-inset">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔐</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Authentication Protocol</p>
                      <p className="text-[11px] text-slate-500">JWT HMAC-SHA256 Cookie Signature</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#3155FF]">
                    ACTIVE (7d TTL)
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl neu-inset">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🛡️</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Route Gatekeeper</p>
                      <p className="text-[11px] text-slate-500">RBAC Middleware Security Filter</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    ENFORCED
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 sm:p-8 rounded-[28px] neu-raised space-y-4 border border-white">
              <h3 className="text-lg font-bold text-slate-800">Admin Actions</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Direct actions for moderating properties and validating advocate credentials.
              </p>
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => setActiveTab("properties")}
                  className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-left hover:text-[#3155FF] transition-colors flex items-center justify-between"
                >
                  <span>Review Pending Properties</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setActiveTab("lawyers")}
                  className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-left hover:text-[#3155FF] transition-colors flex items-center justify-between"
                >
                  <span>Verify Advocate Profiles</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-left hover:text-[#3155FF] transition-colors flex items-center justify-between"
                >
                  <span>Inspect User Records</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className="w-full py-3 px-4 rounded-2xl neu-raised text-xs font-bold text-left text-purple-700 hover:text-purple-800 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span>🔑</span> Admin Secret Key & Access Control
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: PROPERTIES MODERATION */}
        {activeTab === "properties" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-800">Property Listings Moderation</h2>
              <div className="flex items-center gap-2">
                {["ALL", "PENDING_APPROVAL", "PUBLISHED", "REJECTED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPropertyFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      propertyFilter === st ? "neu-inset text-[#3155FF]" : "neu-raised text-slate-600"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="p-12 rounded-[28px] neu-raised text-center space-y-2 border border-white">
                <p className="text-base font-bold text-slate-700">No properties submitted yet.</p>
                <p className="text-xs text-slate-500">When users list properties via /sell, they will appear here for review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties
                  .filter((p) => propertyFilter === "ALL" || p.status === propertyFilter)
                  .map((prop) => (
                    <div
                      key={prop._id}
                      className="p-5 rounded-[24px] neu-raised space-y-4 border border-white flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              prop.status === "PUBLISHED"
                                ? "bg-emerald-100 text-emerald-700"
                                : prop.status === "REJECTED"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {prop.status.replace("_", " ")}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-500">
                            {prop.propertyType}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{prop.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{prop.location}</p>
                        <p className="text-base font-extrabold text-[#3155FF]">
                          ₹{(prop.price / 100000).toFixed(2)} Lakh
                        </p>
                        {prop.owner && (
                          <div className="text-[11px] text-slate-500 neu-inset p-2.5 rounded-xl">
                            <span className="font-bold text-slate-700">Owner:</span> {prop.owner.name} ({prop.owner.email})
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 flex items-center gap-2 border-t border-slate-200/80">
                        {prop.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handleUpdatePropertyStatus(prop._id, "PUBLISHED")}
                            className="flex-1 py-2 text-xs font-bold rounded-xl neu-btn-primary"
                          >
                            ✓ Approve
                          </button>
                        )}
                        {prop.status !== "REJECTED" && (
                          <button
                            onClick={() => handleUpdatePropertyStatus(prop._id, "REJECTED")}
                            className="flex-1 py-2 text-xs font-bold rounded-xl neu-raised text-rose-600 hover:text-rose-700 active:neu-inset"
                          >
                            ✕ Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: LAWYERS VERIFICATION */}
        {activeTab === "lawyers" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-800">Advocate Panel Verifications</h2>
              <div className="flex items-center gap-2">
                {["ALL", "true", "false"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setLawyerFilter(opt)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      lawyerFilter === opt ? "neu-inset text-[#3155FF]" : "neu-raised text-slate-600"
                    }`}
                  >
                    {opt === "ALL" ? "All" : opt === "true" ? "Verified" : "Pending"}
                  </button>
                ))}
              </div>
            </div>

            {lawyers.length === 0 ? (
              <div className="p-12 rounded-[28px] neu-raised text-center space-y-2 border border-white">
                <p className="text-base font-bold text-slate-700">No lawyers registered yet.</p>
                <p className="text-xs text-slate-500">When lawyers register through /auth?role=LAWYER, they will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lawyers
                  .filter((l) =>
                    lawyerFilter === "ALL"
                      ? true
                      : lawyerFilter === "true"
                      ? l.verified
                      : !l.verified
                  )
                  .map((lawyer) => (
                    <div
                      key={lawyer._id}
                      className="p-5 rounded-[24px] neu-raised space-y-4 border border-white flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                              lawyer.verified
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {lawyer.verified ? "VERIFIED ADVOCATE" : "PENDING VERIFICATION"}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#3155FF]">
                            ₹{lawyer.verificationFee} Fee
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-800">
                            {lawyer.userId?.name || "Advocate"}
                          </h4>
                          <p className="text-xs text-slate-500">{lawyer.userId?.email}</p>
                        </div>

                        <div className="text-xs space-y-1 p-3 rounded-xl neu-inset">
                          <p>
                            <span className="font-bold text-slate-700">Bar License:</span>{" "}
                            <span className="font-mono">{lawyer.licenseNumber}</span>
                          </p>
                          <p>
                            <span className="font-bold text-slate-700">Experience:</span>{" "}
                            {lawyer.experienceYears} Years
                          </p>
                          {lawyer.userId?.phone && (
                            <p>
                              <span className="font-bold text-slate-700">Phone:</span>{" "}
                              {lawyer.userId.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleLawyerVerify(lawyer._id, lawyer.verified)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                          lawyer.verified
                            ? "neu-raised text-rose-600 hover:text-rose-700 active:neu-inset"
                            : "neu-btn-primary"
                        }`}
                      >
                        {lawyer.verified ? "Revoke Verification" : "✓ Verify & Approve Advocate"}
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 4: USERS DIRECTORY & ADMIN KEY MANAGEMENT */}
        {activeTab === "users" && (
          <section className="space-y-6">
            {/* Admin Secret Key Management Card */}
            <div className="p-6 sm:p-8 rounded-[28px] neu-raised space-y-6 border border-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
                    <span>🔑</span> Admin Secret Key Management
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Anyone who wishes to obtain administrator privileges must provide this secret key at{" "}
                    <code className="text-[#3155FF] bg-blue-50 px-1.5 py-0.5 rounded font-mono">/admin</code>.
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-3.5 py-1.5 rounded-full border border-purple-200 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  Key-Gated Admin Access
                </span>
              </div>

              {/* Secret Key Display and Edit Controls */}
              <div className="p-5 rounded-2xl neu-inset space-y-4 border border-purple-100">
                {!isEditingKey ? (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Current Platform Secret Key
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm sm:text-base font-bold text-slate-800 tracking-wide break-all select-all">
                          {isKeyVisible ? adminSecretKey || "smartestate_admin_2026" : "••••••••••••••••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsKeyVisible(!isKeyVisible)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold neu-raised text-slate-600 hover:text-slate-900 active:neu-inset transition-colors shrink-0"
                          title={isKeyVisible ? "Hide Secret Key" : "Show Secret Key"}
                        >
                          {isKeyVisible ? "🙈 Hide" : "👁️ View"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopySecretKey}
                        className="px-4 py-2 rounded-xl neu-btn-secondary text-xs font-bold flex items-center gap-1.5 text-slate-700 hover:text-[#3155FF]"
                      >
                        <span>{keyCopyFeedback ? "✓" : "📋"}</span>
                        <span>{keyCopyFeedback ? "Copied!" : "Copy Key"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setNewSecretKeyInput(adminSecretKey || "smartestate_admin_2026");
                          setIsEditingKey(true);
                        }}
                        className="px-4 py-2 rounded-xl neu-btn-primary text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>✏️</span>
                        <span>Edit Secret Key</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateSecretKey} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                        Update Administrator Secret Key
                      </label>
                      <input
                        type="text"
                        value={newSecretKeyInput}
                        onChange={(e) => setNewSecretKeyInput(e.target.value)}
                        placeholder="Enter new secret key (minimum 4 characters)..."
                        className="w-full px-4 py-2.5 text-xs rounded-xl neu-raised outline-none font-mono text-slate-800 border border-purple-200"
                        required
                        minLength={4}
                        autoFocus
                      />
                      <p className="text-[11px] text-slate-500 font-medium">
                        Changing this key takes effect immediately across the platform. Any future admin must supply this updated key.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={savingKey}
                        className="px-5 py-2 rounded-xl neu-btn-primary text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <span>✓</span>
                        <span>{savingKey ? "Saving..." : "Save New Key"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingKey(false);
                          setNewSecretKeyInput(adminSecretKey);
                        }}
                        className="px-4 py-2 rounded-xl neu-btn-secondary text-xs font-bold text-slate-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5 text-xs text-slate-600">
                  <span className="text-sm">ℹ️</span>
                  <p className="text-[11px] leading-relaxed">
                    <strong>How a user becomes an Admin:</strong> Simply provide this secret key to the user. When they log in and navigate to <code className="font-mono text-[#3155FF]">/admin</code>, they enter the key to unlock full administrator privileges. Direct manual user promotion is removed for security compliance.
                  </p>
                </div>
              </div>

              {/* Current Authorized Admin Accounts Showcase */}
              <div className="pt-2 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                    <span>Authorized Administrators ({adminUsers.length} accounts have access)</span>
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Only these accounts currently have access to manage /admin
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {adminUsers.map((admin) => (
                    <div
                      key={admin._id}
                      className="p-3.5 rounded-2xl neu-inset flex items-center justify-between gap-3 border border-purple-100"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-[#3155FF] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                          {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate flex items-center gap-1.5">
                            <span className="truncate">{admin.name}</span>
                            {admin._id === currentUser._id && (
                              <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full shrink-0">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate font-mono">{admin.email}</p>
                        </div>
                      </div>

                      {admin._id !== currentUser._id && (
                        <button
                          type="button"
                          onClick={() => handleRevokeAdmin(admin._id)}
                          disabled={revokingAdmin}
                          className="px-2.5 py-1 text-[10px] font-bold text-rose-600 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors shrink-0 disabled:opacity-50"
                          title="Revoke Admin Access"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-800">Users Directory</h2>
                <div className="flex items-center gap-1.5 ml-0 sm:ml-2 flex-wrap">
                  {[
                    { id: "ALL", label: `All (${users.length})` },
                    { id: "ADMIN", label: `👑 Admins (${adminUsers.length})` },
                    { id: "USER", label: `Clients (${users.filter((u) => u.role === "USER").length})` },
                    { id: "LAWYER", label: `Advocates (${users.filter((u) => u.role === "LAWYER").length})` },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setUserRoleFilter(filter.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        userRoleFilter === filter.id
                          ? "neu-inset text-[#3155FF]"
                          : "neu-raised text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="px-4 py-2 text-xs rounded-full neu-inset outline-none max-w-xs"
              />
            </div>

            {users.length === 0 ? (
              <div className="p-12 rounded-[28px] neu-raised text-center space-y-2 border border-white">
                <p className="text-base font-bold text-slate-700">No users found in database.</p>
              </div>
            ) : (
              <div className="rounded-[24px] neu-raised overflow-hidden p-3 border border-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider">
                        <th className="p-3.5">Name</th>
                        <th className="p-3.5">Email</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Joined</th>
                        <th className="p-3.5 text-right">Admin Access Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60 font-medium text-slate-700">
                      {users
                        .filter(
                          (u) =>
                            (userRoleFilter === "ALL" || u.role === userRoleFilter) &&
                            (u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                              u.email.toLowerCase().includes(userSearch.toLowerCase()))
                        )
                        .map((u) => (
                          <tr key={u._id} className="hover:bg-blue-50/20 transition-colors">
                            <td className="p-3.5 font-bold text-slate-800">{u.name}</td>
                            <td className="p-3.5 font-mono text-slate-600">{u.email}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                  u.role === "ADMIN"
                                    ? "bg-purple-100 text-purple-700 font-bold"
                                    : u.role === "LAWYER"
                                    ? "bg-blue-100 text-[#3155FF]"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-400 font-mono">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-3.5 text-right">
                              {u._id === currentUser._id ? (
                                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                                  ✓ Active Account (You)
                                </span>
                              ) : u.role === "ADMIN" ? (
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                    👑 Administrator
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRevokeAdmin(u._id)}
                                    disabled={revokingAdmin}
                                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg neu-raised text-rose-600 hover:text-rose-700 active:neu-inset transition-all disabled:opacity-50"
                                    title="Revoke administrator privileges"
                                  >
                                    Revoke
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium italic">
                                  🔒 Requires Secret Key
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
