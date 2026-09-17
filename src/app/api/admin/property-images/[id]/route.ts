import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import PropertyImage from "@/models/PropertyImage";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/auth";

// PATCH /api/admin/property-images/[id] (Admin approve, reject, toggle visibility, set main)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: "Invalid image ID" }, { status: 400 });
    }

    await connectDB();
    const image = await PropertyImage.findById(id);
    if (!image) {
      return NextResponse.json({ success: false, message: "Image not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, isVisible, isMain, displayOrder, rejectionReason, caption } = body;

    // 1. Handle Status Change (PENDING, APPROVED, REJECTED)
    if (status !== undefined) {
      if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status. Must be PENDING, APPROVED, or REJECTED." },
          { status: 400 }
        );
      }

      image.status = status;
      image.reviewedBy = new mongoose.Types.ObjectId(authUser.userId);
      image.reviewedAt = new Date();

      if (status === "REJECTED") {
        image.rejectionReason = rejectionReason || "Image does not meet platform visual standards.";
        // A rejected image cannot be visible or main
        image.isVisible = false;
        image.isMain = false;
      } else if (status === "APPROVED") {
        image.rejectionReason = undefined;
      } else if (status === "PENDING") {
        image.isVisible = false;
        image.isMain = false;
      }
    }

    // 2. Handle Visibility Toggle
    if (isVisible !== undefined) {
      const wantVisible = Boolean(isVisible);
      if (wantVisible) {
        // Non-negotiable rule: Only APPROVED images can be made visible
        if (image.status !== "APPROVED") {
          return NextResponse.json(
            {
              success: false,
              message: "Cannot make image visible before it is approved by an admin.",
            },
            { status: 400 }
          );
        }
        image.isVisible = true;
      } else {
        image.isVisible = false;
        if (image.isMain) {
          image.isMain = false;
        }
      }
    }

    // 3. Handle Main Image Designation
    if (isMain !== undefined) {
      const wantMain = Boolean(isMain);
      if (wantMain) {
        if (image.status !== "APPROVED") {
          return NextResponse.json(
            {
              success: false,
              message: "Cannot designate an unapproved image as the main featured image.",
            },
            { status: 400 }
          );
        }

        if (!image.isVisible) {
          image.isVisible = true;
        }

        image.isMain = true;

        // Atomically unset isMain on all other images for this property
        await PropertyImage.updateMany(
          { propertyId: image.propertyId, _id: { $ne: image._id } },
          { $set: { isMain: false } }
        );

        // Synchronize with Property model for backward compatibility
        const property = await Property.findById(image.propertyId);
        if (property) {
          const currentImages = property.images ? [...property.images] : [];
          const filtered = currentImages.filter((u) => u !== image.url);
          property.images = [image.url, ...filtered];
          await property.save();
        }
      } else {
        image.isMain = false;
      }
    }

    // 4. Handle Display Order
    if (displayOrder !== undefined) {
      image.displayOrder = Number(displayOrder) || 0;
    }

    // 5. Caption
    if (caption !== undefined) {
      image.caption = String(caption).trim();
    }

    await image.save();

    const populated = await PropertyImage.findById(id)
      .populate("propertyId", "title price location")
      .populate("ownerId", "name email")
      .populate("reviewedBy", "name email");

    return NextResponse.json({
      success: true,
      message: "Property image updated successfully by admin",
      image: populated,
    });
  } catch (error: any) {
    console.error("Admin update property image error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update property image" },
      { status: 500 }
    );
  }
}
