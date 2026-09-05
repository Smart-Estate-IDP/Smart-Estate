import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VerificationReport from "@/models/VerificationReport";
import VerificationRequest from "@/models/VerificationRequest";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const report = await VerificationReport.findOne({ verificationRequestId: id })
      .populate("lawyerId", "name email phone")
      .populate("userId", "name email")
      .populate("propertyId", "title location");

    if (!report) {
      return NextResponse.json({ success: false, message: "Verification report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch verification report" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(req);
    if (!authUser || (authUser.role !== "LAWYER" && authUser.role !== "ADMIN")) {
      return NextResponse.json({ success: false, message: "Forbidden: Lawyer access required" }, { status: 403 });
    }

    await connectDB();
    const body = await req.json();
    const { status, summary, findings, limitations, reportFileUrl } = body;

    const verificationReq = await VerificationRequest.findById(id);
    if (!verificationReq) {
      return NextResponse.json({ success: false, message: "Verification request not found" }, { status: 404 });
    }

    const report = await VerificationReport.create({
      verificationRequestId: id,
      propertyId: verificationReq.propertyId,
      lawyerId: authUser.userId,
      userId: verificationReq.userId,
      status: status || "APPROVED",
      summary,
      findings: findings || [],
      limitations: limitations || "Report provided based on reviewed documents provided by user.",
      reportFileUrl,
      issuedAt: new Date(),
    });

    // Update request status to VERIFIED or REJECTED
    verificationReq.status = status === "APPROVED" ? "VERIFIED" : "REJECTED";
    await verificationReq.save();

    return NextResponse.json(
      { success: true, message: "Verification report generated successfully", report },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to generate verification report" },
      { status: 500 }
    );
  }
}
