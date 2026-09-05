import mongoose, { Schema, Document, Model } from "mongoose";

export type ReviewTargetType = "LAWYER" | "PROPERTY";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  targetType: ReviewTargetType;
  targetId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["LAWYER", "PROPERTY"], required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ targetType: 1, targetId: 1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
