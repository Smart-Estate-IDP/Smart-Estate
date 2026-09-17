import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Property from "@/models/Property";
import LawyerProfile from "@/models/LawyerProfile";
import VerificationRequest from "@/models/VerificationRequest";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();

    const [totalUsers, totalAdmins, totalLawyers, verifiedLawyers, totalProperties, publishedProperties, verificationRequests] =
      await Promise.all([
        User.countDocuments({ role: "USER" }),
        User.countDocuments({ role: "ADMIN" }),
        LawyerProfile.countDocuments(),
        LawyerProfile.countDocuments({ verified: true }),
        Property.countDocuments(),
        Property.countDocuments({ status: "PUBLISHED" }),
        VerificationRequest.countDocuments(),
      ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalLawyers,
        verifiedLawyers,
        totalProperties,
        publishedProperties,
        verificationRequests,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
