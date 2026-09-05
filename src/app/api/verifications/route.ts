import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import VerificationRequest from "@/models/VerificationRequest";
import LawyerProfile from "@/models/LawyerProfile";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const filter: any = {};

    if (authUser.role === "USER") {
      filter.userId = authUser.userId;
    } else if (authUser.role === "LAWYER") {
      filter.lawyerId = authUser.userId;
    }
    // ADMIN sees all requests

    const requests = await VerificationRequest.find(filter)
      .populate("userId", "name email phone avatar")
      .populate("lawyerId", "name email phone avatar")
      .populate("propertyId", "title location price")
      .populate("documents")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: requests.length, requests });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch verification requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { propertyId, lawyerId, documents } = body;

    if (!propertyId || !lawyerId) {
      return NextResponse.json(
        { success: false, message: "Property ID and Lawyer ID are required" },
        { status: 400 }
      );
    }

    // Get Lawyer verification fee
    let lawyerProfile = await LawyerProfile.findOne({ userId: lawyerId });
    if (!lawyerProfile) {
      lawyerProfile = await LawyerProfile.findById(lawyerId);
    }

    const fee = lawyerProfile ? lawyerProfile.verificationFee : 1000;

    const verificationReq = await VerificationRequest.create({
      propertyId,
      userId: authUser.userId,
      lawyerId: lawyerProfile ? lawyerProfile.userId : lawyerId,
      documents: documents || [],
      amount: fee,
      status: "PENDING",
      remarks: [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Verification request created successfully",
        request: verificationReq,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create verification request" },
      { status: 500 }
    );
  }
}
