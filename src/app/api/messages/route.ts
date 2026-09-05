import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("otherUserId");
    const verificationRequestId = searchParams.get("verificationRequestId");

    const filter: any = {};
    if (verificationRequestId) {
      filter.verificationRequestId = verificationRequestId;
    } else if (otherUserId) {
      filter.$or = [
        { senderId: authUser.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: authUser.userId },
      ];
    } else {
      filter.$or = [{ senderId: authUser.userId }, { receiverId: authUser.userId }];
    }

    const messages = await Message.find(filter)
      .populate("senderId", "name email avatar role")
      .populate("receiverId", "name email avatar role")
      .sort({ createdAt: 1 });

    return NextResponse.json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch messages" },
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
    const { receiverId, verificationRequestId, propertyId, content, attachments } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { success: false, message: "Receiver ID and message content are required" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      senderId: authUser.userId,
      receiverId,
      verificationRequestId,
      propertyId,
      content,
      attachments: attachments || [],
      read: false,
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to send message" },
      { status: 500 }
    );
  }
}
