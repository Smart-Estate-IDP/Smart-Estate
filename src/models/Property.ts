import mongoose, { Schema, Document, Model } from "mongoose";

export type PropertyStatus = "PENDING_APPROVAL" | "PUBLISHED" | "SOLD" | "REJECTED";
export type VerificationStatus = "UNVERIFIED" | "IN_PROGRESS" | "VERIFIED" | "REJECTED";
export type PropertyType = "APARTMENT" | "HOUSE" | "VILLA" | "PLOT" | "COMMERCIAL" | "OTHER";

export interface IProperty extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: PropertyType;
  area: number; // in sq. ft.
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  status: PropertyStatus;
  verificationStatus: VerificationStatus;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    propertyType: {
      type: String,
      enum: ["APARTMENT", "HOUSE", "VILLA", "PLOT", "COMMERCIAL", "OTHER"],
      required: true,
    },
    area: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    amenities: [{ type: String }],
    status: {
      type: String,
      enum: ["PENDING_APPROVAL", "PUBLISHED", "SOLD", "REJECTED"],
      default: "PENDING_APPROVAL",
    },
    verificationStatus: {
      type: String,
      enum: ["UNVERIFIED", "IN_PROGRESS", "VERIFIED", "REJECTED"],
      default: "UNVERIFIED",
    },
    images: [{ type: String }],
  },
  { timestamps: true }
);

PropertySchema.index({ "location.city": 1, propertyType: 1, price: 1 });
PropertySchema.index({ title: "text", description: "text" });

const Property: Model<IProperty> =
  mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);

export default Property;
