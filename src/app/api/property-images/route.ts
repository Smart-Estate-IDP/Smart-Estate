import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyImage from "@/models/PropertyImage";
import { getAuthUser } from "@/lib/auth";
import { uploadPropertyImageBuffer, deletePropertyImage, isCloudinaryConfigured } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

// POST /api/property-images (Upload multiple images to property)
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in to upload images." },
        { status: 401 }
      );
    }

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cloud storage is not configured on the server. Please configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        },
        { status: 500 }
      );
    }

    await connectDB();

    const formData = await req.formData();
    const propertyId = formData.get("propertyId") as string;
    const caption = (formData.get("caption") as string) || "";

    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing property ID" },
        { status: 400 }
      );
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // Ownership check: must be property owner or admin
    if (property.ownerId.toString() !== authUser.userId && authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: You do not own this property" },
        { status: 403 }
      );
    }

    // Extract files from formData (supports "images", "files", or "image")
    let rawFiles: File[] = [];
    const fields = ["images", "files", "image", "file"];
    for (const field of fields) {
      const fieldFiles = formData.getAll(field) as File[];
      if (fieldFiles && fieldFiles.length > 0) {
        rawFiles = rawFiles.concat(fieldFiles.filter((f) => f instanceof File && f.size > 0));
      }
    }

    if (rawFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: "No image files provided for upload" },
        { status: 400 }
      );
    }

    const uploadedImages = [];
    const uploadErrors: { fileName: string; error: string }[] = [];

    for (const file of rawFiles) {
      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        uploadErrors.push({
          fileName: file.name,
          error: `Unsupported file format (${file.type || "unknown"}). Allowed formats: JPEG, PNG, WebP.`,
        });
        continue;
      }

      // Validate File Size
      if (file.size > MAX_FILE_SIZE) {
        uploadErrors.push({
          fileName: file.name,
          error: `File exceeds maximum allowed size of 10 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
        });
        continue;
      }

      let uploadResult;
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Cloudinary
        uploadResult = await uploadPropertyImageBuffer(buffer, propertyId, file.name);

        // Save record to MongoDB with PENDING and isVisible: false (Admin controls visibility)
        const imageDoc = await PropertyImage.create({
          propertyId: property._id,
          ownerId: authUser.userId,
          url: uploadResult.secureUrl,
          publicId: uploadResult.publicId,
          resourceType: uploadResult.resourceType || "image",
          isMain: false,
          caption: caption.trim() || file.name.replace(/\.[^/.]+$/, ""),
          status: "PENDING",
          isVisible: false,
          displayOrder: 0,
        });

        uploadedImages.push(imageDoc);
      } catch (err: any) {
        console.error("Upload/Save error for file:", file.name, err);
        // Clean up orphaned Cloudinary asset if created but DB failed
        if (uploadResult?.publicId) {
          try {
            await deletePropertyImage(uploadResult.publicId);
          } catch (cleanupErr) {
            console.error("Failed to clean up orphaned Cloudinary asset:", cleanupErr);
          }
        }

        uploadErrors.push({
          fileName: file.name,
          error: err.message || "Failed to process and save image.",
        });
      }
    }

    if (uploadedImages.length === 0 && uploadErrors.length > 0) {
      const isOversized = uploadErrors.some((e) => e.error.includes("maximum allowed size"));
      return NextResponse.json(
        {
          success: false,
          message: "All image uploads failed validation or processing.",
          errors: uploadErrors,
        },
        { status: isOversized ? 413 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully uploaded ${uploadedImages.length} image(s). Uploads are pending admin approval.`,
        count: uploadedImages.length,
        images: uploadedImages,
        errors: uploadErrors.length > 0 ? uploadErrors : undefined,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Property images upload handler error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}

// GET /api/property-images (List user's property images or property-specific images)
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");
    const status = searchParams.get("status");

    const query: any = {};

    if (propertyId) {
      if (!mongoose.Types.ObjectId.isValid(propertyId)) {
        return NextResponse.json(
          { success: false, message: "Invalid property ID" },
          { status: 400 }
        );
      }

      const property = await Property.findById(propertyId);
      if (!property) {
        return NextResponse.json(
          { success: false, message: "Property not found" },
          { status: 404 }
        );
      }

      // Security: Non-admin users can ONLY view images of properties they own
      if (property.ownerId.toString() !== authUser.userId && authUser.role !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "Forbidden: You cannot view private images of another user's property" },
          { status: 403 }
        );
      }

      query.propertyId = propertyId;
    } else {
      // Non-admin can only see their own images
      if (authUser.role !== "ADMIN") {
        query.ownerId = authUser.userId;
      }
    }

    if (status && status !== "ALL") {
      query.status = status.toUpperCase();
    }

    const images = await PropertyImage.find(query)
      .populate("propertyId", "title price location")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error: any) {
    console.error("Fetch property images error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch property images" },
      { status: 500 }
    );
  }
}
