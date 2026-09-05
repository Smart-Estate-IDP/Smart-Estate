import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILawyerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  licenseNumber: string;
  specialization: string[];
  experienceYears: number;
  credentials: string[]; // URLs to certificates / Bar ID documents
  bio?: string;
  verificationFee: number;
  rating: number;
  reviewCount: number;
  verifiedCount: number;
  verified: boolean; // Verified by Admin
  createdAt: Date;
  updatedAt: Date;
}

const LawyerProfileSchema = new Schema<ILawyerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    specialization: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    credentials: [{ type: String }],
    bio: { type: String },
    verificationFee: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    verifiedCount: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LawyerProfileSchema.index({ rating: -1, verificationFee: 1 });

const LawyerProfile: Model<ILawyerProfile> =
  mongoose.models.LawyerProfile || mongoose.model<ILawyerProfile>("LawyerProfile", LawyerProfileSchema);

export default LawyerProfile;
