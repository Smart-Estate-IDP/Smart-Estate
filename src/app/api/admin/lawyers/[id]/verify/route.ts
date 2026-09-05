import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LawyerProfile from "@/models/LawyerProfile";
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
    const { verified } = body;

    let lawyer = await LawyerProfile.findById(id);
    if (!lawyer) {
      lawyer = await LawyerProfile.findOne({ userId: id });
    }

    if (!lawyer) {
      return NextResponse.json({ success: false, message: "Lawyer profile not found" }, { status: 404 });
    }

    lawyer.verified = Boolean(verified);
    await lawyer.save();

    return NextResponse.json({
      success: true,
      message: `Lawyer verification status updated to ${lawyer.verified}`,
      lawyer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update lawyer status" },
      { status: 500 }
    );
  }
}
