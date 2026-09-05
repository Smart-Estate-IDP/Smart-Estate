import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VerificationRequest from "@/models/VerificationRequest";
import Property from "@/models/Property";
import LawyerProfile from "@/models/LawyerProfile";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const verification = await VerificationRequest.findById(id)
      .populate("userId", "name email phone avatar")
      .populate("lawyerId", "name email phone avatar")
      .populate("propertyId")
      .populate("documents");

    if (!verification) {
      return NextResponse.json({ success: false, message: "Verification request not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, verification });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch verification request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { status, remark } = body;

    const verification = await VerificationRequest.findById(id);
    if (!verification) {
      return NextResponse.json({ success: false, message: "Verification request not found" }, { status: 404 });
    }

    // Only lawyer assigned, user (re-submitting), or admin can update
    const isLawyer = verification.lawyerId.toString() === authUser.userId;
    const isOwner = verification.userId.toString() === authUser.userId;
    const isAdmin = authUser.role === "ADMIN";

    if (!isLawyer && !isOwner && !isAdmin) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    if (status) {
      verification.status = status;
    }

    if (remark) {
      verification.remarks.push({
        authorId: authUser.userId as any,
        comment: remark,
        createdAt: new Date(),
      });
    }

    await verification.save();

    // If verified or rejected, update property verificationStatus
    if (status === "VERIFIED" || status === "REJECTED") {
      await Property.findByIdAndUpdate(verification.propertyId, {
        verificationStatus: status,
      });

      if (status === "VERIFIED") {
        await LawyerProfile.findOneAndUpdate(
          { userId: verification.lawyerId },
          { $inc: { verifiedCount: 1 } }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Verification request status updated",
      verification,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to update verification request" },
      { status: 500 }
    );
  }
}
