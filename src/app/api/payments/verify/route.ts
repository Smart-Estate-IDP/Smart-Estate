import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import VerificationRequest from "@/models/VerificationRequest";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { paymentId, transactionId, paymentSignature } = body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ success: false, message: "Payment record not found" }, { status: 404 });
    }

    payment.status = "SUCCESS";
    if (paymentSignature) payment.paymentSignature = paymentSignature;
    await payment.save();

    // Link payment to verification request and update request status to ACCEPTED
    if (payment.verificationRequestId) {
      await VerificationRequest.findByIdAndUpdate(payment.verificationRequestId, {
        paymentId: payment._id,
        status: "ACCEPTED",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to verify payment" },
      { status: 500 }
    );
  }
}
