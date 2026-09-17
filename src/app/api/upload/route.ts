import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ success: false, message: "Unauthorized: Please log in to upload photos" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("file") as (File | string)[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: "No image file provided" }, { status: 400 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "private_AnweIVgP43lYEPvg5lYUQ2M47Uk=";
    const auth = Buffer.from(privateKey + ":").toString("base64");

    const uploadedResults: Array<{ url: string; fileId: string; name: string; thumbnailUrl?: string }> = [];

    for (const item of files) {
      let base64Data: string;
      let fileName: string;

      if (typeof item === "string") {
        // Base64 string directly
        base64Data = item;
        fileName = `property_${Date.now()}.jpg`;
      } else {
        const bytes = await item.arrayBuffer();
        const buffer = Buffer.from(bytes);
        base64Data = `data:${item.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
        fileName = item.name || `property_${Date.now()}.jpg`;
      }

      const ikFormData = new FormData();
      ikFormData.append("file", base64Data);
      ikFormData.append("fileName", fileName);
      ikFormData.append("folder", "/properties");

      const ikRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        headers: {
          Authorization: "Basic " + auth,
        },
        body: ikFormData,
      });

      const ikData = await ikRes.json();
      if (!ikRes.ok) {
        console.error("ImageKit upload error for file:", fileName, ikData);
        return NextResponse.json(
          { success: false, message: ikData.message || "ImageKit upload failed" },
          { status: ikRes.status || 500 }
        );
      }

      uploadedResults.push({
        url: ikData.url,
        fileId: ikData.fileId,
        name: ikData.name,
        thumbnailUrl: ikData.thumbnailUrl || ikData.url,
      });
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedResults.length} image(s) uploaded successfully`,
      images: uploadedResults,
      url: uploadedResults[0]?.url,
    });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
