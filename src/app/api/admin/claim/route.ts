import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser, signToken } from "@/lib/auth";
import { getAdminSecretKey } from "@/lib/adminKey";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { secretKey } = body;

    const validSecret = await getAdminSecretKey();

    if (!secretKey || secretKey.trim() !== validSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid administrator secret key. Access denied.",
        },
        { status: 403 }
      );
    }

    // Promote the current user to ADMIN
    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { role: "ADMIN" },
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Issue updated token with role: ADMIN
    const newToken = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: "ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      message: "Account successfully granted Administrator privileges",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "ADMIN",
      },
      token: newToken,
    });

    // Clear any legacy cookie so browser tabs do not share sessions via shared cookies
    response.cookies.set("token", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to promote user" },
      { status: 500 }
    );
  }
}
