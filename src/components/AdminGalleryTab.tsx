"use client";

import React, { useState, useEffect, useCallback } from "react";
import { NeuStatCard, NeuButton, NeuModal } from "./NeumorphicUI";

interface AdminImageItem {
  _id: string;
  url: string;
  publicId?: string;
  isMain: boolean;
  caption?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isVisible: boolean;
  displayOrder: number;
  rejectionReason?: string;
  createdAt: string;
  propertyId: {
    _id: string;
    title: string;
    price: number;
    location?: {
      address: string;
      city: string;
    };
    status?: string;
  };
  ownerId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  visible: number;
}

export default function AdminGalleryTab() {
  const [images, setImages] = useState<AdminImageItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    visible: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modals
  const [previewImage, setPreviewImage] = useState<AdminImageItem | null>(null);
  const [rejectingImage, setRejectingImage] = useState<AdminImageItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [deleteConfirmImage, setDeleteConfirmImage] = useState<AdminImageItem | null>(null);
  const [displayOrderEdit, setDisplayOrderEdit] = useState<{ id: string; order: number } | null>(null);

  const fetchAdminImages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (visibilityFilter !== "ALL") params.append("isVisible", visibilityFilter);

      const res = await fetch(`/api/admin/property-images?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setImages(data.images || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error("Failed to fetch admin images", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, visibilityFilter]);

  useEffect(() => {
    fetchAdminImages();
  }, [fetchAdminImages]);

  const handleUpdateImage = async (id: string, updates: any) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/property-images/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to update image");
      } else {
        fetchAdminImages();
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteImage = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/property-images/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete image");
      } else {
        setDeleteConfirmImage(null);
        fetchAdminImages();
      }
    } catch (err: any) {
      alert(err.message || "Network error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBulkAction = async (action: string, extra?: any) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/admin/property-images/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageIds: selectedIds,
          action,
          ...extra,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        fetchAdminImages();
      } else {
        alert(data.message || "Bulk action failed");
      }
    } catch (e: any) {
      alert(e.message || "Error executing bulk action");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === images.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(images.map((img) => img._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <NeuStatCard
          title="Total Uploads"
          value={stats.total}
          icon={<span className="text-xl">📸</span>}
          subtitle="Stored in Cloudinary"
        />
        <NeuStatCard
          title="Pending Review"
          value={stats.pending}
          icon={<span className="text-xl">⏳</span>}
          change={stats.pending > 0 ? `${stats.pending} pending` : "All reviewed"}
          isPositive={stats.pending === 0}
          subtitle="Awaiting approval"
        />
        <NeuStatCard
          title="Approved"
          value={stats.approved}
          icon={<span className="text-xl">✅</span>}
          subtitle="Passed quality review"
        />
        <NeuStatCard
          title="Live in Gallery"
          value={stats.visible}
          icon={<span className="text-xl">👁️</span>}
          subtitle="Publicly visible"
        />
        <NeuStatCard
          title="Rejected"
          value={stats.rejected}
          icon={<span className="text-xl">🚫</span>}
          subtitle="Violates guidelines"
        />
      </div>

      {/* Filter Controls & Bulk Action Bar */}
      <div className="rounded-[24px] neu-raised p-5 border border-white/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="inline-flex p-1 rounded-full neu-inset gap-1 overflow-x-auto">
            {[
              { id: "ALL", label: "All Statuses" },
              { id: "PENDING", label: `Pending (${stats.pending})` },
              { id: "APPROVED", label: `Approved (${stats.approved})` },
              { id: "REJECTED", label: `Rejected (${stats.rejected})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? "neu-raised text-[#3155FF]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="inline-flex p-1 rounded-full neu-inset gap-1">
            {[
              { id: "ALL", label: "All Visibility" },
              { id: "true", label: "Live in Gallery" },
              { id: "false", label: "Hidden" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setVisibilityFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  visibilityFilter === tab.id
                    ? "neu-raised text-[#3155FF]"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {images.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedIds.length === images.length && images.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-[#3155FF] accent-[#3155FF] cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-700">
                {selectedIds.length > 0
                  ? `${selectedIds.length} of ${images.length} images selected`
                  : `Select all (${images.length})`}
              </span>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleBulkAction("APPROVE_AND_SHOW")}
                  className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
                >
                  ✓ Approve & Show ({selectedIds.length})
                </button>
                <button
                  onClick={() => handleBulkAction("MAKE_VISIBLE")}
                  className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
                >
                  👁️ Make Visible
                </button>
                <button
                  onClick={() => handleBulkAction("HIDE")}
                  className="px-3 py-1.5 rounded-full bg-slate-600 text-white text-xs font-bold hover:bg-slate-700 transition-all shadow-sm"
                >
                  🔒 Hide Selected
                </button>
                <button
                  onClick={() => handleBulkAction("REJECT")}
                  className="px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-sm"
                >
                  ✕ Reject Selected
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grid of Images */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#3155FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading submitted images...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="py-16 rounded-[28px] neu-inset text-center p-8 space-y-3">
          <div className="w-16 h-16 rounded-3xl neu-raised mx-auto flex items-center justify-center text-2xl text-slate-500">
            📂
          </div>
          <h4 className="text-base font-bold text-slate-800">No images match this filter</h4>
          <p className="text-xs text-slate-500">
            Change your status or visibility filters above to view other photo submissions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => {
            const isSelected = selectedIds.includes(img._id);
            const isBusy = actionLoadingId === img._id;

            return (
              <div
                key={img._id}
                className={`rounded-[28px] neu-raised p-4 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isSelected ? "border-[#3155FF] ring-2 ring-[#3155FF]/20" : "border-white/90"
                }`}
              >
                {/* Header: Owner & Selection */}
                <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(img._id)}
                      className="w-4 h-4 rounded text-[#3155FF] accent-[#3155FF] cursor-pointer"
                    />
                    <div className="truncate">
                      <p className="text-xs font-extrabold text-slate-800 truncate">
                        {img.ownerId?.name || "Unknown Owner"}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{img.ownerId?.email}</p>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(img.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Thumbnail */}
                <div
                  onClick={() => setPreviewImage(img)}
                  className="relative h-48 w-full rounded-2xl overflow-hidden neu-inset cursor-pointer group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.caption || "Property image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start pointer-events-none">
                    {img.status === "PENDING" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-md flex items-center gap-1">
                        <span>⏳</span> Pending Review
                      </span>
                    )}
                    {img.status === "APPROVED" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-md flex items-center gap-1">
                        <span>✓</span> Approved
                      </span>
                    )}
                    {img.status === "REJECTED" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-md flex items-center gap-1">
                        <span>✕</span> Rejected
                      </span>
                    )}

                    {img.isVisible ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-md flex items-center gap-1">
                        <span>👁️</span> Visible in Gallery
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-800/85 text-slate-300 shadow-md flex items-center gap-1">
                        <span>🔒</span> Hidden from Gallery
                      </span>
                    )}
                  </div>

                  {img.isMain && (
                    <div className="absolute top-2.5 right-2.5 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-md flex items-center gap-1">
                        <span>⭐</span> Featured / Main
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    🔍 Click to Zoom
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Property Listing
                    </span>
                    <p className="text-xs font-extrabold text-slate-800 truncate" title={img.propertyId?.title}>
                      {img.propertyId?.title || "Unknown Property"}
                    </p>
                    {img.propertyId?.location?.city && (
                      <p className="text-[11px] text-slate-500">📍 {img.propertyId.location.city}</p>
                    )}
                  </div>

                  {img.caption && (
                    <p className="text-xs text-slate-600 italic bg-white/40 p-2 rounded-xl border border-white/60">
                      &quot;{img.caption}&quot;
                    </p>
                  )}

                  {img.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                      <strong className="text-rose-900">Rejection Note:</strong> {img.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Display Order Control */}
                <div className="flex items-center justify-between py-1.5 px-2.5 rounded-xl neu-inset text-xs">
                  <span className="font-bold text-slate-600">Gallery Display Order:</span>
                  <button
                    onClick={() =>
                      setDisplayOrderEdit({ id: img._id, order: img.displayOrder || 0 })
                    }
                    className="font-extrabold text-[#3155FF] hover:underline"
                  >
                    #{img.displayOrder ?? 0} (Edit)
                  </button>
                </div>

                {/* Decision Actions */}
                <div className="pt-2 border-t border-slate-200/60 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {img.status !== "APPROVED" ? (
                      <button
                        onClick={() => handleUpdateImage(img._id, { status: "APPROVED" })}
                        disabled={isBusy}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                      >
                        ✓ Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => setRejectingImage(img)}
                        disabled={isBusy}
                        className="py-2 px-3 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-bold transition-all"
                      >
                        ✕ Reject
                      </button>
                    )}

                    {img.status === "PENDING" && (
                      <button
                        onClick={() => setRejectingImage(img)}
                        disabled={isBusy}
                        className="py-2 px-3 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-bold transition-all"
                      >
                        ✕ Reject
                      </button>
                    )}

                    {img.status === "REJECTED" && (
                      <button
                        onClick={() => handleUpdateImage(img._id, { status: "APPROVED" })}
                        disabled={isBusy}
                        className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                      >
                        Re-Approve
                      </button>
                    )}

                    {img.isVisible ? (
                      <button
                        onClick={() => handleUpdateImage(img._id, { isVisible: false })}
                        disabled={isBusy}
                        className="py-2 px-3 rounded-xl neu-btn-secondary text-slate-700 text-xs font-bold"
                        title="Hide from user's gallery without deleting"
                      >
                        🔒 Hide Photo
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (img.status !== "APPROVED") {
                            handleUpdateImage(img._id, { status: "APPROVED", isVisible: true });
                          } else {
                            handleUpdateImage(img._id, { isVisible: true });
                          }
                        }}
                        disabled={isBusy}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
                        title="Display in user's public property gallery"
                      >
                        👁️ Show in Gallery
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    {img.isMain ? (
                      <span className="font-bold text-purple-700 text-[11px] flex items-center gap-1">
                        ⭐ Primary Cover Image
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleUpdateImage(img._id, {
                            status: "APPROVED",
                            isVisible: true,
                            isMain: true,
                          })
                        }
                        disabled={isBusy}
                        className="text-[#3155FF] hover:underline font-bold text-[11px] flex items-center gap-1"
                      >
                        ★ Set as Main Image
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteConfirmImage(img)}
                      disabled={isBusy}
                      className="text-rose-600 hover:text-rose-800 font-semibold text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <NeuModal
        isOpen={Boolean(rejectingImage)}
        onClose={() => setRejectingImage(null)}
        title="Reject Property Image"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Explain why this image does not meet SmartEstate standards (e.g. blurry, watermarked, irrelevant).
            This note will be visible to the property owner.
          </p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. Image is low resolution or contains third-party watermarks."
            className="w-full rounded-2xl neu-input p-3.5 text-xs text-slate-800 font-medium"
          />
          <div className="flex justify-end gap-3 pt-2">
            <NeuButton variant="inset" size="sm" onClick={() => setRejectingImage(null)}>
              Cancel
            </NeuButton>
            <NeuButton
              variant="danger"
              size="sm"
              onClick={() => {
                if (rejectingImage) {
                  handleUpdateImage(rejectingImage._id, {
                    status: "REJECTED",
                    rejectionReason: rejectionReason || "Image does not meet platform visual standards.",
                  });
                  setRejectingImage(null);
                  setRejectionReason("");
                }
              }}
            >
              Confirm Rejection
            </NeuButton>
          </div>
        </div>
      </NeuModal>

      <NeuModal
        isOpen={Boolean(deleteConfirmImage)}
        onClose={() => setDeleteConfirmImage(null)}
        title="Confirm Permanent Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete this photo? It will be removed from MongoDB and destroyed in Cloudinary.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <NeuButton variant="inset" size="sm" onClick={() => setDeleteConfirmImage(null)}>
              Cancel
            </NeuButton>
            <NeuButton
              variant="danger"
              size="sm"
              onClick={() => deleteConfirmImage && handleDeleteImage(deleteConfirmImage._id)}
            >
              Delete Permanently
            </NeuButton>
          </div>
        </div>
      </NeuModal>

      <NeuModal
        isOpen={Boolean(displayOrderEdit)}
        onClose={() => setDisplayOrderEdit(null)}
        title="Set Gallery Display Order"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Lower numbers appear first in the gallery (e.g. 0 is first, 1 is second).
          </p>
          <input
            type="number"
            value={displayOrderEdit?.order ?? 0}
            onChange={(e) =>
              setDisplayOrderEdit((prev) =>
                prev ? { ...prev, order: Number(e.target.value) } : null
              )
            }
            className="w-full rounded-2xl neu-input py-3 px-4 text-sm text-slate-800 font-medium"
          />
          <div className="flex justify-end gap-3 pt-2">
            <NeuButton variant="inset" size="sm" onClick={() => setDisplayOrderEdit(null)}>
              Cancel
            </NeuButton>
            <NeuButton
              variant="primary"
              size="sm"
              onClick={() => {
                if (displayOrderEdit) {
                  handleUpdateImage(displayOrderEdit.id, {
                    displayOrder: displayOrderEdit.order,
                  });
                  setDisplayOrderEdit(null);
                }
              }}
            >
              Save Order
            </NeuButton>
          </div>
        </div>
      </NeuModal>

      <NeuModal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.propertyId?.title || "Property Photo Preview"}
      >
        {previewImage && (
          <div className="space-y-4">
            <div className="relative max-h-[70vh] rounded-2xl overflow-hidden neu-inset">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.caption || "Full preview"}
                className="w-full h-auto max-h-[70vh] object-contain mx-auto"
              />
            </div>
            <div className="space-y-1 text-xs text-slate-600 bg-white/40 p-4 rounded-2xl border border-white/60">
              <div className="flex justify-between">
                <span>Owner:</span>
                <strong className="text-slate-800">{previewImage.ownerId?.name} ({previewImage.ownerId?.email})</strong>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <strong className="text-slate-800">{previewImage.status}</strong>
              </div>
              <div className="flex justify-between">
                <span>Visibility:</span>
                <strong className="text-slate-800">{previewImage.isVisible ? "Visible in Gallery" : "Hidden"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Featured Main:</span>
                <strong className="text-slate-800">{previewImage.isMain ? "Yes" : "No"}</strong>
              </div>
            </div>
          </div>
        )}
      </NeuModal>
    </div>
  );
}
