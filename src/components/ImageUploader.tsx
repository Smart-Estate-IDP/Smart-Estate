"use client";

import React, { useState, useRef } from "react";
import { NeuButton, NeuProgress } from "./NeumorphicUI";

interface ImageUploaderProps {
  propertyId: string;
  onUploadSuccess?: () => void;
  className?: string;
}

interface SelectedFile {
  file: File;
  previewUrl: string;
  id: string;
}

export default function ImageUploader({
  propertyId,
  onUploadSuccess,
  className = "",
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [caption, setCaption] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const newFiles: SelectedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validTypes.includes(file.type)) {
        setErrorMessage(`Skipped "${file.name}": Only JPG, PNG, and WebP are allowed.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`Skipped "${file.name}": File size exceeds 10 MB limit.`);
        continue;
      }

      newFiles.push({
        file,
        previewUrl: URL.createObjectURL(file),
        id: `${file.name}-${Date.now()}-${Math.random()}`,
      });
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    if (!propertyId) {
      setErrorMessage("Please select or save a property before uploading images.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append("propertyId", propertyId);
    if (caption) {
      formData.append("caption", caption);
    }

    selectedFiles.forEach((sf) => {
      formData.append("images", sf.file);
    });

    try {
      setUploadProgress(50);
      const res = await fetch("/api/property-images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadProgress(100);

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload images");
      }

      setSuccessMessage(
        `Successfully uploaded ${data.count} image(s)! Images will be reviewed by admin before appearing publicly.`
      );
      selectedFiles.forEach((sf) => URL.revokeObjectURL(sf.previewUrl));
      setSelectedFiles([]);
      setCaption("");

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error while uploading. Please check connection.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-[24px] p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-[#3155FF] bg-blue-50/50 scale-[1.01]"
            : "border-slate-300 hover:border-[#3155FF] neu-inset hover:bg-white/30"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl neu-raised flex items-center justify-center text-[#3155FF] shadow-md">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Drag and drop images here, or <span className="text-[#3155FF]">browse files</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports JPEG, PNG, WebP up to 10 MB each • Uploads are stored in Cloudinary
            </p>
          </div>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>{selectedFiles.length} file(s) ready to upload</span>
            <button
              onClick={() => {
                selectedFiles.forEach((sf) => URL.revokeObjectURL(sf.previewUrl));
                setSelectedFiles([]);
              }}
              className="text-rose-500 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedFiles.map((sf) => (
              <div
                key={sf.id}
                className="group relative rounded-2xl overflow-hidden neu-raised border border-white/80 p-1.5 flex flex-col justify-between"
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden neu-inset">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sf.previewUrl}
                    alt={sf.file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFile(sf.id)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/70 text-white flex items-center justify-center text-xs hover:bg-rose-600 transition-colors shadow-sm"
                    title="Remove from selection"
                  >
                    ✕
                  </button>
                </div>
                <div className="pt-2 px-1 text-[11px]">
                  <p className="font-semibold text-slate-800 truncate" title={sf.file.name}>
                    {sf.file.name}
                  </p>
                  <p className="text-slate-400 font-mono text-[10px]">
                    {formatFileSize(sf.file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Optional Caption / Description for batch
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Master bedroom with scenic balcony view"
              className="w-full rounded-xl neu-input py-2.5 px-4 text-xs text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <NeuButton
              variant="primary"
              size="md"
              onClick={handleUpload}
              disabled={isUploading}
              className="shadow-lg shadow-blue-500/20"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <span>☁️</span>
                  <span>Upload {selectedFiles.length} Image(s)</span>
                </>
              )}
            </NeuButton>
          </div>
        </div>
      )}

      {isUploading && (
        <NeuProgress value={uploadProgress} label="Uploading & Storing Permanently" color="blue" />
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <span>✅</span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}
    </div>
  );
}
