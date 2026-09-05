import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LawyerProfile from "@/models/LawyerProfile";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    let lawyer = await LawyerProfile.findById(id).populate("userId", "name email phone avatar");
    if (!lawyer) {
      lawyer = await LawyerProfile.findOne({ userId: id }).populate("userId", "name email phone avatar");
    }

    if (!lawyer) {
      return NextResponse.json({ success: false, message: "Lawyer profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lawyer });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch lawyer profile" },
      { status: 500 }
    );
  }
}
