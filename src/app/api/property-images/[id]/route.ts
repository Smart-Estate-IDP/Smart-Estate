import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import PropertyImage from "@/models/PropertyImage";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/auth";
import { deletePropertyImage } from "@/lib/cloudinary";

// GET /api/property-images/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid image ID" }, { status: 400 });
    }

    await connectDB();
    const image = await PropertyImage.findById(id)
      .populate("propertyId", "title price location")
      .populate("ownerId", "name email avatar");

    if (!image) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    // Security: Only owner or admin can view private image
    if (image.ownerId._id.toString() !== authUser.userId && authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Not permitted to access this image" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, image });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch image" },
      { status: 500 }
    );
  }
}

// PATCH /api/property-images/[id] (Owner updates image caption only)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid image ID" }, { status: 400 });
    }

    await connectDB();
    const image = await PropertyImage.findById(id);
    if (!image) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    // Ownership check: must be owner or admin
    if (image.ownerId.toString() !== authUser.userId && authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: You do not own this image" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Security rule: Regular users CANNOT modify approval status, visibility, isMain, or reviewer
    if (
      authUser.role !== "ADMIN" &&
      (body.status !== undefined ||
        body.isVisible !== undefined ||
        body.isMain !== undefined ||
        body.reviewedBy !== undefined ||
        body.reviewedAt !== undefined)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden: Users cannot alter moderation status, visibility, or featured state",
        },
        { status: 403 }
      );
    }

    // Only allow updating caption on this endpoint
    if (body.caption !== undefined) {
      image.caption = String(body.caption).trim();
    }

    await image.save();

    return NextResponse.json({
      success: true,
      message: "Image details updated successfully",
      image,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE /api/property-images/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid image ID" }, { status: 400 });
    }

    await connectDB();
    const image = await PropertyImage.findById(id);
    if (!image) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    // Ownership check
    if (image.ownerId.toString() !== authUser.userId && authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: You can only delete your own images" },
        { status: 403 }
      );
    }

    const wasMain = image.isMain;
    const propertyId = image.propertyId;
    const publicId = image.publicId;

    // Delete record from database
    await PropertyImage.findByIdAndDelete(id);

    // Delete asset from Cloudinary
    if (publicId) {
      await deletePropertyImage(publicId);
    }

    // If deleted image was the main/featured image, handle fallback or sync
    if (wasMain) {
      // Find another approved & visible image to designate as main, if one exists
      const nextCandidate = await PropertyImage.findOne({
        propertyId,
        status: "APPROVED",
        isVisible: true,
      }).sort({ displayOrder: 1, createdAt: 1 });

      if (nextCandidate) {
        nextCandidate.isMain = true;
        await nextCandidate.save();

        // Sync with Property model images array
        await Property.findByIdAndUpdate(propertyId, {
          images: [nextCandidate.url],
        });
      } else {
        // Clear property images array fallback
        await Property.findByIdAndUpdate(propertyId, {
          images: [],
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Property image deleted successfully from storage and database",
    });
  } catch (error: any) {
    console.error("Delete property image error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete property image" },
      { status: 500 }
    );
  }
}
