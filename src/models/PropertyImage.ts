import mongoose, { Schema, Document, Model } from "mongoose";

export type ImageStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IPropertyImage extends Document {
  propertyId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  url: string;
  publicId: string; // Cloudinary storage ID
  resourceType: string;
  isMain: boolean;
  caption?: string;
  status: ImageStatus;
  isVisible: boolean;
  displayOrder: number;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyImageSchema = new Schema<IPropertyImage>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, default: "image" },
    isMain: { type: Boolean, default: false },
    caption: { type: String, trim: true },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    isVisible: { type: Boolean, default: false, required: true },
    displayOrder: { type: Number, default: 0 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
  },
  { timestamps: true }
);

// Indexes for high performance querying & deterministic ordering
PropertyImageSchema.index({ propertyId: 1, isVisible: 1, displayOrder: 1 });
PropertyImageSchema.index({ propertyId: 1, status: 1 });
PropertyImageSchema.index({ propertyId: 1, isMain: 1 });
PropertyImageSchema.index({ ownerId: 1, createdAt: -1 });

const PropertyImage: Model<IPropertyImage> =
  mongoose.models.PropertyImage ||
  mongoose.model<IPropertyImage>("PropertyImage", PropertyImageSchema);

export default PropertyImage;
