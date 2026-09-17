import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyImage from "@/models/PropertyImage";

// GET /api/properties/[id]/images (Public gallery: ONLY Approved and Visible images)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid property ID" },
        { status: 400 }
      );
    }

    await connectDB();
    const property = await Property.findById(id).select("_id title status");
    if (!property) {
      return NextResponse.json(
        { success: false, message: "Property not found" },
        { status: 404 }
      );
    }

    // Strictly enforce: Only APPROVED and VISIBLE images can ever be shown in the public gallery
    const images = await PropertyImage.find({
      propertyId: property._id,
      status: "APPROVED",
      isVisible: true,
    })
      .select("url isMain caption displayOrder createdAt")
      .sort({ isMain: -1, displayOrder: 1, createdAt: 1 });

    return NextResponse.json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error: any) {
    console.error("Fetch public property images error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to load property gallery" },
      { status: 500 }
    );
  }
}
