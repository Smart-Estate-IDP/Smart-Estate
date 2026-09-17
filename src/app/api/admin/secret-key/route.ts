import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getAdminSecretKey, setAdminSecretKey } from "@/lib/adminKey";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const secretKey = await getAdminSecretKey();
    return NextResponse.json({
      success: true,
      secretKey,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to retrieve admin key",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { secretKey } = body;

    if (!secretKey || secretKey.trim().length < 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Secret key must be at least 4 characters long",
        },
        { status: 400 }
      );
    }

    const updatedKey = await setAdminSecretKey(secretKey.trim());

    return NextResponse.json({
      success: true,
      message: "Admin secret key updated successfully",
      secretKey: updatedKey,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update admin key",
      },
      { status: 500 }
    );
  }
}
