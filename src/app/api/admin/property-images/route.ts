import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import PropertyImage from "@/models/PropertyImage";
import { getAuthUser } from "@/lib/auth";

// GET /api/admin/property-images (Admin browse & filter all property images)
export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin privileges required" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const isVisible = searchParams.get("isVisible");
    const propertyId = searchParams.get("propertyId");
    const ownerId = searchParams.get("ownerId");

    const query: any = {};

    if (status && status !== "ALL") {
      query.status = status.toUpperCase();
    }

    if (isVisible !== null && isVisible !== undefined && isVisible !== "ALL") {
      query.isVisible = isVisible === "true";
    }

    if (propertyId && mongoose.Types.ObjectId.isValid(propertyId)) {
      query.propertyId = propertyId;
    }

    if (ownerId && mongoose.Types.ObjectId.isValid(ownerId)) {
      query.ownerId = ownerId;
    }

    const [images, total, pendingCount, approvedCount, rejectedCount, visibleCount] =
      await Promise.all([
        PropertyImage.find(query)
          .populate("propertyId", "title price location status")
          .populate("ownerId", "name email phone avatar")
          .populate("reviewedBy", "name email")
          .sort({ createdAt: -1 }),
        PropertyImage.countDocuments(),
        PropertyImage.countDocuments({ status: "PENDING" }),
        PropertyImage.countDocuments({ status: "APPROVED" }),
        PropertyImage.countDocuments({ status: "REJECTED" }),
        PropertyImage.countDocuments({ isVisible: true }),
      ]);

    return NextResponse.json({
      success: true,
      count: images.length,
      stats: {
        total,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        visible: visibleCount,
      },
      images,
    });
  } catch (error: any) {
    console.error("Admin fetch property images error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch images for admin" },
      { status: 500 }
    );
  }
}
