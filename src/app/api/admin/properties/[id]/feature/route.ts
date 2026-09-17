import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { isFeatured } = body;

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
    }

    // Toggle if not explicitly specified
    property.isFeatured = typeof isFeatured === "boolean" ? isFeatured : !property.isFeatured;
    await property.save();

    return NextResponse.json({
      success: true,
      message: `Property ${property.isFeatured ? "added to" : "removed from"} Landing & Loading showcase`,
      property,
      isFeatured: property.isFeatured,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update property showcase status" },
      { status: 500 }
    );
  }
}
