import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import PropertyImage from "@/models/PropertyImage";
import { getAuthUser } from "@/lib/auth";
import { deletePropertyImage } from "@/lib/cloudinary";

// POST /api/admin/property-images/bulk
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser || authUser.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();
    const { imageIds, action, rejectionReason } = body;

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "imageIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const validIds = imageIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid image IDs provided" },
        { status: 400 }
      );
    }

    let modifiedCount = 0;

    switch (action) {
      case "APPROVE": {
        const res = await PropertyImage.updateMany(
          { _id: { $in: validIds } },
          {
            $set: {
              status: "APPROVED",
              reviewedBy: authUser.userId,
              reviewedAt: new Date(),
            },
            $unset: { rejectionReason: 1 },
          }
        );
        modifiedCount = res.modifiedCount;
        break;
      }

      case "APPROVE_AND_SHOW": {
        const res = await PropertyImage.updateMany(
          { _id: { $in: validIds } },
          {
            $set: {
              status: "APPROVED",
              isVisible: true,
              reviewedBy: authUser.userId,
              reviewedAt: new Date(),
            },
            $unset: { rejectionReason: 1 },
          }
        );
        modifiedCount = res.modifiedCount;
        break;
      }

      case "REJECT": {
        const reason = rejectionReason || "Does not meet quality or compliance standards.";
        const res = await PropertyImage.updateMany(
          { _id: { $in: validIds } },
          {
            $set: {
              status: "REJECTED",
              isVisible: false,
              isMain: false,
              rejectionReason: reason,
              reviewedBy: authUser.userId,
              reviewedAt: new Date(),
            },
          }
        );
        modifiedCount = res.modifiedCount;
        break;
      }

      case "MAKE_VISIBLE": {
        const res = await PropertyImage.updateMany(
          { _id: { $in: validIds }, status: "APPROVED" },
          { $set: { isVisible: true } }
        );
        modifiedCount = res.modifiedCount;
        break;
      }

      case "HIDE": {
        const res = await PropertyImage.updateMany(
          { _id: { $in: validIds } },
          { $set: { isVisible: false, isMain: false } }
        );
        modifiedCount = res.modifiedCount;
        break;
      }

      case "DELETE": {
        const imagesToDelete = await PropertyImage.find({ _id: { $in: validIds } });
        for (const img of imagesToDelete) {
          if (img.publicId) {
            await deletePropertyImage(img.publicId);
          }
        }
        const delRes = await PropertyImage.deleteMany({ _id: { $in: validIds } });
        modifiedCount = delRes.deletedCount || 0;
        break;
      }

      default:
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid action. Supported: APPROVE, APPROVE_AND_SHOW, REJECT, MAKE_VISIBLE, HIDE, DELETE",
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${action} executed successfully. ${modifiedCount} images updated.`,
      modifiedCount,
    });
  } catch (error: any) {
    console.error("Bulk image operation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Bulk operation failed" },
      { status: 500 }
    );
  }
}
