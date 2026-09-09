import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const filter: any = {};
    if (role) {
      filter.role = role.toUpperCase();
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { userId, email, role = "ADMIN" } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, message: "User ID or Email is required" },
        { status: 400 }
      );
    }

    let targetUser = null;
    if (userId) {
      targetUser = await User.findById(userId);
    } else if (email) {
      targetUser = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: `No user account found with ${email ? `email "${email}"` : `ID "${userId}"`}. Make sure the user has registered first.` },
        { status: 404 }
      );
    }

    // Direct promotion to ADMIN is prohibited; users must provide the secret key
    if (role.toUpperCase() === "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Users cannot be directly promoted to Admin. The user must provide the Admin Secret Key at /admin to unlock admin access.",
        },
        { status: 400 }
      );
    }

    // Safety check: prevent an admin from removing their own admin access
    if (targetUser._id.toString() === authUser.userId && role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "You cannot revoke Administrator privileges from your own active account" },
        { status: 400 }
      );
    }

    targetUser.role = role.toUpperCase() as "USER" | "LAWYER";
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: `Account ${targetUser.email} has been updated to ${targetUser.role}`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update user role" },
      { status: 500 }
    );
  }
}
