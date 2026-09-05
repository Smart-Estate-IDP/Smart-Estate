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
    const { verificationRequestId, amount, gateway = "RAZORPAY" } = body;

    if (!verificationRequestId || !amount) {
      return NextResponse.json(
        { success: false, message: "Verification Request ID and amount are required" },
        { status: 400 }
      );
    }

    // Mock transaction/order creation (for Razorpay or Stripe integration)
    const mockTransactionId = "TXN_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    const mockOrderId = "ORD_" + Date.now();

    const payment = await Payment.create({
      userId: authUser.userId,
      verificationRequestId,
      amount,
      currency: "INR",
      gateway: gateway.toUpperCase(),
      transactionId: mockTransactionId,
      orderId: mockOrderId,
      status: "PENDING",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment order created",
        payment,
        orderId: mockOrderId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
