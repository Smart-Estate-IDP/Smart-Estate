import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LawyerProfile from "@/models/LawyerProfile";
import User from "@/models/User";
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
    const verified = searchParams.get("verified");

    const filter: any = {};
    if (verified === "true") filter.verified = true;
    if (verified === "false") filter.verified = false;

    const lawyers = await LawyerProfile.find(filter)
      .populate("userId", "name email phone role avatar createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: lawyers.length,
      lawyers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch lawyers" },
      { status: 500 }
    );
  }
}
