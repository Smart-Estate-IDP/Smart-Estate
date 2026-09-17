import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET() {
  try {
    await connectDB();

    // Fetch published featured properties
    const featuredProperties = await Property.find({
      status: "PUBLISHED",
      isFeatured: true,
    })
      .populate("ownerId", "name email phone avatar")
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      count: featuredProperties.length,
      properties: featuredProperties,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch featured properties" },
      { status: 500 }
    );
  }
}
