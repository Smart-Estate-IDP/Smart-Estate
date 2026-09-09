import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter: any = {};
    if (status && status !== "ALL") {
      filter.status = status;
    }

    const properties = await Property.find(filter)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
