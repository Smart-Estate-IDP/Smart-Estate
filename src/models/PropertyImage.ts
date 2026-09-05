import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPropertyImage extends Document {
  propertyId: mongoose.Types.ObjectId;
  url: string;
  publicId?: string; // Cloudinary / storage ID
  isMain: boolean;
  caption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PropertyImageSchema = new Schema<IPropertyImage>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    url: { type: String, required: true },
    publicId: { type: String },
    isMain: { type: Boolean, default: false },
    caption: { type: String },
  },
  { timestamps: true }
);

PropertyImageSchema.index({ propertyId: 1 });

const PropertyImage: Model<IPropertyImage> =
  mongoose.models.PropertyImage || mongoose.model<IPropertyImage>("PropertyImage", PropertyImageSchema);

export default PropertyImage;
