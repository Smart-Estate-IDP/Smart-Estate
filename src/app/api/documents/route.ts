import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const propertyId = searchParams.get("propertyId");

    const filter: any = {};
    if (propertyId) {
      filter.propertyId = propertyId;
    } else if (authUser.role === "USER") {
      filter.uploaderId = authUser.userId;
    }

    const documents = await Document.find(filter)
      .populate("uploaderId", "name email")
      .populate("propertyId", "title location")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: documents.length, documents });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch documents" },
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
    const { propertyId, title, documentType, fileUrl, fileType, fileSize } = body;

    if (!propertyId || !title || !documentType || !fileUrl) {
      return NextResponse.json(
        { success: false, message: "Missing required document fields" },
        { status: 400 }
      );
    }

    const document = await Document.create({
      propertyId,
      uploaderId: authUser.userId,
      title,
      documentType: documentType.toUpperCase(),
      fileUrl,
      fileType: fileType || "pdf",
      fileSize,
      status: "PENDING",
    });

    return NextResponse.json(
      { success: true, message: "Document uploaded successfully", document },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload document" },
      { status: 500 }
    );
  }
}
