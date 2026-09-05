import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LawyerProfile from "@/models/LawyerProfile";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const verifiedOnly = searchParams.get("verified") !== "false";

    const filter: any = {};
    if (verifiedOnly) {
      filter.verified = true;
    }

    const lawyers = await LawyerProfile.find(filter)
      .populate("userId", "name email phone avatar")
      .sort({ rating: -1, verificationFee: 1 });

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
