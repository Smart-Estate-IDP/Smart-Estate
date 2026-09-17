"use client";

import React, { useState, useEffect, useCallback } from "react";
import ImageUploader from "./ImageUploader";
import { NeuButton, NeuModal } from "./NeumorphicUI";

export interface PropertyImageItem {
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
  propertyId?: {
    _id: string;
    title: string;
    price: number;
  };
}

interface UserImageManagerProps {
  propertyId: string;
  propertyTitle?: string;
  onImageCountChange?: (count: number) => void;
}

export default function UserImageManager({
  propertyId,
  propertyTitle,
  onImageCountChange,
}: UserImageManagerProps) {
  const [images, setImages] = useState<PropertyImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState<PropertyImageItem | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<PropertyImageItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchImages = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/property-images?propertyId=${propertyId}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load property images");
      }
      setImages(data.images || []);
      if (onImageCountChange) {
        onImageCountChange(data.images?.length || 0);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load images");
    } finally {
      setLoading(false);
    }
  }, [propertyId, onImageCountChange]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleUpdateCaption = async () => {
    if (!editingImage) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/property-images/${editingImage._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: editCaption }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update caption");
      }
      setEditingImage(null);
      fetchImages();
    } catch (err: any) {
      alert(err.message || "Error updating caption");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/property-images/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete image");
      }
      setDeleteConfirmId(null);
      fetchImages();
    } catch (err: any) {
      alert(err.message || "Error deleting image");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with upload action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/60">
        <div>
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <span>📸</span>
            <span>Property Photos & Moderation Status</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {propertyTitle ? `Listing: ${propertyTitle}` : "Manage private uploads"} • All uploads
            are verified by admins before appearing in public galleries.
          </p>
        </div>

        <NeuButton
          variant="primary"
          size="sm"
          onClick={() => setShowUploadModal(true)}
          className="shadow-md shadow-blue-500/20 self-start sm:self-auto"
        >
          <span>+ Upload New Photos</span>
        </NeuButton>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          ⚠️ {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#3155FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading property photos...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="py-12 rounded-[28px] neu-inset text-center p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl neu-raised mx-auto flex items-center justify-center text-2xl text-[#3155FF]">
            🖼️
          </div>
          <div>
            <h4 className="text-base font-extrabold text-slate-800">No photos uploaded yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Add multiple high-resolution photos of living areas, bedrooms, kitchen, and exterior views.
              Our admin team will review and feature the best shots.
            </p>
          </div>
          <NeuButton variant="primary" size="md" onClick={() => setShowUploadModal(true)}>
            Upload Photos Now
          </NeuButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {images.map((img) => (
            <div
              key={img._id}
              className="rounded-[24px] neu-raised p-3.5 border border-white/80 flex flex-col justify-between space-y-3 group hover:shadow-lg transition-all"
            >
              <div
                onClick={() => setPreviewImage(img)}
                className="relative h-44 w-full rounded-[18px] overflow-hidden neu-inset cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || "Property photo"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start pointer-events-none">
                  {img.status === "PENDING" && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <span>⏳</span> Pending Admin Review
                    </span>
                  )}
                  {img.status === "APPROVED" && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                      <span>✓</span> Approved
                    </span>
                  )}
                  {img.status === "REJECTED" && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-sm flex items-center gap-1">
                      <span>✕</span> Rejected
                    </span>
                  )}

                  {img.isVisible ? (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-sm flex items-center gap-1">
                      <span>👁️</span> Live in Gallery
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-700/90 text-slate-200 shadow-sm flex items-center gap-1">
                      <span>🔒</span> Hidden from Gallery
                    </span>
                  )}
                </div>

                {img.isMain && (
                  <div className="absolute top-2.5 right-2.5 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-600 text-white shadow-sm flex items-center gap-1">
                      <span>⭐</span> Main Photo
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 truncate" title={img.caption}>
                    {img.caption || "No caption added"}
                  </span>
                  <button
                    onClick={() => {
                      setEditingImage(img);
                      setEditCaption(img.caption || "");
                    }}
                    className="text-[11px] text-[#3155FF] font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {img.status === "REJECTED" && img.rejectionReason && (
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                    <span className="font-bold">Reason: </span>
                    {img.rejectionReason}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 font-mono">
                  Uploaded: {new Date(img.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {img.isVisible ? "Publicly viewable" : "Only visible to you"}
                </span>

                <button
                  onClick={() => setDeleteConfirmId(img._id)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete image"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <NeuModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Property Images"
      >
        <ImageUploader
          propertyId={propertyId}
          onUploadSuccess={() => {
            fetchImages();
            setShowUploadModal(false);
          }}
        />
      </NeuModal>

      {/* Edit Caption Modal */}
      <NeuModal
        isOpen={Boolean(editingImage)}
        onClose={() => setEditingImage(null)}
        title="Edit Image Caption"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Caption
            </label>
            <input
              type="text"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Describe this image..."
              className="w-full rounded-2xl neu-input py-3 px-4 text-sm text-slate-800 font-medium"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <NeuButton
              variant="inset"
              size="sm"
              onClick={() => setEditingImage(null)}
              disabled={actionLoading}
            >
              Cancel
            </NeuButton>
            <NeuButton
              variant="primary"
              size="sm"
              onClick={handleUpdateCaption}
              disabled={actionLoading}
            >
              Save Caption
            </NeuButton>
          </div>
        </div>
      </NeuModal>

      {/* Delete Confirmation Modal */}
      <NeuModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to permanently delete this photo? This will remove the record from
            the database and delete the asset from Cloudinary storage.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <NeuButton
              variant="inset"
              size="sm"
              onClick={() => setDeleteConfirmId(null)}
              disabled={actionLoading}
            >
              Cancel
            </NeuButton>
            <NeuButton
              variant="danger"
              size="sm"
              onClick={() => deleteConfirmId && handleDeleteImage(deleteConfirmId)}
              disabled={actionLoading}
            >
              {actionLoading ? "Deleting..." : "Permanently Delete"}
            </NeuButton>
          </div>
        </div>
      </NeuModal>

      {/* Full Preview Modal */}
      <NeuModal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.caption || "Photo Preview"}
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
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Status: <strong className="text-slate-800">{previewImage.status}</strong></span>
              <span>Gallery: <strong className="text-slate-800">{previewImage.isVisible ? "Visible" : "Hidden"}</strong></span>
              <span>Main: <strong className="text-slate-800">{previewImage.isMain ? "Yes" : "No"}</strong></span>
            </div>
          </div>
        )}
      </NeuModal>
    </div>
  );
}
