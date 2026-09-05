import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const filter: any = {
      $or: [{ userId: authUser.userId }, { lawyerId: authUser.userId }, { sellerId: authUser.userId }],
    };

    const appointments = await Appointment.find(filter)
      .populate("userId", "name email phone")
      .populate("lawyerId", "name email phone")
      .populate("sellerId", "name email phone")
      .populate("propertyId", "title location")
      .sort({ date: 1 });

    return NextResponse.json({ success: true, count: appointments.length, appointments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch appointments" },
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
    const { propertyId, lawyerId, sellerId, type, date, notes } = body;

    if (!type || !date) {
      return NextResponse.json(
        { success: false, message: "Appointment type and date are required" },
        { status: 400 }
      );
    }

    const appointment = await Appointment.create({
      userId: authUser.userId,
      propertyId,
      lawyerId,
      sellerId,
      type: type.toUpperCase(),
      date: new Date(date),
      notes,
      status: "PENDING",
    });

    return NextResponse.json(
      { success: true, message: "Appointment scheduled successfully", appointment },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to schedule appointment" },
      { status: 500 }
    );
  }
}
