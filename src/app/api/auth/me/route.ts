import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import LawyerProfile from "@/models/LawyerProfile";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(authUser.userId).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    let lawyerProfile = null;
    if (user.role === "LAWYER") {
      lawyerProfile = await LawyerProfile.findOne({ userId: user._id });
    }

    return NextResponse.json({
      success: true,
      user,
      lawyerProfile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch user session" },
      { status: 500 }
    );
  }
}
