import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Cloudinary configuration status
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

// Ensure Cloudinary is initialized
function initCloudinary() {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  resourceType: string;
  bytes: number;
  width?: number;
  height?: number;
}

/**
 * Upload a property image buffer to Cloudinary in a property-specific folder:
 * ${folder}/properties/${propertyId}/
 */
export async function uploadPropertyImageBuffer(
  buffer: Buffer,
  propertyId: string,
  fileName?: string
): Promise<UploadResult> {
  initCloudinary();

  const baseFolder = process.env.CLOUDINARY_FOLDER || "smartestate/properties";
  // Sanitize propertyId for folder name
  const sanitizedPropertyId = propertyId.replace(/[^a-zA-Z0-9_-]/g, "");
  const folder = `${baseFolder}/${sanitizedPropertyId}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(
            new Error(error?.message || "Cloudinary image upload failed.")
          );
        }

        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an image asset from Cloudinary by its publicId
 */
export async function deletePropertyImage(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  
  if (!isCloudinaryConfigured()) {
    console.warn("Cloudinary not configured; skipping remote asset deletion for:", publicId);
    return false;
  }

  try {
    initCloudinary();
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
    return result.result === "ok";
  } catch (error) {
    console.error("Failed to delete Cloudinary asset:", publicId, error);
    return false;
  }
}

export default cloudinary;
