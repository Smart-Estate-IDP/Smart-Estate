import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/auth";

// GET /api/properties/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const property = await Property.findById(id).populate("ownerId", "name email phone avatar");
    if (!property) {
      return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, property });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch property details" },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
    }

    if (property.ownerId.toString() !== authUser.userId && authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Not property owner" }, { status: 403 });
    }

    const updates = await req.json();
    const updatedProperty = await Property.findByIdAndUpdate(id, updates, { new: true });

    return NextResponse.json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ success: false, message: "Property not found" }, { status: 404 });
    }

    if (property.ownerId.toString() !== authUser.userId && authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Not property owner" }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to delete property" },
      { status: 500 }
    );
  }
}
