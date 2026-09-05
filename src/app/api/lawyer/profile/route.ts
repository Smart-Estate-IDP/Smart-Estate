import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import LawyerProfile from "@/models/LawyerProfile";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "LAWYER" && authUser.role !== "ADMIN")) {
      return NextResponse.json({ success: false, message: "Forbidden: Lawyer access required" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { verificationFee, experienceYears, bio, specialization, credentials } = body;

    let lawyer = await LawyerProfile.findOne({ userId: authUser.userId });
    if (!lawyer) {
      return NextResponse.json({ success: false, message: "Lawyer profile not found" }, { status: 404 });
    }

    if (verificationFee !== undefined) lawyer.verificationFee = Number(verificationFee);
    if (experienceYears !== undefined) lawyer.experienceYears = Number(experienceYears);
    if (bio !== undefined) lawyer.bio = bio;
    if (specialization !== undefined) lawyer.specialization = specialization;
    if (credentials !== undefined) lawyer.credentials = credentials;

    await lawyer.save();

    return NextResponse.json({
      success: true,
      message: "Lawyer profile updated successfully",
      lawyer,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update lawyer profile" },
      { status: 500 }
    );
  }
}
