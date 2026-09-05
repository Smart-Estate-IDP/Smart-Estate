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
    const body = await req.json();
    const { status } = body; // 'PUBLISHED' | 'REJECTED' | 'PENDING_APPROVAL'

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
    }

    property.status = status || "PUBLISHED";
    await property.save();

    return NextResponse.json({
      success: true,
      message: `Property status updated to ${property.status}`,
      property,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update property status" },
      { status: 500 }
    );
  }
}
